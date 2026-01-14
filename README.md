# PrepMatrix - AI-Powered Learning Platform

**PrepMatrix** is a comprehensive learning platform designed to help students master technical subjects through interactive quizzes, AI-powered mock interviews, intelligent study coaching, and advanced analytics. Built with Next.js 14, TypeScript, and powered by Google's Gemini AI.

## Features Overview

### **Quiz System**
Practice with curated question banks across multiple technical subjects with instant feedback and detailed explanations.

### **AI Mock Interviews**
Voice-based interview practice with AI evaluation, real-time conversation, and comprehensive performance feedback.

### **AI Study Coach**
Personalized study plans, interactive chat assistance, and adaptive learning recommendations.

### **Performance Analytics**
Activity calendar, subject breakdown, progress tracking, and detailed performance insights.

### **Custom AI Quiz Generation**
Generate personalized quizzes on any topic with adjustable difficulty and question count.

### **Error Notebook**
Track mistakes, review incorrect answers, and learn from your errors with AI explanations.

---

## Feature Guide

### 1. **Interactive Quiz System**

**How it Works:**
- Access 5 subjects: DBMS, Operating Systems, Python & ML, GenAI & LLMs, and C++ & OOP
- Each subject contains hundreds of curated questions
- Questions are organized by topics and difficulty levels
- Real-time answer validation with immediate feedback

**How to Use:**
1. Navigate to any subject from the header menu or dashboard
2. Select filters (difficulty, topics, reset progress if needed)
3. Answer questions by selecting options and clicking "Submit Answer"
4. View instant feedback with explanations
5. Track your progress in real-time with the progress bar
6. Use confidence indicators to mark question difficulty for spaced repetition

**Key Features:**
- **Topic-based filtering** - Focus on specific areas you want to improve
- **Difficulty levels** - Easy, Medium, and Hard questions
- **Real-time progress** - See your accuracy and completion status
- **Detailed rationales** - Learn why answers are correct or incorrect
- **Subject reset** - Start fresh on any subject anytime

---

### 2. **AI Mock Interviews**

**How it Works:**
- Voice-based interview simulation using browser Web Speech API
- AI generates unique questions based on subject, difficulty, and target role
- Each interview consists of 5 questions from 8 different topics (ensures diversity)
- Real-time conversation - AI asks questions, you respond verbally
- Comprehensive evaluation on technical accuracy, communication, depth, and confidence
- Topic-based question generation prevents repetition

**How to Use:**
1. Click "Mock Interview" in the header or use the "New Interview" button
2. Select your **Subject** (DBMS, OS, Python & ML, GenAI, C++ & OOP)
3. Choose **Difficulty** (Beginner, Intermediate, Advanced)
4. Select **Target Role** (Software Engineer, Data Engineer, ML Engineer, etc.)
5. Click "Start Interview" to begin
6. **During Interview:**
   - AI asks a question via text-to-speech
   - Click microphone icon to record your answer
   - Speak clearly and naturally
   - Click "Stop" when done, then "Submit Answer"
   - AI evaluates and moves to next question
7. **After Completion:**
   - View overall score and category breakdowns
   - Read detailed feedback with strengths and improvements
   - Review individual question performance
   - Access all previous interviews from the main page

**Technical Details:**
- Uses Google Gemini AI for question generation and evaluation
- 8 distinct topics per subject ensure no question repetition
- Each question focuses on a specific topic area
- AI evaluates: Technical Accuracy, Communication Clarity, Answer Depth, Confidence
- Results include overall feedback, question-by-question analysis, and improvement recommendations
- All interviews saved with scores, timestamps, and complete responses

**Requirements:**
- Chrome or Edge browser (best Web Speech API support)
- Working microphone
- Quiet environment
- Active internet connection

---

### 3. **AI Study Coach**

**How it Works:**
- Personalized AI chatbot tailored to your learning needs
- Analyzes your performance data to provide targeted recommendations
- Generates custom study plans based on your weak areas
- Interactive chat interface for asking questions and clarification

**How to Use:**
1. Navigate to "Study Coach" from the header menu
2. **Quick Actions:**
   - "Explain a concept" - Ask about any technical topic
   - "Create study plan" - Get a personalized learning roadmap
   - "Review weak topics" - Focus on areas needing improvement
3. **Chat Interface:**
   - Type questions naturally
   - Get detailed explanations with examples
   - Ask follow-up questions for deeper understanding
4. **Custom Study Plans:**
   - Click "Create Custom Plan"
   - Select subject and duration (1, 2, or 4 weeks)
   - AI generates structured daily/weekly learning schedule
   - Focus on your specific weak areas

**Features:**
- Context-aware responses based on your quiz history
- Adaptive difficulty in explanations
- Real-world examples and analogies
- Study scheduling recommendations
- Progress-based plan adjustments

---

### 4. **Performance Analytics**

**How it Works:**
- Comprehensive dashboard showing all learning activity
- Calendar heatmap displays daily quiz and interview activity
- Subject breakdown shows progress per topic
- Recent activity feed combines quizzes and mock interviews
- Visual charts for easy progress tracking

