import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Edit({ payment }) {
  const { data, setData, put, errors, processing } = useForm({
    amount: payment.amount,
    month: payment.month,
    screenshot: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/monthly-payments/${payment.id}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Monthly Payment</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block mb-1">Month</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
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
          <label className="block mb-1">Upload New Screenshot (optional)</label>
          <input
            type="file"
            onChange={(e) => setData('screenshot', e.target.files[0])}
          />
          {errors.screenshot && <p className="text-red-500 text-sm">{errors.screenshot}</p>}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={processing}
        >
          Update Payment
        </button>
      </form>
    </div>
  );
}
