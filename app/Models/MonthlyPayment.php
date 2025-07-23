<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlyPayment extends Model
{
    // MonthlyPayment.php
public function member()
{
    return $this->belongsTo(Member::class);
}
public function user()
{
    return $this->belongsTo(User::class);
}
}
