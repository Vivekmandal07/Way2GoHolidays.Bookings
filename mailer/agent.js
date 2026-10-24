
async function sendEmail(template) {
  const response = await fetch(
    "https://mailer-beta-three.vercel.app/api/send-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ template }),
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to send email");
  }

  return result;
}

export default sendEmail;
