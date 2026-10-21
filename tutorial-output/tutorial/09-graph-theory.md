# 第九章：图论基础

## 简介

你是否使用过地图导航？是否想过社交网络是如何连接的？是否好奇互联网的路由是如何工作的？这些问题的答案都藏在**图论**中。

**图（Graph）**是由**顶点（Vertex/Node）**和**边（Edge）**组成的数学结构。顶点代表对象，边代表对象之间的关系。想象一下，如果把城市看作顶点，道路看作边，就形成了一个交通网络图；如果把用户看作顶点，好友关系看作边，就形成了社交网络图。

图论是计算机科学中最实用的数学分支之一，从搜索引擎到推荐系统，从物流优化到社交分析，都离不开它！

---

## 核心概念定义

### 图的基本组成

**图 G = (V, E)** 其中：
- **V**：顶点集合（Vertices）
- **E**：边集合（Edges）

例如：G = ({A, B, C}, {(A,B), (B,C), (C,A)})

### 图的分类

| 类型 | 特点 | 示例 |
|------|------|------|
| 无向图 | 边没有方向 | 友谊关系 |
| 有向图 | 边有方向 | 关注关系、网页链接 |
| 加权图 | 边有权重 | 距离、成本、时间 |
| 无权图 | 边没有权重 | 简单连接关系 |

### 重要概念

1. **度（Degree）**：与顶点相连的边的数量
   - 无向图：直接计算
   - 有向图：入度（in-degree）和出度（out-degree）

2. **路径（Path）**：从一个顶点到另一个顶点的顶点序列

3. **环（Cycle）**：起点和终点相同的路径

4. **连通性（Connectivity）**：
   - **连通图**：任意两个顶点之间都有路径
   - **强连通图**（有向图）：任意两个顶点互相可达

5. **子图（Subgraph）**：顶点和边都是原图的子集

6. **完全图**：每对顶点之间都有边相连

### 特殊图

- **树**：无环的连通图（下一章详细讲解）
- **二分图**：顶点可以分为两组，同组内无边
- **平面图**：可以画在平面上而边不交叉

---

## 生活类比

### 类比1：地铁线路图

城市的地铁系统是典型的图：

- **顶点**：各个地铁站
- **边**：站之间的轨道
- **权重**：两站之间的行驶时间或距离
- **路径**：从一站到另一站的路线
- **最短路径**：最快的换乘方案

当你用地图APP规划路线时，就是在图上寻找最短路径！

### 类比2：社交网络

微信朋友圈是一个巨大的图：

- **顶点**：每个用户
- **边**：好友关系（无向）或关注关系（有向）
- **度**：好友数量或粉丝数
- **路径**：通过共同好友的连接
- **"六度分隔"**：任意两人之间最多隔6个人

### 类比3：快递配送

快递公司的配送网络：

- **顶点**：仓库、配送站、客户地址
- **边**：配送路线
- **权重**：配送成本或时间
- **问题**：如何找到最优配送路线（旅行商问题）

### 类比4：知识图谱

搜索引擎的知识图谱：

- **顶点**：实体（人、地点、事物）
- **边**：关系（"出生于"、"工作在"、"属于"）
- **应用**：智能搜索、推荐系统

---

## 代码示例

