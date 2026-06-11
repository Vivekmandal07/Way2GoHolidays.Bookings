import React from "react";
import { X, Copy, ShieldCheck, CheckCircle, Headphones } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;



  const upiId = "way2goholidays@upi";

  const copyUPI = () => {
    navigator.clipboard.writeText(upiId);
    alert("UPI ID copied successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-center text-white">
          <h2 className="text-2xl font-bold">🔒 Secure Payment</h2>
          <p className="mt-2 text-sm text-blue-100">
            Complete your booking securely and instantly.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">

          {/* QR Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-lg">
            <div className="flex justify-center">
              <img
                src="/images/Examplepay.png"
                alt="UPI QR Code"
                className="h-64 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_0_40px_rgba(37,99,235,0.15)]"
              />
            </div>

            <p className="mt-4 text-center text-sm font-medium text-slate-600">
              Scan using PhonePe, Google Pay, Paytm or any UPI App
            </p>
          </div>

          {/* UPI ID */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              UPI ID
            </label>

            <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-100 px-3 py-3">
              <span className="font-medium text-slate-700">{upiId}</span>

              <button
                onClick={copyUPI}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Copy size={14} />
                Copy
              </button>
            </div>
          </div>

          {/* Trust Features */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-green-50 p-3">
              <ShieldCheck
                className="mx-auto text-green-600"
                size={24}
              />
              <p className="mt-2 text-xs font-medium text-slate-700">
                Secure
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3">
              <CheckCircle
                className="mx-auto text-blue-600"
                size={24}
              />
              <p className="mt-2 text-xs font-medium text-slate-700">
                Instant
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-3">
              <Headphones
                className="mx-auto text-purple-600"
                size={24}
              />
              <p className="mt-2 text-xs font-medium text-slate-700">
                Support
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="mt-6 rounded-xl bg-blue-50 p-4 text-center">
            <p className="font-semibold text-blue-800">
              ✈️ Your Journey Starts Here
            </p>

            <p className="mt-1 text-sm text-blue-700">
              Once payment is completed, our team will verify and share your
              booking confirmation and travel documents.
            </p>
          </div>

          {/* Button */}
          <button
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-lg font-bold text-white shadow-lg transition duration-300 hover:scale-[1.02]"
          >
            I've Made Payment
          </button>

          {/* Footer */}
          <p className="mt-4 text-center text-xs text-slate-500">
            Powered by Way2Go Holidays • Safe & Secure Payments
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;