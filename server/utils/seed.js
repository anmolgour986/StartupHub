require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Startup = require('../models/Startup');
const Application = require('../models/Application');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const Milestone = require('../models/Milestone');
const Message = require('../models/Message');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Startup.deleteMany({}),
      Application.deleteMany({}),
      Task.deleteMany({}),
      Notification.deleteMany({}),
      Milestone.deleteMany({}),
      Message.deleteMany({}),
    ]);

    console.log('Creating users...');
    const commonPassword = 'Password123!';

    const admin = await User.create({
      name: 'Ava Admin',
      username: 'admin',
      email: 'admin@startuphub.dev',
      password: commonPassword,
      role: 'admin',
      bio: 'Platform administrator keeping StartupHub running smoothly.',
    });

    const founder1 = await User.create({
      name: 'Maya Chen',
      username: 'mayachen',
      email: 'maya@startuphub.dev',
      password: commonPassword,
      role: 'founder',
      bio: 'Serial founder obsessed with productivity tools.',
      skills: ['Product Strategy', 'Fundraising', 'Growth'],
      location: 'San Francisco, CA',
      github: 'https://github.com/mayachen',
      linkedin: 'https://linkedin.com/in/mayachen',
    });

    const founder2 = await User.create({
      name: 'Daniel Osei',
      username: 'danielosei',
      email: 'daniel@startuphub.dev',
      password: commonPassword,
      role: 'founder',
      bio: 'Building the future of fintech in Africa.',
      skills: ['Fintech', 'Business Development'],
      location: 'Lagos, Nigeria',
    });

    const dev1 = await User.create({
      name: 'Liam Torres',
      username: 'liamtorres',
      email: 'liam@startuphub.dev',
      password: commonPassword,
      role: 'developer',
      bio: 'Full-stack engineer who loves React and Node.',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      location: 'Austin, TX',
      github: 'https://github.com/liamtorres',
    });

    const dev2 = await User.create({
      name: 'Priya Nair',
      username: 'priyanair',
      email: 'priya@startuphub.dev',
      password: commonPassword,
      role: 'developer',
      bio: 'Backend engineer, distributed systems enthusiast.',
      skills: ['Python', 'Go', 'Kubernetes', 'PostgreSQL'],
      location: 'Bangalore, India',
    });

    const designer1 = await User.create({
      name: 'Sofia Rossi',
      username: 'sofiarossi',
      email: 'sofia@startuphub.dev',
      password: commonPassword,
      role: 'designer',
      bio: 'Product designer crafting delightful interfaces.',
      skills: ['UI/UX', 'Figma', 'Design Systems'],
      location: 'Milan, Italy',
      portfolio: 'https://sofiarossi.design',
    });

    const designer2 = await User.create({
      name: 'Kenji Watanabe',
      username: 'kenjiw',
      email: 'kenji@startuphub.dev',
      password: commonPassword,
      role: 'designer',
      bio: 'Brand and motion designer.',
      skills: ['Branding', 'Motion Design', 'Illustration'],
      location: 'Tokyo, Japan',
    });

    const dev3 = await User.create({
      name: 'Noah Williams',
      username: 'noahw',
      email: 'noah@startuphub.dev',
      password: commonPassword,
      role: 'developer',
      bio: 'Mobile engineer, React Native specialist.',
      skills: ['React Native', 'Swift', 'Firebase'],
      location: 'London, UK',
    });

    console.log('Creating startups...');
    const startup1 = await Startup.create({
      name: 'FlowBoard',
      tagline: 'Project management that adapts to how your team actually works',
      description:
        'FlowBoard is a flexible project management tool combining kanban, docs, and automation in one workspace. We are looking for engineers and designers to help us reimagine how small teams plan and ship work.',
      category: 'SaaS',
      requiredSkills: ['React', 'Node.js', 'UI/UX'],
      teamSize: 5,
      tags: ['productivity', 'b2b', 'collaboration'],
      location: 'San Francisco, CA',
      isRemote: true,
      status: 'building',
      founder: founder1._id,
      team: [{ user: founder1._id, roleTitle: 'Founder & CEO' }],
      views: 128,
    });

    const startup2 = await Startup.create({
      name: 'PayBridge',
      tagline: 'Cross-border payments for African freelancers, made instant',
      description:
        'PayBridge lets freelancers and small businesses across Africa receive international payments instantly with transparent fees. We are assembling a founding engineering team.',
      category: 'Fintech',
      requiredSkills: ['Node.js', 'PostgreSQL', 'Security'],
      teamSize: 6,
      tags: ['fintech', 'payments', 'africa'],
      location: 'Lagos, Nigeria',
      isRemote: true,
      status: 'idea',
      founder: founder2._id,
      team: [{ user: founder2._id, roleTitle: 'Founder & CEO' }],
      views: 76,
    });

    const startup3 = await Startup.create({
      name: 'Lumen Health',
      tagline: 'AI-powered symptom triage for rural clinics',
      description:
        'Lumen Health builds lightweight AI diagnostic assistants for clinics with limited specialist access. Looking for an ML engineer and mobile developer to join early.',
      category: 'Healthtech',
      requiredSkills: ['Python', 'React Native', 'Machine Learning'],
      teamSize: 4,
      tags: ['healthtech', 'ai', 'social impact'],
      location: 'Remote',
      isRemote: true,
      status: 'launched',
      founder: founder1._id,
      team: [{ user: founder1._id, roleTitle: 'Co-founder' }],
      views: 240,
    });

    console.log('Adding team members and creating applications...');
    // Liam and Sofia are already accepted team members on FlowBoard
    startup1.team.push(
      { user: dev1._id, roleTitle: 'Full-stack Engineer' },
      { user: designer1._id, roleTitle: 'Product Designer' }
    );
    await startup1.save();

    // Pending + rejected applications for realism
    await Application.create({
      startup: startup1._id,
      applicant: dev2._id,
      message: 'I would love to help build FlowBoard\'s automation engine — I have shipped similar workflow tools before.',
      skills: ['Python', 'Go', 'Kubernetes'],
      experience: '6 years backend engineering, 2 at a Series B startup.',
      status: 'pending',
    });

    await Application.create({
      startup: startup1._id,
      applicant: designer2._id,
      message: 'Excited about FlowBoard\'s vision — I can help with the brand refresh and motion design.',
      skills: ['Branding', 'Motion Design'],
      experience: '4 years as a brand designer for early-stage startups.',
      status: 'rejected',
    });

    await Application.create({
      startup: startup2._id,
      applicant: dev1._id,
      message: 'PayBridge\'s mission resonates with me — I want to help build the payments infrastructure.',
      skills: ['Node.js', 'PostgreSQL'],
      experience: '5 years full-stack, including fintech integrations.',
      status: 'pending',
    });

    await Application.create({
      startup: startup3._id,
      applicant: dev3._id,
      message: 'I have built two React Native health apps and would love to bring that experience to Lumen Health.',
      skills: ['React Native', 'Firebase'],
      experience: '4 years mobile engineering.',
      status: 'accepted',
    });
    startup3.team.push({ user: dev3._id, roleTitle: 'Mobile Engineer' });
    await startup3.save();

    console.log('Creating tasks...');
    await Task.create([
      {
        startup: startup1._id,
        title: 'Design onboarding flow',
        description: 'Create wireframes and high-fidelity mockups for the new user onboarding experience.',
        status: 'in-progress',
        priority: 'high',
        assignee: designer1._id,
        createdBy: founder1._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        order: 0,
      },
      {
        startup: startup1._id,
        title: 'Build kanban drag & drop',
        description: 'Implement drag-and-drop task reordering across columns using react-beautiful-dnd or dnd-kit.',
        status: 'todo',
        priority: 'high',
        assignee: dev1._id,
        createdBy: founder1._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        order: 0,
      },
      {
        startup: startup1._id,
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment.',
        status: 'review',
        priority: 'medium',
        assignee: dev1._id,
        createdBy: founder1._id,
        order: 0,
      },
      {
        startup: startup1._id,
        title: 'Landing page copywriting',
        description: 'Draft hero, features, and CTA copy for the marketing site.',
        status: 'completed',
        priority: 'low',
        assignee: founder1._id,
        createdBy: founder1._id,
        order: 0,
      },
      {
        startup: startup3._id,
        title: 'Integrate triage model API',
        description: 'Connect the mobile app to the symptom triage ML endpoint.',
        status: 'in-progress',
        priority: 'urgent',
        assignee: dev3._id,
        createdBy: founder1._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        order: 0,
      },
    ]);

    console.log('Creating milestones...');
    await Milestone.create([
      {
        startup: startup1._id,
        title: 'Private beta launch',
        description: 'Ship a private beta to 20 pilot teams.',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'in-progress',
        createdBy: founder1._id,
      },
      {
        startup: startup1._id,
        title: 'MVP feature freeze',
        description: 'Lock scope for the initial MVP release.',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'completed',
        createdBy: founder1._id,
      },
      {
        startup: startup3._id,
        title: 'Clinical pilot with partner clinics',
        description: 'Run a 30-day pilot with 3 partner clinics.',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
        createdBy: founder1._id,
      },
    ]);

    console.log('Creating sample notifications...');
    await Notification.create([
      {
        recipient: founder1._id,
        sender: dev2._id,
        type: 'application_received',
        message: `${dev2.name} applied to join FlowBoard`,
        link: `/startups/${startup1._id}/applications`,
        relatedStartup: startup1._id,
      },
      {
        recipient: dev1._id,
        sender: founder1._id,
        type: 'task_assigned',
        message: 'You were assigned a new task: "Build kanban drag & drop"',
        link: `/startups/${startup1._id}/tasks`,
        relatedStartup: startup1._id,
      },
      {
        recipient: dev3._id,
        sender: founder1._id,
        type: 'application_accepted',
        message: 'Your application to Lumen Health was accepted! Welcome to the team.',
        link: `/startups/${startup3._id}`,
        relatedStartup: startup3._id,
      },
    ]);

    console.log('Creating sample chat messages...');
    await Message.create([
      {
        sender: founder1._id,
        recipient: dev1._id,
        content: 'Hey Liam! Excited to have you on the team 🎉',
        readBy: [founder1._id, dev1._id],
      },
      {
        sender: dev1._id,
        recipient: founder1._id,
        content: 'Thanks Maya! Looking forward to digging into the kanban board work.',
        readBy: [founder1._id, dev1._id],
      },
      {
        sender: founder1._id,
        startup: startup1._id,
        content: 'Welcome to the FlowBoard team channel! Let\'s ship something great.',
        readBy: [founder1._id],
      },
      {
        sender: dev1._id,
        startup: startup1._id,
        content: 'Pumped to get started — pulling up the onboarding designs now.',
        readBy: [dev1._id],
      },
    ]);

    console.log('\n✅ Seed complete!\n');
    console.log('Demo login credentials (all use the same password):');
    console.log(`  Password: ${commonPassword}\n`);
    console.log('  Admin:      admin@startuphub.dev');
    console.log('  Founder:    maya@startuphub.dev  (owns FlowBoard, Lumen Health)');
    console.log('  Founder:    daniel@startuphub.dev (owns PayBridge)');
    console.log('  Developer:  liam@startuphub.dev  (on FlowBoard team)');
    console.log('  Developer:  priya@startuphub.dev (pending application)');
    console.log('  Developer:  noah@startuphub.dev  (on Lumen Health team)');
    console.log('  Designer:   sofia@startuphub.dev (on FlowBoard team)');
    console.log('  Designer:   kenji@startuphub.dev (rejected application)\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
