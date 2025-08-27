// controllers/HealthCardController.js
const HealthCardRepository = require("../repositories/HealthCardRepository");
const UserRepository = require("../repositories/UserRepository");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const registerHealthCard = async (req, res) => {
  try {
    console.log("[HealthCard] Incoming register request");
    console.log(
      "[HealthCard] Headers content-type:",
      req.headers?.["content-type"]
    );
    console.log("[HealthCard] Body keys:", Object.keys(req.body || {}));
    console.log(
      "[HealthCard] Files present:",
      Array.isArray(req.files) ? req.files.length : req.file ? 1 : 0
    );

    const { firstName, lastName, email, NIC, gender, contactNo, bloodType } =
      req.body;
    const file = Array.isArray(req.files)
      ? req.files.find((f) => f.fieldname === "photo")
      : req.file;

    // Simple validation
    if (!firstName || !lastName || !email || !NIC || !gender || !contactNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Build payload
    const payload = { firstName, lastName, email, NIC, gender, contactNo };
    if (bloodType) payload.bloodType = bloodType;
    if (file) {
      // Save relative path served from /uploads
      payload.photoUrl = `/uploads/${file.filename}`;
    }

    // Create a new health card
    const healthCard = await HealthCardRepository.createHealthCard(payload);
    console.log(
      "[HealthCard] Saved health card id:",
      healthCard?._id?.toString()
    );
    if (payload.photoUrl)
      console.log("[HealthCard] Photo file saved as:", payload.photoUrl);

    // Auto-create a user account if one doesn't already exist, and email credentials
    const userRepo = new UserRepository();
    const existingUser = await userRepo.findByEmail(email);
    let createdUser = null;
    let generatedPassword = null;
    if (!existingUser) {
      console.log(
        "[HealthCard] No existing user. Creating new user for:",
        email
      );
      generatedPassword = crypto.randomBytes(6).toString("base64url");
      const name = `${firstName} ${lastName}`.trim();
      createdUser = await userRepo.createUser({
        name,
        email,
        userType: "user",
        password: generatedPassword,
      });
      console.log(
        "[HealthCard] Created user id:",
        createdUser?._id?.toString()
      );

      console.log(createdUser);

      // Send email if SMTP creds exist (do not fail whole request on mail error)
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const host = process.env.SMTP_HOST || "smtp.gmail.com";
          const port = Number(process.env.SMTP_PORT || 587);
          // If SMTP_SECURE is set, use it. Otherwise infer from port (465 => true, else false for STARTTLS like 587)
          const secure = port === 465;
          const logger = String(process.env.SMTP_DEBUG || "false") === "true";
          const debug = logger;

          console.log("[Email] SMTP config:", {
            host,
            port,
            secure,
            hasUser: !!process.env.SMTP_USER,
            hasPass: !!process.env.SMTP_PASS,
            logger,
            debug,
          });

          const transporter = nodemailer.createTransport({
            host,
            port,
            secure, // true for 465, false for 587/STARTTLS
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            logger,
            debug,
            tls: { rejectUnauthorized: false },
            requireTLS: port === 587,
          });

          // Optional verify to surface config issues early
          try {
            const verified = await transporter.verify();
            console.log("[Email] Transport verify result:", verified);
          } catch (vErr) {
            console.warn("[Email] SMTP verify failed:", vErr?.message || vErr);
          }

          const loginUrl =
            process.env.APP_LOGIN_URL || "http://localhost:5173/login";
          const mailOptions = {
            from:
              process.env.SMTP_FROM || `Medicare <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Your Medicare account credentials",
            text: `Hello ${firstName},\n\nYour patient account has been created.\n\nEmail: ${email}\nPassword: ${generatedPassword}\n\nLogin here: ${loginUrl}\n\nPlease change your password after logging in.`,
          };
          console.log(
            "[Email] Sending to:",
            mailOptions.to,
            "subject:",
            mailOptions.subject,
            "from:",
            mailOptions.from
          );

          try {
            const info = await transporter.sendMail(mailOptions);
            console.log(
              "[Email] Sent. messageId:",
              info?.messageId,
              "response:",
              info?.response
            );
          } catch (mailErr) {
            console.error("[Email] Send failed:", mailErr?.message || mailErr);
            if (mailErr?.response)
              console.error("[Email] SMTP response:", mailErr.response);
          }
        } catch (mailSetupErr) {
          console.error(
            "[Email] Mail setup error:",
            mailSetupErr?.message || mailSetupErr
          );
        }
      } else {
        console.warn("[Email] SMTP_USER or SMTP_PASS not set. Skipping email.");
      }
    }

    return res.status(201).json({
      message: "Health card registered successfully",
      healthCard,
      userCreated: !!createdUser,
      ...(process.env.NODE_ENV !== "production" && generatedPassword
        ? { debugPassword: generatedPassword }
        : {}),
      mailConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
    });
  } catch (error) {
    console.error("[HealthCard] Register error:", error?.message || error);
    if (error?.stack) console.error(error.stack);
    if (error && error.code === 11000) {
      const fields = Object.keys(error.keyPattern || {});
      const field = fields.length ? fields[0] : "field";
      return res.status(409).json({
        message: `Duplicate ${field}. A record with this ${field} already exists.`,
      });
    }
    if (error?.name === "MulterError") {
      return res.status(400).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getHealthCardDetails = async (req, res) => {
  try {
    const { email } = req.params; // Get email from request parameters

    // Find health card by email
    const healthCard = await HealthCardRepository.getHealthCardByEmail(email);

    if (!healthCard) {
      return res.status(404).json({ message: "Health card not found" });
    }

    return res.status(200).json({ healthCard });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerHealthCard,
  getHealthCardDetails,
};
