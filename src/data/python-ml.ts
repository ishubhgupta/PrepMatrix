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
    topic: 'Code Analysis',
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
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'What is the output of this Python code?\n\n```python\ndata = [[]] * 3\ndata[0].append(1)\nprint(data)\n```',
    options: [
      { text: '`[[1], [], []]`', correct: false },
      { text: '`[[1], [1], [1]]`', correct: true },
      { text: '`[[1]]`', correct: false },
      { text: '`[[], [], [1]]`', correct: false }
    ],
    rationale: 'The expression `[[]] * 3` creates a list containing three references to the *same* inner list object. Modifying `data[0]` modifies the shared object, affecting all three references.'
  },
  {
    id: 'python-008',
    subject: 'PythonML',
    topic: 'Model Evaluation',
    difficulty: 'Easy',
    question: 'Which of the following is the best metric for evaluating a classification model on an imbalanced dataset where the positive class is rare and of primary interest?',
    options: [
      { text: 'Accuracy', correct: false },
      { text: 'ROC-AUC', correct: false },
      { text: 'Precision-Recall AUC (PR-AUC)', correct: true },
      { text: 'Mean Squared Error', correct: false }
    ],
    rationale: 'For imbalanced datasets, accuracy is misleading. Precision-Recall AUC is more sensitive to improvements in the rare positive class than ROC-AUC.'
  },
  {
    id: 'python-009',
    subject: 'PythonML',
    topic: 'NumPy Essentials',
    difficulty: 'Medium',
    question: 'What is the concept of "broadcasting" in NumPy?',
    options: [
      { text: 'A set of rules for applying arithmetic operations on arrays of different shapes.', correct: true },
      { text: 'A method for sending arrays to multiple functions simultaneously.', correct: false },
      { text: 'A way to flatten a multi-dimensional array into a 1D array.', correct: false },
      { text: 'A technique for copying data from one array to another.', correct: false }
    ],
    rationale: 'Broadcasting describes how NumPy treats arrays with different shapes during arithmetic operations, stretching the smaller array to match the larger one where possible.'
  },
  
  {
    id: 'python-010',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Medium',
    question: 'What will `df[\'C\']` contain after this Pandas code is executed?\n\n```python\nimport pandas as pd\nimport numpy as np\ndf1 = pd.DataFrame({\'A\': [1, 2], \'B\': [10, 20]})\ndf2 = pd.DataFrame({\'A\': [1, 3], \'C\': [100, 300]})\ndf = pd.merge(df1, df2, on=\'A\', how=\'left\')\n```',
    options: [
      { text: '`[100, 300]`', correct: false },
      { text: 'A Series containing `[100.0, np.nan]`', correct: true },
      { text: '`[100, None]`', correct: false },
      { text: '`[100]`', correct: false }
    ],
    rationale: 'A left merge keeps all rows from `df1`. Since `A=2` does not exist in `df2`, the value for `C` becomes `NaN`. Note that the presence of `NaN` upcasts the column to float.'
  },
  {
    id: 'python-011',
    subject: 'PythonML',
    topic: 'Advanced & Production',
    difficulty: 'Hard',
    question: 'A machine learning model\'s inference latency is too high. Which approach is most likely to reduce the latency *per input* without retraining the model?',
    options: [
      { text: 'Running inference on a CPU instead of a GPU.', correct: false },
      { text: 'Increasing the batch size.', correct: false },
      { text: 'Quantizing the model\'s weights to a lower precision (e.g., FP16 or INT8).', correct: true },
      { text: 'Using a larger, more complex model architecture.', correct: false }
    ],
    rationale: 'Quantization reduces the bit-precision of weights, leading to faster computation and lower memory bandwidth requirements, which directly reduces inference latency.'
  },
  {
    id: 'python-012',
    subject: 'PythonML',
    topic: 'Python Core for ML',
    difficulty: 'Easy',
    question: 'In Python, what does a generator function do?',
    options: [
      { text: 'It returns a list of all possible values at once.', correct: false },
      { text: 'It produces a sequence of values lazily, one at a time, using the `yield` keyword.', correct: true },
      { text: 'It automatically generates documentation for other functions.', correct: false },
      { text: 'It creates random numbers for data augmentation.', correct: false }
    ],
    rationale: 'Generators yield values one by one and maintain their state between calls, making them highly memory-efficient for processing large datasets.'
  },
  {
    id: 'python-013',
    subject: 'PythonML',
    topic: 'NumPy Essentials',
    difficulty: 'Medium',
    question: 'What is the output of this code?\n\n```python\nimport numpy as np\na = np.arange(4).reshape(2, 2)\nb = np.arange(2)\nprint(a + b)\n```',
    options: [
      { text: 'An error due to shape mismatch.', correct: false },
      { text: '`[[0 2]\n [2 4]]`', correct: true },
      { text: '`[[0 1]\n [3 4]]`', correct: false },
      { text: '`[[0 1]\n [2 3]]`', correct: false }
    ],
    rationale: '`a` is shape (2,2) and `b` is shape (2,). `b` is broadcast across the rows of `a`. Row 0: `[0,1] + [0,1] = [0,2]`. Row 1: `[2,3] + [0,1] = [2,4]`.'
  },
  {
    id: 'python-014',
    subject: 'PythonML',
    topic: 'Scikit-learn Core',
    difficulty: 'Medium',
    question: 'When using `GridSearchCV`, what is the purpose of the `cv` parameter?',
    options: [
      { text: 'It specifies the number of CPU cores to use for training.', correct: false },
      { text: 'It determines the cross-validation splitting strategy.', correct: true },
      { text: 'It controls the version of the model to be cross-validated.', correct: false },
      { text: 'It sets the scoring metric for evaluation.', correct: false }
    ],
    rationale: 'The `cv` parameter determines how the data is split into training and validation folds (e.g., an integer for K-Fold or a specific generator object).'
  },
  {
    id: 'python-015',
    subject: 'PythonML',
    topic: 'Math & NumPy Coding',
    difficulty: 'Hard',
    question: 'What is the most likely output of the following code snippet?\n\n```python\nimport numpy as np\ndef compute_loss(y_true, y_pred):\n    epsilon = 1e-9\n    y_pred = np.clip(y_pred, epsilon, 1 - epsilon)\n    loss = -np.sum(y_true * np.log(y_pred))\n    return loss\n\ny_true = np.array([0, 1, 0])\ny_pred = np.array([0.1, 0.9, 0.0])\nprint(f"{compute_loss(y_true, y_pred):.2f}")\n```',
    options: [
      { text: '`inf`', correct: false },
      { text: '`0.11`', correct: true },
      { text: '`0.00`', correct: false },
      { text: 'An error is raised.', correct: false }
    ],
    rationale: 'The code calculates Cross-Entropy loss. The `np.clip` prevents `log(0)` by replacing 0.0 with `1e-9`. The sum is `-1 * log(0.9)`, which is approx 0.105, rounded to 0.11.'
  },
  {
    id: 'python-016',
    subject: 'PythonML',
    topic: 'Debugging',
    difficulty: 'Easy',
    question: 'What is the primary purpose of a `try...except` block in Python?',
    options: [
      { text: 'To speed up code execution.', correct: false },
      { text: 'To handle errors gracefully without crashing the program.', correct: true },
      { text: 'To define a function that may or may not exist.', correct: false },
      { text: 'To create a loop that runs a specific number of times.', correct: false }
    ],
    rationale: '`try...except` allows developers to catch exceptions (errors) and provide alternative logic or error messages instead of terminating the script.'
  },
  {
    id: 'python-017',
    subject: 'PythonML',
    topic: 'Functions & OOP',
    difficulty: 'Medium',
    question: 'In object-oriented programming in Python, what does the `__init__` method do?',
    options: [
      { text: 'It is the constructor method, called when a new object is created to initialize its attributes.', correct: true },
      { text: 'It is the destructor method, called when an object is deleted.', correct: false },
      { text: 'It returns a string representation of the object.', correct: false },
      { text: 'It compares two objects for equality.', correct: false }
    ],
    rationale: '`__init__` is the initializer (constructor) for a class. It is automatically triggered when an instance of a class is created.'
  },
  {
    id: 'python-018',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Medium',
    question: 'What is a common issue with using `pd.DataFrame.apply` with a custom function for data transformation?',
    options: [
      { text: 'It is usually much slower than vectorized operations.', correct: true },
      { text: 'It cannot handle missing (`NaN`) values.', correct: false },
      { text: 'It only works on numerical data.', correct: false },
      { text: 'It modifies the DataFrame in-place by default.', correct: false }
    ],
    rationale: '`.apply()` essentially loops through the data in Python, which is significantly slower than NumPy-powered vectorized operations written in C.'
  },
  {
    id: 'python-019',
    subject: 'PythonML',
    topic: 'Data Loading & Preprocessing',
    difficulty: 'Easy',
    question: 'How do you correctly split your data into training and testing sets to prevent data leakage?',
    options: [
      { text: 'Split the data after performing feature scaling and imputation.', correct: false },
      { text: 'Split the data before any preprocessing steps like scaling or imputation.', correct: true },
      { text: 'Use the first 80% of rows for training and the last 20% for testing.', correct: false },
      { text: 'Combine the training and testing sets for fitting transformers.', correct: false }
    ],
    rationale: 'Scaling and imputation must be "learned" only from training data. Splitting first ensures the test data remains strictly "unseen".'
  },
  {
    id: 'python-020',
    subject: 'PythonML',
    topic: 'Performance & Memory',
    difficulty: 'Medium',
    question: 'You are using `multiprocessing` to speed up a CPU-bound task in Python. Why is this generally more effective for CPU-bound tasks than using `threading`?',
    options: [
      { text: 'Because of the Global Interpreter Lock (GIL), which prevents multiple threads from executing Python bytecode at the same time.', correct: true },
      { text: 'Because `multiprocessing` uses less memory than `threading`.', correct: false },
      { text: 'Because threads cannot be terminated, while processes can.', correct: false },
      { text: 'Because `multiprocessing` allows sharing memory between processes more efficiently.', correct: false }
    ],
    rationale: 'The GIL prevents CPython threads from running in parallel on multiple cores for CPU tasks. Processes avoid the GIL by using separate memory spaces and interpreters.'
  },
  {
    id: 'python-021',
    subject: 'PythonML',
    topic: 'Code Analysis',
    difficulty: 'Hard',
    question: 'What is the output of this code?\n\n```python\nimport pandas as pd\nimport numpy as np\ns = pd.Series([1, 2, np.nan, 4], dtype=pd.Int64Dtype())\nprint(s[2])\n```',
    options: [
      { text: '`nan`', correct: false },
      { text: '`0`', correct: false },
      { text: '`<NA>`', correct: true },
      { text: '`None`', correct: false }
    ],
    rationale: '`pd.Int64Dtype()` is a nullable integer type. Unlike standard NumPy integers, it uses `pd.NA` (displayed as `<NA>`) to represent missing values.'
  },
  {
    id: 'python-022',
    subject: 'PythonML',
    topic: 'Performance & Memory',
    difficulty: 'Medium',
    question: 'When would you prefer a `deque` from the `collections` module over a standard Python list?',
    options: [
      { text: 'When you need to store only unique elements.', correct: false },
      { text: 'When you need fast appends and pops from both ends of the sequence.', correct: true },
      { text: 'When you need to perform mathematical operations on the sequence.', correct: false },
      { text: 'When you need the sequence to be immutable.', correct: false }
    ],
    rationale: '`deque` is optimized for O(1) appends and pops from both ends. Lists are O(n) for operations at the beginning (index 0) because elements must be shifted.'
  },
  {
    id: 'python-023',
    subject: 'PythonML',
    topic: 'Scikit-learn Core',
    difficulty: 'Easy',
    question: 'In scikit-learn\'s `ColumnTransformer`, what does the `remainder=\'passthrough\'` argument do?',
    options: [
      { text: 'It drops all columns that were not explicitly selected for transformation.', correct: false },
      { text: 'It raises an error if any columns are not transformed.', correct: false },
      { text: 'It keeps all non-transformed columns in the output array.', correct: true },
      { text: 'It applies a default `StandardScaler` to all remaining columns.', correct: false }
    ],
    rationale: 'By default, `ColumnTransformer` drops unselected columns. `passthrough` ensures they are included in the final output matrix without changes.'
  },
  {
    id: 'python-024',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Medium',
    question: 'What are the key differences between `loc` and `iloc` for indexing in Pandas?',
    options: [
      { text: '`loc` is label-based, while `iloc` is integer position-based.', correct: false },
      { text: '`loc`\'s slicing is inclusive of the stop label, while `iloc`\'s is exclusive.', correct: false },
      { text: 'Both A and B are correct.', correct: true },
      { text: '`iloc` is always faster than `loc`.', correct: false }
    ],
    rationale: '`.loc` uses index/column names (inclusive of end). `.iloc` uses integer offsets (exclusive of end, like standard Python slicing).'
  },
  {
    id: 'python-025',
    subject: 'PythonML',
    topic: 'Functions & OOP',
    difficulty: 'Hard',
    question: 'Which is a correctly implemented decorator to time a function that takes arguments?',
    options: [
      { text: '```python\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n```', correct: true },
      { text: 'A decorator that takes `*args` in the outer function.', correct: false },
      { text: 'A decorator that doesn\'t return the wrapper.', correct: false },
      { text: 'A decorator that only works on `func()` with no arguments.', correct: false }
    ],
    rationale: 'The wrapper function must capture all positional and keyword arguments (`*args, **kwargs`) to be generally applicable to any function.'
  },
  {
    id: 'python-026',
    subject: 'PythonML',
    topic: 'Model Evaluation',
    difficulty: 'Medium',
    question: 'Checking if a predicted probability of 0.8 actually corresponds to an 80% occurrence rate in the real class is checking for:',
    options: [
      { text: 'Model Accuracy', correct: false },
      { text: 'Model Calibration', correct: true },
      { text: 'Model Recall', correct: false },
      { text: 'Model Convergence', correct: false }
    ],
    rationale: 'Calibration ensures that the probability scores output by a model can be interpreted directly as a measure of confidence or actual frequency.'
  },
  
  {
    id: 'python-027',
    subject: 'PythonML',
    topic: 'Data Loading & Preprocessing',
    difficulty: 'Easy',
    question: 'Which `pd.read_csv` parameter is most useful for saving memory by defining column types during the read process?',
    options: [
      { text: '`header=0`', correct: false },
      { text: '`sep=\',\'`', correct: false },
      { text: '`index_col=0`', correct: false },
      { text: '`dtype={\'col\': np.int32}`', correct: true }
    ],
    rationale: 'Explicitly defining `dtype` prevents Pandas from defaulting to 64-bit types or `object` types, significantly reducing the initial memory footprint.'
  },
  {
    id: 'python-028',
    subject: 'PythonML',
    topic: 'Code Analysis',
    difficulty: 'Hard',
    question: 'What is the output of this NumPy code?\n\n```python\nimport numpy as np\na = np.array([200, 5], dtype=np.uint8)\nb = np.array([60, 1], dtype=np.uint8)\nc = a + b\nprint(c)\n```',
    options: [
      { text: '`[260 6]`', correct: false },
      { text: '`[255 6]`', correct: false },
      { text: '`[4 6]`', correct: true },
      { text: 'A `RuntimeWarning` is issued.', correct: false }
    ],
    rationale: '`uint8` ranges from 0 to 255. Adding 200 + 60 results in 260, which wraps around: `260 - 256 = 4`.'
  },
  {
    id: 'python-029',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Easy',
    question: 'Which of the following is NOT a valid way to handle missing data in Pandas?',
    options: [
      { text: '`df.fillna(df.mean())`', correct: false },
      { text: '`df.dropna()`', correct: false },
      { text: '`df.replace(np.nan, 0)`', correct: false },
      { text: '`df.delete(np.nan)`', correct: true }
    ],
    rationale: '`delete` is not a DataFrame method for missing values. Use `dropna` to remove rows or `fillna` to replace values.'
  },
  {
    id: 'python-030',
    subject: 'PythonML',
    topic: 'Advanced & Production',
    difficulty: 'Medium',
    question: 'What is the purpose of setting `random_state` in scikit-learn?',
    options: [
      { text: 'It initializes the model with random hyperparameters.', correct: false },
      { text: 'It ensures the reproducibility of results by fixing the seed.', correct: true },
      { text: 'It determines the number of random features per split.', correct: false },
      { text: 'It shuffles data before each epoch.', correct: false }
    ],
    rationale: 'Fixing the `random_state` ensures that the "random" choices (like data splitting or weight initialization) are the same across different runs.'
  },
  {
    id: 'python-031',
    subject: 'PythonML',
    topic: 'Debugging',
    difficulty: 'Medium',
    question: 'Given `class MyError(ValueError): pass`, what is caught here?\n\n```python\ntry:\n    raise MyError("err")\nexcept ValueError:\n    print("A")\nexcept MyError:\n    print("B")\n```',
    options: [
      { text: '`A`', correct: true },
      { text: '`B`', correct: false },
      { text: '`A` then `B`', correct: false },
      { text: 'Nothing', correct: false }
    ],
    rationale: 'Python checks exceptions in order. Since `MyError` is a subclass of `ValueError`, it matches the first `except` block.'
  },
  {
    id: 'python-032',
    subject: 'PythonML',
    topic: 'NumPy Essentials',
    difficulty: 'Medium',
    question: 'What is true about "fancy" (advanced) indexing in NumPy?',
    options: [
      { text: 'It returns a view of the original array.', correct: false },
      { text: 'It returns a copy of the data.', correct: true },
      { text: 'It always maintains the same dimensions.', correct: false },
      { text: 'It changes the dtype to integer.', correct: false }
    ],
    rationale: 'Unlike basic slicing, passing a list of indices or a boolean mask creates a brand new array with copied data.'
  },
  {
    id: 'python-033',
    subject: 'PythonML',
    topic: 'Code Analysis',
    difficulty: 'Hard',
    question: 'What is the output of this sequence?\n\n```python\ndef add_item(item, some_list=[]):\n    some_list.append(item)\n    return some_list\n\nlist1 = add_item(1)\nlist2 = add_item(2)\nprint(list1)\n```',
    options: [
      { text: '`[1]`', correct: false },
      { text: '`[2]`', correct: false },
      { text: '`[1, 2]`', correct: true },
      { text: 'A `TypeError`.', correct: false }
    ],
    rationale: 'Default arguments are created once at function definition. Both calls share the same list instance.'
  },
  {
    id: 'python-034',
    subject: 'PythonML',
    topic: 'Python Core for ML',
    difficulty: 'Easy',
    question: 'How do you format `x = 0.129` to `0.13` using f-strings?',
    options: [
      { text: '`f\'{x:.2f}\'`', correct: true },
      { text: '`f\'{x:round(2)}\'`', correct: false },
      { text: '`f\'{x:.2}\'`', correct: false },
      { text: '`f\'{x::2f}\'`', correct: false }
    ],
    rationale: '`:.2f` specifies a fixed-point float with 2 decimal places.'
  },
  {
    id: 'python-035',
    subject: 'PythonML',
    topic: 'Functions & OOP',
    difficulty: 'Medium',
    question: 'What is a primary benefit of `@dataclass` for ML workflows?',
    options: [
      { text: 'Automatic training methods.', correct: false },
      { text: 'Automatic generation of `__init__`, `__repr__`, etc.', correct: true },
      { text: 'Higher memory efficiency than lists.', correct: false },
      { text: 'Mandatory immutability.', correct: false }
    ],
    rationale: 'Dataclasses reduce boilerplate for classes primarily used to store data/state.'
  },
  {
    id: 'python-036',
    subject: 'PythonML',
    topic: 'Model Evaluation',
    difficulty: 'Medium',
    question: 'What does the `stratify` parameter in `train_test_split` do?',
    options: [
      { text: 'Ensures equal sample sizes.', correct: false },
      { text: 'Maintains target class proportions in both splits.', correct: true },
      { text: 'Sorts data before splitting.', correct: false },
      { text: 'Applies sampling to features.', correct: false }
    ],
    rationale: 'Stratification ensures the test set class balance reflects the training set class balance.'
  },
  {
    id: 'python-037',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Easy',
    question: 'Which method computes a single value (mean/sum) for each group in Pandas?',
    options: [
      { text: '`.transform()`', correct: false },
      { text: '`.apply()`', correct: false },
      { text: '`.filter()`', correct: false },
      { text: '`.agg()`', correct: true }
    ],
    rationale: '`.agg()` is the standard tool for computing summary statistics on grouped data.'
  },
  {
    id: 'python-038',
    subject: 'PythonML',
    topic: 'Math & NumPy Coding',
    difficulty: 'Hard',
    question: 'How do you compute the dot product of `X(100, 10)` and `w(10,)` to get `(100,)`?',
    options: [
      { text: '`np.dot(X, w)`', correct: true },
      { text: '`X * w`', correct: false },
      { text: '`np.matmul(X, w.reshape(-1, 1))`', correct: false },
      { text: 'A `for` loop.', correct: false }
    ],
    rationale: '`np.dot` (or the `@` operator) performs the intended matrix-vector multiplication efficiently.'
  },
  {
    id: 'python-039',
    subject: 'PythonML',
    topic: 'Python Core for ML',
    difficulty: 'Medium',
    question: 'Result of `[n*n for n in [1, 2, 3, 4, 5] if n % 2 == 0]`?',
    options: [
      { text: '`[1, 4, 9, 16, 25]`', correct: false },
      { text: '`[2, 4]`', correct: false },
      { text: '`[4, 16]`', correct: true },
      { text: '`[1, 9, 25]`', correct: false }
    ],
    rationale: 'The condition filters for even numbers (2, 4), and the expression squares them (4, 16).'
  },
  {
    id: 'python-040',
    subject: 'PythonML',
    topic: 'Debugging',
    difficulty: 'Medium',
    question: 'In a `try...except...else...finally` block, when does `else` run?',
    options: [
      { text: 'Always.', correct: false },
      { text: 'On error.', correct: false },
      { text: 'If no exception occurred.', correct: true },
      { text: 'On catch.', correct: false }
    ],
    rationale: '`else` runs only if the `try` block succeeds without raising an error.'
  },
  {
    id: 'python-041',
    subject: 'PythonML',
    topic: 'Functions & OOP',
    difficulty: 'Hard',
    question: 'Why use `__slots__` for millions of objects?',
    options: [
      { text: 'Dynamic attributes.', correct: false },
      { text: 'Reduces memory footprint per instance.', correct: true },
      { text: 'Efficient inheritance.', correct: false },
      { text: 'Hashing.', correct: false }
    ],
    rationale: '`__slots__` replaces the instance `__dict__` with a fixed array, saving significant memory.'
  },
  {
    id: 'python-042',
    subject: 'PythonML',
    topic: 'NumPy Essentials',
    difficulty: 'Easy',
    question: 'Shape of `np.array([ [1, 2], [3, 4], [5, 6] ])`?',
    options: [
      { text: '`(2, 3)`', correct: false },
      { text: '`(3, 2)`', correct: true },
      { text: '`(6,)`', correct: false },
      { text: '`(1, 6)`', correct: false }
    ],
    rationale: 'The array has 3 inner lists (rows) and each has 2 elements (columns).'
  },
  {
    id: 'python-043',
    subject: 'PythonML',
    topic: 'Code Analysis',
    difficulty: 'Hard',
    question: '`s1 = pd.Series([1, 2], [\'a\', \'b\'])`; `s2 = pd.Series([10, 20], [\'b\', \'a\'])`. Result of `(s1 + s2)[\'a\']`?',
    options: [
      { text: '`11`', correct: false },
      { text: '`21`', correct: true },
      { text: '`22`', correct: false },
      { text: '`30`', correct: false }
    ],
    rationale: 'Pandas aligns by label: `s1[\'a\'](1) + s2[\'a\'](20) = 21`.'
  },
  {
    id: 'python-044',
    subject: 'PythonML',
    topic: 'Model Evaluation',
    difficulty: 'Medium',
    question: 'When is `StratifiedKFold` better than `KFold`?',
    options: [
      { text: 'Regression.', correct: false },
      { text: 'Large datasets.', correct: false },
      { text: 'Imbalanced classification.', correct: true },
      { text: 'Shuffling.', correct: false }
    ],
    rationale: 'Stratification ensures every fold has a representative class distribution.'
  },
  {
    id: 'python-045',
    subject: 'PythonML',
    topic: 'Advanced & Production',
    difficulty: 'Easy',
    question: 'How to save a scikit-learn model?',
    options: [
      { text: '`model.save()`', correct: false },
      { text: '`joblib.dump(model, \'file.joblib\')`', correct: true },
      { text: '`model.to_file()`', correct: false },
      { text: '`pickle.write()`', correct: false }
    ],
    rationale: '`joblib` is optimized for scikit-learn objects containing large NumPy arrays.'
  },
  {
    id: 'python-046',
    subject: 'PythonML',
    topic: 'Python Core for ML',
    difficulty: 'Easy',
    question: 'Key characteristic of a Python `set`?',
    options: [
      { text: 'Ordered.', correct: false },
      { text: 'Allows duplicates.', correct: false },
      { text: 'Unique, unordered elements.', correct: true },
      { text: 'Indexable.', correct: false }
    ],
    rationale: 'Sets are hash-based collections used for unique items and fast membership checks.'
  },
  {
    id: 'python-047',
    subject: 'PythonML',
    topic: 'Performance & Memory',
    difficulty: 'Hard',
    question: 'Pitfall of `copy.copy()` on a list of lists?',
    options: [
      { text: 'Slow speed.', correct: false },
      { text: 'Inner lists are still references to the original.', correct: true },
      { text: 'High memory usage.', correct: false },
      { text: 'Converts to tuples.', correct: false }
    ],
    rationale: 'A shallow copy only creates a new container; nested objects are still shared.'
  },
  {
    id: 'python-048',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Medium',
    question: 'Value of `df.iloc[1, 0]` for `df = pd.DataFrame({\'A\': [10, 20], \'B\': [30, 40]})`?',
    options: [
      { text: '`10`', correct: false },
      { text: '`20`', correct: true },
      { text: '`30`', correct: false },
      { text: '`row2`', correct: false }
    ],
    rationale: '`iloc[1, 0]` accesses the second row (1) and first column (0).'
  },
  {
    id: 'python-049',
    subject: 'PythonML',
    topic: 'Scikit-learn Core',
    difficulty: 'Easy',
    question: 'Default return of `OneHotEncoder.fit_transform`?',
    options: [
      { text: 'Pandas DataFrame.', correct: false },
      { text: 'Dense NumPy array.', correct: false },
      { text: 'SciPy sparse matrix.', correct: true },
      { text: 'Dict.', correct: false }
    ],
    rationale: 'Sparse matrices save memory by only storing indices of non-zero entries (1s).'
  },
  {
    id: 'python-050',
    subject: 'PythonML',
    topic: 'Model Evaluation',
    difficulty: 'Medium',
    question: 'Good training performance but poor test performance suggests:',
    options: [
      { text: 'Underfitting.', correct: false },
      { text: 'Overfitting.', correct: true },
      { text: 'Leakage.', correct: false },
      { text: 'Wrong metric.', correct: false }
    ],
    rationale: 'Overfitting is when a model fails to generalize beyond the training set noise.'
  },
  {
    id: 'python-051',
    subject: 'PythonML',
    topic: 'Python Core for ML',
    difficulty: 'Medium',
    question: 'Purpose of `with` when opening a file?',
    options: [
      { text: 'Write mode.', correct: false },
      { text: 'Speed.', correct: false },
      { text: 'Auto-closing handle.', correct: true },
      { text: 'Load into RAM.', correct: false }
    ],
    rationale: 'Context managers ensure resources are cleaned up regardless of script success/failure.'
  },
  {
    id: 'python-052',
    subject: 'PythonML',
    topic: 'NumPy Essentials',
    difficulty: 'Hard',
    question: 'Shape of `np.ones((5, 1, 4)) + np.ones((3, 1))`?',
    options: [
      { text: '`(5, 3, 4)`', correct: true },
      { text: '`(5, 1, 4)`', correct: false },
      { text: '`(5, 3, 1)`', correct: false },
      { text: 'Error.', correct: false }
    ],
    rationale: 'Broadcasting matches (5, 1, 4) against (1, 3, 1), resulting in (5, 3, 4).'
  },
  {
    id: 'python-053',
    subject: 'PythonML',
    topic: 'Debugging',
    difficulty: 'Easy',
    question: 'How to start a pdb session at a specific line?',
    options: [
      { text: '`print("DEBUG")`', correct: false },
      { text: '`import pdb; pdb.set_trace()`', correct: true },
      { text: '`sys.debug()`', correct: false },
      { text: '`raise DebugError()`', correct: false }
    ],
    rationale: '`set_trace()` pauses execution for manual inspection via terminal.'
  },
  {
    id: 'python-054',
    subject: 'PythonML',
    topic: 'Scikit-learn Core',
    difficulty: 'Medium',
    question: 'When use `RandomizedSearchCV` over `GridSearchCV`?',
    options: [
      { text: 'Large/continuous search space.', correct: true },
      { text: 'Need absolute best params.', correct: false },
      { text: 'Regression model.', correct: false },
      { text: 'Small data.', correct: false }
    ],
    rationale: 'Randomized search samples a subset of params, saving time vs exhaustive grids.'
  },
  {
    id: 'python-055',
    subject: 'PythonML',
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'Output of `df.loc[df[\'val\'] > 2]`?',
    options: [
      { text: '`[3, 4]`', correct: false },
      { text: 'DataFrame with matching rows.', correct: true },
      { text: 'Booleans.', correct: false },
      { text: 'List of booleans.', correct: false }
    ],
    rationale: 'Boolean indexing filters the DataFrame and returns a new DataFrame subset.'
  },
  {
    id: 'python-056',
    subject: 'PythonML',
    topic: 'Python Core for ML',
    difficulty: 'Easy',
    question: 'What is a Python `dict` comprehension?',
    options: [
      { text: 'Concise dictionary creation syntax.', correct: true },
      { text: 'Key lookup.', correct: false },
      { text: 'Sorting tool.', correct: false },
      { text: 'Doc generator.', correct: false }
    ],
    rationale: 'Iterates an iterable to map keys to values in one line.'
  },
  {
    id: 'python-057',
    subject: 'PythonML',
    topic: 'Advanced & Production',
    difficulty: 'Hard',
    question: 'Why prefer `joblib` over `pickle` for ML?',
    options: [
      { text: 'JSON format.', correct: false },
      { text: 'Efficient with large NumPy arrays.', correct: true },
      { text: 'Serializes anything.', correct: false },
      { text: 'Security.', correct: false }
    ],
    rationale: 'Joblib handles large arrays without copying them multiple times into memory.'
  },
  {
    id: 'python-058',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Medium',
    question: '`inner` vs `outer` merge?',
    options: [
      { text: '`inner` is intersection; `outer` is union.', correct: true },
      { text: '`inner` is left; `outer` is right.', correct: false },
      { text: 'Column vs Index.', correct: false },
      { text: 'Speed vs Dtype.', correct: false }
    ],
    rationale: 'Inner join only keeps keys present in both sets.'
  },
  {
    id: 'python-059',
    subject: 'PythonML',
    topic: 'Debugging',
    difficulty: 'Medium',
    question: 'What does `finally` ensure?',
    options: [
      { text: 'Only runs on error.', correct: false },
      { text: 'Only runs on success.', correct: false },
      { text: 'Primary logic.', correct: false },
      { text: 'Always runs regardless of errors.', correct: true }
    ],
    rationale: 'Crucial for closing connections/files even if the try block fails.'
  },
  {
    id: 'python-060',
    subject: 'PythonML',
    topic: 'Data Loading & Preprocessing',
    difficulty: 'Easy',
    question: 'Purpose of `train_test_split`?',
    options: [
      { text: 'Ensemble sub-models.', correct: false },
      { text: 'Split X/y.', correct: false },
      { text: 'Create separate fit and eval sets.', correct: true },
      { text: 'Cross-validate.', correct: false }
    ],
    rationale: 'Standard practice to estimate real-world model performance.'
  },
  {
    id: 'python-061',
    subject: 'PythonML',
    topic: 'Performance & Memory',
    difficulty: 'Hard',
    question: 'Threaded loader not speeding up heavy Python logic? Likely:',
    options: [
      { text: 'Small data.', correct: false },
      { text: 'NumPy safety.', correct: false },
      { text: 'GIL bottleneck.', correct: true },
      { text: 'I/O bottleneck.', correct: false }
    ],
    rationale: 'Threads share the same GIL; Python logic cannot run in parallel across CPU cores.'
  },
  {
    id: 'python-062',
    subject: 'PythonML',
    topic: 'Functions & OOP',
    difficulty: 'Medium',
    question: 'Purpose of Abstract Base Class (ABC)?',
    options: [
      { text: 'Direct instantiation.', correct: false },
      { text: 'Defining required interface for children.', correct: true },
      { text: 'Complete functional base.', correct: false },
      { text: 'Auto-generation.', correct: false }
    ],
    rationale: 'Enforces that subclasses implement specific methods (e.g., `.predict()`).'
  },
  {
    id: 'python-063',
    subject: 'PythonML',
    topic: 'Code Analysis',
    difficulty: 'Hard',
    question: '`a = [[1, 2], [3, 4]]`; `b = a[:]`; `b[0][0] = 99`. Value of `a`?',
    options: [
      { text: '`[[1, 2], [3, 4]]`', correct: false },
      { text: '`[[99, 2], [3, 4]]`', correct: true },
      { text: '`[[99, 99], ...]`', correct: false },
      { text: '`[[99, 2], [99, 4]]`', correct: false }
    ],
    rationale: 'Shallow slice `[:]` shares references to inner mutable lists.'
  },
  {
    id: 'python-064',
    subject: 'PythonML',
    topic: 'Model Evaluation',
    difficulty: 'Easy',
    question: 'In ROC, what does AUC represent?',
    options: [
      { text: 'TPR vs FPR trade-off.', correct: false },
      { text: 'Accuracy.', correct: false },
      { text: 'Probability of ranking Pos higher than Neg.', correct: true },
      { text: 'PR curve area.', correct: false }
    ],
    rationale: 'AUC summarizes classifier performance across all possible thresholds.'
  },
  
  {
    id: 'python-065',
    subject: 'PythonML',
    topic: 'Math & NumPy Coding',
    difficulty: 'Medium',
    question: 'Numerically stable Softmax on `z`?',
    options: [
      { text: '`exp(z) / sum(exp(z))`', correct: false },
      { text: '`exp(z-max(z)) / sum(exp(z-max(z)))`', correct: true },
      { text: '`log(1+exp(z))`', correct: false },
      { text: '`z / sum(z)`', correct: false }
    ],
    rationale: 'Subtracting max(z) prevents overflow when computing exponentials of large numbers.'
  },
  {
    id: 'python-066',
    subject: 'PythonML',
    topic: 'Scikit-learn Core',
    difficulty: 'Medium',
    question: 'Apply different preprocessing to different columns?',
    options: [
      { text: '`Pipeline`', correct: false },
      { text: '`FunctionTransformer`', correct: false },
      { text: '`ColumnTransformer`', correct: true },
      { text: '`FeatureUnion`', correct: false }
    ],
    rationale: 'Maps specific transformations (e.g. Scaling vs Encoding) to specific indices/names.'
  },
  {
    id: 'python-067',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Easy',
    question: 'Get row and col count?',
    options: [
      { text: '`df.size`', correct: false },
      { text: '`df.shape`', correct: true },
      { text: '`len(df)`', correct: false },
      { text: '`df.ndim`', correct: false }
    ],
    rationale: '`shape` returns (rows, columns) tuple.'
  },
  {
    id: 'python-068',
    subject: 'PythonML',
    topic: 'Functions & OOP',
    difficulty: 'Medium',
    question: '`x=10`; `func` sets `x=5`. Result of calling `func` then printing `x`?',
    options: [
      { text: '5, 5', correct: false },
      { text: '10, 10', correct: false },
      { text: '5, 10', correct: true },
      { text: 'Error.', correct: false }
    ],
    rationale: 'Local assignment shadows global unless `global x` is explicitly declared.'
  },
  {
    id: 'python-069',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Medium',
    question: 'Select data from 2023 in DatetimeIndex?',
    options: [
      { text: '`df[\'2023\']`', correct: false },
      { text: '`df[df.index.year == 2023]`', correct: false },
      { text: '`df.iloc[2023]`', correct: false },
      { text: 'Both A and B.', correct: true }
    ],
    rationale: 'Pandas supports both partial string indexing and property-based filtering.'
  },
  {
    id: 'python-070',
    subject: 'PythonML',
    topic: 'Python Core for ML',
    difficulty: 'Easy',
    question: 'Example of list comprehension?',
    options: [
      { text: '`for x in range(10): print(x)`', correct: false },
      { text: '`map(lambda...)`', correct: false },
      { text: '`[x*x for x in range(10)]`', correct: true },
      { text: '`list(range(10))`', correct: false }
    ],
    rationale: 'Syntactic sugar for creating a new list from an existing iterable.'
  },
  {
    id: 'python-071',
    subject: 'PythonML',
    topic: 'Performance & Memory',
    difficulty: 'Medium',
    question: 'Key GIL limitation?',
    options: [
      { text: 'I/O core limit.', correct: false },
      { text: 'Prevents true parallel CPU-bound Python threads.', correct: true },
      { text: 'Memory bloat.', correct: false },
      { text: 'C interface limit.', correct: false }
    ],
    rationale: 'Ensures only one thread executes Python bytecode at once.'
  },
  {
    id: 'python-072',
    subject: 'PythonML',
    topic: 'Debugging',
    difficulty: 'Medium',
    question: 'When log vs raise?',
    options: [
      { text: 'Never log.', correct: false },
      { text: 'Log if safe to continue; Raise if op must stop.', correct: true },
      { text: 'User vs System.', correct: false },
      { text: 'Expected vs Unexpected.', correct: false }
    ],
    rationale: 'Raise exceptions to signal failure to the caller; log to record events.'
  },
  {
    id: 'python-073',
    subject: 'PythonML',
    topic: 'Functions & OOP',
    difficulty: 'Hard',
    question: 'Purpose of `__slots__`?',
    options: [
      { text: 'Class variables.', correct: false },
      { text: 'Fix attributes and save RAM.', correct: true },
      { text: 'Read-only props.', correct: false },
      { text: 'List methods.', correct: false }
    ],
    rationale: 'Removes instance overhead by allocating fixed space instead of a dictionary.'
  },
  {
    id: 'python-074',
    subject: 'PythonML',
    topic: 'NumPy Essentials',
    difficulty: 'Easy',
    question: 'Result of `np.array([1, 2, 3]) > 1`?',
    options: [
      { text: '`True`', correct: false },
      { text: '`[False, True, True]`', correct: true },
      { text: '`[2, 3]`', correct: false },
      { text: 'Error.', correct: false }
    ],
    rationale: 'Operators broadcast element-wise in NumPy.'
  },
  {
    id: 'python-075',
    subject: 'PythonML',
    topic: 'Scikit-learn Core',
    difficulty: 'Medium',
    question: 'Advantage of `Pipeline`?',
    options: [
      { text: 'Auto best model.', correct: false },
      { text: 'Encapsulation and safety during CV.', correct: true },
      { text: 'Parallel execution.', correct: false },
      { text: 'Better plots.', correct: false }
    ],
    rationale: 'Ensures data isn\'t leaked when searching for hyperparameters.'
  },
  {
    id: 'python-076',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Medium',
    question: 'Total sales per customer?',
    options: [
      { text: '`pivot_table`', correct: false },
      { text: '`groupby().sum()`', correct: false },
      { text: '`apply()`', correct: false },
      { text: 'Both A and B.', correct: true }
    ],
    rationale: 'Both aggregation methods achieve the same summary result.'
  },
  {
    id: 'python-077',
    subject: 'PythonML',
    topic: 'Model Evaluation',
    difficulty: 'Medium',
    question: 'Precision 0.9, Recall 0.2 means:',
    options: [
      { text: 'Highly accurate.', correct: false },
      { text: 'Conservative: rarely wrong when predicting Pos, but misses many Pos.', correct: true },
      { text: 'Identifies 90% Pos.', correct: false },
      { text: 'F1 of 0.55.', correct: false }
    ],
    rationale: 'High precision means few false alarms; low recall means many missed cases.'
  },
  {
    id: 'python-078',
    subject: 'PythonML',
    topic: 'Data Loading & Preprocessing',
    difficulty: 'Easy',
    question: 'Format more efficient than CSV for large numbers?',
    options: [
      { text: 'TXT', correct: false },
      { text: 'JSON', correct: false },
      { text: 'Parquet', correct: true },
      { text: 'XML', correct: false }
    ],
    rationale: 'Parquet stores data in blocks with native types and compression.'
  },
  {
    id: 'python-079',
    subject: 'PythonML',
    topic: 'Math & NumPy Coding',
    difficulty: 'Hard',
    question: 'Log-sum-exp trick purpose?',
    options: [
      { text: 'Speed log.', correct: false },
      { text: 'Numerical stability for log(sum(exp)).', correct: true },
      { text: 'Approximate series.', correct: false },
      { text: 'Learning rate decay.', correct: false }
    ],
    rationale: 'Prevents arithmetic overflow in deep learning probability calcs.'
  },
  {
    id: 'python-080',
    subject: 'PythonML',
    topic: 'Scikit-learn Core',
    difficulty: 'Medium',
    question: '`predict()` vs `predict_proba()`?',
    options: [
      { text: 'Prob vs Labels.', correct: false },
      { text: 'Labels vs Prob for each class.', correct: true },
      { text: 'Aliases.', correct: false },
      { text: 'Binary vs Multi.', correct: false }
    ],
    rationale: '`predict_proba` returns continuous values used for soft thresholds/AUC.'
  },
  {
    id: 'python-081',
    subject: 'PythonML',
    topic: 'Code Analysis',
    difficulty: 'Hard',
    question: 'Modify `obj.val` inside a function? Result:',
    options: [
      { text: '5', correct: false },
      { text: '10', correct: true },
      { text: 'None', correct: false },
      { text: 'Error.', correct: false }
    ],
    rationale: 'Objects are passed by reference; attribute changes persist outside the function.'
  },
  {
    id: 'python-082',
    subject: 'PythonML',
    topic: 'Model Evaluation',
    difficulty: 'Medium',
    question: 'When set `shuffle=False` in `KFold`?',
    options: [
      { text: 'Reproduction.', correct: false },
      { text: 'Time series data.', correct: true },
      { text: 'Large data.', correct: false },
      { text: 'Imbalance.', correct: false }
    ],
    rationale: 'Prevents "lookahead bias" by maintaining the chronological order of events.'
  },
  {
    id: 'python-083',
    subject: 'PythonML',
    topic: 'Debugging',
    difficulty: 'Medium',
    question: '`logging` vs `print()`?',
    options: [
      { text: 'Configurable levels and destinations.', correct: true },
      { text: 'JSON auto-format.', correct: false },
      { text: 'Faster.', correct: false },
      { text: 'Auto-fix.', correct: false }
    ],
    rationale: 'Allows suppression of minor details without deleting code.'
  },
  {
    id: 'python-084',
    subject: 'PythonML',
    topic: 'Scikit-learn Core',
    difficulty: 'Medium',
    question: 'NOT a good reason for `Pipeline`?',
    options: [
      { text: 'Chaining.', correct: false },
      { text: 'Leakage prevention.', correct: false },
      { text: 'Search tuning.', correct: false },
      { text: 'Conditional branching (if/else).', correct: true }
    ],
    rationale: 'Pipelines are strictly linear sequences.'
  },
  {
    id: 'python-085',
    subject: 'PythonML',
    topic: 'Functions & OOP',
    difficulty: 'Medium',
    question: 'Purpose of `functools.partial`?',
    options: [
      { text: 'Pre-fill specific arguments.', correct: true },
      { text: 'Parallelism.', correct: false },
      { text: 'Fractional data.', correct: false },
      { text: 'ABC creation.', correct: false }
    ],
    rationale: 'Creates a new callable with a fixed set of specific parameters.'
  },
  {
    id: 'python-086',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Hard',
    question: 'Common cause of unexpected `NaN`?',
    options: [
      { text: 'Arithemtic on non-aligned indices.', correct: true },
      { text: 'String in math.', correct: false },
      { text: 'Merge with no overlap.', correct: false },
      { text: 'Lambda returning None.', correct: false }
    ],
    rationale: 'Pandas fills gaps with `NaN` when indices don\'t match in operations.'
  },
  {
    id: 'python-087',
    subject: 'PythonML',
    topic: 'Performance & Memory',
    difficulty: 'Medium',
    question: 'Why is vectorization crucial?',
    options: [
      { text: 'Less lines.', correct: false },
      { text: 'Moves loops to pre-compiled C.', correct: true },
      { text: 'Auto-distributed.', correct: false },
      { text: '64-bit safety.', correct: false }
    ],
    rationale: 'Python loops are slow; NumPy array operations bypass the interpreter.'
  },
  {
    id: 'python-088',
    subject: 'PythonML',
    topic: 'Python Core for ML',
    difficulty: 'Easy',
    question: '`{k: i for i, k in enumerate([\'a\', \'b\'])}`?',
    options: [
      { text: '`{\'a\': 0, \'b\': 1}`', correct: true },
      { text: '`{0: \'a\', 1: \'b\'}`', correct: false },
      { text: 'List of tuples.', correct: false },
      { text: 'Identity dict.', correct: false }
    ],
    rationale: 'Enumerate yields index-key; comprehension swaps them into a map.'
  },
  {
    id: 'python-089',
    subject: 'PythonML',
    topic: 'NumPy Essentials',
    difficulty: 'Medium',
    question: '`axis=0` vs `axis=1` sum?',
    options: [
      { text: '0=Vertical(Col sum); 1=Horizontal(Row sum).', correct: true },
      { text: '0=Row; 1=Col.', correct: false },
      { text: 'Cumsum vs Total.', correct: false },
      { text: 'No difference.', correct: false }
    ],
    rationale: 'Axis defines which dimension is "collapsed" by the sum.'
  },
  {
    id: 'python-090',
    subject: 'PythonML',
    topic: 'Math & NumPy Coding',
    difficulty: 'Hard',
    question: 'Vectorized if-else in NumPy?',
    options: [
      { text: 'Comprehension.', correct: false },
      { text: '`np.where()`', correct: false },
      { text: '`np.select()`', correct: false },
      { text: 'Both B and C.', correct: true }
    ],
    rationale: 'Avoids Python loops when performing conditional assignments on arrays.'
  },
  {
    id: 'python-091',
    subject: 'PythonML',
    topic: 'Advanced & Production',
    difficulty: 'Medium',
    question: 'Issue loading `joblib` from old library version?',
    options: [
      { text: 'File corrupted.', correct: false },
      { text: 'Desync in algorithm or missing attributes.', correct: true },
      { text: 'Slow load.', correct: false },
      { text: 'Auto-convert.', correct: false }
    ],
    rationale: 'Pickling/Joblib is brittle across environment changes.'
  },
  {
    id: 'python-092',
    subject: 'PythonML',
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'Output of `b = a[[indices]]; b[0]=99; print(a[0])`?',
    options: [
      { text: '10', correct: true },
      { text: '99', correct: false },
      { text: '20', correct: false },
      { text: 'IndexError.', correct: false }
    ],
    rationale: 'Fancy indexing always copies; original remains unchanged.'
  },
  {
    id: 'python-093',
    subject: 'PythonML',
    topic: 'Debugging',
    difficulty: 'Medium',
    question: 'How to handle `FileNotFoundError`?',
    options: [
      { text: 'Generic Exception catch.', correct: false },
      { text: 'Specific catch, log, and exit.', correct: true },
      { text: 'os.path check.', correct: false },
      { text: 'Let it crash.', correct: false }
    ],
    rationale: 'Targeted error handling prevents masking other issues.'
  },
  {
    id: 'python-094',
    subject: 'PythonML',
    topic: 'Scikit-learn Core',
    difficulty: 'Easy',
    question: 'What does `.fit()` do?',
    options: [
      { text: 'Test predict.', correct: false },
      { text: 'Learn params from X and y.', correct: true },
      { text: 'Scale features.', correct: false },
      { text: 'Cross-validate.', correct: false }
    ],
    rationale: 'Populates the "fitted" attributes (like coefficients) of the model.'
  },
  {
    id: 'python-095',
    subject: 'PythonML',
    topic: 'Pandas & Data Handling',
    difficulty: 'Medium',
    question: '`inner` vs `outer` merge behavior?',
    options: [
      { text: 'Intersection vs Union.', correct: true },
      { text: 'Left vs Right.', correct: false },
      { text: 'Column vs Index.', correct: false },
      { text: 'Speed vs Dtype.', correct: false }
    ],
    rationale: 'Outer join includes rows with no matches in the partner frame.'
  },
  {
    id: 'python-096',
    subject: 'PythonML',
    topic: 'Performance & Memory',
    difficulty: 'Hard',
    question: 'Why is threading effective for network calls despite the GIL?',
    options: [
      { text: 'I/O calls release the GIL.', correct: true },
      { text: 'Threads bypass GIL.', correct: false },
      { text: 'Multiproc is same.', correct: false },
      { text: 'No CPU time used.', correct: false }
    ],
    rationale: 'The interpreter gives other threads control while one is waiting on a response.'
  },
  {
    id: 'python-097',
    subject: 'PythonML',
    topic: 'Data Loading & Preprocessing',
    difficulty: 'Medium',
    question: 'Correct way to predict with a fitted pipeline?',
    options: [
      { text: '`fit_transform` data.', correct: false },
      { text: '`transform` data.', correct: false },
      { text: 'Manual scaling.', correct: false },
      { text: '`pipeline.predict(new_data)`', correct: true }
    ],
    rationale: 'The pipeline handles the necessary transforms automatically.'
  },
  {
    id: 'python-098',
    subject: 'PythonML',
    topic: 'Functions & OOP',
    difficulty: 'Medium',
    question: 'Purpose of `__repr__`?',
    options: [
      { text: 'Init state.', correct: false },
      { text: 'Developer-facing unambiguous string.', correct: true },
      { text: 'Friendly read string.', correct: false },
      { text: 'Comparison.', correct: false }
    ],
    rationale: 'Should ideally look like a valid Python command to recreate the object.'
  },
  {
    id: 'python-099',
    subject: 'PythonML',
    topic: 'Math & NumPy Coding',
    difficulty: 'Hard',
    question: '`result = (x @ w + b) > 0`?',
    options: [
      { text: '`[False, True]`', correct: false },
      { text: '`[0, 1]`', correct: false },
      { text: '`[True, False]`', correct: true },
      { text: 'Values.', correct: false }
    ],
    rationale: 'Standard linear prediction: computes score, adds bias, then binarizes.'
  },
  {
    id: 'python-100',
    subject: 'PythonML',
    topic: 'Exploratory Data Analysis',
    difficulty: 'Easy',
    question: 'Crucial step after understanding the business problem?',
    options: [
      { text: 'Deployment.', correct: false },
      { text: 'Hyperparameter tuning.', correct: false },
      { text: 'Exploratory Data Analysis (EDA).', correct: true },
      { text: 'Final report.', correct: false }
    ],
    rationale: 'Understanding the underlying distribution and noise is key to feature engineering.'
  }
];