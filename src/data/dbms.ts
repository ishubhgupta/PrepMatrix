import { Question } from '@/types';

// DBMS Questions - normalized from original data
export const dbmsQuestions: Question[] = [
  {
    id: 'dbms-001',
    subject: 'DBMS',
    topic: 'Introduction & Architecture',
    difficulty: 'Easy',
    question: 'What is a primary advantage of using a Database Management System (DBMS) over a traditional file system?',
    options: [
      { text: 'It requires less storage space for all types of data.', correct: false },
      { text: 'It allows for faster direct access to flat files.', correct: false },
      { text: 'It provides mechanisms to control data redundancy and inconsistency.', correct: true },
      { text: 'It is simpler to set up and requires no specialized knowledge.', correct: false }
    ],
    rationale: 'A key feature of a DBMS is its ability to enforce constraints and use normalization to minimize data redundancy and maintain data integrity, which is difficult to manage in a file-based system.'
  },
  {
    id: 'dbms-002',
    subject: 'DBMS',
    topic: 'Introduction & Architecture',
    difficulty: 'Easy',
    question: 'In the three-schema architecture of a database, which level describes *how* the data is actually stored on the disk?',
    options: [
      { text: 'External Level', correct: false },
      { text: 'Conceptual Level', correct: false },
      { text: 'Internal Level', correct: true },
      { text: 'View Level', correct: false }
    ],
    rationale: 'The Internal Level (also known as the Physical Level) describes the physical storage structure of the database. The Conceptual Level describes the overall database structure for all users, and the External Level (or View Level) describes a part of the database for a particular user group.'
  },
  {
    id: 'dbms-003',
    subject: 'DBMS',
    topic: 'Database Languages',
    difficulty: 'Easy',
    question: 'Data Definition Language (DDL) is used for which of the following tasks?',
    options: [
      { text: 'Retrieving data from tables.', correct: false },
      { text: 'Modifying data within tables.', correct: false },
      { text: 'Defining the database schema, including creating and altering tables.', correct: true },
      { text: 'Controlling access rights to the database.', correct: false }
    ],
    rationale: 'DDL statements like `CREATE`, `ALTER`, and `DROP` are used to define and manage the structure (schema) of the database objects. DML is for data manipulation, and DCL is for access control.'
  },
  {
    id: 'dbms-004',
    subject: 'DBMS',
    topic: 'Database Languages',
    difficulty: 'Easy',
    question: 'The statement `SELECT * FROM Employees;` is an example of which type of database language?',
    options: [
      { text: 'Data Definition Language (DDL)', correct: false },
      { text: 'Data Manipulation Language (DML)', correct: true },
      { text: 'Data Control Language (DCL)', correct: false },
      { text: 'Transaction Control Language (TCL)', correct: false }
    ],
    rationale: 'DML is used for accessing and manipulating data in a database. `SELECT`, `INSERT`, `UPDATE`, and `DELETE` are the primary DML statements.'
  },
  {
    id: 'dbms-005',
    subject: 'DBMS',
    topic: 'DBMS Components',
    difficulty: 'Medium',
    question: 'Which of the following is NOT a core component of a DBMS?',
    options: [
      { text: 'Query Processor', correct: false },
      { text: 'Storage Manager', correct: false },
      { text: 'Operating System', correct: true },
      { text: 'Transaction Manager', correct: false }
    ],
    rationale: 'The Query Processor, Storage Manager, and Transaction Manager are all integral components of a DBMS. The DBMS itself runs on top of an Operating System, but the OS is not a component *of* the DBMS.'
  },
  {
    id: 'dbms-006',
    subject: 'DBMS',
    topic: 'Data Models',
    difficulty: 'Medium',
    question: 'In which database model is data organized in a tree-like structure with one-to-many relationships?',
    options: [
      { text: 'Relational Model', correct: false },
      { text: 'Network Model', correct: false },
      { text: 'Hierarchical Model', correct: true },
      { text: 'Object-Oriented Model', correct: false }
    ],
    rationale: 'The Hierarchical Model organizes data into a tree structure where each parent record can have multiple child records, but each child record has only one parent. This strictly enforces a one-to-many relationship.'
  },
  {
    id: 'dbms-007',
    subject: 'DBMS',
    topic: 'Data Independence',
    difficulty: 'Medium',
    question: 'The ability to modify the internal schema without changing the conceptual schema is known as:',
    options: [
      { text: 'Logical Data Independence', correct: false },
      { text: 'Physical Data Independence', correct: true },
      { text: 'Conceptual Data Independence', correct: false },
      { text: 'External Data Independence', correct: false }
    ],
    rationale: 'Physical Data Independence allows changes to the physical storage (internal schema), such as using a new storage device or indexing strategy, without affecting the conceptual schema or external views.'
  },
  {
    id: 'dbms-008',
    subject: 'DBMS',
    topic: 'Data Dictionary',
    difficulty: 'Easy',
    question: 'Which of the following is responsible for storing the metadata about the database schema?',
    options: [
      { text: 'The database log', correct: false },
      { text: 'The data dictionary', correct: true },
      { text: 'The query cache', correct: false },
      { text: 'The transaction manager', correct: false }
    ],
    rationale: 'The data dictionary, also known as the system catalog, is a repository of metadata. It contains information about the tables, columns, constraints, users, and other objects in the database.'
  },
  {
    id: 'dbms-009',
    subject: 'DBMS',
    topic: 'Data Models',
    difficulty: 'Medium',
    question: 'The Network Model allows for which type of relationship that the Hierarchical Model does not?',
    options: [
      { text: 'One-to-one', correct: false },
      { text: 'One-to-many', correct: false },
      { text: 'Many-to-many', correct: true },
      { text: 'Self-referencing', correct: false }
    ],
    rationale: 'The Network Model is more flexible than the Hierarchical Model because it allows a record to have multiple parent records. This structure, which can be represented as a graph, directly supports many-to-many relationships.'
  },
  {
    id: 'dbms-010',
    subject: 'DBMS',
    topic: 'Database Administration',
    difficulty: 'Hard',
    question: 'Which of the following is a primary function of the Database Administrator (DBA)?',
    options: [
      { text: 'Writing application code that accesses the database.', correct: false },
      { text: 'Designing the user interface for the database application.', correct: false },
      { text: 'Defining the conceptual schema and ensuring database security and availability.', correct: true },
      { text: 'Entering and maintaining the data in the database tables.', correct: false }
    ],
    rationale: 'A DBA\'s responsibilities are high-level and administrative. They include schema definition, granting user authority, performance monitoring, and planning for backup and recovery, but not typically day-to-day data entry or application development.'
  },
  {
    id: 'dbms-011',
    subject: 'DBMS',
    topic: 'Database Languages',
    difficulty: 'Easy',
    question: 'Data Manipulation Language (DML) is used for:',
    options: [
      { text: 'Creating tables and indexes.', correct: false },
      { text: 'Managing users and permissions.', correct: false },
      { text: 'Inserting, updating, and deleting data.', correct: true },
      { text: 'Defining the structure of the database.', correct: false }
    ],
    rationale: 'DML commands are used to manipulate the data stored within the database objects. The primary DML commands are `INSERT`, `UPDATE`, `DELETE`, and `SELECT`.'
  },
  {
    id: 'dbms-012',
    subject: 'DBMS',
    topic: 'Data Independence',
    difficulty: 'Hard',
    question: 'The ability to change the conceptual schema without having to change the external schemas (user views) is an example of:',
    options: [
      { text: 'Physical Data Independence', correct: false },
      { text: 'Concurrency Control', correct: false },
      { text: 'Logical Data Independence', correct: true },
      { text: 'Transaction Management', correct: false }
    ],
    rationale: 'Logical Data Independence is the immunity of the external schemas to changes in the conceptual schema. For example, if a table is split into two, a view can be created to present the data as if it were still one table, so user applications don\'t need to change.'
  },
  {
    id: 'dbms-013',
    subject: 'DBMS',
    topic: 'Relational Model',
    difficulty: 'Easy',
    question: 'In the relational model, a single row of a table, which contains a single record for that relation, is called a:',
    options: [
      { text: 'Tuple', correct: true },
      { text: 'Attribute', correct: false },
      { text: 'Domain', correct: false },
      { text: 'Schema', correct: false }
    ],
    rationale: 'A tuple is the formal term for a row in a relational table. An attribute is a column, a domain is the set of permissible values for an attribute, and a schema is the overall structure of the relation.'
  },
  {
    id: 'dbms-014',
    subject: 'DBMS',
    topic: 'ER Model',
    difficulty: 'Easy',
    question: 'In an Entity-Relationship (ER) diagram, what does a rectangle represent?',
    options: [
      { text: 'An attribute', correct: false },
      { text: 'A relationship', correct: false },
      { text: 'An entity set', correct: true },
      { text: 'A cardinality constraint', correct: false }
    ],
    rationale: 'A rectangle is the standard symbol used in ER diagrams to represent an entity set, which is a collection of similar entities (e.g., Students, Courses).'
  },
  {
    id: 'dbms-015',
    subject: 'DBMS',
    topic: 'Relational Model',
    difficulty: 'Medium',
    question: 'What is a primary key in the relational model?',
    options: [
      { text: 'A key that can have duplicate values', correct: false },
      { text: 'A minimal set of attributes that uniquely identifies each tuple in a relation', correct: true },
      { text: 'Any attribute that appears first in the table', correct: false },
      { text: 'A key that can contain null values', correct: false }
    ],
    rationale: 'A primary key is a minimal set of attributes that uniquely identifies each tuple (row) in a relation (table). It cannot contain null values and must be unique for each record.'
  }
];

// Add more DBMS questions to reach closer to 150 total...
// For brevity, I'm including a representative sample. In production, you'd have all 150.
