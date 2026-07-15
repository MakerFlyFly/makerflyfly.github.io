## Minimum Spanning Tree 最小生成树

## Spanning Trees 生成树

A spanning tree of a graph is just a subgraph that contains all the vertices and is a tree.

A graph may have many spanning trees.

一个图的生成树，是一个包含原图所有顶点、并且本身构成一棵树的子图。

一个图可能有多棵不同的生成树。

![Complete graph and spanning tree examples](/blogs/mst-笔记总结/spanning-trees.png)

## Minimum Spanning Tree

The Minimum Spanning Tree for a given graph is the Spanning Tree of minimum cost for that graph.

给定一个图，它的 Minimum Spanning Tree（最小生成树） 是该图所有生成树中，总成本最小的一棵生成树。

![Complete graph to minimum spanning tree example](/blogs/mst-笔记总结/mst-example.png)

## Algorithms for Obtaining the Minimum Spanning Tree

获取最小生成树的算法

- Kruskal's Algorithm（Kruskal 算法）
- Prim's Algorithm（Prim 算法）

## Kruskal 算法（Kruskal's Algorithm）

This algorithm creates a forest of trees. Initially the forest consists of \(n\) single node trees (and no edges). At each step, we add one edge (the cheapest one) so that it joins two trees together. If it were to form a cycle, then the two nodes are already joined and do not need to be joined.

翻译：

该算法会构造一个由多棵树组成的 Forest（森林）。

最开始，森林中包含 \(n\) 棵只有一个节点的树，并且没有任何边。

在每一步中，我们选择一条成本最低的边，将两棵树连接起来。

如果加入某条边会形成 Cycle（环），就说明这条边连接的两个节点已经属于同一棵连通的树，因此不需要加入这条边。

### Steps

The steps are:

1. The forest is constructed - with each node in a separate tree.
2. The edges are placed in a priority queue.
3. Until we've added \(n - 1\) edges:
   1. Extract the cheapest edge from the queue.
   2. If it forms a cycle, reject it.
   3. Else add it to the forest. Adding it to the forest will join two trees together.

Every step will have joined two trees in the forest together, so that at the end, there will only be one tree in \(T\).

步骤如下

1. 构造一个森林，其中每个节点分别属于一棵独立的树。
2. 将所有边放入 Priority Queue（优先队列） 中。
3. 重复以下步骤，直到已经加入 \(n - 1\) 条边：
   1. 从队列中取出成本最低的边。
   2. 如果加入这条边会形成环，则舍弃它。
   3. 否则，将它加入森林。这条边会把森林中的两棵树连接起来。

每次成功加入一条边，都会把森林中的两棵树合并。因此在算法结束时，森林中只剩下一棵树，即得到最小生成树 \(T\)。

核心原则：

> 优先选择最便宜的边，但绝不能形成环。

### Analysis of Kruskal's Algorithm

Running Time:

$$
O(m \log n)
$$

where \(m\) = edges, \(n\) = nodes.

Testing if an edge creates a cycle can be slow unless a complicated data structure called a “union-find” structure is used.

It usually only has to check a small fraction of the edges, but in some cases (like if there was a vertex connected to the graph by only one edge and it was the longest edge) it would have to check all the edges.

翻译:

运行时间：

$$
O(m \log n)
$$

其中：

- \(m\) = 边的数量（edges）
- \(n\) = 节点的数量（nodes）

除非使用一种称为 Union-Find（并查集） 的数据结构，否则判断一条边是否会形成环可能会很慢。

通常情况下，算法只需要检查所有边中的一小部分。但是在某些情况下，它必须检查全部边。例如：某个顶点只有一条边与图相连，并且这条边恰好是权重最大的边。

## Prim 算法（Prim's Algorithm）

This algorithm starts with one node. It then, one by one, adds a node that is unconnected to the new graph, each time selecting the node whose connecting edge has the smallest weight out of the available nodes’ connecting edges.

翻译：

该算法从一个节点开始。之后，它每次加入一个尚未连接到新图中的节点，并在所有可选的连接边中，选择权重最小的那一条。

### Steps

The steps are:

1. The new graph is constructed - with one node from the old graph.
2. While new graph has fewer than \(n\) nodes:
   1. Find the node from the old graph with the smallest connecting edge to the new graph.
   2. Add it to the new graph.

Every step will have joined one node, so that at the end we will have one graph with all the nodes and it will be a minimum spanning tree of the original graph.

步骤如下

1. 从原图中选择一个节点，构造新图。
2. 当新图中的节点数量少于 \(n\) 时，重复以下步骤：
   1. 在原图中尚未加入新图的节点里，找出与新图相连且连接边权重最小的节点。
   2. 将该节点及其连接边加入新图。

每一步都会向新图中加入一个节点。因此，最终新图会包含原图中的所有节点，并成为原图的一棵 Minimum Spanning Tree（最小生成树）。

### Analysis of Prim's Algorithm

Running Time:

$$
O(m + n \log n)
$$

where \(m\) = edges, \(n\) = nodes.

Unlike Kruskal’s, it doesn’t need to see all of the graph at once. It can deal with it one piece at a time. It also doesn’t need to worry if adding an edge will create a cycle since this algorithm deals primarily with adding nodes to a new graph.

For this algorithm the number of nodes needs to be kept to a minimum in addition to the number of edges. For small graphs, the edges matter more, while for large graphs, the number of nodes matters more.

翻译：

运行时间：

$$
O(m + n \log n)
$$

其中：

- \(m\) = 边的数量（edges）
- \(n\) = 节点的数量（nodes）

与 Kruskal 算法不同，Prim 算法不需要一次处理整个图，而是可以从一个部分开始，逐步向外扩展。它也不需要专门判断加入一条边是否会形成环，因为该算法主要通过不断加入新节点来扩展生成树，而不是单纯从所有边中选择边。

对于该算法，除了边的数量以外，节点的数量也会影响运行时间。课件认为：对于较小的图，边数的影响更大；对于较大的图，节点数的影响更大。

我的解释：算法需要查看各节点连接出去的边，总共最多处理 \(m\) 条边：

Prim 每次都要找出：

> 与当前生成树连接成本最低的下一个节点。

如果使用高效的 Priority Queue（优先队列），处理 \(n\) 个节点的代价可以写成：

$$
O(n \log n)
$$

两部分相加：

$$
O(m + n \log n)
$$
