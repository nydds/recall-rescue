/* Recall Rescue — recall & no-show leak calculator.
   One file serves both the English page (/) and the Korean page (/ko/).
   It writes numbers only; every label stays in the page's own HTML. */
(function () {
  "use strict";

  var WORK_DAYS = 240;          // working days a year (stated assumption on the page)
  var RECOVERY_RATE = 0.10;     // conservative share of overdue patients who return
  var PRICE_SPRINT = 249;       // founding sprint price
  var PRICE_CARE = 149;         // founding monthly care price

  var usd = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0
  });
  var num = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  function readNumber(id, fallback, min, max) {
    var el = document.getElementById(id);
    if (!el) return fallback;
    var v = parseFloat(String(el.value).replace(/[^0-9.\-]/g, ""));
    if (isNaN(v)) v = fallback;
    if (typeof min === "number" && v < min) v = min;
    if (typeof max === "number" && v > max) v = max;
    return v;
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function compute(p, c, visit, appts, noShow) {
    var overdue = p * (1 - c / 100);
    var annualRecallLeak = overdue * 2 * visit;               // two hygiene recalls a year
    var annualNoShowLoss = appts * (noShow / 100) * visit * WORK_DAYS;
    var annualLeak = annualRecallLeak + annualNoShowLoss;
    var monthlyLeak = annualLeak / 12;
    var recoveredPatients = overdue * RECOVERY_RATE;
    var recoveredValue = recoveredPatients * visit;
    var sprintVisits = visit > 0 ? Math.ceil(PRICE_SPRINT / visit) : 0;
    var careVisits = visit > 0 ? Math.ceil(PRICE_CARE / visit) : 0;
    return {
      overdue: overdue,
      annualLeak: annualLeak,
      annualRecallLeak: annualRecallLeak,
      annualNoShowLoss: annualNoShowLoss,
      monthlyLeak: monthlyLeak,
      recoveredPatients: recoveredPatients,
      recoveredValue: recoveredValue,
      sprintVisits: sprintVisits,
      careVisits: careVisits
    };
  }

  function render() {
    var patients = readNumber("calc-patients", 1200, 0, 100000);
    var compliance = readNumber("calc-compliance", 55, 0, 100);
    var visit = readNumber("calc-value", 250, 1, 100000);
    var appts = readNumber("calc-appts", 20, 0, 500);
    var noShow = readNumber("calc-noshow", 6.4, 0, 100);

    var r = compute(patients, compliance, visit, appts, noShow);

    setText("out-overdue", num.format(Math.round(r.overdue)));
    setText("out-of", num.format(Math.round(patients)));
    setText("out-monthly", usd.format(Math.round(r.monthlyLeak / 10) * 10));
    setText("out-annual", usd.format(Math.round(r.annualLeak / 100) * 100));
    setText("out-recall-annual", usd.format(Math.round(r.annualRecallLeak / 100) * 100));
    setText("out-noshow-annual", usd.format(Math.round(r.annualNoShowLoss / 100) * 100));
    setText("out-recover-count", num.format(Math.round(r.recoveredPatients)));
    setText("out-recover-money", usd.format(Math.round(r.recoveredValue / 100) * 100));
    setText("out-sprint-visits", num.format(r.sprintVisits));
    setText("out-care-visits", num.format(r.careVisits));

    // The bar shows the leak left after a conservative 10% recovery.
    var pct = r.annualLeak > 0 ? Math.max(2, Math.min(100, (r.annualLeak - r.recoveredValue) / r.annualLeak * 100)) : 0;
    var bar = document.getElementById("bar-fill");
    if (bar) bar.style.width = pct.toFixed(1) + "%";
  }

  function init() {
    var inputs = ["calc-patients", "calc-compliance", "calc-value", "calc-appts", "calc-noshow"];
    var found = false;
    inputs.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        found = true;
        el.addEventListener("input", render);
        el.addEventListener("change", render);
      }
    });
    if (found) render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
