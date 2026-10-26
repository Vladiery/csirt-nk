import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { buttonClass, ConfirmDialog, Field, inputClass, labelClass } from '../shared';

export function StaffCreateForm({ isLightMode }) {
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '', is_active: true });

    function submit(event) {
        event.preventDefault();
        form.post('/admin/staff', { onSuccess: () => form.reset('name', 'email', 'password', 'password_confirmation') });
    }

    return (
        <form className={`grid gap-4 rounded-2xl border p-5 md:grid-cols-2 ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800 bg-[#111a2a]'}`} onSubmit={submit}>
            <div className="md:col-span-2"><h2 className={`text-lg font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>Tambah akun admin</h2><p className={`mt-1 text-sm ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>Akun admin hanya dibuat dari panel ini. Pengunjung publik tidak dapat mendaftar.</p></div>
            <Field error={form.errors.name} isLightMode={isLightMode} label="Nama" onChange={(event) => form.setData('name', event.target.value)} value={form.data.name} />
            <Field error={form.errors.email} isLightMode={isLightMode} label="Email" onChange={(event) => form.setData('email', event.target.value)} type="email" value={form.data.email} />
            <div className="grid grid-cols-2 gap-3"><Field error={form.errors.password} isLightMode={isLightMode} label="Kata sandi" onChange={(event) => form.setData('password', event.target.value)} type="password" value={form.data.password} /><Field error={form.errors.password_confirmation} isLightMode={isLightMode} label="Ulangi kata sandi" onChange={(event) => form.setData('password_confirmation', event.target.value)} type="password" value={form.data.password_confirmation} /></div>
            <label className={`flex items-center gap-2 text-sm ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}><input checked={form.data.is_active} className="h-4 w-4 accent-sky-500" onChange={(event) => form.setData('is_active', event.target.checked)} type="checkbox" />Aktifkan akun setelah dibuat</label>
            <div><button className={buttonClass} disabled={form.processing} type="submit">Buat akun</button></div>
        </form>
    );
}

export function StaffAccount({ staff, currentUser, isLightMode }) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const form = useForm({ name: staff.name, email: staff.email, is_active: staff.is_active, password: '', password_confirmation: '' });
    const fieldInputClass = isLightMode
        ? 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
        : inputClass;
    const isLegacyAccount = staff.role === 'analyst';

    function submit(event) {
        event.preventDefault();
        form.patch(`/admin/staff/${staff.id}`, { onSuccess: () => form.reset('password', 'password_confirmation') });
    }

    function deleteAccount() {
        setDeleteProcessing(true);
        router.delete(`/admin/staff/${staff.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteProcessing(false),
        });
    }

    return (
        <form className={`grid gap-3 rounded-xl border p-4 lg:grid-cols-[1fr_1fr_170px_110px_1fr_auto] lg:items-end ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800 bg-[#0b1220]'}`} onSubmit={submit}>
            <Field error={form.errors.name} isLightMode={isLightMode} label="Nama" onChange={(event) => form.setData('name', event.target.value)} value={form.data.name} />
            <Field error={form.errors.email} isLightMode={isLightMode} label="Email" onChange={(event) => form.setData('email', event.target.value)} type="email" value={form.data.email} />
            <div className={`self-center text-sm font-semibold ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{isLegacyAccount ? 'Akun lama · analis nonaktif' : 'Admin'}</div>
            <label className={`flex h-10 items-center gap-2 text-sm ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}><input checked={form.data.is_active} className="h-4 w-4 accent-sky-500" disabled={currentUser || isLegacyAccount} onChange={(event) => form.setData('is_active', event.target.checked)} type="checkbox" />Aktif</label>
            <div className="grid grid-cols-2 gap-2"><Field error={form.errors.password} isLightMode={isLightMode} label="Sandi baru" onChange={(event) => form.setData('password', event.target.value)} type="password" value={form.data.password} /><Field error={form.errors.password_confirmation} isLightMode={isLightMode} label="Konfirmasi" onChange={(event) => form.setData('password_confirmation', event.target.value)} type="password" value={form.data.password_confirmation} /></div>
            <div className="flex gap-2"><button className="rounded-lg bg-sky-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-sky-500" type="submit">Simpan</button>{!currentUser && <button className="rounded-lg border border-rose-500/30 px-3 py-2.5 text-sm font-semibold text-rose-300 hover:bg-rose-500/10" onClick={() => setDeleteOpen(true)} type="button">Hapus</button>}</div>
            <ConfirmDialog description={`Akun ${staff.name} (${staff.email}) akan dihapus permanen dan tidak dapat dipulihkan.`} isLightMode={isLightMode} onCancel={() => { if (!deleteProcessing) setDeleteOpen(false); }} onConfirm={deleteAccount} open={deleteOpen} processing={deleteProcessing} title="Yakin ingin menghapus akun ini?" />
        </form>
    );
}

export function StaffManagement({ staff = [], auth, isLightMode }) {
    return (
        <section className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Administrasi</p><h1 className="mt-2 text-3xl font-extrabold text-white">Akun admin</h1><p className="mt-2 text-sm text-slate-400">Kelola akun admin. Minimal satu admin aktif harus dipertahankan.</p></div><StaffCreateForm isLightMode={isLightMode} /><div className="space-y-3">{staff.map((user) => <StaffAccount currentUser={user.id === auth?.user?.id} isLightMode={isLightMode} key={user.id} staff={user} />)}</div></section>
    );
}
