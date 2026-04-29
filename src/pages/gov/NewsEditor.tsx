import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Image as ImageIcon, Save, Send, ShieldAlert } from "lucide-react";
import { WechatUrlInput } from "@/components/news/WechatUrlInput";
import { NewsPreviewCard } from "@/components/news/NewsPreviewCard";
import { CATEGORY_LABELS, NewsCategory, NewsSource, getNewsById } from "@/mocks/news";
import { isCityAdmin } from "@/mocks/currentUser";
import { toast } from "sonner";

const today = () => new Date().toISOString().slice(0, 10);

export default function NewsEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const allowed = isCityAdmin();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<NewsCategory>("hot");
  const [source, setSource] = useState<NewsSource>("上海市节能中心");
  const [sourceCustom, setSourceCustom] = useState("");
  const [wechatUrl, setWechatUrl] = useState("");
  const [cover, setCover] = useState("");
  const [summary, setSummary] = useState("");
  const [publishAt, setPublishAt] = useState(today());
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (id) {
      const n = getNewsById(id);
      if (n) {
        setTitle(n.title);
        setCategory(n.category);
        setSource(n.source);
        setSourceCustom(n.sourceCustom ?? "");
        setWechatUrl(n.wechatUrl);
        setCover(n.cover);
        setSummary(n.summary);
        setPublishAt(n.publishAt);
        setPinned(n.pinned);
      }
    }
  }, [id]);

  const onCoverFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setCover(String(reader.result));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (!title.trim()) return "请填写新闻标题";
    if (!wechatUrl.trim()) return "请填写微信公众号文章链接";
    if (!summary.trim()) return "请填写摘要";
    if (source === "其他" && !sourceCustom.trim()) return "请填写自定义来源名称";
    return null;
  };

  const handleSave = (status: "draft" | "published") => {
    const err = validate();
    if (err && status === "published") {
      toast.error(err);
      return;
    }
    toast.success(status === "draft" ? "草稿已保存" : isEdit ? "已更新发布" : "新闻已发布");
    navigate("/gov/news");
  };

  if (!allowed) {
    return (
      <AppLayout side="gov" title="新闻发布" subtitle="系统管理 / 新闻发布">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShieldAlert className="h-14 w-14 text-amber-500 mb-4" />
          <div className="text-lg font-semibold mb-2">无访问权限</div>
          <p className="text-sm text-muted-foreground">仅市级总账号可发布新闻。</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      side="gov"
      title={isEdit ? "编辑新闻" : "发布新闻"}
      subtitle="系统管理 / 新闻发布 / 编辑器"
    >
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/gov/news")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> 返回列表
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
        {/* 表单 */}
        <Card className="p-6 space-y-5">
          <Field label="新闻标题" required hint={`${title.length}/60`}>
            <Input
              value={title}
              maxLength={60}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入新闻标题"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="新闻类别" required>
              <Select value={category} onValueChange={(v) => setCategory(v as NewsCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY_LABELS) as NewsCategory[]).map((k) => (
                    <SelectItem key={k} value={k}>{CATEGORY_LABELS[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="来源公众号" required>
              <div className="flex gap-2">
                <Select value={source} onValueChange={(v) => setSource(v as NewsSource)}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="上海市节能中心">节能中心</SelectItem>
                    <SelectItem value="上海市经信委">上海经信委</SelectItem>
                    <SelectItem value="其他">其他（自定义）</SelectItem>
                  </SelectContent>
                </Select>
                {source === "其他" && (
                  <Input
                    value={sourceCustom}
                    onChange={(e) => setSourceCustom(e.target.value)}
                    placeholder="自定义公众号名称"
                  />
                )}
              </div>
            </Field>
          </div>

          <Field
            label="微信文章链接"
            required
            hint="详情页将通过 iframe 嵌入此公众号原文"
          >
            <WechatUrlInput
              value={wechatUrl}
              onChange={setWechatUrl}
              onFetched={(d) => {
                if (d.title && !title) setTitle(d.title);
                if (d.summary && !summary) setSummary(d.summary);
              }}
            />
          </Field>

          <Field label="封面图">
            <div className="flex gap-3 items-start">
              <label className="h-32 w-52 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-accent/30 transition shrink-0 overflow-hidden">
                {cover ? (
                  <img src={cover} alt="封面" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">点击上传或拖拽图片</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && onCoverFile(e.target.files[0])}
                />
              </label>
              <div className="flex-1 space-y-2">
                <Input
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  placeholder="或粘贴封面图 URL"
                />
                <p className="text-[11px] text-muted-foreground">
                  推荐尺寸 16:10，800×500px 以上，jpg/png 格式。
                </p>
              </div>
            </div>
          </Field>

          <Field label="摘要" required hint={`${summary.length}/120`}>
            <Textarea
              value={summary}
              maxLength={120}
              rows={3}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="一句话概述新闻内容，将展示在门户列表卡片中"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="发布时间">
              <Input type="date" value={publishAt} onChange={(e) => setPublishAt(e.target.value)} />
            </Field>
            <Field label="是否置顶">
              <div className="flex items-center h-10 gap-3">
                <Switch checked={pinned} onCheckedChange={setPinned} />
                <span className="text-sm text-muted-foreground">
                  {pinned ? "已置顶到列表顶部" : "普通展示"}
                </span>
              </div>
            </Field>
          </div>

          {/* 底部操作 */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate("/gov/news")}>取消</Button>
            <Button variant="outline" onClick={() => handleSave("draft")}>
              <Save className="h-4 w-4 mr-1" /> 保存草稿
            </Button>
            <Button onClick={() => handleSave("published")}>
              <Send className="h-4 w-4 mr-1" /> {isEdit ? "更新发布" : "立即发布"}
            </Button>
          </div>
        </Card>

        {/* 实时预览 */}
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground px-1">实时预览（门户列表样式）</div>
          <NewsPreviewCard
            title={title}
            category={category}
            source={source}
            sourceCustom={sourceCustom}
            cover={cover}
            summary={summary}
            publishAt={publishAt}
            pinned={pinned}
          />
          <Card className="p-3 text-[11px] text-muted-foreground leading-relaxed">
            <div className="font-medium text-foreground mb-1">说明</div>
            发布后，门户「要闻动态」将根据所选类别展示该新闻，详情页将通过 iframe 嵌入填写的微信公众号原文链接。
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <Label className="text-sm">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
