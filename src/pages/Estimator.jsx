import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Calculator, RefreshCw } from "lucide-react";
import EstimatorWizard from "../components/Estimator/EstimatorWizard";
import EstimatorResult from "../components/Estimator/EstimatorResult";
import LeadForm from "../components/Estimator/LeadForm";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

export default function Estimator() {
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState("wizard"); // wizard | result | lead
  const [estimateData, setEstimateData] = useState(null);
  const [quoteData, setQuoteData] = useState(null);

  const handleEstimateComplete = (data) => {
    setEstimateData(data);
    setView("result");
  };

  const handleRequestQuote = () => {
    setView("lead");
  };

  const handleBackToResult = () => {
    setView("result");
  };

  const handleStartOver = () => {
    setEstimateData(null);
    setQuoteData(null);
    setView("wizard");
  };

  return (
    <main className="estimator-page">
      <section className="estimator-page__hero">
        <div>
          <motion.span
            className="estimator-page__eyebrow"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            webexpertss / Project Estimator
          </motion.span>
          <h1>
            <span className="estimator-page__title-line">
              <motion.span
                initial={{ y: reduceMotion ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.1, ease: [0.76, 0, 0.24, 1] }}
              >
              ESTIMATE
              </motion.span>
            </span>
            <span className="estimator-page__title-line">
              <motion.span
                initial={{ y: reduceMotion ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.2, ease: [0.76, 0, 0.24, 1] }}
              >
                YOUR PROJECT
              </motion.span>
            </span>
            <span className="estimator-page__title-line">
              <motion.span
                initial={{ y: reduceMotion ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.3, ease: [0.76, 0, 0.24, 1] }}
              >
                <em>COST.</em>
              </motion.span>
            </span>
          </h1>
        </div>
        <motion.div
          className="estimator-page__hero-side"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.35 }}
        >
          <p>Tell us what you want to build. Get an estimated budget, timeline, and a personalized project breakdown in minutes.</p>
          <a className="estimator-page__hero-link" href="#estimator-wizard">
            Start estimating <ArrowDown size={16} />
          </a>
          <span className="estimator-page__hero-index">AI-Powered • Transparent • Preliminary</span>
        </motion.div>
      </section>

      <section id="estimator-wizard" className="estimator-section">
        {view === "wizard" && (
          <EstimatorWizard apiUrl={API_URL} onComplete={handleEstimateComplete} />
        )}
        {view === "result" && estimateData && (
          <EstimatorResult
            data={estimateData}
            apiUrl={API_URL}
            onRequestQuote={handleRequestQuote}
            onStartOver={handleStartOver}
            onRecalculate={() => setView("wizard")}
          />
        )}
        {view === "lead" && estimateData && (
          <LeadForm
            estimateData={estimateData}
            apiUrl={API_URL}
            onBack={handleBackToResult}
            onSuccess={(data) => {
              setQuoteData(data);
              setView("result");
            }}
          />
        )}
      </section>

      <section className="estimator-info">
        <div>
          <span className="estimator-info__eyebrow">Important Note</span>
          <p>All estimates are preliminary and subject to review. Final pricing depends on detailed requirements, third-party costs, and project scope changes.</p>
        </div>
      </section>
    </main>
  );
}
