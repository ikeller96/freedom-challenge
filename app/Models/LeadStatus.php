<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',  // Adjust based on actual column name in lead_statuses
    ];

    // Define the relationship with Lead
    public function leads()
    {
        return $this->hasMany(Lead::class, 'lead_status_id');
    }
}