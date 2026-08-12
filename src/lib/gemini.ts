import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, BuildFromKnowledgeRecommendation, MicroIntervention, RealWorldContextAnalysis } from '../types';

// Initialize server-side Gemini client
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('GEMINI_API_KEY environment variable is missing or placeholder. Fallback mode active.');
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return aiClient;
  } catch (err) {
    console.error('Failed to initialize Gemini AI client:', err instanceof Error ? err.message : 'Unknown error');
    return null;
  }
}

function sanitizeStudentName(name: string): string {
  if (!name) return 'Student';
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1 && parts[0].toLowerCase() === 'student') {
    return `${parts[0]} ${parts[1]}`;
  }
  return parts[0] || 'Student';
}

const SYSTEM_INSTRUCTION = `You are "Learning Lens", an AI educational learning-intelligence assistant supporting a human teacher in a multigrade, low-resource classroom.

Your absolute principles:
1. You are NOT the teacher. The teacher has full pedagogical and contextual authority.
2. Never infer a child's overall intelligence or ability without evidence.
3. Strictly distinguish between:
   - Observed Evidence (What teacher actually saw/recorded)
   - Inferred Hypothesis (Your learning analysis)
   - Recommended Intervention (Concrete next step)
4. Never present an AI inference as a confirmed fact.
5. Never diagnose disabilities or mental health conditions.
6. Never label children negatively (avoid "weak", "slow", "poor learner"). Use "developing", "needs targeted support", "demonstrated understanding".
7. Prioritize conceptual understanding over rote memorization.
8. When a misconception is detected, explain the underlying mathematical/conceptual reasoning behind the error.
9. Suggest simple, low-cost activities using materials already available (paper, stones, bottles, fruits, coins).
10. If teacher input is vague (e.g. "Rahul is weak in fractions"), do NOT invent a conclusion. Ask for specific evidence with clear choices.
11. Be concise because teachers have limited classroom time.
12. PRIVACY & DATA MINIMIZATION: Never request, retain, or return personally identifiable information (PII) such as full legal names, phone numbers, addresses, or emails. Refer to students strictly by first name or pseudonyms (e.g., "Student 01").`;

