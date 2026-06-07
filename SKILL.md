---
name: "master-resume"
description: "Set up and operate a portable master-resume workspace for honest CV extraction, STAR audit, targeted resume generation, visual QA, packaging, and Git publishing. Use this skill whenever the user wants to install, initialize, extract from source resumes, build master-profile.yaml, audit experience, generate a CV/resume, package the skill for another user, or publish it to GitHub."
---

# Master Resume

Use this skill to create and maintain a portable resume workspace. The workspace stores one source of truth per person, extracts facts from old resumes, audits experience honestly, and generates targeted CVs only after completeness checks.

## Where This Skill Lives

Keep the skill source separate from resume data.

- Development/source repository: a dedicated repo such as `~/dev/master-resume-skill`
- Resume data workspace: a user-chosen folder such as `~/Documents/master-resume`
- Codex/OpenAI local skill entry: `<resume-workspace>/.codex/skills/master-resume/`, preferably a symlink to the development repo while developing
- Claude-style local skill entry: `<resume-workspace>/.agents/skills/master-resume/`, preferably a symlink to the development repo while developing

Do not install this skill globally unless the user explicitly wants it available in every project. Resume skills are usually workspace-local because they operate on private career data. The skill repository contains reusable instructions, scripts, schemas, templates, and packaging logic; the resume workspace contains private data and a local symlink to that source.

## First-Run Onboarding

When the user is setting this up for the first time, do not assume paths.

1. Ask where to create the workspace. Suggest `~/Documents/master-resume` as the default, but wait for confirmation or a different path.
2. Create a root `inbox/` folder immediately. Tell the user they can put all starting material there without knowing the internal folder structure.
3. Ask whose resume is being built and create a slug such as `people/nikolai-khrustalev/`. If the user does not know the slug, infer it from the name and confirm it.
4. Create the full personal folder structure yourself. The user should not have to manually create `people/{person}` or find `old-cv`.
5. Explain the simple input rule:
   - the user can drop all source resumes, LinkedIn exports, job descriptions, recruiter notes, coaching notes, PDFs, DOCX files, text files, and raw notes into `inbox/`
   - the agent will classify and move/copy those files into the appropriate person folder before extraction
   - if files are already in a person folder, keep them there and create any missing folders
6. If the user has no files, say that the skill can start from scratch and ask for text or voice-dictated career history. Capture roles, dates, employers, responsibilities, achievements, tools, and constraints into `master-profile.yaml`.
7. Create this minimum structure:

```text
master-resume/
  inbox/
  people/{person}/
    master-profile.yaml
    audit-log.yaml
    source-docs/
      old-cv/
      career-coaching/
    companies/
    latex/
    output/
  shared/
    schema.md
    quality-checklist.md
```

## Inbox Triage

Before extraction, inspect `inbox/` and any user-specified input folder.

Classify files conservatively:
- old resumes, LinkedIn exports, and career history documents -> `people/{person}/source-docs/old-cv/`
- career coaching, behavioral notes, strengths, identity notes -> `people/{person}/source-docs/career-coaching/`
- job descriptions, recruiter notes, company research -> `people/{person}/companies/{company-slug}/`
- unclear files -> ask before moving, or place in `people/{person}/source-docs/unsorted/` with a short note

When moving files:
- create missing folders first
- preserve original filenames
- avoid overwriting existing files; add a suffix when needed
- record where each extracted source came from in `sources`
- tell the user what was moved and where

## Required Software

Before extraction or generation, check software and install what is missing when the user permits local installation.

Required:
- Node.js and npm
- `docx` npm package for optional Word export
- `markitdown` for parsing source resumes when files exist
- `tectonic` or `lualatex` for PDF generation
- `pdftoppm` and `pdftotext` from Poppler for visual and text QA

If installation fails, stop and report the exact blocker. Do not continue with partial generation after permission, network, package-manager, or filesystem errors. If the error appears to be missing rights, tell the user which command failed and that elevated permissions or a manual install is needed.

## Extraction

Read all source resumes from `inbox/`, `people/{person}/source-docs/old-cv/`, and any user-specified source folders. Triage inbox files first, then parse `.pdf`, `.docx`, `.txt`, and `.md` files with the most reliable available parser.

If no source files exist:
- ask the user for text or voice input
- build the first `career_context` and `experience_inventory` entries from the conversation
- mark units as `raw` or `partial`, never as `reviewed`

