# INDIE Protect Product Case

## Executive Summary

INDIE Protect is a bank-native protection cockpit for IndusInd customers. It
starts with motor and health insurance, then expands to travel, home, cyber, and
pet protection. The product turns fragmented policies into clear actions before,
during, and after an incident.

The core product bet is that insurance becomes more useful when it is connected
to the customer's financial life, explained in plain language, and supported by
visible claim ownership. INDIE Protect therefore combines a Protection Score,
cross-insurer policy vault, transparent comparison, guided claims, renewals,
assistance services, and consent-based recommendations.

## Evidence And Opportunity

- India's non-life insurance penetration was 1.0% and density was USD 25 in
  2023, indicating a meaningful protection gap.
- IndusInd reported more than 41 million customers and a digital transaction mix
  above 93% in FY 2024-25.
- IndusInd stated that INDIE was being extended to more than 15 million existing
  retail accounts after adding 1.4 million new accounts, with monthly active use
  of about 50%.

The size model used in the deck is directional:

| Layer | Working assumption |
| --- | --- |
| TAM | 41 million IndusInd customers |
| SAM | 15 million INDIE retail accounts |
| Three-year SOM | 1.5 million protected users, or 10% of SAM |
| Illustrative throughput | Rs. 1,200 crore annual premium at Rs. 8,000 blended premium |

The throughput figure is not revenue. It is an explicit product-planning
assumption to show the scale of the opportunity.

## Primary Persona

**Ananya Rao, 31** is a Bengaluru product manager and INDIE salary customer. She
owns a car and a family health policy, compares products before buying, and
expects digital self-service. Her motor renewal is due while her parents' health
needs are becoming more important.

Her central frustration is not knowing what a policy actually covers until she
needs to claim.

**Job to be done:** Help me understand my protection and take the right action
before, during, and after an incident.

## Problem Statement

Customers must currently move between comparison sites, insurer portals,
documents, bank records, garages, hospitals, and call centres. This creates four
linked failures:

1. Coverage gaps stay invisible until an incident.
2. Product comparison over-emphasises price and under-explains exclusions.
3. Policy and renewal information is fragmented.
4. Claims feel opaque because ownership, required evidence, and next steps are
   unclear.

## Product Vision

Make protection as understandable and actionable as a bank balance.

INDIE Protect creates value through:

- **Clarity:** one Protection Score, plain-language terms, and visible exclusions.
- **Continuity:** policies, renewals, claims, and assistance in one lifecycle.
- **Confidence:** guided evidence, named claim ownership, and status tracking.
- **Control:** cross-insurer imports with explicit consent and removable access.

## MVP Scope

The first release targets the highest-frequency bank-linked use cases:

- Motor and health discovery
- Side-by-side plan comparison
- Simulated account-linked purchase
- Cross-insurer policy vault
- Motor renewal and autopay
- Guided motor claim intake
- Evidence capture and claim tracking
- Roadside assistance and telemedicine
- Rules-backed plain-language assistance
- Consent and recommendation controls

Travel, home, cyber, and pet discovery appear in the prototype as the expansion
path. Automated settlement, computer-vision damage assessment, and open
marketplace monetisation remain outside the MVP.

## Prioritisation

The MVP uses RICE for sequencing and MoSCoW for release boundaries.

The highest-priority capabilities are the policy vault, renewal actions,
transparent comparison, guided claims, claim tracking, and consent controls.
These capabilities directly reduce lifecycle friction and create a reason to
return after purchase.

## North Star And Metrics

**North Star:** Monthly Protected Customers

A customer counts when they complete at least one meaningful protection action
in a month: add or review a policy, compare cover, renew, file or track a claim,
or use an assistance service.

Supporting measures:

- Discovery-to-comparison conversion
- Comparison-to-purchase conversion
- Policy import completion
- Renewal completion and autopay opt-in
- Claim intake completion
- Median time to first claim update
- Assistance success rate
- 30-day protected-customer retention
- Complaint rate and claim abandonment
- Recommendation opt-out and consent revocation rates

## Go-To-Market

The launch begins with INDIE salary customers whose motor policies are due
within 60 days. Bank transaction and customer data may be used only where
consent, purpose, and retention are clear.

1. **Learn:** 10,000 invited customers, concierge claim support, and usability
   research.
2. **Prove:** motor renewal journeys, policy imports, and claim intake at
   measurable service levels.
3. **Scale:** health cross-sell, wider eligibility, partner assistance, and
   category expansion.

The primary channels are the INDIE app home surface, contextual renewal prompts,
relationship-manager referrals, and post-transaction protection moments.

## Roadmap

**0-3 months:** consent model, policy vault, motor comparison, renewal, and
instrumentation.

**3-6 months:** guided motor claims, claim ownership, roadside assistance, and
service-level dashboards.

**6-12 months:** health journeys, document extraction, personalisation, partner
services, and controlled experiments.

## Architecture Direction

The prototype is frontend-only. A production architecture would require:

- INDIE identity and account-linking layer
- Consent ledger and data-retention controls
- Insurer product and policy APIs
- Payment and mandate orchestration
- Claim workflow and evidence storage
- Assistance partner integrations
- Analytics and experimentation events
- Rules and retrieval layer for approved policy explanations
- Audit logs, fraud controls, encryption, and human escalation

## Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| Customers mistake recommendations for impartial advice | Explain ranking logic, show exclusions, and label commercial relationships |
| Bank data is used beyond customer expectations | Purpose-specific consent, minimised data, expiry, and revocation |
| Claim AI gives unsafe or incorrect guidance | Approved policy sources, confidence thresholds, and human escalation |
| Insurer and partner APIs are inconsistent | Adapter layer, reconciliation, and visible fallback states |
| Growth incentives reduce claim fairness | Separate sales and claims success metrics; monitor complaints and abandonment |

## Recommendation

Run a tightly instrumented motor-renewal and motor-claims pilot inside INDIE
before expanding the catalogue. The product should earn trust through clearer
decisions and better service, not only through lower premiums.

## Sources

- Department of Financial Services, Annual Report 2024-25:
  https://financialservices.gov.in/sites/default/files/2026-01/Annual-Report-2024-25.pdf
- IndusInd Bank, Annual Report 2024-25:
  https://www.indusind.com/content/dam/indusind-corporate/investor-resource/latest-annual-report/annual_report_2024-25.pdf
- IndusInd Bank, INDIE customer migration announcement, 5 June 2025:
  https://www.indusind.com/content/indusind-corporate/en/about-us/mediabrand/FY/2025-2026/June/indusInd-bank-Brings-hyper-Personalized-banking-experience-to-over-15-million-retail-banking-customers-with-indie-app.html
- ACKO insurance app:
  https://www.acko.com/insurance-app/
- Policybazaar insurance app:
  https://www.policybazaar.com/insurance-app/
- Digit insurance app:
  https://www.godigit.com/download-digit-insurance-app
- IndusInd General Insurance claims:
  https://www.indusindinsurance.com/insurance/claimpage.aspx

