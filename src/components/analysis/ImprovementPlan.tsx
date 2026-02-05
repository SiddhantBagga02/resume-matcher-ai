import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, AlertTriangle, Eye, Sparkles, ListChecks } from "lucide-react";

interface ImprovementPlanData {
  critical?: string[];
  medium?: string[];
  polish?: string[];
}

interface HiddenRequirement {
  requirement?: string;
}

interface ImprovementPlanProps {
  improvementPlan: ImprovementPlanData;
  hiddenRequirements: (string | HiddenRequirement)[];
}

const ImprovementPlan = ({ improvementPlan, hiddenRequirements }: ImprovementPlanProps) => {
  // Normalize hidden requirements to strings
  const normalizedHiddenReqs = hiddenRequirements.map(req => 
    typeof req === 'string' ? req : req.requirement || ''
  ).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* One-Page Improvement Plan */}
      <Card className="border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            Your Improvement Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Critical Fixes */}
          {improvementPlan.critical?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h4 className="font-semibold text-destructive">Critical Fixes</h4>
                <Badge variant="destructive" className="ml-2">Do First</Badge>
              </div>
              <ul className="space-y-2 ml-7">
                {improvementPlan.critical.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Medium Priority */}
          {improvementPlan.medium?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-warning" />
                <h4 className="font-semibold text-warning">Medium Priority</h4>
                <Badge className="bg-warning/20 text-warning border-warning/30 ml-2">Important</Badge>
              </div>
              <ul className="space-y-2 ml-7">
                {improvementPlan.medium.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Polish */}
          {improvementPlan.polish?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-semibold text-muted-foreground">Optional Polish</h4>
                <Badge variant="secondary" className="ml-2">Nice to Have</Badge>
              </div>
              <ul className="space-y-2 ml-7">
                {improvementPlan.polish.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden Requirements */}
      {normalizedHiddenReqs.length > 0 && (
        <Card className="border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Hidden Job Requirements
              <Badge variant="outline" className="ml-2">Between the Lines</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              These requirements aren't explicitly stated but are implied in the job description:
            </p>
            <ul className="space-y-2">
              {normalizedHiddenReqs.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Eye className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* No data state */}
      {(!improvementPlan.critical?.length && !improvementPlan.medium?.length && !improvementPlan.polish?.length) && (
        <Card className="bg-muted/30">
          <CardContent className="py-8 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-success mb-3" />
            <p className="text-muted-foreground">
              No specific improvements needed at this time!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImprovementPlan;
