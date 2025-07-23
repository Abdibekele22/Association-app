<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MonthlyPaymentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OccasionalPaymentController;
use App\Http\Controllers\AdminController;
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
// routes/web.php
Route::get('/debug-inertia-dashboard', function() {
    $controller = new App\Http\Controllers\DashboardController();
    return $controller->index();
});
Route::get('/debug-dashboard-data', function() {
    // Calculate totals
    $data = [
        'paidTotal' => (float)\App\Models\MonthlyPayment::where('status', 'paid')->sum('amount'),
        'finesTotal' => (float)\App\Models\MonthlyPayment::sum('fine'),
        'pendingTotal' => (float)\App\Models\MonthlyPayment::where('status', 'pending')->sum('amount'),
        'lateTotal' => (float)\App\Models\MonthlyPayment::where('status', 'late')->sum('amount'),
        'recentPayments' => \App\Models\MonthlyPayment::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'amount' => (float)$payment->amount,
                    'status' => $payment->status,
                    'user' => $payment->user ? $payment->user->name : null
                ];
            }),
        'statusCounts' => [
            'paid' => \App\Models\MonthlyPayment::where('status', 'paid')->count(),
            'pending' => \App\Models\MonthlyPayment::where('status', 'pending')->count(),
            'late' => \App\Models\MonthlyPayment::where('status', 'late')->count()
        ]
    ];

    return response()->json($data);
});
Route::get('/test-dashboard', function() {
    $controller = new \App\Http\Controllers\MonthlyPaymentController();
    return $controller->index();
});
Route::get('/debug-payments', function() {
    return [
        'all_payments' => \App\Models\MonthlyPayment::all(),
        'paid_payments' => \App\Models\MonthlyPayment::where('status', 'paid')->get(),
        'sum_amount' => \App\Models\MonthlyPayment::sum('amount'),
        'status_counts' => \App\Models\MonthlyPayment::groupBy('status')
                             ->selectRaw('status, count(*) as count')
                             ->get()
    ];
});
// routes/web.php
// Route::get('/debug-dashboard', function() {
//     return [
//         'totalCapital' => 1500.00,
//         'monthlyTotal' => 1500.00,
//         'occasionalTotal' => 500.00,
//         'fines' => 200.00,
//         'test' => "This should appear in response"
//     ];
// });
// routes/web.php
// Route::get('/inertia-direct-test', function() {
//     return Inertia::render('DirectTest', [
//         'guaranteed_data' => [
//             'numbers' => [1, 2, 3],
//             'message' => 'This must appear',
//             'sum' => 1234.56
//         ],
//         '_meta' => [
//             'time' => now()->toDateTimeString()
//         ]
//     ]);
// });
// routes/web.php
// Route::get('/inertia-firewall', function() {
//     // Bypass ALL middleware
//     $response = new \Inertia\Response(
//         'FirewallTest',
//         [
//             'FORCE_data' => [
//                 'numbers' => [1, 2, 3],
//                 'message' => 'This must appear',
//                 'sum' => 1234.56
//             ],
//             '_meta' => [
//                 'time' => now()->toDateTimeString(),
//                 'inertia_version' => \Inertia\Inertia::getVersion()
//             ]
//         ],
//         [], // No view data
//         null, // Default version
//         'app' // Root view
//     );

//     return $response;
// });
// Route::get('/direct-data', function() {
//     return response()->json([
//         'hardcoded_value' => 9999.99,
//         'database_value' => \App\Models\MonthlyPayment::where('status', 'paid')->sum('amount'),
//         'test_object' => ['key' => 'value'],
//         'test_array' => [1, 2, 3]
//     ]);
// });
// Temporary route for testing

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/dashboard', [AdminController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::middleware('auth')->group(function () {
    
    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('admin.dashboard');
    Route::get('/monthly-payments', [MonthlyPaymentController::class, 'index'])->middleware(['auth'])->name('monthly-payments.index');
    Route::post('/monthly-payments', [MonthlyPaymentController::class, 'store'])->middleware(['auth', 'verified'])->name('monthly-payments.store');
    Route::get('/monthly-payments/{payment}/edit', [MonthlyPaymentController::class, 'edit'])->middleware(['auth', 'verified'])->name('monthly-payments.edit');
    Route::put('/monthly-payments/{payment}', [MonthlyPaymentController::class, 'update'])->middleware(['auth', 'verified'])->name('monthly-payments.update');
    Route::delete('/monthly-payments/{payment}', [MonthlyPaymentController::class, 'destroy'])->middleware(['auth', 'verified'])->name('monthly-payments.destroy');

    // profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
