import { CheckCircle2, XCircle, Lightbulb, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import KeywordHighlight from "./KeywordHighlight";
import KeywordCategories from "./KeywordCategories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ScoreExplanation from "./analysis/ScoreExplanation";
import ATSCheck from "./analysis/ATSCheck";
import RewriteSuggestions from "./analysis/RewriteSuggestions";
import SkillsAnalysis from "./analysis/SkillsAnalysis";
import ExperienceAnalysis from "./analysis/ExperienceAnalysis";
import QualitySignals from "./analysis/QualitySignals";
import ImprovementPlan from "./analysis/ImprovementPlan";

interface MatchResultsProps {
  score: number;
  scoreExplanation?: string;
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
  atsIssues?: Array<{
    issue: string;
    severity: 'high' | 'medium' | 'low';
    fix: string;
  }>;
  rewriteSuggestions?: Array<{
    original: string;
    suggested: string;
    reason: string;
  }>;
  generatedSummary?: string;
  skillWeights?: {
    critical?: string[];
    important?: string[];
    niceToHave?: string[];
  };
  experienceGap?: string;
  seniorityFit?: string;
  impactAnalysis?: Array<{
    bullet: string;
    hasImpact: boolean;
    suggestion?: string;
  }>;
  actionVerbAnalysis?: Array<{
    weak: string;
    strong: string;
    context: string;
  }>;
  redundancies?: string[];
  hiddenRequirements?: string[];
  mustHaveVsNiceToHave?: {
    mustHave?: string[];
    niceToHave?: string[];
  };
  improvementPlan?: {
    critical?: string[];
    medium?: string[];
    polish?: string[];
  };
  confidenceLevel?: number;
  tailoringScore?: number;
}

const MatchResults = ({
  score,
  scoreExplanation = "",
  missingKeywords,
  matchedKeywords,
  suggestions,
  keywordCategories = {},
  resumeText = "",
  atsIssues = [],
  rewriteSuggestions = [],
  generatedSummary = "",
  skillWeights = { critical: [], important: [], niceToHave: [] },
  experienceGap = "",
  seniorityFit = "",
  impactAnalysis = [],
  actionVerbAnalysis = [],
  redundancies = [],
  hiddenRequirements = [],
  mustHaveVsNiceToHave = { mustHave: [], niceToHave: [] },
  improvementPlan = { critical: [], medium: [], polish: [] },
  confidenceLevel = 75,
  tailoringScore = 50,
}: MatchResultsProps) => {
  return (
    <Card className="w-full animate-fade-in shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-foreground">Match Results</CardTitle>
        <CardDescription>Comprehensive resume compatibility analysis</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="score" className="w-full">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-max gap-1 p-1">
              <TabsTrigger value="score" className="text-xs px-3">Score</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs px-3">Skills</TabsTrigger>
              <TabsTrigger value="ats" className="text-xs px-3">ATS</TabsTrigger>
              <TabsTrigger value="rewrite" className="text-xs px-3">Rewrites</TabsTrigger>
              <TabsTrigger value="experience" className="text-xs px-3">Experience</TabsTrigger>
              <TabsTrigger value="quality" className="text-xs px-3">Quality</TabsTrigger>
              <TabsTrigger value="plan" className="text-xs px-3">Plan</TabsTrigger>
              <TabsTrigger value="keywords" className="text-xs px-3">Keywords</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="score" className="space-y-6 mt-6">
            <ScoreExplanation
              score={score}
              scoreExplanation={scoreExplanation}
              confidenceLevel={confidenceLevel}
              tailoringScore={tailoringScore}
            />
            
            {/* Quick Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Quick Suggestions
                </h3>
                <ol className="space-y-2 text-muted-foreground">
                  {suggestions.slice(0, 5).map((suggestion, index) => (
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

          <TabsContent value="skills" className="mt-6">
            <SkillsAnalysis
              skillWeights={skillWeights}
              mustHaveVsNiceToHave={mustHaveVsNiceToHave}
              matchedKeywords={matchedKeywords}
              missingKeywords={missingKeywords}
            />
          </TabsContent>

          <TabsContent value="ats" className="mt-6">
            <ATSCheck atsIssues={atsIssues} />
          </TabsContent>

          <TabsContent value="rewrite" className="mt-6">
            <RewriteSuggestions
              rewriteSuggestions={rewriteSuggestions}
              generatedSummary={generatedSummary}
            />
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <ExperienceAnalysis
              experienceGap={experienceGap}
              seniorityFit={seniorityFit}
            />
          </TabsContent>

          <TabsContent value="quality" className="mt-6">
            <QualitySignals
              impactAnalysis={impactAnalysis}
              actionVerbAnalysis={actionVerbAnalysis}
              redundancies={redundancies}
            />
          </TabsContent>

          <TabsContent value="plan" className="mt-6">
            <ImprovementPlan
              improvementPlan={improvementPlan}
              hiddenRequirements={hiddenRequirements}
            />
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

            {/* Keyword Categories */}
            <KeywordCategories categories={keywordCategories} />

            {/* Highlight View */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Resume with Highlighted Keywords</h3>
              <KeywordHighlight
                text={resumeText}
                matchedKeywords={matchedKeywords}
                missingKeywords={missingKeywords}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MatchResults;
