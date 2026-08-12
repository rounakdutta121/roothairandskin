# Rosacea landing — Google Apps Script trackers

**Separate project** from the pigmentation landing Apps Script.

Emails go to **damnart.seo@gmail.com** for:

- form submissions (always) — subject prefix `[RHS Rosacea Lead]`
- call button clicks (**only if `gclid` is present**) — `[RHS Rosacea Click]`
- iMessage button clicks (**only if `gclid` is present**) — `[RHS Rosacea Click]`

## Deploy

1. Open [script.google.com](https://script.google.com) → **New project** (do not reuse the pigmentation script)
2. Paste `rosacea-facial-redness/apps-script/Code.gs` into `Code.gs`
3. **Deploy** → **New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the Web App URL
5. In `rosacea-facial-redness/index.html`, set:

```js
const APPS_SCRIPT_URL = "YOUR_ROSACEA_APPS_SCRIPT_WEB_APP_URL";
```

## Notes

- Form emails always include lead fields. Marketing fields (`gclid`, UTMs, etc.) are included **only when present**.
- Call / iMessage still open the phone/Messages app; Apps Script is notified only when `gclid` exists.
- Attribution is stored in `sessionStorage` under `rhs_rosacea_attr_v1` (separate from the pigmentation page key).
