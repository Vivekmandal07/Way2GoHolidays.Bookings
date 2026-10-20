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
  emailSent: boolean;
}

const RESPONSE_TIMEOUT_MS = 30_000;
const DEFAULT_TRIP_REQUEST_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbz-qBsfunv5TN0tro9bRJqVjtSuXcDng8v2tQ3Nz1k_dby01E9b3lN5ONPZWeaQAO-wJA/exec';

const createNonce = () => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const createTripRequestToken = createNonce;

export const submitTripRequest = (
  request: TripRequestSubmission,
  submissionToken: string
): Promise<TripRequestSubmissionResult> => {
  const endpoint = (
    import.meta.env.VITE_TRIP_REQUEST_WEB_APP_URL || DEFAULT_TRIP_REQUEST_WEB_APP_URL
  ).trim();
  if (!endpoint) {
    return Promise.reject(new Error('Trip requests are not configured yet. Please contact us directly.'));
  }

  let parsedEndpoint: URL;
  try {
    parsedEndpoint = new URL(endpoint);
  } catch {
    return Promise.reject(new Error('Trip requests are not configured yet. Please contact us directly.'));
  }

  if (parsedEndpoint.protocol !== 'https:' || parsedEndpoint.hostname !== 'script.google.com') {
    return Promise.reject(new Error('Trip requests are not configured yet. Please contact us directly.'));
  }

  const nonce = createNonce();
  const iframe = document.createElement('iframe');
  const form = document.createElement('form');
  const payload = document.createElement('input');
  const frameName = `trip-request-${nonce}`;

  iframe.name = frameName;
  iframe.title = 'Trip request submission';
  iframe.hidden = true;
  form.method = 'POST';
  form.action = parsedEndpoint.toString();
  form.target = frameName;
  form.hidden = true;
  payload.type = 'hidden';
  payload.name = 'payload';
  payload.value = JSON.stringify({ request, submissionToken, nonce });
  form.append(payload);

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      window.clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
      form.remove();
      iframe.remove();
    };

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error(
        'Could not reach the trip request service. Check that its Google Apps Script deployment is active and accessible to Anyone, then try again.'
      ));
    }, RESPONSE_TIMEOUT_MS);

    const handleMessage = (event: MessageEvent) => {
      if (
        event.source !== iframe.contentWindow ||
        event.data?.type !== 'way2go-trip-request-result' ||
        event.data.nonce !== nonce ||
        !/^https:\/\/script\.google(?:usercontent)?\.com$/.test(event.origin)
      ) return;

      cleanup();
      if (!event.data.ok) {
        reject(new Error(typeof event.data.error === 'string' ? event.data.error : 'Unable to save your trip request.'));
        return;
      }
      if (
        typeof event.data.tripId !== 'string' ||
        !/^W2H\d+$/.test(event.data.tripId) ||
        typeof event.data.submittedAt !== 'string' ||
        typeof event.data.emailSent !== 'boolean'
      ) {
        reject(new Error('The trip request service returned an invalid confirmation.'));
        return;
      }

      resolve({
        tripId: event.data.tripId,
        submittedAt: event.data.submittedAt,
        emailSent: event.data.emailSent,
      });
    };

    window.addEventListener('message', handleMessage);
    document.body.append(iframe, form);
    try {
      form.submit();
    } catch {
      cleanup();
      reject(new Error('Unable to connect to the trip request service. Please try again.'));
    }
  });
};
