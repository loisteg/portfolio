import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import Navigation from '../../components/Navigation/Navigation';
import PhoneScreen from '../../features/portfolio/components/PhoneScreen/PhoneScreen';
import {
  AboutContent,
  ContactContent,
  ProfileContent,
  ProjectsContent,
} from '../../features/portfolio/components/SectionContent';
import WebGLFallback from '../../features/portfolio/components/WebGLFallback';
import { usePortfolioMotionRefs } from '../../features/portfolio/hooks/usePortfolioMotionRefs.hooks';
import useWebGLSupport from '../../hooks/useWebGLSupport';
import PhoneExperience from '../../lib/motion3d/PhoneExperience';
import { useAppReady } from '../../lib/motion3d/useAppReady.hooks';
import { useSectionReveals } from '../../lib/motion3d/useSectionReveals.hooks';
import './portfolio.css';
import './portfolio-responsive.css';

const PortfolioPage = () => {
  const isWebGLSupported = useWebGLSupport();
  const isAppReady = useAppReady(isWebGLSupported);
  const {
    mainRef,
    profileSectionRef,
    aboutSectionRef,
    projectsSectionRef,
    contactSectionRef,
    profileAnchorRef,
    aboutAnchorRef,
    projectsAnchorRef,
    contactAnchorRef,
    anchors,
    screenRefs,
    contentRefs,
  } = usePortfolioMotionRefs();

  useSectionReveals(contentRefs);

  return (
    <div className="portfolio-shell">
      <LoadingScreen isReady={isAppReady} />
      <Navigation />
      <div className="ambient-light ambient-light--one" aria-hidden="true" />
      <div className="ambient-light ambient-light--two" aria-hidden="true" />
      {isWebGLSupported ? (
        <PhoneExperience mainRef={mainRef} anchors={anchors} screenRefs={screenRefs}>
          <PhoneScreen screenRefs={screenRefs} />
        </PhoneExperience>
      ) : (
        <WebGLFallback />
      )}
      <main ref={mainRef} className="scroll-story">
        <section
          id="profile"
          ref={profileSectionRef}
          className="story-section story-section--profile"
          tabIndex={-1}
        >
          <ProfileContent profileRef={contentRefs.profile} />
          <div ref={profileAnchorRef} className="phone-anchor phone-anchor--profile" aria-hidden="true" />
        </section>
        <section
          id="about"
          ref={aboutSectionRef}
          className="story-section story-section--about"
          tabIndex={-1}
        >
          <div ref={aboutAnchorRef} className="phone-anchor phone-anchor--about" aria-hidden="true" />
          <AboutContent aboutRef={contentRefs.about} />
        </section>
        <section
          id="projects"
          ref={projectsSectionRef}
          className="story-section story-section--projects"
          tabIndex={-1}
        >
          <ProjectsContent projectsRef={contentRefs.projects} />
          <div ref={projectsAnchorRef} className="phone-anchor phone-anchor--projects" aria-hidden="true" />
        </section>
        <section
          id="contact"
          ref={contactSectionRef}
          className="story-section story-section--contact"
          tabIndex={-1}
        >
          <ContactContent contactRef={contentRefs.contact} />
          <div ref={contactAnchorRef} className="phone-anchor phone-anchor--contact" aria-hidden="true" />
        </section>
      </main>
    </div>
  );
};

export default PortfolioPage;
