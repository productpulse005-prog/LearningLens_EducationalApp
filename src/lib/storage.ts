import { AnalyticsEvent, AnalysisResult, Classroom, LearningGroup, LearningSession, MicroIntervention, Observation, Student, StudentProfile, TeacherFeedback } from '../types';
import { DEMO_CLASSROOM, DEMO_GROUPS, DEMO_OBSERVATIONS, DEMO_PROFILES, DEMO_SESSION, DEMO_STUDENTS } from './demoData';

const KEYS = {
  CLASSROOM: 'learning_lens_classroom',
  STUDENTS: 'learning_lens_students',
  SESSION: 'learning_lens_session',
  OBSERVATIONS: 'learning_lens_observations',
  ANALYSES: 'learning_lens_analyses',
  GROUPS: 'learning_lens_groups',
  PROFILES: 'learning_lens_profiles',
  FEEDBACK: 'learning_lens_feedback',
  ANALYTICS: 'learning_lens_analytics',
  LANGUAGE: 'learning_lens_language',
};

// Safe localStorage getItem with default
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Error reading key ${key} from localStorage:`, err);
    return defaultValue;
  }
}

// Safe localStorage setItem
function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error setting key ${key} to localStorage:`, err);
  }
}

export class StorageManager {
  static getLanguage(): 'en' | 'hi' | 'mr' {
    return getItem<'en' | 'hi' | 'mr'>(KEYS.LANGUAGE, 'mr');
  }

  static setLanguage(lang: 'en' | 'hi' | 'mr'): void {
    setItem(KEYS.LANGUAGE, lang);
  }

  static getClassroom(): Classroom {
    return getItem<Classroom>(KEYS.CLASSROOM, DEMO_CLASSROOM);
  }

  static setClassroom(classroom: Classroom): void {
    setItem(KEYS.CLASSROOM, classroom);
  }

  static getStudents(): Student[] {
    return getItem<Student[]>(KEYS.STUDENTS, DEMO_STUDENTS);
  }

  static saveStudents(students: Student[]): void {
    setItem(KEYS.STUDENTS, students);
  }

  static addStudent(student: Omit<Student, 'id' | 'status' | 'missedSessions'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...student,
      id: `s-${Date.now()}`,
      status: 'unclear',
      missedSessions: [],
    };
    const updated = [...students, newStudent];
    this.saveStudents(updated);
    
    // update classroom student count
    const classroom = this.getClassroom();
    classroom.studentCount = updated.length;
    this.setClassroom(classroom);

