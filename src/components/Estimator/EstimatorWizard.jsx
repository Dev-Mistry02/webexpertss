import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";

const projectTypes = [
  { id: "business", label: "Business / Corporate Website" },
  { id: "portfolio", label: "Portfolio Website" },
  { id: "landing", label: "Landing Page" },
  { id: "ecommerce", label: "E-commerce Website"},
  { id: "restaurant", label: "Restaurant / QR Ordering" },
  { id: "booking", label: "Appointment Booking" },
  { id: "webapp", label: "Custom Web Application"},
  { id: "saas", label: "SaaS Platform"},
  { id: "crm", label: "CRM / Admin Dashboard"},
  { id: "ai", label: "AI-Powered Application" },
  { id: "custom", label: "Other / Custom Project"},
];

const features = [
  "Custom UI/UX Design",
  "Mobile Responsiveness",
  "Authentication & User Profiles",
  "Admin Dashboard",
  "Database Integration",
  "Search & Filtering",
  "Email Notifications",
  "Payment Gateway",
  "Third-party API Integrations",
  "File & Image Uploads",
  "Analytics & Reporting",
  "AI Integration",
  "Real-time Features",
  "Deployment & Hosting Setup",
  "Maintenance & Support",
];

const designOptions = [
  { id: "basic", label: "Basic Design", desc: "Clean & simple" },
  { id: "premium", label: "Premium Custom Design", desc: "Polished & unique" },
  { id: "advanced", label: "Advanced UI/UX with Animations", desc: "Rich interactions" },
  { id: "fully_custom", label: "Fully Customized Interface", desc: "Bespoke experience" },
];

