## Graph

基础定义：

A graph is a mathematical object that is used to model different situations – objects and processes.

中文翻译

Graph（图）是一种数学对象，用来表示现实中的不同事物、关系和过程。

正式定义：

A graph is a collection (nonempty set) of vertices and edges.

中文翻译

一个 Graph 是由一组 Vertices（顶点）和 Edges（边）组成的集合，并且这个集合不是空的。

### Vertex 顶点

Vertices:

can have names and properties

中文翻译：

顶点可以拥有名称和属性。

### Edge：

Edges connect two vertices.Edges can be labeled.Edges can be directed.

中文翻译：

Edge 可以连接两个 vertices；

Edge 可以拥有标签；

Edge 可以具有方向。

### Adjacent Vertices：

There is an edge between them.

中文翻译：

如果两个顶点之间存在一条 Edge，那么这两个顶点就是：

Adjacent vertices 相邻顶点

## Directed and Undirected Graphs

## Undirected Graph：无向图

Edge 没有箭头，也没有规定方向。

\(AB = BA\)

## Directed Graph：有向图

Edge 带有箭头。

\(A \to B \ne B \to A\)

## Path

A list of vertices in which successive vertices are connected by edges.

中文翻译

Path（路径）是一串顶点，其中每两个前后相邻的顶点都必须由一条 Edge 连接。

注意：

Path 允许重复经过同一个 Vertex，也允许重复经过同一条 Edge。

## Simple Path

定义

No vertex is repeated.

没有任何顶点重复出现。

## Cycle

定义

Simple path with distinct edges, except that the first vertex is equal to the last.

中文：

Cycle 是首尾顶点相同的路径，中间顶点不重复，边也不重复。

另外：

A graph without cycles is called an acyclic graph.

没有 Cycle 的图叫 Acyclic Graph 无环图。

### Directed Cycle（有向环）补充

$$A \to B \to A$$

使用的是两条不同的有向边，所以通常可以构成一个 Directed Cycle（有向环），也叫长度为 2 的 Cycle。

记忆：

| 情况 | A-B-A 是 Cycle 吗？ |
| --- | --- |
| 无向简单图，只有一条边 AB | 不是，同一条边走了两次 |
| 有向图，有 A → B 和 B → A | 通常是长度为 2 的有向环 |
| 无向多重图，A、B 之间有两条不同边 | 可能是长度为 2 的环 |

## Loop 自环

An edge that connects the vertex with itself.连接一个顶点与它自身的边叫作 Loop。

## Connected and Disconnected Graphs

## Connected Graph 连通图

There is a path between each two vertices.

中文翻译

在任意两个 vertices 之间，都存在一条 Path，这个 Graph 就是 Connected Graph。

注意：

不要求两个顶点直接相邻，只要求它们之间能够通过某条路径到达。

## Disconnected Graph 非连通图

A graph G is said to be disconnected if there exist two nodes in G such that no path in G has those nodes as endpoints.

中文翻译

如果 Graph 中存在至少两个 vertices，它们之间完全不存在任何 Path，那么这个 Graph 就是 Disconnected Graph。

注意：

Adjacent 不等于 Connected

Adjacent：两个顶点之间有直接 Edge

Connected：两个顶点之间存在 Path，可以经过其他顶点

特殊地，只有一个 vertex 的 Graph 是 Connected Graph。

## Graphs and Trees

## Tree

an undirected graph with no cycles, and a node chosen to be the root.

中文翻译：

一个没有 Cycle 的 Undirected Graph，并且选择其中一个 Node 作为 Root。

注意：

选择不同的 Root：

不会改变原来的 Undirected Graph，也不会改变它的 Edges。

它只会改变：

哪个 node 放在最上方；

从哪个 node 开始观察层次；

各节点在树形图中的上下位置。

## Spanning Tree — 生成树

A sub-graph that contains all the vertices, and no cycles.

Spanning Tree（生成树）是原 Graph 的一个 Subgraph，并且：

包含原 Graph 的所有 Vertices；

不包含任何 Cycle；

所有 Vertices 仍然保持 connected。

## Complete Graph 完全图

Graphs with all edges present – each vertex is connected to all other vertices.

中文翻译

Complete Graph（完全图）是每一个 Vertex 都与其他所有 Vertices 直接相连的 Graph。

## Dense Graph 稠密图

Relatively few of the possible edges are missing.

中文翻译

在所有可能存在的 Edges 中，只有比较少的 Edge 缺失，这种图称为 Dense Graph。

即大部分能连接的地方都连接了。

## Sparse Graph 稀疏图

Relatively few of the possible edges are present.

中文翻译

在所有可能的 Edges 中，实际只有比较少的 Edge 存在，这种图称为 Sparse Graph。

即大部分能连接的地方都没有连接。

### 注意:

