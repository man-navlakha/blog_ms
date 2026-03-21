export function getBrevoConfigError() {
  if (!process.env.BREVO_API_KEY) {
    return "Brevo is not configured. Missing: BREVO_API_KEY.";
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    return "Brevo is not configured. Missing: BREVO_SENDER_EMAIL.";
  }

  return null;
}

export async function sendOtpEmail({ toEmail, otp }) {
  const configError = getBrevoConfigError();
  if (configError) {
    throw new Error(configError);
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Mechanic Setu",
      },
      to: [{ email: toEmail }],
      subject: "Your Mechanic Setu Admin OTP",
      htmlContent: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
          <h2>Mechanic Setu Admin Login</h2>
          <p>Your OTP is:</p>
          <p style="font-size:28px;font-weight:700;letter-spacing:4px">${otp}</p>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Brevo send failed: ${text}`);
  }
}
