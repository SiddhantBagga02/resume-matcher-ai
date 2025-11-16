import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResponse {
  score: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  suggestions: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeFile, resumeFileName, jobDescription } = await req.json();

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
      
      // For simplicity, we'll handle text files directly
      // For PDF/DOCX, in production you'd use proper parsing libraries
      if (resumeFileName.endsWith('.txt')) {
        resumeText = new TextDecoder().decode(fileBuffer);
      } else if (resumeFileName.endsWith('.pdf') || resumeFileName.endsWith('.docx')) {
        // For demo purposes, we'll use a placeholder
        // In production, you'd integrate pdf-parse or mammoth libraries
        resumeText = new TextDecoder().decode(fileBuffer);
      } else {
        throw new Error('Unsupported file format');
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      throw new Error('Failed to parse resume file. Please ensure it\'s a valid PDF, DOCX, or TXT file.');
    }

    // Call Lovable AI for analysis
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('AI service not configured');
    }

    const systemPrompt = `You are an expert HR recruiter and resume analyst. Analyze the provided resume and job description to determine compatibility.

Your analysis must:
1. Calculate a compatibility score from 0-100 based on how well the resume matches the job requirements
2. Extract the top 10 most important skills/keywords from the job description
3. Identify which important keywords are MISSING from the resume
4. Identify which important keywords are PRESENT in the resume
5. Provide 2-3 brief, actionable suggestions for improving the resume

Return ONLY valid JSON in this exact format:
{
  "score": 85,
  "missingKeywords": ["keyword1", "keyword2"],
  "matchedKeywords": ["keyword3", "keyword4"],
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
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Invalid AI response');
    }

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
      throw new Error('Failed to parse AI response');
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
