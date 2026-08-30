import { Resend } from "resend";
import nodemailer from "nodemailer";

// ---------------------------------------------------------------------------
// Multi-account mail server.
//
// Every "account" is one client site that sends through this server. By
// default each account sends over the Resend HTTPS API because Render's FREE
// tier blocks outbound SMTP ports (25/465/587) — nodemailer's SMTP only works
// there once the web service is paid (or hosted elsewhere). For a future
// account that must use its own hosting's SMTP server, set `provider: "smtp"`
// and add the matching `smtp` block (see the example below).
// ---------------------------------------------------------------------------

// TODO: set real values in .env (or Create Resend account + verify domains).
// Docs: https://resend.com/api-keys and https://resend.com/domains
const resend = new Resend(process.env.RESEND_API_KEY);

const accounts = {
  junaidadams: {
    provider: "resend",
    from: process.env.JUNIAIDADAMS_MAIL_FROM, // e.g. contact@junaidadams.com
    to: process.env.JUNIAIDADAMS_MAIL_TO, // e.g. junaidadams117@gmail.com
  },
  withinreach: {
    provider: "resend",
    from: process.env.WITHINREACH_MAIL_FROM, // e.g. contact@withinreach.co.za
    to: process.env.WITHINREACH_CONTACT_TO, // e.g. info@withinreach.co.za
  },
  // SMTP example for a future account that must relay via its own mail host
  // (only usable when the deploy target does not block outbound SMTP):
  //   example: {
  //     provider: "smtp",
  //     from: "forms@example.com",
  //     to: "owner@example.com",
  //     smtp: {
  //       host: process.env.EXAMPLE_SMTP_HOST, // e.g. mail.example.com
  //       port: Number(process.env.EXAMPLE_SMTP_PORT || 465),
  //       secure: true,
  //       auth: {
  //         user: process.env.EXAMPLE_SMTP_USER,
  //         pass: process.env.EXAMPLE_SMTP_PASS,
  //       },
  //     },
  //   },
};

console.log(
  "[mail] configured accounts:",
  Object.entries(accounts).map(([key, a]) => `${key} (${a.provider}) from=${a.from}`)
);

// --- helpers ----------------------------------------------------------------

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Prevents header-injection when user input is interpolated into the subject.
function safeSubject(value = "") {
  return String(value).replace(/[\r\n]/g, " ").trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function contactTemplate({ name, email, body }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">New Contact Email</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr>
        <h3 style="color: #555;">Message:</h3>
        <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${body}</p>
      </div>
    </div>
  `;
}

async function sendAccountMail(accountKey, { replyTo, subject, html }) {
  const account = accounts[accountKey];
  if (!account) {
    throw new Error(`Unknown mail account: ${accountKey}`);
  }

  if (account.provider === "smtp") {
    const transporter = nodemailer.createTransport(account.smtp);
    return transporter.sendMail({
      from: account.from,
      to: account.to,
      replyTo,
      subject,
      html,
    });
  }

  const { error } = await resend.emails.send({
    from: account.from,
    to: account.to,
    reply_to: replyTo,
    subject,
    html,
  });
  if (error) {
    throw new Error(error.message);
  }
}

function handleError(res, error) {
  console.error("Email sending failed:", error);
  res.status(500).json({
    success: false,
    message: "Failed to send email.",
    error: error.message, // surfaces the real cause instead of a generic message
  });
}

// --- route handlers ---------------------------------------------------------

export const sendServiceEmail = async (req, res) => {
  const { formData } = req.body;
  // if (!formData || !formData.selectedPackage) {
  //   return res.status(400).json({ message: "Invalid data provided." });
  // }
  const { selectedPackage, selectedPages, message, includeRetainer } = formData;
  const html = `<p>${
    !message
      ? "No message provided"
      : `They added the following message: "${escapeHtml(message)}"`
  }</p>

  <p>${escapeHtml(selectedPages)}</p>

  <p>${!includeRetainer ? "No retainer requested" : "Retainer requested."}</p>`;

  try {
    await sendAccountMail("junaidadams", {
      subject: `${safeSubject(selectedPackage)} website requested`,
      html,
    });
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    handleError(res, error);
  }
};

export const sendPortfolioContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: "A valid email is required." });
  }

  const html = contactTemplate({
    name: escapeHtml(name),
    email: escapeHtml(email),
    body: escapeHtml(message),
  });

  try {
    await sendAccountMail("junaidadams", {
      replyTo: email,
      subject: `${safeSubject(name)} has contacted you:`,
      html,
    });
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    handleError(res, error);
  }
};

export const sendWithinReachContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: "A valid email is required." });
  }

  const html = contactTemplate({
    name: escapeHtml(name),
    email: escapeHtml(email),
    body: escapeHtml(message),
  });

  try {
    await sendAccountMail("withinreach", {
      replyTo: email,
      subject: `${safeSubject(name)} has contacted you via withinreach.co.za:`,
      html,
    });
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    handleError(res, error);
  }
};