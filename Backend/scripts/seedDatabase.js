const mongoose = require('mongoose');
const { Stream } = require('../models/stream');
const { Subject } = require('../models/Subject');
const { Topic } = require('../models/Topic');
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
    }
  ]
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Stream.deleteMany({});
    await Subject.deleteMany({});
    await Topic.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed streams, subjects, and topics
    for (const streamData of seedData.streams) {
      // Create stream
      const stream = new Stream({
        name: streamData.name,
        description: streamData.description
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
        }
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created:
    - ${seedData.streams.length} streams
    - ${seedData.streams.reduce((acc, s) => acc + s.subjects.length, 0)} subjects  
    - ${seedData.streams.reduce((acc, s) => acc + s.subjects.reduce((acc2, subj) => acc2 + subj.topics.length, 0), 0)} topics`);

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