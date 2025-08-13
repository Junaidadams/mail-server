import nodemailer from "nodemailer";

const portfolioTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your Gmail app password or OAuth2 token
  },
});

const roobTransporter = nodemailer.createTransport({
  host: "mail.roob.online",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ROOB_EMAIL_USER,
    pass: process.env.ROOB_EMAIL_PASS,
  },
});

const biteSizedTransporter = nodemailer.createTransport({
  host: "mail.bitesized.online",
  port: 465,
  secure: true,
  auth: {
    user: process.env.BITESIZED_EMAIL_USER,
    pass: process.env.BITESIZED_EMAIL_PASS,
  },
});

export const sendServiceEmail = async (req, res) => {
  const { formData } = req.body;
  // if (!formData || !formData.selectedPackage) {
  //   return res.status(400).json({ message: "Invalid data provided." });
  // }
  const { selectedPackage, selectedPages, message, includeRetainer } = formData;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `${selectedPackage} website requested`,
    text: `${
      !message
        ? "No message provided"
        : `They added the following message: "${message}"`
    }

${selectedPages}

${!includeRetainer ? "No retainer requested" : "Retainer requested."}`,
  };
  try {
    await portfolioTransporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Email sent successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email." });
  }
};

export const sendPortfolioContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: `"Contact " <${process.env.EMAIL_USER}>`,
    to: "junaidadams117@gmail.com",
    replyTo: email,
    subject: `${name} has contacted you:`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">New Contact Email</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr>
          <h3 style="color: #555;">Message:</h3>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${message}</p>
        </div>
      </div>
    `,
  };

  try {
    await portfolioTransporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};

export const sendBiteSizedMenuContactEmail = async (req, res) => {
  const { firstName, contactEmail, message } = req.body;

  const mailOptions = {
    from: `"Contact " <${process.env.ROOB_EMAIL_USER}>`,
    to: "thebitesizedmenu@gmail.com",
    replyTo: contactEmail,
    subject: `${firstName} has contact you:`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">New Commission Request</h2>
          <p><strong>Name:</strong> ${firstName}</p>
          <p><strong>Email:</strong> ${contactEmail}</p>
          <hr>
          <h3 style="color: #555;">Message:</h3>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${message}</p>
        </div>
      </div>
    `,
  };

  try {
    await biteSizedTransporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};

export const sendBiteSizedMenuOrderRequestEmail = async (req, res) => {
  const { cartItems, ...formData } = req.body;

  const mailOptions = {
    from: `"Contact " <${process.env.ROOB_EMAIL_USER}>`,
    to: "junaidadams117@gmail.com",
    replyTo: formData.email,
    subject: `${formData.name} has contact you:`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">New Commission Request</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Email:</strong> ${formData.number}</p>
          <hr>
          <h3 style="color: #555;">Message:</h3>
          <ul style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${cartItems
            .map((item) => `<li>${item.name}</li>`)
            .join("")}</ul>
        </div>
      </div>
    `,
  };

  try {
    await portfolioTransporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};

export const sendRoobRequestEmail = async (req, res) => {
  const { firstName, contactEmail, type, variant, message } = req.body;

  const mailOptions = {
    from: `"Roob Commissions" <${process.env.ROOB_EMAIL_USER}>`,
    to: "onlineroobb@gmail.com",
    replyTo: contactEmail,
    subject: `New Commission Request: ${type} - ${variant} by ${firstName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">New Commission Request</h2>
          <p><strong>Name:</strong> ${firstName}</p>
          <p><strong>Email:</strong> ${contactEmail}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Variant:</strong> ${variant}</p>
          <hr>
          <h3 style="color: #555;">Message:</h3>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${message}</p>
        </div>
      </div>
    `,
  };

  try {
    await roobTransporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};
