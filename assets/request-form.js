/* Recall Rescue — request form with an in-app-browser fallback.
   Submitting builds a plain-text request, opens the visitor's email app (mailto:),
   and at the same time shows the same text in a box with a Copy button, so a
   visitor inside Instagram/WeChat/Facebook in-app browsers can still send it. */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var form = document.getElementById("request-form");
    if (!form) return;
    var card = document.getElementById("submit-card");
    var copyArea = document.getElementById("copy-area");
    var status = document.getElementById("copy-status");
    var copyBtn = document.getElementById("copy-button");
    var email = form.getAttribute("data-email") || "";
    var subject = form.getAttribute("data-subject") || "Recall Rescue request";
    var intro = form.getAttribute("data-intro") || "";
    var labels = {
      practice: form.getAttribute("data-l-practice") || "Practice",
      patients: form.getAttribute("data-l-patients") || "Active patients",
      compliance: form.getAttribute("data-l-compliance") || "Recall compliance",
      contact: form.getAttribute("data-l-contact") || "Contact",
      note: form.getAttribute("data-l-note") || "Note"
    };

    function value(id) {
      var el = document.getElementById(id);
      return el ? String(el.value || "").trim() : "";
    }

    function build() {
      var lines = [];
      if (intro) lines.push(intro, "");
      lines.push(labels.practice + ": " + (value("req-practice") || "-"));
      lines.push(labels.patients + ": " + (value("req-patients") || "-"));
      lines.push(labels.compliance + ": " + (value("req-compliance") || "-"));
      lines.push(labels.contact + ": " + (value("req-contact") || "-"));
      var note = value("req-note");
      if (note) lines.push(labels.note + ": " + note);
      lines.push("");
      lines.push("(No patient names or identifiers are included in this message.)");
      return lines.join("\n");
    }

    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise(function (resolve, reject) {
        try {
          copyArea.focus();
          copyArea.select();
          var ok = document.execCommand("copy");
          ok ? resolve() : reject(new Error("copy failed"));
        } catch (e) {
          reject(e);
        }
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var text = build();
      copyArea.value = text;
      card.classList.add("show");

      var mailto = "mailto:" + email +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(text);

      if (status) status.textContent = status.getAttribute("data-opening") || "";
      // Open the email app. In-app browsers may silently ignore this, which is why
      // the copy box above is already filled.
      window.location.href = mailto;
      card.scrollIntoView({ block: "nearest" });
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (!copyArea.value) copyArea.value = build();
        // The button also works before submitting, so make the box visible first.
        card.classList.add("show");
        card.scrollIntoView({ block: "nearest" });
        copyText(copyArea.value).then(function () {
          if (status) status.textContent = status.getAttribute("data-copied") || "Copied.";
        }).catch(function () {
          copyArea.focus();
          copyArea.select();
          if (status) status.textContent = status.getAttribute("data-manual") || "";
        });
      });
    }
  });
})();
