import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "node:process";

const serverDirectory = fileURLToPath(new URL(".", import.meta.url));

try {
  loadEnvFile(resolve(serverDirectory, ".env"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const projectRoot = resolve(serverDirectory, "..");
const distRoot = resolve(projectRoot, "dist");
const clientOrigins = new Set(
  (process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)
    .map((url) => {
      const parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("CLIENT_URL entries must use http or https.");
      }
      return parsedUrl.origin;
    }),
);
const maxRequestBytes = 12 * 1024;
const allowedProjectTypes = new Set([
  "Website",
  "Web Application",
  "UI/UX Design",
  "Branding",
  "Digital Solution",
  "Something Else",
]);
const allowedBudgets = new Set(["", "₹25K — ₹50K", "₹50K — ₹1L", "₹1L — ₹2L", "₹2L+", "Let's discuss"]);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function isAllowedOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;

  let requestOrigin;
  try {
    requestOrigin = new URL(origin).origin;
  } catch {
    return false;
  }

  const forwardedProtocol = request.headers["x-forwarded-proto"]?.split(",")[0].trim();
  const protocol = forwardedProtocol || "http";
  const host = request.headers.host;
  const sameOrigin = host && requestOrigin === `${protocol}://${host}`;
  return sameOrigin || clientOrigins.has(requestOrigin);
}

function applyCorsHeaders(request, response) {
  const requestOrigin = request.headers.origin ? new URL(request.headers.origin).origin : "";
  if (clientOrigins.has(requestOrigin)) {
    response.setHeader("access-control-allow-origin", requestOrigin);
    response.setHeader("vary", "Origin");
  }
}

async function readJsonBody(request) {
  const contentType = request.headers["content-type"]?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json" && contentType !== "text/plain") {
    const error = new Error("Request content type must be application/json or text/plain.");
    error.statusCode = 415;
    throw error;
  }

  const declaredLength = Number(request.headers["content-length"] || 0);
  if (declaredLength > maxRequestBytes) {
    const error = new Error("Request is too large.");
    error.statusCode = 413;
    throw error;
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxRequestBytes) {
      const error = new Error("Request is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

function getContactDetails(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Please check your form details and try again." };
  }

  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim().replace(/\s+/g, " ") : "";
  const type = typeof body.type === "string" ? body.type.trim() : "";
  const budget = typeof body.budget === "string" ? body.budget.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 120 || /[\r\n]/.test(name)) {
    return { error: "Please enter a valid name." };
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (company.length > 120) {
    return { error: "Company name must be 120 characters or fewer." };
  }
  if (!allowedProjectTypes.has(type)) {
    return { error: "Please choose a valid project type." };
  }
  if (!allowedBudgets.has(budget)) {
    return { error: "Please choose a valid budget range." };
  }
  if (!message || message.length > 5000) {
    return { error: "Project details are required and must be 5,000 characters or fewer." };
  }

  return { details: { name, email, company, type, budget, message } };
}

async function handleContactRequest(request, response) {
  let body;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    sendJson(response, error.statusCode || 400, { error: error.message });
    return;
  }

  const result = getContactDetails(body);
  if (result.error) {
    sendJson(response, 400, { error: result.error });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "mistrydev812@gmail.com";
  if (!apiKey || !from) {
    console.error("Contact form is not configured: set RESEND_API_KEY and RESEND_FROM_EMAIL.");
    sendJson(response, 503, { error: "The contact form is temporarily unavailable. Please email hello@webexpertss.com." });
    return;
  }

  const { name, email, company, type, budget, message } = result.details;
  const emailText = [
    "A new project enquiry was submitted on webexpertss.tech.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company / brand: ${company || "Not provided"}`,
    `Project type: ${type}`,
    `Budget: ${budget || "Not provided"}`,
    "",
    "Project details:",
    message,
  ].join("\n");

  const emailHtml = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#0b0b0f;font-family:Arial,sans-serif;color:#f5f5f5;">
    <div style="max-width:600px;margin:0 auto;background:#15151c;border:1px solid #2a2a35;border-radius:12px;overflow:hidden;">
      <div style="padding:24px 28px;background:#ff4c23;color:#fff;">
        <h1 style="margin:0;font-size:22px;">New Project Enquiry</h1>
        <p style="margin:6px 0 0;opacity:.9;">webexpertss.tech</p>
      </div>
      <div style="padding:24px 28px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#9a9aa8;">Name</td><td style="padding:8px 0;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#9a9aa8;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#ff4c23;">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#9a9aa8;">Company</td><td style="padding:8px 0;">${company || "Not provided"}</td></tr>
          <tr><td style="padding:8px 0;color:#9a9aa8;">Project type</td><td style="padding:8px 0;">${type}</td></tr>
          <tr><td style="padding:8px 0;color:#9a9aa8;">Budget</td><td style="padding:8px 0;">${budget || "Not provided"}</td></tr>
        </table>
        <h3 style="margin:20px 0 8px;color:#9a9aa8;">Project details</h3>
        <p style="white-space:pre-wrap;margin:0;line-height:1.6;">${message}</p>
      </div>
    </div>
  </body></html>`;

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New project enquiry from ${name}`,
        text: emailText,
        html: emailHtml,
      }),
    });
    const resendResult = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error("Resend rejected contact email:", resendResponse.status, resendResult);
      sendJson(response, 502, { error: "We couldn't send your enquiry right now. Please try again shortly." });
      return;
    }
  } catch (error) {
    console.error("Resend request failed:", error);
    sendJson(response, 502, { error: "We couldn't send your enquiry right now. Please try again shortly." });
    return;
  }

  sendJson(response, 200, { message: "Thanks — your project enquiry has been sent." });
}

