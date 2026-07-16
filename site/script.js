"use strict";

const APP_CONFIG = Object.freeze({
  gptUrl: "https://chatgpt.com/g/g-6a580c6ec5648191a2d27f4528015f3f-funding-data-room-copilot",
  actionEndpoint: "/api/actions/public",
  brokerJoinUrl: "https://tally.so/r/mOe658",
  requestLimitBytes: 128 * 1024
});

const BUSINESS_MODULES = {
  contractor: {
    title: "Contractors + Trades",
    copy: "Organize active work, operating records, equipment needs, and cash-flow timing without burying the reviewer in job-site noise.",
    items: ["Licenses and insurance", "Contracts and backlog", "Equipment quotes", "Receivables and project timing"]
  },
  ecommerce: {
    title: "Ecommerce Sellers",
    copy: "Connect sales activity to cash timing with platform-aware document categories.",
    items: ["Platform sales and payouts", "Inventory and purchase orders", "Advertising and payout timing", "Processor reserves and fees"]
  },
  restaurant: {
    title: "Restaurants",
    copy: "Structure merchant processing, seasonality, payroll, lease, and operating records.",
    items: ["Merchant processing", "Licenses, lease, and insurance", "Seasonality notes", "Food costs and payroll"]
  },
  agency: {
    title: "Agencies",
    copy: "Frame recurring revenue, receivables, labor costs, and client concentration cleanly.",
    items: ["Client contracts", "Accounts receivable", "Labor and contractor costs", "Client concentration"]
  },
  clinic: {
    title: "Clinics",
    copy: "Use business-level records and minimized receivables data without unnecessary patient information.",
    items: ["Licenses and provider records", "Aggregated receivables", "Reimbursement timing", "Strict privacy controls"]
  },
  local: {
    title: "Local Service Businesses",
    copy: "Organize operating licenses, vehicles, equipment, contracts, and customer-payment timing.",
    items: ["Licenses and insurance", "Equipment and vehicles", "Contracts and work orders", "Receivables and job pipeline"]
  },
  broker: {
    title: "Funding Brokers",
    copy: "Separate untouched client files from internal QA and partner-facing handoff materials.",
    items: ["Original client files", "Internal QA", "Partner handoff", "Questions and responses"]
  },
  generic: {
    title: "Generic Small Business",
    copy: "Start with a durable core structure, then add only the support relevant to the business.",
    items: ["Business identity", "Bank statements", "Financial statements", "Funding request and support"]
  }
};

const TOOL_EXAMPLES = {
  generic: {
    action: "generate_folder_structure",
    payload: {
      business_name: "Ridgeway Electric LLC",
      business_type: "contractor",
      user_role: "business_owner",
      funding_purpose: "equipment"
    },
    request_id: "browser-test-001"
  },
  package: {
    business_name: "Ridgeway Electric LLC",
    business_type: "contractor",
    user_role: "business_owner",
    funding_purpose: "equipment, supplier deposits, and payroll timing",
    requested_amount: 80000,
    minimum_useful_amount: 55000,
    documents_available: ["YTD P&L", "Equipment quote"],
    documents_missing: ["May bank statement"],
    current_file_names: ["May Statement.pdf"]
  },
  folder: {
    business_name: "Ridgeway Electric LLC",
    business_type: "contractor",
    user_role: "business_owner",
    funding_purpose: "equipment"
  },
  tracker: {
    business_name: "Signal House Agency",
    user_role: "broker",
    documents_available: ["Formation document"],
    documents_missing: ["May bank statement", "Current AR aging"]
  },
  qa: {
    business_name: "Ridgeway Electric LLC",
    documents_available: ["February bank statement", "March bank statement"],
    documents_missing: ["April bank statement"],
    readiness_gaps: ["April bank statement is missing."]
  }
};

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setConfigLinks() {
  qsa("[data-gpt-link]").forEach((link) => link.href = APP_CONFIG.gptUrl);
  qsa("[data-broker-link]").forEach((link) => link.href = APP_CONFIG.brokerJoinUrl);
  qsa("[data-current-year]").forEach((node) => node.textContent = String(new Date().getFullYear()));
}

function setupBusinessSelector() {
  const tabs = qsa("[data-business-tab]");
  const panel = qs("[data-business-panel]");
  if (!tabs.length || !panel) return;

  const render = (key) => {
    const item = BUSINESS_MODULES[key];
    if (!item) return;
    panel.innerHTML = `
      <div class="status-chip status-ready">Business-aware output</div>
      <h3>${item.title}</h3>
      <p>${item.copy}</p>
      <ul>${item.items.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>
    `;
    tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.businessTab === key)));
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => render(tab.dataset.businessTab)));
  render(tabs[0].dataset.businessTab);
}

