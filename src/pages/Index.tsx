import { useState } from "react";
import Hero from "@/components/Hero";
import ResumeUploader from "@/components/ResumeUploader";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import MatchResults from "@/components/MatchResults";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  score: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  suggestions: string[];
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please upload your resume first");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please paste a job description");
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          resumeFile: fileContent,
          resumeFileName: selectedFile.name,
          jobDescription: jobDescription
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
      toast.success("Analysis complete!");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = selectedFile && jobDescription.trim() && !isAnalyzing;

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <ResumeUploader 
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
          />
          
          <JobDescriptionInput
            value={jobDescription}
            onChange={setJobDescription}
          />
        </div>

        <div className="flex justify-center mb-12">
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-6 text-lg font-semibold shadow-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze Match
              </>
            )}
          </Button>
        </div>

        {results && (
          <MatchResults
            score={results.score}
            missingKeywords={results.missingKeywords}
            matchedKeywords={results.matchedKeywords}
            suggestions={results.suggestions}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
