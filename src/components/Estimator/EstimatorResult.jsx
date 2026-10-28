import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, Edit, FileText, RefreshCw, Calendar, DollarSign, CheckCircle, Sparkles, TrendingDown } from "lucide-react";

export default function EstimatorResult({ data, apiUrl, onRequestQuote, onStartOver, onRecalculate }) {
  const { estimate, aiInterpretation, formData, estimateId } = data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <motion.div
      className="estimator-result"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="estimator-result__header">
        <div>
          <motion.span
            className="estimator-result__eyebrow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles size={14} /> Preliminary Estimate
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Project Estimate
          </motion.h2>
          {estimateId && <p className="estimator-result__id">Reference: {estimateId}</p>}
        </div>
        <div className="estimator-result__actions">
          <button className="estimator-btn estimator-btn--ghost" onClick={onRecalculate}>
            <Edit size={16} /> Edit Requirements
          </button>
          <button className="estimator-btn estimator-btn--ghost" onClick={onStartOver}>
            <RefreshCw size={16} /> Start New
          </button>
        </div>
      </div>

      <div className="estimator-result__summary">
        <motion.div
          className="estimator-result__summary-card estimator-result__summary-card--primary"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="estimator-result__summary-icon">
            <DollarSign size={28} />
          </div>
          <div>
            <span className="estimator-result__summary-label">Lowest estimated cost</span>
            <h3>{formatCurrency(estimate.minCost)}</h3>
            <div className="estimator-result__range">
              <span>Estimated range</span>
              <strong>{formatCurrency(estimate.minCost)} – {formatCurrency(estimate.maxCost)}</strong>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="estimator-result__summary-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="estimator-result__summary-icon">
            <Calendar size={28} />
          </div>
          <div>
            <span className="estimator-result__summary-label">Estimated timeline</span>
            <h3>{estimate.timeline}</h3>
            <p>From project start to delivery</p>
          </div>
        </motion.div>
      </div>

      <div className="estimator-result__grid">
        <div className="estimator-result__main">
          {aiInterpretation && (
            <motion.section
              className="estimator-result__section estimator-result__section--ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="estimator-result__section-header">
                <Sparkles size={20} />
                <h3>AI Analysis & Insights</h3>
              </div>
              <p className="estimator-result__explanation">{aiInterpretation.explanation}</p>
              {aiInterpretation.scopeSummary && (
                <div className="estimator-result__scope">
                  <h4>Project Scope Summary</h4>
                  <p>{aiInterpretation.scopeSummary}</p>
                </div>
              )}
            </motion.section>
          )}

          <motion.section
            className="estimator-result__section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="estimator-result__section-header">
              <h3>Detailed Breakdown</h3>
            </div>
            <div className="estimator-breakdown">
              {estimate.breakdown?.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="estimator-breakdown__item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                >
                  <div>
                    <span className="estimator-breakdown__label">{item.label}</span>
                    {item.note && <span className="estimator-breakdown__note">{item.note}</span>}
                  </div>
                  <span className="estimator-breakdown__amount">{formatCurrency(item.amount)}</span>
                </motion.div>
              ))}
              <div className="estimator-breakdown__total">
                <span>Total estimated range</span>
                <span>{formatCurrency(estimate.minCost)} – {formatCurrency(estimate.maxCost)}</span>
              </div>
            </div>
          </motion.section>

          {aiInterpretation?.suggestedFeatures && aiInterpretation.suggestedFeatures.length > 0 && (
            <motion.section
              className="estimator-result__section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="estimator-result__section-header">
                <h3>Suggested Additional Features</h3>
              </div>
              <p className="estimator-result__section-subtitle">Optional enhancements to consider</p>
              <ul className="estimator-suggestions">
                {aiInterpretation.suggestedFeatures.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.05 }}
                  >
                    <CheckCircle size={18} />
                    <div>
                      <strong>{feature.name}</strong>
                      {feature.reason && <p>{feature.reason}</p>}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}
        </div>

        <aside className="estimator-result__sidebar">
          <motion.section
            className="estimator-result__section estimator-result__section--saving"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="estimator-result__section-header">
              <TrendingDown size={19} />
              <h3>Keep your budget lean</h3>
            </div>
            <p className="estimator-result__saving-intro">A few choices can help keep your final quote closer to the lower estimate:</p>
            <ul className="estimator-result__saving-list">
              <li>Launch with essential features, then add extras as you grow.</li>
              <li>Choose a standard timeline instead of rush delivery.</li>
              <li>Start with a basic design and build on it later.</li>
            </ul>
            <button className="estimator-btn estimator-btn--ghost estimator-result__saving-action" onClick={onRecalculate}>
              <Edit size={15} /> Review your scope
            </button>
          </motion.section>

          <motion.section
            className="estimator-result__section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="estimator-result__section-header">
              <h3>Your Selections</h3>
            </div>
            <div className="estimator-selected">
              {formData.projectType && (
                <div className="estimator-selected__item">
                  <span className="estimator-selected__label">Project Type</span>
                  <p>{formData.projectType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>
                </div>
              )}
              {formData.features?.length > 0 && (
                <div className="estimator-selected__item">
                  <span className="estimator-selected__label">Selected Features</span>
                  <ul>
                    {formData.features.map((f, idx) => (
                      <li key={idx}>✓ {f}</li>
                    ))}
                  </ul>
                </div>
              )}
              {formData.designLevel && (
                <div className="estimator-selected__item">
                  <span className="estimator-selected__label">Design Level</span>
                  <p>{formData.designLevel.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>
                </div>
              )}
            </div>
          </motion.section>

          <motion.section
            className="estimator-result__section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="estimator-result__section-header">
              <h3>Important Notes</h3>
            </div>
            <ul className="estimator-notes">
              <li><CheckCircle size={14} /> Preliminary estimate, not a final quotation</li>
              <li><CheckCircle size={14} /> Prices may vary based on detailed requirements</li>
              <li><CheckCircle size={14} /> Third-party costs may apply separately</li>
              <li><CheckCircle size={14} /> Recurring costs not included unless specified</li>
              <li><CheckCircle size={14} /> All prices in Indian Rupees (INR)</li>
            </ul>
          </motion.section>

          <motion.div
            className="estimator-result__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button className="estimator-btn estimator-btn--primary estimator-btn--full" onClick={onRequestQuote}>
              <FileText size={18} /> Request Detailed Quote <ArrowUpRight size={18} />
            </button>
            <button className="estimator-btn estimator-btn--secondary estimator-btn--full" onClick={handleDownloadPDF}>
              <Download size={18} /> Download / Print
            </button>
          </motion.div>
        </aside>
      </div>
    </motion.div>
  );
}
