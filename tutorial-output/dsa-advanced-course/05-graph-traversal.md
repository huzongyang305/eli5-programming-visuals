# 第 5 章：图的基本表示与遍历

## 本节知识框架

**学习目标**：
- 掌握图的两种存储方式（邻接矩阵、邻接表）
- 实现深度优先搜索（DFS）和广度优先搜索（BFS）
- 理解图的连通性概念
- 能够判断图中是否存在环

**前置知识**：
- 数组和链表的操作
- 栈和队列的使用
- 递归的执行过程

**复习清单**：
- [ ] 能画出邻接表和邻接矩阵的结构
- [ ] 能手动模拟 DFS 和 BFS 的遍历顺序
- [ ] 能解释 visited 数组的作用

---

## 核心概念定义

| 术语 | 一句话说明 |
|------|----------|
| **图（Graph）** | 由顶点（Vertex）和边（Edge）组成的数据结构，记为 G=(V,E) |
| **有向图** | 边有方向，如网页链接 A→B |
| **无向图** | 边无方向，如好友关系 A-B |
| **加权图** | 边有权重，如城市间距离 |
| **邻接矩阵** | 用二维数组表示顶点间的连接关系 |
| **邻接表** | 用数组+链表表示每个顶点的邻居列表 |
| **度（Degree）** | 无向图中顶点的边数；有向图分为入度和出度 |
| **连通图** | 任意两个顶点之间都有路径可达 |
| **环（Cycle）** | 从某顶点出发能回到自身的路径 |

---

## 原理与运行机制

### 图的存储方式对比

**类比**：社交网络的好友关系

```
图结构:
    0 --- 1 --- 2
    |     |
    3     4

邻接矩阵（适合稠密图）:
    0  1  2  3  4
0 [ 0  1  0  1  0 ]
1 [ 1  0  1  0  1 ]
2 [ 0  1  0  0  0 ]
3 [ 1  0  0  0  0 ]
4 [ 0  1  0  0  0 ]

邻接表（适合稀疏图）:
0 → [1, 3]
1 → [0, 2, 4]
2 → [1]
3 → [0]
4 → [1]
```

| 对比维度 | 邻接矩阵 | 邻接表 |
|---------|---------|--------|
| 空间复杂度 | O(V²) | O(V+E) |
| 查询两点是否相连 | O(1) | O(degree) |
| 遍历某点的所有邻居 | O(V) | O(degree) |
| 适合场景 | 稠密图（E ≈ V²） | 稀疏图（E << V²） |

### DFS vs BFS

**类比**：迷宫探索
- **DFS**：一条路走到黑，撞墙再回溯（用栈或递归）
- **BFS**：从起点向外一圈圈扩展（用队列）

```
DFS 遍历顺序: 0 → 1 → 2 → 4 → 3  （深入优先）
BFS 遍历顺序: 0 → 1 → 3 → 2 → 4  （逐层扩展）
```

---

## 典型应用场景

| 场景 | 使用的算法 | 说明 |
|------|-----------|------|
| 社交网络好友推荐 | BFS | 找二度好友（朋友的朋友） |
| 地图导航 | BFS/Dijkstra | 找最短路径 |
| 拓扑排序 | DFS | 课程先修关系、任务依赖 |
| 检测环路 | DFS | 判断是否有循环依赖 |
| 连通分量统计 | DFS/BFS | 社交网络中的孤立群体 |

---

## 代码示例

### C++ 实现

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <stack>
using namespace std;

class Graph {
private:
    int V;  // 顶点数
    vector<vector<int>> adjList;  // 邻接表

public:
    Graph(int vertices) : V(vertices) {
        adjList.resize(V);
    }

    // 添加无向边
    void addEdge(int u, int v) {
        adjList[u].push_back(v);
        adjList[v].push_back(u);
    }

    // DFS（递归实现）
    void DFSUtil(int v, vector<bool>& visited) {
        visited[v] = true;
        cout << v << " ";
        
        for (int neighbor : adjList[v]) {
            if (!visited[neighbor]) {
                DFSUtil(neighbor, visited);
            }
        }
    }

    void DFS(int start) {
        vector<bool> visited(V, false);
        cout << "DFS: ";
        DFSUtil(start, visited);
        cout << endl;
    }

