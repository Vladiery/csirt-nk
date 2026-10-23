import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

const fieldClass = 'mt-2 w-full rounded-xl border border-slate-700 bg-[#0b1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20';

export default function StaffLogin({ isLightMode }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '' });
    const surfaceClass = isLightMode ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-800 bg-[#111a2a] text-white';
    const mutedClass = isLightMode ? 'text-slate-600' : 'text-slate-400';

    function submit(event) {
        event.preventDefault();
        post('/login');
    }

    return (
        <section className={`relative isolate flex min-h-[72vh] items-center justify-center overflow-hidden px-4 py-14 sm:px-6 ${isLightMode ? 'bg-slate-50' : 'bg-[#090e1b]'}`}>
            <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-sky-500/10 blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-[120px]" />
            </div>
            <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl sm:p-9 ${surfaceClass}`}>
                <Link className="mb-8 inline-flex items-center gap-3" href="/">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-sky-400">
                        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4.5 6v5.2c0 4.4 3 8.3 7.5 9.8 4.5-1.5 7.5-5.4 7.5-9.8V6L12 3Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
                        </svg>
                    </span>
                    <span>
                        <span className="block text-lg font-extrabold tracking-wide">NK-CSIRT</span>
                        <span className={`block text-[11px] font-semibold tracking-[0.18em] ${mutedClass}`}>PETUGAS PORTAL</span>
                    </span>
                </Link>

                <div className="mb-7">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Akses internal</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Login Petugas</h1>
                    <p className={`mt-2 text-sm leading-relaxed ${mutedClass}`}>Masuk untuk mengelola informasi dan menangani laporan insiden.</p>
                </div>

                <form className="space-y-5" onSubmit={submit}>
                    <div>
                        <label className="text-sm font-semibold" htmlFor="staff-email">Email</label>
                        <input autoComplete="username" className={fieldClass} id="staff-email" onChange={(event) => setData('email', event.target.value)} placeholder="nama@perusahaan.co.id" type="email" value={data.email} />
                        {errors.email && <p className="mt-2 text-sm text-rose-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-semibold" htmlFor="staff-password">Kata sandi</label>
                        <div className="relative">
                            <input autoComplete="current-password" className={`${fieldClass} pr-20`} id="staff-password" onChange={(event) => setData('password', event.target.value)} type={showPassword ? 'text' : 'password'} value={data.password} />
                            <button aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} className="absolute inset-y-0 right-3 my-auto h-9 rounded-lg px-2 text-xs font-bold text-sky-400 hover:bg-sky-400/10" onClick={() => setShowPassword((visible) => !visible)} type="button">
                                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                            </button>
                        </div>
                        {errors.password && <p className="mt-2 text-sm text-rose-500">{errors.password}</p>}
                    </div>

                    <button className="inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60" disabled={processing} type="submit">
                        {processing ? 'Memverifikasi...' : 'Masuk ke Portal'}
                    </button>
                </form>

                <p className={`mt-6 text-center text-xs leading-relaxed ${mutedClass}`}>Akun hanya dapat dibuat oleh administrator CSIRT.</p>
            </div>
        </section>
    );
}