export async function analyzeStudentObservation(params: {
  studentName: string;
  topic: string;
  understanding: string;
  participation: string;
  reasoning: string;
  note: string;
  availableObjects?: string[];
  language?: string;
}): Promise<AnalysisResult> {
  const { studentName, topic, understanding, participation, reasoning, note, availableObjects, language = 'mr' } = params;

  // Check if note is extremely vague (less than 4 words and generic)
  const isVagueNote = !note || note.trim().length < 8 || /^(weak|poor|bad|struggling|good|smart)$/i.test(note.trim());

  if (isVagueNote && (understanding === 'struggling' || understanding === 'unclear')) {
    return {
      id: `analysis-${Date.now()}`,
      observationId: '',
      studentId: '',
      studentName,
      concept: topic,
      status: understanding as any,
      observedEvidence: `Teacher observed that ${studentName} is having difficulty in ${topic}.`,
      inferredHypothesis: `Evidence is currently insufficient to identify the specific misconception.`,
      confidence: 'low',
      recommendedInterventionSummary: 'Please clarify what specific behavior or response was observed.',
      timestamp: new Date().toISOString(),
      isVagueEvidence: true,
      vagueEvidenceQuestion: `What specific error or challenge did ${studentName} demonstrate during ${topic}?`,
      vagueEvidenceOptions: [
        `Cannot identify ${topic} visually or with concrete objects`,
        `Confuses terms/symbols (e.g., numerator vs denominator)`,
        `Compares numbers directly without considering equal parts`,
        `Can perform procedure but cannot explain reasoning`,
        `Gets confused when word problems or stories are used`,
      ],
    };
  }

  const ai = getGeminiClient();

  if (!ai) {
    // High quality offline fallback
    const hasDenominatorMisconception = /denominator|denominator size|4 is bigger|1\/4 is larger|bigger than 2/i.test(note);
    const misconception = hasDenominatorMisconception
      ? 'Student compares denominator numbers directly rather than reasoning about equal part sizes.'
      : `Student shows emerging understanding of ${topic} but needs concrete visual guidance.`;

    return {
      id: `analysis-${Date.now()}`,
      observationId: '',
      studentId: '',
      studentName,
      concept: topic,
      status: (understanding as any) || 'developing',
      observedEvidence: `Teacher noted: "${note || 'Student required guidance during group task.'}"`,
      inferredHypothesis: `Hypothesis: ${misconception}`,
      possibleMisconception: hasDenominatorMisconception ? 'Denominator magnitude confusion (1/4 vs 1/2)' : undefined,
      confidence: hasDenominatorMisconception ? 'high' : 'medium',
      recommendedInterventionSummary: `Use 2 identical paper strips. Fold one in halves and one in quarters. Ask ${studentName} which piece is larger and why.`,
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const cleanStudentName = sanitizeStudentName(studentName);
    const prompt = `Analyze this classroom observation for student "${cleanStudentName}" during topic "${topic}".
Teacher note: "${note}"
Understanding level marked by teacher: "${understanding}"
Participation: "${participation}"
Reasoning mode: "${reasoning}"
Available classroom objects: ${availableObjects?.join(', ') || 'paper, bottles, stones'}
Target language for response: ${language}

Analyze whether a specific misconception is present. Separate evidence from your hypothesis.
Return a clean JSON object following this exact structure:
{
  "concept": "${topic}",
  "status": "${understanding}",
  "observedEvidence": "Summary of actual teacher observation",
  "inferredHypothesis": "What this observation likely indicates about student's mental model",
  "possibleMisconception": "Short title of misconception if detected, otherwise null",
  "confidence": "low" | "medium" | "high",
  "recommendedInterventionSummary": "One-line concrete, low-cost classroom activity recommendation"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);

    return {
      id: `analysis-${Date.now()}`,
      observationId: '',
      studentId: '',
      studentName: cleanStudentName,
      concept: parsed.concept || topic,
      status: parsed.status || understanding,
      observedEvidence: parsed.observedEvidence || note,
      inferredHypothesis: parsed.inferredHypothesis || 'Student is developing conceptual mastery.',
      possibleMisconception: parsed.possibleMisconception || undefined,
      confidence: parsed.confidence || 'medium',
      recommendedInterventionSummary: parsed.recommendedInterventionSummary || 'Conduct a 5-minute visual check.',
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Error running Gemini analysis:', err instanceof Error ? err.message : 'Unknown error');
    return {
      id: `analysis-${Date.now()}`,
      observationId: '',
      studentId: '',
      studentName: sanitizeStudentName(studentName),
      concept: topic,
      status: (understanding as any) || 'developing',
      observedEvidence: `Teacher note: "${note}"`,
      inferredHypothesis: 'Student is acquiring conceptual understanding.',
      confidence: 'medium',
      recommendedInterventionSummary: 'Use concrete paper folding or objects to demonstrate equal parts.',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function generateInterventionDetails(params: {
  concept: string;
  misconception?: string;
  studentNames: string[];
  availableObjects?: string[];
  language?: string;
}): Promise<MicroIntervention> {
  const { concept, misconception, studentNames, availableObjects, language = 'mr' } = params;

  const ai = getGeminiClient();

  if (!ai) {
    return {
      id: `interv-${Date.now()}`,
      concept,
      objective: `Master ${concept} through tactile comparison of equal parts.`,
      timeRequiredMinutes: 7,
      materialsRequired: availableObjects && availableObjects.length > 0 ? availableObjects.slice(0, 2) : ['2 identical sheets of paper'],
      teacherInstruction: `Gather ${studentNames.join(', ')}. Take 2 identical sheets of paper. Fold Sheet 1 into 2 equal parts (halves) and Sheet 2 into 4 equal parts (quarters).`,
      questionsToAsk: [
        'Which piece is bigger: 1 piece of the 2-part sheet or 1 piece of the 4-part sheet?',
        'Why does dividing into 4 parts make each piece smaller than dividing into 2 parts?'
      ],
      expectedStudentReasoning: 'Students should observe that dividing the same whole into more pieces results in smaller individual pieces.',
      commonMisconceptions: ['Thinking 4 is larger than 2, so 1/4 must be bigger than 1/2.'],
      hint: 'Ask: "If you share 1 roti with 2 friends versus 4 friends, when is your piece bigger?"',
      quickCheck: `Ask ${studentNames[0] || 'student'} to draw 1/2 and 1/4 of two identical circles and point to the larger fraction.`,
      targetStudentIds: [],
    };
  }

  try {
    const cleanNames = studentNames.map(sanitizeStudentName);
    const prompt = `Generate a 7-minute targeted micro-intervention for student group (${cleanNames.join(', ')}).
Topic: "${concept}"
Observed misconception: "${misconception || 'Needs visual foundation'}"
Available materials: ${availableObjects?.join(', ') || 'paper, bottles, stones'}
Target language: ${language}

Provide a JSON object following this schema:
{
  "concept": "${concept}",
  "objective": "Clear 1-sentence learning objective",
  "timeRequiredMinutes": 7,
  "materialsRequired": ["list of 1-3 simple materials"],
  "teacherInstruction": "Step-by-step clear teacher direction",
  "questionsToAsk": ["Question 1", "Question 2"],
  "expectedStudentReasoning": "What correct reasoning sounds like",
  "commonMisconceptions": ["The specific misconception addressed"],
  "hint": "Relatable real-life hint for teacher to drop",
  "quickCheck": "10-second check for understanding"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      id: `interv-${Date.now()}`,
      concept: parsed.concept || concept,
      objective: parsed.objective || `Understand ${concept}`,
      timeRequiredMinutes: parsed.timeRequiredMinutes || 7,
      materialsRequired: parsed.materialsRequired || ['Paper'],
      teacherInstruction: parsed.teacherInstruction || 'Demonstrate using paper folding.',
      questionsToAsk: parsed.questionsToAsk || ['Which part is larger?'],
      expectedStudentReasoning: parsed.expectedStudentReasoning || 'Recognizes equal divisions.',
      commonMisconceptions: parsed.commonMisconceptions || [misconception || 'Denominator size confusion'],
      hint: parsed.hint || 'Use roti or fruit sharing example.',
      quickCheck: parsed.quickCheck || 'Ask student to point to 1/2 and 1/4.',
      targetStudentIds: [],
    };
  } catch (err) {
    console.error('Error generating intervention:', err instanceof Error ? err.message : 'Unknown error');
    return {
      id: `interv-${Date.now()}`,
      concept,
      objective: `Understand ${concept} through hands-on activity.`,
      timeRequiredMinutes: 7,
      materialsRequired: ['2 sheets of paper'],
      teacherInstruction: 'Fold paper into equal parts and compare.',
      questionsToAsk: ['Which piece is bigger?'],
      expectedStudentReasoning: 'More equal parts mean smaller pieces.',
      commonMisconceptions: [misconception || 'Denominator magnitude confusion'],
      hint: 'Relate to sharing a food item with friends.',
      quickCheck: 'Ask student to draw and compare 1/2 and 1/4.',
      targetStudentIds: [],
    };
  }
}

export async function analyzeRealWorldObjects(params: {
  objectsText?: string;
  imageBase64?: string;
  subject?: string;
  grade?: string;
}): Promise<RealWorldContextAnalysis> {
  const { objectsText = '', imageBase64, subject = 'Mathematics', grade = 'Grade 5' } = params;

  const ai = getGeminiClient();

  if (!ai) {
    return {
      detectedObjects: objectsText ? objectsText.split(',').map((s) => s.trim()) : ['Bicycle', 'Bucket', 'Rope'],
      educationalConnections: [
        {
          objectName: 'Bicycle',
          subject: 'Science & Math',
          concept: 'Rotational Motion, Circumference & Ratios',
          explanation: 'The wheel diameter determines distance covered in one revolution. Gear ratios show proportional reasoning.',
          classroomActivity: 'Measure wheel circumference with a rope. Count pedal turns vs wheel turns to demonstrate ratios.',
        },
        {
          objectName: 'Bucket',
          subject: 'Mathematics',
          concept: 'Volume, Capacity & Fractions',
          explanation: 'A bucket represents a whole container volume. Filling it with smaller cups demonstrates fractions (e.g., 4 cups = 1 bucket, so 1 cup = 1/4).',
          classroomActivity: 'Use small cups to fill a bucket. Ask students to estimate what fraction of the bucket is filled after 2 cups.',
        },
        {
          objectName: 'Rope',
          subject: 'Mathematics',
          concept: 'Length Measurement & Division into Equal Fractions',
          explanation: 'A rope can be folded into equal segments (halves, thirds, quarters) without needing a ruler.',
          classroomActivity: 'Fold a 1-meter rope into 4 equal segments to show quarters visually.',
        },
      ],
    };
  }

  try {
    const contents: any[] = [];
    if (imageBase64) {
      contents.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }

    contents.push({
      text: `Identify objects present in this classroom/environment: "${objectsText}".
Find genuine, defensible educational connections for ${grade} ${subject}.
Return JSON in this format:
{
  "detectedObjects": ["Object 1", "Object 2"],
  "educationalConnections": [
    {
      "objectName": "Name of object",
      "subject": "${subject}",
      "concept": "Relevant concept",
      "explanation": "Why this object cleanly illustrates the concept",
      "classroomActivity": "A 5-minute hands-on classroom activity using this object"
    }
  ]
}`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: 'You are an educational context specialist. Only suggest genuine, defensible curriculum connections. Do not force artificial links.',
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error('Error analyzing context objects:', err instanceof Error ? err.message : 'Unknown error');
    return {
      detectedObjects: ['Paper', 'Stones', 'Bottles'],
      educationalConnections: [
        {
          objectName: 'Paper',
          subject,
          concept: 'Fractions & Geometry',
          explanation: 'Paper folding provides immediate visual and tactile representation of equal fractional parts.',
          classroomActivity: 'Fold paper in half and quarters to compare sizes.',
        },
      ],
    };
  }
}

export async function generateBuildFromKnowledge(params: {
  childExperience: string;
  formalConcept: string;
  grade?: string;
}): Promise<BuildFromKnowledgeRecommendation> {
  const { childExperience, formalConcept, grade = 'Grade 5' } = params;

  const ai = getGeminiClient();

  if (!ai) {
    return {
      childExperience,
      formalConcept,
      learningBridge: `A child familiar with ${childExperience} already understands dividing a whole into equal portions for fair distribution.`,
      sampleDialogue: `Teacher: "When your family divides a field or shares harvest equally among 4 families, how do you make sure it's fair?"\nStudent: "Each family gets one equal part out of four."\nTeacher: "Exactly! In math, we call that equal part one-fourth or 1/4."`,
    };
  }

  try {
    const prompt = `A child in ${grade} has rich out-of-school life experience with: "${childExperience}".
Connect this lived experience to the formal curriculum concept: "${formalConcept}".

Return JSON:
{
  "childExperience": "${childExperience}",
  "formalConcept": "${formalConcept}",
  "learningBridge": "2-sentence pedagogical bridge connecting their experience to formal math/science terms",
  "sampleDialogue": "A brief teacher-student conversation showing how to introduce the concept using their background"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error('Error building from knowledge:', err instanceof Error ? err.message : 'Unknown error');
    return {
      childExperience,
      formalConcept,
      learningBridge: `Connect the child's intuitive experience in ${childExperience} to mathematical principles of equal division and proportion.`,
      sampleDialogue: `Teacher: "How do you share fairly when harvesting?"\nStudent: "We give equal parts to everyone."\nTeacher: "That is the exact idea of fractions!"`,
    };
  }
}
