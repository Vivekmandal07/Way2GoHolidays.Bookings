import sendEmail from '../mailer/agent';

export interface TripRequestSubmission {
  name: string;
  phone: string;
  email: string;
  leavingFrom: string;
  destination: string;
  destinationCities: string[];
  destinationPreference: string;
  destinationOptions: string[];
  pax: string;
  children: string;
  childAges: string[];
  travelDate: string;
  tripType: string;
  hotelCategory: string;
  noOfNights: string;
  budgetRange: string;
  bookingWindow: string;
  ticketStatus: string;
}

export interface TripRequestSubmissionResult {
  tripId: string;
  submittedAt: string;
}

const createNonce = () => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const createTripRequestToken = createNonce;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] || character);

const createTripRequestEmail = (request: TripRequestSubmission, tripId: string) => {
  const details: Array<[string, string]> = [
    ['Trip ID', tripId],
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

  const rows = details.map(([label, value]) =>
    `<tr><th align="left" style="padding:8px;border:1px solid #ddd">${escapeHtml(label)}</th><td style="padding:8px;border:1px solid #ddd">${escapeHtml(value)}</td></tr>`
  ).join('');

  return `
    <h2>New Trip Request ${escapeHtml(tripId)}</h2>
    <table style="border-collapse:collapse;width:100%"><tbody>${rows}</tbody></table>
  `;
};

export const submitTripRequest = async (
  request: TripRequestSubmission,
  submissionToken: string
): Promise<TripRequestSubmissionResult> => {
  const tokenPrefix = submissionToken.replace(/-/g, '').slice(0, 12);
  if (!/^[a-f0-9]{12}$/i.test(tokenPrefix)) {
    throw new Error('Unable to create a trip request ID. Please try again.');
  }

  const tripId = `W2H${parseInt(tokenPrefix, 16).toString().padStart(12, '0')}`;
  await sendEmail(createTripRequestEmail(request, tripId));

  return {
    tripId,
    submittedAt: new Date().toISOString(),
  };
};
