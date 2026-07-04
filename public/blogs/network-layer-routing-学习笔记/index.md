# Network Layer Routing 学习笔记

> 主题：CST309 Computer Networks and Communication — Network Layer Part 2: Routing  
> 目标：理解 Router 如何转发 packet、Routing Table 如何产生与更新，以及 Dynamic Routing 中 Distance Vector 与 Link-State 两类协议的关系。

---

## 0. 学习导引图

### 0.1 本章主线

```text
Network Layer（网络层）
│
├── Router（路由器）
│   └── 根据 destination IP address 转发 packet
│
├── Routing Table（路由表）
│   └── Router 做 forwarding decision 的依据
│
├── Longest Prefix Match（最长前缀匹配）
│   └── 多条 route 匹配时，选择 prefix 最长、最具体的一条
│
├── Forwarding Process（转发过程）
│   └── 查 destination IP → 查 routing table → 选择 route → 发给 next hop
│
└── How to Create / Update Routing Table
    │
    ├── Static Routing（静态路由）
    │   └── 管理员手动配置 route
    │
    └── Dynamic Routing（动态路由）
        └── 通过 routing protocols 自动学习与更新 routes
```

### 0.2 Routing Protocols 的核心关系

```text
Routing Protocols（动态路由协议）
│
├── Distance Vector 类型
│   └── RIP
│       └── 使用 Distance Vector Algorithm
│           └── 核心思想接近 Bellman-Ford
│
└── Link-State 类型
    └── OSPF
        └── 使用 Link-State Routing Algorithm
            └── 具体算最短路时用 Dijkstra’s Algorithm
```

也可以简化记忆为：

```text
RIP  = Distance Vector + Bellman-Ford 思想 + hop count
OSPF = Link-State + Dijkstra’s Algorithm + link cost
```

---

## 1. Network Layer（网络层）

### 1.1 作用

1. 把 Transport Layer 产生的 **segment** 封装成 **datagram（数据报）**。
2. **Transport segment from sending to receiving host**  
   把数据从源主机送到目标主机。

### 1.2 简单理解

```text
Transport Layer 产生 segment
↓
Network Layer 封装成 datagram
↓
从 sending host 送到 receiving host
```

Network Layer 负责跨网络传输数据，它关心的是：这个 packet 要从哪台主机送到哪台主机。

---

## 2. Router（路由器）

### 2.1 作用一：连接多个 networks

**A router joins two or more networks and passes packets from one network to another.**

中文：

Router 连接两个或多个 network，并把 packet 从一个 network 转发到另一个 network。

### 2.2 作用二：决定 best path

**Determine the best path for data to follow from point A to point B.**

中文：

Router 决定从 source 到 destination 的“最合适路线”。

注意：**best path 不一定永远等于最短路径**。best path 可能根据不同标准决定，例如：

- **hop count**：跳数
- **cost**：代价
- **bandwidth**：带宽
- **delay**：延迟
- **reliability**：可靠性

### 2.3 作用三：Reroute traffic

**Reroute traffic if the path of first choice is down but another path is available.**

中文：

如果首选路径不可用，但还有其他路径可用，Router 可以重新规划 traffic 路线。

### 2.4 简单例子

原本 packet 走：

```text
Source → Router 1 → Router 2 → Destination
```

如果 `Router 1 → Router 2` 这条 link down，Router 可以改走：

```text
Source → Router 1 → Router 3 → Router 4 → Destination
```

这就是 **reroute traffic**。

---

## 3. Routing Table（路由表）

### 3.1 作用

**Used by routers to make packet forwarding decision.**

中文：

Routing Table 是 Router 做 **forwarding decision（转发决策）** 的依据。

### 3.2 Routing Table 里面通常有什么？

1. **Destination address**  
   目的网络地址。

2. **Network mask**  
   网络掩码，用来判断目标 IP 属于哪个 network。

3. **Outgoing interface**  
   出接口，packet 应该从哪个 interface 发出去。

4. **Next hop**  
   下一跳，packet 下一步应该交给哪个 router 或设备。

### 3.3 简单例子

