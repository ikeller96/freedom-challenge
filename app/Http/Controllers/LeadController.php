<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LeadController extends Controller
{
    // List all leads with pagination and search functionality
    public function index(Request $request)
    {
        $query = Lead::with('status');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Handle filtering by lead_status_id
        if ($request->has('lead_status_id')) {
            $leadStatusId = $request->input('lead_status_id');
            $query->where('lead_status_id', $leadStatusId);
        }

        // Handle sorting
        if ($request->has('sortBy') && $request->has('sortDirection')) {
            $sortBy = $request->input('sortBy');
            $sortDirection = $request->input('sortDirection') === 'desc' ? 'desc' : 'asc';

            if (in_array($sortBy, ['name', 'lead_status_id'])) {
                $query->orderBy($sortBy, $sortDirection);
            }
        }

        $limit = $request->input('limit', 20);
        $leads = $query->paginate($limit);

        return response()->json([
            'data' => $leads->items(),
            'currentPage' => $leads->currentPage(),
            'totalPages' => $leads->lastPage(),
            'totalItems' => $leads->total(),
            'perPage' => $leads->perPage(),
        ]);
    }

    // Create a new lead
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'lead_status_id' => 'required|integer|exists:lead_statuses,id',
        ]);

        $lead = Lead::create($validatedData);

        return response()->json($lead, 201);
    }

    // Show a specific lead
    public function show($id)
    {
        // Eager load the status for a specific lead
        $lead = Lead::with('status')->findOrFail($id);
        return response()->json($lead);
    }

    // Update an existing lead
    public function update(Request $request, $id)
    {
        // Find the lead by ID
        $lead = Lead::findOrFail($id);

        // Validate the incoming request
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email', // No unique validation
            'phone' => 'sometimes|string|max:20',
            'lead_status_id' => 'sometimes|integer|exists:lead_statuses,id',
        ]);

        // Update the lead
        $lead->update($validatedData);

        // Return the updated lead
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