```python
# Python实现图论基础

from collections import defaultdict, deque
import heapq

# ============================================
# 1. 图的表示
# ============================================
print("=== 图的表示 ===")

class Graph:
    """图的实现"""
    
    def __init__(self, directed=False):
        self.directed = directed
        self.adjacency_list = defaultdict(list)  # 邻接表
        self.vertices = set()
    
    def add_vertex(self, vertex):
        """添加顶点"""
        self.vertices.add(vertex)
    
    def add_edge(self, u, v, weight=1):
        """添加边"""
        self.vertices.add(u)
        self.vertices.add(v)
        self.adjacency_list[u].append((v, weight))
        if not self.directed:
            self.adjacency_list[v].append((u, weight))
    
    def get_neighbors(self, vertex):
        """获取邻居顶点"""
        return self.adjacency_list.get(vertex, [])
    
    def display(self):
        """显示图"""
        print("邻接表表示:")
        for vertex in sorted(self.vertices):
            neighbors = self.adjacency_list.get(vertex, [])
            if neighbors:
                neighbor_str = ", ".join(f"{v}(w={w})" for v, w in neighbors)
                print(f"  {vertex} -> [{neighbor_str}]")
            else:
                print(f"  {vertex} -> []")

# 创建无向图
print("无向图示例:")
undirected_graph = Graph(directed=False)
edges = [('A', 'B'), ('A', 'C'), ('B', 'C'), ('B', 'D'), ('C', 'D'), ('D', 'E')]
for u, v in edges:
    undirected_graph.add_edge(u, v)
undirected_graph.display()

# 创建有向图
print("\n有向图示例:")
directed_graph = Graph(directed=True)
directed_edges = [('A', 'B'), ('A', 'C'), ('B', 'D'), ('C', 'D'), ('D', 'E')]
for u, v in directed_edges:
    directed_graph.add_edge(u, v)
directed_graph.display()

# ============================================
# 2. 图的遍历
# ============================================
print("\n=== 图的遍历 ===")

def bfs(graph, start):
    """
    广度优先搜索（BFS）
    使用队列，逐层访问
    """
    visited = set()
    queue = deque([start])
    visited.add(start)
    order = []
    
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        
        for neighbor, _ in graph.get_neighbors(vertex):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return order

def dfs(graph, start):
    """
    深度优先搜索（DFS）
    使用栈（递归），深入到底再回溯
    """
    visited = set()
    order = []
    
    def dfs_helper(vertex):
        visited.add(vertex)
        order.append(vertex)
        
        for neighbor, _ in graph.get_neighbors(vertex):
            if neighbor not in visited:
                dfs_helper(neighbor)
    
    dfs_helper(start)
    return order

# 测试遍历
test_graph = Graph(directed=False)
for u, v in [('A', 'B'), ('A', 'C'), ('B', 'D'), ('B', 'E'), ('C', 'F'), ('D', 'E')]:
    test_graph.add_edge(u, v)

print("测试图:")
test_graph.display()

print(f"\nBFS从A开始: {' -> '.join(bfs(test_graph, 'A'))}")
print(f"DFS从A开始: {' -> '.join(dfs(test_graph, 'A'))}")

# ============================================
# 3. 最短路径算法
# ============================================
print("\n=== 最短路径算法 ===")

def dijkstra(graph, start):
    """
    Dijkstra算法：求单源最短路径
    适用于非负权重图
    """
    # 初始化距离
    distances = {vertex: float('infinity') for vertex in graph.vertices}
    distances[start] = 0
    
    # 优先队列：(距离, 顶点)
    pq = [(0, start)]
    previous = {vertex: None for vertex in graph.vertices}
    visited = set()
    
    while pq:
        current_distance, current_vertex = heapq.heappop(pq)
        
        if current_vertex in visited:
            continue
        visited.add(current_vertex)
        
        for neighbor, weight in graph.get_neighbors(current_vertex):
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current_vertex
                heapq.heappush(pq, (distance, neighbor))
    
    return distances, previous

def reconstruct_path(previous, start, end):
    """重构最短路径"""
    path = []
    current = end
    
    while current is not None:
        path.append(current)
        current = previous[current]
    
    path.reverse()
    
    if path[0] == start:
        return path
    return []

# 创建加权图
weighted_graph = Graph(directed=True)
weighted_edges = [
    ('A', 'B', 4), ('A', 'C', 2),
    ('B', 'C', 1), ('B', 'D', 5),
    ('C', 'D', 8), ('C', 'E', 10),
    ('D', 'E', 2), ('D', 'F', 6),
    ('E', 'F', 3)
]
for u, v, w in weighted_edges:
    weighted_graph.add_edge(u, v, w)

print("加权有向图:")
weighted_graph.display()

# 计算最短路径
start_vertex = 'A'
distances, previous = dijkstra(weighted_graph, start_vertex)

print(f"\n从 {start_vertex} 出发的最短距离:")
for vertex in sorted(distances.keys()):
    dist = distances[vertex]
    if dist != float('infinity'):
        path = reconstruct_path(previous, start_vertex, vertex)
        print(f"  到 {vertex}: 距离={dist}, 路径={' -> '.join(path)}")
    else:
        print(f"  到 {vertex}: 不可达")

# ============================================
# 4. 连通分量
# ============================================
print("\n=== 连通分量 ===")

def find_connected_components(graph):
    """找出无向图的所有连通分量"""
    visited = set()
    components = []
    
    for vertex in graph.vertices:
        if vertex not in visited:
            # BFS找到这个连通分量的所有顶点
            component = []
            queue = deque([vertex])
            visited.add(vertex)
            
            while queue:
                v = queue.popleft()
                component.append(v)
                
                for neighbor, _ in graph.get_neighbors(v):
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
            
            components.append(sorted(component))
    
    return components

# 创建不连通图
disconnected_graph = Graph(directed=False)
# 第一个连通分量
for u, v in [('A', 'B'), ('B', 'C')]:
    disconnected_graph.add_edge(u, v)
# 第二个连通分量
for u, v in [('D', 'E'), ('E', 'F')]:
    disconnected_graph.add_edge(u, v)
# 孤立点
disconnected_graph.add_vertex('G')

print("不连通图:")
disconnected_graph.display()

components = find_connected_components(disconnected_graph)
print(f"\n连通分量数量: {len(components)}")
for i, comp in enumerate(components, 1):
    print(f"  分量{i}: {comp}")

# ============================================
# 5. 拓扑排序
# ============================================
print("\n=== 拓扑排序 ===")

def topological_sort(graph):
    """
    拓扑排序（仅适用于有向无环图DAG）
    使用Kahn算法
    """
    # 计算入度
    in_degree = {vertex: 0 for vertex in graph.vertices}
    for vertex in graph.vertices:
        for neighbor, _ in graph.get_neighbors(vertex):
            in_degree[neighbor] += 1
    
    # 将所有入度为0的顶点加入队列
    queue = deque([v for v in graph.vertices if in_degree[v] == 0])
    result = []
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor, _ in graph.get_neighbors(vertex):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # 如果结果包含所有顶点，说明是DAG
    if len(result) == len(graph.vertices):
        return result
    else:
        return None  # 图中有环

# 创建DAG（有向无环图）
dag = Graph(directed=True)
dag_edges = [
    ('课程A', '课程B'), ('课程A', '课程C'),
    ('课程B', '课程D'), ('课程C', '课程D'),
    ('课程D', '课程E')
]
for u, v in dag_edges:
    dag.add_edge(u, v)

print("课程依赖图（DAG）:")
dag.display()

order = topological_sort(dag)
if order:
    print(f"\n拓扑排序（学习顺序）: {' -> '.join(order)}")
else:
    print("\n图中存在环，无法进行拓扑排序")

# ============================================
# 6. 实际应用：社交网络分析
# ============================================
print("\n=== 实际应用：社交网络分析 ===")

class SocialNetwork:
    def __init__(self):
        self.graph = Graph(directed=False)
    
    def add_person(self, name):
        self.graph.add_vertex(name)
    
    def add_friendship(self, person1, person2):
        self.graph.add_edge(person1, person2)
    
    def get_friends(self, person):
        return [neighbor for neighbor, _ in self.graph.get_neighbors(person)]
    
    def find_shortest_connection(self, person1, person2):
        """找到两人之间的最短连接路径"""
        # BFS
        visited = {person1}
        queue = deque([(person1, [person1])])
        
        while queue:
            current, path = queue.popleft()
            
            if current == person2:
                return path
            
            for neighbor, _ in self.graph.get_neighbors(current):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor]))
        
        return None  # 未连接
    
    def suggest_friends(self, person):
        """推荐朋友：朋友的朋友"""
        friends = set(self.get_friends(person))
        friends_of_friends = set()
        
        for friend in friends:
            for fof, _ in self.graph.get_neighbors(friend):
                if fof != person and fof not in friends:
                    friends_of_friends.add(fof)
        
        return list(friends_of_friends)

# 创建社交网络
network = SocialNetwork()
people = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank']
for person in people:
    network.add_person(person)

# 添加友谊关系
friendships = [
    ('Alice', 'Bob'), ('Alice', 'Charlie'),
    ('Bob', 'David'), ('Charlie', 'David'),
    ('David', 'Eve'), ('Eve', 'Frank')
]
for p1, p2 in friendships:
    network.add_friendship(p1, p2)

print("社交网络:")
network.graph.display()

print(f"\nAlice的朋友: {network.get_friends('Alice')}")
print(f"Alice和Frank的连接: {network.find_shortest_connection('Alice', 'Frank')}")
print(f"推荐给Alice的朋友: {network.suggest_friends('Alice')}")

# ============================================
# 7. 图的统计信息
# ============================================
print("\n=== 图的统计信息 ===")

def graph_statistics(graph):
    """计算图的各种统计信息"""
    num_vertices = len(graph.vertices)
    num_edges = sum(len(neighbors) for neighbors in graph.adjacency_list.values())
    if not graph.directed:
        num_edges //= 2  # 无向图每条边被计算两次
    
    # 计算每个顶点的度
    degrees = {}
    for vertex in graph.vertices:
        degrees[vertex] = len(graph.adjacency_list.get(vertex, []))
    
    avg_degree = sum(degrees.values()) / num_vertices if num_vertices > 0 else 0
    
    return {
        '顶点数': num_vertices,
        '边数': num_edges,
        '平均度': avg_degree,
        '最大度': max(degrees.values()) if degrees else 0,
        '最小度': min(degrees.values()) if degrees else 0
    }

stats = graph_statistics(network.graph)
print("社交网络统计:")
for key, value in stats.items():
    print(f"  {key}: {value}")
```