```text
Destination: 192.168.2.0/24
Next hop: 10.12.1.2
Interface: GE0/0/0
```

意思是：

如果 packet 要去 `192.168.2.0/24`，Router 就从 `GE0/0/0` 发出去，并交给 next hop `10.12.1.2`。

---

## 4. Longest Prefix Match（最长前缀匹配）

### 4.1 意义

**When multiple routing table entries match the destination IP address, the router chooses the entry with the longest matching prefix.**

中文：

当 routing table 中有多条 route 都能匹配 destination IP address 时，Router 会选择 prefix 最长，也就是最具体的那一条。

### 4.2 例子

假设：

```text
Destination IP: 192.168.2.10
```

Routing Table 里有：

```text
192.168.0.0/16
192.168.2.0/24
0.0.0.0/0
```

这三条都能匹配 `192.168.2.10`，但：

```text
192.168.2.0/24
```

最具体，因为 `/24` 比 `/16` 和 `/0` 更长。

所以 Router 选择：

```text
192.168.2.0/24
```

### 4.3 记忆句

```text
Longest Prefix Match = 多条 route 都匹配时，选择 prefix 最长、最具体的 route。
```

---

## 5. Forwarding Process（转发过程）

### 5.1 作用

**When a router receives a packet, it checks the destination IP address, looks up the routing table, chooses the matching route, and forwards the packet through the correct outgoing interface to the next hop.**

中文：

当 Router 收到 packet 后，会检查 **destination IP address**，查询 **routing table**，选择匹配的 route，然后通过正确的 **outgoing interface** 把 packet 发给 **next hop**。

### 5.2 转发流程

```text
Router receives packet
↓
Checks destination IP address
↓
Looks up routing table
↓
Uses Longest Prefix Match if needed
↓
Chooses outgoing interface and next hop
↓
Forwards packet
```

---

## 6. How to Create / Update Routing Table

Routing Table 有两种创建 / 更新方式：

### 6.1 Static Routing

**Static routing is manually configured by network administrators.**

中文：

Static Routing 是由 network administrators 手动配置的 routing 方式。

### 6.2 Dynamic Routing

**Dynamic routing is based on routing protocols.**

中文：

Dynamic Routing 基于 routing protocols。

**Routes are learned and updated automatically based on routing protocols.**

中文：

Routes 会根据 routing protocols 自动学习并更新。

---

## 7. Static Routing（静态路由）

### 7.1 意义

**Static routing is manually configured by network administrators.**

中文：

Static Routing 是由 network administrators 手动配置的 routing 方式。

### 7.2 特点

1. **Manually configured**  
   由管理员手动配置。

2. **Administrators need to manually edit the routes if network fails.**  
   如果 network fails，管理员需要手动修改 routes。

3. **Suitable for small scale network with infrequent changes.**  
   适合 small scale network，尤其是网络结构不经常变化的情况。

### 7.3 简单例子

一个小公司只有一条出口连接 ISP：

```text
Company Network → ISP
```

管理员可以手动配置一条 static route：

```text
所有外部流量 → 发送给 ISP 的 router
```

如果网络结构简单、变化不频繁，Static Routing 就比较合适。

---

## 8. Dynamic Routing（动态路由）

### 8.1 意义

**Dynamic routing automatically calculates the best path between two networks and maintains routing information using routing protocols.**

中文：

Dynamic Routing 会自动计算两个 networks 之间的 **best path**，并使用 **routing protocols** 维护 **routing information**。

### 8.2 简单理解

Static Routing 是人工维护：

```text
管理员手动配置 route
```

Dynamic Routing 是自动维护：

```text
routers 通过 routing protocols 交换 routing information
↓
自动计算 best path
↓
自动更新 routing table
```

### 8.3 简单例子

原本路线：

```text
A → B → D
```

如果 `B → D` link down，Dynamic Routing 可以通过 routing protocols 发现该 route 不可用，然后改走：

```text
A → C → D
```

---

## 9. Routing Metrics（路由度量）

### 9.1 Meaning

**Routing metrics are used by routers to determine the best path to a destination.**

中文：

Routing Metrics 是 Router 用来判断 **best path** 的标准。

