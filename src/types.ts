export type Language = 'en' | 'hi' | 'mr';

export type UnderstandingLevel = 'strong' | 'developing' | 'struggling' | 'unclear';

export type ParticipationLevel = 'active' | 'occasional' | 'quiet' | 'not_participating';

export type ReasoningLevel = 'explains' | 'correct_no_explanation' | 'needs_prompting' | 'misconception_detected';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface Student {
  id: string;
  classroomId: string;
  firstName: string;
  studentCode?: string;
  avatar?: string;
  status: UnderstandingLevel;
  missedSessions: string[];
  notes?: string;
}

export interface Classroom {
  id: string;
  name: string;
  grade: string;
  subject: string;
  language: Language;
  studentCount: number;
  createdAt: string;
}

export interface LearningSession {
  id: string;
  classroomId: string;
  subject: string;
  topic: string;
  objective: string;
  durationMinutes: number;
  language: Language;
  availableObjects: string[];
  createdAt: string;
  status: 'active' | 'completed';
}

export interface Observation {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  understanding: UnderstandingLevel;
  participation: ParticipationLevel;
  reasoning: ReasoningLevel;
  note: string;
  timestamp: string;
}

export interface AnalysisResult {
  id: string;
  observationId: string;
  studentId: string;
  studentName: string;
  concept: string;
  status: UnderstandingLevel;
  observedEvidence: string;
  inferredHypothesis: string;
  possibleMisconception?: string;
  confidence: ConfidenceLevel;
  recommendedInterventionSummary: string;
  timestamp: string;
  isVagueEvidence?: boolean;
  vagueEvidenceQuestion?: string;
  vagueEvidenceOptions?: string[];
}

export interface MicroIntervention {
  id: string;
  concept: string;
  objective: string;
  timeRequiredMinutes: number;
  materialsRequired: string[];
  teacherInstruction: string;
  questionsToAsk: string[];
  expectedStudentReasoning: string;
  commonMisconceptions: string[];
  hint: string;
  quickCheck: string;
  targetStudentIds: string[];
  groupName?: string;
}

export interface LearningGroup {
  id: string;
  classroomId: string;
  topic: string;
  name: string;
  description: string;
  studentIds: string[];
  recommendedIntervention?: MicroIntervention;
}

export interface StudentConceptProfile {
  conceptName: string;
  status: UnderstandingLevel;
  observedMisconception?: string;
  evidenceSummary: string;
  lastUpdated: string;
}

export interface ParentSummary {
  en: string;
  hi: string;
  mr: string;
  atHomeTip: string;
}

export interface StudentProfile {
  studentId: string;
  firstName: string;
  grade: string;
  concepts: StudentConceptProfile[];
  missedSessions: string[];
  parentSummary?: ParentSummary;
}

export interface TeacherFeedback {
  id: string;
  analysisId?: string;
  interventionId?: string;
  usefulRating: 'very_useful' | 'somewhat_useful' | 'not_useful';
  reasons: string[];
  createdAt: string;
}

export interface EducationalConnection {
  objectName: string;
  subject: string;
  concept: string;
  explanation: string;
  classroomActivity: string;
}

export interface RealWorldContextAnalysis {
  detectedObjects: string[];
  educationalConnections: EducationalConnection[];
}

export interface BuildFromKnowledgeRecommendation {
  childExperience: string;
  formalConcept: string;
  learningBridge: string;
  sampleDialogue: string;
}

export interface AnalyticsEvent {
  eventName: string;
  timestamp: string;
  payload?: Record<string, any>;
}
