const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


async function sendVendorRequestToAdmin({userEmail, userName, instagram, vendortName, vendorProject}){
    const subject = `New Vendor Request - ${userName}`;
    const text=` Name: ${userName} Email: ${userEmail} Instagram: ${instagram} Project: ${vendortName}
    About:${vendorProject} Admin Panel: ${process.env.BASE_URL}/admin/vendor-requests`;

    await transporter.sendMail({ from: process.env.EMAIL_USER, to: process.env.ADMIN_EMAIL,subject,text,});
}


async function sendDecisionToUser(toEmail, userName, decision, adminNote) {
  let subject;
  let text;

  if (decision === "approved") {
    subject = "Your Vendor Request Approved";
    text = `Hi ${userName},
    Your vendor request has been approved
    You can now create/edit your products.
    Thanks,
    Azyai Team`;} 

  else {
        subject = " Your Vendor Request Rejected";
        text = `Hi ${userName},

        Your vendor request has been rejected 
        Admin note: ${adminNote ? adminNote : "No note provided"}
        You can submit a new request later.
        Thanks,
        Azyai Team`;}

  await transporter.sendMail({ from: process.env.EMAIL_USER, to: toEmail, subject: subject, text: text, });
}

module.exports = { sendVendorRequestToAdmin, sendDecisionToUser };
