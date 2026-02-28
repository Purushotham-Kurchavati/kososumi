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


<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/936f69abff9f110a0fd2bcb85f1b76476ea9a7a6-4096x1743.png" width="1000"/>
</p>

Given 8 refinement steps, Kevin-32B gets 65% of its attempts correct on average across the entire dataset, significantly surpassing QwQ-32B and frontier models. It solves 89% of the dataset, whereas o4-mini and o3 only solve 53% and 51%, respectively. Across the dataset, Kevin-32B achieves a best@16 speedup of 1.41x, outperforming frontier models.

Kevin-32B is especially effective on level 2 tasks, achieving avg@16 correctness of 48% (vs 9.6% on o4-mini and 9.3% on o3). This suggests multi-turn training improves the model’s ability to solve more challenging tasks with longer horizons. Similarly, we notice that our model is very effective on level 2 tasks, achieving a best@16 speedup of 1.74x (vs 1.2x on o4-mini and o3).

Since the holdout set only contains 20 tasks, the evaluation results have high variance. Thus, we focus our discussions on the results on the entire dataset. As shown both here and in the Test-Time Search section, the trained model performs even better on the holdout set, showing generalization to unseen tasks.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/35be1e0d4443eafa2fb9bae5a031b68fdcb03b21-7120x6327.png" width="850"/>
</p>

# **Multi-Turn vs Single-Turn**
Kevin-32B also demonstrates massive improvements over QwQ-32B and the single-turn trained model. At 4 refinement steps, Kevin-32B marginally outperforms the single turn model, but the gap between them widens as we increase to 8 refinement steps. This shows that multi-turn training scales better over the serial axis by encouraging more aggressive optimizations.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/f8563936fb9cee7f8a8e549cd4092c4176b4a072-4670x2613.png" width="850"/>
</p>

One might wonder if the single-turn trained model can achieve better speedups by sampling parallel trajectories instead. However, we found that it’s not the case for this environment. Given a fixed compute budget, multi-turn inference dominates over single-turn inference, even for the single-turn trained model. Check the Single-Turn Inference section for details.

# **Reward Hacking**

Our initial experiments used smaller models like DeepSeek-R1-Distill-Qwen-7B, which led to several instances of reward hacking:

The model simply copies the PyTorch reference implementation, thus getting rewarded for generating a correct answer with 1.0x speedup.
The model wraps an incorrect implementation of the CUDA kernel in a try-except statement and invokes the PyTorch implementation functions as fallback.
The model inherits from the reference implementation, bypassing the need for a CUDA implementation.

Examples of reward hacking

<img 
  src="https://cdn.sanity.io/images/2mc9cv2v/production/f269a3cfcd20ae735ae4a0ca2cafaf559f59f2fc-3443x1271.png" 
  alt="Banner"
  width="100%" 
/>

To prevent reward hacking, we impose stricter format checks on the responses. We assign a reward of 0 to responses that use PyTorch functions or that do not contain CUDA kernels.

We observe that reward hacking occurs when the gap between the model capabilities and the dataset difficulty is significant. The model struggles to solve any task, so when it generates a hacked kernel, it’s the only action with a positive advantage, and thus gets reinforced significantly.

# **Junk and Repetition**

Across several runs, we observe that around steps 35–40, the model begins generating repetitive or nonsensical responses. We hypothesize that this is because the model has deviated into a region of instability. Surprisingly, we stumbled upon a strong predictor for future junk — the proportion of responses whose chain of thought did not start with “Okay,” — which we called the **“Not Okay Ratio”**.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/afb191e279a8828f69f0403ccf369d496c514c0c-4500x2100.png" width="900"/>
</p>

The more the model trains, the more the beginning of the CoT becomes erratic:

"Okay Amigos, so I need to optimize this 3D tensor-matrix multiplication..”

"Okay Holy crap, I need to get this code optimized….”

