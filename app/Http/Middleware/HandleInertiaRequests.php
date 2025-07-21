<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
  // app/Http/Middleware/HandleInertiaRequests.php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request)
{
    return array_merge(parent::share($request), [
        // Only include absolutely necessary shared data
        'auth' => fn () => $request->user() ? [
            'id' => $request->user()->id,
            'name' => $request->user()->name
        ] : null,
        
        // Add flash messages if needed
        'flash' => fn () => [
            'success' => $request->session()->get('success'),
            'error' => $request->session()->get('error'),
        ],
    ]);
}
}
