# Devin 2025 Performance Review – Research Notes

Source article: ["Devin's 2025 Performance Review: Learnings From 18 Months of Agents At Work" – Cognition](https://cognition.ai/blog/devin-annual-performance-review-2025)

---


![Uploading image.png…]()

## Overview

- **Context**: Eighteen months after launch, Devin has gone from small projects to working in engineering teams at thousands of companies (e.g. Goldman Sachs, Santander, Nubank).
- **Scale of impact**:
  - Hundreds of thousands of PRs merged.
  - Used across many organizations for modernization, security, testing, planning, and documentation.
- **Key insight**: Devin doesn’t fit neatly into a classic engineer leveling framework — it is **senior-level at understanding codebases**, but often **junior-level at execution and soft skills**.

---

## How Cognition Evaluated Devin

- Initial attempt: Map Devin into a traditional engineering **competency matrix**.
  - Problem: Human engineers usually cluster at one level; Devin spans multiple levels.
- Final approach:
  - Summarize **strengths** and **weaknesses** based on **real-world deployments**.
  - Use **customer metrics** and examples instead of only synthetic benchmarks.

> Mental model: Treat Devin as a massively scalable junior executor with on‑demand senior context understanding.

---

## Strength Pattern #1 – Junior Execution at Infinite Scale

> "Devin excels at tasks with clear, upfront requirements and verifiable outcomes that would take a junior engineer 4–8 hours of work."

### Core Idea

- Great at **well-scoped, verifiable tasks** with:
  - Clear acceptance criteria.
  - Repeatable patterns.
- **Infinitely parallelizable**: many Devins can work simultaneously.
- Best suited for **critical but less creative work**, freeing humans for higher‑impact problems.

### Improvements Over Time

- 4× faster at problem solving (year-over-year).
- 2× more efficient in resource consumption.
- PR merge rate improved from **34% → 67%**.

### Use Case 1 – Security Vulnerability Resolution

- Works alongside static analysis tools like **SonarQube** and **Veracode**.
- Example outcomes:
  - One large org: **5–10% of total developer time saved** by having Devin fix security issues.
  - Another org: **20× efficiency gain**:
    - Humans: ~30 minutes per vulnerability.
    - Devin: ~1.5 minutes per vulnerability.

### Use Case 2 – Language & Framework Upgrades / Modernization

- Typical work:
  - Migrations like **SAS → PySpark**, **COBOL**, **Angular → React**, **.NET Framework → .NET Core**, etc.
  - Large‑scale repo modernization (deprecations, library upgrades, etc.).
- Pattern:
  - Humans define **instructions / playbooks** per repo or per migration type.
  - A **fleet of Devins** executes the migration across many repos in parallel.
- Example metrics:
  - Large bank migrating proprietary ETL framework:
    - Devin: **3–4 hours per file**.
    - Humans: **30–40 hours per file** (**~10× faster**).
  - Oracle Java version deprecation:
    - Devin migrated each repo in **14× less time** than humans.

### Use Case 3 – Test Generation

- Workflow:
  - Humans write a **unit testing playbook** covering patterns for hundreds of repos.
  - Devin generates tests at scale.
  - Code owners review logic and coverage.
- Outcome:
  - Test coverage often increases from **50–60% → 80–90%**.

### Use Case 4 – Brownfield Feature Development

- Works well when **existing code provides clear patterns** to follow.
- Typical tasks:
  - Adding new API endpoints.
  - Creating/modifying frontend components.
  - Extending existing features by copying patterns.
- Internal stat: Devin pushed **about ⅓ of the commits** on Cognition’s own web app.

### Use Case 5 – PR Review

- Works as a **first-pass reviewer**:
  - Catches obvious bugs and issues.
  - Flags potential problems for humans.
- Limitation:
  - Human review still required because **correctness is not always trivially verifiable**.

### Use Case 6 – Data Analysis & QA Work

- Devin can be "@‑mentioned" in tools like Slack:
  - "Pull yesterday’s sales by channel."
  - "Check why this metric looks off."
  - "Create this dashboard."
- Real-world outcomes:
  - **EightSleep**: ships **3×** as many data features and investigations using Devin.
  - Used heavily at Cognition for internal metrics and analysis (including for this performance report).
- Quality engineering / QA:
  - Teams use a "**team of Devins**" as QE testers, SREs, and DevOps helpers.
  - **Litera**:
    - +40% test coverage.
    - **93% faster regression cycles**.

---

## Strength Pattern #2 – Senior Intelligence On Demand

> Only ~20% of engineering time is coding; the rest is planning, understanding systems, and collaboration.

### Codebase Understanding

- Devin drastically improved at understanding **large, real-world codebases**.
- This improvement drove the higher PR merge rate.
- Capabilities:
  - Reads and synthesizes very large repos.
  - Explains architecture and dependencies.
  - Assists with onboarding and planning.

### DeepWiki – Living Documentation

- Devin can generate **comprehensive, always-updating documentation** with system diagrams.
- Works even for **huge legacy codebases**:
  - Example: **5M lines of COBOL**.
  - Example: **500GB repositories**.
- Outcome:
  - A bank reallocated **several engineering teams** away from a massive documentation project because Devin generated docs for **400,000+ repositories**.

### AskDevin – Planning & Architecture Support

- Engineers use documentation + chat with Devin to:
  - Understand system behavior and dependencies.
  - Plan new features and migrations.
  - Identify what should be done by humans vs AI.
- Example feedback:
  - One engineer could produce **draft architecture in ~15 minutes** for others to critique.

> Mental model: Devin as a **staff+ level system explainer + architect assistant**, but not a self-directed staff engineer.

---

## Devin’s Areas for Improvement

### 1. Independent Execution on Ambiguous Requirements

- Strong when:
  - Requirements are **clear and fully specified**.
  - Success can be **automatically verified** (tests, static analysis, etc.).
- Weaker when:
  - Requirements are ambiguous.
  - Work requires **judgment**, tradeoffs, or evolving specs.
- Example: **visual design**
  - Devin needs explicit component structure, color tokens, spacing values.
  - Cannot iterate on vague instructions like "make it feel more modern." 

### 2. Scope Changes & Iterative Collaboration

- Handles **upfront scoping** well.
- Performs worse when requirements **change mid-task**.
- Different from a human junior engineer:
  - Humans can be coached in real time and adapt iteratively.
  - Devin expects a more stable task definition.
- Implication:
  - Engineers must learn how to **"manage Devin"**:
    - Provide clear specs.
    - Minimize shifting targets.
    - Design tasks with verifiable outcomes.

### 3. Soft Skills & Interpersonal Work

- Strong at:
  - Being patient and responsive in tools (Slack, Teams, Jira).
- Weak at:
  - Managing stakeholders.
  - Handling emotions and interpersonal conflict.
  - Mentoring humans, running meetings, etc.
- It **won’t** replace tech leads as people managers, but it **can** be a force multiplier.

---

## What’s Next (2026 and Beyond)

- Cognition’s roadmap focuses on:
  - Making Devin better at understanding **real-world codebases**.
  - Using that context for **end‑to‑end SWE collaboration** with humans.
  - Investing in **UX**, so engineers can more easily direct Devin during everyday development.
- Call to action from the article:
  - Companies can **hire Devin** for production work.
  - Or try **DeepWiki** on their own codebases to experience Devin’s codebase understanding.

---

## My Takeaways

> Use this section to add your own reflections as you study the paper.

- **Mental model of agents**:
  - Treat Devin as: _"infinite juniors + on-demand senior context"_, **not** a fully autonomous staff engineer.
- **Where agents shine today**:
  - Security fixes, migrations, tests, pattern-based changes, data/QA, documentation.
- **Where humans are still critical**:
  - Ambiguous product work, evolving specs, system‑level tradeoffs, and all people work.
- **Design pattern for using Devin (and similar agents)**:
  - Humans: define **playbooks**, architecture, and scopes.
  - Agents: execute at scale, surface results, and provide drafts for review.

You can expand this file with:
- Concrete examples from your own projects.
- Screenshots or architecture diagrams summarizing Devin’s workflows.
- Comparisons between Devin and other agent frameworks.

---

## Images & Diagrams (Placeholders)

You can add images to this folder and reference them here, for example:

- `![Devin Strengths Overview](./images/devin_strengths.png)`
- `![Devin Workflow – Security Fixes](./images/devin_security_workflow.png)`
- `![Devin vs Human Engineer – Time Allocation](./images/devin_vs_human_time.png)`

Create a subfolder like `research/images/` and drop your diagrams there as you study.

---

## Research Papers & Articles

- [Introducing SWE-1.5: Our Fast Agent Model](./SWE-1.5.md)

