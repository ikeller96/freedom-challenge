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
    $query = Lead::with(['status:id,name']); // Eager load only necessary columns

    // Search functionality
    if ($request->has('search')) {
        $search = $request->input('search');
        $query->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
    }

    // Sorting (optional: defaults to sorting by ID)
    $sortBy = $request->input('sortBy', 'id'); // Default to 'id'
    $sortOrder = $request->input('sortOrder', 'asc'); // Default to ascending
    $query->orderBy($sortBy, $sortOrder);

    // Pagination with max limit
    $limit = min($request->input('limit', 20), 100); // Default 20, max 100
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