<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ContactController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Welcome', [
            'page' => 'contact',
        ]);
    }

    public function send(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120', 'not_regex:/[\r\n]/'],
            'email' => ['required', 'email', 'max:254'],
            'subject' => ['required', 'string', 'max:160', 'not_regex:/[\r\n]/'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        try {
            Mail::to(config('mail.contact_address'))->send(new ContactMessageMail(
                senderName: $validated['name'],
                senderEmail: $validated['email'],
                messageSubject: $validated['subject'],
                messageBody: $validated['message'],
            ));
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withErrors(['contact' => 'Pesan belum dapat dikirim. Silakan coba lagi atau hubungi kami melalui email.'])
                ->withInput();
        }

        return to_route('contact')->with('contactSent', true);
    }
}
