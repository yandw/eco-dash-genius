import { useState } from "react";
import { Link2, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onFetched?: (data: { title?: string; cover?: string; summary?: string }) => void;
}

const WECHAT_RE = /^https:\/\/mp\.weixin\.qq\.com\/s\/[\w-]+/;

export function WechatUrlInput({ value, onChange, onFetched }: Props) {
  const [loading, setLoading] = useState(false);
  const valid = !value || WECHAT_RE.test(value);

  const handleFetch = async () => {
    if (!WECHAT_RE.test(value)) {
      toast.error("请输入有效的微信公众号文章链接");
      return;
    }
    setLoading(true);
    // mock 抓取
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("已抓取文章信息");
    onFetched?.({
      title: "（已自动抓取）公众号文章标题示例",
      summary: "（已自动抓取）公众号文章摘要内容示例。",
    });
  };

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://mp.weixin.qq.com/s/..."
            className="pl-9"
          />
        </div>
        <Button type="button" variant="outline" onClick={handleFetch} disabled={loading || !value}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "抓取信息"}
        </Button>
      </div>
      {value && (
        <div
          className={`mt-1.5 flex items-center gap-1.5 text-[11px] ${valid ? "text-emerald-600" : "text-destructive"}`}
        >
          {valid ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
          {valid ? "链接格式有效" : "请填入 https://mp.weixin.qq.com/s/ 开头的链接"}
        </div>
      )}
    </div>
  );
}
