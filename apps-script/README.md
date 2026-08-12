# Google Apps Script setup (email trackers)

Emails go to **damnart.seo@gmail.com** for:

- form submissions (always)
- call button clicks (**only if `gclid` is present**)
- iMessage button clicks (**only if `gclid` is present**)

## Deploy

1. Open [script.google.com](https://script.google.com) → **New project**
2. Replace `Code.gs` with the contents of `apps-script/Code.gs`
3. **Deploy** → **New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the Web App URL
5. In `index.html`, replace:

```js
const APPS_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
```

with your deployment URL.

## Notes

- Form emails always include lead fields. Marketing fields (`gclid`, UTMs, etc.) are included **only when present**.
- Call / iMessage still open the phone/Messages app every time; Apps Script is contacted only when `gclid` exists in the URL or session storage.
- Attribution params are captured from the landing URL and kept in `sessionStorage` for the visit.
