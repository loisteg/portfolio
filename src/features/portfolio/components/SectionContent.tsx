import { portfolioContent } from '../content/portfolio.content';
import { handleSectionAnchorClick } from '../../../lib/motion3d/phone-navigation';
import type { SectionContentProps } from './SectionContent.types';

export const ProfileContent = ({ profileRef }: Pick<SectionContentProps, 'profileRef'>) => (
  <div className="profile-copy section-copy" ref={profileRef}>
    <p className="eyebrow" data-reveal="item">{portfolioContent.sections.profile.eyebrow}</p>
    <h1 data-reveal="heading">
      <span>{portfolioContent.sections.profile.firstName}</span>
      <span className="profile-copy__outline">{portfolioContent.sections.profile.lastName}</span>
    </h1>
    <div className="role-stack" data-reveal="item">
      <p>{portfolioContent.primaryRole}</p>
      <p>{portfolioContent.secondaryRole}</p>
    </div>
    <p className="profile-copy__intro" data-reveal="item">{portfolioContent.introduction}</p>
    <ul className="profile-tags" aria-label={portfolioContent.sections.about.capabilitiesLabel}>
      {portfolioContent.profileTags.map((tag) => (
        <li key={tag} data-reveal="item">{tag}</li>
      ))}
    </ul>
    <div className="profile-actions" data-reveal="item">
      <a className="button button--primary" href="#about" onClick={handleSectionAnchorClick}>
        {portfolioContent.sections.profile.aboutAction} <span aria-hidden="true">↘</span>
      </a>
    </div>
  </div>
);

export const AboutContent = ({ aboutRef }: Pick<SectionContentProps, 'aboutRef'>) => (
  <div className="about-copy section-copy" ref={aboutRef}>
    <p className="eyebrow" data-reveal="item">{portfolioContent.sections.about.eyebrow}</p>
    <h2 data-reveal="heading">{portfolioContent.sections.about.heading}</h2>
    {portfolioContent.about.map((paragraph) => (
      <p key={paragraph} data-reveal="item">{paragraph}</p>
    ))}
    <ul className="capability-cards" aria-label={portfolioContent.sections.about.capabilitiesLabel}>
      {portfolioContent.capabilities.map((capability) => (
        <li key={capability.title} data-reveal="item">
          <strong>{capability.title}</strong>
          <span>{capability.description}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const ProjectsContent = ({ projectsRef }: Pick<SectionContentProps, 'projectsRef'>) => (
  <div className="projects-copy section-copy" ref={projectsRef}>
    <h2 data-reveal="heading">{portfolioContent.sections.projects.heading}</h2>
    <span className="projects-copy__line" aria-hidden="true" data-reveal="item" />
  </div>
);

export const ContactContent = ({ contactRef }: Pick<SectionContentProps, 'contactRef'>) => (
  <div className="contact-card" ref={contactRef}>
    <div className="contact-card__intro">
      <p className="eyebrow" data-reveal="item">{portfolioContent.sections.contact.eyebrow}</p>
      <h2 data-reveal="heading">{portfolioContent.sections.contact.heading}</h2>
      {portfolioContent.sections.contact.paragraphs.map((paragraph) => (
        <p key={paragraph} data-reveal="item">{paragraph}</p>
      ))}
      <span data-reveal="item">{portfolioContent.location}</span>
    </div>
    <div className="contact-card__links">
      {portfolioContent.contacts.map((contact) => (
        <a
          key={contact.label}
          href={contact.href}
          target={contact.opensInNewTab ? '_blank' : undefined}
          rel={contact.opensInNewTab ? 'noreferrer' : undefined}
          data-reveal="item"
        >
          <span>{contact.label}</span>
          <small>{contact.value}</small>
          <b aria-hidden="true">↗</b>
        </a>
      ))}
    </div>
  </div>
);