    this.logAnalytics('student_added', { studentId: newStudent.id, name: newStudent.firstName });
    return newStudent;
  }

  static updateStudentStatus(studentId: string, status: Student['status'], note?: string): void {
    const students = this.getStudents();
    const updated = students.map((s) => {
      if (s.id === studentId) {
        return { ...s, status, notes: note || s.notes };
      }
      return s;
    });
    this.saveStudents(updated);
  }

  static getSession(): LearningSession {
    return getItem<LearningSession>(KEYS.SESSION, DEMO_SESSION);
  }

  static saveSession(session: LearningSession): void {
    setItem(KEYS.SESSION, session);
    this.logAnalytics('session_started', { sessionId: session.id, topic: session.topic });
  }

  static getObservations(): Observation[] {
    return getItem<Observation[]>(KEYS.OBSERVATIONS, DEMO_OBSERVATIONS);
  }

  static addObservation(obs: Omit<Observation, 'id' | 'timestamp'>): Observation {
    const observations = this.getObservations();
    const newObs: Observation = {
      ...obs,
      id: `obs-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newObs, ...observations];
    setItem(KEYS.OBSERVATIONS, updated);

    // Update student status
    this.updateStudentStatus(obs.studentId, obs.understanding, obs.note);
    this.logAnalytics('observation_added', { studentId: obs.studentId, understanding: obs.understanding });

    return newObs;
  }

  static getAnalyses(): AnalysisResult[] {
    return getItem<AnalysisResult[]>(KEYS.ANALYSES, []);
  }

  static addAnalysis(analysis: AnalysisResult): void {
    const list = this.getAnalyses();
    setItem(KEYS.ANALYSES, [analysis, ...list]);
    this.logAnalytics('ai_analysis_generated', { studentId: analysis.studentId, misconception: analysis.possibleMisconception });

    // Update student profile
    this.updateStudentProfileWithAnalysis(analysis);
  }

  static getGroups(): LearningGroup[] {
    return getItem<LearningGroup[]>(KEYS.GROUPS, DEMO_GROUPS);
  }

  static saveGroups(groups: LearningGroup[]): void {
    setItem(KEYS.GROUPS, groups);
    this.logAnalytics('learning_group_created', { count: groups.length });
  }

  static getProfiles(): Record<string, StudentProfile> {
    return getItem<Record<string, StudentProfile>>(KEYS.PROFILES, DEMO_PROFILES);
  }

  static getStudentProfile(studentId: string): StudentProfile | null {
    const profiles = this.getProfiles();
    if (profiles[studentId]) return profiles[studentId];

    // Create default profile if missing
    const student = this.getStudents().find((s) => s.id === studentId);
    if (!student) return null;

    const newProfile: StudentProfile = {
      studentId: student.id,
      firstName: student.firstName,
      grade: 'Grade 5',
      missedSessions: student.missedSessions || [],
      concepts: [],
    };
    return newProfile;
  }

  static updateStudentProfileWithAnalysis(analysis: AnalysisResult): void {
    const profiles = this.getProfiles();
    const student = this.getStudents().find((s) => s.id === analysis.studentId);
    if (!student) return;

    const currentProfile = profiles[analysis.studentId] || {
      studentId: student.id,
      firstName: student.firstName,
      grade: 'Grade 5',
      missedSessions: student.missedSessions || [],
      concepts: [],
    };

    // Find or add concept
    const existingIndex = currentProfile.concepts.findIndex(
      (c) => c.conceptName.toLowerCase() === analysis.concept.toLowerCase()
    );

    const newConcept = {
      conceptName: analysis.concept,
      status: analysis.status,
      observedMisconception: analysis.possibleMisconception,
      evidenceSummary: analysis.observedEvidence,
      lastUpdated: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      currentProfile.concepts[existingIndex] = newConcept;
    } else {
      currentProfile.concepts.push(newConcept);
    }

    // Generate parent summary tip
    currentProfile.parentSummary = {
      en: `Today ${student.firstName} worked on ${analysis.concept}. Progress: ${analysis.status}. ${analysis.recommendedInterventionSummary}`,
      hi: `आज ${student.firstName} ने ${analysis.concept} पर काम किया। प्रगति: ${analysis.status}।`,
      mr: `आज ${student.firstName} ने ${analysis.concept} वर काम केले. प्रगती: ${analysis.status}.`,
      atHomeTip: `Practice comparing equal parts at home using paper or fruit.`,
    };

    profiles[analysis.studentId] = currentProfile;
    setItem(KEYS.PROFILES, profiles);
    this.logAnalytics('student_profile_updated', { studentId: analysis.studentId });
  }

  static addFeedback(feedback: Omit<TeacherFeedback, 'id' | 'createdAt'>): TeacherFeedback {
    const list = getItem<TeacherFeedback[]>(KEYS.FEEDBACK, []);
    const newFb: TeacherFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setItem(KEYS.FEEDBACK, [newFb, ...list]);
    this.logAnalytics('teacher_feedback_recorded', { rating: feedback.usefulRating });
    return newFb;
  }

  static getAnalytics(): AnalyticsEvent[] {
    return getItem<AnalyticsEvent[]>(KEYS.ANALYTICS, []);
  }

  static logAnalytics(eventName: string, payload?: Record<string, any>): void {
    const list = this.getAnalytics();
    const event: AnalyticsEvent = {
      eventName,
      timestamp: new Date().toISOString(),
      payload,
    };
    setItem(KEYS.ANALYTICS, [event, ...list.slice(0, 99)]);
  }

  static resetToDemoData(): void {
    localStorage.removeItem(KEYS.CLASSROOM);
    localStorage.removeItem(KEYS.STUDENTS);
    localStorage.removeItem(KEYS.SESSION);
    localStorage.removeItem(KEYS.OBSERVATIONS);
    localStorage.removeItem(KEYS.ANALYSES);
    localStorage.removeItem(KEYS.GROUPS);
    localStorage.removeItem(KEYS.PROFILES);
    localStorage.removeItem(KEYS.FEEDBACK);
    localStorage.removeItem(KEYS.ANALYTICS);
    
    setItem(KEYS.CLASSROOM, DEMO_CLASSROOM);
    setItem(KEYS.STUDENTS, DEMO_STUDENTS);
    setItem(KEYS.SESSION, DEMO_SESSION);
    setItem(KEYS.OBSERVATIONS, DEMO_OBSERVATIONS);
    setItem(KEYS.GROUPS, DEMO_GROUPS);
    setItem(KEYS.PROFILES, DEMO_PROFILES);
  }
}
