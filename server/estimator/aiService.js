import crypto from "node:crypto";

export async function interpretRequirements(formData, estimate) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  
  if (!apiKey) {
    // Fallback without AI
    return generateFallbackInterpretation(formData, estimate);
  }
  
  try {
    const prompt = `You are an expert project consultant for WebExpertss. Analyze this project estimate and provide insights.

Project Data:
${JSON.stringify(formData, null, 2)}

Calculated Estimate:
${JSON.stringify(estimate, null, 2)}

Provide a JSON response with:
{
  "explanation": "Brief explanation of the estimate in simple language",
  "scopeSummary": "Concise project scope summary",
  "suggestedFeatures": [{"name": "Feature name", "reason": "Why suggested"}],
  "clarifications": ["Questions if anything unclear"],
  "complexity": "low|medium|high|very-high",
  "needsReview": boolean
}

Rules:
- Don't change prices
- Be realistic and transparent
- Suggest relevant features they might have missed
- Flag if needs manual review
- Keep it professional`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!response.ok) throw new Error("AI service failed");
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error("AI interpretation failed:", error);
    return generateFallbackInterpretation(formData, estimate);
  }
}

function generateFallbackInterpretation(formData, estimate) {
  const suggestedFeatures = [];
  const scopeCost = estimate.preReductionSubtotal ?? estimate.subtotal;
  
  if (formData.projectType === "ecommerce" && !formData.features?.includes("Payment Gateway")) {
    suggestedFeatures.push({ name: "Payment Gateway", reason: "Essential for online sales" });
  }
  if (formData.projectType === "webapp" && !formData.features?.includes("Admin Dashboard")) {
    suggestedFeatures.push({ name: "Admin Dashboard", reason: "Needed to manage application data" });
  }
  if (!formData.features?.includes("Mobile Responsiveness")) {
    suggestedFeatures.push({ name: "Mobile Responsiveness", reason: "Critical for user experience" });
  }
  
  return {
    explanation: `Based on your requirements for a ${formData.projectType?.replace(/_/g, ' ')} project, the estimated cost ranges from ₹${estimate.minCost.toLocaleString('en-IN')} to ₹${estimate.maxCost.toLocaleString('en-IN')}. This covers the core functionality you've selected with ${estimate.timeline} timeline.`,
    scopeSummary: `Development of ${formData.projectType?.replace(/_/g, ' ')} with ${formData.features?.length || 0} key features, ${formData.designLevel?.replace(/_/g, ' ')} design approach.`,
    suggestedFeatures,
    clarifications: [],
    complexity: scopeCost > 100000 ? "high" : scopeCost > 50000 ? "medium" : "low",
    needsReview: scopeCost > 150000,
  };
}
