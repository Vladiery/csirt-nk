<?php

namespace App\Http\Middleware;

use App\UserRole;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn (): ?array => $request->user() === null ? null : [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role instanceof UserRole
                        ? $request->user()->role->value
                        : $request->user()->role,
                ],
            ],
            'flash' => [
                'reportTrackingCode' => fn () => $request->session()->get('reportTrackingCode'),
                'reportMailStatus' => fn () => $request->session()->get('reportMailStatus'),
                'contactSent' => fn () => $request->session()->get('contactSent'),
                'contactMailLogged' => fn () => $request->session()->get('contactMailLogged'),
                'adminStatus' => fn () => $request->session()->get('adminStatus'),
            ],
        ];
    }
}
