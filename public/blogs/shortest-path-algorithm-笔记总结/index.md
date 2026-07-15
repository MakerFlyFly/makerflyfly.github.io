## Shortest path algorithm（最短路算法）

How can we find the shortest route between two points on a road map?

Model the problem as a graph problem:

Road map is a weighted graph:

- vertices = cities
- edges = road segments between cities
- edge weights = road distances

Goal: find a shortest path between two vertices (cities)

翻译：

- 如何在道路地图上找到两个地点之间的最短路线？
- 将这个问题建模为一个图问题：
- 道路地图可以表示为一个 Weighted Graph（带权图）：
  - Vertices（顶点） = 城市
  - Edges（边） = 城市之间的道路路段
  - Edge Weights（边的权重） = 道路距离
- 目标：找到两个顶点（城市）之间的一条最短路径

Input:

- Directed graph \(G = (V, E)\)
- Weight function \(w : E \to R\)
- Weight of path \(p = v_0, v_1, \ldots, v_k\)
- Shortest-path weight from \(u\) to \(v\):

$$
w(p)=\sum_{i=1}^{k} w(v_{i-1}, v_i)
$$

$$
\delta(u, v)=
\begin{cases}
\min \{ w(p) : u \leadsto v \}, & \text{if there exists a path from } u \text{ to } v \\
\infty, & \text{otherwise}
\end{cases}
$$

Note: there might be multiple shortest paths from \(u\) to \(v\)

翻译：

- 输入（Input）：
- 有向图 \(G = (V, E)\)
- 权重函数 \(w : E \to R\)
- 路径 \(p\) 的权重：\(w(p)\)
- 从 \(u\) 到 \(v\) 的最短路径权重：\(\delta(u,v)\)
- 注意： 从 \(u\) 到 \(v\) 可能存在多条最短路径。

解释：

\(w : E \to R\) 是什么意思？

它表示权重函数 \(w\) 会给每一条边分配一个实数权重。

例如：

\(w(A,B)=5\) 表示从 \(A\) 到 \(B\) 这条边的权重是 5。

路径权重怎么计算？

路径 \(p = v_0, v_1, \ldots, v_k\)

表示：

```text
v0 -> v1 -> ... -> vk
```

路径总权重就是沿途所有边的权重之和：

$$
w(p)=w(v_0,v_1)+w(v_1,v_2)+\cdots+w(v_{k-1},v_k)
$$

## Variants of Shortest Path（最短路径问题的不同类型）

Single-source shortest paths

\(G = (V, E)\), find a shortest path from a given source vertex \(s\) to each vertex \(v \in V\)

Single-destination shortest paths

Find a shortest path to a given destination vertex \(t\) from each vertex \(v\)

Reversing the direction of each edge \(\to\) single-source

翻译：

- 单源最短路径（Single-source shortest paths）
- 给定图 \(G = (V, E)\)，找出从指定源顶点 \(s\) 到每个顶点 \(v \in V\) 的最短路径。
- 单终点最短路径（Single-destination shortest paths）
- 找出从每个顶点 \(v\) 到指定终点 \(t\) 的最短路径。
- 将每条边的方向反转后，可以把单终点最短路径问题转换成单源最短路径问题。

## Optimal Substructure（最优子结构）

Theorem: subpaths of shortest paths are shortest paths

Proof

if some subpath were not the shortest path, one could substitute the shorter subpath and create a shorter total path

翻译：

- 定理： 最短路径的任意子路径，本身也是最短路径。
- 证明：
- 如果某一段子路径不是最短路径，就可以用一条更短的子路径替换它，从而得到一条总长度更短的完整路径。

![Optimal substructure path diagram](/blogs/shortest-path-algorithm-笔记总结/optimal-substructure.png)

## Relaxation（松弛操作）

- 对于图中的每个顶点，我们维护一个 \(d[v]\)，表示从源点 \(s\) 到顶点 \(v\) 的当前最短路径估计值。开始时，将其初始化为 \(\infty\)。
- 对边 \((u,v)\) 进行松弛，是指检查：经过顶点 \(u\) 前往 \(v\)，能否改进目前找到的到 \(v\) 的最短路径。

