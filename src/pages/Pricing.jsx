import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, MessageCircle, Sparkles } from "lucide-react";

const packages = [
  {
    name: "Starter",
    price: "₹7,999+",
    summary: "A polished starting point for a business ready to get online.",
    features: [
      "Landing page or basic business website",
      "Responsive design",
      "Contact form",
      "WhatsApp integration",
      "Basic SEO setup",
    ],
  },
  {
    name: "Professional",
    price: "₹19,999+",
    summary: "A custom digital experience built to help your business grow.",
    features: [
      "Multi-page website",
      "Custom UI/UX design",
      "Thoughtful animations",
      "API integrations",
      "SEO foundations",
      "Deployment and launch",
    ],
    popular: true,
  },
  {
    name: "Custom Solutions",
    price: "Custom Quote",
    summary: "Purpose-built platforms for more complex ideas and workflows.",
    features: [
      "E-commerce websites and marketplaces",
      "Full-stack web applications",
      "Authentication and user roles",
      "Custom admin dashboards",
      "Third-party integrations",
    ],
  },
];

const addOns = [
  ["Website maintenance", "Ongoing updates, improvements and technical care."],
  ["Hosting & deployment", "A production-ready home for your website and app."],
  ["Additional pages", "Extend your website as your content and services grow."],
  ["Other services", "SEO, content, integrations and tailored enhancements."],
];

const comparisonRows = [
  ["Website type", "Landing / basic business", "Multi-page website", "E-commerce / custom platform"],
  ["Responsive design", true, true, true],
  ["Custom UI/UX", "Essential", true, true],
  ["Animations", "—", true, true],
  ["Contact form", true, true, true],
  ["API integrations", "—", "Selected integrations", "Custom integrations"],
  ["SEO setup", "Basic", "SEO foundations", "Scoped to requirements"],
  ["Deployment", "Included", "Included", "Scoped to requirements"],
  ["Authentication & dashboard", "—", "—", "Available"],
];

const faqs = [
  ["How do payments work?", "Projects are typically split into clear milestones. The exact schedule and payment terms are confirmed in your proposal before work begins."],
  ["How long does a project take?", "Delivery depends on the scope, content readiness and feedback. We’ll agree on a realistic timeline after discussing your project."],
  ["How many revisions are included?", "The revision rounds and approval points are outlined in your project proposal so expectations are clear from the start."],
  ["Are hosting and domain costs included?", "Third-party hosting and domain fees are usually billed separately to you by the provider. We can help you choose and configure the right services."],
  ["Do you offer maintenance?", "Yes. Ongoing maintenance and support can be added to your project and scoped around the level of care you need."],
  ["What support is available after launch?", "We’ll agree on post-launch support as part of your proposal. Extended support and future improvements can be arranged separately."],
];

const WHATSAPP_NUMBER = "918141368777";

function contactHref(packageName) {
  return `/contact?package=${encodeURIComponent(packageName)}#contact-form`;
}

