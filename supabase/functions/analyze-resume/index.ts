const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResponse {
  score: number;
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

    const systemPrompt = `You are an expert resume analyzer and career advisor. Analyze the given resume against the job description and provide:
1. A compatibility score (0-100)
2. List of missing keywords that should be added
3. List of matched keywords found in the resume
4. Categorize keywords into: technical (programming languages, frameworks), soft (communication, leadership), domain (industry knowledge), tools (software, platforms)
5. Actionable suggestions to improve the resume

Return ONLY valid JSON in this exact format:
{
  "score": 85,
  "missingKeywords": ["keyword1", "keyword2"],
  "matchedKeywords": ["keyword3", "keyword4"],
  "keywordCategories": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill3", "skill4"],
    "domain": ["knowledge1"],
    "tools": ["tool1", "tool2"]
  },
  "suggestions": ["suggestion1", "suggestion2"]
}`;

    const userPrompt = `RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze the match between this resume and job description.`;

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

    // Ensure keywordCategories exists
    if (!analysisResult.keywordCategories) {
      analysisResult.keywordCategories = {
        technical: [],
        soft: [],
        domain: [],
        tools: []
      };
    }

    // Include resume text in response
    analysisResult.resumeText = resumeText;

    console.log('Analysis successful:', { 
      score: analysisResult.score,
      missingKeywordsCount: analysisResult.missingKeywords.length,
      matchedKeywordsCount: analysisResult.matchedKeywords.length,
      suggestionsCount: analysisResult.suggestions.length
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
