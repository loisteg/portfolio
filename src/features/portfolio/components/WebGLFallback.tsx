import { portfolioContent } from '../content/portfolio.content';

const WebGLFallback = () => (
  <div className="phone-fallback" role="img" aria-label={portfolioContent.accessibility.fallback}>
    <span>{portfolioContent.initials}</span>
    <strong>{portfolioContent.name}</strong>
    <small>{portfolioContent.primaryRole}</small>
  </div>
);

export default WebGLFallback;
