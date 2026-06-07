#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
SKILL_MD="${SKILL_DIR}/SKILL.md"

test -f "${SKILL_MD}"
test -f "${SKILL_DIR}/agents/openai.yaml"
test -x "${SKILL_DIR}/scripts/package_skill.sh"
test -d "${SKILL_DIR}/shared"
test -d "${SKILL_DIR}/latex"

required_patterns=(
  "Ask where to create the workspace"
  "~/Documents/master-resume"
  "inbox/"
  "Inbox Triage"
  "user should not have to manually create"
  "source-docs/old-cv"
  "text or voice"
  "Completeness Gate Before Generation"
  "Mandatory Final QA"
  "Required Software"
  "installation fails"
  "package_skill.sh"
  "Git Publishing"
  "Where This Skill Lives"
  "LinkedIn Evidence"
)

for pattern in "${required_patterns[@]}"; do
  if ! grep -Fq "${pattern}" "${SKILL_MD}"; then
    echo "Missing required pattern: ${pattern}" >&2
    exit 1
  fi
done

bash -n "${SKILL_DIR}/scripts/package_skill.sh"

if grep -Fq "/Users/khrustal/dev/master-resume/.agents" "${SKILL_DIR}/SKILL.md" "${SKILL_DIR}/scripts/package_skill.sh" 2>/dev/null; then
  echo "Found old data-repo skill path reference" >&2
  exit 1
fi

echo "OK"
