<?php

// use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UsersController;
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

Route::middleware(['jwt'])->prefix('users')->group(function () {
    Route::get('/', [UsersController::class, 'index'])->name('users');
    Route::post('/', [UsersController::class, 'create'])->name('users.create');
    Route::get('/{id}', [UsersController::class, 'show'])->name('users.show');
    Route::put('/{id}', [UsersController::class, 'update'])->name('users.update');
    Route::delete('/{id}', [UsersController::class, 'delete'])->name('users.delete');
});

Route::prefix('plans')->middleware(['jwt'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Plans/Index');
    })->name('plans');
    Route::post('/', [PlansController::class, 'create'])->name('plans.create');
    Route::get('/{id}', [PlansController::class, 'show'])->name('plans.show');
    Route::put('/{id}', [PlansController::class, 'update'])->name('plans.update');
    Route::delete('/{id}', [PlansController::class, 'delete'])->name('plans.delete');
});

Route::prefix('products')->middleware(['jwt'])->group(function () {
    Route::get('/', [ProductsController::class, 'index'])->name('products');
    Route::post('/', [ProductsController::class, 'create'])->name('products.create');
    Route::get('/{id}', [ProductsController::class, 'show'])->name('products.show');
    Route::put('/{id}', [ProductsController::class, 'update'])->name('products.update');
    Route::delete('/{id}', [ProductsController::class, 'delete'])->name('products.delete');
});

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__.'/auth.php';
