import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lightbulb, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface RewriteSuggestion {
  original: string;
  suggested: string;
  reason: string;
}

interface RewriteSuggestionsProps {
  rewriteSuggestions: RewriteSuggestion[];
  generatedSummary: string;
}

const RewriteSuggestions = ({ rewriteSuggestions, generatedSummary }: RewriteSuggestionsProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [summaryCopied, setSummaryCopied] = useState(false);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopySummary = async () => {
    await navigator.clipboard.writeText(generatedSummary);
    setSummaryCopied(true);
    toast.success("Summary copied to clipboard!");
    setTimeout(() => setSummaryCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Generated Summary */}
      {generatedSummary && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Custom Professional Summary
              </CardTitle>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCopySummary}
                className="gap-2"
              >
                {summaryCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed italic">
              "{generatedSummary}"
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              This summary is tailored specifically for this job description. Use it at the top of your resume.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Bullet Rewrite Suggestions */}
      {rewriteSuggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            Bullet Point Rewrites
          </h3>
          
          {rewriteSuggestions.map((suggestion, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">Original</Badge>
                  <p className="text-muted-foreground line-through text-sm bg-muted/30 p-3 rounded">
                    {suggestion.original}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-primary">
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Suggested Rewrite</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-foreground font-medium bg-success/10 p-3 rounded flex-1">
                      {suggestion.suggested}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopy(suggestion.suggested, index)}
                      className="flex-shrink-0"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Why: </span>
                    {suggestion.reason}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {rewriteSuggestions.length === 0 && !generatedSummary && (
        <Card className="bg-muted/30">
          <CardContent className="py-8 text-center">
            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No specific rewrite suggestions at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RewriteSuggestions;
