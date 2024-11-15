<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    // List all leads with pagination and search functionality
    public function index(Request $request)
    {
        $query = Lead::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }

        $limit = $request->input('limit', 20);
        $leads = $query->paginate($limit);

        return response()->json($leads);
    }

    // Store a new lead
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:leads',
            'phone' => 'required|string|max:20',
            'lead_status_id' => 'required|integer|exists:lead_statuses,id',
        ]);

        // Create the lead
        $lead = Lead::create($validatedData);

        return response()->json($lead, 201); // 201 Created
    }

    // Show a specific lead
    public function show($id)
    {
        $lead = Lead::findOrFail($id);
        return response()->json($lead);
    }

    // Update an existing lead
    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:leads,email,' . $lead->id,
            'phone' => 'sometimes|string|max:20',
            'lead_status_id' => 'sometimes|integer|exists:lead_statuses,id',
        ]);

        $lead->update($validatedData);

        return response()->json($lead);
    }

    // Delete a lead
    public function destroy($id)
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();

        return response()->json(['message' => 'Lead deleted successfully']);
    }
}