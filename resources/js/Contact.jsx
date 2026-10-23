import { useForm, Link } from '@inertiajs/react';

const contactChannels = [
    {
        icon: 'mail',
        label: 'Email CSIRT',
        value: 'csirt@nindyakarya.co.id',
        href: 'mailto:csirt@nindyakarya.co.id',
        detail: 'Untuk pertanyaan umum dan koordinasi keamanan siber.',
    },
    {
        icon: 'phone',
        label: 'Hotline 24/7',
        value: '021 8093276',
        href: 'tel:+62218093276',
        detail: 'Hubungi kami untuk kebutuhan respons insiden yang mendesak.',
    },
    {
        icon: 'building',
        label: 'Kantor',
        value: 'Nindya Karya, Jakarta',
        detail: 'Gedung Nindya Karya, Lt. 7, Jl. Letjend M.T. Haryono Kav. 22, Jakarta 13630.',
    },
];

function ContactIcon({ name }) {
    const paths = {
        mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
        phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.7a2 2 0 0 1-.6 1.9L7.7 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 1.9-.6l2.7.5a2 2 0 0 1 1.7 2.7Z" />,
        building: <><path d="M4 21h16M6 21V5l6-2 6 2v16" /><path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4" /></>,
    };

    return <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">{paths[name]}</svg>;
}

export default function Contact({ flash = {}, isLightMode }) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', email: '', subject: '', message: '' });
    const panelClass = isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800 bg-[#121b2d]';
    const headingClass = isLightMode ? 'text-slate-900' : 'text-slate-100';
    const mutedClass = isLightMode ? 'text-slate-600' : 'text-slate-400';
    const fieldClass = `w-full rounded-lg border px-3.5 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${isLightMode ? 'border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400' : 'border-slate-700 bg-[#0b1120] text-slate-100 placeholder:text-slate-500'}`;

    function submitMessage(event) {
        event.preventDefault();
        post('/kontak', { preserveScroll: true, onSuccess: () => reset() });
    }

    return (
        <section className="border-b border-slate-800/80 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <div className="mx-auto w-full">
                <header className="mb-9 max-w-3xl">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide ${isLightMode ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> HUBUNGI KAMI
                    </span>
                    <h1 className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl ${headingClass}`}>Kontak Kami</h1>
                    <p className={`mt-3 text-base leading-relaxed sm:text-lg ${mutedClass}`}>Tim Nindya CSIRT siap membantu pertanyaan, koordinasi, dan kebutuhan keamanan siber Anda.</p>
                </header>

                <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                    <aside className="space-y-4">
                        {contactChannels.map((channel) => {
                            const details = (
                                <>
                                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${isLightMode ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'}`}><ContactIcon name={channel.icon} /></span>
                                    <span className="min-w-0">
                                        <span className={`block text-xs font-semibold uppercase tracking-wide ${mutedClass}`}>{channel.label}</span>
                                        <span className={`mt-1 block font-semibold ${headingClass}`}>{channel.value}</span>
                                        <span className={`mt-1 block text-sm leading-relaxed ${mutedClass}`}>{channel.detail}</span>
                                    </span>
                                </>
                            );

                            return (
                                <article className={`flex gap-4 rounded-xl border p-5 ${panelClass}`} key={channel.label}>
                                    {channel.href ? <a aria-label={`${channel.label}: ${channel.value}`} className="flex gap-4" href={channel.href}>{details}</a> : details}
                                </article>
                            );
                        })}
                        <div className={`rounded-xl border p-5 ${isLightMode ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-amber-500/20 bg-amber-500/5 text-amber-200'}`}>
                            <h2 className="font-semibold">Laporkan insiden siber</h2>
                            <p className="mt-1 text-sm leading-relaxed opacity-80">Untuk insiden yang sedang berlangsung, gunakan formulir pelaporan agar tim dapat melakukan triase dengan tepat.</p>
                            <Link className="mt-3 inline-flex font-semibold text-orange-500 hover:text-orange-400" href="/laporan-insiden">Buka formulir laporan →</Link>
                        </div>
                    </aside>

                    <div className={`rounded-2xl border p-5 sm:p-7 ${panelClass}`}>
                        <div className={`border-b pb-5 ${isLightMode ? 'border-slate-200' : 'border-slate-800'}`}>
                            <h2 className={`text-xl font-bold ${headingClass}`}>Kirim pesan kepada kami</h2>
                            <p className={`mt-1 text-sm ${mutedClass}`}>Gunakan formulir ini untuk menyampaikan pesan kepada tim CSIRT.</p>
                        </div>
                        {flash.contactSent && (
                            <div className="mt-5 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
                                Terima kasih. Pesan Anda sudah diterima melalui formulir kontak.
                            </div>
                        )}
                        {errors.contact && <p className="mt-5 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">{errors.contact}</p>}
                        <form className="mt-6 space-y-5" onSubmit={submitMessage}>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className={`block text-sm font-semibold ${headingClass}`} htmlFor="contact-name">Nama</label>
                                    <input autoComplete="name" className={fieldClass} id="contact-name" name="name" onChange={(event) => setData('name', event.target.value)} placeholder="Nama lengkap" required value={data.name} />
                                    {errors.name && <p className="text-sm text-rose-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className={`block text-sm font-semibold ${headingClass}`} htmlFor="contact-email">Email</label>
                                    <input autoComplete="email" className={fieldClass} id="contact-email" name="email" onChange={(event) => setData('email', event.target.value)} placeholder="nama@perusahaan.co.id" required type="email" value={data.email} />
                                    {errors.email && <p className="text-sm text-rose-500">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`block text-sm font-semibold ${headingClass}`} htmlFor="contact-subject">Subjek</label>
                                <input className={fieldClass} id="contact-subject" name="subject" onChange={(event) => setData('subject', event.target.value)} placeholder="Tujuan menghubungi kami" required value={data.subject} />
                                {errors.subject && <p className="text-sm text-rose-500">{errors.subject}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className={`block text-sm font-semibold ${headingClass}`} htmlFor="contact-message">Pesan</label>
                                <textarea className={`${fieldClass} min-h-40 resize-y`} id="contact-message" name="message" onChange={(event) => setData('message', event.target.value)} placeholder="Tuliskan pesan Anda..." required value={data.message} />
                                {errors.message && <p className="text-sm text-rose-500">{errors.message}</p>}
                            </div>
                            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60 sm:w-auto" disabled={processing} type="submit">
                                <ContactIcon name="mail" /> {processing ? 'Mengirim Pesan...' : 'Kirim Pesan'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
