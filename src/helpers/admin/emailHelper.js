import nodemailer from "nodemailer";

// email configuration and send email
const emailProcessor = async (emailBody) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    //  send mail with the defined transport object
    let info = await transporter.sendMail(emailBody);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
};
// make sure the emailData has firstName, email and url.
export const verificationEmail = (emailData) => {
  const emailBody = {
    from: '"PK-ECOM 👻" <pradeepdhital124@gmail.com>', // sender address
    to: emailData.email, // list of receivers
    subject: "Email verification", // Subject line
    text: `Hi ${emailData.firstName} please follow the link to verify the email: ${emailData.url}`, // plain text body
    html: `<p> Hi ${emailData.firstName}</p>
    <br/>
    <br/>
    <p>Please follow the link to verify your email</p>
    <br/>
    <br/>
    <p><a href="${emailData.url}">Verify email</a></p>
    <br/>
    <br/>
    <p> 
    Regards, <br/>
    PK-ECOM
    </p>`, // html body
  };
  emailProcessor(emailBody);
};

// email to notify the email has been verified
export const userVerifiedNotification = (emailData) => {
  const emailBody = {
    from: '"PK-ECOM 👻" <pradeepdhital124@gmail.com>', // sender address
    to: emailData.email, // list of receivers
    subject: "Account verified", // Subject line
    text: `Hi ${emailData.firstName} Your account has been verified, you may login now ${process.env.ADMIN_ROOT_DOMAINN}`, // plain text body
    html: `<p> Hi ${emailData.firstName}</p>
    <br/>
    <br/>
    <p> Your account has been verified, you may <a href="${process.env.ADMIN_ROOT_DOMAIN}">login</a> now.</p>
    <br/>
    <br/>
    <br/>
    <br/>
    <p> 
    Regards, <br/>
    PK-ECOM
    </p>`, // html body
  };
  emailProcessor(emailBody);
};

// send OTP to the user email to reset password
export const otpNotification = (emailData) => {
  const emailBody = {
    from: '"PK-ECOM 👻" <pradeepdhital124@gmail.com>', // sender address
    to: emailData.email, // list of receivers
    subject: "OTP for password update", // Subject line
    text: `Hi ${emailData.firstName}, please use the following OTP to reset your password ${emailData.OTP}`, // plain text body
    html: `<p> Hi ${emailData.firstName}</p>
    <br/>
    <br/>
    <p> Please use the following OTP to reset your password.</p>
    <p>${emailData.OTP}</p>
    <br/>
    <br/>
    <br/>
    <br/>
    <p> 
    Regards, <br/>
    PK-ECOM
    </p>`, // html body
  };
  emailProcessor(emailBody);
};
