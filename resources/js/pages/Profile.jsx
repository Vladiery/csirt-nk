export default function Profile({ Icon }) {
    const credentials = [
        { icon: 'shield', tone: 'emerald', title: 'Terverifikasi BSSN', detail: 'Terdaftar formal tahun 2023' },
        { icon: 'building', tone: 'sky', title: 'ISO/IEC 27001', detail: 'Kepatuhan tata kelola SMKI' },
        { icon: 'alert', tone: 'orange', title: 'BUMN-CSIRT', detail: 'Jejaring kolaborasi BUMN' },
    ];
    const missions = [
        'Mengoordinasikan penanganan insiden keamanan siber di PT Nindya Karya.',
        'Membangun pelaporan, penanganan, dan penanggulangan insiden keamanan siber di lingkungan PT Nindya Karya.',
        'Meningkatkan kesadaran keamanan siber di PT Nindya Karya.',
        'Memberikan bantuan teknis pada konstituen.',
    ];
    return (
        <>
            <section className="border-b border-slate-800/80 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                <div className="mx-auto w-full">
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Profil Tim <span className="text-orange-500">(NK-CSIRT)</span></h1>
                    <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-400 sm:text-lg">Mengenal mandat, visi, dan misi kesiapsiagaan siber PT Nindya Karya (Persero) di bawah koordinasi Badan Siber dan Sandi Negara (BSSN).</p>
                </div>
            </section>

            <section className="border-b border-slate-800/80 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                <div className="mx-auto grid w-full gap-8 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-7">
                        <span className="text-base font-bold tracking-[0.15em] text-orange-400">TENTANG ORGANISASI</span>
                        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Garda Terdepan Ketahanan Siber Konstruksi Nasional</h2>
                        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-400">Nindya-CSIRT dibentuk berdasarkan mandat Peraturan Presiden terkait Kesiapsiagaan Siber dan regulasi BSSN untuk memastikan perlindungan menyeluruh terhadap aset teknologi informasi, kerahasiaan data operasional, dan kontinuitas layanan proyek infrastruktur strategis nasional yang dikelola oleh PT Nindya Karya (Persero).</p>
                        <div className="mt-7 grid gap-3 sm:grid-cols-3">
                            {credentials.map((credential) => (
                                <article className="rounded-xl border border-slate-800 bg-[#121b2d] p-4" key={credential.title}>
                                    <span className={`grid h-9 w-9 place-items-center rounded-lg border ${credential.tone === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : ''} ${credential.tone === 'sky' ? 'border-sky-500/30 bg-sky-500/10 text-sky-400' : ''} ${credential.tone === 'orange' ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' : ''}`}>
                                        <Icon className="h-4 w-4" name={credential.icon} />
                                    </span>
                                    <h3 className="mt-3 text-base font-bold text-slate-100">{credential.title}</h3>
                                    <p className="mt-1 text-base text-slate-400">{credential.detail}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                    <aside className="relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-2xl border border-slate-800 bg-[#121b2d] p-6 sm:min-h-80 sm:p-8 lg:col-span-5">
                        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-[#121b2d] to-[#090e1b]" />
                        <div className="absolute right-7 top-7 grid h-16 w-16 place-items-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400 sm:h-20 sm:w-20">
                            <Icon className="h-9 w-9 sm:h-11 sm:w-11" name="shield" />
                        </div>
                        
                        <h2 className="mt-4 max-w-sm text-2xl font-bold leading-tight text-white">Pusat Monitoring & Mitigasi Insiden Terpadu</h2>
                        <p className="mt-3 max-w-md text-lg leading-relaxed text-slate-400">Pengawasan telemetri dan respons cepat terhadap anomali keamanan jaringan korporasi.</p>
                    </aside>
                </div>
            </section>

            <section className="border-b border-slate-800/80 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-20">
                <div className="mx-auto w-full">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-base font-bold tracking-[0.15em] text-orange-400">LANDASAN STRATEGIS</span>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Visi & Misi NK-CSIRT</h2>
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-2">
                        <article className="rounded-2xl border border-slate-800 bg-[#121b2d] p-6 sm:p-8">
                            <div className="flex items-center gap-3">
                                <span className="grid h-11 w-11 place-items-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400"><Icon className="h-5 w-5" name="eye" /></span>
                                <div><span className="text-base font-bold tracking-[0.15em] text-slate-400">VISI KAMI</span><span className="mt-1 block h-0.5 w-8 bg-orange-500" /></div>
                            </div>
                            <p className="mt-6 text-lg font-semibold leading-relaxed text-slate-100 sm:text-lg">Terwujudnya pengelolaan ketahanan siber PT Nindya Karya yang responsif dan efektif dalam rangka mendukung transformasi digital perusahaan dan melindungi aset informasi perusahaan.</p>
                            <blockquote className="mt-7 border-l-2 border-orange-500 bg-[#090e1b]/70 px-4 py-3 text-base italic leading-relaxed text-slate-400">“Menjamin kelangsungan bisnis konstruksi bebas dari interupsi ancaman digital lintas sektor.”</blockquote>
                        </article>
                        <article className="rounded-2xl border border-slate-800 bg-[#121b2d] p-6 sm:p-8">
                            <div className="flex items-center gap-3">
                                <span className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"><Icon className="h-5 w-5" name="check" /></span>
                                <div><span className="text-base font-bold tracking-[0.15em] text-slate-400">MISI KAMI</span><span className="mt-1 block h-0.5 w-8 bg-emerald-500" /></div>
                            </div>
                            <ol className="mt-6 space-y-4">
                                {missions.map((mission, index) => (
                                    <li className="flex items-start gap-3 text-lg leading-relaxed text-slate-400" key={mission}>
                                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-600 text-base font-bold text-white">{index + 1}</span>
                                        {mission}
                                    </li>
                                ))}
                            </ol>
                            <p className="mt-6 border-t border-slate-800 pt-4 text-right font-mono text-base tracking-wide text-slate-500">Sesuai Panduan RFC 2350</p>
                        </article>
                    </div>
                </div>
            </section>

        </>
    );
}
