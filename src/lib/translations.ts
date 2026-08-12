import { Language } from '../types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appName: 'Learning Lens',
    appSubtitle: 'AI Learning Intelligence for Classrooms',
    teacherAuth: 'Teacher Authority Preserved',
    demoMode: 'Demo Mode (Grade 5 Math - Marathi/English)',
    resetDemo: 'Reset Demo Data',
    
    // Nav
    dashboard: 'Dashboard',
    classroom: 'Classroom & Map',
    activeSession: 'Teaching Session',
    realWorldContext: 'Use What’s Around Us',
    buildKnowledge: 'Build From What They Know',
    analytics: 'Analytics & Feedback',

    // Dashboard
    todaysSession: 'Today’s Active Session',
    topic: 'Topic',
    studentsNeedingAttention: 'Students Needing Attention',
    recentMisconceptions: 'Detected Misconceptions',
    activeGroups: 'Targeted Learning Groups',
    quickObservation: 'Record Quick Observation (<15s)',
    startSession: 'Start New Session',
    
    // Status badges
    strong: 'Demonstrated Understanding 🟢',
    developing: 'Developing 🟡',
    struggling: 'Needs Targeted Support 🔴',
    unclear: 'Unclear ⚪',

    // Observation
    student: 'Student',
    understandingLevel: 'Understanding Level',
    participationLevel: 'Participation',
    reasoningMode: 'Reasoning Mode',
    teacherNote: 'Teacher Observation / Voice Note',
    notePlaceholder: 'e.g., Aarav thinks 1/4 is larger than 1/2 because 4 is bigger than 2.',
    saveObservation: 'Analyze with Gemini AI ✦',
    voiceInput: 'Voice Note',
    voiceListening: 'Listening... Speak observation now',

    // Analysis
    observedEvidence: 'Observed Evidence 🔍',
    inferredHypothesis: 'AI Inferred Hypothesis 💡',
    misconceptionDetected: 'Potential Misconception Detected ⚡',
    recommendedIntervention: 'Recommended Micro-Intervention 🎯',
    confidence: 'AI Confidence',
    
    // Intervention
    viewMicroIntervention: 'View 7-Min Micro-Intervention',
    materials: 'Materials Needed',
    teacherSteps: 'Teacher Instructions',
    questionsToAsk: 'Questions to Ask Students',
    expectedReasoning: 'Expected Student Reasoning',
    quickCheck: 'Quick Check for Understanding',

    // Parent Mode
    parentSummary: 'Parent Summary (Simple & Actionable)',
    atHomeTip: 'At-Home Practice Tip',

    // Context & Objects
    objectUpload: 'Take or Upload Classroom Object Photo',
    enterObjects: 'Or Type Available Objects',
    analyzeObjects: 'Find Educational Connections ✦',
    objectsPlaceholder: 'e.g., bicycle, bucket, rope, measuring cup, paper',
  },

  hi: {
    appName: 'लर्निंग लेंस',
    appSubtitle: 'शिक्षकों के लिए AI शिक्षण बुद्धिमत्ता',
    teacherAuth: 'शिक्षक की स्वायत्तता सर्वोपरि',
    demoMode: 'डेमो मोड (कक्षा 5 गणित)',
    resetDemo: 'डेमो डेटा रीसेट करें',

    dashboard: 'डैशबोर्ड',
    classroom: 'कक्षा और मैपिंग',
    activeSession: 'शिक्षण सत्र',
    realWorldContext: 'आस-पास की वस्तुओं का उपयोग',
    buildKnowledge: 'अनुभव से सीखें',
    analytics: 'विश्लेषण और प्रतिक्रिया',

    todaysSession: 'आज का सक्रिय सत्र',
    topic: 'विषय',
    studentsNeedingAttention: 'ध्यान देने योग्य छात्र',
    recentMisconceptions: 'पहचानी गई भ्रांतियां',
    activeGroups: 'लक्षित शिक्षण समूह',
    quickObservation: 'त्वरित अवलोकन दर्ज करें (<15s)',
    startSession: 'नया सत्र शुरू करें',

    strong: 'स्पष्ट समझ 🟢',
    developing: 'प्रगति पर 🟡',
    struggling: 'सहायता की आवश्यकता 🔴',
    unclear: 'अस्पष्ट ⚪',

    student: 'छात्र',
    understandingLevel: 'समझ का स्तर',
    participationLevel: 'भागीदारी',
    reasoningMode: 'तर्क विधि',
    teacherNote: 'शिक्षक अवलोकन / वॉयस नोट',
    notePlaceholder: 'जैसे: आरव मानता है कि 1/4, 1/2 से बड़ा है क्योंकि 4, 2 से बड़ा है।',
    saveObservation: 'Gemini AI से विश्लेषण करें ✦',
    voiceInput: 'वॉयस इनपुट',
    voiceListening: 'सुन रहा है... बोलिए',

    observedEvidence: 'देखा गया साक्ष्य 🔍',
    inferredHypothesis: 'AI अनुमानित परिकल्पना 💡',
    misconceptionDetected: 'संभावित भ्रांति ⚡',
    recommendedIntervention: 'अनुशंसित सूक्ष्म-हस्तक्षेप 🎯',
    confidence: 'AI विश्वसनीयता',

    viewMicroIntervention: '7-मिनट सूक्ष्म-गतिविधि देखें',
    materials: 'आवश्यक सामग्री',
    teacherSteps: 'शिक्षक निर्देश',
    questionsToAsk: 'छात्रों से पूछे जाने वाले प्रश्न',
    expectedReasoning: 'अपेक्षित तर्क',
    quickCheck: 'त्वरित समझ जांच',

    parentSummary: 'अभिभावक सारांश',
    atHomeTip: 'घर पर अभ्यास का सुझाव',

    objectUpload: 'कक्षा की वस्तु की फोटो लें/अपलोड करें',
    enterObjects: 'या उपलब्ध वस्तुओं के नाम लिखें',
    analyzeObjects: 'शैक्षणिक संबंध खोजें ✦',
    objectsPlaceholder: 'जैसे: साइकिल, बाल्टी, रस्सी, कागज',
  },

  mr: {
    appName: 'लर्निंग लेन्स',
    appSubtitle: 'शिक्षकांसाठी AI शिक्षण बुद्धिमत्ता',
    teacherAuth: 'शिक्षकांचे शैक्षणिक अधिकार अबाधित',
    demoMode: 'डेमो मोड (इयत्ता ५ वी गणित - मराठी)',
    resetDemo: 'डेमो डेटा रिसेट करा',

    dashboard: 'डॅशबोर्ड',
    classroom: 'वर्ग व मॅपिंग',
    activeSession: 'अध्यापन सत्र',
    realWorldContext: 'भोवतालच्या वस्तूंचा वापर',
    buildKnowledge: 'अनुभवातून संकल्पना',
    analytics: 'विश्लेषण व अभिप्राय',

    todaysSession: 'आजचे सक्रिय सत्र',
    topic: 'घटक / विषय',
    studentsNeedingAttention: 'लक्ष देण्याची गरज असलेले विद्यार्थी',
    recentMisconceptions: 'आढळून आलेल्या गणितातील चुका',
    activeGroups: 'लक्षित शिकणारे गट',
    quickObservation: 'जलद नोंद करा (<१५ सेकंद)',
    startSession: 'नवीन सत्र सुरू करा',

    strong: 'स्पष्ट समज 🟢',
    developing: 'प्रगतीपथावर 🟡',
    struggling: 'विशेष मदतीची गरज 🔴',
    unclear: 'अस्पष्ट ⚪',

    student: 'विद्यार्थी',
    understandingLevel: 'समजीची पातळी',
    participationLevel: 'सहभाग',
    reasoningMode: 'तर्क पद्धती',
    teacherNote: 'शिक्षक निरीक्षण / व्हॉइस नोंद',
    notePlaceholder: 'उदा. आरव मानतो की ४ हा २ पेक्षा मोठा आहे म्हणून १/४ हा १/२ पेक्षा मोठा आहे.',
    saveObservation: 'Gemini AI द्वारे विश्लेषण करा ✦',
    voiceInput: 'व्हॉइस इनपुट',
    voiceListening: 'ऐकत आहे... आता बोला',

    observedEvidence: 'प्रत्यक्ष निरीक्षण साक्ष्य 🔍',
    inferredHypothesis: 'AI चे शैक्षणिक विश्लेषण 💡',
    misconceptionDetected: 'आढळून आलेली संकल्पनात्मक चूक ⚡',
    recommendedIntervention: 'सुचवलेला ७ मिनिटांचा उपक्रम 🎯',
    confidence: 'AI आत्मविश्वास',

    viewMicroIntervention: '७-मिनिटांचा सूक्ष्म उपक्रम पहा',
    materials: 'लागणारे साहित्य',
    teacherSteps: 'शिक्षकांसाठी मार्गदर्शन',
    questionsToAsk: 'विद्यार्थ्यांना विचारायचे प्रश्न',
    expectedReasoning: 'अपेक्षित तर्क',
    quickCheck: 'जलद समजाची तपासणी',

    parentSummary: 'पालकांसाठी सोपा सारांश',
    atHomeTip: 'घरी करायचा सराव',

    objectUpload: 'वस्तूचा फोटो घ्या किंवा अपलोड करा',
    enterObjects: 'किंवा उपलब्ध वस्तूंची नावे लिहा',
    analyzeObjects: 'शैक्षणिक संबंध शोधा ✦',
    objectsPlaceholder: 'उदा. सायकल, बादली, दोरी, कागद, पेन्सिल',
  },
};
