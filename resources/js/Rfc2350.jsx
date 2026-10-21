const requestLinks = [
    {
        icon: 'file',
        tone: 'orange',
        label: 'BAHASA INDONESIA',
        title: 'Dokumen RFC 2350 (ID)',
        description: 'Salinan profil, mandat, konstituen, kewenangan, dan katalog layanan penanganan insiden siber dalam Bahasa Indonesia.',
        download: '/rfc2350/download',
        subject: 'Permintaan Dokumen RFC 2350 Bahasa Indonesia',
    },
    {
        icon: 'download',
        tone: 'sky',
        label: 'ENGLISH VERSION',
        title: 'RFC 2350 Document (EN)',
        description: 'Official documentation of the Nindya-CSIRT profile, policies, operational mandate, and incident response services.',
        subject: 'Request for RFC 2350 document in English',
    },
];

export default function Rfc2350({ Icon, rfcDocument = {} }) {
    return (
        <>
            <section className="border-b border-slate-800/80 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                <div className="mx-auto w-full">
                    <span className="inline-flex items-center gap-2 rounded border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 font-mono text-base font-semibold tracking-wide text-orange-400">
                        <Icon className="h-4 w-4" name="shield" /> ID: CSIRT-NINDYA-RFC2350-V{rfcDocument.version ?? '1.10'}
                    </span>
                    <div className="mt-4 flex flex-wrap items-start justify-between gap-5">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Dokumen & Kunci Publik RFC 2350</h1>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-sm font-bold tracking-wide text-emerald-400">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" /> DOKUMEN RFC 2350
                        </span>
                    </div>
                </div>
            </section>

            <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                <div className="mx-auto w-full">
                    <div className="grid gap-4 lg:grid-cols-3">
                        {requestLinks.map((document) => (
                            <article className={`relative flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#121b2d] p-6 before:absolute before:inset-x-0 before:top-0 before:h-1 ${document.tone === 'orange' ? 'before:bg-orange-500' : 'before:bg-sky-500'}`} key={document.title}>
                                <div className="flex items-center justify-between gap-4">
                                    <span className={`grid h-12 w-12 place-items-center rounded-xl border ${document.tone === 'orange' ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' : 'border-sky-500/30 bg-sky-500/10 text-sky-400'}`}>
                                        <Icon className="h-5 w-5" name={document.icon} />
                                    </span>
                                    <span className={`rounded border px-2.5 py-1 font-mono text-sm font-semibold tracking-wide ${document.tone === 'orange' ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' : 'border-sky-500/30 bg-sky-500/10 text-sky-400'}`}>
                                        {document.label}
                                    </span>
                                </div>
                                <h2 className="mt-6 text-2xl font-bold text-white">{document.title}</h2>
                                <p className="mt-3 text-base leading-relaxed text-slate-400">{document.description}</p>
                                <div className="mt-auto border-t border-slate-800 pt-5">
                                    <p className="mb-4 flex items-center gap-2 text-base text-slate-500">
                                        <Icon className="h-4 w-4" name={document.download ? 'file' : 'mail'} /> {document.download ? `PDF resmi • Versi ${rfcDocument.version ?? '1.10'}` : 'Salinan resmi tersedia melalui tim CSIRT'}
                                    </p>
                                    <a className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-base font-bold text-white transition ${document.tone === 'orange' ? 'bg-orange-600 hover:bg-orange-500' : 'border border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20'}`} href={document.download ?? `mailto:csirt@nindyakarya.co.id?subject=${encodeURIComponent(document.subject)}`} {...(document.download ? { download: true } : {})}>
                                        <Icon className="h-4 w-4" name={document.download ? 'download' : 'mail'} /> {document.download ? 'Unduh RFC 2350 (ID)' : 'Minta Salinan Dokumen'}
                                    </a>
                                </div>
                            </article>
                        ))}

                        <article className="flex min-h-[390px] flex-col rounded-2xl border border-slate-800 bg-[#121b2d] p-6">
                            <div className="flex items-center justify-between gap-4">
                                <span className="grid h-12 w-12 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                                    <Icon className="h-5 w-5" name="key" />
                                </span>
                                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-sm font-semibold tracking-wide text-emerald-400">KUNCI PUBLIK</span>
                            </div>
                            <h2 className="mt-6 text-2xl font-bold text-white">PGP Public Key Resmi</h2>
                            <p className="mt-3 text-base leading-relaxed text-slate-400">Gunakan kunci publik resmi CSIRT untuk mengenkripsi laporan sensitif setelah menerima berkas dan fingerprint yang terverifikasi.</p>
                            <div className="mt-5 rounded-xl border border-slate-700 bg-[#090e1b]/70 p-4">
                                <p className="font-mono text-sm font-semibold text-amber-300">Kunci publik belum tersedia di portal.</p>
                                <p className="mt-2 text-sm leading-relaxed text-slate-500">Hubungi tim CSIRT untuk meminta berkas kunci dan memverifikasi fingerprint melalui kanal resmi.</p>
                            </div>
                            <a className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-base font-bold text-white transition hover:bg-emerald-600" href="mailto:csirt@nindyakarya.co.id?subject=Permintaan%20PGP%20Public%20Key%20CSIRT">
                                <Icon className="h-4 w-4" name="mail" /> Minta Kunci Publik
                            </a>
                        </article>
                    </div>

                    <aside className="mt-8 flex items-start gap-4 rounded-2xl border border-slate-800 bg-[#121b2d] p-5 sm:items-center sm:p-6">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                            <Icon className="h-5 w-5" name="shield" />
                        </span>
                        <p className="text-base leading-relaxed text-slate-300">Untuk menjaga keaslian dokumen dan kunci, mintalah salinan langsung melalui <a className="font-semibold text-emerald-400 hover:text-emerald-300" href="mailto:csirt@nindyakarya.co.id">csirt@nindyakarya.co.id</a> dan verifikasi fingerprint melalui tim CSIRT.</p>
                    </aside>
                </div>
            </section>
        </>
    );
}
