May 6, 2025

# **Kevin-32B: Multi-Turn RL for Writing CUDA Kernels**

by Carlo Baronio, Pietro Marsella, Ben Pan, Silas Alberti

Carlo Baronio*, Pietro Marsella*, Ben Pan*, Silas Alberti

Stanford University, Cognition AI

*equal contribution
<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/1a5f0cc2ae90659e7a862bf0bbf1e27a13375c0f-4096x1638.png" width="900"/>
</p>

Coding is an iterative process – you write a program, execute it, evaluate the results, and refine your code based on the feedback. Recent advances in LLM for code generation have tried to incorporate this process at inference-time, using methods like parallel sampling. While these methods are effective, they rely on search without actual learning — the model weights are frozen.

We explore reinforcement learning in a multi-turn setting, using intermediate feedback from the environment, and masking model thoughts to avoid exploding context over multiple turns.

Our model, <mark>Kevin-32B = K(kernel D)</mark> ,outperforms frontier reasoning models on kernel generation. Moreover, our results show that multi-turn training makes the model more effective at self-refinement compared to single-turn training.

# **Multi-Turn Training Method**

We use `KernelBench`, a dataset of 250 PyTorch-based classic deep learning tasks. It measures a model’s ability to replace the PyTorch operators with optimized CUDA kernels. We focus on the first two levels, each containing 100 tasks. Level 1 includes foundational tasks such as matrix multiplication, convolution, and loss functions, while level 2 consists of fused operators. We train on 180 tasks of these two levels, with a holdout set of 20 tasks.

During training, the model goes through an iterative feedback loop: we extract feedback from a generated kernel and have the model refine it. If the kernel fails to compile, we pass the model the error trace and ask it to fix it. If it’s correct, we measure the runtime and ask the model to improve it further.

Our initial approach constructs the trajectories as follows. Starting with the initial prompt, we append the chain of thought, kernel, and evaluation information after each refinement step. We then assign a single reward to the entire trajectory—defined as the maximum score achieved by any kernel—and use this sequence for training.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/0ec36526d97ed100edc20d8fd7021172aead0d2e-1916x1002.png" width="800"/>
  <br/>
  <em>Figure: Kevin-32B architecture overview</em>
</p>

However, this approach presents several problems:

**Exploding context window:** reasoning models generate long chains of thought. With this approach, the length of the trajectory can easily reach 50-100k tokens after just a few passes, becoming prohibitive for training.



**Sample inefficiency and credit assignment:** we are assigning a single reward for the entire trajectory even though we generated multiple kernels. This provides no signal on which refinement step actually improved correctness or performance. The rewards should be assigned to refinement steps based on their contribution to the final result.
To fix the exploding context length, we discard the longest part of the trajectory — the chain of thought. Each prompt will now only include the previously generated kernels and evaluation results. To still retain information about the thinking process of the previous step, we ask the model to generate a brief summary of its own thought process, which is then passed to the subsequent contexts.

To fix the exploding context length, we discard the longest part of the trajectory — the chain of thought. Each prompt will now only include the previously generated kernels and evaluation results. To still retain information about the thinking process of the previous step, we ask the model to generate a brief summary of its own thought process, which is then passed to the subsequent contexts.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/57fdfaa07456086eb157d40def0cb9fb44747686-1882x1000.png" width="850"/>
</p>

fix #1: remove chain of thought for inference

To address sample inefficiency, we choose a more expressive reward function. We model the refinement of kernels as a Markov decision process, setting the reward of a given response as the discounted sum of scores of the current kernel and all subsequent ones. Each refinement step thus becomes its own training sample.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/0702d9ff633bd0c47ce878455dd758f119d478bc-1802x974.png" width="850"/>
</p>

fix #2: reward as a discounted sum of scores

# **Results**
For each task, we sample 16 trajectories in parallel with 8 serial refinement steps.  A trajectory's correctness is 1 if it contains at least one kernel that passes the unit tests and 0 otherwise. Its performance score is the speedup over reference implementation of the fastest correct kernel. For each task’s correctness or performance, we define **best@16** as the maximum across all trajectories and **avg@16** as the mean across the trajectories.
