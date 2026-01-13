import { Question } from '@/types';

// Operating Systems Questions
export const osQuestions: Question[] = [
  {
    id: 'os-001',
    subject: 'OS',
    topic: 'A',
    difficulty: 'Easy',
    question: 'What is the primary function of an operating system?',
    options: [
      {
        text: 'To provide a platform for running application programs and to act as an intermediary between the user and the computer hardware.',
        correct: true,
      },
      { text: 'To execute user commands directly on the hardware.', correct: false },
      { text: 'To manage only the file system and disk storage.', correct: false },
      { text: 'To provide a collection of utility software for development.', correct: false },
    ],
    rationale:
      'The OS has two main roles: providing an abstraction layer for applications to use hardware resources, and managing those hardware resources efficiently and fairly.',
  },
  {
    id: 'os-002',
    subject: 'OS',
    topic: 'A',
    difficulty: 'Easy',
    question: 'Which of the following is the mode of operation that gives the operating system privileged access to hardware?',
    options: [
      { text: 'User Mode', correct: false },
      { text: 'Privileged Mode', correct: false },
      { text: 'Safe Mode', correct: false },
      { text: 'Kernel Mode', correct: true },
    ],
    rationale:
      'Kernel mode (or supervisor mode) is a privileged mode where the OS has unrestricted access to all hardware and can execute any CPU instruction. User mode is a non-privileged mode for application programs.',
  },
  {
    id: 'os-003',
    subject: 'OS',
    topic: 'A',
    difficulty: 'Medium',
    question: 'What is a system call?',
    options: [
      { text: 'A call made by the hardware to the operating system.', correct: false },
      {
        text: 'A programmatic way in which a computer program requests a service from the kernel of the operating system.',
        correct: true,
      },
      { text: 'A function call within the same user-level application.', correct: false },
      { text: 'A signal sent between two processes.', correct: false },
    ],
    rationale:
      'System calls are the interface between a process and the operating system. Applications use them to request services that they cannot perform directly, such as I/O operations or process creation.',
  },
  {
    id: 'os-004',
    subject: 'OS',
    topic: 'A',
    difficulty: 'Easy',
    question:
      'In which type of operating system does the user not interact with the computer directly, but instead prepares a job which is then executed?',
    options: [
      { text: 'Time-Sharing OS', correct: false },
      { text: 'Real-Time OS', correct: false },
      { text: 'Batch OS', correct: true },
      { text: 'Distributed OS', correct: false },
    ],
    rationale:
      'A Batch OS processes jobs in batches, one after another, without any direct user interaction during execution. This was common in early computing systems.',
  },
  {
    id: 'os-005',
    subject: 'OS',
    topic: 'A',
    difficulty: 'Medium',
    question: 'What is a key advantage of a microkernel architecture over a monolithic kernel?',
    options: [
      { text: 'It provides better performance due to fewer context switches.', correct: false },
      { text: 'It is more reliable and secure because most services run in user space.', correct: true },
      { text: 'All OS services run in a single address space, making communication faster.', correct: false },
      { text: 'It is much simpler to design and implement.', correct: false },
    ],
    rationale:
      'In a microkernel, only essential services (like IPC and basic scheduling) run in the kernel. Other services (like file systems, drivers) run as user-space processes, so a failure in one service is less likely to crash the entire OS.',
  },
  {
    id: 'os-006',
    subject: 'OS',
    topic: 'A',
    difficulty: 'Medium',
    question: 'Which of the following is typically the first piece of software that runs when a computer is booted up?',
    options: [
      { text: 'The operating system kernel', correct: false },
      { text: 'The command interpreter (shell)', correct: false },
      { text: 'A user application', correct: false },
      { text: 'The bootstrap program (BIOS/UEFI)', correct: true },
    ],
    rationale:
      'The bootstrap program, stored in firmware, is responsible for initializing the hardware, performing a power-on self-test (POST), and then loading the operating system kernel into memory to start its execution.',
  },
  {
    id: 'os-007',
    subject: 'OS',
    topic: 'A',
    difficulty: 'Hard',
    question: 'What is the primary difference between a time-sharing and a real-time operating system (RTOS)?',
    options: [
      { text: 'Time-sharing systems are multi-user, while RTOS are single-user.', correct: false },
      { text: 'Time-sharing systems have a more complex kernel structure.', correct: false },
      {
        text: 'Time-sharing systems minimize response time for all users, while an RTOS focuses on meeting hard deadlines for tasks.',
        correct: true,
      },
      { text: 'RTOS cannot be preemptive.', correct: false },
    ],
    rationale:
      'The main goal of a time-sharing OS is to provide good response time to all interactive users. An RTOS, especially a hard RTOS, has a much stricter requirement: tasks must be completed within their specified deadlines.',
  },
  {
    id: 'os-008',
    subject: 'OS',
    topic: 'A',
    difficulty: 'Easy',
    question: 'Which of the following is NOT a fundamental function of an operating system?',
    options: [
      { text: 'Memory Management', correct: false },
      { text: 'Process Management', correct: false },
      { text: 'File Management', correct: false },
      { text: 'Application Development', correct: true },
    ],
    rationale:
      'Memory, process, and file management are core functions of an OS. Application development is done using tools that run on top of the OS, but it is not a function of the OS itself.',
  },
  {
    id: 'os-009',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Easy',
    question: 'What is the difference between a program and a process?',
    options: [
      { text: 'A program is active, while a process is passive.', correct: false },
      { text: 'A program is stored on disk, while a process is a program in execution.', correct: true },
      { text: 'A program is a single thread, while a process can have multiple threads.', correct: false },
      { text: 'There is no difference.', correct: false },
    ],
    rationale:
      'A program is a static set of instructions stored in a file. A process is a dynamic instance of that program being executed, with its own memory space, program counter, and resources.',
  },
  {
    id: 'os-010',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Easy',
    question: 'Which of the following is NOT a valid state in the standard 5-state process model?',
    options: [
      { text: 'Ready', correct: false },
      { text: 'Running', correct: false },
      { text: 'Interrupted', correct: true },
      { text: 'Waiting', correct: false },
    ],
    rationale:
      "The 5-state model consists of New, Ready, Running, Waiting (or Blocked), and Terminated. 'Interrupted' describes an event that can cause a state transition, but it is not a process state itself.",
  },
  {
    id: 'os-011',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Medium',
    question: 'What is a Process Control Block (PCB)?',
    options: [
      { text: 'A block of memory allocated to a process for its code.', correct: false },
      {
        text: 'A data structure maintained by the OS for every process, containing all its essential information.',
        correct: true,
      },
      { text: 'A hardware register that controls the process state.', correct: false },
      { text: 'A special file on disk that stores the process image.', correct: false },
    ],
    rationale:
      'The PCB is a critical data structure that stores everything the OS needs to know about a process, including its state, program counter, CPU registers, scheduling information, and memory management details.',
  },
  {
    id: 'os-012',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Medium',
    question: 'The mechanism of saving the state of the current process and loading the state of the next process is known as:',
    options: [
      { text: 'Process Swapping', correct: false },
      { text: 'Inter-Process Communication', correct: false },
      { text: 'Context Switching', correct: true },
      { text: 'State Transition', correct: false },
    ],
    rationale:
      'A context switch is the process of storing the context (the state stored in the PCB) of a process so that it can be reloaded when it is rescheduled. It is pure overhead as the system does no useful work during a switch.',
  },
  {
    id: 'os-013',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Easy',
    question: 'In the Unix/Linux environment, which system call is used to create a new process?',
    options: [
      { text: 'exec()', correct: false },
      { text: 'create()', correct: false },
      { text: 'new()', correct: false },
      { text: 'fork()', correct: true },
    ],
    rationale:
      "The `fork()` system call creates a new process that is a nearly identical copy of the parent process. The `exec()` family of calls is then used to replace the new process's memory space with a new program.",
  },
  {
    id: 'os-014',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Medium',
    question: "What is a 'zombie' process?",
    options: [
      {
        text: 'A process that has been terminated, but its entry still exists in the process table.',
        correct: true,
      },
      { text: 'A process that cannot be terminated by the operating system.', correct: false },
      { text: 'A process that is running in the background without a user interface.', correct: false },
      { text: 'A process that has consumed all available system memory.', correct: false },
    ],
    rationale:
      'A zombie process is a finished process whose parent has not yet called `wait()` to read its exit status. The process itself is dead, but its PCB entry remains until the parent collects the status.',
  },
  {
    id: 'os-015',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Medium',
    question: "An 'orphan' process is a process whose:",
    options: [
      { text: 'Parent process has terminated before the child process.', correct: true },
      { text: 'Child process has terminated before the parent process.', correct: false },
      { text: '`fork()` call failed.', correct: false },
      { text: '`exec()` call failed.', correct: false },
    ],
    rationale:
      'When a parent process terminates without waiting for its children, the child processes become orphans. They are typically adopted by a special system process (like `init` or `systemd`) which then becomes their new parent.',
  },
  {
    id: 'os-016',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Hard',
    question: 'What is the primary overhead associated with a context switch?',
    options: [
      { text: 'The time taken to copy the entire process memory.', correct: false },
      { text: 'The time spent saving and restoring CPU registers and other PCB information.', correct: true },
      { text: 'The time taken to write the process state to disk.', correct: false },
      { text: 'The time required to flush the file system cache.', correct: false },
    ],
    rationale:
      'The direct overhead is the time spent by the OS saving the state of the old process and loading the state of the new one. Indirect overheads also exist, such as cache pollution (TLB, CPU caches).',
  },
  {
    id: 'os-017',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Easy',
    question: 'When a process makes an I/O request, it typically transitions from which state to which state?',
    options: [
      { text: 'Ready to Running', correct: false },
      { text: 'Running to Ready', correct: false },
      { text: 'Running to Waiting', correct: true },
      { text: 'Waiting to Ready', correct: false },
    ],
    rationale:
      'If a running process needs to wait for an event, such as the completion of an I/O operation, it relinquishes the CPU and moves to the Waiting (or Blocked) state.',
  },
  {
    id: 'os-018',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Medium',
    question: 'What is the purpose of the `exec()` system call after a `fork()`?',
    options: [
      { text: 'To terminate the parent process.', correct: false },
      { text: 'To load a new program into the memory space of the new process.', correct: true },
      { text: 'To put the child process to sleep.', correct: false },
      { text: 'To create a communication channel between the parent and child.', correct: false },
    ],
    rationale:
      '`fork()` creates a copy of the parent. `exec()` is used by the new child process to replace its memory image with a different program, so the child can perform a different task than the parent.',
  },
  {
    id: 'os-019',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Hard',
    question:
      'In a system with a process hierarchy, if a process terminates (either normally or abnormally), what happens to its child processes?',
    options: [
      { text: 'They all terminate automatically.', correct: false },
      {
        text: 'They continue to run as orphan processes and are typically adopted by the `init` process.',
        correct: true,
      },
      { text: 'They are paused until the user restarts the parent process.', correct: false },
      { text: 'The behavior is undefined and can lead to a system crash.', correct: false },
    ],
    rationale:
      'Operating systems are designed to handle this situation gracefully. Orphaned processes are "re-parented," usually to the `init` process (PID 1), which will then `wait()` for them to prevent them from becoming zombies.',
  },
  {
    id: 'os-020',
    subject: 'OS',
    topic: 'B',
    difficulty: 'Easy',
    question: 'The list of processes waiting for the CPU is kept in a data structure called the:',
    options: [
      { text: 'Job Queue', correct: false },
      { text: 'Ready Queue', correct: true },
      { text: 'Device Queue', correct: false },
      { text: 'Wait Queue', correct: false },
    ],
    rationale:
      'The ready queue contains all processes that are in memory, ready and waiting to execute. The CPU scheduler selects the next process to run from this queue.',
  },
  {
    id: 'os-021',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Easy',
    question: 'Which of the following is NOT a common CPU scheduling criterion?',
    options: [
      { text: 'Turnaround Time', correct: false },
      { text: 'CPU Utilization', correct: false },
      { text: 'Waiting Time', correct: false },
      { text: 'Disk Access Time', correct: true },
    ],
    rationale:
      'Turnaround time, CPU utilization, and waiting time are all standard metrics used to evaluate the performance of a scheduling algorithm. Disk access time is related to I/O performance, not CPU scheduling directly.',
  },
  {
    id: 'os-022',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Medium',
    question: 'Which scheduling algorithm is non-preemptive and can lead to the convoy effect?',
    options: [
      { text: 'Shortest Job First (SJF)', correct: false },
      { text: 'Round Robin (RR)', correct: false },
      { text: 'First-Come, First-Served (FCFS)', correct: true },
      { text: 'Priority Scheduling', correct: false },
    ],
    rationale:
      'FCFS is non-preemptive, meaning once a process gets the CPU, it keeps it until it finishes or blocks. The convoy effect occurs when a short process gets stuck waiting behind a very long process.',
  },
  {
    id: 'os-023',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Medium',
    question: 'A CPU scheduling algorithm is preemptive if:',
    options: [
      { text: 'It allocates the CPU to the process with the highest priority.', correct: false },
      { text: 'The CPU can be taken away from a currently running process.', correct: true },
      { text: 'It allocates the CPU to the process that arrived first.', correct: false },
      { text: 'It can never be interrupted.', correct: false },
    ],
    rationale:
      'Preemptive scheduling allows the operating system to interrupt a running process and allocate the CPU to another process, often due to an interrupt or a time slice expiring.',
  },
  {
    id: 'os-024',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Hard',
    question:
      'Consider three processes P1, P2, P3 with burst times 24, 3, 3 respectively, all arriving at time 0. What is the average waiting time using FCFS scheduling?',
    options: [
      { text: '0 ms', correct: false },
      { text: '17 ms', correct: true },
      { text: '27 ms', correct: false },
      { text: '30 ms', correct: false },
    ],
    rationale:
      'In FCFS, the wait times are: P1=0, P2=24, P3=27. The average waiting time is (0 + 24 + 27) / 3 = 51 / 3 = 17 ms. This demonstrates the convoy effect.',
  },
  {
    id: 'os-025',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Hard',
    question:
      'Using the same processes from Q24 (P1=24, P2=3, P3=3), what is the average waiting time using non-preemptive SJF scheduling?',
    options: [
      { text: '3 ms', correct: true },
      { text: '6 ms', correct: false },
      { text: '7 ms', correct: false },
      { text: '17 ms', correct: false },
    ],
    rationale:
      'SJF would schedule in the order P2, P3, P1. The wait times are: P2=0, P3=3, P1=6. The average waiting time is (0 + 3 + 6) / 3 = 9 / 3 = 3 ms.',
  },
  {
    id: 'os-026',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Medium',
    question: 'The Round Robin (RR) scheduling algorithm is particularly well-suited for:',
    options: [
      { text: 'Real-time systems', correct: false },
      { text: 'Batch systems', correct: false },
      { text: 'Time-sharing systems', correct: true },
      { text: 'Embedded systems', correct: false },
    ],
    rationale:
      'RR is designed for time-sharing environments. By giving each process a small time slice (quantum) of CPU time, it ensures that all interactive users get a fair share of the CPU, providing good response times.',
  },
  {
    id: 'os-027',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Hard',
    question:
      'A system uses Round Robin scheduling with a quantum of 4 ms. Processes P1, P2, P3 have burst times 10, 5, 8. What is the turnaround time for P2?',
    options: [
      { text: '5 ms', correct: false },
      { text: '13 ms', correct: false },
      { text: '17 ms', correct: true },
      { text: '23 ms', correct: false },
    ],
    rationale:
      "Gantt chart: P1(4), P2(4), P3(4), P1(4), P2(1), P3(4), P1(2). P2 starts at time 4 and runs for its first 4ms. It gets the CPU again at time 12 and runs for 1ms, finishing at time 13. Wait, let me re-calculate. P1(4), P2(4), P3(4), P1(4), P2(1 finishes), P3(4), P1(2). P2 finishes at time 4+4+4+1=13. No, P1 runs from 0-4, P2 from 4-8, P3 from 8-12. P1 runs from 12-16. P2 runs from 16-17. P2 finishes at time 17. Turnaround time = 17 - 0 = 17 ms.",
  },
  {
    id: 'os-028',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Medium',
    question: 'What is a potential problem with Priority Scheduling?',
    options: [
      { text: 'It is too complex to implement.', correct: false },
      { text: 'It can lead to starvation for low-priority processes.', correct: true },
      { text: 'It has a very high overhead.', correct: false },
      { text: 'It is a non-preemptive algorithm.', correct: false },
    ],
    rationale:
      'In a priority scheduling system, a continuous stream of high-priority processes can prevent low-priority processes from ever getting the CPU. This problem is known as starvation.',
  },
  {
    id: 'os-029',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Hard',
    question: 'How can the problem of starvation in Priority Scheduling be mitigated?',
    options: [
      { text: 'By using a larger time quantum.', correct: false },
      { text: 'By using a non-preemptive version.', correct: false },
      { text: 'By using aging, where a process\'s priority increases the longer it waits.', correct: true },
      { text: 'By always running the shortest job first.', correct: false },
    ],
    rationale:
      'Aging is a common solution to starvation. By gradually increasing the priority of processes that have been waiting for a long time, the system ensures that they will eventually get a high enough priority to be scheduled.',
  },
  {
    id: 'os-030',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Medium',
    question: 'Shortest Remaining Time First (SRTF) is the preemptive version of which scheduling algorithm?',
    options: [
      { text: 'First-Come, First-Served (FCFS)', correct: false },
      { text: 'Round Robin (RR)', correct: false },
      { text: 'Priority Scheduling', correct: false },
      { text: 'Shortest Job First (SJF)', correct: true },
    ],
    rationale:
      'SRTF is the preemptive counterpart to SJF. When a new process arrives with a shorter remaining burst time than the currently running process, the scheduler preempts the current process and runs the new one.',
  },
  {
    id: 'os-031',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Hard',
    question:
      'Given processes with arrival and burst times: P1(0, 8), P2(1, 4), P3(2, 9), P4(3, 5). What is the average waiting time using SRTF?',
    options: [
      { text: '6.5 ms', correct: true },
      { text: '7.75 ms', correct: false },
      { text: '9.5 ms', correct: false },
      { text: '13.0 ms', correct: false },
    ],
    rationale:
      'Execution: P1(1), P2(4), P4(5), P1(7), P3(9). Completion Times: P1=17, P2=5, P3=26, P4=10. Waiting Times: P1=17-8-0=9, P2=5-4-1=0, P3=26-9-2=15, P4=10-5-3=2. Average Waiting Time = (9+0+15+2)/4 = 6.5 ms.',
  },
  {
    id: 'os-032',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Easy',
    question: 'Turnaround time for a process is defined as:',
    options: [
      { text: 'The time spent waiting in the ready queue.', correct: false },
      { text: 'The time from process submission to process completion.', correct: true },
      { text: 'The time it takes to execute the process\'s CPU burst.', correct: false },
      { text: 'The time from when the process first gets the CPU to when it completes.', correct: false },
    ],
    rationale:
      'Turnaround time is the total time a process spends in the system, from the moment it arrives until it is completely finished. It includes waiting time, execution time, and I/O time.',
  },
  {
    id: 'os-033',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Medium',
    question: 'What is a major disadvantage of the Shortest Job First (SJF) algorithm?',
    options: [
      { text: 'It has a very high average waiting time.', correct: false },
      { text: 'It can lead to starvation for longer processes.', correct: false },
      { text: 'It requires knowing the burst time of the next process in advance, which is often impossible.', correct: true },
      { text: 'It is a preemptive algorithm.', correct: false },
    ],
    rationale:
      'The primary challenge with implementing SJF (and SRTF) in a real system is the inability to predict the exact length of the next CPU burst. It is typically implemented using an approximation based on past behavior.',
  },
  {
    id: 'os-034',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Hard',
    question: 'A multilevel feedback queue scheduler is designed to:',
    options: [
      { text: 'Separate processes into different queues based on their priority or characteristics.', correct: false },
      { text: 'Allow processes to move between queues.', correct: false },
      { text: 'Favor short jobs and I/O-bound jobs to improve response time.', correct: false },
      { text: 'All of the above.', correct: true },
    ],
    rationale:
      'A multilevel feedback queue is an advanced scheduling algorithm that uses multiple queues, allows processes to migrate between them (a form of aging), and can be configured to give preference to interactive or short jobs, making it very flexible.',
  },
  {
    id: 'os-035',
    subject: 'OS',
    topic: 'C',
    difficulty: 'Easy',
    question: 'In Round Robin scheduling, if the time quantum is very large, it behaves like:',
    options: [
      { text: 'Shortest Job First (SJF)', correct: false },
      { text: 'First-Come, First-Served (FCFS)', correct: true },
      { text: 'Priority Scheduling', correct: false },
      { text: 'Multilevel Queue Scheduling', correct: false },
    ],
    rationale:
      'If the time quantum is larger than the longest burst time of any process, no process will ever be preempted. They will all run to completion once they get the CPU, which is exactly the behavior of FCFS.',
  },
  {
    id: 'os-036',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Easy',
    question:
      'A situation where multiple processes access and manipulate the same shared data concurrently, and the final outcome depends on the particular order in which the access takes place, is called a:',
    options: [
      { text: 'Deadlock', correct: false },
      { text: 'Race Condition', correct: true },
      { text: 'Critical Section', correct: false },
      { text: 'Starvation', correct: false },
    ],
    rationale:
      'A race condition is a bug that occurs when the timing or ordering of events affects the correctness of a program\'s output. It happens when shared resources are not properly protected.',
  },
  {
    id: 'os-037',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Medium',
    question: 'A part of a program where a shared resource is accessed is called the:',
    options: [
      { text: 'Entry Section', correct: false },
      { text: 'Critical Section', correct: true },
      { text: 'Remainder Section', correct: false },
      { text: 'Exit Section', correct: false },
    ],
    rationale:
      'The critical section is the segment of code in which a process accesses shared resources. To ensure correctness, only one process should be allowed to execute in its critical section at any given time.',
  },
  {
    id: 'os-038',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Medium',
    question: 'What is mutual exclusion in the context of process synchronization?',
    options: [
      {
        text: 'If one process is executing in its critical section, then no other processes can be executing in their critical sections.',
        correct: true,
      },
      { text: 'All processes must eventually get a chance to enter their critical section.', correct: false },
      { text: 'Processes must share a critical section.', correct: false },
      { text: 'A process must remain in its critical section for a bounded amount of time.', correct: false },
    ],
    rationale:
      'Mutual exclusion is the fundamental requirement for solving the critical section problem. It ensures that the shared resource is accessed by at most one process at a time, preventing race conditions.',
  },
  {
    id: 'os-039',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Easy',
    question: 'A semaphore is a(n):',
    options: [
      { text: 'Hardware instruction', correct: false },
      { text: 'Integer variable used for signaling among processes.', correct: true },
      { text: 'Type of CPU register', correct: false },
      { text: 'Scheduling algorithm', correct: false },
    ],
    rationale:
      'A semaphore is a synchronization primitive that is an integer variable accessed only through two atomic operations: `wait()` (or `P()`) and `signal()` (or `V()`). It is used to control access to a shared resource.',
  },
  {
    id: 'os-040',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Hard',
    question: 'What is the difference between a binary semaphore and a counting semaphore?',
    options: [
      {
        text: 'A binary semaphore can only have values 0 and 1, while a counting semaphore can have any non-negative integer value.',
        correct: true,
      },
      { text: 'A counting semaphore is used for mutual exclusion, while a binary semaphore is used for resource allocation.', correct: false },
      { text: 'A binary semaphore is implemented in hardware, while a counting semaphore is implemented in software.', correct: false },
      { text: 'There is no difference.', correct: false },
    ],
    rationale:
      'A binary semaphore, often called a mutex, is restricted to the values 0 and 1 and is typically used to enforce mutual exclusion. A counting semaphore can take on any integer value and is used to control access to a resource with a finite number of instances.',
  },
  {
    id: 'os-041',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Medium',
    question: 'The Producer-Consumer problem is a classic synchronization problem that deals with:',
    options: [
      {
        text: 'Two processes, a producer that creates data and a consumer that uses it, accessing a shared buffer.',
        correct: true,
      },
      { text: 'Multiple processes competing for a single, non-shareable resource.', correct: false },
      { text: 'Preventing deadlocks in a multi-process system.', correct: false },
      { text: 'Scheduling processes to maximize CPU utilization.', correct: false },
    ],
    rationale:
      'This problem models a scenario where one process (producer) generates items and places them into a shared buffer, and another process (consumer) takes items out. Synchronization is needed to ensure the producer does\'t add to a full buffer and the consumer doesn\'t take from an empty buffer.',
  },
  {
    id: 'os-042',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Hard',
    question: 'What is the primary difference between a mutex and a binary semaphore?',
    options: [
      {
        text: 'A mutex can only be released by the same thread that acquired it, while a semaphore can be signaled by any thread.',
        correct: true,
      },
      {
        text: 'A semaphore can only be released by the same thread that acquired it, while a mutex can be signaled by any thread.',
        correct: false,
      },
      { text: 'A mutex is for counting resources, while a semaphore is for mutual exclusion.', correct: false },
      { text: 'A mutex is a software concept, while a semaphore is a hardware instruction.', correct: false },
    ],
    rationale:
      "This is a key conceptual difference. Mutexes are designed to protect a critical section and have a concept of 'ownership.' Semaphores are more general signaling mechanisms and do not have an ownership concept.",
  },
  {
    id: 'os-043',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Medium',
    question: 'Peterson\'s solution is a software-based solution to the critical section problem that works for:',
    options: [
      { text: 'Any number of processes.', correct: false },
      { text: 'Only two processes.', correct: true },
      { text: 'Only processes with the same priority.', correct: false },
      { text: 'Only kernel-level threads.', correct: false },
    ],
    rationale:
      "Peterson's solution is a classic algorithm that uses shared variables (`turn` and `flag` array) to provide a correct mutual exclusion solution, but it is specifically designed for only two concurrent processes.",
  },
  {
    id: 'os-044',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Hard',
    question: 'In the Dining Philosophers problem, what does a deadlock situation correspond to?',
    options: [
      { text: 'When all philosophers are thinking at the same time.', correct: false },
      { text: 'When all philosophers are eating at the same time.', correct: false },
      { text: 'When each philosopher is holding one chopstick and is waiting for the other.', correct: true },
      { text: 'When one philosopher is eating and all others are waiting.', correct: false },
    ],
    rationale:
      'A deadlock occurs if every philosopher picks up their left chopstick simultaneously. They will then all be waiting indefinitely for their right chopstick, which is being held by their neighbor, creating a circular wait.',
  },
  {
    id: 'os-045',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Easy',
    question: 'The `wait()` operation on a semaphore decreases its value. If the value becomes negative, the process:',
    options: [
      { text: 'Continues execution.', correct: false },
      { text: 'Is blocked until the value is non-negative.', correct: true },
      { text: 'Raises an error.', correct: false },
      { text: 'Signals other processes.', correct: false },
    ],
    rationale:
      'The `wait()` (or P) operation decrements the semaphore. If the result is less than zero, the calling process is blocked and placed on a queue associated with the semaphore.',
  },
  {
    id: 'os-046',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Medium',
    question: "A 'race condition' can be prevented by using:",
    options: [
      { text: 'A faster CPU', correct: false },
      { text: 'More memory', correct: false },
      { text: 'Proper synchronization techniques like mutexes or semaphores', correct: true },
      { text: 'A non-preemptive scheduler', correct: false },
    ],
    rationale:
      'Race conditions are logical errors caused by unsynchronized access to shared resources. The only way to prevent them is to use synchronization primitives to ensure that the critical sections of code are executed atomically.',
  },
  {
    id: 'os-047',
    subject: 'OS',
    topic: 'D',
    difficulty: 'Hard',
    question: 'What does it mean for an operation to be \"atomic\"?',
    options: [
      { text: 'It is a very small and fast operation.', correct: false },
      {
        text: 'It is an operation that cannot be interrupted and appears to the rest of the system as if it occurred instantaneously.',
        correct: true,
      },
      { text: 'It is an operation that can be rolled back.', correct: false },
      { text: 'It is an operation related to nuclear physics.', correct: false },
    ],
    rationale:
      'Atomicity is a crucial concept in concurrency. An atomic operation is an indivisible and irreducible series of operations. This guarantees that if it is in progress, no other process can see the operation in an intermediate state.',
  },
  {
    id: 'os-048',
    subject: 'OS',
    topic: 'E',
    difficulty: 'Easy',
    question:
      'Which of the following is NOT one of the four necessary conditions for a deadlock to occur (Coffman conditions)?',
    options: [
      { text: 'Mutual Exclusion', correct: false },
      { text: 'Hold and Wait', correct: false },
      { text: 'Preemption', correct: true },
      { text: 'Circular Wait', correct: false },
    ],
    rationale:
      'The four conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. "No Preemption" is the condition, meaning resources cannot be forcibly taken away. "Preemption" is the opposite and is a way to prevent deadlocks.',
  },
  {
    id: 'os-049',
    subject: 'OS',
    topic: 'E',
    difficulty: 'Medium',
    question: 'The strategy of ensuring that at least one of the necessary deadlock conditions can never hold is known as:',
    options: [
      { text: 'Deadlock Detection', correct: false },
      { text: 'Deadlock Avoidance', correct: false },
      { text: 'Deadlock Prevention', correct: true },
      { text: 'Deadlock Recovery', correct: false },
    ],
    rationale:
      'Deadlock prevention works by designing the system to exclude any possibility of deadlock. This is done by negating one of the four Coffman conditions, though it can be restrictive.',
  },
  {
    id: 'os-050',
    subject: 'OS',
    topic: 'E',
    difficulty: 'Hard',
    question: 'The Banker\'s algorithm is an example of which deadlock handling strategy?',
    options: [
      { text: 'Deadlock Prevention', correct: false },
      { text: 'Deadlock Avoidance', correct: true },
      { text: 'Deadlock Detection', correct: false },
      { text: 'Deadlock Recovery', correct: false },
    ],
    rationale:
      'Deadlock avoidance requires the OS to have advance information about the maximum resources a process might need. The Banker\'s algorithm uses this information to analyze each resource request and only grant it if it can guarantee the system will remain in a "safe state."',
  },
  {
    id: 'os-051',
    subject: 'OS',
    topic: 'E',
    difficulty: 'Medium',
    question: 'A system is in a "safe state" if:',
    options: [
      { text: 'No process is currently waiting for a resource.', correct: false },
      {
        text: 'All processes can be run to completion in some sequence without causing a deadlock.',
        correct: true,
      },
      { text: 'The system has enough resources to satisfy all requests from all processes.', correct: false },
      { text: 'No deadlocks have occurred in the past.', correct: false },
    ],
    rationale:
      'A state is safe if there exists a sequence of all processes in the system such that for each process, the resources it still might request can be satisfied by the currently available resources plus the resources held by all the preceding processes.',
  },
  {
    id: 'os-052',
    subject: 'OS',
    topic: 'E',
    difficulty: 'Easy',
    question: 'A Resource Allocation Graph (RAG) is used for:',
    options: [
      { text: 'Scheduling CPU processes.', correct: false },
      { text: 'Allocating memory pages.', correct: false },
      { text: 'Describing deadlocks.', correct: true },
      { text: 'Managing file permissions.', correct: false },
    ],
    rationale:
      'A RAG is a directed graph used to model the state of resource allocation. A cycle in the RAG is a necessary condition for a deadlock.',
  },
  {
    id: 'os-053',
    subject: 'OS',
    topic: 'E',
    difficulty: 'Medium',
    question: 'In a Resource Allocation Graph, what does a directed edge from a process to a resource indicate?',
    options: [
      { text: 'The resource has been allocated to the process.', correct: false },
      { text: 'The process has released the resource.', correct: false },
      { text: 'The process is requesting the resource.', correct: true },
      { text: 'The resource is of a specific type.', correct: false },
    ],
    rationale:
      'An edge from a process node to a resource node is a "request edge," signifying that the process is currently waiting for that resource. An edge from a resource to a process is an "assignment edge."',
  },
  {
    id: 'os-054',
    subject: 'OS',
    topic: 'E',
    difficulty: 'Hard',
    question: 'If a Resource Allocation Graph contains a cycle, what can we conclude?',
    options: [
      { text: 'The system is definitely in a deadlock state.', correct: false },
      { text: 'The system is not in a deadlock state.', correct: false },
      {
        text: 'The system may or may not be in a deadlock state, depending on the number of instances of each resource.',
        correct: true,
      },
      { text: 'A deadlock will occur in the future.', correct: false },
    ],
    rationale:
      'A cycle is a necessary but not sufficient condition for deadlock. If each resource in the cycle has only one instance, then a deadlock exists. If there are multiple instances, the deadlock may not exist.',
  },
  {
    id: 'os-055',
    subject: 'OS',
    topic: 'E',
    difficulty: 'Easy',
    question: 'What is the simplest way to recover from a deadlock?',
    options: [
      { text: 'Abort one or more of the deadlocked processes.', correct: false },
      { text: 'Roll back all deadlocked processes.', correct: false },
      { text: 'Preempt resources from one of the processes.', correct: false },
      { text: 'All of the above are valid recovery methods.', correct: true },
    ],
    rationale:
      'All three are common techniques for deadlock recovery. The simplest is to terminate a process. Rolling it back to a safe state is more nuanced. Preempting (taking away) a resource is another option.',
  },
  {
    id: 'os-056',
    subject: 'OS',
    topic: 'E',
    difficulty: 'Hard',
    question: 'In the Banker\'s algorithm, what does the "Need" matrix represent?',
    options: [
      { text: 'The maximum number of resources of each type that a process may request.', correct: false },
      { text: 'The number of resources of each type currently allocated to each process.', correct: false },
      { text: 'The remaining resource needs of each process (Max - Allocation).', correct: true },
      { text: 'The number of available resources in the system.', correct: false },
    ],
    rationale:
      'The Need matrix is calculated as `Need = Max - Allocation`. It is used by the algorithm to determine if granting a future request will lead to a safe state.',
  },
  {
    id: 'os-057',
    subject: 'OS',
    topic: 'E',
    difficulty: 'Medium',
    question:
      'Which of the four deadlock conditions is often violated to prevent deadlocks in practice, for example by requiring a process to release all its resources before requesting a new one?',
    options: [
      { text: 'Mutual Exclusion', correct: false },
      { text: 'Hold and Wait', correct: true },
      { text: 'No Preemption', correct: false },
      { text: 'Circular Wait', correct: false },
    ],
    rationale:
      'One way to prevent the "Hold and Wait" condition is to require that a process requests and is allocated all of its resources before it begins execution, or to require it to release all held resources before requesting any new ones.',
  },
  {
    id: 'os-058',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Easy',
    question: 'The address generated by the CPU is known as the:',
    options: [
      { text: 'Physical Address', correct: false },
      { text: 'Logical Address', correct: true },
      { text: 'MAC Address', correct: false },
      { text: 'Port Address', correct: false },
    ],
    rationale:
      'The CPU generates a logical (or virtual) address. The Memory Management Unit (MMU) is responsible for translating this logical address into a physical address, which is the actual location in main memory.',
  },
  {
    id: 'os-059',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Medium',
    question:
      'A situation where the available memory is fragmented into many small, non-contiguous holes, making it difficult to allocate a larger block, is called:',
    options: [
      { text: 'Internal Fragmentation', correct: false },
      { text: 'External Fragmentation', correct: true },
      { text: 'Paging', correct: false },
      { text: 'Segmentation', correct: false },
    ],
    rationale:
      'External fragmentation occurs when free memory space is broken into many small pieces. Even though the total amount of free memory might be sufficient for a request, no single piece is large enough.',
  },
  {
    id: 'os-060',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Medium',
    question: 'What is internal fragmentation?',
    options: [
      {
        text: 'When a process is allocated a block of memory that is larger than it needs, leaving the unused space within the block wasted.',
        correct: true,
      },
      { text: 'When memory is fragmented outside of any allocated block.', correct: false },
      { text: 'The fragmentation that occurs inside the CPU caches.', correct: false },
      { text: 'The fragmentation of the page table itself.', correct: false },
    ],
    rationale:
      'Internal fragmentation is wasted space inside an allocated memory block. It commonly occurs in systems that allocate memory in fixed-size blocks, such as paging.',
  },
  {
    id: 'os-061',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Easy',
    question: "Dividing a process's logical address space into fixed-size blocks is known as:",
    options: [
      { text: 'Segmentation', correct: false },
      { text: 'Paging', correct: true },
      { text: 'Contiguous Allocation', correct: false },
      { text: 'Swapping', correct: false },
    ],
    rationale:
      'Paging is a memory management scheme that breaks the logical memory of a process into fixed-size blocks called pages. Main memory is also divided into fixed-size blocks called frames.',
  },
  {
    id: 'os-062',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Medium',
    question: 'What is the purpose of a Page Table?',
    options: [
      { text: 'To store the pages of a process.', correct: false },
      { text: 'To map logical page numbers to physical frame numbers.', correct: true },
      { text: 'To keep track of the available free frames in memory.', correct: false },
      { text: 'To store the CPU\'s cache.', correct: false },
    ],
    rationale:
      'The page table is the data structure used by the MMU to translate logical addresses to physical addresses. For each page in the process\'s logical address space, it stores the corresponding frame number in physical memory.',
  },
  {
    id: 'os-063',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Hard',
    question: 'What is a Translation Lookaside Buffer (TLB)?',
    options: [
      { text: 'A software buffer for I/O operations.', correct: false },
      { text: 'A special, small, fast-lookup hardware cache for the page table.', correct: true },
      { text: 'A buffer that holds pages that have been swapped out to disk.', correct: false },
      { text: 'The main memory where page tables are stored.', correct: false },
    ],
    rationale:
      'The TLB is a hardware cache that stores recent page-to-frame translations. Because accessing the full page table in memory can be slow, the TLB provides a very fast way to find the physical frame for a logical page (a "TLB hit").',
  },
  {
    id: 'os-064',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Easy',
    question:
      'The memory allocation policy that places a process in the first available hole in memory that is large enough is called:',
    options: [
      { text: 'First-fit', correct: true },
      { text: 'Best-fit', correct: false },
      { text: 'Worst-fit', correct: false },
      { text: 'Next-fit', correct: false },
    ],
    rationale:
      'First-fit scans memory from the beginning and chooses the first free block that is large enough. It is fast but can lead to external fragmentation.',
  },
  {
    id: 'os-065',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Medium',
    question: "In memory management, segmentation divides a process's logical address space into:",
    options: [
      { text: 'Fixed-size blocks called pages.', correct: false },
      { text: 'Variable-size blocks based on logical units like code, data, and stack.', correct: true },
      { text: 'Partitions of equal priority.', correct: false },
      { text: 'Frames of physical memory.', correct: false },
    ],
    rationale:
      "Segmentation is a memory management scheme that reflects the user's view of a program. It divides the logical address space into segments, where each segment corresponds to a logical unit like a main program, a function, or a data structure.",
  },
  {
    id: 'os-066',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Hard',
    question: 'What is a primary advantage of paging over segmentation?',
    options: [
      { text: 'It completely eliminates fragmentation.', correct: false },
      { text: 'It allows for sharing of code between processes.', correct: false },
      { text: 'It avoids external fragmentation.', correct: true },
      { text: 'It provides better protection.', correct: false },
    ],
    rationale:
      'Paging avoids external fragmentation because any free frame can be allocated to a process that needs it. However, it can suffer from internal fragmentation within the last page of a process.',
  },
  {
    id: 'os-067',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Medium',
    question:
      'In a paging system with a page size of 4 KB (2^12 bytes) and a 32-bit logical address, how many bits are used for the page offset?',
    options: [
      { text: '12 bits', correct: true },
      { text: '20 bits', correct: false },
      { text: '32 bits', correct: false },
      { text: '4 bits', correct: false },
    ],
    rationale:
      'The page offset is determined by the page size. To address every byte within a 4 KB page, you need 12 bits (2^12 = 4096). The remaining bits (32 - 12 = 20) are used for the page number.',
  },
  {
    id: 'os-068',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Hard',
    question:
      'Using the information from Q67 (32-bit address, 4KB page size), what is the maximum number of entries in the page table for a single process?',
    options: [
      { text: '4096', correct: false },
      { text: '1024', correct: false },
      { text: '2^20 (1,048,576)', correct: true },
      { text: '2^32', correct: false },
    ],
    rationale:
      'The number of page table entries is determined by the number of pages a process can have. With a 32-bit address and a 12-bit offset, there are 20 bits remaining for the page number. This allows for 2^20 possible pages.',
  },
  {
    id: 'os-069',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Easy',
    question: 'The practice of bringing a page into memory only when it is needed is called:',
    options: [
      { text: 'Swapping', correct: false },
      { text: 'Demand Paging', correct: true },
      { text: 'Pre-paging', correct: false },
      { text: 'Segmentation', correct: false },
    ],
    rationale:
      'Demand paging is the fundamental technique behind virtual memory. It avoids loading the entire process into memory at once, instead loading pages on demand as they are accessed.',
  },
  {
    id: 'os-070',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Medium',
    question: 'What is the main problem with the First-Fit memory allocation algorithm?',
    options: [
      { text: 'It is very slow.', correct: false },
      { text: 'It tends to create small, unusable holes at the beginning of memory.', correct: true },
      { text: 'It requires the memory holes to be sorted by size.', correct: false },
      { text: 'It always allocates the largest available block.', correct: false },
    ],
    rationale:
      'Because First-Fit always starts searching from the beginning, it can lead to a buildup of small, fragmented blocks at the start of the memory space that are too small for most requests.',
  },
  {
    id: 'os-071',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Hard',
    question: 'What is a hashed page table used for?',
    options: [
      { text: 'To handle address spaces larger than 32 bits.', correct: true },
      { text: 'To reduce the memory overhead of the page table itself.', correct: false },
      { text: 'To provide faster lookup than a TLB.', correct: false },
      { text: 'To implement demand paging.', correct: false },
    ],
    rationale:
      'For systems with very large logical address spaces (e.g., 64-bit), a standard page table would be too large to be practical. A hashed page table hashes the virtual page number to find the page table entry.',
  },
  {
    id: 'os-072',
    subject: 'OS',
    topic: 'F',
    difficulty: 'Medium',
    question: 'An advantage of segmentation is that:',
    options: [
      { text: 'It eliminates internal fragmentation.', correct: false },
      { text: 'It simplifies the handling of growing data structures like stacks.', correct: true },
      { text: 'It is faster than paging.', correct: false },
      { text: 'It does not require a hardware MMU.', correct: false },
    ],
    rationale:
      'Since segments are variable-sized and correspond to logical units, it\'s easy to manage a stack or heap by simply increasing the size of its corresponding segment, which is more natural than managing it across multiple fixed-size pages.',
  },
  {
    id: 'os-073',
    subject: 'OS',
    topic: 'G',
    difficulty: 'Easy',
    question:
      'An event that occurs when a program tries to access a page that is not currently in main memory is called a:',
    options: [
      { text: 'System Call', correct: false },
      { text: 'Interrupt', correct: false },
      { text: 'Page Fault', correct: true },
      { text: 'Segmentation Fault', correct: false },
    ],
    rationale:
      'A page fault is a trap to the operating system raised by the hardware when a process accesses a page that is mapped in the virtual address space but not loaded in physical memory.',
  },
  {
    id: 'os-074',
    subject: 'OS',
    topic: 'G',
    difficulty: 'Medium',
    question: 'The goal of a page replacement algorithm is to:',
    options: [
      { text: 'Replace the page that has been in memory the longest.', correct: false },
      {
        text: 'Choose a page in memory to be swapped out to disk when a new page must be brought in.',
        correct: true,
      },
      { text: 'Replace the page that has been used most recently.', correct: false },
      { text: 'Find an empty frame in memory for a new page.', correct: false },
    ],
    rationale:
      'When a page fault occurs and there are no free frames, the OS must select a victim page to remove from memory to make room for the new page. The page replacement algorithm is the policy used to make this selection.',
  },
  {
    id: 'os-075',
    subject: 'OS',
    topic: 'G',
    difficulty: 'Hard',
    question: 'Which page replacement algorithm is provably optimal but impossible to implement in practice?',
    options: [
      { text: 'First-In, First-Out (FIFO)', correct: false },
      { text: 'Least Recently Used (LRU)', correct: false },
      { text: 'Optimal (OPT or MIN)', correct: true },
      { text: 'Second Chance', correct: false },
    ],
    rationale:
      'The Optimal algorithm replaces the page that will not be used for the longest period in the future. This gives the best possible performance but is impossible to implement because it requires knowledge of the future.',
  },
  {
    id: 'os-076',
    subject: 'OS',
    topic: 'G',
    difficulty: 'Medium',
    question:
      'Consider a page reference string: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 and a system with 3 frames. How many page faults will occur using the FIFO algorithm?',
    options: [
      { text: '7', correct: false },
      { text: '8', correct: false },
      { text: '9', correct: true },
      { text: '10', correct: false },
    ],
    rationale:
      'Sequence: 1(F), 2(F), 3(F). 4 replaces 1 (F). 1 replaces 2 (F). 2 replaces 3 (F). 5 replaces 4 (F). 1, 2 are hits. 3 replaces 5 (F). 4 replaces 1 (F). 5 is a hit. Total faults = 9.',
  },
  {
    id: 'os-077',
    subject: 'OS',
    topic: 'G',
    difficulty: 'Hard',
    question:
      'Using the same reference string from Q76 and 3 frames, how many page faults will occur using the LRU algorithm?',
    options: [
      { text: '7', correct: false },
      { text: '8', correct: false },
      { text: '9', correct: false },
      { text: '10', correct: true },
    ],
    rationale:
      'Sequence: 1,2,3(FFF). 4->1(F). 1->2(F). 2->3(F). 5->4(F). 1(H). 2(H). 3->5(F). 4->1(F). 5->3(F). Total faults = 10.',
  },
  {
    id: 'os-078',
    subject: 'OS',
    topic: 'G',
    difficulty: 'Medium',
    question: 'What is "thrashing"?',
    options: [
      { text: 'When the CPU scheduler is constantly switching between processes.', correct: false },
      {
        text: 'A condition where a process is spending more time paging (swapping pages) than executing.',
        correct: true,
      },
      { text: 'When the hard disk is excessively fragmented.', correct: false },
      { text: 'When multiple processes are deadlocked.', correct: false },
    ],
    rationale:
      'Thrashing is a state of high page fault activity. It occurs when a process does not have enough frames to hold its working set of pages, leading to a constant cycle of page faults and extremely poor performance.',
  },
  {
    id: 'os-079',
    subject: 'OS',
    topic: 'G',
    difficulty: 'Hard',
    question: 'The set of pages that a process is actively using at a given time is known as its:',
    options: [
      { text: 'Page Group', correct: false },
      { text: 'Working Set', correct: true },
      { text: 'Active Set', correct: false },
      { text: 'Frame Set', correct: false },
    ],
    rationale:
      'The working set model is based on the principle of locality. It states that for a process to run efficiently, its working set (the pages it needs in the immediate future) must be resident in main memory.',
  },
  {
    id: 'os-080',
    subject: 'OS',
    topic: 'G',
    difficulty: 'Easy',
    question: 'Virtual memory is a technique that allows:',
    options: [
      { text: 'A program to be written as if it has a very large, contiguous main memory.', correct: true },
      { text: 'Multiple programs to run at the same time.', correct: false },
      { text: 'Data to be stored virtually in the cloud.', correct: false },
      { text: 'The CPU to execute instructions faster.', correct: false },
    ],
    rationale:
      'Virtual memory abstracts physical memory from the user\'s view. It creates the illusion that a process has its own private, large address space, even though the physical memory may be smaller and shared among many processes.',
  },
  {
    id: 'os-081',
    subject: 'OS',
    topic: 'H',
    difficulty: 'Easy',
    question: 'Which of the following is NOT a common file attribute?',
    options: [
      { text: 'Name', correct: false },
      { text: 'Size', correct: false },
      { text: 'Creation Date', correct: false },
      { text: 'Process ID', correct: true },
    ],
    rationale:
      'Name, size, creation date, type, and location are all common file attributes stored by the file system. The Process ID is an attribute of a process, not a file.',
  },
  {
    id: 'os-082',
    subject: 'OS',
    topic: 'H',
    difficulty: 'Medium',
    question: 'In a file system, what is a directory?',
    options: [
      { text: 'A file that contains the executable code for a program.', correct: false },
      { text: 'A special file that contains information about other files and directories.', correct: true },
      { text: 'The physical block on the disk where a file is stored.', correct: false },
      { text: 'A hardware device for reading files.', correct: false },
    ],
    rationale:
      'A directory is essentially a symbol table that maps human-readable file names to their corresponding file system identifiers or locations. Most modern file systems implement directories as special files.',
  },
  {
    id: 'os-083',
    subject: 'OS',
    topic: 'H',
    difficulty: 'Medium',
    question: 'Which file allocation method can suffer from severe external fragmentation?',
    options: [
      { text: 'Linked Allocation', correct: false },
      { text: 'Indexed Allocation', correct: false },
      { text: 'Contiguous Allocation', correct: true },
      { text: 'Hashed Allocation', correct: false },
    ],
    rationale:
      'Contiguous allocation requires each file to occupy a single, contiguous set of blocks on the disk. Over time, as files are created and deleted, the free space on the disk can become broken up into small, non-contiguous chunks (external fragmentation).',
  },
  {
    id: 'os-084',
    subject: 'OS',
    topic: 'H',
    difficulty: 'Hard',
    question: 'What is a primary disadvantage of linked allocation for files?',
    options: [
      { text: 'It suffers from external fragmentation.', correct: false },
      { text: 'It does not support direct or random access to file blocks efficiently.', correct: true },
      { text: 'It requires a large amount of contiguous space on the disk.', correct: false },
      { text: 'The size of the file is limited by the number of pointers.', correct: false },
    ],
    rationale:
      'In linked allocation, to access the Nth block of a file, you must start at the beginning and traverse the first N-1 pointers. This makes it efficient for sequential access but very inefficient for direct access.',
  },
  {
    id: 'os-085',
    subject: 'OS',
    topic: 'H',
    difficulty: 'Medium',
    question:
      'Which file allocation method uses a special block (an index block) to store pointers to all the data blocks of a file?',
    options: [
      { text: 'Contiguous Allocation', correct: false },
      { text: 'Linked Allocation', correct: false },
      { text: 'Indexed Allocation', correct: true },
      { text: 'Chained Allocation', correct: false },
    ],
    rationale:
      'Indexed allocation solves the direct access problem of linked allocation. It brings all the pointers for a file\'s blocks together into a single location, the index block, allowing for efficient random access.',
  },
  {
    id: 'os-086',
    subject: 'OS',
    topic: 'H',
    difficulty: 'Easy',
    question:
      "Granting a user 'read' and 'write' permissions but not 'execute' permission on a file is an example of:",
    options: [
      { text: 'File Allocation', correct: false },
      { text: 'File Access Control', correct: true },
      { text: 'Directory Traversal', correct: false },
      { text: 'File Buffering', correct: false },
    ],
    rationale:
      'File access control is a security mechanism that determines which users or groups are allowed to perform which operations (read, write, execute) on a specific file or directory.',
  },
  {
    id: 'os-087',
    subject: 'OS',
    topic: 'I',
    difficulty: 'Easy',
    question: 'What is DMA (Direct Memory Access)?',
    options: [
      { text: 'A technique where the CPU directly accesses the main memory.', correct: false },
      {
        text: 'A feature that allows I/O devices to transfer data directly to or from main memory without involving the CPU.',
        correct: true,
      },
      { text: 'A method for managing virtual memory.', correct: false },
      { text: 'A type of CPU scheduling algorithm.', correct: false },
    ],
    rationale:
      'DMA offloads the task of transferring large blocks of data from the CPU. The CPU initiates the transfer, but the DMA controller manages the entire data transfer, freeing the CPU to perform other tasks.',
  },
  {
    id: 'os-088',
    subject: 'OS',
    topic: 'I',
    difficulty: 'Medium',
    question: 'An interrupt is a signal to the processor, typically generated by an I/O device, to:',
    options: [
      { text: 'Indicate that the device has failed.', correct: false },
      { text: 'Request the CPU\'s immediate attention for a specific event.', correct: true },
      { text: 'Shut down the system.', correct: false },
      { text: 'Slow down the CPU clock speed.', correct: false },
    ],
    rationale:
      "Interrupts are a fundamental mechanism for I/O. When a device completes an operation, it sends an interrupt to the CPU, causing the CPU to suspend its current work and execute an interrupt handler to service the device.",
  },
  {
    id: 'os-089',
    subject: 'OS',
    topic: 'I',
    difficulty: 'Medium',
    question: 'What is the purpose of a device driver?',
    options: [
      { text: 'It is the hardware controller for an I/O device.', correct: false },
      {
        text: 'It is a piece of software that provides a uniform interface for the OS to communicate with a specific hardware device.',
        correct: true,
      },
      { text: 'It is a hardware port used for connecting I/O devices.', correct: false },
      { text: 'It is a user-level application for configuring devices.', correct: false },
    ],
    rationale:
      'Each type of I/O device has a specific device driver. The driver understands the details of its particular device and presents a standardized interface to the rest of the operating system, hiding the hardware-specific complexity.',
  },
  {
    id: 'os-090',
    subject: 'OS',
    topic: 'I',
    difficulty: 'Hard',
    question:
      'In disk scheduling, which algorithm can lead to starvation for requests to tracks far from the current head position?',
    options: [
      { text: 'FCFS (First-Come, First-Served)', correct: false },
      { text: 'SCAN', correct: false },
      { text: 'C-SCAN', correct: false },
      { text: 'SSTF (Shortest Seek Time First)', correct: true },
    ],
    rationale:
      'SSTF always services the request that is closest to the current head position. If there is a steady stream of requests near the current position, requests for tracks that are farther away may be repeatedly ignored, leading to starvation.',
  },
  {
    id: 'os-091',
    subject: 'OS',
    topic: 'I',
    difficulty: 'Medium',
    question: 'Using a buffer for I/O operations can help to:',
    options: [
      { text: 'Cope with speed mismatches between the producer and consumer of a data stream.', correct: false },
      { text: 'Handle devices that have different data transfer sizes.', correct: false },
      { text: 'Support copy-on-write semantics for file I/O.', correct: false },
      { text: 'All of the above.', correct: true },
    ],
    rationale:
      'Buffering is a versatile technique. It smooths out speed differences (e.g., between a fast CPU and a slow disk), allows for adapting to different block sizes, and is used to implement advanced features like copy-on-write.',
  },
  {
    id: 'os-092',
    subject: 'OS',
    topic: 'J',
    difficulty: 'Easy',
    question: 'Virtualization allows:',
    options: [
      { text: 'A single physical machine to run multiple operating systems simultaneously.', correct: true },
      { text: 'A program to access memory that is not physically present.', correct: false },
      { text: 'The OS to be distributed across multiple physical machines.', correct: false },
      { text: 'Hardware devices to be accessed directly by user applications.', correct: false },
    ],
    rationale:
      'Virtualization involves creating a virtual version of a computing resource. A hypervisor or Virtual Machine Monitor (VMM) allows multiple guest operating systems to run concurrently on a single host machine.',
  },
  {
    id: 'os-093',
    subject: 'OS',
    topic: 'J',
    difficulty: 'Medium',
    question: 'A real-time system is one in which:',
    options: [
      {
        text: 'The correctness of the system depends not only on the logical result of a computation, but also on the time at which the results are produced.',
        correct: true,
      },
      { text: 'The system responds to user input in real-time.', correct: false },
      { text: 'The operating system uses the Round Robin scheduling algorithm.', correct: false },
      { text: 'The system has a graphical user interface.', correct: false },
    ],
    rationale:
      'This is the formal definition of a real-time system. Meeting timing constraints (deadlines) is a primary correctness criterion, which distinguishes it from general-purpose operating systems.',
  },
  {
    id: 'os-094',
    subject: 'OS',
    topic: 'J',
    difficulty: 'Hard',
    question: 'In a distributed system, what is a key challenge that is not present in a centralized system?',
    options: [
      { text: 'Process management', correct: false },
      { text: 'Memory management', correct: false },
      { text: 'Handling partial failures and network latency.', correct: true },
      { text: 'File system access control.', correct: false },
    ],
    rationale:
      'In a distributed system, components can fail independently (partial failure), and communication between components is subject to network latency and unreliability. These issues introduce significant complexity that centralized systems do not have to deal with.',
  },
  {
    id: 'os-095',
    subject: 'OS',
    topic: 'J',
    difficulty: 'Medium',
    question: 'The principle of least privilege in OS security means that:',
    options: [
      { text: 'The OS should have the lowest possible privilege level.', correct: false },
      {
        text: 'Programs and users should be given only the minimum amount of privilege necessary to perform their jobs.',
        correct: true,
      },
      { text: 'The user with the fewest privileges is the administrator.', correct: false },
      { text: 'Security is the least important concern for an OS.', correct: false },
    ],
    rationale:
      'This is a fundamental security design principle. By limiting the privileges of any component, you limit the amount of damage that can be caused if that component is compromised.',
  },
  {
    id: 'os-096',
    subject: 'OS',
    topic: 'J',
    difficulty: 'Easy',
    question:
      'An operating system designed to control machinery, scientific instruments, and industrial systems is known as a:',
    options: [
      { text: 'Batch OS', correct: false },
      { text: 'Time-Sharing OS', correct: false },
      { text: 'Real-Time OS', correct: true },
      { text: 'Distributed OS', correct: false },
    ],
    rationale:
      'Real-Time Operating Systems (RTOS) are used in embedded systems and other applications where timely and predictable responses to events are critical.',
  },
  {
    id: 'os-097',
    subject: 'OS',
    topic: 'J',
    difficulty: 'Medium',
    question: 'In a symmetric multiprocessing (SMP) system:',
    options: [
      { text: 'Each processor is assigned a specific task.', correct: false },
      { text: 'All processors are peers, and any processor can run the kernel and do I/O.', correct: true },
      { text: 'There is one master processor that controls all other slave processors.', correct: false },
      { text: 'Processors cannot communicate with each other directly.', correct: false },
    ],
    rationale:
      'SMP is the most common type of multiprocessor system today. All CPUs are treated equally and can run any task, including OS kernel code, which simplifies scheduling and load balancing.',
  },
  {
    id: 'os-098',
    subject: 'OS',
    topic: 'J',
    difficulty: 'Hard',
    question: 'What is a hypervisor (or Virtual Machine Monitor)?',
    options: [
      { text: 'The kernel of a microkernel-based operating system.', correct: false },
      { text: 'A software or firmware layer that creates and runs virtual machines.', correct: true },
      { text: 'A hardware device for monitoring system performance.', correct: false },
      { text: 'A security tool for detecting viruses in the OS.', correct: false },
    ],
    rationale:
      'A hypervisor is the core technology that enables virtualization. It sits between the hardware and the virtual machines and is responsible for managing and allocating hardware resources to the guest operating systems.',
  },
  {
    id: 'os-099',
    subject: 'OS',
    topic: 'J',
    difficulty: 'Medium',
    question:
      'A security attack where a malicious program masquerades as a legitimate one to gain access is known as a:',
    options: [
      { text: 'Worm', correct: false },
      { text: 'Virus', correct: false },
      { text: 'Trojan Horse', correct: true },
      { text: 'Logic Bomb', correct: false },
    ],
    rationale:
      'A Trojan Horse is a type of malware that appears to be a useful or legitimate program but contains hidden malicious functions. Unlike viruses, it does not typically replicate itself.',
  },
  {
    id: 'os-100',
    subject: 'OS',
    topic: 'J',
    difficulty: 'Hard',
    question: 'What is processor affinity in the context of multiprocessor scheduling?',
    options: [
      { text: 'The tendency for a processor to favor I/O-bound processes.', correct: false },
      { text: 'A scheduler\'s attempt to keep a process running on the same processor it ran on previously.', correct: true },
      { text: 'The speed at which a processor can access memory.', correct: false },
      { text: 'A hardware feature that links two processors together.', correct: false },
    ],
    rationale:
      'Processor affinity is a performance optimization. By keeping a process on the same CPU, it can take advantage of data that is still in that CPU\'s cache from the last time it ran, avoiding the cost of cache invalidation and reloading.',
  },
];
