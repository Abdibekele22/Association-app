import React from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function MonthlyPaymentsForm({ payments }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    amount: '',
    month: '',
    screenshot: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/monthly-payments', {
      onSuccess: () => reset(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Submit Monthly Payment</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block mb-1">Month</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="June 2025"
            value={data.month}
            onChange={(e) => setData('month', e.target.value)}
          />
          {errors.month && <p className="text-red-500 text-sm">{errors.month}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={data.amount}
            onChange={(e) => setData('amount', e.target.value)}
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Upload Screenshot</label>
          <input
            type="file"
            className="w-full"
            onChange={(e) => setData('screenshot', e.target.files[0])}
          />
          {errors.screenshot && <p className="text-red-500 text-sm">{errors.screenshot}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={processing}
        >
          Submit
        </button>
      </form>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold mb-2">Your Submitted Payments</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Month</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Screenshot</th>
              <th className="px-4 py-2 border">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No payments submitted yet.
                </td>
              </tr>
            ) : (
              payments.map((pmt) => (
                <tr key={pmt.id}>
                  <td className="border px-4 py-2">{pmt.month}</td>
                  <td className="border px-4 py-2">{pmt.amount}</td>
                  <td className="border px-4 py-2 capitalize">{pmt.status}</td>
                  <td className="border px-4 py-2">
                    {pmt.screenshot_path ? (
                      <a
                        href={`/storage/${pmt.screenshot_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(pmt.created_at).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
  {pmt.status === 'pending' && (
    <>
      <a
        href={`/monthly-payments/${pmt.id}/edit`}
        className="text-blue-500 underline"
      >
        Edit
      </a>
      <button
        onClick={() => {
          if (confirm('Are you sure?')) {
            router.delete(`/monthly-payments/${pmt.id}`);
          }
        }}
        className="text-red-500 underline"
      >
        Delete
      </button>
    </>
  )}
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
