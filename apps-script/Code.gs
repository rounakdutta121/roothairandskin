/**
 * Root Hair & Skin - lead / click notification Apps Script
 *
 * SETUP
 * 1. Go to https://script.google.com -> New project
 * 2. Paste this file into Code.gs
 * 3. Deploy -> New deployment -> Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into index.html as APPS_SCRIPT_URL
 *
 * Receives JSON POST body:
 * {
 *   type: "form" | "call" | "imessage",
 *   page: string,
 *   timestamp: string,
 *   lead?: { name, phone, email, concern, message },
 *   attribution?: { gclid, gbraid, wbraid, utm_source, ... } // only present keys
 * }
 */

var NOTIFY_EMAIL = "damnart.seo@gmail.com";

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var type = String(data.type || "").toLowerCase();
    if (["form", "call", "imessage"].indexOf(type) === -1) {
      return jsonResponse({ ok: false, error: "Invalid type" });
    }

    // Call / iMessage: only email when gclid is present
    if (type === "call" || type === "imessage") {
      var gclidClick = getAttr(data, "gclid");
      if (!gclidClick) {
        return jsonResponse({ ok: true, skipped: true, reason: "missing_gclid" });
      }
    }

    var subject = buildSubject(type, data);
    var body = buildBody(type, data);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: body
    });

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse({
    ok: true,
    service: "Root Hair & Skin trackers",
    notify: NOTIFY_EMAIL
  });
}

function getFullName(data) {
  var name = "";
  if (data && data.lead && data.lead.name) {
    name = String(data.lead.name).replace(/\s+/g, " ").trim();
  }
  return name || "Unknown";
}

function buildSubject(type, data) {
  if (type === "form") {
    var fullName = getFullName(data);
    return "[RHS Lead] Form submission from " + fullName;
  }
  if (type === "call") {
    return "[RHS Click] Call button - gclid present";
  }
  return "[RHS Click] iMessage button - gclid present";
}

function buildBody(type, data) {
  var lines = [];
  lines.push("Root Hair & Skin - tracker notification");
  lines.push("=====================================");
  lines.push("Type: " + type);
  lines.push("Time: " + (data.timestamp || new Date().toISOString()));
  lines.push("Page: " + (data.page || "(unknown)"));
  lines.push("");

  if (type === "form" && data.lead) {
    var fullName = getFullName(data);
    lines.push("LEAD DETAILS");
    lines.push("------------");
    lines.push("Full Name: " + fullName);
    lines.push("Phone: " + (data.lead.phone || ""));
    lines.push("Email: " + (data.lead.email || ""));
    lines.push("Primary Concern: " + (data.lead.concern || ""));
    lines.push("Message: " + (data.lead.message || ""));
    lines.push("");
  }

  if (type === "call" || type === "imessage") {
    lines.push("CLICK DETAILS");
    lines.push("-------------");
    lines.push("Action: " + (type === "call" ? "Call button" : "iMessage button"));
    lines.push("");
  }

  var attr = data.attribution || {};
  var attrKeys = Object.keys(attr).filter(function (k) {
    return attr[k] !== null && attr[k] !== undefined && String(attr[k]).trim() !== "";
  });

  if (attrKeys.length) {
    lines.push("MARKETING ATTRIBUTION");
    lines.push("---------------------");
    attrKeys.forEach(function (k) {
      lines.push(k + ": " + attr[k]);
    });
    lines.push("");
  }

  lines.push("User Agent: " + (data.userAgent || ""));
  return lines.join("\n");
}

function getAttr(data, key) {
  if (!data || !data.attribution) return "";
  var v = data.attribution[key];
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
