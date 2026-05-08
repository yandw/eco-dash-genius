import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";

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
    <AppLayout side="ent">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">草稿区</h1>
          <p className="text-sm text-muted-foreground mt-1">
            业务流程草图与评审用图（仅供内部评审参考，不参与正式业务）
          </p>
        </div>

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
                      style={{ fontSize: 14, fontWeight: 600 }}
                    >
                      {l.title}
                    </text>
                    <text
                      x={laneLabelW / 2}
                      y={y + l.h / 2 + 12}
                      textAnchor="middle"
                      className="fill-muted-foreground"
                      style={{ fontSize: 11 }}
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
                style={{ fontSize: 11, fontWeight: 600 }}
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
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  市级管理员创建考核任务
                </text>
                <text
                  x={contentX + 80 + 130}
                  y={laneYs[0] + 76}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 11 }}
                >
                  设置考核年度、范围、截止时间等
                </text>
                <text
                  x={contentX + 80 + 130}
                  y={laneYs[0] + 94}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 11 }}
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
                  style={{ fontSize: 12 }}
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
                  style={{ fontSize: 12 }}
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
                style={{ fontSize: 11 }}
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
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  企业接收任务
                </text>
                <text
                  x={contentX + 200}
                  y={laneYs[1] + 78}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 11 }}
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
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  填报碳排放目标值
                </text>
                <text
                  x={contentX + 500}
                  y={laneYs[1] + 78}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 11 }}
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
                  style={{ fontSize: 13, fontWeight: 600 }}
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
                style={{ fontSize: 11 }}
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
                  style={{ fontSize: 12, fontWeight: 600 }}
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
                            style={{ fontSize: 13, fontWeight: 600 }}
                          >
                            {it.title}
                          </text>
                          <text
                            x={x + cardW / 2}
                            y={cardY + 58}
                            textAnchor="middle"
                            className="fill-muted-foreground"
                            style={{ fontSize: 11 }}
                          >
                            {it.desc1}
                          </text>
                          <text
                            x={x + cardW / 2}
                            y={cardY + 82}
                            textAnchor="middle"
                            className="fill-muted-foreground"
                            style={{ fontSize: 11 }}
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
      </div>
    </AppLayout>
  );
}