async function serveStaticFile(request, response, pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    sendJson(response, 400, { error: "Invalid URL path." });
    return;
  }

  let filePath = resolve(distRoot, `.${decodedPath}`);
  const pathFromRoot = relative(distRoot, filePath);
  if (pathFromRoot === ".." || pathFromRoot.startsWith(`..${sep}`) || pathFromRoot.startsWith(sep)) {
    sendJson(response, 403, { error: "Forbidden." });
    return;
  }

  try {
    const fileInfo = await stat(filePath);
    if (fileInfo.isDirectory()) filePath = resolve(filePath, "index.html");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    if (!extname(decodedPath)) filePath = resolve(distRoot, "index.html");
  }

  let content;
  try {
    content = await readFile(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    sendJson(response, 404, { error: "Not found." });
    return;
  }

  response.writeHead(200, {
    "content-type": contentTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
    "cache-control": extname(filePath) === ".html" ? "no-cache" : "public, max-age=3600",
    "x-content-type-options": "nosniff",
  });
  response.end(request.method === "HEAD" ? undefined : content);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    if (url.pathname === "/api/contact") {
      if (!isAllowedOrigin(request)) {
        sendJson(response, 403, { error: "This website is not allowed to submit the contact form." });
        return;
      }
      applyCorsHeaders(request, response);

      if (request.method === "OPTIONS") {
        response.writeHead(204, {
          allow: "POST, OPTIONS",
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type",
        });
        response.end();
        return;
      }

      if (request.method !== "POST") {
        response.setHeader("allow", "POST");
        sendJson(response, 405, { error: "Method not allowed." });
        return;
      }
      await handleContactRequest(request, response);
      return;
    }

    if (url.pathname === "/api/estimates/calculate") {
      if (!isAllowedOrigin(request)) {
        sendJson(response, 403, { error: "Not allowed." });
        return;
      }
      applyCorsHeaders(request, response);
      if (request.method === "OPTIONS") {
        response.writeHead(204, {
          allow: "POST, OPTIONS",
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type",
        });
        response.end();
        return;
      }
      if (request.method !== "POST") {
        response.setHeader("allow", "POST");
        sendJson(response, 405, { error: "Method not allowed." });
        return;
      }
      await handleEstimateCalculate(request, response);
      return;
    }

    if (url.pathname === "/api/leads") {
      if (!isAllowedOrigin(request)) {
        sendJson(response, 403, { error: "Not allowed." });
        return;
      }
      applyCorsHeaders(request, response);
      if (request.method === "OPTIONS") {
        response.writeHead(204, {
          allow: "POST, OPTIONS",
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type",
        });
        response.end();
        return;
      }
      if (request.method !== "POST") {
        response.setHeader("allow", "POST");
        sendJson(response, 405, { error: "Method not allowed." });
        return;
      }
      await handleEstimateLead(request, response);
      return;
    }

    if (url.pathname === "/api/health") {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    if (url.pathname.startsWith("/api/")) {
      sendJson(response, 404, { error: "Not found." });
      return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      sendJson(response, 405, { error: "Method not allowed." });
      return;
    }

    await serveStaticFile(request, response, url.pathname);
  } catch (error) {
    console.error("Request failed:", error);
    if (!response.headersSent) sendJson(response, 500, { error: "An unexpected server error occurred." });
    else response.destroy();
  }
});