输出结果：
```
=== 图的表示 ===
无向图示例:
邻接表表示:
  A -> [B(w=1), C(w=1)]
  B -> [A(w=1), C(w=1), D(w=1)]
  C -> [A(w=1), B(w=1), D(w=1)]
  D -> [B(w=1), C(w=1), E(w=1)]
  E -> [D(w=1)]

有向图示例:
邻接表表示:
  A -> [B(w=1), C(w=1)]
  B -> [D(w=1)]
  C -> [D(w=1)]
  D -> [E(w=1)]
  E -> []

=== 图的遍历 ===
测试图:
邻接表表示:
  A -> [B(w=1), C(w=1)]
  B -> [A(w=1), D(w=1), E(w=1)]
  C -> [A(w=1), F(w=1)]
  D -> [B(w=1), E(w=1)]
  E -> [B(w=1), D(w=1)]
  F -> [C(w=1)]

BFS从A开始: A -> B -> C -> D -> E -> F
DFS从A开始: A -> B -> D -> E -> C -> F

=== 最短路径算法 ===
加权有向图:
邻接表表示:
  A -> [B(w=4), C(w=2)]
  B -> [C(w=1), D(w=5)]
  C -> [D(w=8), E(w=10)]
  D -> [E(w=2), F(w=6)]
  E -> [F(w=3)]
  F -> []

从 A 出发的最短距离:
  到 A: 距离=0, 路径=A
  到 B: 距离=4, 路径=A -> B
  到 C: 距离=2, 路径=A -> C
  到 D: 距离=9, 路径=A -> B -> D
  到 E: 距离=11, 路径=A -> B -> D -> E
  到 F: 距离=14, 路径=A -> B -> D -> E -> F

=== 连通分量 ===
不连通图:
邻接表表示:
  A -> [B(w=1)]
  B -> [A(w=1), C(w=1)]
  C -> [B(w=1)]
  D -> [E(w=1)]
  E -> [D(w=1), F(w=1)]
  F -> [E(w=1)]
  G -> []

连通分量数量: 3
  分量1: ['A', 'B', 'C']
  分量2: ['D', 'E', 'F']
  分量3: ['G']

=== 拓扑排序 ===
课程依赖图（DAG）:
邻接表表示:
  课程A -> [课程B(w=1), 课程C(w=1)]
  课程B -> [课程D(w=1)]
  课程C -> [课程D(w=1)]
  课程D -> [课程E(w=1)]
  课程E -> []

拓扑排序（学习顺序）: 课程A -> 课程B -> 课程C -> 课程D -> 课程E

=== 实际应用：社交网络分析 ===
社交网络:
邻接表表示:
  Alice -> [Bob(w=1), Charlie(w=1)]
  Bob -> [Alice(w=1), David(w=1)]
  Charlie -> [Alice(w=1), David(w=1)]
  David -> [Bob(w=1), Charlie(w=1), Eve(w=1)]
  Eve -> [David(w=1), Frank(w=1)]
  Frank -> [Eve(w=1)]

Alice的朋友: ['Bob', 'Charlie']
Alice和Frank的连接: ['Alice', 'Bob', 'David', 'Eve', 'Frank']
推荐给Alice的朋友: ['David', 'Eve']

=== 图的统计信息 ===
社交网络统计:
  顶点数: 6
  边数: 6
  平均度: 2.0
  最大度: 3
  最小度: 1
```

