# 第六章：最短路径算法（Shortest Path Algorithms）

## 本节知识框架

### 学习目标
- 理解最短路径问题的定义及其在现实生活中的应用
- 掌握 Dijkstra 算法的核心思想、实现细节及适用条件
- 掌握 Floyd-Warshall 算法的动态规划思路及全源最短路径计算
- 能够根据实际问题选择合适的最短路径算法
- 理解优先队列在 Dijkstra 算法中的关键作用

### 前置知识
- 图的基本概念（顶点、边、权重、有向图/无向图）
- 邻接矩阵与邻接表的存储结构
- 贪心算法的基本思想
- 动态规划的基本思想
- 优先队列（堆）的基本操作

### 复习清单
- [ ] 能否解释什么是"最短路径"问题？
- [ ] 是否理解 Dijkstra 算法为什么不能处理负权边？
- [ ] 能否手动模拟 Dijkstra 算法的执行过程？
- [ ] 是否理解 Floyd-Warshall 算法中三重循环的含义？
- [ ] 能否比较两种算法的时间复杂度和适用场景？

---

## 核心概念定义

| 术语 | 英文 | 定义 |
|------|------|------|
| 最短路径 | Shortest Path | 图中两个顶点之间权重之和最小的路径 |
| 单源最短路径 | Single-Source Shortest Path | 从一个源点到图中所有其他顶点的最短路径 |
| 全源最短路径 | All-Pairs Shortest Path | 图中任意两个顶点之间的最短路径 |
| 松弛操作 | Relaxation | 尝试通过中间节点更新两点间距离的操作 |
| 负权边 | Negative Weight Edge | 权重为负数的边，可能导致最短路径不存在 |
| 贪心策略 | Greedy Strategy | 每一步都选择当前最优解的策略 |

---

## 原理与运行机制

### 类比理解：GPS 导航系统

想象你正在使用 GPS 导航从家到公司。地图上的每个路口是一个**顶点**，每条道路是一条**边**，道路的行驶时间或距离就是**权重**。你的目标是找到**最快**或**最短**的路线。

**Dijkstra 算法**就像是一个谨慎的探险家：他从起点出发，每次都选择当前已知最近的未访问路口进行探索，并不断更新到其他路口的最短距离。一旦某个路口被标记为"已确定最短距离"，就不再改变。这就像 GPS 逐步确认最佳路线的过程。

**Floyd-Warshall 算法**则像是一个全局规划师：它考虑所有可能的中间路口，逐步优化任意两点之间的距离。它不关心从哪个点出发，而是同时计算所有点对之间的最短路径。

### Dijkstra 算法原理

Dijkstra 算法由荷兰计算机科学家 Edsger Dijkstra 于 1956 年提出，是一种经典的**贪心算法**。

**核心思想：**
1. 维护一个距离数组 `dist[]`，记录从源点到各顶点的当前最短距离
2. 维护一个集合 `S`，包含已确定最短距离的顶点
3. 每次从尚未确定的顶点中选择距离最小的顶点 `u`，加入集合 `S`
4. 对 `u` 的所有邻接顶点 `v` 进行**松弛操作**：如果 `dist[u] + weight(u,v) < dist[v]`，则更新 `dist[v]`
5. 重复步骤 3-4，直到所有顶点都被处理

**为什么不能处理负权边？**
因为 Dijkstra 算法基于贪心策略，一旦顶点被标记为"已确定"，就不再重新检查。如果存在负权边，后续可能出现更短的路径，但算法已经错过了这个机会。

### Floyd-Warshall 算法原理

Floyd-Warshall 算法由 Robert Floyd 和 Stephen Warshall 分别独立提出，是一种基于**动态规划**的全源最短路径算法。

**核心思想：**
1. 初始化距离矩阵 `dist[i][j]` 为边的权重（无边则为无穷大）
2. 依次考虑每个顶点 `k` 作为中间节点
3. 对于每对顶点 `(i, j)`，检查是否通过 `k` 可以得到更短的路径：`dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`
4. 遍历完所有中间节点后，`dist[i][j]` 即为 `i` 到 `j` 的最短距离

