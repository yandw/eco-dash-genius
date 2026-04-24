import { useState } from "react";
import { CalendarRange, Save, Send, FileText, CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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

const history = [
  { year: "2024", submitTime: "2025-01-15", status: "已通过", reviewer: "市经信委 · 王XX" },
  { year: "2023", submitTime: "2024-01-20", status: "已通过", reviewer: "市经信委 · 李XX" },
  { year: "2022", submitTime: "2023-02-08", status: "已通过", reviewer: "市经信委 · 张XX" },
];

const steps = ["企业基本信息", "能源消耗数据", "节能措施成效", "下年度计划", "提交审核"];

export default function EntReportYearly() {
  const [step, setStep] = useState(1);

  return (
    <AppLayout
      side="ent"
      title="年度报告填报"
      subtitle="2025 年度节能降碳工作报告 · 截止日期 2025-05-31"
    >
      <Tabs defaultValue="fill" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fill">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            当期填报
          </TabsTrigger>
          <TabsTrigger value="history">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            历史报告
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fill" className="space-y-4">
          {/* 进度步骤 */}
          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-2">
              <CalendarRange className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">填报进度</span>
              <Badge className="ml-auto bg-warning/15 text-warning border-warning/30 border">草稿</Badge>
            </div>
            <div className="flex items-center justify-between mt-4">
              {steps.map((s, i) => {
                const idx = i + 1;
                const active = idx === step;
                const done = idx < step;
                return (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <button
                      onClick={() => setStep(idx)}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                          active
                            ? "bg-primary text-primary-foreground border-primary shadow-glow"
                            : done
                            ? "bg-success text-success-foreground border-success"
                            : "bg-card text-muted-foreground border-border"
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : idx}
                      </div>
                      <span
                        className={`text-[11px] ${
                          active ? "text-primary font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {s}
                      </span>
                    </button>
                    {i < steps.length - 1 && (
                      <div
                        className={`flex-1 h-px mx-2 ${
                          done ? "bg-success" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 表单区 */}
          <div className="panel p-6">
            <h3 className="text-base font-semibold mb-5">{steps[step - 1]}</h3>

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>企业名称</Label>
                  <Input defaultValue="上海某某新材料股份有限公司" />
                </div>
                <div className="space-y-2">
                  <Label>统一社会信用代码</Label>
                  <Input defaultValue="91310000XXXXXXX123" />
                </div>
                <div className="space-y-2">
                  <Label>所属行业</Label>
                  <Select defaultValue="chemical">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chemical">化工原料制造</SelectItem>
                      <SelectItem value="steel">钢铁冶炼</SelectItem>
                      <SelectItem value="textile">纺织业</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>报告期</Label>
                  <Input defaultValue="2025-01-01 至 2025-12-31" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>企业概况</Label>
                  <Textarea rows={4} placeholder="请简要描述本年度主营业务、产能规模、用能边界等..." />
                </div>
              </div>
            )}

            {step === 2 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>能源品种</TableHead>
                    <TableHead className="text-right">实物消耗量</TableHead>
                    <TableHead>计量单位</TableHead>
                    <TableHead className="text-right">折标系数</TableHead>
                    <TableHead className="text-right">折标煤(tce)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["电力（外购）", "12,580,000", "kWh", "0.1229", "1,546.05"],
                    ["天然气", "3,260,000", "m³", "1.330", "4,335.80"],
                    ["蒸汽", "82,000", "t", "0.108", "8,856.00"],
                    ["原煤", "1,200", "t", "0.7143", "857.16"],
                  ].map((row) => (
                    <TableRow key={row[0]}>
                      <TableCell className="font-medium">{row[0]}</TableCell>
                      <TableCell className="text-right font-mono">
                        <Input defaultValue={row[1]} className="h-8 text-right" />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row[2]}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">{row[3]}</TableCell>
                      <TableCell className="text-right font-mono text-primary font-semibold">{row[4]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {step >= 3 && (
              <div className="text-sm text-muted-foreground py-12 text-center border border-dashed border-border rounded-lg">
                {steps[step - 1]} · 表单字段建设中
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-border/60">
              <Button
                variant="outline"
                disabled={step === 1}
                onClick={() => setStep((s) => Math.max(1, s - 1))}
              >
                上一步
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  暂存草稿
                </Button>
                {step < steps.length ? (
                  <Button
                    className="bg-gradient-primary text-primary-foreground border-0"
                    onClick={() => setStep((s) => Math.min(steps.length, s + 1))}
                  >
                    下一步
                  </Button>
                ) : (
                  <Button className="bg-gradient-primary text-primary-foreground border-0">
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    提交审核
                  </Button>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="panel p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>报告年度</TableHead>
                  <TableHead>提交时间</TableHead>
                  <TableHead>审核状态</TableHead>
                  <TableHead>审核人</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((h) => (
                  <TableRow key={h.year}>
                    <TableCell className="font-medium">{h.year} 年度报告</TableCell>
                    <TableCell className="font-mono text-muted-foreground">{h.submitTime}</TableCell>
                    <TableCell>
                      <Badge className="bg-success/15 text-success border-success/30 border">
                        {h.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{h.reviewer}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary">查看</Button>
                      <Button variant="ghost" size="sm" className="text-primary">下载</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
