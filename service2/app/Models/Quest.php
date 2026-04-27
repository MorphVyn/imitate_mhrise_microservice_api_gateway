<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Quest extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'quests';

    protected $fillable = [
        'quest_name',
        'target_monster',
        'location',
        'reward_zenny',
        'status'
    ];
}