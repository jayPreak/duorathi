// The Marathi course. Lessons are small (5-6 exercises) so a learner can finish
// one in ~2 minutes and come back daily. Content is beginner Marathi written in
// Devanagari with romanization to aid reading.
//
// Curriculum shape mirrors Duolingo: Units → Lessons → Exercises, traversed
// linearly (each lesson unlocks the next).

export type Exercise =
  | ChoiceExercise
  | BuildExercise
  | MatchExercise;

/** Multiple choice — pick the one correct option. */
export interface ChoiceExercise {
  id: string;
  type: "choice";
  prompt: string;
  /** Marathi headword shown large + tappable to hear it (optional). */
  headword?: { marathi: string; roman: string };
  options: string[];
  answer: number; // index into options
}

/** Tap word tiles to build a translation. */
export interface BuildExercise {
  id: string;
  type: "build";
  prompt: string;
  marathi: string;
  roman: string;
  answerWords: string[]; // correct words in order
  bank: string[]; // answerWords + distractors, shown shuffled
}

/** Match Marathi words to their English meaning. */
export interface MatchExercise {
  id: string;
  type: "match";
  prompt: string;
  pairs: { marathi: string; roman: string; english: string }[];
}

export interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  color: string; // tailwind-friendly hex used for the unit header & nodes
  lessons: Lesson[];
}

