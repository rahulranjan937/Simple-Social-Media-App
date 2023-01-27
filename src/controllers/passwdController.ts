import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

import { UserService } from '@interfaces/IUser';
import { ForgetPasswordInput, ResetPasswordInput } from '@/schema/userSchema';

import { MAILGUN_API_KEY, MAILGUN_DOMAIN, FROM_EMAIL, HOST } from '@config';

export class PasswdController {
  private userService = new UserService();
  private mailgun = new Mailgun(FormData);
  private client = this.mailgun.client({ username: 'api', key: MAILGUN_API_KEY as string });

  public forgotPassword = async (req: Request<{}, ForgetPasswordInput['body']>, res: Response, next: NextFunction) => {
    const payload = {
      email: req.body.email,
    };

    try {
      const user = await this.userService.getUserByQuery({ email: payload.email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      // Hash token and set to resetPasswordToken field

      await this.userService.forgetPasswordToken(resetToken);

      // Create reset url
      const resetUrl = `${HOST}/api/v1/passwd/reset/${resetToken}`;

      // To send email

      // Template for email message
      const data = {
        from: FROM_EMAIL,
        to: `${user.name} <${user.email}>`,
        subject: 'Password Reset Request',
        html: `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Reset your password</title>
            <style>
              /* Add some basic styling */
              body {
                font-family: sans-serif;
                margin: 0 auto;
                max-width: 600px;
                padding: 20px;
              }
              @font-face {
                font-family: 'Alegreya SC';
                src: url('https://fonts.googleapis.com/css2?family=Alegreya+SC&display=swap') format('truetype');
              }
              header {
                margin: 0 auto;
                text-align: center;
                font-size: 32px;
                font-weight: bold;
                color: #333;
                font-family: 'Alegreya SC', sans-serif;
              }
              h1 {
                color: #333;
              }
              a._reset {
                color: #fff;
                background-color: #22bc66;
                display: inline-block;
                text-decoration: none;
                border-radius: 3px;
                box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
                -webkit-text-size-adjust: none;
                box-sizing: border-box;
                border-color: #22bc66;
                border-style: solid;
                border-width: 10px 18px;
              }
              a:hover {
                color: #23527c;
              }
            </style>
          </head>
          <body>
            <header>Data Forms</header>
            <hr />
            <h1>Reset your password</h1>
        
            <p style="margin-top: 0; color: #333333; font-size: 22px; font-weight: bold; text-align: left">
              Dear <b>${user.name}</b>,
            </p>
        
            <p style="font-size: 16px; line-height: 1.625; color: #51545e; margin: 0.4em 0 1.1875em">
              We received a request to reset the password for your account. If you did not make this request, please ignore this
              email.To reset your password, please click on the link below:
            </p>
        
            <a
              class="_reset"
              href="${resetUrl}"
              style="word-break: break-word; font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; font-size: 16px"
              target="_blank"
              >Reset your password</a
            >
        
            <p style="font-size: 16px; line-height: 1.625; color: #51545e; margin: 0.4em 0 1.1875em">
              <strong>This password reset is only valid for the next 24 hours.</strong>
            </p>
            <p style="font-size: 16px; line-height: 1.625; color: #51545e; margin: 0.4em 0 1.1875em">
              If you have any questions or need further assistance, please contact our support team at
              <a id="_support" href="mailto:support@dataforms.com" style="color: #3869d4">support@dataforms.com</a>.
            </p>
            <p style="font-size: 16px; line-height: 1.625; color: #51545e; margin: 0.4em 0 1.1875em">
              Thank you,<br />The DataFroms team
            </p>
            <hr />
            <footer style="font-size: 14px; line-height: 1.625; color: #51545e; margin: 0.4em 0 1.1875em">
              <p
                s
                style="font-size: 13px; line-height: 1.625; text-align: center; color: #a8aaaf; margin: 0.4em 0 1.1875em"
                align="center"
              >
                © 2022 DataForms. All rights reserved. <br />1234 Street Rd. <br />Suite 1234
              </p>
            </footer>
          </body>
        </html>`,
      };

      try {
        this.client.messages
          .create(MAILGUN_DOMAIN as string, data)
          .then((msg) => {
            console.log(msg);
          })
          .catch((err: any) => {
            console.error(err);
          });
        res.status(200).json({ message: 'Email sent' });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Email could not be sent' });
      }
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public resetPassword = async (req: Request<{}, ResetPasswordInput['body']>, res: Response, next: NextFunction) => {
    const payload = {
      password: req.body.password,
      token: req.body.token,
    };

    try {
      const user = await this.userService.getUserByToken(payload.token);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(payload.password, salt);
      const newChangedPassword = (user.password = hash);
      const newToken = (user.resetPasswordToken = '');

      await this.userService.resetPassword(newChangedPassword, newToken);

      res.status(200).json({
        message: 'Password reset successful',
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body as { oldPassword: string; newPassword: string };
    const { id } = res.locals.user.id;

    try {
      const user = await this.userService.getUserByQuery({ _id: id });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      const newChangedPassword = (user.password = hash);

      await this.userService.findAndUpdateUser({ _id: id }, { password: newChangedPassword }, { new: true });

      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public changePasswordWithToken = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: 'Passwd API called, Under construction 🚧',
    });
  };
}