export default function EstimatorWizard({ apiUrl, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: "",
    pages: "",
    features: [],
    customRequirements: "",
    designLevel: "",
    hasFigma: false,
    designReferences: "",
    hasBranding: false,
    existingWebsite: "",
    isGreenfield: true,
    userRoles: "1",
    expectedTraffic: "low",
    needsHosting: false,
    timelineUrgency: "standard",
    preferredLaunch: "",
    budgetRange: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 5;

  const handleNext = () => {
    if (step === 1 && !formData.projectType) {
      setError("Please select a project type");
      return;
    }
    if (step === 3 && !formData.designLevel) {
      setError("Please select a design level");
      return;
    }
    setError("");
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    setError("");
    if (step > 1) setStep(step - 1);
  };

  const toggleFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiUrl}/api/estimates/calculate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to calculate estimate");
      onComplete({ ...result, formData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="estimator-wizard">
      <div className="estimator-wizard__header">
        <div className="estimator-wizard__progress">
          <div className="estimator-wizard__progress-bar">
            <motion.div
              className="estimator-wizard__progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="estimator-wizard__steps">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`estimator-wizard__step ${s <= step ? "is-active" : ""} ${s < step ? "is-complete" : ""}`}>
                <span>{s < step ? <Check size={14} /> : s}</span>
                <label>
                  {s === 1 && "Project Type"}
                  {s === 2 && "Requirements"}
                  {s === 3 && "Design"}
                  {s === 4 && "Technical"}
                  {s === 5 && "Timeline"}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="estimator-wizard__content">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="estimator-step"
            >
              <h2>Choose Your Project Type</h2>
              <p>Select the type that best matches your project</p>
              <div className="estimator-cards">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`estimator-card ${formData.projectType === type.id ? "is-selected" : ""}`}
                    onClick={() => setFormData({ ...formData, projectType: type.id })}
                  >
                    <h3>{type.label}</h3>
                    <p>{type.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="estimator-step"
            >
              <h2>Project Requirements</h2>
              <p>Select features you need and describe any additional requirements</p>
              <div className="estimator-form-group">
                <label>Number of pages/modules (approximate)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  placeholder="e.g., 5"
                />
              </div>
              <div className="estimator-form-group">
                <label>Select Features</label>
                <div className="estimator-features">
                  {features.map((feature) => (
                    <button
                      key={feature}
                      className={`estimator-feature ${formData.features.includes(feature) ? "is-selected" : ""}`}
                      onClick={() => toggleFeature(feature)}
                    >
                      {formData.features.includes(feature) && <Check size={14} />}
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
              <div className="estimator-form-group">
                <label>Additional Requirements (describe in detail)</label>
                <textarea
                  value={formData.customRequirements}
                  onChange={(e) => setFormData({ ...formData, customRequirements: e.target.value })}
                  placeholder="Tell us about specific features, integrations, or goals..."
                  rows="4"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="estimator-step"
            >
              <h2>Design & Complexity</h2>
              <p>Choose your design preferences and share any references</p>
              <div className="estimator-cards estimator-cards--small">
                {designOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`estimator-card ${formData.designLevel === option.id ? "is-selected" : ""}`}
                    onClick={() => setFormData({ ...formData, designLevel: option.id })}
                  >
                    <h3>{option.label}</h3>
                    <p>{option.desc}</p>
                  </button>
                ))}
              </div>
              <div className="estimator-form-group">
                <label className="estimator-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.hasFigma}
                    onChange={(e) => setFormData({ ...formData, hasFigma: e.target.checked })}
                  />
                  <span>I already have a Figma design</span>
                </label>
              </div>
              <div className="estimator-form-group">
                <label className="estimator-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.hasBranding}
                    onChange={(e) => setFormData({ ...formData, hasBranding: e.target.checked })}
                  />
                  <span>I have existing branding (logo, colors)</span>
                </label>
              </div>
              <div className="estimator-form-group">
                <label>Design References / Inspiration (URL or description)</label>
                <textarea
                  value={formData.designReferences}
                  onChange={(e) => setFormData({ ...formData, designReferences: e.target.value })}
                  placeholder="Share links to websites you like or describe your desired style..."
                  rows="3"
                />
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="estimator-step"
            >
              <h2>Technical Requirements</h2>
              <p>Optional details to refine your estimate</p>
              <div className="estimator-form-row">
                <div className="estimator-form-group">
                  <label>Number of User Roles</label>
                  <select value={formData.userRoles} onChange={(e) => setFormData({ ...formData, userRoles: e.target.value })}>
                    <option value="1">1 (Just admin/users)</option>
                    <option value="2">2 roles</option>
                    <option value="3">3 roles</option>
                    <option value="4+">4+ roles</option>
                  </select>
                </div>
                <div className="estimator-form-group">
                  <label>Expected Traffic</label>
                  <select value={formData.expectedTraffic} onChange={(e) => setFormData({ ...formData, expectedTraffic: e.target.value })}>
                    <option value="low">Low (&lt; 1K/month)</option>
                    <option value="medium">Medium (1K - 10K/month)</option>
                    <option value="high">High (10K+/month)</option>
                  </select>
                </div>
              </div>
              <div className="estimator-form-group">
                <label>Existing Website URL (if any)</label>
                <input type="url" value={formData.existingWebsite} onChange={(e) => setFormData({ ...formData, existingWebsite: e.target.value })} placeholder="https://example.com" />
              </div>
              <div className="estimator-form-group">
                <label>Preferred Technology Stack (if known)</label>
                <input type="text" value={formData.techStack || ""} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} placeholder="e.g., React, Node.js, MongoDB" />
              </div>
              <div className="estimator-form-group">
                <label className="estimator-checkbox">
                  <input type="checkbox" checked={formData.needsHosting} onChange={(e) => setFormData({ ...formData, needsHosting: e.target.checked })} />
                  <span>Include deployment & hosting setup</span>
                </label>
              </div>
              <div className="estimator-form-group">
                <label className="estimator-checkbox">
                  <input type="checkbox" checked={formData.isGreenfield !== false} onChange={(e) => setFormData({ ...formData, isGreenfield: e.target.checked })} />
                  <span>Greenfield project (new build from scratch)</span>
                </label>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="estimator-step"
            >
              <h2>Timeline & Budget</h2>
              <p>Share your preferences (optional - estimate will remain flexible)</p>
              <div className="estimator-form-group">
                <label>Delivery Preference</label>
                <select value={formData.timelineUrgency} onChange={(e) => setFormData({ ...formData, timelineUrgency: e.target.value })}>
                  <option value="standard">Standard (No rush)</option>
                  <option value="expedited">Expedited (Rush delivery)</option>
                </select>
              </div>
              <div className="estimator-form-group">
                <label>Preferred Launch Date (optional)</label>
                <input type="date" value={formData.preferredLaunch} onChange={(e) => setFormData({ ...formData, preferredLaunch: e.target.value })} />
              </div>
              <div className="estimator-form-group">
                <label>Budget Range (optional)</label>
                <select value={formData.budgetRange} onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}>
                  <option value="">Not specified</option>
                  <option value="25k-50k">₹25K — ₹50K</option>
                  <option value="50k-1l">₹50K — ₹1L</option>
                  <option value="1l-2l">₹1L — ₹2L</option>
                  <option value="2l+">₹2L+</option>
                  <option value="discuss">Let's discuss</option>
                </select>
              </div>
              <div className="estimator-form-group">
                <label>Deadline-related constraints (optional)</label>
                <textarea value={formData.deadlineNotes || ""} onChange={(e) => setFormData({ ...formData, deadlineNotes: e.target.value })} placeholder="Any hard deadlines or time constraints..." rows="3" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <div className="estimator-error">{error}</div>}

        <div className="estimator-wizard__actions">
          {step > 1 && (
            <button className="estimator-btn estimator-btn--secondary" onClick={handleBack} disabled={loading}>
              <ArrowLeft size={18} /> Back
            </button>
          )}
          <button className="estimator-btn estimator-btn--primary" onClick={handleNext} disabled={loading}>
            {loading ? (
              <><LoaderCircle className="estimator-spinner" size={18} /> Calculating...</>
            ) : step === totalSteps ? (
              <><ArrowRight size={18} /> Get Estimate</>
            ) : (
              <><ArrowRight size={18} /> Next</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
