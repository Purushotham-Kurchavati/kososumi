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

A new config flag silently switches output values from timestamps to normalized fractions. Each changed file is internally consistent, but spotting the issue requires tracing the data contract across three files to see where assumptions diverge.


This is not a typical code analysis task; unlike normal coding agents that operate in a chat interface, the SWE-check agent produces a structured output with bug descriptions and bug-fixes that render nicely in Windsurf.

Here is an example of a ground truth bug from our training dataset, to provide a sense of the kinds of tasks the model is trained on:

**Repository:** block/goose

**Commit:** cd0b7d69

**PR(s) fixing bugs that trace back to this commit:** #5066

**Bug 1: Concurrency & Threading - High severity (2 changes)**


**Description:** The code iterated over the keys view returned by self.extensions.lock().await.keys() while holding the extensions mutex guard across the iteration. The loop body then awaited a call to read_resource_from_extension, which itself may attempt to lock the same self.extensions mutex. Holding a mutex guard across an await that leads to re-lock attempts causes a deadlock, since the original guard is not released before the re-lock is requested. This manifested as the extension manager hanging when trying to read resources from extensions.


**Fix:** Before iterating and awaiting into extension-specific logic, the code now collects the extension names into an owned Vec<String> by cloning the keys while holding the lock and then immediately releases the lock. The subsequent iteration runs over the collected names (no mutex held), and calls into read_resource_from_extension with a reference to each name. This prevents holding the extensions mutex across awaits and eliminates the reentrant lock attempt that caused the deadlock. A short explanatory comment was also added above the collection to document the reason.


**Ground truth bug-fix:**

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/2c6167fbf02585e3fa5351172d35ea337a3087c8-1468x1160.png" width="800"/>
</p>

During training, the model starts inside a sandbox with the repo checked out to the source commit, and then its job is to output bugs that it identifies with descriptions along with bug-fixes. These bugs are compared to the ground truth bugs for that source commit.

The agent also needs to be near-real time and keep users in flow, avoiding at all costs what we call **The Semi-Async Valley of Death.** Fortunately, inference providers like Cerebras allow for thousands of tokens of dense intermediate thinking to happen before the final output in a matter of seconds.

At the same time, the model needs to be extremely high-quality, reliably finding subtle bugs when they exist while also not annoying the user with silly non-bugs. Before deciding to proceed with RL training, we had our colleagues dogfood various off-the-shelf frontier models, both open-source and closed-source, in the SWE-check harness. They found that frontier models that met the quality bar were too slow and expensive for on-demand bug detection in the IDE. This motivated RL-training an open-source model to be extremely specialized – fast and capable – on this task.


We ran two primary evals:


in-distribution eval that was a random subset of the tasks generated in our data pipeline, held out from the other tasks making up the training distribution.

out-of-distribution eval that was a collection of bugs collected internally at Cognition in the Cognition codebase and fully held-out during the training process.

Here is how the final trained model performed compared to frontier closed- and open-source models:

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/5e3a03fd32868f762326accae47560ea31cee301-4812x1980.png" width="1000"/>
</p>






