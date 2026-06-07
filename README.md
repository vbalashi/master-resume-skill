# Master Resume Skill

A portable agent skill that turns your existing CVs into a structured master profile, a polished LaTeX PDF resume, LinkedIn-ready text, and personalized career recommendations through a guided conversation.

This repository is the **skill source**. It should not be used as the private resume data workspace.

Recommended locations:

| Purpose | Path |
|---|---|
| Skill development repo | `~/dev/master-resume-skill` |
| Private resume data workspace | `~/Documents/master-resume` or another user-chosen folder |
| Codex/OpenAI local skill entry | `<resume-workspace>/.codex/skills/master-resume` |
| Claude-style local skill entry | `<resume-workspace>/.agents/skills/master-resume` |

## TL;DR

1. Clone this repo as the skill source.
2. Link or install the skill into the resume workspace.
3. Ask the agent to initialize a resume workspace.
4. Put all starting files into the workspace `inbox/`.

The agent will create the personal folder structure, extract your experience, interview you about each item, then generate: a master profile (YAML), a LaTeX PDF CV, LinkedIn-ready text, and career recommendations. The full process takes 1–3 sessions depending on career length.

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

**For PDF compilation:**
- TeX Live (Linux/Mac): `sudo apt install texlive-full` or `brew install --cask mactex`
- See [latex/BUILD.md](latex/BUILD.md) for detailed build instructions

---

## Setup

### 1. Clone this source repo

```bash
git clone https://github.com/vbalashi/master-resume-skill
cd master-resume-skill
```

### 2. Package the skill

```bash
scripts/package_skill.sh
```

The archive lands in `dist/` and contains a clean `master-resume/` skill folder plus `INSTALL.md`.

### 3. Install the skill locally

For local development, use workspace-local symlinks so edits in this repo are visible immediately only inside the resume workspace:

```bash
mkdir -p ~/Documents/master-resume/.codex/skills ~/Documents/master-resume/.agents/skills
ln -sfn ~/dev/master-resume-skill ~/Documents/master-resume/.codex/skills/master-resume
ln -sfn ~/dev/master-resume-skill ~/Documents/master-resume/.agents/skills/master-resume
```

For another user's machine, send the archive from `dist/`; they can copy or symlink the packaged `master-resume/` folder into their resume workspace skills directory. Global install is optional, not the default.

Restart the agent after installing.

### 4. Initialize a resume workspace

Ask the agent to initialize a master-resume workspace. It should ask where to create it; the suggested default is `~/Documents/master-resume`.

The workspace starts with a simple inbox:

```text
master-resume/
├── inbox/
└── people/
```

Drop all starting material into `inbox/`:

```
inbox/
├── CV_2024.docx
├── CV_2022.pdf
├── LinkedIn_export.pdf
├── job-description.txt
└── notes.md
```

The agent creates `people/{you}/`, classifies the files, and moves/copies them into the right internal folders.

Any format works: `.docx`, `.pdf`, `.txt`, `.md`. More versions = better extraction.

**Also useful to add:**
- Self-assessment documents
- Performance reviews (redacted)
- Notes about what you want next
- Any coaching or mentoring notes you have

---

## How to start

In Codex/Claude, start conversationally:

```
Initialize my master-resume workspace.
```

With Claude Code slash command compatibility, you can also type:

```
/master-resume
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
├── SKILL.md                  ← Standard OpenAI/Codex and Claude-style skill entrypoint
├── agents/
│   └── openai.yaml           ← Codex UI metadata
├── scripts/
│   ├── package_skill.sh      ← Builds a clean transferable archive
│   └── validate_skill.sh     ← Checks required skill behavior
├── .claude/
│   └── commands/
│       └── master-resume.md   ← Claude Code slash-command compatibility
├── shared/
│   ├── schema.md              ← YAML field definitions
│   └── quality-checklist.md   ← Pre-output validation checks
├── latex/
│   ├── BUILD.md               ← LaTeX build instructions
│   ├── template.tex           ← Generic CV template
│   ├── yaac-another-awesome-cv.cls  ← CV document class
│   └── fonts/                 ← Source Sans Pro fonts
└── people/                    ← Kept only as a gitignored local scratch area; real user data belongs in a separate workspace
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
