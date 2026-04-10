# LaTeX CV — Build Instructions

The CV is compiled from `.tex` source files using XeLaTeX. The template (`yaac-another-awesome-cv.cls`) and fonts (Source Sans Pro) are included in this repo.

---

## Requirements

### Linux (Ubuntu/Debian)

```bash
sudo apt install texlive-xetex texlive-fonts-extra texlive-latex-extra
```

Or full distribution (larger but avoids missing package errors):
```bash
sudo apt install texlive-full
```

### macOS

```bash
brew install --cask mactex
```

Or minimal: install [BasicTeX](https://www.tug.org/mactex/morepackages.html) + required packages:
```bash
sudo tlmgr install fontawesome xetex collection-fontsrecommended
```

### Windows

Install [MiKTeX](https://miktex.org/download) or [TeX Live](https://www.tug.org/texlive/). Then use the MiKTeX package manager to install missing packages on first compile.

---

## Compile

After Claude generates your LaTeX files into `people/{your-name}/latex/`:

```bash
cd people/{your-name}/latex
xelatex cv.tex
```

Output: `cv.pdf` in the same directory.

**If compilation fails on first run**, it usually needs a second pass:
```bash
xelatex cv.tex && xelatex cv.tex
```

---

## File structure (per person)

```
people/{name}/latex/
├── cv.tex                    ← Main file — include others
├── section_headline.tex      ← Name, tagline, contacts, summary
├── section_experience.tex    ← All experience entries with bullets
├── section_competences.tex   ← Skills grouped by category
├── section_langues.tex       ← Education + languages
├── yaac-another-awesome-cv.cls  ← Document class (copied from repo)
└── fonts/                    ← Source Sans Pro (copied from repo)
    ├── SourceSansPro-Regular.otf
    ├── SourceSansPro-Bold.otf
    ├── SourceSansPro-Light.otf
    └── ...
```

---

## Common errors

**`! I can't find file 'yaac-another-awesome-cv.cls'`**
The class file isn't in the same directory. Claude should copy it automatically. If not:
```bash
cp /path/to/master-resume-skill/latex/yaac-another-awesome-cv.cls .
```

**`! fontspec error: "font-not-found"`**
Fonts not found. Make sure the `fonts/` directory is in the same directory as `cv.tex`.
```bash
cp -r /path/to/master-resume-skill/latex/fonts ./fonts
```

**`LaTeX Error: File 'fontawesome.sty' not found`**
```bash
sudo tlmgr install fontawesome
# or on Ubuntu:
sudo apt install texlive-fonts-extra
```

**`! LaTeX Error: Missing \begin{document}`**
Usually a syntax error in one of the `\input{}` files. Check `section_experience.tex` for unescaped special characters: `&`, `%`, `$`, `#`, `_` must be escaped as `\&`, `\%`, `\$`, `\#`, `\_`.

---

## Customization

The template supports two modes set in `\documentclass[...]`:
- `localFont` — use bundled Source Sans Pro (recommended)
- `alternative` — use alternative layout variant

To change accent color, add to preamble:
```latex
\definecolor{accentcolor}{HTML}{2196F3}  % any hex color
```

Photo: place a photo file (jpg/png) in the latex directory, reference as `\photo{2.5cm}{filename}` (without extension). Remove the line if no photo.

---

## Manual editing

If you want to edit the LaTeX directly (rather than regenerating from master-profile.yaml):
1. Edit the section files (`section_experience.tex`, etc.)
2. Re-run `xelatex cv.tex`
3. The edits won't be tracked in master-profile.yaml — document them in `audit-log.yaml` notes if important
