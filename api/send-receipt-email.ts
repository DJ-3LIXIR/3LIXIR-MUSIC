import nodemailer from "nodemailer";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3LIXIR - Order Receipt</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #000000; }
        .top-banner { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); height: 12px; }
        .header { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 50px 20px; text-align: center; border-bottom: 4px solid #FFA500; }
        .logo { font-size: 32px; font-weight: bold; color: #000000; letter-spacing: 2px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 20px; }
        .message { font-size: 16px; color: #cccccc; line-height: 1.6; margin-bottom: 30px; }
        .order-summary { background-color: #1a1a1a; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 1px solid #333333; }
        .order-header { font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #FFD700; }
        .order-detail { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #cccccc; }
        .order-detail-label { font-weight: 500; color: #ffffff; }
        .items-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #333333; }
        .items-header { font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 15px; }
        .item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #333333; }
        .item:last-child { border-bottom: none; }
        .item-name { font-size: 14px; color: #ffffff; font-weight: 500; }
        .item-price { font-size: 14px; color: #cccccc; }
        .total-section { margin-top: 20px; padding-top: 20px; border-top: 2px solid #FFD700; }
        .total { display: flex; justify-content: space-between; font-size: 18px; font-weight: 600; color: #ffffff; }
        .download-section { background-color: #1a1a1a; border-radius: 8px; padding: 25px; margin-bottom: 30px; text-align: center; border: 1px solid #333333; }
        .download-header { font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 20px; }
        .download-btn { display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000000; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 15px; margin: 8px; }
        .license-section { background-color: #1a1a1a; border-left: 4px solid #FFD700; padding: 20px; margin-bottom: 30px; border-radius: 4px; }
        .license-header { font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 10px; }
        .license-text { font-size: 14px; color: #cccccc; line-height: 1.6; }
        .legal-links { margin-top: 20px; padding-top: 20px; border-top: 1px solid #333333; text-align: center; }
        .legal-link { color: #FFA500; text-decoration: none; font-size: 13px; margin: 0 10px; }
        .footer { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000000; padding: 30px; text-align: center; }
        .footer-text { font-size: 13px; color: #000000; line-height: 1.6; }
        .footer-logo { font-size: 20px; font-weight: bold; color: #000000; letter-spacing: 2px; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="top-banner" style="background-color: #FFD700; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); height: 12px;"></div>
        <div class="header" style="background-color: #FFD700; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 50px 20px; text-align: center; border-bottom: 4px solid #FFA500; color: #000000;">
            <div class="logo" style="font-size: 32px; font-weight: bold; color: #000000; letter-spacing: 2px;">3LIXIR</div>
        </div>
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
            {{license_section_html}}
            <div class="legal-links">
                <a href="{{terms_url}}" class="legal-link">Terms of Service</a>
                <span style="color: #666666;">|</span>
                <a href="{{privacy_url}}" class="legal-link">Privacy Policy</a>
                <span style="color: #666666;">|</span>
                <a href="{{support_url}}" class="legal-link">Support</a>
            </div>
        </div>
        <div class="footer" style="background-color: #FFD700; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000000; padding: 30px; text-align: center;">
            <div class="footer-logo" style="font-size: 20px; font-weight: bold; color: #000000; letter-spacing: 2px; margin-bottom: 15px;">3LIXIR</div>
            <div class="footer-text" style="font-size: 13px; color: #000000; line-height: 1.6;">Premium beats for serious artists.<br>Need help? Contact us at receipt@3lixir.com<br><br>© {{year}} 3LIXIR. All rights reserved.</div>
        </div>
    </div>
</body>
</html>`;

interface LicenseInfo {
  type: "custom" | "subscription" | "standard" | "none";
  licenseText: string;
  licenseUrl: string;
}

async function determineLicenseForOrder(
  userId: string,
  orderId: string,
  items: any[],
): Promise<LicenseInfo> {
  // Check if order contains beats (not subscription or license products)
  const beatItems = items.filter(
    (item: any) =>
      !item.id.startsWith("subscription-") && !item.id.startsWith("license-"),
  );

  // If this is a subscription purchase (no beats, just subscription)
  const subscriptionItem = items.find((item: any) =>
    item.id.startsWith("subscription-"),
  );

  if (subscriptionItem && beatItems.length === 0) {
    // This is a subscription purchase - show subscription license
    return {
      type: "subscription",
      licenseText:
        "Subscription License - Unlimited use while your subscription is active. You can download and view your personalized license card anytime.",
      licenseUrl: `${process.env.SITE_URL || "https://3lixir.com"}/license/subscription`,
    };
  }

  // If no beats in order, no license section needed
  if (beatItems.length === 0) {
    return {
      type: "none",
      licenseText: "",
      licenseUrl: "",
    };
  }

  // For beat purchases, check each beat for custom license
  for (const beat of beatItems) {
    const beatName = beat.title || beat.name;

    // Check if a custom license exists for this beat
    const { data: customLicense, error: customLicenseError } = await supabase
      .from("custom_licenses")
      .select("*")
      .eq("user_id", userId)
      .eq("song_name", beatName)
      .eq("order_id", orderId)
      .maybeSingle();

    if (!customLicenseError && customLicense) {
      // Custom license exists for this beat
      return {
        type: "custom",
        licenseText: `Custom License - A personalized license has been created for "${beatName}". Click below to view and download your custom license certificate.`,
        licenseUrl: `${process.env.SITE_URL || "https://3lixir.com"}/license/custom/${customLicense.id}`,
      };
    }
  }

  // No custom license found, check if user has active subscription
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", userId)
    .single();

  if (
    !profileError &&
    profile &&
    profile.subscription_tier &&
    profile.subscription_tier !== "tier_zero"
  ) {
    // User has active subscription
    return {
      type: "subscription",
      licenseText: `Subscription License - As a ${profile.subscription_tier.replace("tier_", "").toUpperCase()} member, your beats are covered under your subscription license. View and download your license card anytime.`,
      licenseUrl: `${process.env.SITE_URL || "https://3lixir.com"}/license/subscription`,
    };
  }

  // Default to standard license
  return {
    type: "standard",
    licenseText:
      "Standard License - Commercial use permitted with attribution. View the full license agreement for details on usage rights and restrictions.",
    licenseUrl: `${process.env.SITE_URL || "https://3lixir.com"}/info?section=licensing`,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderData } = req.body;

    if (!orderData || !orderData.customer_email) {
      return res.status(400).json({ error: "Missing required order data" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ZOHO_EMAIL_RECEIPT || "receipt@3lixirmusic.com",
        pass: process.env.ZOHO_PASSWORD_RECEIPT || "G7KPtMtXZAD5",
      },
    });

    // Build items HTML
    let itemsHtml = "";
    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach((item: any) => {
        itemsHtml += `<div class="item"><span class="item-name">${item.name}</span><span class="item-price">${item.price}</span></div>`;
      });
    }

    // Build download links HTML
    let downloadLinksHtml = "";
    if (orderData.download_links && orderData.download_links.length > 0) {
      orderData.download_links.forEach((link: any) => {
        downloadLinksHtml += `<a href="${link.url}" class="download-btn" style="display: inline-block; background-color: #FFD700; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000000; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 15px; margin: 8px;">Download ${link.name}</a>`;
      });
    }

    // Determine which license to show
    const licenseInfo = await determineLicenseForOrder(
      orderData.user_id,
      orderData.order_id,
      orderData.items || [],
    );

    // Build license section HTML
    let licenseSectionHtml = "";
    if (licenseInfo.type !== "none") {
      licenseSectionHtml = `
        <div class="license-section">
          <div class="license-header">📄 Your License</div>
          <div class="license-text">
            ${licenseInfo.licenseText}
            <br><br>
            <a href="${licenseInfo.licenseUrl}" style="color: #FFA500; font-weight: 600;">View & Download License →</a>
          </div>
        </div>
      `;
    }

    // Replace template variables
    const emailHtml = emailTemplate
      .replace(/{{customer_name}}/g, orderData.customer_name || "Customer")
      .replace(/{{order_id}}/g, orderData.order_id || "")
      .replace(
        /{{order_date}}/g,
        orderData.order_date || new Date().toLocaleDateString(),
      )
      .replace(/{{payment_method}}/g, orderData.payment_method || "PayPal")
      .replace(/{{total_amount}}/g, orderData.total_amount || "$0.00")
      .replace(/{{items_html}}/g, itemsHtml)
      .replace(/{{download_links_html}}/g, downloadLinksHtml)
      .replace(/{{license_section_html}}/g, licenseSectionHtml)
      .replace(
        /{{terms_url}}/g,
        orderData.terms_url ||
          `${process.env.SITE_URL || "https://3lixir.com"}/shop/contract/terms`,
      )
      .replace(
        /{{privacy_url}}/g,
        orderData.privacy_url ||
          `${process.env.SITE_URL || "https://3lixir.com"}/info?section=privacy`,
      )
      .replace(
        /{{support_url}}/g,
        orderData.support_url ||
          `${process.env.SITE_URL || "https://3lixir.com"}/support`,
      )
      .replace(/{{year}}/g, new Date().getFullYear().toString());

    await transporter.sendMail({
      from: process.env.ZOHO_EMAIL_RECEIPT || "receipt@3lixirmusic.com",
      to: orderData.customer_email,
      subject: `3LIXIR - Order Receipt #${orderData.order_id || "N/A"}`,
      html: emailHtml,
    });

    return res
      .status(200)
      .json({ success: true, message: "Receipt email sent successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
