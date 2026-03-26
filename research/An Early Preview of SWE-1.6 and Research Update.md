March 1, 2026

# **An Early Preview of SWE-1.6 and Research Update**
**by Carlo Baronio, Ben Pan, Sam Lee, Eric Lu, Steven Cao, Rohan Choudhury, Adam Zweiger, Ray Wang, Gary Chang, Silas Alberti**

We are sharing an early preview of our ongoing SWE-1.6 training run. Since training SWE 1.5, we have refined our RL recipe and scaled our infrastructure to unlock two orders of magnitude more compute. Our next model SWE-1.6 is post-trained on the same pre-trained model as SWE-1.5 and runs equally as fast at 950 tok/s. The current checkpoint achieves an 11% higher score than SWE-1.5 on SWE-Bench Pro.

Training this model has taught us a lot about how RL can affect the “user experience” of a model. For example, our current checkpoint exhibits behaviors like overthinking and excessive self-verification. This is an active area of research for us - we believe **Model UX** is an important axis that isn’t captured by benchmarks like SWE-Bench Pro.

We are rolling out early access to this model to a small subset of users to collect feedback for tuning model behavior. Our goal for the preview period is to fix rough edges and further push intelligence as we continue training the model!

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/bfc2ccda7ef26adbdd56ea68389eeb917434986d-1588x1058.png" width="850"/>
</p>

# **Evaluation Details**
We chose to evaluate SWE-1.6 on SWE-Bench Pro following **OpenAI’s recommendation** as the spiritual successor of SWE-Bench Verified. Running bug-free and reproducible evaluations for agents requires care. We manually read hundreds of trajectories and cross-checked against Scale-reported **SWE-Bench Pro trajectories** when applicable. Some examples of subtle issues we resolved include: dependency issues in agent and grading environment setup, inconsistent handling of timeouts across harnesses, edge cases in patch collection and application, and out-of-memory during grading. We also double checked there is no overlap in repositories between training tasks & SWE-Bench Pro tasks.

