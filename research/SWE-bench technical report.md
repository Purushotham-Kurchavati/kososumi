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
