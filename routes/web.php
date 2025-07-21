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

Route::get('/debug-payments', function() {
    return [
        'all_payments' => App\Models\MonthlyPayment::all(),
        'count' => App\Models\MonthlyPayment::count(),
        'status_values' => App\Models\MonthlyPayment::distinct()->pluck('status'),
        'sum_amount' => App\Models\MonthlyPayment::sum('amount'),
        // 'sum_fine' => App\Models\MonthlyPayment::sum('fine'),
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
    
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/monthly-payments', [MonthlyPaymentController::class, 'index'])->name('monthly-payments.index');
    Route::post('/monthly-payments', [MonthlyPaymentController::class, 'store'])->name('monthly-payments.store');
    Route::get('/monthly-payments/{payment}/edit', [MonthlyPaymentController::class, 'edit'])->name('monthly-payments.edit');
    Route::put('/monthly-payments/{payment}', [MonthlyPaymentController::class, 'update'])->name('monthly-payments.update');
    Route::delete('/monthly-payments/{payment}', [MonthlyPaymentController::class, 'destroy'])->name('monthly-payments.destroy');

    // profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
