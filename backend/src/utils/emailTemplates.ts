import { config } from '../config/env.js';

const logoUrl = `${config.FRONTEND_URL || 'http://localhost:3000'}/logo.png`;

export const registrationOtpTemplate = (fullName: string | undefined, otp: string) => {
    const name = fullName || 'User';
    return {
        subject: 'Mã Xác Thực OTP - Snake Tech',
        text: `Xin chào ${name},\n\nMã xác thực của bạn là: ${otp}\nMã sẽ hết hạn trong 10 phút.\n\nNếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.\n\nTrân trọng,\nSnake Tech Team`,
        html: `
            <!doctype html>
            <html>
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
            </head>
            <body style="margin:0; font-family: 'Inter', Arial, Helvetica, sans-serif; background: #0f1724; color:#e6eef8;">
              <div style="padding:24px; display:flex; justify-content:center;">
                <div style="max-width:680px; width:100%; border-radius:18px; overflow:hidden; background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); border:1px solid rgba(148,163,184,0.06);">
                  
                  <div style="background:linear-gradient(90deg,#ef4444,#d946ef); padding:20px 24px; display:flex; align-items:center; gap:12px;">
                    <img src="logo4.png" alt="Snake Tech" style="width:48px; height:48px; object-fit:contain; border-radius:10px;"/>
                    <div>
                      <div style="color:#fff; font-weight:700; font-size:18px;">Snake Tech</div>
                      <div style="color:rgba(255,255,255,0.85); font-size:12px; margin-top:4px;">Premium gear for pros</div>
                    </div>
                  </div>

                  <div style="padding:28px; background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);">
                    <h2 style="text-align:center; color:#fff; margin:0 0 12px; font-size:22px;">Mã Xác Thực OTP</h2>
                    <p style="text-align:center; color:#cbd5e1; margin:0 0 20px;">Xin chào <strong style="color:#ff6b6b;">${name}</strong>,</p>

                    <div style="display:flex; justify-content:center; gap:8px; margin:18px 0;">
                      <div style="background:#fff; color:#0f1724; padding:16px 22px; border-radius:12px; font-size:24px; font-weight:700; letter-spacing:6px;">${otp}</div>
                    </div>

                    <div style="display:flex; justify-content:center; gap:6px; margin-bottom:16px;">
                      <div style="background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:999px; border:1px solid rgba(255,255,255,0.03); color:#fca5a5;">⏱ Hiệu lực: 5 phút</div>
                    </div>

                    <p style="text-align:center; color:#93c5fd; max-width:520px; margin:0 auto 8px;">Cảm ơn bạn đã chọn Snake Tech. Không chia sẻ mã này với bất kỳ ai.</p>

                    <div style="text-align:center; margin-top:22px;">
                      <a href="${config.FRONTEND_URL || 'http://localhost:3000'}" style="display:inline-block; padding:12px 20px; background:linear-gradient(90deg,#ef4444,#d946ef); color:#fff; text-decoration:none; border-radius:999px; font-weight:600;">Truy cập Snake Tech</a>
                    </div>
                  </div>

                  <div style="padding:16px 24px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                    <div style="color:#94a3b8; font-size:12px;">© ${new Date().getFullYear()} Snake Tech. Bảo lưu mọi quyền.</div>
                    <div style="display:flex; gap:10px;">
                      <a href="${config.FRONTEND_URL || 'http://localhost:3000'}" style="color:#94a3b8; font-size:12px; text-decoration:none;">Website</a>
                      <a href="${config.FRONTEND_URL || 'http://localhost:3000'}/privacy" style="color:#94a3b8; font-size:12px; text-decoration:none;">Privacy</a>
                    </div>
                  </div>
                </div>
              </div>
            </body>
            </html>
        `
    };
};
export const resetPasswordTemplate = (fullName: string | undefined, otp: string) => {
    const name = fullName || 'User';
    return {
        subject: 'Mã đặt lại mật khẩu - Snake Tech',
        text: `Xin chào ${name},\n\nMã đặt lại mật khẩu của bạn là: ${otp}\nMã sẽ hết hạn trong 10 phút.\n\nNếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.\n\nTrân trọng,\nSnake Tech Team`,
        html: `
            <!doctype html>
            <html>
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
            </head>
            <body style="margin:0; font-family: 'Inter', Arial, Helvetica, sans-serif; background: #0f1724; color:#e6eef8;">
              <div style="padding:24px; display:flex; justify-content:center;">
                <div style="max-width:680px; width:100%; border-radius:18px; overflow:hidden; background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); border:1px solid rgba(148,163,184,0.06);">
                  
                  <div style="background:linear-gradient(90deg,#06b6d4,#7c3aed); padding:20px 24px; display:flex; align-items:center; gap:12px;">
                    <img src="${logoUrl}" alt="Snake Tech" style="width:48px; height:48px; object-fit:contain; border-radius:10px;"/>
                    <div>
                      <div style="color:#fff; font-weight:700; font-size:18px;">Snake Tech</div>
                      <div style="color:rgba(255,255,255,0.85); font-size:12px; margin-top:4px;">Premium gear for pros</div>
                    </div>
                  </div>

                  <div style="padding:28px; background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);">
                    <h2 style="text-align:center; color:#fff; margin:0 0 12px; font-size:22px;">Mã đặt lại mật khẩu</h2>
                    <p style="text-align:center; color:#cbd5e1; margin:0 0 20px;">Xin chào <strong style="color:#7dd3fc;">${name}</strong>,</p>

                    <div style="display:flex; justify-content:center; gap:8px; margin:18px 0;">
                      <div style="background:#fff; color:#0f1724; padding:16px 22px; border-radius:12px; font-size:24px; font-weight:700; letter-spacing:6px;">${otp}</div>
                    </div>

                    <div style="display:flex; justify-content:center; gap:6px; margin-bottom:16px;">
                      <div style="background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:999px; border:1px solid rgba(255,255,255,0.03); color:#93c5fd;">⏱ Hiệu lực: 5 phút</div>
                    </div>

                    <p style="text-align:center; color:#93c5fd; max-width:520px; margin:0 auto 8px;">Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>

                    <div style="text-align:center; margin-top:22px;">
                      <a href="${config.FRONTEND_URL || 'http://localhost:3000'}" style="display:inline-block; padding:12px 20px; background:linear-gradient(90deg,#06b6d4,#7c3aed); color:#fff; text-decoration:none; border-radius:999px; font-weight:600;">Truy cập Snake Tech</a>
                    </div>
                  </div>

                  <div style="padding:16px 24px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                    <div style="color:#94a3b8; font-size:12px;">© ${new Date().getFullYear()} Snake Tech. Bảo lưu mọi quyền.</div>
                    <div style="display:flex; gap:10px;">
                      <a href="${config.FRONTEND_URL || 'http://localhost:3000'}" style="color:#94a3b8; font-size:12px; text-decoration:none;">Website</a>
                      <a href="${config.FRONTEND_URL || 'http://localhost:3000'}/privacy" style="color:#94a3b8; font-size:12px; text-decoration:none;">Privacy</a>
                    </div>
                  </div>
                </div>
              </div>
            </body>
            </html>
        `
    };
};

export default {
  registrationOtpTemplate,
  resetPasswordTemplate,
};


