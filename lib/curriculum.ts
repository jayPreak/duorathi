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
            prompt: "Hello in Marathi is…",
            headword: { marathi: "नमस्कार", roman: "namaskār" },
            options: ["नमस्कार", "धन्यवाद", "नाही"],
            answer: 0,
          },
          {
            id: "u1-l1-e2",
            type: "choice",
            prompt: "Which word means thank you?",
            options: ["होय", "धन्यवाद", "नमस्कार"],
            answer: 1,
          },
          {
            id: "u1-l1-e3",
            type: "choice",
            prompt: "What does धन्यवाद mean?",
            headword: { marathi: "धन्यवाद", roman: "dhanyavād" },
            options: ["Hello", "Sorry", "Thank you"],
            answer: 2,
          },
          {
            id: "u1-l1-e4",
            type: "choice",
            prompt: "You walk into a room and want to greet everyone. What do you say?",
            options: ["धन्यवाद", "नमस्कार", "नाही"],
            answer: 1,
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
            prompt: "Yes in Marathi is…",
            headword: { marathi: "होय", roman: "hoy" },
            options: ["नाही", "होय", "कृपया"],
            answer: 1,
          },
          {
            id: "u1-l2-e2",
            type: "choice",
            prompt: "No in Marathi is…",
            headword: { marathi: "नाही", roman: "nāhī" },
            options: ["होय", "माफ करा", "नाही"],
            answer: 2,
          },
          {
            id: "u1-l2-e3",
            type: "choice",
            prompt: "What does माफ करा mean?",
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
            type: "choice",
            prompt: "Someone helps you. How do you thank them in Marathi?",
            options: ["नमस्कार", "नाही", "धन्यवाद"],
            answer: 2,
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
            prompt: "One in Marathi is…",
            headword: { marathi: "एक", roman: "ek" },
            options: ["दोन", "एक", "तीन"],
            answer: 1,
          },
          {
            id: "u2-l1-e2",
            type: "choice",
            prompt: "What number is तीन?",
            headword: { marathi: "तीन", roman: "tīn" },
            options: ["2", "5", "3"],
            answer: 2,
          },
          {
            id: "u2-l1-e3",
            type: "choice",
            prompt: "Five in Marathi is…",
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
            prompt: "What number is दोन?",
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
            prompt: "Ten in Marathi is…",
            headword: { marathi: "दहा", roman: "dahā" },
            options: ["आठ", "दहा", "नऊ"],
            answer: 1,
          },
          {
            id: "u2-l2-e2",
            type: "choice",
            prompt: "What number is सात?",
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
            prompt: "Eight in Marathi is…",
            headword: { marathi: "आठ", roman: "āṭh" },
            options: ["नऊ", "सात", "आठ"],
            answer: 2,
          },
          {
            id: "u2-l2-e5",
            type: "choice",
            prompt: "What number is दहा?",
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
            prompt: "Mother in Marathi is…",
            headword: { marathi: "आई", roman: "āī" },
            options: ["बाबा", "आई", "भाऊ"],
            answer: 1,
          },
          {
            id: "u3-l1-e2",
            type: "choice",
            prompt: "What does बाबा mean?",
            headword: { marathi: "बाबा", roman: "bābā" },
            options: ["Father", "Sister", "Friend"],
            answer: 0,
          },
          {
            id: "u3-l1-e3",
            type: "choice",
            prompt: "Daughter / girl in Marathi is…",
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
            type: "choice",
            prompt: "Someone on the phone says आई आहे का? — what are they asking?",
            headword: { marathi: "आई आहे का?", roman: "āī āhe kā?" },
            options: ["Is your father home?", "Is your mother home?", "Are you home?"],
            answer: 1,
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
            prompt: "Brother in Marathi is…",
            headword: { marathi: "भाऊ", roman: "bhāū" },
            options: ["बहीण", "भाऊ", "मित्र"],
            answer: 1,
          },
          {
            id: "u3-l2-e2",
            type: "choice",
            prompt: "What does बहीण mean?",
            headword: { marathi: "बहीण", roman: "bahīṇ" },
            options: ["Sister", "Mother", "Friend"],
            answer: 0,
          },
          {
            id: "u3-l2-e3",
            type: "choice",
            prompt: "Friend in Marathi is…",
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
            type: "choice",
            prompt: "You want to introduce your friend. You say हा माझा ___…",
            options: ["बाबा", "मित्र", "भाऊ"],
            answer: 1,
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
            prompt: "Water in Marathi is…",
            headword: { marathi: "पाणी", roman: "pāṇī" },
            options: ["दूध", "पाणी", "चहा"],
            answer: 1,
          },
          {
            id: "u4-l1-e2",
            type: "choice",
            prompt: "What does दूध mean?",
            headword: { marathi: "दूध", roman: "dūdh" },
            options: ["Tea", "Food", "Milk"],
            answer: 2,
          },
          {
            id: "u4-l1-e3",
            type: "choice",
            prompt: "Tea in Marathi is…",
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
            type: "choice",
            prompt: "A host offers you a drink and says चहा की पाणी? — what are they offering?",
            headword: { marathi: "चहा की पाणी?", roman: "chahā kī pāṇī?" },
            options: ["Coffee or milk?", "Tea or water?", "Food or drinks?"],
            answer: 1,
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
            prompt: "House / home in Marathi is…",
            headword: { marathi: "घर", roman: "ghar" },
            options: ["शाळा", "घर", "पुस्तक"],
            answer: 1,
          },
          {
            id: "u4-l2-e2",
            type: "choice",
            prompt: "What does पुस्तक mean?",
            headword: { marathi: "पुस्तक", roman: "pustak" },
            options: ["School", "Book", "Cat"],
            answer: 1,
          },
          {
            id: "u4-l2-e3",
            type: "choice",
            prompt: "School in Marathi is…",
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
            type: "choice",
            prompt: "Someone asks तुमचे घर कुठे आहे? — what do they want to know?",
            headword: { marathi: "तुमचे घर कुठे आहे?", roman: "tumche ghar kuṭhe āhe?" },
            options: ["What's your name?", "Where is your house?", "When do you go home?"],
            answer: 1,
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
            prompt: "I in Marathi is…",
            headword: { marathi: "मी", roman: "mī" },
            options: ["तू", "मी", "तो"],
            answer: 1,
          },
          {
            id: "u5-l1-e2",
            type: "choice",
            prompt: "What does तुम्ही mean?",
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
            type: "choice",
            prompt: "You want to introduce yourself. What do you say first?",
            options: ["माझे नाव ___ आहे", "तुमचे नाव काय आहे?", "मी कुठे आहे?"],
            answer: 0,
          },
          {
            id: "u5-l1-e5",
            type: "choice",
            prompt: "तुमचे नाव काय आहे? means…",
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
            prompt: "तुम्ही कसे आहात? means…",
            headword: { marathi: "तुम्ही कसे आहात?", roman: "tumhī kase āhāt?" },
            options: ["What is your name?", "How are you?", "Thank you"],
            answer: 1,
          },
          {
            id: "u5-l2-e2",
            type: "choice",
            prompt: "How do you say I am fine?",
            options: ["मी ठीक आहे", "माझे नाव आहे", "तू कसा आहेस"],
            answer: 0,
          },
          {
            id: "u5-l2-e3",
            type: "choice",
            prompt: "A friend asks how you are. How do you say I'm fine?",
            options: ["मी जातो", "मी ठीक आहे", "मला माहीत नाही"],
            answer: 1,
          },
          {
            id: "u5-l2-e4",
            type: "choice",
            prompt: "मला मराठी आवडते means…",
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
  // ===================================================================
  {
    id: "u6",
    title: "Colors",
    description: "Name colors in Marathi",
    color: "#ff4b4b",
    lessons: [
      {
        id: "u6-l1",
        title: "Basic colors",
        exercises: [
          {
            id: "u6-l1-e1",
            type: "choice",
            prompt: "Red in Marathi is…",
            headword: { marathi: "लाल", roman: "lāl" },
            options: ["लाल", "निळा", "पिवळा"],
            answer: 0,
          },
          {
            id: "u6-l1-e2",
            type: "choice",
            prompt: "Blue in Marathi is…",
            headword: { marathi: "निळा", roman: "niḷā" },
            options: ["हिरवा", "निळा", "काळा"],
            answer: 1,
          },
          {
            id: "u6-l1-e3",
            type: "choice",
            prompt: "What does हिरवा mean?",
            headword: { marathi: "हिरवा", roman: "hiravā" },
            options: ["Yellow", "Green", "White"],
            answer: 1,
          },
          {
            id: "u6-l1-e4",
            type: "match",
            prompt: "Match the colors",
            pairs: [
              { marathi: "लाल", roman: "lāl", english: "Red" },
              { marathi: "निळा", roman: "niḷā", english: "Blue" },
              { marathi: "हिरवा", roman: "hiravā", english: "Green" },
            ],
          },
          {
            id: "u6-l1-e5",
            type: "choice",
            prompt: "White in Marathi is…",
            headword: { marathi: "पांढरा", roman: "pāṇḍharā" },
            options: ["काळा", "पांढरा", "पिवळा"],
            answer: 1,
          },
        ],
      },
      {
        id: "u6-l2",
        title: "More colors",
        exercises: [
          {
            id: "u6-l2-e1",
            type: "choice",
            prompt: "Yellow in Marathi is…",
            headword: { marathi: "पिवळा", roman: "pivaḷā" },
            options: ["नारंगी", "पिवळा", "जांभळा"],
            answer: 1,
          },
          {
            id: "u6-l2-e2",
            type: "choice",
            prompt: "What does काळा mean?",
            headword: { marathi: "काळा", roman: "kāḷā" },
            options: ["Brown", "Black", "Orange"],
            answer: 1,
          },
          {
            id: "u6-l2-e3",
            type: "match",
            prompt: "Match the colors",
            pairs: [
              { marathi: "पिवळा", roman: "pivaḷā", english: "Yellow" },
              { marathi: "काळा", roman: "kāḷā", english: "Black" },
              { marathi: "नारंगी", roman: "nāraṅgī", english: "Orange" },
            ],
          },
          {
            id: "u6-l2-e4",
            type: "choice",
            prompt: "Purple in Marathi is…",
            headword: { marathi: "जांभळा", roman: "jāmbhaḷā" },
            options: ["जांभळा", "गुलाबी", "तपकिरी"],
            answer: 0,
          },
          {
            id: "u6-l2-e5",
            type: "choice",
            prompt: "Someone describes a shirt as हा लाल रंगाचा आहे — what color is it?",
            headword: { marathi: "हा लाल रंगाचा आहे", roman: "hā lāl raṅgācā āhe" },
            options: ["Blue", "Green", "Red"],
            answer: 2,
          },
        ],
      },
    ],
  },

  // ===================================================================
  {
    id: "u7",
    title: "Days & Time",
    description: "Tell the time and day",
    color: "#1cb0f6",
    lessons: [
      {
        id: "u7-l1",
        title: "Days of the week",
        exercises: [
          {
            id: "u7-l1-e1",
            type: "choice",
            prompt: "Monday in Marathi is…",
            headword: { marathi: "सोमवार", roman: "somavār" },
            options: ["मंगळवार", "सोमवार", "शुक्रवार"],
            answer: 1,
          },
          {
            id: "u7-l1-e2",
            type: "choice",
            prompt: "What does शनिवार mean?",
            headword: { marathi: "शनिवार", roman: "śanivār" },
            options: ["Friday", "Sunday", "Saturday"],
            answer: 2,
          },
          {
            id: "u7-l1-e3",
            type: "match",
            prompt: "Match the days",
            pairs: [
              { marathi: "सोमवार", roman: "somavār", english: "Monday" },
              { marathi: "बुधवार", roman: "budhavār", english: "Wednesday" },
              { marathi: "शुक्रवार", roman: "śukravār", english: "Friday" },
            ],
          },
          {
            id: "u7-l1-e4",
            type: "choice",
            prompt: "Sunday in Marathi is…",
            headword: { marathi: "रविवार", roman: "ravivār" },
            options: ["शनिवार", "गुरुवार", "रविवार"],
            answer: 2,
          },
          {
            id: "u7-l1-e5",
            type: "choice",
            prompt: "What does मंगळवार mean?",
            headword: { marathi: "मंगळवार", roman: "maṅgaḷavār" },
            options: ["Thursday", "Tuesday", "Wednesday"],
            answer: 1,
          },
        ],
      },
      {
        id: "u7-l2",
        title: "Time expressions",
        exercises: [
          {
            id: "u7-l2-e1",
            type: "choice",
            prompt: "Today in Marathi is…",
            headword: { marathi: "आज", roman: "āj" },
            options: ["उद्या", "आज", "काल"],
            answer: 1,
          },
          {
            id: "u7-l2-e2",
            type: "choice",
            prompt: "What does उद्या mean?",
            headword: { marathi: "उद्या", roman: "udyā" },
            options: ["Yesterday", "Today", "Tomorrow"],
            answer: 2,
          },
          {
            id: "u7-l2-e3",
            type: "match",
            prompt: "Match the time words",
            pairs: [
              { marathi: "सकाळ", roman: "sakāḷ", english: "Morning" },
              { marathi: "दुपार", roman: "dupār", english: "Afternoon" },
              { marathi: "रात्र", roman: "rātra", english: "Night" },
            ],
          },
          {
            id: "u7-l2-e4",
            type: "choice",
            prompt: "Evening in Marathi is…",
            headword: { marathi: "संध्याकाळ", roman: "sandhyākāḷ" },
            options: ["संध्याकाळ", "सकाळ", "रात्र"],
            answer: 0,
          },
          {
            id: "u7-l2-e5",
            type: "choice",
            prompt: "You meet a neighbour early in the day. What do you say?",
            options: ["शुभ रात्र", "शुभ सकाळ", "शुभ संध्याकाळ"],
            answer: 1,
          },
        ],
      },
    ],
  },

  // ===================================================================
  {
    id: "u8",
    title: "Body",
    description: "Name parts of the body",
    color: "#ff9600",
    lessons: [
      {
        id: "u8-l1",
        title: "Head & face",
        exercises: [
          {
            id: "u8-l1-e1",
            type: "choice",
            prompt: "Eye in Marathi is…",
            headword: { marathi: "डोळा", roman: "ḍoḷā" },
            options: ["कान", "डोळा", "नाक"],
            answer: 1,
          },
          {
            id: "u8-l1-e2",
            type: "choice",
            prompt: "What does कान mean?",
            headword: { marathi: "कान", roman: "kān" },
            options: ["Nose", "Mouth", "Ear"],
            answer: 2,
          },
          {
            id: "u8-l1-e3",
            type: "match",
            prompt: "Match the face parts",
            pairs: [
              { marathi: "डोळा", roman: "ḍoḷā", english: "Eye" },
              { marathi: "नाक", roman: "nāk", english: "Nose" },
              { marathi: "तोंड", roman: "toṇḍ", english: "Mouth" },
            ],
          },
          {
            id: "u8-l1-e4",
            type: "choice",
            prompt: "Hair in Marathi is…",
            headword: { marathi: "केस", roman: "kes" },
            options: ["डोके", "केस", "दात"],
            answer: 1,
          },
          {
            id: "u8-l1-e5",
            type: "choice",
            prompt: "What does दात mean?",
            headword: { marathi: "दात", roman: "dāt" },
            options: ["Head", "Hair", "Teeth"],
            answer: 2,
          },
        ],
      },
      {
        id: "u8-l2",
        title: "Body parts",
        exercises: [
          {
            id: "u8-l2-e1",
            type: "choice",
            prompt: "Hand in Marathi is…",
            headword: { marathi: "हात", roman: "hāt" },
            options: ["पाय", "हात", "पोट"],
            answer: 1,
          },
          {
            id: "u8-l2-e2",
            type: "choice",
            prompt: "What does पाय mean?",
            headword: { marathi: "पाय", roman: "pāy" },
            options: ["Arm", "Leg / foot", "Back"],
            answer: 1,
          },
          {
            id: "u8-l2-e3",
            type: "match",
            prompt: "Match the body parts",
            pairs: [
              { marathi: "हात", roman: "hāt", english: "Hand" },
              { marathi: "पाय", roman: "pāy", english: "Leg" },
              { marathi: "पोट", roman: "poṭ", english: "Stomach" },
            ],
          },
          {
            id: "u8-l2-e4",
            type: "choice",
            prompt: "Heart in Marathi is…",
            headword: { marathi: "हृदय", roman: "hṛday" },
            options: ["मन", "हृदय", "डोके"],
            answer: 1,
          },
          {
            id: "u8-l2-e5",
            type: "choice",
            prompt: "Someone says माझा हात दुखतो — what are they telling you?",
            headword: { marathi: "माझा हात दुखतो", roman: "mājhā hāt dukhto" },
            options: ["My leg hurts", "My head hurts", "My hand hurts"],
            answer: 2,
          },
        ],
      },
    ],
  },

  // ===================================================================
  {
    id: "u9",
    title: "Core Verbs",
    description: "Actions you use every day",
    color: "#ce82ff",
    lessons: [
      {
        id: "u9-l1",
        title: "Go, come, eat, drink",
        exercises: [
          {
            id: "u9-l1-e1",
            type: "choice",
            prompt: "To go in Marathi is…",
            headword: { marathi: "जाणे", roman: "jāṇe" },
            options: ["येणे", "जाणे", "खाणे"],
            answer: 1,
          },
          {
            id: "u9-l1-e2",
            type: "choice",
            prompt: "What does येणे mean?",
            headword: { marathi: "येणे", roman: "yeṇe" },
            options: ["To eat", "To come", "To drink"],
            answer: 1,
          },
          {
            id: "u9-l1-e3",
            type: "match",
            prompt: "Match the verbs",
            pairs: [
              { marathi: "जाणे", roman: "jāṇe", english: "To go" },
              { marathi: "खाणे", roman: "khāṇe", english: "To eat" },
              { marathi: "पिणे", roman: "piṇe", english: "To drink" },
            ],
          },
          {
            id: "u9-l1-e4",
            type: "choice",
            prompt: "मी जातो means…",
            headword: { marathi: "मी जातो", roman: "mī jāto" },
            options: ["I come", "I go", "I eat"],
            answer: 1,
          },
          {
            id: "u9-l1-e5",
            type: "choice",
            prompt: "Someone calls while you're eating. How do you tell them I'm eating right now?",
            options: ["मी येतो", "मी झोपतो", "मी खातो"],
            answer: 2,
          },
        ],
      },
      {
        id: "u9-l2",
        title: "See, hear, speak, write",
        exercises: [
          {
            id: "u9-l2-e1",
            type: "choice",
            prompt: "To speak / say in Marathi is…",
            headword: { marathi: "बोलणे", roman: "bolaṇe" },
            options: ["ऐकणे", "बोलणे", "पाहणे"],
            answer: 1,
          },
          {
            id: "u9-l2-e2",
            type: "choice",
            prompt: "What does पाहणे mean?",
            headword: { marathi: "पाहणे", roman: "pāhaṇe" },
            options: ["To hear", "To write", "To see / look"],
            answer: 2,
          },
          {
            id: "u9-l2-e3",
            type: "match",
            prompt: "Match the verbs",
            pairs: [
              { marathi: "बोलणे", roman: "bolaṇe", english: "To speak" },
              { marathi: "ऐकणे", roman: "aikaṇe", english: "To hear" },
              { marathi: "लिहिणे", roman: "lihiṇe", english: "To write" },
            ],
          },
          {
            id: "u9-l2-e4",
            type: "choice",
            prompt: "मी मराठी बोलतो means…",
            headword: { marathi: "मी मराठी बोलतो", roman: "mī marāṭhī bolato" },
            options: ["I learn Marathi", "I speak Marathi", "I write Marathi"],
            answer: 1,
          },
          {
            id: "u9-l2-e5",
            type: "choice",
            prompt: "Someone explains something and asks if you got it. How do you say I understand?",
            options: ["मला माहीत नाही", "मला समजते", "मी बोलत नाही"],
            answer: 1,
          },
        ],
      },
    ],
  },

  // ===================================================================
  {
    id: "u10",
    title: "Simple Sentences",
    description: "Build your first sentences",
    color: "#58cc02",
    lessons: [
      {
        id: "u10-l1",
        title: "Describing things",
        exercises: [
          {
            id: "u10-l1-e1",
            type: "choice",
            prompt: "The apple is red in Marathi is…",
            options: ["सफरचंद लाल आहे", "सफरचंद निळे आहे", "सफरचंद मोठे आहे"],
            answer: 0,
          },
          {
            id: "u10-l1-e2",
            type: "choice",
            prompt: "What does हे घर मोठे आहे mean?",
            headword: { marathi: "हे घर मोठे आहे", roman: "he ghar moṭhe āhe" },
            options: ["This house is small", "This house is big", "This house is old"],
            answer: 1,
          },
          {
            id: "u10-l1-e3",
            type: "choice",
            prompt: "Small in Marathi is…",
            headword: { marathi: "लहान", roman: "lahān" },
            options: ["मोठे", "लहान", "चांगले"],
            answer: 1,
          },
          {
            id: "u10-l1-e4",
            type: "match",
            prompt: "Match the adjectives",
            pairs: [
              { marathi: "मोठे", roman: "moṭhe", english: "Big" },
              { marathi: "लहान", roman: "lahān", english: "Small" },
              { marathi: "चांगले", roman: "cāṅgle", english: "Good" },
            ],
          },
          {
            id: "u10-l1-e5",
            type: "choice",
            prompt: "You taste food and love it. How do you compliment it in Marathi?",
            options: ["हे वाईट आहे", "हे चांगले आहे", "हे लहान आहे"],
            answer: 1,
          },
        ],
      },
      {
        id: "u10-l2",
        title: "Asking questions",
        exercises: [
          {
            id: "u10-l2-e1",
            type: "choice",
            prompt: "Where in Marathi is…",
            headword: { marathi: "कुठे", roman: "kuṭhe" },
            options: ["काय", "कुठे", "केव्हा"],
            answer: 1,
          },
          {
            id: "u10-l2-e2",
            type: "choice",
            prompt: "What does का mean?",
            headword: { marathi: "का", roman: "kā" },
            options: ["When", "Why", "Who"],
            answer: 1,
          },
          {
            id: "u10-l2-e3",
            type: "match",
            prompt: "Match the question words",
            pairs: [
              { marathi: "काय", roman: "kāy", english: "What" },
              { marathi: "कोण", roman: "koṇ", english: "Who" },
              { marathi: "केव्हा", roman: "kevhā", english: "When" },
            ],
          },
          {
            id: "u10-l2-e4",
            type: "choice",
            prompt: "तू कुठे जातोस? means…",
            headword: { marathi: "तू कुठे जातोस?", roman: "tū kuṭhe jātos?" },
            options: ["When do you go?", "Where are you going?", "Why do you go?"],
            answer: 1,
          },
          {
            id: "u10-l2-e5",
            type: "choice",
            prompt: "You see an unfamiliar dish on the table. How do you ask what it is?",
            options: ["हे कुठे आहे?", "हे कोण आहे?", "हे काय आहे?"],
            answer: 2,
          },
        ],
      },
    ],
  },

  // ===================================================================
  {
    id: "u11",
    title: "Market & Shopping",
    description: "Buy things and bargain",
    color: "#ff9600",
    lessons: [
      {
        id: "u11-l1",
        title: "Prices & money",
        exercises: [
          {
            id: "u11-l1-e1",
            type: "choice",
            prompt: "How much does it cost? in Marathi is…",
            options: ["हे किती आहे?", "हे कुठे आहे?", "हे काय आहे?"],
            answer: 0,
          },
          {
            id: "u11-l1-e2",
            type: "choice",
            prompt: "What does महाग mean?",
            headword: { marathi: "महाग", roman: "mahāg" },
            options: ["Cheap", "Expensive", "Free"],
            answer: 1,
          },
          {
            id: "u11-l1-e3",
            type: "match",
            prompt: "Match the market words",
            pairs: [
              { marathi: "महाग", roman: "mahāg", english: "Expensive" },
              { marathi: "स्वस्त", roman: "svast", english: "Cheap" },
              { marathi: "पैसे", roman: "paise", english: "Money" },
            ],
          },
          {
            id: "u11-l1-e4",
            type: "choice",
            prompt: "I want this in Marathi is…",
            options: ["मला हे नको", "मला हे हवे आहे", "मी हे विकतो"],
            answer: 1,
          },
          {
            id: "u11-l1-e5",
            type: "choice",
            prompt: "You're thirsty at a shop. How do you ask for water?",
            options: ["मला चहा हवे आहे", "मला पाणी हवे आहे", "मला दूध हवे आहे"],
            answer: 1,
          },
        ],
      },
      {
        id: "u11-l2",
        title: "Vegetables & fruit",
        exercises: [
          {
            id: "u11-l2-e1",
            type: "choice",
            prompt: "Vegetable in Marathi is…",
            headword: { marathi: "भाजी", roman: "bhājī" },
            options: ["फळ", "भाजी", "धान्य"],
            answer: 1,
          },
          {
            id: "u11-l2-e2",
            type: "choice",
            prompt: "What does आंबा mean?",
            headword: { marathi: "आंबा", roman: "āmbā" },
            options: ["Banana", "Mango", "Apple"],
            answer: 1,
          },
          {
            id: "u11-l2-e3",
            type: "match",
            prompt: "Match the produce",
            pairs: [
              { marathi: "आंबा", roman: "āmbā", english: "Mango" },
              { marathi: "केळ", roman: "keḷ", english: "Banana" },
              { marathi: "टोमॅटो", roman: "ṭomāṭo", english: "Tomato" },
            ],
          },
          {
            id: "u11-l2-e4",
            type: "choice",
            prompt: "Rice in Marathi is…",
            headword: { marathi: "भात", roman: "bhāt" },
            options: ["पोळी", "भात", "वरण"],
            answer: 1,
          },
          {
            id: "u11-l2-e5",
            type: "choice",
            prompt: "At the market you want to buy a mango. What do you say to the vendor?",
            options: ["मला केळ द्या", "मला आंबा द्या", "मला टोमॅटो द्या"],
            answer: 1,
          },
        ],
      },
    ],
  },

  // ===================================================================
  {
    id: "u12",
    title: "Travel & Places",
    description: "Get around the city",
    color: "#1cb0f6",
    lessons: [
      {
        id: "u12-l1",
        title: "Places in town",
        exercises: [
          {
            id: "u12-l1-e1",
            type: "choice",
            prompt: "Station / stop in Marathi is…",
            headword: { marathi: "स्थानक", roman: "sthānak" },
            options: ["रस्ता", "स्थानक", "दुकान"],
            answer: 1,
          },
          {
            id: "u12-l1-e2",
            type: "choice",
            prompt: "What does रुग्णालय mean?",
            headword: { marathi: "रुग्णालय", roman: "rugṇālay" },
            options: ["School", "Hospital", "Market"],
            answer: 1,
          },
          {
            id: "u12-l1-e3",
            type: "match",
            prompt: "Match the places",
            pairs: [
              { marathi: "दुकान", roman: "dukān", english: "Shop" },
              { marathi: "बाजार", roman: "bājār", english: "Market" },
              { marathi: "मंदिर", roman: "mandir", english: "Temple" },
            ],
          },
          {
            id: "u12-l1-e4",
            type: "choice",
            prompt: "Road / street in Marathi is…",
            headword: { marathi: "रस्ता", roman: "rastā" },
            options: ["गाव", "रस्ता", "शहर"],
            answer: 1,
          },
          {
            id: "u12-l1-e5",
            type: "choice",
            prompt: "What does शहर mean?",
            headword: { marathi: "शहर", roman: "śahar" },
            options: ["Village", "City", "Country"],
            answer: 1,
          },
        ],
      },
      {
        id: "u12-l2",
        title: "Asking directions",
        exercises: [
          {
            id: "u12-l2-e1",
            type: "choice",
            prompt: "Left in Marathi is…",
            headword: { marathi: "डावीकडे", roman: "ḍāvīkaḍe" },
            options: ["उजवीकडे", "डावीकडे", "सरळ"],
            answer: 1,
          },
          {
            id: "u12-l2-e2",
            type: "choice",
            prompt: "What does सरळ जा mean?",
            headword: { marathi: "सरळ जा", roman: "saraḷ jā" },
            options: ["Turn left", "Turn right", "Go straight"],
            answer: 2,
          },
          {
            id: "u12-l2-e3",
            type: "match",
            prompt: "Match the directions",
            pairs: [
              { marathi: "डावीकडे", roman: "ḍāvīkaḍe", english: "Left" },
              { marathi: "उजवीकडे", roman: "ujavīkaḍe", english: "Right" },
              { marathi: "मागे", roman: "māge", english: "Behind / back" },
            ],
          },
          {
            id: "u12-l2-e4",
            type: "choice",
            prompt: "Near / close in Marathi is…",
            headword: { marathi: "जवळ", roman: "javaḷ" },
            options: ["दूर", "जवळ", "वर"],
            answer: 1,
          },
          {
            id: "u12-l2-e5",
            type: "choice",
            prompt: "Someone tells you स्थानक जवळ आहे — what are they saying?",
            headword: { marathi: "स्थानक जवळ आहे", roman: "sthānak javaḷ āhe" },
            options: ["The market is far", "The station is near", "The road is straight"],
            answer: 1,
          },
        ],
      },
    ],
  },

  // ===================================================================
  {
    id: "u13",
    title: "Advanced Conversation",
    description: "Speak naturally in Marathi",
    color: "#ce82ff",
    lessons: [
      {
        id: "u13-l1",
        title: "Opinions & feelings",
        exercises: [
          {
            id: "u13-l1-e1",
            type: "choice",
            prompt: "I like it in Marathi is…",
            options: ["मला आवडते", "मला नको आहे", "मला माहीत नाही"],
            answer: 0,
          },
          {
            id: "u13-l1-e2",
            type: "choice",
            prompt: "What does मला माहीत नाही mean?",
            headword: { marathi: "मला माहीत नाही", roman: "malā māhīt nāhī" },
            options: ["I don't want it", "I don't know", "I don't understand"],
            answer: 1,
          },
          {
            id: "u13-l1-e3",
            type: "match",
            prompt: "Match the phrases",
            pairs: [
              { marathi: "मला आवडते", roman: "malā āvaḍte", english: "I like it" },
              { marathi: "मला नको", roman: "malā nako", english: "I don't want it" },
              { marathi: "खूप छान", roman: "khūp chān", english: "Very nice" },
            ],
          },
          {
            id: "u13-l1-e4",
            type: "choice",
            prompt: "I am happy in Marathi is…",
            options: ["मी दुःखी आहे", "मी आनंदी आहे", "मी थकलो आहे"],
            answer: 1,
          },
          {
            id: "u13-l1-e5",
            type: "choice",
            prompt: "After a long day you want to tell your friend you're very tired. What do you say?",
            options: ["मी खूप आनंदी आहे", "मी खूप भुकेलो आहे", "मी खूप थकलो आहे"],
            answer: 2,
          },
        ],
      },
      {
        id: "u13-l2",
        title: "Polite & formal speech",
        exercises: [
          {
            id: "u13-l2-e1",
            type: "choice",
            prompt: "The formal you in Marathi is…",
            headword: { marathi: "आपण", roman: "āpaṇ" },
            options: ["तू", "तुम्ही", "आपण"],
            answer: 2,
          },
          {
            id: "u13-l2-e2",
            type: "choice",
            prompt: "What does कृपया थांबा mean?",
            headword: { marathi: "कृपया थांबा", roman: "kṛpayā thāmbā" },
            options: ["Please sit down", "Please stop / wait", "Please come in"],
            answer: 1,
          },
          {
            id: "u13-l2-e3",
            type: "match",
            prompt: "Match the polite phrases",
            pairs: [
              { marathi: "कृपया", roman: "kṛpayā", english: "Please" },
              { marathi: "माफ करा", roman: "māf karā", english: "Excuse me / Sorry" },
              { marathi: "आभारी आहे", roman: "ābhārī āhe", english: "I am grateful" },
            ],
          },
          {
            id: "u13-l2-e4",
            type: "choice",
            prompt: "May I sit? in Marathi is…",
            options: ["मी बसू का?", "मी जाऊ का?", "मी येऊ का?"],
            answer: 0,
          },
          {
            id: "u13-l2-e5",
            type: "choice",
            prompt: "A guest arrives at your door. How do you politely invite them inside?",
            options: ["कृपया थांबा", "कृपया आत या", "कृपया जा"],
            answer: 1,
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
