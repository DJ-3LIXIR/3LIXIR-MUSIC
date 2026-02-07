#!/bin/bash

# Automated Shop.tsx Profile Table Integration Script
# This will automatically modify your shop.tsx file

set -e  # Exit on any error

SHOP_FILE="client/src/pages/Shop.tsx"
BACKUP_FILE="client/src/pages/Shop.tsx.backup.$(date +%Y%m%d_%H%M%S)"

echo "=== Automated Shop.tsx Profile Table Integration ==="
echo ""

# Check if file exists
if [ ! -f "$SHOP_FILE" ]; then
    echo "✗ Error: $SHOP_FILE not found"
    echo "  Please run this script from your project root directory"
    exit 1
fi

# Create backup
echo "Creating backup: $BACKUP_FILE"
cp "$SHOP_FILE" "$BACKUP_FILE"
echo "✓ Backup created"
echo ""

# Create temporary file with the new handleContractAccept function
cat > /tmp/new_handleContractAccept.js << 'EOF'
  const handleContractAccept = async (emailSubscription: boolean) => {
    setContractAccepted(true);
    setShowContractModal(false);
    
    try {
      // Get user agent
      const userAgent = navigator.userAgent;
      
      // Insert into profile table (user agreements tracking)
      if (user) {
        const { error: profileError } = await supabase
          .from('profile')
          .insert({
            user_id: user.id,
            tos_accepted: true,
            refund_policy_accepted: true,
            licensing_accepted: true,
            privacy_accepted: true,
            accepted_at: new Date().toISOString(),
            tos_version: '1.0',
            privacy_version: '1.0',
            user_agent: userAgent,
          });

        if (profileError) {
          console.error('Error saving agreement to profile table:', profileError);
        } else {
          console.log('User agreements saved to profile table successfully');
        }
      }

      // Original API call (if you still need it)
      await fetch("/api/store-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          timestamp: new Date().toISOString(),
          emailSubscription,
          beatsPurchased: beatItems.map(item => item.title)
        })
      });
    } catch (error) {
      console.error("Error storing agreement:", error);
    }
    
    setShowPaymentModal(true);
  };
EOF

# Create the helper function
cat > /tmp/updateProfileWithOrderId.js << 'EOF'

  const updateProfileWithOrderId = async (userId: string, orderId: string) => {
    try {
      const { data: profiles, error: fetchError } = await supabase
        .from('profile')
        .select('id')
        .eq('user_id', userId)
        .is('order_id', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        return;
      }

      if (profiles && profiles.length > 0) {
        const { error: updateError } = await supabase
          .from('profile')
          .update({ order_id: orderId })
          .eq('id', profiles[0].id);

        if (updateError) {
          console.error('Error updating profile with order_id:', updateError);
        } else {
          console.log('Profile updated with order_id successfully');
        }
      }
    } catch (error) {
      console.error('Error in updateProfileWithOrderId:', error);
    }
  };
EOF

echo "Step 1: Replacing handleContractAccept function..."
# Use perl for multi-line replacement (more reliable than sed)
perl -i -0pe 's/const handleContractAccept = async \(emailSubscription: boolean\) => \{.*?\n  \};/`cat \/tmp\/new_handleContractAccept.js`/se' "$SHOP_FILE"
echo "✓ handleContractAccept replaced"

echo ""
echo "Step 2: Adding updateProfileWithOrderId helper function..."
# Add the helper function after handleContractAccept
perl -i -pe 'if (/^  const handleCheckout/) { print `cat /tmp/updateProfileWithOrderId.js`; print "\n" }' "$SHOP_FILE"
echo "✓ Helper function added"

echo ""
echo "Step 3: Updating handlePaymentSuccess to track order_id..."
# Update the orders insert to include .select().single()
sed -i.tmp 's/const { error } = await supabase\.from("orders")\.insert({/const { data: orderData, error } = await supabase.from("orders").insert({/g' "$SHOP_FILE"
sed -i.tmp '/\.from("orders")\.insert({/,/});/ s/});/.select().single();/g' "$SHOP_FILE"

# Add the updateProfileWithOrderId call after order insert
perl -i -pe 's/(if \(error\) \{\s+console\.error\("Error saving order:", error\);\s+\})/\1 else if (orderData) {\n          await updateProfileWithOrderId(user.id, orderData.id);\n        }/g' "$SHOP_FILE"
echo "✓ handlePaymentSuccess updated"

echo ""
echo "Step 4: Updating handleStripeSuccess..."
sed -i.tmp 's/const { error } = await supabase\.from("orders")\.insert({/const { data: orderData, error } = await supabase.from("orders").insert({/g' "$SHOP_FILE"
perl -i -pe 's/(console\.log\("Order saved successfully!"\);)/\1\n\n      \/\/ Update profile with order_id\n      if (orderData) {\n        await updateProfileWithOrderId(currentUser.id, orderData.id);\n      }/g' "$SHOP_FILE"
echo "✓ handleStripeSuccess updated"

# Clean up temp files
rm -f /tmp/new_handleContractAccept.js
rm -f /tmp/updateProfileWithOrderId.js
rm -f "$SHOP_FILE.tmp"

echo ""

echo ""
echo "=== ✓ Integration Complete! ==="
echo ""
echo "Changes made:"
echo "  1. ✓ Updated handleContractAccept to insert into profile table"
echo "  2. ✓ Added updateProfileWithOrderId helper function"
echo "  3. ✓ Updated handlePaymentSuccess to track order_id"
echo "  4. ✓ Updated handleStripeSuccess to track order_id"
echo ""
echo "Backup saved at: $BACKUP_FILE"
echo ""
echo "To rollback: cp $BACKUP_FILE $SHOP_FILE"
echo ""
echo "Starting dev server..."
npm run dev

echo ""
echo "=== ✓ Integration Complete! ==="
echo ""
echo "Changes made:"
echo "  1. ✓ Updated handleContractAccept to insert into profile table"
echo "  2. ✓ Added updateProfileWithOrderId helper function"
echo "  3. ✓ Updated handlePaymentSuccess to track order_id"
echo "  4. ✓ Updated handleStripeSuccess to track order_id"
echo ""
echo "Backup saved at: $BACKUP_FILE"
echo ""
echo "Now test the build manually: cd client && npm run build"
