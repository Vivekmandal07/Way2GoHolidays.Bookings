const TRIP_REQUESTS_EMAIL = 'way2goholidays.bookings@gmail.com';
const TRIP_REQUESTS_SHEET_PROPERTY = 'TRIP_REQUESTS_SHEET_ID';
const TRIP_REQUESTS_COUNTER_PROPERTY = 'TRIP_REQUESTS_LAST_NUMBER';
const TRIP_REQUESTS_HEADERS = [
  'Trip ID',
  'Submission Token',
  'Submitted At',
  'Name',
  'Phone',
  'Email',
  'Leaving From',
  'Destination',
  'Destination Cities',
  'Destination Preference',
  'Destination Options',
  'Adults',
  'Children',
  'Child Ages',
  'Travel Date',
  'Trip Type',
  'Hotel Category',
  'Duration',
  'Budget Range',
  'Booking Window',
  'Ticket Status',
  'Email Status',
];

function setupTripRequests() {
  MailApp.getRemainingDailyQuota();
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty(TRIP_REQUESTS_SHEET_PROPERTY);
  let spreadsheet;

  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    spreadsheet = SpreadsheetApp.create('Way2Go Holidays - Raised Trip Requests');
    properties.setProperty(TRIP_REQUESTS_SHEET_PROPERTY, spreadsheet.getId());
  }

  let sheet = spreadsheet.getSheetByName('Trip Requests');
  if (!sheet) sheet = spreadsheet.insertSheet('Trip Requests');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(TRIP_REQUESTS_HEADERS);
    sheet.setFrozenRows(1);
  }

  console.log(`Trip request spreadsheet: ${spreadsheet.getUrl()}`);
  return spreadsheet.getUrl();
}

function doPost(event) {
  let nonce = '';
  try {
    const payload = JSON.parse(event.parameter.payload || '{}');
    nonce = String(payload.nonce || '');
    if (!/^[a-f0-9-]{32,36}$/i.test(nonce)) {
      throw new Error('Invalid submission. Please refresh and try again.');
    }

    const request = validateTripRequest_(payload.request);
    const token = String(payload.submissionToken || '');
    if (!/^[a-f0-9-]{32,36}$/i.test(token)) {
      throw new Error('Invalid submission. Please refresh and try again.');
    }

    const saved = saveTripRequest_(request, token);
    const emailClaim = claimTripEmail_(saved.row);
    let emailSent = emailClaim === 'sent';
    if (emailClaim === 'claimed') {
      try {
        sendTripRequestEmail_(request, saved.tripId, saved.submittedAt);
        setEmailStatus_(saved.row, 'Sent');
        emailSent = true;
      } catch (error) {
        console.error(`Email notification failed for ${saved.tripId}: ${error}`);
        setEmailStatus_(saved.row, 'Failed');
      }
    }

    return responseHtml_({
      type: 'way2go-trip-request-result',
      nonce,
      ok: true,
      tripId: saved.tripId,
      submittedAt: saved.submittedAt,
      emailSent,
    });
  } catch (error) {
    console.error(`Trip request submission failed: ${error}`);
    return responseHtml_({
      type: 'way2go-trip-request-result',
      nonce,
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to save your trip request.',
    });
  }
}

function saveTripRequest_(request, token) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const spreadsheet = getTripRequestsSpreadsheet_();
    const sheet = spreadsheet.getSheetByName('Trip Requests');
    if (!sheet) throw new Error('Trip request storage is not initialized. Contact us directly.');

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const tokens = sheet.getRange(2, 2, lastRow - 1, 1).getDisplayValues();
      const existingIndex = tokens.findIndex(row => row[0] === token);
      if (existingIndex !== -1) {
        const row = existingIndex + 2;
        const values = sheet.getRange(row, 1, 1, TRIP_REQUESTS_HEADERS.length).getDisplayValues()[0];
        return {
          tripId: values[0],
          submittedAt: values[2],
          row,
        };
      }
    }

    const identity = request.phone || request.email.toLowerCase();
    const identityHash = Utilities.base64EncodeWebSafe(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, identity)
    ).slice(0, 32);
    const cache = CacheService.getScriptCache();
    const rateLimitKey = `trip-request-${identityHash}`;
    if (cache.get(rateLimitKey)) {
      throw new Error('Please wait a minute before sending another trip request.');
    }

    const properties = PropertiesService.getScriptProperties();
    const previousNumber = Number(properties.getProperty(TRIP_REQUESTS_COUNTER_PROPERTY) || 0);
    const savedIds = lastRow > 1
      ? sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues().flat()
      : [];
    const largestSavedNumber = savedIds.reduce((largest, id) => {
      const match = /^W2H(\d+)$/.exec(id);
      return match ? Math.max(largest, Number(match[1])) : largest;
    }, 0);
    const tripNumber = Math.max(previousNumber, largestSavedNumber) + 1;
    const tripId = `W2H${String(tripNumber).padStart(6, '0')}`;
    const submittedAt = new Date().toISOString();
    const row = lastRow + 1;
    const values = [
      tripId,
      token,
      submittedAt,
      request.name,
      request.phone,
      request.email,
      request.leavingFrom,
      request.destination,
      request.destinationCities.join(', '),
      request.destinationPreference,
      request.destinationOptions.join(', '),
      request.pax,
      request.children,
      request.childAges.join(', '),
      request.travelDate,
      request.tripType,
      request.hotelCategory,
      request.noOfNights,
      request.budgetRange,
      request.bookingWindow,
      request.ticketStatus,
      'Pending',
    ];
    sheet.getRange(row, 1, 1, values.length)
      .setNumberFormat('@')
      .setValues([values.map(escapeSheetCell_)]);
    properties.setProperty(TRIP_REQUESTS_COUNTER_PROPERTY, String(tripNumber));
    cache.put(rateLimitKey, '1', 60);
    return { tripId, submittedAt, row };
  } finally {
    lock.releaseLock();
  }
}

