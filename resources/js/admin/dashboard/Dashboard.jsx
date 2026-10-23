export function StatCard({ label, value, detail }) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-[#111a2a] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-400">{detail}</p>
        </div>
    );
}

export function Dashboard({ stats = {} }) {
    return (
        <>
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Admin CSIRT</p>
                <h1 className="mt-2 text-3xl font-extrabold text-white">Ringkasan</h1>
                <p className="mt-2 text-sm text-slate-400">Ikhtisar data yang tercatat pada sistem.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard detail="Semua status" label="Berita" value={stats.berita ?? 0} />
                <StatCard detail="Semua status" label="Artikel" value={stats.artikel ?? 0} />
                <StatCard detail="Laporan tersimpan" label="Laporan insiden" value={stats.reports ?? 0} />
                <StatCard detail="Received, triage, dan investigating" label="Laporan belum ditangani" value={stats.unhandledReports ?? 0} />
            </div>
            <section className="rounded-2xl border border-slate-800 bg-[#111a2a] p-5">
                <h2 className="text-lg font-bold text-white">Laporan menurut status</h2>
                {stats.reportsByStatus?.length ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {stats.reportsByStatus.map((item) => <div className="flex items-center justify-between rounded-xl bg-[#0b1220] px-4 py-3" key={item.status}><span className="capitalize text-sm text-slate-300">{item.status}</span><span className="font-bold text-sky-300">{item.total}</span></div>)}
                    </div>
                ) : <p className="mt-3 text-sm text-slate-400">Belum ada laporan masuk.</p>}
            </section>
        </>
    );
}

