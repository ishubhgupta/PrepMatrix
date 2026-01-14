// Voice analysis utilities for mock interviews

export interface VoiceMetrics {
  wordsPerMinute: number;
  fillerWordCount: number;
  pauseCount: number;
  longestPause: number;
  speakingDuration: number;
  clarity: 'poor' | 'fair' | 'good' | 'excellent';
}

const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'basically', 'actually', 
  'literally', 'sort of', 'kind of', 'i mean', 'well',
  'so', 'right', 'okay', 'hmm', 'er', 'ah'
];

const FILLER_REGEX = new RegExp(
  `\\b(${FILLER_WORDS.join('|')})\\b`,
  'gi'
);

/**
 * Count filler words in transcript
 */
export function countFillerWords(transcript: string): number {
  const matches = transcript.match(FILLER_REGEX);
  return matches ? matches.length : 0;
}

/**
 * Calculate words per minute
 */
export function calculateWPM(transcript: string, durationSeconds: number): number {
  if (durationSeconds === 0) return 0;
  
  const words = transcript.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const durationMinutes = durationSeconds / 60;
  
  return Math.round(wordCount / durationMinutes);
}

/**
 * Analyze speaking pace and provide feedback
 */
export function analyzePace(wpm: number): {
  rating: 'too-slow' | 'ideal' | 'too-fast';
  feedback: string;
} {
  if (wpm < 100) {
    return {
      rating: 'too-slow',
      feedback: 'Speaking pace is slow. Try to maintain a steady rhythm to keep engagement.'
    };
  } else if (wpm > 160) {
    return {
      rating: 'too-fast',
      feedback: 'Speaking pace is fast. Slow down slightly to improve clarity and give yourself time to think.'
    };
  } else {
    return {
      rating: 'ideal',
      feedback: 'Speaking pace is excellent! Clear and easy to follow.'
    };
  }
}

/**
 * Calculate clarity score based on filler words and pace
 */
export function calculateClarityScore(
  fillerCount: number,
  wpm: number,
  duration: number
): number {
  let score = 100;
  
  // Penalize for excessive filler words (deduct 2 points per filler)
  const fillerPenalty = Math.min(40, fillerCount * 2);
  score -= fillerPenalty;
  
  // Penalize for poor pace
  const paceAnalysis = analyzePace(wpm);
  if (paceAnalysis.rating === 'too-slow') {
    score -= 15;
  } else if (paceAnalysis.rating === 'too-fast') {
    score -= 10;
  }
  
  // Penalize for very short answers (less than 30 seconds)
  if (duration < 30) {
    score -= 20;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Detect pauses in speech (this would need real-time audio analysis)
 * For now, we estimate based on transcript structure
 */
export function estimatePauses(transcript: string): {
  pauseCount: number;
  longestPause: number;
} {
  // Simple estimation: periods and long gaps in transcript
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Estimate one pause per sentence (rough approximation)
  const pauseCount = Math.max(0, sentences.length - 1);
  
  // Estimate longest pause (2-4 seconds for sentence breaks)
  const longestPause = pauseCount > 0 ? 3 : 0;
  
  return { pauseCount, longestPause };
}

/**
 * Calculate overall voice metrics
 */
export function analyzeVoiceMetrics(
  transcript: string,
  durationSeconds: number
): VoiceMetrics {
  const fillerWordCount = countFillerWords(transcript);
  const wordsPerMinute = calculateWPM(transcript, durationSeconds);
  const { pauseCount, longestPause } = estimatePauses(transcript);
  const clarityScore = calculateClarityScore(fillerWordCount, wordsPerMinute, durationSeconds);
  
  // Determine clarity rating
  let clarity: 'poor' | 'fair' | 'good' | 'excellent';
  if (clarityScore >= 85) clarity = 'excellent';
  else if (clarityScore >= 70) clarity = 'good';
  else if (clarityScore >= 50) clarity = 'fair';
  else clarity = 'poor';
  
  return {
    wordsPerMinute,
    fillerWordCount,
    pauseCount,
    longestPause,
    speakingDuration: durationSeconds,
    clarity,
  };
}

/**
 * Get feedback text for voice metrics
 */
export function getVoiceMetricsFeedback(metrics: VoiceMetrics): string[] {
  const feedback: string[] = [];
  
  // Pace feedback
  const paceAnalysis = analyzePace(metrics.wordsPerMinute);
  feedback.push(paceAnalysis.feedback);
  
  // Filler words feedback
  if (metrics.fillerWordCount === 0) {
    feedback.push('Excellent clarity! No filler words detected.');
  } else if (metrics.fillerWordCount <= 3) {
    feedback.push('Good fluency with minimal filler words.');
  } else if (metrics.fillerWordCount <= 6) {
    feedback.push(`${metrics.fillerWordCount} filler words detected. Try to reduce "um", "uh", and "like" for better clarity.`);
  } else {
    feedback.push(`${metrics.fillerWordCount} filler words detected. Practice pausing instead of using fillers to improve communication.`);
  }
  
  // Duration feedback
  if (metrics.speakingDuration < 30) {
    feedback.push('Answer was brief. Provide more detail and examples to demonstrate deeper understanding.');
  } else if (metrics.speakingDuration > 180) {
    feedback.push('Answer was lengthy. Focus on being concise while covering key points.');
  }
  
  return feedback;
}
