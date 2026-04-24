import { Download, FileText, Search, BookOpen, FileSpreadsheet, FileCode } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const groups = [
  {
    title: "填报模板",
    icon: FileSpreadsheet,
    items: [
      { name: "2025年度节能报告填报模板.xlsx", desc: "适用于年度报告填报", size: "248 KB", ver: "v2025.1" },
      { name: "能源限额季度报送模板.xlsx", desc: "单位产品能耗限额执行情况", size: "156 KB", ver: "v2025.1" },
      { name: "重点用能设备清单模板.xlsx", desc: "用于设备档案录入", size: "98 KB", ver: "v2024.3" },
      { name: "绿色制造自评价表.xlsx", desc: "绿色工厂申报使用", size: "320 KB", ver: "v2024.2" },
    ],
  },
  {
    title: "政策法规",
    icon: BookOpen,
    items: [
      { name: "上海市节约能源条例（2024修订）.pdf", desc: "市级地方法规", size: "1.2 MB", ver: "2024" },
      { name: "重点用能单位节能管理办法.pdf", desc: "国家发改委令", size: "860 KB", ver: "2018" },
      { name: "工业节能监察办法.pdf", desc: "工信部令第33号", size: "560 KB", ver: "2017" },
    ],
  },
  {
    title: "操作手册",
    icon: FileCode,
    items: [
      { name: "企业用户操作手册.pdf", desc: "平台使用指南完整版", size: "5.6 MB", ver: "v3.2" },
      { name: "年度报告填报指引.pdf", desc: "分步填报说明", size: "2.1 MB", ver: "v2.0" },
      { name: "限额报送常见问题.pdf", desc: "FAQ 与排错", size: "780 KB", ver: "v1.5" },
    ],
  },
];

export default function EntDownloads() {
  return (
    <AppLayout side="ent" title="文件下载" subtitle="填报模板、政策法规、操作手册集中下载">
      <div className="panel p-5 mb-4">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜索模板 / 法规 / 手册..." className="pl-9 h-10" />
        </div>
      </div>

      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.title} className="panel p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/60">
              <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                <g.icon className="h-4 w-4 text-primary-foreground" />
              </div>
              <h3 className="text-base font-semibold">{g.title}</h3>
              <Badge variant="outline" className="ml-2 text-[10px]">{g.items.length} 项</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {g.items.map((it) => (
                <div
                  key={it.name}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-card hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{it.name}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                      <span>{it.desc}</span>
                      <span>·</span>
                      <span className="font-mono">{it.size}</span>
                      <span>·</span>
                      <span className="font-mono text-primary">{it.ver}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    下载
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
