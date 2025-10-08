const mongoose = require('mongoose');
const { Stream } = require('../models/stream');
const { Subject } = require('../models/Subject');
const { Topic } = require('../models/Topic');
const { Question } = require('../models/Question');

require('dotenv').config();


const seedData = {
  streams: [
    {
      name: 'JEE',
      description: 'Joint Entrance Examination for Engineering',
      subjects: [
        {
          name: 'Physics',
          topics: [
            'Mechanics', 'Thermodynamics', 'Waves and Optics', 
            'Electricity and Magnetism', 'Modern Physics'
          ]
        },
        {
          name: 'Chemistry',
          topics: [
            'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry',
            'Chemical Bonding', 'Thermodynamics'
          ]
        },
        {
          name: 'Mathematics',
          topics: [
            'Algebra', 'Calculus', 'Coordinate Geometry', 
            'Trigonometry', 'Statistics and Probability'
          ]
        }
      ]
    },
    {
      name: 'CAT',
      description: 'Common Admission Test for MBA',
      subjects: [
        {
          name: 'Quantitative Ability',
          topics: [
            'Arithmetic', 'Algebra', 'Geometry', 'Number System', 
            'Percentage and Profit Loss'
          ]
        },
        {
          name: 'Verbal Ability',
          topics: [
            'Reading Comprehension', 'Grammar', 'Vocabulary', 
            'Sentence Correction', 'Para Jumbles'
          ]
        },
        {
          name: 'Data Interpretation & Logical Reasoning',
          topics: [
            'Data Interpretation', 'Logical Reasoning', 'Analytical Reasoning',
            'Puzzles', 'Games and Tournaments'
          ]
        }
      ]
    },
    {
      name: 'NEET',
      description: 'National Eligibility cum Entrance Test for Medical',
      subjects: [
        {
          name: 'Physics',
          topics: [
            'Mechanics', 'Thermodynamics', 'Optics', 
            'Electricity', 'Modern Physics'
          ]
        },
        {
          name: 'Chemistry',
          topics: [
            'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry',
            'Biomolecules', 'Environmental Chemistry'
          ]
        },
        {
          name: 'Biology',
          topics: [
            'Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 
            'Plant Biology', 'Evolution'
          ]
        }
      ]
    },
    {
      name: 'GATE',
      description: 'Graduate Aptitude Test in Engineering',
      subjects: [
        {
          name: 'Engineering Mathematics',
          topics: [
            'Linear Algebra', 'Calculus', 'Differential Equations',
            'Probability and Statistics', 'Numerical Methods'
          ]
        },
        {
          name: 'General Aptitude',
          topics: [
            'Verbal Ability', 'Numerical Ability', 'Logical Reasoning',
            'Data Interpretation', 'English Grammar'
          ]
        },
        {
          name: 'Computer Science',
          topics: [
            'Programming', 'Data Structures', 'Algorithms', 
            'Computer Networks', 'Database Management'
          ]
        }
      ]
    },
    {
      name: 'UPSC',
      description: 'Union Public Service Commission Civil Services',
      subjects: [
        {
          name: 'General Studies Paper I',
          topics: [
            'History of India', 'Geography', 'Indian Polity', 
            'Economic and Social Development', 'Environmental Ecology'
          ]
        },
        {
          name: 'General Studies Paper II',
          topics: [
            'Governance', 'Constitution', 'Social Justice', 
            'International Relations', 'Internal Security'
          ]
        },
        {
          name: 'Current Affairs',
          topics: [
            'National Events', 'International Events', 'Economic Developments',
            'Science and Technology', 'Government Schemes'
          ]
        }
      ]
    },
    {
      name: 'Capgemini Pseudo Code',
      description: 'Capgemini pseudo-coding assessment resources',
      resourceType: 'pdf',
      resourceTitle: 'Capgemini Pseudo Questions',
      resourceUrl: '/resources/capgemini-pseudo.pdf',
      resourceDescription: 'Download the Capgemini pseudo coding questions PDF.',
      subjects: []
    }
  ]
};

