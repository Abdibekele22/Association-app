<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('occasional_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('occasional_payments', 'member_id')) {
                $table->foreignId('member_id')->constrained();
            }

            if (!Schema::hasColumn('occasional_payments', 'event_name')) {
                $table->string('event_name');
            }

            if (!Schema::hasColumn('occasional_payments', 'amount')) {
                $table->decimal('amount', 10, 2);
            }

            if (!Schema::hasColumn('occasional_payments', 'date')) {
                $table->date('date');
            }

            if (!Schema::hasColumn('occasional_payments', 'receipt_path')) {
                $table->string('receipt_path')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('occasional_payments', function (Blueprint $table) {
            if (Schema::hasColumn('occasional_payments', 'member_id')) {
                $table->dropForeign(['member_id']);
                $table->dropColumn('member_id');
            }

            if (Schema::hasColumn('occasional_payments', 'event_name')) {
                $table->dropColumn('event_name');
            }

            if (Schema::hasColumn('occasional_payments', 'amount')) {
                $table->dropColumn('amount');
            }

            if (Schema::hasColumn('occasional_payments', 'date')) {
                $table->dropColumn('date');
            }

            if (Schema::hasColumn('occasional_payments', 'receipt_path')) {
                $table->dropColumn('receipt_path');
            }
        });
    }
};
