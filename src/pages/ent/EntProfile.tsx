import { Building2, Save, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EntProfile() {
  return (
    <AppLayout side="ent" title="企业设置" subtitle="维护企业基础信息、用能边界与联系人">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="boundary">用能边界</TabsTrigger>
          <TabsTrigger value="contact">联系人</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="panel p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-base font-semibold">上海某某新材料股份有限公司</div>
                <div className="text-xs text-muted-foreground">重点用能企业 · 化工行业</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "企业名称", value: "上海某某新材料股份有限公司" },
                { label: "统一社会信用代码", value: "91310000XXXXXXX123" },
                { label: "法定代表人", value: "李XX" },
                { label: "成立日期", value: "2008-06-15" },
                { label: "所属行业", value: "化工原料制造（C26）" },
                { label: "企业规模", value: "大型企业" },
                { label: "所在区县", value: "上海市浦东新区" },
                { label: "注册地址", value: "上海市浦东新区张江高科技园区XX路XX号" },
              ].map((f) => (
                <div key={f.label} className="space-y-2">
                  <Label>{f.label}</Label>
                  <Input defaultValue={f.value} />
                </div>
              ))}
              <div className="space-y-2 md:col-span-2">
                <Label>经营范围</Label>
                <Textarea rows={3} defaultValue="新材料技术开发、生产、销售；高性能聚酯材料及其制品的研发与制造..." />
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-5 border-t border-border/60">
              <Button className="bg-gradient-primary text-primary-foreground border-0">
                <Save className="h-3.5 w-3.5 mr-1.5" />
                保存修改
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="boundary">
          <div className="panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">用能边界 / 厂区清单</h3>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0">
                <Plus className="h-3.5 w-3.5 mr-1" /> 新增厂区
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>厂区编码</TableHead>
                  <TableHead>厂区名称</TableHead>
                  <TableHead>地址</TableHead>
                  <TableHead>占地(亩)</TableHead>
                  <TableHead>主要工序</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["P-001", "张江总部基地", "浦东新区张江XX路", "120", "聚合 / 切片"],
                  ["P-002", "金山生产基地", "金山区化工区XX路", "350", "聚酯反应 / 改性"],
                  ["P-003", "奉贤研发中心", "奉贤区临港XX路", "80", "实验 / 中试"],
                ].map((r) => (
                  <TableRow key={r[0]}>
                    <TableCell className="font-mono text-xs">{r[0]}</TableCell>
                    <TableCell className="font-medium">{r[1]}</TableCell>
                    <TableCell className="text-muted-foreground">{r[2]}</TableCell>
                    <TableCell className="font-mono">{r[3]}</TableCell>
                    <TableCell>{r[4]}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary">编辑</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">能源管理联系人</h3>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0">
                <Plus className="h-3.5 w-3.5 mr-1" /> 新增联系人
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>职务</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["王XX", "能源管理部经理", "13800138001", "wang@example.com", "主要负责人"],
                  ["张XX", "节能工程师", "13800138002", "zhang@example.com", "数据填报员"],
                  ["李XX", "环保专员", "13800138003", "li@example.com", "数据复核员"],
                ].map((r) => (
                  <TableRow key={r[0]}>
                    <TableCell className="font-medium">{r[0]}</TableCell>
                    <TableCell>{r[1]}</TableCell>
                    <TableCell className="font-mono text-xs">{r[2]}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{r[3]}</TableCell>
                    <TableCell>{r[4]}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary">编辑</Button>
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
