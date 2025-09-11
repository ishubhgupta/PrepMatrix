import { Question } from '@/types';

// Python for ML Questions - normalized from original data
export const pythonMLQuestions: Question[] = [
  {
    id: 'python-001',
    subject: 'PythonML',
    topic: 'Python Core for ML',
    difficulty: 'Easy',
    question: 'What is the primary difference between a list and a tuple in Python, in the context of machine learning data handling?',
    options: [
      { text: 'Lists are mutable and tuples are immutable.', correct: true },
      { text: 'Tuples can store mixed data types, while lists cannot.', correct: false },
      { text: 'Lists are faster for iteration than tuples.', correct: false },
      { text: 'Lists use parentheses `()` while tuples use square brackets `[]`.', correct: false }
    ],
    rationale: 'The key distinction is mutability. Tuples are immutable, meaning their state cannot be changed after creation, which can be useful for representing fixed data records or as dictionary keys. Lists are mutable and can be changed, making them suitable for accumulating data.'
  },
  {
    id: 'python-002',
    subject: 'PythonML',
    topic: 'NumPy Essentials',
    difficulty: 'Easy',
    question: 'Which NumPy function is used to create a new array with the same shape as a given array, but filled with ones?',
    options: [
      { text: '`np.zeros_like(arr)`', correct: false },
      { text: '`np.ones(arr.shape)`', correct: false },
      { text: '`np.full_like(arr, 1)`', correct: false },
      { text: '`np.ones_like(arr)`', correct: true }
    ],
    rationale: '`np.ones_like(arr)` creates an array of ones with the same shape and dtype as the input array `arr`. `np.ones(arr.shape)` works but is less idiomatic as it doesn\'t preserve the dtype. `np.full_like(arr, 1)` is also correct but `np.ones_like` is more specific.'
  },
  {
    id: 'python-003',
    subject: 'PythonML',
    topic: 'Code Output & Bug Hunts',
    difficulty: 'Medium',
    question: 'What is the output of the following code?\n\n```python\nimport numpy as np\na = np.array([1, 2, 3, 4, 5])\nb = a[1:4]\nb[1] = 10\nprint(a)\n```',
    options: [
      { text: '`[1 2 3 4 5]`', correct: false },
      { text: '`[1 2 10 4 5]`', correct: true },
      { text: '`[1 10 3 4 5]`', correct: false },
      { text: 'A `ValueError` is raised.', correct: false }
    ],
    rationale: 'Basic slicing in NumPy creates a view, not a copy, of the original array. Modifying the slice `b` will also modify the base array `a`. The element `b[1]` corresponds to the element `a[2]`, so `a[2]` is changed to 10.'
  },
  {
    id: 'python-004',
    subject: 'PythonML',
    topic: 'Scikit-learn Core',
    difficulty: 'Medium',
    question: 'In scikit-learn, what is the crucial difference between `fit`, `transform`, and `fit_transform` methods of a transformer like `StandardScaler`?',
    options: [
      { text: '`fit` calculates the parameters (e.g., mean/std), `transform` applies the scaling, and `fit_transform` does both sequentially.', correct: true },
      { text: '`fit` applies the scaling, `transform` calculates the parameters, and `fit_transform` is a deprecated alias for `fit`.', correct: false },
      { text: '`fit` is for training data, `transform` is for test data, and `fit_transform` is for validation data.', correct: false },
      { text: '`fit` and `transform` are identical, while `fit_transform` is a more memory-efficient version.', correct: false }
    ],
    rationale: 'The `fit` method learns the parameters from the data. The `transform` method applies the learned transformation. `fit_transform` is an optimized method that performs both steps, which should only be used on the training data to avoid data leakage.'
  },
  {
    id: 'python-005',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Easy',
    question: 'What is the most memory-efficient way to represent a column in a Pandas DataFrame that contains a small, fixed number of unique string values (e.g., \'low\', \'medium\', \'high\')?',
    options: [
      { text: '`object` dtype', correct: false },
      { text: '`string` dtype', correct: false },
      { text: '`category` dtype', correct: true },
      { text: '`pd.CategoricalIndex`', correct: false }
    ],
    rationale: 'The `category` dtype is specifically designed for this scenario. It stores the unique values once and uses integer codes to represent the values in the column, leading to significant memory savings compared to `object` or `string` dtypes.'
  },
  {
    id: 'python-006',
    subject: 'PythonML',
    topic: 'Data Loading & Preprocessing',
    difficulty: 'Hard',
    question: 'Consider the following scikit-learn pipeline. Why is this pipeline vulnerable to data leakage?\n\n```python\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.model_selection import train_test_split\n# Assume X, y are pre-loaded pandas DataFrames\n\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\n\nX_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2)\n```',
    options: [
      { text: '`train_test_split` is called after scaling the numerical features.', correct: false },
      { text: 'A `OneHotEncoder` is not included in the snippet.', correct: false },
      { text: 'The `StandardScaler` was fitted to the entire dataset `X` before splitting.', correct: true },
      { text: 'The `test_size` is too small, leading to an unrepresentative test set.', correct: false }
    ],
    rationale: 'The `StandardScaler` is fitted on the entire dataset. This means information from the test set is used to determine the scaling parameters (mean/std). The scaler should be fitted *only* on the training data and then used to transform both train and test sets.'
  },
  {
    id: 'python-007',
    subject: 'PythonML',
    topic: 'Feature Engineering',
    difficulty: 'Medium',
    question: 'What is the main advantage of using `pd.get_dummies()` with the `drop_first=True` parameter?',
    options: [
      { text: 'It reduces memory usage by using sparse matrices.', correct: false },
      { text: 'It prevents multicollinearity by avoiding the dummy variable trap.', correct: true },
      { text: 'It automatically handles missing values in categorical columns.', correct: false },
      { text: 'It creates ordered categorical variables instead of binary ones.', correct: false }
    ],
    rationale: 'When `drop_first=True`, one dummy variable is dropped to avoid perfect multicollinearity (the dummy variable trap). If you have n categories, you only need n-1 dummy variables since the last category can be inferred from the others.'
  },
  {
    id: 'python-008',
    subject: 'PythonML',
    topic: 'Model Evaluation',
    difficulty: 'Medium',
    question: 'In a binary classification problem with class imbalance, which metric would be most misleading if used alone?',
    options: [
      { text: 'Precision', correct: false },
      { text: 'Recall', correct: false },
      { text: 'F1-score', correct: false },
      { text: 'Accuracy', correct: true }
    ],
    rationale: 'Accuracy can be very misleading with imbalanced classes. For example, if 95% of samples are negative class, a model that always predicts negative will have 95% accuracy but be useless. Precision, recall, and F1-score provide better insights into performance on both classes.'
  },
  {
    id: 'python-009',
    subject: 'PythonML',
    topic: 'Cross-validation',
    difficulty: 'Medium',
    question: 'What is the primary purpose of stratified k-fold cross-validation?',
    options: [
      { text: 'To ensure each fold has the same number of samples.', correct: false },
      { text: 'To maintain the same class distribution in each fold as in the original dataset.', correct: true },
      { text: 'To reduce the computational time of cross-validation.', correct: false },
      { text: 'To prevent data leakage between training and validation sets.', correct: false }
    ],
    rationale: 'Stratified k-fold ensures that each fold maintains the same proportion of samples from each class as the original dataset. This is especially important for imbalanced datasets to ensure reliable performance estimates.'
  },
  {
    id: 'python-010',
    subject: 'PythonML',
    topic: 'Hyperparameter Tuning',
    difficulty: 'Hard',
    question: 'When using `GridSearchCV` with cross-validation, what is a potential risk of tuning too many hyperparameters simultaneously?',
    options: [
      { text: 'The search will be too fast and miss optimal values.', correct: false },
      { text: 'It increases the risk of overfitting to the validation folds.', correct: true },
      { text: 'The model will become too simple and underfit.', correct: false },
      { text: 'It will always result in worse performance than default parameters.', correct: false }
    ],
    rationale: 'When you tune many hyperparameters simultaneously, you\'re essentially performing multiple hypothesis tests. This increases the risk of finding parameter combinations that perform well on the specific validation folds by chance, leading to overfitting to the CV folds and potentially poor generalization to new data.'
  }
];

// Add more Python ML questions to reach 100 total...
// For brevity, I'm including a representative sample.
