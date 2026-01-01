import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

type SendMailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

const createTransporter = async (): Promise<nodemailer.Transporter> => {
  // If env vars provided, use them
  if (config.EMAIL_HOST && config.EMAIL_USER && config.EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      secure: config.EMAIL_SECURE,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    });

    // Verify transporter connection and log result
    transporter.verify().then(() => {
      console.log(`Mailer: connected to SMTP ${config.EMAIL_HOST}:${config.EMAIL_PORT} as ${config.EMAIL_USER}`);
    }).catch((err) => {
      console.error('Mailer verify failed:', err && err.message ? err.message : err);
    });

    return transporter;
  }

  // Fallback: create ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

export const sendMail = async ({ to, subject, text, html }: SendMailOptions) => {
  if (!transporterPromise) {
    transporterPromise = createTransporter();
  }

  const transporter = await transporterPromise;
  const info = await transporter.sendMail({
    from: `"Snake Tech" <${config.EMAIL_USER || 'no-reply@snaketech.local'}>`,
    to,
    subject,
    text,
    html,
  });

  // If using ethereal, log preview URL
  try {
    // @ts-ignore - nodemailer typed might include getTestMessageUrl
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.log(`Preview email URL: ${preview}`);
    }
  } catch (e) {
    // ignore
  }

  return info;
};

export default {
  sendMail,
};