function setupHomeDemo() {
  const button = qs("[data-run-demo]");
  const output = qs("[data-demo-results]");
  if (!button || !output) return;

  button.addEventListener("click", () => {
    output.innerHTML = `
      <div class="result-line"><strong>Classification</strong><span class="status-chip status-blocker">Hold — Blocker Present</span></div>
      <div class="result-line"><strong>Blocker</strong><span>May bank statement is missing or incomplete.</span></div>
      <div class="result-line"><strong>Owner</strong><span>Business owner or processor</span></div>
      <div class="result-line"><strong>Next action</strong><span>Obtain the complete provider-generated May statement and confirm every page is present.</span></div>
      <div class="result-line"><strong>Folder output</strong><span>13 numbered folders plus contractor-specific support categories.</span></div>
      <div class="result-line"><strong>Boundary</strong><span>Human review is required. No approval or eligibility prediction.</span></div>
    `;
    button.textContent = "Demo generated ✓";
  });
}

function parseLines(value) {
  return String(value || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function valueOf(name) {
  const field = qs(`[name="${name}"]`);
  return field ? field.value.trim() : "";
}

function numberOf(name) {
  const raw = valueOf(name);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function buildStructuredPayload(tool) {
  const common = {
    business_name: valueOf("business_name"),
    business_type: valueOf("business_type"),
    user_role: valueOf("user_role"),
    funding_purpose: valueOf("funding_purpose")
  };
  Object.keys(common).forEach((key) => { if (!common[key]) delete common[key]; });

  if (tool === "folder") return common;

  if (tool === "package") {
    const requested = numberOf("requested_amount");
    const minimum = numberOf("minimum_useful_amount");
    return {
      ...common,
      ...(requested !== null ? { requested_amount: requested } : {}),
      ...(minimum !== null ? { minimum_useful_amount: minimum } : {}),
      documents_available: parseLines(valueOf("documents_available")),
      documents_missing: parseLines(valueOf("documents_missing")),
      current_file_names: parseLines(valueOf("current_file_names"))
    };
  }

  if (tool === "tracker") {
    return {
      business_name: common.business_name,
      user_role: common.user_role,
      documents_available: parseLines(valueOf("documents_available")),
      documents_missing: parseLines(valueOf("documents_missing"))
    };
  }

  if (tool === "qa") {
    return {
      business_name: common.business_name,
      documents_available: parseLines(valueOf("documents_available")),
      documents_missing: parseLines(valueOf("documents_missing")),
      readiness_gaps: parseLines(valueOf("readiness_gaps")).map((gap) => ({
        gap,
        priority: /bank statement|identity|ownership|privacy/i.test(gap) ? "Blocker" : "Fix Before Submission",
        why_it_matters: "The issue may affect completeness or create avoidable questions.",
        next_action: "Confirm the fact or obtain the supporting record.",
        suggested_owner: "Business owner or processor",
        human_review_required: true
      }))
    };
  }

  return common;
}

function currentToolRequest() {
  const toolRoot = qs("[data-tool]");
  if (!toolRoot) return null;
  const tool = toolRoot.dataset.tool;
  const requestId = valueOf("request_id") || `site-${tool}-${Date.now()}`;

  if (tool === "generic") {
    const action = valueOf("action");
    const editor = qs("[name='payload_json']");
    let payload = {};
    try {
      payload = JSON.parse(editor?.value || "{}");
    } catch (error) {
      throw new Error(`Payload JSON is invalid: ${error.message}`);
    }
    return { action, payload, request_id: requestId };
  }

  const actionMap = {
    package: "build_data_room_package",
    folder: "generate_folder_structure",
    tracker: "create_missing_document_tracker",
    qa: "run_readiness_qa_gate"
  };

  return {
    action: actionMap[tool],
    payload: buildStructuredPayload(tool),
    request_id: requestId
  };
}

function requestBytes(request) {
  return new TextEncoder().encode(JSON.stringify(request)).length;
}

function updateMeter() {
  const meter = qs("[data-request-meter]");
  const submit = qs("[data-submit-tool]");
  if (!meter) return;
  try {
    const bytes = requestBytes(currentToolRequest());
    meter.textContent = `${bytes.toLocaleString()} / ${APP_CONFIG.requestLimitBytes.toLocaleString()} bytes`;
    meter.classList.toggle("is-over", bytes > APP_CONFIG.requestLimitBytes);
    if (submit) submit.disabled = bytes > APP_CONFIG.requestLimitBytes;
  } catch {
    meter.textContent = "Invalid input";
  }
}

function outputStatus(text, state = "") {
  const node = qs("[data-output-status]");
  if (!node) return;
  node.textContent = text;
  node.className = `output-status ${state}`.trim();
}

function renderSummary(data, action) {
  const summary = qs("[data-output-summary]");
  if (!summary) return;
  const cards = [];

  if (action === "generate_folder_structure") {
    cards.push(["Package", data.package_name || "Generated folder structure"]);
    cards.push(["Business type", data.normalized_business_type || "Generic"]);
    cards.push(["Human review", data.human_review_required ? "Required" : "Check response"]);
  } else if (action === "create_missing_document_tracker") {
    cards.push(["Items", data.summary?.total ?? data.rows?.length ?? 0]);
    cards.push(["Blockers", data.summary?.blockers ?? 0]);
    cards.push(["Fix before submission", data.summary?.fix_before_submission ?? 0]);
  } else if (action === "run_readiness_qa_gate") {
    cards.push(["Classification", data.classification || "Review response"]);
    cards.push(["Blockers", data.pass_hold_summary?.blocker_count ?? data.blockers?.length ?? 0]);
    cards.push(["Next action", data.next_action || "Human review"]);
  } else if (action === "build_data_room_package") {
    cards.push(["Classification", data.package_summary?.qa_classification || "Review response"]);
    cards.push(["Blockers", data.package_summary?.blocker_count ?? 0]);
    cards.push(["Next actions", data.next_best_actions?.length ?? 0]);
  } else {
    cards.push(["Action", action]);
    cards.push(["Human review", data.human_review_required === false ? "Check response" : "Required"]);
  }

  summary.innerHTML = cards.map(([label, value]) => `
    <div class="output-card"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(value)}</p></div>
  `).join("");
}

function renderSpecialOutput(data, action) {
  const special = qs("[data-special-output]");
  if (!special) return;
  special.innerHTML = "";

  if (action === "generate_folder_structure" && data.folder_tree) {
    special.innerHTML = `<div class="output-card"><h3>Copy-ready folder tree</h3><pre>${escapeHtml(data.folder_tree)}</pre></div>`;
  }

  if (action === "create_missing_document_tracker" && Array.isArray(data.rows)) {
    const rows = data.rows.map((row) => `
      <tr>
        <td>${escapeHtml(row.document || "")}</td>
        <td>${escapeHtml(row.status || "")}</td>
        <td>${escapeHtml(row.priority || "")}</td>
        <td>${escapeHtml(row.owner || "")}</td>
        <td>${escapeHtml(row.next_action || "")}</td>
      </tr>
    `).join("");
    special.innerHTML = `
      <div class="output-card"><h3>Operational tracker</h3>
        <div style="overflow:auto">
          <table class="output-table">
            <thead><tr><th>Document</th><th>Status</th><th>Priority</th><th>Owner</th><th>Next action</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  if (action === "run_readiness_qa_gate") {
    const blockers = (data.blockers || []).map((gap) => `<li>${escapeHtml(gap.gap || "")}</li>`).join("");
    special.innerHTML = `
      <div class="output-card">
        <h3>${escapeHtml(data.classification || "Readiness QA")}</h3>
        ${blockers ? `<ul>${blockers}</ul>` : "<p>No Blockers returned. Human review is still required.</p>"}
      </div>
    `;
  }

  if (action === "build_data_room_package") {
    const sections = [
      ["Summary", data.package_summary],
      ["QA", data.readiness_qa],
      ["Next actions", data.next_best_actions],
      ["Privacy", data.privacy_checklist]
    ];
    special.innerHTML = `
      <div class="tabs" role="tablist">
        ${sections.map(([label], i) => `<button class="tab-button" type="button" role="tab" aria-selected="${i === 0}" data-package-tab="${i}">${label}</button>`).join("")}
      </div>
      <div class="output-card" data-package-panel><pre>${escapeHtml(JSON.stringify(sections[0][1], null, 2))}</pre></div>
    `;
    qsa("[data-package-tab]", special).forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.packageTab);
        qsa("[data-package-tab]", special).forEach((item) => item.setAttribute("aria-selected", String(item === button)));
        qs("[data-package-panel]", special).innerHTML = `<pre>${escapeHtml(JSON.stringify(sections[index][1], null, 2))}</pre>`;
      });
    });
  }
}

let lastToolResponse = null;

async function submitTool() {
  let request;
  try {
    request = currentToolRequest();
  } catch (error) {
    outputStatus("Invalid input", "error");
    qs("[data-output-json]").textContent = JSON.stringify({ ok: false, error: { code: "LOCAL_INPUT_ERROR", message: error.message } }, null, 2);
    return;
  }

  const bytes = requestBytes(request);
  if (bytes > APP_CONFIG.requestLimitBytes) {
    outputStatus("Request too large", "error");
    return;
  }

  outputStatus("Sending…", "pending");
  qs("[data-submit-tool]").disabled = true;

  try {
    const response = await fetch(APP_CONFIG.actionEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });

    const text = await response.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { ok: false, error: { code: "NON_JSON_RESPONSE", message: text || "Empty response" } };
    }

    lastToolResponse = body;
    qs("[data-output-json]").textContent = JSON.stringify(body, null, 2);
    outputStatus(`${response.status} · ${body.ok ? "Success" : "Error"}`, body.ok ? "success" : "error");

    if (body.ok) {
      renderSummary(body.data || {}, request.action);
      renderSpecialOutput(body.data || {}, request.action);
    } else {
      qs("[data-output-summary]").innerHTML = `
        <div class="output-card"><h3>${escapeHtml(body.error?.code || "Error")}</h3><p>${escapeHtml(body.error?.message || "The action failed.")}</p></div>
      `;
      qs("[data-special-output]").innerHTML = "";
    }
  } catch (error) {
    lastToolResponse = { ok: false, error: { code: "NETWORK_ERROR", message: error.message } };
    qs("[data-output-json]").textContent = JSON.stringify(lastToolResponse, null, 2);
    outputStatus("Network error", "error");
    qs("[data-output-summary]").innerHTML = `
      <div class="output-card"><h3>Could not reach the endpoint</h3><p>A plain static server does not include the Vercel API. Deploy the repository or run Vercel locally.</p></div>
    `;
  } finally {
    qs("[data-submit-tool]").disabled = false;
    updateMeter();
  }
}

function loadToolExample() {
  const root = qs("[data-tool]");
  if (!root) return;
  const tool = root.dataset.tool;
  const example = TOOL_EXAMPLES[tool];
  if (!example) return;

  if (tool === "generic") {
    qs("[name='action']").value = example.action;
    qs("[name='payload_json']").value = JSON.stringify(example.payload, null, 2);
    qs("[name='request_id']").value = example.request_id;
  } else {
    Object.entries(example).forEach(([key, value]) => {
      const field = qs(`[name="${key}"]`);
      if (!field) return;
      field.value = Array.isArray(value) ? value.join("\n") : value;
    });
  }
  updateMeter();
}

function clearTool() {
  const form = qs("[data-tool-form]");
  if (form) form.reset();
  const json = qs("[data-output-json]");
  if (json) json.textContent = JSON.stringify({ message: "Ready for a safe metadata-only request." }, null, 2);
  if (qs("[data-output-summary]")) qs("[data-output-summary]").innerHTML = "";
  if (qs("[data-special-output]")) qs("[data-special-output]").innerHTML = "";
  outputStatus("Not sent");
  lastToolResponse = null;
  updateMeter();
}

function formatPayloadEditor() {
  const editor = qs("[name='payload_json']");
  if (!editor) return;
  try {
    editor.value = JSON.stringify(JSON.parse(editor.value || "{}"), null, 2);
    outputStatus("JSON formatted");
  } catch {
    outputStatus("Invalid JSON", "error");
  }
  updateMeter();
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

function downloadBlob(content, filename, type = "application/json") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function trackerCsv() {
  const rows = lastToolResponse?.data?.rows;
  if (!Array.isArray(rows)) return null;
  const columns = ["document", "category", "status", "priority", "owner", "due_date", "why_it_matters", "next_action", "human_review_required", "notes"];
  const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [columns.join(","), ...rows.map((row) => columns.map((column) => escapeCell(row[column])).join(","))].join("\n");
}

function setupTool() {
  const root = qs("[data-tool]");
  if (!root) return;

  qsa("input, select, textarea", root).forEach((field) => {
    field.addEventListener("input", updateMeter);
    field.addEventListener("change", updateMeter);
  });

  qs("[data-submit-tool]")?.addEventListener("click", submitTool);
  qs("[data-load-example]")?.addEventListener("click", loadToolExample);
  qs("[data-clear-tool]")?.addEventListener("click", clearTool);
  qs("[data-format-json]")?.addEventListener("click", formatPayloadEditor);

  qs("[data-copy-json]")?.addEventListener("click", async () => {
    if (!lastToolResponse) return;
    await copyText(JSON.stringify(lastToolResponse, null, 2));
    outputStatus("Response copied", "success");
  });

  qs("[data-download-json]")?.addEventListener("click", () => {
    if (!lastToolResponse) return;
    downloadBlob(JSON.stringify(lastToolResponse, null, 2), "funding-data-room-response.json");
  });

  qs("[data-download-csv]")?.addEventListener("click", () => {
    const csv = trackerCsv();
    if (!csv) {
      outputStatus("No tracker rows yet", "error");
      return;
    }
    downloadBlob(csv, "missing-document-tracker.csv", "text/csv");
  });

  loadToolExample();
}

setConfigLinks();
setupBusinessSelector();
setupHomeDemo();
setupTool();
