## 什么是Harness Engineering？
<br>
Harness Engineering 是围绕 LLM Agent 的运行框架（agent harness / scaffold） 进行设计的工程方法。它关注如何管理 context、tool calls、state、validation、permissions、feedback loop，让模型能够稳定地执行任务。

通俗来说，就是让我们使用的模型（如GPT、deepseek、claude等）能够作为 agent 行动的系统。它让AI按照特定流程工作: 哪一步该看什么资料，哪一步该调用什么工具，写完代码如何测试，失败后怎么重试，任务进度怎么保存，危险操作要不要确认等。
<br>

---

## Harness解决什么问题？
<br>
Harness 解决LLM Agent 在长任务中的五类问题。

### 1. Tool orchestration

模型本身并不会调用外部工具（如图像识别），需要harness去协调工具调用。

### 2. Task decomposition

复杂任务一次性交给ai可能会造成混乱。

### 3. Context loss

任务变长后，模型可能会对之前发生的事毫无记忆。这是信息层面的遗忘。

### 4. State persistence

在执行长任务时，模型可能会忘记已经做了什么、还没做什么、现在卡在哪里、下一步该干什么。区别于前者，这是进度层面的丢失。

### 5. Self-evaluation failure

模型自己在检查自己的错误的时候总是过于自信，容易判断不准，所以需要外部验证机制。

> （拓展：例如evaluator、test、validation等等。Anthropic 也曾提到三 Agent 架构来解决这个问题：“planner, generator, and evaluator”）
<br>

---

## Harness Engineering 是怎么运作的？
<br>
以下将用一张流程图演示：
<br>

![harness.png](/blogs/为什么vibe-coding-的你一定要掌握-harness-engineering-驾驭工程/d0fe4e644624a5f5.png)

---

## 作为Vibe Coding开发者，了解这个有什么用呢？
<br>
Codex 等编程工具本身已经内置了很多 Harness 功能，学习 Harness 并不是让我们从零开始实现它，而是去知道哪些环节可以配置、约束、检查和接管。

我们需要明白Harness 环节与编程工具里面功能的对应关系，从而进行调整，让它们能够更好的执行我们的任务。

具体如何实操，且听下回分解。