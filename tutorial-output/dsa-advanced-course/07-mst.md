# 第七章：最小生成树（Minimum Spanning Tree）

## 本节知识框架

### 学习目标
- 理解最小生成树的定义及其性质
- 掌握 Prim 算法的核心思想及实现方法
- 掌握 Kruskal 算法的核心思想及并查集的使用
- 能够比较两种算法的适用场景和性能差异
- 理解并查集数据结构的工作原理及优化技巧

### 前置知识
- 图的基本概念（顶点、边、权重、连通图）
- 树的定义及性质（无环连通图）
- 贪心算法的基本思想
- 排序算法的时间复杂度
- 集合的基本操作（并集、查找）

### 复习清单
- [ ] 能否解释什么是最小生成树？
- [ ] 是否理解 MST 的唯一性条件？
- [ ] 能否手动模拟 Prim 算法的执行过程？
- [ ] 能否手动模拟 Kruskal 算法的执行过程？
- [ ] 是否理解并查集的路径压缩和按秩合并优化？
- [ ] 能否比较 Prim 和 Kruskal 的适用场景？

---

## 核心概念定义

| 术语 | 英文 | 定义 |
|------|------|------|
| 生成树 | Spanning Tree | 包含图中所有顶点的树（无环连通子图） |
| 最小生成树 | Minimum Spanning Tree (MST) | 所有生成树中边权重之和最小的那棵 |
| 割 | Cut | 将顶点集划分为两个非空子集的划分 |
| 轻边 | Light Edge | 跨越某个割的所有边中权重最小的边 |
| 并查集 | Union-Find / Disjoint Set | 支持合并集合和查找元素所属集合的数据结构 |
| 森林 | Forest | 由多棵树组成的无环图 |

---

## 原理与运行机制

### 类比理解：城市电缆铺设

想象你是一家电信公司的工程师，需要在 N 个城市之间铺设光纤电缆，使得所有城市都能互相通信，同时**总成本最低**。每个城市是一个**顶点**，两个城市之间可以铺设电缆的路线是一条**边**，铺设成本是**权重**。

**关键约束：**
- 必须连接所有城市（连通性）
- 不能有冗余线路（无环，否则浪费成本）
- 总成本最低（最小权重和）

这正是**最小生成树**问题！

**Prim 算法**就像是从一个城市开始，逐步向外扩展网络。每次都选择与已有网络相连的、成本最低的未连接城市加入网络。这就像从一个中心基站开始，逐步建设分支基站。

**Kruskal 算法**则像是先列出所有可能的电缆路线，按成本从低到高排序，然后依次选择最便宜的路线，只要这条路线不会形成环路就加入网络。这就像先采购最便宜的材料，再检查是否会重复建设。

### Prim 算法原理

Prim 算法由 Robert Prim 于 1957 年提出（Jarník 在 1930 年也独立发现），是一种**贪心算法**。

**核心思想：**
1. 从任意顶点开始，将其加入 MST 集合
2. 维护一个优先队列，存储所有连接 MST 集合与非 MST 集合的边
3. 每次从优先队列中选择权重最小的边，将该边连接的未访问顶点加入 MST
4. 更新优先队列，加入新顶点的所有邻接边
5. 重复步骤 3-4，直到所有顶点都被加入 MST

**与 Dijkstra 的相似性：**
Prim 算法与 Dijkstra 算法在结构上非常相似，都是贪心地扩展已访问集合。区别在于：
- Dijkstra 维护的是**到源点的最短距离**
- Prim 维护的是**到 MST 集合的最小边权重**

### Kruskal 算法原理

Kruskal 算法由 Joseph Kruskal 于 1956 年提出，也是一种**贪心算法**。

**核心思想：**
1. 将所有边按权重从小到大排序
2. 初始化并查集，每个顶点自成一个集合
3. 依次考虑每条边（从最小权重开始）：
   - 如果边的两个端点属于不同集合（不会形成环），则将该边加入 MST，并合并两个集合
   - 否则跳过该边
4. 重复步骤 3，直到选择了 V-1 条边（V 为顶点数）

