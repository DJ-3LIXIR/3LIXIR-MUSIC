import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3LIXIR - Order Receipt</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: bold; color: #000000; letter-spacing: 2px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 24px; font-weight: 600; color: #1a1a1a; margin-bottom: 20px; }
        .message { font-size: 16px; color: #4a4a4a; line-height: 1.6; margin-bottom: 30px; }
        .order-summary { background-color: #f9f9f9; border-radius: 8px; padding: 25px; margin-bottom: 30px; }
        .order-header { font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #FFD700; }
        .order-detail { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #4a4a4a; }
        .order-detail-label { font-weight: 500; color: #1a1a1a; }
        .items-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
        .items-header { font-size: 16px; font-weight: 600; color: #1a1a1a; margin-bottom: 15px; }
        .item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
        .item:last-child { border-bottom: none; }
        .item-name { font-size: 14px; color: #1a1a1a; font-weight: 500; }
        .item-price { font-size: 14px; color: #4a4a4a; }
        .total-section { margin-top: 20px; padding-top: 20px; border-top: 2px solid #FFD700; }
        .total { display: flex; justify-content: space-between; font-size: 18px; font-weight: 600; color: #1a1a1a; }
        .download-section { background-color: #f9f9f9; border-radius: 8px; padding: 25px; margin-bottom: 30px; text-align: center; }
        .download-header { font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 20px; }
        .download-btn { display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000000; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 15px; margin: 8px; }
        .license-section { background-color: #fffbf0; border-left: 4px solid #FFD700; padding: 20px; margin-bottom: 30px; border-radius: 4px; }
        .license-header { font-size: 16px; font-weight: 600; color: #1a1a1a; margin-bottom: 10px; }
        .license-text { font-size: 14px; color: #4a4a4a; line-height: 1.6; }
        .legal-links { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; }
        .legal-link { color: #FFA500; text-decoration: none; font-size: 13px; margin: 0 10px; }
        .footer { background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; }
        .footer-text { font-size: 13px; color: #cccccc; line-height: 1.6; }
        .footer-logo { font-size: 20px; font-weight: bold; color: #FFD700; letter-spacing: 2px; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header"><div class="logo">3LIXIR</div></div>
        <div class="content">
            <div class="greeting">Thank You for Your Purchase!</div>
            <div class="message">Hi {{customer_name}},<br><br>Your order has been confirmed and your beats are ready to download. We appreciate your support and can't wait to hear what you create!</div>
            <div class="order-summary">
                <div class="order-header">Order Summary</div>
                <div class="order-detail"><span class="order-detail-label">Order ID:</span><span>{{order_id}}</span></div>
                <div class="order-detail"><span class="order-detail-label">Date:</span><span>{{order_date}}</span></div>
                <div class="order-detail"><span class="order-detail-label">Payment Method:</span><span>{{payment_method}}</span></div>
                <div class="items-section"><div class="items-header">Items Purchased</div>{{items_html}}</div>
                <div class="total-section"><div class="total"><span>Total:</span><span>{{total_amount}}</span></div></div>
            </div>
            <div class="download-section"><div class="download-header">Download Your Beats</div>{{download_links_html}}</div>
            <div class="license-section">
                <div class="license-header">📄 Your License</div>
                <div class="license-text">{{license_type}}<br><br><a href="{{license_url}}" style="color: #FFA500; font-weight: 600;">View Full License Agreement →</a></div>
            </div>
            <div class="legal-links">
                <a href="{{terms_url}}" class="legal-link">Terms of Service</a>
                <span style="color: #e0e0e0;">|</span>
                <a href="{{privacy_url}}" class="legal-link">Privacy Policy</a>
                <span style="color: #e0e0e0;">|</span>
                <a href="{{support_url}}" class="legal-link">Support</a>
            </div>
        </div>
        <div class="footer">
            <div class="footer-logo">3LIXIR</div>
            <div class="footer-text">Premium beats for serious artists.<br>Need help? Contact us at support@3lixir.com<br><br>© {{year}} 3LIXIR. All rights reserved.</div>
        </div>
    </div>
</body>
</html>`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderData } = req.body;

    if (!orderData || !orderData.customer_email) {
      return res.status(400).json({ error: 'Missing required order data' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ZOHO_EMAIL || 'support@3lixirmusic.com',
        pass: process.env.ZOHO_PASSWORD || 'G7KPtMtXZAD5',
      },
    });

    let itemsHtml = '';
    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach((item: any) => {
        itemsHtml += `<div class="item"><span class="item-name">${item.name}</span><span class="item-price">${item.price}</span></div>`;
      });
    }

    let downloadLinksHtml = '';
    if (orderData.download_links && orderData.download_links.length > 0) {
      orderData.download_links.forEach((link: any) => {
        downloadLinksHtml += `<a href="${link.url}" class="download-btn">Download ${link.name}</a>`;
      });
    }

    const emailHtml = emailTemplate
      .replace(/{{customer_name}}/g, orderData.customer_name || 'Customer')
      .replace(/{{order_id}}/g, orderData.order_id || '')
      .replace(/{{order_date}}/g, orderData.order_date || new Date().toLocaleDateString())
      .replace(/{{payment_method}}/g, orderData.payment_method || 'PayPal')
      .replace(/{{total_amount}}/g, orderData.total_amount || '$0.00')
      .replace(/{{items_html}}/g, itemsHtml)
      .replace(/{{download_links_html}}/g, downloadLinksHtml)
      .replace(/{{license_type}}/g, orderData.license_type || 'Standard License')
      .replace(/{{license_url}}/g, orderData.license_url || '#')
      .replace(/{{terms_url}}/g, orderData.terms_url || '#')
      .replace(/{{privacy_url}}/g, orderData.privacy_url || '#')
      .replace(/{{support_url}}/g, orderData.support_url || '#')
      .replace(/{{year}}/g, new Date().getFullYear().toString());

    await transporter.sendMail({
      from: process.env.ZOHO_EMAIL || 'support@3lixirmusic.com',
      to: orderData.customer_email,
      subject: `3LIXIR - Order Receipt #${orderData.order_id || 'N/A'}`,
      html: emailHtml,
    });

    return res.status(200).json({ success: true, message: 'Receipt email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
