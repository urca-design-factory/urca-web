"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const navigation = {
  left: [
    ["Work", "#selected-work"],
    ["Capabilities", "/capabilities"],
  ],
  right: [
    ["Studio", "/studio"],
    ["Contact", "#contact"],
  ],
} as const;

const allNavigation = [...navigation.left, ...navigation.right];

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const hero = document.querySelector<HTMLElement>(".hero");

    if (!header || !hero) return;

    const mobileQuery = window.matchMedia("(max-width: 640px)");
    let enterAt = Number.POSITIVE_INFINITY;
    let restoreAt = 24;
    let isFixed = false;
    let isVisible = true;
    let lastY = Math.max(0, window.scrollY);
    let direction = 0;
    let travelled = 0;
    let frame = 0;

    const setMode = (fixed: boolean) => {
      if (fixed === isFixed) return;
      isFixed = fixed;
      header.dataset.mode = fixed ? "fixed" : "hero";
    };

    const setVisible = (visible: boolean) => {
      if (visible === isVisible) return;
      isVisible = visible;
      header.dataset.visible = String(visible);
    };

    const measure = () => {
      const rect = hero.getBoundingClientRect();
      const heroTop = rect.top + window.scrollY;

      enterAt = mobileQuery.matches ? heroTop + 8 : heroTop + rect.height * 0.15;
      restoreAt = mobileQuery.matches ? heroTop + 2 : heroTop + 32;
    };

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      lastY = y;

      if (isFixed && y <= restoreAt) {
        setMode(false);
        setVisible(true);
        direction = 0;
        travelled = 0;
        return;
      }

      if (!isFixed && y >= enterAt) {
        setMode(true);
        setVisible(true);
        direction = 0;
        travelled = 0;
        return;
      }

      if (!isFixed || Math.abs(delta) < 1) return;

      const nextDirection = delta > 0 ? 1 : -1;

      if (nextDirection !== direction) {
        direction = nextDirection;
        travelled = 0;
      }

      travelled += Math.abs(delta);

      if (direction > 0 && travelled >= 56) {
        if (!header.matches(":focus-within")) setVisible(false);
        travelled = 0;
      } else if (direction < 0 && travelled >= 28) {
        setVisible(true);
        travelled = 0;
      }
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const remeasure = () => {
      measure();
      scheduleUpdate();
    };

    const keepVisibleForFocus = () => setVisible(true);
    const resizeObserver = new ResizeObserver(remeasure);

    measure();
    if (lastY >= enterAt) setMode(true);
    resizeObserver.observe(hero);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    mobileQuery.addEventListener("change", remeasure);
    header.addEventListener("focusin", keepVisibleForFocus);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", remeasure);
      mobileQuery.removeEventListener("change", remeasure);
      header.removeEventListener("focusin", keepVisibleForFocus);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    const darkSections = document.querySelectorAll<HTMLElement>("#factory");

    if (!header || !darkSections.length) return;

    const visibleDarkSections = new Set<Element>();

    const setTheme = (dark: boolean) => {
      header.dataset.theme = dark ? "dark" : "light";
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleDarkSections.add(entry.target);
          else visibleDarkSections.delete(entry.target);
        });

        setTheme(visibleDarkSections.size > 0);
      },
      { rootMargin: "0px 0px -92%", threshold: 0 },
    );

    darkSections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      setTheme(false);
    };
  }, []);

  useEffect(() => {
    const work = document.querySelector<HTMLElement>("#selected-work");
    const workLinks = document.querySelectorAll<HTMLAnchorElement>(
      '[data-nav-target="#selected-work"]',
    );

    if (!work || !workLinks.length) return;

    const setWorkActive = (active: boolean) => {
      workLinks.forEach((link) => {
        link.dataset.active = String(active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => setWorkActive(entry.isIntersecting),
      { rootMargin: "-38% 0px -48%", threshold: 0 },
    );

    observer.observe(work);
    return () => observer.disconnect();
  }, []);

  const renderLink = ([label, href]: (typeof allNavigation)[number]) => (
    <a
      className="site-nav__link"
      data-nav-target={href.startsWith("#") ? href : undefined}
      href={href}
      key={label}
      onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}
    >
      {label}
    </a>
  );

  return (
    <header
      className="site-header"
      data-mode="hero"
      data-theme="light"
      data-visible="true"
      ref={headerRef}
    >
      <nav className="site-nav" aria-label="Primary navigation">
        <div className="site-nav__group site-nav__group--left">
          {navigation.left.map(renderLink)}
        </div>

        <a className="brand" href="#top" aria-label="Urca Design Factory, home">
          <Image src="/wordmark_dark.svg" alt="Urca" width={171} height={40} priority />
        </a>

        <div className="site-nav__group site-nav__group--right">
          {navigation.right.map(renderLink)}
        </div>

        <details className="site-nav__mobile">
          <summary>Menu</summary>
          <div className="site-nav__mobile-links">{allNavigation.map(renderLink)}</div>
        </details>
      </nav>
    </header>
  );
}
