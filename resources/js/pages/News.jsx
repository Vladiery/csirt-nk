import { Link, useForm } from '@inertiajs/react';
import ContentBody from '../shared/ContentBody';

function formatDate(date) {
    if (!date) {
        return 'Tanggal tidak tersedia';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
}

function imageUrl(path) {
    if (!path) {
        return null;
    }

    return path.startsWith('http') || path.startsWith('/') ? path : `/storage/${path}`;
}

function NewsCard({ item, type, isLightMode }) {
    const href = `/${type}/${item.slug}`;
    const image = imageUrl(item.image_path);

    return (
        <article className={`flex min-h-full flex-col overflow-hidden rounded-xl border transition hover:-translate-y-1 ${isLightMode ? 'border-slate-200 bg-white shadow-sm hover:border-slate-300' : 'border-slate-800 bg-[#121b2d] hover:border-slate-700'}`}>
            <Link aria-label={`Baca ${item.title}`} className={`relative block aspect-[16/9] overflow-hidden ${isLightMode ? 'bg-slate-100' : 'bg-[#0b1120]'}`} href={href}>
                {image ? (
                    <img alt="" className="h-full w-full object-contain p-2" loading="lazy" src={image} />
                ) : (
                    <div className="grid h-full place-items-center bg-gradient-to-br from-[#172238] via-[#101829] to-[#0b1120]">
                        <span className="grid h-14 w-14 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                            <svg aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" /><path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20M8 7h8M8 10h8" /></svg>
                        </span>
                    </div>
                )}
                <span className="absolute left-4 top-4 rounded border border-emerald-500/30 bg-[#0b1120]/85 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-emerald-300">{type}</span>
            </Link>
            <div className="flex flex-1 flex-col p-5">
                <p className={`font-mono text-xs tracking-wide ${isLightMode ? 'text-slate-500' : 'text-slate-500'}`}>{formatDate(item.published_at)} <span className="px-1 text-emerald-500">•</span> INFORMASI RESMI</p>
                {item.category && <p className="mt-2 text-xs font-bold uppercase tracking-wide text-emerald-500">{item.category.name}</p>}
                <h2 className={`mt-3 text-xl font-bold leading-snug ${isLightMode ? 'text-slate-900' : 'text-slate-100'}`}>
                    <Link className="transition hover:text-emerald-500" href={href}>{item.title}</Link>
                </h2>
                <p className={`mt-3 line-clamp-4 text-sm leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{item.summary || 'Informasi terbaru dari Nindya CSIRT.'}</p>
                {item.tags?.length > 0 && <p className="mt-3 text-xs text-slate-500">{item.tags.map((tag) => `#${tag.name}`).join(' ')}</p>}
                <div className={`mt-auto flex items-center justify-between gap-3 border-t pt-4 ${isLightMode ? 'border-slate-200' : 'border-slate-800'}`}>
                    <span className="text-sm font-semibold text-orange-500">Baca selengkapnya <span aria-hidden="true">→</span></span>
                    <span className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${isLightMode ? 'border-slate-200 text-slate-500' : 'border-slate-700 text-slate-400'}`}>Terverifikasi</span>
                </div>
            </div>
        </article>
    );
}

export default function News({ page, berita, artikel, isLightMode, selectedItem, recommendations = [], filters = {}, contentCategories = [], contentCategory, contentTags = [] }) {
    const isArticlePage = page === 'artikel';
    const records = isArticlePage ? artikel : berita;
    const items = records?.data ?? [];
    const title = isArticlePage ? 'Artikel Keamanan Siber' : 'Berita Siber & Warta Lembaga';
    const description = isArticlePage
        ? 'Wawasan, panduan, dan praktik keamanan siber dari tim Nindya CSIRT.'
        : 'Kanal resmi informasi BSSN RI, kolaborasi CSIRT BUMN, dan kabar ketahanan digital PT Nindya Karya (Persero).';

    const panelClass = isLightMode ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-800 bg-[#121b2d] text-slate-100';
    const mutedClass = isLightMode ? 'text-slate-600' : 'text-slate-400';
    const searchForm = useForm({
        search: filters.search ?? '',
        period: filters.period ?? 'all',
        sort: filters.sort ?? 'newest',
        category: filters.category ?? '',
    });

    function search(event) {
        event.preventDefault();
        searchForm.get(isArticlePage ? '/artikel' : '/berita', { preserveScroll: true, replace: true });
    }

    if (selectedItem) {
        const detailImage = imageUrl(selectedItem.image_path);
        return (
            <section className="border-b border-slate-800/80 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <article className={`min-w-0 overflow-hidden rounded-2xl border ${panelClass}`}>
                    {detailImage && <div className={`flex max-h-[32rem] justify-center ${isLightMode ? 'bg-slate-100' : 'bg-[#0b1120]'}`}><img alt="" className="max-h-[32rem] w-full object-contain" src={detailImage} /></div>}
                    <div className="p-6 sm:p-9 lg:p-12">
                        <Link className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${isLightMode ? 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700' : 'border-slate-700 bg-[#121b2d] text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300'}`} href={isArticlePage ? '/artikel' : '/berita'}>
                            <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="m14 18-6-6 6-6M8 12h12" /></svg>
                            Kembali ke daftar {isArticlePage ? 'artikel' : 'berita'}
                        </Link>
                        <p className="mt-6 font-mono text-xs tracking-wide text-slate-500">{formatDate(selectedItem.published_at)} <span className="px-1 text-emerald-500">•</span> {isArticlePage ? 'ARTIKEL CSIRT' : 'WARTA CSIRT'}</p>
                        <h1 className={`mt-3 text-3xl font-extrabold leading-tight sm:text-4xl ${isLightMode ? 'text-slate-900' : 'text-slate-100'}`}>{selectedItem.title}</h1>
                        {selectedItem.summary && <p className={`mt-5 border-l-2 border-emerald-500 pl-4 text-lg leading-relaxed ${mutedClass}`}>{selectedItem.summary}</p>}
                        {(contentCategory || contentTags.length > 0) && <div className="mt-5 flex flex-wrap items-center gap-2">{contentCategory && <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">{contentCategory.name}</span>}{contentTags.map((tag) => <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-400" key={tag.slug}>#{tag.name}</span>)}</div>}
                        <ContentBody className={`mt-8 border-t pt-7 text-base leading-8 ${isLightMode ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'}`} content={selectedItem.content} />
                    </div>
                </article>
                    <aside aria-label={`Rekomendasi ${isArticlePage ? 'artikel' : 'berita'}`} className="w-full lg:sticky lg:top-8">
                        <div className="mb-5">
                            <h2 className={`text-2xl font-bold ${isLightMode ? 'text-slate-900' : 'text-slate-100'}`}>Rekomendasi {isArticlePage ? 'Artikel' : 'Berita'}</h2>
                            <p className={`mt-1 text-sm ${mutedClass}`}>Baca {isArticlePage ? 'panduan' : 'informasi'} lainnya dari Nindya CSIRT.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            {recommendations.length > 0 ? recommendations.map((item) => (
                                <NewsCard isLightMode={isLightMode} item={item} key={item.id} type={isArticlePage ? 'artikel' : 'berita'} />
                            )) : (
                                <div className={`rounded-xl border p-5 ${panelClass}`}>
                                    <p className="text-sm font-semibold">Belum ada rekomendasi {isArticlePage ? 'artikel' : 'berita'}.</p>
                                    <p className={`mt-2 text-sm ${mutedClass}`}>Konten lainnya akan tampil di sini setelah diterbitkan.</p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </section>
        );
    }

    return (
        <section className="border-b border-slate-800/80 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <div className="mx-auto w-full">
                <div className="mb-8 max-w-3xl">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide ${isLightMode ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> INFORMASI CSIRT
                    </span>
                    <h1 className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl ${isLightMode ? 'text-slate-900' : 'text-slate-100'}`}>{title}</h1>
                    <p className={`mt-3 text-base leading-relaxed sm:text-lg ${mutedClass}`}>{description}</p>
                </div>

                <nav aria-label="Kategori informasi" className="mb-7 flex flex-wrap gap-2">
                    <Link className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${!isArticlePage ? 'border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-950/20' : isLightMode ? 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300' : 'border-slate-800 bg-[#121b2d] text-slate-400 hover:border-slate-700 hover:text-slate-200'}`} href="/berita">Semua Berita</Link>
                    <Link className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${isArticlePage ? 'border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-950/20' : isLightMode ? 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300' : 'border-slate-800 bg-[#121b2d] text-slate-400 hover:border-slate-700 hover:text-slate-200'}`} href="/artikel">Artikel Keamanan</Link>
                </nav>

                <form className={`mb-8 grid gap-3 rounded-2xl border p-4 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_12rem_12rem_12rem_auto_auto] xl:items-end ${panelClass}`} onSubmit={search}>
                    <label className="block text-sm font-semibold">
                        <span className={`mb-1.5 block text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Cari {isArticlePage ? 'artikel' : 'berita'}</span>
                        <input className={`w-full rounded-lg border px-3 py-2.5 outline-none focus:border-emerald-500 ${isLightMode ? 'border-slate-300 bg-white text-slate-900' : 'border-slate-700 bg-[#0b1220] text-slate-100'}`} maxLength="100" name="search" onChange={(event) => searchForm.setData('search', event.target.value)} placeholder="Judul atau isi..." value={searchForm.data.search} />
                    </label>
                    <label className="block text-sm font-semibold">
                        <span className={`mb-1.5 block text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Kategori</span>
                        <select className={`w-full rounded-lg border px-3 py-2.5 outline-none focus:border-emerald-500 ${isLightMode ? 'border-slate-300 bg-white text-slate-900' : 'border-slate-700 bg-[#0b1220] text-slate-100'}`} onChange={(event) => searchForm.setData('category', event.target.value)} value={searchForm.data.category}>
                            <option value="">Semua kategori</option>{contentCategories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
                        </select>
                    </label>
                    <label className="block text-sm font-semibold">
                        <span className={`mb-1.5 block text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Periode</span>
                        <select className={`w-full rounded-lg border px-3 py-2.5 outline-none focus:border-emerald-500 ${isLightMode ? 'border-slate-300 bg-white text-slate-900' : 'border-slate-700 bg-[#0b1220] text-slate-100'}`} onChange={(event) => searchForm.setData('period', event.target.value)} value={searchForm.data.period}>
                            <option value="all">Semua waktu</option><option value="30days">30 hari terakhir</option><option value="year">1 tahun terakhir</option>
                        </select>
                    </label>
                    <label className="block text-sm font-semibold">
                        <span className={`mb-1.5 block text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Urutan</span>
                        <select className={`w-full rounded-lg border px-3 py-2.5 outline-none focus:border-emerald-500 ${isLightMode ? 'border-slate-300 bg-white text-slate-900' : 'border-slate-700 bg-[#0b1220] text-slate-100'}`} onChange={(event) => searchForm.setData('sort', event.target.value)} value={searchForm.data.sort}>
                            <option value="newest">Terbaru</option><option value="oldest">Terlama</option>
                        </select>
                    </label>
                    <button className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-60" disabled={searchForm.processing} type="submit">Cari</button>
                    <Link className={`rounded-lg border px-4 py-2.5 text-center text-sm font-semibold ${isLightMode ? 'border-slate-300 text-slate-700 hover:bg-slate-50' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`} href={isArticlePage ? '/artikel' : '/berita'}>Reset</Link>
                </form>

                {items.length > 0 ? (
                    <>
                        <article className={`mb-7 grid overflow-hidden rounded-2xl border lg:grid-cols-[1.15fr_0.85fr] ${panelClass}`}>
                            <Link aria-label={`Baca ${items[0].title}`} className={`group relative flex min-h-64 items-center justify-center overflow-hidden lg:min-h-[26rem] ${isLightMode ? 'bg-slate-100' : 'bg-[#0b1120]'}`} href={`/${isArticlePage ? 'artikel' : 'berita'}/${items[0].slug}`}>
                                {imageUrl(items[0].image_path) ? <img alt="" className="max-h-[26rem] w-full object-contain p-2" src={imageUrl(items[0].image_path)} /> : <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900 via-[#172238] to-[#0b1120]" />}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090e1b]/55 via-transparent to-transparent" />
                                <span className="absolute left-5 top-5 rounded border border-emerald-500/40 bg-emerald-950/80 px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-300">RILIS TERBARU</span>
                                <span className="absolute bottom-5 left-5 rounded border border-emerald-500/40 bg-[#090e1b]/80 px-3 py-1.5 text-xs font-bold text-emerald-300">✓ STATUS: RILIS TERVERIFIKASI</span>
                            </Link>
                            <div className="flex flex-col p-6 sm:p-8 lg:p-9">
                                <p className="font-mono text-xs text-slate-500">{formatDate(items[0].published_at)} <span className="px-1 text-emerald-500">•</span> {isArticlePage ? 'ARTIKEL CSIRT' : 'WARTA CSIRT'}</p>
                                <h2 className={`mt-4 text-2xl font-bold leading-tight sm:text-3xl ${isLightMode ? 'text-slate-900' : 'text-slate-100'}`}>{items[0].title}</h2>
                                <p className={`mt-4 text-base leading-relaxed ${mutedClass}`}>{items[0].summary || 'Baca informasi resmi terbaru dari tim Nindya CSIRT.'}</p>
                                <div className={`mt-auto flex flex-wrap gap-3 border-t pt-6 ${isLightMode ? 'border-slate-200' : 'border-slate-800'}`}>
                                    <Link className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-500" href={`/${isArticlePage ? 'artikel' : 'berita'}/${items[0].slug}`}>Baca {isArticlePage ? 'Artikel' : 'Berita'} Lengkap <span aria-hidden="true">→</span></Link>
                                </div>
                            </div>
                        </article>

                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {items.slice(1).map((item) => <NewsCard isLightMode={isLightMode} item={item} key={item.id} type={isArticlePage ? 'artikel' : 'berita'} />)}
                        </div>

                        {records?.links?.length > 3 && (
                            <nav aria-label="Navigasi halaman" className="mt-8 flex flex-wrap justify-center gap-2">
                                {records.links.map((link, index) => (
                                    <Link aria-current={link.active ? 'page' : undefined} className={`rounded-lg border px-3 py-2 text-sm ${link.active ? 'border-emerald-500 bg-emerald-600 text-white' : isLightMode ? 'border-slate-200 bg-white text-slate-600' : 'border-slate-800 bg-[#121b2d] text-slate-400'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} href={link.url || '#'} key={`${link.label}-${index}`} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                        <div className={`rounded-2xl border px-6 py-16 text-center ${panelClass}`}>
                            <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                                <svg aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" /><path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20" /></svg>
                            </span>
                            <h2 className="mt-4 text-xl font-bold">Belum ada {isArticlePage ? 'artikel' : 'berita'} yang diterbitkan</h2>
                            <p className={`mt-2 text-sm ${mutedClass}`}>Informasi terbaru dari Nindya CSIRT akan tampil di halaman ini.</p>
                        </div>
                        <aside aria-label={`Rekomendasi ${isArticlePage ? 'artikel' : 'berita'}`} className={`rounded-2xl border p-6 ${panelClass}`}>
                            <h2 className="text-lg font-bold">Rekomendasi {isArticlePage ? 'Artikel' : 'Berita'}</h2>
                            <p className={`mt-2 text-sm ${mutedClass}`}>Rekomendasi akan tampil setelah ada {isArticlePage ? 'artikel' : 'berita'} lain yang diterbitkan.</p>
                        </aside>
                    </div>
                )}
            </div>
        </section>
    );
}
