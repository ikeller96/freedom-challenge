<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeadController;

Route::apiResource('leads', LeadController::class);

//TODO IAN: Remove this route
Route::get('test', function () {
	return 'API route is working';
});