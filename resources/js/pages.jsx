import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import Profile from './Profile';
import Report from './Report';
import Rfc2350 from './Rfc2350';
import Services from './Services';
import News from './News';
import Contact from './Contact';
import StaffLogin from './StaffLogin';
import AdminPanel from './AdminPanel';

const navigation = [
    { label: 'Beranda', href: '/', active: true },
    { label: 'Profil', href: '/profil' },
    { label: 'RFC 2350', href: '/rfc2350' },
    { label: 'Layanan', href: '/layanan' },
    { label: 'Aduan Siber', href: '/laporan-insiden' },
    {
        label: 'Informasi',
        items: [
            { label: 'Artikel', href: '/artikel' },
            { label: 'Berita', href: '/berita' },
        ],
    },
];

const responseSteps = [
    {
        number: '01',
        icon: 'eye',
        title: 'Temukan Anomali',
        description: 'Kenali gejala infeksi malware atau aktivitas akun yang mencurigakan.',
        note: 'Jangan matikan paksa PC',
        tone: 'amber',
    },
    {
        number: '02',
        icon: 'lock',
        title: 'Isolasi Perangkat Jaringan',
        description: 'Cabut kabel LAN dan matikan koneksi nirkabel seketika.',
        note: 'Putus jaringan segera',
        tone: 'rose',
    },
    {
        number: '03',
        icon: 'file',
        title: 'Isi Formulir Pelaporan',
        description: 'Kirimkan informasi awal insiden melalui email CSIRT atau hubungi hotline darurat.',
        note: 'Data pelapor dijaga',
        tone: 'sky',
    },
    {
        number: '04',
        icon: 'shield',
        title: 'Tim CSIRT Triage & Selesai',
        description: 'Tim CSIRT meninjau laporan dan membantu pemulihan insiden.',
        note: 'Tiket dapat ditindaklanjuti',
        tone: 'emerald',
    },
];

function Icon({ name, className = 'h-4 w-4' }) {
    const paths = {
        alert: <><path d="m12 3 9 16H3L12 3Z" /><path d="M12 9v4m0 3h.01" /></>,
        arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
        building: <><path d="M4 21h16M6 21V5l6-2 6 2v16M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4" /></>,
        calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
        check: <path d="m5 12 4 4L19 6" />,
        chevron: <path d="m9 18 6-6-6-6" />,
        download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
        eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
        file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6m-9 5 4 4m0-4-4 4" /></>,
        lock: <><rect x="3" y="10" width="18" height="11" rx="2" /><path d="M7 10V7a5 5 0 0 1 10 0v3m-5 5v2" /></>,
        mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
        key: <><circle cx="8" cy="15" r="4" /><path d="m10.85 12.15 7.65-7.65 3 3-2 2 2 2-3 3-2-2-3.65 3.65" /></>,
        phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.7a2 2 0 0 1-.6 1.9L7.7 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 1.9-.6l2.7.5a2 2 0 0 1 1.7 2.7Z" /></>,
        shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
        users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    };

    return (
        <svg
            aria-hidden="true"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
        >
            {paths[name]}
        </svg>
    );
}

function HeaderBrand() {
    return (
        <Link aria-label="NK CSIRT, Beranda" className="inline-flex items-center gap-3" href="/">
            <span className="leading-tight">
                <span className="block text-2xl font-bold tracking-[0.08em] text-slate-100 sm:text-3xl">
                    NK-<span className="text-orange-500">CSIRT</span>
                </span>
            </span>
        </Link>
    );
}

function FooterBrand() {
    return (
        <Link aria-label="Nindya Karya CSIRT, Beranda" className="inline-flex items-center gap-3" href="/">
            <span className="drop-shadow-[0_1px_5px_rgba(0,0,0,0.75)]">
                <img alt="Logo NK-CSIRT" className="h-14 w-auto object-contain" src="/images/logo_nkcsirt.png" />
            </span>
            <span className="leading-tight">
                <span className="block text-base font-semibold tracking-[0.18em] text-slate-400">NINDYA KARYA</span>
                <span className="mt-1 block text-xl font-extrabold tracking-[0.08em] text-slate-100">
                    <span className="text-orange-500">CSIRT</span>
                </span>
            </span>
        </Link>
    );
}

