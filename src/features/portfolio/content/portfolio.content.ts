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
    { value: '2+', label: 'Years of mobile engineering leadership' },
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
  cv: {
    label: 'Open CV',
    ariaLabel: 'Open CV in Google Docs',
    href: 'https://docs.google.com/document/d/1o2mcE7pessBp4tPspLwRPXM7lLSxfJ2w1bsfc3WzVIU/edit?usp=sharing',
    opensInNewTab: true,
  },
  projects: [
    {
      id: 'splynx-field-service',
      name: 'Splynx Field Service',
      summary: 'An offline-first field operations platform for ISP technicians.',
      headline: 'Field work that stays reliable — even when the network does not.',
      context: [
        { label: 'Role', value: 'Mobile Team Lead' },
        { label: 'Scope', value: 'iOS · Android' },
        { label: 'Team', value: 'Mobile · Product · Design · QA · Backend' },
        { label: 'Delivery', value: 'CI/CD · Store releases' },
      ],
      caseStudy: [
        {
          label: 'Problem',
          title: 'Technicians could not depend on a stable connection.',
          description:
            'The app had to support task updates, attachments, equipment, maps, and on-site reporting in low-connectivity environments without losing work or breaking backend consistency.',
        },
        {
          label: 'Solution',
          title: 'I led the move to an offline-first architecture.',
          description:
            'I researched local persistence and synchronization options, validated iOS, Android, and backend constraints, compared trade-offs, and defined the technical approach. I organized delivery across Mobile, Product, Design, QA, and Backend, introduced a shared mobile core, CI/CD, and unit, integration, and E2E quality gates.',
        },
        {
          label: 'Result',
          title: 'Reliable field delivery with a reusable foundation.',
          description:
            'Technicians can continue critical workflows offline and synchronize safely when connectivity returns. The product reached 99.95%+ crash-free sessions, while the shared core and automated delivery pipeline reduced duplication and made releases more predictable.',
        },
      ],
      technologies: ['React Native', 'Offline-first', 'Shared Core', 'CI/CD'],
      contribution: [
        'Offline feasibility research and architecture decision',
        'Mobile technical leadership and delivery planning',
        'Shared mobile core and synchronization boundaries',
        'Unit, integration, and E2E testing strategy',
        'CI/CD, multi-environment builds, and store releases',
        'Cross-functional coordination and team mentoring',
      ],
      outcomes: [
        {
          title: '99.95%+ crash-free sessions',
          description: 'Production stability across demanding field workflows.',
        },
        {
          title: 'Offline continuity',
          description: 'Critical work continues without a reliable connection and syncs on return.',
        },
        {
          title: 'Predictable delivery',
          description: 'Shared foundations, automated checks, and repeatable release workflows.',
        },
      ],
      icon: {
        src: '/projects/field-service/icon.jpg',
        alt: 'Splynx Field Service app icon',
      },
      screens: [
        {
          src: '/projects/field-service/cover.png',
          alt: 'Splynx Field Service store artwork featuring a field technician',
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
      summary: 'A modern customer portal for everyday ISP self-service.',
      headline: 'Complex ISP self-service made clear, stable, and scalable.',
      context: [
        { label: 'Role', value: 'Senior React Native Engineer' },
        { label: 'Focus', value: 'Redesign · Refactoring' },
        { label: 'Team', value: 'Mobile · Product · Design · QA · Backend' },
        { label: 'Scope', value: 'iOS · Android' },
      ],
      caseStudy: [
        {
          label: 'Problem',
          title: 'A mature product had outgrown its mobile foundation.',
          description:
            'Billing, payments, services, usage data, and support workflows had accumulated legacy patterns and inconsistent UX, increasing the cost and risk of every product change.',
        },
        {
          label: 'Solution',
          title: 'I modernized the product without disrupting daily use.',
          description:
            'I translated complex requirements into a complete mobile redesign, introduced reusable React Native patterns, strengthened state and error handling, and rebuilt REST integrations in close collaboration with Product, Design, QA, and Backend.',
        },
        {
          label: 'Result',
          title: 'A clearer experience that increased conversion by 15%.',
          description:
            'After the redesign and refactoring, users engaged more confidently with key journeys and conversion increased by 15%. The new foundation also improved production reliability and made future product delivery easier to scale.',
        },
      ],
      technologies: ['React Native', 'REST APIs', 'Modernization', 'Scale'],
      contribution: [
        'Complete application redesign',
        'Legacy migration and reusable mobile patterns',
        'Complex REST API integrations',
        'Predictable state and resilient error handling',
        'Performance and stability improvements',
        'QA coordination and release readiness',
      ],
      outcomes: [
        {
          title: '15% conversion uplift',
          description: 'Measured after the product redesign and technical refactoring.',
        },
        {
          title: 'Simplified self-service',
          description: 'Dense ISP business logic translated into clear customer journeys.',
        },
        {
          title: 'Modernized foundation',
          description: 'Reusable patterns made ongoing product delivery safer and faster.',
        },
      ],
      icon: {
        src: '/projects/myisp/icon.jpg',
        alt: 'MyISP app icon',
      },
      screens: [
        {
          src: '/projects/myisp/cover.png',
          alt: 'MyISP dashboard shown in the first Google Play store screenshot',
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
    {
      id: 'splynx-comms-app',
      name: 'Splynx CommsApp',
      summary: 'A real-time mobile workspace for ISP support teams.',
      headline: 'Real-time customer support, untethered from the desk.',
      context: [
        { label: 'Role', value: 'Mobile Team Lead' },
        { label: 'Product', value: 'New app launch' },
        { label: 'Team', value: 'Mobile · Product · Design · QA · Backend' },
        { label: 'Delivery', value: 'Architecture · Google Play' },
      ],
      caseStudy: [
        {
          label: 'Problem',
          title: 'Support teams were tied to desktop workflows.',
          description:
            'Agents needed to handle tickets and customer conversations from anywhere, while the mobile product had to keep multiple communication streams current and dependable in real time.',
        },
        {
          label: 'Solution',
          title: 'I led a real-time mobile architecture and delivery plan.',
          description:
            'I designed the React Native foundation and WebSocket integration, including connection lifecycle, event synchronization, and recovery states. I also adopted and evolved the shared core library to reuse proven infrastructure across mobile products. I coordinated Mobile, Product, Design, QA, and Backend, established CI/CD, and shaped unit, integration, and E2E coverage around the critical support flows.',
        },
        {
          label: 'Result',
          title: 'A unified support workflow with 99.98%+ crash-free sessions.',
          description:
            'The launched app brought tickets, WhatsApp messages, canned replies, customer context, and push notifications into one mobile workspace while maintaining more than 99.98% crash-free sessions.',
        },
      ],
      technologies: ['React Native', 'WebSocket', 'Shared Core', 'Push Notifications', 'CI/CD'],
      contribution: [
        'Mobile architecture and end-to-end delivery leadership',
        'Real-time WebSocket integration and synchronization model',
        'Shared core library adoption and evolution',
        'Tickets, messaging, customer context, and push flows',
        'Unit, integration, and E2E testing strategy',
        'CI/CD, release readiness, and Google Play delivery',
        'Cross-functional planning and integration coordination',
      ],
      outcomes: [
        {
          title: '99.98%+ crash-free sessions',
          description: 'Production stability for real-time, business-critical communication.',
        },
        {
          title: 'Support from anywhere',
          description: 'Agents can respond to tickets and messages away from the desktop.',
        },
        {
          title: 'One integrated workflow',
          description: 'Tickets, conversations, notifications, and customer context in one app.',
        },
      ],
      icon: {
        src: '/projects/comms-app/icon.webp',
        alt: 'Splynx CommsApp icon',
      },
      screens: [
        {
          src: '/projects/comms-app/shot-1.webp',
          alt: 'Splynx CommsApp product overview for mobile ISP support',
        },
        {
          src: '/projects/comms-app/shot-2.webp',
          alt: 'Splynx CommsApp tickets dashboard',
        },
        {
          src: '/projects/comms-app/shot-3.webp',
          alt: 'Splynx CommsApp ticket conversation screen',
        },
      ],
      storeLinks: {
        appStore: 'https://apps.apple.com/ua/app/splynx-commsapp/id6749141439?l=uk',
        googlePlay: 'https://play.google.com/store/apps/details?id=com.splynx.communication',
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
    /* Title renders with a forced line break (pre-line) and uppercase via CSS. */
    profileHeading: {
      title: 'Building teams\nthat ship.',
      subtitle: 'Engineering standards, mentoring, and predictable delivery.',
      tagline: 'Leadership · Process · Quality',
    },
    profileIntro:
      'I love building products that users genuinely enjoy — it pushes me to make them better, more stable, and more pleasant to use. I never stop learning: perfection is impossible to reach, but chasing it is always worth it.',
    metricsEyebrow: 'Experience at a glance',
    projectsEyebrow: 'Selected work',
    projectsIntro: 'Products shaped by complex requirements, real users, and production responsibility.',
    projectAction: 'Tap to explore',
    projectBackAction: 'Projects',
    caseStudyHeading: 'Problem, solution, and result',
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
    loading: 'Loading portfolio',
  },
} satisfies PortfolioContent;

export const primaryContact = emailContact;
