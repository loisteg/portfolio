import { useCallback, useEffect, useRef, useState } from 'react';

import { portfolioContent } from '../../content/portfolio.content';
import type { Project } from '../../portfolio.types';
import { useCloseDetailOnSectionLeave, usePageScrollLock } from './PhoneProjectsLayer.hooks';
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

const ProjectDetail = ({ project, isOpen, backButtonRef, onBack }: ProjectDetailProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const screensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    bodyRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    screensRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  }, [isOpen, project.id]);

  return (
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
      <div ref={bodyRef} className="phone-project-detail__body phone-scrollable">
        <div
          ref={screensRef}
          className="phone-project-screens phone-scrollable-x"
          role="group"
          aria-label={portfolioContent.phone.projectScreensLabel}
        >
          {project.screens.map((screen) => (
            <figure key={screen.src} className="phone-project-shot">
              <img src={screen.src} alt={screen.alt} loading="lazy" draggable={false} />
            </figure>
          ))}
        </div>
      <section className="phone-project-about">
        <h3>{project.headline}</h3>
        <dl className="phone-project-context">
          {project.context.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <ul>
          {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      </section>
      <section
        className="phone-project-story"
        aria-label={portfolioContent.phone.caseStudyHeading}
      >
        {project.caseStudy.map((step, index) => (
          <article key={step.label} className="phone-project-story__step">
            <span>
              <i aria-hidden="true">0{index + 1}</i>
              {step.label}
            </span>
            <h4>{step.title}</h4>
            <p>{step.description}</p>
          </article>
        ))}
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
        {project.storeLinks.appStore ? (
          <StoreAction
            href={project.storeLinks.appStore}
            label={portfolioContent.phone.appStoreAction}
            tabIndex={isOpen ? 0 : -1}
          />
        ) : null}
        {project.storeLinks.googlePlay ? (
          <StoreAction
            href={project.storeLinks.googlePlay}
            label={portfolioContent.phone.googlePlayAction}
            tabIndex={isOpen ? 0 : -1}
          />
        ) : null}
      </div>
      </div>
    </article>
  );
};

const PhoneProjectsLayer = ({ layerRef }: PhoneProjectsLayerProps) => {
  const [displayedProject, setDisplayedProject] = useState<Project | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);

  const closeDetail = useCallback(() => setIsDetailOpen(false), []);

  usePageScrollLock(isDetailOpen);
  useCloseDetailOnSectionLeave(isDetailOpen, closeDetail);

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
              data-project-id={project.id}
              type="button"
              tabIndex={isDetailOpen ? -1 : 0}
              aria-label={`${portfolioContent.phone.projectAction}: ${project.name}`}
              onClick={(event) => handleOpenProject(project, event)}
            >
              <span className="phone-project-card__copy">
                <img src={project.icon.src} alt="" className="phone-project-card__icon" />
                <span aria-hidden="true">0{index + 1}</span>
                <strong>{project.name}</strong>
                <small className="phone-project-card__action">{portfolioContent.phone.projectAction}</small>
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
