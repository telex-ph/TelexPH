import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "@/shared/ScrollToTop";
import ProtectedRoute from "@/shared/ProtectedRoute";
import RouteFallback from "@/shared/RouteFallback";
import { registerPrefetch } from "@/shared/prefetch";
import SitePageViewTracker from "@/components/SitePageViewTracker/SitePageViewTracker";
import BugReportWidget from "@/shared/BugReportWidget";
import { RouteSeo } from "@/shared/Seo";
import { SERVICE_PAGES } from "@/data/service-pages";

/* The landing page is eager so the first paint is immediate. Every other
   route is code-split — Next.js did this per-page automatically, and without
   it a visitor downloads all four dashboards just to read the homepage. */
import HomePage from "@/pages/HomePage";

/* ---------------- Public site ---------------- */
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Contact = lazy(() => import("@/pages/Contact"));
const Careers = lazy(() => import("@/pages/Careers"));
const JobDetails = lazy(() => import("@/pages/JobDetails"));
const Resources = lazy(() => import("@/pages/Resources"));
const Blogs = lazy(() => import("@/pages/Blogs"));
const IndustryUseCase = lazy(() => import("@/pages/IndustryUseCase"));
const CaseStudyDetails = lazy(() => import("@/pages/CaseStudyDetails"));
const Location = lazy(() => import("@/pages/Location"));
const Platform = lazy(() => import("@/pages/Platform"));
const Apply = lazy(() => import("@/pages/Apply"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ServicePage = lazy(() => import("@/pages/ServicePage"));

/* ---------------- Funnels ---------------- */
const FunnelService = lazy(() => import("@/pages/funnels/$service/Page"));
const FunnelAiBuilder = lazy(() => import("@/pages/funnels/ai-builder/Page"));
const FunnelAutomation = lazy(() => import("@/pages/funnels/automation/Page"));
const FunnelBuilder = lazy(() => import("@/pages/funnels/funnel-builder/Page"));

/* ---------------- Admin ---------------- */
const AdminLayout = lazy(() => import("@/pages/admin/Layout"));
const AdminIndex = lazy(() => import("@/pages/admin/Page"));
const AdminLogin = lazy(() => import("@/pages/admin/login/Page"));
const AdminForgotPassword = lazy(() => import("@/pages/admin/login/forgot-password/Page"));
const AdminDashboardLayout = lazy(() => import("@/pages/admin/dashboard/Layout"));
const AdminDashboardHome = lazy(() => import("@/pages/admin/dashboard/Page"));
const AdminActivityLogs = lazy(() => import("@/pages/admin/dashboard/ActivityLogs/Page"));
const AdminManagement = lazy(() => import("@/pages/admin/dashboard/admin-management/Page"));
const AdminManagementAdd = lazy(() => import("@/pages/admin/dashboard/admin-management/add/Page"));
const AdminApplicants = lazy(() => import("@/pages/admin/dashboard/Applicants/Page"));
const AdminAppointment = lazy(() => import("@/pages/admin/dashboard/Appointment/Page"));
const AdminArchive = lazy(() => import("@/pages/admin/dashboard/Archive/Page"));
const AdminMessages = lazy(() => import("@/pages/admin/dashboard/Messages/Page"));
const AdminBlogs = lazy(() => import("@/pages/admin/dashboard/blogs/Page"));
const AdminBlogsList = lazy(() => import("@/pages/admin/dashboard/blogs/list/Page"));
const AdminCareers = lazy(() => import("@/pages/admin/dashboard/careers/Page"));
const AdminCaseStudies = lazy(() => import("@/pages/admin/dashboard/CaseStudies/Page"));
const AdminPageViews = lazy(() => import("@/pages/admin/dashboard/page-views/Page"));
const AdminServices = lazy(() => import("@/pages/admin/dashboard/Services/Page"));
const AdminSettings = lazy(() => import("@/pages/admin/dashboard/settings/Page"));
const AdminUserManagement = lazy(() => import("@/pages/admin/dashboard/user-management/Page"));

/* ---------------- Client portal ---------------- */
const ClientLogin = lazy(() => import("@/pages/client/login/Page"));
const ClientForgotPassword = lazy(() => import("@/pages/client/login/forgot-password/Page"));
const ClientRegister = lazy(() => import("@/pages/client/register/Page"));
const ClientDashboardLayout = lazy(() => import("@/pages/client/dashboard/Layout"));
const ClientDashboardHome = lazy(() => import("@/pages/client/dashboard/Page"));
const ClientAccountSettings = lazy(() => import("@/pages/client/dashboard/AccountSettings/Page"));
const ClientAppointments = lazy(() => import("@/pages/client/dashboard/Appointments/Page"));
const ClientBrowseVAs = lazy(() => import("@/pages/client/dashboard/BrowseVAs/Page"));
const ClientMessaging = lazy(() => import("@/pages/client/dashboard/ClientMessaging/Page"));
const ClientInterviewRecording = lazy(() => import("@/pages/client/dashboard/InterviewRecording/Page"));
const ClientMyVAs = lazy(() => import("@/pages/client/dashboard/MyVAs/Page"));
const ClientShortlisted = lazy(() => import("@/pages/client/dashboard/Shortlisted/Page"));
const ClientSubscription = lazy(() => import("@/pages/client/dashboard/Subscription/Page"));
const ClientVAservices = lazy(() => import("@/pages/client/dashboard/VAservices/Page"));

/* ---------------- Virtual Assistant portal ---------------- */
const VaLogin = lazy(() => import("@/pages/VirtualAssistant/login/Page"));
const VaForgotPassword = lazy(() => import("@/pages/VirtualAssistant/forgot-password/Page"));
const VaActivate = lazy(() => import("@/pages/VirtualAssistant/activate/Page"));
const VaForms = lazy(() => import("@/pages/VirtualAssistant/VAforms/Page"));
const VaDashboardLayout = lazy(() => import("@/pages/VirtualAssistant/dashboard/Layout"));
const VaDashboardHome = lazy(() => import("@/pages/VirtualAssistant/dashboard/Page"));
const VaDashboardMain = lazy(() => import("@/pages/VirtualAssistant/dashboard/VAdashboard/Page"));
const VaAssessment = lazy(() => import("@/pages/VirtualAssistant/dashboard/VAassesment/Page"));
const VaSettings = lazy(() => import("@/pages/VirtualAssistant/dashboard/Settings/Page"));
const VaSubscription = lazy(() => import("@/pages/VirtualAssistant/dashboard/Subscription/Page"));
const VaMessaging = lazy(() => import("@/pages/VirtualAssistant/dashboard/VAmessaging/Page"));

/* ---------------- VAdash (legacy VA dashboard) ---------------- */
const VAdashLayout = lazy(() => import("@/pages/VAdash/dashboard/Layout"));
const VAdashHome = lazy(() => import("@/pages/VAdash/dashboard/Page"));
const VAdashMain = lazy(() => import("@/pages/VAdash/dashboard/VAdashboard/Page"));
const VAdashAssessment = lazy(() => import("@/pages/VAdash/dashboard/VAassesment/Page"));
const VAdashSettings = lazy(() => import("@/pages/VAdash/dashboard/Settings/Page"));

/**
 * Routes worth warming on link hover. Kept next to the lazy() calls above so
 * the two can't drift. Only the public site and portal entry points are listed
 * — deep dashboard routes are reached from inside an already-loaded shell.
 */
registerPrefetch([
  ["/about", () => import("@/pages/About")],
  ["/services", () => import("@/pages/Services")],
  ["/contact", () => import("@/pages/Contact")],
  ["/location", () => import("@/pages/Location")],
  ["/platform", () => import("@/pages/Platform")],
  ["/Apply", () => import("@/pages/Apply")],
  ["/careers", () => import("@/pages/Careers")],
  ["/careers/job-details", () => import("@/pages/JobDetails")],
  ["/resources", () => import("@/pages/Resources")],
  ["/resources/Blogs", () => import("@/pages/Blogs")],
  ["/resources/IndustryUseCase", () => import("@/pages/IndustryUseCase")],
  ["/resources/CaseStudiesCardDetails", () => import("@/pages/CaseStudyDetails")],
  ["/admin/login", () => import("@/pages/admin/login/Page")],
  ["/client/login", () => import("@/pages/client/login/Page")],
  ["/VirtualAssistant/login", () => import("@/pages/VirtualAssistant/login/Page")],
  ...SERVICE_PAGES.map(({ path }) => [path, () => import("@/pages/ServicePage")]),
]);

/**
 * Route tree replacing the Next.js App Router.
 *
 * Paths match the previous URLs 1:1 so existing links, bookmarks and SEO
 * stay valid. Layout routes render an <Outlet />, mirroring how Next's
 * layout.tsx wrapped its children.
 *
 * Auth: the old middleware.ts guarded /admin/* server-side. <ProtectedRoute>
 * takes over that job on the client — see src/shared/ProtectedRoute.jsx.
 */
const App = () => {
  // Prerendered HTML (scripts/prerender.mjs) is for crawlers; index.html hides it
  // until React has mounted so visitors see the same first paint as before.
  useEffect(() => {
    document.getElementById("root")?.removeAttribute("data-prerendered");
  }, []);

  return (
    <>
      <ScrollToTop />
      <RouteSeo />
      <SitePageViewTracker />
      <BugReportWidget />

      <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* ---------- Public marketing site ---------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/location" element={<Location />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/Apply" element={<Apply />} />

        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/job-details" element={<JobDetails />} />

        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/Blogs" element={<Blogs />} />
        <Route path="/resources/IndustryUseCase" element={<IndustryUseCase />} />
        <Route
          path="/resources/CaseStudiesCardDetails"
          element={<CaseStudyDetails />}
        />

        {/* ---------- Service landing pages (data/service-pages.js) ---------- */}
        {SERVICE_PAGES.map(({ path }) => (
          <Route key={path} path={path} element={<ServicePage />} />
        ))}

        {/* ---------- Funnels ---------- */}
        <Route path="/funnels/ai-builder" element={<FunnelAiBuilder />} />
        <Route path="/funnels/automation" element={<FunnelAutomation />} />
        <Route path="/funnels/funnel-builder" element={<FunnelBuilder />} />
        {/* Dynamic segment — was app/funnels/[service] */}
        <Route path="/funnels/:service" element={<FunnelService />} />

        {/* /login is not a real entry point — must not reveal or forward to
            /admin/login. Admin access requires typing /admin/login directly. */}
        <Route path="/login" element={<NotFound />} />

        {/* ---------- Admin ---------- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminIndex />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="login/forgot-password" element={<AdminForgotPassword />} />

          {/* Everything below requires a valid session */}
          <Route element={<ProtectedRoute loginPath="/admin/login" />}>
            <Route path="dashboard" element={<AdminDashboardLayout />}>
              <Route index element={<AdminDashboardHome />} />
              <Route path="ActivityLogs" element={<AdminActivityLogs />} />
              <Route path="admin-management" element={<AdminManagement />} />
              <Route path="admin-management/add" element={<AdminManagementAdd />} />
              <Route path="Applicants" element={<AdminApplicants />} />
              <Route path="Appointment" element={<AdminAppointment />} />
              <Route path="Archive" element={<AdminArchive />} />
              <Route path="Messages" element={<AdminMessages />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="blogs/list" element={<AdminBlogsList />} />
              <Route path="careers" element={<AdminCareers />} />
              <Route path="CaseStudies" element={<AdminCaseStudies />} />
              <Route path="page-views" element={<AdminPageViews />} />
              <Route path="Services" element={<AdminServices />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="user-management" element={<AdminUserManagement />} />
            </Route>
          </Route>
        </Route>

        {/* ---------- Client portal ---------- */}
        <Route path="/client">
          <Route index element={<Navigate to="/client/dashboard" replace />} />
          <Route path="login" element={<ClientLogin />} />
          <Route path="login/forgot-password" element={<ClientForgotPassword />} />
          <Route path="register" element={<ClientRegister />} />

          <Route
            element={
              <ProtectedRoute probe="/auth/client/me" loginPath="/client/login" />
            }
          >
            <Route path="dashboard" element={<ClientDashboardLayout />}>
              <Route index element={<ClientDashboardHome />} />
              <Route path="AccountSettings" element={<ClientAccountSettings />} />
              <Route path="Appointments" element={<ClientAppointments />} />
              <Route path="BrowseVAs" element={<ClientBrowseVAs />} />
              <Route path="ClientMessaging" element={<ClientMessaging />} />
              <Route
                path="InterviewRecording"
                element={<ClientInterviewRecording />}
              />
              <Route path="MyVAs" element={<ClientMyVAs />} />
              <Route path="Shortlisted" element={<ClientShortlisted />} />
              <Route path="Subscription" element={<ClientSubscription />} />
              <Route path="VAservices" element={<ClientVAservices />} />
            </Route>
          </Route>
        </Route>

        {/* ---------- Virtual Assistant portal ---------- */}
        <Route path="/VirtualAssistant">
          <Route
            index
            element={<Navigate to="/VirtualAssistant/dashboard" replace />}
          />
          <Route path="login" element={<VaLogin />} />
          <Route path="forgot-password" element={<VaForgotPassword />} />
          <Route path="activate" element={<VaActivate />} />
          <Route path="VAforms" element={<VaForms />} />

          <Route
            element={
              <ProtectedRoute
                probe="/auth/va/me"
                loginPath="/VirtualAssistant/login"
              />
            }
          >
            <Route path="dashboard" element={<VaDashboardLayout />}>
              <Route index element={<VaDashboardHome />} />
              <Route path="VAdashboard" element={<VaDashboardMain />} />
              <Route path="VAassesment" element={<VaAssessment />} />
              <Route path="Settings" element={<VaSettings />} />
              <Route path="Subscription" element={<VaSubscription />} />
              <Route path="VAmessaging" element={<VaMessaging />} />
            </Route>
          </Route>
        </Route>

        {/* ---------- VAdash (legacy VA dashboard) ---------- */}
        <Route
          element={
            <ProtectedRoute
              probe="/va-users/me"
              loginPath="/VirtualAssistant/login"
            />
          }
        >
          <Route path="/VAdash/dashboard" element={<VAdashLayout />}>
            <Route index element={<VAdashHome />} />
            <Route path="VAdashboard" element={<VAdashMain />} />
            <Route path="VAassesment" element={<VAdashAssessment />} />
            <Route path="Settings" element={<VAdashSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </>
  );
};

export default App;