function whatsappHref(packageName) {
  const message = `Hi WebExpertss, I'm interested in the ${packageName} package.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PricingCard({ plan, index }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`pricing-card${plan.popular ? " pricing-card--popular" : ""}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={reduceMotion ? undefined : { y: -7 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {plan.popular && <span className="pricing-card__popular"><Sparkles size={13} /> Most Popular</span>}
      <div className="pricing-card__heading">
        <span className="pricing-card__index">0{index + 1} / Package</span>
        <h2>{plan.name}</h2>
        <p>{plan.summary}</p>
      </div>
      <p className="pricing-card__price">{plan.price}<span>{plan.price === "Custom Quote" ? "" : " starting"}</span></p>
      <ul className="pricing-card__features">
        {plan.features.map((feature) => (
          <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>
        ))}
      </ul>
      <div className="pricing-card__actions">
        <a className="pricing-card__primary" href={contactHref(plan.name)}>
          Discuss this package <ArrowUpRight size={17} />
        </a>
        <a className="pricing-card__whatsapp" href={whatsappHref(plan.name)} target="_blank" rel="noreferrer">
          <MessageCircle size={16} /> Ask on WhatsApp
        </a>
      </div>
    </motion.article>
  );
}

export default function Pricing() {
  return (
    <main className="pricing-page">
      <section className="pricing-hero" aria-labelledby="pricing-title">
        <div className="pricing-hero__glow" aria-hidden="true" />
        <Reveal className="pricing-hero__content">
          <span className="pricing-eyebrow"><i /> Pricing / Built around your brief</span>
          <h1 id="pricing-title">Transparent Pricing.<br />Exceptional Digital<br /><em>Experiences.</em></h1>
          <p>Clear starting points for your next big idea. Choose a package to begin the conversation—every final quote is tailored to your project scope.</p>
          <a className="pricing-hero__link" href="#packages">Explore packages <ArrowRight size={17} /></a>
        </Reveal>
        <span className="pricing-hero__index" aria-hidden="true">W/E — 01</span>
      </section>

      <section className="pricing-section pricing-packages" id="packages" aria-labelledby="packages-title">
        <Reveal className="pricing-section__heading">
          <div><span className="pricing-eyebrow">01 / Find your starting point</span><h2 id="packages-title">Made to move<br /><em>you forward.</em></h2></div>
          <p>Each package is a starting point. We’ll shape the right solution together once we understand your goals.</p>
        </Reveal>
        <div className="pricing-grid">
          {packages.map((plan, index) => <PricingCard plan={plan} index={index} key={plan.name} />)}
        </div>
        <p className="pricing-disclaimer">Prices shown are starting prices. Final quotations depend on project requirements, content, integrations and overall scope.</p>
      </section>

      <section className="pricing-section pricing-addons" aria-labelledby="addons-title">
        <Reveal className="pricing-section__heading pricing-section__heading--compact">
          <div><span className="pricing-eyebrow">02 / Make it yours</span><h2 id="addons-title">Optional <em>add-ons.</em></h2></div>
          <p>Extend your project with the extra support and capabilities your business needs.</p>
        </Reveal>
        <div className="pricing-addons__grid">
          {addOns.map(([title, description], index) => (
            <Reveal className="pricing-addon" delay={index * 0.06} key={title}>
              <span className="pricing-addon__number">0{index + 1}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
              <span className="pricing-addon__scope">Scoped to your needs</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pricing-section pricing-comparison" aria-labelledby="comparison-title">
        <Reveal className="pricing-section__heading pricing-section__heading--compact">
          <div><span className="pricing-eyebrow">03 / At a glance</span><h2 id="comparison-title">Compare the<br /><em>packages.</em></h2></div>
          <p>Not sure where to start? This overview helps you see what each package is designed to cover.</p>
        </Reveal>
        <div className="pricing-table-wrap" role="region" aria-label="Package comparison" tabIndex={0}>
          <table className="pricing-table">
            <thead><tr><th scope="col">Included</th><th scope="col">Starter</th><th scope="col">Professional <span>Popular</span></th><th scope="col">Custom Solutions</th></tr></thead>
            <tbody>
              {comparisonRows.map(([label, ...values]) => (
                <tr key={label}><th scope="row">{label}</th>{values.map((value, index) => (
                  <td key={`${label}-${index}`}>{value === true ? <Check className="pricing-table__check" size={17} aria-label="Included" /> : value === false ? <span className="pricing-table__dash" aria-label="Not included">—</span> : value}</td>
                ))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pricing-section pricing-faq" aria-labelledby="faq-title">
        <Reveal className="pricing-section__heading pricing-section__heading--compact">
          <div><span className="pricing-eyebrow">04 / Good to know</span><h2 id="faq-title">A few things,<br /><em>answered.</em></h2></div>
          <p>Have another question? Tell us about it and we’ll be happy to help.</p>
        </Reveal>
        <div className="pricing-faq__list">
          {faqs.map(([question, answer], index) => (
            <Reveal className="pricing-faq__item" delay={index * 0.035} key={question}>
              <details>
                <summary><span className="pricing-faq__number">0{index + 1}</span>{question}<span className="pricing-faq__plus" aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pricing-cta" aria-labelledby="pricing-cta-title">
        <Reveal>
          <span className="pricing-eyebrow">05 / Your idea starts here</span>
          <h2 id="pricing-cta-title">Have a unique idea?<br /><em>Let’s build it.</em></h2>
          <p>Tell us what you’re imagining. We’ll help you find the right approach, team and investment.</p>
          <div className="pricing-cta__actions">
            <a className="pricing-cta__primary" href="/estimator">Get Free Estimate <ArrowUpRight size={18} /></a>
            <a className="pricing-cta__secondary" href={whatsappHref("a custom project")} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp inquiry</a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
