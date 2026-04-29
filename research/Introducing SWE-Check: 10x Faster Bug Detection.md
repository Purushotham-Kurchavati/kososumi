April 14, 2026

# **Introducing SWE-Check: 10x Faster Bug Detection**

by Raymond Feng¹, Jeffrey Ling², Rhythm Garg¹, Moritz Stephan² (¹ Applied Compute, ² Cognition AI)

Smaller, specialized models can rival frontier generalists on the tasks they're trained for, at a fraction of the cost and latency.

We've partnered with Applied Compute to put this to the test by collaborating to RL-train a bug detection model. The result is **SWE-check,** which matches frontier performance on internal in-distribution evals (delta F1 to Opus 4.6 goes from 0.09 to 0) and makes meaningful progress on out-of-distribution evals (delta F1 to Opus 4.6 goes from 0.49 to 0.29).

While SWE-check is behind the frontier on out-of-distribution evals in terms of pure capability, its order of magnitude-faster wall-clock runtime and cheaper inference cost enable an instant and free bug detection experience not possible with frontier models. We will continue to improve this model and expect that additional work on the data generation pipeline will allow us to reduce the gap to frontier performance on out of distribution evals as well. A preview of SWE-check is available in Windsurf Next today and will be released in mainstream Windsurf soon.

Here's how we did it:

integrating natively with the production environment during RL
using a new technique we term reward linearization to translate our desired global metric to a sample-level reward
introducing multiple phases of post-training to build a model that is both capable and aligned with product usage patterns

# **The SWE-check Agent and its requirements**
The SWE-check agent analyzes the current diff and flags any bugs likely introduced by the change.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/08e561ca0272842411fd07c1cda6a2c2d4567186-2000x949.png" width="900"/>
</p>



# **The SWE-check Agent and its requirements**
The SWE-check agent analyzes the current diff and flags any bugs likely introduced by the change.

# **The SWE-check Agent and its requirements**
The SWE-check agent analyzes the current diff and flags any bugs likely introduced by the change.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/08e561ca0272842411fd07c1cda6a2c2d4567186-2000x949.png" width="900"/>
</p>
