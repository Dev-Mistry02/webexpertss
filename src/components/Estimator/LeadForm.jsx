import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, LoaderCircle, Send } from "lucide-react";

export default function LeadForm({ estimateData, apiUrl, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    projectDescription: "",
    preferredContact: "email",
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email required";
    if (!formData.projectDescription.trim()) newErrors.projectDescription = "Please describe your project";
    if (!formData.consent) newErrors.consent = "Consent is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estimateId: estimateData.estimateId,
          estimate: estimateData.estimate,
          formData: estimateData.formData,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to submit");
      onSuccess(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="estimator-lead"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="estimator-lead__header">
        <button className="estimator-btn estimator-btn--ghost" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Estimate
        </button>
        <h2>Request Detailed Quote</h2>
        <p>Share your contact details and we'll get back with a detailed quotation</p>
      </div>

      <form onSubmit={handleSubmit} className="estimator-lead__form">
        <div className="estimator-form-row">
          <div className="estimator-form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "has-error" : ""}
            />
            {errors.name && <small className="estimator-field-error">{errors.name}</small>}
          </div>
          <div className="estimator-form-group">
            <label>Business Name (optional)</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            />
          </div>
        </div>

        <div className="estimator-form-row">
          <div className="estimator-form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? "has-error" : ""}
            />
            {errors.email && <small className="estimator-field-error">{errors.email}</small>}
          </div>
          <div className="estimator-form-group">
            <label>Phone Number (optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="estimator-form-group">
          <label>Preferred Contact Method</label>
          <select
            value={formData.preferredContact}
            onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <div className="estimator-form-group">
          <label>Project Description *</label>
          <textarea
            value={formData.projectDescription}
            onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
            placeholder="Tell us more about your project goals, target audience, and specific requirements..."
            rows="5"
            className={errors.projectDescription ? "has-error" : ""}
          />
          {errors.projectDescription && <small className="estimator-field-error">{errors.projectDescription}</small>}
        </div>

        <div className="estimator-form-group">
          <label className="estimator-checkbox">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            />
            <span>I consent to be contacted by WebExpertss regarding this project *</span>
          </label>
          {errors.consent && <small className="estimator-field-error">{errors.consent}</small>}
        </div>

        {error && <div className="estimator-error">{error}</div>}

        <button type="submit" className="estimator-btn estimator-btn--primary" disabled={loading}>
          {loading ? (
            <>
              <LoaderCircle className="estimator-spinner" size={18} /> Submitting...
            </>
          ) : (
            <>
              <Send size={18} /> Submit Quote Request
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
