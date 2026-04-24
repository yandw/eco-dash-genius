import {
  LayoutDashboard,
  FileBarChart,
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
  FileEdit,
  Download,
  ShieldCheck,
  Inbox,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
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
  useSidebar,
} from "@/components/ui/sidebar";

export type UserSide = "gov" | "ent";

const govItems = [
  { title: "全景监测", url: "/gov", icon: LayoutDashboard },
  { title: "节能月度报告", url: "/gov/report-monthly", icon: FileBarChart },
  { title: "节能年度报告", url: "/gov/report-yearly", icon: CalendarRange },
  { title: "能源限额报告", url: "/gov/energy-quota", icon: Gauge },
  { title: "节能管理档案", url: "/gov/archives", icon: FolderArchive },
  { title: "双控考核管理", url: "/gov/dual-control", icon: ClipboardCheck },
  { title: "固定资产管理", url: "/gov/assets", icon: Boxes },
  { title: "绿色制造管理", url: "/gov/green-mfg", icon: Leaf },
  { title: "设备对标管理", url: "/gov/benchmark", icon: Crosshair },
  { title: "企业管理", url: "/gov/enterprise", icon: Building2 },
  { title: "系统管理", url: "/gov/system", icon: Settings },
];

const entItems = [
  { title: "我的工作台", url: "/ent", icon: LayoutDashboard },
  { title: "年度报告填报", url: "/ent/report-yearly", icon: CalendarRange },
  { title: "限额报告填报", url: "/ent/energy-quota", icon: Gauge },
  { title: "企业设置", url: "/ent/profile", icon: Building2 },
  { title: "节能档案", url: "/ent/archives", icon: FolderArchive },
  { title: "文件下载", url: "/ent/downloads", icon: Download },
  { title: "系统管理", url: "/ent/system", icon: Settings },
];

export const navItems = govItems;

interface Props {
  side?: UserSide;
}

export function AppSidebar({ side = "gov" }: Props) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const items = side === "gov" ? govItems : entItems;
  const isGov = side === "gov";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            {isGov ? (
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Activity className="h-5 w-5 text-primary-foreground" />
            )}
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gradient">
                {isGov ? "政府监管" : "企业服务"}
              </span>
              <span className="text-[10px] tracking-wider text-sidebar-foreground/60">
                {isGov ? "节能降碳数智平台" : "能碳填报与管理"}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50">
              功能模块
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/60"
                      activeClassName="!bg-sidebar-accent !text-sidebar-accent-foreground font-medium border-l-2 border-primary"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
