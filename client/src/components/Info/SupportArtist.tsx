import React from "react";
import { DollarSign, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function SupportArtist() {
  const cashAppUrl = "https://cash.app/$Champagnerock";
  const paypalUrl = "https://paypal.me/jaredfrazier";

  return (
    <div className="w-full bg-gradient-to-br from-yellow-500 to-yellow-600 border border-yellow-700 rounded-2xl p-8 md:p-10">
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3 flex items-center justify-center gap-3 text-gray-900">
          <DollarSign className="w-8 h-8 text-yellow-700" />
          Support Us!
        </h3>
        <p className="text-gray-800 text-lg">
          Love the music? Show your support directly!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Cash App QR Code */}
        <div className="bg-white/90 border border-yellow-600 rounded-xl p-6 hover:border-yellow-700 transition-all shadow-lg">
          <div className="text-center space-y-4">
            <h4 className="text-xl font-semibold flex items-center justify-center gap-2 text-gray-900">
              <QrCode className="w-5 h-5 text-green-500" />
              Cash App
            </h4>
            <div className="aspect-square max-w-[250px] mx-auto bg-white rounded-xl p-4 flex items-center justify-center">
              <QRCodeSVG
                value={cashAppUrl}
                size={220}
                level="H"
                includeMargin={true}
                fgColor="#22c55e"
              />
            </div>
            <p className="text-sm text-gray-700 font-medium">$Champagnerock</p>
            <p className="text-xs text-gray-600">Scan to send via Cash App</p>
          </div>
        </div>

        {/* PayPal QR Code */}
        <div className="bg-white/90 border border-yellow-600 rounded-xl p-6 hover:border-yellow-700 transition-all shadow-lg">
          <div className="text-center space-y-4">
            <h4 className="text-xl font-semibold flex items-center justify-center gap-2 text-gray-900">
              <QrCode className="w-5 h-5 text-blue-500" />
              PayPal
            </h4>
            <div className="aspect-square max-w-[250px] mx-auto bg-white rounded-xl p-4 flex items-center justify-center">
              <img
                src="/IMG_7216 2.jpg"
                alt="PayPal QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-gray-700 font-medium">
              Scan to send via PayPal
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-800 text-sm">
          Your support helps create more music. Thank you! 🎵
        </p>
      </div>
    </div>
  );
}
