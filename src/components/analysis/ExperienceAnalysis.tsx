import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp, User, AlertTriangle } from "lucide-react";

interface ExperienceAnalysisProps {
  experienceGap: string;
  seniorityFit: string;
}

const ExperienceAnalysis = ({ experienceGap, seniorityFit }: ExperienceAnalysisProps) => {
  // Determine if there are gaps/concerns
  const hasExperienceGap = experienceGap && 
    !experienceGap.toLowerCase().includes('matches') && 
    !experienceGap.toLowerCase().includes('meets') &&
    !experienceGap.toLowerCase().includes('exceeds');
  
  const hasSeniorityMismatch = seniorityFit && 
    (seniorityFit.toLowerCase().includes('junior') || 
     seniorityFit.toLowerCase().includes('mismatch') ||
     seniorityFit.toLowerCase().includes('gap'));

  return (
    <div className="space-y-6">
      {/* Experience Gap */}
      <Card className={hasExperienceGap ? 'border-warning/30 bg-warning/5' : 'border-success/30 bg-success/5'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className={`h-5 w-5 ${hasExperienceGap ? 'text-warning' : 'text-success'}`} />
            Experience Alignment
            {hasExperienceGap && (
              <Badge className="bg-warning/20 text-warning border-warning/30 ml-2">Gap Detected</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{experienceGap}</p>
          {hasExperienceGap && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Tip to offset experience gaps:</p>
                  <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                    <li>Highlight complex projects that showcase advanced skills</li>
                    <li>Emphasize leadership roles or mentoring experience</li>
                    <li>Showcase certifications and continuous learning</li>
                    <li>Include relevant side projects or open source contributions</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seniority Fit */}
      <Card className={hasSeniorityMismatch ? 'border-warning/30 bg-warning/5' : 'border-success/30 bg-success/5'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className={`h-5 w-5 ${hasSeniorityMismatch ? 'text-warning' : 'text-success'}`} />
            Seniority & Role Fit
            {hasSeniorityMismatch && (
              <Badge className="bg-warning/20 text-warning border-warning/30 ml-2">Mismatch</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{seniorityFit}</p>
          {hasSeniorityMismatch && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">How to present yourself at a higher level:</p>
                  <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                    <li>Use leadership-focused action verbs (led, architected, mentored)</li>
                    <li>Highlight decision-making and strategic thinking</li>
                    <li>Show impact on business metrics and team outcomes</li>
                    <li>Include examples of cross-team collaboration</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExperienceAnalysis;
