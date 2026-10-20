# Google Drive trip request setup

New trip requests are saved to a Google Sheet in the deploying Google account's Drive. The Apps Script web app assigns each request a sequential ID (`W2H000001`, `W2H000002`, ...), then emails all submitted trip details to `way2goholidays.bookings@gmail.com`.

## Deploy the Apps Script

1. Sign in to the Google account that should own the trip-request spreadsheet and send the email notifications.
2. Create a project at [script.google.com](https://script.google.com/) and replace the editor contents with [`google-apps-script/Code.gs`](./google-apps-script/Code.gs).
3. Select and run `setupTripRequests`. Approve the requested Google Sheets and email permissions. Open **Execution log** to get the URL of the created spreadsheet.
4. Select **Deploy → New deployment → Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Deploy, approve the mail-sending permission, and copy the web app URL ending in `/exec`.

The web app must be publicly callable so the website can submit without exposing Google account credentials. The script validates the submitted fields, serializes ID allocation, and treats repeat submissions with the same request token as retries. Keep the deployment URL out of public issue reports; it is not a credential, but it is the public submission endpoint.

## Connect the website

Set the deployment URL as an environment variable for both local development and the production build:

```text
VITE_TRIP_REQUEST_WEB_APP_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

For local development, place it in `.env.local`. In production, configure it in the site's build environment and rebuild/redeploy the frontend. This value is included in the public frontend bundle; do not put passwords, API keys, or Google credentials in it.

## Verify

1. Submit a test trip on the website.
2. Confirm the success screen displays a `W2H` trip ID.
3. Confirm the matching row appears in the **Trip Requests** sheet and the email arrives at `way2goholidays.bookings@gmail.com`.
4. If email delivery fails after the sheet save, the success screen reports that separately and offers an email retry. The script uses the original request token, so retrying does not create a second trip row.

The in-app **View Raised Trips** list is a browser-local cache; the Google Sheet is the shared record across devices. Restrict spreadsheet sharing to trusted staff. Because the public form endpoint accepts unauthenticated submissions, monitor the Apps Script execution log and email quota for abuse.
