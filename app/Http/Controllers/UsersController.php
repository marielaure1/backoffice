<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class UsersController extends Controller
{
    /**
     * Afficher tous les utilisateurs
     */
    public function index(): InertiaResponse
    {
        return Inertia::render('Users/Index', [
            'userPage' => "userPage",
        ]);
    }

    /**
     * Afficher un utilisateur
     */
    public function show(Request $request, int $id): InertiaResponse
    {

        return Inertia::render('Users/Show', [
            "id" => $id
        ]);
    }

     /**
     * Modifier un utilisateur
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        try {
            $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVkam91ci5tYXJpZS1sYXVyZThAZ21haWwuY29tIiwiaWF0IjoxNjg3MDgyMjc1LCJleHAiOjE2ODcxNjg2NzV9.XO-cpn5rL2DV9xEgUKJCMWkWoofIaTX6on3bIr4WFs8";
            $response = Http::withToken($token)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->put('http://localhost:3001/api/users/' . $id, $request->all());
    
            $data = $response->json();
    
            Session::flash('success', 'Mise à jour réussie !');
    
            return redirect()->route('users.show', ['id' => $id]);
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();
    
            Session::flash('error', $errorMessage);
    
            return redirect()->route('users.show', ['id' => $id]);
        }
    }

    /**
     * Supprimer un utilisateur
     */
    public function delete(Request $request, int $id): InertiaResponse
    {

        try {
            $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVkam91ci5tYXJpZS1sYXVyZThAZ21haWwuY29tIiwiaWF0IjoxNjg3MDgyMjc1LCJleHAiOjE2ODcxNjg2NzV9.XO-cpn5rL2DV9xEgUKJCMWkWoofIaTX6on3bIr4WFs8";
            $response = Http::withToken($token)->withHeaders(['Content-Type' => 'application/json'])->delete('http://localhost:3001/api/users/'.$id);
            $data = $response->json();

            // return redirect()->route('users');
            return Inertia::render('Users/Index', [
                'users' => $data,
            ]);

        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            // return redirect()->route('users');
            return Inertia::render('Users/Index', [
                'error' => $errorMessage,
            ]);
        }
    }
}