### 9.2 常见 Routing Metrics

1. **Hop count**  
   跳数，即经过多少个 routers。跳数越少，通常越好。

2. **Theoretical bandwidth and actual throughput**  
   理论带宽：链路理论上能传多少数据。带宽越高，通常越好。  
   实际吞吐量：实际传输速率。它比 bandwidth 更接近真实网络表现。

3. **Delay / latency**  
   延迟，packet 从 source 到 destination 需要的时间。越低越好。

4. **Load**  
   负载，路径当前有多忙。负载越高，越可能拥塞。

5. **MTU**  
   最大传输单元，不需要 fragmentation 的最大 IP packet size。

6. **Routing cost**  
   路由代价，人为或协议计算出来的 route value。cost 越低，通常越优。

7. **Reliability**  
   可靠性，路径是否稳定，是否容易出故障。

8. **Topology**  
   网络拓扑结构。

### 9.3 简单例子

有两条路：

```text
Path 1: A → B → D
hop count = 2

Path 2: A → C → E → D
hop count = 3
```

如果协议使用 **hop count** 作为 metric，比如 RIP，那么会选择 Path 1。

但如果 Path 1 带宽很低、很拥塞，而 Path 2 带宽更高、延迟更低，则某些协议可能选择 Path 2。

所以：

```text
best path 不一定等于 shortest path，它取决于 routing metric。
```

---

## 10. Routing Protocols（路由协议）

### 10.1 意义

**Routing protocols are used by routers to exchange routing information, select paths, and update routing tables.**

中文：

Routing Protocols 由 routers 用于交换 routing information、选择 paths，以及更新 routing tables。

Routing Protocols 是 **Dynamic Routing 的实现工具**。

### 10.2 常见 Routing Protocols

#### RIP

**RIP = Routing Information Protocol**

中文：路由信息协议。

#### OSPF

**OSPF = Open Shortest Path First**

中文：开放式最短路径优先协议。

#### BGP

**BGP = Border Gateway Protocol**

中文：边界网关协议。

主要用于不同自治系统 **Autonomous Systems, AS** 之间。

### 10.3 Routing Protocols 的分类关系

```text
Routing Protocols（动态路由协议）
│
├── Distance Vector 类型
│   └── RIP
│       └── 使用 Distance Vector Algorithm
│           └── 核心思想接近 Bellman-Ford
│
└── Link-State 类型
    └── OSPF
        └── 使用 Link-State Routing Algorithm
            └── 具体算最短路时用 Dijkstra’s Algorithm
```

---

## 11. Distance Vector Algorithm（距离向量算法）

### 11.1 意义

**Each router maintains a distance vector, which records the estimated cost from itself to every destination.**

**Routers exchange distance vectors with their neighbors and update their own routing table using the Bellman-Ford equation.**

中文：

每个 Router 维护一个 **distance vector**，记录自己到各个 **destination** 的估计 **cost**。

Router 会和相邻 routers 交换 **distance vectors**，并使用 **Bellman-Ford equation** 更新自己的 **routing table**。

### 11.2 简单理解

Distance Vector 的核心是：

```text
我不需要知道完整网络地图。
我只需要知道：
1. 我到 neighbor 的 cost
2. neighbor 到 destination 的 cost
```

然后通过计算：

```text
我到 neighbor 的 cost + neighbor 到 destination 的 cost
```

选出 cost 最低的 route。

---

## 12. Routing Table 和 Distance Vector 的区别

### 12.1 Routing Table 记录什么？

Routing Table 记录的是：

```text
去某个 destination network
应该走哪个 next hop
应该从哪个 outgoing interface 发出去
```

也就是：

```text
Routing Table = 实际 forwarding packet 时使用的表
```

### 12.2 Distance Vector 记录什么？

Distance Vector 记录的是：

```text
当前 router 到各个 destination 的 estimated cost / distance
```

也就是：

```text
Distance Vector = 用来计算和更新 Routing Table 的信息
```

### 12.3 对比表

| 概念 | 记录什么 | 用来干什么 |
|---|---|---|
| Routing Table | destination、next hop、outgoing interface | 实际转发 packet |
| Distance Vector | 到各个 destination 的 estimated cost | 计算和更新 routing table |

