# Google Drive trip request setup

New trip requests are saved to a Google Sheet in the deploying Google account's Drive. The Apps Script web app assigns each request a sequential ID (`W2H000001`, `W2H000002`, ...), then emails all submitted trip details to `way2goholidays.bookings@gmail.com`.

## Deploy the Apps Script

1. Sign in to the Google account that should own the trip-request spreadsheet and send the email notifications.
2. Create a project at [script.google.com](https://script.google.com/) and replace the editor contents with [`google-apps-script/Code.gs`](./google-apps-script/Code.gs).
3. Select and run `setupTripRequests` while signed in to the account that should own the sheet and send notification emails. Google may show **“Google hasn’t verified this app”** because this is a private Apps Script requesting Sheets and email permissions. Only if you created this script yourself and the editor contains the repository's `Code.gs`, select **Advanced → Go to [your project] (unsafe)**, then review and allow the requested permissions. This authorizes the script owner; it is not a step for website visitors. Open **Execution log** to get the URL of the created spreadsheet.
4. Select **Deploy → New deployment → Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Deploy, approve the mail-sending permission, and copy the web app URL ending in `/exec`.

The web app must be publicly callable so the website can submit without exposing Google account credentials. The script validates the submitted fields, serializes ID allocation, and treats repeat submissions with the same request token as retries. Keep the deployment URL out of public issue reports; it is not a credential, but it is the public submission endpoint.

Do not continue through the unverified-app warning if you did not create and inspect the script, if the project/account shown is unexpected, or if Google identifies a different developer. Do not change **Who has access** to make the OAuth warning disappear; that warning is separate from the web app's public-access setting.

If this project already has a deployment, open **Deploy → Manage deployments**, edit the web app deployment, select a new version, confirm **Execute as: Me** and **Who has access: Anyone**, then deploy the update. The current documented endpoint redirects unauthenticated requests to Google sign-in, which means the existing deployment is not publicly accessible yet. Do not test with real customer details until an anonymous request reaches the script.

## Connect the website

The frontend has the current documented deployment URL as a default. To use a different deployment, set its URL as an environment variable for both local development and the production build:

```text
VITE_TRIP_REQUEST_WEB_APP_URL=https://script.google.com/macros/s/AKfycbyZ9PT8-3DMZdqB4XtoKkxRExVpavQH1eS0iqps4_aBGy-oratHw86njK4FSLJ-GbBQ/exec
```

For local development, place it in `.env.local`. In production, configure it in the site's build environment and rebuild/redeploy the frontend. The URL is public submission configuration, not a credential; never put passwords, API keys, or Google credentials in it.

## Verify

1. Submit a test trip on the website.
2. Confirm the success screen displays a `W2H` trip ID.
3. Confirm the matching row appears in the **Trip Requests** sheet and the email arrives at `way2goholidays.bookings@gmail.com`.
4. If email delivery fails after the sheet save, the success screen reports that separately and offers an email retry. The script uses the original request token, so retrying does not create a second trip row.

The in-app **View Raised Trips** list is a browser-local cache; the Google Sheet is the shared record across devices. Restrict spreadsheet sharing to trusted staff. Because the public form endpoint accepts unauthenticated submissions, monitor the Apps Script execution log and email quota for abuse.