代码块

```text
Relax(u, v, w)
if d[v] > d[u] + w(u,v), then
    d[v] <- d[u] + w(u,v)
    pi[v] <- u
```

解释：

\(d[v]\)：当前已知的、从源点 \(s\) 到顶点 \(v\) 的最小距离估计值。

\(\pi[v]\)：表示顶点 \(v\) 在当前最短路径中的 Predecessor（前驱顶点）。

![Relax operation example](/blogs/shortest-path-algorithm-笔记总结/relax-example.png)

## Negative Weights and Cycles?（负权重与环？）

Negative edges are OK, as long as there are no negative weight cycles (otherwise paths with arbitrary small “lengths” would be possible)

Shortest-paths can have no cycles (otherwise we could improve them by removing cycles)

Any shortest-path in graph \(G\) can be no longer than \(n - 1\) edges, where \(n\) is the number of vertices

翻译：

- 负权边（Negative Edges）是允许存在的，只要图中没有 负权环（Negative Weight Cycles）。否则，就可能得到权重任意小的路径。
- 最短路径中不需要包含环。否则，可以通过去掉环，使路径变得更短。
- 在图 \(G\) 中，任意一条最短路径最多包含 \(n - 1\) 条边，其中 \(n\) 是顶点数量。

## Negative-Weight Edges（负权边）

Negative-weight edges may form negative-weight cycles

If such cycles are reachable from the source, then \(\delta(s, v)\) is not properly defined!

Keep going around the cycle, and get

$$
w(s,v)=-\infty
$$

for all \(v\) on the cycle

翻译：

- 负权边可能会形成 负权环（Negative-Weight Cycle）。
- 如果从源点能够到达这样的负权环，那么 \(\delta(s,v)\) 就无法被正确定义。
- 因为可以不断绕着这个环行走，使环上所有顶点 \(v\) 的路径权重不断减小，最终可视为：\(w(s,v)=-\infty\)。

## Cycles（环）

翻译：

- Can shortest paths contain cycles? 最短路径中可以包含环吗？——不可以！
- Negative-weight cycles（负权环）
  - Shortest path is not well defined 最短路径无法被明确定义。——不可以！
- Positive-weight cycles（正权环）
  - By removing the cycle, we can get a shorter path 删除这个环之后，可以得到一条更短的路径。
- Zero-weight cycles（零权环）
  - No reason to use them 没有必要经过这种环。
  - Can remove them to obtain a path with same weight 可以删除这个环，并得到一条总权重相同的路径。

## Algorithms（算法）

Bellman-Ford algorithm

- Negative weights are allowed
- Negative cycles reachable from the source are not allowed.

Dijkstra’s algorithm

- Negative weights are not allowed

翻译：

- Bellman-Ford 算法
- 允许存在负权边（Negative Weights）
- 不允许存在从源点可达的负权环（Negative Cycles Reachable from the Source）
- Dijkstra 算法
- 不允许存在负权边

### Initialization（初始化）

算法： INITIALIZE-SINGLE-SOURCE(V, s)

```text
for each vertex v in V
    d[v] <- infinity
    pi[v] <- NIL
d[s] <- 0
```

- 所有单源最短路径算法都会从 INITIALIZE-SINGLE-SOURCE 开始。

解释：

- \(d[v]\)：当前距离估计值
- \(\pi[v]\)：前驱顶点
- NIL：表示“没有前驱”或“尚未设置”。

### Bellman-Ford 算法

Single-source shortest path problem

Computes \(\delta(s, v)\) and \(\pi[v]\) for all \(v \in V\)

Allows negative edge weights - can detect negative cycles.

Returns TRUE if no negative-weight cycles are reachable from the source \(s\)

Returns FALSE otherwise no solution exists

翻译：

- 单源最短路径问题（Single-source shortest path problem）
- 对所有 \(v \in V\)，计算 \(\delta(s,v)\) 和 \(\pi[v]\)
- 允许存在负权边，并且能够检测负权环
- 如果从源点 \(s\) 无法到达任何负权环，则返回 TRUE
- 否则返回 FALSE，表示不存在正常定义的最短路

