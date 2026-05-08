import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function EntDraft() {
  // 泳道布局参数
  const W = 1180;
  const laneLabelW = 140;
  const lanes = [
    { title: "政府侧", sub: "市级管理员", h: 140, color: "primary" },
    { title: "企业侧", sub: "填报企业", h: 130, color: "success" },
    { title: "政府侧", sub: "区级 / 中心对口人 / 市级管理员", h: 220, color: "primary" },
  ];
  const laneYs: number[] = [];
  let acc = 40; // top padding
  lanes.forEach((l) => {
    laneYs.push(acc);
    acc += l.h;
  });
  const H = acc + 20;

  // helpers
  const contentX = laneLabelW + 24;

  return (
    <AppLayout side="ent" title="草稿区" subtitle="业务流程草图与评审用图">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">草稿区</h1>
          <p className="text-sm text-muted-foreground mt-1">
            业务流程草图与评审用图（仅供内部评审参考，不参与正式业务）
          </p>
        </div>

        <Tabs defaultValue="goal-decomp" className="w-full">
          <TabsList>
            <TabsTrigger value="goal-decomp">目标分解流程图</TabsTrigger>
            <TabsTrigger value="assess-flow">能耗考核流程图</TabsTrigger>
          </TabsList>
          <TabsContent value="goal-decomp" className="mt-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-primary rounded-sm" />
            <h2 className="text-base font-medium text-foreground">
              双控考核 - 目标分解 业务流程图（泳道图）
            </h2>
          </div>

          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              width="100%"
              style={{ minWidth: 980 }}
              className="text-foreground"
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--foreground) / 0.55)" />
                </marker>
              </defs>

              {/* 泳道背景与分隔 */}
              {lanes.map((l, i) => {
                const y = laneYs[i];
                return (
                  <g key={i}>
                    <rect
                      x={0}
                      y={y}
                      width={laneLabelW}
                      height={l.h}
                      fill="hsl(var(--muted) / 0.5)"
                    />
                    <rect
                      x={laneLabelW}
                      y={y}
                      width={W - laneLabelW}
                      height={l.h}
                      fill={
                        i === 1
                          ? "hsl(var(--success) / 0.04)"
                          : "hsl(var(--primary) / 0.04)"
                      }
                    />
                    <line
                      x1={0}
                      y1={y}
                      x2={W}
                      y2={y}
                      stroke="hsl(var(--border))"
                      strokeWidth={1}
                    />
                    {/* 角色标签（竖排显示更紧凑，这里用两行） */}
                    <text
                      x={laneLabelW / 2}
                      y={y + l.h / 2 - 8}
                      textAnchor="middle"
                      className="fill-foreground"
                      style={{ fontSize: 16, fontWeight: 600 }}
                    >
                      {l.title}
                    </text>
                    <text
                      x={laneLabelW / 2}
                      y={y + l.h / 2 + 12}
                      textAnchor="middle"
                      className="fill-muted-foreground"
                      style={{ fontSize: 13 }}
                    >
                      {l.sub}
                    </text>
                  </g>
                );
              })}
              {/* 底部分隔 */}
              <line x1={0} y1={H - 20} x2={W} y2={H - 20} stroke="hsl(var(--border))" />
              {/* 左侧标签列右边界 */}
              <line
                x1={laneLabelW}
                y1={0}
                x2={laneLabelW}
                y2={H}
                stroke="hsl(var(--border))"
              />

              {/* === Lane 1: 市级管理员创建任务 === */}
              {/* 起点圆 */}
              <circle
                cx={contentX + 24}
                cy={laneYs[0] + 70}
                r={14}
                fill="hsl(var(--primary))"
              />
              <text
                x={contentX + 24}
                y={laneYs[0] + 74}
                textAnchor="middle"
                fill="white"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                开始
              </text>

              {/* 创建任务节点 */}
              <g>
                <rect
                  x={contentX + 80}
                  y={laneYs[0] + 30}
                  width={260}
                  height={80}
                  rx={8}
                  fill="hsl(var(--primary) / 0.06)"
                  stroke="hsl(var(--primary) / 0.5)"
                />
                <text
                  x={contentX + 80 + 130}
                  y={laneYs[0] + 54}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 15, fontWeight: 600 }}
                >
                  市级管理员创建考核任务
                </text>
                <text
                  x={contentX + 80 + 130}
                  y={laneYs[0] + 76}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 13 }}
                >
                  设置考核年度、范围、截止时间等
                </text>
                <text
                  x={contentX + 80 + 130}
                  y={laneYs[0] + 94}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 13 }}
                >
                  发布任务并下发
                </text>
              </g>
              <line
                x1={contentX + 38}
                y1={laneYs[0] + 70}
                x2={contentX + 80}
                y2={laneYs[0] + 70}
                stroke="hsl(var(--foreground) / 0.55)"
                markerEnd="url(#arrow)"
              />

              {/* 两类任务分支 */}
              <g>
                <rect
                  x={contentX + 380}
                  y={laneYs[0] + 14}
                  width={340}
                  height={48}
                  rx={6}
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--primary) / 0.4)"
                />
                <text
                  x={contentX + 380 + 170}
                  y={laneYs[0] + 42}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 14 }}
                >
                  任务①：区下属单位碳排放目标分解
                </text>

                <rect
                  x={contentX + 380}
                  y={laneYs[0] + 78}
                  width={340}
                  height={48}
                  rx={6}
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--primary) / 0.4)"
                />
                <text
                  x={contentX + 380 + 170}
                  y={laneYs[0] + 106}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 14 }}
                >
                  任务②：&ldquo;百家&rdquo;&ldquo;千家&rdquo;、通信业企业目标分解
                </text>
              </g>
              <line
                x1={contentX + 340}
                y1={laneYs[0] + 70}
                x2={contentX + 380}
                y2={laneYs[0] + 38}
                stroke="hsl(var(--foreground) / 0.55)"
                markerEnd="url(#arrow)"
              />
              <line
                x1={contentX + 340}
                y1={laneYs[0] + 70}
                x2={contentX + 380}
                y2={laneYs[0] + 102}
                stroke="hsl(var(--foreground) / 0.55)"
                markerEnd="url(#arrow)"
              />

              {/* 跨泳道：任务下发 → 企业 */}
              <line
                x1={contentX + 550}
                y1={laneYs[0] + 126}
                x2={contentX + 550}
                y2={laneYs[1] + 30}
                stroke="hsl(var(--foreground) / 0.55)"
                strokeDasharray="4 3"
                markerEnd="url(#arrow)"
              />
              <text
                x={contentX + 558}
                y={laneYs[1] + 8}
                className="fill-muted-foreground"
                style={{ fontSize: 13 }}
              >
                任务下发
              </text>

              {/* === Lane 2: 企业填报 === */}
              <g>
                <rect
                  x={contentX + 80}
                  y={laneYs[1] + 30}
                  width={240}
                  height={70}
                  rx={8}
                  fill="hsl(var(--success) / 0.08)"
                  stroke="hsl(var(--success) / 0.5)"
                />
                <text
                  x={contentX + 200}
                  y={laneYs[1] + 56}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 15, fontWeight: 600 }}
                >
                  企业接收任务
                </text>
                <text
                  x={contentX + 200}
                  y={laneYs[1] + 78}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 13 }}
                >
                  在企业侧打开目标分解任务
                </text>
              </g>

              <line
                x1={contentX + 320}
                y1={laneYs[1] + 65}
                x2={contentX + 380}
                y2={laneYs[1] + 65}
                stroke="hsl(var(--foreground) / 0.55)"
                markerEnd="url(#arrow)"
              />

              <g>
                <rect
                  x={contentX + 380}
                  y={laneYs[1] + 30}
                  width={240}
                  height={70}
                  rx={8}
                  fill="hsl(var(--success) / 0.08)"
                  stroke="hsl(var(--success) / 0.5)"
                />
                <text
                  x={contentX + 500}
                  y={laneYs[1] + 56}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 15, fontWeight: 600 }}
                >
                  填报碳排放目标值
                </text>
                <text
                  x={contentX + 500}
                  y={laneYs[1] + 78}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 13 }}
                >
                  录入总量 / 强度等目标数据
                </text>
              </g>

              <line
                x1={contentX + 620}
                y1={laneYs[1] + 65}
                x2={contentX + 680}
                y2={laneYs[1] + 65}
                stroke="hsl(var(--foreground) / 0.55)"
                markerEnd="url(#arrow)"
              />

              <g>
                <rect
                  x={contentX + 680}
                  y={laneYs[1] + 35}
                  width={140}
                  height={60}
                  rx={30}
                  fill="hsl(var(--success))"
                />
                <text
                  x={contentX + 750}
                  y={laneYs[1] + 70}
                  textAnchor="middle"
                  fill="white"
                  style={{ fontSize: 15, fontWeight: 600 }}
                >
                  点击提交
                </text>
              </g>

              {/* 跨泳道：数据汇总 → 政府侧 */}
              <line
                x1={contentX + 750}
                y1={laneYs[1] + 95}
                x2={contentX + 750}
                y2={laneYs[2] + 20}
                stroke="hsl(var(--foreground) / 0.55)"
                strokeDasharray="4 3"
                markerEnd="url(#arrow)"
              />
              <text
                x={contentX + 758}
                y={laneYs[2] - 4}
                className="fill-muted-foreground"
                style={{ fontSize: 13 }}
              >
                数据汇总
              </text>

              {/* === Lane 3: 政府侧 三类账号查看/修改 === */}
              {/* 汇总枢纽 */}
              <g>
                <rect
                  x={contentX + 660}
                  y={laneYs[2] + 20}
                  width={180}
                  height={48}
                  rx={8}
                  fill="hsl(var(--primary) / 0.1)"
                  stroke="hsl(var(--primary) / 0.5)"
                />
                <text
                  x={contentX + 750}
                  y={laneYs[2] + 49}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  企业填报数据汇总
                </text>
              </g>

              {/* 三个分支节点 */}
              {(() => {
                const cardW = 280;
                const cardH = 110;
                const cardY = laneYs[2] + 90;
                const xs = [contentX + 20, contentX + 320, contentX + 620];
                const items = [
                  {
                    title: "区级管理员",
                    desc1: "汇总：本区下所有企业填报数据",
                    desc2: "权限：可查看 / 修改本区企业目标值",
                  },
                  {
                    title: "市级中心对口人",
                    desc1: "汇总：所对口企业的填报数据",
                    desc2: "权限：可查看 / 修改对口企业目标值",
                  },
                  {
                    title: "市级管理员",
                    desc1: "汇总：全市所有企业的填报数据",
                    desc2: "权限：可查看 / 修改全市企业目标值",
                  },
                ];
                return (
                  <>
                    {items.map((it, i) => {
                      const x = xs[i];
                      return (
                        <g key={i}>
                          {/* 连线：从汇总枢纽到每个分支 */}
                          <line
                            x1={contentX + 750}
                            y1={laneYs[2] + 68}
                            x2={x + cardW / 2}
                            y2={cardY}
                            stroke="hsl(var(--foreground) / 0.55)"
                            markerEnd="url(#arrow)"
                          />
                          <rect
                            x={x}
                            y={cardY}
                            width={cardW}
                            height={cardH}
                            rx={8}
                            fill="hsl(var(--primary) / 0.06)"
                            stroke="hsl(var(--primary) / 0.5)"
                          />
                          <text
                            x={x + cardW / 2}
                            y={cardY + 28}
                            textAnchor="middle"
                            className="fill-foreground"
                            style={{ fontSize: 15, fontWeight: 600 }}
                          >
                            {it.title}
                          </text>
                          <text
                            x={x + cardW / 2}
                            y={cardY + 58}
                            textAnchor="middle"
                            className="fill-muted-foreground"
                            style={{ fontSize: 13 }}
                          >
                            {it.desc1}
                          </text>
                          <text
                            x={x + cardW / 2}
                            y={cardY + 82}
                            textAnchor="middle"
                            className="fill-muted-foreground"
                            style={{ fontSize: 13 }}
                          >
                            {it.desc2}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
              <div className="font-medium text-foreground mb-1">区级管理员</div>
              <div className="text-muted-foreground">
                数据范围：本区下所有企业；可在区级账户中查看并修改企业填报的目标值。
              </div>
            </div>
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
              <div className="font-medium text-foreground mb-1">市级中心对口人</div>
              <div className="text-muted-foreground">
                数据范围：仅本人对口的企业；可查看并修改其对口企业的目标值。
              </div>
            </div>
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
              <div className="font-medium text-foreground mb-1">市级管理员</div>
              <div className="text-muted-foreground">
                数据范围：全市所有企业；可查看并修改全市任意企业的目标值，拥有最高权限。
              </div>
            </div>
          </div>
        </Card>
          </TabsContent>

          <TabsContent value="assess-flow" className="mt-4 space-y-4">
            {/* ========== 子图 A：区管企业（类型A） ========== */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1 h-4 bg-primary rounded-sm" />
                <h2 className="text-base font-medium text-foreground">
                  能耗考核流程图 · 类型A — 区下属单位（区管企业）
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4 ml-3">
                数据来源：年度能源利用状况报告自动提取，企业无需填写。政府侧三类账号均可修改实际值与考核结果。
              </p>

              <div className="overflow-x-auto">
                <svg viewBox="0 0 1180 360" width="100%" style={{ minWidth: 980 }} className="text-foreground">
                  <defs>
                    <marker id="arrow-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--foreground) / 0.55)" />
                    </marker>
                    <marker id="arrow-a-primary" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--primary))" />
                    </marker>
                  </defs>

                  {/* 泳道 */}
                  {[
                    { y: 40, h: 120, title: "企业侧", sub: "区管企业", tone: "success" },
                    { y: 160, h: 180, title: "政府侧", sub: "区负责人 / 中心对口人 / 市级管理员", tone: "primary" },
                  ].map((l, i) => (
                    <g key={i}>
                      <rect x={0} y={l.y} width={140} height={l.h} fill="hsl(var(--muted) / 0.5)" />
                      <rect x={140} y={l.y} width={1040} height={l.h}
                        fill={l.tone === "success" ? "hsl(var(--success) / 0.04)" : "hsl(var(--primary) / 0.04)"} />
                      <line x1={0} y1={l.y} x2={1180} y2={l.y} stroke="hsl(var(--border))" />
                      <text x={70} y={l.y + l.h / 2 - 8} textAnchor="middle" className="fill-foreground" style={{ fontSize: 16, fontWeight: 600 }}>{l.title}</text>
                      <text x={70} y={l.y + l.h / 2 + 12} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 12 }}>{l.sub}</text>
                    </g>
                  ))}
                  <line x1={0} y1={340} x2={1180} y2={340} stroke="hsl(var(--border))" />
                  <line x1={140} y1={0} x2={140} y2={360} stroke="hsl(var(--border))" />

                  {/* 企业侧：年报自动提取 */}
                  <g>
                    <rect x={200} y={70} width={300} height={70} rx={8}
                      fill="hsl(var(--muted) / 0.6)" stroke="hsl(var(--border))" strokeDasharray="5 4" />
                    <text x={350} y={98} textAnchor="middle" className="fill-foreground" style={{ fontSize: 15, fontWeight: 600 }}>
                      年报自动提取数值
                    </text>
                    <text x={350} y={120} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 13 }}>
                      企业无需填写
                    </text>
                  </g>

                  {/* 系统汇总箭头 */}
                  <line x1={500} y1={105} x2={620} y2={105} stroke="hsl(var(--foreground) / 0.55)" markerEnd="url(#arrow-a)" />
                  <text x={560} y={96} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 12 }}>系统汇总</text>

                  {/* 汇总枢纽 */}
                  <rect x={620} y={75} width={160} height={60} rx={8}
                    fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.5)" />
                  <text x={700} y={110} textAnchor="middle" className="fill-foreground" style={{ fontSize: 14, fontWeight: 600 }}>
                    数据汇总至政府侧
                  </text>

                  {/* 汇总 → 政府泳道 */}
                  <line x1={700} y1={135} x2={700} y2={185} stroke="hsl(var(--foreground) / 0.55)" strokeDasharray="4 3" markerEnd="url(#arrow-a)" />

                  {/* 政府侧三类账号 */}
                  {[
                    { x: 180, title: "区负责人" },
                    { x: 470, title: "市级中心对口人" },
                    { x: 760, title: "市级管理员" },
                  ].map((it, i) => (
                    <g key={i}>
                      <rect x={it.x} y={200} width={250} height={110} rx={8}
                        fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.5)" />
                      <text x={it.x + 125} y={228} textAnchor="middle" className="fill-foreground" style={{ fontSize: 15, fontWeight: 600 }}>
                        {it.title}
                      </text>
                      <text x={it.x + 125} y={254} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 13 }}>
                        修改实际值 + 考核结果
                      </text>
                      <text x={it.x + 125} y={278} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 13 }}>
                        点击「提交」
                      </text>
                      <line x1={700} y1={185} x2={it.x + 125} y2={200} stroke="hsl(var(--foreground) / 0.4)" markerEnd="url(#arrow-a)" />
                    </g>
                  ))}

                  {/* 结果同步回企业侧 */}
                  <path d="M 1050 255 L 1130 255 L 1130 105 L 800 105"
                    fill="none" stroke="hsl(var(--primary))" strokeDasharray="5 4" markerEnd="url(#arrow-a-primary)" />
                  <text x={1125} y={185} textAnchor="end" className="fill-primary" style={{ fontSize: 12, fontWeight: 600 }}>
                    结果同步显示
                  </text>
                </svg>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                  <div className="font-medium text-foreground mb-1">区负责人</div>
                  <div className="text-muted-foreground">范围：本区下所有企业；可修改实际值与考核结果，提交后同步到企业侧。</div>
                </div>
                <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                  <div className="font-medium text-foreground mb-1">市级中心对口人</div>
                  <div className="text-muted-foreground">范围：所对口企业；可修改实际值与考核结果，提交后同步到企业侧。</div>
                </div>
                <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                  <div className="font-medium text-foreground mb-1">市级管理员</div>
                  <div className="text-muted-foreground">范围：全市所有企业；可修改实际值与考核结果，拥有最高权限。</div>
                </div>
              </div>
            </Card>

            {/* ========== 子图 B：市管企业（类型B） ========== */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1 h-4 bg-primary rounded-sm" />
                <h2 className="text-base font-medium text-foreground">
                  能耗考核流程图 · 类型B — &ldquo;百家&rdquo;&ldquo;千家&rdquo;、通信业企业（市管企业）
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4 ml-3">
                企业自评后提交，市级中心对口人 / 市级管理员可退回重填或填写考评分并保存，结果同步至企业侧。
              </p>

              <div className="overflow-x-auto">
                <svg viewBox="0 0 1180 460" width="100%" style={{ minWidth: 980 }} className="text-foreground">
                  <defs>
                    <marker id="arrow-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--foreground) / 0.55)" />
                    </marker>
                    <marker id="arrow-b-primary" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--primary))" />
                    </marker>
                    <marker id="arrow-b-danger" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--destructive))" />
                    </marker>
                  </defs>

                  {/* 泳道 */}
                  {[
                    { y: 30, h: 130, title: "企业侧", sub: "市管企业", tone: "success" },
                    { y: 160, h: 140, title: "政府侧", sub: "市级中心对口人", tone: "primary" },
                    { y: 300, h: 140, title: "政府侧", sub: "市级管理员", tone: "primary" },
                  ].map((l, i) => (
                    <g key={i}>
                      <rect x={0} y={l.y} width={140} height={l.h} fill="hsl(var(--muted) / 0.5)" />
                      <rect x={140} y={l.y} width={1040} height={l.h}
                        fill={l.tone === "success" ? "hsl(var(--success) / 0.04)" : "hsl(var(--primary) / 0.04)"} />
                      <line x1={0} y1={l.y} x2={1180} y2={l.y} stroke="hsl(var(--border))" />
                      <text x={70} y={l.y + l.h / 2 - 8} textAnchor="middle" className="fill-foreground" style={{ fontSize: 16, fontWeight: 600 }}>{l.title}</text>
                      <text x={70} y={l.y + l.h / 2 + 12} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 12 }}>{l.sub}</text>
                    </g>
                  ))}
                  <line x1={0} y1={440} x2={1180} y2={440} stroke="hsl(var(--border))" />
                  <line x1={140} y1={0} x2={140} y2={460} stroke="hsl(var(--border))" />

                  {/* 企业侧：填写 → 提交 */}
                  <g>
                    <rect x={180} y={60} width={310} height={80} rx={8}
                      fill="hsl(var(--success) / 0.08)" stroke="hsl(var(--success) / 0.5)" />
                    <text x={335} y={86} textAnchor="middle" className="fill-foreground" style={{ fontSize: 15, fontWeight: 600 }}>
                      填写自评分 / 评分依据
                    </text>
                    <text x={335} y={108} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 13 }}>
                      上传证明材料
                    </text>
                  </g>
                  <line x1={490} y1={100} x2={540} y2={100} stroke="hsl(var(--foreground) / 0.55)" markerEnd="url(#arrow-b)" />
                  <g>
                    <rect x={540} y={70} width={140} height={60} rx={30} fill="hsl(var(--success))" />
                    <text x={610} y={105} textAnchor="middle" fill="white" style={{ fontSize: 15, fontWeight: 600 }}>点击提交</text>
                  </g>

                  {/* 企业侧：考评结果展示 */}
                  <g>
                    <rect x={900} y={60} width={240} height={80} rx={8}
                      fill="hsl(var(--success) / 0.08)" stroke="hsl(var(--success) / 0.5)" strokeDasharray="4 3" />
                    <text x={1020} y={88} textAnchor="middle" className="fill-foreground" style={{ fontSize: 14, fontWeight: 600 }}>
                      考评结果展示
                    </text>
                    <text x={1020} y={110} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 12 }}>
                      由政府侧保存后同步
                    </text>
                  </g>

                  {/* 提交 → 两个政府泳道 */}
                  <path d="M 610 130 L 610 230" fill="none" stroke="hsl(var(--foreground) / 0.55)" strokeDasharray="4 3" markerEnd="url(#arrow-b)" />
                  <path d="M 610 130 L 610 200 L 360 200 L 360 370" fill="none" stroke="hsl(var(--foreground) / 0.55)" strokeDasharray="4 3" markerEnd="url(#arrow-b)" />

                  {/* 政府泳道：两段对称结构 */}
                  {[
                    { y: 200, label: "市级中心对口人" },
                    { y: 340, label: "市级管理员" },
                  ].map((row, i) => (
                    <g key={i}>
                      {/* 接收 */}
                      <rect x={300} y={row.y + 30} width={140} height={50} rx={8}
                        fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.5)" />
                      <text x={370} y={row.y + 60} textAnchor="middle" className="fill-foreground" style={{ fontSize: 14, fontWeight: 600 }}>
                        收到企业提交
                      </text>

                      {/* 退回重填 */}
                      <line x1={440} y1={row.y + 45} x2={510} y2={row.y + 25} stroke="hsl(var(--destructive))" markerEnd="url(#arrow-b-danger)" />
                      <rect x={510} y={row.y + 5} width={170} height={40} rx={8}
                        fill="hsl(var(--destructive) / 0.08)" stroke="hsl(var(--destructive) / 0.5)" />
                      <text x={595} y={row.y + 30} textAnchor="middle" className="fill-destructive" style={{ fontSize: 13, fontWeight: 600 }}>
                        点击「退回重填」
                      </text>

                      {/* 填写考评分 */}
                      <line x1={440} y1={row.y + 65} x2={510} y2={row.y + 85} stroke="hsl(var(--foreground) / 0.55)" markerEnd="url(#arrow-b)" />
                      <rect x={510} y={row.y + 65} width={220} height={50} rx={8}
                        fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.5)" />
                      <text x={620} y={row.y + 95} textAnchor="middle" className="fill-foreground" style={{ fontSize: 13, fontWeight: 600 }}>
                        填写考评分 + 评分依据
                      </text>

                      {/* 保存 */}
                      <line x1={730} y1={row.y + 90} x2={780} y2={row.y + 90} stroke="hsl(var(--foreground) / 0.55)" markerEnd="url(#arrow-b)" />
                      <rect x={780} y={row.y + 70} width={110} height={45} rx={22} fill="hsl(var(--primary))" />
                      <text x={835} y={row.y + 97} textAnchor="middle" fill="white" style={{ fontSize: 14, fontWeight: 600 }}>保存</text>
                    </g>
                  ))}

                  {/* 退回 → 企业侧填写 */}
                  <path d="M 595 205 L 595 170 L 335 170 L 335 140" fill="none" stroke="hsl(var(--destructive))" strokeDasharray="5 4" markerEnd="url(#arrow-b-danger)" />
                  <text x={340} y={162} className="fill-destructive" style={{ fontSize: 12, fontWeight: 600 }}>退回 → 企业重填</text>

                  {/* 保存 → 同步企业（中心对口人） */}
                  <path d="M 890 290 L 1020 290 L 1020 140" fill="none" stroke="hsl(var(--primary))" strokeDasharray="5 4" markerEnd="url(#arrow-b-primary)" />
                  {/* 保存 → 同步企业（市级管理员） */}
                  <path d="M 890 430 L 1150 430 L 1150 100 L 1140 100" fill="none" stroke="hsl(var(--primary))" strokeDasharray="5 4" markerEnd="url(#arrow-b-primary)" />
                  <text x={1145} y={235} textAnchor="end" className="fill-primary" style={{ fontSize: 12, fontWeight: 600 }}>
                    保存后同步至企业侧
                  </text>
                </svg>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="rounded-md border border-success/30 bg-success/5 p-3">
                  <div className="font-medium text-foreground mb-1">企业侧（市管企业）</div>
                  <div className="text-muted-foreground">填写自评分、评分依据，上传证明材料后提交；可在结果区查看政府侧反馈或被退回后重新填写。</div>
                </div>
                <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                  <div className="font-medium text-foreground mb-1">市级中心对口人</div>
                  <div className="text-muted-foreground">收到企业提交后，可退回重填，或填写考评分 + 评分依据后保存，结果同步企业。</div>
                </div>
                <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                  <div className="font-medium text-foreground mb-1">市级管理员</div>
                  <div className="text-muted-foreground">权限同上，且作用范围覆盖全市，可对任意市管企业进行退回或保存考评。</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
