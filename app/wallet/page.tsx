'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Transaction {
  id: number;
  creator_id: number;
  amount: number;
  transaction_type: string;
  status: string;
  creator_earnings: number;
  created_at: string;
}

export default function Wallet() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingPayout, setPendingPayout] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: 1,
        creator_id: 1,
        amount: 9.99,
        transaction_type: 'subscription',
        status: 'completed',
        creator_earnings: 5.994,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        creator_id: 1,
        amount: 14.99,
        transaction_type: 'subscription',
        status: 'completed',
        creator_earnings: 8.994,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        creator_id: 1,
        amount: 9.99,
        transaction_type: 'subscription',
        status: 'pending',
        creator_earnings: 5.994,
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    setTransactions(mockTransactions);

    const completed = mockTransactions.reduce((sum, t) => {
      if (t.status === 'completed') return sum + t.creator_earnings;
      return sum;
    }, 0);

    const pending = mockTransactions.reduce((sum, t) => {
      if (t.status === 'pending') return sum + t.creator_earnings;
      return sum;
    }, 0);

    setTotalEarnings(completed);
    setPendingPayout(pending);
    setLoading(false);
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Wallet & Earnings</h1>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <p className="text-sm text-purple-100 mb-2">Total Earnings (60%)</p>
          <p className="text-3xl font-bold">${totalEarnings.toFixed(2)}</p>
          <p className="text-xs text-purple-100 mt-2">Creator share of subscriptions</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <p className="text-sm text-blue-100 mb-2">Pending Payout</p>
          <p className="text-3xl font-bold">${pendingPayout.toFixed(2)}</p>
          <p className="text-xs text-blue-100 mt-2">Waiting to be processed</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <p className="text-sm text-green-100 mb-2">Platform Fee (40%)</p>
          <p className="text-3xl font-bold">${((totalEarnings / 60) * 40).toFixed(2)}</p>
          <p className="text-xs text-green-100 mt-2">Platform's revenue share</p>
        </div>
      </div>

      {/* Payout Actions */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Payout Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Bank Account</label>
            <input
              type="text"
              placeholder="••••••••••••••••"
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
            />
            <p className="text-sm text-gray-600 mt-2">Connected • Last 4 digits: 4242</p>
          </div>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-bold">
            Request Payout
          </button>
        </div>
      </div>

      {/* Transactions History */}
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>

      {loading ? (
        <p className="text-center py-8">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-600 py-8">No transactions yet</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Your Earnings (60%)</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 capitalize">{tx.transaction_type}</td>
                  <td className="px-4 py-3">${tx.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 font-bold text-green-600">
                    ${tx.creator_earnings.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        tx.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : tx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-8">
        <p className="text-blue-900 text-sm">
          <strong>ℹ️ Payment Structure:</strong> Creators receive 60% of all subscription revenue.
          The platform takes 40% to cover infrastructure, payment processing, and operational costs.
        </p>
      </div>
    </div>
  );
}