export const COURSE: Unit[] = [
  // ===================================================================
  {
    id: "u1",
    title: "Greetings",
    description: "Say hello, thank you, yes and no",
    color: "#58cc02",
    lessons: [
      {
        id: "u1-l1",
        title: "Hello & thanks",
        exercises: [
          {
            id: "u1-l1-e1",
            type: "choice",
            prompt: "“Hello” in Marathi is…",
            headword: { marathi: "नमस्कार", roman: "namaskār" },
            options: ["नमस्कार", "धन्यवाद", "नाही"],
            answer: 0,
          },
          {
            id: "u1-l1-e2",
            type: "choice",
            prompt: "Which word means “thank you”?",
            options: ["होय", "धन्यवाद", "नमस्कार"],
            answer: 1,
          },
          {
            id: "u1-l1-e3",
            type: "choice",
            prompt: "What does “धन्यवाद” mean?",
            headword: { marathi: "धन्यवाद", roman: "dhanyavād" },
            options: ["Hello", "Sorry", "Thank you"],
            answer: 2,
          },
          {
            id: "u1-l1-e4",
            type: "build",
            prompt: "Translate this",
            marathi: "नमस्कार",
            roman: "namaskār",
            answerWords: ["Hello"],
            bank: ["Hello", "Thanks", "Yes"],
          },
          {
            id: "u1-l1-e5",
            type: "match",
            prompt: "Tap the matching pairs",
            pairs: [
              { marathi: "नमस्कार", roman: "namaskār", english: "Hello" },
              { marathi: "धन्यवाद", roman: "dhanyavād", english: "Thank you" },
              { marathi: "कृपया", roman: "kṛpayā", english: "Please" },
            ],
          },
        ],
      },
      {
        id: "u1-l2",
        title: "Yes & no",
        exercises: [
          {
            id: "u1-l2-e1",
            type: "choice",
            prompt: "“Yes” in Marathi is…",
            headword: { marathi: "होय", roman: "hoy" },
            options: ["नाही", "होय", "कृपया"],
            answer: 1,
          },
          {
            id: "u1-l2-e2",
            type: "choice",
            prompt: "“No” in Marathi is…",
            headword: { marathi: "नाही", roman: "nāhī" },
            options: ["होय", "माफ करा", "नाही"],
            answer: 2,
          },
          {
            id: "u1-l2-e3",
            type: "choice",
            prompt: "What does “माफ करा” mean?",
            headword: { marathi: "माफ करा", roman: "māf karā" },
            options: ["Sorry / excuse me", "Thank you", "Hello"],
            answer: 0,
          },
          {
            id: "u1-l2-e4",
            type: "match",
            prompt: "Tap the matching pairs",
            pairs: [
              { marathi: "होय", roman: "hoy", english: "Yes" },
              { marathi: "नाही", roman: "nāhī", english: "No" },
              { marathi: "माफ करा", roman: "māf karā", english: "Sorry" },
            ],
          },
          {
            id: "u1-l2-e5",
            type: "build",
            prompt: "Translate this",
            marathi: "धन्यवाद",
            roman: "dhanyavād",
            answerWords: ["Thank", "you"],
            bank: ["Thank", "you", "Hello", "please"],
          },
        ],
      },
    ],
  },

  // ===================================================================
  {
    id: "u2",
    title: "Numbers",
    description: "Count from one to ten",
    color: "#1cb0f6",
    lessons: [
      {
        id: "u2-l1",
        title: "One to five",
        exercises: [
          {
            id: "u2-l1-e1",
            type: "choice",
            prompt: "“One” in Marathi is…",
            headword: { marathi: "एक", roman: "ek" },
            options: ["दोन", "एक", "तीन"],
            answer: 1,
          },
          {
            id: "u2-l1-e2",
            type: "choice",
            prompt: "What number is “तीन”?",
            headword: { marathi: "तीन", roman: "tīn" },
            options: ["2", "5", "3"],
            answer: 2,
          },
          {
            id: "u2-l1-e3",
            type: "choice",
            prompt: "“Five” in Marathi is…",
            headword: { marathi: "पाच", roman: "pāch" },
            options: ["पाच", "चार", "दोन"],
            answer: 0,
          },
          {
            id: "u2-l1-e4",
            type: "match",
            prompt: "Match the numbers",
            pairs: [
              { marathi: "एक", roman: "ek", english: "1" },
              { marathi: "दोन", roman: "don", english: "2" },
              { marathi: "चार", roman: "chār", english: "4" },
            ],
          },
          {
            id: "u2-l1-e5",
            type: "choice",
            prompt: "What number is “दोन”?",
            headword: { marathi: "दोन", roman: "don" },
            options: ["2", "4", "1"],
            answer: 0,
          },
        ],
      },
      {
        id: "u2-l2",
        title: "Six to ten",
        exercises: [
          {
            id: "u2-l2-e1",
            type: "choice",
            prompt: "“Ten” in Marathi is…",
            headword: { marathi: "दहा", roman: "dahā" },
            options: ["आठ", "दहा", "नऊ"],
            answer: 1,
          },
          {
            id: "u2-l2-e2",
            type: "choice",
            prompt: "What number is “सात”?",
            headword: { marathi: "सात", roman: "sāt" },
            options: ["6", "7", "8"],
            answer: 1,
          },
          {
            id: "u2-l2-e3",
            type: "match",
            prompt: "Match the numbers",
            pairs: [
              { marathi: "सहा", roman: "sahā", english: "6" },
              { marathi: "आठ", roman: "āṭh", english: "8" },
              { marathi: "नऊ", roman: "naū", english: "9" },
            ],
          },
          {
            id: "u2-l2-e4",
            type: "choice",
            prompt: "“Eight” in Marathi is…",
            headword: { marathi: "आठ", roman: "āṭh" },
            options: ["नऊ", "सात", "आठ"],
            answer: 2,
          },
          {
            id: "u2-l2-e5",
            type: "choice",
            prompt: "What number is “दहा”?",
            headword: { marathi: "दहा", roman: "dahā" },
            options: ["10", "9", "6"],
            answer: 0,
          },
        ],
      },
    ],
  },

  // ===================================================================
  {
    id: "u3",
    title: "Family",
    description: "Talk about people you love",
    color: "#ce82ff",
    lessons: [
      {
        id: "u3-l1",
        title: "Parents & kids",
        exercises: [
          {
            id: "u3-l1-e1",
            type: "choice",
            prompt: "“Mother” in Marathi is…",
            headword: { marathi: "आई", roman: "āī" },
            options: ["बाबा", "आई", "भाऊ"],
            answer: 1,
          },
          {
            id: "u3-l1-e2",
            type: "choice",
            prompt: "What does “बाबा” mean?",
            headword: { marathi: "बाबा", roman: "bābā" },
            options: ["Father", "Sister", "Friend"],
            answer: 0,
          },
          {
            id: "u3-l1-e3",
            type: "choice",
            prompt: "“Daughter / girl” in Marathi is…",
            headword: { marathi: "मुलगी", roman: "mulgī" },
            options: ["मुलगा", "मुलगी", "आजी"],
            answer: 1,
          },
          {
            id: "u3-l1-e4",
            type: "match",
            prompt: "Match the family words",
            pairs: [
              { marathi: "आई", roman: "āī", english: "Mother" },
              { marathi: "बाबा", roman: "bābā", english: "Father" },
              { marathi: "मुलगा", roman: "mulgā", english: "Son / boy" },
            ],
          },
          {
            id: "u3-l1-e5",
            type: "build",
            prompt: "Translate this",
            marathi: "आई",
            roman: "āī",
            answerWords: ["Mother"],
            bank: ["Mother", "Father", "Sister"],
          },
        ],
      },
      {
        id: "u3-l2",
        title: "Siblings & friends",
        exercises: [
          {
            id: "u3-l2-e1",
            type: "choice",
            prompt: "“Brother” in Marathi is…",
            headword: { marathi: "भाऊ", roman: "bhāū" },
            options: ["बहीण", "भाऊ", "मित्र"],
            answer: 1,
          },
          {
            id: "u3-l2-e2",
            type: "choice",
            prompt: "What does “बहीण” mean?",
            headword: { marathi: "बहीण", roman: "bahīṇ" },
            options: ["Sister", "Mother", "Friend"],
            answer: 0,
          },
          {
            id: "u3-l2-e3",
            type: "choice",
            prompt: "“Friend” in Marathi is…",
            headword: { marathi: "मित्र", roman: "mitra" },
            options: ["मित्र", "आजोबा", "भाऊ"],
            answer: 0,
          },
          {
            id: "u3-l2-e4",
            type: "match",
            prompt: "Match the words",
            pairs: [
              { marathi: "भाऊ", roman: "bhāū", english: "Brother" },
              { marathi: "बहीण", roman: "bahīṇ", english: "Sister" },
              { marathi: "मित्र", roman: "mitra", english: "Friend" },
            ],
          },
          {
            id: "u3-l2-e5",
            type: "build",
            prompt: "Translate this",
            marathi: "मित्र",
            roman: "mitra",
            answerWords: ["Friend"],
            bank: ["Friend", "Brother", "Sister"],
          },
        ],
      },
    ],
  },

  // ===================================================================
  {
    id: "u4",
    title: "Everyday words",
    description: "Food, drink and home",
    color: "#ff9600",
    lessons: [
      {
        id: "u4-l1",
        title: "Food & drink",
        exercises: [
          {
            id: "u4-l1-e1",
            type: "choice",
            prompt: "“Water” in Marathi is…",
            headword: { marathi: "पाणी", roman: "pāṇī" },
            options: ["दूध", "पाणी", "चहा"],
            answer: 1,
          },
          {
            id: "u4-l1-e2",
            type: "choice",
            prompt: "What does “दूध” mean?",
            headword: { marathi: "दूध", roman: "dūdh" },
            options: ["Tea", "Food", "Milk"],
            answer: 2,
          },
          {
            id: "u4-l1-e3",
            type: "choice",
            prompt: "“Tea” in Marathi is…",
            headword: { marathi: "चहा", roman: "chahā" },
            options: ["चहा", "पाणी", "अन्न"],
            answer: 0,
          },
          {
            id: "u4-l1-e4",
            type: "match",
            prompt: "Match food & drink",
            pairs: [
              { marathi: "पाणी", roman: "pāṇī", english: "Water" },
              { marathi: "दूध", roman: "dūdh", english: "Milk" },
              { marathi: "अन्न", roman: "anna", english: "Food" },
            ],
          },
          {
            id: "u4-l1-e5",
            type: "build",
            prompt: "Translate this",
            marathi: "पाणी",
            roman: "pāṇī",
            answerWords: ["Water"],
            bank: ["Water", "Milk", "Tea"],
          },
        ],
      },
      {
        id: "u4-l2",
        title: "Around the home",
        exercises: [
          {
            id: "u4-l2-e1",
            type: "choice",
            prompt: "“House / home” in Marathi is…",
            headword: { marathi: "घर", roman: "ghar" },
            options: ["शाळा", "घर", "पुस्तक"],
            answer: 1,
          },
          {
            id: "u4-l2-e2",
            type: "choice",
            prompt: "What does “पुस्तक” mean?",
            headword: { marathi: "पुस्तक", roman: "pustak" },
            options: ["School", "Book", "Cat"],
            answer: 1,
          },
          {
            id: "u4-l2-e3",
            type: "choice",
            prompt: "“School” in Marathi is…",
            headword: { marathi: "शाळा", roman: "śāḷā" },
            options: ["घर", "शाळा", "मांजर"],
            answer: 1,
          },
          {
            id: "u4-l2-e4",
            type: "match",
            prompt: "Match the words",
            pairs: [
              { marathi: "घर", roman: "ghar", english: "Home" },
              { marathi: "शाळा", roman: "śāḷā", english: "School" },
              { marathi: "पुस्तक", roman: "pustak", english: "Book" },
            ],
          },
          {
            id: "u4-l2-e5",
            type: "build",
            prompt: "Translate this",
            marathi: "घर",
            roman: "ghar",
            answerWords: ["Home"],
            bank: ["Home", "School", "Book"],
          },
        ],
      },
    ],
  },

  // ===================================================================
  {
    id: "u5",
    title: "First phrases",
    description: "Introduce yourself",
    color: "#ff4b4b",
    lessons: [
      {
        id: "u5-l1",
        title: "Me & you",
        exercises: [
          {
            id: "u5-l1-e1",
            type: "choice",
            prompt: "“I” in Marathi is…",
            headword: { marathi: "मी", roman: "mī" },
            options: ["तू", "मी", "तो"],
            answer: 1,
          },
          {
            id: "u5-l1-e2",
            type: "choice",
            prompt: "What does “तुम्ही” mean?",
            headword: { marathi: "तुम्ही", roman: "tumhī" },
            options: ["You (polite)", "We", "She"],
            answer: 0,
          },
          {
            id: "u5-l1-e3",
            type: "match",
            prompt: "Match the pronouns",
            pairs: [
              { marathi: "मी", roman: "mī", english: "I" },
              { marathi: "तू", roman: "tū", english: "You" },
              { marathi: "आम्ही", roman: "āmhī", english: "We" },
            ],
          },
          {
            id: "u5-l1-e4",
            type: "build",
            prompt: "Translate: “My name is…”",
            marathi: "माझे नाव आहे",
            roman: "mājhe nāv āhe",
            answerWords: ["My", "name", "is"],
            bank: ["My", "name", "is", "your", "what"],
          },
          {
            id: "u5-l1-e5",
            type: "choice",
            prompt: "“तुमचे नाव काय आहे?” means…",
            headword: { marathi: "तुमचे नाव काय आहे?", roman: "tumche nāv kāy āhe?" },
            options: [
              "How are you?",
              "What is your name?",
              "Where do you live?",
            ],
            answer: 1,
          },
        ],
      },
      {
        id: "u5-l2",
        title: "How are you?",
        exercises: [
          {
            id: "u5-l2-e1",
            type: "choice",
            prompt: "“तुम्ही कसे आहात?” means…",
            headword: { marathi: "तुम्ही कसे आहात?", roman: "tumhī kase āhāt?" },
            options: ["What is your name?", "How are you?", "Thank you"],
            answer: 1,
          },
          {
            id: "u5-l2-e2",
            type: "choice",
            prompt: "How do you say “I am fine”?",
            options: ["मी ठीक आहे", "माझे नाव आहे", "तू कसा आहेस"],
            answer: 0,
          },
          {
            id: "u5-l2-e3",
            type: "build",
            prompt: "Translate this",
            marathi: "मी ठीक आहे",
            roman: "mī ṭhīk āhe",
            answerWords: ["I", "am", "fine"],
            bank: ["I", "am", "fine", "you", "are"],
          },
          {
            id: "u5-l2-e4",
            type: "choice",
            prompt: "“मला मराठी आवडते” means…",
            headword: { marathi: "मला मराठी आवडते", roman: "malā marāṭhī āvaḍte" },
            options: [
              "I like Marathi",
              "I speak Marathi",
              "Marathi is hard",
            ],
            answer: 0,
          },
          {
            id: "u5-l2-e5",
            type: "match",
            prompt: "Match the phrases",
            pairs: [
              { marathi: "नमस्कार", roman: "namaskār", english: "Hello" },
              { marathi: "मी ठीक आहे", roman: "mī ṭhīk āhe", english: "I am fine" },
              { marathi: "धन्यवाद", roman: "dhanyavād", english: "Thank you" },
            ],
          },
        ],
      },
    ],
  },
];

// --- Derived helpers -------------------------------------------------------

export interface LessonRef {
  unit: Unit;
  lesson: Lesson;
  /** 0-based index across the whole course (defines unlock order). */
  order: number;
}

/** Flat, ordered list of every lesson with its unit. */
export const LESSON_SEQUENCE: LessonRef[] = COURSE.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ unit, lesson, order: 0 })),
).map((ref, i) => ({ ...ref, order: i }));

export function getLessonRef(lessonId: string): LessonRef | undefined {
  return LESSON_SEQUENCE.find((r) => r.lesson.id === lessonId);
}

export const TOTAL_LESSONS = LESSON_SEQUENCE.length;
