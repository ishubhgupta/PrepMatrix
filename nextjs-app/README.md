# PrepMatrix - Quiz Practice Platform

A production-ready Next.js application for technical interview preparation with AI-powered features.

## Features

- **Multiple Subjects**: DBMS, Python ML, C++ OOP, and GenAI questions
- **AI Integration**: Generate similar questions, explain answers, and chat with a tutor (requires Gemini API key)
- **Progress Tracking**: Track your performance across subjects and topics
- **Interactive UI**: Modern, responsive design with dark/light themes
- **Offline Support**: PWA capabilities for offline quiz practice

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Chart.js with react-chartjs-2
- **AI**: Google Gemini API
- **Testing**: Vitest + React Testing Library + Playwright
- **Storage**: Browser localStorage/cookies (client-only)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prepmatrix
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

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

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (public)/       # Public pages
│   ├── quiz/[subject]/ # Dynamic quiz pages
│   ├── review/         # Review incorrect questions
│   └── settings/       # Settings page
├── components/         # React components
│   ├── layout/        # Header, Footer, etc.
│   ├── quiz/          # Quiz-related components
│   ├── dashboard/     # Dashboard components
│   └── shared/        # Reusable UI components
├── data/              # Question data and utilities
├── lib/               # Utilities and configurations
│   ├── store/         # Zustand store slices
│   ├── ai/            # Gemini client and prompts
│   └── utils/         # Helper functions
├── types/             # TypeScript type definitions
└── test/              # Test setup and utilities
```

## Testing

### Unit Tests
```bash
pnpm test
# or
npm test
```

### E2E Tests
```bash
pnpm test:e2e
# or
npm run test:e2e
```

### Type Checking
```bash
pnpm type-check
# or
npm run type-check
```

## Development

### Code Style
- ESLint for code quality
- Prettier for formatting (with Tailwind plugin)
- TypeScript for type safety

### State Management
- Zustand for client state
- Persistent stores for progress and preferences
- Separate stores for UI, quiz data, and chat

### Styling
- Tailwind CSS with custom design system
- CSS custom properties for theming
- Responsive design with mobile-first approach

## Deployment

This is a static Next.js app that can be deployed anywhere:

### Vercel (Recommended)
```bash
pnpm build
# Deploy the generated files
```

### Other Platforms
The app generates static files that can be served from any web server or CDN.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Run linting and tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] More question subjects (System Design, Algorithms, etc.)
- [ ] Spaced repetition learning
- [ ] Social features (leaderboards, sharing)
- [ ] Advanced analytics
- [ ] Mobile app version
- [ ] Offline question sync

## Support

For issues or questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with details
3. For AI feature issues, verify your Gemini API key is valid

---

Built with ❤️ for technical interview preparation
