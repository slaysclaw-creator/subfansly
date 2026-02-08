export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="rounded-3xl bg-white p-8 shadow-lg text-center max-w-md">
        <div className="mb-6 text-5xl">✅</div>
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-slate-600 mb-6">
          Thank you for your purchase. Your access to the creator content pack
          has been activated.
        </p>

        <div className="rounded-lg bg-slate-100 p-4 mb-6">
          <p className="text-xs text-slate-600">Session ID:</p>
          <p className="text-sm font-mono text-slate-900 break-all">
            {sessionId || "N/A"}
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="/marketplace"
            className="block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
          >
            Back to Marketplace
          </a>
          <a
            href="/dashboard"
            className="block rounded-lg border border-slate-200 px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50 transition"
          >
            View Your Library
          </a>
        </div>
      </div>
    </div>
  );
}
