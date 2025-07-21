import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BarChart, LineChart } from '@/Components/Charts';
import { Link } from '@inertiajs/react';
import { LayoutDashboard as DashboardIcon } from 'lucide-react';

export default function Dashboard({ 
    totalCapital = 0, 
    monthlyTotal = 0, 
    occasionalTotal = 0, 
    fines = 0, 
    recentPayments = { monthly: [], occasional: [] }, 
    paymentTrends = { labels: [], monthly: [], occasional: [] }, 
    membersCount = 0, 
    pendingActions = 0 
}) {
    // Combine and sort recent payments
    const combinedRecentPayments = [
        ...(recentPayments.monthly || []), 
        ...(recentPayments.occasional || [])
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
     .slice(0, 5);

    // Prepare chart data
    const barChartData = {
        labels: paymentTrends.labels || [],
        datasets: [
            { 
                label: 'Monthly', 
                data: paymentTrends.monthly || [], 
                backgroundColor: '#3B82F6' 
            },
            { 
                label: 'Occasional', 
                data: paymentTrends.occasional || [], 
                backgroundColor: '#10B981' 
            },
        ]
    };

    const lineChartData = {
        labels: paymentTrends.labels || [],
        datasets: [
            {
                label: 'Total Payments',
                data: paymentTrends.labels?.map((_, i) => 
                    (paymentTrends.monthly?.[i] || 0) + 
                    (paymentTrends.occasional?.[i] || 0)
                ) || [],
                borderColor: '#8B5CF6',
                tension: 0.1,
                fill: true
            }
        ]
    };

    return (
        <AuthenticatedLayout>
            <div className="p-6">
            <div className="p-6">
    <pre className="bg-gray-100 p-4 text-xs mb-6">
        {JSON.stringify({
            totalCapital,
            monthlyTotal, 
            paymentTrends,
            recentPayments
        }, null, 2)}
    </pre>
    
    {/* Rest of your dashboard UI */}
</div>
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <DashboardIcon className="w-6 h-6" /> Admin Dashboard
                </h1>

                {/* Financial Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500">Total Capital</h3>
                        <p className="text-2xl font-bold">
                            ${totalCapital.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500">Monthly Payments</h3>
                        <p className="text-2xl font-bold">
                            ${monthlyTotal.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500">Occasional Payments</h3>
                        <p className="text-2xl font-bold">
                            ${occasionalTotal.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500">Fines Collected</h3>
                        <p className="text-2xl font-bold">
                            ${fines.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold mb-2">Payments Breakdown</h3>
                        <BarChart {...barChartData} />
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold mb-2">Payment Trends</h3>
                        <LineChart {...lineChartData} />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-4 rounded shadow mb-6">
                    <h3 className="font-bold mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <Link 
                            href="/monthly-payments/create" 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                        >
                            Add Monthly Payment
                        </Link>
                        <Link 
                            href="/occasional-payments/create" 
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                        >
                            Add Occasional Payment
                        </Link>
                        <Link 
                            href="/members" 
                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
                        >
                            Manage Members
                        </Link>
                    </div>
                    {pendingActions > 0 && (
                        <div className="mt-4 text-red-500 font-medium">
                            {pendingActions} pending actions require your attention.
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-bold mb-4">Recent Transactions</h3>
                    {combinedRecentPayments.length > 0 ? (
                        <div className="space-y-4">
                            {combinedRecentPayments.map((payment) => (
                                <div key={payment.id} className="border-b pb-2 last:border-b-0">
                                    <p className="flex justify-between">
                                        <span className="font-semibold">
                                            {payment.event_name || `Monthly Payment`}
                                        </span>
                                        <span className="text-gray-600">
                                            ${payment.amount}
                                        </span>
                                    </p>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>
                                            {payment.user?.name || 'N/A'}
                                        </span>
                                        <span>
                                            {new Date(payment.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No recent transactions found</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}