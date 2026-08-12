import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, BookOpen, Compass, Lightbulb, Activity, RotateCcw } from 'lucide-react';
import { AnalysisResult, Classroom, Language, LearningGroup, LearningSession, MicroIntervention, Observation, Student, StudentProfile } from './types';
import { StorageManager } from './lib/storage';
import { apiAnalyzeContextObjects, apiAnalyzeObservation, apiBuildFromKnowledge, apiGenerateIntervention } from './lib/api';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ClassroomView } from './components/ClassroomView';
import { SessionView } from './components/SessionView';
import { ObservationModal } from './components/ObservationModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { InterventionModal } from './components/InterventionModal';
import { RealWorldContextModal } from './components/RealWorldContextModal';
import { BuildFromKnowledgeModal } from './components/BuildFromKnowledgeModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { EvidencePromptModal } from './components/EvidencePromptModal';

export default function App() {
  const [language, setLanguage] = useState<Language>(StorageManager.getLanguage());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'classroom' | 'session'>('dashboard');

  // Domain state
  const [classroom, setClassroom] = useState<Classroom>(StorageManager.getClassroom());
  const [students, setStudents] = useState<Student[]>(StorageManager.getStudents());
  const [session, setSession] = useState<LearningSession>(StorageManager.getSession());
  const [observations, setObservations] = useState<Observation[]>(StorageManager.getObservations());
  const [analyses, setAnalyses] = useState<AnalysisResult[]>(StorageManager.getAnalyses());
  const [groups, setGroups] = useState<LearningGroup[]>(StorageManager.getGroups());

  // Modal states
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [observationStudentId, setObservationStudentId] = useState<string | undefined>(undefined);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [vagueAnalysis, setVagueAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [activeIntervention, setActiveIntervention] = useState<MicroIntervention | null>(null);
  const [activeInterventionStudentName, setActiveInterventionStudentName] = useState<string | undefined>(undefined);
  const [showRealWorldModal, setShowRealWorldModal] = useState(false);
  const [showBuildKnowledgeModal, setShowBuildKnowledgeModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const showToast = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => setNotificationMessage(null), 4000);
  };

  useEffect(() => {
    StorageManager.setLanguage(language);
  }, [language]);

  const handleResetDemo = () => {
    StorageManager.resetToDemoData();
    setClassroom(StorageManager.getClassroom());
    setStudents(StorageManager.getStudents());
    setSession(StorageManager.getSession());
    setObservations(StorageManager.getObservations());
    setAnalyses(StorageManager.getAnalyses());
    setGroups(StorageManager.getGroups());
    showToast('Demo classroom reset to initial Grade 5 Fractions state with 20 students!');
  };

  const handleAddStudent = (firstName: string, code?: string) => {
    const newStudent = StorageManager.addStudent({
      classroomId: classroom.id,
      firstName,
      studentCode: code,
    });
    setStudents(StorageManager.getStudents());
    setClassroom(StorageManager.getClassroom());
  };

  const handleOpenQuickObservation = (studentId?: string) => {
    setObservationStudentId(studentId);
    setShowObservationModal(true);
  };

  const handleSubmitObservation = async (data: {
    studentId: string;
    studentName: string;
    understanding: Student['status'];
    participation: any;
    reasoning: any;
    note: string;
  }) => {
    setShowObservationModal(false);

    // Save observation
    const newObs = StorageManager.addObservation({
      sessionId: session.id,
      studentId: data.studentId,
      studentName: data.studentName,
      understanding: data.understanding,
      participation: data.participation,
      reasoning: data.reasoning,
      note: data.note,
    });

    setObservations(StorageManager.getObservations());
    setStudents(StorageManager.getStudents());

    // Trigger Gemini AI Analysis via Server API Route
    try {
      const analysis = await apiAnalyzeObservation({
        studentName: data.studentName,
        topic: session.topic,
        understanding: data.understanding,
        participation: data.participation,
        reasoning: data.reasoning,
        note: data.note,
        availableObjects: session.availableObjects,
        language,
      });

      analysis.studentId = data.studentId;
      analysis.observationId = newObs.id;

      if (analysis.isVagueEvidence) {
        setVagueAnalysis(analysis);
      } else {
        StorageManager.addAnalysis(analysis);
        setAnalyses(StorageManager.getAnalyses());
      }
    } catch (err: any) {
      showToast(err?.message || "You've reached the demo usage limit. Please try again later.");
    }
  };

  const handleResolveVagueEvidence = async (selectedOption: string) => {
    if (!vagueAnalysis) return;

    const refinedNote = `${vagueAnalysis.observedEvidence} Specific observed issue: ${selectedOption}`;

    try {
      const reAnalysis = await apiAnalyzeObservation({
        studentName: vagueAnalysis.studentName,
        topic: session.topic,
        understanding: vagueAnalysis.status,
        participation: 'active',
        reasoning: 'misconception_detected',
        note: refinedNote,
        availableObjects: session.availableObjects,
        language,
      });

      reAnalysis.studentId = vagueAnalysis.studentId;
      reAnalysis.observationId = vagueAnalysis.observationId;

      StorageManager.addAnalysis(reAnalysis);
      setAnalyses(StorageManager.getAnalyses());
      setVagueAnalysis(null);
    } catch (err: any) {
      showToast(err?.message || "You've reached the demo usage limit. Please try again later.");
    }
  };

  const handleOpenInterventionFromAnalysis = async (analysis: AnalysisResult) => {
    try {
      const intervention = await apiGenerateIntervention({
        concept: analysis.concept,
        misconception: analysis.possibleMisconception,
        studentNames: [analysis.studentName],
        availableObjects: session.availableObjects,
        language,
      });

      setActiveIntervention(intervention);
      setActiveInterventionStudentName(analysis.studentName);
    } catch (err: any) {
      showToast(err?.message || "You've reached the demo usage limit. Please try again later.");
    }
  };

  const handleOpenGroupIntervention = (group: LearningGroup) => {
    if (group.recommendedIntervention) {
      setActiveIntervention(group.recommendedIntervention);
      setActiveInterventionStudentName(group.name);
    }
  };

  const handleRecordFeedback = (rating: 'very_useful' | 'somewhat_useful' | 'not_useful', reasons: string[]) => {
    StorageManager.addFeedback({
      usefulRating: rating,
      reasons,
    });
  };

  const selectedStudentProfile: StudentProfile | null = selectedStudentForProfile
    ? StorageManager.getStudentProfile(selectedStudentForProfile.id)
    : null;

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#333333] font-sans flex flex-col antialiased selection:bg-[#c97b5d]/25">
      {/* Top Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onResetDemo={handleResetDemo}
        onOpenAnalytics={() => setShowAnalyticsModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#e5e0d5] pb-2 overflow-x-auto">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#5a634e] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#f8f6f0]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('classroom')}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'classroom'
                  ? 'bg-[#5a634e] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#f8f6f0]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Classroom Map ({students.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('session')}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'session'
                  ? 'bg-[#5a634e] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#f8f6f0]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Teaching Session</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowRealWorldModal(true)}
              className="bg-white hover:bg-[#f8f6f0] text-slate-700 border border-[#e5e0d5] px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs font-medium"
            >
              <Compass className="w-4 h-4 text-[#c97b5d]" />
              <span>Use What's Around Us</span>
            </button>

            <button
              onClick={() => setShowBuildKnowledgeModal(true)}
              className="bg-white hover:bg-[#f8f6f0] text-slate-700 border border-[#e5e0d5] px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs font-medium"
            >
              <Lightbulb className="w-4 h-4 text-[#5a634e]" />
              <span>Build From Knowledge</span>
            </button>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <Dashboard
            language={language}
            classroom={classroom}
            session={session}
            students={students}
            groups={groups}
            onOpenQuickObservation={handleOpenQuickObservation}
            onSelectStudent={(id) => {
              const st = students.find((s) => s.id === id);
              if (st) setSelectedStudentForProfile(st);
            }}
            onOpenGroupIntervention={handleOpenGroupIntervention}
            onOpenRealWorldContext={() => setShowRealWorldModal(true)}
            onOpenBuildFromKnowledge={() => setShowBuildKnowledgeModal(true)}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'classroom' && (
          <ClassroomView
            language={language}
            classroom={classroom}
            students={students}
            onAddStudent={handleAddStudent}
            onSelectStudent={(id) => {
              const st = students.find((s) => s.id === id);
              if (st) setSelectedStudentForProfile(st);
            }}
            onOpenQuickObservation={handleOpenQuickObservation}
          />
        )}

        {activeTab === 'session' && (
          <SessionView
            language={language}
            session={session}
            students={students}
            observations={observations}
            analyses={analyses}
            onOpenQuickObservation={handleOpenQuickObservation}
            onOpenIntervention={handleOpenInterventionFromAnalysis}
            onRecordFeedback={handleRecordFeedback}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e0d5] bg-[#fdfcf8] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-serif italic font-medium text-[#5a634e]">Learning Lens — Teacher-First AI Learning Intelligence Layer</span>
          <span className="text-[11px] text-slate-400">Designed for low-resource & multigrade classrooms • Vercel Ready</span>
        </div>
      </footer>

      {/* MODALS */}

      {/* Observation Capture Modal */}
      {showObservationModal && (
        <ObservationModal
          language={language}
          students={students}
          initialStudentId={observationStudentId}
          onClose={() => setShowObservationModal(false)}
          onSubmitObservation={handleSubmitObservation}
        />
      )}

      {/* Prompt for Evidence Modal when evidence is vague */}
      {vagueAnalysis && (
        <EvidencePromptModal
          studentName={vagueAnalysis.studentName}
          question={vagueAnalysis.vagueEvidenceQuestion || 'What specific error did the student make?'}
          options={vagueAnalysis.vagueEvidenceOptions || []}
          onClose={() => setVagueAnalysis(null)}
          onSelectOption={handleResolveVagueEvidence}
        />
      )}

      {/* Student Profile Modal */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          language={language}
          student={selectedStudentForProfile}
          profile={selectedStudentProfile}
          onClose={() => setSelectedStudentForProfile(null)}
          onOpenQuickObservation={(id) => {
            setSelectedStudentForProfile(null);
            handleOpenQuickObservation(id);
          }}
        />
      )}

      {/* Micro-Intervention Modal */}
      {activeIntervention && (
        <InterventionModal
          language={language}
          intervention={activeIntervention}
          studentName={activeInterventionStudentName}
          onClose={() => setActiveIntervention(null)}
          onMarkComplete={() => setActiveIntervention(null)}
        />
      )}

      {/* Real-World Context Engine Modal */}
      {showRealWorldModal && (
        <RealWorldContextModal
          language={language}
          onClose={() => setShowRealWorldModal(false)}
          onAnalyzeContext={(objectsText, imageBase64) =>
            apiAnalyzeContextObjects({ objectsText, imageBase64 })
          }
        />
      )}

      {/* Build From Knowledge Modal */}
      {showBuildKnowledgeModal && (
        <BuildFromKnowledgeModal
          language={language}
          onClose={() => setShowBuildKnowledgeModal(false)}
          onGenerateBridge={(childExperience, formalConcept) =>
            apiBuildFromKnowledge({ childExperience, formalConcept })
          }
        />
      )}

      {/* Analytics & Vercel Readiness Modal */}
      {showAnalyticsModal && (
        <AnalyticsModal
          language={language}
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}

      {/* Floating Notification Toast */}
      {notificationMessage && (
        <div className="fixed bottom-6 right-6 bg-[#5a634e] text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2 border border-white/20 animate-fade-in">
          <span>✓</span>
          <span>{notificationMessage}</span>
        </div>
      )}
    </div>
  );
}
