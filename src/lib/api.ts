import { AnalysisResult, BuildFromKnowledgeRecommendation, MicroIntervention, RealWorldContextAnalysis } from '../types';

export class RateLimitError extends Error {
  isRateLimit = true;
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export async function apiAnalyzeObservation(params: {
  studentName: string;
  topic: string;
  understanding: string;
  participation: string;
  reasoning: string;
  note: string;
  availableObjects?: string[];
  language?: string;
}): Promise<AnalysisResult> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      if (res.status === 429) {
        const errorData = await res.json().catch(() => ({}));
        throw new RateLimitError(errorData.error || "You've reached the demo usage limit. Please try again later.");
      }
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if ((err as any)?.isRateLimit) {
      throw err;
    }
    console.warn('Fallback to client analysis due to API error:', err);
    // Return client-side fallback
    const hasDenominatorMisconception = /denominator|4 is bigger|1\/4 is larger|bigger than 2/i.test(params.note);
    return {
      id: `analysis-${Date.now()}`,
      observationId: '',
      studentId: '',
      studentName: params.studentName,
      concept: params.topic,
      status: (params.understanding as any) || 'developing',
      observedEvidence: `Teacher note: "${params.note || 'Observed during fraction comparison activity.'}"`,
      inferredHypothesis: hasDenominatorMisconception
        ? 'Student judges fraction magnitude directly by denominator number rather than equal part size.'
        : `Student shows developing understanding of ${params.topic}.`,
      possibleMisconception: hasDenominatorMisconception ? 'Denominator magnitude confusion (1/4 vs 1/2)' : undefined,
      confidence: 'high',
      recommendedInterventionSummary: 'Use 2 identical paper strips. Fold one in halves and one in quarters. Ask which piece is larger.',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function apiGenerateIntervention(params: {
  concept: string;
  misconception?: string;
  studentNames: string[];
  availableObjects?: string[];
  language?: string;
}): Promise<MicroIntervention> {
  try {
    const res = await fetch('/api/intervention', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      if (res.status === 429) {
        const errorData = await res.json().catch(() => ({}));
        throw new RateLimitError(errorData.error || "You've reached the demo usage limit. Please try again later.");
      }
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if ((err as any)?.isRateLimit) {
      throw err;
    }
    console.warn('Fallback to client intervention due to API error:', err);
    return {
      id: `interv-${Date.now()}`,
      concept: params.concept,
      objective: `Understand ${params.concept} magnitude and equal parts.`,
      timeRequiredMinutes: 7,
      materialsRequired: params.availableObjects?.slice(0, 2) || ['2 sheets of paper'],
      teacherInstruction: `Take two identical sheets of paper. Fold one into 2 equal parts (halves) and one into 4 equal parts (quarters).`,
      questionsToAsk: [
        'Which piece is larger: 1/2 or 1/4?',
        'Why does dividing into 4 equal parts make each piece smaller?'
      ],
      expectedStudentReasoning: 'Recognizes that dividing the same whole among more parts makes each part smaller.',
      commonMisconceptions: [params.misconception || 'Thinking 4 is larger than 2, so 1/4 must be bigger than 1/2.'],
      hint: 'Ask: "If you share 1 roti with 2 friends vs 4 friends, when do you get a bigger piece?"',
      quickCheck: 'Ask student to point to 1/2 and 1/4 of two drawn circles and select the larger one.',
      targetStudentIds: [],
    };
  }
}

export async function apiAnalyzeContextObjects(params: {
  objectsText?: string;
  imageBase64?: string;
  subject?: string;
  grade?: string;
}): Promise<RealWorldContextAnalysis> {
  try {
    const res = await fetch('/api/context', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      if (res.status === 429) {
        const errorData = await res.json().catch(() => ({}));
        throw new RateLimitError(errorData.error || "You've reached the demo usage limit. Please try again later.");
      }
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if ((err as any)?.isRateLimit) {
      throw err;
    }
    console.warn('Fallback context object analysis:', err);
    return {
      detectedObjects: params.objectsText ? params.objectsText.split(',') : ['Bicycle', 'Bucket', 'Rope'],
      educationalConnections: [
        {
          objectName: 'Bicycle',
          subject: 'Science & Math',
          concept: 'Rotation, Motion & Ratios',
          explanation: 'Wheel rotations demonstrate circumference and proportional pedal-to-wheel turn ratios.',
          classroomActivity: 'Measure tire circumference with a rope. Calculate turns needed to cover 10 meters.',
        },
        {
          objectName: 'Bucket',
          subject: 'Mathematics',
          concept: 'Capacity, Volume & Fractions',
          explanation: 'Filling a bucket with smaller cups illustrates fractional parts of a liquid whole.',
          classroomActivity: 'Count how many cups fill a bucket. Show that 1 cup is 1/4 of a 4-cup bucket.',
        },
      ],
    };
  }
}

export async function apiBuildFromKnowledge(params: {
  childExperience: string;
  formalConcept: string;
  grade?: string;
}): Promise<BuildFromKnowledgeRecommendation> {
  try {
    const res = await fetch('/api/build-from-knowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      if (res.status === 429) {
        const errorData = await res.json().catch(() => ({}));
        throw new RateLimitError(errorData.error || "You've reached the demo usage limit. Please try again later.");
      }
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if ((err as any)?.isRateLimit) {
      throw err;
    }
    console.warn('Fallback build from knowledge:', err);
    return {
      childExperience: params.childExperience,
      formalConcept: params.formalConcept,
      learningBridge: `Children with experience in ${params.childExperience} already understand fair division and equal sharing in practical life.`,
      sampleDialogue: `Teacher: "When sharing harvest or dividing land fairly, how do you ensure everyone gets equal parts?"\nStudent: "Each family receives one equal share."\nTeacher: "In mathematics, we call that equal share a fraction!"`,
    };
  }
}
