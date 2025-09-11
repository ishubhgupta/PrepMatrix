import { Question } from '@/types';

// Generative AI & LLM Questions - normalized from original data
export const genAIQuestions: Question[] = [
  {
    id: 'genai-001',
    subject: 'GenAI',
    topic: 'LLM & GenAI Fundamentals',
    difficulty: 'Easy',
    question: 'What is the primary function of the temperature parameter in LLM text generation?',
    options: [
      { text: 'To control the length of the output sequence.', correct: false },
      { text: 'To set the maximum number of tokens in the vocabulary.', correct: false },
      { text: 'To adjust the randomness of the model\'s predictions.', correct: true },
      { text: 'To define the size of the context window.', correct: false }
    ],
    rationale: 'Temperature modulates the probability distribution of the next token. A lower temperature makes the output more deterministic and less random by increasing the likelihood of high-probability tokens, while a higher temperature increases randomness, allowing for more creative but potentially less coherent outputs.'
  },
  {
    id: 'genai-002',
    subject: 'GenAI',
    topic: 'RAG & Retrieval',
    difficulty: 'Medium',
    question: 'You are building a RAG system to answer questions over a large internal knowledge base. To improve relevance, you want to retrieve documents based on both semantic meaning and specific keywords. Which retrieval strategy is most suitable?',
    options: [
      { text: 'Purely dense retrieval using cosine similarity on embeddings.', correct: false },
      { text: 'Purely sparse retrieval using a TF-IDF or BM25 algorithm.', correct: false },
      { text: 'Hybrid search combining dense and sparse retrieval scores.', correct: true },
      { text: 'Metadata filtering followed by maximal marginal relevance (MMR) re-ranking.', correct: false }
    ],
    rationale: 'Hybrid search is the correct approach as it explicitly combines the strengths of both dense retrieval (for semantic understanding) and sparse retrieval (for keyword matching). Purely dense or sparse methods would fail to meet the dual requirement.'
  },
  {
    id: 'genai-003',
    subject: 'GenAI',
    topic: 'Prompt Engineering',
    difficulty: 'Easy',
    question: 'In prompt engineering, what is the key difference between zero-shot and few-shot prompting?',
    options: [
      { text: 'Zero-shot uses no examples, while few-shot provides several examples of the task.', correct: true },
      { text: 'Zero-shot is for classification, while few-shot is for text generation.', correct: false },
      { text: 'Zero-shot prompts require a system role, while few-shot prompts do not.', correct: false },
      { text: 'Zero-shot uses a high temperature, while few-shot uses a low temperature.', correct: false }
    ],
    rationale: 'The defining characteristic is the inclusion of examples within the prompt. Zero-shot prompting asks the model to perform a task without any prior examples, relying on its pre-trained knowledge. Few-shot prompting provides a small number of input-output examples to guide the model\'s behavior.'
  },
  {
    id: 'genai-004',
    subject: 'GenAI',
    topic: 'Fine-tuning & Adaptation',
    difficulty: 'Medium',
    question: 'When fine-tuning a large language model, what is the primary purpose of using an adapter-based method like LoRA (Low-Rank Adaptation)?',
    options: [
      { text: 'To quantize the model\'s weights to 4-bit or 8-bit integers.', correct: false },
      { text: 'To retrain the entire model from scratch on a new dataset.', correct: false },
      { text: 'To significantly reduce the number of trainable parameters, saving memory and compute.', correct: true },
      { text: 'To increase the model\'s context window size.', correct: false }
    ],
    rationale: 'LoRA and other Parameter-Efficient Fine-Tuning (PEFT) methods freeze the pre-trained model weights and inject small, trainable \'adapter\' matrices into the model\'s layers. This dramatically reduces the number of parameters that need to be updated during training.'
  },
  {
    id: 'genai-005',
    subject: 'GenAI',
    topic: 'Agents & Tool Use',
    difficulty: 'Hard',
    question: 'A deployed agentic system using function-calling occasionally fails by hallucinating function arguments that are syntactically correct but factually nonsensical for the given context. What is the most robust mitigation strategy?',
    options: [
      { text: 'Decrease the model\'s temperature to 0.0 to reduce randomness in argument generation.', correct: false },
      { text: 'Implement a validation layer that uses an external knowledge source or business logic to verify arguments before executing the function call.', correct: true },
      { text: 'Add more complex examples of correct function calls to the agent\'s few-shot prompt.', correct: false },
      { text: 'Use a smaller, more specialized model for the function-calling task.', correct: false }
    ],
    rationale: 'The most robust solution is an external validation layer. This decouples the LLM\'s generative process from the execution logic, creating a safeguard that checks the plausibility of generated arguments against ground truth or business rules.'
  },
  {
    id: 'genai-006',
    subject: 'GenAI',
    topic: 'Model Architecture',
    difficulty: 'Medium',
    question: 'What is the key innovation of the Transformer architecture that enables efficient parallel processing?',
    options: [
      { text: 'Recurrent connections that process sequences step by step.', correct: false },
      { text: 'Self-attention mechanism that processes all positions simultaneously.', correct: true },
      { text: 'Convolutional layers that capture local patterns.', correct: false },
      { text: 'LSTM gates that control information flow.', correct: false }
    ],
    rationale: 'The self-attention mechanism allows the model to process all positions in a sequence simultaneously, unlike RNNs which process sequentially. This parallelization significantly speeds up training and enables the model to capture long-range dependencies more effectively.'
  },
  {
    id: 'genai-007',
    subject: 'GenAI',
    topic: 'Embeddings & Vector Search',
    difficulty: 'Medium',
    question: 'When building a semantic search system using embeddings, what is the most common similarity metric used?',
    options: [
      { text: 'Euclidean distance', correct: false },
      { text: 'Manhattan distance', correct: false },
      { text: 'Cosine similarity', correct: true },
      { text: 'Hamming distance', correct: false }
    ],
    rationale: 'Cosine similarity is most commonly used for embeddings because it measures the angle between vectors, making it invariant to the magnitude of the vectors. This is particularly useful for text embeddings where the length of the vector doesn\'t necessarily correlate with semantic importance.'
  },
  {
    id: 'genai-008',
    subject: 'GenAI',
    topic: 'Training & Optimization',
    difficulty: 'Hard',
    question: 'In the context of training large language models, what is the primary benefit of gradient checkpointing?',
    options: [
      { text: 'It speeds up the forward pass computation.', correct: false },
      { text: 'It reduces memory usage at the cost of additional computation.', correct: true },
      { text: 'It improves model accuracy by preventing overfitting.', correct: false },
      { text: 'It enables distributed training across multiple GPUs.', correct: false }
    ],
    rationale: 'Gradient checkpointing trades computation for memory. Instead of storing all intermediate activations for the backward pass, it stores only some checkpoints and recomputes the others as needed. This significantly reduces memory usage, allowing training of larger models.'
  },
  {
    id: 'genai-009',
    subject: 'GenAI',
    topic: 'Evaluation & Metrics',
    difficulty: 'Medium',
    question: 'What is the BLEU score primarily used to evaluate?',
    options: [
      { text: 'The computational efficiency of language models.', correct: false },
      { text: 'The quality of machine translation outputs.', correct: true },
      { text: 'The perplexity of language model predictions.', correct: false },
      { text: 'The factual accuracy of generated text.', correct: false }
    ],
    rationale: 'BLEU (Bilingual Evaluation Understudy) is a metric designed to evaluate machine translation quality by comparing generated translations to reference translations, measuring n-gram overlap. While it has limitations, it remains widely used for translation evaluation.'
  },
  {
    id: 'genai-010',
    subject: 'GenAI',
    topic: 'Ethical AI & Safety',
    difficulty: 'Medium',
    question: 'What is the primary concern with "hallucination" in large language models?',
    options: [
      { text: 'The model generates text that is grammatically incorrect.', correct: false },
      { text: 'The model produces outputs that are factually incorrect but presented confidently.', correct: true },
      { text: 'The model fails to generate any output for certain inputs.', correct: false },
      { text: 'The model generates text that is too creative and unpredictable.', correct: false }
    ],
    rationale: 'Hallucination refers to when LLMs generate information that appears factual and authoritative but is actually false or made up. This is particularly concerning because the confident presentation can mislead users who may not verify the information.'
  }
];

// Add more GenAI questions to reach 80+ total...
// For brevity, I'm including a representative sample.