**为什么不会形成环？**
使用并查集来判断两个顶点是否已经在同一连通分量中。如果在同一分量中添加该边会形成环，因此跳过；如果不在同一分量中，添加该边是安全的。

### 并查集（Union-Find）数据结构

并查集是一种高效处理不相交集合合并及查询问题的数据结构。

**基本操作：**
- `find(x)`：查找元素 x 所属集合的代表元（根节点）
- `union(x, y)`：合并元素 x 和 y 所在的集合

**优化技巧：**
1. **路径压缩（Path Compression）**：在 `find` 操作中，将查找路径上的所有节点直接指向根节点，使树变得扁平
2. **按秩合并（Union by Rank）**：在 `union` 操作中，总是将较矮的树挂到较高的树下，保持树的平衡

经过这两种优化后，并查集的操作时间复杂度接近 O(1)（更精确地说是 O(α(n))，其中 α 是反阿克曼函数，增长极慢）。

---

## 典型应用场景

| 应用场景 | 适用算法 | 说明 |
|----------|----------|------|
| 网络布线优化 | Prim / Kruskal | 连接所有节点的最小成本网络 |
| 电路设计 | Prim | 在芯片上布线的最小长度 |
| 聚类分析 | Kruskal | 层次聚类中的单链接方法 |
| 图像分割 | Kruskal | 基于像素相似度的区域合并 |
| 交通网络规划 | Prim | 建设公路/铁路的最小成本方案 |
| 无线传感器网络 | Prim | 传感器节点的能量高效路由 |

---

## 代码示例

### C++ 实现

#### 并查集数据结构

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;
    
public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) {
            parent[i] = i; // 初始时每个元素自成一个集合
        }
    }
    
    // 查找根节点（带路径压缩）
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // 路径压缩
        }
        return parent[x];
    }
    
    // 合并两个集合（按秩合并）
    bool unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return false; // 已在同一集合
        
        // 按秩合并：将较矮的树挂到较高的树下
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        
        return true;
    }
    
    // 判断两个元素是否在同一集合
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
};
```

#### Prim 算法（使用优先队列）

```cpp
#include <queue>
#include <climits>

struct Edge {
    int to;
    int weight;
};

// Prim 算法实现
int prim(int n, vector<vector<Edge>>& graph) {
    vector<bool> visited(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    int mstWeight = 0;
    int visitedCount = 0;
    
    // 从顶点 0 开始
    pq.push({0, 0});
    
    while (!pq.empty() && visitedCount < n) {
        int weight = pq.top().first;
        int u = pq.top().second;
        pq.pop();
        
        if (visited[u]) continue; // 跳过已访问的顶点
        
        visited[u] = true;
        mstWeight += weight;
        visitedCount++;
        
        // 将所有邻接边加入优先队列
        for (const auto& edge : graph[u]) {
            if (!visited[edge.to]) {
                pq.push({edge.weight, edge.to});
            }
        }
    }
    
    if (visitedCount < n) {
        cout << "图不连通，无法形成生成树！" << endl;
        return -1;
    }
    
    return mstWeight;
}

int main() {
    int n = 5;
    vector<vector<Edge>> graph(n);
    
    // 构建无向图
    graph[0].push_back({1, 2});
    graph[1].push_back({0, 2});
    graph[0].push_back({3, 6});
    graph[3].push_back({0, 6});
    graph[1].push_back({2, 3});
    graph[2].push_back({1, 3});
    graph[1].push_back({3, 8});
    graph[3].push_back({1, 8});
    graph[1].push_back({4, 5});
    graph[4].push_back({1, 5});
    graph[2].push_back({4, 7});
    graph[4].push_back({2, 7});
    graph[3].push_back({4, 9});
    graph[4].push_back({3, 9});
    
    int mstWeight = prim(n, graph);
    cout << "最小生成树的总权重：" << mstWeight << endl;
    
    return 0;
}
```

#### Kruskal 算法

```cpp
struct EdgeKruskal {
    int from;
    int to;
    int weight;
    
    bool operator<(const EdgeKruskal& other) const {
        return weight < other.weight;
    }
};

// Kruskal 算法实现
int kruskal(int n, vector<EdgeKruskal>& edges) {
    // 按权重排序
    sort(edges.begin(), edges.end());
    
    UnionFind uf(n);
    int mstWeight = 0;
    int edgeCount = 0;
    
    for (const auto& edge : edges) {
        // 如果两个端点不在同一集合，则加入 MST
        if (uf.unite(edge.from, edge.to)) {
            mstWeight += edge.weight;
            edgeCount++;
            
            // MST 需要 V-1 条边
            if (edgeCount == n - 1) break;
        }
    }
    
    if (edgeCount < n - 1) {
        cout << "图不连通，无法形成生成树！" << endl;
        return -1;
    }
    
    return mstWeight;
}

int main() {
    int n = 5;
    vector<EdgeKruskal> edges = {
        {0, 1, 2}, {0, 3, 6}, {1, 2, 3},
        {1, 3, 8}, {1, 4, 5}, {2, 4, 7},
        {3, 4, 9}
    };
    
    int mstWeight = kruskal(n, edges);
    cout << "最小生成树的总权重：" << mstWeight << endl;
    
    return 0;
}
```

### Java 实现

#### 并查集数据结构

```java
import java.util.*;

class UnionFind {
    private int[] parent;
    private int[] rank;
    
    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    // 查找根节点（带路径压缩）
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // 路径压缩
        }
        return parent[x];
    }
    
    // 合并两个集合（按秩合并）
    public boolean unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return false;
        
        // 按秩合并
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        
        return true;
    }
    
    // 判断两个元素是否在同一集合
    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}
