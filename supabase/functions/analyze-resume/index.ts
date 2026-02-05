const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResponse {
  score: number;
  scoreExplanation: string;
  missingKeywords: string[];
  matchedKeywords: string[];
  suggestions: string[];
  keywordCategories: {
    technical: string[];
    soft: string[];
    domain: string[];
    tools: string[];
  };
  resumeText: string;
  atsIssues: Array<{
    issue: string;
    severity: 'high' | 'medium' | 'low';
    fix: string;
  }>;
  rewriteSuggestions: Array<{
    original: string;
    suggested: string;
    reason: string;
  }>;
  generatedSummary: string;
  skillWeights: {
    critical: string[];
    important: string[];
    niceToHave: string[];
  };
  experienceGap: string;
  seniorityFit: string;
  impactAnalysis: Array<{
    bullet: string;
    hasImpact: boolean;
    suggestion?: string;
  }>;
  actionVerbAnalysis: Array<{
    weak: string;
    strong: string;
    context: string;
  }>;
  redundancies: string[];
  hiddenRequirements: string[];
  mustHaveVsNiceToHave: {
    mustHave: string[];
    niceToHave: string[];
  };
  improvementPlan: {
    critical: string[];
    medium: string[];
    polish: string[];
  };
  confidenceLevel: number;
  tailoringScore: number;
}

