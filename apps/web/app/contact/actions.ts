"use server";

// @ts-ignore
import nodemailer from "nodemailer";

export async function sendContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required" };
  }

  try {
    const appPassword = process.env.GMAIL_APP_PASSWORD;
    
    if (!appPassword) {
      return { 
        success: false, 
        error: "Server configuration missing: GMAIL_APP_PASSWORD is not set in the .env file. Please add it and restart the dev server." 
      };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kishangupta.code@gmail.com",
        pass: appPassword,
      },
    });

    const mailOptions = {
      from: "kishangupta.code@gmail.com",
      to: "kishangupta.code@gmail.com",
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message || "Failed to send message" };
  }
}