    // BFS（迭代实现）
    void BFS(int start) {
        vector<bool> visited(V, false);
        queue<int> q;
        
        visited[start] = true;
        q.push(start);
        
        cout << "BFS: ";
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            cout << v << " ";
            
            for (int neighbor : adjList[v]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        cout << endl;
    }

    // 检测图中是否有环（无向图）
    bool hasCycleUtil(int v, int parent, vector<bool>& visited) {
        visited[v] = true;
        
        for (int neighbor : adjList[v]) {
            if (!visited[neighbor]) {
                if (hasCycleUtil(neighbor, v, visited))
                    return true;
            } else if (neighbor != parent) {
                return true;  // 找到回边，存在环
            }
        }
        return false;
    }

    bool hasCycle() {
        vector<bool> visited(V, false);
        for (int i = 0; i < V; i++) {
            if (!visited[i]) {
                if (hasCycleUtil(i, -1, visited))
                    return true;
            }
        }
        return false;
    }

    // 打印邻接表
    void printGraph() {
        for (int i = 0; i < V; i++) {
            cout << i << " → ";
            for (int neighbor : adjList[i]) {
                cout << neighbor << " ";
            }
            cout << endl;
        }
    }
};

int main() {
    Graph g(5);
    g.addEdge(0, 1);
    g.addEdge(0, 3);
    g.addEdge(1, 2);
    g.addEdge(1, 4);
    
    cout << "邻接表:" << endl;
    g.printGraph();
    
    g.DFS(0);   // 输出: DFS: 0 1 2 4 3
    g.BFS(0);   // 输出: BFS: 0 1 3 2 4
    
    cout << "是否有环: " << (g.hasCycle() ? "是" : "否") << endl;
    
    return 0;
}
```

### Java 实现

```java
import java.util.*;

public class Graph {
    private int V;
    private List<List<Integer>> adjList;

    public Graph(int vertices) {
        this.V = vertices;
        this.adjList = new ArrayList<>();
        for (int i = 0; i < V; i++) {
            adjList.add(new ArrayList<>());
        }
    }

    public void addEdge(int u, int v) {
        adjList.get(u).add(v);
        adjList.get(v).add(u);
    }

    private void DFSUtil(int v, boolean[] visited) {
        visited[v] = true;
        System.out.print(v + " ");
        
        for (int neighbor : adjList.get(v)) {
            if (!visited[neighbor]) {
                DFSUtil(neighbor, visited);
            }
        }
    }

    public void DFS(int start) {
        boolean[] visited = new boolean[V];
        System.out.print("DFS: ");
        DFSUtil(start, visited);
        System.out.println();
    }

