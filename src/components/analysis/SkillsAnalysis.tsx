import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Star, Zap, Sparkles } from "lucide-react";

interface SkillWeights {
  critical?: string[];
  important?: string[];
  niceToHave?: string[];
}

interface MustHaveVsNiceToHave {
  mustHave?: string[];
  niceToHave?: string[];
}

interface SkillsAnalysisProps {
  skillWeights: SkillWeights;
  mustHaveVsNiceToHave: MustHaveVsNiceToHave;
  matchedKeywords: string[];
  missingKeywords: string[];
}

const SkillsAnalysis = ({ 
  skillWeights, 
  mustHaveVsNiceToHave,
  matchedKeywords,
  missingKeywords 
}: SkillsAnalysisProps) => {
  const isMatched = (skill: string) => 
    matchedKeywords.some(k => k.toLowerCase() === skill.toLowerCase());
  
  const isMissing = (skill: string) => 
    missingKeywords.some(k => k.toLowerCase() === skill.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Skill Priority */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Skills by Job Priority
        </h3>

        {/* Critical Skills */}
        {skillWeights.critical?.length > 0 && (
          <Card className="border-destructive/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                <Star className="h-4 w-4 fill-destructive" />
                Critical - Must Have
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skillWeights.critical.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant={isMatched(skill) ? "default" : "destructive"}
                    className={`gap-1 ${isMatched(skill) ? 'bg-success text-success-foreground' : ''}`}
                  >
                    {isMatched(skill) ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Important Skills */}
        {skillWeights.important?.length > 0 && (
          <Card className="border-warning/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-warning">
                <Star className="h-4 w-4" />
                Important - Strongly Preferred
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skillWeights.important.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className={`gap-1 ${isMatched(skill) ? 'bg-success/20 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'}`}
                  >
                    {isMatched(skill) ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nice to Have */}
        {skillWeights.niceToHave?.length > 0 && (
          <Card className="border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Nice to Have - Bonus Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skillWeights.niceToHave.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className={`gap-1 ${isMatched(skill) ? 'bg-success/20 text-success' : ''}`}
                  >
                    {isMatched(skill) && <CheckCircle className="h-3 w-3" />}
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Must Have vs Nice to Have from JD */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Job Requirements Classification</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-destructive">Must-Have Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mustHaveVsNiceToHave.mustHave?.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
                {(!mustHaveVsNiceToHave.mustHave || mustHaveVsNiceToHave.mustHave.length === 0) && (
                  <li className="text-muted-foreground text-sm">None identified</li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Nice-to-Have</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mustHaveVsNiceToHave.niceToHave?.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
                {(!mustHaveVsNiceToHave.niceToHave || mustHaveVsNiceToHave.niceToHave.length === 0) && (
                  <li className="text-muted-foreground text-sm">None identified</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkillsAnalysis;
