/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import nodemailer from "nodemailer";
import path from "path";

import ejs from "ejs";
import { config } from "../config";
import AppError from "../errorHandlers/AppError";

const transporter = nodemailer.createTransport({
  host: config.EMAIL_SENDER_SMTP_HOST,
  secure: true,
  auth: {
    user: config.EMAIL_SENDER_SMTP_USER,
    pass: config.EMAIL_SENDER_SMTP_PASS,
  },
  port: Number(config.EMAIL_SENDER_SMTP_PORT),
});

interface ISendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateData,
  attachments,
  templateName,
}: ISendEmailOptions) => {
  try {
    const templatePath =
      config.NODE_ENV === "production"
        ? path.resolve(process.cwd(), `dist/app/templates/${templateName}.ejs`)
        : path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);

    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: config.EMAIL_SENDER_SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
  } catch (error: any) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email.");
  }
};
