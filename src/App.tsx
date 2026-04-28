import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ReportMonthly from "./pages/ReportMonthly.tsx";
import ReportYearly from "./pages/ReportYearly.tsx";
import EnergyQuota from "./pages/EnergyQuota.tsx";
import Archives from "./pages/Archives.tsx";
import DualControl from "./pages/DualControl.tsx";
import Assets from "./pages/Assets.tsx";
import GreenMfg from "./pages/GreenMfg.tsx";
import Benchmark from "./pages/Benchmark.tsx";
import Enterprise from "./pages/Enterprise.tsx";
import System from "./pages/System.tsx";
import PortalHome from "./pages/portal/PortalHome.tsx";
import PortalNews from "./pages/portal/PortalNews.tsx";
import PortalNewsDetail from "./pages/portal/PortalNewsDetail.tsx";
import PortalGreenMfg from "./pages/portal/PortalGreenMfg.tsx";
import PortalScenarios from "./pages/portal/PortalScenarios.tsx";
import PortalLogin from "./pages/portal/PortalLogin.tsx";
import PortalRegister from "./pages/portal/PortalRegister.tsx";
import EntDashboard from "./pages/ent/EntDashboard.tsx";
import EntReportYearly from "./pages/ent/EntReportYearly.tsx";
import EntEnergyQuota from "./pages/ent/EntEnergyQuota.tsx";
import EntProfile from "./pages/ent/EntProfile.tsx";
import EntArchives from "./pages/ent/EntArchives.tsx";
import EntArchiveDetail from "./pages/ent/EntArchiveDetail.tsx";
import EntDownloads from "./pages/ent/EntDownloads.tsx";
import EntSystem from "./pages/ent/EntSystem.tsx";
import Decade from "./pages/gov/Decade.tsx";
import DualTrack from "./pages/gov/DualTrack.tsx";
import DualAssess from "./pages/gov/DualAssess.tsx";
import Idc from "./pages/gov/Idc.tsx";
import EquipBench from "./pages/gov/EquipBench.tsx";
import GovPosts from "./pages/gov/Posts.tsx";
import AssessGoal from "./pages/gov/AssessGoal.tsx";
import AssessDual from "./pages/gov/AssessDual.tsx";
import EntAssessGoal from "./pages/ent/EntAssessGoal.tsx";
import EntAssessDual from "./pages/ent/EntAssessDual.tsx";
import GovPostDetail from "./pages/gov/GovPostDetail.tsx";
import GovArchiveDetail from "./pages/gov/GovArchiveDetail.tsx";
import NewsAdmin from "./pages/gov/NewsAdmin.tsx";
import NewsEditor from "./pages/gov/NewsEditor.tsx";
import EntPosts from "./pages/ent/EntPosts.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 默认进入门户 */}
          <Route path="/" element={<Navigate to="/portal" replace />} />

          {/* 政府监管侧 - 全景监测二级 */}
          <Route path="/gov" element={<Index />} />
          <Route path="/gov/decade" element={<Decade />} />
          <Route path="/gov/dual-track" element={<DualTrack />} />
          <Route path="/gov/dual-assess" element={<DualAssess />} />
          <Route path="/gov/idc" element={<Idc />} />
          <Route path="/gov/equip-bench" element={<EquipBench />} />
          <Route path="/gov/report-monthly" element={<ReportMonthly />} />
          <Route path="/gov/report-yearly" element={<ReportYearly />} />
          <Route path="/gov/energy-quota" element={<EnergyQuota />} />
          <Route path="/gov/archives" element={<Archives />} />
          <Route path="/gov/archives/:entId/:year" element={<GovArchiveDetail />} />
          <Route path="/gov/posts" element={<GovPosts />} />
          <Route path="/gov/posts/:entId" element={<GovPostDetail />} />
          <Route path="/gov/dual-control" element={<AssessDual />} />
          <Route path="/gov/assess/goal" element={<AssessGoal />} />
          <Route path="/gov/assess/dual" element={<AssessDual />} />
          <Route path="/gov/assets" element={<Assets />} />
          <Route path="/gov/green-mfg" element={<GreenMfg />} />
          <Route path="/gov/benchmark" element={<Benchmark />} />
          <Route path="/gov/enterprise" element={<Enterprise />} />
          <Route path="/gov/system" element={<System />} />
          <Route path="/gov/news" element={<NewsAdmin />} />
          <Route path="/gov/news/new" element={<NewsEditor />} />
          <Route path="/gov/news/:id/edit" element={<NewsEditor />} />

          {/* 企业服务侧 */}
          <Route path="/ent" element={<EntDashboard />} />
          <Route path="/ent/report-yearly" element={<EntReportYearly />} />
          <Route path="/ent/energy-quota" element={<EntEnergyQuota />} />
          <Route path="/ent/profile" element={<EntProfile />} />
          <Route path="/ent/archives" element={<EntArchives />} />
          <Route path="/ent/archives/:year" element={<EntArchiveDetail />} />
          <Route path="/ent/posts" element={<EntPosts />} />
          <Route path="/ent/assess/goal" element={<EntAssessGoal />} />
          <Route path="/ent/assess/dual" element={<EntAssessDual />} />
          <Route path="/ent/downloads" element={<EntDownloads />} />
          <Route path="/ent/system" element={<EntSystem />} />

          {/* 门户 */}
          <Route path="/portal" element={<PortalHome />} />
          <Route path="/portal/news" element={<PortalNews />} />
          <Route path="/portal/news/:id" element={<PortalNewsDetail />} />
          <Route path="/portal/green-mfg" element={<PortalGreenMfg />} />
          <Route path="/portal/scenarios" element={<PortalScenarios />} />
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route path="/portal/register" element={<PortalRegister />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
