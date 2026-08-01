import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useEffect } from 'react';

import { registerRevealController } from './phone-navigation';
import type { ContentRefs, SectionKey } from './phone-motion.types';

gsap.registerPlugin(ScrollTrigger, SplitText);

type EntranceParts = {
  heading: HTMLElement | null;
  items: HTMLElement[];
};

/* Apple-style entrance for section copy: the heading rises word-by-word out
   of masked lines, then the remaining elements stagger in. Runs on its own
   ScrollTriggers, fully independent of the WebGL phone — if this never
   initializes, the content simply stays visible (see portfolio-content.css).
   Scroll-driven entrances fire once per page load; direct nav-bar navigation
   rebuilds and replays the destination's entrance. */
export const useSectionReveals = (contentRefs: ContentRefs): void => {
  useEffect(() => {
    const roots = (Object.entries(contentRefs) as [SectionKey, ContentRefs[SectionKey]][])
      .map(([section, ref]) => ({ section, root: ref.current }))
      .filter((entry): entry is { section: SectionKey; root: HTMLDivElement } =>
        entry.root !== null);

    if (roots.length === 0) {
      return undefined;
    }

    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const parts = new Map<SectionKey, EntranceParts>();
      const entrances = new Map<SectionKey, gsap.core.Timeline>();
      const activeSplits = new Map<SectionKey, SplitText>();
      const rootElements = roots.map((entry) => entry.root);

      const releaseSplit = (section: SectionKey) => {
        activeSplits.get(section)?.revert();
        activeSplits.delete(section);
      };

      /* (Re)builds a section's entrance from the current layout. The split
         only lives while the entrance plays: its line masks freeze the text
         wrapping measured at split time, and keeping them around would leave
         stale line breaks after any later layout change. */
      const buildEntrance = (section: SectionKey): gsap.core.Timeline => {
        releaseSplit(section);
        entrances.get(section)?.kill();

        const { heading, items } = parts.get(section) ?? { heading: null, items: [] };
        const timeline = gsap.timeline({
          paused: true,
          onComplete: () => releaseSplit(section),
        });

        if (heading) {
          const split = new SplitText(heading, { type: 'lines,words', mask: 'lines' });

          activeSplits.set(section, split);
          timeline.from(split.words, {
            yPercent: 115,
            duration: 0.85,
            stagger: 0.05,
            ease: 'power4.out',
          });
        }

        if (items.length > 0) {
          timeline.from(items, {
            y: 26,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: 'power2.out',
          }, heading ? '-=0.45' : 0);
        }

        entrances.set(section, timeline);

        return timeline;
      };

      roots.forEach(({ section, root }) => {
        parts.set(section, {
          heading: root.querySelector<HTMLElement>('[data-reveal="heading"]'),
          items: Array.from(root.querySelectorAll<HTMLElement>('[data-reveal="item"]')),
        });
        buildEntrance(section);

        /* Scrolling back and forth never replays an entrance. */
        ScrollTrigger.create({
          trigger: root,
          start: 'top 75%',
          once: true,
          onEnter: () => entrances.get(section)?.play(),
        });
      });

      /* During a direct fly-to navigation the page scrolls through
         intermediate sections; hiding the copy wholesale keeps the flight
         clean, then the destination replays its entrance on arrival. */
      const unregister = registerRevealController({
        conceal: () => {
          gsap.to(rootElements, { autoAlpha: 0, duration: 0.18, ease: 'power1.out', overwrite: 'auto' });
        },
        reveal: (section) => {
          roots.forEach(({ section: rootSection, root }) => {
            if (rootSection === section) {
              /* The destination root can be a visible container (e.g. the
                 contact card), so it fades in instead of popping. */
              gsap.fromTo(
                root,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' },
              );
            } else {
              gsap.set(root, { autoAlpha: 1 });
            }
          });
          buildEntrance(section).play(0);
        },
        restore: () => {
          gsap.to(rootElements, { autoAlpha: 1, duration: 0.25, ease: 'power1.out', overwrite: 'auto' });
        },
      });

      return () => {
        unregister();
        entrances.forEach((timeline) => timeline.kill());
        roots.forEach(({ section }) => releaseSplit(section));
      };
    });

    return () => {
      media.revert();
    };
  }, [contentRefs]);
};
