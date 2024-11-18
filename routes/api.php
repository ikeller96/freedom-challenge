<?php

use App\Http\Controllers\LeadController;
use App\Http\Controllers\LeadStatusController;

Route::apiResource('leads', LeadController::class);
Route::get('lead-statuses', [LeadStatusController::class, 'index']);