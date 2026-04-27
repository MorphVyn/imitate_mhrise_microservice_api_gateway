<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestController;

// ── Health check (no auth needed) ─────────────────────────
Route::get('/health', function () {
    return response()->json([
        'status'    => 'online',
        'service'   => 'Quest Board Service (Service2)',
        'timestamp' => now()->toISOString(),
    ]);
});

// ── BUG FIX #9: Apply JWT middleware to all quest routes ──
// Previously ALL routes had NO authentication whatsoever.
Route::middleware(\App\Http\Middleware\JwtMiddleware::class)->group(function () {
    Route::get('/quests',         [QuestController::class, 'index']);
    Route::get('/quests/{id}',    [QuestController::class, 'show']);
    Route::post('/quests',        [QuestController::class, 'store']);
    Route::put('/quests/{id}',    [QuestController::class, 'update']);
    Route::delete('/quests/{id}', [QuestController::class, 'destroy']);
});
