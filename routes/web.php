<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MonthlyPaymentController;
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    
    Route::get('/monthly-payments', [MonthlyPaymentController::class, 'index']);
    Route::post('/monthly-payments', [MonthlyPaymentController::class, 'store'])->name('monthly-payments.store');
    Route::get('/monthly-payments/{payment}/edit', [MonthlyPaymentController::class, 'edit']);
    Route::put('/monthly-payments/{payment}', [MonthlyPaymentController::class, 'update']);
    Route::delete('/monthly-payments/{payment}', [MonthlyPaymentController::class, 'destroy']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