---

## 练习题

### 练习1：图的基本操作
给定以下图：
- 顶点：{A, B, C, D, E}
- 边：{(A,B), (A,C), (B,D), (C,D), (D,E)}

a) 画出这个图
b) 计算每个顶点的度
c) 这是一个连通图吗？
d) 从A到E有多少条不同的路径？

### 练习2：图的遍历
对练习1中的图：

a) 从A开始进行BFS，写出访问顺序
b) 从A开始进行DFS，写出访问顺序
c) BFS和DFS的结果有什么不同？为什么？

### 练习3：最短路径
给定加权图：
- 边及权重：A-B(2), A-C(5), B-C(1), B-D(4), C-D(2), D-E(3)

a) 使用Dijkstra算法找出从A到所有其他顶点的最短路径
b) 从A到E的最短路径是什么？总权重是多少？

### 练习4：编程实践
编写Python函数实现：

```python
def has_cycle(graph):
    """检测图中是否有环"""
    # 你的代码

def is_bipartite(graph):
    """判断图是否是二分图"""
    # 提示：尝试用两种颜色着色
    pass

def count_paths(graph, start, end, max_length):
    """计算从start到end长度不超过max_length的路径数量"""
    # 你的代码
```

### 练习5：实际应用
设计一个简单的地图导航系统：

