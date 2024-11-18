<?php

namespace App\Http\Controllers;

use App\Models\LeadStatus;

class LeadStatusController extends Controller
{
    public function index()
    {
        return response()->json(LeadStatus::all());
    }
}