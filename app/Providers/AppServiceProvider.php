<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public static function redirectTo()
    {
        $user = Auth::user();
    
        if ($user->role === 'admin') {
            return '/dashboard';
        }
    
        return '/monthly-payments';
    }
     public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
{
    Inertia::share([
        'auth' => function () {
            return [
                'user' => Auth::user(),
            ];
        },
    ]);
}
}
