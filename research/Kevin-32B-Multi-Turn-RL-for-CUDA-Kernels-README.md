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

Our model,`Kevin-32B = K(kernel D)`,outperforms frontier reasoning models on kernel generation. Moreover, our results show that multi-turn training makes the model more effective at self-refinement compared to single-turn training.

# **Multi-Turn Training Method**

We use KernelBench, a dataset of 250 PyTorch-based classic deep learning tasks. It measures a model’s ability to replace the PyTorch operators with optimized CUDA kernels. We focus on the first two levels, each containing 100 tasks. Level 1 includes foundational tasks such as matrix multiplication, convolution, and loss functions, while level 2 consists of fused operators. We train on 180 tasks of these two levels, with a holdout set of 20 tasks.

During training, the model goes through an iterative feedback loop: we extract feedback from a generated kernel and have the model refine it. If the kernel fails to compile, we pass the model the error trace and ask it to fix it. If it’s correct, we measure the runtime and ask the model to improve it further.

Our initial approach constructs the trajectories as follows. Starting with the initial prompt, we append the chain of thought, kernel, and evaluation information after each refinement step. We then assign a single reward to the entire trajectory—defined as the maximum score achieved by any kernel—and use this sequence for training.



