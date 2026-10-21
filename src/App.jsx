import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import SelectedWork from "./components/SelectedWork";
import Services from "./components/Services";
import Studio from "./components/Studio";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Footer from "./components/Footer";


const links = ["Home", "Services", "Studio", "Pricing", "Contact"];

function PageTransition() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`page-transition${reduceMotion ? " page-transition--reduced" : ""}`}
      initial={{ y: 0 }}
      animate={{ y: "-101%" }}
      transition={{
        duration: reduceMotion ? 0 : 1.05,
        delay: reduceMotion ? 0 : 0.12,
        ease: [0.76, 0, 0.24, 1],
      }}
      aria-hidden="true"
    >
      <span>Web<span>Expertss</span><i>.</i></span>
      <b />
    </motion.div>
  );
}

function MagneticLink({ children, className = "", href = "/contact" }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handlePointerMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: (event.clientX - (bounds.left + bounds.width / 2)) * 0.16,
      y: (event.clientY - (bounds.top + bounds.height / 2)) * 0.16,
    });
  }

  return (
    <motion.a
      href={href}
      className={`magnetic-link ${className}`}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.4 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </motion.a>
  );
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={onToggle}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -35, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? <Moon size={15} strokeWidth={1.7} /> : <Sun size={15} strokeWidth={1.7} />}
      </motion.span>
    </button>
  );
}

function Navbar({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleHomeClick(event) {
    if (window.location.pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    event.preventDefault();
    window.location.href = "/";
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isHomePage = window.location.pathname === "/";
  const isContactPage = window.location.pathname === "/contact";
  const isPricingPage = window.location.pathname === "/pricing";
  const navigationHref = (link) => {
    if (link === "Home") return "/";
    if (link === "Contact") return isContactPage ? "#contact-form" : "/contact#contact-form";
    if (link === "Pricing") return "/pricing";

    const section = link === "Studio" ? "studio" : "services";
    return isHomePage ? `#${section}` : `/#${section}`;
  };

  return (
    <>
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <nav className="nav-shell" aria-label="Main navigation">
          <a className="wordmark" href="/" aria-label="webexpertss home" onClick={handleHomeClick}>
            Web<span>Expertss</span><i>.</i>
          </a>

          <div className="desktop-nav">
            {links.map((link, index) => (
              <a
                href={navigationHref(link)}
                onClick={link === "Home" ? handleHomeClick : undefined}
                className={(isHomePage ? link === "Home" : isContactPage ? link === "Contact" : isPricingPage ? link === "Pricing" : index === 0) ? "is-active" : ""}
                aria-current={(isHomePage ? link === "Home" : isContactPage ? link === "Contact" : isPricingPage ? link === "Pricing" : index === 0) ? "page" : undefined}
                key={link}
              >
                {link}
              </a>
            ))}
          </div>

          <div className="nav-tools">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <MagneticLink className="nav-cta">
              <span>Start a project</span>
              <ArrowUpRight size={15} strokeWidth={1.8} />
            </MagneticLink>
          </div>

          <div className="mobile-tools">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mobile-menu__links">
              {links.map((link, index) => (
                <motion.a
                  href={navigationHref(link)}
                  key={link}
                  onClick={link === "Home"
                    ? (event) => {
                        setMenuOpen(false);
                        handleHomeClick(event);
                      }
                    : () => setMenuOpen(false)}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.06, duration: 0.45 }}
                >
                  <span>0{index + 1}</span>{link.toUpperCase()}
                </motion.a>
              ))}
            </div>
            <a className="mobile-menu__cta" href={isContactPage ? "#contact-form" : "/contact#contact-form"} onClick={() => setMenuOpen(false)}>
              Start a project <ArrowUpRight size={18} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AbstractVisual() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const backgroundWords = ["CREATE", "MOVE", "MATTER"];

  return (
    <motion.div
      className="hero-visual"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setPosition({
          x: (event.clientX - bounds.left - bounds.width / 2) / 28,
          y: (event.clientY - bounds.top - bounds.height / 2) / 28,
        });
      }}
      onPointerLeave={() => setPosition({ x: 0, y: 0 })}
    >
      <div className="hero-type-orbit" aria-hidden="true">
        {backgroundWords.map((word, index) => (
          <motion.span
            className={`hero-type-orbit__word hero-type-orbit__word--${index + 1}`}
            key={word}
            animate={{
              x: [0, index % 2 === 0 ? 18 : -18, 0],
              y: [0, index % 2 === 0 ? -12 : 12, 0],
              rotate: [index % 2 === 0 ? -5 : 5, index % 2 === 0 ? 2 : -2, index % 2 === 0 ? -5 : 5],
            }}
            transition={{
              duration: 9 + index * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
      <motion.div
        className="hero-type-marquee"
        animate={{ x: ["0%", "-25%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        DESIGN / BUILD / GROW / DESIGN / BUILD / GROW /
      </motion.div>
      <motion.div
        className="visual-label visual-label--top"
        animate={{ x: position.x * -0.4, y: position.y * -0.4 }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
      >
        <span>W/</span> Digital products
      </motion.div>
      <div className="visual-label visual-label--bottom">Thoughtfully<br />in motion</div>
      <div className="visual-cross visual-cross--one">+</div>
      <div className="visual-cross visual-cross--two">+</div>
    </motion.div>
  );
}

function Hero() {
  const lines = ["WE DESIGN.", "WE BUILD.", "WE GROW."];

  return (
    <main className="hero" id="top">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span /> Independent digital agency <span className="eyebrow-index">/ 001</span></div>
          <h1>
            {lines.map((line, index) => (
              <span className="headline-line" key={line}>
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <div className="hero-bottom">
            <p>webexpertss is a digital agency creating powerful websites, digital products and brands for businesses ready to move forward.</p>
            <div className="hero-actions">
              <MagneticLink href="#work" className="button button--dark">View our work <ArrowUpRight size={17} /></MagneticLink>
              <MagneticLink className="button button--line">Start a project <ArrowUpRight size={17} /></MagneticLink>
            </div>
          </div>
        </div>
        <AbstractVisual />
      </div>
      <div className="hero-meta"><span>Scroll to explore</span><span className="hero-meta__line" /><span>Based everywhere / 2026</span></div>
    </main>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("webexpertss-theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("webexpertss-theme", theme);
  }, [theme]);

  function toggleTheme(event) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const bounds = event.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--theme-origin-x", `${bounds.left + bounds.width / 2}px`);
    root.style.setProperty("--theme-origin-y", `${bounds.top + bounds.height / 2}px`);

    const transition = document.startViewTransition;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!transition || prefersReducedMotion || isThemeTransitioning) {
      setTheme(nextTheme);
      return;
    }

    setIsThemeTransitioning(true);
    const themeTransition = transition.call(document, () => {
      flushSync(() => setTheme(nextTheme));
    });
    themeTransition.finished.then(
      () => setIsThemeTransitioning(false),
      () => setIsThemeTransitioning(false),
    );
  }

  return (
    <>
      <PageTransition />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      {window.location.pathname === "/work" || window.location.pathname === "/our-work" ? (
        <>
          <Work />
          <Footer />
        </>
      ) : window.location.pathname === "/pricing" ? (
        <>
          <Pricing />
          <Footer />
        </>
      ) : window.location.pathname === "/contact" ? (
        <>
          <Contact />
          <Footer />
        </>
      ) : (
        <>
          <Hero />
          <SelectedWork />
          <Services />
          <Studio />
          <Footer />
        </>
      )}
    </>
  );
}
