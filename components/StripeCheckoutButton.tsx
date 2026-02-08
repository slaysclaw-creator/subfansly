"use client";

import { useState } from "react";

interface StripeCheckoutButtonProps {
  listingId: string;
  listingTitle: string;
  priceCents: number;
  userId: string;
}

export default function StripeCheckoutButton({
  listingId,
  listingTitle,
  priceCents,
  userId,
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          listingTitle,
          priceCents,
          userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Checkout failed");
        return;
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      setError(err.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white disabled:opacity-50 hover:bg-indigo-700 transition"
      >
        {loading ? "Processing..." : `Buy Now - $${(priceCents / 100).toFixed(2)}`}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
