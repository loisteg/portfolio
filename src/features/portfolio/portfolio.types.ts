export type Metric = {
  value: string;
  label: string;
};

export type Capability = {
  title: string;
  description: string;
};

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  opensInNewTab: boolean;
};

export type ProjectImage = {
  src: string;
  alt: string;
};

export type ProjectOutcome = {
  title: string;
  description: string;
};

export type Project = {
  id: string;
  name: string;
  category: string;
  summary: string;
  headline: string;
  description: readonly string[];
  technologies: readonly string[];
  contribution: readonly string[];
  outcomes: readonly ProjectOutcome[];
  icon: ProjectImage;
  screens: readonly ProjectImage[];
  storeLinks: {
    appStore: string;
    googlePlay: string;
  };
};

export type NavigationItem = {
  label: string;
  href: `#${string}`;
};

export type PortfolioContent = {
  name: string;
  initials: string;
  primaryRole: string;
  secondaryRole: string;
  introduction: string;
  profileTags: readonly string[];
  about: readonly string[];
  capabilities: readonly Capability[];
  location: string;
  metrics: readonly Metric[];
  metricsBadge: string;
  contacts: readonly ContactLink[];
  projects: readonly Project[];
  navigation: readonly NavigationItem[];
  navigationStatus: string;
  sections: {
    profile: {
      eyebrow: string;
      firstName: string;
      lastName: string;
      projectsAction: string;
    };
    about: { eyebrow: string; heading: string; capabilitiesLabel: string };
    projects: { eyebrow: string; hint: string };
    contact: {
      eyebrow: string;
      heading: string;
      paragraphs: readonly string[];
      conversationAction: string;
      footer: string;
    };
  };
  phone: {
    statusTime: string;
    statusSignal: string;
    portraitLabel: string;
    statusBadge: string;
    metricsEyebrow: string;
    projectsEyebrow: string;
    projectsIntro: string;
    projectAction: string;
    projectBackAction: string;
    contributionHeading: string;
    outcomesHeading: string;
    projectScreensLabel: string;
    appStoreAction: string;
    googlePlayAction: string;
    contactEyebrow: string;
    contactHeading: string;
    contactIntro: string;
  };
  accessibility: {
    navigation: string;
    home: string;
    fallback: string;
  };
};