**动态规划状态转移方程：**
```
dist[k][i][j] = min(dist[k-1][i][j], dist[k-1][i][k] + dist[k-1][k][j])
```
其中 `dist[k][i][j]` 表示只允许使用前 `k` 个顶点作为中间节点时，`i` 到 `j` 的最短距离。

---

## 典型应用场景

| 应用场景 | 适用算法 | 说明 |
|----------|----------|------|
| GPS 导航系统 | Dijkstra / A* | 寻找两点间最快路线，通常使用改进的 Dijkstra 或 A* 算法 |
| 网络路由协议 | Dijkstra | OSPF 等路由协议使用 Dijkstra 计算最短路径树 |
| 社交网络分析 | Floyd-Warshall | 计算任意两人之间的最短关系链（六度分隔理论） |
| 航班票价优化 | Floyd-Warshall | 计算任意两个城市之间的最低转机成本 |
| 游戏 AI 寻路 | Dijkstra / A* | NPC 寻找到达目标的最短路径 |
| 物流配送优化 | Dijkstra | 计算配送中心到各个客户点的最短路径 |

---

## 代码示例

### C++ 实现

#### Dijkstra 算法（使用优先队列）

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

// 定义边结构
struct Edge {
    int to;
    int weight;
};

// Dijkstra 算法实现
void dijkstra(int n, vector<vector<Edge>>& graph, int source, vector<int>& dist) {
    // 初始化距离数组
    dist.assign(n, INT_MAX);
    dist[source] = 0;
    
    // 优先队列（最小堆），存储 (距离, 顶点)
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, source});
    
    while (!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();
        
        // 如果当前距离大于已记录的最短距离，跳过
        if (d > dist[u]) continue;
        
        // 遍历所有邻接边
        for (const auto& edge : graph[u]) {
            int v = edge.to;
            int w = edge.weight;
            
            // 松弛操作
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}

int main() {
    int n = 5; // 顶点数
    vector<vector<Edge>> graph(n);
    
    // 构建图：添加边
    graph[0].push_back({1, 10});
    graph[0].push_back({3, 5});
    graph[1].push_back({2, 1});
    graph[1].push_back({3, 2});
    graph[2].push_back({4, 4});
    graph[3].push_back({1, 3});
    graph[3].push_back({2, 9});
    graph[3].push_back({4, 2});
    graph[4].push_back({2, 6});
    
    vector<int> dist;
    dijkstra(n, graph, 0, dist);
    
    cout << "从顶点 0 到各顶点的最短距离：" << endl;
    for (int i = 0; i < n; i++) {
        if (dist[i] == INT_MAX) {
            cout << "顶点 " << i << ": 不可达" << endl;
        } else {
            cout << "顶点 " << i << ": " << dist[i] << endl;
        }
    }
    
    return 0;
}
```

#### Floyd-Warshall 算法

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

const int INF = INT_MAX / 2; // 避免溢出

// Floyd-Warshall 算法实现
void floydWarshall(int n, vector<vector<int>>& dist) {
    // 三重循环：k 为中间节点，i 为起点，j 为终点
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
}

int main() {
    int n = 4;
    vector<vector<int>> dist = {
        {0, 5, INF, 10},
        {INF, 0, 3, INF},
        {INF, INF, 0, 1},
        {INF, INF, INF, 0}
    };
    
    floydWarshall(n, dist);
    
    cout << "所有点对之间的最短距离：" << endl;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (dist[i][j] == INF) {
                cout << "INF\t";
            } else {
                cout << dist[i][j] << "\t";
            }
        }
        cout << endl;
    }
    
    return 0;
}
```

### Java 实现

#### Dijkstra 算法（使用优先队列）

```java
import java.util.*;

public class DijkstraAlgorithm {
    
    static class Edge {
        int to;
        int weight;
        
        Edge(int to, int weight) {
            this.to = to;
            this.weight = weight;
        }
    }
    
    public static int[] dijkstra(int n, List<List<Edge>> graph, int source) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;
        
        // 优先队列（最小堆），按距离排序
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{0, source});
        
        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int d = current[0];
            int u = current[1];
            
            // 如果当前距离大于已记录的最短距离，跳过
            if (d > dist[u]) continue;
            
            // 遍历所有邻接边
            for (Edge edge : graph.get(u)) {
                int v = edge.to;
                int w = edge.weight;
                
                // 松弛操作
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.offer(new int[]{dist[v], v});
                }
            }
        }
        
        return dist;
    }
    
    public static void main(String[] args) {
        int n = 5;
        List<List<Edge>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        
        // 构建图
        graph.get(0).add(new Edge(1, 10));
        graph.get(0).add(new Edge(3, 5));
        graph.get(1).add(new Edge(2, 1));
        graph.get(1).add(new Edge(3, 2));
        graph.get(2).add(new Edge(4, 4));
        graph.get(3).add(new Edge(1, 3));
        graph.get(3).add(new Edge(2, 9));
        graph.get(3).add(new Edge(4, 2));
        graph.get(4).add(new Edge(2, 6));
        
        int[] dist = dijkstra(n, graph, 0);
        
        System.out.println("从顶点 0 到各顶点的最短距离：");
        for (int i = 0; i < n; i++) {
            if (dist[i] == Integer.MAX_VALUE) {
                System.out.println("顶点 " + i + ": 不可达");
            } else {
                System.out.println("顶点 " + i + ": " + dist[i]);
            }
        }
    }
}
```

#### Floyd-Warshall 算法

```java
public class FloydWarshallAlgorithm {
    
    private static final int INF = Integer.MAX_VALUE / 2;
    
    public static void floydWarshall(int n, int[][] dist) {
        // 三重循环：k 为中间节点，i 为起点，j 为终点
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
    }
    
    public static void main(String[] args) {
        int n = 4;
        int[][] dist = {
            {0, 5, INF, 10},
            {INF, 0, 3, INF},
            {INF, INF, 0, 1},
            {INF, INF, INF, 0}
        };
        
        floydWarshall(n, dist);
        
        System.out.println("所有点对之间的最短距离：");
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][j] == INF) {
                    System.out.print("INF\t");
                } else {
                    System.out.print(dist[i][j] + "\t");
                }
            }
            System.out.println();
        }
    }
}
```

---

## 复杂度或性能分析

| 算法 | 时间复杂度 | 空间复杂度 | 适用条件 | 优点 | 缺点 |
|------|------------|------------|----------|------|------|
| Dijkstra（朴素版） | O(V²) | O(V) | 非负权边 | 实现简单 | 效率较低 |
| Dijkstra（堆优化） | O((V+E)logV) | O(V+E) | 非负权边 | 效率高，适合稀疏图 | 不能处理负权边 |
| Floyd-Warshall | O(V³) | O(V²) | 无负权环 | 代码简洁，可求全源最短路径 | 时间复杂度高，不适合大规模图 |

**说明：** V 表示顶点数，E 表示边数。

---

## 常见误区与易错点

| 误区 | 正确理解 | 示例说明 |
|------|----------|----------|
| Dijkstra 可以处理负权边 | Dijkstra 不能处理负权边，应使用 Bellman-Ford 算法 | 若存在负权边，Dijkstra 可能给出错误结果 |
| Floyd-Warshall 只能用于有向图 | Floyd-Warshall 同样适用于无向图 | 无向图的邻接矩阵是对称的 |
| 优先队列中不需要去重判断 | 需要判断 `d > dist[u]` 来跳过过时条目 | 同一顶点可能被多次加入队列 |
| Floyd-Warshall 的三重循环顺序可以随意交换 | 外层必须是中间节点 k，内层是 i 和 j | 交换顺序会破坏动态规划的正确性 |
| 最短路径一定唯一 | 最短路径可能有多条 | 算法只求出一个最短距离，不保证路径唯一 |

---

## 与其他知识点的关系

- **与贪心算法的关系**：Dijkstra 算法是贪心策略的经典应用，每一步都选择当前最优的顶点。
- **与动态规划的关系**：Floyd-Warshall 算法是动态规划的典型例子，通过子问题的最优解构建全局最优解。
- **与优先队列的关系**：Dijkstra 算法的效率提升依赖于优先队列（最小堆）的高效实现。
- **与图遍历的关系**：最短路径算法可以看作是带权重的广度优先搜索（BFS）的扩展。
- **与最小生成树的关系**：Prim 算法与 Dijkstra 算法在结构上非常相似，都是贪心地扩展已访问集合。

---

## 自测题与参考答案

### 题目 1
**问：** 为什么 Dijkstra 算法不能处理含有负权边的图？请举例说明。

**答：** Dijkstra 算法基于贪心策略，一旦某个顶点被标记为"已确定最短距离"，就不会再重新检查该顶点。如果存在负权边，后续可能通过负权边得到更短的路径，但算法已经错过了这个机会。例如：图中有边 A→B（权重 5）、A→C（权重 2）、C→B（权重 -4）。Dijkstra 会先确定 B 的距离为 5，但实际上通过 C 的路径距离为 2+(-4)=-2，更短。

### 题目 2
**问：** Floyd-Warshall 算法中，为什么外层循环必须是中间节点 k，而不能是起点 i 或终点 j？

**答：** Floyd-Warshall 算法的动态规划状态定义为：`dist[k][i][j]` 表示只允许使用前 k 个顶点作为中间节点时，i 到 j 的最短距离。外层循环枚举 k 是为了逐步扩大允许的中间节点范围。如果交换循环顺序，就无法保证在计算 `dist[i][j]` 时，`dist[i][k]` 和 `dist[k][j]` 已经是考虑了前 k-1 个中间节点的最优解，从而破坏动态规划的正确性。

### 题目 3
**问：** 在一个有 1000 个顶点、5000 条边的稀疏图中，应该选择 Dijkstra 算法还是 Floyd-Warshall 算法来计算单源最短路径？为什么？

**答：** 应该选择 Dijkstra 算法（堆优化版本）。原因如下：
1. 题目要求的是**单源**最短路径，Dijkstra 正是为此设计的
2. 图是**稀疏图**（E ≈ 5V），Dijkstra 堆优化版本的时间复杂度为 O((V+E)logV) ≈ O(6000×10) = O(60000)，而 Floyd-Warshall 的时间复杂度为 O(V³) = O(10⁹)，差距巨大
3. Floyd-Warshall 的优势在于计算**全源**最短路径，对于单源问题效率太低

---

## 考点精讲

### 考点 1：Dijkstra 算法的手动模拟
考试中常要求手动模拟 Dijkstra 算法的执行过程，包括：
- 初始化距离数组
- 每轮选择距离最小的未访问顶点
- 执行松弛操作并更新距离
- 记录最终的 shortest path tree

**解题技巧：** 用表格记录每轮迭代的状态变化，清晰展示 `dist[]` 数组的更新过程。

### 考点 2：Floyd-Warshall 算法的状态转移
理解并能够写出 Floyd-Warshall 的状态转移方程：
```
dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```
**解题技巧：** 注意三重循环的顺序，外层是 k（中间节点），内层是 i 和 j。

### 考点 3：算法选择与复杂度分析
根据题目条件（顶点数、边数、是否有负权边、单源还是全源）选择合适的算法，并分析时间复杂度。

**解题技巧：** 
- 非负权边 + 单源 → Dijkstra
- 有负权边 + 单源 → Bellman-Ford
- 全源最短路径 → Floyd-Warshall
- 稀疏图优先使用堆优化的 Dijkstra

---

## 术语速查

| 中文术语 | 英文术语 | 简要说明 |
|----------|----------|----------|
| 松弛操作 | Relaxation | 尝试通过中间节点更新最短距离 |
| 优先队列 | Priority Queue | 支持高效提取最小元素的数据结构 |
| 贪心策略 | Greedy Strategy | 每一步选择当前最优解 |
| 动态规划 | Dynamic Programming | 通过子问题最优解构建全局最优解 |
| 邻接表 | Adjacency List | 图的存储结构之一，适合稀疏图 |
| 负权环 | Negative Cycle | 总权重为负的环路，导致最短路径不存在 |

---

## 参考资料与复核

1. 《算法导论》（Introduction to Algorithms）第 24-25 章 - Thomas H. Cormen 等
2. 《算法》（Algorithms）第 4 版 - Robert Sedgewick & Kevin Wayne
3. GeeksforGeeks: Dijkstra's Algorithm - https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/
4. GeeksforGeeks: Floyd Warshall Algorithm - https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/
5. Visualgo 可视化演示：https://visualgo.net/en/sssp

**复核日期：** 2026-10-19  
**作者：** DSA Advanced Course Team  
**版本：** 1.0
