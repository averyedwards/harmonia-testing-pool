#!/usr/bin/env python3
"""
generate-templates.py
Regenerates all Harmonia email templates from content definitions.
Run after changing base layout, logo, or template content.

Usage:
    python3 generate-templates.py
"""

import os
import urllib.parse

OUTPUT_DIR = os.path.join("src", "styles", "email-templates")

# Base64-encoded logo — replace with actual logo when available
# Current: SVG placeholder (gold circle with "H")
LOGO_URI = (
    "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22"
    "%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E"
    "%3Ccircle%20cx%3D%2224%22%20cy%3D%2224%22%20r%3D%2224%22%20fill%3D%22%23D4A853%22%2F%3E"
    "%3Ctext%20x%3D%2224%22%20y%3D%2232%22%20font-family%3D%22Georgia%2Cserif%22"
    "%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22"
    "%20fill%3D%22%2312090A%22%3EH%3C%2Ftext%3E%3C%2Fsvg%3E"
)

CSS_RESET = """
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
    img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}
    table{border-collapse:collapse!important;}
    body{height:100%!important;margin:0!important;padding:0!important;width:100%!important;background-color:#FAF6F1;}
    div[style*="margin: 16px 0"]{margin:0!important;}
    @media only screen and (max-width:620px){.email-container{width:100%!important;}.email-card{padding:28px 20px!important;}}
""".strip()

FOOTER_COPYRIGHT = "&copy; 2026 Harmonia Engine Ltd. All rights reserved."
FOOTER_LINKS = (
    '<a href="{{unsubscribeUrl}}" style="color:#9CA3AF;text-decoration:underline;">Unsubscribe</a>'
    '&nbsp;&middot;&nbsp;'
    '<a href="https://app.harmoniaengine.com/settings" style="color:#9CA3AF;text-decoration:underline;">Notification preferences</a>'
)

BUTTON_STYLE = (
    'display:inline-block;padding:14px 36px;font-family:Arial,Helvetica,sans-serif;'
    'font-size:15px;font-weight:bold;color:#12090A;text-decoration:none;border-radius:8px;'
)

LABEL_STYLE = (
    'font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#D4A853;'
    'margin:0 0 12px;letter-spacing:0.08em;text-transform:uppercase;'
)

H1_STYLE = (
    'font-family:Georgia,\'Times New Roman\',serif;font-size:28px;font-weight:600;'
    'color:#1E293B;margin:0 0 24px;line-height:1.3;'
)

P_STYLE = 'font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#475569;margin:0 0 16px;line-height:1.7;'
P_LAST_STYLE = 'font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#475569;margin:0 0 32px;line-height:1.7;'
MUTED_STYLE = 'font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9CA3AF;margin:32px 0 0;line-height:1.6;text-align:center;'


def wrap_template(title, preheader, content):
    return f"""<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <title>{title}</title>
  <style type="text/css">
    {CSS_RESET}
  </style>
</head>
<body style="background-color:#FAF6F1;margin:0;padding:0;">

  <div style="display:none;font-size:1px;color:#FAF6F1;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    {preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF6F1;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">

          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="{LOGO_URI}"
                   alt="H" width="48" height="48" style="display:block;margin:0 auto 10px;">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:600;color:#1E293B;letter-spacing:0.1em;text-transform:uppercase;">Harmonia Engine</span>
            </td>
          </tr>

          <tr>
            <td class="email-card" style="background-color:#FFFFFF;border-radius:12px;border-top:3px solid #D4A853;padding:40px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
{content}
            </td>
          </tr>

          <tr><td style="height:24px;">&nbsp;</td></tr>

          <tr>
            <td align="center">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF;margin:0 0 6px;line-height:1.5;">
                {FOOTER_COPYRIGHT}
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF;margin:0;line-height:1.5;">
                {FOOTER_LINKS}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
"""


def button(url_var, label):
    return f"""
              <table border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td align="center" bgcolor="#D4A853" style="border-radius:8px;">
                    <a href="{url_var}" target="_blank"
                       style="{BUTTON_STYLE}">
                      {label}
                    </a>
                  </td>
                </tr>
              </table>"""


# ── Template definitions ──────────────────────────────────────────────────────

TEMPLATES = {
    "email-verification.html": (
        "Verify your email address",
        "One click to confirm your address and you're in.",
        f"""
              <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:600;color:#1E293B;margin:0 0 8px;line-height:1.3;">
                Welcome, {{{{firstName}}}}.
              </h1>
              <p style="{LABEL_STYLE}">Verify your email</p>

              <p style="{P_STYLE}">
                You signed up for the Harmonia testing pool. Click the button below to confirm your email address and continue to your profile.
              </p>
              <p style="{P_LAST_STYLE}">
                This link expires in 24 hours.
              </p>

              {button("{{verificationUrl}}", "Verify email address")}

              <p style="{MUTED_STYLE}">
                If you did not sign up for Harmonia, you can safely ignore this email. No further emails will be sent.
              </p>""",
    ),

    "password-reset.html": (
        "Reset your password",
        "Reset your Harmonia password. Link expires in {{expiryTime}}.",
        f"""
              <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:600;color:#1E293B;margin:0 0 8px;line-height:1.3;">
                Reset your password
              </h1>
              <p style="{LABEL_STYLE}">Account security</p>

              <p style="{P_STYLE}">
                Hi {{{{firstName}}}}, we received a request to reset the password for your Harmonia account.
              </p>
              <p style="{P_LAST_STYLE}">
                Click below to choose a new password. This link expires in {{{{expiryTime}}}}.
              </p>

              {button("{{resetUrl}}", "Reset password")}

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:32px 0;">
                <tr><td style="border-top:1px solid #E8E0D8;">&nbsp;</td></tr>
              </table>

              <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9CA3AF;margin:0 0 12px;line-height:1.6;">
                If you did not request a password reset, you can safely ignore this email. Your password will not change.
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9CA3AF;margin:0;line-height:1.6;">
                For security, never share this link with anyone.
              </p>""",
    ),
}


def generate():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for filename, (title, preheader, content) in TEMPLATES.items():
        path = os.path.join(OUTPUT_DIR, filename)
        html = wrap_template(title, preheader, content)
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  wrote {filename}")
    print(f"\nDone. {len(TEMPLATES)} template(s) written to {OUTPUT_DIR}/")
    print("Note: Only templates defined in TEMPLATES dict are regenerated.")
    print("Templates not in dict (e.g. community-update.html) must be edited manually.")


if __name__ == "__main__":
    generate()
