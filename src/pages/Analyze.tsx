import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import ResumeUploader from "@/components/ResumeUploader";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Analyze = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please upload your resume first");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please paste a job description");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to analyze resumes");
      navigate("/auth");
      return;
    }

    setIsAnalyzing(true);
    console.log("Starting analysis...", { fileName: selectedFile.name, fileSize: selectedFile.size });

    try {
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      console.log("File loaded, calling edge function...");
      toast.loading("Analyzing your resume...", { id: "analyzing" });

      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: {
          resumeFile: fileContent,
          resumeFileName: selectedFile.name,
          jobDescription: jobDescription,
          jobTitle: jobTitle || "Job Position",
        },
      });

      console.log("Edge function response:", { data, error });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }
      
      if (data?.error) {
        console.error("Analysis error:", data.error);
        throw new Error(data.error);
      }

      if (!data) {
        throw new Error("No data received from analysis");
      }

      console.log("Analysis complete, saving to database...");
      toast.loading("Saving results...", { id: "analyzing" });

      // Save to history
      const { data: insertData, error: insertError } = await supabase
        .from("analysis_history")
        .insert({
          user_id: user.id,
          resume_filename: selectedFile.name,
          job_title: jobTitle || "Job Position",
          job_description: jobDescription,
          score: data.score,
          missing_keywords: data.missingKeywords,
          matched_keywords: data.matchedKeywords,
          suggestions: data.suggestions,
          keyword_categories: data.keywordCategories || {},
          resume_text: data.resumeText || "",
        })
        .select();

      if (insertError) {
        console.error("Failed to save history:", insertError);
        toast.error("Analysis completed but failed to save. Please try again.");
        throw insertError;
      }

      console.log("Successfully saved to database:", insertData);
      toast.success("Analysis complete!", { id: "analyzing" });
      
      // Small delay to ensure database transaction completes
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate("/history");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze resume. Please try again.", { id: "analyzing" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) return null;

  const canAnalyze = selectedFile && jobDescription.trim() && !isAnalyzing;

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">New Analysis</h1>
          <p className="text-lg text-muted-foreground">Upload your resume and job description to get started</p>
        </div>

        <div className="mb-6">
          <Label htmlFor="job-title">Job Title (Optional)</Label>
          <Input
            id="job-title"
            placeholder="e.g., Senior Software Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <ResumeUploader onFileSelect={setSelectedFile} selectedFile={selectedFile} />
          <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
        </div>

        <div className="flex justify-center">
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
      </div>
    </div>
  );
};

export default Analyze;
