April 14, 2026

# **Introducing SWE-Check: 10x Faster Bug Detection**

by Raymond Feng¹, Jeffrey Ling², Rhythm Garg¹, Moritz Stephan² (¹ Applied Compute, ² Cognition AI)

Smaller, specialized models can rival frontier generalists on the tasks they're trained for, at a fraction of the cost and latency.

We've partnered with Applied Compute to put this to the test by collaborating to RL-train a bug detection model. The result is **SWE-check,** which matches frontier performance on internal in-distribution evals (delta F1 to Opus 4.6 goes from 0.09 to 0) and makes meaningful progress on out-of-distribution evals (delta F1 to Opus 4.6 goes from 0.49 to 0.29).

While SWE-check is behind the frontier on out-of-distribution evals in terms of pure capability, its order of magnitude-faster wall-clock runtime and cheaper inference cost enable an instant and free bug detection experience not possible with frontier models. We will continue to improve this model and expect that additional work on the data generation pipeline will allow us to reduce the gap to frontier performance on out of distribution evals as well. A preview of SWE-check is available in Windsurf Next today and will be released in mainstream Windsurf soon.

