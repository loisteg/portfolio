import { portfolioContent } from '../../features/portfolio/content/portfolio.content';
import { handleSectionAnchorClick } from '../../lib/motion3d/phone-navigation';

const Navigation = () => (
  <nav className="site-nav" aria-label={portfolioContent.accessibility.navigation}>
    <a
      className="site-nav__mark"
      href="#profile"
      aria-label={portfolioContent.accessibility.home}
      onClick={handleSectionAnchorClick}
    >
      {portfolioContent.initials}
    </a>
    <div className="site-nav__links">
      {portfolioContent.navigation.map((item) => (
        <a key={item.href} href={item.href} onClick={handleSectionAnchorClick}>
          {item.label}
        </a>
      ))}
    </div>
    <span className="site-nav__status" aria-hidden="true">
      <span /> {portfolioContent.navigationStatus}
    </span>
  </nav>
);

export default Navigation;
