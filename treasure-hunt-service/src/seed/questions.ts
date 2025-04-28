import QuestionRepository from "../repositories/questions/QuestionRepositories";

export const seedQuestionsIfEmpty = async (): Promise<void> => {
  try {
    const questionRepository = new QuestionRepository();
    const questionCount = await questionRepository.countDocuments();
    if (questionCount > 0) {
      console.log('Questions already seeded, skipping.');
      return;
    }
    const sampleQuestions = [
        {
          title: "Start of the Hunt",
          clue: "Type 'start' to begin your treasure hunt adventure!",
          hint: "Start the journey to find hidden knowledge.",
          trivia: "This marks the beginning of your epic quest.",
          answer: ["start"],
          type: "text",
          sequence: 0,
          isStart: true,
        },
        {
          title: "Soundless Bark",
          clue: "I'm full of leaves, but I’m not a tree. You can find me in schools but not in forests.",
          hint: "I'm filled with stories and wisdom.",
          trivia: "The oldest library was in Nineveh, 700 BC.",
          answer: ["library", "the library"],
          type: "text",
          sequence: 1,
          isStart: false,
        },
        {
          title: "Silent Timekeeper",
          clue: "I stand tall in London, known for my chime.",
          hint: "I'm not a watch, but I tell time.",
          trivia: "The bell is actually called Big Ben.",
          answer: ["big ben", "clock tower"],
          type: "text",
          sequence: 2,
          isStart: false,
        },
        {
          title: "Center of the City",
          clue: "In Delhi, all roads lead here. Surrounded by flags and buildings of power.",
          hint: "A ceremonial axis of the capital.",
          trivia: "India Gate and Rashtrapati Bhavan are nearby.",
          answer: ["india gate", "rajpath", "central delhi"],
          type: "text",
          sequence: 3,
          isStart: false,
        },
        {
          title: "Cold but Sweet",
          clue: "I’m cold and come in a cone, kids love me when the sun is shown.",
          hint: "Vanilla, chocolate, or strawberry?",
          trivia: "Marco Polo brought this treat from the East to Italy.",
          answer: ["ice cream", "icecream", "gelato"],
          type: "text",
          sequence: 4,
          isStart: false,
        },
        {
          title: "What Comes After Victory?",
          clue: "It comes after winning, sounds like a prize.",
          hint: "Used in games or rewards.",
          trivia: "It’s also used in software versioning.",
          answer: ["trophy", "reward", "badge"],
          type: "text",
          sequence: 5,
          isStart: false,
        },
      ];

    await questionRepository.insertMany(sampleQuestions);
    console.log('Questions seeded successfully.');
  } catch (error: any) {
    console.error('Error seeding questions:', error.message);
  }
};
