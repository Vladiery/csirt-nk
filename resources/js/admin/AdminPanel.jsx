import { AdminNavigation } from './shared';
import { Dashboard } from './dashboard/Dashboard';
import { ReportDetail, ReportList } from './reports/Reports';
import { ContentManagement } from './content/ContentManagement';
import { StaffManagement } from './staff/StaffManagement';
import { RfcDocumentManagement } from './rfc2350/RfcDocumentManagement';
import { AdminAlerts } from './reports/Reports';

export default function AdminPanel({ adminNotifications = [], adminUnreadNotificationCount = 0, adminSection, assignees = [], auth = {}, categories = [], contentCategories = [], contentType, filters = {}, flash = {}, isLightMode, items, report, reports, rfcDocument = {}, staff, stats, statuses = [] }) {
    const sectionKey = adminSection === 'content' ? contentType : adminSection;

    return (
        <section className="admin-panel min-h-[70vh] bg-[#090e1b] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
            <div className="w-full space-y-7">
                <header className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">NK-CSIRT · AREA TERBATAS</p><p className="mt-2 text-sm text-slate-400">Masuk sebagai <span className="font-semibold text-slate-200">{auth.user?.name}</span> · <span className="capitalize">{auth.user?.role}</span></p></div>
                    <AdminNavigation section={sectionKey} />
                </header>
                <AdminAlerts count={adminUnreadNotificationCount} notifications={adminNotifications} />
                {flash.adminStatus && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{flash.adminStatus}</p>}
                {adminSection === 'dashboard' && <Dashboard stats={stats} />}
                {adminSection === 'reports' && <ReportList categories={categories} filters={filters} reports={reports} statuses={statuses} />}
                {adminSection === 'reportDetail' && <ReportDetail assignees={assignees} report={report} statuses={statuses} />}
                {adminSection === 'content' && <ContentManagement contentCategories={contentCategories} filters={filters} items={items} type={contentType} />}
                {adminSection === 'rfcDocument' && <RfcDocumentManagement isLightMode={isLightMode} rfcDocument={rfcDocument} />}
                {adminSection === 'staff' && <StaffManagement auth={auth} isLightMode={isLightMode} staff={staff} />}
            </div>
        </section>
    );
}

