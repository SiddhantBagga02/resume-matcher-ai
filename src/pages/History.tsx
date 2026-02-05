import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import MatchResults from "@/components/MatchResults";

interface AnalysisHistoryItem {
  id: string;
  user_id: string;
  resume_filename: string;
  job_title: string;
  job_description: string;
  score: number;
  missing_keywords: string[];
  matched_keywords: string[];
  suggestions: string[];
  keyword_categories: any;
  resume_text: string;
  created_at: string;
  score_explanation?: string;
  ats_issues?: any[];
  rewrite_suggestions?: any[];
  generated_summary?: string;
  skill_weights?: any;
  experience_gap?: string;
  seniority_fit?: string;
  impact_analysis?: any[];
  action_verb_analysis?: any[];
  redundancies?: any[];
  hidden_requirements?: any[];
  must_have_vs_nice_to_have?: any;
  improvement_plan?: any;
  confidence_level?: number;
  tailoring_score?: number;
}

const History = () => {
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisHistoryItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadHistory(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadHistory(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from("analysis_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setHistory(data as AnalysisHistoryItem[]);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("analysis_history").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete analysis");
    } else {
      toast.success("Analysis deleted");
      setHistory(history.filter((item) => item.id !== id));
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null);
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "destructive";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analysis History</h1>
          <p className="text-lg text-muted-foreground">Review your past resume analyses with comprehensive insights</p>
        </div>

        {history.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">No analyses yet</p>
              <Button onClick={() => navigate("/analyze")} className="bg-gradient-to-r from-primary to-secondary">
                Start Your First Analysis
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {history.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedAnalysis?.id === item.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedAnalysis(item)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{item.job_title}</CardTitle>
                      <Badge variant={getScoreColor(item.score) as any} className="ml-2">
                        {item.score}%
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        {item.resume_filename}
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:sticky lg:top-4 lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-auto">
              {selectedAnalysis ? (
                <MatchResults
                  score={selectedAnalysis.score}
                  scoreExplanation={selectedAnalysis.score_explanation}
                  missingKeywords={selectedAnalysis.missing_keywords || []}
                  matchedKeywords={selectedAnalysis.matched_keywords || []}
                  suggestions={selectedAnalysis.suggestions || []}
                  keywordCategories={selectedAnalysis.keyword_categories}
                  resumeText={selectedAnalysis.resume_text}
                  atsIssues={selectedAnalysis.ats_issues}
                  rewriteSuggestions={selectedAnalysis.rewrite_suggestions}
                  generatedSummary={selectedAnalysis.generated_summary}
                  skillWeights={selectedAnalysis.skill_weights}
                  experienceGap={selectedAnalysis.experience_gap}
                  seniorityFit={selectedAnalysis.seniority_fit}
                  impactAnalysis={selectedAnalysis.impact_analysis}
                  actionVerbAnalysis={selectedAnalysis.action_verb_analysis}
                  redundancies={selectedAnalysis.redundancies}
                  hiddenRequirements={selectedAnalysis.hidden_requirements}
                  mustHaveVsNiceToHave={selectedAnalysis.must_have_vs_nice_to_have}
                  improvementPlan={selectedAnalysis.improvement_plan}
                  confidenceLevel={selectedAnalysis.confidence_level}
                  tailoringScore={selectedAnalysis.tailoring_score}
                />
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Select an analysis to view comprehensive details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
