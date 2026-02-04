October 16, 2025
# **Introducing SWE-grep and SWE-grep-mini: RL for Multi-Turn, Fast Context Retrieval**

**TL;DR: We trained SWE-grep and SWE-grep-mini, fast agentic models specialized in highly parallel context retrieval. They match the retrieval capabilities of frontier coding models, while taking an order of magnitude less time. Available now in Windsurf’s new Fast Context subagent!**

Modern coding agents face a fundamental tradeoff between speed and intelligence. Frontier models can solve complex tasks, but it can take minutes of searching before they edit a single file, breaking your flow. In Windsurf and Devin, we observed that our agent trajectories were often spending >60% of their first turn just retrieving context.

Context retrieval has been historically done in 2 ways:

Embedding Search (RAG): once the upfront work of indexing the codebase is done, queries are fast. But:
The results can be inaccurate, especially for complex queries that require to jump across the codebase multiple times (such as tracing through some execution path in a large codebase).
The embeddings can even be counterproductive, as the agent can give too much weight to irrelevant information.
Agentic Search: the model uses CLI tools to explore a codebase, much like a human would do. Both Claude Code and Cline have noted that this works well for them, and up until today, we agreed. While much more flexible, agentic search has its drawbacks:
it’s generally slow, requiring dozens of sequential roundtrips between the user’s device and the inference endpoint.
It also forces the agent to attend to tens of thousands of tokens worth of irrelevant information before finding the relevant context. This exacerbates the slowness while also context poisoning the agent, significantly degrading answer quality.
This speed-intelligence tradeoff seemed inescapable — until we trained SWE-grep and SWE-grep-mini: models which match the retrieval capabilities of frontier coding models, while taking an order of magnitude less time. These models now power Fast Context, a subagent that helps you stay in flow.

![Cognition CodeSearch Eval and Tokens Per Second Comparison](https://cdn.sanity.io/images/2mc9cv2v/production/fd5e1ffd36c37ce5a58c1f403abb9e312cce9ff7-1882x855.png)