function claimTripEmail_(row) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = getTripRequestsSpreadsheet_().getSheetByName('Trip Requests');
    const emailStatus = sheet.getRange(row, TRIP_REQUESTS_HEADERS.length).getDisplayValue();
    if (emailStatus === 'Sent') return 'sent';
    const sendingTimestamp = /^Sending:(\d+)$/.exec(emailStatus);
    if (sendingTimestamp && Date.now() - Number(sendingTimestamp[1]) < 60000) return 'sending';
    sheet.getRange(row, TRIP_REQUESTS_HEADERS.length).setValue(`Sending:${Date.now()}`);
    return 'claimed';
  } finally {
    lock.releaseLock();
  }
}

function sendTripRequestEmail_(request, tripId, submittedAt) {
  const details = [
    ['Trip ID', tripId],
    ['Submitted at', submittedAt],
    ['Name', request.name],
    ['Phone', request.phone || 'Not provided'],
    ['Email', request.email || 'Not provided'],
    ['Leaving from', request.leavingFrom],
    ['Destination', request.destination],
    ['Cities / places', request.destinationCities.join(', ') || 'Not selected'],
    ['Destination preference', request.destinationPreference],
    ['Other destination options', request.destinationOptions.join(', ') || 'None'],
    ['Adults', request.pax],
    ['Children', request.children],
    ['Child ages', request.childAges.join(', ') || 'Not applicable'],
    ['Travel date', request.travelDate],
    ['Trip type', request.tripType],
    ['Hotel category', request.hotelCategory],
    ['Duration', request.noOfNights],
    ['Budget range', request.budgetRange],
    ['Booking window', request.bookingWindow],
    ['Flight / train ticket status', request.ticketStatus],
  ];
  const body = details.map(([label, value]) => `${label}: ${value}`).join('\n');
  MailApp.sendEmail({
    to: TRIP_REQUESTS_EMAIL,
    subject: `New trip request ${tripId} - ${request.name}`,
    body,
  });
}

function setEmailStatus_(row, status) {
  getTripRequestsSpreadsheet_()
    .getSheetByName('Trip Requests')
    .getRange(row, TRIP_REQUESTS_HEADERS.length)
    .setValue(status);
}

function getTripRequestsSpreadsheet_() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty(TRIP_REQUESTS_SHEET_PROPERTY);
  if (!spreadsheetId) throw new Error('Trip request storage is not initialized. Contact us directly.');
  return SpreadsheetApp.openById(spreadsheetId);
}

function escapeSheetCell_(value) {
  const text = String(value);
  return /^[=+@-]/.test(text) ? `'${text}` : text;
}

function validateTripRequest_(request) {
  if (!request || typeof request !== 'object') throw new Error('Trip request details are missing.');
  const fields = [
    ['name', 120],
    ['phone', 40],
    ['email', 254],
    ['leavingFrom', 120],
    ['destination', 300],
    ['destinationPreference', 120],
    ['pax', 3],
    ['children', 3],
    ['travelDate', 120],
    ['tripType', 80],
    ['hotelCategory', 40],
    ['noOfNights', 20],
    ['budgetRange', 40],
    ['bookingWindow', 80],
    ['ticketStatus', 80],
  ];
  const clean = {};
  fields.forEach(([key, maxLength]) => {
    if (typeof request[key] !== 'string' || request[key].length > maxLength) {
      throw new Error(`Invalid ${key} in trip request.`);
    }
    clean[key] = request[key].trim();
  });
  if (!clean.name || !clean.leavingFrom || !clean.destination) {
    throw new Error('Name, departure city, and destination are required.');
  }
  if (!clean.phone && !clean.email) {
    throw new Error('A phone number or email address is required.');
  }

  ['destinationCities', 'destinationOptions', 'childAges'].forEach(key => {
    const values = request[key];
    if (!Array.isArray(values) || values.length > 20 || values.some(value => typeof value !== 'string' || value.length > 120)) {
      throw new Error(`Invalid ${key} in trip request.`);
    }
    clean[key] = values.map(value => value.trim());
  });
  return clean;
}

function responseHtml_(message) {
  const serialized = JSON.stringify(message)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
  return HtmlService.createHtmlOutput(
    `<!doctype html><html><body><script>window.top.postMessage(${serialized}, '*');</script></body></html>`
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
