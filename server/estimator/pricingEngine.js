const PRICING_CONFIG = {
  projectTypes: {
    business: { base: 25000, multiplier: 1.0 },
    portfolio: { base: 15000, multiplier: 1.0 },
    landing: { base: 8000, multiplier: 0.8 },
    ecommerce: { base: 45000, multiplier: 1.3 },
    restaurant: { base: 30000, multiplier: 1.1 },
    booking: { base: 35000, multiplier: 1.2 },
    webapp: { base: 60000, multiplier: 1.4 },
    saas: { base: 120000, multiplier: 1.8 },
    crm: { base: 80000, multiplier: 1.5 },
    ai: { base: 150000, multiplier: 2.0 },
    custom: { base: 40000, multiplier: 1.2 },
  },
  features: {
    "Custom UI/UX Design": 15000,
    "Mobile Responsiveness": 8000,
    "Authentication & User Profiles": 12000,
    "Admin Dashboard": 20000,
    "Database Integration": 15000,
    "Search & Filtering": 8000,
    "Email Notifications": 5000,
    "Payment Gateway": 15000,
    "Third-party API Integrations": 10000,
    "File & Image Uploads": 7000,
    "Analytics & Reporting": 10000,
    "AI Integration": 40000,
    "Real-time Features": 25000,
    "Deployment & Hosting Setup": 8000,
    "Maintenance & Support": 15000,
  },
  design: {
    basic: 0,
    premium: 15000,
    advanced: 30000,
    fully_custom: 50000,
  },
  multipliers: {
    pages: 2000, // per page over 5
    userRoles: { "1": 0, "2": 5000, "3": 10000, "4+": 20000 },
    traffic: { low: 0, medium: 10000, high: 25000 },
    urgency: { standard: 0, expedited: 1.25 },
  },
};

const PRICING_REDUCTION_PERCENT = 80;
const applyPricingReduction = (amount) => Math.round(amount * (1 - PRICING_REDUCTION_PERCENT / 100));

export function calculateEstimate(formData) {
  const { projectType, pages, features = [], designLevel, userRoles, expectedTraffic, needsHosting, timelineUrgency } = formData;
  
  const typeConfig = PRICING_CONFIG.projectTypes[projectType] || PRICING_CONFIG.projectTypes.custom;
  let baseCost = typeConfig.base;
  
  // Pages cost
  const pageCount = parseInt(pages) || 5;
  if (pageCount > 5) {
    baseCost += (pageCount - 5) * PRICING_CONFIG.multipliers.pages;
  }
  
  // Features cost
  let featuresCost = 0;
  features.forEach((feature) => {
    if (PRICING_CONFIG.features[feature]) {
      featuresCost += PRICING_CONFIG.features[feature];
    }
  });
  
  // Design cost
  const designCost = PRICING_CONFIG.design[designLevel] || 0;
  
  // Technical costs
  const userRolesCost = PRICING_CONFIG.multipliers.userRoles[userRoles] || 0;
  const trafficCost = PRICING_CONFIG.multipliers.traffic[expectedTraffic] || 0;
  const hostingCost = needsHosting ? 8000 : 0;
  
  const projectSubtotal = baseCost + featuresCost + designCost + userRolesCost + trafficCost + hostingCost;
  const urgencyMultiplier = timelineUrgency === "expedited"
    ? PRICING_CONFIG.multipliers.urgency.expedited
    : 1;
  const baselineSubtotal = projectSubtotal * typeConfig.multiplier * urgencyMultiplier;

  const breakdown = [
    { label: "Base Project Cost", amount: applyPricingReduction(baseCost * typeConfig.multiplier * urgencyMultiplier), note: projectType.replace(/_/g, " ") },
  ];

  if (featuresCost > 0) {
    breakdown.push({ label: "Features & Functionality", amount: applyPricingReduction(featuresCost * typeConfig.multiplier * urgencyMultiplier) });
  }
  if (designCost > 0) {
    breakdown.push({ label: "Design", amount: applyPricingReduction(designCost * typeConfig.multiplier * urgencyMultiplier) });
  }
  if (userRolesCost > 0) {
    breakdown.push({ label: "User Roles & Permissions", amount: applyPricingReduction(userRolesCost * typeConfig.multiplier * urgencyMultiplier) });
  }
  if (trafficCost > 0) {
    breakdown.push({ label: "Scalability Considerations", amount: applyPricingReduction(trafficCost * typeConfig.multiplier * urgencyMultiplier) });
  }
  if (hostingCost > 0) {
    breakdown.push({ label: "Deployment & Hosting", amount: applyPricingReduction(hostingCost * typeConfig.multiplier * urgencyMultiplier) });
  }
  if (timelineUrgency === "expedited") {
    breakdown.push({
      label: "Rush Delivery Fee",
      amount: applyPricingReduction(projectSubtotal * typeConfig.multiplier * (urgencyMultiplier - 1)),
      note: "+25%",
    });
  }

  const subtotal = breakdown.reduce((total, item) => total + item.amount, 0);
  const minCost = Math.round(subtotal * 0.85);
  const maxCost = Math.round(subtotal * 1.15);
  
  // Determine timeline
  let timeline;
  if (timelineUrgency === "expedited") {
    timeline = "2–4 weeks";
  } else if (baselineSubtotal < 50000) {
    timeline = "3–5 weeks";
  } else if (baselineSubtotal < 100000) {
    timeline = "6–8 weeks";
  } else if (baselineSubtotal < 150000) {
    timeline = "8–10 weeks";
  } else {
    timeline = "10–12 weeks";
  }
  
  return {
    minCost,
    maxCost,
    timeline,
    breakdown,
    subtotal,
    preReductionSubtotal: Math.round(baselineSubtotal),
    pricingReductionPercent: PRICING_REDUCTION_PERCENT,
  };
}
