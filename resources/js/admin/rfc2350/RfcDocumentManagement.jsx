import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { buttonClass, Field, inputClass, labelClass } from '../shared';

export function RfcFileUpload({ accept, fileName, hint, isLightMode, label, path, versionName, versionValue }) {
    const [fileInputKey, setFileInputKey] = useState(0);
    const initialData = { [fileName]: null };
    if (versionName) {
        initialData[versionName] = versionValue ?? '1.10';
    }

    const form = useForm(initialData);

    useEffect(() => {
        if (versionName && versionValue) {
            form.setData(versionName, versionValue);
        }
    }, [versionName, versionValue]);
    const fileInputClass = isLightMode
        ? 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-700'
        : inputClass;

    function submit(event) {
        event.preventDefault();
        form.post('/admin/rfc2350/document', {
            onSuccess: () => {
                form.reset(fileName);
                setFileInputKey((key) => key + 1);
            },
        });
    }

    return (
        <form className={`space-y-4 rounded-2xl border p-5 ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800 bg-[#111a2a]'}`} onSubmit={submit}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className={`text-lg font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{label}</h2>
                <span className={`text-sm ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{path ? 'File tersedia' : 'Belum diunggah'}</span>
            </div>
            {versionName && <Field error={form.errors[versionName]} isLightMode={isLightMode} label="Versi dokumen" onChange={(event) => form.setData(versionName, event.target.value)} placeholder="Contoh: 1.11" value={form.data[versionName]} />}
            <label className={`block text-sm font-medium ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>
                <span className={isLightMode ? 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600' : labelClass}>{label}</span>
                <input accept={accept} className={fileInputClass} key={fileInputKey} onChange={(event) => form.setData(fileName, event.target.files?.[0] ?? null)} type="file" />
                {form.errors[fileName] && <span className="mt-1 block text-xs text-rose-400">{form.errors[fileName]}</span>}
                <span className={`mt-1 block text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{hint}</span>
            </label>
            <div className="space-y-2">
                <button className={buttonClass} disabled={form.processing || !form.data[fileName]} type="submit">{form.processing ? 'Mengunggah...' : 'Simpan'}</button>
                {form.progress && <div className="flex items-center gap-3 text-xs text-slate-400"><progress className="h-2 flex-1 accent-emerald-500" max="100" value={form.progress.percentage} />{form.progress.percentage}%</div>}
            </div>
        </form>
    );
}

export function RfcDocumentManagement({ rfcDocument = {}, isLightMode }) {
    return (
        <section className="w-full space-y-5">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Publikasi resmi</p>
                <h1 className="mt-2 text-3xl font-extrabold text-white">Dokumen RFC 2350 & Kunci PGP</h1>
                <p className="mt-2 text-sm text-slate-400">Setiap formulir menyimpan satu file secara terpisah. Versi RFC Indonesia dan English dikelola masing-masing.</p>
                {rfcDocument.updated_at && <p className="mt-2 text-sm text-slate-500">Terakhir diperbarui {rfcDocument.updated_at}</p>}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
                <RfcFileUpload accept="application/pdf,.pdf" fileName="document" hint="PDF maksimal 20 MB." isLightMode={isLightMode} label="RFC 2350 Bahasa Indonesia" path={rfcDocument.indonesian_path} versionName="version" versionValue={rfcDocument.version} />
                <RfcFileUpload accept="application/pdf,.pdf" fileName="english_document" hint="English PDF, maksimal 20 MB." isLightMode={isLightMode} label="RFC 2350 English" path={rfcDocument.english_path} versionName="english_version" versionValue={rfcDocument.english_version} />
                <RfcFileUpload accept="application/pdf,.pdf" fileName="pgp_key" hint="PDF maksimal 20 MB." isLightMode={isLightMode} label="PGP Public Key (PDF)" path={rfcDocument.pgp_path} />
            </div>
        </section>
    );
}

