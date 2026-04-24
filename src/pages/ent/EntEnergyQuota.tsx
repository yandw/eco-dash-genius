import { Gauge, Save, Send, AlertTriangle } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const products = [
  { name: "高强度聚酯切片", unit: "t", quota: 0.082, actual: 0.078, output: 12500 },
  { name: "工业级PET", unit: "t", quota: 0.095, actual: 0.102, output: 8600 },
  { name: "改性纤维", unit: "t", quota: 0.110, actual: 0.105, output: 4200 },
  { name: "BOPET薄膜", unit: "t", quota: 0.125, actual: 0.128, output: 2150 },
];

export default function EntEnergyQuota() {
  return (
    <AppLayout
      side="ent"
      title="限额报告填报"
      subtitle="单位产品能耗限额执行情况季度报送 · 2025年Q2"
    >
      {/* 期次选择 */}
      <div className="panel p-5 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">报送期次</span>
          </div>
          <Select defaultValue="2025q2">
            <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2025q2">2025年 第二季度</SelectItem>
              <SelectItem value="2025q1">2025年 第一季度</SelectItem>
              <SelectItem value="2024q4">2024年 第四季度</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-warning/15 text-warning border-warning/30 border">未提交</Badge>
          <span className="text-xs text-muted-foreground ml-auto">
            截止时间：<span className="font-mono text-destructive">2025-04-30 18:00</span>
          </span>
        </div>
      </div>

      {/* 限额对比图 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {products.map((p) => {
          const exceeded = p.actual > p.quota;
          const ratio = (p.actual / p.quota) * 100;
          return (
            <div key={p.name} className="panel p-4">
              <div className="text-xs text-muted-foreground mb-1.5">{p.name}</div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className={`text-2xl font-bold font-mono ${exceeded ? "text-destructive" : "text-success"}`}>
                  {p.actual}
                </span>
                <span className="text-xs text-muted-foreground">tce/{p.unit}</span>
              </div>
              <div className="text-[11px] text-muted-foreground mb-2">
                限额 <span className="font-mono">{p.quota}</span> · 完成度 {ratio.toFixed(0)}%
              </div>
              <Progress value={Math.min(ratio, 100)} className={`h-1.5 ${exceeded ? "[&>div]:bg-destructive" : ""}`} />
              {exceeded && (
                <div className="flex items-center gap-1 mt-2 text-[11px] text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  超限 {((ratio - 100)).toFixed(1)}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 限额数据表 */}
      <div className="panel p-5">
        <h3 className="text-base font-semibold mb-4">单位产品能耗限额填报</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>产品名称</TableHead>
              <TableHead>计量单位</TableHead>
              <TableHead className="text-right">限额值(tce/单位)</TableHead>
              <TableHead className="text-right">实际能耗(tce/单位)</TableHead>
              <TableHead className="text-right">本期产量</TableHead>
              <TableHead>执行状态</TableHead>
              <TableHead>说明</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const exceeded = p.actual > p.quota;
              return (
                <TableRow key={p.name}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.unit}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{p.quota}</TableCell>
                  <TableCell className="text-right">
                    <Input defaultValue={p.actual} className="h-8 text-right font-mono w-28 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input defaultValue={p.output} className="h-8 text-right font-mono w-28 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        exceeded
                          ? "bg-destructive/15 text-destructive border-destructive/30 border"
                          : "bg-success/15 text-success border-success/30 border"
                      }
                    >
                      {exceeded ? "超限" : "达标"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Input placeholder={exceeded ? "请说明超限原因" : "—"} className="h-8 text-xs" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-6 pt-5 border-t border-border/60">
          <span className="text-xs text-muted-foreground">
            填报数据将同步至市级能耗在线监测平台，请确保数据真实准确。
          </span>
          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="h-3.5 w-3.5 mr-1.5" />
              暂存
            </Button>
            <Button className="bg-gradient-primary text-primary-foreground border-0">
              <Send className="h-3.5 w-3.5 mr-1.5" />
              提交审核
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