---

## 13. Bellman-Ford Equation（贝尔曼-福特方程）

### 13.1 公式

\[
d_a(b)=\min_i\{c(a,i)+d_i(b)\}
\]

### 13.2 含义

a 到 b 的最小 cost，等于在所有 neighbor \(i\) 中，选择：

```text
a 到 i 的 cost + i 到 b 的 cost
```

的最小值。

其中：

- \(d_a(b)\)：node \(a\) 到 destination \(b\) 的 least-cost path cost
- \(c(a,i)\)：node \(a\) 到 neighbor \(i\) 的 link cost
- \(d_i(b)\)：neighbor \(i\) 到 destination \(b\) 的 least-cost path cost

### 13.3 简单例子

Router \(A\) 想到 \(D\)，它有两个 neighbors：\(B\) 和 \(C\)。

已知：

```text
c(A,B) = 1
d_B(D) = 3

c(A,C) = 2
d_C(D) = 1
```

那么：

\[
d_A(D)=\min\{c(A,B)+d_B(D), c(A,C)+d_C(D)\}
\]

\[
d_A(D)=\min\{1+3, 2+1\}
\]

\[
d_A(D)=\min\{4, 3\}=3
\]

所以 Router A 会选择经过 C 去 D。

---

## 14. Distance Vector Update Process（Distance Vector 的更新过程）

### 14.1 原文

**When node a receives a new distance vector estimate from a neighbor, it updates its own distance vector using the Bellman-Ford equation.**

**If the neighbor that gives the least cost path is new, node a updates its routing table and distance vector.**

中文：

当 node a 从 neighbor 收到新的 distance vector estimate 后，它会用 Bellman-Ford equation 更新自己的 distance vector。

如果提供 least cost path 的 neighbor 发生变化，node a 就会更新自己的 routing table 和 distance vector。

### 14.2 简单例子

Router A 原本到 D 的 route 是：

```text
A → B → D
cost = 5
```

后来 A 收到 neighbor C 的 distance vector，发现：

```text
A → C → D
cost = 3
```

因为 3 比 5 小，所以 A 更新自己的 routing table：

```text
Destination: D
Next hop: C
Cost: 3
```

---

## 15. Convergence（收敛）

### 15.1 定义

**In routing, convergence means that all routers have updated their routing tables and agree on the correct routes after a network change.**

中文：

在 routing 中，convergence 指的是：

当 network 发生变化后，所有 routers 最终都更新了自己的 routing tables，并对正确路径达成一致。

当所有 routers 都更新完，并且 route 信息稳定下来，这个状态就叫 **Convergence**。

### 15.2 简单例子

如果 C 到 D 的 link down：

```text
A —— B —— C    D
```

一开始只有 C 知道 D 不可达。

之后：

```text
C 告诉 B
↓
B 更新 routing table
↓
B 告诉 A
↓
A 更新 routing table
```

当 A、B、C 都知道 D 不可达，并且 routing tables 都稳定后，就完成了 convergence。

---

## 16. Distance Vector Routing 的优缺点

### 16.1 Advantage：Simpler to configure and maintain than Link State Routing

中文：

比 Link State Routing 更容易配置和维护。

#### 例子

假设网络是：

```text
A —— B —— C
```

Router A 不需要知道完整 topology，只需要问 neighbor B：

```text
你到 C 的 cost 是多少？
```

如果 B 说到 C 的 cost 是 1，A 到 B 的 cost 是 1，那么 A 计算：

```text
A 到 C = 1 + 1 = 2
```

所以 Distance Vector Routing 简单，因为它只依赖 neighbors 的信息。

---

### 16.2 Disadvantage：Slower to converge than Link State Routing

中文：

比 Link State Routing 收敛更慢。

#### 例子

网络如下：

```text
A —— B —— C —— D
```

现在 C 到 D 的 link down：

```text
A —— B —— C    D
```

C 最先知道 D 不可达。

但 A 不会立刻知道，因为 A 只和 B 交换信息。

信息传播过程：

