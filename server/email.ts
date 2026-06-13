import { Resend } from "resend";
import { ENV } from "./_core/env";

const resend = new Resend(ENV.resendApiKey);

export async function sendWaitlistConfirmation({
  email,
  walletAddress,
  position,
}: {
  email: string;
  walletAddress: string;
  position: number;
}): Promise<boolean> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] RESEND_API_KEY not configured — skipping confirmation email");
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: "GreenWaveCoin <noreply@greenwavecoin.com>",
      to: [email],
      subject: "You're on the GreenWaveCoin Waitlist! 🌊",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the GreenWaveCoin Waitlist!</title>
</head>
<body style="margin:0;padding:0;background-color:#020b18;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#020b18;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:linear-gradient(135deg,#071428,#0d1f3c);border-radius:16px;border:1px solid #1e3a5f;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 24px;text-align:center;background:linear-gradient(135deg,#06b6d4,#10b981);-webkit-background-clip:text;">
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">🌊 GreenWaveCoin</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#a0c4d8;letter-spacing:1px;text-transform:uppercase;">AI Research Network</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#ffffff;">You're on the waitlist! 🎉</h2>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#94a3b8;">
                Thanks for joining the GreenWaveCoin waitlist. You're <strong style="color:#10b981;">position #${position}</strong> in line.
                We'll notify you as soon as early access opens.
              </p>
              <!-- Position badge -->
              <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td style="background:linear-gradient(135deg,rgba(6,182,212,0.15),rgba(16,185,129,0.15));border:1px solid rgba(6,182,212,0.3);border-radius:12px;padding:20px 28px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Your waitlist position</p>
                    <p style="margin:0;font-size:36px;font-weight:800;color:#10b981;">#${position}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 12px;font-size:14px;color:#64748b;">Registered wallet:</p>
              <p style="margin:0 0 24px;font-size:13px;color:#94a3b8;font-family:monospace;background:rgba(255,255,255,0.05);padding:10px 14px;border-radius:8px;word-break:break-all;">${walletAddress}</p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#94a3b8;">
                In the meantime, you can download the <strong style="color:#06b6d4;">GreenWaveCoin Worker</strong> and start contributing your idle CPU to AI research tasks — earning $GWC tokens automatically.
              </p>
              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#06b6d4,#10b981);border-radius:10px;padding:1px;">
                    <a href="https://greenwavecoin.com" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#06b6d4,#10b981);border-radius:10px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">Visit GreenWaveCoin.com →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1e3a5f;text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">
                You're receiving this because you joined the GreenWaveCoin waitlist.<br/>
                © 2026 GreenWaveCoin. Built on Polygon.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    });

    if (error) {
      console.warn("[Email] Resend error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("[Email] Failed to send confirmation email:", err);
    return false;
  }
}
