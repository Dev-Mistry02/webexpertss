import React, { useState } from "react";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";

const services = [
  {
    number: "01",
    title: "WEB DESIGN & DEVELOPMENT",
    description: "High-performance websites combining thoughtful design, responsive experiences and clean engineering.",
    preview: "browser",
  },
  {
    number: "02",
    title: "WEB APPLICATIONS",
    description: "Scalable web applications built around real business requirements, workflows and users.",
    preview: "dashboard",
  },
  {
    number: "03",
    title: "APP DEVELOPMENT",
    description: "Scalable mobile applications built around real business requirements, workflows and users.",
    preview: "mobile",
  },
  {
    number: "04",
    title: "BRAND IDENTITY",
    description: "Distinctive visual identities that give businesses a recognizable and consistent presence.",
    preview: "identity",
  },
  {
    number: "05",
    title: "DIGITAL SOLUTIONS",
    description: "Custom digital tools and systems designed to solve specific business problems.",
    preview: "systems",
  },
  {
    number: "06",
    title: "CREATIVE DEVELOPMENT",
    description: "Interactive, motion-driven and experimental digital experiences that push beyond ordinary websites.",
    preview: "creative",
  },
  

];

function ServicePreview({ type, floating = false }) {
  return (
    <div className={`service-preview service-preview--${type}${floating ? " service-preview--floating" : ""}`}>
      {type === "browser" && <><div className="service-preview__bar" /><div className="service-preview__hero">MAKE<br /><em>MEANING.</em></div><div className="service-preview__line" /></>}
      {type === "dashboard" && <><div className="service-preview__bar" /><div className="service-preview__dashboard"><i /><i /><i /><b /><b /><b /></div></>}
      {type === "mobile" && <><div className="service-preview__phone"><span /><b>GOOD<br /><em>IDEAS</em><br />MOVE.</b><i /></div></>}
      {type === "identity" && <><div className="service-preview__identity">Aa</div><div className="service-preview__identity-label">A distinct point<br />of view.</div></>}
      {type === "systems" && <><div className="service-preview__nodes"><i /><i /><i /><i /><b /><b /><b /></div><span className="service-preview__system-label">CONNECTED / 001</span></>}
      {type === "creative" && <><div className="service-preview__rings" /><div className="service-preview__creative-label">PLAY / EXPLORE / REPEAT</div><span></span></>}
      
    </div>
  );
}

function ServiceRow({ service, index, active, onToggle, onHover }) {
  return (
    <motion.div
      className={`services-row${active ? " is-active" : ""}`}
      onMouseEnter={(event) => onHover(service, event)}
      onMouseMove={(event) => onHover(service, event)}
      onMouseLeave={() => onHover(null)}
    >
      <button className="services-row__trigger" type="button" onClick={() => onToggle(service.number)} aria-expanded={active}>
        <span className="services-row__number">{service.number}</span>
        <span className="services-row__title">{service.title}</span>
        <span className="services-row__arrow"><ArrowUpRight size={22} /></span>
        <span className="services-row__plus"><Plus size={20} /></span>
      </button>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div className="services-row__details" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <p>{service.description}</p>
            <ServicePreview type={service.preview} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Services() {
  const [activeService, setActiveService] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const cursorX = useSpring(0, { stiffness: 260, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 260, damping: 28 });

  function handleHover(service, event) {
    setHoveredService(service);
    if (service && event) {
      cursorX.set(event.clientX + 26);
      cursorY.set(event.clientY + 26);
    }
  }

  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="services__intro">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}>
          <span className="services__eyebrow">03 / Services</span>
          <h2 id="services-title">WHAT WE<br />DO <em>BEST.</em></h2>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: .75, delay: .12 }}>
          From first idea to final launch, we create digital experiences designed to move businesses forward.
        </motion.p>
      </div>

      <div className="services__list" onMouseLeave={() => setHoveredService(null)}>
        {services.map((service, index) => (
          <ServiceRow
            key={service.number}
            service={service}
            index={index}
            active={activeService === service.number}
            onToggle={(number) => setActiveService((current) => current === number ? null : number)}
            onHover={handleHover}
          />
        ))}
      </div>

      <AnimatePresence>
        {hoveredService && (
          <motion.div className="services-cursor-preview" style={{ x: cursorX, y: cursorY }} initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .85 }} transition={{ duration: .2 }}>
            <ServicePreview type={hoveredService.preview} floating />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="services__outro">
        <span>Not sure what you need?</span>
        <a href="#contact">Let&apos;s figure it out together <ArrowUpRight size={17} /></a>
      </div>
    </section>
  );
}