function NavigationLink({ href, className, children }) {
    if (!href.startsWith('/')) {
        return <a className={className} href={href}>{children}</a>;
    }

    return <Link className={className} href={href}>{children}</Link>;
}

function ThemeToggle({ isLightMode, onToggle }) {
    return (
        <button
            aria-label={isLightMode ? 'Beralih ke mode gelap' : 'Beralih ke mode terang'}
            aria-pressed={isLightMode}
            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            onClick={onToggle}
            type="button"
        >
            <span className={`relative flex h-9 w-[76px] items-center rounded-full border p-1 transition-colors ${isLightMode ? 'border-slate-300 bg-slate-200' : 'border-slate-700 bg-slate-800'}`}>
                <svg aria-hidden="true" className={`absolute left-2 h-4 w-4 ${isLightMode ? 'text-slate-500' : 'text-amber-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
                </svg>
                <svg aria-hidden="true" className={`absolute right-2 h-4 w-4 ${isLightMode ? 'text-amber-500' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="3.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                </svg>
                <span className={`relative z-10 h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-200 ${isLightMode ? 'translate-x-9' : 'translate-x-0'}`} />
            </span>
        </button>
    );
}

function AccountMenu({ user, isLightMode }) {
    const panelHref = '/admin/dashboard';

    return (
        <details className="group relative">
            <summary aria-label="Menu petugas" className={`grid h-10 w-10 cursor-pointer list-none place-items-center rounded-lg border transition [&::-webkit-details-marker]:hidden ${isLightMode ? 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100' : 'border-slate-800 bg-[#121b2d] text-slate-300 hover:border-slate-700 hover:text-white'}`}>
                <Icon className="h-4 w-4" name="users" />
            </summary>
            <div className={`absolute right-0 top-full z-40 mt-2 min-w-52 rounded-xl border p-2 shadow-xl ${isLightMode ? 'border-slate-200 bg-white' : 'border-slate-700 bg-[#101829]'}`}>
                {user ? (
                    <>
                        <p className={`truncate px-3 py-2 text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{user.email}</p>
                        <Link className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${isLightMode ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-200 hover:bg-slate-800'}`} href={panelHref}>Panel Petugas</Link>
                        <Link as="button" className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${isLightMode ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-200 hover:bg-slate-800'}`} href="/logout" method="post">Keluar</Link>
                    </>
                ) : null}
            </div>
        </details>
    );
}

function HighlightCard({ highlight }) {
    const tagTone = highlight.type === 'Berita'
        ? 'border-orange-500/30 bg-orange-500/10 text-orange-400'
        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
    const image = highlight.imagePath
        ? highlight.imagePath.startsWith('http') || highlight.imagePath.startsWith('/')
            ? highlight.imagePath
            : `/storage/${highlight.imagePath}`
        : null;

    return (
        <article className="flex min-h-[300px] flex-col rounded-xl border border-slate-800 bg-[#121b2d] p-5 transition duration-200 hover:-translate-y-1 hover:border-slate-700 hover:bg-[#151f33]">
            <div className="-mx-5 -mt-5 mb-4 aspect-[16/9] overflow-hidden rounded-t-xl bg-[#0b1120]">
                {image ? (
                    <img alt="" className="h-full w-full object-contain p-2" loading="lazy" src={image} />
                ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-emerald-900/50 via-[#172238] to-[#0b1120]">
                        <Icon className="h-10 w-10 text-emerald-400" name="shield" />
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between gap-3">
                <span className={`rounded border px-2 py-1 text-base font-bold tracking-wide ${tagTone}`}>
                    {highlight.type}
                </span>
                <span className="flex items-center gap-1.5 text-base text-slate-500">
                    <Icon className="h-3.5 w-3.5" name="calendar" />
                    {new Date(highlight.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
            </div>

            <h3 className="mt-5 text-lg font-bold leading-snug text-slate-100">{highlight.title}</h3>
            <p className="mt-3 line-clamp-4 text-lg leading-relaxed text-slate-400">{highlight.summary || 'Baca informasi selengkapnya dari tim CSIRT.'}</p>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-800 pt-4 text-lg">
                <span className="flex items-center gap-2 text-emerald-400">
                    <Icon className="h-3.5 w-3.5" name="check" />
                    {highlight.type} terbit
                </span>
                <Link className="inline-flex items-center gap-1 text-slate-300 transition hover:text-orange-400" href={highlight.url}>
                    Baca <Icon className="h-3.5 w-3.5" name="chevron" />
                </Link>
            </div>
        </article>
    );
}

export default function Welcome({ highlights = [], berita, artikel, selectedItem, recommendations = [], page = 'home', flash = {}, auth = {}, adminSection, contentType, items, stats, reports, report, statuses, categories, filters, staff, rfcDocument }) {
    const [isLightMode, setIsLightMode] = useState(() => (
        typeof window !== 'undefined' && window.localStorage.getItem('nk-csirt-theme') === 'light'
    ));
    const toggleTheme = () => {
        setIsLightMode((currentMode) => {
            const nextMode = !currentMode;

            window.localStorage.setItem('nk-csirt-theme', nextMode ? 'light' : 'dark');

            return nextMode;
        });
    };

    useEffect(() => {
        if (page !== 'home' || !('IntersectionObserver' in window)) {
            return undefined;
        }

        const guideSteps = document.querySelectorAll('#panduan .guide-step');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.documentElement.classList.add('guide-motion-ready');
        guideSteps.forEach((step) => observer.observe(step));

        return () => {
            observer.disconnect();
            document.documentElement.classList.remove('guide-motion-ready');
            guideSteps.forEach((step) => step.classList.remove('is-visible'));
        };
    }, [page]);
    const activeNavigationHref = page === 'profile' ? '/profil' : page === 'rfc2350' ? '/rfc2350' : page === 'services' ? '/layanan' : page === 'report' ? '/laporan-insiden' : '/';
    return (
        <div className="site-theme min-h-screen overflow-x-clip bg-[#090e1b] text-slate-100" data-theme={isLightMode ? 'light' : 'dark'}>
            <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-[#090e1b]">
                <div className="border-b border-slate-800/80">
                    <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5 text-base text-slate-400 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <a className="inline-flex items-center gap-2 hover:text-slate-200" href="tel:+62218093276">
                                <Icon className="h-3.5 w-3.5 text-orange-500" name="phone" />
                                <span>24/7 Hotline: <strong className="font-semibold text-slate-200">021 8093276</strong></span>
                            </a>
                            <span className="hidden h-4 w-px bg-slate-800 sm:block" />
                            <a className="inline-flex items-center gap-2 hover:text-slate-200" href="mailto:csirt@nindyakarya.co.id">
                                <Icon className="h-3.5 w-3.5 text-orange-500" name="mail" />
                                csirt@nindyakarya.co.id
                            </a>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-base">
                            <span className="hidden text-slate-500 lg:inline">BSSN Registered No. xxxxx</span>
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex w-full items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
                    <HeaderBrand />

                    <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
                        {navigation.map((item) => {
                            if (item.items) {
                                const isInformationActive = page === 'artikel' || page === 'berita';

                                return (
                                    <details className="group relative" key={item.label}>
                                        <summary className={`flex cursor-pointer list-none items-center gap-2 rounded-md px-4 py-2 text-lg font-medium transition [&::-webkit-details-marker]:hidden ${isInformationActive ? isLightMode ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-[#172238] text-emerald-400 ring-1 ring-slate-700' : isLightMode ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}>
                                            {item.label}
                                            <Icon className="h-3.5 w-3.5 transition-transform group-open:rotate-90" name="chevron" />
                                        </summary>
                                        <div className={`absolute right-0 top-full z-30 mt-2 min-w-44 rounded-xl border p-1.5 shadow-xl ${isLightMode ? 'border-slate-200 bg-white' : 'border-slate-700 bg-[#101829]'}`}>
                                            {item.items.map((child) => (
                                                <NavigationLink className={`block rounded-lg px-3 py-2.5 text-base transition ${child.href === `/${page}` ? isLightMode ? 'bg-emerald-50 font-semibold text-emerald-700' : 'bg-slate-800 text-emerald-300' : isLightMode ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} href={child.href} key={child.href}>
                                                    {child.label}
                                                </NavigationLink>
                                            ))}
                                        </div>
                                    </details>
                                );
                            }

                            const href = item.href;

                            return (
                                <NavigationLink
                                    className={`rounded-md px-4 py-2 text-lg font-medium transition ${item.href === activeNavigationHref ? 'bg-[#172238] text-emerald-400 ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
                                    href={href}
                                    key={item.label}
                                >
                                    {item.label}
                                </NavigationLink>
                            );
                        })}
                    </nav>

                    <div className="hidden items-center gap-3 sm:flex">
                        <Link className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-500" href="/kontak">
                            <Icon className="h-4 w-4" name="mail" />
                            KONTAK KAMI
                        </Link>
                        <ThemeToggle isLightMode={isLightMode} onToggle={toggleTheme} />
                        {auth.user && <AccountMenu isLightMode={isLightMode} user={auth.user} />}
                    </div>

                    <div className="flex items-center gap-2 sm:hidden">
                        {auth.user && <AccountMenu isLightMode={isLightMode} user={auth.user} />}
                    <details className="group relative sm:hidden">
                        <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-lg border border-slate-700 text-slate-200 [&::-webkit-details-marker]:hidden">
                            <span className="space-y-1.5">
                                <span className="block h-0.5 w-5 bg-current" />
                                <span className="block h-0.5 w-5 bg-current" />
                                <span className="block h-0.5 w-5 bg-current" />
                            </span>
                        </summary>
                        <nav aria-label="Navigasi mobile" className={`absolute right-0 top-12 z-20 flex w-56 flex-col rounded-xl border p-2 shadow-2xl ${isLightMode ? 'border-slate-200 bg-white' : 'border-slate-700 bg-[#101829]'}`}>
                            {navigation.map((item) => {
                                if (item.items) {
                                    return (
                                        <details className="group" key={item.label}>
                                            <summary className={`flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-lg transition [&::-webkit-details-marker]:hidden ${isLightMode ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                                                {item.label}
                                                <Icon className="h-3.5 w-3.5 transition-transform group-open:rotate-90" name="chevron" />
                                            </summary>
                                            <div className="pb-1 pl-3">
                                                {item.items.map((child) => (
                                                    <NavigationLink className={`block rounded-lg px-3 py-2 text-base transition ${child.href === `/${page}` ? isLightMode ? 'bg-emerald-50 font-semibold text-emerald-700' : 'bg-slate-800 text-emerald-300' : isLightMode ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`} href={child.href} key={child.href}>
                                                        {child.label}
                                                    </NavigationLink>
                                                ))}
                                            </div>
                                        </details>
                                    );
                                }
                                const href = item.href;
                                return (
                                    <NavigationLink className="rounded-lg px-3 py-2.5 text-lg text-slate-300 hover:bg-slate-800 hover:text-white" href={href} key={item.label}>
                                        {item.label}
                                    </NavigationLink>
                                );
                            })}
                            <Link className="mt-2 rounded-lg bg-orange-600 px-3 py-2.5 text-center text-sm font-bold text-white" href="/kontak">
                                Kontak Kami
                            </Link>
                            <div className="mt-2 flex justify-center rounded-lg border border-slate-700 bg-[#121b2d] py-2">
                                <ThemeToggle isLightMode={isLightMode} onToggle={toggleTheme} />
                            </div>
                        </nav>
                    </details>
                    </div>
                </div>
            </header>

            <main>
                {page === 'login' ? <StaffLogin isLightMode={isLightMode} /> : page === 'admin' ? <AdminPanel adminSection={adminSection} auth={auth} categories={categories} contentType={contentType} filters={filters} flash={flash} isLightMode={isLightMode} items={items} report={report} reports={reports} rfcDocument={rfcDocument} staff={staff} stats={stats} statuses={statuses} /> : page === 'profile' ? <Profile Icon={Icon} /> : page === 'rfc2350' ? <Rfc2350 Icon={Icon} rfcDocument={rfcDocument} /> : page === 'services' ? <Services Icon={Icon} isLightMode={isLightMode} /> : page === 'report' ? <Report isLightMode={isLightMode} mailStatus={flash.reportMailStatus} trackingCode={flash.reportTrackingCode} /> : page === 'contact' ? <Contact flash={flash} isLightMode={isLightMode} /> : page === 'berita' || page === 'artikel' ? <News artikel={artikel} berita={berita} filters={filters} isLightMode={isLightMode} page={page} recommendations={recommendations} selectedItem={selectedItem} /> : <>
                <section className="relative isolate border-b border-slate-800/80 px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:pb-20 lg:pt-12">
                    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute right-[5%] top-[-8%] h-[32rem] w-[32rem] rounded-full bg-orange-500/25 blur-[150px]" />
                        <div className="absolute left-[4%] top-[18%] h-[30rem] w-[30rem] rounded-full bg-emerald-500/20 blur-[150px]" />
                        <div className={`absolute left-1/2 top-[58%] h-28 w-28 -translate-x-1/2 rounded-full blur-2xl ${isLightMode ? 'bg-[#fffaf0]/40' : 'bg-slate-800/40'}`} />
                    </div>
                    <div className="relative z-10 w-full">
                        <div className="text-left">
                            <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-lg ${isLightMode ? 'border-slate-300 bg-white/90 text-slate-700 shadow-sm' : 'border-slate-700 bg-[#121b2d]/80 text-slate-300'}`}>
                                <span className="h-2 w-2 rounded-full bg-orange-500" />
                                Tim Tanggap Insiden Keamanan Siber PT Nindya Karya (Persero)
                            </span>
                            <div className="mt-2 flex items-center gap-3 sm:gap-6">
                                <h1 className="min-w-0 flex-1 text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl xl:text-7xl" style={{ textShadow: isLightMode ? '0 2px 10px rgba(15, 23, 42, 0.18)' : '0 3px 14px rgba(0, 0, 0, 0.72)' }}>
                                    <span className="hero-title-line hero-title-line-1 block">Ketahanan Siber Terpadu</span>
                                    <span className="hero-title-line hero-title-line-2 block">untuk Infrastruktur <span className="text-slate-400">Digital</span></span>
                                    <span className="hero-title-line hero-title-line-3 block text-orange-500">yang Tangguh</span>
                                </h1>
                                <div className={`-translate-x-4 translate-y-3 shrink-0 sm:-translate-x-4 sm:translate-y-4 ${isLightMode ? 'drop-shadow-[0_0_18px_rgba(0,0,0,0.65)]' : ''}`}>
                                    <img
                                        alt="Logo NK-CSIRT"
                                        className="h-auto w-[24vw] max-w-[30rem] object-contain sm:w-[26vw]"
                                        src="/images/logo_nkcsirt.png"
                                    />
                                </div>
                            </div>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-lg">
                                Mendeteksi, mencegah, dan menanggulangi insiden keamanan siber secara tanggap bersama CSIRT.
                            </p>
                            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row">
                                <Link className="inline-flex min-w-48 items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-lg font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-500" href="/laporan-insiden">
                                    <Icon className="h-4 w-4" name="mail" />
                                    Kirim Laporan
                                </Link>
                                <a className="inline-flex min-w-52 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#121b2d] px-5 py-3 text-lg font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800" href="#panduan">
                                    <Icon className="h-4 w-4" name="download" />
                                    Lihat Panduan Respons
                                </a>
                            </div>
                            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-lg text-slate-400">
                                <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4 text-emerald-400" name="check" />Respons insiden terarah</span>
                                <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4 text-emerald-400" name="shield" />Kanal pelaporan resmi</span>
                                <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4 text-emerald-400" name="building" />Perlindungan aset digital</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-slate-800/80 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" id="panduan">
                    <div className="mx-auto w-full">
                        <div className="mx-auto max-w-3xl text-center">
                            <span className="inline-flex rounded border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-base font-bold tracking-[0.12em] text-orange-400">PROTOKOL TANGGAP DARURAT</span>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Panduan Cepat 4 Langkah Pelaporan<br className="hidden sm:block" /> Insiden Siber</h2>
                            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">Jika Anda mencurigai adanya infeksi komputer, phishing, pesan tebusan, atau akses akun tanpa izin, segera jalankan langkah berikut:</p>
                        </div>

                        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {responseSteps.map((step) => (
                                <article className="guide-step flex min-h-52 flex-col rounded-xl border border-slate-800 bg-[#121b2d] p-5 transition hover:border-slate-700" key={step.number}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-3xl font-bold tracking-wide text-slate-500">{step.number}</span>
                                        <span className={`grid h-9 w-9 place-items-center rounded-lg bg-slate-800/80 ${step.tone === 'amber' ? 'text-amber-400' : ''} ${step.tone === 'rose' ? 'text-rose-400' : ''} ${step.tone === 'sky' ? 'text-sky-400' : ''} ${step.tone === 'emerald' ? 'text-emerald-400' : ''}`}>
                                            <Icon className="h-4 w-4" name={step.icon} />
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold text-slate-100">{step.title}</h3>
                                    <p className="mt-2 text-lg leading-relaxed text-slate-400">{step.description}</p>
                                    <div className={`mt-auto flex items-center gap-2 border-t border-slate-800 pt-4 text-base font-medium ${step.tone === 'amber' ? 'text-amber-400' : ''} ${step.tone === 'rose' ? 'text-rose-400' : ''} ${step.tone === 'sky' ? 'text-sky-400' : ''} ${step.tone === 'emerald' ? 'text-emerald-400' : ''}`}>
                                        <Icon className="h-3.5 w-3.5" name={step.icon === 'shield' ? 'check' : 'alert'} />
                                        {step.note}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-b border-slate-800/80 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" id="informasi">
                    <div className="mx-auto w-full">
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                            <div>
                                <span className="inline-flex items-center gap-2 text-base font-bold tracking-wide text-orange-400"><Icon className="h-4 w-4" name="calendar" />INFORMASI CSIRT</span>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Highlight Berita & Artikel</h2>
                                <p className="mt-2 text-lg text-slate-400">Informasi dan artikel keamanan siber terbaru dari CSIRT.</p>
                            </div>
                            <Link className="inline-flex items-center gap-2 text-lg font-semibold text-orange-400 transition hover:text-orange-300" href="/artikel">
                                Lihat Semua Informasi <Icon className="h-4 w-4" name="arrow" />
                            </Link>
                        </div>

                        {highlights.length > 0 ? (
                            <div className="mt-8 grid gap-4 lg:grid-cols-3">
                                {highlights.map((highlight) => <HighlightCard highlight={highlight} key={`${highlight.type}-${highlight.title}`} />)}
                            </div>
                        ) : (
                            <div className="mt-8 rounded-xl border border-slate-800 bg-[#121b2d] px-6 py-12 text-center">
                                <p className="text-lg font-semibold text-slate-200">Belum ada berita atau artikel yang diterbitkan.</p>
                                <p className="mt-2 text-lg text-slate-400">Informasi terbaru akan tampil di sini setelah diterbitkan.</p>
                            </div>
                        )}
                    </div>
                </section>
                </>}
            </main>

            <footer className="px-4 py-12 sm:px-6 lg:px-8 bg-[#111827]">
                <div className="mx-auto w-full">
                    <div className="grid gap-10 border-b border-slate-800 pb-10 sm:grid-cols-[1fr_auto_1fr]">
                        <div>
                            <FooterBrand />
                            <p className="mt-5 max-w-xs text-lg leading-relaxed text-slate-400">Tim Tanggap Insiden Keamanan Siber yang membantu melindungi infrastruktur digital dan aset kritis organisasi.</p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-base font-bold tracking-wide text-emerald-400">CSIRT</span>
                                <span className="rounded border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-base font-bold tracking-wide text-blue-400">KEAMANAN SIBER</span>
                            </div>
                        </div>

                        <div className="justify-self-center text-center sm:col-start-2 sm:row-start-1">
                            <h3 className="text-base font-bold tracking-[0.15em] text-slate-300">MEDIA SOSIAL</h3>
                            <div aria-label="Media sosial Nindya Karya" className="mt-4 flex justify-center gap-3">
                                <a aria-label="Instagram Nindya Karya" className="grid h-11 w-11 place-items-center rounded-xl border border-slate-700 bg-[#121b2d] text-slate-300 transition hover:border-orange-500/50 hover:text-orange-400" href="https://www.instagram.com/nindyakarya/" rel="noopener noreferrer" target="_blank" title="Instagram Nindya Karya">
                                    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect height="18" rx="5" width="18" x="3" y="3" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" fill="currentColor" r=".8" /></svg>
                                </a>
                                <a aria-label="LinkedIn Nindya Karya" className="grid h-11 w-11 place-items-center rounded-xl border border-slate-700 bg-[#121b2d] text-sm font-extrabold text-slate-300 transition hover:border-orange-500/50 hover:text-orange-400" href="https://id.linkedin.com/company/pt-nindya-karya" rel="noopener noreferrer" target="_blank" title="LinkedIn Nindya Karya">in</a>
                                <a aria-label="YouTube Nindya Karya" className="grid h-11 w-11 place-items-center rounded-xl border border-slate-700 bg-[#121b2d] text-slate-300 transition hover:border-orange-500/50 hover:text-orange-400" href="https://www.youtube.com/channel/UCNH3cvlPeWpY8kYCieZAfew" rel="noopener noreferrer" target="_blank" title="YouTube Nindya Karya">
                                    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg>
                                </a>
                            </div>
                        </div>

                        <nav aria-label="Navigasi cepat" className="sm:col-start-3 sm:justify-self-end">
                            <h3 className="text-base font-bold tracking-[0.15em] text-slate-300">NAVIGASI CEPAT</h3>
                            <div className="mt-4 flex flex-col gap-2 text-base text-slate-400">
                                <Link className="transition hover:text-white" href="/">Beranda</Link>
                                <Link className="transition hover:text-white" href="/profil">Profil CSIRT</Link>
                                <Link className="transition hover:text-white" href="/rfc2350">RFC 2350</Link>
                                <Link className="transition hover:text-white" href="/layanan">Layanan</Link>
                                <Link className="transition hover:text-white" href="/laporan-insiden">Aduan Siber</Link>
                                <Link className="transition hover:text-white" href="/berita">Berita</Link>
                                <Link className="transition hover:text-white" href="/artikel">Artikel</Link>
                                <Link className="transition hover:text-white" href="/kontak">Kontak Kami</Link>
                            </div>
                        </nav>
                    </div>
                               
                    <div className="flex flex-col justify-between gap-3 pt-5 text-base text-slate-500 sm:flex-row sm:items-center">
                        <p>© {new Date().getFullYear()} Nindya CSIRT. Hak cipta dilindungi.</p>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                            <a className="hover:text-slate-300" href="mailto:csirt@nindyakarya.co.id?subject=Kebijakan%20Privasi">Kebijakan Privasi</a>
                            <a className="hover:text-slate-300" href="mailto:csirt@nindyakarya.co.id?subject=Kerahasiaan%20Pelaporan">Kerahasiaan Pelaporan</a>
                            <Link className="hover:text-slate-300" href="/rfc2350">RFC 2350</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
