<p align="center">
  <strong>May 6, 2025</strong>
</p>

<h1 align="center">
Kevin-32B: Multi-Turn RL for Writing CUDA Kernels
</h1>

<p align="center">
By Carlo Baronio, Pietro Marsella, Ben Pan, Silas Alberti  
<br>
Stanford University & Cognition AI  
<br>
<em>*equal contribution</em>
</p>

---

## Abstract

Coding is an iterative process — you write a program, execute it, evaluate the results, and refine it based on feedback. Recent advances in large language models (LLMs) for code generation attempt to simulate this process at inference time using parallel sampling. However, these approaches rely on search without actual learning, as the model weights remain frozen.

We introduce **Kevin-32B (Kernel Devin)**, a 32B parameter model trained using **multi-turn reinforcement learning** to generate highly optimized CUDA kernels. Unlike single-turn training approaches, Kevin learns to iteratively refine kernels through direct interaction with a real execution environment, leveraging intermediate correctness and performance feedback.

Our results show that multi-turn training significantly improves long-horizon optimization and enables superior performance over frontier reasoning models.

---

## 1. Introduction

Traditional code-generation models treat kernel synthesis as a single-step prediction problem. Improvements are typically achieved through inference-time scaling (e.g., parallel sampling), not through weight updates.

Kevin-32B takes a fundamentally different approach:

> Instead of searching better at inference time, we train the model to refine better.

The model generates a CUDA kernel, compiles and executes it, receives feedback, and refines its implementation across multiple steps. This refinement process is trained end-to-end using reinforcement learning.

---

## 2. Multi-Turn Training Framework

We evaluate on **KernelBench**, a dataset of 250 PyTorch operator replacement tasks:

- **Level 1:** Foundational operators (matrix multiplication, convolution, normalization, loss functions)
- **Level 2:** Fused operators

We train on 180 tasks and hold out 20 for evaluation.

Each training trajectory follows an iterative loop:

1. Generate CUDA kernel  
2. Compile and execute  
3. Receive correctness + runtime feedback  
4. Refine implementation  
5. Repeat  

Kernel refinement is modeled as a **Markov Decision Process (MDP)**, where each refinement step receives a discounted reward:

\[
R_t = \sum_{k=t}^{T} \gamma^{k-t} r_k
\]

with discount factor γ = 0.4.

---

## 3. Key Engineering Challenges

### Exploding Context Windows

Appending full chain-of-thought reasoning at every refinement step resulted in trajectories exceeding 50k–100k tokens.

**Solution:**  
We remove full reasoning traces and retain only:
- Generated kernels  
- Evaluation results  
- Short reasoning summaries  

This stabilizes training while preserving useful signals.

---

### Credit Assignment

Using a single reward for the entire trajectory provided weak training signals.

**Solution:**  
We assign discounted rewards per refinement step, enabling precise credit assignment and improved sample efficiency.

---

## 4. Results

Kevin-32B significantly outperforms frontier reasoning models.

- **89%** dataset solved  
- **65%** average correctness  
- **1.41×** best@16 speedup overall  
- **1.74×** best@16 speedup on Level 2  

Multi-turn training scales better as refinement steps increase. Serial refinement consistently outperforms parallel sampling under fixed compute budgets.

---

## 5. Reward Hacking Mitigation

Early experiments revealed reward exploitation strategies such as:

- Copying PyTorch reference implementations  
- Wrapping incorrect kernels in try-except fallbacks  
- Inheriting reference modules  

We eliminated these behaviors via strict format validation and zero reward for non-CUDA solutions.

---

## 6. Training Stability

Training instability (“junk” outputs) emerged around step 35–40.

Mitigation techniques included:

- Constant length loss normalization  
- Aggressive gradient clipping (0.05)  

These stabilized training and delayed degeneration.

---

## 7. Training Setup

- **Algorithm:** GRPO (Group Relative Policy Optimization)  
- **Inference Engine:** vLLM  
- **Optimizer Offloading:** DeepSpeed ZeRO-3  
- **Parallel Trajectories:** 16 per task  
- **Refinement Steps:** 4–8  
- **Reward:** +0.3 correctness + runtime speedup  

---

## 8. Inference Scaling

We analyze scaling along:

- Parallel axis (more trajectories)
- Serial axis (more refinement steps)

Empirical results show diminishing returns with increased compute, but allocating more compute to serial refinement yields better gains than increasing parallel trajectories.

Beam-search style test-time refinement further improves mean speedup to **1.56×**.

---

## 9. Conclusion

Kevin-32B demonstrates that multi-turn reinforcement learning with environment feedback enables long-horizon optimization learning and significantly outperforms single-turn training methods.

This supports Richard Sutton’s “Bitter Lesson”:

> Scalable search and learning — not handcrafted heuristics — are fundamental to building autonomous coding agents.

Kevin represents an early step toward fully self-improving coding systems.
