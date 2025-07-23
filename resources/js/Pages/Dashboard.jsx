import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BarChart, PieChart } from '@/Components/Charts';
import { 
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  ClockIcon,
  InboxIcon
} from '@heroicons/react/24/outline';

function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-start">
      <div className="mr-4 p-2 rounded-full bg-gray-50">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard({ 
   
  totals = {
    capital: 0,
    collectedFines: 0,
    pendingPayments: 0,
    latePayments: 0
  }, 
  recentPayments = [], 
  paymentTrends = {
    labels: [],
    amounts: [],
    fines: []
  },
  statusSummary = {
    paid: 0,
    pending: 0,
    late: 0
  }
}) {
  // Process chart data
  const barChartData = {
    labels: paymentTrends.labels?.map(label => {
      const [year, month] = label.split('-');
      return new Date(year, month-1).toLocaleString('default', { month: 'short' });
    }) || ['Jan', 'Feb', 'Mar'], // Fallback labels
    datasets: [
      {
        label: 'Payments',
        data: paymentTrends.amounts?.length ? paymentTrends.amounts : [500, 400, 600], // Fallback data
        backgroundColor: '#3B82F6'
      },
      {
        label: 'Fines',
        data: paymentTrends.fines?.length ? paymentTrends.fines : [20, 30, 10], // Fallback data
        backgroundColor: '#EF4444'
      }
    ]
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Financial Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard 
            title="Total Capital" 
            value={`$${totals.capital.toLocaleString()}`} 
            icon={<CurrencyDollarIcon className="h-6 w-6 text-blue-500"/>}
          />
          <SummaryCard 
            title="Collected Fines" 
            value={`$${totals.collectedFines.toLocaleString()}`}
            icon={<ExclamationCircleIcon className="h-6 w-6 text-red-500"/>}
          />
          <SummaryCard 
            title="Pending Payments" 
            value={`$${totals.pendingPayments.toLocaleString()}`}
            icon={<InboxIcon className="h-6 w-6 text-gray-500"/>}
          />
          <SummaryCard 
            title="Late Payments" 
            value={`$${totals.latePayments.toLocaleString()}`}
            icon={<ClockIcon className="h-6 w-6 text-yellow-500"/>}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Monthly Payments & Fines</h3>
            <BarChart data={barChartData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Payment Status Distribution</h3>
            <PieChart 
              data={{
                labels: ['Paid', 'Pending', 'Late'],
                datasets: [{
                  data: [
                    statusSummary.paid,
                    statusSummary.pending,
                    statusSummary.late
                  ],
                  backgroundColor: [
                    '#10B981',
                    '#F59E0B',
                    '#EF4444'
                  ]
                }]
              }}
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Recent Transactions</h3>
          {recentPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentPayments.map(payment => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.user || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'late' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No recent transactions</p>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}