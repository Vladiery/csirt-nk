import { useCallback, useEffect, useState } from 'react';

const coreServices = [
    {
        icon: 'alert',
        tone: 'orange',
        type: 'Layanan Proaktif',
        badge: 'Peringatan Dini',
        title: 'Pemberian Peringatan Terkait Keamanan Siber',
        description: 'Memberi peringatan kepada konstituen tentang adanya ancaman atau sedang terjadi insiden keamanan siber.',
        items: [],
        action: 'Hubungi CSIRT',
        href: 'mailto:csirt@nindyakarya.co.id?subject=Informasi%20Peringatan%20Keamanan%20Siber',
    },
    {
        icon: 'alert',
        tone: 'orange',
        type: 'Layanan Reaktif',
        badge: 'Respons Insiden',
        title: 'Penanganan Insiden Siber',
        description: 'Penanggulangan dan pemulihan infrastruktur TI beserta layanan TI jika terjadi insiden keamanan siber.',
        items: [],
        action: 'Laporkan Insiden',
        href: 'mailto:csirt@nindyakarya.co.id?subject=Aduan%20Insiden%20Siber',
    },
];

const supportingServices = [
    { icon: 'shield', tone: 'orange', label: 'Vulnerability Assessment', title: 'Penanganan Kerentanan Sistem Elektronik', description: 'Layanan ini berupa vulnerability assessment dan pemberian rekomendasi (hardening) terhadap Sistem Elektronik.', benefit: 'Identifikasi dan rekomendasi hardening' },
    { icon: 'eye', tone: 'emerald', label: 'Threat Monitoring', title: 'Pemberitahuan Hasil Pengamatan Potensi Ancaman', description: 'Layanan ini berupa pengamatan dan pemberitahuan adanya potensi ancaman serangan siber dari hasil monitoring serta referensi eksternal.', benefit: 'Informasi potensi ancaman siber' },
    { icon: 'alert', tone: 'sky', label: 'IDS / IPS', title: 'Pendeteksian Serangan', description: 'Layanan ini berupa pendeteksian serangan siber menggunakan perangkat IDS/IPS.', benefit: 'Deteksi serangan siber' },
    { icon: 'check', tone: 'rose', label: 'Risk Analysis', title: 'Analisis Risiko Keamanan Siber', description: 'Layanan ini berupa mengindentifikasi, menganalisis dan mengevaluasi risiko keamanan siber.', benefit: 'Identifikasi dan evaluasi risiko' },
    { icon: 'file', tone: 'orange', label: 'Consultation', title: 'Konsultasi terkait Kesiapan Penanganan Insiden Siber', description: 'Layanan ini berupa kegiatan konseling yang dilakukan dengan tujuan memberikan wawasan, pemahaman, dan cara yang perlu dilaksanakan dalam rangka membantu penanganan insiden siber.', benefit: 'Panduan kesiapan respons insiden' },
    { icon: 'calendar', tone: 'emerald', label: 'Security Awareness', title: 'Pembangunan Kesadaran dan Kepedulian Terhadap Keamanan Siber', description: 'Layanan ini berupa peningkatan kesadaran dan kepedulian konstituen terhadap keamanan siber (security awareness) melalui kegiatan-kegiatan kampanye dan sosialisasi/literasi.', benefit: 'Kampanye dan literasi keamanan siber' },
];

const supportingServiceSlides = Array.from(
    { length: Math.ceil(supportingServices.length / 2) },
    (_, slideIndex) => supportingServices.slice(slideIndex * 2, slideIndex * 2 + 2),
);

const toneClasses = {
    orange: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    sky: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
    rose: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
};

function ServiceSectionHeading({ Icon, title, label, description, tone = 'orange' }) {
    return (
        <div className="flex flex-col justify-between gap-3 border-b border-slate-800 pb-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
                <span className={`h-7 w-1.5 rounded-full ${tone === 'cyan' ? 'bg-cyan-500' : 'bg-orange-500'}`} />
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
                <span className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-base font-bold uppercase tracking-wide text-slate-300">{label}</span>
            </div>
            <p className="text-lg text-slate-400">{description}</p>
        </div>
    );
}

