"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const navigation = {
  left: [
    ["Home", "/"],
    ["Capabilities", "/capabilities"],
  ],
  right: [
    ["Studio", "/#studio"],
    ["Contact", "#contact"],
  ],
} as const;

type NavigationItem =
  (typeof navigation.left)[number] | (typeof navigation.right)[number];

const mobileNavigation = [
  {
    number: "01",
    label: "Capabilities",
    href: "/capabilities",
    visual: "/images/capabilities/brand.webp",
  },
  {
    number: "02",
    label: "Studio",
    href: "/#studio",
    visual: "/images/capabilities/interactive.webp",
  },
  {
    number: "03",
    label: "Contact",
    href: "#contact",
    visual: "/images/capabilities/ascent.webp",
  },
] as const;

export function SiteHeader({ currentPage }: { currentPage?: "capabilities" }) {
  const headerRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const headerStateRef = useRef({
    mode: currentPage ? "fixed" : "hero",
    theme: "light",
    visible: "true",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileItem, setActiveMobileItem] = useState<string | null>(null);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setActiveMobileItem(null);
  }, []);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    header.dataset.mode = headerStateRef.current.mode;
    header.dataset.theme = headerStateRef.current.theme;
    header.dataset.visible = headerStateRef.current.visible;
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const navigation = navigationRef.current;
    const menuToggle = menuToggleRef.current;
    const previousOverflow = document.documentElement.style.overflow;
    const background = [
      ...document.querySelectorAll<HTMLElement>(
        "main, .final-chapter, .skip-link",
      ),
    ];
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
      }
      if (event.key !== "Tab") return;
      const focusable = [
        ...(navigation?.querySelectorAll<HTMLElement>("a[href], button") ?? []),
      ].filter(
        (element) =>
          !element.closest("[inert]") && element.getClientRects().length > 0,
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      if (navigation?.contains(document.activeElement)) menuToggle?.focus();
    };
  }, [closeMobileMenu, mobileMenuOpen]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const closeAboveMobile = () => {
      if (!mobileQuery.matches) closeMobileMenu();
    };

    mobileQuery.addEventListener("change", closeAboveMobile);
    return () => mobileQuery.removeEventListener("change", closeAboveMobile);
  }, [closeMobileMenu]);

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
      headerStateRef.current.mode = fixed ? "fixed" : "hero";
      header.dataset.mode = headerStateRef.current.mode;
    };

    const setVisible = (visible: boolean) => {
      if (visible === isVisible) return;
      isVisible = visible;
      headerStateRef.current.visible = String(visible);
      header.dataset.visible = headerStateRef.current.visible;
    };

    const measure = () => {
      const rect = hero.getBoundingClientRect();
      const heroTop = rect.top + window.scrollY;

      enterAt = mobileQuery.matches
        ? heroTop + 8
        : heroTop + rect.height * 0.15;
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
    const darkSections = document.querySelectorAll<HTMLElement>(
      '#factory, [data-header-theme="dark"]',
    );

    if (!header || !darkSections.length) return;

    const visibleDarkSections = new Set<Element>();

    const setTheme = (dark: boolean) => {
      headerStateRef.current.theme = dark ? "dark" : "light";
      header.dataset.theme = headerStateRef.current.theme;
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

  const renderLink = ([label, href]: NavigationItem) => (
    <Link
      className="site-nav__link"
      data-nav-target={href.startsWith("#") ? href : undefined}
      href={href}
      aria-current={
        currentPage && href === `/${currentPage}` ? "page" : undefined
      }
      data-active={
        currentPage && href === `/${currentPage}` ? "true" : undefined
      }
      key={label}
    >
      {label}
    </Link>
  );

  return (
    <div
      ref={navigationRef}
      role={mobileMenuOpen ? "dialog" : undefined}
      aria-modal={mobileMenuOpen || undefined}
      aria-label={mobileMenuOpen ? "Site navigation" : undefined}
    >
      <header
        className="site-header"
        data-mode={currentPage ? "fixed" : "hero"}
        data-theme="light"
        data-visible="true"
        data-menu-open={mobileMenuOpen}
        ref={headerRef}
      >
        <div
          className={`site-header__reveal t-enter-line${currentPage ? "" : " t-stagger-line t-stagger-line--1"}`}
        >
          <nav className="site-nav" aria-label="Primary navigation">
            <div className="site-nav__group site-nav__group--left">
              {navigation.left.map(renderLink)}
            </div>

            <Link
              className="brand"
              href={currentPage ? "/" : "#top"}
              aria-label="Urca Design Factory, home"
              onClick={closeMobileMenu}
            >
              <Image
                src="/wordmark_dark.svg"
                alt="Urca"
                width={171}
                height={40}
                priority
              />
            </Link>

            <div className="site-nav__group site-nav__group--right">
              {navigation.right.map(renderLink)}
            </div>

            <div className="site-nav__mobile">
              <button
                ref={menuToggleRef}
                className="site-nav__mobile-toggle"
                type="button"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                <span>{mobileMenuOpen ? "Close" : "Menu"}</span>
                <span className="site-nav__mobile-icon" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <nav
        className="mobile-menu t-panel-slide"
        id="mobile-menu"
        aria-label="Mobile navigation"
        data-open={mobileMenuOpen}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
      >
        <div className="mobile-menu__list">
          {mobileNavigation.map((item) => {
            const itemId = `mobile-menu-${item.number}`;
            const isOpen = activeMobileItem === item.number;

            return (
              <div
                className="mobile-menu__item t-acc"
                data-open={isOpen}
                key={item.number}
              >
                <button
                  className="mobile-menu__head t-acc-head"
                  type="button"
                  aria-controls={`${itemId}-panel`}
                  aria-expanded={isOpen}
                  onClick={() =>
                    setActiveMobileItem((active) =>
                      active === item.number ? null : item.number,
                    )
                  }
                >
                  <span className="mobile-menu__number">{item.number}</span>
                  <span className="mobile-menu__title">{item.label}</span>
                  <span className="mobile-menu__mark" aria-hidden="true" />
                </button>

                <div
                  className="mobile-menu__panel t-acc-panel"
                  id={`${itemId}-panel`}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                >
                  <div className="mobile-menu__panel-inner t-acc-panel-inner">
                    <div className="mobile-menu__visual">
                      {mobileMenuOpen && isOpen && (
                        <Image
                          className="mobile-menu__image"
                          src={item.visual}
                          alt=""
                          fill
                          sizes="100vw"
                        />
                      )}
                      <div className="mobile-menu__visual-meta">
                        <span aria-hidden="true">
                          {item.number} / {item.label}
                        </span>
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          aria-current={
                            currentPage && item.href === `/${currentPage}`
                              ? "page"
                              : undefined
                          }
                        >
                          Explore {item.label.toLowerCase()}{" "}
                          <span aria-hidden="true">↗</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
      <noscript>
        <nav className="no-script-nav" aria-label="Mobile navigation">
          <Link href="/capabilities">Capabilities</Link>
          <Link href="/#studio">Studio</Link>
          <a href="#contact">Contact</a>
        </nav>
        <style>{`.site-nav__mobile { display: none !important; }`}</style>
      </noscript>
    </div>
  );
}
