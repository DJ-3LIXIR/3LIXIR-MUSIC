import React, { useState } from "react";
import { X } from "lucide-react";

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (emailSubscription: boolean) => void;
  beatTitles: string[];
  userEmail: string;
}

export default function ContractModal({
  isOpen,
  onClose,
  onAccept,
  beatTitles,
  userEmail,
}: ContractModalProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [licenseAccepted, setLicenseAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [refundAccepted, setRefundAccepted] = useState(false);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [emailSubscription, setEmailSubscription] = useState(false);

  const allRequiredAccepted =
    termsAccepted &&
    licenseAccepted &&
    privacyAccepted &&
    refundAccepted &&
    contractAccepted;

  const subscribeToNewsletter = async (email: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        console.error('Newsletter subscription failed');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    }
  };

  const handleAccept = async () => {
    if (allRequiredAccepted) {
      // Subscribe to newsletter if checked
      if (emailSubscription && userEmail) {
        await subscribeToNewsletter(userEmail);
      }
      
      onAccept(emailSubscription);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Purchase Agreement
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Beat Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              You are purchasing:
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {beatTitles.map((title, index) => (
                <li key={index}>{title}</li>
              ))}
            </ul>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Please read and accept all agreements
              below before proceeding with your purchase. These agreements
              govern your use of the purchased beat(s).
            </p>
          </div>

          {/* Required Agreements */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">
              Required Agreements:
            </h3>

            {/* Terms of Service */}
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-gray-900">
                I have read and agree to the{" "}
                <a
                  href="/shop/contract/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </a>
              </span>
            </label>

            {/* Beat License Agreement */}
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={licenseAccepted}
                onChange={(e) => setLicenseAccepted(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-gray-900">
                I have read and agree to the{" "}
                <a
                  href="/shop/contract/beat-license"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Beat License Agreement
                </a>
              </span>
            </label>

            {/* Privacy Policy */}
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-gray-900">
                I have read and agree to the{" "}
                <a
                  href="/shop/contract/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Refund Policy */}
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={refundAccepted}
                onChange={(e) => setRefundAccepted(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-gray-900">
                I have read and agree to the{" "}
                <a
                  href="/shop/contract/refund"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Refund Policy
                </a>
              </span>
            </label>

            {/* Purchase Agreement */}
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={contractAccepted}
                onChange={(e) => setContractAccepted(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-gray-900">
                I have read and agree to the{" "}
                <a
                  href="/shop/contract/purchase-agreement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Purchase Agreement
                </a>
              </span>
            </label>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Optional Email Subscription */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">Optional:</h3>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={emailSubscription}
                onChange={(e) => setEmailSubscription(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-gray-900">
                Subscribe to our newsletter for exclusive beats, discounts, and
                updates
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={!allRequiredAccepted}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              allRequiredAccepted
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Accept & Continue to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}