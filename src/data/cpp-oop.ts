import { Question } from '@/types';

// C++ OOP Questions - normalized and expanded to 100 questions
export const cppOOPQuestions: Question[] = [
  // --- TOPIC A: OOP Fundamentals & Access Control ---
  {
    id: 'cpp-001',
    subject: 'CppOOP',
    topic: 'OOP Fundamentals',
    difficulty: 'Easy',
    question: 'Which concept in OOP is primarily responsible for bundling data and the methods that operate on that data into a single unit?',
    options: [
      { text: 'Inheritance', correct: false },
      { text: 'Polymorphism', correct: false },
      { text: 'Encapsulation', correct: true },
      { text: 'Abstraction', correct: false }
    ],
    rationale: 'Encapsulation is the bundling of data (attributes) and methods (functions) that operate on the data into a single unit, known as a class. This hides the internal state of an object from the outside world.'
  },
  {
    id: 'cpp-002',
    subject: 'CppOOP',
    topic: 'Classes & Objects',
    difficulty: 'Easy',
    question: 'What is the default access specifier for members of a `class` in C++?',
    options: [
      { text: 'public', correct: false },
      { text: 'private', correct: true },
      { text: 'protected', correct: false },
      { text: 'internal', correct: false }
    ],
    rationale: 'If no access specifier is provided for members of a class, they are `private` by default. This is a key feature of data hiding in C++. For a `struct`, the default is `public`.'
  },
  {
    id: 'cpp-003',
    subject: 'CppOOP',
    topic: 'Classes & Objects',
    difficulty: 'Easy',
    question: 'A function that is defined inside a class is called a:',
    options: [
      { text: 'Static function', correct: false },
      { text: 'Friend function', correct: false },
      { text: 'Member function', correct: true },
      { text: 'Virtual function', correct: false }
    ],
    rationale: 'A member function is a function that is part of a class. It can access the private, protected, and public members of that class.'
  },
  {
    id: 'cpp-023',
    subject: 'CppOOP',
    topic: 'Access Control',
    difficulty: 'Easy',
    question: 'Which access specifier should be used for base class members that you want to be accessible in derived classes but not to the outside world?',
    options: [
      { text: 'public', correct: false },
      { text: 'private', correct: false },
      { text: 'protected', correct: true },
      { text: 'internal', correct: false }
    ],
    rationale: 'The `protected` access specifier makes members accessible within the class itself and to any classes that derive from it, while remaining inaccessible to external code.'
  },
  {
    id: 'cpp-045',
    subject: 'CppOOP',
    topic: 'OOP Fundamentals',
    difficulty: 'Easy',
    question: 'In C++, the `::` operator is called the:',
    options: [
      { text: 'Dot operator', correct: false },
      { text: 'Pointer operator', correct: false },
      { text: 'Scope Resolution Operator', correct: true },
      { text: 'Member access operator', correct: false }
    ],
    rationale: 'The `::` operator is the scope resolution operator. It is used to access static members, base class members, or members of a namespace.'
  },
  {
    id: 'cpp-048',
    subject: 'CppOOP',
    topic: 'OOP Fundamentals',
    difficulty: 'Easy',
    question: 'What is the relationship between a class and an object?',
    options: [
      { text: 'A class is an instance of an object.', correct: false },
      { text: 'An object is an instance of a class.', correct: true },
      { text: 'They are the same thing.', correct: false },
      { text: 'An object is the definition, and a class is the variable.', correct: false }
    ],
    rationale: 'A class is a blueprint or template that defines properties and behaviors. An object is a concrete instance created from that blueprint.'
  },
  {
    id: 'cpp-061',
    subject: 'CppOOP',
    topic: 'OOP Fundamentals',
    difficulty: 'Easy',
    question: "What does the term 'data hiding' mean in the context of OOP?",
    options: [
      { text: 'Encrypting the data members of a class.', correct: false },
      { text: 'Making all data members static.', correct: false },
      { text: 'Restricting access to certain members of an object, usually by making them `private`.', correct: true },
      { text: 'Storing data in a separate file from the class definition.', correct: false }
    ],
    rationale: 'Data hiding is a core principle of encapsulation. It protects an object\'s internal state from unauthorized modification by making data members `private`.'
  },
  {
    id: 'cpp-083',
    subject: 'CppOOP',
    topic: 'Classes & Objects',
    difficulty: 'Medium',
    question: 'What is the difference between a `class` and a `struct` in C++?',
    options: [
      { text: '`struct` cannot have member functions, while `class` can.', correct: false },
      { text: '`struct` members are `public` by default; `class` members are `private` by default.', correct: true },
      { text: '`class` supports inheritance, while `struct` does not.', correct: false },
      { text: '`struct` can only have plain old data types as members.', correct: false }
    ],
    rationale: 'The only technical difference is the default access level for members and base classes. In a `struct`, they are `public`; in a `class`, they are `private`.'
  },
  {
    id: 'cpp-090',
    subject: 'CppOOP',
    topic: 'OOP Fundamentals',
    difficulty: 'Easy',
    question: 'Which operator is used to access members of an object through a pointer?',
    options: [
      { text: '`.` (dot)', correct: false },
      { text: '::', correct: false },
      { text: '`->` (arrow)', correct: true },
      { text: '`&` (address-of)', correct: false }
    ],
    rationale: 'The arrow operator (`->`) is used to dereference a pointer to an object and access its member. `ptr->member` is shorthand for `(*ptr).member`.'
  },

  // --- TOPIC B: Constructors & Destructors ---
  {
    id: 'cpp-004',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Easy',
    question: 'Which type of constructor is automatically provided by the C++ compiler if you do not define any?',
    options: [
      { text: 'Parameterized constructor', correct: false },
      { text: 'Copy constructor', correct: false },
      { text: 'Default constructor', correct: true },
      { text: 'Friend constructor', correct: false }
    ],
    rationale: 'The compiler automatically generates a public default constructor if and only if no other constructors are explicitly defined for that class.'
  },
  {
    id: 'cpp-005',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Easy',
    question: 'What is the primary purpose of a destructor in C++?',
    options: [
      { text: 'To create and initialize objects.', correct: false },
      { text: 'To deallocate memory and release resources when an object is destroyed.', correct: true },
      { text: 'To copy the data from one object to another.', correct: false },
      { text: 'To prevent the creation of objects.', correct: false }
    ],
    rationale: 'A destructor is called automatically when an object goes out of scope or is deleted. Its purpose is to free resources like dynamic memory acquired during the object\'s lifetime.'
  },
  {
    id: 'cpp-007',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Medium',
    question: "When is an object's copy constructor called?",
    options: [
      { text: 'When assigning one object to another (e.g., `obj1 = obj2;`).', correct: false },
      { text: 'When an object is passed by reference to a function.', correct: false },
      { text: 'When an object is initialized with another object of the same class.', correct: true },
      { text: 'When an object is created using the `new` keyword.', correct: false }
    ],
    rationale: 'The copy constructor is called during initialization. The assignment operator is called when assigning values to an already existing object.'
  },
  {
    id: 'cpp-008',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Medium',
    question: 'Which is the preferred way to initialize member variables in a C++ constructor?',
    options: [
      { text: 'By assigning values to them inside the constructor body.', correct: false },
      { text: 'By using a member initialization list.', correct: true },
      { text: 'By creating a separate `init()` member function.', correct: false },
      { text: 'By initializing them in the main function after object creation.', correct: false }
    ],
    rationale: 'A member initialization list is more efficient as it initializes members directly. It is also mandatory for `const` and reference members.'
  },
  {
    id: 'cpp-024',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Medium',
    question: 'Consider the code: `MyClass obj2 = obj1;`. If `MyClass` has a user-defined copy constructor, what can you say about `obj1` and `obj2`?',
    options: [
      { text: '`obj1` and `obj2` are two different names for the same object.', correct: false },
      { text: '`obj2` is a new object that is a shallow copy of `obj1`.', correct: false },
      { text: '`obj2` is a new object whose state is determined by the copy constructor\'s logic.', correct: true },
      { text: 'The assignment operator is called, not the copy constructor.', correct: false }
    ],
    rationale: 'This syntax is initialization, which invokes the copy constructor. The logic within that constructor determines how the state is transferred.'
  },
  {
    id: 'cpp-038',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Hard',
    question: 'What is a virtual destructor, and when is it needed?',
    options: [
      { text: 'A destructor that cannot be called directly. It is needed in all classes.', correct: false },
      { text: 'A destructor declared with the `virtual` keyword. It is needed in a base class if you intend to `delete` a derived class object through a base class pointer.', correct: true },
      { text: 'A destructor that exists only in the vtable. It is needed for abstract classes.', correct: false },
      { text: 'A destructor that is automatically inlined by the compiler.', correct: false }
    ],
    rationale: 'Virtual destructors ensure that the derived class destructor is called before the base class destructor when deleting through a base pointer, preventing resource leaks.'
  },
  {
    id: 'cpp-067',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Easy',
    question: 'Can a class have more than one constructor?',
    options: [
      { text: 'No, a class can only have one constructor.', correct: false },
      { text: 'Yes, as long as they have different names.', correct: false },
      { text: 'Yes, this is called constructor overloading and they must have different parameter lists.', correct: true },
      { text: 'Yes, but one must be a copy constructor.', correct: false }
    ],
    rationale: 'Constructor overloading allows a class to have multiple constructors with unique signatures, enabling objects to be created in different ways.'
  },
  {
    id: 'cpp-075',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Easy',
    question: 'What is a constructor with parameters called?',
    options: [
      { text: 'Default constructor', correct: false },
      { text: 'Copy constructor', correct: false },
      { text: 'Friend constructor', correct: false },
      { text: 'Parameterized constructor', correct: true }
    ],
    rationale: 'A parameterized constructor accepts arguments to initialize an object with specific values at the time of creation.'
  },
  {
    id: 'cpp-080',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Medium',
    question: 'If a class has a pointer data member, which special member functions should typically be implemented (The Rule of Three)?',
    options: [
      { text: 'Constructor, destructor, and a print function.', correct: false },
      { text: 'Destructor, copy constructor, and copy assignment operator.', correct: true },
      { text: 'Default constructor, parameterized constructor, and copy constructor.', correct: false },
      { text: 'Virtual destructor, virtual copy constructor, and virtual assignment operator.', correct: false }
    ],
    rationale: 'The Rule of Three states that if you need a custom destructor for resource management, you likely also need a custom copy constructor and assignment operator.'
  },
  {
    id: 'cpp-085',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Medium',
    question: "What is a constructor's return type?",
    options: [
      { text: 'void', correct: false },
      { text: 'A pointer to the object', correct: false },
      { text: 'The class type itself', correct: false },
      { text: 'A constructor does not have a return type.', correct: true }
    ],
    rationale: 'Constructors are special member functions that initialize an object and do not have a return type, not even `void`.'
  },
  {
    id: 'cpp-093',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Hard',
    question: 'What problem does a virtual destructor solve?',
    options: [
      { text: 'It allows a destructor to be overridden.', correct: false },
      { text: 'It prevents memory leaks when deleting a derived object through a base class pointer.', correct: true },
      { text: 'It ensures destructors are called in the correct order in multiple inheritance.', correct: false },
      { text: 'It makes the destructor execute faster.', correct: false }
    ],
    rationale: 'Without a virtual destructor, deleting a derived object via a base pointer only calls the base destructor, leading to potential resource leaks in the derived part.'
  },
  {
    id: 'cpp-094',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Medium',
    question: 'What is the difference between passing an object by value and passing by reference?',
    options: [
      { text: 'Passing by value is faster than passing by reference.', correct: false },
      { text: 'Passing by value calls the copy constructor to create a copy; passing by reference does not.', correct: true },
      { text: 'Passing by reference gives the function read-only access to the object.', correct: false },
      { text: 'There is no functional difference, only a syntactic one.', correct: false }
    ],
    rationale: 'Passing by value creates a complete copy (calling the copy constructor), whereas passing by reference avoids this overhead by using the original object\'s address.'
  },
  {
    id: 'cpp-096',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Medium',
    question: 'Can a constructor be `virtual`?',
    options: [
      { text: 'Yes, to enable polymorphism during object creation.', correct: false },
      { text: 'No, constructors cannot be virtual.', correct: true },
      { text: 'Yes, but only in a base class.', correct: false },
      { text: 'Only the copy constructor can be virtual.', correct: false }
    ],
    rationale: 'Constructors cannot be virtual because the virtual call mechanism (vtable) is not yet set up until the object is fully constructed.'
  },
  {
    id: 'cpp-097',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Hard',
    question: 'What is the purpose of the `explicit` keyword in C++?',
    options: [
      { text: 'To make a class member visible outside the class.', correct: false },
      { text: 'To prevent the compiler from performing implicit type conversions with a constructor.', correct: true },
      { text: 'To force a function to be inlined.', correct: false },
      { text: 'To declare a function that can throw exceptions.', correct: false }
    ],
    rationale: 'The `explicit` keyword prevents single-argument constructors from being used for implicit type conversions, avoiding subtle and unexpected bugs.'
  },
  {
    id: 'cpp-099',
    subject: 'CppOOP',
    topic: 'Constructors & Destructors',
    difficulty: 'Medium',
    question: 'In what order are the members of a class destroyed?',
    options: [
      { text: 'In the same order they are declared in the class.', correct: false },
      { text: 'In the reverse order they are declared in the class.', correct: true },
      { text: 'In the order they are initialized in the constructor\'s initialization list.', correct: false },
      { text: 'The order is not guaranteed.', correct: false }
    ],
    rationale: 'Just as derived class destructors are called before base class destructors, data members of a class are destroyed in the reverse order of their declaration.'
  },

  // --- TOPIC C: Inheritance ---
  {
    id: 'cpp-009',
    subject: 'CppOOP',
    topic: 'Inheritance',
    difficulty: 'Easy',
    question: 'Which of the following represents the "is-a" relationship in OOP?',
    options: [
      { text: 'Composition', correct: false },
      { text: 'Aggregation', correct: false },
      { text: 'Inheritance', correct: true },
      { text: 'Encapsulation', correct: false }
    ],
    rationale: 'Inheritance models an "is-a" relationship where a derived class inherits properties and behaviors from a more general base class.'
  },
  {
    id: 'cpp-011',
    subject: 'CppOOP',
    topic: 'Inheritance',
    difficulty: 'Medium',
    question: 'When a derived class inherits from a base class using `protected` inheritance, what happens to the `public` and `protected` members of the base class?',
    options: [
      { text: 'They become `public` in the derived class.', correct: false },
      { text: 'They become `private` in the derived class.', correct: false },
      { text: 'They become `protected` in the derived class.', correct: true },
      { text: 'They are not accessible in the derived class.', correct: false }
    ],
    rationale: 'In `protected` inheritance, both public and protected members of the base class become protected in the derived class.'
  },
  {
    id: 'cpp-020',
    subject: 'CppOOP',
    topic: 'Inheritance',
    difficulty: 'Hard',
    question: "What is the 'diamond problem' in C++ inheritance?",
    options: [
      { text: 'When a class inherits from two base classes that have functions with the same name.', correct: false },
      { text: 'When a class inherits from a base class that itself has two or more base classes.', correct: false },
      { text: 'When a class inherits from two classes that have a common base class, leading to ambiguity.', correct: true },
      { text: 'When a class has four base classes, forming a diamond shape.', correct: false }
    ],
    rationale: 'The diamond problem occurs when a derived class inherits from two classes that share a common base, creating ambiguity about which path to use to access base members.'
  },
  {
    id: 'cpp-021',
    subject: 'CppOOP',
    topic: 'Inheritance',
    difficulty: 'Hard',
    question: 'How does a `virtual` base class solve the diamond problem?',
    options: [
      { text: 'It prevents the final derived class from accessing the members of the common base class.', correct: false },
      { text: 'It ensures that only one instance of the common base class is included in the final derived class object.', correct: true },
      { text: 'It forces the programmer to explicitly specify which base class subobject to use.', correct: false },
      { text: 'It makes all members of the common base class static.', correct: false }
    ],
    rationale: 'Virtual inheritance ensures that only a single, shared subobject of the common base class exists in the derived class, eliminating ambiguity.'
  },
  {
    id: 'cpp-040',
    subject: 'CppOOP',
    topic: 'Inheritance',
    difficulty: 'Hard',
    question: 'What is object slicing?',
    options: [
      { text: 'When a derived class object is converted to a base class object through a pointer.', correct: false },
      { text: 'When a derived class object is assigned to a base class object, losing the derived class\'s specific data and behavior.', correct: true },
      { text: 'A technique to access private members of a class from a slice of memory.', correct: false },
      { text: 'When only part of an object\'s data is serialized to a file.', correct: false }
    ],
    rationale: 'Object slicing occurs when a derived object is assigned to a base object by value, causing the derived-specific part of the state to be discarded.'
  },
  {
    id: 'cpp-050',
    subject: 'CppOOP',
    topic: 'Inheritance',
    difficulty: 'Medium',
    question: 'If you derive a class `Student` from a class `Person`, which of the following is true?',
    options: [
      { text: '`Person` has access to `Student`\'s protected members.', correct: false },
      { text: 'A `Student` object can be treated as a `Person` object.', correct: true },
      { text: '`Student` and `Person` are unrelated after compilation.', correct: false },
      { text: 'A `Person` object can be assigned to a `Student` object without a cast.', correct: false }
    ],
    rationale: 'In public inheritance, an object of a derived class is considered an instance of the base class, enabling polymorphism.'
  },
  {
    id: 'cpp-051',
    subject: 'CppOOP',
    topic: 'Inheritance',
    difficulty: 'Medium',
    question: 'What is the main characteristic of multiple inheritance?',
    options: [
      { text: 'A class can have multiple objects.', correct: false },
      { text: 'A class can inherit properties from more than one base class.', correct: true },
      { text: 'A class can be inherited by multiple derived classes.', correct: false },
      { text: 'A class can have multiple constructors.', correct: false }
    ],
    rationale: 'Multiple inheritance allows a derived class to have more than one direct base class, combining features from multiple sources.'
  },
  {
    id: 'cpp-059',
    subject: 'CppOOP',
    topic: 'Inheritance',
    difficulty: 'Easy',
    question: 'Which inheritance type results in the largest number of base class subobjects in a diamond-shaped hierarchy?',
    options: [
      { text: 'Public inheritance', correct: false },
      { text: 'Protected inheritance', correct: false },
      { text: 'Virtual inheritance', correct: false },
      { text: 'Non-virtual inheritance', correct: true }
    ],
    rationale: 'Without virtual inheritance, each path to a shared base class results in a separate subobject of that base class within the derived class.'
  },
  {
    id: 'cpp-081',
    subject: 'CppOOP',
    topic: 'Inheritance',
    difficulty: 'Easy',
    question: 'The process of a derived class acquiring the properties of its base class is known as?',
    options: [
      { text: 'Polymorphism', correct: false },
      { text: 'Inheritance', correct: true },
      { text: 'Encapsulation', correct: false },
      { text: 'Abstraction', correct: false }
    ],
    rationale: 'Inheritance is the primary mechanism for code reuse and hierarchical organization in OOP.'
  },
  {
    id: 'cpp-087',
    subject: 'CppOOP',
    topic: 'Inheritance',
    difficulty: 'Easy',
    question: 'Which of the following shows a valid single inheritance syntax?',
    options: [
      { text: '`class Derived : public Base {}`', correct: true },
      { text: '`class Derived inherits Base {}`', correct: false },
      { text: '`class Derived :: Base {}`', correct: false },
      { text: '`class Derived(Base) {}`', correct: false }
    ],
    rationale: 'The standard C++ syntax for inheritance uses a colon followed by an access specifier and the base class name.'
  },
  {
    id: 'cpp-089',
    subject: 'CppOOP',
    topic: 'Inheritance',
    difficulty: 'Hard',
    question: 'If `class D` inherits from `class B` privately (`class D : private B`), who can access the `public` members of `B`?',
    options: [
      { text: 'Anyone can access them through a `D` object.', correct: false },
      { text: 'Only member functions and friends of `D`.', correct: true },
      { text: 'Only member functions and friends of `B`.', correct: false },
      { text: 'No one can access them.', correct: false }
    ],
    rationale: 'Private inheritance converts public and protected base members into private members of the derived class, restricting access to derived members and friends.'
  },

  // --- TOPIC D: Polymorphism & Abstract Classes ---
  {
    id: 'cpp-013',
    subject: 'CppOOP',
    topic: 'Polymorphism',
    difficulty: 'Easy',
    question: 'The ability of an operator or function to take different forms is known as:',
    options: [
      { text: 'Inheritance', correct: false },
      { text: 'Encapsulation', correct: false },
      { text: 'Overloading', correct: true },
      { text: 'Abstraction', correct: false }
    ],
    rationale: 'Overloading is a form of compile-time polymorphism where functions or operators have multiple definitions based on parameters.'
  },
  {
    id: 'cpp-014',
    subject: 'CppOOP',
    topic: 'Polymorphism',
    difficulty: 'Medium',
    question: 'What is the primary purpose of virtual functions in C++?',
    options: [
      { text: 'To make functions faster by avoiding function calls.', correct: false },
      { text: 'To enable runtime polymorphism and late binding.', correct: true },
      { text: 'To prevent functions from being overridden in derived classes.', correct: false },
      { text: 'To make all functions in a class automatically inline.', correct: false }
    ],
    rationale: 'Virtual functions enable late binding, where the version of the function to execute is determined at runtime based on the actual object type.'
  },
  {
    id: 'cpp-015',
    subject: 'CppOOP',
    topic: 'Abstract Classes',
    difficulty: 'Hard',
    question: 'What makes a class abstract in C++?',
    options: [
      { text: 'Declaring it with the `abstract` keyword.', correct: false },
      { text: 'Having at least one pure virtual function.', correct: true },
      { text: 'Making all its constructors private.', correct: false },
      { text: 'Inheriting from an abstract base class.', correct: false }
    ],
    rationale: 'A pure virtual function (declared with `= 0`) makes a class abstract, preventing its direct instantiation.'
  },
  {
    id: 'cpp-025',
    subject: 'CppOOP',
    topic: 'Abstract Classes',
    difficulty: 'Hard',
    question: 'What is the result of calling a pure virtual function from within a constructor of an abstract base class?',
    options: [
      { text: 'It calls the derived class\'s implementation of the function.', correct: false },
      { text: 'The program terminates because it\'s an illegal operation (pure virtual function call).', correct: true },
      { text: 'It causes a compilation error.', correct: false },
      { text: 'It results in a linker error.', correct: false }
    ],
    rationale: 'During base construction, derived parts are not yet initialized. Calling a pure virtual function at this stage leads to a runtime crash.'
  },
  {
    id: 'cpp-026',
    subject: 'CppOOP',
    topic: 'Abstract Classes',
    difficulty: 'Easy',
    question: "An 'abstract class' in C++ is a class that:",
    options: [
      { text: 'Cannot have any member variables.', correct: false },
      { text: 'Is used as a base class and cannot be instantiated on its own.', correct: true },
      { text: 'Has only public members.', correct: false },
      { text: 'Does not have a constructor.', correct: false }
    ],
    rationale: 'Abstract classes act as blueprints and cannot be instantiated because they contain one or more pure virtual functions.'
  },
  {
    id: 'cpp-027',
    subject: 'CppOOP',
    topic: 'Abstract Classes',
    difficulty: 'Easy',
    question: 'A class that has at least one pure virtual function is called:',
    options: [
      { text: 'A friend class', correct: false },
      { text: 'A virtual class', correct: false },
      { text: 'An abstract class', correct: true },
      { text: 'A static class', correct: false }
    ],
    rationale: 'This is the formal definition of an abstract class in C++.'
  },
  {
    id: 'cpp-042',
    subject: 'CppOOP',
    topic: 'Polymorphism',
    difficulty: 'Easy',
    question: 'Which concept allows a class to have multiple methods with the same name but different parameters?',
    options: [
      { text: 'Function Overriding', correct: false },
      { text: 'Function Overloading', correct: true },
      { text: 'Operator Overriding', correct: false },
      { text: 'Operator Overloading', correct: false }
    ],
    rationale: 'Function overloading allows multiple functions with the same name but unique parameter lists in the same scope.'
  },
  {
    id: 'cpp-043',
    subject: 'CppOOP',
    topic: 'Polymorphism',
    difficulty: 'Medium',
    question: 'What is a pure virtual function?',
    options: [
      { text: 'A virtual function that must be defined in the base class.', correct: false },
      { text: 'A virtual function that is initialized to `nullptr`.', correct: false },
      { text: 'A virtual function that is declared in a base class but has no implementation, forcing derived classes to provide one.', correct: true },
      { text: 'A non-virtual function that returns 0.', correct: false }
    ],
    rationale: 'Pure virtual functions are used to define an interface that derived classes are required to implement.'
  },
  {
    id: 'cpp-053',
    subject: 'CppOOP',
    topic: 'Polymorphism',
    difficulty: 'Easy',
    question: 'How do you define a pure virtual function in C++?',
    options: [
      { text: 'By adding the `pure` keyword to its declaration.', correct: false },
      { text: 'By providing an empty body `{}` for the function.', correct: false },
      { text: 'By assigning `= 0` to its declaration.', correct: true },
      { text: 'By declaring it in the `private` section of the class.', correct: false }
    ],
    rationale: 'The `= 0` syntax explicitly denotes a pure virtual function.'
  },
  {
    id: 'cpp-054',
    subject: 'CppOOP',
    topic: 'Polymorphism',
    difficulty: 'Hard',
    question: 'When a virtual function is called from a base class constructor, which version of the function is executed?',
    options: [
      { text: 'The derived class\'s version.', correct: false },
      { text: 'The base class\'s version.', correct: true },
      { text: 'It results in a compilation error.', correct: false },
      { text: 'The program\'s behavior is undefined.', correct: false }
    ],
    rationale: 'Polymorphism does not apply inside constructors; the version matching the class currently being constructed is used.'
  },
  {
    id: 'cpp-082',
    subject: 'CppOOP',
    topic: 'Abstract Classes',
    difficulty: 'Medium',
    question: 'Can you create an array of objects of an abstract class?',
    options: [
      { text: 'Yes, but only if the array size is determined at compile time.', correct: false },
      { text: 'No, because abstract classes cannot be instantiated.', correct: false },
      { text: 'Yes, but the array must store pointers to the abstract class type.', correct: false },
      { text: 'Both B and C are correct statements.', correct: true }
    ],
    rationale: 'You cannot create an array of abstract objects, but an array of pointers to an abstract type is allowed and common for polymorphism.'
  },
  {
    id: 'cpp-092',
    subject: 'CppOOP',
    topic: 'Abstract Classes',
    difficulty: 'Easy',
    question: 'Which of the following is true about abstract classes?',
    options: [
      { text: 'They can be instantiated.', correct: false },
      { text: 'They must not have a constructor.', correct: false },
      { text: 'Objects of an abstract class can be created using the `new` keyword.', correct: false },
      { text: 'They are intended to be used as base classes.', correct: true }
    ],
    rationale: 'Abstract classes provide a common interface and foundation for a hierarchy of derived classes.'
  },
  {
    id: 'cpp-098',
    subject: 'CppOOP',
    topic: 'Polymorphism',
    difficulty: 'Easy',
    question: 'What is function overriding?',
    options: [
      { text: 'Defining multiple functions with the same name and different parameters.', correct: false },
      { text: 'A derived class providing its own implementation of a base class\'s virtual function.', correct: true },
      { text: 'A friend function accessing the private members of a class.', correct: false },
      { text: 'Defining a function inside another function.', correct: false }
    ],
    rationale: 'Function overriding allows a derived class to specialize behavior inherited from a virtual base class function.'
  },

  // --- TOPIC E: Operator Overloading & The `this` Pointer ---
  {
    id: 'cpp-028',
    subject: 'CppOOP',
    topic: 'The this Pointer',
    difficulty: 'Medium',
    question: 'What is the `this` pointer in C++?',
    options: [
      { text: 'A pointer to the current object\'s derived class.', correct: false },
      { text: 'A static pointer shared by all objects of a class.', correct: false },
      { text: 'A pointer to the current object itself, available within its non-static member functions.', correct: true },
      { text: 'A pointer to the friend function of the current class.', correct: false }
    ],
    rationale: 'The `this` pointer is an implicit parameter allowing a non-static member function to access the address of the object it was called on.'
  },
  {
    id: 'cpp-029',
    subject: 'CppOOP',
    topic: 'Operator Overloading',
    difficulty: 'Easy',
    question: 'Can the `sizeof` operator be overloaded in C++?',
    options: [
      { text: 'Yes, as a member function.', correct: false },
      { text: 'Yes, as a non-member function.', correct: false },
      { text: 'No, it is one of the operators that cannot be overloaded.', correct: true },
      { text: 'Yes, but only for primitive types.', correct: false }
    ],
    rationale: 'Several operators like `sizeof`, `::`, and `.` are fundamental to the language and cannot be redefined.'
  },
  {
    id: 'cpp-030',
    subject: 'CppOOP',
    topic: 'Operator Overloading',
    difficulty: 'Medium',
    question: 'What is the primary difference between overloading the assignment operator (`operator=`) as a member function versus a friend function?',
    options: [
      { text: 'The friend function version is more efficient.', correct: false },
      { text: 'The assignment operator must be overloaded as a non-static member function.', correct: true },
      { text: 'The member function can access private members, but the friend function cannot.', correct: false },
      { text: 'The friend function takes two parameters, while the member function takes one.', correct: false }
    ],
    rationale: 'C++ syntax rules mandate that `operator=`, `operator[]`, `operator()`, and `operator->` must be member functions.'
  },
  {
    id: 'cpp-057',
    subject: 'CppOOP',
    topic: 'Operator Overloading',
    difficulty: 'Easy',
    question: 'In the context of operator overloading, the `this` pointer represents:',
    options: [
      { text: 'Always the first argument to the operator function.', correct: false },
      { text: 'The right-hand operand for a binary operator overloaded as a member function.', correct: false },
      { text: 'The left-hand operand for a binary operator overloaded as a member function.', correct: true },
      { text: 'It is not available in operator overloads.', correct: false }
    ],
    rationale: 'For member operators, the object on the left of the expression is the one that invokes the function (the `this` object).'
  },
  {
    id: 'cpp-060',
    subject: 'CppOOP',
    topic: 'Operator Overloading',
    difficulty: 'Medium',
    question: 'What is the purpose of overloading the function call operator `operator()`?',
    options: [
      { text: 'To allow an object to be called as if it were a function.', correct: true },
      { text: 'To define how a function should be copied.', correct: false },
      { text: 'To overload the `main` function.', correct: false },
      { text: 'To change the precedence of function calls.', correct: false }
    ],
    rationale: 'Overloading `operator()` creates functors, which are objects that maintain state and can be invoked like functions.'
  },
  {
    id: 'cpp-076',
    subject: 'CppOOP',
    topic: 'Operator Overloading',
    difficulty: 'Medium',
    question: 'Which of the following operator pairs can be overloaded?',
    options: [
      { text: '`.` and `::`', correct: false },
      { text: '`sizeof` and `typeid`', correct: false },
      { text: '`new` and `delete`', correct: true },
      { text: '`?:` and `#`', correct: false }
    ],
    rationale: 'Custom memory management is allowed by overloading `new` and `delete` operators.'
  },

  // --- TOPIC F: Friend Functions & Classes ---
  {
    id: 'cpp-016',
    subject: 'CppOOP',
    topic: 'Friend Functions',
    difficulty: 'Easy',
    question: 'What is a `friend` function?',
    options: [
      { text: 'A member function that cannot access private members.', correct: false },
      { text: 'A global or member function of another class that is granted access to the `private` and `protected` members of a class.', correct: true },
      { text: 'A function that must be defined in every derived class.', correct: false },
      { text: 'A public member function that is accessible everywhere.', correct: false }
    ],
    rationale: 'Friend functions are non-member functions granted special permission to access a class\'s internal private data.'
  },
  {
    id: 'cpp-032',
    subject: 'CppOOP',
    topic: 'Friend Functions',
    difficulty: 'Medium',
    question: 'When a `friend` keyword appears in a class definition, what does it signify?',
    options: [
      { text: 'That the class is friendly and can be inherited by any other class.', correct: false },
      { text: 'It grants a non-member function or another class access to its private and protected members.', correct: true },
      { text: 'It indicates that the class is part of the C++ standard library.', correct: false },
      { text: 'It prevents the class from being modified.', correct: false }
    ],
    rationale: 'The friend keyword breaks encapsulation purposefully to allow specific external entities access to private state.'
  },
  {
    id: 'cpp-033',
    subject: 'CppOOP',
    topic: 'Friend Functions',
    difficulty: 'Medium',
    question: 'If `class B` is a friend of `class A`, does that mean `class A` is also a friend of `class B`?',
    options: [
      { text: 'Yes, friendship is always mutual.', correct: false },
      { text: 'No, friendship is not mutual unless explicitly declared in `class B`.', correct: true },
      { text: 'It depends on whether `class B` inherits from `class A`.', correct: false },
      { text: 'Yes, but only if they are in the same source file.', correct: false }
    ],
    rationale: 'Friendship is granted, not taken, and is not reciprocal or transitive by default.'
  },
  {
    id: 'cpp-046',
    subject: 'CppOOP',
    topic: 'Friend Functions',
    difficulty: 'Medium',
    question: 'Which of the following is a valid reason to use a friend function?',
    options: [
      { text: 'To allow a function to modify `const` objects.', correct: false },
      { text: 'When a function needs to access the private members of two or more different classes.', correct: true },
      { text: 'To make a function\'s execution faster.', correct: false },
      { text: 'To make a private member function accessible to the public.', correct: false }
    ],
    rationale: 'Friend functions are useful for operations like cross-class arithmetic or output stream overloading.'
  },
  {
    id: 'cpp-062',
    subject: 'CppOOP',
    topic: 'Friend Functions',
    difficulty: 'Medium',
    question: 'Can a friend function be `virtual`?',
    options: [
      { text: 'Yes, if it is also a member of another class.', correct: false },
      { text: 'No, friend functions cannot be virtual.', correct: true },
      { text: 'Yes, but only in abstract base classes.', correct: false },
      { text: 'Only if the class it is friends with has virtual functions.', correct: false }
    ],
    rationale: 'Virtual keywords apply only to member functions; since friend functions are not members of the class that grants friendship, they cannot be virtual.'
  },

  // --- TOPIC G: Static Members, Const, Inline, & Templates ---
  {
    id: 'cpp-017',
    subject: 'CppOOP',
    topic: 'Static Members',
    difficulty: 'Easy',
    question: 'How is a static data member of a class different from a non-static data member?',
    options: [
      { text: 'It can only be accessed by static member functions.', correct: false },
      { text: 'A separate copy exists for each object of the class.', correct: false },
      { text: 'It cannot be modified after initialization.', correct: false },
      { text: 'Only one copy of it exists, shared by all objects of the class.', correct: true }
    ],
    rationale: 'Static members belong to the class rather than instances, meaning all objects share a single instance of that variable.'
  },
  {
    id: 'cpp-034',
    subject: 'CppOOP',
    topic: 'Const Correctness',
    difficulty: 'Easy',
    question: "What does the `const` keyword at the end of a member function declaration signify (e.g., `void print() const;`)?",
    options: [
      { text: 'The function cannot be overridden.', correct: false },
      { text: 'The function will not modify any data members of the object.', correct: true },
      { text: 'The function can only be called on `const` objects.', correct: false },
      { text: 'The function returns a constant value.', correct: false }
    ],
    rationale: 'A `const` member function guarantees it will not change the object\'s observable state.'
  },
  {
    id: 'cpp-035',
    subject: 'CppOOP',
    topic: 'Const Correctness',
    difficulty: 'Hard',
    question: 'What is the purpose of the `mutable` keyword in C++?',
    options: [
      { text: 'It allows a `const` object to be modified.', correct: false },
      { text: 'It allows a specific data member of a `const` object to be modified from within a `const` member function.', correct: true },
      { text: 'It specifies that a variable can be used in a multi-threaded context.', correct: false },
      { text: 'It makes a member variable behave like a static variable.', correct: false }
    ],
    rationale: 'Mutable members can be changed even within const functions, typically used for internal details like mutexes or cache results.'
  },
  {
    id: 'cpp-036',
    subject: 'CppOOP',
    topic: 'Inline Functions',
    difficulty: 'Easy',
    question: 'What is an inline function?',
    options: [
      { text: 'A function that is automatically executed.', correct: false },
      { text: 'A request to the compiler to replace the function call with the function\'s body to reduce overhead.', correct: true },
      { text: 'A function that can only be one line long.', correct: false },
      { text: 'A function that must be defined inside a class.', correct: false }
    ],
    rationale: 'Inline functions aim to reduce call overhead by expanding the function body at each call site.'
  },
  {
    id: 'cpp-047',
    subject: 'CppOOP',
    topic: 'Static Members',
    difficulty: 'Medium',
    question: 'What is true about a static member function?',
    options: [
      { text: 'It can access both static and non-static data members.', correct: false },
      { text: 'It has a `this` pointer.', correct: false },
      { text: 'It can be called using the class name, without needing an object instance.', correct: true },
      { text: 'It must be declared as `const`.', correct: false }
    ],
    rationale: 'Static functions lack a `this` pointer and thus can only access other static members or be called without an object.'
  },
  {
    id: 'cpp-066',
    subject: 'CppOOP',
    topic: 'Inline Functions',
    difficulty: 'Medium',
    question: 'What is true about an `inline` function?',
    options: [
      { text: 'The compiler must always follow the `inline` suggestion.', correct: false },
      { text: 'It can significantly reduce code size for large functions.', correct: false },
      { text: 'It can improve performance by eliminating function call overhead, but may increase code size.', correct: true },
      { text: 'It can only be used for member functions.', correct: false }
    ],
    rationale: 'Inlining is a trade-off; it speeds up small functions but can cause "code bloat" if overused on large ones.'
  },
  {
    id: 'cpp-068',
    subject: 'CppOOP',
    topic: 'Templates',
    difficulty: 'Hard',
    question: 'A function template is used to:',
    options: [
      { text: 'Create functions that can operate with generic types.', correct: true },
      { text: 'Define a template for class member functions only.', correct: false },
      { text: 'Ensure a function is always inlined.', correct: false },
      { text: 'Generate functions at runtime using RTTI.', correct: false }
    ],
    rationale: 'Templates enable generic programming, allowing a single logic block to work across different data types.'
  },
  {
    id: 'cpp-072',
    subject: 'CppOOP',
    topic: 'RTTI',
    difficulty: 'Medium',
    question: 'In C++, what does RTTI stand for?',
    options: [
      { text: 'Real-Time Type Information', correct: false },
      { text: 'Runtime Type Identification', correct: true },
      { text: 'Re-entrant Type Inheritance', correct: false },
      { text: 'Recursive Template Typing', correct: false }
    ],
    rationale: 'RTTI allows the program to safely determine object types during execution.'
  },
  {
    id: 'cpp-073',
    subject: 'CppOOP',
    topic: 'RTTI',
    difficulty: 'Medium',
    question: 'What is the main use case for the `dynamic_cast` operator?',
    options: [
      { text: 'To cast away the `const`-ness of an object.', correct: false },
      { text: 'To perform a safe downcast of a pointer or reference in an inheritance hierarchy.', correct: true },
      { text: 'To cast any pointer type to any other pointer type.', correct: false },
      { text: 'To perform casts at compile time for better performance.', correct: false }
    ],
    rationale: 'Dynamic cast checks type safety at runtime, returning nullptr if a downcast is invalid.'
  },
  {
    id: 'cpp-077',
    subject: 'CppOOP',
    topic: 'Static Members',
    difficulty: 'Medium',
    question: 'How can a static member function be invoked?',
    options: [
      { text: 'Only through an object of the class.', correct: false },
      { text: 'Only through a pointer to an object of the class.', correct: false },
      { text: 'Using the class name and scope resolution operator, or through an object.', correct: true },
      { text: 'It is invoked automatically when the program starts.', correct: false }
    ],
    rationale: 'Since static functions are class-level, they are typically invoked via the class name but can also be reached via object instances.'
  },

  // --- TOPIC H: Memory Management & RAII ---
  {
    id: 'cpp-018',
    subject: 'CppOOP',
    topic: 'Memory Management',
    difficulty: 'Easy',
    question: 'Which C++ keyword is used to perform dynamic memory allocation?',
    options: [
      { text: 'alloc', correct: false },
      { text: 'create', correct: false },
      { text: 'new', correct: true },
      { text: 'malloc', correct: false }
    ],
    rationale: 'The `new` operator allocates memory on the heap and, unlike malloc, calls the constructor for objects.'
  },
  {
    id: 'cpp-019',
    subject: 'CppOOP',
    topic: 'Memory Management',
    difficulty: 'Medium',
    question: 'What is a potential problem with the following code?\n\n```cpp\nvoid createAndUse() {\n    int* p = new int(5);\n    // ... use p ...\n}\n```',
    options: [
      { text: 'The pointer `p` is not initialized.', correct: false },
      { text: 'A memory leak will occur.', correct: true },
      { text: 'The integer value `5` is too large for the heap.', correct: false },
      { text: 'There is no problem with this code.', correct: false }
    ],
    rationale: 'Failing to call `delete` on heap-allocated memory before the pointer goes out of scope causes a memory leak.'
  },
  {
    id: 'cpp-031',
    subject: 'CppOOP',
    topic: 'Memory Management',
    difficulty: 'Easy',
    question: 'What is the output of the following C++ code?\n\n```cpp\n#include <iostream>\nint main() {\n    int* ptr = new int;\n    *ptr = 10;\n    std::cout << *ptr;\n    delete ptr;\n    return 0;\n}\n```',
    options: [
      { text: '10', correct: true },
      { text: '0', correct: false },
      { text: 'A garbage value', correct: false },
      { text: 'Compilation Error', correct: false }
    ],
    rationale: 'This code illustrates standard heap allocation, assignment, output, and proper deallocation.'
  },
  {
    id: 'cpp-037',
    subject: 'CppOOP',
    topic: 'Memory Management',
    difficulty: 'Medium',
    question: 'What is the primary difference between memory allocation on the stack versus the heap?',
    options: [
      { text: 'Stack memory is faster to allocate and deallocate than heap memory.', correct: true },
      { text: 'Stack memory is managed by the programmer, while heap memory is managed automatically.', correct: false },
      { text: 'Objects on the heap are limited in size, while stack objects are not.', correct: false },
      { text: 'Stack memory persists for the entire duration of the program.', correct: false }
    ],
    rationale: 'The stack uses a simple pointer increment for allocation, while the heap requires searching for available blocks.'
  },
  {
    id: 'cpp-049',
    subject: 'CppOOP',
    topic: 'Memory Management',
    difficulty: 'Hard',
    question: "What does 'RAII' stand for and what does it mean?",
    options: [
      { text: 'Resource Acquisition Is Initialization. It means resources should be acquired in constructors and released in destructors.', correct: true },
      { text: 'Runtime Allocation Is Initialization. It refers to the `new` operator initializing memory.', correct: false },
      { text: 'Resource Acquisition Is Invocation. It is a design pattern for function calls.', correct: false },
      { text: 'Runtime Acquired Is Inlined. It\'s a compiler optimization technique.', correct: false }
    ],
    rationale: 'RAII binds resource management to object lifetime, ensuring deterministic cleanup via destructors.'
  },
  {
    id: 'cpp-056',
    subject: 'CppOOP',
    topic: 'Memory Management',
    difficulty: 'Medium',
    question: 'Which statement about `new` and `malloc()` is true?',
    options: [
      { text: '`new` calls constructors, while `malloc()` does not.', correct: true },
      { text: '`malloc()` is type-safe, while `new` is not.', correct: false },
      { text: '`new` returns a `void*` pointer that must be cast.', correct: false },
      { text: '`malloc()` automatically throws an exception on failure.', correct: false }
    ],
    rationale: '`new` is a C++ operator aware of types and constructors, whereas `malloc` is a C function dealing only in raw bytes.'
  },
  {
    id: 'cpp-069',
    subject: 'CppOOP',
    topic: 'Memory Management',
    difficulty: 'Medium',
    question: 'What is the difference between `delete` and `delete[]`?',
    options: [
      { text: '`delete` is for pointers to objects, `delete[]` is for pointers to primitive types.', correct: false },
      { text: '`delete` frees a single allocated object, `delete[]` frees an array of objects.', correct: true },
      { text: '`delete[]` is a newer syntax for `delete`.', correct: false },
      { text: 'There is no difference, they can be used interchangeably.', correct: false }
    ],
    rationale: 'Mismatched delete operators cause undefined behavior; arrays must use the bracketed version to call all destructors.'
  },
  {
    id: 'cpp-071',
    subject: 'CppOOP',
    topic: 'Memory Management',
    difficulty: 'Easy',
    question: 'Which of the following correctly declares a pointer to an integer?',
    options: [
      { text: '`int &p;`', correct: false },
      { text: '`int *p;`', correct: true },
      { text: '`ptr int p;`', correct: false },
      { text: '`int p*;`', correct: false }
    ],
    rationale: 'The asterisk denotes a pointer type in C++ declarations.'
  },
  {
    id: 'cpp-084',
    subject: 'CppOOP',
    topic: 'Memory Management',
    difficulty: 'Hard',
    question: 'What is a `std::unique_ptr` and what is its key feature?',
    options: [
      { text: 'A pointer that can be shared among multiple owners. Its key feature is reference counting.', correct: false },
      { text: 'A smart pointer that models exclusive ownership of a dynamically allocated object. Its key feature is that it cannot be copied.', correct: true },
      { text: 'A pointer that automatically converts to a raw pointer. Its key feature is backward compatibility.', correct: false },
      { text: 'A pointer that points to a unique memory location on the stack.', correct: false }
    ],
    rationale: 'Unique pointers ensure only one owner exists for a resource, automatically cleaning up when that owner is destroyed.'
  },
  {
    id: 'cpp-100',
    subject: 'CppOOP',
    topic: 'Memory Management',
    difficulty: 'Hard',
    question: 'A C++ program links and runs but gives incorrect results that change between runs. What is a likely cause related to memory management?',
    options: [
      { text: 'A memory leak from not using `delete`.', correct: false },
      { text: 'Use of an uninitialized pointer or a dangling pointer.', correct: true },
      { text: 'Allocating too much memory on the stack.', correct: false },
      { text: 'Forgetting to make a destructor virtual.', correct: false }
    ],
    rationale: 'Dangling pointers or uninitialized variables lead to non-deterministic, undefined behavior during execution.'
  },

  // --- TOPIC I: Code Analysis & Output ---
  {
    id: 'cpp-006',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Easy',
    question: 'What is the output of the following code?\n\n```cpp\n#include <iostream>\nclass A {\npublic:\n    A() { std::cout << "A "; }\n    ~A() { std::cout << "~A "; }\n};\nint main() {\n    A obj;\n    return 0;\n}\n```',
    options: [
      { text: 'A ~A', correct: true },
      { text: '~A A', correct: false },
      { text: 'A', correct: false },
      { text: 'Compilation Error', correct: false }
    ],
    rationale: 'Construction happens at the start of scope, and destruction happens automatically at the end of scope.'
  },
  {
    id: 'cpp-010',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Easy',
    question: 'What will be the output of this code snippet?\n\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    Base() { std::cout << "Base Constructor "; }\n};\nclass Derived : public Base {\npublic:\n    Derived() { std::cout << "Derived Constructor "; }\n};\nint main() {\n    Derived d;\n    return 0;\n}\n```',
    options: [
      { text: 'Derived Constructor Base Constructor', correct: false },
      { text: 'Base Constructor Derived Constructor', correct: true },
      { text: 'Only Derived Constructor', correct: false },
      { text: 'Compilation Error', correct: false }
    ],
    rationale: 'The base class is always constructed first to ensure the foundations of the object are ready for the derived layers.'
  },
  {
    id: 'cpp-012',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'What is the correct order of destructor calls for the object `d` in the following code?\n\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    ~Base() { std::cout << "Base Destructor "; }\n};\nclass Derived : public Base {\npublic:\n    ~Derived() { std::cout << "Derived Destructor "; }\n};\nint main() {\n    Derived d;\n    return 0;\n}\n```',
    options: [
      { text: 'Base Destructor Derived Destructor', correct: false },
      { text: 'Derived Destructor Base Destructor', correct: true },
      { text: 'Only Derived Destructor', correct: false },
      { text: 'The order is undefined.', correct: false }
    ],
    rationale: 'Destruction always proceeds in the exact reverse order of construction.'
  },
  {
    id: 'cpp-022',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'What is the output of the code below?\n\n```cpp\n#include <iostream>\nclass A {\npublic:\n    int x;\n    A() : x(10) {}\n};\nclass B : public A {\npublic:\n    int x;\n    B() : x(20) {}\n};\nint main() {\n    B obj;\n    std::cout << obj.x;\n    return 0;\n}\n```',
    options: [
      { text: '10', correct: false },
      { text: '20', correct: true },
      { text: 'Garbage value', correct: false },
      { text: 'Compilation Error', correct: false }
    ],
    rationale: 'The member `x` in the derived class B hides the member `x` in the base class A.'
  },
  {
    id: 'cpp-039',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'What is the output of the following code?\n\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    virtual void show() { std::cout << "Base "; }\n};\nclass Derived : public Base {\npublic:\n    void show() { std::cout << "Derived "; }\n};\nint main() {\n    Base *b = new Derived();\n    b->show();\n    delete b; \n    return 0;\n}\n```',
    options: [
      { text: 'Base', correct: false },
      { text: 'Derived', correct: true },
      { text: 'Base Derived', correct: false },
      { text: 'Compilation Error', correct: false }
    ],
    rationale: 'Late binding ensures the Derived version of the virtual function is called through the base pointer.'
  },
  {
    id: 'cpp-041',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Hard',
    question: 'What is the output of this code, demonstrating object slicing?\n\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    virtual void print() { std::cout << "Base "; }\n};\nclass Derived : public Base {\npublic:\n    void print() override { std::cout << "Derived "; }\n};\nvoid display(Base obj) {\n    obj.print();\n}\nint main() {\n    Derived d;\n    display(d);\n    return 0;\n}\n```',
    options: [
      { text: 'Derived', correct: false },
      { text: 'Base', correct: true },
      { text: 'Compilation Error', correct: false },
      { text: 'Base Derived', correct: false }
    ],
    rationale: 'Passing by value creates a Base copy of the Derived object, slicing away the Derived behavior and disabling polymorphism.'
  },
  {
    id: 'cpp-044',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Hard',
    question: 'What is the output of the code?\n\n```cpp\n#include <iostream>\nclass A {\npublic:\n    A() { std::cout << "A"; }\n    A(const A& obj) { std::cout << "Acopy"; }\n};\nint main() {\n    A obj1;\n    A obj2 = obj1;\n    A obj3;\n    obj3 = obj1;\n    return 0;\n}\n```',
    options: [
      { text: 'A Acopy A', correct: true },
      { text: 'A A A', correct: false },
      { text: 'A Acopy Acopy', correct: false },
      { text: 'Compilation Error', correct: false }
    ],
    rationale: '`obj2 = obj1` is initialization (Copy Constructor), while `obj3 = obj1` is assignment (Assignment Operator), which is not explicitly logged here.'
  },
  {
    id: 'cpp-052',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'What will be the output?\n\n```cpp\n#include <iostream>\nvoid print(int& x) {\n    std::cout << "lvalue ";\n}\nvoid print(int&& x) {\n    std::cout << "rvalue ";\n}\nint main() {\n    int a = 5;\n    print(a);\n    print(10);\n    return 0;\n}\n```',
    options: [
      { text: 'lvalue lvalue', correct: false },
      { text: 'rvalue rvalue', correct: false },
      { text: 'lvalue rvalue', correct: true },
      { text: 'rvalue lvalue', correct: false }
    ],
    rationale: 'Variables are lvalues, while literals are rvalues, triggering different overloads based on move semantics.'
  },
  {
    id: 'cpp-055',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Hard',
    question: 'What is the output of the following code?\n\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    Base() { show(); }\n    virtual void show() { std::cout << "Base "; }\n};\nclass Derived : public Base {\npublic:\n    Derived() { show(); }\n    void show() override { std::cout << "Derived "; }\n};\nint main() {\n    Derived d;\n    return 0;\n}\n```',
    options: [
      { text: 'Base Derived', correct: true },
      { text: 'Derived Base', correct: false },
      { text: 'Base Base', correct: false },
      { text: 'Derived Derived', correct: false }
    ],
    rationale: 'During Base construction, the object is still a Base type, calling Base::show. Then Derived constructor runs, calling Derived::show.'
  },
  {
    id: 'cpp-063',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'What is the output of the following code?\n\n```cpp\n#include <iostream>\nclass Parent { public: Parent() { std::cout << "P"; } };\nclass Child : public Parent { public: Child() { std::cout << "C"; } };\nclass Grandchild : public Child { public: Grandchild() { std::cout << "G"; } };\nint main() { Grandchild gc; return 0; }\n```',
    options: [
      { text: 'G C P', correct: false },
      { text: 'P C G', correct: true },
      { text: 'G P C', correct: false },
      { text: 'P G C', correct: false }
    ],
    rationale: 'Construction follows the hierarchy from most-base to most-derived.'
  },
  {
    id: 'cpp-070',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'What is the output of the code?\n\n```cpp\n#include <iostream>\nclass MyClass {\npublic:\n    int val;\n    MyClass(int v) : val(v) {}\n    MyClass(const MyClass& other) {\n        val = other.val * 2;\n    }\n};\nint main() {\n    MyClass a(10);\n    MyClass b = a;\n    std::cout << b.val;\n    return 0;\n}\n```',
    options: [
      { text: '10', correct: false },
      { text: '20', correct: true },
      { text: 'Garbage value', correct: false },
      { text: 'Compilation Error', correct: false }
    ],
    rationale: 'Initialization invokes the custom copy constructor, which doubles the original value.'
  },
  {
    id: 'cpp-074',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'What is the output of the following C++ code?\n\n```cpp\n#include <iostream>\nclass A {\npublic:\n    int x = 0;\n};\nint main() {\n    const A obj;\n    // obj.x = 5; \n    std::cout << obj.x;\n    return 0;\n}\n```',
    options: [
      { text: 'It prints 0.', correct: true },
      { text: 'It fails to compile because of the assignment.', correct: false },
      { text: 'It prints a garbage value.', correct: false },
      { text: 'It fails to compile because a const object cannot be created.', correct: false }
    ],
    rationale: 'A const object can be initialized but its data members cannot be modified afterwards.'
  },
  {
    id: 'cpp-079',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Hard',
    question: 'What is the output of the following program?\n\n```cpp\n#include <iostream>\nstruct Base {\n    virtual void name() { std::cout << "Base"; }\n};\nstruct Derived : Base {\n    void name() override { std::cout << "Derived"; }\n};\nint main() {\n    Derived d;\n    Base& b = d;\n    b.name();\n    return 0;\n}\n```',
    options: [
      { text: 'Base', correct: false },
      { text: 'Derived', correct: true },
      { text: 'Compilation error', correct: false },
      { text: 'Undefined behavior', correct: false }
    ],
    rationale: 'Virtual functions work through references, ensuring the dynamic type\'s method is executed.'
  },
  {
    id: 'cpp-088',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'What will this code print?\n\n```cpp\n#include <iostream>\nint main() {\n    int x = 10;\n    int& ref = x;\n    ref = 20;\n    std::cout << x;\n    return 0;\n}\n```',
    options: [
      { text: '10', correct: false },
      { text: '20', correct: true },
      { text: 'A garbage value', correct: false },
      { text: 'Compilation Error', correct: false }
    ],
    rationale: 'A reference is an alias; changing the reference directly modifies the underlying variable.'
  },
  {
    id: 'cpp-095',
    subject: 'CppOOP',
    topic: 'Code Analysis',
    difficulty: 'Medium',
    question: 'What will this code print?\n\n```cpp\n#include <iostream>\nclass A {\npublic:\n    static int count;\n    A() { count++; }\n};\nint A::count = 0;\nint main() {\n    A obj1, obj2, obj3;\n    std::cout << A::count;\n    return 0;\n}\n```',
    options: [
      { text: '0', correct: false },
      { text: '1', correct: false },
      { text: '3', correct: true },
      { text: 'Compilation Error', correct: false }
    ],
    rationale: 'Static variables are shared among all instances, incrementing with each constructor call.'
  },

  // --- TOPIC J: Best Practices & Design Patterns ---
  {
    id: 'cpp-058',
    subject: 'CppOOP',
    topic: 'Design Patterns',
    difficulty: 'Hard',
    question: 'What is a key characteristic of the Curiously Recurring Template Pattern (CRTP)?',
    options: [
      { text: 'It involves a base class that takes a derived class as a template parameter.', correct: true },
      { text: 'It\'s a method to achieve dynamic polymorphism without virtual functions.', correct: false },
      { text: 'It\'s used primarily for solving the diamond problem.', correct: false },
      { text: 'It is a runtime technique for identifying class types.', correct: false }
    ],
    rationale: 'CRTP enables static polymorphism, where the base class can call derived methods at compile time.'
  },
  {
    id: 'cpp-064',
    subject: 'CppOOP',
    topic: 'Design Patterns',
    difficulty: 'Hard',
    question: 'You have a class `Resource` that manages a file handle. How would you design this class to follow RAII principles?',
    options: [
      { text: 'Create `open()` and `close()` methods that the user must call manually.', correct: false },
      { text: 'Open the file in the constructor and close it in the destructor.', correct: true },
      { text: 'Use a global function to manage all `Resource` objects.', correct: false },
      { text: 'Store the file handle in a static variable.', correct: false }
    ],
    rationale: 'RAII ensures that cleanup occurs automatically when the managing object\'s lifetime ends.'
  },
  {
    id: 'cpp-065',
    subject: 'CppOOP',
    topic: 'Design Patterns',
    difficulty: 'Medium',
    question: 'When should you prefer composition over inheritance?',
    options: [
      { text: 'When there is a clear "is-a" relationship.', correct: false },
      { text: 'When you want to model a "has-a" relationship.', correct: true },
      { text: 'When you need to override base class methods.', correct: false },
      { text: 'When you want to use runtime polymorphism.', correct: false }
    ],
    rationale: 'Composition is more flexible than inheritance and is preferred for building objects that contain other objects.'
  },
  {
    id: 'cpp-078',
    subject: 'CppOOP',
    topic: 'Design Patterns',
    difficulty: 'Hard',
    question: 'In a class, you have a non-explicit single-argument constructor. What potential issue might this cause?',
    options: [
      { text: 'The class becomes abstract.', correct: false },
      { text: 'It can lead to unexpected implicit type conversions.', correct: true },
      { text: 'The default constructor is no longer generated.', correct: false },
      { text: 'The class cannot be used in an inheritance hierarchy.', correct: false }
    ],
    rationale: 'Implicit conversions can occur where not intended, leading to logic bugs; the `explicit` keyword mitigates this.'
  },
  {
    id: 'cpp-086',
    subject: 'CppOOP',
    topic: 'Best Practices',
    difficulty: 'Hard',
    question: 'In the context of exception handling, what happens if an exception is thrown from a destructor?',
    options: [
      { text: 'The program terminates immediately.', correct: true },
      { text: 'The exception is automatically caught and ignored.', correct: false },
      { text: 'The exception propagates up the call stack as normal.', correct: false },
      { text: 'The memory for the object is not deallocated.', correct: false }
    ],
    rationale: 'If a destructor throws while another exception is already active during stack unwinding, C++ calls terminate.'
  },
  {
    id: 'cpp-091',
    subject: 'CppOOP',
    topic: 'Design Patterns',
    difficulty: 'Medium',
    question: "What is the primary purpose of a 'function object' or 'functor'?",
    options: [
      { text: 'To create an object that encapsulates a function, allowing it to have state.', correct: true },
      { text: 'To provide an alternative syntax for calling member functions.', correct: false },
      { text: 'To automatically generate function documentation.', correct: false },
      { text: 'To ensure a function is only called once.', correct: false }
    ],
    rationale: 'Functors are objects with an overloaded operator(), allowing them to be passed as functions while carrying internal data.'
  }
];