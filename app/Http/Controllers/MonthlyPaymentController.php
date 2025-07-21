<?php

namespace App\Http\Controllers;

use App\Models\MonthlyPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
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
            'payments' => $payments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'amount' => (float)$payment->amount,
                    'month' => $payment->month,
                    'status' => $payment->status,
                    'screenshot_path' => $payment->screenshot_path,
                    'created_at' => $payment->created_at->toDateTimeString()
                ];
            }),
            'auth' => [
                'user' => Auth::user()->name // Only include needed fields
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'month' => 'required|string',
            'screenshot' => 'required|image|max:2048',
        ]);

        $payment = new MonthlyPayment();
        $payment->user_id = Auth::id();
        $payment->amount = (float)$validated['amount'];
        $payment->month = $validated['month'];
        $payment->status = 'pending';

        $path = $request->file('screenshot')->store('screenshots', 'public');
        $payment->screenshot_path = $path;

        $payment->save();

        return redirect()->back()->with('success', 'Payment submitted successfully!');
    }

    public function edit(MonthlyPayment $payment)
    {
        $this->authorize('update', $payment);
        return Inertia::render('MonthlyPayments/Edit', [
            'payment' => [
                'id' => $payment->id,
                'amount' => (float)$payment->amount,
                'month' => $payment->month,
                'screenshot_path' => $payment->screenshot_path
            ]
        ]);
    }

    public function update(Request $request, MonthlyPayment $payment)
    {
        $this->authorize('update', $payment);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'month' => 'required|string',
            'screenshot' => 'nullable|image|max:2048',
        ]);

        $payment->amount = (float)$validated['amount'];
        $payment->month = $validated['month'];

        if ($request->hasFile('screenshot')) {
            Storage::disk('public')->delete($payment->screenshot_path);
            $path = $request->file('screenshot')->store('screenshots', 'public');
            $payment->screenshot_path = $path;
        }

        $payment->save();

        return redirect()->route('monthly-payments.index')
            ->with('success', 'Payment updated!');
    }

    public function destroy(MonthlyPayment $payment)
    {
        $this->authorize('delete', $payment);

        if ($payment->screenshot_path) {
            Storage::disk('public')->delete($payment->screenshot_path);
        }

        $payment->delete();

        return redirect()->back()->with('success', 'Payment deleted!');
    }
}