### Bellman-Ford Algorithm (cont’d)

Idea:

Each edge is relaxed \(|V|-1\) times by making \(|V|-1\) passes over the whole edge set.

To make sure that each edge is relaxed exactly \(|V|-1\) times, it puts the edges in an unordered list and goes over the list \(|V|-1\) times.

- 核心思想（Idea）：
- 通过对整个边集合进行 \(|V|-1\) 轮遍历，使每条边都被松弛 \(|V|-1\) 次。
- 为了确保每条边恰好被松弛 \(|V|-1\) 次，算法将所有边放入一个无序列表中，并将该列表完整遍历 \(|V|-1\) 次。

边列表：

### Detecting Negative Cycles (perform extra test after V-1 iterations)

```text
for each edge (u, v) in E
    do if d[v] > d[u] + w(u, v)
        then return FALSE
return TRUE
```

![Negative cycle detection example](/blogs/shortest-path-algorithm-笔记总结/negative-cycle-detection.png)

翻译:

在完成 \(|V|-1\) 轮迭代后，再进行一次额外检测：

- 对每一条边 \((u,v) \in E\)
- 如果 \(d[v] > d[u] + w(u,v)\)
- 则返回 FALSE
- 如果所有边都无法继续松弛，则返回 TRUE

解释：

完成 \(|V|-1\) 轮松弛后，所有最短距离都应该已经确定。

如果仍有边可以进行 Relaxation（松弛），说明路径权重还能继续减小，存在从源点可达的 Negative-Weight Cycle（负权环）。

如果没有任何边可以继续松弛，说明不存在从源点可达的负权环。

### BELLMAN-FORD

```text
INITIALIZE-SINGLE-SOURCE(V, s)
for i <- 1 to |V| - 1
    do for each edge (u, v) in E
        do RELAX(u, v, w)
for each edge (u, v) in E
    do if d[v] > d[u] + w(u, v)
        then return FALSE
return TRUE
```

Running time:

$$
O(V + VE + E) = O(VE)
$$

### Shortest Path Properties

Upper-bound property

We always have \(d[v] \geq \delta(s, v)\) for all \(v\).

The estimate never goes up – relaxation only lowers the estimate

翻译：

- 上界性质（Upper-bound Property）
- 对所有顶点 \(v\)，始终有：\(d[v] \geq \delta(s, v)\)
- 距离估计值不会增大——Relaxation（松弛）只会降低距离估计值。

解释:

\(d[v]\) 和 \(\delta(s,v)\) 的区别

- \(d[v]\)：算法当前得到的、从源点 \(s\) 到 \(v\) 的距离估计值
- \(\delta(s,v)\)：从 \(s\) 到 \(v\) 的真实最短路径权重

![Negative edge relaxation example](/blogs/shortest-path-algorithm-笔记总结/negative-edge-relax.png)

## Dijkstra’s Algorithm（Dijkstra 算法）

Single-source shortest path problem:

No negative-weight edges: \(w(u, v) > 0, \forall (u, v) \in E\)

Each edge is relaxed only once!

Maintains two sets of vertices:

翻译：

- 单源最短路径问题（Single-source Shortest Path Problem）
- 不允许负权边：\(w(u,v) > 0\)
- （其实是大于等于0，课件不严谨）
- 每条边只进行一次 Relaxation（松弛）
- 维护两个顶点集合：

其中：

- 对于 \(S\)：已经确定最终最短距离的顶点集合。
- 对于 \(V-S\)：还没有确定最终最短距离的顶点。

![Dijkstra overview](/blogs/shortest-path-algorithm-笔记总结/dijkstra-overview.png)

解释：

S表示已经确定最终最短距离的顶点集合。

V-S表示还没有确定最终最短距离的顶点。

### Dijkstra’s Algorithm (cont.)（Dijkstra 算法（续））

Vertices in \(V - S\) reside in a min-priority queue

Keys in \(Q\) are estimates of shortest-path weights \(d[u]\)

Repeatedly select a vertex \(u \in V - S\), with the minimum shortest-path estimate \(d[u]\)