export default function Services({ Icon, isLightMode }) {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [transitionEnabled, setTransitionEnabled] = useState(true);

    function moveSupportingServices(direction) {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentSlide((slide) => slide + direction);
        }
    }

    function goToSupportingServicesSlide(slideIndex) {
        if (!isAnimating && slideIndex !== currentSlide) {
            setIsAnimating(true);
            setCurrentSlide(slideIndex);
        }
    }

    const activeSlide = currentSlide === 0
        ? supportingServiceSlides.length
        : currentSlide > supportingServiceSlides.length
            ? 1
            : currentSlide;

    const resetSupportingServicesLoop = useCallback(() => {
        if (currentSlide === supportingServiceSlides.length + 1 || currentSlide === 0) {
            setTransitionEnabled(false);
            setCurrentSlide(currentSlide === 0 ? supportingServiceSlides.length : 1);
            requestAnimationFrame(() => requestAnimationFrame(() => {
                setTransitionEnabled(true);
                setIsAnimating(false);
            }));

            return;
        }

        setIsAnimating(false);
    }, [currentSlide]);

    useEffect(() => {
        if (!isAnimating) return undefined;

        const fallbackTimer = window.setTimeout(resetSupportingServicesLoop, 900);
        return () => window.clearTimeout(fallbackTimer);
    }, [isAnimating, resetSupportingServicesLoop]);

    const handleSupportingServicesTransitionEnd = useCallback((event) => {
        if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;

        resetSupportingServicesLoop();
    }, [resetSupportingServicesLoop]);

    return (
        <>
            <section className="border-b border-slate-800/80 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                <div className="mx-auto w-full">
                    <span className="inline-flex items-center gap-2 rounded border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-base font-bold tracking-wide text-orange-400">
                        <Icon className="h-4 w-4" name="shield" /> PORTOFOLIO KEAMANAN SIBER
                    </span>
                    <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Katalog Layanan CSIRT</h1>
                            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-400">Layanan terpadu proteksi, pencegahan dini, dan penanggulangan insiden siber untuk melindungi seluruh aset digital dan sistem strategis PT Nindya Karya.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-slate-800/80 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
                <div className="mx-auto w-full">
                    <ServiceSectionHeading Icon={Icon} title="Layanan Utama" label="Core Services" description="Prioritas penanganan insiden & stabilitas operasional" />
                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                        {coreServices.map((service) => (
                            <article className="flex flex-col rounded-xl border border-slate-800 border-l-4 bg-[#121b2d] p-5 sm:p-6" key={service.title}>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className={`grid h-12 w-12 place-items-center rounded-xl border ${toneClasses[service.tone]}`}><Icon className="h-5 w-5" name={service.icon} /></span>
                                    <div className="flex flex-wrap gap-2 text-base font-semibold">
                                        <span className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-slate-300">{service.type}</span>
                                        <span className={`rounded border px-2.5 py-1.5 ${toneClasses[service.tone]}`}>{service.badge}</span>
                                    </div>
                                </div>
                                <h3 className="mt-5 text-2xl font-bold tracking-tight text-white">{service.title}</h3>
                                <p className="mt-2 text-lg leading-relaxed text-slate-400">{service.description}</p>
                                {service.items.length > 0 && (
                                    <ul className="mt-5 space-y-2.5">
                                        {service.items.map((item) => <li className="flex items-start gap-2.5 text-lg leading-relaxed text-slate-300" key={item}><span className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full ${service.tone === 'orange' ? 'bg-orange-500/15 text-orange-400' : 'bg-emerald-500/15 text-emerald-400'}`}><Icon className="h-2.5 w-2.5" name="check" /></span>{item}</li>)}
                                    </ul>
                                )}
                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-base">
                                    <a className={`font-semibold transition ${service.tone === 'orange' ? 'text-orange-400 hover:text-orange-300' : 'text-emerald-400 hover:text-emerald-300'}`} href={service.href}>{service.action} →</a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
                <div className="mx-auto w-full">
                    <ServiceSectionHeading Icon={Icon} title="Layanan Tambahan" label="Supporting Services" description="Preventif, edukasi, dan pemberdayaan tata kelola siber" tone="cyan" />
                    <div className="mt-6">
                        <div className="flex items-center gap-3">
                            <button aria-label="Geser layanan tambahan ke kiri" className={`order-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border text-xl font-semibold shadow-lg transition duration-200 hover:scale-105 hover:border-emerald-500 hover:text-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${isLightMode ? 'border-slate-300 bg-white text-slate-700' : 'border-slate-600 bg-[#090e1b]/90 text-slate-100'}`} disabled={isAnimating} onClick={() => moveSupportingServices(-1)} type="button">←</button>
                            <button aria-label="Geser layanan tambahan ke kanan" className={`order-3 grid h-10 w-10 shrink-0 place-items-center rounded-full border text-xl font-semibold shadow-lg transition duration-200 hover:scale-105 hover:border-emerald-500 hover:text-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${isLightMode ? 'border-slate-300 bg-white text-slate-700' : 'border-slate-600 bg-[#090e1b]/90 text-slate-100'}`} disabled={isAnimating} onClick={() => moveSupportingServices(1)} type="button">→</button>
                            <div className="order-2 min-w-0 flex-1 overflow-hidden">
                                <div className="flex" style={{ transform: `translateX(-${currentSlide * 100}%)`, transition: transitionEnabled ? 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none' }} onTransitionCancel={handleSupportingServicesTransitionEnd} onTransitionEnd={handleSupportingServicesTransitionEnd}>
                                {[supportingServiceSlides.at(-1), ...supportingServiceSlides, supportingServiceSlides[0]].map((slide, slideIndex) => (
                                    <div className="grid min-w-full grid-cols-2 gap-4" key={slideIndex}>
                                        {slide.map((service) => (
                                            <article className="rounded-xl border border-slate-800 bg-[#121b2d] p-4 sm:p-5" key={service.title}>
                                                <div className="flex items-center gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${toneClasses[service.tone]}`}><Icon className="h-4 w-4" name={service.icon} /></span><span className="text-xs font-bold uppercase tracking-wide text-slate-400 sm:text-sm">{service.label}</span></div>
                                                <h3 className="mt-4 text-base font-bold text-white sm:text-xl">{service.title}</h3>
                                                <p className="mt-2 min-h-24 text-sm leading-relaxed text-slate-400 sm:text-base">{service.description}</p>
                                                <div className="mt-4 flex items-start gap-2 border-t border-slate-800 pt-4 text-sm font-medium text-emerald-400 sm:text-base"><Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" name="check" />{service.benefit}</div>
                                            </article>
                                        ))}
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                        <nav aria-label="Pilih slide layanan tambahan" className="mt-5 flex justify-center gap-2">
                            {supportingServiceSlides.map((_, index) => (
                                <button aria-current={activeSlide === index + 1 ? 'true' : undefined} aria-label={`Tampilkan pasangan layanan ${index + 1}`} className={`grid h-9 min-w-9 place-items-center rounded-lg border px-2 text-sm font-semibold transition ${activeSlide === index + 1 ? 'border-emerald-500 bg-emerald-500 text-[#07111f]' : 'border-slate-700 bg-[#121b2d] text-slate-400 hover:border-emerald-500/60 hover:text-emerald-400'}`} disabled={isAnimating} key={index} onClick={() => goToSupportingServicesSlide(index + 1)} type="button">{index + 1}</button>
                            ))}
                        </nav>
                    </div>
                </div>
            </section>
        </>
    );
}
