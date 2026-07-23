# INDIE Protect

INDIE Protect is a responsive, mobile-first insurance experience designed for the
Product Matters 6.0 capstone with IndusInd General Insurance. It connects
insurance discovery, comparison, purchase, policy management, claims, renewals,
assistance, and plain-language guidance in one bank-native experience.

This is a frontend prototype. Purchases, payments, claims, document uploads, AI
answers, and service bookings are simulated and do not contact a live insurer.

## Prototype Highlights

- Protection Score with personalised next actions
- Motor, health, travel, home, cyber, and pet discovery
- Side-by-side comparison with visible inclusions and exclusions
- Simulated bank-linked checkout
- Cross-insurer policy vault
- Guided motor claim intake and claim tracking
- Renewal and autopay controls
- Roadside assistance, telemedicine, and home support
- Plain-language Protect AI assistant
- Consent and personalisation controls
- Local persistence and a visible Reset demo control

## Run Locally

Install the current Node.js LTS release from
[nodejs.org](https://nodejs.org/), then open PowerShell:

```powershell
cd C:\defnotvibecoded\indie-protect
corepack enable
corepack prepare pnpm@11.7.0 --activate
pnpm install
pnpm dev --host 0.0.0.0
```

Open [http://localhost:5173](http://localhost:5173).

If PowerShell still cannot find `pnpm`, use Corepack directly:

```powershell
corepack pnpm install
corepack pnpm dev --host 0.0.0.0
```

## Test On A Phone

Keep the phone and computer on the same Wi-Fi network. In PowerShell, run:

```powershell
ipconfig
```

Find the computer's IPv4 address, then open this address on the phone:

```text
http://YOUR_IPV4_ADDRESS:5173
```

Example: `http://192.168.1.24:5173`.

## Build And Preview

```powershell
cd C:\defnotvibecoded\indie-protect
pnpm run build
pnpm run preview --host 0.0.0.0
```

The production files are generated in `dist`.

## Suggested Walkthrough

1. Start on Home and review the Protection Score and motor renewal.
2. Open Explore, choose Motor, and compare the three recommended plans.
3. Select Drive Total and complete the simulated checkout.
4. Open Policies to view the new policy beside the existing policies.
5. Open Claims, report motor damage, add evidence, and submit the claim.
6. Advance the claim status to demonstrate tracking and claim ownership.
7. Open Protect AI and ask why the claim needs an FIR.
8. Open Profile to show the consent controls.
9. Use Reset demo when the walkthrough is complete.

## Local Data

Prototype state is stored in the browser under:

```text
indie-protect-capstone-v1
```

No personal information is transmitted. Reset demo restores the original
scenario.

## Submission Files

The presentation and its PDF export are in `output`. The written product case,
LinkedIn copy, demo script, and deployment instructions are in the project root.

