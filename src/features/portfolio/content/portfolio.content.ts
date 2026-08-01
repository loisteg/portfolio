import type { ContactLink, PortfolioContent } from '../portfolio.types';

const emailContact = {
  label: 'Email',
  value: 'oleksiikhudenko61@gmail.com',
  href: 'mailto:oleksiikhudenko61@gmail.com',
  opensInNewTab: false,
} satisfies ContactLink;

export const portfolioContent = {
  name: 'Oleksii Khudenko',
  initials: 'OK',
  primaryRole: 'Mobile Team Lead',
  secondaryRole: 'Senior React Native Engineer',
  introduction:
    'I lead mobile engineering and build reliable iOS and Android products — from architecture and technical direction to release and production.',
  profileTags: ['React Native', 'Mobile Architecture', 'CI/CD', 'Production Reliability'],
  about: [
    'I’m a Mobile Team Lead and Senior React Native Engineer with 4+ years of experience building, scaling, and operating production applications across B2B, fintech, and operational software.',
    'I work across the entire mobile lifecycle — architecture, technical planning, feature development, CI/CD, App Store and Google Play releases, monitoring, and production reliability.',
    'For the past 2+ years, I’ve also led mobile engineering initiatives, mentored developers, defined engineering standards, and helped cross-functional teams turn complex business requirements into maintainable products.',
  ],
  capabilities: [
    {
      title: 'Architecture & Technical Direction',
      description: 'Designing foundations that remain maintainable as products and teams grow.',
    },
    {
      title: 'Team Leadership',
      description: 'Mentoring engineers, coordinating delivery, and improving development standards.',
    },
    {
      title: 'Production Delivery',
      description: 'Owning CI/CD, multi-environment builds, store releases, and release readiness.',
    },
    {
      title: 'Reliability & Modernization',
      description: 'Improving stability, resolving production issues, and rebuilding legacy foundations.',
    },
  ],
  location: 'Open to remote opportunities',
  metrics: [
    { value: '4+', label: 'Years building production mobile applications' },
    { value: '5', label: 'Companies' },
    { value: '70K+', label: 'Users reached by products I’ve worked on' },
    { value: '99.5%+', label: 'Crash-free sessions' },
  ],
  metricsBadge: '2+ years leading mobile engineering initiatives',
  contacts: [
    emailContact,
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/loisteg',
      href: 'https://www.linkedin.com/in/loisteg',
      opensInNewTab: true,
    },
    {
      label: 'GitHub',
      value: 'github.com/loisteg',
      href: 'https://github.com/loisteg',
      opensInNewTab: true,
    },
  ],
  projects: [
    {
      id: 'splynx-field-service',
      name: 'Splynx Field Service',
      category: 'B2B operations',
      summary: 'A production mobile platform designed around complex operational and service workflows.',
      headline: 'Built for complex operations. Designed for long-term growth.',
      description: [
        'A production mobile application supporting operational and service workflows where reliability, maintainability, and consistent delivery are essential.',
        'As Mobile Team Lead, I owned the technical direction and end-to-end delivery — from architecture and planning to implementation, QA coordination, CI/CD, and App Store and Google Play releases.',
        'I also created a shared mobile core reused across multiple applications, reducing duplicated logic and establishing a consistent foundation for future development.',
      ],
      technologies: ['Architecture', 'Shared Core', 'CI/CD'],
      contribution: [
        'Mobile architecture and technical direction',
        'Shared core library used across applications',
        'CI/CD and multi-environment delivery',
        'UI and technical foundation modernization',
        'Engineering standards and code reviews',
        'Team mentoring and release coordination',
      ],
      outcomes: [
        {
          title: 'Shared foundation',
          description: 'Reusable logic across multiple mobile applications.',
        },
        {
          title: 'Reliable delivery',
          description: 'Repeatable development and production release workflows.',
        },
        {
          title: 'Modernized platform',
          description: 'A more maintainable foundation for future product growth.',
        },
      ],
      icon: {
        src: '/projects/field-service/icon.jpg',
        alt: 'Splynx Field Service app icon',
      },
      screens: [
        {
          src: '/projects/field-service/shot-1.jpg',
          alt: 'Splynx Field Service calendar view with scheduled tasks',
        },
        {
          src: '/projects/field-service/shot-2.jpg',
          alt: 'Splynx Field Service task management screen',
        },
        {
          src: '/projects/field-service/shot-3.jpg',
          alt: 'Splynx Field Service map and navigation screen',
        },
      ],
      storeLinks: {
        appStore: 'https://apps.apple.com/us/app/splynx-field-service/id6738053311',
        googlePlay: 'https://play.google.com/store/apps/details?id=com.splynx.scheduling2',
      },
    },
    {
      id: 'myisp',
      name: 'MyISP',
      category: 'Mobile product',
      summary: 'A reliable mobile experience built for frequent, business-critical user interactions.',
      headline: 'Reliable experiences for business-critical interactions.',
      description: [
        'A production React Native application built around complex workflows, frequent operations, and dependable client-server communication.',
        'My work focused on translating complicated product requirements into clear mobile experiences while maintaining responsive performance, predictable state management, robust error handling, and production stability.',
      ],
      technologies: ['React Native', 'Reliability', 'Scale'],
      contribution: [
        'Production React Native feature development',
        'Complex REST API integrations',
        'Transactional and role-based workflows',
        'Reliable client-server synchronization',
        'Error handling and state management',
        'Performance and stability improvements',
      ],
      outcomes: [
        {
          title: 'Complex workflows simplified',
          description: 'Business logic transformed into understandable mobile experiences.',
        },
        {
          title: 'Production reliability',
          description: 'Stable behavior across frequent and critical operations.',
        },
        {
          title: 'Maintainable implementation',
          description: 'Clear architecture and reusable engineering patterns.',
        },
      ],
      icon: {
        src: '/projects/myisp/icon.jpg',
        alt: 'MyISP app icon',
      },
      screens: [
        {
          src: '/projects/myisp/shot-1.png',
          alt: 'MyISP dashboard with account balance and quick actions',
        },
        {
          src: '/projects/myisp/shot-2.png',
          alt: 'MyISP finance screen with invoices and payment statuses',
        },
        {
          src: '/projects/myisp/shot-3.png',
          alt: 'MyISP services screen with internet plans',
        },
      ],
      storeLinks: {
        appStore: 'https://apps.apple.com/ua/app/myisp-portal/id1462886761',
        googlePlay: 'https://play.google.com/store/apps/details?id=com.splynx.portal',
      },
    },
  ],
  navigation: [
    { label: 'Profile', href: '#profile' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ],
  sections: {
    profile: {
      eyebrow: 'Mobile engineering · React Native',
      firstName: 'Oleksii',
      lastName: 'Khudenko',
      aboutAction: 'A bit about me',
    },
    about: {
      eyebrow: 'About me',
      heading: 'I build mobile systems, not just screens.',
      capabilitiesLabel: 'Core capabilities',
    },
    projects: {
      heading: 'Projects',
    },
    contact: {
      eyebrow: 'Contact',
      heading: 'Let’s build something people can rely on.',
      paragraphs: [
        'Have a mobile product to scale, an architecture to improve, or a development team to grow? Let’s talk.',
        'I’m open to Mobile Team Lead and senior-level React Native opportunities, as well as collaborations on ambitious mobile products.',
      ],
    },
  },
  phone: {
    statusTime: '9:41',
    statusSignal: '● ●',
    portrait: {
      src: '/profile/portrait.jpg',
      alt: 'Portrait of Oleksii Khudenko',
    },
    profileIntro:
      'I love building products that users genuinely enjoy — it pushes me to make them better, more stable, and more pleasant to use. I never stop learning: perfection is impossible to reach, but chasing it is always worth it.',
    metricsEyebrow: 'Experience at a glance',
    projectsEyebrow: 'Selected work',
    projectsIntro: 'Products shaped by complex requirements, real users, and production responsibility.',
    projectAction: 'Tap to explore',
    projectBackAction: 'Projects',
    contributionHeading: 'My contribution',
    outcomesHeading: 'Key outcomes',
    projectScreensLabel: 'Project screens',
    appStoreAction: 'View on the App Store',
    googlePlayAction: 'Get it on Google Play',
    contactTitle: 'Contact me!',
  },
  accessibility: {
    navigation: 'Primary navigation',
    home: 'Oleksii Khudenko, back to profile',
    fallback: 'Profile card for Oleksii Khudenko',
  },
} satisfies PortfolioContent;

export const primaryContact = emailContact;
