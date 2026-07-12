## Graph Traversal (DFS and BFS).

## DFS

Can be implemented with a stack to remember where it should go when it reaches a dead end.

DFS 可以使用 Stack（栈） 来实现。栈会记录之前经过的位置，以便搜索遇到 Dead End（死路） 时，知道应该返回哪里继续搜索。

DFS goes far way from the starting point as quickly as possible and returns only if it reaches a dead end.

DFS 会从起点出发，沿着一条路径尽可能不断深入；只有当这条路径无法继续时，才会返回之前的节点。

Used in simulations of games

DFS 可以用于 Game Simulation（游戏模拟），例如搜索游戏中的不同操作路径或预测后续可能出现的局面。

### Rules

There are 3 rules

-- start with a vertex

R1 a.  go to any vertex adjacent to it that hasn’t yet been visited

b. push it on a stack and mark it

R2 if can’t follow R1, then possible pop up a vertex off the stack

R3 if can’t follow R1 and R2, you’re done

翻译：

有 3 条规则

-- 从一个顶点开始

R1 a. 前往与该顶点相邻、且尚未被访问的任意顶点

b. 将它压入栈中并标记

R2 如果无法执行 R1，那么可以从栈中弹出一个顶点

R3 如果 R1 和 R2 都无法执行，则搜索完成

### Steps:

-- start with a vertex

-- visit it

-- push it on a stack and mark it

-- go to any vertex adjacent to it that hasn’t yet been visited

-- if there are no unvisited nodes, pop a vertex off the stack till you come across a vertex that has unvisited adjacent vertices

• 步骤：

-- 从一个顶点开始

-- 访问它

-- 将它压入栈中，并标记为已访问

-- 前往与它相邻、且尚未被访问的任意顶点

-- 如果当前顶点没有尚未访问的相邻顶点，就从栈中不断弹出顶点，直到找到一个仍然存在未访问相邻顶点的顶点

### Requirements

Can be used to attempt to visit all nodes of a graph in a systematic manner

Works with directed and undirected graphs

Works with weighted and unweighted graphs

翻译：

• 可以用于以系统化的方式，尝试访问图中的所有节点

• 适用于 Directed Graph（有向图） 和 Undirected Graph（无向图）

• 适用于 Weighted Graph（带权图） 和 Unweighted Graph（无权图）

## BFS

Implemented with a queue.

Stays as close as possible to the starting point.

Visits all the vertices adjacent to the starting vertex

翻译：

• 使用 Queue（队列） 来实现。

• 搜索时尽可能靠近起始点。

• 先访问与起始顶点相邻的所有顶点。

### Steps:

-- start with visiting a starting vertex

-- visit the next unvisited adjacent vertex, mark it and insert it into the queue.

-- if there are no unvisited vertices, remove a vertex from the queue and make it the current vertex.

-- continue until you reach the end.

翻译：

-- 从访问一个起始顶点开始

-- 访问下一个尚未访问的相邻顶点，将它标记，并把它插入队列中

-- 如果没有尚未访问的相邻顶点，就从队列中移出一个顶点，并将它设为当前顶点

-- 持续执行，直到搜索结束

### Requirements:

Can be used to attempt to visit all nodes of a graph in a systematic manner

Works with directed and undirected graphs

Works with weighted and unweighted graphs

翻译：

• 可以用于以系统化的方式，尝试访问图中的所有节点

• 适用于 Directed Graph（有向图） 和 Undirected Graph（无向图）

• 适用于 Weighted Graph（带权图） 和 Unweighted Graph（无权图）