**Dashboard Components:**

**Stats Overview:**
- Total questions answered
- Overall accuracy percentage
- Questions completed today
- Current learning streak

**Activity Calendar:**
- Monthly view with color-coded activity days
- Hover tooltips show details:
  - Number of quiz questions answered
  - Quiz accuracy percentage
  - Number of mock interviews completed
- Tracks both quiz practice and mock interviews

**Subject Breakdown:**
- Progress bar for each subject
- Percentage completion and accuracy
- Total questions available vs. answered

**Recent Activity:**
- Timeline of last 10 activities (quizzes + interviews)
- Quiz attempts show: question, subject, correct/incorrect, timestamp
- Mock interviews show: subject, role, overall score, clickable to results
- Color-coded for easy scanning

---

### 5. **Custom AI Quiz Generation**

**How it Works:**
- AI generates fresh questions on any technical topic
- Powered by Google Gemini for intelligent question creation
- Questions saved for future practice
- Multiple attempts allowed per quiz

**How to Use:**
1. Navigate to "AI Quiz" from the header menu
2. Click "Generate New Quiz"
3. Enter parameters:
   - **Topic** - Any technical subject (e.g., "React Hooks", "SQL Joins")
   - **Difficulty** - Easy, Medium, or Hard
   - **Question Count** - 3, 5, or 10 questions
4. Click "Generate Quiz" and wait for AI processing
5. Take the quiz with generated questions
6. View all your custom quizzes in the main page
7. Retake quizzes anytime for practice

**Features:**
- Unlimited topic flexibility
- AI-generated multiple choice questions
- Complete explanations for each answer
- Save and replay functionality
- Progress tracking per custom quiz

---

### 6. **Error Notebook**

**How it Works:**
- Automatically tracks all incorrectly answered questions
- Organized by subject for focused review
- AI-powered explanations help understand mistakes
- Re-attempt questions to verify learning

**How to Use:**
1. Questions you answer incorrectly are automatically saved
2. Navigate to "Error Notebook" to review
3. Browse by subject tabs
4. For each error:
   - See the original question
   - View your incorrect answer
   - Read the correct answer
   - Get AI explanation of why you were wrong
5. Click "Mark as Learned" when you understand the concept
6. Filter between active errors and learned items

**Features:**
- Subject-wise organization
- Detailed mistake analysis
- AI-generated learning explanations
- Progress tracking (errors vs. learned)
- Easy review and practice workflow

---

### 7. **Settings & Configuration**

**Available Settings:**
- **Theme Toggle** - Switch between light and dark modes
- **Gemini API Key** - Configure AI features
- **Profile Management** - Update user information
- **Data Management** - Export or reset progress

**API Key Setup:**
1. Get free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Go to Settings page
3. Enter API key in the designated field
4. Click "Validate & Enable"
5. AI features (Study Coach, Custom Quiz, Mock Interview) will activate

---

## Technology Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **NextAuth.js** - Authentication
- **Zustand** - State management

### **Backend**
- **Prisma ORM** - Database management
- **MySQL (TiDB Cloud)** - Database hosting
- **Next.js API Routes** - Backend endpoints

### **AI Integration**
- **Google Gemini AI** - Question generation, evaluation, tutoring
- **Web Speech API** - Voice recognition and text-to-speech

### **Development**
- **ESLint** - Code quality
- **PostCSS** - CSS processing
- **Vitest** - Unit testing
- **Playwright** - E2E testing

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- MySQL database
- Google Gemini API key

### Environment Variables

Create `.env` file:
```env
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"
```

### Installation

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Seed questions
npm run seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Data Model

### Question Schema
- Subject, Topic, Difficulty
- Question text and options
- Correct answers and rationales
- Stored in MySQL via Prisma

### User Progress
- Question attempts with timestamps
- Accuracy tracking per subject
- Confidence levels
- Mock interview records
- Custom quiz history

### Mock Interview Records
- Subject, difficulty, role
- 5 questions with responses
- Individual scores per question
- Overall performance metrics
- Detailed AI feedback

---

## Learning Best Practices

**For Quiz Practice:**
1. Start with Easy difficulty to build confidence
2. Use topic filters to focus on weak areas
3. Review explanations even for correct answers
4. Mark difficult questions with low confidence
5. Retake subjects after reviewing errors

**For Mock Interviews:**
1. Practice regularly (2-3 times per week)
2. Start with Beginner difficulty
3. Record yourself to improve speaking skills
4. Review feedback carefully
5. Focus on one subject at a time initially
6. Work on areas mentioned in "Areas for Improvement"

**For Study Planning:**
1. Use Study Coach to create structured plans
2. Follow daily recommendations
3. Mix quiz practice with interview practice
4. Review Error Notebook weekly
5. Track progress on the analytics dashboard

---

## License

MIT License - Free to use and modify

---

<div align="center">

**Built for learners, by learners**

</div>
