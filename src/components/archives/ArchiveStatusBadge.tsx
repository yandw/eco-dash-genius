import { Badge } from "@/components/ui/badge";
import { ArchiveStatus, ArchiveStatusLabel } from "@/mocks/archives";
import { cn } from "@/lib/utils";

const styles: Record<ArchiveStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  submitted: "bg-primary/10 text-primary border-primary/30",
  approved: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
  pending: "bg-muted/60 text-muted-foreground border-border",
};

interface Props {
  status: ArchiveStatus;
  className?: string;
}

export function ArchiveStatusBadge({ status, className }: Props) {
  return (
    <Badge variant="outline" className={cn("border font-medium", styles[status], className)}>
      {ArchiveStatusLabel[status]}
    </Badge>
  );
}
