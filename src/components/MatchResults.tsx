import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MatchResultsProps {
  score: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  suggestions: string[];
}

const MatchResults = ({ score, missingKeywords, matchedKeywords, suggestions }: MatchResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-secondary";
    if (score >= 60) return "text-primary";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Needs Improvement";
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in-50 duration-500">
      {/* Score Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg mb-4">Match Score</CardTitle>
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
                  {getScoreLabel(score)}
                </span>
              </div>
            </div>
            <Progress value={score} className="w-full max-w-xs" />
          </div>
        </CardHeader>
      </Card>

      {/* Keywords Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Missing Keywords */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5 text-destructive" />
              Missing Keywords
              <Badge variant="destructive" className="ml-auto">
                {missingKeywords.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-destructive/30 text-destructive"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Great! No critical keywords are missing.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Matched Keywords */}
        <Card className="border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-secondary" />
              Matched Keywords
              <Badge className="ml-auto bg-secondary">
                {matchedKeywords.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {matchedKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-secondary/30 text-secondary"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No matching keywords found. Consider updating your resume.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border-primary/20 bg-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-primary" />
              Quick Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchResults;
