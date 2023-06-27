<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->post('http://localhost:3001/api/auth/loginAdmin', $request->all());
    
            $users = $response->json();


            if ($users["token"] && $users["user"]["role"] == "ADMIN" || $users["user"]["role"] == "SUPERADMIN" ) {
                $token = $users["token"];
                $user = $users["user"];
    
                session(['jwt_token' => $token]);
                session(['auth_first_name' => $user["first_name"]]);
                session(['auth_last_name' => $user["last_name"]]);
                session(['auth_role' => $user["role"]]);
                
                return redirect()->intended('/');
                // return redirect()->intended(RouteServiceProvider::HOME);
            }
        } catch (\Exception $e) {
            var_dump("sd");
            die();
            return redirect()->intended('/login');
        }
        
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
