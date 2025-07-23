<?php

namespace App\Http\Controllers;

use App\Models\MonthlyPayment;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Calculate totals
        $totals = [
            'capital' => (float)MonthlyPayment::where('status', 'paid')->sum('amount') ?: 0,
            'collectedFines' => (float)MonthlyPayment::sum('fine') ?: 0,
            'pendingPayments' => (float)MonthlyPayment::where('status', 'pending')->sum('amount') ?: 0,
            'latePayments' => (float)MonthlyPayment::where('status', 'late')->sum('amount') ?: 0
        ];
    
        // Get recent payments
        $recentPayments = MonthlyPayment::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'amount' => (float)$payment->amount,
                    'status' => $payment->status,
                    'user' => $payment->user?->name ?? 'N/A',
                    'created_at' => $payment->created_at->toDateTimeString()
                ];
            });
    
        // Fixed payment trends query
        $paymentData = MonthlyPayment::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw("SUM(amount) as amount"),
                DB::raw("SUM(fine) as fines")
            )
            ->groupBy(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"))
            ->orderBy('month')
            ->get();
    
        return Inertia::render('Dashboard', [
            'totals' => $totals,
            'recentPayments' => $recentPayments,
            'paymentTrends' => [
                'labels' => $paymentData->pluck('month')->all(),
                'amounts' => $paymentData->pluck('amount')->map(fn ($v) => (float)$v)->all(),
                'fines' => $paymentData->pluck('fines')->map(fn ($v) => (float)$v)->all()
            ],
            'statusSummary' => [
                'paid' => (int)MonthlyPayment::where('status', 'paid')->count(),
                'pending' => (int)MonthlyPayment::where('status', 'pending')->count(),
                'late' => (int)MonthlyPayment::where('status', 'late')->count()
            ]
        ]);
    }
}
