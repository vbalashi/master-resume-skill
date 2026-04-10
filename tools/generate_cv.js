#!/usr/bin/env node
/**
 * Master Resume Skill — DOCX CV Generator
 *
 * Usage:
 *   echo '<json>' | node tools/generate_cv.js
 *
 * Input JSON structure:
 * {
 *   "name": "Anna Smith",
 *   "outputPath": "people/anna-smith/output/CV-Anna-Smith-2026-01.docx",
 *   "contacts": {
 *     "phone": "+1 234 567 890",
 *     "email": "anna@example.com",
 *     "linkedin": "linkedin.com/in/annasmith",
 *     "github": "github.com/annasmith"   // optional
 *   },
 *   "summary": "2–3 sentence professional summary",
 *   "competencies": [                     // optional
 *     { "name": "Requirements Analysis", "description": "..." }
 *   ],
 *   "experience": [
 *     {
 *       "role": "Senior Business Analyst",
 *       "company": "Rabobank, Netherlands",
 *       "period": "2024 – Present",
 *       "bullets": ["Led...", "Designed...", "Contributed to..."]
 *     }
 *   ],
 *   "earlyCareer": ["2012 — Junior Analyst at Startup X"],  // optional
 *   "skills": {
 *     "Technical": "SQL, Python, Jira, Confluence",
 *     "Practices": "Agile, BPMN, Requirements Engineering",
 *     "Languages": "English (C1), Russian (native), Dutch (A2)"
 *   },
 *   "education": "MSc Computer Science, State University, 2010"
 * }
 */

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink,
  AlignmentType, LevelFormat, HeadingLevel
} = require("docx");

// Read JSON from stdin
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => input += chunk);
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    generateCV(data);
  } catch (e) {
    console.error("Failed to parse input JSON:", e.message);
    process.exit(1);
  }
});

function generateCV(data) {
  const bulletRef = "bullets";

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 20 } } },
      paragraphStyles: [{
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 180, after: 60 }, outlineLevel: 0 }
      }]
    },
    numbering: {
      config: [{
        reference: bulletRef,
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 } } }
        }]
      }]
    },
    sections: [{
      properties: {
        page: { margin: { top: 720, right: 900, bottom: 720, left: 900 } }
      },
      children: buildContent(data, bulletRef)
    }]
  });

  // Default output path uses person's name if not specified
  const safeName = (data.name || "Person").replace(/\s+/g, "-");
  const date = new Date().toISOString().slice(0, 7).replace("-", "_");
  const outputPath = data.outputPath || `CV-${safeName}-${date}.docx`;

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (outputDir && outputDir !== ".") {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(outputPath, buffer);
    console.log(`CV created: ${outputPath}`);
  }).catch(err => {
    console.error("Failed to generate CV:", err.message);
    process.exit(1);
  });
}

function buildContent(data, bulletRef) {
  const children = [];

  // Name
  children.push(new Paragraph({
    spacing: { after: 30 },
    children: [new TextRun({ text: data.name, bold: true, size: 28 })]
  }));

  // Contacts
  const contactChildren = [];
  const c = data.contacts || {};
  if (c.phone) contactChildren.push(text(c.phone + "  |  "));
  if (c.email) {
    contactChildren.push(hyperlink(c.email, `mailto:${c.email}`));
    contactChildren.push(text("  |  "));
  }
  if (c.linkedin) {
    const liUrl = c.linkedin.startsWith("http") ? c.linkedin : `https://www.${c.linkedin}`;
    contactChildren.push(hyperlink(c.linkedin, liUrl));
    contactChildren.push(text("  |  "));
  }
  if (c.github) {
    const ghUrl = c.github.startsWith("http") ? c.github : `https://${c.github}`;
    contactChildren.push(hyperlink(c.github, ghUrl));
  }
  if (contactChildren.length > 0) {
    children.push(new Paragraph({ spacing: { after: 20 }, children: contactChildren }));
  }

  // Summary
  if (data.summary) {
    children.push(new Paragraph({
      spacing: { after: 140 },
      children: [new TextRun({ text: data.summary, size: 19 })]
    }));
  }

  // Competencies (optional)
  if (data.competencies && data.competencies.length > 0) {
    children.push(heading1("Competencies"));
    for (const comp of data.competencies) {
      children.push(bullet([
        new TextRun({ text: comp.name, bold: true, size: 19 }),
        text(`: ${comp.description}`)
      ], bulletRef));
    }
  }

  // Experience
  children.push(heading1("Experience"));
  for (const job of (data.experience || [])) {
    children.push(jobHeader(job.role, job.company, job.period));
    for (const b of (job.bullets || [])) {
      children.push(bullet([text(b)], bulletRef));
    }
  }

  // Early Career (optional)
  if (data.earlyCareer && data.earlyCareer.length > 0) {
    children.push(heading1("Early Career"));
    for (const item of data.earlyCareer) {
      children.push(bullet([text(item)], bulletRef));
    }
  }

  // Skills
  if (data.skills) {
    children.push(heading1("Skills"));
    for (const [category, content] of Object.entries(data.skills)) {
      children.push(new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: `${category}: `, bold: true, size: 19 }),
          text(content)
        ]
      }));
    }
  }

  // Education
  if (data.education) {
    children.push(heading1("Education"));
    children.push(new Paragraph({
      spacing: { after: 0 },
      children: [text(data.education)]
    }));
  }

  return children;
}

function heading1(t) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
}

function jobHeader(title, company, date) {
  return new Paragraph({
    spacing: { before: 120, after: 30 },
    children: [
      new TextRun({ text: title, bold: true, size: 20 }),
      new TextRun({ text: "  \u2014  ", size: 18, color: "666666" }),
      new TextRun({ text: company, bold: true, size: 18, color: "333333" }),
      new TextRun({ text: "  \u2014  ", size: 18, color: "666666" }),
      new TextRun({ text: date, italics: true, size: 18, color: "555555" })
    ]
  });
}

function bullet(children, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 20 },
    children
  });
}

function text(t) {
  return new TextRun({ text: t, size: 19 });
}

function hyperlink(label, url) {
  return new ExternalHyperlink({
    children: [new TextRun({ text: label, style: "Hyperlink", size: 18 })],
    link: url
  });
}
