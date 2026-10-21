<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Welcome', [
            'page' => 'profile',
        ]);
    }
}
