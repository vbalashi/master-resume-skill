# Master Resume Skill

A Claude Code skill that turns your existing CVs into a structured master profile, a polished LaTeX PDF resume, LinkedIn-ready text, and personalized career recommendations — through a guided conversation.

---

## What this produces

| Output | Location | What it is |
|---|---|---|
| `master-profile.yaml` | `people/{you}/` | Complete career truth document — all experience, STAR details, ratings |
| LaTeX CV | `people/{you}/latex/` | Clean PDF CV, compile with `xelatex cv.tex` |
| LinkedIn text | `people/{you}/linkedin/linkedin-content.md` | Headline, About, experience bullets, skills list |
| Career recommendations | `people/{you}/RECOMMENDATIONS.md` | Role fit analysis, target companies, what to avoid |

---

## Prerequisites

**Required:**
- [Claude Code](https://claude.ai/claude-code) (Claude's AI coding agent CLI)
- `markitdown` — parses your CV files: `pip install markitdown`
- `node` + `npm` — for generating .docx: `npm install` in repo root

**For PDF compilation (optional):**
- TeX Live (Linux/Mac): `sudo apt install texlive-full` or `brew install --cask mactex`
- See [latex/BUILD.md](latex/BUILD.md) for detailed build instructions

---

## Setup

### 1. Clone this repo and open it in Claude Code

```bash
git clone https://github.com/vbalashi/master-resume-skill
cd master-resume-skill
code .         # or: cursor . / claude .
```

Open the repo in Claude Code (run `claude` in the terminal, or open via your IDE's Claude Code extension).

### 2. Add your CV files

Create a folder for yourself and drop in all your existing CVs:

```
people/
└── your-name/
    └── source-docs/
        ├── CV_2024.docx
        ├── CV_2022.pdf
        ├── LinkedIn_export.pdf
        └── ...
```

Any format works: `.docx`, `.pdf`, `.txt`. More versions = better extraction.

**Also useful to add:**
- Self-assessment documents
- Performance reviews (redacted)
- Notes about what you want next
- Any coaching or mentoring notes you have

### 3. Install dependencies

```bash
npm install
```

---

## How to start

In Claude Code, type:

```
/master-resume your-name
```

For example:
```
/master-resume anna-smith
```

Or start conversationally:
```
/master-resume Let's build my resume — I'm Anna Smith
```

Claude will walk you through the full pipeline.

---

## What happens

The skill runs in 4 phases:

### Phase 1 — Extract
Claude reads all your CV files and extracts:
- Career timeline (all roles, companies, periods)
- Atomic experience units — one action, one result
- Technologies list

### Phase 2 — Info gathering
Claude asks about things CVs never capture:
- What colleagues say you're great at (that you dismiss)
- What drains you vs. energizes you
- AI tools and automations you use but forgot to mention
- Roles you've done but didn't put on a CV
- Target roles and what you want to move away from

### Phase 3 — Audit
Claude interviews you on each experience unit:
- What YOU specifically did (not the team)
- How deep your involvement was
- Outcomes and metrics
- Whether you could discuss it in an interview for 5 minutes
- Whether it belongs on your CV for the roles you're targeting

### Phase 4 — Generate
Claude produces all four outputs and runs a quality checklist before finalizing.

---

## Prompt variants

**Resume only (skip LinkedIn/recommendations):**
```
/master-resume anna-smith Skip LinkedIn and recommendations, I just need the PDF
```

**Update existing profile (after initial run):**
```
/master-resume anna-smith I've updated my source docs, re-extract and merge with existing profile
```

**Generate for a specific role:**
```
/master-resume anna-smith Generate CV for Senior Product Manager at a fintech startup
```

**Resume audit only:**
```
/master-resume anna-smith Let's continue the audit — I stopped at exp_rabobank_requirements
```

**LinkedIn only:**
```
/master-resume anna-smith Generate LinkedIn content from the existing master profile
```

**Career recommendations only:**
```
/master-resume anna-smith I just want the career recommendations based on what's in the profile
```

---

## File structure

```
master-resume-skill/
├── .claude/
│   └── commands/
│       └── master-resume.md   ← The skill logic
├── shared/
│   ├── schema.md              ← YAML field definitions
│   └── quality-checklist.md   ← Pre-output validation checks
├── latex/
│   ├── BUILD.md               ← LaTeX build instructions
│   ├── template.tex           ← Generic CV template
│   ├── yaac-another-awesome-cv.cls  ← CV document class
│   └── fonts/                 ← Source Sans Pro fonts
├── tools/
│   └── generate_cv.js         ← .docx generator script
├── package.json
└── people/                    ← Your data (gitignored)
    └── your-name/
        ├── master-profile.yaml
        ├── audit-log.yaml
        ├── RECOMMENDATIONS.md
        ├── source-docs/        ← Put your CVs here
        ├── latex/              ← Generated LaTeX files
        ├── linkedin/           ← Generated LinkedIn content
        └── output/             ← Generated PDFs and docx
```

---

## Privacy

All data stays local. The `people/` directory is gitignored — your master profile, CVs, and outputs are never committed or pushed.

Only the skill logic, templates, and shared schema are tracked in git.

---

## Methodology

This skill is based on a methodology developed through real resume sessions:

**Core principles:**
- **Separate truth from presentation.** `master-profile.yaml` captures what actually happened. The CV is a filtered view for a specific role.
- **Audit before generating.** Never generate a CV from raw CV text. The audit phase determines what's genuinely strong, what's risky, and what's worth showing.
- **Three independent axes:** Did it happen? (contribution, depth) → How strong is it? (frequency, freshness, interview risk) → Should it be shown now? (resume_candidate, classification)
- **Rothbard trap awareness.** People systematically undervalue what comes naturally to them. The info-gathering phase surfaces these invisible strengths.
- **Interview honesty.** Every skill on the CV must survive 5 minutes of interview questions. High-risk items are softened or excluded.

---

## Contributing

Issues and PRs welcome. The skill is designed to work with any person and any career — if you hit edge cases, open an issue.
