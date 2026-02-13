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

Our model,**Kevin-32B = K(ernel D)evin**, outperforms frontier reasoning models on kernel generation. Moreover, our results show that multi-turn training makes the model more effective at self-refinement compared to single-turn training.
