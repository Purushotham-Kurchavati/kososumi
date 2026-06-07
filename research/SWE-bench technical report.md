# **SWE-bench technical report**

By The Cognition Team
03.15.24

To evaluate Devin, we turn to SWE-bench, an automated benchmark for software engineering systems consisting of GitHub issues and pull requests. We believe SWE-bench is a great choice because it deterministically evaluates (via unit tests) a system’s ability to solve issues in real world codebases, unlike benchmarks like HumanEval which are limited to standalone functions.

In SWE-bench, Devin successfully resolves 13.86%* of issues, far exceeding the previous highest unassisted baseline of 1.96%. Even when given the exact files to edit ("assisted"), the best previous model only resolves 4.80% of issues.

We provide our evaluation harness and Devin’s code edits at https://github.com/CognitionAI/devin-swebench-results.

# **Background**

SWE-bench is a dataset of 2,294 issues and pull requests scraped from popular open source Python repositories on GitHub. Its goal is to test a system’s ability to write real-world code.

Each SWE-bench instance consists of a GitHub issue and the pull request which resolved it. The pull request must include a unit test which fails before the code change and passes after (called a “fail to pass” test). The diff is split into two parts, patch and test_patch, which contain the code changes and the test changes, respectively.

Then the system being evaluated is asked to generate a diff given the GitHub issue description and the repository (at the time of the issue). The example is considered successful if all of the unit tests pass after patching the edit.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/73a35aaa9d9ab3f0cd1469ff5cf0e83146c354f7-1600x376.png?w=1600&fit=max" width="900"/>
</p>

Source: swebench.com

In SWE-bench, LLMs are either given the set of correct files to edit (“assisted”); or a separate system retrieves the files to edit based on similarity to the issue text (“unassisted”). As an agent, Devin does not receive any list of files and instead navigates files on its own, which is more comparable to the “unassisted” LLM.

Properly solving SWE-bench examples is challenging. The harder PRs require changing tens of files, maintaining backwards compatibility, and/or doing a lot of complex reasoning. Even when assisted, the best LLMs only achieve a 4.80% success rate.

# **Methodology**
We adapt SWE-bench to evaluate agents, a more general setting than the original eval for LLMs.

Setup

We run the agent end to end using a standardized prompt that asks it to edit code given only the GitHub issue description. We do not give the agent any other user input during the run.
The repo is cloned in the agent's environment. We only keep the base commit and its ancestors in the git history to prevent information leakage to the agent. Notably, we remove the git remote so that git pull does not work.
We set up the Python conda environment before the test starts.
We limit Devin to 45 minutes of runtime, as unlike most agents, it has the capability to run indefinitely. It can choose to terminate earlier if it wants.

Eval

Once the agent’s run exits, we reset all of the test files to the original state, in case the agent modified the tests. We take all other diffs in the file system and extract them as a patch.To determine which files are test files, we take the set of all files that were modified in the test patch.
We apply the agent’s patch to the repo, followed by the test patch.
We run the eval command provided by SWE-bench and check whether all the tests pass.
You can find code for our adapted eval harness at https://github.com/CognitionAI/devin-swebench-results.

Results

We evaluated Devin on a randomly chosen 25% of the SWE-benchmark test set (570 out of the 2,294). This was done to reduce the time it takes for the benchmark to finish, the same strategy the authors used in the original paper.
Devin successfully resolved 79 of the 570 issues, giving a 13.86% success rate. This is significantly higher than even the previous best assisted system (Claude 2) of 4.80%.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/2604c49c0ca7be615027add485ae9f132afccb28-1600x883.png?w=1600&fit=max" width="850"/>
</p>

The baselines in this plot are evaluated in the “assisted” setting, where the model is provided with the exact file it needs to edit. Baselines perform worse in the “unassisted” setting, where a separate retrieval system selects the files for the LLM to edit (the best model is Claude 2 + BM25 retrieval with 1.96%).

Because neither unassisted nor assisted is strictly comparable to the agent setting, where Devin is given the entire repo and can navigate the files freely, we choose the stronger numbers for the baseline comparison. We believe that running an agent end to end is the more natural setting for SWE-bench, as it’s more similar to real-world software development. We anticipate more agent results in this setting going forward.

# **Analysis**

**Multi-step planning**

Devin can execute multi-step plans to receive feedback from the environment. 72% of passing tests take over 10 minutes to complete, suggesting that the ability to iterate helps Devin succeed.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/db0e6e76b039ed477533effc754bb8ea12a85808-800x600.png?w=1600&fit=max" width="700"/>
</p>

# **Qualitative examples**

We provide some qualitative analysis of Devin’s results. Recall that Devin is given just the issue description and the cloned repository as input.

Example 1: ✅ scikit-learn__scikit-learn-10870

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/ac0d59216d45f5efb79f63deeea717b5191dc62e-1600x1343.png?w=1600&fit=max" width="800"/>
</p>

Devin is initially thrown off by the description, and adds self.lower_bound_ = max_lower_bound before return self literally as described. This is actually incorrect, as the variable isn't defined yet.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/b3e3d90a90fbe3046ace5e55e0b88c6281dca5fc-1600x761.png?w=1600&fit=max" width="850"/>
</p>

As test code provided in the issue description, Devin then updates the test file:

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/61565cbf12acfefa577f8ef48d739e3f4eabe1ff-1600x557.png?w=1600&fit=max" width="900"/>
</p>

But upon running the tests and receiving errors, Devin corrects the file:

