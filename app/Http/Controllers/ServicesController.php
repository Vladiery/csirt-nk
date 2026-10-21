<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Welcome', [
            'page' => 'services',
        ]);
    }
}
