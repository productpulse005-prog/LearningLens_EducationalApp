# Learning Lens — AI Learning Intelligence Layer for Teachers

**Learning Lens** is a production-ready AI education web application that acts as a **Learning Intelligence Layer** for teachers in low-resource and multigrade classrooms.

The product hypothesis:
> *"A teacher may understand how to teach a concept, but cannot realistically observe, remember, analyze and personalize learning for every child continuously."*

AI does **NOT** replace the teacher. The teacher maintains full pedagogical and contextual authority. Learning Lens provides learning intelligence: remembering signals, detecting misconceptions, auto-grouping cohorts, and recommending 7-minute micro-interventions using available classroom objects.

---

## 🌟 Key Features

1. **Quick Observation Capture (<15s per child)**: Fast structured inputs with optional voice-to-text.
2. **Gemini AI Misconception Detection**: Server-side `@google/genai` analysis separating *Observed Evidence* from *Inferred Hypothesis*.
3. **AI Evidence Prompts**: If teacher notes are vague (e.g. "Rahul is weak in fractions"), AI asks for specific evidence before concluding.
4. **Classroom Learning Map & Cohort Grouping**: Visual breakdown (🟢 Demonstrated, 🟡 Developing, 🔴 Support Needed) with auto-grouped cohorts.
5. **7-Minute Micro-Interventions**: Low-cost activities using paper, bottles, stones, and fruits instead of long lesson plans.
6. **"Use What's Around Us" Real-World Engine**: Multimodal photo/text analysis connecting everyday objects (bicycles, buckets, rope) to math & science concepts.
7. **"Build From What They Know"**: Connects child's out-of-school life experience (farming, market, games) to formal curriculum concepts.
8. **Parent Mode & Multi-Language Support**: Simple parent summaries in **Marathi (मराठी)**, **Hindi (हिंदी)**, and **English** with at-home practice tips.
9. **Demo Mode**: Pre-populated Grade 5 Mathematics (Fractions) classroom with 20 realistic student profiles (Aarav, Meera, Rohan, Sita, etc.).
10. **Privacy-by-Design**: No email, phone, address, or location collection.

---

## 🔒 Safety & Ethical Guardrails

- **No High-Stakes Decisions**: AI outputs are presented strictly as suggestions for teacher consideration.
- **Non-Labeling Profiles**: Avoids negative terms ("weak child", "poor learner"). Uses developmental indicators ("emerging understanding", "needs targeted support").
- **No Diagnostics**: Never diagnoses mental health or learning disabilities.

---

## 📝 Known Limitations

- **Browser Speech Recognition**: Web Speech API support varies by mobile browser; text typing and preset shortcuts are provided as a instant fallback.
- **Local Persistence**: MVP uses browser LocalStorage for session persistence; can be connected to PostgreSQL / Supabase / Firebase without changing UI components.