At the 8th pass of the refinement step:

"Okay SHIT, this is getting frustrating. Let me see. The error is about …”

To fix this problem, we attempted runs with KL coefficients of 0.001 and 0.01 but found that it slows down learning while not preventing junk generation. At the end we were able to delay the onset of junk until step 100 by using constant length loss normalization from Dr. GRPO, which lowered the grad norm significantly, and by clipping the grad norm aggressively at 0.05.

# **Sample Kernel**
As an example, we look at a trajectory of level 1 task 40 (LayerNorm). We highlight how the model iteratively incorporates feedback from the kernel evaluation and uses that to improves its generations.

**Step 1:** the model generates a correct kernel. It uses shared memory and fuses the computation of mean/variance with normalization. This achieves a speedup of 0.6x.

```cpp
__shared__ float shared_sums[512]; // 256 threads * 2 values

for (int s = block_size / 2; s > 0; s >>= 1) {
    if (tid < s) {
        shared_sums[2 * tid] += shared_sums[2 * (tid + s)];
        shared_sums[2 * tid + 1] += shared_sums[2 * (tid + s) + 1];
    }
    __syncthreads();
}
```cpp
__shared__ float shared_sums[512];
// code here
```

**Step 2:** the model notices from the evaluation feedback that “The current speedup is 0.6, which means it's actually slower than the PyTorch version. That's not good. Let me think about where the bottleneck might be”. It spends most of its reasoning tokens looking for a better block size and modifies the code accordingly. The change is correct, and the speedup is now **4.27x.**

**Steps 3 and 4:** the model attempts even more aggressive optimizations. It thinks about loop unrolling and reducing bank conflicts but settles on warp-level intrinsics. But it fails — first due to a correctness issue in the reduction logic, then due to an overlong chain of thought.

**Step 5:** the model notices the issue in the incorrect warp-reduction implementation and fixes it. It implements a two level warp reduction succesfully. The final speedup is **9.61x.**

```cpp
// Warp-level reduction using shuffle instructions
for (int delta = 1; delta <= 16; delta <<= 1) {
  float other_sum = __shfl_xor_sync(0xFFFFFFFF, warp_sum, delta);
  float other_sum_sq = __shfl_xor_sync(0xFFFFFFFF, warp_sum_sq, delta);
  warp_sum += other_sum;
  warp_sum_sq += other_sum_sq;
}

__shared__ float sum_warp[32];
__shared__ float sum_sq_warp[32];
__shared__ float results[2]; // [mean, inv_std]

if (warp_id == 0) {
  sum_warp[warp_lane] = warp_sum;
  sum_sq_warp[warp_lane] = warp_sum_sq;
}
__syncthreads();
```

The full kernel is present in the appendix.

# **Training Setup**
We use **Group Relative Policy Optimization (GRPO),** introduced by DeepSeek as a variant of the popular Proximal Policy Optimization (PPO) algorithm. Instead of using a value network to estimate the baseline and calculate the advantage, GRPO normalizes the rewards within the group of responses sampled from the same prompt.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/b01ff2de149e67f866c3a503e34d7591adfdeeff-2228x506.png" width="900"/>
</p>

We use vLLM for inference and DeepSpeed Zero-3 for offloading optimizer states. We train with 8 tasks per batch and 16 trajectories per task. We use GRPO with 2 gradient steps per batch. Our base model is **QwQ-32B**

After the response generation is done, each GPU offloads its vLLM engine to CPU memory and evaluates the kernels it generated. For each response, we check if the response is formatted correctly and extract the CUDA kernel. We then compile and execute the code to test for correctness with randomized tensors. If correct, we profile the kernel’s runtime.

Responses receive 0.3 reward for passing the correctness checks and an additional performance reward equal to the speedup obtained over the reference implementation.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/9c7de03dc5e05d2a89b47da5ec528693d0ea5fef-1458x722.png" width="850"/>
</p>