const createSampleQuestions = async (streamId, subjectId, topicId, topicName, streamName, subjectName) => {
  // Sample questions based on stream and subject
  const questionTemplates = {
    'JEE': {
      'Physics': {
        'Mechanics': [
          {
            questionText: "A ball is thrown vertically upward with an initial velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
            options: [
              { text: "10 m", isCorrect: false },
              { text: "20 m", isCorrect: true },
              { text: "30 m", isCorrect: false },
              { text: "40 m", isCorrect: false }
            ],
            explanation: "Using v² = u² - 2gh, at maximum height v = 0, so h = u²/2g = 400/20 = 20 m",
            difficulty: "Medium"
          },
          {
            questionText: "A body of mass 2 kg moves with acceleration 5 m/s². What is the net force acting on it?",
            options: [
              { text: "10 N", isCorrect: true },
              { text: "5 N", isCorrect: false },
              { text: "2 N", isCorrect: false },
              { text: "7 N", isCorrect: false }
            ],
            explanation: "Using Newton's second law: F = ma = 2 × 5 = 10 N",
            difficulty: "Easy"
          }
        ],
        'Thermodynamics': [
          {
            questionText: "In an ideal gas, if temperature is doubled while keeping volume constant, what happens to pressure?",
            options: [
              { text: "Halved", isCorrect: false },
              { text: "Doubled", isCorrect: true },
              { text: "Remains same", isCorrect: false },
              { text: "Becomes four times", isCorrect: false }
            ],
            explanation: "From Gay-Lussac's law: P/T = constant, so if T doubles, P also doubles",
            difficulty: "Medium"
          }
        ]
      },
      'Mathematics': {
        'Algebra': [
          {
            questionText: "Solve for x: 2x + 5 = 13",
            options: [
              { text: "x = 4", isCorrect: true },
              { text: "x = 3", isCorrect: false },
              { text: "x = 5", isCorrect: false },
              { text: "x = 6", isCorrect: false }
            ],
            explanation: "2x = 13 - 5 = 8, so x = 4",
            difficulty: "Easy"
          },
          {
            questionText: "If log₂(x) = 3, then x equals:",
            options: [
              { text: "6", isCorrect: false },
              { text: "8", isCorrect: true },
              { text: "9", isCorrect: false },
              { text: "12", isCorrect: false }
            ],
            explanation: "log₂(x) = 3 means 2³ = x, so x = 8",
            difficulty: "Medium"
          }
        ],
        'Calculus': [
          {
            questionText: "Find the derivative of f(x) = x² + 3x + 2",
            options: [
              { text: "2x + 3", isCorrect: true },
              { text: "x² + 3", isCorrect: false },
              { text: "2x + 2", isCorrect: false },
              { text: "3x + 2", isCorrect: false }
            ],
            explanation: "d/dx(x²) = 2x, d/dx(3x) = 3, d/dx(2) = 0, so f'(x) = 2x + 3",
            difficulty: "Medium"
          }
        ]
      }
    },
    'CAT': {
      'Quantitative Ability': {
        'Arithmetic': [
          {
            questionText: "If 30% of a number is 45, what is 70% of the same number?",
            options: [
              { text: "105", isCorrect: true },
              { text: "95", isCorrect: false },
              { text: "115", isCorrect: false },
              { text: "125", isCorrect: false }
            ],
            explanation: "If 30% = 45, then 100% = 150, so 70% = 105",
            difficulty: "Medium"
          }
        ],
        'Percentage and Profit Loss': [
          {
            questionText: "A shopkeeper sells an item at 20% profit. If the cost price is ₹100, what is the selling price?",
            options: [
              { text: "₹110", isCorrect: false },
              { text: "₹120", isCorrect: true },
              { text: "₹125", isCorrect: false },
              { text: "₹130", isCorrect: false }
            ],
            explanation: "Selling price = Cost price + 20% profit = 100 + 20 = ₹120",
            difficulty: "Easy"
          }
        ]
      }
    }
  };

  // Default questions for topics not covered above
  const defaultQuestions = [
    {
      questionText: `This is a sample question for ${topicName} in ${subjectName}. What is the correct answer?`,
      options: [
        { text: "Option A", isCorrect: false },
        { text: "Option B", isCorrect: true },
        { text: "Option C", isCorrect: false },
        { text: "Option D", isCorrect: false }
      ],
      explanation: "This is a sample explanation for the question.",
      difficulty: "Medium"
    },
    {
      questionText: `Another sample question for ${topicName}. Choose the best answer:`,
      options: [
        { text: "Choice 1", isCorrect: true },
        { text: "Choice 2", isCorrect: false },
        { text: "Choice 3", isCorrect: false },
        { text: "Choice 4", isCorrect: false }
      ],
      explanation: "This explains why Choice 1 is correct.",
      difficulty: "Easy"
    },
    {
      questionText: `Hard level question for ${topicName}. What would be the most appropriate answer?`,
      options: [
        { text: "Complex A", isCorrect: false },
        { text: "Complex B", isCorrect: false },
        { text: "Complex C", isCorrect: true },
        { text: "Complex D", isCorrect: false }
      ],
      explanation: "This is a detailed explanation for the hard question.",
      difficulty: "Hard"
    }
  ];

  // Get questions for this specific topic or use defaults
  let questions = defaultQuestions;
  if (questionTemplates[streamName] && 
      questionTemplates[streamName][subjectName] && 
      questionTemplates[streamName][subjectName][topicName]) {
    questions = questionTemplates[streamName][subjectName][topicName];
  }

  // Create questions in database
  for (const questionData of questions) {
    try {
      const question = new Question({
        questionText: questionData.questionText,
        options: questionData.options,
        explanation: questionData.explanation,
        difficulty: questionData.difficulty,
        stream: streamId,
        subject: subjectId,
        topic: topicId,
        isActive: true
      });
      await question.save();
      console.log(`      ❓ Created question: ${questionData.difficulty} - ${questionData.questionText.substring(0, 50)}...`);
    } catch (error) {
      console.error(`      ❌ Error creating question: ${error.message}`);
    }
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGOURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Stream.deleteMany({});
    await Subject.deleteMany({});
    await Topic.deleteMany({});
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed streams, subjects, and topics
    for (const streamData of seedData.streams) {
      // Create stream
      const stream = new Stream({
        name: streamData.name,
        description: streamData.description,
        ...(streamData.resourceType ? { resourceType: streamData.resourceType } : {}),
        ...(streamData.resourceTitle ? { resourceTitle: streamData.resourceTitle } : {}),
        ...(streamData.resourceUrl ? { resourceUrl: streamData.resourceUrl } : {}),
        ...(streamData.resourceDescription ? { resourceDescription: streamData.resourceDescription } : {}),
        ...(typeof streamData.isActive === 'boolean' ? { isActive: streamData.isActive } : {})
      });
      await stream.save();
      console.log(`📚 Created stream: ${stream.name}`);

      // Create subjects for this stream
      for (const subjectData of streamData.subjects) {
        const subject = new Subject({
          name: subjectData.name,
          stream: stream._id
        });
        await subject.save();
        console.log(`  📖 Created subject: ${subject.name}`);

        // Create topics for this subject
        for (const topicName of subjectData.topics) {
          const topic = new Topic({
            name: topicName,
            subject: subject._id,
            stream: stream._id
          });
          await topic.save();
          console.log(`    📝 Created topic: ${topic.name}`);

          // Create sample questions for each topic
          await createSampleQuestions(stream._id, subject._id, topic._id, topicName, stream.name, subject.name);
        }
      }
    }

    // Count total questions created
    const totalQuestions = await Question.countDocuments();

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created:
    - ${seedData.streams.length} streams
    - ${seedData.streams.reduce((acc, s) => acc + s.subjects.length, 0)} subjects  
    - ${seedData.streams.reduce((acc, s) => acc + s.subjects.reduce((acc2, subj) => acc2 + subj.topics.length, 0), 0)} topics
    - ${totalQuestions} questions`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
