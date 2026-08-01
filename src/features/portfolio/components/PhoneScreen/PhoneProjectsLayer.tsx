import { useEffect, useRef, useState } from 'react';

import { portfolioContent } from '../../content/portfolio.content';
import type { Project } from '../../portfolio.types';
import type {
  PhoneProjectsLayerProps,
  ProjectDetailProps,
  ProjectKeyboardEvent,
  ProjectOpenEvent,
  StoreActionProps,
} from './PhoneProjectsLayer.types';

const StoreAction = ({ href, label, tabIndex }: StoreActionProps) => (
  <a href={href} target="_blank" rel="noreferrer" tabIndex={tabIndex}>
    {label}
  </a>
);

const ProjectDetail = ({ project, isOpen, backButtonRef, onBack }: ProjectDetailProps) => (
  <article
    className={`phone-project-detail${isOpen ? ' phone-project-detail--open' : ''}`}
    aria-hidden={!isOpen}
  >
    <header className="phone-project-detail__topbar">
      <button ref={backButtonRef} type="button" onClick={onBack} tabIndex={isOpen ? 0 : -1}>
        <span aria-hidden="true">←</span> {portfolioContent.phone.projectBackAction}
      </button>
      <span>{project.name}</span>
    </header>
    <div className="phone-project-detail__body phone-scrollable">
      <div
        className="phone-project-screens phone-scrollable-x"
        aria-label={portfolioContent.phone.projectScreensLabel}
      >
        {project.screens.map((screen) => (
          <figure key={screen.src} className="phone-project-shot">
            <img src={screen.src} alt={screen.alt} loading="lazy" />
          </figure>
        ))}
      </div>
      <section className="phone-project-about">
        <h3>{project.headline}</h3>
        {project.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <ul>
          {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      </section>
      <section className="phone-project-contribution">
        <span>{portfolioContent.phone.contributionHeading}</span>
        <ul>
          {project.contribution.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
      <section className="phone-project-outcomes">
        <span>{portfolioContent.phone.outcomesHeading}</span>
        {project.outcomes.map((outcome) => (
          <p key={outcome.title}>
            <strong>{outcome.title}</strong>
            {outcome.description}
          </p>
        ))}
      </section>
      <div className="phone-project-store-actions">
        <StoreAction
          href={project.storeLinks.appStore}
          label={portfolioContent.phone.appStoreAction}
          tabIndex={isOpen ? 0 : -1}
        />
        <StoreAction
          href={project.storeLinks.googlePlay}
          label={portfolioContent.phone.googlePlayAction}
          tabIndex={isOpen ? 0 : -1}
        />
      </div>
    </div>
  </article>
);

const PhoneProjectsLayer = ({ layerRef }: PhoneProjectsLayerProps) => {
  const [displayedProject, setDisplayedProject] = useState<Project | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isDetailOpen) {
      backButtonRef.current?.focus();
    }
  }, [isDetailOpen]);

  const handleOpenProject = (project: Project, event: ProjectOpenEvent) => {
    lastTriggerRef.current = event.currentTarget;
    setDisplayedProject(project);
    setIsDetailOpen(true);
  };

  const handleCloseProject = () => {
    setIsDetailOpen(false);
    lastTriggerRef.current?.focus();
  };

  const handleKeyDown = (event: ProjectKeyboardEvent) => {
    if (event.key === 'Escape' && isDetailOpen) {
      handleCloseProject();
    }
  };

  return (
    <div ref={layerRef} className="phone-layer phone-layer--projects" onKeyDown={handleKeyDown}>
      <div
        className={`phone-project-launcher phone-scrollable${isDetailOpen ? ' phone-project-launcher--hidden' : ''}`}
      >
        <div className="phone-layer-heading phone-layer-heading--projects">
          <span>{portfolioContent.phone.projectsEyebrow}</span>
          <p>{portfolioContent.phone.projectsIntro}</p>
        </div>
        <div className="phone-projects">
          {portfolioContent.projects.map((project, index) => (
            <button
              key={project.id}
              className="phone-project-card"
              type="button"
              tabIndex={isDetailOpen ? -1 : 0}
              aria-label={`${portfolioContent.phone.projectAction}: ${project.name}`}
              onClick={(event) => handleOpenProject(project, event)}
            >
              <span className="phone-project-card__copy">
                <img src={project.icon.src} alt="" className="phone-project-card__icon" />
                <span aria-hidden="true">0{index + 1}</span>
                <strong>{project.name}</strong>
                <span className="phone-project-card__category">{project.category}</span>
                <small>{portfolioContent.phone.projectAction}</small>
              </span>
              {project.screens[0] ? (
                <span className="phone-project-card__preview" aria-hidden="true">
                  <img src={project.screens[0].src} alt="" loading="lazy" />
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      {displayedProject ? (
        <ProjectDetail
          project={displayedProject}
          isOpen={isDetailOpen}
          backButtonRef={backButtonRef}
          onBack={handleCloseProject}
        />
      ) : null}
    </div>
  );
};

export default PhoneProjectsLayer;