```text
C 知道 D 不可达
↓
C 告诉 B
↓
B 更新后告诉 A
↓
A 才知道 D 不可达
```

所以 Distance Vector Routing 收敛较慢。

---

### 16.3 Disadvantage：Count-to-Infinity Problem

中文：

可能出现 **count-to-infinity problem**。

#### 例子

原本：

```text
A —— B —— C —— D
```

B 到 D 的 route 是：

```text
B → C → D
cost = 2
```

现在 C 到 D 断了：

```text
A —— B —— C    D
```

C 应该知道 D 不可达。

但 C 听到 B 说：

```text
B 到 D cost = 2
```

于是 C 误以为：

```text
我可以通过 B 去 D
```

所以 C 更新为：

```text
C 到 D = 1 + 2 = 3
```

然后 B 又听到 C 说：

```text
C 到 D cost = 3
```

于是 B 更新为：

```text
B 到 D = 1 + 3 = 4
```

然后 C 又变成 5，B 又变成 6：

```text
2 → 3 → 4 → 5 → 6 → ...
```

这就是 **count-to-infinity problem**。

通俗理解：

```text
你：我跟着你走。
他：我其实是跟着你走。
结果两个人绕圈，谁也到不了目的地。
```

---

### 16.4 Disadvantage：Creates more traffic than Link State Routing

中文：

会产生更多 routing update traffic。

#### 例子

Distance Vector Routing 中，routers 需要周期性和 neighbors 交换 distance vector。

假设 Router A 的 distance vector 是：

```text
To Network 1: cost 1
To Network 2: cost 2
To Network 3: cost 3
To Network 4: cost 4
```

它会把这些 routing information 发给 neighbor。

如果网络里有很多 routers，每个 router 都周期性发送 update，就会产生很多额外 traffic。

---

### 16.5 Disadvantage：Larger routing tables in larger networks

中文：

在大型网络中，routing tables 可能更大，也可能造成 WAN links congestion。

#### 例子

小网络中，router 可能只需要记录：

```text
To Network A
To Network B
To Network C
```

但大型网络中，可能要记录：

```text
To Network 1
To Network 2
To Network 3
...
To Network 500
```

如果这些 routing information 还要通过 WAN link 传播，就可能造成 WAN link congestion。

---

## 17. RIP（Routing Information Protocol）

### 17.1 基本定义

**RIP = Routing Information Protocol**

中文：路由信息协议。

RIP 是常见 **IGP**，即 **Interior Gateway Protocol（内部网关协议）**。

**RIP is a distance vector routing protocol.**

中文：

RIP 是一种距离向量路由协议。

### 17.2 特点

1. **Uses Distance Vector Algorithm**  
   使用距离向量算法。

2. **Uses hop count as metric**  
   通常使用 **hop count** 作为 routing metric。

3. **Routers exchange routing information with neighbors**  
   Routers 和 neighbors 交换 routing information。

4. **Updates routing table based on received distance vectors**  
   根据收到的 distance vectors 更新 routing table。

### 17.3 例子

假设网络是：

```text
A —— B —— C
```

每经过一个 router，hop count 加 1。

Router A 想去 C。

A 会问 neighbor B：

```text
你到 C 要几跳？
```

B 说：

```text
我到 C 需要 1 hop。
```

A 自己到 B 是 1 hop，所以：

```text
A 到 C = 1 + 1 = 2 hops
```

于是 A 的 routing table 可以记录：

```text
Destination: C
Next hop: B
Metric: 2 hops
```

这就是 RIP 的基本思路。

---

## 18. AS（Autonomous System，自治系统）

### 18.1 定义

**AS = Autonomous System**

中文：自治系统。

**An AS is generally a contiguous set of routers and networks under one administrative authority.**

中文：

一个 AS 通常是一组连续连接的 routers 和 networks，并且由同一个管理主体控制。

### 18.2 通俗理解

AS 就是同一个组织自己管理的一大片网络，比如：

- 一所大学的校园网
- 一个大公司的内部网络
- 一个 ISP 的网络

### 18.3 例子

如果 XMUM 校园网内部有：

```text
教学楼 network
宿舍 network
图书馆 network
实验室 network
多个 routers
```

