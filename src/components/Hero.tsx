import { FileText, Sparkles, Target, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <div className="w-full bg-gradient-to-b from-background to-accent/20 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Resume Analysis</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
          Match Your Resume to
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Any Job</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Get instant insights on how well your resume matches job descriptions. Discover missing keywords and optimize your application for success.
        </p>

        <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">1. Upload</h3>
              <p className="text-sm text-muted-foreground">Drop your resume</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">2. Paste</h3>
              <p className="text-sm text-muted-foreground">Add job description</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">3. Analyze</h3>
              <p className="text-sm text-muted-foreground">Get AI insights</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-secondary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">4. Apply</h3>
              <p className="text-sm text-muted-foreground">Submit with confidence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
