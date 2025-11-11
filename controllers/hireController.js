const Hire = require('../models/Hire')
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const WantHiring = async(req,res) =>{
    try{
        const {companyName,companyEmail,companyPhone,domain,numofstudents,experienceLevel,message} = req.body;
        if(!companyName || !companyEmail || !companyPhone || !domain || !numofstudents ){
            console.log(companyEmail,companyName,companyPhone,domain,numofstudents)
            return res.status(400).json({error:"Some data missing"})
        }

        const hiringstuent = await Hire.create({
            companyName,
            companyEmail,
            companyPhone,
            domain,
            numofstudents,
            experienceLevel,
            message
        });

        const htmlContent = `
            <!doctype html>
            <html>
            <body style="margin:0;padding:20px;font-family:Arial,Helvetica,sans-serif;background-color:#f8fafc;color:#111;">
                <h1 style="color:#1d4ed8;font-size:28px;">🎉 Hiring Request Received</h1>

                <p style="font-size:16px;line-height:1.6;color:#374151;">
                Hello Balaji,<br><br>
                You have a <span style="color:#16a34a;font-weight:bold;">Hiring Request</span>.
                </p>

                <p style="font-size:15px;color:#111827;">
                <strong>Company Name:</strong> <span style="color:#dc2626;">${escapeHtml(companyName)}</span><br>
                <strong>Company Email:</strong> <a href="mailto:${escapeHtml(companyEmail)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(companyEmail)}</a><br>
                <strong>Company Phone:</strong><span style="color:#dc2626;">${escapeHtml(companyPhone)}</span><br>
                <strong>Domain Wanted:</strong> ${escapeHtml(domain)}<br>
                <strong>Number of Candidates</strong> ${escapeHtml(numofstudents)}<br>
                <strong>Experience Level:</strong> ${escapeHtml(experienceLevel || "-")}<br>
                <strong>Message:</strong> ${escapeHtml(message || "-")}<br>
                </p>

                <hr style="margin:30px 0;border:0;border-top:2px dashed #e5e7eb;">

                <p style="font-size:12px;color:#9ca3af;text-align:center;">
                — Sent from <span style="color:#2563eb;">BTC Internship Portal - Routes</span> —
                </p>
            </body>
            </html>
        `;

        const textContent = `Somebody Contacted
            Company Name:${companyName},
            Company Email:${companyEmail},
            Company Phone:${companyPhone},
            Domain Wanted:${domain},
            Number of Candidates:${numofstudents},
            Experience Level: ${experienceLevel},
            Message:${message}
        `;

        const emailOptions = {
            from: "BTC-Routes Hiring Request <noreply@btcglobal.info>", // works without domain verification
            to: process.env.ADMIN_EMAIL,
            reply_to: companyEmail,
            subject: `Hiring Request By - ${companyName}`,
            html: htmlContent,
            text: textContent,
        };

        const dat = await resend.emails.send(emailOptions);
        console.log("✅ Email sent:", dat);

        return res.status(200).json({message:"Contact mail sended successfully",data:hiringstuent,mail:dat})


    }catch(err){
        console.error(err)
        return res.status(500).json("Server Error")
    }
}

function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = {WantHiring}