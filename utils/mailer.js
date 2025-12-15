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
    const text=` Name: ${userName} Email: ${userEmail} Instagram: ${instagram} Project: ${projectName}
    About:${aboutProject} Admin Panel: ${process.env.BASE_URL}/admin/vendor-requests`;

    await transporter.sendMail({ from: process.env.EMAIL_USER, to: process.env.ADMIN_EMAIL,subject,text,});
}

