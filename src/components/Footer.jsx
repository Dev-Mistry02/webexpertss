import React from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Instagram, Linkedin, Mail, MapPin, MessageCircle, X } from "lucide-react";

const learnLinks = [
  { label: "Services", href: "/#services" },
  { label: "Studio", href: "/#studio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Our work", href: "/our-work" },
  { label: "Contact", href: "/contact" },
];

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/our-work" },
  { label: "Services", href: "/#services" },
  { label: "Get in touch", href: "/contact" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", Icon: Linkedin },
  { label: "WhatsApp", href: "https://wa.me/918141368777", Icon: MessageCircle },
  { label: "X", href: "https://x.com/", Icon: X },
  { label: "Instagram", href: "https://www.instagram.com/", Icon: Instagram },
];

function FooterLinkColumn({ title, links }) {
  return (
    <div className="footer-reference__column">
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.label}><a href={link.href}>{link.label}</a></li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer-reference">
      <nav className="footer-reference__socials" aria-label="Social media">
        {socialLinks.map(({ label, href, Icon }) => (
          <a href={href} key={label} aria-label={label} target="_blank" rel="noreferrer">
            <Icon size={16} strokeWidth={1.8} />
          </a>
        ))}
      </nav>
      <a
        className="footer-reference__top-tab"
        href="#top"
        onClick={(event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        Back to top <ArrowUp size={13} />
      </a>

      <div className="footer-reference__panel">
        <motion.div
          className="footer-reference__content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="footer-reference__invite">
            <a className="footer-reference__brand" href="/" aria-label="WebExpertss home">
              <span className="footer-reference__mark" aria-hidden="true">W/E</span>
              <span>WebExpertss<i>.</i></span>
            </a>
            <h2>Do you like<br />what you see?</h2>
            <div className="footer-reference__cta-row">
              <a className="footer-reference__cta" href="/estimator">
                Get Free Estimate <ArrowUpRight size={17} />
              </a>
              <span>Thoughtful work.<br />Built around your brief.</span>
            </div>
          </div>

          <FooterLinkColumn title="Learn" links={learnLinks} />
          <FooterLinkColumn title="Explore" links={exploreLinks} />

          <div className="footer-reference__column footer-reference__contact">
            <h3>Get in touch</h3>
            <a href="mailto:hello@webexpertss.com">
              <Mail size={14} /> hello@webexpertss.com
            </a>
            <p><MapPin size={14} /> India</p>
          </div>
        </motion.div>

        <div className="footer-reference__statement" aria-label="Designing what is next">
          <span>DESIGNING</span>
          <span>WHAT&apos;S NEXT.</span>
        </div>

        <div className="footer-reference__legal">
          <a className="footer-reference__legal-brand" href="/">W/E WebExpertss.</a>
          <span>© 2026 WebExpertss</span>
          <span>Made with intention.</span>
        </div>
      </div>
    </footer>
  );
}
