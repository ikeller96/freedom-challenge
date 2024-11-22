<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class LeadController extends Controller
{
    // List all leads with pagination and search functionality
    public function index(Request $request)
    {
        $cacheKey = 'leads_' . md5(json_encode($request->all()));

        $leads = Cache::remember($cacheKey, 60 * 5, function () use ($request) {
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
            return $query->paginate($limit);
        });

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

        Cache::flush();

        return response()->json($lead, 201);
    }

    // Show a specific lead
    public function show($id)
    {
        // Eager load the status for a specific lead and cache it
        $cacheKey = "lead_{$id}";

        $lead = Cache::remember($cacheKey, 60 * 10, function () use ($id) {
            return Lead::with('status')->findOrFail($id);
        });

        return response()->json($lead);
    }

    // Update an existing lead
    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email',
            'phone' => 'sometimes|string|max:20',
            'lead_status_id' => 'sometimes|integer|exists:lead_statuses,id',
        ]);

        $lead->update($validatedData);

        Cache::forget("lead_{$id}");
        Cache::flush();

        return response()->json($lead);
    }

    // Delete a lead
    public function destroy($id)
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();

        Cache::forget("lead_{$id}");
        Cache::flush();

        return response()->json(['message' => 'Lead deleted successfully']);
    }
}