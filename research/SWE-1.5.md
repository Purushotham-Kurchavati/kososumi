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

