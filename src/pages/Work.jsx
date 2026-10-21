import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const projects = [
  {
    number: "01",
    title: "Building your vision, creating reality",
    category: "Website",
    description: "A refined digital experience for a modern residential brand.",
    image: "/projects/equiptrade.png",
    accent: "industrial",
    href: "/work/equiptrade-india",
  },
  {
    number: "02",
    title: "Brand stories that feel premium.",
    category: "Brand Identity",
    description: "Visual identity and digital direction for a creative studio.",
    image: "/projects/alex-studio.png",
    accent: "creative",
    href: "/work/alex-graphic-studio",
  },
  // {
  //   number: "03",
  //   title: "Digital systems built for momentum.",
  //   category: "Web Design",
  //   description: "A sharp marketing presence for a growing digital agency.",
  //   image: "/projects/equiptrade.png",
  //   accent: "digital",
  //   href: "/work/webexpertsa",
  // },
];

function WorkShowcaseCard({ project, index, reduceMotion }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [28, -28]);
  const imageScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.12, 1.04]);

  return (
    <motion.article
      ref={cardRef}
      className={`work-showcase-card work-showcase-card--${index === 0 ? "feature" : index === 1 ? "stacked" : "mini"}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 36 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -8 }}
      transition={{ duration: reduceMotion ? 0 : 0.85, delay: reduceMotion ? 0 : 0.12 + index * 0.14, ease: [0.22, 1, 0.36, 1] }}
    >
      {index === 0 ? (
        <>
          <div className="work-showcase-card__badge">Website</div>
          <motion.img src={project.image} alt={project.title} style={{ y: imageY, scale: imageScale }} />
          <div className="work-showcase-card__overlay">
            <h2>{project.title}</h2>
          </div>
          <a className="work-showcase-card__link" href={project.href} aria-label={`View ${project.title}`}>
            <ArrowUpRight size={18} />
          </a>
        </>
      ) : index === 1 ? (
        <>
          <motion.img src={project.image} alt={project.title} style={{ y: imageY, scale: imageScale }} />
          <div className="work-showcase-card__badge work-showcase-card__badge--light">Brand Identity</div>
          <div className="work-showcase-card__caption">
            <span>{project.number}</span>
            <h3>{project.title}</h3>
          </div>
          <a className="work-showcase-card__link" href={project.href} aria-label={`View ${project.title}`}>
            <ArrowUpRight size={18} />
          </a>
        </>
      ) : (
        <div className="work-showcase-card__mini-inner">
          <div className="work-showcase-card__meta">
            <span>{project.number}</span>
            <span>{project.category}</span>
          </div>
          <div className="work-showcase-card__mini-visual">
            <motion.img src={project.image} alt={project.title} style={{ y: imageY, scale: imageScale }} />
            <h3 className="work-showcase-card__mini-title">{project.title}</h3>
          </div>
        </div>
      )}
    </motion.article>
  );
}

export default function Work() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef(null);
  const [activeProject, setActiveProject] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || projects.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveProject((current) => (current + 1) % projects.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [activeProject, isPaused]);

  useEffect(() => {
    const track = trackRef.current;
    const card = track?.children[activeProject];
    if (!track || !card) return;

    track.scrollTo({
      left: card.offsetLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeProject, reduceMotion]);

  const changeProject = (direction) => {
    setActiveProject((current) => (current + direction + projects.length) % projects.length);
  };

  return (
    <main className="work-showcase-page">
      <section className="work-showcase-hero">
        <motion.div
          className="work-showcase-hero__header"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="work-showcase__eyebrow">
            <span className="work-showcase__eyebrow-dot" />
            Our Work
          </p>
          <h1>
            <span className="work-showcase-hero__title-line">
              <motion.span
                initial={{ y: reduceMotion ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.12, ease: [0.76, 0, 0.24, 1] }}
              >
                Take a look at
              </motion.span>
            </span>
            <span className="work-showcase-hero__title-line">
              <motion.span
                initial={{ y: reduceMotion ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.22, ease: [0.76, 0, 0.24, 1] }}
              >
                our projects
              </motion.span>
            </span>
          </h1>
        </motion.div>

        <motion.p
          className="work-showcase-hero__description"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          Brand identities, websites, apps and video — built by one team and shipped for real businesses.
        </motion.p>
      </section>

      <section className="work-showcase-scroll" aria-label="Selected projects">
        <div className="work-showcase-scroll__hint" aria-hidden="true">
          <span>Selected work</span>
          <span>Scroll to explore <ArrowRight size={14} /></span>
        </div>
        <div
          ref={trackRef}
          className="work-showcase-scroll__track"
          role="region"
          aria-roledescription="carousel"
          aria-label="Scroll horizontally through selected projects"
          tabIndex={0}
        >
          {projects.map((project, index) => (
            <WorkShowcaseCard
              key={project.number}
              project={project}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
        <div className="work-showcase-controls" role="group" aria-label="Project slideshow controls">
          <div className="work-showcase-controls__navigation">
            <button
              className="work-showcase-controls__arrow"
              type="button"
              onClick={() => changeProject(-1)}
              aria-label="Show previous project"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="work-showcase-controls__pagination" role="group" aria-label="Choose a project">
              {projects.map((project, index) => (
                <button
                  key={project.number}
                  type="button"
                  className={index === activeProject ? "is-active" : ""}
                  onClick={() => setActiveProject(index)}
                  aria-label={`Show project ${project.number}: ${project.title}`}
                  aria-pressed={index === activeProject}
                />
              ))}
            </div>
            <button
              className="work-showcase-controls__arrow"
              type="button"
              onClick={() => changeProject(1)}
              aria-label="Show next project"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <button
            className="work-showcase-controls__pause"
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-pressed={isPaused}
          >
            {isPaused ? "Play slideshow" : "Pause slideshow"}
          </button>
        </div>
      </section>

      <section className="work-showcase-list" aria-label="More selected work">
        {projects.map((project, index) => (
          <motion.article
            key={project.number}
            className="work-showcase-list__item"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="work-showcase-list__number">{project.number}</span>
            <div className="work-showcase-list__content">
              <div>
                <p className="work-showcase-list__label">{project.category}</p>
                <h3>{project.title}</h3>
              </div>
              <p className="work-showcase-list__description">{project.description}</p>
            </div>
            <a href={project.href} aria-label={`View ${project.title}`}>
              View project <ArrowUpRight size={16} />
            </a>
          </motion.article>
        ))}
      </section>

      <motion.section
        className="work-showcase-cta"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="work-showcase-cta__eyebrow">Your turn / 04</div>
        <h2>LET&apos;S MAKE<br />THE NEXT ONE<br /><em>YOURS.</em></h2>
        <p>Have a project in mind? Let&apos;s build something worth remembering.</p>
        <a href="/contact">Start a project <ArrowUpRight size={18} /></a>
      </motion.section>
    </main>
  );
}
