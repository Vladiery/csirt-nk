import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

function ReportField({ id, label, required = false, error, hint, children, isLightMode }) {
    return (
        <div className="space-y-2">
            <label className={`block text-sm font-semibold uppercase tracking-wide ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`} htmlFor={id}>
                {label}{required && <span className="ml-1 text-orange-500">*</span>}
            </label>
            {children}
            {hint && <p className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{hint}</p>}
            {error && <p className="text-sm font-medium text-rose-500">{error}</p>}
        </div>
    );
}

export default function Report({ isLightMode, mailStatus, trackingCode }) {
    const [evidenceLimitError, setEvidenceLimitError] = useState('');
    const { data, setData, post, reset, processing, errors, progress } = useForm({
        reporter_name: '',
        reporter_email: '',
        category: '',
        subject: '',
        description: '',
        affected_url: '',
        occurred_at: '',
        evidence: [],
    });

    const panelClass = isLightMode
        ? 'border-slate-200 bg-white shadow-sm'
        : 'border-slate-800 bg-[#121b2d]';
    const inputClass = `w-full rounded-lg border px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${isLightMode ? 'border-slate-300 bg-slate-50 text-slate-900' : 'border-slate-700 bg-[#0b1120] text-slate-100'}`;
    const mutedClass = isLightMode ? 'text-slate-600' : 'text-slate-400';
    const headingClass = isLightMode ? 'text-slate-900' : 'text-slate-100';

    function submitReport(event) {
        event.preventDefault();
        post('/laporan-insiden', {
            onSuccess: () => {
                reset();
                setEvidenceLimitError('');
            },
        });
    }

    function updateEvidence(event) {
        const selectedFiles = Array.from(event.target.files ?? []);
        const newFiles = selectedFiles.filter((selectedFile) => (
            !data.evidence.some((existingFile) => (
                existingFile.name === selectedFile.name
                && existingFile.size === selectedFile.size
                && existingFile.lastModified === selectedFile.lastModified
            ))
        ));
        const combinedFiles = [...data.evidence, ...newFiles];

        if (combinedFiles.length > 5) {
            setEvidenceLimitError('Maksimal 5 file. File tambahan tidak dimasukkan.');
        } else {
            setEvidenceLimitError('');
        }

        setData('evidence', combinedFiles.slice(0, 5));
        event.target.value = '';
    }

    function removeEvidence(fileIndex) {
        setData('evidence', data.evidence.filter((_, index) => index !== fileIndex));
        setEvidenceLimitError('');
    }

    return (
        <section className="border-b border-slate-800/80 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <div className="mx-auto w-full">
                <div className="mb-10 w-full text-left">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide ${isLightMode ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-orange-500/30 bg-orange-500/10 text-orange-300'}`}>
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                        PORTAL PELAPORAN INSIDEN SIBER NK-CSIRT
                    </span>
                    <h1 className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl ${headingClass}`}>
                        Aduan Siber &amp; Pelaporan Insiden
                    </h1>
                    <p className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${mutedClass}`}>
                        Laporkan dugaan anomali, serangan siber, atau kerentanan sistem di lingkungan PT Nindya Karya. Tim kami akan meninjau informasi yang Anda kirimkan.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-start gap-2">
                        {['Kanal laporan resmi', 'Ditinjau tim CSIRT', 'Kerahasiaan pelapor'].map((item) => (
                            <span className={`rounded-lg border px-3 py-2 text-xs font-medium ${isLightMode ? 'border-slate-200 bg-white text-slate-600' : 'border-slate-800 bg-[#121b2d] text-slate-300'}`} key={item}>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {trackingCode && (
                    <div className={`mb-6 rounded-xl border p-4 ${isLightMode ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>
                        <p className="font-semibold">Laporan berhasil diterima.</p>
                        <p className="mt-1 text-sm">Simpan kode pelacakan ini: <code className="font-mono font-bold">{trackingCode}</code></p>
                        <p className="mt-2 text-sm">{mailStatus === 'failed' ? 'Laporan sudah tersimpan di panel admin, tetapi email notifikasi gagal dikirim.' : mailStatus === 'logged' ? 'Email notifikasi tercatat di log lokal. Pengiriman email nyata memerlukan konfigurasi SMTP.' : 'Email notifikasi juga telah dikirim ke tim NK-CSIRT.'}</p>
                    </div>
                )}

                <div className="report-layout grid gap-6">
                    <div className={`min-w-0 rounded-2xl border p-5 sm:p-7 ${panelClass}`}>
                        <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-5 ${isLightMode ? 'border-slate-200' : 'border-slate-700'}`}>
                            <div>
                                <h2 className={`text-lg font-bold sm:text-xl ${headingClass}`}>Formulir Laporan Terstruktur</h2>
                                <p className={`mt-1 text-sm ${mutedClass}`}>Tanda * menunjukkan informasi yang wajib diisi.</p>
                            </div>
                            <span className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${isLightMode ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>
                                Laporan rahasia
                            </span>
                        </div>

                        <form className="mt-6 space-y-5" encType="multipart/form-data" onSubmit={submitReport}>
                            <ReportField error={errors.reporter_name} id="reporter_name" isLightMode={isLightMode} label="Nama pelapor">
                                <input autoComplete="name" className={inputClass} id="reporter_name" onChange={(event) => setData('reporter_name', event.target.value)} placeholder="Nama Anda atau anonim" value={data.reporter_name} />
                            </ReportField>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <ReportField error={errors.reporter_email} id="reporter_email" isLightMode={isLightMode} label="Alamat email aktif">
                                    <input autoComplete="email" className={inputClass} id="reporter_email" onChange={(event) => setData('reporter_email', event.target.value)} placeholder="nama@perusahaan.co.id" type="email" value={data.reporter_email} />
                                </ReportField>
                                <ReportField error={errors.category} id="category" isLightMode={isLightMode} label="Kategori insiden" required>
                                    <select className={inputClass} id="category" onChange={(event) => setData('category', event.target.value)} value={data.category}>
                                        <option value="">Pilih kategori</option>
                                        <option value="Phishing">Phishing atau rekayasa sosial</option>
                                        <option value="Malware">Malware atau ransomware</option>
                                        <option value="Akses tidak sah">Akses tidak sah</option>
                                        <option value="Kerentanan">Kerentanan sistem</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </ReportField>
                            </div>

                            <ReportField error={errors.subject} id="subject" isLightMode={isLightMode} label="Ringkasan insiden" required>
                                <input className={inputClass} id="subject" onChange={(event) => setData('subject', event.target.value)} placeholder="Contoh: Dugaan phishing pada portal internal" value={data.subject} />
                            </ReportField>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <ReportField error={errors.occurred_at} hint="Waktu kejadian atau pertama kali terdeteksi." id="occurred_at" isLightMode={isLightMode} label="Waktu kejadian">
                                    <input className={inputClass} id="occurred_at" onChange={(event) => setData('occurred_at', event.target.value)} type="datetime-local" value={data.occurred_at} />
                                </ReportField>
                                <ReportField error={errors.affected_url} hint="Opsional, sertakan URL jika relevan." id="affected_url" isLightMode={isLightMode} label="URL atau sistem terdampak">
                                    <input className={inputClass} id="affected_url" onChange={(event) => setData('affected_url', event.target.value)} placeholder="https://contoh.co.id" type="url" value={data.affected_url} />
                                </ReportField>
                            </div>

                            <ReportField error={errors.description} id="description" isLightMode={isLightMode} label="Kronologi dan detail insiden" required>
                                <textarea className={`${inputClass} min-h-36 resize-y`} id="description" onChange={(event) => setData('description', event.target.value)} placeholder="Jelaskan apa yang terjadi, perangkat atau akun yang terdampak, dan tindakan yang sudah dilakukan." value={data.description} />
                            </ReportField>

                            <ReportField error={errors.evidence || evidenceLimitError} hint="Pilih hingga 5 file JPG, PNG, PDF, atau TXT. Ukuran maksimal 5 MB per file." id="evidence" isLightMode={isLightMode} label="Lampiran bukti pendukung">
                                <div className={`rounded-lg border p-3 ${isLightMode ? 'border-slate-300 bg-slate-50' : 'border-slate-700 bg-[#0b1120]'}`}>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <label className="inline-flex cursor-pointer items-center rounded-md bg-orange-500/10 px-3 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-500/20" htmlFor="evidence">
                                            Pilih file
                                        </label>
                                        <span className={`text-sm ${mutedClass}`}>
                                            {data.evidence.length > 0 ? `${data.evidence.length} dari 5 file dipilih` : 'Belum ada file dipilih'}
                                        </span>
                                    </div>
                                    <input accept=".jpg,.jpeg,.png,.pdf,.txt" className="sr-only" id="evidence" multiple onChange={updateEvidence} type="file" />
                                    {data.evidence.length > 0 && (
                                        <ul className="mt-3 flex flex-wrap gap-2">
                                            {data.evidence.map((file, index) => (
                                                <li className={`inline-flex max-w-full items-center gap-1 rounded-md border py-1 pl-2.5 pr-1 text-sm ${isLightMode ? 'border-slate-200 bg-white text-slate-700' : 'border-slate-700 bg-[#121b2d] text-slate-300'}`} key={`${file.name}-${file.lastModified}-${index}`}>
                                                    <span className="max-w-56 truncate">{file.name}</span>
                                                    <button aria-label={`Hapus file ${file.name}`} className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-semibold text-rose-500 transition hover:bg-rose-500/10 hover:text-rose-400" onClick={() => removeEvidence(index)} title={`Hapus ${file.name}`} type="button">
                                                        <span aria-hidden="true" className="text-xl leading-none">×</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </ReportField>

                            {progress && (
                                <div className={`h-2 overflow-hidden rounded-full ${isLightMode ? 'bg-slate-200' : 'bg-slate-800'}`}>
                                    <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${progress.percentage}%` }} />
                                </div>
                            )}

                            <div className={`rounded-xl border p-4 text-sm leading-relaxed ${isLightMode ? 'border-cyan-200 bg-cyan-50 text-slate-700' : 'border-cyan-500/20 bg-cyan-500/5 text-slate-300'}`}>
                                <strong className="text-cyan-600">Perlindungan data:</strong> Informasi laporan digunakan oleh tim NK-CSIRT untuk penanganan insiden. Hindari mencantumkan kata sandi atau data rahasia yang tidak diperlukan.
                            </div>

                            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-500 disabled:cursor-wait disabled:opacity-60 sm:text-base" disabled={processing} type="submit">
                                {processing ? 'Mengirim laporan…' : 'Kirim Aduan Siber'}
                            </button>
                        </form>
                    </div>

                    <aside className="report-sidebar min-w-0 space-y-5">
                        <section className={`rounded-2xl border p-5 ${panelClass}`}>
                            <h2 className={`text-sm font-bold uppercase tracking-wide ${headingClass}`}>Kirim melalui email</h2>
                            <p className={`mt-3 text-sm leading-relaxed ${mutedClass}`}>Jika Anda memilih email, kirim laporan ke alamat resmi berikut.</p>
                            <div className={`mt-4 block break-all rounded-lg border px-3 py-3 font-mono text-sm text-cyan-600 ${isLightMode ? 'border-slate-200 bg-slate-50' : 'border-slate-700 bg-[#0b1120]'}`}>
                                csirt@nindyakarya.co.id
                            </div>
                            <p className={`mt-3 text-xs leading-relaxed ${mutedClass}`}>Jangan kirim kata sandi atau informasi rahasia melalui email tanpa perlindungan enkripsi.</p>
                            <div className={`mt-4 rounded-lg border p-3 text-sm leading-relaxed ${isLightMode ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>
                                Kirim laporan melalui formulir di sebelah kiri. Data akan masuk ke panel admin dan dikirim sebagai email terperinci ke alamat CSIRT.
                            </div>
                            <Link className={`mt-4 inline-flex w-full items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${isLightMode ? 'border-slate-200 text-slate-700 hover:bg-slate-50' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`} href="/rfc2350">
                                Lihat informasi RFC 2350
                            </Link>
                        </section>

                        <section className={`rounded-2xl border-l-4 border-orange-500 border-y border-r p-5 ${panelClass}`}>
                            <h2 className="text-sm font-bold uppercase tracking-wide text-orange-500">Hotline darurat 24/7</h2>
                            <p className={`mt-3 text-sm leading-relaxed ${mutedClass}`}>Untuk insiden kritis yang berdampak pada layanan operasional, hubungi tim tanggap darurat.</p>
                            <a className={`mt-4 block rounded-xl border p-4 text-center ${isLightMode ? 'border-slate-200 bg-slate-50' : 'border-slate-700 bg-[#0b1120]'}`} href="tel:+62218093276">
                                <span className={`block text-xs uppercase tracking-wide ${mutedClass}`}>Telepon NK-CSIRT</span>
                                <span className={`mt-1 block text-2xl font-extrabold ${headingClass}`}>021 8093276</span>
                                <span className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-emerald-500"><span className="h-2 w-2 rounded-full bg-emerald-500" />Siaga 24 jam</span>
                            </a>
                        </section>

                        <section className={`rounded-2xl border p-5 ${panelClass}`}>
                            <h2 className={`text-sm font-bold uppercase tracking-wide ${headingClass}`}>Prinsip pelaporan</h2>
                            <ul className={`mt-4 space-y-3 text-sm leading-relaxed ${mutedClass}`}>
                                <li className="flex gap-2"><span className="font-bold text-emerald-500">✓</span><span>Berikan kronologi dan waktu kejadian sejelas mungkin.</span></li>
                                <li className="flex gap-2"><span className="font-bold text-emerald-500">✓</span><span>Sertakan bukti yang relevan tanpa mengubah file aslinya.</span></li>
                                <li className="flex gap-2"><span className="font-bold text-emerald-500">✓</span><span>Identitas pelapor dan informasi insiden ditangani secara terbatas.</span></li>
                            </ul>
                        </section>
                    </aside>
                </div>
            </div>
        </section>
    );
}
