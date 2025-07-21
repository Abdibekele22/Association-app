<?php

namespace App\Http\Controllers;

use App\Models\MonthlyPayment;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // First verify we have any payments at all
        if (!MonthlyPayment::exists()) {
            return Inertia::render('Dashboard', [
                'warning' => 'No payment data found in system',
                // ... other empty defaults
            ]);
        }
    
        // Get all distinct status values for debugging
        $statuses = MonthlyPayment::pluck('status')->unique();
        
        // Calculate totals - adjust status checks based on your actual status values
        $monthlyTotal = MonthlyPayment::whereIn('status', ['paid', 'completed'])->sum('amount');
        $fines = MonthlyPayment::whereNotNull('fine')->sum('fine'); // Alternative if no status column
        
        // Get recent payments with user data
        $recentPayments = MonthlyPayment::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
    
        // Generate chart data
        $paymentData = MonthlyPayment::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw("SUM(amount) as total")
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    
        $labels = $paymentData->pluck('month')->map(fn($m) => \Carbon\Carbon::parse($m)->format('M Y'));
        $amounts = $paymentData->pluck('total');
    
        return Inertia::render('Dashboard', [
            'totalCapital' => $monthlyTotal,
            'monthlyTotal' => $monthlyTotal,
            'occasionalTotal' => 0,
            'fines' => $fines,
            'recentPayments' => ['monthly' => $recentPayments],
            'paymentTrends' => [
                'labels' => $labels,
                'monthly' => $amounts,
                'occasional' => [],
            ],
            'debug' => [ // Temporary debugging info
                'statuses' => $statuses,
                'first_payment' => MonthlyPayment::first(),
            ],
        ]);
    }
}
