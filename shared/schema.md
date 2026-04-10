# Master Profile YAML Schema

Shared schema reference for all resume skills.

## Top-Level Structure

```yaml
version: 1
person: ...
career_context: [...]
experience_inventory: [...]
technologies: [...]
positioning_profiles: {...}
```

## person

```yaml
person:
  name: string
  contacts:
    phone: string
    email: string
    linkedin: string
    github: string
  current_focus: [string]
```

## career_context

Each entry represents a distinct role/position.

```yaml
career_context:
  - id: ctx_<company_short>           # e.g. ctx_opentext, ctx_liberty_pm
    company: string
    period: string                     # "YYYY - YYYY" or "YYYY - Present"
    role: string
    domain: string
    location: string
```

If same company had multiple roles, use separate entries with distinct IDs (e.g. `ctx_liberty_pm`, `ctx_liberty_data`).

## experience_inventory

Each entry is an **atomic experience unit** — one verb + object + context.

```yaml
experience_inventory:
  - id: exp_<company>_<slug>          # unique, snake_case
    title: string                      # short factual label
    context: string                    # refs career_context.id
    period: string

    # Workflow status
    status: raw|partial|reviewed|validated
    completeness: 1-5                  # info quality, not experience strength
    interview_readiness: unknown|risky|safe|strong
    confidence: low|medium|high        # memory clarity
    resume_candidate: yes|optional|no

    # STAR decomposition
    task: string                       # what problem/goal
    actions: [string]                  # what YOU did personally
    results: [string]                  # measurable outcomes
    boundaries: [string]              # what others did / your limits

    # Ratings
    contribution: observed|assisted|participated|individual|led
    depth: aware|conceptual|guided|autonomous|expert
    frequency: once|occasional|regular
    freshness: current|recent|dated
    interview_risk: low|medium|high|red

    classification: core|supporting|historical|peripheral|risky

    tools: [string]
    tags: [string]
    sources: [string]                  # CV filenames where this appeared
    notes: [string]
```

### Field Details

**status** — workflow progress:
- `raw`: extracted from CV, not yet discussed
- `partial`: some details filled, gaps remain
- `reviewed`: fully discussed, formulation clear
- `validated`: safe for resume and interview

**completeness** (1-5):
1. Almost nothing known
2. General idea, no details
3. Know what was done, missing results/context
4. Well decomposed
5. Fully described, ready to use

**contribution** — personal involvement level:
- `observed`: was nearby, didn't do it
- `assisted`: helped someone else do it
- `participated`: did part of it in a team
- `individual`: did it yourself
- `led`: drove it, made decisions

**depth** — skill/knowledge level:
- `aware`: know the term
- `conceptual`: understand the concept
- `guided`: worked under supervision
- `autonomous`: did it independently
- `expert`: solved hard problems, taught others

**interview_risk**:
- `low`: can discuss 5+ minutes confidently
- `medium`: real experience but shallow, careful wording needed
- `high`: sounds strong but won't survive probing
- `red`: remove from resume

**classification**:
- `core`: deep, recent, frequent — always show
- `supporting`: real but not central role
- `historical`: old, no longer active skill
- `peripheral`: touched briefly
- `risky`: formulation stronger than reality

## technologies

```yaml
technologies:
  - name: string
    depth: basic|intermediate|strong|expert
    last_used: int                     # year
    context: string                    # where/how used
```

## positioning_profiles

Named profiles for different target roles.

```yaml
positioning_profiles:
  <profile_name>:
    target_role: string
    summary: string                    # 2-3 sentence positioning statement
    highlight: [exp_ids]               # units to emphasize
    hide: [exp_ids]                    # units to exclude
```

## audit-log.yaml

Tracks audit session progress.

```yaml
sessions:
  - date: YYYY-MM-DD
    units_reviewed: [exp_ids]
    notes: string

stats:
  total: int
  raw: int
  partial: int
  reviewed: int
  validated: int
```
