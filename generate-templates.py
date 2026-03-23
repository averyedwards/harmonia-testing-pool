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

    "phase-transition.html": (
        "{{phaseName}} is now open",
        "{{phaseTeaser}}",
        f"""
              <p style="{LABEL_STYLE}">New phase</p>
              <h1 style="{H1_STYLE}">
                {{{{phaseName}}}} is now open.
              </h1>

              <p style="{P_STYLE}">
                Hi {{{{firstName}}}},
              </p>
              <p style="{P_LAST_STYLE}">
                {{{{phaseDescription}}}}
              </p>

              {button("{{ctaUrl}}", "{{ctaText}}")}""",
    ),

    "match-confirmed.html": (
        "You have a new match!",
        "You and {{matchedFirstName}} both chose each other.",
        f"""
              <p style="{LABEL_STYLE}">New match</p>
              <h1 style="{H1_STYLE}">
                It&#8217;s a match, {{{{firstName}}}}.
              </h1>

              <p style="{P_STYLE}">
                You and {{{{matchedFirstName}}}} both chose each other. Head to your matches to see more.
              </p>
              <p style="{P_LAST_STYLE}">
                Take your time &#8212; there&#8217;s no expiry on this match.
              </p>

              {button("{{matchUrl}}", "View match")}""",
    ),

    "calibration-reminder.html": (
        "Complete your calibration",
        "Your calibration is waiting \u2014 it takes about 5 minutes.",
        f"""
              <p style="{LABEL_STYLE}">Reminder</p>
              <h1 style="{H1_STYLE}">
                Your calibration is waiting, {{{{firstName}}}}.
              </h1>

              <p style="{P_STYLE}">
                You haven&#8217;t completed your calibration yet. It takes around 5 minutes and helps us understand your preferences before the pool opens.
              </p>
              <p style="{P_LAST_STYLE}">
                This is the only calibration reminder we&#8217;ll send.
              </p>

              {button("{{calibrationUrl}}", "Complete calibration")}""",
    ),

    "insights-ready.html": (
        "Your {{phaseName}} insights are ready",
        "See what your choices revealed about you.",
        f"""
              <p style="{LABEL_STYLE}">Insights</p>
              <h1 style="{H1_STYLE}">
                Your {{{{phaseName}}}} insights are ready, {{{{firstName}}}}.
              </h1>

              <p style="{P_LAST_STYLE}">
                We&#8217;ve analysed your choices and prepared a personalised breakdown. See what your decisions say about what you&#8217;re looking for.
              </p>

              {button("{{insightsUrl}}", "View my insights")}""",
    ),

    "we-met-survey.html": (
        "How did it go?",
        "We\u2019d love to hear how your meeting with {{matchedFirstName}} went.",
        f"""
              <p style="{LABEL_STYLE}">Post-meeting feedback</p>
              <h1 style="{H1_STYLE}">
                How did it go, {{{{firstName}}}}?
              </h1>

              <p style="{P_STYLE}">
                You recently exchanged contact details with {{{{matchedFirstName}}}}. We&#8217;d love to know how that went &#8212; your feedback helps us improve the pool for everyone.
              </p>
              <p style="{P_LAST_STYLE}">
                It only takes 30 seconds.
              </p>

              {button("{{surveyUrl}}", "Share feedback")}

              <p style="{MUTED_STYLE}">
                Your responses are private and will never be shared with {{{{matchedFirstName}}}}.
              </p>""",
    ),

    "kit-address-request.html": (
        "Your DNA kit address is confirmed",
        "We\u2019ve saved your address for your DNA kit.",
        f"""
              <p style="{LABEL_STYLE}">DNA kit</p>
              <h1 style="{H1_STYLE}">
                Address confirmed, {{{{firstName}}}}.
              </h1>

              <p style="{P_STYLE}">
                We&#8217;ve saved your delivery address for your DNA kit. We&#8217;ll be in touch as soon as your kit is on its way.
              </p>
              <p style="{P_LAST_STYLE}">
                Need to update your address before dispatch? You can change it in your settings.
              </p>

              {button("{{settingsUrl}}", "Review address")}""",
    ),

    "kit-dispatched.html": (
        "Your DNA kit has been dispatched",
        "Your kit is on its way \u2014 expected by {{expectedDelivery}}.",
        f"""
              <p style="{LABEL_STYLE}">DNA kit</p>
              <h1 style="{H1_STYLE}">
                Your kit is on its way, {{{{firstName}}}}.
              </h1>

              <p style="{P_STYLE}">
                Your DNA kit has been dispatched and should arrive by <strong>{{{{expectedDelivery}}}}</strong>.
              </p>
              <p style="{P_STYLE}">
                Once you receive your kit, follow the instructions inside and return it by post. Results are typically ready within {{{{processingTime}}}}.
              </p>
              <p style="{P_LAST_STYLE}">
                You can track your delivery using the link below.
              </p>

              {button("{{trackingUrl}}", "Track delivery")}

              <p style="{MUTED_STYLE}">
                If you have any questions about your kit, reply to this email and we&#8217;ll help.
              </p>""",
    ),

    "kit-results-ready.html": (
        "Your DNA results are in",
        "Your genetic compatibility data is ready \u2014 unlocking Phase 3.",
        f"""
              <p style="{LABEL_STYLE}">DNA results</p>
              <h1 style="{H1_STYLE}">
                Your results are in, {{{{firstName}}}}.
              </h1>

              <p style="{P_STYLE}">
                Your DNA sample has been processed. Your genetic compatibility data is now part of your profile and will be factored into your Phase 3 matches.
              </p>
              <p style="{P_LAST_STYLE}">
                Head to your profile to see what your data reveals.
              </p>

              {button("{{resultsUrl}}", "View my results")}""",
    ),

    "testing-waitlist.html": (
        "You're on the list",
        "We\u2019ll be in touch when a space opens up.",
        f"""
              <p style="{LABEL_STYLE}">Testing pool</p>
              <h1 style="{H1_STYLE}">
                You&#8217;re on the list, {{{{firstName}}}}.
              </h1>

              <p style="{P_STYLE}">
                The testing pool is currently at capacity. We&#8217;ve added you to the waitlist and will be in touch as soon as a space becomes available.
              </p>
              <p style="{P_LAST_STYLE}">
                No action is needed on your part &#8212; we&#8217;ll reach out directly when you&#8217;re able to join.
              </p>

              <p style="{MUTED_STYLE}">
                Thank you for your patience and interest in Harmonia.
              </p>""",
    ),

    "survey-reminder.html": (
        "Quick reminder: How did it go?",
        "Last chance to share your feedback \u2014 no further reminders will be sent.",
        f"""
              <p style="{LABEL_STYLE}">Reminder</p>
              <h1 style="{H1_STYLE}">
                Just a quick reminder, {{{{firstName}}}}.
              </h1>

              <p style="{P_STYLE}">
                We sent you a short survey about your recent meeting and haven&#8217;t heard back yet. Your feedback helps us improve the pool for everyone.
              </p>
              <p style="{P_LAST_STYLE}">
                It only takes 30 seconds.
              </p>

              {button("{{surveyUrl}}", "Share feedback")}

              <p style="{MUTED_STYLE}">
                This is the last reminder. No further follow-ups will be sent.
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
