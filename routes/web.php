<?php
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['jwt'])->get('/', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::prefix('users')->middleware(['jwt'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Users/Index');
    })->name('users');
    Route::get('/{id}', function (int $id) {
        return Inertia::render('Users/Show', [
            "id" => $id
        ]);
    })->name('users.show');
});

Route::prefix('plans')->middleware(['jwt'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Plans/Index');
    })->name('plans');
    Route::get('/{id}', function (int $id) {
        return Inertia::render('Plans/Show', [
            "id" => $id
        ]);
    })->name('plans.show');
});

Route::prefix('abonnements')->middleware(['jwt'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Abonnements/Index');
    })->name('abonnements');
    Route::get('/{id}', function (int $id) {
        return Inertia::render('Abonnements/Show', [
            "id" => $id
        ]);
    })->name('abonnements.show');
});

Route::prefix('articles')->middleware(['jwt'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Articles/Index');
    })->name('articles');
    Route::get('/{id}', function (int $id) {
        return Inertia::render('Articles/Show', [
            "id" => $id
        ]);
    })->name('articles.show');
});

Route::prefix('collections')->middleware(['jwt'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Collections/Index');
    })->name('collections');
    Route::get('/{id}', function (int $id) {
        return Inertia::render('Collections/Show', [
            "id" => $id
        ]);
    })->name('collections.show');
});
Route::prefix('products')->middleware(['jwt'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Products/Index');
    })->name('products');
    Route::get('/{id}', function (int $id) {
        return Inertia::render('Products/Show', [
            "id" => $id
        ]);
    })->name('products.show');
});
Route::prefix('categories')->middleware(['jwt'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Categories/Index');
    })->name('categories');
    Route::get('/{id}', function (int $id) {
        return Inertia::render('Categories/Show', [
            "id" => $id
        ]);
    })->name('categories.show');
});
Route::prefix('promos-codes')->middleware(['jwt'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('PromoCode/Index');
    })->name('promo_code');
    Route::get('/{id}', function (int $id) {
        return Inertia::render('PromoCode/Show', [
            "id" => $id
        ]);
    })->name('promo_code.show');
});
Route::prefix('commandes')->middleware(['jwt'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Commandes/Index');
    })->name('subscriptions_order');
    Route::get('/{id}', function (int $id) {
        return Inertia::render('Commandes/Show', [
            "id" => $id
        ]);
    })->name('subscriptions_order.show');
});

Route::prefix('medias')->middleware(['jwt'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Medias/Index');
    })->name('medias');
});

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__.'/auth.php';
