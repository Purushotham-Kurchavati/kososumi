# **Introducing SWE 1.6: Improving Model UX**

by Rohan Choudhury, Carlo Baronio, Ben Pan, Sam Lee, Eric Lu, Steven Cao, Joe Li, Andrew Wang, Adam Zweiger, Ray Wang, Gary Chang, Silas Alberti


We’re releasing SWE-1.6, our latest model built for software engineering agents, and we’re making it generally available in Windsurf. SWE-1.6 is optimized for both intelligence and model UX. Moreover, it is industry-leading in both speed (up to 950 tok/s) and cost (free tier for the next 3 months).

Last month, we released SWE-1.6 Preview, which improved on SWE-Bench Pro by more than 10% compared to our previous model SWE-1.5 while being post-trained on the same pre-trained model. SWE-1.6 was post-trained from scratch to jointly optimize for user experience and making the model feel smoother to use in addition to raw intelligence.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/f511f28a1a0e1313b07a1bfa365c595a2eaeb36c-900x448.png" width="700"/>
</p>

While SWE-1.6 achieves comparable performance to the Preview model on benchmarks like SWE-Bench Pro, we’re most excited about its dramatic improvement in what we call “model UX”. As we observed in our earlier post, the preview checkpoint exhibited several behavioral issues that added friction for our users. These included:



Overthinking for simple problems, taking more turns than necessary for simple tasks.
Calling tools sequentially rather than in parallel
Preferring shell commands rather than its own tools
Exhibiting “looping behavior”, getting caught in a circle of identical reasoning
Many of these axes aren’t measured by traditional benchmarks but significantly affect the infamous “vibes” users express when trying the model.

<p align="center">
  <img src="https://cdn.sanity.io/images/2mc9cv2v/production/cd85a19a6892ddd1ac1c18df4ff96d4d627cfc9b-900x563.png" width="700"/>
</p>

We were able to significantly reduce the frequency of such behaviors in SWE 1.6. The model now uses parallel tool calls more often, loops far less and relies more on its tools than the terminal. This leads to more efficient trajectories and a smoother user experience: the model obtains context much faster and requires less input from the user.


In the example below, when asked a question about the PyTorch codebase, SWE-1.6 uses parallel tool calls far more than the preview and answers the question faster.

[![Watch Demo](https://img.icons8.com/ios-filled/100/play-button-circled.png)](https://cdn.sanity.io/files/2mc9cv2v/production/a15b7fe928cf6ef96ccdb2d0ea5ec90bca10f7f9.mp4)
