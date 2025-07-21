<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMembersTable extends Migration
{

    public function up()
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id(); // Creates a bigint auto-increment primary key
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('email')->unique();
            $table->string('phone_number')->nullable();
            // Add other member fields as needed
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('members');
    }
}