Dense 和 Sparse 通常是相对概念，课件这里没有给出严格分界线，并不是说超过某个固定百分比就一定叫 Dense。

Connected Graph: 任意两点之间存在 Path

Complete Graph: 任意两点之间存在直接 Edge

## Weighted Graphs and Networks

## Weighted Graph 加权图

Weighted graphs – weights are assigned to each edge.

中文翻译

Weighted Graph（加权图）是每一条 Edge 都被赋予一个数值，也就是 Weight（权重）。

## Network 网络

directed weighted graphs.（Some theories allow networks to be undirected.)

中文翻译

Network 是 Directed Weighted Graph，即有方向且带权重的图。

## Graph Representation — 图的表示方法

## Adjacency Matrix 邻接矩阵

行表示出发 Vertex，列表示另一个 Vertex。

例：

A 行、B 列

\(matrix[A][B] = 1\)

表示 A 和 B 之间存在 Edge AB。此处前一个表示行，后一个表示列。

$$V = \{A, B, C, D\}$$

$$E = \{AC, AB, AD, BD\}$$

对应矩阵：

|  | A | B | C | D |
| --- | --- | --- | --- | --- |
| A | 0 | 1 | 1 | 1 |
| B | 1 | 0 | 0 | 1 |
| C | 1 | 0 | 0 | 0 |
| D | 1 | 1 | 0 | 0 |

注意：

对于Undirected Graph：

The matrix is symmetrical.矩阵是对称的。

\(matrix[A][B] = matrix[B][A]\)

而Directed Graph 的矩阵通常：

is not symmetrical 不对称

## Adjacency Lists邻接表

For Undirected Graphs：

课件中的 Undirected Graph：

$$V = \{A, B, C, D\}$$

$$E = \{AC, AB, AD, BD\}$$

对应 Adjacency List：

```text
A: B C D
B: A D
C: A
D: A B
```

每个 Vertex 后面的 List，记录所有与它直接相邻的 Vertices。

For Directed Graphs:

在 Directed Graph 中，一个 Vertex 后面的 list 只记录：

从这个 Vertex 出发，箭头指向哪些 Vertices。

## Graph terminology

注意：

Directed Graph 中，Edge 两端的顺序很重要：

\((A,B) \ne (B,A)\)

Trees are special cases of graphs.Tree 是 Graph 的特殊情况。

Adjacent nodes：两个 nodes 之间有直接 Edge。

Path：连接两个 nodes 的 vertex sequence。

Complete graph：每个 Vertex 都与其他所有 Vertices 直接连接。

Complete Directed Graph 的 Edge 数量：

\(N(N - 1)\)

Complete Undirected Graph 的 Edge 数量：

\(\frac{N(N - 1)}{2}\)

Weighted Graph：每条 Edge 带有一个数值。

### 拓：

为什么Complete Undirected Graph 的 Edge 数量这么算？

想象一下，一个节点，可以连接剩下所有节点，这样的节点一共有N个，即N（N-1），然后这样的话每个节点之间都连了两个。所以最后再除以2就好了。

## Graph Implementation

## Array-based Implementation

\(\text{Vertices} \to \text{1D Array}\)
\(\text{Edges} \to \text{2D Adjacency Matrix}\)

A 1D array is used to represent the vertices.A 2D array (adjacency matrix) is used to represent the edges.

中文翻译

一维数组用来表示顶点；二维数组，也就是邻接矩阵，用来表示边。

## Linked-list Implementation

A 1D array is used to represent the vertices.A list is used for each vertex , which contains the vertices which are adjacent from \(v\).

中文翻译

一维数组用于表示 Vertices。

对于每一个 Vertex \(v\)，使用一个 List，记录所有从 \(v\) 出发直接连接到的 Vertices。

## Adjacency Matrix vs. Adjacency List

| Representation | 课件结论 |
| --- | --- |
| Adjacency Matrix | Good for dense graphs |
| Adjacency List | Good for sparse graphs |

并给出：

Adjacency Matrix memory：\(O(|V|^2)\)

Adjacency List memory：\(O(|V| + |E|)\)

Matrix：快速检查两个 vertices 是否 connected

List：快速找到某个 vertex 的 adjacent vertices

## Graph Search Introduction图搜索简介

## Search

Fundamental operation, to find out which vertices can be reached from a specified vertex.

Search（搜索） 是 Graph 中的基本操作，用来找出从某个指定 Vertex 出发，可以到达哪些 Vertices。

An algorithm that provides a systematic way to start at a specified vertex and then move along edges to other vertex.

Graph Search 是一种系统化算法：从一个指定 vertex 开始，然后沿着 edges 移动到其他 vertices。

Every vertex that is connected to this vertex has to be visited at the end.

所有与起点 connected 的 vertices，最终都必须被访问到。

Two common approaches :

depth-first (DFS) and

breadth-first search (BFS).