并且这些都由 XMUM 的网络管理员统一管理，那么它们可以看成一个 AS。

---

## 19. IGP（Interior Gateway Protocol，内部网关协议）

### 19.1 定义

**IGP = Interior Gateway Protocol**

中文：内部网关协议。

IGP 用在一个 **Autonomous System, AS（自治系统）** 内部。

### 19.2 例子

在一个大学校园网内部使用的 routing protocol，例如：

```text
RIP
OSPF
IS-IS
```

这些都可以属于 IGP。

---

## 20. Link State Routing（链路状态路由）

### 20.1 定义

**Each router broadcasts its link-state information to all other routers.**

**Then every router has a complete view of the network topology and uses Dijkstra’s algorithm to compute the least-cost paths.**

中文：

Link State Routing 中，每个 router 会把自己的 **link-state information** 广播给所有 routers。

所以每个 router 都能知道完整的 **network topology**，然后用 **Dijkstra’s algorithm** 计算 **least-cost path**。

### 20.2 简单例子

假设网络是：

```text
A ——1—— B
|        |
4        2
|        |
C ——1—— D
```

含义：

```text
A-B cost = 1
A-C cost = 4
B-D cost = 2
C-D cost = 1
```

在 Link State Routing 中：

1. A 告诉所有 routers：我连接 B，cost = 1；我连接 C，cost = 4。
2. B 告诉所有 routers：我连接 A，cost = 1；我连接 D，cost = 2。
3. C 和 D 也告诉所有 routers 自己的 link-state information。

最后，每个 router 都知道完整 topology：

```text
A ——1—— B
|        |
4        2
|        |
C ——1—— D
```

如果 A 要去 D，A 自己计算：

```text
Path 1: A → B → D
cost = 1 + 2 = 3

Path 2: A → C → D
cost = 4 + 1 = 5
```

所以 A 选择：

```text
A → B → D
```

---

## 21. Link-State Routing Algorithm（链路状态路由算法）

### 21.1 核心特点

1. **Each node broadcasts link-state packets to all other nodes.**  
   每个 node 把自己的 **link-state packets** 广播给所有其他 nodes。

2. **Network topology and link costs are known to all nodes.**  
   所有 nodes 都知道完整的 **network topology** 和 **link costs**。

3. **All nodes have identical and complete view of network.**  
   所有 nodes 拥有相同且完整的网络视图。

4. **Each node uses Dijkstra’s algorithm to compute least-cost paths.**  
   每个 node 使用 **Dijkstra’s algorithm** 计算 **least-cost paths**。

### 21.2 和 Distance Vector 的区别

| 对比 | Distance Vector | Link State |
|---|---|---|
| 信息来源 | neighbor 告诉我 | 所有 routers 广播 link-state |
| 是否知道完整 topology | 不知道 | 知道 |
| 算法 | Bellman-Ford | Dijkstra |
| 典型协议 | RIP | OSPF |
| 收敛速度 | 较慢 | 通常较快 |

---

## 22. Dijkstra’s Algorithm（Dijkstra 最短路径算法）

### 22.1 作用

**Computes least-cost paths from one source node to all other nodes.**

中文：

Dijkstra’s Algorithm 用来从一个 **source node** 出发，计算到所有其他 nodes 的 **least-cost paths**。

### 22.2 核心思想

每次选择当前 cost 最小、还没有确定的 node，把它加入 **Visited_List**。

**Visited_List**：已经确定 least-cost path 的 nodes 集合。

然后用这个 node 去更新到其他 neighbors 的 cost。

### 22.3 例子

假设网络是：

```text
A ——1—— B ——2—— D
 \       |
  4      1
   \     |
      C
```

已知：

```text
A-B cost = 1
A-C cost = 4
B-C cost = 1
B-D cost = 2
```

现在从 A 开始计算。

#### Initialization

```text
Visited_List = {A}

D(B) = 1
D(C) = 4
D(D) = ∞
```

#### 第 1 轮：选择 B

当前最小的是：

```text
D(B) = 1
```

所以：

```text
Visited_List = {A, B}
```

用 B 更新 C：

