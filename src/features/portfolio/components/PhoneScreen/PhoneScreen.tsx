import { portfolioContent } from '../../content/portfolio.content';
import PhoneProjectsLayer from './PhoneProjectsLayer';
import { usePhonePointerScroll, usePhoneWheelScroll } from './PhoneScreen.hooks';
import type { PhoneLayerProps, PhoneScreenProps } from './PhoneScreen.types';
import './phone-screen.css';

const StatusBar = () => (
  <div className="phone-status" aria-hidden="true">
    <span>{portfolioContent.phone.statusTime}</span>
    <span className="phone-status__island" />
    <span>{portfolioContent.phone.statusSignal}</span>
  </div>
);

const ProfileLayer = ({ layerRef }: PhoneLayerProps) => (
  <div ref={layerRef} className="phone-layer phone-layer--profile">
    <div className="profile-portrait">
      <img src={portfolioContent.phone.portrait.src} alt={portfolioContent.phone.portrait.alt} />
    </div>
    <div className="phone-profile-heading">
      <p>{portfolioContent.name}</p>
      <span>{portfolioContent.primaryRole} · {portfolioContent.secondaryRole}</span>
      <small>{portfolioContent.location}</small>
    </div>
    <p className="phone-profile-intro">{portfolioContent.phone.profileIntro}</p>
  </div>
);

const MetricsLayer = ({ layerRef }: PhoneLayerProps) => (
  <div ref={layerRef} className="phone-layer phone-layer--metrics">
    <div className="phone-layer-heading">
      <span>{portfolioContent.phone.metricsEyebrow}</span>
    </div>
    <div className="metrics-grid">
      {portfolioContent.metrics.map((metric, index) => (
        <article key={metric.label} className="metric-card">
          <span aria-hidden="true">0{index + 1}</span>
          <strong>{metric.value}</strong>
          <p>{metric.label}</p>
        </article>
      ))}
    </div>
    <p className="metrics-badge">
      <i aria-hidden="true" /> {portfolioContent.metricsBadge}
    </p>
  </div>
);

const ContactLayer = ({ layerRef }: PhoneLayerProps) => (
  <div ref={layerRef} className="phone-layer phone-layer--contact">
    <p className="phone-contact-title">{portfolioContent.phone.contactTitle}</p>
  </div>
);

const PhoneScreen = ({ screenRefs }: PhoneScreenProps) => {
  const { surface, profile, metrics, projects, contact } = screenRefs;

  usePhoneWheelScroll(surface);
  usePhonePointerScroll(surface);

  return (
    <div ref={surface} className="phone-screen-frame">
      <div className="phone-screen">
        <StatusBar />
        <ProfileLayer layerRef={profile} />
        <MetricsLayer layerRef={metrics} />
        <PhoneProjectsLayer layerRef={projects} />
        <ContactLayer layerRef={contact} />
        <div className="phone-screen__glare" aria-hidden="true" />
      </div>
    </div>
  );
};

export default PhoneScreen;
