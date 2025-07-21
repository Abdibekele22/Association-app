// database/migrations/YYYY_MM_DD_create_occasional_payments_table.php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOccasionalPaymentsTable extends Migration
{
    public function up()
    {
        Schema::create('occasional_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained(); // Links to members
            $table->string('event_name');
            $table->decimal('amount', 10, 2);
            $table->date('date');
            $table->string('receipt_path')->nullable(); // For file uploads
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('occasional_payments');
    }
}