Relax all edges leaving \(u\)

翻译：

- \(V-S\) 中的顶点存放在一个 Min-Priority Queue（最小优先队列） 中。
- 队列 \(Q\) 中每个顶点的 Key（键值），就是它当前的最短路径权重估计值 \(d[u]\)。
- 重复从 \(V-S\) 中选择一个最短路径估计值 \(d[u]\) 最小的顶点 \(u\)。
- 对所有从 \(u\) 出发的边进行 Relaxation（松弛）。
- 步骤：
  1. 从 \(Q\) 中取出顶点 \(u\)（也就是当前优先级最高的顶点）
  2. 将 \(u\) 加入集合 \(S\)
  3. 松弛所有从 \(u\) 出发的边
  4. 更新 \(Q\)

### Dijkstra (G, w, s)

```text
INITIALIZE-SINGLE-SOURCE(V, s)
S <- empty set
Q <- V[G]
while Q is not empty
    do u <- EXTRACT-MIN(Q)
    S <- S union {u}
    for each vertex v in Adj[u]
        do RELAX(u, v, w)
    Update Q (DECREASE_KEY)
```

Running time:

$$
O(V \lg V + E \lg V) = O(E \lg V)
$$

翻译：INITIALIZE-SINGLE-SOURCE(V, s) 初始化所有顶点的距离估计值和前驱顶点。

将已确定最短距离的顶点集合 \(S\) 初始化为空集。

将图 \(G\) 中的所有顶点放入最小优先队列 \(Q\)。

当 \(Q \neq \emptyset\) 时，重复：

- 从 \(Q\) 中取出距离估计值最小的顶点 \(u\)。
- 将 \(u\) 加入集合 \(S\)。
- 对于每个顶点 \(v \in Adj[u]\)：执行 RELAX(u, v, w) 松弛边 \((u,v)\)。
- 更新 \(Q\)：执行 DECREASE-KEY，即把队列中顶点 v 的键值降低为新的 d[v]，并重新调整它在优先队列中的位置。

运行时间：

$$
O(E \lg V)
$$

## Correctness（正确性）

Dijkstra’s algorithm is a greedy algorithm

make choices that currently seem the best

locally optimal does not always mean globally optimal

Correct because maintains following two properties:

- for every known vertex, recorded distance is shortest distance to that vertex from source vertex
- for every unknown vertex v, its recorded distance is shortest path distance to v from source vertex, considering only currently known vertices and v

翻译：

- Dijkstra 算法是一种 Greedy Algorithm（贪心算法）
- 每一步都选择当前看起来最优的方案
- 局部最优并不总是意味着全局最优
- Dijkstra 算法之所以正确，是因为它始终维持以下两个性质：
- 对于每一个 Known Vertex（已确定顶点），记录的距离就是从源点到该顶点的最短距离
- 对于每一个 Unknown Vertex（未确定顶点） \(v\)，在只允许经过当前已确定顶点以及 \(v\) 的情况下，记录的距离是从源点到 \(v\) 的最短路径距离

一个例子：

![Dijkstra example step 1](/blogs/shortest-path-algorithm-笔记总结/dijkstra-example-01.png)

![Dijkstra example step 2](/blogs/shortest-path-algorithm-笔记总结/dijkstra-example-02.png)

![Dijkstra example step 3](/blogs/shortest-path-algorithm-笔记总结/dijkstra-example-03.png)

![Dijkstra example step 4](/blogs/shortest-path-algorithm-笔记总结/dijkstra-example-04.png)

![Dijkstra example step 5](/blogs/shortest-path-algorithm-笔记总结/dijkstra-example-05.png)

![Dijkstra example step 6](/blogs/shortest-path-algorithm-笔记总结/dijkstra-example-06.png)

![Dijkstra example step 7](/blogs/shortest-path-algorithm-笔记总结/dijkstra-example-07.png)

![Dijkstra example step 8](/blogs/shortest-path-algorithm-笔记总结/dijkstra-example-08.png)

![Dijkstra example step 9](/blogs/shortest-path-algorithm-笔记总结/dijkstra-example-09.png)
