import { CheckCircle2, XCircle, Lightbulb, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import KeywordHighlight from "./KeywordHighlight";
import KeywordCategories from "./KeywordCategories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MatchResultsProps {
  score: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  suggestions: string[];
  keywordCategories?: {
    technical?: string[];
    soft?: string[];
    domain?: string[];
    tools?: string[];
  };
  resumeText?: string;
}

const MatchResults = ({
  score,
  missingKeywords,
  matchedKeywords,
  suggestions,
  keywordCategories = {},
  resumeText = "",
}: MatchResultsProps) => {
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
    <Card className="w-full animate-fade-in shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-foreground">Match Results</CardTitle>
        <CardDescription>Your resume compatibility analysis</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="highlight">Highlight</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Score Circle */}
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

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Suggestions for Improvement
                </h3>
                <ol className="space-y-2 text-muted-foreground">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{suggestion}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6 mt-6">
            {/* Missing Keywords */}
            {missingKeywords.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="destructive" className="px-3 py-1">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Keywords */}
            {matchedKeywords.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-success flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Matched Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.map((keyword, index) => (
                    <Badge key={index} className="bg-success/20 text-success border-success/30 px-3 py-1">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <KeywordCategories categories={keywordCategories} />
          </TabsContent>

          <TabsContent value="highlight" className="mt-6">
            <KeywordHighlight
              text={resumeText}
              matchedKeywords={matchedKeywords}
              missingKeywords={missingKeywords}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MatchResults;
