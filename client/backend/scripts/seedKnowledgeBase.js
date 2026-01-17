// backend/scripts/seedKnowledgeBase.js
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // Use service role key for admin operations
);

const sampleArticles = [
  {
    title: "How to Reset Your Password",
    content: `To reset your password:
1. Go to the login page and click "Forgot Password"
2. Enter your email address
3. Check your email for a password reset link
4. Click the link and enter your new password
5. Confirm your new password

Your password must:
- Be at least 8 characters long
- Contain at least one uppercase letter
- Contain at least one number
- Contain at least one special character

If you don't receive the reset email within 5 minutes, check your spam folder or contact IT support.`,
    category: "Account",
    tags: ["password", "login", "security", "reset"],
  },
  {
    title: "VPN Connection Issues",
    content: `If you're having trouble connecting to the VPN:
1. Check your internet connection
2. Verify you're using the correct VPN credentials
3. Restart the VPN client
4. Try disconnecting and reconnecting
5. Ensure your VPN client is up to date

Common VPN errors:
- "Connection timeout" - Usually indicates firewall or network issues
- "Authentication failed" - Check your username and password
- "Server not responding" - VPN server may be down, contact IT

For remote workers, the VPN must be active to access company resources.`,
    category: "Network",
    tags: ["vpn", "connection", "remote", "network"],
  },
  {
    title: "Installing Software on Company Devices",
    content: `To install software on your company device:
1. Check if the software is in the approved software list
2. Submit a software request ticket if not approved
3. Wait for IT approval (usually 1-2 business days)
4. IT will either install it remotely or provide download instructions

Approved software includes:
- Microsoft Office Suite
- Zoom
- Slack
- Chrome, Firefox, Edge browsers
- Adobe Acrobat Reader

For security reasons, you cannot install software without IT approval. Unauthorized software installations may result in policy violations.`,
    category: "Software",
    tags: ["software", "installation", "approval", "policy"],
  },
  {
    title: "Printer Not Working",
    content: `If your printer isn't working:
1. Check if the printer is powered on
2. Verify the printer is connected to the network
3. Check if there's paper and toner/ink
4. Restart the printer
5. Remove and re-add the printer in your device settings
6. Update printer drivers

Common printer issues:
- "Offline" status - Reconnect to network or restart printer
- Print jobs stuck in queue - Clear the print queue
- Poor print quality - Check toner levels or run cleaning cycle

If issues persist after troubleshooting, create a support ticket.`,
    category: "Hardware",
    tags: ["printer", "hardware", "printing", "troubleshooting"],
  },
  {
    title: "Email Forwarding Setup",
    content: `To set up email forwarding:
1. Log into your email account
2. Go to Settings > Forwarding and POP/IMAP
3. Click "Add a forwarding address"
4. Enter the email address you want to forward to
5. Click "Next" and verify the confirmation code
6. Choose whether to keep copies in your inbox

Note: Email forwarding to external addresses requires manager approval for security reasons. Submit a request ticket for external forwarding.
Auto-forwarding within the company domain is allowed without approval.`,
    category: "Software",
    tags: ["email", "forwarding", "outlook", "settings"],
  },
  {
    title: "Slow Computer Performance",
    content: `If your computer is running slow:
1. Close unnecessary programs and browser tabs
2. Restart your computer
3. Check for Windows updates
4. Run disk cleanup to free up space
5. Check for malware with company antivirus
6. Clear browser cache and cookies

Performance tips:
- Keep desktop clean (minimal icons)
- Don't have too many programs start at boot
- Regularly clear downloads folder
- Ensure at least 10GB free disk space

If performance doesn't improve, your device may need a hardware upgrade. Create a ticket for IT assessment.`,
    category: "Hardware",
    tags: ["performance", "slow", "computer", "troubleshooting"],
  },
  {
    title: "Two-Factor Authentication Setup",
    content: `To enable two-factor authentication (2FA):
1. Log into your account settings
2. Navigate to Security > Two-Factor Authentication
3. Choose your 2FA method (app or SMS)
4. For app-based: Scan QR code with Google Authenticator or Authy
5. For SMS: Enter your phone number
6. Enter the verification code to confirm
7. Save your backup codes in a secure location

2FA is required for:
- All remote access
- Admin accounts
- Access to sensitive data

Keep your backup codes safe - you'll need them if you lose access to your 2FA device.`,
    category: "Account",
    tags: ["2fa", "security", "authentication", "login"],
  },
  {
    title: "Accessing Company Shared Drives",
    content: `To access shared drives:

Windows:
1. Open File Explorer
2. Click "Map Network Drive"
3. Choose a drive letter
4. Enter: \\\\fileserver\\sharename
5. Check "Reconnect at sign-in"
6. Enter your credentials

Mac:
1. Finder > Go > Connect to Server
2. Enter: smb://fileserver/sharename
3. Click Connect
4. Enter your credentials

Common shared drives:
- Finance: \\\\fileserver\\finance
- HR: \\\\fileserver\\hr
- Projects: \\\\fileserver\\projects

Access is based on your role and department. Request access via IT ticket if needed.`,
    category: "Network",
    tags: ["shared drives", "network", "file access", "storage"],
  },
];

async function seedKnowledgeBase() {
  try {
    console.log("🔄 Connecting to Supabase...");

    // Clear existing articles
    const { error: deleteError } = await supabase
      .from("knowledge_base")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all rows

    if (deleteError) {
      console.log("⚠️  Warning during delete:", deleteError.message);
    } else {
      console.log("🗑️  Cleared existing knowledge base");
    }

    // Insert sample articles
    const { data, error: insertError } = await supabase
      .from("knowledge_base")
      .insert(sampleArticles)
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log(`✅ Inserted ${sampleArticles.length} knowledge base articles`);
    console.log("\n📚 Sample articles:");
    sampleArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.category})`);
    });

    console.log("\n✨ Knowledge base seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
}

seedKnowledgeBase();
