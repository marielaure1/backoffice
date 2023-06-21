<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Http;

class ProductsController extends Controller
{
    /**
     * Afficher tous les produits
     */
    public function index(): Response
    {

        try {
            $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVkam91ci5tYXJpZS1sYXVyZThAZ21haWwuY29tIiwiaWF0IjoxNjg3MDgyMjc1LCJleHAiOjE2ODcxNjg2NzV9.XO-cpn5rL2DV9xEgUKJCMWkWoofIaTX6on3bIr4WFs8";
            $response = Http::withToken($token)->withHeaders(['Content-Type' => 'application/json'])->get('http://localhost:3001/api/products');
            $products = $response->json();

            return Inertia::render('Products/Index', [
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            return Inertia::render('Products/Index', [
                'error' => $errorMessage,
            ]);
        }
    }

    /**
     * Afficher un produit
     */
    public function show(Request $request, int $id): Response
    {

        try {
            $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVkam91ci5tYXJpZS1sYXVyZThAZ21haWwuY29tIiwiaWF0IjoxNjg3MDgyMjc1LCJleHAiOjE2ODcxNjg2NzV9.XO-cpn5rL2DV9xEgUKJCMWkWoofIaTX6on3bIr4WFs8";
            $response = Http::withToken($token)->withHeaders(['Content-Type' => 'application/json'])->get('http://localhost:3001/api/products/'.$id);
            $data = $response->json();

            return Inertia::render('Products/Show', [
                "data" => $data,
                "id" => $id
            ]);

        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            return Inertia::render("Products/Show", [
                "error" => $errorMessage,
            ]);
        }
    }

     /**
     * Modifier un produit
     */
    public function update(Request $request, int $id): Response
    {

        try {
            $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVkam91ci5tYXJpZS1sYXVyZThAZ21haWwuY29tIiwiaWF0IjoxNjg3MDgyMjc1LCJleHAiOjE2ODcxNjg2NzV9.XO-cpn5rL2DV9xEgUKJCMWkWoofIaTX6on3bIr4WFs8";
            $response = Http::withToken($token)->withHeaders(['Content-Type' => 'application/json'])->put('http://localhost:3001/api/products/'.$id, $request->all());
            $data = $response->json();

            return to_route('products.update');

        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            return to_route('products.update');
        }
    }

    /**
     * Supprimer un produit
     */
    public function delete(Request $request, int $id): Response
    {

        try {
            $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVkam91ci5tYXJpZS1sYXVyZThAZ21haWwuY29tIiwiaWF0IjoxNjg3MDgyMjc1LCJleHAiOjE2ODcxNjg2NzV9.XO-cpn5rL2DV9xEgUKJCMWkWoofIaTX6on3bIr4WFs8";
            $response = Http::withToken($token)->withHeaders(['Content-Type' => 'application/json'])->delete('http://localhost:3001/api/products/'.$id);
            $data = $response->json();

            // return redirect()->route('products');
            return Inertia::render('Products/Index', [
                'products' => $data,
            ]);

        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            // return redirect()->route('products');
            return Inertia::render('Products/Index', [
                'error' => $errorMessage,
            ]);
        }
    }
}