    public void BFS(int start) {
        boolean[] visited = new boolean[V];
        Queue<Integer> queue = new LinkedList<>();
        
        visited[start] = true;
        queue.offer(start);
        
        System.out.print("BFS: ");
        while (!queue.isEmpty()) {
            int v = queue.poll();
            System.out.print(v + " ");
            
            for (int neighbor : adjList.get(v)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
        System.out.println();
    }

    private boolean hasCycleUtil(int v, int parent, boolean[] visited) {
        visited[v] = true;
        
        for (int neighbor : adjList.get(v)) {
            if (!visited[neighbor]) {
                if (hasCycleUtil(neighbor, v, visited))
                    return true;
            } else if (neighbor != parent) {
                return true;
            }
        }
        return false;
    }

    public boolean hasCycle() {
        boolean[] visited = new boolean[V];
        for (int i = 0; i < V; i++) {
            if (!visited[i]) {
                if (hasCycleUtil(i, -1, visited))
                    return true;
            }
        }
        return false;
    }

    public void printGraph() {
        for (int i = 0; i < V; i++) {
            System.out.print(i + " → ");
            for (int neighbor : adjList.get(i)) {
                System.out.print(neighbor + " ");
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        Graph g = new Graph(5);
        g.addEdge(0, 1);
        g.addEdge(0, 3);
        g.addEdge(1, 2);
        g.addEdge(1, 4);
        
        System.out.println("邻接表:");
        g.printGraph();
        
        g.DFS(0);   // 输出: DFS: 0 1 2 4 3
        g.BFS(0);   // 输出: BFS: 0 1 3 2 4
        
        System.out.println("是否有环: " + (g.hasCycle() ? "是" : "否"));
    }
}
```

---

## 复杂度或性能分析

| 操作 | 邻接矩阵 | 邻接表 |
|------|---------|--------|
| 添加边 | O(1) | O(1) |
| 删除边 | O(1) | O(degree) |
| 查询两点是否相连 | O(1) | O(degree) |
| DFS/BFS 遍历 | O(V²) | O(V+E) |
| 空间占用 | O(V²) | O(V+E) |

**推荐**：大多数实际图都是稀疏的（E << V²），优先使用邻接表。

---

## 常见误区与易错点

| 错误 | 现象 | 修法 |
|------|------|------|
| DFS 未标记 visited | 死循环或重复访问 | 进入节点时立即标记 `visited[v] = true` |
| BFS 用栈代替队列 | 变成 DFS | BFS 必须用队列（FIFO） |
| 有向图环检测未记录父节点 | 误判双向边为环 | 无向图需排除父节点：`if (neighbor != parent)` |
| 非连通图只从一个起点遍历 | 遗漏部分顶点 | 遍历所有未访问的顶点作为起点 |

---

## 与其他知识点的关系

- **后续章节**：最短路径算法基于 BFS，拓扑排序基于 DFS
- **关联知识**：树的遍历是图遍历的特例（无环连通图）
- **实际应用**：社交网络、网页链接、交通路网

---

## 自测题与参考答案

**Q1**: 对于稀疏图，应该使用哪种存储方式？  
A. 邻接矩阵  
B. 邻接表  
C. 边列表  
D. 关联矩阵  

**答案**: B  
**解释**: 稀疏图中 E << V²，邻接表空间复杂度 O(V+E) 远小于邻接矩阵的 O(V²)。

**Q2**: BFS 需要使用哪种数据结构？  
A. 栈  
B. 队列  
C. 优先队列  
D. 哈希表  

**答案**: B  
**解释**: BFS 需要先进先出（FIFO）保证逐层扩展，队列满足这一要求。

**Q3**: 如何判断无向图中是否存在环？  
A. 统计边数是否大于顶点数  
B. DFS 时检查是否访问到已访问的非父节点  
C. 计算所有顶点的度  
D. 检查图是否连通  

**答案**: B  
**解释**: DFS 过程中如果遇到已访问的邻居且该邻居不是父节点，说明存在回边，即存在环。

---

## 考点精讲

**"DFS 和 BFS 的区别是什么？"**  
答：DFS 使用栈（或递归），沿着一条路径深入到底再回溯，适合找连通分量、检测环、拓扑排序；BFS 使用队列，从起点逐层向外扩展，适合找无权图的最短路径、层次遍历。时间复杂度都是 O(V+E)。

**"为什么图的遍历需要 visited 数组？"**  
答：图中可能存在环或多条路径到达同一顶点，如果没有 visited 标记，会导致重复访问甚至死循环。visited 数组确保每个顶点只被处理一次。

**"邻接表和邻接矩阵如何选择？"**  
答：稠密图（E ≈ V²）用邻接矩阵，查询两点是否相连只需 O(1)；稀疏图（E << V²）用邻接表，节省空间且遍历邻居更快。实际应用中大多数图是稀疏的，优先选择邻接表。

---

## 术语速查

| 术语 | 含义 |
|------|------|
| 邻接矩阵 | V×V 的二维数组表示边的存在 |
| 邻接表 | 数组+链表，每个顶点维护邻居列表 |
| DFS | 深度优先搜索，深入优先 |
| BFS | 广度优先搜索，逐层扩展 |
| 连通图 | 任意两点间都有路径 |
| 环 | 从某点出发能回到自身的路径 |

---

## 参考资料与复核

- [GeeksforGeeks - Graph and its representations](https://www.geeksforgeeks.org/graph-and-its-representations/)
- [Visualgo - Graph Traversal](https://visualgo.net/en/dfsbfs)
- 《算法导论》第 22 章：图的基本算法

**内容复核日期**: 2026-11-25, 2027-02-05, 2027-04-22