```

#### Prim 算法

```java
public class PrimAlgorithm {
    
    static class Edge {
        int to;
        int weight;
        
        Edge(int to, int weight) {
            this.to = to;
            this.weight = weight;
        }
    }
    
    public static int prim(int n, List<List<Edge>> graph) {
        boolean[] visited = new boolean[n];
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        
        int mstWeight = 0;
        int visitedCount = 0;
        
        // 从顶点 0 开始
        pq.offer(new int[]{0, 0});
        
        while (!pq.isEmpty() && visitedCount < n) {
            int[] current = pq.poll();
            int weight = current[0];
            int u = current[1];
            
            if (visited[u]) continue;
            
            visited[u] = true;
            mstWeight += weight;
            visitedCount++;
            
            // 将所有邻接边加入优先队列
            for (Edge edge : graph.get(u)) {
                if (!visited[edge.to]) {
                    pq.offer(new int[]{edge.weight, edge.to});
                }
            }
        }
        
        if (visitedCount < n) {
            System.out.println("图不连通，无法形成生成树！");
            return -1;
        }
        
        return mstWeight;
    }
    
    public static void main(String[] args) {
        int n = 5;
        List<List<Edge>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        
        // 构建无向图
        graph.get(0).add(new Edge(1, 2));
        graph.get(1).add(new Edge(0, 2));
        graph.get(0).add(new Edge(3, 6));
        graph.get(3).add(new Edge(0, 6));
        graph.get(1).add(new Edge(2, 3));
        graph.get(2).add(new Edge(1, 3));
        graph.get(1).add(new Edge(3, 8));
        graph.get(3).add(new Edge(1, 8));
        graph.get(1).add(new Edge(4, 5));
        graph.get(4).add(new Edge(1, 5));
        graph.get(2).add(new Edge(4, 7));
        graph.get(4).add(new Edge(2, 7));
        graph.get(3).add(new Edge(4, 9));
        graph.get(4).add(new Edge(3, 9));
        
        int mstWeight = prim(n, graph);
        System.out.println("最小生成树的总权重：" + mstWeight);
    }
}
```

#### Kruskal 算法

```java
public class KruskalAlgorithm {
    
    static class Edge implements Comparable<Edge> {
        int from;
        int to;
        int weight;
        
        Edge(int from, int to, int weight) {
            this.from = from;
            this.to = to;
            this.weight = weight;
        }
        
