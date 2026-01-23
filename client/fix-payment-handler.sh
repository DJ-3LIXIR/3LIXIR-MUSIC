#!/bin/bash

# Add the updateProfileWithOrderId call after the error check in handlePaymentSuccess
awk '
/const handlePaymentSuccess = async/,/clearCart\(\);/ {
    if (/if \(error\) \{/ && /Error saving order/ && !updated1) {
        print
        getline
        print
        print "        } else if (orderData) {"
        print "          await updateProfileWithOrderId(user.id, orderData.id);"
        updated1 = 1
        next
    }
}
{ print }
' client/src/pages/Shop.tsx > client/src/pages/Shop.tsx.tmp && mv client/src/pages/Shop.tsx.tmp client/src/pages/Shop.tsx

echo "✓ handlePaymentSuccess fixed"
