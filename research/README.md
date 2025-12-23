# Devin 2025 Performance Review – Research Notes

Source article: ["Devin's 2025 Performance Review: Learnings From 18 Months of Agents At Work" – Cognition](https://cognition.ai/blog/devin-annual-performance-review-2025)

---

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

# Introducing SWE-1.5: Our Fast Agent Model – Research Notes

Source article: ["Introducing SWE-1.5: Our Fast Agent Model" – Cognition](https://cognition.ai/blog/swe-1-5)

**Published**: October 29, 2025  
**Authors**: Jacob Teo, Nikhil Jha, Connor Fogarty, Gary Chang, Theodor Marcu, Edison Zhang, Albert Tam, Sean Sullivan, Swyx, Silas Alberti

---

## Overview

- **Release**: SWE-1.5, the latest model optimized for software engineering
- **Key Achievement**: Frontier-size model (hundreds of billions of parameters) with near-SOTA coding performance
- **Speed Breakthrough**: 
  - Up to **950 tok/s** (6× faster than Haiku 4.5, 13× faster than Sonnet 4.5)
  - Partnership with Cerebras for optimized inference
- **Availability**: Now available in Windsurf

---

## Motivation

### The Core Problem

Developers shouldn't have to choose between:
- An AI that **thinks fast**
- An AI that **thinks well**

This has been an inescapable tradeoff in AI coding until now.

### The Solution Approach

SWE-1.5 reimagines the entire stack as a **unified system**:
- Model
- Inference system
- Agent harness

All optimized together for both speed and intelligence.

### Previous Work

- **October 16**: Released SWE-grep (agentic model for rapid context engineering)
- **Now**: SWE-1.5 extends this to the entire stack

---

## The Agent-Model Interface

### Key Insight

> "Our goal as an agent lab is not to train a model in isolation, but to build a complete agent."

Often-overlooked components:
- Agent harness
- Inference provider
- End-to-end user experience

### Development Process

1. **End-to-end RL** on real task environments
   - Custom Cascade agent harness
   - Built on leading open-source base model

2. **Continuous iteration** on:
   - Model training
   - Harness improvements
   - Tools
   - Prompt engineering

3. **Rewriting core tools** from scratch
   - Needed for better speed and accuracy
   - Many things become bottlenecks when model runs 10× faster
   - Improvements benefit all models in Windsurf

4. **Heavy dogfooding**
   - Real-world internal usage drives tuning decisions
   - Tune agent and model on user experience
   - Beyond what general-purpose reward functions can achieve

5. **Beta deployment**
   - Multiple versions deployed (as "Falcon Alpha")
   - Performance metrics monitoring

### Harness-Specific Performance

After tuning, noticeable performance improvement over evaluations in alternative harnesses.

**Important note**: This is not a reflection of harness capability. Models tuned for other harnesses could perform just as well (e.g., Sonnet in Claude Code).

**Notable factor**: Greater incidence of tool call failures in alternative harnesses.

### Key Takeaway

> "Picking a coding agent isn't just about the model itself. The surrounding orchestration also has an outsized impact on how the model performs."

Working on Devin, they often wished they could co-develop the model and the harness. With SWE-1.5, they finally achieved this.

---

## RL Coding Environments

### Core Belief

> "The quality of the coding environments in RL tasks is the most important factor for downstream model performance."

### Issues with Common Coding Environments

1. **Narrow task distribution**
   - Many labs hillclimb SWE-Bench
   - Very narrow set of repositories and task types

2. **Ignoring soft factors**
   - Using exclusively verifiable correctness rewards (unit tests)
   - Models not incentivized to write high-quality code
   - Results in "AI slop":
     - Overly verbose code
     - Excessive try-catch blocks
     - Other anti-patterns

### Their Solution

1. **Manual dataset creation**
   - Mirrors wide distribution of real-world tasks & languages
   - Based on learnings from Devin and Junior-Dev Benchmark
   - Heavy investment in custom evals

2. **High-fidelity coding environments**
   - Hand-selected team of:
     - Top senior engineers
     - Open-source maintainers
     - Engineering leaders

3. **Three grading mechanisms**:

   **a) Classical tests**
   - Unit tests, integration tests
   - Reliably validate correctness

   **b) Rubrics**
   - Code quality assessment
   - Approach evaluation

   **c) Agentic grading**
   - Leverages browser-use agent
   - Tests end-to-end functionality of product features

   Many environments use a **combination of all three**.

4. **Reward hardening**
   - Process to ensure environments are robust to reward hacking
   - Human experts try to circumvent graders
   - Early results:
     - Multiple rounds discover gaps in classical tests
     - Significantly reduce false positive rates
     - Requires further research

### Current Status

