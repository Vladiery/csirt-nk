import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

export const inputClass = 'w-full rounded-lg border border-slate-700 bg-[#0b1220] px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20';
export const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400';
export const buttonClass = 'inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60';

export function ConfirmDialog({ open, title, description, onCancel, onConfirm, processing = false, isLightMode = false }) {
    const cancelButton = useRef(null);
    const onCancelRef = useRef(onCancel);
    onCancelRef.current = onCancel;

    useEffect(() => {
        if (!open) return undefined;
        cancelButton.current?.focus();
        function handleEscape(event) {
            if (event.key === 'Escape' && !processing) onCancelRef.current();
        }
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, processing]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[130] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" onClick={(event) => { if (event.target === event.currentTarget && !processing) onCancel(); }}>
            <section aria-labelledby="confirm-dialog-title" aria-modal="true" className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isLightMode ? 'border-slate-200 bg-white' : 'border-slate-700 bg-[#111a2a]'}`} role="alertdialog">
                <div aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z" /></svg>
                </div>
                <h2 className={`mt-4 text-lg font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`} id="confirm-dialog-title">{title}</h2>
                <p className={`mt-2 text-sm leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{description}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button className={`rounded-lg border px-4 py-2.5 text-sm font-semibold ${isLightMode ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-600 text-slate-300 hover:bg-slate-800'}`} disabled={processing} onClick={onCancel} ref={cancelButton} type="button">Batal</button>
                    <button className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60" disabled={processing} onClick={onConfirm} type="button">{processing ? 'Menghapus...' : 'Ya, hapus'}</button>
                </div>
            </section>
        </div>
    );
}

export function toDateTimeLocal(value) {
    if (!value) return '';

    const valueString = String(value);
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(valueString)) return valueString;

    const parsedDate = new Date(valueString);
    if (Number.isNaN(parsedDate.getTime())) return '';

    const localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60_000);
    return localDate.toISOString().slice(0, 16);
}

export function Field({ label, error, isLightMode = false, ...props }) {
    const fieldInputClass = isLightMode
        ? 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
        : inputClass;
    const fieldLabelClass = isLightMode
        ? 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600'
        : labelClass;

    return (
        <label className={`block text-sm font-medium ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>
            <span className={fieldLabelClass}>{label}</span>
            <input className={fieldInputClass} {...props} />
            {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
        </label>
    );
}

export function AdminNavigation({ section }) {
    const links = [
        { label: 'Ringkasan', href: '/admin/dashboard', key: 'dashboard' },
        { label: 'Berita', href: '/admin/content/berita', key: 'berita' },
        { label: 'Artikel', href: '/admin/content/artikel', key: 'artikel' },
        { label: 'Laporan insiden', href: '/admin/reports', key: 'reports' },
        { label: 'Dokumen RFC', href: '/admin/rfc2350', key: 'rfcDocument' },
        { label: 'Akun admin', href: '/admin/staff', key: 'staff' },
    ];

    return (
        <nav aria-label="Navigasi panel petugas" className="flex gap-2 overflow-x-auto pb-1">
            {links.map((link) => (
                <Link className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${section === link.key ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`} href={link.href} key={link.key}>
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}

