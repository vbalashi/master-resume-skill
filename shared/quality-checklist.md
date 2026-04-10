# Quality Checklist for CV/LinkedIn Generation

This checklist is derived from real iteration cycles. Every skill (resume-extract, resume-audit, resume-generate, linkedin-optimize) MUST reference this file and run these checks before finalizing output.

---

## 1. Confidentiality & Jargon Filter

Before including ANY of these in output, ask the person:

- [ ] **System/product names** (e.g., "TCS BaNCS") — is this confidential? Is it under NDA? Could it identify internal projects? When in doubt, generalize: "core banking system", "enterprise ERP platform"
- [ ] **Internal org structure names** (tribes, squads, chapters, guilds, pods) — meaningless to outsiders. Replace with functional descriptions: "Investment Division", not "Investment Tribe"; "tax reporting team", not "Squad Avatar"
- [ ] **Project codenames** — always replace with what the project actually does
- [ ] **Client names** — for consulting/services work, check if client relationships are public. Government clients are usually safe; corporate clients may need generalization ("a major telecom operator")

**Rule:** If an external reader wouldn't know what it means, replace it.

---

## 2. Skill Honesty Check

For every skill/tool listed on the CV or LinkedIn:

- [ ] **Can the person use this tool right now, without significant ramp-up?** If not → remove from skills section, keep only in education/certifications
- [ ] **Was this tool used daily/weekly, or just touched once?** If once → don't list as a skill
- [ ] **Is the person confident enough to discuss it in an interview for 5 minutes?** If not → remove or move to "exposure" category
- [ ] **Cross-check with impostor_calibration and rothbard_trap** — are skills being overclaimed (compensation) or underclaimed (Rothbard)? Adjust accordingly

**Common traps:**
- Certifications without practice (AWS cert but only used S3 once)
- Methodologies from years ago (BPMN/UML learned 10+ years ago, not used since)
- Tools used by the team but not by this person personally

---

## 3. Rothbard Trap Cross-Check

After generating CV/LinkedIn content, cross-reference with `career_identity.rothbard_trap`:

- [ ] Are the things the person **devalues** properly represented? These are often the most valuable differentiators and tend to be invisible to the person themselves
- [ ] Is the person positioned at the **correct seniority level**? Cross-check `impostor_calibration.reframe` — if the analysis says "already operating at Senior level", the CV must say Senior
- [ ] Does the **professional self-description** on CV match the actual contribution pattern, or does it fall into the Rothbard trap of leading with category ("I work in IT") instead of contribution?
- [ ] Are **energy sources** reflected in the job search targets? Don't optimize for roles that match the person's drains

---

## 4. Positioning Consistency Check

After all documents are generated (CV, LinkedIn, recommendations), verify:

- [ ] **Title consistency**: if recommendations say "Senior BA", CV tagline must say "Senior BA", LinkedIn headline must say "Senior BA"
- [ ] **Tool/skill lists match** between CV and LinkedIn (LinkedIn can have more, but CV shouldn't list anything LinkedIn doesn't)
- [ ] **Period dates** are consistent across CV, LinkedIn, and master-profile.yaml
- [ ] **Company descriptions** use the same wording across all documents
- [ ] **Narrative tone** is consistent — same person across all channels

---

## 5. Chronological Integrity

- [ ] **No date overlaps** between positions (unless genuinely concurrent — part-time, freelance)
- [ ] **No unexplained gaps** — every gap > 3 months should have a context entry (relocation, education, parental leave, job search). The gap may not appear on the CV, but it must be documented in master-profile.yaml
- [ ] **Education dates** don't conflict with work start dates (e.g., working full-time before graduation is common but should be noted)

---

## 6. Tool Name Deduplication

- [ ] No duplicate tools in tags/skills (e.g., "Oracle SQL" + "PL/SQL Developer" → "Oracle SQL Developer")
- [ ] Canonical names used (not "Postgre" but "PostgreSQL", not "MS Azure" but "Microsoft Azure")
- [ ] No generic + specific in the same list (don't list both "SQL" and "Oracle SQL" — use the specific one)

---

## 7. AI/Automation Skills Probe

During audit, **explicitly ask**:

- [ ] "Do you use AI tools (Copilot, ChatGPT, Claude) in your daily work?"
- [ ] "Have you written scripts (Python, SQL, etc.) to automate any of your work?"
- [ ] "What tools do you use for local testing/data analysis that aren't part of the 'official' toolset?"

These are often invisible skills that people don't think to mention but are highly marketable in 2025+.

---

## 8. Education Localization

In master-profile.yaml, store BOTH:
```yaml
education:
  - institution: Moscow Aviation Institute
    degree_original: "Автоматизированные системы управления экономическими объектами"
    degree_localized: "Business Information Systems"
    degree_english: "Automated Management Systems for Economic Objects"
    use_on_cv: degree_localized  # what to put on the CV for the target market
```

**Rule:** Use whichever name will be understood on the target market. Store the original for reference.

---

## 9. Market-Specific Adjustments

Before generating a CV, confirm:

- [ ] **Target market** — which country/region? Job titles, expected formats, and norms differ
- [ ] **Title translation** — "Senior Analyst" in Russia may map to different NL titles. Consider: Business Analyst, Functional Analyst, Product Analyst
- [ ] **Photo** — expected in NL/DE, unusual in UK/US
- [ ] **CV length** — 1 page for NL/US, 2 pages acceptable in DE/academic
- [ ] **Language of CV** — English for NL international companies, Dutch for government/local

---

## 10. Final Self-Test

Before declaring the CV "done", answer these questions:

1. Would a recruiter who reads this for 10 seconds understand what this person does?
2. Would a hiring manager who reads the Rabobank section understand the impact without knowing Rabobank's internal structure?
3. Is every skill listed something the person can discuss in an interview?
4. Does the seniority level match the actual scope of work, not just the job title they were given?
5. Are the most valuable contributions (from career_identity.natural_strengths) visible on the CV?
