import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileBarChart,
  ClipboardList,
  CalendarRange,
  Gauge,
  FolderArchive,
  ClipboardCheck,
  Boxes,
  Leaf,
  Crosshair,
  Building2,
  Settings,
  Activity,
  Download,
  ShieldCheck,
  ChevronDown,
  Home,
  History,
  LineChart,
  Award,
  Server,
  Users,
  Newspaper,
  Target,
  FileEdit,
} from "lucide-react";
import { isCityAdmin } from "@/mocks/currentUser";
import { NavLink } from "@/components/NavLink";
import logo from "@/assets/portal/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export type UserSide = "gov" | "ent";

type NavChild = { title: string; url: string; icon?: typeof Home };
type NavItem = { title: string; url: string; icon: typeof Home; children?: NavChild[] };

export const govItems: NavItem[] = [
  {
    title: "全景监测",
    url: "/gov",
    icon: LayoutDashboard,
    children: [
      { title: "首页", url: "/gov", icon: Home },
      { title: "十年节能", url: "/gov/decade", icon: History },
      { title: "双控跟踪", url: "/gov/dual-track", icon: LineChart },
      { title: "双控考核", url: "/gov/dual-assess", icon: Award },
      { title: "IDC监察", url: "/gov/idc", icon: Server },
      
    ],
  },
  { title: "节能月度报告", url: "/gov/report-monthly", icon: FileBarChart },
  { title: "节能年度报告", url: "/gov/report-yearly", icon: CalendarRange },
  { title: "能源限额报告", url: "/gov/energy-quota", icon: Gauge },
  {
    title: "档案管理",
    url: "/gov/archives",
    icon: FolderArchive,
    children: [
      { title: "节能档案", url: "/gov/archives", icon: FolderArchive },
      { title: "岗位备案", url: "/gov/posts", icon: Users },
    ],
  },
  {
    title: "考核管理",
    url: "/gov/assess",
    icon: ClipboardCheck,
    children: [
      { title: "目标分解", url: "/gov/assess/goal", icon: Target },
      { title: "双控考核", url: "/gov/assess/dual", icon: ClipboardCheck },
      ...(isCityAdmin()
        ? [
            { title: "任务管理", url: "/gov/assess/tasks", icon: ClipboardList },
            { title: "区/集团管理", url: "/gov/assess/orgs", icon: Building2 },
          ]
        : []),
    ],
  },
  { title: "固定资产管理", url: "/gov/assets", icon: Boxes },
  { title: "绿色制造管理", url: "/gov/green-mfg", icon: Leaf },
  
  { title: "企业管理", url: "/gov/enterprise", icon: Building2 },
  {
    title: "系统管理",
    url: "/gov/system",
    icon: Settings,
    children: [
      { title: "新闻发布", url: "/gov/news", icon: Newspaper },
    ],
  },
];

export const entItems: NavItem[] = [
  { title: "我的工作台", url: "/ent", icon: LayoutDashboard },
  { title: "月度报告填报", url: "/ent/report-monthly", icon: FileBarChart },
  { title: "年度报告填报", url: "/ent/report-yearly", icon: CalendarRange },
  { title: "限额报告填报", url: "/ent/energy-quota", icon: Gauge },
  { title: "企业设置", url: "/ent/profile", icon: Building2 },
  {
    title: "档案管理",
    url: "/ent/archives",
    icon: FolderArchive,
    children: [
      { title: "节能档案", url: "/ent/archives", icon: FolderArchive },
      { title: "岗位备案", url: "/ent/posts", icon: Users },
    ],
  },
  {
    title: "考核管理",
    url: "/ent/assess",
    icon: ClipboardCheck,
    children: [
      { title: "目标分解", url: "/ent/assess/goal", icon: Target },
      { title: "考核结果", url: "/ent/assess/dual", icon: ClipboardCheck },
    ],
  },
  { title: "文件下载", url: "/ent/downloads", icon: Download },
  { title: "系统管理", url: "/ent/system", icon: Settings },
  { title: "草稿区", url: "/ent/draft", icon: FileEdit },
];

export const navItems = govItems;

interface Props {
  side?: UserSide;
}

const monitoringSubPaths = ["/gov", "/gov/decade", "/gov/dual-track", "/gov/dual-assess", "/gov/idc", "/gov/equip-bench"];

export function AppSidebar({ side = "gov" }: Props) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const items = side === "gov" ? govItems : entItems;
  const isGov = side === "gov";
  const location = useLocation();

  // 默认展开包含当前路由的父项
  const isMonitoringActive = monitoringSubPaths.includes(location.pathname);
  const archivesActive =
    location.pathname === (isGov ? "/gov/archives" : "/ent/archives") ||
    location.pathname === (isGov ? "/gov/posts" : "/ent/posts");
  const systemActive = isGov && location.pathname.startsWith("/gov/news");
  const assessActive = location.pathname.startsWith(isGov ? "/gov/assess" : "/ent/assess");
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({
    全景监测: isMonitoringActive,
    档案管理: archivesActive,
    系统管理: systemActive,
    考核管理: assessActive,
  });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <NavLink
          to="/portal"
          className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-sidebar-accent/30 transition-colors"
          title="返回门户首页"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-glow overflow-hidden shrink-0">
            <img src={logo} alt="平台 Logo" className="h-7 w-7 object-contain" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-sidebar-foreground truncate">
              能碳数智平台
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const hasChildren = !!item.children?.length;
                const isOpen = openMap[item.title] ?? false;
                const childActive = hasChildren && item.children!.some((c) => c.url === location.pathname);

                if (!hasChildren) {
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <NavLink
                          to={item.url}
                          end
                          className="rounded-md hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
                          activeClassName="!bg-sidebar-accent !text-sidebar-accent-foreground font-medium"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // 含子菜单
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => setOpenMap((m) => ({ ...m, [item.title]: !isOpen }))}
                      className={`rounded-md hover:bg-sidebar-accent/30 hover:text-sidebar-foreground ${childActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""}`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="truncate flex-1 text-left">{item.title}</span>
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`}
                          />
                        </>
                      )}
                    </SidebarMenuButton>

                    {!collapsed && isOpen && (
                      <SidebarMenuSub>
                        {item.children!.map((c) => (
                          <SidebarMenuSubItem key={c.url}>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to={c.url}
                                end
                                className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/20"
                                activeClassName="!text-sidebar-primary font-medium"
                              >
                                {c.icon && <c.icon className="h-3.5 w-3.5 shrink-0" />}
                                <span className="truncate">{c.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
