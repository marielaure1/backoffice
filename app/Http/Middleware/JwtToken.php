<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

class JwtToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->session()->has('jwt_token')) {

            var_dump($request->session()->has('jwt_token'));
            die();

            return redirect('/login');
        }

        
        return $next($request);
        
    }
}
