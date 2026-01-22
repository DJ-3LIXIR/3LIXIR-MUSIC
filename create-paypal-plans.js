// PayPal Subscription Plan Creator
// Run this once to create your Gold, Diamond, and Platinum subscription plans

const PAYPAL_CLIENT_ID =
  "AWPBOsWuA1Oioy5Oh_vjE6Ozb3bsRHL3XQGgpqAouIPUUIaJvVfJTu4YIxeI2vuNzun5cYkOb6GtFjuk";
const PAYPAL_SECRET =
  "EDXvIbB1fdk_R_QG0C6q4ya_H1lCTnjfDv3NZAZ8baOKs2vZw_IIuP1vBgI_rlUggcNsCox65eYgFYoZ";
const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com"; // Sandbox URL

// Get PayPal Access Token
async function getAccessToken() {
  console.log("Client ID:", PAYPAL_CLIENT_ID);
  console.log(
    "Secret (first 10 chars):",
    PAYPAL_SECRET.substring(0, 10) + "...",
  );

  const credentials = `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`;
  console.log("Credentials length:", credentials.length);

  const auth = btoa(credentials);
  console.log("Encoded auth (first 20 chars):", auth.substring(0, 20) + "...");

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  console.log("Access Token Response:", JSON.stringify(data, null, 2));

  if (data.error) {
    throw new Error(`Failed to get access token: ${data.error_description}`);
  }

  return data.access_token;
}

// Create a Product
async function createProduct(accessToken, name, description) {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      description: description,
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });

  const data = await response.json();
  console.log("Product API Response:", JSON.stringify(data, null, 2));
  return data.id;
}

// Create a Billing Plan
async function createBillingPlan(accessToken, productId, planName, price) {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      name: planName,
      description: `${planName} subscription plan`,
      billing_cycles: [
        {
          frequency: {
            interval_unit: "MONTH",
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // 0 = infinite
          pricing_scheme: {
            fixed_price: {
              value: price,
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }),
  });

  const data = await response.json();
  console.log("Billing Plan API Response:", JSON.stringify(data, null, 2));
  return data;
}

// Main function to create all plans
async function createAllPlans() {
  console.log("Getting PayPal access token...");
  const accessToken = await getAccessToken();

  const plans = [
    {
      name: "Gold Tier",
      price: "9.99",
      description: "Gold tier subscription for 3lixir Music",
    },
    {
      name: "Diamond Tier",
      price: "19.99",
      description: "Diamond tier subscription for 3lixir Music",
    },
    {
      name: "Platinum Tier",
      price: "39.99",
      description: "Platinum tier subscription for 3lixir Music",
    },
  ];

  for (const plan of plans) {
    console.log(`\nCreating ${plan.name}...`);

    // Create product
    const productId = await createProduct(
      accessToken,
      plan.name,
      plan.description,
    );
    console.log(`Product ID: ${productId}`);

    // Create billing plan
    const billingPlan = await createBillingPlan(
      accessToken,
      productId,
      plan.name,
      plan.price,
    );
    console.log(`Plan ID: ${billingPlan.id}`);
    console.log(`Plan Status: ${billingPlan.status}`);

    console.log(`✅ ${plan.name} created successfully!`);
    console.log(`   Save this Plan ID: ${billingPlan.id}`);
  }

  console.log(
    "\n🎉 All plans created! Save those Plan IDs - you'll need them later.",
  );
}

// Run it
createAllPlans().catch(console.error);