```text
A → B → C = 1 + 1 = 2
```

比原来的：

```text
D(C) = 4
```

更小，所以更新：

```text
D(C) = 2
```

用 B 更新 D：

```text
A → B → D = 1 + 2 = 3
```

所以：

```text
D(D) = 3
```

#### 第 2 轮：选择 C

现在：

```text
D(C) = 2
D(D) = 3
```

选择 C：

```text
Visited_List = {A, B, C}
```

C 没有提供更短到 D 的路径，所以 D 不变。

#### 第 3 轮：选择 D

```text
Visited_List = {A, B, C, D}
```

最终结果：

```text
A 到 B: cost = 1，path = A → B
A 到 C: cost = 2，path = A → B → C
A 到 D: cost = 3，path = A → B → D
```

所以 A 的 routing table 可以根据这些结果生成：

```text
Destination: B
Next hop: B
Cost: 1

Destination: C
Next hop: B
Cost: 2

Destination: D
Next hop: B
Cost: 3
```

---

## 23. OSPF（Open Shortest Path First）

### 23.1 基本定义

**OSPF = Open Shortest Path First**

中文：开放式最短路径优先协议。

OSPF 是常见 **IGP**，并且使用 **Link State Algorithm**。

**OSPF is a link-state routing protocol.**

中文：

OSPF 是一种 Link-State Routing Protocol。

### 23.2 特点

1. **OSPF is an IGP.**  
   OSPF 是一种 **Interior Gateway Protocol**，用于 AS 内部。

2. **OSPF uses Link-State Algorithm.**  
   OSPF 使用 **Link-State Algorithm**。

3. **OSPF uses Dijkstra’s Algorithm.**  
   OSPF 使用 **Dijkstra’s Algorithm** 计算 **least-cost paths**。

4. **OSPF builds a complete view of the network topology.**  
   OSPF 会让 routers 获得完整的 **network topology**。

### 23.3 例子

假设公司内部网络是：

```text
A ——1—— B
|        |
4        2
|        |
C ——1—— D
```

在 OSPF 中：

1. A 把自己的 link-state information 告诉其他 routers。
2. B、C、D 也广播自己的 link-state information。
3. 所有 routers 都得到完整 topology。
4. 每个 router 用 Dijkstra’s Algorithm 计算 least-cost paths。

如果 A 要到 D：

```text
Path 1: A → B → D
cost = 1 + 2 = 3

Path 2: A → C → D
cost = 4 + 1 = 5
```

所以 A 选择：

```text
A → B → D
```

A 的 routing table 中可以记录：

```text
Destination: D
Next hop: B
Cost: 3
```

---

## 24. RIP 和 OSPF 对比

| 对比 | RIP | OSPF |
|---|---|---|
| 全称 | Routing Information Protocol | Open Shortest Path First |
| 类型 | Distance Vector Routing Protocol | Link-State Routing Protocol |
| 常见分类 | IGP | IGP |
| 使用算法 | Bellman-Ford 思想 | Dijkstra’s Algorithm |
| Routing Metric | hop count | link cost |
| 是否知道完整 topology | 不知道 | 知道 |
| 收敛速度 | 较慢 | 通常较快 |

---

## 25. 总结

本章核心逻辑：

```text
Network Layer 负责 host-to-host delivery
↓
Router 根据 destination IP 转发 packet
↓
Routing Table 是 Router 做 forwarding decision 的依据
↓
Longest Prefix Match 用来选择最具体的 route
↓
Forwarding Process 是 Router 实际查表转发的过程
↓
Routing Table 可以通过 Static Routing 或 Dynamic Routing 创建 / 更新
↓
Dynamic Routing 依靠 Routing Protocols
↓
Routing Protocols 分为 Distance Vector 和 Link-State 两类
↓
Distance Vector 代表协议是 RIP，核心思想接近 Bellman-Ford
↓
Link-State 代表协议是 OSPF，具体算最短路时用 Dijkstra’s Algorithm
```

最终记忆：

```text
RIP  = Distance Vector + Bellman-Ford 思想 + hop count
OSPF = Link-State + Dijkstra’s Algorithm + link cost
```
