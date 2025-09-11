# Contributing to PrepMatrix

Thank you for your interest in contributing to PrepMatrix! We welcome contributions from the community.

## How to Contribute

### 🐛 Reporting Bugs

1. Check existing [issues](https://github.com/ishubhgupta/PrepMatrix/issues) to see if the bug has already been reported
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, etc.)

### 💡 Suggesting Features

1. Check existing [issues](https://github.com/ishubhgupta/PrepMatrix/issues) for similar feature requests
2. Create a new issue with:
   - Clear feature description
   - Use case and motivation
   - Any implementation ideas you have

### 🔧 Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/PrepMatrix.git
   cd PrepMatrix
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### 📝 Making Changes

1. Follow the existing code style and conventions
2. Use TypeScript for type safety
3. Follow the component structure in `src/components/`
4. Add questions to appropriate files in `src/data/`
5. Test your changes thoroughly

### 🧪 Testing

Before submitting your changes:

1. Run linting:
   ```bash
   npm run lint
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Test your changes in the browser

### 📤 Submitting Changes

1. Commit your changes with a clear message:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Create a Pull Request with:
   - Clear title and description
   - Link to related issues
   - Screenshots of UI changes
   - List of changes made

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use Tailwind CSS for styling
- Keep components modular and reusable

### Adding New Questions
1. Choose the appropriate subject file in `src/data/`
2. Follow the existing question schema:
   ```typescript
   {
     id: 'unique-id',
     subject: 'DBMS' | 'PythonML' | 'CppOOP' | 'GenAI',
     topic: 'specific-topic',
     difficulty: 'Easy' | 'Medium' | 'Hard',
     question: 'Your question text',
     options: [
       { text: 'Option 1', correct: false },
       { text: 'Option 2', correct: true },
       // ... more options
     ],
     rationale: 'Explanation for the correct answer'
   }
   ```
3. Update exports in `src/data/index.ts`

### Adding New Subjects
1. Create a new data file in `src/data/`
2. Add the subject to the subjects array in `src/data/index.ts`
3. Update routing in `src/app/quiz/[subject]/page.tsx`
4. Add appropriate icons and colors to the dashboard

## 🎯 Areas Where We Need Help

- **Question Content**: Adding more questions for existing subjects
- **New Subjects**: System Design, Algorithms, Data Structures
- **UI/UX**: Improving the user interface and experience
- **Performance**: Optimizing loading times and responsiveness
- **Testing**: Adding unit and integration tests
- **Documentation**: Improving guides and documentation
- **Accessibility**: Making the app more accessible
- **Mobile Experience**: Enhancing mobile responsiveness

## 📞 Getting Help

If you have questions or need help:

1. Check the [README](README.md) for basic setup and usage
2. Look through existing [issues](https://github.com/ishubhgupta/PrepMatrix/issues)
3. Create a new issue for discussion

## 🏆 Recognition

Contributors will be recognized in:
- The project's README
- Release notes for significant contributions
- Special acknowledgment for major features

Thank you for contributing to PrepMatrix! 🚀