const port = Number(process.env.PORT || 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port.");
}

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Set PORT to another available port and try again.`);
    process.exitCode = 1;
    return;
  }
  throw error;
});

server.listen(port, "0.0.0.0", () => {
  console.log(`webexpertss server listening on port ${port}`);
});

// Estimator endpoints
import { calculateEstimate } from "./estimator/pricingEngine.js";
import { interpretRequirements } from "./estimator/aiService.js";
import { randomBytes } from "node:crypto";

const estimatorLeads = [];

function isEstimatorAllowedOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  let requestOrigin;
  try {
    requestOrigin = new URL(origin).origin;
  } catch {
    return false;
  }
  const forwardedProtocol = request.headers["x-forwarded-proto"]?.split(",")[0].trim();
  const protocol = forwardedProtocol || "http";
  const host = request.headers.host;
  const sameOrigin = host && requestOrigin === `${protocol}://${host}`;
  return sameOrigin || clientOrigins.has(requestOrigin);
}

async function handleEstimateCalculate(request, response) {
  let body;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    sendJson(response, error.statusCode || 400, { error: error.message });
    return;
  }

  if (!body || typeof body !== "object") {
    sendJson(response, 400, { error: "Invalid request" });
    return;
  }

  try {
    const estimate = calculateEstimate(body);
    const aiInterpretation = await interpretRequirements(body, estimate);
    const estimateId = `EST-${randomBytes(4).toString('hex').toUpperCase()}`;
    
    sendJson(response, 200, {
      estimate,
      aiInterpretation,
      estimateId,
      calculatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Estimate calculation failed:", error);
    sendJson(response, 500, { error: "Failed to calculate estimate" });
  }
}

async function handleEstimateLead(request, response) {
  let body;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    sendJson(response, error.statusCode || 400, { error: error.message });
    return;
  }

  if (!body || typeof body !== "object") {
    sendJson(response, 400, { error: "Invalid request" });
    return;
  }

  const { name, email, projectDescription, consent } = body;
  if (!name?.trim() || !email?.trim() || !projectDescription?.trim() || !consent) {
    sendJson(response, 400, { error: "All required fields must be provided" });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    sendJson(response, 400, { error: "Invalid email" });
    return;
  }

  const lead = {
    id: `LEAD-${randomBytes(4).toString('hex').toUpperCase()}`,
    ...body,
    createdAt: new Date().toISOString(),
  };
  estimatorLeads.push(lead);
  console.log("New estimator lead:", lead.id);

  sendJson(response, 200, {
    message: "Quote request submitted successfully",
    leadId: lead.id,
  });
}