- SWE-1.5 represents **first attempt** at leveraging these environments
- Trained at **relatively small scale** (beginning of scaling up production)
- Expect much stronger effects in future model generations
- Especially on soft factors like code quality

---

## Training & Infrastructure

### Hardware

- **State-of-the-art cluster**: Thousands of GB200 NVL72 chips
- **Believed to be**: First public production model trained on GB200 generation
- **Early access**: One of first companies (early June)
  - Firmware was still immature
  - Open-source ecosystem non-existent

### Early Challenges

First few months required:
- Building robust health checking
- Fault-tolerant training
- Learning to leverage rack-scale NVLink

### Training Approach

1. **Base model selection**
   - Careful evals and ablations
   - Selected strong open-source model for post-training

2. **Reinforcement learning**
   - RL on Cascade agent harness
   - High-quality coding environments
   - Optimize for product and task distribution

3. **Co-optimization vision**
   - Repeated dogfooding
   - Notice harness issues
   - Adjust tools and prompts
   - Re-train model on updated harness

4. **Training stability**
   - Variant of unbiased policy gradient
   - For long multi-turn trajectories
   - (As described in SWE-grep blogpost)

### Infrastructure: VM Hypervisor

- **Otterlink**: VM hypervisor for scaling
- Allows Devin to scale to **tens of thousands of concurrent machines**
- Learn more: blockdiff
- Enabled:
  - Smooth support for very high concurrency
  - Training environment aligned with Devin production environments

RL rollouts require:
- High-fidelity environments
- Code execution
- Web browsing

---

## Public Evals

### Benchmark Philosophy

> "Performance on coding benchmarks is often not representative of the real-world experience of using an agent."

- Stopped reporting SWE-Bench numbers in 2024
- Nonetheless, good common baseline for comparing model ability

### SWE-Bench Pro Results

- **Dataset**: SWE-Bench Pro from Scale AI
- **Characteristics**: Difficult tasks on diverse codebases
- **Performance**: Near-frontier performance
- **Speed**: Completes tasks in a fraction of the time

### Real-World Usage

Many engineers now use SWE-1.5 as their **daily driver**.

**Popular use cases**:

1. **Deeply exploring/understanding large codebases**
   - Also powers beta Codemaps feature

2. **Building end-to-end full stack apps**

3. **Easily editing configurations**
   - Without needing to memorize field names

### Speed Impact Example

**Before**: Existing agents correctly edit Kubernetes manifest in ~20 seconds  
**After**: SWE-1.5 completes in under 5 seconds

This falls within the **"flow window"** of the semi-async valley of death.

---

## Optimizing for Speed

### Goal

Create the **fastest coding agent experience** available.

### Partnership with Cerebras

- Worked with Cerebras (fastest inference provider)
- Deploy and optimize SWE-1.5
- Included:
  - Training optimized draft model for faster speculative decoding
  - Building custom request priority system
  - Smoother end-to-end agent sessions

### System Bottlenecks Revealed

With model running at **up to 950 tok/s**:
- Previously negligible system delays emerged as **dominant bottlenecks**
- Forced revisiting several key parts of Windsurf agent implementation

### Rewritten Components

- **Lint checking pipelines**
- **Command execution pipelines**

**Result**: Reduced overhead per step by up to **2 seconds**

This is an effort they plan to continue investing in.

---

## What's Next

### Key Achievement

> "SWE-1.5 proves you don't have to choose between speed and intelligence."

By co-designing:
- Model
- Inference system
- Agent harness

As one unified system, achieved:
- **Frontier-level performance**
- **13× the speed** of Sonnet 4.5

### Team & Approach

- Similar to SWE-1: Product of small, incredibly focused team
- Leveraged strengths as an agent lab:
  - Combines product, research, and infrastructure
  - Builds world's best software engineering agents

### Future

- SWE-1.5 is a major step forward
- Excited to keep pushing boundaries in upcoming iterations

**Try it**: SWE-1.5 is available in Windsurf starting today.

---

## My Takeaways

> Use this section to add your own reflections as you study the article.

- **Co-design philosophy**: Model, inference, and harness must be developed together as a unified system
- **Speed matters**: 13× speedup brings tasks into the "flow window" (under 5 seconds)
- **Environment quality**: Quality of RL coding environments is most important factor for downstream performance
- **Beyond benchmarks**: Real-world dogfooding drives better tuning than synthetic benchmarks
- **Reward hardening**: Process to prevent reward hacking is critical but requires further research
- **Infrastructure matters**: GB200 training, Cerebras inference, VM hypervisor all critical to success
- **Tool rewriting**: When models get 10× faster, previously negligible bottlenecks become dominant

You can expand this section with:
- Comparisons to other fast coding models
- Analysis of the co-design approach vs. isolated model training
- Thoughts on the tradeoffs between speed and quality
- Applications of similar approaches to other domains

