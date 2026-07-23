# INDIE Protect Submission Guide

The capstone requires a presentation deck, a clickable prototype, and a
mandatory LinkedIn post. A demo video is optional.

## Files To Submit

- `output/INDIE_Protect_Capstone_Deck.pptx`
- `output/INDIE_Protect_Capstone_Deck.pdf`
- Public prototype URL from Vercel
- Public LinkedIn post URL
- Optional demo video URL

The deck stays within the 15-slide maximum. The prototype is frontend-only and
uses simulated data, so it can be hosted on a free static deployment.

## Recommended Free Hosting: Vercel

Vercel is the simplest option for this Vite project. A Figma file would only
show screens; it would not preserve the working purchase, claim, renewal,
persistence, and reset flows.

### Upload Through GitHub

1. Create a new GitHub repository named `indie-protect-capstone`.
2. Upload the **contents** of `C:\defnotvibecoded\indie-protect`, not a shortcut
   and not only the `dist` folder.
3. Do not upload `node_modules`.
4. In Vercel, choose **Add New > Project** and import that repository.
5. Keep Framework Preset as **Vite**.
6. If the repository contains only this project, leave Root Directory blank.
7. If the whole `defnotvibecoded` folder is uploaded, set Root Directory to
   `indie-protect`.
8. Set Build Command to `pnpm run build`.
9. Set Output Directory to `dist`.
10. Deploy, open the generated URL, and test Home, Explore, Purchase, Policies,
    Claims, and Reset demo.

`vercel.json` already includes the single-page-app rewrite needed for refreshed
routes.

### Upload With Git Commands

Run these commands in PowerShell after creating an empty GitHub repository:

```powershell
cd C:\defnotvibecoded\indie-protect
git init
git add .
git commit -m "Add INDIE Protect capstone prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/indie-protect-capstone.git
git push -u origin main
```

Replace `YOUR_USERNAME` with the GitHub username. GitHub may open a browser for
sign-in.

### Prevent Common Build Failures

The repository root used by Vercel must contain:

```text
index.html
package.json
pnpm-lock.yaml
src/
vite.config.ts
vercel.json
```

If Vercel says it cannot resolve `/src/main.tsx`, the `src` folder was not
uploaded at the same repository level as `index.html`.

If the deployment URL returns `404: NOT_FOUND`, open the latest successful
deployment from the Vercel project dashboard and use its assigned production
domain. A deleted or superseded deployment URL will not recover by rebuilding
locally.

## Add The Final Link

After deployment:

1. Replace `[ADD PUBLIC PROTOTYPE URL]` in `LINKEDIN_POST.md`.
2. Put the same URL in the prototype field of the capstone submission form.
3. Add the URL to the final slide before exporting the final upload copy if the
   form expects the deck itself to contain the link.
4. Test the URL in a private browser window and on a phone.

## LinkedIn Submission

Use `LINKEDIN_POST.md` as the prepared post. Tag the official E-Cell IIT
Guwahati page using LinkedIn's tag picker, attach a prototype image, publish the
post, and submit the public post URL. A text mention typed without selecting the
official page may not create a valid tag.

## Optional Demo Video

Use `DEMO_SCRIPT.md` to record a 2-3 minute walkthrough. Upload the MP4 to Google
Drive or YouTube as **Anyone with the link can view**, then test the URL while
signed out.

## Final Submission Sequence

1. Open the prototype in a private browser window and complete the demo once.
2. Open the deck PDF and verify all 15 slides.
3. Publish the LinkedIn post and copy its public URL.
4. Upload the deck in the format accepted by the submission form.
5. Paste the prototype URL and LinkedIn URL.
6. Add the optional demo URL.
7. Submit and retain a screenshot or confirmation email.

The brief states a deadline of 20 July, EOD. Confirm the active submission status
in the course portal before relying on a late upload.