        @Override
        public int compareTo(Edge other) {
            return Integer.compare(this.weight, other.weight);
        }
    }
    
    public static int kruskal(int n, List<Edge> edges) {
        // 按权重排序
        Collections.sort(edges);
        
        UnionFind uf = new UnionFind(n);
        int mstWeight = 0;
        int edgeCount = 0;
        
        for (Edge edge : edges) {
            // 如果两个端点不在同一集合，则加入 MST
            if (uf.unite(edge.from, edge.to)) {
                mstWeight += edge.weight;
                edgeCount++;
                
                // MST 需要 V-1 条边
                if (edgeCount == n - 1) break;
            }
        }
        
        if (edgeCount < n - 1) {
            System.out.println("图不连通，无法形成生成树！");
            return -1;
        }
        
        return mstWeight;
    }
    
    public static void main(String[] args) {
        int n = 5;
        List<Edge> edges = Arrays.asList(
            new Edge(0, 1, 2), new Edge(0, 3, 6), new Edge(1, 2, 3),
            new Edge(1, 3, 8), new Edge(1, 4, 5), new Edge(2, 4, 7),
            new Edge(3, 4, 9)
        );
        
        int mstWeight = kruskal(n, edges);
        System.out.println("最小生成树的总权重：" + mstWeight);
    }
}
```

---

## 复杂度或性能分析

| 算法 | 时间复杂度 | 空间复杂度 | 适用场景 | 优点 | 缺点 |
|------|------------|------------|----------|------|------|
| Prim（朴素版） | O(V²) | O(V) | 稠密图 | 实现简单 | 效率较低 |
| Prim（堆优化） | O(E log V) | O(V + E) | 稀疏图 | 效率高 | 需要优先队列 |
| Kruskal | O(E log E) | O(V + E) | 稀疏图 | 代码简洁，易于并行 | 需要排序所有边 |

**说明：** 
- V 表示顶点数，E 表示边数
- Kruskal 的时间复杂度主要来自排序：O(E log E)，由于 E ≤ V²，所以 O(E log E) = O(E log V)
- 对于稠密图（E ≈ V²），Prim 的 O(V²) 可能优于 Kruskal 的 O(E log V)
- 对于稀疏图（E ≈ V），两者效率相近，Kruskal 实现更简单

---

## 常见误区与易错点

| 误区 | 正确理解 | 示例说明 |
|------|----------|----------|
| MST 一定唯一 | 只有当所有边权重不同时，MST 才唯一 | 若存在权重相同的边，可能有多个 MST |
| Prim 和 Kruskal 结果一定相同 | 它们得到的 MST 总权重相同，但具体边可能不同 | 当存在多条权重相同的边时 |
| 并查集不需要优化 | 不加优化的并查集在最坏情况下退化为链表 | 必须使用路径压缩和按秩合并 |
| Prim 可以从任意顶点开始 | 是的，但通常从顶点 0 开始便于实现 | 起始顶点不影响最终结果 |
| Kruskal 需要检查连通性 | 是的，如果边数不足 V-1，说明图不连通 | 应在算法结束后验证 edgeCount == V-1 |

---

## 与其他知识点的关系

- **与贪心算法的关系**：Prim 和 Kruskal 都是贪心策略的经典应用，每一步都选择当前最优的边。
- **与并查集的关系**：Kruskal 算法依赖并查集来高效判断两个顶点是否在同一连通分量中。
- **与优先队列的关系**：Prim 算法的效率提升依赖于优先队列（最小堆）的高效实现。
- **与最短路径的关系**：Prim 算法与 Dijkstra 算法在结构上非常相似，都是贪心地扩展已访问集合。
- **与图遍历的关系**：MST 可以通过 BFS 或 DFS 遍历得到，但需要保证选择的边权重最小。

---

## 自测题与参考答案

### 题目 1
**问：** 在一个有 5 个顶点的完全图中，最多有多少条边？如果使用 Kruskal 算法求 MST，需要进行多少次并查集操作？

**答：** 
- 完全图的边数为 C(5,2) = 10 条边
- Kruskal 算法需要对每条边进行 2 次 `find` 操作（判断两个端点是否在同一集合），最多进行 1 次 `union` 操作（如果边被选中）
- 总共需要处理的边数为 10 条，MST 需要 4 条边（V-1 = 5-1 = 4）
- 并查集操作次数：至少 20 次 `find`（每条边 2 次），最多 4 次 `union`

### 题目 2
**问：** 为什么 Prim 算法和 Kruskal 算法都能保证得到最小生成树？请简要说明它们的正确性证明思路。

**答：** 
- **Prim 算法的正确性**基于**割性质**：对于任意割，跨越该割的最小权重边一定在某个 MST 中。Prim 算法每一步都选择连接已访问集合和未访问集合的最小权重边，符合割性质。
- **Kruskal 算法的正确性**基于**环性质**：对于任意环，环上最大权重的边一定不在任何 MST 中。Kruskal 算法按权重从小到大选择边，跳过会形成环的边，保证了不会选择环上的最大权重边。

### 题目 3
**问：** 如果一个图有 1000 个顶点和 50000 条边，应该选择 Prim 算法还是 Kruskal 算法？为什么？

**答：** 
- 这是一个**稀疏图**（E = 50V，远小于 V² = 10⁶）
- Prim（堆优化）的时间复杂度：O(E log V) = O(50000 × 10) ≈ O(500000)
- Kruskal 的时间复杂度：O(E log E) = O(50000 × 16) ≈ O(800000)
- 两者效率相近，但 Kruskal 实现更简单，代码更易维护
- **推荐选择 Kruskal**，除非对性能有极致要求且图非常稠密

---

## 考点精讲

### 考点 1：Prim 算法的手动模拟
考试中常要求手动模拟 Prim 算法的执行过程，包括：
- 初始化距离数组（到 MST 集合的最小边权重）
- 每轮选择权重最小的边
- 更新邻接顶点的距离
- 记录最终的 MST

**解题技巧：** 用表格记录每轮迭代的状态变化，清晰展示 `key[]` 数组的更新过程。

### 考点 2：Kruskal 算法与并查集的结合
理解 Kruskal 算法如何使用并查集来判断是否形成环：
- 对边按权重排序
- 依次考虑每条边，使用 `find` 判断端点是否在同一集合
- 使用 `union` 合并集合

**解题技巧：** 注意并查集的路径压缩和按秩合并优化，这在手写代码时容易遗漏。

### 考点 3：算法选择与复杂度分析
根据题目条件（顶点数、边数、稠密/稀疏）选择合适的算法，并分析时间复杂度。

**解题技巧：** 
- 稠密图（E ≈ V²）→ Prim（朴素版 O(V²)）
- 稀疏图（E ≈ V）→ Kruskal 或 Prim（堆优化）
- 需要输出具体边 → Kruskal 更直观
- 只需要总权重 → 两者均可

---

## 术语速查

| 中文术语 | 英文术语 | 简要说明 |
|----------|----------|----------|
| 最小生成树 | Minimum Spanning Tree | 权重和最小的生成树 |
| 并查集 | Union-Find | 支持合并和查找的数据结构 |
| 路径压缩 | Path Compression | 并查集优化技巧 |
| 按秩合并 | Union by Rank | 并查集优化技巧 |
| 割性质 | Cut Property | MST 的理论基础之一 |
| 环性质 | Cycle Property | MST 的理论基础之一 |

---

## 参考资料与复核

1. 《算法导论》（Introduction to Algorithms）第 23 章 - Thomas H. Cormen 等
2. 《算法》（Algorithms）第 4 版 - Robert Sedgewick & Kevin Wayne
3. GeeksforGeeks: Prim's Algorithm - https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/
4. GeeksforGeeks: Kruskal's Algorithm - https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/
5. Visualgo 可视化演示：https://visualgo.net/en/mst

**复核日期：** 2026-10-19  
**作者：** DSA Advanced Course Team  
**版本：** 1.0
