import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Github, Instagram, Linkedin, LoaderCircle, Mail, MessageCircle } from "lucide-react";

const contactDetails = {
  email: "mistrydev812@gmail.com",
  location: "India",
  availability: "Available for selected projects",
  socials: [
    ["Instagram", Instagram],
    ["LinkedIn", Linkedin],
    ["GitHub", Github],
  ],
};

const WHATSAPP_URL = "https://wa.me/918141368777";
const API_URL = (import.meta.env.VITE_API_URL ?? "https://webexperts-backend.onrender.com").replace(/\/+$/, "");
const projectTypes = ["Website", "Web Application", "UI/UX Design", "Branding", "Digital Solution", "Something Else"];
const budgets = ["₹25K — ₹50K", "₹50K — ₹1L", "₹1L — ₹2L", "₹2L+", "Let's discuss"];

const initialForm = { name: "", email: "", company: "", type: "", budget: "", message: "" };

function Field({ number, label, name, value, onChange, error, children, ...props }) {
  return (
    <motion.div className={`contact-field${error ? " has-error" : ""}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .5 }}>
      <span className="contact-field__number">{number}</span>
      <label htmlFor={name}>{label}</label>
      {children || <input id={name} name={name} value={value} onChange={onChange} {...props} />}
      {error && <small role="alert">{error}</small>}
    </motion.div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(() => {
    const packageName = new URLSearchParams(window.location.search).get("package");
    const availablePackages = ["Starter", "Professional", "Custom Solutions"];
    return {
      ...initialForm,
      message: availablePackages.includes(packageName)
        ? `I'm interested in the ${packageName} package. `
        : initialForm.message,
    };
  });
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const reduceMotion = useReducedMotion();

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitState("idle");
    setSubmitMessage("");
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Please enter a valid email.";
    if (!form.type) nextErrors.type = "Please choose what you need.";
    if (!form.message.trim()) nextErrors.message = "Please tell us a little about the project.";
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setSubmitState("idle");
      setSubmitMessage("");
      return;
    }

    setSubmitState("sending");
    setSubmitMessage("Sending your enquiry...");
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "content-type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "We couldn't send your enquiry. Please try again shortly.");
      }

      setSubmitState("success");
      setSubmitMessage(result?.message || "Thanks — your project enquiry has been sent.");
      setForm(initialForm);
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setSubmitState("error");
      setSubmitMessage(error instanceof Error
        ? error.message
        : "We couldn't send your enquiry. Please try again shortly.");
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-page__hero">
        <div>
          <motion.span
            className="contact-page__eyebrow"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : .55, ease: [0.22, 1, 0.36, 1] }}
          >
            webexpertss / Contact
          </motion.span>
          <h1>
            <span className="contact-page__title-line">
              <motion.span
                initial={{ y: reduceMotion ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: reduceMotion ? 0 : .8, delay: reduceMotion ? 0 : .1, ease: [0.76, 0, 0.24, 1] }}
              >
                LET&apos;S BUILD
              </motion.span>
            </span>
            <span className="contact-page__title-line">
              <motion.span
                initial={{ y: reduceMotion ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: reduceMotion ? 0 : .8, delay: reduceMotion ? 0 : .2, ease: [0.76, 0, 0.24, 1] }}
              >
                SOMETHING
              </motion.span>
            </span>
            <span className="contact-page__title-line">
              <motion.span
                initial={{ y: reduceMotion ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: reduceMotion ? 0 : .8, delay: reduceMotion ? 0 : .3, ease: [0.76, 0, 0.24, 1] }}
              >
                <em>GREAT.</em>
              </motion.span>
            </span>
          </h1>
        </div>
        <motion.div
          className="contact-page__hero-side"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : .8, delay: reduceMotion ? 0 : .35 }}
        >
          <p>Have an idea, a problem to solve, or a project in mind? Tell us what you&apos;re thinking.</p>
            <a href="/estimator" className="contact-page__hero-link">
              Get Free Estimate <ArrowDown size={16} />
            </a>
          <span className="contact-page__hero-index">Independent digital studio / India</span>
        </motion.div>
      </section>

      <div className="contact-page__body">
        <motion.aside className="contact-details" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }}>
          <span className="contact-page__label">Good work starts here</span>
          <div className="contact-details__availability"><span /> {contactDetails.availability}</div>
          <dl>
            <div><dt>Email</dt><dd><a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></dd></div>
            <div><dt>Location</dt><dd>{contactDetails.location}</dd></div>
          </dl>
          <a className="contact-details__email-link" href={`mailto:${contactDetails.email}`}>
            <Mail size={17} /> Send us an email <ArrowUpRight size={16} />
          </a>
          <div className="contact-socials"><span>Find us elsewhere</span>{contactDetails.socials.map(([name, Icon]) => <a href="#" key={name}>{name} <Icon size={14} /></a>)}</div>
        </motion.aside>

        <section className="contact-form-section" id="contact-form" aria-labelledby="contact-form-title">
          <span className="contact-form-section__eyebrow">01 — Project enquiry</span>
          <h2 id="contact-form-title">Let&apos;s make<br />something matter.</h2>
          <p className="contact-form-section__intro">A few details will help us understand what you need and how we can help.</p>
          <form onSubmit={handleSubmit} noValidate>
            <Field number="01" label="Your name" name="name" value={form.name} onChange={updateField} error={errors.name} autoComplete="name" />
            <Field number="02" label="Email address" name="email" type="email" value={form.email} onChange={updateField} error={errors.email} autoComplete="email" />
            <Field number="03" label="Company / brand" name="company" value={form.company} onChange={updateField} autoComplete="organization" />
            <Field number="04" label="What do you need?" name="type" value={form.type} onChange={updateField} error={errors.type}>
              <select id="type" name="type" value={form.type} onChange={updateField}><option value="">Select a service</option>{projectTypes.map((option) => <option key={option}>{option}</option>)}</select>
            </Field>
            <Field number="05" label="Project budget" name="budget" value={form.budget} onChange={updateField}>
              <select id="budget" name="budget" value={form.budget} onChange={updateField}><option value="">Select a range</option>{budgets.map((option) => <option key={option}>{option}</option>)}</select>
            </Field>
            <Field number="06" label="Tell us about the project" name="message" value={form.message} onChange={updateField} error={errors.message}>
              <textarea id="message" name="message" value={form.message} onChange={updateField} placeholder="Tell us what you're building, what problem you're solving, and what you have in mind..." rows="5" />
            </Field>
            <button className={`contact-submit${submitState === "sending" ? " is-sending" : ""}`} type="submit" disabled={submitState === "sending"} aria-busy={submitState === "sending"}>
              {submitState === "sending" ? "Sending..." : "Send project enquiry"}
              {submitState === "sending"
                ? <LoaderCircle className="contact-submit__spinner" size={20} aria-hidden="true" />
                : <ArrowUpRight size={20} aria-hidden="true" />}
            </button>
            {submitMessage && (
              <p className={`contact-form-status${submitState === "error" ? " contact-form-status--error" : ""}${submitState === "sending" ? " contact-form-status--sending" : ""}`} role={submitState === "error" ? "alert" : "status"} aria-live={submitState === "error" ? "assertive" : "polite"}>
                {submitMessage}
                {submitState === "sending" && <span className="contact-form-status__progress" aria-hidden="true"><span /></span>}
              </p>
            )}
          </form>
        </section>
      </div>

      <section className="contact-quick-chat">
        <div><span className="contact-quick-chat__eyebrow">Rather talk it through?</span><p>We&apos;re happy to start with a quick conversation.</p></div>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Chat on WhatsApp <ArrowUpRight size={16} /></a>
      </section>
      <section className="contact-signature">
        <span>Good projects start with a good conversation.</span>
      </section>
      {/* <section className="contact-final-cta"><span className="contact-page__eyebrow">Not ready yet?</span><h2>THAT&apos;S<br /><em>OKAY.</em></h2><p>Explore our work and come back when you&apos;re ready.</p><a href="/work">View our work <ArrowUpRight size={17} /></a></section> */}
      {/* <footer className="contact-footer"><div><a className="contact-footer__wordmark" href="/">webexpertss<span>.</span></a><p>Designing and building digital experiences that move businesses forward.</p></div><nav><a href="/work">Work</a><a href="#services">Services</a><a href="#studio">Studio</a><a href="/contact">Contact</a></nav><small>© 2026 webexpertss</small></footer> */}
    </main>
  );
}