Deno.serve(async (req) => {
  console.log('Edge function called:', { method: req.method, headers: Object.fromEntries(req.headers) });
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Request body received:', { 
      hasResumeFile: !!body.resumeFile, 
      resumeFileName: body.resumeFileName,
      jobDescriptionLength: body.jobDescription?.length 
    });
    
    const { resumeFile, resumeFileName, jobDescription } = body;

    if (!resumeFile || !jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract text from resume file
    let resumeText = '';
    
    try {
      // Remove data URL prefix if present
      const base64Data = resumeFile.includes('base64,') 
        ? resumeFile.split('base64,')[1] 
        : resumeFile;
      
      const fileBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      if (resumeFileName.endsWith('.txt')) {
        resumeText = new TextDecoder().decode(fileBuffer);
      } else if (resumeFileName.endsWith('.pdf')) {
        // For PDF files, we'll use a simple text extraction approach
        // Convert buffer to string and extract visible text
        const pdfText = new TextDecoder().decode(fileBuffer);
        // Extract text between content streams (simple approach)
        const textMatches = pdfText.match(/\(([^)]+)\)/g);
        if (textMatches) {
          resumeText = textMatches
            .map(match => match.slice(1, -1))
            .join(' ')
            .replace(/\\[nrt]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
        if (!resumeText || resumeText.length < 50) {
          throw new Error('Could not extract sufficient text from PDF. Please try uploading as TXT or ensure the PDF contains selectable text.');
        }
      } else if (resumeFileName.endsWith('.docx')) {
        // For DOCX, we'll try to extract text from the XML content
        const docxText = new TextDecoder().decode(fileBuffer);
        const textMatches = docxText.match(/>([^<]+)</g);
        if (textMatches) {
          resumeText = textMatches
            .map(match => match.slice(1, -1))
            .filter(text => text.trim().length > 2)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
        if (!resumeText || resumeText.length < 50) {
          throw new Error('Could not extract sufficient text from DOCX. Please try uploading as TXT.');
        }
      } else {
        throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT files.');
      }
      
      console.log('Extracted text length:', resumeText.length);
      
      // Ultra-aggressive cleaning: keep ONLY safe printable ASCII and basic punctuation
      // This ensures PostgreSQL can store the text without Unicode escape sequence errors
      resumeText = resumeText
        .split('')
        .map(char => {
          const code = char.charCodeAt(0);
          // Keep only: space (32), basic punctuation/numbers/letters (33-126), and some extended chars (160-255)
          if ((code >= 32 && code <= 126) || (code >= 160 && code <= 255)) {
            return char;
          }
          return ' '; // Replace everything else with space
        })
        .join('')
        .replace(/\s+/g, ' ') // Normalize multiple spaces
        .trim();
      
      if (resumeText.length < 50) {
        throw new Error('Could not extract sufficient text from resume after cleaning.');
      }
      
      console.log('Cleaned text length:', resumeText.length);
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      const errorMessage = parseError instanceof Error ? parseError.message : 'Failed to parse resume file. Please ensure it\'s a valid PDF, DOCX, or TXT file.';
      throw new Error(errorMessage);
    }

    console.log('Calling AI for analysis...');
    
    // Call Lovable AI for analysis
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error('AI service not configured');
    }

    const systemPrompt = `You are an expert resume analyzer, career advisor, and ATS specialist. Analyze the given resume against the job description with extreme depth and provide comprehensive, actionable feedback.

IMPORTANT: Never invent or hallucinate skills that aren't in the resume. Only analyze what's actually present.

Return ONLY valid JSON in this exact format:
{
  "score": 75,
  "scoreExplanation": "Strong match on technical skills (Python, AWS). Weak match on leadership keywords. Missing key requirement: Kubernetes experience.",
  "missingKeywords": ["keyword1", "keyword2"],
  "matchedKeywords": ["keyword3", "keyword4"],
  "keywordCategories": {
    "technical": ["Python", "JavaScript"],
    "soft": ["leadership", "communication"],
    "domain": ["fintech", "healthcare"],
    "tools": ["AWS", "Docker"]
  },
  "suggestions": ["Add quantified achievements", "Include Kubernetes projects"],
  "atsIssues": [
    {"issue": "Missing standard 'Experience' section header", "severity": "high", "fix": "Add clear section headers like 'Work Experience', 'Education', 'Skills'"},
    {"issue": "Using tables or columns that ATS may not parse", "severity": "medium", "fix": "Use simple single-column format"}
  ],
  "rewriteSuggestions": [
    {"original": "Worked on various projects", "suggested": "Led 5 cross-functional projects resulting in $2M revenue increase", "reason": "Adds specificity, leadership, and quantified impact"}
  ],
  "generatedSummary": "Results-driven Software Engineer with 5+ years of experience in Python and cloud technologies. Proven track record of...",
  "skillWeights": {
    "critical": ["Python", "AWS", "System Design"],
    "important": ["Docker", "CI/CD"],
    "niceToHave": ["GraphQL", "Terraform"]
  },
  "experienceGap": "Job requires 5+ years, resume shows approximately 3-4 years. Consider highlighting project complexity to offset.",
  "seniorityFit": "Resume reads as mid-level while job targets senior. Emphasize leadership and architectural decisions.",
  "impactAnalysis": [
    {"bullet": "Managed team of developers", "hasImpact": false, "suggestion": "Managed team of 8 developers, delivering 3 major features ahead of schedule"},
    {"bullet": "Increased sales by 40%", "hasImpact": true}
  ],
  "actionVerbAnalysis": [
    {"weak": "Helped with", "strong": "Spearheaded", "context": "Use 'Spearheaded' when you led an initiative"},
    {"weak": "Worked on", "strong": "Architected", "context": "Use 'Architected' for technical design work"}
  ],
  "redundancies": ["'Team player' mentioned 3 times", "Python listed in both Skills and Experience redundantly"],
  "hiddenRequirements": ["Implies need for cross-team collaboration based on 'stakeholder' mentions", "Ownership mindset expected from 'end-to-end' language"],
  "mustHaveVsNiceToHave": {
    "mustHave": ["Python", "5+ years experience", "AWS"],
    "niceToHave": ["Kubernetes", "Machine Learning"]
  },
  "improvementPlan": {
    "critical": ["Add Kubernetes experience or projects", "Quantify achievements with numbers"],
    "medium": ["Add leadership examples", "Include cloud certifications"],
    "polish": ["Improve action verbs", "Add industry-specific keywords"]
  },
  "confidenceLevel": 85,
  "tailoringScore": 60
}

Analyze thoroughly:
1. Score (0-100) with plain-English explanation of why
2. Missing and matched keywords categorized
3. ATS compatibility issues with severity and fixes
4. Specific bullet rewrite suggestions (not generic advice)
5. Custom professional summary for this exact job
6. Skill weighting based on job priority (critical/important/nice-to-have)
7. Experience gap analysis (years, seniority level)
8. Impact detection in bullets (flag vague ones, praise specific ones)
9. Weak action verbs with stronger alternatives
10. Redundancies in the resume
11. Hidden/implied requirements from job description
12. Must-have vs nice-to-have classification
13. One-page improvement plan (critical/medium/polish)
14. Confidence level in your analysis (0-100)
15. Tailoring score - how customized is this resume for this job (0-100)`;

    const userPrompt = `RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze the match between this resume and job description with full depth.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (aiResponse.status === 402) {
        throw new Error('AI service credits exhausted. Please contact support.');
      }
      throw new Error('AI analysis failed. Please try again.');
    }

    const aiData = await aiResponse.json();
    console.log('AI response received:', { 
      hasChoices: !!aiData.choices, 
      choicesLength: aiData.choices?.length 
    });
    
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response:', aiData);
      throw new Error('Invalid AI response');
    }
    
    console.log('Parsing AI response...');

    // Parse the JSON response
    let analysisResult: AnalysisResponse;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      analysisResult = JSON.parse(jsonContent.trim());
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('AI response:', content);
      
      // If AI returned an error message instead of JSON, throw a more helpful error
      if (content.includes("I'm sorry") || content.includes("cannot") || content.includes("unable")) {
        throw new Error('AI could not process the resume. Please ensure the file contains readable text.');
      }
      throw new Error('Failed to parse AI response. Please try again.');
    }

    // Validate the response structure
    if (
      typeof analysisResult.score !== 'number' ||
      !Array.isArray(analysisResult.missingKeywords) ||
      !Array.isArray(analysisResult.matchedKeywords) ||
      !Array.isArray(analysisResult.suggestions)
    ) {
      throw new Error('Invalid analysis result format');
    }

    // Ensure all fields have defaults
    analysisResult.keywordCategories = analysisResult.keywordCategories || { technical: [], soft: [], domain: [], tools: [] };
    analysisResult.scoreExplanation = analysisResult.scoreExplanation || 'Analysis completed.';
    analysisResult.atsIssues = analysisResult.atsIssues || [];
    analysisResult.rewriteSuggestions = analysisResult.rewriteSuggestions || [];
    analysisResult.generatedSummary = analysisResult.generatedSummary || '';
    analysisResult.skillWeights = analysisResult.skillWeights || { critical: [], important: [], niceToHave: [] };
    analysisResult.experienceGap = analysisResult.experienceGap || 'Unable to determine experience gap.';
    analysisResult.seniorityFit = analysisResult.seniorityFit || 'Unable to determine seniority fit.';
    analysisResult.impactAnalysis = analysisResult.impactAnalysis || [];
    analysisResult.actionVerbAnalysis = analysisResult.actionVerbAnalysis || [];
    analysisResult.redundancies = analysisResult.redundancies || [];
    analysisResult.hiddenRequirements = analysisResult.hiddenRequirements || [];
    analysisResult.mustHaveVsNiceToHave = analysisResult.mustHaveVsNiceToHave || { mustHave: [], niceToHave: [] };
    analysisResult.improvementPlan = analysisResult.improvementPlan || { critical: [], medium: [], polish: [] };
    analysisResult.confidenceLevel = analysisResult.confidenceLevel || 75;
    analysisResult.tailoringScore = analysisResult.tailoringScore || 50;
    analysisResult.resumeText = resumeText;

    console.log('Analysis successful:', { 
      score: analysisResult.score,
      missingKeywordsCount: analysisResult.missingKeywords.length,
      matchedKeywordsCount: analysisResult.matchedKeywords.length,
      suggestionsCount: analysisResult.suggestions.length,
      atsIssuesCount: analysisResult.atsIssues.length,
      rewriteSuggestionsCount: analysisResult.rewriteSuggestions.length
    });

    return new Response(
      JSON.stringify(analysisResult),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in analyze-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
