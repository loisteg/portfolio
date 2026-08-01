import { portfolioContent } from '../../content/portfolio.content';
import PhoneProjectsLayer from './PhoneProjectsLayer';
import { usePhoneWheelScroll } from './PhoneScreen.hooks';
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
    <div className="profile-portrait" aria-label={portfolioContent.phone.portraitLabel}>
      <span className="profile-portrait__orb" />
      <strong>{portfolioContent.initials}</strong>
      <small className="profile-portrait__badge">
        <i aria-hidden="true" /> {portfolioContent.phone.statusBadge}
      </small>
    </div>
    <div className="phone-profile-heading">
      <p>{portfolioContent.name}</p>
      <span>{portfolioContent.primaryRole} · {portfolioContent.secondaryRole}</span>
      <small>{portfolioContent.location}</small>
    </div>
    <div className="phone-contact-list">
      {portfolioContent.contacts.map((contact, index) => (
        <a
          key={contact.label}
          className="phone-contact-row"
          href={contact.href}
          target={contact.opensInNewTab ? '_blank' : undefined}
          rel={contact.opensInNewTab ? 'noreferrer' : undefined}
        >
          <span aria-hidden="true">0{index + 1}</span>
          <p>{contact.label}</p>
          <b aria-hidden="true">↗</b>
        </a>
      ))}
    </div>
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
    <div className="phone-layer-heading phone-layer-heading--contact">
      <span>{portfolioContent.phone.contactEyebrow}</span>
      <strong>{portfolioContent.phone.contactHeading}</strong>
    </div>
    <p className="phone-contact-intro">{portfolioContent.phone.contactIntro}</p>
    <div className="phone-contact-actions">
      {portfolioContent.contacts.map((contact) => (
        <a
          key={contact.label}
          href={contact.href}
          target={contact.opensInNewTab ? '_blank' : undefined}
          rel={contact.opensInNewTab ? 'noreferrer' : undefined}
        >
          <span>{contact.label}</span>
          <small>{contact.value}</small>
          <b aria-hidden="true">↗</b>
        </a>
      ))}
    </div>
    <p className="phone-contact-location">{portfolioContent.location}</p>
  </div>
);

const PhoneScreen = ({ screenRefs }: PhoneScreenProps) => {
  const { surface, profile, metrics, projects, contact } = screenRefs;

  usePhoneWheelScroll(surface);

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
