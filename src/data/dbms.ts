import { Question } from '@/types';

// DBMS Questions - normalized from original data
export const dbmsQuestions: Question[] = [
  // TOPIC A: Introduction, Architecture & Components
  {
    id: 'dbms-001',
    subject: 'DBMS',
    topic: 'Introduction & Architecture',
    difficulty: 'Easy',
    question: "What is a primary advantage of using a Database Management System (DBMS) over a traditional file system?",
    options: [
      { text: "It requires less storage space for all types of data.", correct: false },
      { text: "It allows for faster direct access to flat files.", correct: false },
      { text: "It provides mechanisms to control data redundancy and inconsistency.", correct: true },
      { text: "It is simpler to set up and requires no specialized knowledge.", correct: false }
    ],
    rationale: "A key feature of a DBMS is its ability to enforce constraints and use normalization to minimize data redundancy and maintain data integrity, which is difficult to manage in a file-based system."
  },
  {
    id: 'dbms-002',
    subject: 'DBMS',
    topic: 'Introduction & Architecture',
    difficulty: 'Easy',
    question: "In the three-schema architecture of a database, which level describes *how* the data is actually stored on the disk?",
    options: [
      { text: "External Level", correct: false },
      { text: "Conceptual Level", correct: false },
      { text: "Internal Level", correct: true },
      { text: "View Level", correct: false }
    ],
    rationale: "The Internal Level (also known as the Physical Level) describes the physical storage structure of the database. The Conceptual Level describes the overall database structure for all users, and the External Level (or View Level) describes a part of the database for a particular user group."
  },
  
  {
    id: 'dbms-003',
    subject: 'DBMS',
    topic: 'Database Languages',
    difficulty: 'Easy',
    question: "Data Definition Language (DDL) is used for which of the following tasks?",
    options: [
      { text: "Retrieving data from tables.", correct: false },
      { text: "Modifying data within tables.", correct: false },
      { text: "Defining the database schema, including creating and altering tables.", correct: true },
      { text: "Controlling access rights to the database.", correct: false }
    ],
    rationale: "DDL statements like `CREATE`, `ALTER`, and `DROP` are used to define and manage the structure (schema) of the database objects. DML is for data manipulation, and DCL is for access control."
  },
  {
    id: 'dbms-004',
    subject: 'DBMS',
    topic: 'Database Languages',
    difficulty: 'Easy',
    question: "The statement `SELECT * FROM Employees;` is an example of which type of database language?",
    options: [
      { text: "Data Definition Language (DDL)", correct: false },
      { text: "Data Manipulation Language (DML)", correct: true },
      { text: "Data Control Language (DCL)", correct: false },
      { text: "Transaction Control Language (TCL)", correct: false }
    ],
    rationale: "DML is used for accessing and manipulating data in a database. `SELECT`, `INSERT`, `UPDATE`, and `DELETE` are the primary DML statements."
  },
  {
    id: 'dbms-005',
    subject: 'DBMS',
    topic: 'DBMS Components',
    difficulty: 'Medium',
    question: "Which of the following is NOT a core component of a DBMS?",
    options: [
      { text: "Query Processor", correct: false },
      { text: "Storage Manager", correct: false },
      { text: "Operating System", correct: true },
      { text: "Transaction Manager", correct: false }
    ],
    rationale: "The Query Processor, Storage Manager, and Transaction Manager are all integral components of a DBMS. The DBMS itself runs on top of an Operating System, but the OS is not a component *of* the DBMS."
  },
  {
    id: 'dbms-006',
    subject: 'DBMS',
    topic: 'Data Models',
    difficulty: 'Medium',
    question: "In which database model is data organized in a tree-like structure with one-to-many relationships?",
    options: [
      { text: "Relational Model", correct: false },
      { text: "Network Model", correct: false },
      { text: "Hierarchical Model", correct: true },
      { text: "Object-Oriented Model", correct: false }
    ],
    rationale: "The Hierarchical Model organizes data into a tree structure where each parent record can have multiple child records, but each child record has only one parent. This strictly enforces a one-to-many relationship."
  },
  {
    id: 'dbms-007',
    subject: 'DBMS',
    topic: 'Data Independence',
    difficulty: 'Medium',
    question: "The ability to modify the internal schema without changing the conceptual schema is known as:",
    options: [
      { text: "Logical Data Independence", correct: false },
      { text: "Physical Data Independence", correct: true },
      { text: "Conceptual Data Independence", correct: false },
      { text: "External Data Independence", correct: false }
    ],
    rationale: "Physical Data Independence allows changes to the physical storage (internal schema), such as using a new storage device or indexing strategy, without affecting the conceptual schema or external views."
  },
  {
    id: 'dbms-008',
    subject: 'DBMS',
    topic: 'Data Dictionary',
    difficulty: 'Easy',
    question: "Which of the following is responsible for storing the metadata about the database schema?",
    options: [
      { text: "The database log", correct: false },
      { text: "The data dictionary", correct: true },
      { text: "The query cache", correct: false },
      { text: "The transaction manager", correct: false }
    ],
    rationale: "The data dictionary, also known as the system catalog, is a repository of metadata. It contains information about the tables, columns, constraints, users, and other objects in the database."
  },
  {
    id: 'dbms-009',
    subject: 'DBMS',
    topic: 'Data Models',
    difficulty: 'Medium',
    question: "The Network Model allows for which type of relationship that the Hierarchical Model does not?",
    options: [
      { text: "One-to-one", correct: false },
      { text: "One-to-many", correct: false },
      { text: "Many-to-many", correct: true },
      { text: "Self-referencing", correct: false }
    ],
    rationale: "The Network Model is more flexible than the Hierarchical Model because it allows a record to have multiple parent records. This structure, which can be represented as a graph, directly supports many-to-many relationships."
  },
  {
    id: 'dbms-010',
    subject: 'DBMS',
    topic: 'Database Administration',
    difficulty: 'Hard',
    question: "Which of the following is a primary function of the Database Administrator (DBA)?",
    options: [
      { text: "Writing application code that accesses the database.", correct: false },
      { text: "Designing the user interface for the database application.", correct: false },
      { text: "Defining the conceptual schema and ensuring database security and availability.", correct: true },
      { text: "Entering and maintaining the data in the database tables.", correct: false }
    ],
    rationale: "A DBA's responsibilities are high-level and administrative. They include schema definition, granting user authority, performance monitoring, and planning for backup and recovery."
  },
  {
    id: 'dbms-011',
    subject: 'DBMS',
    topic: 'Database Languages',
    difficulty: 'Easy',
    question: "Data Manipulation Language (DML) is used for:",
    options: [
      { text: "Creating tables and indexes.", correct: false },
      { text: "Managing users and permissions.", correct: false },
      { text: "Inserting, updating, and deleting data.", correct: true },
      { text: "Defining the structure of the database.", correct: false }
    ],
    rationale: "DML commands are used to manipulate the data stored within the database objects. The primary DML commands are `INSERT`, `UPDATE`, `DELETE`, and `SELECT`."
  },
  {
    id: 'dbms-012',
    subject: 'DBMS',
    topic: 'Data Independence',
    difficulty: 'Hard',
    question: "The ability to change the conceptual schema without having to change the external schemas (user views) is an example of:",
    options: [
      { text: "Physical Data Independence", correct: false },
      { text: "Concurrency Control", correct: false },
      { text: "Logical Data Independence", correct: true },
      { text: "Transaction Management", correct: false }
    ],
    rationale: "Logical Data Independence is the immunity of the external schemas to changes in the conceptual schema (e.g., adding a column)."
  },

  // TOPIC B: ER Model & Relational Mapping
  {
    id: 'dbms-013',
    subject: 'DBMS',
    topic: 'Relational Model',
    difficulty: 'Easy',
    question: "In the relational model, a single row of a table, which contains a single record for that relation, is called a:",
    options: [
      { text: "Tuple", correct: true },
      { text: "Attribute", correct: false },
      { text: "Domain", correct: false },
      { text: "Schema", correct: false }
    ],
    rationale: "A tuple is the formal term for a row in a relational table."
  },
  {
    id: 'dbms-014',
    subject: 'DBMS',
    topic: 'ER Model',
    difficulty: 'Easy',
    question: "In an Entity-Relationship (ER) diagram, what does a rectangle represent?",
    options: [
      { text: "An attribute", correct: false },
      { text: "A relationship", correct: false },
      { text: "An entity set", correct: true },
      { text: "A cardinality constraint", correct: false }
    ],
    rationale: "A rectangle is the standard symbol used in ER diagrams to represent an entity set (e.g., Students)."
  },
  
  {
    id: 'dbms-015',
    subject: 'DBMS',
    topic: 'ER Model',
    difficulty: 'Medium',
    question: "A 'weak entity' in an ER model is an entity that:",
    options: [
      { text: "Has no attributes.", correct: false },
      { text: "Cannot be uniquely identified by its own attributes alone.", correct: true },
      { text: "Does not participate in any relationships.", correct: false },
      { text: "Has more than one primary key.", correct: false }
    ],
    rationale: "A weak entity depends on another entity for its unique identification. It uses a partial key and the primary key of the owner."
  },
  {
    id: 'dbms-016',
    subject: 'DBMS',
    topic: 'ER Model',
    difficulty: 'Medium',
    question: "The number of entities to which another entity can be associated via a relationship set is known as:",
    options: [
      { text: "Degree of the relationship", correct: false },
      { text: "The role of the entity", correct: false },
      { text: "Cardinality", correct: true },
      { text: "The entity's domain", correct: false }
    ],
    rationale: "Cardinality specifies the number of instances of one entity that can be associated with each instance of another entity (1:1, 1:N, M:N)."
  },
  {
    id: 'dbms-017',
    subject: 'DBMS',
    topic: 'ER Model',
    difficulty: 'Medium',
    question: "Consider an ER diagram for a university. `Professor` and `Student` are entities. `Professor advises Student` is a relationship. What is the most likely cardinality?",
    options: [
      { text: "One-to-one", correct: false },
      { text: "One-to-many", correct: true },
      { text: "Many-to-many", correct: false },
      { text: "Many-to-one", correct: false }
    ],
    rationale: "A single professor typically advises multiple students, but each student usually has one primary advisor."
  },
  {
    id: 'dbms-018',
    subject: 'DBMS',
    topic: 'ER Model',
    difficulty: 'Hard',
    question: "The process of designing a more specific entity from a more general one, where the specific entity inherits attributes from the general one, is called:",
    options: [
      { text: "Generalization", correct: false },
      { text: "Specialization", correct: true },
      { text: "Aggregation", correct: false },
      { text: "Association", correct: false }
    ],
    rationale: "Specialization is a top-down design process identifying subgroups within an entity set."
  },
  {
    id: 'dbms-019',
    subject: 'DBMS',
    topic: 'ER Model',
    difficulty: 'Easy',
    question: "In an ER diagram, what does a diamond shape represent?",
    options: [
      { text: "Entity", correct: false },
      { text: "Attribute", correct: false },
      { text: "Relationship", correct: true },
      { text: "Key", correct: false }
    ],
    rationale: "A diamond is the standard symbol used to represent a relationship set connecting entity sets."
  },
  {
    id: 'dbms-020',
    subject: 'DBMS',
    topic: 'Relational Mapping',
    difficulty: 'Hard',
    question: "When mapping an ER diagram to a relational schema, how is a many-to-many relationship between two entities, A and B, typically represented?",
    options: [
      { text: "By adding the primary key of A as a foreign key in B's table.", correct: false },
      { text: "By adding the primary key of B as a foreign key in A's table.", correct: false },
      { text: "By creating a new junction table with the primary keys of both A and B as foreign keys.", correct: true },
      { text: "By merging the two tables into one.", correct: false }
    ],
    rationale: "The standard approach for M:N is a junction/associative table holding pairs of primary keys."
  },
  {
    id: 'dbms-021',
    subject: 'DBMS',
    topic: 'ER Model',
    difficulty: 'Medium',
    question: "An attribute that can have multiple values for a single entity instance is called a:",
    options: [
      { text: "Composite attribute", correct: false },
      { text: "Derived attribute", correct: false },
      { text: "Simple attribute", correct: false },
      { text: "Multivalued attribute", correct: true }
    ],
    rationale: "A multivalued attribute can hold more than one value, like multiple phone numbers for a single student."
  },
  {
    id: 'dbms-022',
    subject: 'DBMS',
    topic: 'ER Model',
    difficulty: 'Medium',
    question: "In an ER diagram, a double-lined rectangle indicates a:",
    options: [
      { text: "Strong Entity Set", correct: false },
      { text: "Relationship Set", correct: false },
      { text: "Weak Entity Set", correct: true },
      { text: "Recursive Relationship", correct: false }
    ],
    rationale: "A weak entity set is depicted by a double-lined rectangle."
  },

  // TOPIC C: Keys & Constraints
  {
    id: 'dbms-023',
    subject: 'DBMS',
    topic: 'Keys',
    difficulty: 'Easy',
    question: "Which type of key uniquely identifies each record in a database table?",
    options: [
      { text: "Foreign Key", correct: false },
      { text: "Super Key", correct: false },
      { text: "Primary Key", correct: true },
      { text: "Alternate Key", correct: false }
    ],
    rationale: "A primary key uniquely identifies a tuple and cannot contain NULL values."
  },
  {
    id: 'dbms-024',
    subject: 'DBMS',
    topic: 'Keys',
    difficulty: 'Easy',
    question: "A key that consists of more than one attribute to uniquely identify a record is called a:",
    options: [
      { text: "Super Key", correct: false },
      { text: "Alternate Key", correct: false },
      { text: "Candidate Key", correct: false },
      { text: "Composite Key", correct: true }
    ],
    rationale: "A composite key is a primary key made up of two or more attributes."
  },
  {
    id: 'dbms-025',
    subject: 'DBMS',
    topic: 'Keys',
    difficulty: 'Medium',
    question: "A Candidate Key is an attribute or set of attributes that:",
    options: [
      { text: "Can be NULL.", correct: false },
      { text: "Is a foreign key in another table.", correct: false },
      { text: "Can uniquely identify a tuple in a table.", correct: true },
      { text: "Is the first key defined on a table.", correct: false }
    ],
    rationale: "A candidate key qualifies as a primary key; one is chosen from the candidate keys to be the primary key."
  },
  {
    id: 'dbms-026',
    subject: 'DBMS',
    topic: 'Integrity Constraints',
    difficulty: 'Medium',
    question: "What is referential integrity?",
    options: [
      { text: "A constraint that ensures all columns in a table have a unique name.", correct: false },
      { text: "A rule that ensures a value in a foreign key column must match a value in the referenced primary key column.", correct: true },
      { text: "A constraint that ensures the primary key of a table does not contain NULL values.", correct: false },
      { text: "A rule that all tables must have a primary key.", correct: false }
    ],
    rationale: "Referential integrity ensures consistency between related tables using foreign keys."
  },
  
  {
    id: 'dbms-027',
    subject: 'DBMS',
    topic: 'Keys',
    difficulty: 'Easy',
    question: "A key in a table that refers to the primary key of another table is called a:",
    options: [
      { text: "Primary Key", correct: false },
      { text: "Candidate Key", correct: false },
      { text: "Foreign Key", correct: true },
      { text: "Super Key", correct: false }
    ],
    rationale: "A foreign key links tables by referencing the primary key of another table."
  },
  {
    id: 'dbms-028',
    subject: 'DBMS',
    topic: 'Keys',
    difficulty: 'Medium',
    question: "What is the relationship between a Primary Key and a Candidate Key?",
    options: [
      { text: "A primary key is a type of candidate key.", correct: true },
      { text: "A candidate key is a type of primary key.", correct: false },
      { text: "They are unrelated concepts.", correct: false },
      { text: "A table can have multiple primary keys but only one candidate key.", correct: false }
    ],
    rationale: "A primary key is the candidate key selected by the DBA to be the main identifier."
  },
  {
    id: 'dbms-029',
    subject: 'DBMS',
    topic: 'Keys',
    difficulty: 'Hard',
    question: "Any candidate key that is not selected to be the primary key is called a(n):",
    options: [
      { text: "Composite Key", correct: false },
      { text: "Foreign Key", correct: false },
      { text: "Super Key", correct: false },
      { text: "Alternate Key", correct: true }
    ],
    rationale: "An alternate key is a candidate key not chosen as the primary key."
  },
  {
    id: 'dbms-030',
    subject: 'DBMS',
    topic: 'Integrity Constraints',
    difficulty: 'Easy',
    question: "Which SQL constraint is used to ensure that a column cannot have a NULL value?",
    options: [
      { text: "UNIQUE", correct: false },
      { text: "CHECK", correct: false },
      { text: "NOT NULL", correct: true },
      { text: "DEFAULT", correct: false }
    ],
    rationale: "The `NOT NULL` constraint enforces that a column must always contain a value."
  },
  {
    id: 'dbms-031',
    subject: 'DBMS',
    topic: 'Keys',
    difficulty: 'Medium',
    question: "A Super Key is a set of attributes that:",
    options: [
      { text: "Must be minimal.", correct: false },
      { text: "Uniquely identifies a tuple within a relation, but is not necessarily minimal.", correct: true },
      { text: "Is chosen by the DBA as the main key.", correct: false },
      { text: "Is a foreign key.", correct: false }
    ],
    rationale: "A super key identifies a tuple; a candidate key is a minimal super key."
  },
  {
    id: 'dbms-032',
    subject: 'DBMS',
    topic: 'Integrity Constraints',
    difficulty: 'Medium',
    question: "What does the `ON DELETE CASCADE` clause do in a foreign key constraint?",
    options: [
      { text: "It prevents the deletion of the referenced primary key row.", correct: false },
      { text: "It sets the foreign key values to NULL when the referenced primary key row is deleted.", correct: false },
      { text: "It automatically deletes the corresponding rows in the child table when the referenced primary key row is deleted.", correct: true },
      { text: "It raises an error if you try to delete a primary key row that is being referenced.", correct: false }
    ],
    rationale: "`ON DELETE CASCADE` automatically propagates deletions from parent to child tables."
  },
  {
    id: 'dbms-033',
    subject: 'DBMS',
    topic: 'Integrity Constraints',
    difficulty: 'Hard',
    question: "Consider a table `Orders` with a foreign key `CustomerID` referencing the `Customers` table. If you try to insert an order with a `CustomerID` that does not exist in the `Customers` table, what will happen?",
    options: [
      { text: "The insert will succeed, but the `CustomerID` will be set to NULL.", correct: false },
      { text: "The database will automatically create a new customer with that ID.", correct: false },
      { text: "The insert operation will fail due to a violation of referential integrity.", correct: true },
      { text: "The insert will succeed, but you won't be able to query the order.", correct: false }
    ],
    rationale: "Inserting a non-existent foreign key violates referential integrity."
  },
  {
    id: 'dbms-034',
    subject: 'DBMS',
    topic: 'Integrity Constraints',
    difficulty: 'Easy',
    question: "The `UNIQUE` constraint on a column ensures that:",
    options: [
      { text: "All values in the column are not NULL.", correct: false },
      { text: "All values in the column are distinct from each other.", correct: true },
      { text: "The column is used as a foreign key.", correct: false },
      { text: "The column is used as a primary key.", correct: false }
    ],
    rationale: "The `UNIQUE` constraint guarantees all values in a column are different."
  },

  // TOPIC D: Normalization
  {
    id: 'dbms-035',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Easy',
    question: "A relation is in First Normal Form (1NF) if:",
    options: [
      { text: "It has no transitive dependencies.", correct: false },
      { text: "All its attributes are atomic (contain single, indivisible values).", correct: true },
      { text: "It has no partial dependencies.", correct: false },
      { text: "It is free from all anomalies.", correct: false }
    ],
    rationale: "1NF requires atomic values and no repeating groups."
  },
  {
    id: 'dbms-036',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Medium',
    question: "A relation is in Second Normal Form (2NF) if it is in 1NF and:",
    options: [
      { text: "Every non-prime attribute is fully functionally dependent on the primary key.", correct: true },
      { text: "There are no transitive dependencies.", correct: false },
      { text: "Every attribute is dependent only on the primary key.", correct: false },
      { text: "It has no multi-valued dependencies.", correct: false }
    ],
    rationale: "2NF eliminates partial dependencies where an attribute depends only on part of a composite key."
  },
  
  {
    id: 'dbms-037',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Medium',
    question: "A relation is in Third Normal Form (3NF) if it is in 2NF and:",
    options: [
      { text: "It has no partial dependencies.", correct: false },
      { text: "All attributes are atomic.", correct: false },
      { text: "There are no transitive dependencies of non-prime attributes on the primary key.", correct: true },
      { text: "It has no multi-valued dependencies.", correct: false }
    ],
    rationale: "3NF eliminates transitive dependencies (non-key attributes depending on other non-key attributes)."
  },
  {
    id: 'dbms-038',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Hard',
    question: "Boyce-Codd Normal Form (BCNF) is a stricter version of 3NF. A relation is in BCNF if for every non-trivial functional dependency X → Y:",
    options: [
      { text: "Y is a prime attribute.", correct: false },
      { text: "X is a prime attribute.", correct: false },
      { text: "Y is a superkey.", correct: false },
      { text: "X is a superkey.", correct: true }
    ],
    rationale: "BCNF requires every determinant to be a superkey."
  },
  {
    id: 'dbms-039',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Medium',
    question: "The process of intentionally violating normal forms to improve query performance is known as:",
    options: [
      { text: "Decomposition", correct: false },
      { text: "Denormalization", correct: true },
      { text: "Dependency Preservation", correct: false },
      { text: "Lossless Join", correct: false }
    ],
    rationale: "Denormalization adds redundancy to reduce joins and improve read speed."
  },
  {
    id: 'dbms-040',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Hard',
    question: "A table with attributes (StudentID, CourseID, Instructor, InstructorOffice) has dependencies: {StudentID, CourseID} → Instructor, and Instructor → InstructorOffice. What is the highest normal form?",
    options: [
      { text: "1NF", correct: false },
      { text: "2NF", correct: true },
      { text: "3NF", correct: false },
      { text: "BCNF", correct: false }
    ],
    rationale: "It violates 3NF due to the transitive dependency Instructor → InstructorOffice."
  },
  {
    id: 'dbms-041',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Easy',
    question: "What is a functional dependency?",
    options: [
      { text: "A constraint between two sets of attributes where the value of one set determines the value of the other.", correct: true },
      { text: "A relationship between two tables defined by a function.", correct: false },
      { text: "A function that computes a value from another attribute.", correct: false },
      { text: "A rule that specifies the domain of an attribute.", correct: false }
    ],
    rationale: "Functional dependency X → Y means X uniquely determines Y."
  },
  {
    id: 'dbms-042',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Hard',
    question: "A relation is in Fourth Normal Form (4NF) if it is in BCNF and has no:",
    options: [
      { text: "Transitive dependencies", correct: false },
      { text: "Partial dependencies", correct: false },
      { text: "Join dependencies", correct: false },
      { text: "Multi-valued dependencies", correct: true }
    ],
    rationale: "4NF eliminates multi-valued dependencies."
  },
  {
    id: 'dbms-043',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Medium',
    question: "Consider a table `R(A, B, C)` with functional dependencies `A → B` and `B → C`. This is a classic example of a:",
    options: [
      { text: "Partial dependency", correct: false },
      { text: "Multi-valued dependency", correct: false },
      { text: "Trivial dependency", correct: false },
      { text: "Transitive dependency", correct: true }
    ],
    rationale: "C depends on A via B, which is a transitive dependency."
  },
  {
    id: 'dbms-044',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Hard',
    question: "Consider a relation R(A, B, C, D) with functional dependencies {A→B, B→C, C→D}. If A is the primary key, what is the highest normal form it satisfies?",
    options: [
      { text: "1NF", correct: false },
      { text: "2NF", correct: true },
      { text: "3NF", correct: false },
      { text: "BCNF", correct: false }
    ],
    rationale: "It has transitive dependencies A→B→C and B→C→D, violating 3NF."
  },
  {
    id: 'dbms-045',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Medium',
    question: "The goal of normalization is primarily to:",
    options: [
      { text: "Maximize query speed.", correct: false },
      { text: "Minimize data redundancy and associated anomalies.", correct: true },
      { text: "Simplify the ER diagram.", correct: false },
      { text: "Reduce the number of tables in the database.", correct: false }
    ],
    rationale: "Normalization organizes attributes to reduce redundancy and prevent anomalies."
  },
  {
    id: 'dbms-046',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Hard',
    question: "What is a 'lossless join decomposition'?",
    options: [
      { text: "A decomposition where joining the decomposed tables results in the exact same set of tuples as the original table.", correct: true },
      { text: "A decomposition where no data is lost during the process, even if the join is not possible.", correct: false },
      { text: "A decomposition that preserves all functional dependencies.", correct: false },
      { text: "A decomposition that results in tables that are all in BCNF.", correct: false }
    ],
    rationale: "Lossless join ensures the original relation can be perfectly reconstructed."
  },
  {
    id: 'dbms-047',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Medium',
    question: "If a table has a composite primary key (A, B) and a non-key attribute C is dependent only on A, this is an example of a:",
    options: [
      { text: "Transitive dependency", correct: false },
      { text: "Partial dependency", correct: true },
      { text: "Multi-valued dependency", correct: false },
      { text: "Full functional dependency", correct: false }
    ],
    rationale: "C depends on only part of the primary key, a 2NF violation."
  },
  {
    id: 'dbms-048',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Hard',
    question: "Fifth Normal Form (5NF) is designed to reduce redundancy in relational databases recording multi-valued facts by isolating:",
    options: [
      { text: "Transitive dependencies", correct: false },
      { text: "Join dependencies", correct: true },
      { text: "Multi-valued dependencies", correct: false },
      { text: "Partial dependencies", correct: false }
    ],
    rationale: "5NF deals with join dependencies."
  },
  {
    id: 'dbms-049',
    subject: 'DBMS',
    topic: 'Normalization',
    difficulty: 'Medium',
    question: "A table `(BookID, AuthorID, AuthorGenre)` with FD `BookID -> AuthorID` and `AuthorID -> AuthorGenre` violates which normal form?",
    options: [
      { text: "1NF", correct: false },
      { text: "2NF", correct: false },
      { text: "3NF", correct: true },
      { text: "BCNF", correct: false }
    ],
    rationale: "It has a transitive dependency BookID -> AuthorID -> AuthorGenre."
  },

  // TOPIC E: SQL Queries (Basics & Aggregates)
  {
    id: 'dbms-050',
    subject: 'DBMS',
    topic: 'SQL Queries',
    difficulty: 'Easy',
    question: "Which SQL keyword is used to retrieve only unique values from a column?",
    options: [
      { text: "UNIQUE", correct: false },
      { text: "DISTINCT", correct: true },
      { text: "DIFFERENT", correct: false },
      { text: "SINGLE", correct: false }
    ],
    rationale: "`DISTINCT` eliminates duplicate records in a result set."
  },
  {
    id: 'dbms-051',
    subject: 'DBMS',
    topic: 'SQL Queries',
    difficulty: 'Easy',
    question: "Which clause is used to filter the results of a SQL query based on a specified condition?",
    options: [
      { text: "HAVING", correct: false },
      { text: "GROUP BY", correct: false },
      { text: "ORDER BY", correct: false },
      { text: "WHERE", correct: true }
    ],
    rationale: "`WHERE` filters rows before grouping occurs."
  },
  {
    id: 'dbms-052',
    subject: 'DBMS',
    topic: 'SQL Commands',
    difficulty: 'Medium',
    question: "What is the difference between `DELETE` and `TRUNCATE` statements?",
    options: [
      { text: "`DELETE` is DML, `TRUNCATE` is DDL; `TRUNCATE` is faster and generally cannot be rolled back.", correct: true },
      { text: "`DELETE` removes all rows, `TRUNCATE` removes specific rows.", correct: false },
      { text: "`TRUNCATE` is slower than `DELETE`.", correct: false },
      { text: "`DELETE` cannot have a `WHERE` clause, but `TRUNCATE` can.", correct: false }
    ],
    rationale: "TRUNCATE is a DDL operation that deallocates pages, making it faster."
  },
  {
    id: 'dbms-053',
    subject: 'DBMS',
    topic: 'SQL Aggregates',
    difficulty: 'Easy',
    question: "Which aggregate function returns the total number of rows that match a specified criterion?",
    options: [
      { text: "SUM()", correct: false },
      { text: "TOTAL()", correct: false },
      { text: "COUNT()", correct: true },
      { text: "NUM()", correct: false }
    ],
    rationale: "`COUNT()` is used to count rows or non-NULL column values."
  },
  {
    id: 'dbms-054',
    subject: 'DBMS',
    topic: 'SQL Aggregates',
    difficulty: 'Medium',
    question: "The `HAVING` clause is used in conjunction with which other clause?",
    options: [
      { text: "WHERE", correct: false },
      { text: "ORDER BY", correct: false },
      { text: "GROUP BY", correct: true },
      { text: "SELECT", correct: false }
    ],
    rationale: "`HAVING` filters results of aggregate functions after grouping."
  },
  {
    id: 'dbms-055',
    subject: 'DBMS',
    topic: 'SQL Queries',
    difficulty: 'Easy',
    question: "How do you sort the results of a `SELECT` statement in descending order?",
    options: [
      { text: "ORDER BY column_name DESC", correct: true },
      { text: "ORDER BY column_name REVERSE", correct: false },
      { text: "SORT BY column_name DESC", correct: false },
      { text: "GROUP BY column_name DESC", correct: false }
    ],
    rationale: "`ORDER BY ... DESC` sorts results in descending order."
  },
  {
    id: 'dbms-056',
    subject: 'DBMS',
    topic: 'SQL Aggregates',
    difficulty: 'Medium',
    question: "What is the result of `SELECT COUNT(commission) FROM Employees;` if the `commission` column contains values (100, NULL, 200, NULL, 150)?",
    options: [
      { text: "5", correct: false },
      { text: "3", correct: true },
      { text: "2", correct: false },
      { text: "An error", correct: false }
    ],
    rationale: "`COUNT(column)` ignores NULL values."
  },
  {
    id: 'dbms-057',
    subject: 'DBMS',
    topic: 'SQL Commands',
    difficulty: 'Easy',
    question: "Which SQL statement is used to insert new data into a database?",
    options: [
      { text: "ADD NEW", correct: false },
      { text: "INSERT INTO", correct: true },
      { text: "UPDATE", correct: false },
      { text: "CREATE", correct: false }
    ],
    rationale: "`INSERT INTO` adds new rows to a table."
  },
  {
    id: 'dbms-058',
    subject: 'DBMS',
    topic: 'SQL Basics',
    difficulty: 'Medium',
    question: "What will be the result of `SELECT 10 + NULL;` in most SQL databases?",
    options: [
      { text: "10", correct: false },
      { text: "0", correct: false },
      { text: "NULL", correct: true },
      { text: "An error", correct: false }
    ],
    rationale: "Arithmetic with NULL results in NULL."
  },
  {
    id: 'dbms-059',
    subject: 'DBMS',
    topic: 'SQL Aggregates',
    difficulty: 'Hard',
    question: "Which query correctly finds all departments that have a total salary greater than 100,000?",
    options: [
      { text: "`SELECT dept FROM employees WHERE SUM(salary) > 100000 GROUP BY dept;`", correct: false },
      { text: "`SELECT dept FROM employees GROUP BY dept WHERE SUM(salary) > 100000;`", correct: false },
      { text: "`SELECT dept FROM employees GROUP BY dept HAVING SUM(salary) > 100000;`", correct: true },
      { text: "`SELECT dept, SUM(salary) FROM employees WHERE salary > 100000;`", correct: false }
    ],
    rationale: "`HAVING` must be used to filter aggregate results like `SUM()`."
  },
  {
    id: 'dbms-060',
    subject: 'DBMS',
    topic: 'SQL Commands',
    difficulty: 'Easy',
    question: "The `UPDATE` statement is used to:",
    options: [
      { text: "Add new rows to a table.", correct: false },
      { text: "Delete existing rows from a table.", correct: false },
      { text: "Modify existing records in a table.", correct: true },
      { text: "Change the data type of a column.", correct: false }
    ],
    rationale: "`UPDATE` modifies existing row values."
  },
  {
    id: 'dbms-061',
    subject: 'DBMS',
    topic: 'SQL Queries',
    difficulty: 'Medium',
    question: "What is the purpose of the `LIMIT` clause in SQL?",
    options: [
      { text: "To restrict the number of columns returned.", correct: false },
      { text: "To restrict the number of rows returned.", correct: true },
      { text: "To set a limit on the maximum value of a column.", correct: false },
      { text: "To limit the number of users who can access a table.", correct: false }
    ],
    rationale: "`LIMIT` constraints the number of rows in the result set."
  },
  {
    id: 'dbms-062',
    subject: 'DBMS',
    topic: 'SQL Aggregates',
    difficulty: 'Medium',
    question: "Which query lists the number of employees in each department?",
    options: [
      { text: "`SELECT department, COUNT(employee_id) FROM employees;`", correct: false },
      { text: "`SELECT department, COUNT(employee_id) FROM employees GROUP BY department;`", correct: true },
      { text: "`SELECT department, SUM(employee_id) FROM employees GROUP BY department;`", correct: false },
      { text: "`SELECT COUNT(department) FROM employees;`", correct: false }
    ],
    rationale: "`GROUP BY department` creates counts per category."
  },
  {
    id: 'dbms-063',
    subject: 'DBMS',
    topic: 'SQL Aggregates',
    difficulty: 'Hard',
    question: "What is a common performance consideration when using `COUNT(DISTINCT column)`?",
    options: [
      { text: "It is often significantly slower than `COUNT(column)` on large datasets.", correct: true },
      { text: "It does not count NULL values, which can be misleading.", correct: false },
      { text: "It cannot be used with a `WHERE` clause.", correct: false },
      { text: "It can only be used on primary key columns.", correct: false }
    ],
    rationale: "Finding unique values before counting is computationally expensive."
  },
  {
    id: 'dbms-064',
    subject: 'DBMS',
    topic: 'SQL Queries',
    difficulty: 'Easy',
    question: "Which SQL operator is used to search for a specified pattern in a column?",
    options: [
      { text: "IN", correct: false },
      { text: "BETWEEN", correct: false },
      { text: "LIKE", correct: true },
      { text: "MATCH", correct: false }
    ],
    rationale: "`LIKE` with wildcards (`%`, `_`) is used for pattern matching."
  },
  {
    id: 'dbms-065',
    subject: 'DBMS',
    topic: 'SQL Commands',
    difficulty: 'Medium',
    question: "If you perform an `UPDATE` statement without a `WHERE` clause, what happens?",
    options: [
      { text: "The statement will fail with a syntax error.", correct: false },
      { text: "The first row of the table will be updated.", correct: false },
      { text: "The last row of the table will be updated.", correct: false },
      { text: "All rows in the table will be updated.", correct: true }
    ],
    rationale: "Without a filter, `UPDATE` applies to every row in the table."
  },
  {
    id: 'dbms-066',
    subject: 'DBMS',
    topic: 'SQL Commands',
    difficulty: 'Easy',
    question: "What is the standard SQL clause to remove a table from a database?",
    options: [
      { text: "`DELETE TABLE table_name;`", correct: false },
      { text: "`REMOVE TABLE table_name;`", correct: false },
      { text: "`DROP TABLE table_name;`", correct: true },
      { text: "`ERASE TABLE table_name;`", correct: false }
    ],
    rationale: "`DROP TABLE` removes the entire table structure and data."
  },
  {
    id: 'dbms-067',
    subject: 'DBMS',
    topic: 'SQL Queries',
    difficulty: 'Medium',
    question: "What is the difference between `UNION` and `UNION ALL`?",
    options: [
      { text: "`UNION` is faster than `UNION ALL`.", correct: false },
      { text: "`UNION` removes duplicate rows from the combined result set, while `UNION ALL` includes all rows.", correct: true },
      { text: "`UNION ALL` removes duplicate rows, while `UNION` includes all rows.", correct: false },
      { text: "`UNION` can combine tables with different numbers of columns, but `UNION ALL` cannot.", correct: false }
    ],
    rationale: "`UNION` performs duplicate removal; `UNION ALL` simply stacks results."
  },

  // TOPIC F: Joins & Advanced Queries
  {
    id: 'dbms-068',
    subject: 'DBMS',
    topic: 'Joins',
    difficulty: 'Medium',
    question: "Which type of `JOIN` returns all rows from the left table, and the matched rows from the right table?",
    options: [
      { text: "INNER JOIN", correct: false },
      { text: "LEFT JOIN", correct: true },
      { text: "RIGHT JOIN", correct: false },
      { text: "FULL OUTER JOIN", correct: false }
    ],
    rationale: "A `LEFT JOIN` returns all left table records and matching right ones."
  },
  {
    id: 'dbms-069',
    subject: 'DBMS',
    topic: 'Joins',
    difficulty: 'Medium',
    question: "A `SELF JOIN` is a regular join, but the table is:",
    options: [
      { text: "Joined with a temporary table.", correct: false },
      { text: "Joined with itself.", correct: true },
      { text: "Joined with a table on another database.", correct: false },
      { text: "A `UNION` of a table with itself.", correct: false }
    ],
    rationale: "A self join compares rows within the same table using aliases."
  },
  {
    id: 'dbms-070',
    subject: 'DBMS',
    topic: 'Subqueries',
    difficulty: 'Hard',
    question: "What is a correlated subquery?",
    options: [
      { text: "A subquery that is executed once before the outer query starts.", correct: false },
      { text: "A subquery that depends on the outer query for its values and is executed repeatedly.", correct: true },
      { text: "A subquery that returns multiple columns.", correct: false },
      { text: "A subquery that uses the `UNION` operator.", correct: false }
    ],
    rationale: "A correlated subquery is re-evaluated for every row of the outer query."
  },
  {
    id: 'dbms-071',
    subject: 'DBMS',
    topic: 'Joins',
    difficulty: 'Medium',
    question: "Which `JOIN` returns only the rows where the join condition is met in both tables?",
    options: [
      { text: "LEFT JOIN", correct: false },
      { text: "RIGHT JOIN", correct: false },
      { text: "FULL OUTER JOIN", correct: false },
      { text: "INNER JOIN", correct: true }
    ],
    rationale: "`INNER JOIN` selects records with matching values in both tables."
  },
  {
    id: 'dbms-072',
    subject: 'DBMS',
    topic: 'Advanced SQL',
    difficulty: 'Hard',
    question: "What is a Common Table Expression (CTE) used for in SQL?",
    options: [
      { text: "To create a permanent temporary table.", correct: false },
      { text: "To define a temporary, named result set that you can reference within a `SELECT`, `INSERT`, `UPDATE`, or `DELETE` statement.", correct: true },
      { text: "To create a view that is automatically dropped at the end of the session.", correct: false },
      { text: "To declare variables for use in a query.", correct: false }
    ],
    rationale: "CTEs (using `WITH`) improve readability of complex queries."
  },
  {
    id: 'dbms-073',
    subject: 'DBMS',
    topic: 'Joins',
    difficulty: 'Medium',
    question: "If `TableA` has 5 rows and `TableB` has 4 rows, what is the maximum number of rows a `FULL OUTER JOIN` between them can produce (assuming no matching keys)?",
    options: [
      { text: "4", correct: false },
      { text: "5", correct: false },
      { text: "9", correct: true },
      { text: "20", correct: false }
    ],
    rationale: "With no matches, `FULL OUTER JOIN` returns all 5 + 4 rows."
  },
  {
    id: 'dbms-074',
    subject: 'DBMS',
    topic: 'Window Functions',
    difficulty: 'Hard',
    question: "Which of the following is a primary use case for window functions like `ROW_NUMBER()`, `RANK()`, and `LAG()`?",
    options: [
      { text: "To perform calculations across a set of table rows that are somehow related to the current row.", correct: true },
      { text: "To filter rows based on a subquery.", correct: false },
      { text: "To group rows into a single output row.", correct: false },
      { text: "To create a new window for displaying query results.", correct: false }
    ],
    rationale: "Window functions operate on a row set relative to the current row without collapsing them into one row."
  },
  {
    id: 'dbms-075',
    subject: 'DBMS',
    topic: 'SQL Basics',
    difficulty: 'Medium',
    question: "What is the difference between `UNION` and `JOIN`?",
    options: [
      { text: "`UNION` combines rows based on a related column, while `JOIN` combines columns.", correct: false },
      { text: "`JOIN` combines columns from different tables into a single row, while `UNION` stacks rows from compatible result sets.", correct: true },
      { text: "They are functionally identical.", correct: false },
      { text: "`UNION` requires tables to have the same number of columns, `JOIN` does not.", correct: false }
    ],
    rationale: "JOIN combines horizontally; UNION stacks vertically."
  },
  {
    id: 'dbms-076',
    subject: 'DBMS',
    topic: 'Joins',
    difficulty: 'Hard',
    question: "What will be the result of a `CROSS JOIN` between a table with 10 rows and a table with 20 rows?",
    options: [
      { text: "30 rows", correct: false },
      { text: "20 rows", correct: false },
      { text: "200 rows", correct: true },
      { text: "An error", correct: false }
    ],
    rationale: "A `CROSS JOIN` is a Cartesian product (10 * 20 = 200)."
  },
  {
    id: 'dbms-077',
    subject: 'DBMS',
    topic: 'SQL Queries',
    difficulty: 'Medium',
    question: "The SQL `INTERSECT` operator is used to:",
    options: [
      { text: "Combine the result sets of two queries and return only the rows that appear in both sets.", correct: true },
      { text: "Combine the result sets of two queries and return all rows from the first set that do not appear in the second.", correct: false },
      { text: "Combine all rows from both queries, including duplicates.", correct: false },
      { text: "Create a Cartesian product of the two result sets.", correct: false }
    ],
    rationale: "`INTERSECT` returns common rows between two sets."
  },
  {
    id: 'dbms-078',
    subject: 'DBMS',
    topic: 'Subqueries',
    difficulty: 'Hard',
    question: "How does a non-correlated subquery work?",
    options: [
      { text: "It is executed for each row of the outer query.", correct: false },
      { text: "It is executed only once, and its result is used by the outer query.", correct: true },
      { text: "It cannot return more than one row.", correct: false },
      { text: "It must be joined to the outer query's table.", correct: false }
    ],
    rationale: "Non-correlated subqueries can run independently once."
  },
  {
    id: 'dbms-079',
    subject: 'DBMS',
    topic: 'Joins',
    difficulty: 'Medium',
    question: "To find employees who have the same job title as 'John Smith', you would likely need to use a:",
    options: [
      { text: "`FULL OUTER JOIN`", correct: false },
      { text: "`CROSS JOIN`", correct: false },
      { text: "`SELF JOIN`", correct: true },
      { text: "`UNION`", correct: false }
    ],
    rationale: "A self join compares rows within the same table."
  },
  {
    id: 'dbms-080',
    subject: 'DBMS',
    topic: 'Window Functions',
    difficulty: 'Hard',
    question: "What is the primary difference between the `RANK()` and `DENSE_RANK()` window functions?",
    options: [
      { text: "`RANK()` is faster than `DENSE_RANK()`.", correct: false },
      { text: "`DENSE_RANK()` assigns consecutive ranks, while `RANK()` leaves gaps in the ranking after ties.", correct: true },
      { text: "`RANK()` assigns consecutive ranks, while `DENSE_RANK()` leaves gaps after ties.", correct: false },
      { text: "`DENSE_RANK()` cannot be used with a `PARTITION BY` clause.", correct: false }
    ],
    rationale: "`DENSE_RANK` never skips numbers (1, 2, 2, 3); `RANK` skips after ties (1, 2, 2, 4)."
  },
  {
    id: 'dbms-081',
    subject: 'DBMS',
    topic: 'Joins',
    difficulty: 'Medium',
    question: "A `NATURAL JOIN` automatically joins tables based on:",
    options: [
      { text: "The primary and foreign key constraints defined between them.", correct: false },
      { text: "The first column in each table.", correct: false },
      { text: "All columns in both tables that have the same name.", correct: true },
      { text: "A join condition specified by the user in the `ON` clause.", correct: false }
    ],
    rationale: "NATURAL JOIN matches all columns with identical names."
  },
  {
    id: 'dbms-082',
    subject: 'DBMS',
    topic: 'Subqueries',
    difficulty: 'Hard',
    question: "What is a primary limitation of a standard subquery in the `SELECT` clause?",
    options: [
      { text: "It cannot be correlated with the outer query.", correct: false },
      { text: "It must return exactly one row and one column.", correct: true },
      { text: "It cannot use aggregate functions.", correct: false },
      { text: "It is significantly slower than a `JOIN`.", correct: false }
    ],
    rationale: "Scalar subqueries in a SELECT list must return a single value."
  },

  // TOPIC G: PL/SQL, Procedures & Triggers
  {
    id: 'dbms-083',
    subject: 'DBMS',
    topic: 'Database Objects',
    difficulty: 'Easy',
    question: "A stored procedure in SQL is:",
    options: [
      { text: "A prepared SQL code that you can save and reuse.", correct: true },
      { text: "A temporary table used for storing query results.", correct: false },
      { text: "A special type of view that can be updated.", correct: false },
      { text: "A security feature for encrypting data.", correct: false }
    ],
    rationale: "Stored procedures are compiled code blocks stored for reuse."
  },
  {
    id: 'dbms-084',
    subject: 'DBMS',
    topic: 'Database Objects',
    difficulty: 'Medium',
    question: "What is the key difference between a stored procedure and a user-defined function (UDF)?",
    options: [
      { text: "Functions can have input parameters, but procedures cannot.", correct: false },
      { text: "Procedures can have `INSERT`/`UPDATE`/`DELETE` statements, while scalar functions typically cannot.", correct: false },
      { text: "Functions must return a value, while procedures are not required to.", correct: false },
      { text: "Both B and C are correct.", correct: true }
    ],
    rationale: "Functions must return values and are usually read-only; procedures can modify state."
  },
  {
    id: 'dbms-085',
    subject: 'DBMS',
    topic: 'Database Objects',
    difficulty: 'Medium',
    question: "What is a trigger in a database?",
    options: [
      { text: "A special type of stored procedure that automatically runs when some event occurs in the database.", correct: true },
      { text: "A constraint that triggers an error when violated.", correct: false },
      { text: "A user-defined function that is triggered by a `SELECT` statement.", correct: false },
      { text: "A log file that triggers a backup.", correct: false }
    ],
    rationale: "Triggers execute automatically on DML events like `INSERT` or `DELETE`."
  },
  {
    id: 'dbms-086',
    subject: 'DBMS',
    topic: 'Database Objects',
    difficulty: 'Easy',
    question: "Which statement is used to execute a stored procedure?",
    options: [
      { text: "`RUN PROCEDURE procedure_name;`", correct: false },
      { text: "`EXECUTE procedure_name;`", correct: false },
      { text: "`CALL procedure_name;`", correct: false },
      { text: "Both B and C are commonly used.", correct: true }
    ],
    rationale: "`EXEC` and `CALL` are standard depending on the DBMS."
  },
  {
    id: 'dbms-087',
    subject: 'DBMS',
    topic: 'Database Objects',
    difficulty: 'Hard',
    question: "What is a potential disadvantage of using triggers?",
    options: [
      { text: "They improve database performance.", correct: false },
      { text: "They can result in complex, hard-to-debug 'cascading' effects.", correct: true },
      { text: "They cannot access other tables.", correct: false },
      { text: "They can only be defined on views, not tables.", correct: false }
    ],
    rationale: "Triggers can cause hidden side effects that are hard to trace."
  },
  {
    id: 'dbms-088',
    subject: 'DBMS',
    topic: 'Database Objects',
    difficulty: 'Medium',
    question: "A SQL function that returns a table is known as a:",
    options: [
      { text: "Scalar Function", correct: false },
      { text: "Aggregate Function", correct: false },
      { text: "Table-Valued Function", correct: true },
      { text: "Stored Procedure", correct: false }
    ],
    rationale: "Table-valued functions return a result set that can be treated like a table."
  },
  {
    id: 'dbms-089',
    subject: 'DBMS',
    topic: 'Database Objects',
    difficulty: 'Medium',
    question: "What is an `INOUT` parameter in a stored procedure?",
    options: [
      { text: "A parameter that can only be used inside the procedure.", correct: false },
      { text: "A parameter whose value is passed into the procedure and a new value can be passed out.", correct: true },
      { text: "A parameter that is for output only.", correct: false },
      { text: "A parameter that is for input only.", correct: false }
    ],
    rationale: "`INOUT` parameters pass a value into the procedure and return a modified value."
  },
  {
    id: 'dbms-090',
    subject: 'DBMS',
    topic: 'Security',
    difficulty: 'Hard',
    question: "Why might a stored procedure be more secure than embedding SQL directly in an application?",
    options: [
      { text: "Stored procedures are always encrypted.", correct: false },
      { text: "It allows for granting `EXECUTE` permissions on the procedure without granting direct access to the underlying tables.", correct: true },
      { text: "Stored procedures cannot be used for SQL injection attacks.", correct: false },
      { text: "Application code cannot call stored procedures with malicious input.", correct: false }
    ],
    rationale: "Granting access only via procedures limits user control over raw table data."
  },

  // TOPIC H: Transactions & ACID
  {
    id: 'dbms-091',
    subject: 'DBMS',
    topic: 'Transactions',
    difficulty: 'Easy',
    question: "What does the 'A' in ACID properties of a transaction stand for?",
    options: [
      { text: "Atomicity", correct: true },
      { text: "Accuracy", correct: false },
      { text: "Availability", correct: false },
      { text: "Association", correct: false }
    ],
    rationale: "Atomicity ensures a transaction is all-or-nothing."
  },
  
  {
    id: 'dbms-092',
    subject: 'DBMS',
    topic: 'Transactions',
    difficulty: 'Easy',
    question: "Which TCL command is used to save the work done in a transaction?",
    options: [
      { text: "ROLLBACK", correct: false },
      { text: "SAVEPOINT", correct: false },
      { text: "COMMIT", correct: true },
      { text: "BEGIN TRANSACTION", correct: false }
    ],
    rationale: "`COMMIT` makes all changes permanent."
  },
  {
    id: 'dbms-093',
    subject: 'DBMS',
    topic: 'Transactions',
    difficulty: 'Medium',
    question: "The 'Consistency' property of ACID ensures that:",
    options: [
      { text: "The data is always stored in the same physical location.", correct: false },
      { text: "A transaction can only bring the database from one valid state to another.", correct: true },
      { text: "All transactions see the same view of the data.", correct: false },
      { text: "Once a transaction is committed, its effects are permanent.", correct: false }
    ],
    rationale: "Consistency ensures transactions don't violate integrity constraints."
  },
  {
    id: 'dbms-094',
    subject: 'DBMS',
    topic: 'Transactions',
    difficulty: 'Medium',
    question: "The 'Isolation' property in ACID is necessary to:",
    options: [
      { text: "Ensure that the effects of an incomplete transaction are not visible to other transactions.", correct: true },
      { text: "Ensure that all parts of a transaction complete successfully.", correct: false },
      { text: "Ensure that data is not lost during a system failure.", correct: false },
      { text: "Ensure that the database follows all defined rules.", correct: false }
    ],
    rationale: "Isolation prevents concurrent transactions from seeing each other's partial work."
  },
  {
    id: 'dbms-095',
    subject: 'DBMS',
    topic: 'Transactions',
    difficulty: 'Easy',
    question: "What does the `ROLLBACK` command do?",
    options: [
      { text: "It ends the current transaction and makes all changes permanent.", correct: false },
      { text: "It undoes all the changes made in the current transaction.", correct: true },
      { text: "It creates a point within a transaction to which you can later roll back.", correct: false },
      { text: "It starts a new transaction.", correct: false }
    ],
    rationale: "`ROLLBACK` reverts changes made since the transaction started."
  },
  {
    id: 'dbms-096',
    subject: 'DBMS',
    topic: 'Transactions',
    difficulty: 'Medium',
    question: "Which ACID property is related to the permanency of committed data, even in the case of a system crash?",
    options: [
      { text: "Atomicity", correct: false },
      { text: "Consistency", correct: false },
      { text: "Isolation", correct: false },
      { text: "Durability", correct: true }
    ],
    rationale: "Durability guarantees committed changes survive crashes."
  },
  {
    id: 'dbms-097',
    subject: 'DBMS',
    topic: 'Transactions',
    difficulty: 'Hard',
    question: "What is a `SAVEPOINT` in a transaction?",
    options: [
      { text: "The final commit of a transaction.", correct: false },
      { text: "A point in a transaction to which you can partially roll back without undoing the entire transaction.", correct: true },
      { text: "An automatic checkpoint created by the DBMS.", correct: false },
      { text: "The start of a nested transaction.", correct: false }
    ],
    rationale: "`SAVEPOINT` markers allow for partial rollbacks within a transaction."
  },
  {
    id: 'dbms-098',
    subject: 'DBMS',
    topic: 'Transactions',
    difficulty: 'Medium',
    question: "A transaction enters the `COMMITTED` state after:",
    options: [
      { text: "The first SQL statement is executed.", correct: false },
      { text: "The last SQL statement is executed.", correct: false },
      { text: "A `COMMIT` command is successfully executed.", correct: true },
      { text: "The user logs out.", correct: false }
    ],
    rationale: "Changes are only permanent after a `COMMIT` finishes."
  },
  {
    id: 'dbms-099',
    subject: 'DBMS',
    topic: 'Recovery',
    difficulty: 'Hard',
    question: "What is log-based recovery in a DBMS?",
    options: [
      { text: "A method of recovering the database by replaying transactions from a log file.", correct: true },
      { text: "A log of all users who have accessed the database, used for security audits.", correct: false },
      { text: "A technique for optimizing queries by logging their performance.", correct: false },
      { text: "A log that tracks the physical location of data blocks.", correct: false }
    ],
    rationale: "Log-based recovery uses a record of all changes to UNDO or REDO work after failure."
  },
  {
    id: 'dbms-100',
    subject: 'DBMS',
    topic: 'Transactions',
    difficulty: 'Medium',
    question: "A transaction that has finished its execution but has not yet been committed is in which state?",
    options: [
      { text: "Active", correct: false },
      { text: "Failed", correct: false },
      { text: "Partially Committed", correct: true },
      { text: "Committed", correct: false }
    ],
    rationale: "A transaction is 'Partially Committed' after the last statement executes but before the final commit."
  },
  
  {
    id: 'dbms-101',
    subject: 'DBMS',
    topic: 'Transactions',
    difficulty: 'Easy',
    question: "What is a transaction?",
    options: [
      { text: "A single SQL query.", correct: false },
      { text: "A collection of operations that forms a single logical unit of work.", correct: true },
      { text: "A connection between a user and the database.", correct: false },
      { text: "A backup of the database.", correct: false }
    ],
    rationale: "A transaction is a logical unit of work that must be completed in its entirety."
  },
  {
    id: 'dbms-102',
    subject: 'DBMS',
    topic: 'Recovery',
    difficulty: 'Hard',
    question: "What is the primary purpose of a 'checkpoint' in the recovery process?",
    options: [
      { text: "To mark the beginning of a transaction.", correct: false },
      { text: "To force all buffered log records and dirty data blocks to be written to disk.", correct: true },
      { text: "To temporarily halt all transactions for a security scan.", correct: false },
      { text: "To create a savepoint within a transaction.", correct: false }
    ],
    rationale: "Checkpoints reduce recovery time by ensuring recent data is on disk."
  },

  // TOPIC I: Concurrency Control
  {
    id: 'dbms-103',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Easy',
    question: "What is a primary problem that concurrency control aims to solve?",
    options: [
      { text: "Slow query performance.", correct: false },
      { text: "Insufficient disk space.", correct: false },
      { text: "Conflicts that arise when multiple transactions access the same data simultaneously.", correct: true },
      { text: "Data corruption due to hardware failure.", correct: false }
    ],
    rationale: "Concurrency control prevents anomalies like lost updates and dirty reads."
  },
  {
    id: 'dbms-104',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Medium',
    question: "What is the difference between a shared lock (S-lock) and an exclusive lock (X-lock)?",
    options: [
      { text: "Multiple transactions can hold a shared lock on an item, but only one transaction can hold an exclusive lock.", correct: true },
      { text: "An exclusive lock can be held by multiple transactions, but a shared lock can only be held by one.", correct: false },
      { text: "Shared locks are for `UPDATE` operations, and exclusive locks are for `SELECT` operations.", correct: false },
      { text: "There is no functional difference.", correct: false }
    ],
    rationale: "S-locks are for reading (concurrently); X-locks are for writing (exclusively)."
  },
  {
    id: 'dbms-105',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Hard',
    question: "What is Two-Phase Locking (2PL)?",
    options: [
      { text: "A protocol where transactions have two phases: first acquiring all locks, then releasing all locks.", correct: false },
      { text: "A protocol where a transaction must first acquire a shared lock and then upgrade it to an exclusive lock.", correct: false },
      { text: "A protocol where a transaction has a growing phase (acquiring locks) and a shrinking phase (releasing locks), and it cannot acquire new locks after it has released any lock.", correct: true },
      { text: "A protocol that uses two different types of locks.", correct: false }
    ],
    rationale: "2PL ensures serializability by restricting lock acquisition after the first lock release."
  },
  {
    id: 'dbms-106',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Medium',
    question: "What is a deadlock in the context of database transactions?",
    options: [
      { text: "When a transaction is unable to acquire any locks.", correct: false },
      { text: "When two or more transactions are waiting for each other to release locks that they need.", correct: true },
      { text: "When a transaction takes too long to complete.", correct: false },
      { text: "When the database runs out of memory for the lock table.", correct: false }
    ],
    rationale: "A deadlock is a circular wait condition where no transaction can proceed."
  },
  {
    id: 'dbms-107',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Easy',
    question: "Which of the following is a strategy for handling deadlocks?",
    options: [
      { text: "Deadlock prevention", correct: false },
      { text: "Deadlock detection and recovery", correct: false },
      { text: "Timeout", correct: false },
      { text: "All of the above", correct: true }
    ],
    rationale: "DBMs use various strategies like prevention, timeouts, or detection to resolve deadlocks."
  },
  {
    id: 'dbms-108',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Hard',
    question: "In transaction isolation levels, what is a 'dirty read'?",
    options: [
      { text: "When a transaction reads data that has been modified by another transaction that has not yet committed.", correct: true },
      { text: "When a transaction re-reads a data item and finds that it has been modified by another committed transaction.", correct: false },
      { text: "When a transaction sees new rows that have been inserted by another committed transaction.", correct: false },
      { text: "When a transaction reads data from an un-indexed table.", correct: false }
    ],
    rationale: "A dirty read reads uncommitted data that might be rolled back."
  },
  {
    id: 'dbms-109',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Medium',
    question: "Which is the lowest (least strict) transaction isolation level defined by the SQL standard?",
    options: [
      { text: "Serializable", correct: false },
      { text: "Repeatable Read", correct: false },
      { text: "Read Committed", correct: false },
      { text: "Read Uncommitted", correct: true }
    ],
    rationale: "`Read Uncommitted` allows all concurrency anomalies for high performance."
  },
  {
    id: 'dbms-110',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Hard',
    question: "What is a 'phantom read'?",
    options: [
      { text: "When a transaction reads data that has been rolled back.", correct: false },
      { text: "When a transaction re-reads data and finds that another transaction has modified it.", correct: false },
      { text: "When a transaction re-executes a query returning a set of rows and finds that another transaction has inserted new rows that satisfy the query's criteria.", correct: true },
      { text: "When a transaction reads from a table that doesn't exist.", correct: false }
    ],
    rationale: "Phantom reads occur when a query re-execution finds new rows from other transactions."
  },
  {
    id: 'dbms-111',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Hard',
    question: "Which isolation level prevents non-repeatable reads but still allows phantom reads?",
    options: [
      { text: "Read Committed", correct: false },
      { text: "Repeatable Read", correct: true },
      { text: "Serializable", correct: false },
      { text: "Read Uncommitted", correct: false }
    ],
    rationale: "Repeatable Read locks existing rows but not the entire range where new rows could be inserted."
  },
  {
    id: 'dbms-112',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Easy',
    question: "The highest level of isolation, which prevents all concurrency anomalies including phantom reads, is:",
    options: [
      { text: "Repeatable Read", correct: false },
      { text: "Serializable", correct: true },
      { text: "Read Committed", correct: false },
      { text: "Snapshot Isolation", correct: false }
    ],
    rationale: "Serializable ensures transaction outcomes are equivalent to a serial order."
  },
  {
    id: 'dbms-113',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Medium',
    question: "What is lock granularity?",
    options: [
      { text: "The amount of time a lock is held.", correct: false },
      { text: "The type of lock being used (shared or exclusive).", correct: false },
      { text: "The size of the data item being locked (e.g., a row, a page, or a whole table).", correct: true },
      { text: "The number of locks a transaction can acquire.", correct: false }
    ],
    rationale: "Granularity ranges from fine (row-level) to coarse (table-level)."
  },
  {
    id: 'dbms-114',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Hard',
    question: "What is timestamp ordering in concurrency control?",
    options: [
      { text: "A locking protocol where locks are ordered by timestamp.", correct: false },
      { text: "A non-locking concurrency control protocol that uses timestamps to determine the serial order of transactions.", correct: true },
      { text: "A method for logging transactions based on their start time.", correct: false },
      { text: "A protocol that assigns a timestamp to each row in the database.", correct: false }
    ],
    rationale: "Timestamp ordering uses starting times to resolve conflicts without locks."
  },
  {
    id: 'dbms-115',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Medium',
    question: "What is a 'lost update' anomaly?",
    options: [
      { text: "When a transaction reads uncommitted data.", correct: false },
      { text: "When two transactions read the same value, and then both update it, causing one update to be overwritten.", correct: true },
      { text: "When a transaction is rolled back by the system.", correct: false },
      { text: "When new rows appear in a repeated query.", correct: false }
    ],
    rationale: "Lost updates happen when concurrent writes overwrite each other based on stale data."
  },
  {
    id: 'dbms-116',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Hard',
    question: "In strict two-phase locking, when are a transaction's exclusive locks released?",
    options: [
      { text: "As soon as the write operation is complete.", correct: false },
      { text: "After the transaction enters the shrinking phase.", correct: false },
      { text: "Only after the transaction has committed or aborted.", correct: true },
      { text: "They are never released, they are converted to shared locks.", correct: false }
    ],
    rationale: "Strict 2PL holds X-locks until the very end to prevent dirty reads."
  },
  {
    id: 'dbms-117',
    subject: 'DBMS',
    topic: 'Concurrency Control',
    difficulty: 'Medium',
    question: "The `Read Committed` isolation level prevents which anomaly?",
    options: [
      { text: "Dirty Reads", correct: true },
      { text: "Non-Repeatable Reads", correct: false },
      { text: "Phantom Reads", correct: false },
      { text: "All of the above", correct: false }
    ],
    rationale: "Read Committed ensures only committed data is read, preventing dirty reads."
  },

  // TOPIC J: Indexing & Query Optimization
  {
    id: 'dbms-118',
    subject: 'DBMS',
    topic: 'Indexing',
    difficulty: 'Easy',
    question: "What is the primary purpose of creating an index on a database table?",
    options: [
      { text: "To enforce data integrity.", correct: false },
      { text: "To provide a logical ordering of the data.", correct: false },
      { text: "To speed up the retrieval of rows from the table.", correct: true },
      { text: "To reduce the storage space required by the table.", correct: false }
    ],
    rationale: "Indexes speed up data retrieval at the cost of storage and write performance."
  },
  {
    id: 'dbms-119',
    subject: 'DBMS',
    topic: 'Indexing',
    difficulty: 'Medium',
    question: "What is the most common data structure used for implementing database indexes?",
    options: [
      { text: "Hash Table", correct: false },
      { text: "Linked List", correct: false },
      { text: "B+ Tree", correct: true },
      { text: "Stack", correct: false }
    ],
    rationale: "B+ Trees are balanced and efficient for both lookups and range scans."
  },
  
  {
    id: 'dbms-120',
    subject: 'DBMS',
    topic: 'Indexing',
    difficulty: 'Medium',
    question: "What is the difference between a clustered and a non-clustered index?",
    options: [
      { text: "A clustered index sorts and stores the actual data rows in the table based on its key values. A table can have only one.", correct: true },
      { text: "A non-clustered index sorts the data, but a clustered index does not.", correct: false },
      { text: "A table can have multiple clustered indexes but only one non-clustered index.", correct: false },
      { text: "Clustered indexes are only for primary keys, while non-clustered indexes are for other columns.", correct: false }
    ],
    rationale: "A clustered index defines the physical order of the data on the disk."
  },
  {
    id: 'dbms-121',
    subject: 'DBMS',
    topic: 'Query Optimization',
    difficulty: 'Easy',
    question: "The component of a DBMS that figures out the most efficient way to execute a query is called the:",
    options: [
      { text: "Query Parser", correct: false },
      { text: "Query Validator", correct: false },
      { text: "Query Optimizer", correct: true },
      { text: "Query Executor", correct: false }
    ],
    rationale: "The query optimizer selects the best execution plan based on cost."
  },
  {
    id: 'dbms-122',
    subject: 'DBMS',
    topic: 'Query Optimization',
    difficulty: 'Hard',
    question: "What is a query execution plan?",
    options: [
      { text: "The SQL code written by the developer.", correct: false },
      { text: "A sequence of steps used to access data in a SQL relational database.", correct: true },
      { text: "A log of all queries that have been executed.", correct: false },
      { text: "A plan for backing up the database during query execution.", correct: false }
    ],
    rationale: "An execution plan is the step-by-step logic the DBMS uses to fetch data."
  },
  {
    id: 'dbms-123',
    subject: 'DBMS',
    topic: 'Indexing',
    difficulty: 'Medium',
    question: "Adding an index to a table will likely have what effect on `INSERT` and `UPDATE` operations?",
    options: [
      { text: "It will speed them up.", correct: false },
      { text: "It will have no effect on them.", correct: false },
      { text: "It will slow them down.", correct: true },
      { text: "It will cause them to fail if the index is not unique.", correct: false }
    ],
    rationale: "Writes are slower because the index data structure must be updated."
  },
  {
    id: 'dbms-124',
    subject: 'DBMS',
    topic: 'Query Optimization',
    difficulty: 'Hard',
    question: "When would a full table scan be more efficient than using an index?",
    options: [
      { text: "Never, an index is always faster.", correct: false },
      { text: "When the query is retrieving a large percentage of the rows in the table.", correct: true },
      { text: "When the table has very few columns.", correct: false },
      { text: "When the query uses a `WHERE` clause.", correct: false }
    ],
    rationale: "If most data is needed, sequential scanning is faster than random index lookups."
  },
  {
    id: 'dbms-125',
    subject: 'DBMS',
    topic: 'Indexing',
    difficulty: 'Medium',
    question: "In a B+ Tree, where is the actual data stored (or pointed to)?",
    options: [
      { text: "In the root nodes only.", correct: false },
      { text: "In the internal (non-leaf) nodes.", correct: false },
      { text: "In the leaf nodes.", correct: true },
      { text: "The data is not stored in the tree, only keys.", correct: false }
    ],
    rationale: "In B+ Trees, only leaf nodes contain pointers to the data rows."
  },
  {
    id: 'dbms-126',
    subject: 'DBMS',
    topic: 'Query Optimization',
    difficulty: 'Hard',
    question: "What is 'cardinality' in the context of query optimization?",
    options: [
      { text: "The number of columns in a table.", correct: false },
      { text: "The number of foreign key relationships a table has.", correct: false },
      { text: "The number of unique values in a column.", correct: true },
      { text: "The physical size of the table in megabytes.", correct: false }
    ],
    rationale: "High cardinality means high selectivity, which helps the optimizer."
  },
  {
    id: 'dbms-127',
    subject: 'DBMS',
    topic: 'Indexing',
    difficulty: 'Medium',
    question: "What is the main disadvantage of having too many indexes on a single table?",
    options: [
      { text: "It significantly degrades read performance.", correct: false },
      { text: "It can confuse the query optimizer.", correct: false },
      { text: "It significantly degrades write (`INSERT`, `UPDATE`, `DELETE`) performance and consumes storage space.", correct: true },
      { text: "It violates the principles of normalization.", correct: false }
    ],
    rationale: "Excessive indexing slows down all data modifications."
  },

  // TOPIC K: Security & Authorization
  {
    id: 'dbms-128',
    subject: 'DBMS',
    topic: 'Security',
    difficulty: 'Easy',
    question: "Which SQL command is used to give a user permission to perform a specific action?",
    options: [
      { text: "ALLOW", correct: false },
      { text: "PERMIT", correct: false },
      { text: "GRANT", correct: true },
      { text: "ASSIGN", correct: false }
    ],
    rationale: "`GRANT` is the standard DCL command for permissions."
  },
  {
    id: 'dbms-129',
    subject: 'DBMS',
    topic: 'Security',
    difficulty: 'Easy',
    question: "Which SQL command is used to take away permissions from a user?",
    options: [
      { text: "DENY", correct: false },
      { text: "REVOKE", correct: true },
      { text: "REMOVE", correct: false },
      { text: "UNGRANT", correct: false }
    ],
    rationale: "`REVOKE` removes previously granted privileges."
  },
  {
    id: 'dbms-130',
    subject: 'DBMS',
    topic: 'Security',
    difficulty: 'Medium',
    question: "What is a database 'role'?",
    options: [
      { text: "A named collection of privileges that can be granted to users.", correct: true },
      { text: "A specific job title for a database user.", correct: false },
      { text: "A log of all actions a user has performed.", correct: false },
      { text: "A type of database backup.", correct: false }
    ],
    rationale: "Roles group permissions together for easier management."
  },
  {
    id: 'dbms-131',
    subject: 'DBMS',
    topic: 'Security',
    difficulty: 'Hard',
    question: "What is a SQL injection attack?",
    options: [
      { text: "An attack where a user injects malicious data into a database.", correct: false },
      { text: "An attack where malicious SQL code is inserted into a data entry field to be executed by the database.", correct: true },
      { text: "An attack that attempts to crash the database.", correct: false },
      { text: "An attack that injects a virus into the server.", correct: false }
    ],
    rationale: "SQL injection manipulates query logic via user input."
  },
  {
    id: 'dbms-132',
    subject: 'DBMS',
    topic: 'Security',
    difficulty: 'Medium',
    question: "What is the most effective way to prevent SQL injection attacks?",
    options: [
      { text: "Encrypting all data in the database.", correct: false },
      { text: "Using prepared statements (parameterized queries).", correct: true },
      { text: "Limiting the length of user input fields.", correct: false },
      { text: "Creating a database role for each user.", correct: false }
    ],
    rationale: "Prepared statements treat input as data, never as executable code."
  },
  {
    id: 'dbms-133',
    subject: 'DBMS',
    topic: 'Security',
    difficulty: 'Easy',
    question: "The process of converting data into a format that cannot be easily understood by unauthorized parties is known as:",
    options: [
      { text: "Normalization", correct: false },
      { text: "Authentication", correct: false },
      { text: "Authorization", correct: false },
      { text: "Encryption", correct: true }
    ],
    rationale: "Encryption protects data confidentiality at rest and in transit."
  },
  {
    id: 'dbms-134',
    subject: 'DBMS',
    topic: 'Security',
    difficulty: 'Medium',
    question: "What is the difference between authentication and authorization?",
    options: [
      { text: "Authentication is verifying who a user is; authorization is determining what they are allowed to do.", correct: true },
      { text: "Authorization is verifying who a user is; authentication is determining what they are allowed to do.", correct: false },
      { text: "They are the same concept.", correct: false },
      { text: "Authentication uses `GRANT`/`REVOKE`, while authorization uses passwords.", correct: false }
    ],
    rationale: "Authentication confirms identity; authorization checks permissions."
  },
  {
    id: 'dbms-135',
    subject: 'DBMS',
    topic: 'Security',
    difficulty: 'Hard',
    question: "What is an audit trail in the context of database security?",
    options: [
      { text: "A trail of how data flows through the ER diagram.", correct: false },
      { text: "A chronological record of database activities, used to track who did what and when.", correct: true },
      { text: "A list of all users and their assigned roles.", correct: false },
      { text: "A record of the query optimizer's decisions.", correct: false }
    ],
    rationale: "Audit trails provide history for security and compliance."
  },

  // TOPIC L: Backup & Recovery
  {
    id: 'dbms-136',
    subject: 'DBMS',
    topic: 'Backup & Recovery',
    difficulty: 'Easy',
    question: "Which type of backup copies all the data in the database?",
    options: [
      { text: "Incremental Backup", correct: false },
      { text: "Differential Backup", correct: false },
      { text: "Full Backup", correct: true },
      { text: "Transaction Log Backup", correct: false }
    ],
    rationale: "A full backup is a complete snapshot of the database."
  },
  {
    id: 'dbms-137',
    subject: 'DBMS',
    topic: 'Backup & Recovery',
    difficulty: 'Medium',
    question: "What is a differential backup?",
    options: [
      { text: "It backs up all data that has changed since the last differential backup.", correct: false },
      { text: "It backs up only the transaction log.", correct: false },
      { text: "It backs up all data that has changed since the last full backup.", correct: true },
      { text: "It backs up data from different databases.", correct: false }
    ],
    rationale: "Differential backups are cumulative since the last full backup."
  },
  {
    id: 'dbms-138',
    subject: 'DBMS',
    topic: 'Backup & Recovery',
    difficulty: 'Hard',
    question: "What is point-in-time recovery (PITR)?",
    options: [
      { text: "The ability to restore a database to its state at any specific moment, typically by applying transaction logs to a backup.", correct: true },
      { text: "A recovery that can only be done at one specific point in the day.", correct: false },
      { text: "A backup method that only copies a single point of data.", correct: false },
      { text: "A recovery that happens instantly.", correct: false }
    ],
    rationale: "PITR uses logs to restore to the exact second before a failure."
  },
  {
    id: 'dbms-139',
    subject: 'DBMS',
    topic: 'Backup & Recovery',
    difficulty: 'Medium',
    question: "What is the primary purpose of a disaster recovery (DR) plan for a database?",
    options: [
      { text: "To optimize query performance.", correct: false },
      { text: "To ensure business continuity by defining how to recover from a major outage or disaster.", correct: true },
      { text: "To normalize the database schema.", correct: false },
      { text: "To grant permissions to users.", correct: false }
    ],
    rationale: "DR plans define procedures for site-wide outages."
  },
  {
    id: 'dbms-140',
    subject: 'DBMS',
    topic: 'Backup & Recovery',
    difficulty: 'Medium',
    question: "An incremental backup contains:",
    options: [
      { text: "All data in the database.", correct: false },
      { text: "All data that has changed since the last full backup.", correct: false },
      { text: "All data that has changed since the last backup of any type (full or incremental).", correct: true },
      { text: "Only the database schema.", correct: false }
    ],
    rationale: "Incremental backups are the smallest, covering only changes since the last backup."
  },

  // TOPIC M: Advanced Topics (NoSQL, Distributed, OLAP)
  {
    id: 'dbms-141',
    subject: 'DBMS',
    topic: 'NoSQL',
    difficulty: 'Easy',
    question: "Which of the following is a characteristic of a NoSQL database?",
    options: [
      { text: "They always use SQL as their query language.", correct: false },
      { text: "They typically have a flexible schema or are schema-less.", correct: true },
      { text: "They are always better for transactional systems than relational databases.", correct: false },
      { text: "They do not support indexing.", correct: false }
    ],
    rationale: "NoSQL databases allow flexible data structures (documents, keys, etc.)."
  },
  {
    id: 'dbms-142',
    subject: 'DBMS',
    topic: 'Distributed Systems',
    difficulty: 'Hard',
    question: "What does the CAP theorem state about distributed databases?",
    options: [
      { text: "A database can be consistent, available, and partitioned simultaneously.", correct: false },
      { text: "A distributed system can provide at most two of the following three guarantees: Consistency, Availability, and Partition Tolerance.", correct: true },
      { text: "All distributed systems must be consistent and available.", correct: false },
      { text: "Partition tolerance is an optional feature for modern databases.", correct: false }
    ],
    rationale: "CAP theorem highlights the trade-off between C, A, and P in network partitions."
  },
  
  {
    id: 'dbms-143',
    subject: 'DBMS',
    topic: 'Distributed Systems',
    difficulty: 'Medium',
    question: "What is database sharding?",
    options: [
      { text: "The process of creating an index on a table.", correct: false },
      { text: "A type of database backup.", correct: false },
      { text: "The process of horizontally partitioning data into smaller, more manageable databases.", correct: true },
      { text: "The process of encrypting a database.", correct: false }
    ],
    rationale: "Sharding splits rows across multiple servers to scale out."
  },
  {
    id: 'dbms-144',
    subject: 'DBMS',
    topic: 'OLAP & OLTP',
    difficulty: 'Easy',
    question: "OLAP is an acronym for:",
    options: [
      { text: "Online Application Processing", correct: false },
      { text: "Online Analytical Processing", correct: true },
      { text: "Offline Analytical Programming", correct: false },
      { text: "Online Algorithmic Processing", correct: false }
    ],
    rationale: "OLAP is optimized for multidimensional data analysis."
  },
  {
    id: 'dbms-145',
    subject: 'DBMS',
    topic: 'OLAP & OLTP',
    difficulty: 'Medium',
    question: "What is the main difference between OLTP and OLAP systems?",
    options: [
      { text: "OLTP is optimized for a large number of write transactions, while OLAP is optimized for complex read queries.", correct: true },
      { text: "OLAP is optimized for write transactions, while OLTP is optimized for read queries.", correct: false },
      { text: "OLTP uses NoSQL databases, while OLAP uses relational databases.", correct: false },
      { text: "There is no significant difference.", correct: false }
    ],
    rationale: "OLTP is for daily transactions; OLAP is for historical reporting/analysis."
  },
  {
    id: 'dbms-146',
    subject: 'DBMS',
    topic: 'Distributed Systems',
    difficulty: 'Hard',
    question: "In the context of the CAP theorem, which two properties does a traditional single-server RDBMS like Oracle or MySQL prioritize?",
    options: [
      { text: "Consistency and Partition Tolerance (CP)", correct: false },
      { text: "Availability and Partition Tolerance (AP)", correct: false },
      { text: "Consistency and Availability (CA)", correct: true },
      { text: "It provides all three (CAP).", correct: false }
    ],
    rationale: "Single-server systems don't handle network partitions, focusing on CA."
  },
  {
    id: 'dbms-147',
    subject: 'DBMS',
    topic: 'Data Warehousing',
    difficulty: 'Medium',
    question: "What is data warehousing?",
    options: [
      { text: "The process of backing up a database.", correct: false },
      { text: "The process of collecting and managing data from varied sources to provide meaningful business insights.", correct: true },
      { text: "A type of NoSQL database.", correct: false },
      { text: "The physical location where database servers are stored.", correct: false }
    ],
    rationale: "Data warehousing integrates disparate data for business intelligence."
  },
  {
    id: 'dbms-148',
    subject: 'DBMS',
    topic: 'Distributed Systems',
    difficulty: 'Medium',
    question: "What is database replication?",
    options: [
      { text: "The process of splitting a table into multiple smaller tables.", correct: false },
      { text: "The process of creating and maintaining multiple copies of a database.", correct: true },
      { text: "The process of normalizing a database.", correct: false },
      { text: "The process of creating an index.", correct: false }
    ],
    rationale: "Replication copies data to secondary servers for availability and scale."
  },
  {
    id: 'dbms-149',
    subject: 'DBMS',
    topic: 'NoSQL',
    difficulty: 'Hard',
    question: "Which of the following is an example of a Key-Value store NoSQL database?",
    options: [
      { text: "MongoDB", correct: false },
      { text: "Cassandra", correct: false },
      { text: "Redis", correct: true },
      { text: "Neo4j", correct: false }
    ],
    rationale: "Redis is a prominent high-performance key-value store."
  },
  {
    id: 'dbms-150',
    subject: 'DBMS',
    topic: 'Distributed Systems',
    difficulty: 'Medium',
    question: "A distributed database is a database in which:",
    options: [
      { text: "The data is stored in a single location but accessed by many users.", correct: false },
      { text: "Storage devices are not all attached to a common processing unit.", correct: true },
      { text: "The database is stored on a single, powerful server.", correct: false },
      { text: "The database is only accessible through a distributed network.", correct: false }
    ],
    rationale: "Distributed databases are spread across multiple physical locations."
  }
];