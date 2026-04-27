<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

// BUG FIX #9: Service2 had NO JWT authentication on any route.
// Anyone could access quest endpoints without a token.
class JwtMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // If forwarded from Gateway, hunter headers are already set
        if ($request->header('x-hunter-id')) {
            $request->attributes->set('hunter_id',   $request->header('x-hunter-id'));
            $request->attributes->set('hunter_name', $request->header('x-hunter-name'));
            $request->attributes->set('hunter_rank', $request->header('x-hunter-rank'));
            return $next($request);
        }

        // Direct call — verify JWT ourselves
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Access denied. No hunter license (token) provided.',
                'code'    => 'NO_TOKEN',
            ], 401);
        }

        try {
            $secret  = env('JWT_SECRET', '2410511070');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));

            $request->attributes->set('hunter_id',   $decoded->id   ?? null);
            $request->attributes->set('hunter_name', $decoded->name ?? null);
            $request->attributes->set('hunter_rank', $decoded->rank ?? null);

            return $next($request);
        } catch (ExpiredException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Hunter license expired. Please login again.',
                'code'    => 'TOKEN_EXPIRED',
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Invalid hunter license. Access forbidden.',
                'code'    => 'INVALID_TOKEN',
            ], 403);
        }
    }
}
