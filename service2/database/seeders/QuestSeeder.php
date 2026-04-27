<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Quest;

class QuestSeeder extends Seeder
{
    public function run(): void
    {
        // BUG FIX #10: Only 4 quests seeded; requirement is 10 per data category.
        // Also: Quest::truncate() wiped all data every time seed ran — now checks count first.
        $count = Quest::count();
        if ($count > 0) {
            $this->command->info("  ⏭️  Quests already exist ({$count} records), skipping seed.");
            return;
        }

        $quests = [
            [
                'quest_name'      => 'Slay the Magnamalo',
                'target_monster'  => 'Magnamalo',
                'location'        => 'Shrine Ruins',
                'reward_zenny'    => 12000,
                'status'          => 'open'
            ],
            [
                'quest_name'      => 'Fungal Frustrations',
                'target_monster'  => 'None (Gathering)',
                'location'        => 'Flooded Forest',
                'reward_zenny'    => 1500,
                'status'          => 'completed'
            ],
            [
                'quest_name'      => 'The Thunderous Apex',
                'target_monster'  => 'Apex Zinogre',
                'location'        => 'Sandy Plains',
                'reward_zenny'    => 18000,
                'status'          => 'open'
            ],
            [
                'quest_name'      => 'Wandering in the Frost',
                'target_monster'  => 'Goss Harag',
                'location'        => 'Frost Islands',
                'reward_zenny'    => 14500,
                'status'          => 'in_progress'
            ],
            [
                'quest_name'      => 'Hunt a Malzeno',
                'target_monster'  => 'Malzeno',
                'location'        => 'Citadel',
                'reward_zenny'    => 25000,
                'status'          => 'open'
            ],
            [
                'quest_name'      => 'Lunagaron on the Loose',
                'target_monster'  => 'Lunagaron',
                'location'        => 'Citadel',
                'reward_zenny'    => 16000,
                'status'          => 'open'
            ],
            [
                'quest_name'      => 'Aurora Somnacanth Sighting',
                'target_monster'  => 'Aurora Somnacanth',
                'location'        => 'Frost Islands',
                'reward_zenny'    => 14000,
                'status'          => 'open'
            ],
            [
                'quest_name'      => 'Magma Almudron Eruption',
                'target_monster'  => 'Magma Almudron',
                'location'        => 'Lava Caverns',
                'reward_zenny'    => 13500,
                'status'          => 'open'
            ],
            [
                'quest_name'      => 'Scorned Magnamalo Vengeance',
                'target_monster'  => 'Scorned Magnamalo',
                'location'        => 'Shrine Ruins',
                'reward_zenny'    => 22000,
                'status'          => 'open'
            ],
            [
                'quest_name'      => 'Slay the Elder Gaismagorm',
                'target_monster'  => 'Gaismagorm',
                'location'        => 'Underground Cave',
                'reward_zenny'    => 50000,
                'status'          => 'open'
            ],
        ];

        foreach ($quests as $quest) {
            Quest::create($quest);
        }

        $this->command->info('  ✅ Quests seeded (10 quests)! Happy Hunting!');
    }
}
