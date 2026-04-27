<?php

namespace App\Http\Controllers;

use App\Models\Quest;
use Illuminate\Http\Request;

class QuestController extends Controller
{
    public function index(Request $request)
    {
        $quests = Quest::all();
        return response()->json([
            'status' => 'success',
            'total'  => $quests->count(),
            'data'   => $quests
        ]);
    }

    public function show($id)
    {
        $quest = Quest::find($id);
        if (!$quest) {
            return response()->json(['status' => 'error', 'message' => 'Quest not found.'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $quest]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'quest_name'     => 'required|string',
            'target_monster' => 'required|string',
            'location'       => 'required|string',
            'reward_zenny'   => 'required|numeric|min:0',
            'status'         => 'sometimes|in:open,in_progress,completed',
        ]);

        $quest = Quest::create([
            'quest_name'     => $request->quest_name,
            'target_monster' => $request->target_monster,
            'location'       => $request->location,
            'reward_zenny'   => $request->reward_zenny,
            'status'         => $request->status ?? 'open',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'New quest posted to the board!',
            'data'    => $quest
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $quest = Quest::find($id);
        if (!$quest) {
            return response()->json(['status' => 'error', 'message' => 'Quest not found.'], 404);
        }

        $quest->update($request->only([
            'quest_name', 'target_monster', 'location', 'reward_zenny', 'status'
        ]));

        return response()->json(['status' => 'success', 'message' => 'Quest updated.', 'data' => $quest]);
    }

    public function destroy($id)
    {
        $quest = Quest::find($id);
        if (!$quest) {
            return response()->json(['status' => 'error', 'message' => 'Quest not found.'], 404);
        }

        $name = $quest->quest_name;
        $quest->delete();

        return response()->json([
            'status'  => 'success',
            'message' => "Quest \"{$name}\" removed from board."
        ]);
    }
}
