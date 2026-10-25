const template=(request)=>{
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Trip Inquiry</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, sans-serif; color: #333333;">

  <div style="max-width: 700px; margin: 30px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden;">

    <!-- Header -->
    <div style="background-color: #163b65; padding: 25px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 24px;">New Trip Inquiry</h1>
      <p style="margin: 10px 0 0; font-size: 14px;">
        A new travel request has been submitted.
      </p>
    </div>

    <!-- Customer Information -->
    <div style="padding: 25px;">
      <h2 style="font-size: 18px; color: #163b65; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">
        Customer Information
      </h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; font-weight: bold; width: 40%;">Full Name</td>
          <td style="padding: 10px;">${request.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Email</td>
          <td style="padding: 10px;">${request.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Phone</td>
          <td style="padding: 10px;">${request.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Leaving From</td>
          <td style="padding: 10px;">${request.leavingFrom}</td>
        </tr>
      </table>

      <!-- Destination Information -->
      <h2 style="font-size: 18px; color: #163b65; border-bottom: 2px solid #eeeeee; padding-bottom: 10px; margin-top: 30px;">
        Destination Details
      </h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; font-weight: bold; width: 40%;">Destination</td>
          <td style="padding: 10px;">${request.destination}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Destination Preference</td>
          <td style="padding: 10px;">${request.destinationPreference}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Destination Cities</td>
          <td style="padding: 10px;">${request.destinationCities?.join(", ") || "Not specified"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Destination Options</td>
          <td style="padding: 10px;">${request.destinationOptions?.join(", ") || "Not specified"}</td>
        </tr>
      </table>

      <!-- Travel Information -->
      <h2 style="font-size: 18px; color: #163b65; border-bottom: 2px solid #eeeeee; padding-bottom: 10px; margin-top: 30px;">
        Travel Details
      </h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; font-weight: bold; width: 40%;">Travel Date</td>
          <td style="padding: 10px;">${request.travelDate}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Trip Type</td>
          <td style="padding: 10px;">${request.tripType}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Number of Travelers</td>
          <td style="padding: 10px;">${request.pax}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Children</td>
          <td style="padding: 10px;">${request.children ?? 0}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Children's Ages</td>
          <td style="padding: 10px;">${request.childAges?.join(", ") || "Not applicable"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Number of Nights</td>
          <td style="padding: 10px;">${request.noOfNights}</td>
        </tr>
      </table>

      <!-- Booking Preferences -->
      <h2 style="font-size: 18px; color: #163b65; border-bottom: 2px solid #eeeeee; padding-bottom: 10px; margin-top: 30px;">
        Booking Preferences
      </h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; font-weight: bold; width: 40%;">Hotel Category</td>
          <td style="padding: 10px;">${request.hotelCategory}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Budget Range</td>
          <td style="padding: 10px;">${request.budgetRange}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Booking Window</td>
          <td style="padding: 10px;">${request.bookingWindow}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Flight Ticket Status</td>
          <td style="padding: 10px;">${request.ticketStatus}</td>
        </tr>
      </table>

    </div>

    <!-- Footer -->
    <div style="background-color: #f4f6f8; padding: 20px; text-align: center; font-size: 12px; color: #777777;">
      <p style="margin: 0;">This email was generated from your travel inquiry form.</p>
    </div>

  </div>

</body>
</html>
`;
return htmlTemplate
}

export default template