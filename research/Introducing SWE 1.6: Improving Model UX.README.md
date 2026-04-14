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

