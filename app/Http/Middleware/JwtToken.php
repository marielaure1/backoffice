<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JwtToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->session()->has('jwt_token')) {

            return $next($request);
        }

        // Jeton JWT manquant ou invalide, redirigez l'utilisateur vers la page de connexion
        return redirect('/login');
    }
}
