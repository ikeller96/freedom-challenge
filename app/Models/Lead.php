<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'lead_status_id',
    ];

    public function status()
    {
        return $this->belongsTo(LeadStatus::class, 'lead_status_id');
    }
}