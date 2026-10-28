import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    number: "01",
    name: "EquipTradeindia.com",
    category: "Marketplace",
    description: "Industrial equipment marketplace with OTP verification and modern listing system.",
    tags: ["React", "Node.js", "MongoDB", "Cloudinary"],
    image: "/projects/equiptrade.png",
    href: "https://equiptradeindia.com",
  },
  {
    number: "02",
    name: "ALEX Graphic Design Studio",
    category: "Creative Studio",
    description: "Creative studio website with portfolio, design catalogue and real-time feedback.",
    tags: ["React", "Tailwind CSS", "Socket.io", "Vercel"],
    image: "/projects/alex-studio.png",
    href: "https://alex-1-4pcw.onrender.com",
  },
  
  {
    number: "03",
    name: "Appointment Management",
    category: "Dashboard",
    description: "patient management system.",
    tags: ["React", "Node.js", "MongoDB", "Cloudinary"],
    image: "/projects/dental.png",
    href: "https://appointmentsystemdemo.onrender.com/",
  },
];

export default function SelectedWork() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="selected-work" id="work" aria-labelledby="selected-work-title">
      <div className="selected-work__inner">
        <motion.div
          className="selected-work__intro"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="selected-work__eyebrow">02 / Selected work</span>
            <h2 id="selected-work-title">Projects we&apos;re<br /><em>proud of.</em></h2>
          </div>
          <p>A closer look at digital experiences made for ambitious brands.</p>
        </motion.div>

        <div className="selected-work__grid" aria-label="Selected projects">
          {projects.map((project, index) => (
            <motion.a
              className="selected-work__card"
              href={project.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.name} project`}
              key={project.number}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              transition={{
                duration: reduceMotion ? 0 : 0.65,
                delay: reduceMotion ? 0 : index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="selected-work__image">
                <img src={project.image} alt={`${project.name} website preview`} loading="lazy" />
                <span className="selected-work__category">{project.category}</span>
              </div>
              <div className="selected-work__details">
                <div className="selected-work__title-row">
                  <h3>{project.name}</h3>
                  <span className="selected-work__arrow" aria-hidden="true">
                    <ArrowUpRight size={19} />
                  </span>
                </div>
                <p className="selected-work__description">{project.description}</p>
                <ul className="selected-work__tags" aria-label={`${project.name} technologies`}>
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="selected-work__outro">
          <span>More projects coming soon.</span>
          <a href="/our-work">View all work <ArrowUpRight size={16} /></a>
        </div>
      </div>
    </section>
  );
}
