# Recall Rescue

Static marketing site for **Recall Rescue** — a 21-day dental recall and no-show recovery sprint for practices in Flushing and Queens, NY.

Live:
- English: https://nydds.github.io/recall-rescue/
- 한국어: https://nydds.github.io/recall-rescue/ko/
- Sample sprint pack (PDF): https://nydds.github.io/recall-rescue/assets/Recall-Rescue-Sample-Pack.pdf

## What is in here

| Path | What it is |
|---|---|
| `index.html` | English landing page: hero, leak calculator, 21-day flow, pricing, guarantee, PHI section, sample pack, request form, FAQ, sources |
| `ko/index.html` | Korean page for the practice owner (원장) — same offer, same numbers |
| `styles.css` | Shared stylesheet (no frameworks, no external assets, no trackers) |
| `assets/leak-calc.js` | The recall/no-show leak calculator. One file serves both languages; it writes numbers only, all labels live in the HTML |
| `assets/request-form.js` | Request form: builds the message, opens `mailto:`, and shows a copyable block for in-app browsers |
| `assets/Recall-Rescue-Sample-Pack.pdf` | 2-page sample pack (segments, EN/KO copy samples, tracker, calendar, closing report) |
| `tools/sample-pack.html` + `tools/build_sample_pack.py` | Source and builder for the PDF (WeasyPrint) |
| `.nojekyll` | Serve files as-is on GitHub Pages |

## Offer (fixed as of 2026-11-20)

| Step | Price |
|---|---|
| 0 · Recall leak report (1 page, 24h) | $0 |
| 1 · 21-day reactivation sprint | **$249** founding (first 3 practices) / $349 regular |
| 2 · Recall Care (monthly) | **$149/mo** founding / $199/mo regular |

Guarantee: if the three planned sends are completed and fewer than 5 patients rebook, the next month of Recall Care is free.

Payment today: invoice + Zelle or check. Card links are added when a Stripe account exists.

## Rules this site keeps

- **No PHI.** Intake asks for counts and a contact, never a patient name, birth date or insurance ID. Sending happens in the practice's own systems. Any "send on our behalf" work needs a signed BAA and is quoted separately.
- **No personal contact details.** Only the business inbox (`caremyshop.team@gmail.com`) appears on the site — no personal phone number, no home address.
- **No promised patient numbers.** Every figure is a cited public benchmark or comes from the visitor's own inputs, with the formula printed under the calculator.

## Calculator formula

```
overdue            = activePatients × (1 − compliance/100)
annualRecallGap    = overdue × 2 visits/year × productionPerVisit
annualNoShowLoss   = appointmentsPerDay × (noShowRate/100) × productionPerVisit × 240 workdays
monthlyLeak        = (annualRecallGap + annualNoShowLoss) / 12
winBack (10%)      = overdue × 0.10 × productionPerVisit
sprint break-even  = ceil(249 / productionPerVisit) visits
care break-even    = ceil(149 / productionPerVisit) visits per month
```

## Rebuilding the sample pack PDF

```bash
pip install weasyprint pymupdf          # already available in the workspace image
python3 tools/build_sample_pack.py assets/Recall-Rescue-Sample-Pack.pdf
python3 -c "import pymupdf; d=pymupdf.open('assets/Recall-Rescue-Sample-Pack.pdf'); print(d.page_count)"
```

The Korean text needs a CJK font; the HTML points at `Noto Sans CJK KR` (`/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Regular.otf` in this workspace). On another machine, change the `@font-face` src.

## Changing the contact address

`caremyshop.team@gmail.com` appears in:
- `index.html` — form `data-email`, footer, and the mailto links in prose
- `ko/index.html` — same three places
- `tools/sample-pack.html` — footer note and the running page footer

Replace all of them together so the form, the PDF and the page never disagree.

## Deploy

GitHub Pages serves `main` from the repository root. Push to `main` and the site updates within a minute.
