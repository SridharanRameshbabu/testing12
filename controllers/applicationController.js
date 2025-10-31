
const fs = require("fs");
const { Resend } = require("resend");
const Application = require("../models/Application.js");

const resend = new Resend(process.env.RESEND_API_KEY);

const applyForInternship = async (req, res) => {
  try {
    const { name, email, college, department, domain, mode, duration, message, mobile } = req.body;
    const file = req.file;

    if (!name || !email) {
      if (file) fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Name and Email are required" });
    }

    // Save application to DB
    const application = await Application.create({
      name,
      email,
      mobile,
      college,
      department,
      domain,
      mode,
      duration,
      message,
      resume_filename: file ? file.filename : null,
      resume_mimetype: file ? file.mimetype : null,
      resume_size: file ? file.size : null,
    });

    // Email HTML content
    const htmlContent = `
<!doctype html>
<html>
  <body style="margin:0;padding:20px;font-family:Arial,Helvetica,sans-serif;background-color:#f8fafc;color:#111;">
    <h1 style="color:#1d4ed8;font-size:28px;">🎉 Internship Application Received</h1>

    <p style="font-size:16px;line-height:1.6;color:#374151;">
      Hello Balaji,<br><br>
      You have a <span style="color:#16a34a;font-weight:bold;">new internship application</span>.
    </p>

    <p style="font-size:15px;color:#111827;">
      <strong>Name:</strong> <span style="color:#dc2626;">${escapeHtml(name)}</span><br>
      <strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(email)}</a><br>
      <strong>Mobile:</strong> <span style="color:#2563eb;">${escapeHtml(mobile)}</span><br>
      <strong>College:</strong> ${escapeHtml(college || "—")}<br>
      <strong>Department:</strong> ${escapeHtml(department || "—")}<br>
      <strong>Domain:</strong> ${escapeHtml(domain || "—")}<br>
      <strong>Mode:</strong> ${escapeHtml(mode || "-")}<br>
      <strong>Duration:</strong> ${duration ? escapeHtml(duration.toString()) + " weeks" : "—"}<br>
      <strong>Message:</strong> ${escapeHtml(message || "—")}
    </p>

    <p style="margin-top:20px;font-size:14px;color:#475569;">
      Resume: <span style="color:#16a34a;">${file ? "Attached ✅" : "Not Attached ❌"}</span>
    </p>

    <hr style="margin:30px 0;border:0;border-top:2px dashed #e5e7eb;">

    <p style="font-size:12px;color:#9ca3af;text-align:center;">
      — Sent from <span style="color:#2563eb;">BTC Internship Portal</span> —
    </p>
  </body>
</html>
`;

    const textContent = `
New Internship Application

Name: ${name}
Email: ${email}
Mobile: ${mobile}
College: ${college || "—"}
Department: ${department || "—"}
Domain: ${domain || "—"}
Mode: ${mode || "-"}
Duration: ${duration ? duration + " weeks" : "—"}
Message: ${message || "—"}

(Note: resume ${file ? "attached" : "not attached"})
`;

    // Send Email using Resend
    const emailOptions = {
      from: "BTC Internship <noreply@btcglobal.info>", // works without domain verification
      to: process.env.ADMIN_EMAIL,
      reply_to: email,
      subject: `New Internship Application - ${name}`,
      html: htmlContent,
      text: textContent,
      attachments: file
        ? [
            {
              filename: file.originalname,
              content: fs.readFileSync(file.path).toString("base64"),
              path: undefined,
              contentType: file.mimetype,
            },
          ]
        : [],
    };

    const data = await resend.emails.send(emailOptions);
    console.log("✅ Email sent:", data);

    // Clean up uploaded file
    if (file) fs.unlinkSync(file.path);

    res.status(200).json({
      success: true,
      message: "Application submitted successfully!",
      data: application,
    });
  } catch (error) {
    console.error("❌ Error submitting application:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper to avoid HTML injection
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = { applyForInternship };
