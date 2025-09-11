# 🚀 PrepMatrix - AI-Powered Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-prep--matrix.vercel.app-brightgreen?style=flat-square&logo=vercel)](https://prep-matrix.vercel.app/)

**PrepMatrix** is a modern, AI-powered learning platform designed to help students master technical subjects through interactive quizzes, intelligent explanations, and comprehensive progress tracking. Built with cutting-edge web technologies and featuring a beautiful glassmorphism UI design.

## 🌐 Live Demo

🔗 **[Access PrepMatrix Live](https://prep-matrix.vercel.app/)**

Experience the full platform with all features including AI-powered explanations, interactive quizzes, and progress tracking.

## 📑 Table of Contents

- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [AI Features](#ai-features-gemini-integration)
- [Project Structure](#-project-structure)
- [Adding New Content](#-adding-new-content)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)

## ✨ Features

### 🎯 **Core Learning Features**
- **Interactive Quiz System** - Comprehensive question banks covering multiple subjects
- **AI-Powered Explanations** - Get personalized explanations at different complexity levels
- **Smart Progress Tracking** - Detailed analytics and performance insights
- **Subject Coverage** - DBMS, GenAI, OOP, Operating Systems, Python ML

### 🤖 **AI Integration**
- **Gemini AI Integration** - Powered by Google's Gemini API
- **Similar Question Generation** - AI creates related practice questions
- **Adaptive Explanations** - Simple, detailed, or advanced explanations based on user preference
- **Interactive AI Chat** - Discussion features for deeper understanding (coming soon)

### 🎨 **Modern UI/UX**
- **Glassmorphism Design** - Beautiful, modern interface with glass-like effects
- **Dark/Light Theme** - Seamless theme switching with system preference detection
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Micro-interactions and transitions for enhanced user experience
- **Gradient Backgrounds** - Dynamic, animated backgrounds with floating particles

### 📊 **Analytics & Progress**
- **Performance Dashboard** - Visual charts and statistics
- **Subject Breakdown** - Individual progress tracking per subject
- **Recent Activity** - Timeline of learning activities
- **Achievement System** - Milestone tracking and badges
- **Time Tracking** - Monitor time spent on questions and topics

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Zustand** - Lightweight state management

### **AI & APIs**
- **Google Gemini AI** - Advanced language model integration
- **Custom API Routes** - Next.js API routes for backend functionality
- **Cookie-based Storage** - Secure API key management

### **Development Tools**
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing and optimization
- **Custom Animations** - CSS keyframes and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager
- Google Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ishubhgupta/PrepMatrix.git
   cd PrepMatrix
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or if you prefer pnpm
   pnpm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your API key
   # GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   > **Note:** AI features work without an API key but you can also set it through the Settings page in the app.

4. **Run the development server**
   ```bash
   npm run dev
   # or if you prefer pnpm
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running locally.

   **Or visit the live demo:** [https://prep-matrix.vercel.app/](https://prep-matrix.vercel.app/)

### Build for Production

```bash
npm run build
npm start
# or if you prefer pnpm
pnpm build
pnpm start
```

## 🎮 Usage Guide

### **Getting Started**
1. **Dashboard** - Overview of your learning progress and quick access to subjects
2. **Choose Subject** - Select from DBMS, GenAI, OOP, OS, or Python ML
3. **Take Quiz** - Answer interactive questions with real-time feedback
4. **AI Features** - Use AI explanations and similar question generation (requires API key)
5. **Track Progress** - Monitor your performance and learning analytics

### **AI Features Setup**
1. Go to **Settings** from the navigation menu
2. Enter your **Gemini API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Click "Validate & Enable" to activate AI features
4. Enjoy personalized explanations and question generation

### **Key Interactions**
- **Answer Questions** - Click options and submit for immediate feedback
- **View Explanations** - Get detailed rationales for correct answers
- **Generate Similar Questions** - AI creates practice questions on similar topics
- **Track Time** - Monitor your solving speed and improvement
- **Switch Themes** - Toggle between light and dark modes

## Data Model

### Question Schema
```typescript
interface Question {
  id: string;
  subject: 'DBMS' | 'PythonML' | 'CppOOP' | 'GenAI';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: Array<{
    text: string;
    correct: boolean;
  }>;
  rationale: string;
}
```

### Adding New Questions

1. Edit the appropriate file in `src/data/`:
   - `dbms.ts` - Database questions
   - `python-ml.ts` - Python ML questions  
   - `cpp-oop.ts` - C++ OOP questions
   - `genai.ts` - GenAI questions

2. Follow the existing question format
3. Update the export in `src/data/index.ts`

### Adding New Subjects

1. Create a new data file in `src/data/`
2. Add the subject to the `subjects` array in `src/data/index.ts`
3. Update the routing in `src/app/quiz/[subject]/page.tsx`

## AI Features (Gemini Integration)

The app includes optional AI-powered features that require a Google Gemini API key:

### Setup
1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. In the app, go to Settings and enter your API key
3. Click "Validate & Enable" to activate AI features

### Features
- **Generate Similar Questions**: AI creates new questions similar to the current one
- **Explain Like...**: Get explanations tailored to different learning levels
- **Tutor Chat**: Interactive AI tutor for each subject/topic

### Privacy & Security
- API keys are stored only in browser cookies (not on any server)
- All AI requests go directly from client to Google's API
- No data is sent to any other servers

## 📂 Project Structure

```
PrepMatrix/
├── 📁 src/
│   ├── 📁 app/                   # Next.js 14 App Router
│   │   ├── 📄 layout.tsx         # Root layout with providers
│   │   ├── 📄 page.tsx           # Dashboard home page
│   │   ├── 📁 quiz/[subject]/    # Dynamic quiz routes
│   │   ├── 📁 progress/          # Analytics dashboard
│   │   └── 📁 settings/          # Configuration page
│   ├── 📁 components/            # Reusable React components
│   │   ├── 📁 dashboard/         # Dashboard components
│   │   ├── 📁 quiz/              # Quiz interface
│   │   ├── 📁 layout/            # Layout components
│   │   └── 📁 ui/                # Common UI elements
│   ├── 📁 data/                  # Question datasets
│   ├── 📁 stores/                # Zustand state management
│   ├── 📁 lib/                   # Utilities & API clients
│   └── 📁 hooks/                 # Custom React hooks
├── 📁 public/                    # Static assets
└── 📄 tailwind.config.js         # Styling configuration
```

## 🔧 Adding New Content

### **Adding Questions**
1. Edit files in `src/data/` (dbms.ts, python-ml.ts, etc.)
2. Follow the existing question schema
3. Include rationale for correct answers

### **Adding Subjects**
1. Create new data file in `src/data/`
2. Add to subjects array in `src/data/index.ts`
3. Update routing in quiz pages

## 🚀 Deployment

The application is deployed and available at: **[https://prep-matrix.vercel.app/](https://prep-matrix.vercel.app/)**

### **Deploy Your Own Instance**

#### **Vercel (Recommended)**
```bash
npm run build
npx vercel deploy
```

Or connect your GitHub repository to Vercel for automatic deployments:
1. Fork this repository
2. Import your fork on [Vercel](https://vercel.com)
3. Deploy with zero configuration

#### **Other Static Hosting**
```bash
npm run build
# Deploy the 'out' folder to any static hosting service
```

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- 🐛 How to report bugs
- 💡 How to suggest features  
- 🔧 Development setup
- 📝 Code guidelines
- 🧪 Testing requirements

### **Quick Start for Contributors**

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📋 Roadmap

- 🔄 **Spaced Repetition** - Intelligent question scheduling
- 📱 **Mobile App** - Native mobile experience
- 🏆 **Social Features** - Leaderboards and sharing
- 🎯 **Advanced Analytics** - Detailed learning insights
- 📚 **More Subjects** - System Design, Algorithms, etc.
- 🌐 **Offline Mode** - Study without internet

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

This project exists thanks to all the people who contribute.

[![Contributors](https://img.shields.io/github/contributors/ishubhgupta/PrepMatrix.svg?style=flat-square)](https://github.com/ishubhgupta/PrepMatrix/graphs/contributors)

## 📈 Project Stats

[![GitHub stars](https://img.shields.io/github/stars/ishubhgupta/PrepMatrix.svg?style=flat-square)](https://github.com/ishubhgupta/PrepMatrix/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ishubhgupta/PrepMatrix.svg?style=flat-square)](https://github.com/ishubhgupta/PrepMatrix/network)
[![GitHub issues](https://img.shields.io/github/issues/ishubhgupta/PrepMatrix.svg?style=flat-square)](https://github.com/ishubhgupta/PrepMatrix/issues)
[![GitHub license](https://img.shields.io/github/license/ishubhgupta/PrepMatrix.svg?style=flat-square)](https://github.com/ishubhgupta/PrepMatrix/blob/main/LICENSE)

## 🙏 Acknowledgments

- **Google Gemini** - AI-powered learning features
- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Simple state management
- **Open Source Community** - Inspiration and support

---

<div align="center">

### 💡 Ready to ace your interviews?

**[🚀 Start Learning](https://prep-matrix.vercel.app/)** | **[📖 Documentation](https://github.com/ishubhgupta/PrepMatrix#readme)** | **[🐛 Report Issues](https://github.com/ishubhgupta/PrepMatrix/issues)**

Made with ❤️ for developers, by developers

⭐ **Star this repo if it helped you!** ⭐

</div>
