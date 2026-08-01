import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useEffect } from 'react';

import { registerRevealController } from './phone-navigation';
import type { ContentRefs, SectionKey } from './phone-motion.types';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Apple-style entrance for section copy: the heading rises word-by-word out
   of masked lines, then the remaining elements stagger in. Runs on its own
   ScrollTriggers, fully independent of the WebGL phone — if this never
   initializes, the content simply stays visible (see portfolio-content.css). */
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
      const splits: SplitText[] = [];
      const timelines = new Map<SectionKey, gsap.core.Timeline>();
      const rootElements = roots.map((entry) => entry.root);

      roots.forEach(({ section, root }) => {
        const heading = root.querySelector<HTMLElement>('[data-reveal="heading"]');
        const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal="item"]'));
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });

        if (heading) {
          const split = new SplitText(heading, { type: 'lines,words', mask: 'lines' });
          splits.push(split);
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

        timelines.set(section, timeline);
      });

      /* During a direct fly-to navigation the page scrolls through
         intermediate sections; hiding the copy wholesale keeps the flight
         clean, then the destination replays its entrance on arrival. */
      const unregister = registerRevealController({
        conceal: () => {
          gsap.to(rootElements, { autoAlpha: 0, duration: 0.18, ease: 'power1.out', overwrite: 'auto' });
        },
        reveal: (section) => {
          gsap.set(rootElements, { autoAlpha: 1 });
          timelines.get(section)?.play(0);
        },
        restore: () => {
          gsap.to(rootElements, { autoAlpha: 1, duration: 0.25, ease: 'power1.out', overwrite: 'auto' });
        },
      });

      return () => {
        unregister();
        splits.forEach((split) => split.revert());
      };
    });

    return () => {
      media.revert();
    };
  }, [contentRefs]);
};