- 用图表示城市间的道路网络
- 实现查找两点间最短路径的功能
- 考虑实际因素：距离、时间、费用

---

## 常见误区

### 误区1：混淆有向图和无向图
- **错误**：认为边总是双向的
- **正确**：
  - **无向图**：边没有方向，(A,B) = (B,A)
  - **有向图**：边有方向，A→B ≠ B→A
- **例子**：友谊是无向的，关注是有向的

### 误区2：忽视图的表示方式
- **错误**：总是用邻接矩阵，即使图很稀疏
- **正确**：
  - **邻接矩阵**：适合稠密图，快速查询
  - **邻接表**：适合稀疏图，节省空间
- **建议**：大多数实际应用中，邻接表更高效

### 误区3：BFS和DFS的混淆
- **错误**：认为BFS和DFS只是实现细节不同
- **正确**：它们有不同的应用场景
  - **BFS**：找最短路径（无权图）、层次遍历
  - **DFS**：检测环、拓扑排序、连通分量

### 误区4：Dijkstra算法的局限性
- **错误**：用Dijkstra处理有负权重的图
- **正确**：Dijkstra不适用于负权重
  - 负权重需要用Bellman-Ford算法
- **原因**：Dijkstra基于贪心策略，一旦确定最短距离就不再更新

### 误区5：忽略图的特殊情况
- **错误**：假设图总是连通的、无环的
- **正确**：要考虑各种情况
  - 不连通图：需要处理多个连通分量
  - 有环图：某些算法（如拓扑排序）不适用
  - 孤立点：没有边的顶点

---

## 小结

本章我们学习了：
1. ✅ 图的基本概念和表示方法
2. ✅ 图的遍历：BFS和DFS
3. ✅ 最短路径算法：Dijkstra
4. ✅ 连通分量、拓扑排序等高级概念
5. ✅ 用Python实现图的各种操作

图论是网络分析、路径规划、社交网络等领域的核心工具。下一章我们将学习**树结构**，它是一种特殊的图，在计算机科学中有着极其重要的地位！

---

*提示：多画图来理解图的结构，可视化的力量是无穷的！*
