import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DualCalcPanel } from "./DualCalcPanel";
import { INDUSTRY_LABEL, type IndustryKey } from "@/mocks/dualCalcDefaults";

const INDUSTRIES: IndustryKey[] = ["fossil", "steel", "power", "other"];

export function DualCalcForm() {
  const [industry, setIndustry] = useState<IndustryKey>("fossil");

  return (
    <div className="space-y-4">
      <Tabs value={industry} onValueChange={(v) => setIndustry(v as IndustryKey)}>
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          {INDUSTRIES.map((k) => (
            <TabsTrigger key={k} value={k}>
              {INDUSTRY_LABEL[k]}
            </TabsTrigger>
          ))}
        </TabsList>

        {INDUSTRIES.map((k) => (
          <TabsContent key={k} value={k} className="mt-4">
            <DualCalcPanel industry={k} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
