import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowRight, Repeat, Target, Zap } from "lucide-react";

interface ImpactItem {
  bullet: string;
  hasImpact: boolean;
  suggestion?: string;
}

interface ActionVerbItem {
  weak: string;
  strong: string;
  context: string;
}

interface QualitySignalsProps {
  impactAnalysis: ImpactItem[];
  actionVerbAnalysis: ActionVerbItem[];
  redundancies: string[];
}

const QualitySignals = ({ impactAnalysis, actionVerbAnalysis, redundancies }: QualitySignalsProps) => {
  const bulletsWithImpact = impactAnalysis.filter(i => i.hasImpact);
  const bulletsWithoutImpact = impactAnalysis.filter(i => !i.hasImpact);

  return (
    <div className="space-y-6">
      {/* Impact Analysis */}
      {impactAnalysis.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Impact & Results Detection
          </h3>

          {bulletsWithImpact.length > 0 && (
            <Card className="border-success/30 bg-success/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-success flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Strong Impact Statements ({bulletsWithImpact.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {bulletsWithImpact.map((item, index) => (
                    <li key={index} className="text-sm text-foreground flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>"{item.bullet}"</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {bulletsWithoutImpact.length > 0 && (
            <Card className="border-warning/30 bg-warning/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-warning flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Needs Quantified Impact ({bulletsWithoutImpact.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bulletsWithoutImpact.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-sm text-muted-foreground line-through">
                      "{item.bullet}"
                    </p>
                    {item.suggestion && (
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground">
                          <span className="font-medium text-primary">Try: </span>
                          "{item.suggestion}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Action Verb Analysis */}
      {actionVerbAnalysis.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Action Verb Improvements
          </h3>
          
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {actionVerbAnalysis.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Badge variant="outline" className="text-destructive border-destructive/30 line-through">
                      {item.weak}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
                    <Badge className="bg-success/20 text-success border-success/30">
                      {item.strong}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2 flex-1">{item.context}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Redundancies */}
      {redundancies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Repeat className="h-5 w-5 text-warning" />
            Redundancies Detected
          </h3>
          
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {redundancies.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Repeat className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {impactAnalysis.length === 0 && actionVerbAnalysis.length === 0 && redundancies.length === 0 && (
        <Card className="bg-muted/30">
          <CardContent className="py-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-success mb-3" />
            <p className="text-muted-foreground">
              Your resume quality signals look good!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QualitySignals;
