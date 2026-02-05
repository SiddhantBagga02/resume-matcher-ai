import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Shield } from "lucide-react";

interface ScoreExplanationProps {
  score: number;
  scoreExplanation: string;
  confidenceLevel: number;
  tailoringScore: number;
}

const ScoreExplanation = ({ 
  score, 
  scoreExplanation, 
  confidenceLevel, 
  tailoringScore 
}: ScoreExplanationProps) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-success";
    if (value >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return "Excellent";
    if (value >= 60) return "Good";
    if (value >= 40) return "Fair";
    return "Needs Work";
  };

  return (
    <div className="space-y-6">
      {/* Main Score */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
              className={`${getScoreColor(score)} transition-all duration-1000`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              Match Score
            </span>
          </div>
        </div>
      </div>

      {/* Score Explanation */}
      <Card className="bg-muted/30 border-primary/20">
        <CardContent className="pt-4">
          <p className="text-foreground leading-relaxed">{scoreExplanation}</p>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Tailoring Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(tailoringScore)}`}>
                {tailoringScore}%
              </span>
              <Badge variant="outline" className="text-xs">
                {getScoreLabel(tailoringScore)}
              </Badge>
            </div>
            <Progress value={tailoringScore} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              How customized your resume is for this job
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Analysis Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(confidenceLevel)}`}>
                {confidenceLevel}%
              </span>
              <Badge variant="outline" className="text-xs">
                {getScoreLabel(confidenceLevel)}
              </Badge>
            </div>
            <Progress value={confidenceLevel} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              How confident we are in this analysis
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScoreExplanation;