Extraction rules:
- do not embellish
- split experience into atomic units: one action, one object, one context
- track every source in `sources`
- use `status: raw`, `completeness: 1`, `confidence: low` for file-extracted units until audit
- leave `classification` and `resume_candidate` unset until audit asks the positioning question

## Audit

Audit experience one unit at a time. Ask one question, wait for the answer, then update `master-profile.yaml` immediately.

Core questions:
1. What did you personally do, not the team?
2. How deep was your involvement?
3. How often and during what period did you do it?
4. What changed because of this work? Ask for numbers if available.
5. Where were the boundaries between your work and other people?
6. Could you discuss this for five minutes in an interview?
7. Is the skill current, recent, or dated?
8. Should this be shown for the target role?
9. Do you use AI tools, scripts, or local automation that are not obvious from old resumes?
10. Are any client names, project names, systems, or internal terms confidential?

After the answers, derive `contribution`, `depth`, `frequency`, `freshness`, `interview_risk`, `classification`, `completeness`, `confidence`, and `resume_candidate` using `shared/schema.md`. Contribution level in generated CV text must match the audited `contribution` field exactly.

## Completeness Gate Before Generation

Before generating any CV, run this gate and stop if it fails.

Required profile checks:
- `master-profile.yaml` is valid YAML
- `person.name` and at least one contact channel exist
- every selected experience ID exists and references a valid `career_context`
- selected units are `reviewed` or `validated`, or the user explicitly approves a lower-confidence draft
- selected units have `completeness >= 3`
- no selected unit has `interview_risk: high` or `interview_risk: red`
- every listed skill is backed by selected experience or `technologies`
- target market, language, CV length, photo expectation, and role title are known
- confidentiality questions have been answered for sensitive names
- a positioning profile exists or the user has approved the selected units

If the gate fails, report the missing items and ask for the minimum input needed. Do not silently fill gaps.

## Generation

Generate from `people/{person}/master-profile.yaml`.

Prefer PDF when the workspace has a LaTeX template. Use DOCX only when the user asks for Word output or a portal requires it.

For targeted applications, create or update:

```text
people/{person}/companies/{company-slug}/
  company-brief.md
  role-notes.md
  job-description.md
  requirements-map.md
  cv-positioning.md
  cv-draft.md
```

Keep company-specific phrasing in the company pack and positioning profile. Do not distort the master experience units.

## LinkedIn Evidence

Before writing LinkedIn text or career recommendations, collect observable LinkedIn search evidence when the user is logged in, can provide screenshots/exports, or explicitly asks for LinkedIn optimization.

Write findings to `people/{person}/linkedin/linkedin-search-evidence.md`.

Test 6-10 people-search queries from the target positioning profile:
- broad role queries
- domain queries
- technology-stack queries
- geography-specific queries when relevant
- current-company/title sanity queries when useful

For each query, record the exact query text, URL or screenshot source, visible rank or "not visible", top competing profile headlines, repeated keywords, and notes about observed ranking patterns.

Use observed evidence, not intuition, for LinkedIn discoverability claims. If LinkedIn cannot be accessed, mark LinkedIn recommendations as evidence-limited and ask for screenshots, exports, or permission to browse.

## Mandatory Final QA

Do not call a resume finished until the final artifact is visually checked.

For PDF:
1. Build the PDF.
2. Render every page to PNG with `pdftoppm`.
3. Inspect each rendered page image.
4. Check that sections do not overlap, text does not run off the page, bullets wrap cleanly, and page count is expected.
5. Extract text with `pdftotext` and verify target keywords are present.

For DOCX:
1. Generate the DOCX.
2. Convert or render it to a visually inspectable format when tooling is available.
3. Inspect layout before finalizing.

Always run `shared/quality-checklist.md` before the final response.

## Packaging For Another User

When the user asks to package or share the skill, run:

```bash
scripts/package_skill.sh
```

The archive must include the skill folder and a top-level `INSTALL.md` that explains where to copy it, how to initialize a workspace, what software is required, and how to provide source resumes or start from voice/text input.

## Git Publishing

When the user asks to publish the skill to GitHub:

1. Confirm the repository target: new repository or existing remote.
2. Check `git status` and do not overwrite unrelated user changes.
3. Ensure the package archive and install instructions are current.
4. Commit the skill files with a clear message.
5. Add or verify the remote.
6. Push the selected branch.
7. Report the GitHub URL and branch.

If authentication or permissions fail, stop and report the exact failure. Do not retry with destructive commands.
