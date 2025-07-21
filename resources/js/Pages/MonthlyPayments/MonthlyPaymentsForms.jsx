import React from 'react';
import { useForm, usePage, router } from '@inertiajs/react';

export default function MonthlyPaymentsForm({ payments }) {
  // Auto-detect current month/year (e.g., "July 2024")
  const getCurrentMonthYear = () => {
    return new Date().toLocaleString('default', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const { data, setData, post, processing, errors, reset } = useForm({
    amount: '',
    month: getCurrentMonthYear(), // Auto-filled
    screenshot: null,
  });

  const { auth } = usePage().props;

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/monthly-payments', {
      onSuccess: () => reset(),
      preserveScroll: true,
    });
  };

  // Format date for display in table
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-700">
          Welcome, <span className="font-semibold">{auth.user}</span>
        </p>
        <form method="POST" action="/logout">
          <input type="hidden" name="_token" value={usePage().props.csrf_token} />
          <button
           className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
           
          href={route('logout')}
          method="post"
          as="button"
      >
          Log Out
      </button>
        </form>
      </div>

      {/* Payment Form */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Submit Monthly Payment</h2>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Month Field (Auto-filled) */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Month</label>
            <div className="p-3 bg-gray-100 rounded border border-gray-300">
              {data.month}
              <input type="hidden" name="month" value={data.month} />
            </div>
          </div>

          {/* Amount Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Amount</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={data.amount}
              onChange={(e) => setData('amount', e.target.value)}
              min="1"
              step="0.01"
              required
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Payment Proof (Screenshot/Receipt)
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="image/*,.pdf"
                onChange={(e) => setData('screenshot', e.target.files[0])}
                required
              />
            </div>
            {errors.screenshot && (
              <p className="mt-1 text-sm text-red-600">{errors.screenshot}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={processing}
          >
            {processing ? 'Submitting...' : 'Submit Payment'}
          </button>
        </form>
      </div>

      {/* Payments History */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">Your Payment History</h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No payments submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'late' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.screenshot_path ? (
                        <a
                          href={`/storage/${payment.screenshot_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Proof
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(payment.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.status === 'pending' &&  (
                        <div className="space-x-2">
                          <a
                            href={`/monthly-payments/${payment.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </a>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this payment?')) {
                                router.delete(`/monthly-payments/${payment.id}`);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}