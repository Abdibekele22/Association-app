<?php

namespace App\Http\Controllers;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use App\Models\MonthlyPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MonthlyPaymentController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $payments = MonthlyPayment::where('user_id', Auth::id())
        ->latest()
        ->get();

    return Inertia::render('MonthlyPayments/MonthlyPaymentsForms', [
        'payments' => $payments,
    ]);

    }
    public function edit(MonthlyPayment $payment)
    {
        $this->authorize('update', $payment); // Optional: use policy
        return Inertia::render('MonthlyPayments/Edit', ['payment' => $payment]);
    }
    
    public function update(Request $request, MonthlyPayment $payment)
    {
        $this->authorize('update', $payment); // Optional
    
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'month' => 'required|string',
            'screenshot' => 'nullable|image|max:2048',
        ]);
    
        $payment->amount = $validated['amount'];
        $payment->month = $validated['month'];
    
        if ($request->hasFile('screenshot')) {
            // Optionally delete old screenshot
            if ($payment->screenshot_path) {
                Storage::disk('public')->delete($payment->screenshot_path);
            }
            $path = $request->file('screenshot')->store('screenshots', 'public');
            $payment->screenshot_path = $path;
        }
    
        $payment->save();
    
        return redirect()->route('monthly-payments.index')->with('success', 'Payment updated!');
    }
    
    public function destroy(MonthlyPayment $payment)
    {
        $this->authorize('delete', $payment); // Optional
    
        if ($payment->screenshot_path) {
            Storage::disk('public')->delete($payment->screenshot_path);
        }
    
        $payment->delete();
    
        return redirect()->back()->with('success', 'Payment deleted!');
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'month' => 'required|string',
            'screenshot' => 'nullable|image|max:2048', // 2MB max
        ]);

        $payment = new MonthlyPayment();
        $payment->user_id = Auth::id();
        $payment->amount = $validated['amount'];
        $payment->month = $validated['month'];

        if ($request->hasFile('screenshot')) {
            $path = $request->file('screenshot')->store('screenshots', 'public');
            $payment->screenshot_path = $path;
        }

        $payment->save();

        return redirect()->back()->with('success', 'Payment submitted successfully!');
    }
}
