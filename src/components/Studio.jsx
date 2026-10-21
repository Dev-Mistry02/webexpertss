import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const teamMembers = [
  { number: "01", name: "Dev Mistry", role: "FOUNDER / DEVELOPER", description: "Turns ideas into scalable digital products.", image: "/team/dev-mistry.png" },
  { number: "02", name: "Khushi Patel", role: "CREATIVE / DESIGNER", description: "Turns concepts into visual experiences.", image: "/team/khushi-patel.png" },
];

const principles = [
  ["01", "THINK DIFFERENT", "We question the obvious before building it."],
  ["02", "KEEP IT SIMPLE", "Complex problems deserve simple experiences."],
  ["03", "BUILD WITH PURPOSE", "Every interaction should have a reason."],
  ["04", "OBSESS OVER DETAILS", "The smallest details often make the biggest difference."],
];

const stats = [
  ["10+", "PROJECTS"],
  ["05+", "CLIENTS"],
  ["03+", "YEARS OF EXPERIENCE"],
  ["100%", "COMMITMENT"],
];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Studio() {
  return (
    <section className="studio" id="studio" aria-labelledby="studio-title">
      <div className="studio__signature" aria-hidden="true">
        <motion.span animate={{ rotate: [0, 5, 0], y: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>W/E</motion.span>
        <i /><i /><i />
      </div>

      <Reveal className="studio__header">
        <span className="studio__eyebrow">04 / The studio</span>
        <h2 id="studio-title">SMALL TEAM.<br />BIG <em>IDEAS.</em><br />REAL RESULTS.</h2>
      </Reveal>

      <div className="studio__introduction">
        <Reveal><span className="studio__label">Who we are</span></Reveal>
        <Reveal delay=".1">
          <p>webexpertss is an independent digital studio focused on creating meaningful digital experiences for businesses that want to stand out.</p>
          <p>We bring design, technology and strategy together to turn ideas into brands, websites and digital products that people remember.</p>
        </Reveal>
      </div>

      {/* <div className="studio__statement" aria-label="Our philosophy">
        {["WE DON'T BELIEVE IN", "ONE-SIZE-FITS-ALL", "DIGITAL EXPERIENCES."].map((line, index) => (
          <Reveal key={line} delay={index * .08}><span>{line}</span></Reveal>
        ))}
      </div> */}

      <div className="studio__team">
        <Reveal className="studio__subheading"><span className="studio__label">The people behind it</span></Reveal>
        <div className="studio__team-grid">
          {teamMembers.map((member, index) => (
            <Reveal className="studio-member" delay={index * .08} key={member.number}>
              <div className="studio-member__portrait">
                <span>{member.number}</span>
                {member.image && <img src={member.image} alt={`${member.name} portrait`} />}
                <i />
              </div>
              <div className="studio-member__meta">
                <div><h3>{member.name}</h3><span>{member.role}</span></div>
                <ArrowUpRight size={20} />
              </div>
              <p>{member.description}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* <div className="studio__principles">
        <Reveal className="studio__subheading"><span className="studio__label">How we think</span></Reveal>
        <div className="studio-principles">
          {principles.map(([number, title, description], index) => (
            <Reveal className="studio-principle" delay={index * .05} key={number}>
              <span>{number}</span><h3>{title}</h3><p>{description}</p><ArrowUpRight size={18} />
            </Reveal>
          ))}
        </div>
      </div> */}

      <div className="studio__stats">
        {stats.map(([value, label], index) => (
          <Reveal className="studio-stat" delay={index * .05} key={label}>
            <strong>{value}</strong><span>{label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
