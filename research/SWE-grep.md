# Introducing SWE-grep and SWE-grep-mini: RL for Multi-Turn, Fast Context Retrieval – Research Notes

Source article: ["Introducing SWE-grep and SWE-grep-mini: RL for Multi-Turn, Fast Context Retrieval" – Cognition](https://cognition.ai/blog/swe-grep)

**Published**: October 16, 2025  
**Authors**: Ben Pan, Carlo Baronio, Albert Tam, Pietro Marsella, Mokshit Jain, Daniel Chiu, Swyx, Silas Alberti

---

## TL;DR

We trained SWE-grep and SWE-grep-mini, fast agentic models specialized in highly parallel context retrieval. They match the retrieval capabilities of frontier coding models, while taking an order of magnitude less time. Available now in Windsurf's new Fast Context subagent!

---

## Overview

Modern coding agents face a fundamental tradeoff between speed and intelligence. Frontier models can solve complex tasks, but it can take minutes of searching before they edit a single file, breaking your flow. In Windsurf and Devin, we observed that our agent trajectories were often spending **>60% of their first turn just retrieving context**.

---

## Context Retrieval Methods

### 1. Embedding Search (RAG)

**Pros**:
- Once the upfront work of indexing the codebase is done, queries are fast

**Cons**:
- Results can be inaccurate, especially for complex queries that require jumping across the codebase multiple times (such as tracing through some execution path in a large codebase)
- The embeddings can even be counterproductive, as the agent can give too much weight to irrelevant information

### 2. Agentic Search

**Pros**:
- Model uses CLI tools to explore a codebase, much like a human would do
- Works well (noted by Claude Code and Cline)
- Much more flexible

**Cons**:
- Generally slow, requiring dozens of sequential roundtrips between the user's device and the inference endpoint
- Forces the agent to attend to tens of thousands of tokens worth of irrelevant information before finding the relevant context
- This exacerbates the slowness while also context poisoning the agent, significantly degrading answer quality

### The Solution: SWE-grep and SWE-grep-mini

These models match the retrieval capabilities of frontier coding models, while taking an order of magnitude less time. They now power Fast Context, a subagent that helps you stay in flow.

---

## Where to Try Fast Context

- Rolling out progressively to Windsurf users, starting from the latest release
- No required UI or command to try it - just use Windsurf Cascade as per normal
- When you make a query that requires code search, Fast Context will trigger
- You can also force it to trigger by submitting the query with Cmd+Enter
- Try it out in the playground: https://playground.cognition.ai/

---

## Motivation

### Why Context Retrieval is Uniquely Suited for a Custom Subagent

1. **Conserves context budget (and intelligence) for the main agent**
   - By having the main agent delegate retrieval to a subagent, we save on (valuable) agent tokens
   - Avoid polluting the agent's context with irrelevant information
   - Allows the main agent to only attend to the relevant tokens
   - Avoids a whole host of "context pollution" failure modes (as explained by Drew Breunig's "How Contexts Fail")

2. **Retrieval is a versatile, broadly useful ability**
   - All layers of the AI-assisted coding stack can benefit from fast and agentic context retrieval
   - From what an autocomplete model sees before giving a suggestion, to Cascade before implementing a set of changes, to Devin during a big PR
   - Context retrieval subagents are the perfect "hand-off point" between a smart model & a fast model

3. **Retrieval is a verifiable task**
   - Often sub-agents are implemented such that they summarize their findings for the main agent
   - This has two downsides:
     1. A fast model summary can draw wrong conclusion and mislead the smart model
     2. It is hard to grade free-form summaries
   - Instead, the Fast Context sub agent is designed to retrieve a list of files with line ranges
   - For this we can define an objective ground-truth dataset, which allows us to compute a clean deterministic reward to do RL

---

## What Makes SWE-grep Fast?

### Key Factors

1. **Parallel tool calls and limited serial turns**
   - Each serial turn has a big latency cost due to tool call & network overhead
   - Agentic search can commonly take 10-20 serial turns
   - We found that we can get strong results with only **4 serial turns** – by leveraging highly parallel tool calls
   - The SWE-grep models are trained to run **8 parallel tool calls** (grep, glob search, reads, etc.) at each turn
   - The model can perform deep searches in just a few seconds by exploring different parts of the codebase at once

2. **Fast tool calls**
   - To match the speeds that we want for SWE-grep, the time that a single tool call takes becomes significant
   - We optimized how these tool calls run (e.g. indexing, multi-threading, carefully restricted tool set)
   - Co-designed the SWE-grep models with this custom set of tool calls

3. **Fast inference**
   - Worked with Cerebras, the fastest inference provider, to deploy and optimize our custom SWE-grep models
   - This allows us to serve:
     - **SWE-grep-mini** at over **2,800 tokens/second**
     - **SWE-grep** at over **650 tokens/second**
   - This is **20× faster** and **4.5× faster** than Haiku 4.5 at 140 tokens/second, the second-fastest model we evaluated

---

## RL for Training Fast, Parallel Agentic Code Search Models

### The Problem

Most coding agents take so long to fetch context because they only issue one (or a few) tool calls at a time. Each turn of tool calls incurs:
- An additional prefill
- An extra network roundtrip
- Decoding overhead

**Solution**: To explore codebases as efficiently as possible, search subagents should be doing many tool calls in parallel.

### Model Design Space

While many models technically support parallel tool calls, it's difficult to get them to use them effectively. Models are getting better than this—Sonnet in particular has improved greatly from 3.6 to 4.5—but we felt that models didn't exploit them optimally.

### Training Approach

- Trained the SWE-grep models to natively issue up to **8 parallel tool calls per turn** in a maximum of **4 turns** (3 turns of exploration and 1 turn for the answer)
- The SWE-grep models are given a restricted set of tool calls (grep, read, glob, ...) to ensure:
  - Cross-platform compatibility (we have loads of Windows users!)
  - Guarantee safety

### Discovery

By increasing the amount of parallelism from 4 to 8 searches per turn, we could reduce the number of turns spent searching from 6 to 4 while retaining the same performance.

### Training Process

1. Train SWE-grep directly with multi-turn reinforcement learning
2. Distill SWE-grep into SWE-grep-mini
3. Perform additional reinforcement learning to boost the model's performance on the task

### Reward Function

- Average of weighted F1 scores over file retrieval and line retrieval tasks
- With respect to our ground truth dataset
- This objective was sufficient for SWE-grep to naturally learn to make more tool calls to its advantage over the course of training, without us explicitly incentivizing this behavior

---

## Policy Gradient Algorithm

### The Problem

Given an LLM policy and outcome reward R, the policy gradient is given by:

```
∇θ J(θ) = E[∑t ∇θ log πθ(at|st) · R]
```

where the sum is over the tokens in a single trajectory.

If we are able to sample from the training policy, we can use a simple Monte Carlo estimate for the gradient, which is unbiased when the data is on-policy.

However, standard training and inference libraries have different numerics, which effectively turns the sampled data into off-policy data. This is amplified when using low-precision rollouts, a common optimization in RL frameworks.

### The Solution: Importance Sampling

Recent works have proposed using per-token importance sampling ratios. Per-token ratios, though, do not fully remove the bias. Indeed, at step t we have:
- An action-choice mismatch
- A state-distribution mismatch
- A reward-signal mismatch

A per-token ratio corrects only the action-choice mismatch.

### Unbiased Estimate

To derive an unbiased estimate, we apply **per-sequence importance sampling**:

We expand at the token-level, subtract a leave-one-out baseline to reduce the variance, and rescale by a constant factor (absorbed in the learning rate), obtaining a surrogate loss (for a given prompt) that gives the correct gradient estimation:

```
L = -∑j=1^g [∑t=1^T_max (πθ(at|st) / πθ_old(at|st)) · A_j]_∇
```

where:
- We sample g completions from the same prompt for the Monte Carlo estimate
- A_j = R_j - mean(R_1, ... , R_g)
- T_max is the maximum number of sampled tokens allowed during training (like Dr. GRPO)
- The notation []_∇ denotes a stop gradient

---

## Training Instabilities

A large number of parallel tool calls over multiple turns introduces a lot of tokens from the environment in the trajectories. These tokens are not generated by the model, leading to instabilities, especially when training small models.

### Techniques to Stabilize Training

1. **Masking from the loss overlong trajectories**
2. **Masking from the loss trajectories that have extreme importance sampling ratios**
3. **Removing any format reward**
4. **Interrupting and assigning a zero reward** to each trajectory with an incorrectly formatted tool call or answer
5. **Scaling advantages by the average number of tool calls used per turn**
   - We observe that during RL training small models quickly converge to the maximum number of parallel tool calls, but ineffectively (e.g. by duplicating tool calls)
   - By scaling the advantages, we continue to reinforce the right behavior while incentivizing the model to learn first how to use effectively a small budget of tool calls

---

## Data and Evals

### Dataset: Cognition CodeSearch Eval

To train SWE-grep and evaluate models on the context retrieval task, we used an internal dataset consisting of:
- Real-world repositories
- User queries
- Labeled ground truth of relevant files and line ranges
- Drawn from our hardest bug reports and internal tests

### Evaluation Metrics

When evaluating models for context retrieval, we care about two metrics:

1. **Weighted F1 score** of files and line ranges vs. the ground truth (aka F-β with β=0.5)
2. **End-to-end latency**

### Why Weighted F1?

We use a weighted F1 score, where precision is prioritized over recall, precisely because we found that context pollution matters. We found that polluting the context of the main agent was more detrimental than leaving some context out, as the agent is typically only a few searches away to recover any remaining context.

### Evaluation Setup

- Allow each model 4 turns of up to 8 parallel tool calls (searches, reads, etc.)
- Benchmark them on the above metrics

### Results

Our results on our evaluation set demonstrate that SWE-grep and SWE-grep-mini are an order of magnitude faster than frontier models, while matching or outperforming them at context retrieval.

---

## Downstream Analysis

### Coding Tasks

To evaluate how well it works in Windsurf's Cascade agent, we use a randomly selected subset of difficult SWE-Bench Verified tasks.

**Result**: When using the Fast Context subagent, the agent (using Sonnet 4.5 as the main model) accomplishes the same number of tasks in significantly lower end-to-end time.

### Codebase Q&A

We show the end-to-end latency on some example queries over open-source repositories. As with our playground setup, we benchmark the Fast Context agent—as it would be used in Windsurf—against Claude Code and Cursor CLI by measuring end-to-end latency.

---

## Fast Context as the First Step to Fast Agents

The Fast Context subagent in Windsurf is our first stepping stone on our roadmap for Fast Agents. The SWE-grep models will be deployed in:
- DeepWiki
- Devin
- Windsurf Tab
- Future products

### Future Directions

- Much more variable turn length
- Even higher intelligence
- Tools speed optimizations

---

## The Flow Window Philosophy

### End-to-End Latency as a Research Dimension

End-to-end latency is a moderately non-consensus dimension of research for agent labs. In a world where coding agents grab headlines for having 2-30 hours of autonomy, the marketing incentive is to make agents slower, not faster. But we think the pendulum will swing the other way soon — simply because we have the unfair advantage of seeing actual user behavior across sync and async code agents at massive scale.

### The Goal of Windsurf

The goal of Windsurf is to keep you in flow, which Mihaly Csikszentmihalyi defines as "a state of complete absorption in an activity". 

**Flow Window**: Roughly, we estimate that your P(breaking flow) geometrically increases 10% every second that passes while you wait for agent response, with the exact threshold varying based on perceived complexity of the request. The arbitrary "flow window" we hold ourselves to is **5 seconds**.

### The Semi-Async Valley of Death

Our ultimate goal at the combined Cognition+Windsurf is to maximize your software engineering productivity, and we are simultaneously researching both the directions of:
- Pushing the frontier of coding agent autonomy
- Making them faster given a "good enough" bar

**The best mental model**: Avoid the Semi-Async Valley of Death at all costs!

---

## My Takeaways

> Use this section to add your own reflections as you study the article.

- **Parallel tool calls are key**: Increasing parallelism from 4 to 8 searches per turn reduced turns from 6 to 4 while maintaining performance
- **Speed matters for flow**: The "flow window" of 5 seconds is critical - P(breaking flow) increases 10% every second
- **Context pollution is worse than missing context**: Precision prioritized over recall because polluting context degrades quality more than missing some context
- **Verifiable tasks enable RL**: Retrieving files with line ranges (not summaries) allows objective ground-truth and deterministic rewards
- **Importance sampling is crucial**: Per-sequence importance sampling needed for unbiased gradient estimates when training and inference have different numerics
- **Training stability techniques**: Masking, scaling advantages, and format validation all help when dealing with many parallel tool calls
- **Subagents as hand-off points**: Fast subagents can delegate to smart main agents, conserving context budget and intelligence

You can expand this section with:
- Analysis of the policy gradient algorithm and importance sampling
- Comparisons to other context retrieval methods
- Thoughts on the tradeoffs between speed and accuracy
- Applications of similar subagent patterns to other domains

