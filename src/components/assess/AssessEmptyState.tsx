import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isCityAdmin } from "@/mocks/currentUser";

interface Props {
  title: string;
  description?: string;
  showGoToTasks?: boolean;
}

export function AssessEmptyState({ title, description, showGoToTasks }: Props) {
  const navigate = useNavigate();
  const cityAdmin = isCityAdmin();
  const showBtn = showGoToTasks && cityAdmin;
  return (
    <Card className="p-12 flex flex-col items-center justify-center text-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <ClipboardList className="h-10 w-10 text-muted-foreground/70" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      )}
      {showBtn && (
        <Button
          className="mt-5 bg-gradient-primary text-primary-foreground"
          size="sm"
          onClick={() => navigate("/gov/assess/tasks")}
        >
          前往任务管理
        </Button>
      )}
    </Card>
  );
}
