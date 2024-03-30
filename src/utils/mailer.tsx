import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType == "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "e047fb790b8246", //❌
        pass: "ba1e50007e8b42", //❌
      },
    });

    const mailOptions = {
      from: "utkrishta@utkrishta.io",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      //   text: "Hello world?",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy paste the link below in your browser.<br>
      ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`,
    };

    const mailReposnse = await transport.sendMail(mailOptions);
    return mailReposnse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
