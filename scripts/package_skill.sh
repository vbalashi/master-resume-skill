#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
SKILL_NAME="master-resume"
OUT_DIR="${1:-${SKILL_DIR}/dist}"
VERSION_TAG="$(date +%Y%m%d-%H%M%S)"
WORK_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "${WORK_DIR}"
}
trap cleanup EXIT

mkdir -p "${OUT_DIR}" "${WORK_DIR}/${SKILL_NAME}"

copy_if_exists() {
  local src="$1"
  local dst="$2"
  if [ -e "${SKILL_DIR}/${src}" ]; then
    mkdir -p "$(dirname "${WORK_DIR}/${SKILL_NAME}/${dst}")"
    rsync -a --exclude ".DS_Store" "${SKILL_DIR}/${src}" "${WORK_DIR}/${SKILL_NAME}/${dst}"
  fi
}

copy_if_exists "SKILL.md" "SKILL.md"
copy_if_exists "agents/" "agents/"
copy_if_exists "scripts/" "scripts/"
copy_if_exists "shared/" "shared/"
copy_if_exists "latex/" "latex/"
copy_if_exists ".claude/" ".claude/"

cat > "${WORK_DIR}/INSTALL.md" <<'INSTALL'
# Master Resume Skill Installation

## Install the skill

Install the `master-resume` folder into your resume workspace skills directory.

Recommended local workspace locations:

- Codex: `<resume-workspace>/.codex/skills/master-resume/`
- Claude-style agents: `<resume-workspace>/.agents/skills/master-resume/`

If you are developing the skill yourself, prefer a workspace-local symlink from the resume workspace to your source repo:

```bash
mkdir -p ~/Documents/master-resume/.codex/skills ~/Documents/master-resume/.agents/skills
ln -sfn ~/dev/master-resume-skill ~/Documents/master-resume/.codex/skills/master-resume
ln -sfn ~/dev/master-resume-skill ~/Documents/master-resume/.agents/skills/master-resume
```

If someone sent you this archive, copy the packaged `master-resume/` folder into one of the local workspace locations above. Install globally only if you explicitly want the skill available in every project.

Restart the agent after copying so the skill metadata is loaded.

## First run

Ask the agent to initialize a master-resume workspace. The agent should ask where to create it. The suggested default is `~/Documents/master-resume`, but you can choose any folder.

The installed skill and the resume workspace are separate:

- skill source/development repo: `~/dev/master-resume-skill`
- local installed skill entry: `<resume-workspace>/.codex/skills/master-resume/` or `<resume-workspace>/.agents/skills/master-resume/`
- private resume data workspace: `~/Documents/master-resume` or another folder you choose

## Source resume inputs

You do not need to create the internal `people/{person}` folders by hand.

Put existing resumes, LinkedIn exports, notes, PDFs, DOCX files, job descriptions, recruiter notes, coaching files, or text files into the root inbox:

```text
inbox/
```

The agent will create the personal folder, classify the files, and move/copy them into the right place before extraction.

If you have no files, tell the agent your career history in text or by voice dictation. It will create the first `master-profile.yaml` from that conversation and mark entries as unaudited until reviewed.

## Required software

The agent will check for:

- Node.js and npm
- markitdown
- tectonic or lualatex
- Poppler tools: pdftoppm and pdftotext

If installation fails because of permissions, network, or package manager errors, the agent should stop and tell you what failed.

## Normal workflow

1. Initialize workspace.
2. Add source resumes or provide text/voice input.
3. Extract facts into `master-profile.yaml`.
4. Audit experience with STAR questions.
5. Generate a targeted CV only after completeness checks pass.
6. Visually inspect the final PDF or DOCX before treating it as done.
INSTALL

ARCHIVE="${OUT_DIR}/${SKILL_NAME}-${VERSION_TAG}.zip"
(cd "${WORK_DIR}" && zip -qr "${ARCHIVE}" "${SKILL_NAME}" "INSTALL.md")

echo "${ARCHIVE}"
