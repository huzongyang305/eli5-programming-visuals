# 第 4 章：B+ 树与数据库索引

## 本节知识框架

**学习目标**：
- 理解 B+ 树的结构特点（多路搜索树）
- 掌握 B+ 树与 B 树的区别
- 了解 B+ 树在数据库索引中的应用
- 能够分析 B+ 树的磁盘 I/O 优势

**前置知识**：
- 二叉搜索树的基本操作
- 磁盘存储与内存访问的速度差异
- 数据库表的基本概念

**复习清单**：
- [ ] 能画出 B+ 树的节点结构
- [ ] 能解释为什么数据库使用 B+ 树而非 BST
- [ ] 能计算 B+ 树的高度

---

## 核心概念定义

| 术语 | 一句话说明 |
|------|----------|
| **B 树** | 多路平衡搜索树，每个节点可存储多个键和子节点 |
| **B+ 树** | B 树的变种，只有叶子节点存储数据，非叶子节点只存索引 |
| **阶（Order）** | B+ 树中每个节点最多有的子节点数，记为 m 阶 |
| **叶子节点链表** | B+ 树的所有叶子节点通过指针连接成有序链表 |
| **扇出（Fan-out）** | 一个节点的子节点数量，决定树的分支宽度 |
| **页（Page）** | 磁盘读写的最小单位，通常 4KB 或 8KB |

---

## 原理与运行机制

### 为什么需要 B+ 树？

**问题背景**：磁盘 I/O 比内存慢 10^5 倍！

```
访问速度对比:
  CPU 寄存器:   ~0.5 ns
  L1 缓存:      ~1 ns
  内存:         ~100 ns
  SSD:          ~50,000 ns (50 μs)
  机械硬盘:     ~5,000,000 ns (5 ms)
```

**类比**：图书馆找书
- **BST/AVL**：像每层书架只放 2 本书，要找一本书需爬很多层楼梯（多次磁盘 I/O）
- **B+ 树**：像每层书架放 100 本书，只需爬很少的层数就能找到（减少磁盘 I/O）

```
100 万条数据:
  BST 高度:    log₂(10^6) ≈ 20 层 → 20 次磁盘 I/O
  B+ 树(100阶): log₁₀₀(10^6) ≈ 3 层 → 3 次磁盘 I/O
  
  时间对比: 20 × 5ms = 100ms vs 3 × 5ms = 15ms
  快 6.7 倍！
```

### B+ 树的结构特点

```
        [10|20|30]         ← 根节点（索引）
       /   |   |   \
  [1-9] [11-19] [21-29] [31-40]  ← 内部节点（索引）
    ↓      ↓       ↓       ↓
  [data] [data]  [data]  [data]  ← 叶子节点（实际数据）
    └──→ └──→   └──→   └──→     ← 链表指针（范围查询）
```

**关键特性**：
1. **所有数据在叶子节点**：非叶子节点只存索引，节省空间
2. **叶子节点连成链表**：支持高效的范围查询（`SELECT * WHERE id BETWEEN 10 AND 50`）
3. **多路分支**：每个节点有几十到几百个子节点，树很矮
4. **节点大小对齐磁盘页**：一次 I/O 读取整个节点

---

## 典型应用场景

| 场景 | 说明 |
|------|------|
| MySQL InnoDB 主键索引 | 聚簇索引，数据按主键存储在叶子节点 |
| MySQL 二级索引 | 非聚簇索引，叶子节点存主键值 |
| PostgreSQL 索引 | 使用 B+ 树变体 |
| 文件系统目录 | NTFS、ext4 用 B+ 树管理文件块 |
| 数据库范围查询 | `WHERE age BETWEEN 20 AND 30` 利用叶子链表 |

---

## 代码示例

### C++ 实现（简化版 B+ 树节点）

```cpp
#include <iostream>
#include <vector>
using namespace std;

const int ORDER = 4;  // 4 阶 B+ 树（演示用，实际为 100+）

struct BPlusNode {
    bool isLeaf;
    vector<int> keys;
    vector<BPlusNode*> children;
    BPlusNode* next;  // 叶子节点的后继指针
    
    BPlusNode(bool leaf = true) : isLeaf(leaf), next(nullptr) {}
};

class BPlusTree {
private:
    BPlusNode* root;
    
public:
    BPlusTree() : root(new BPlusNode(true)) {}

    // 搜索键值
    vector<int> search(int key) {
        BPlusNode* curr = root;
        
        // 从根向下找到叶子节点
        while (!curr->isLeaf) {
            int i = 0;
            while (i < curr->keys.size() && key >= curr->keys[i])
                i++;
            curr = curr->children[i];
        }
        
        // 在叶子节点中查找
        for (int k : curr->keys) {
            if (k == key) {
                return {key};  // 找到，返回数据
            }
        }
        return {};  // 未找到
    }

    // 范围查询 [low, high]
    vector<int> rangeQuery(int low, int high) {
        vector<int> result;
        BPlusNode* curr = root;
        
        // 找到包含 low 的叶子节点
        while (!curr->isLeaf) {
            int i = 0;
            while (i < curr->keys.size() && low > curr->keys[i])
                i++;
            curr = curr->children[i];
        }
        
        // 沿叶子链表遍历，收集范围内的数据
        while (curr) {
            for (int k : curr->keys) {
                if (k >= low && k <= high)
                    result.push_back(k);
                else if (k > high)
                    return result;  // 超出范围，提前退出
            }
            curr = curr->next;  // 跳到下一个叶子节点
        }
        
        return result;
    }

    // 打印树结构（简化）
    void printStructure(BPlusNode* node, int depth = 0) {
        if (!node) return;
        
        string indent(depth * 2, ' ');
        cout << indent << "[";
        for (int i = 0; i < node->keys.size(); i++) {
            cout << node->keys[i];
            if (i < node->keys.size() - 1) cout << ", ";
        }
        cout << "]" << (node->isLeaf ? " (leaf)" : "") << endl;
        
        if (!node->isLeaf) {
            for (BPlusNode* child : node->children) {
                printStructure(child, depth + 1);
            }
        }
    }

    void printTree() {
        printStructure(root);
    }
};

int main() {
    BPlusTree tree;
    
    // 注意：完整实现需要 insert 方法，这里仅演示搜索和范围查询
    cout << "B+ 树结构:" << endl;
    tree.printTree();
    
    // 范围查询示例
    vector<int> result = tree.rangeQuery(10, 30);
    cout << "范围 [10, 30]: ";
    for (int val : result) {
        cout << val << " ";
    }
    cout << endl;
    
    return 0;
}
```

### Java 实现

```java
import java.util.*;

class BPlusNode {
    boolean isLeaf;
    List<Integer> keys;
    List<BPlusNode> children;
    BPlusNode next;  // 叶子节点的后继指针
    
    BPlusNode(boolean isLeaf) {
        this.isLeaf = isLeaf;
        this.keys = new ArrayList<>();
        this.children = new ArrayList<>();
        this.next = null;
    }
}

public class BPlusTree {
    private BPlusNode root;
    private static final int ORDER = 4;
    
    public BPlusTree() {
        root = new BPlusNode(true);
    }

    public List<Integer> search(int key) {
        BPlusNode curr = root;
        
        while (!curr.isLeaf) {
            int i = 0;
            while (i < curr.keys.size() && key >= curr.keys.get(i))
                i++;
            curr = curr.children.get(i);
        }
        
        List<Integer> result = new ArrayList<>();
        for (int k : curr.keys) {
            if (k == key) {
                result.add(k);
                break;
            }
        }
        return result;
    }

    public List<Integer> rangeQuery(int low, int high) {
        List<Integer> result = new ArrayList<>();
        BPlusNode curr = root;
        
        while (!curr.isLeaf) {
            int i = 0;
            while (i < curr.keys.size() && low > curr.keys.get(i))
                i++;
            curr = curr.children.get(i);
        }
        
        while (curr != null) {
            for (int k : curr.keys) {
                if (k >= low && k <= high)
                    result.add(k);
                else if (k > high)
                    return result;
            }
            curr = curr.next;
        }
        
        return result;
    }

    public void printStructure(BPlusNode node, int depth) {
        if (node == null) return;
        
        String indent = "  ".repeat(depth);
        System.out.print(indent + "[");
        for (int i = 0; i < node.keys.size(); i++) {
            System.out.print(node.keys.get(i));
            if (i < node.keys.size() - 1) System.out.print(", ");
        }
        System.out.println("]" + (node.isLeaf ? " (leaf)" : ""));
        
        if (!node.isLeaf) {
            for (BPlusNode child : node.children) {
                printStructure(child, depth + 1);
            }
        }
    }

    public void printTree() {
        printStructure(root, 0);
    }

    public static void main(String[] args) {
        BPlusTree tree = new BPlusTree();
        
        System.out.println("B+ 树结构:");
        tree.printTree();
        
        List<Integer> result = tree.rangeQuery(10, 30);
        System.out.println("范围 [10, 30]: " + result);
    }
}
```

---

## 复杂度或性能分析

| 操作 | 时间复杂度 | 说明 |
|------|-----------|------|
| 查找 | O(log_m n) | m 为阶数，通常 m=100~1000 |
| 插入 | O(log_m n) | 可能需要分裂节点 |
| 删除 | O(log_m n) | 可能需要合并节点 |
| 范围查询 | O(log_m n + k) | k 为结果数量，利用叶子链表 |
| 磁盘 I/O | O(h) | h 为树高，通常 3-4 层 |

**对比 BST**：
- 100 万数据：BST 需 20 次 I/O，B+ 树仅需 3 次
- 范围查询：BST 需中序遍历 O(n)，B+ 树沿链表扫描 O(k)

---

## 常见误区与易错点

| 错误 | 现象 | 修法 |
|------|------|------|
| 混淆 B 树和 B+ 树 | B 树所有节点都存数据 | B+ 树只有叶子节点存数据，非叶子只存索引 |
| 忽略叶子链表 | 范围查询效率低 | B+ 树必须维护叶子节点的双向链表 |
| 阶数设置过小 | 树太高，I/O 次数多 | 实际应用中阶数应为 100-1000，对齐磁盘页大小 |
| 未考虑并发控制 | 多线程下数据不一致 | 数据库中使用 latch 或锁保护节点访问 |

---

## 与其他知识点的关系

- **前置**：二叉搜索树、磁盘 I/O 特性
- **后续**：数据库查询优化、索引设计
- **对比**：哈希索引适合等值查询，B+ 树适合范围查询

---

## 自测题与参考答案

**Q1**: B+ 树相比 B 树的主要优势是什么？  
A. 插入更快  
B. 支持高效的范围查询  
C. 树更矮  
D. 实现更简单  

**答案**: B  
**解释**: B+ 树的叶子节点连成链表，范围查询只需找到起点后沿链表扫描，而 B 树需中序遍历。

**Q2**: 为什么数据库索引选择 B+ 树而非红黑树？  
A. B+ 树实现更简单  
B. B+ 树占用内存更少  
C. B+ 树减少磁盘 I/O 次数  
D. B+ 树支持并发更好  

**答案**: C  
**解释**: B+ 树的多路分支使树高远低于红黑树，每次节点读取对应一次磁盘 I/O，树越矮 I/O 越少。

**Q3**: 100 阶 B+ 树存储 1 亿条数据，树高约为？  
A. 2 层  
B. 3 层  
C. 4 层  
D. 5 层  

**答案**: B  
**解释**: log₁₀₀(10^8) = 4，但根节点至少 2 个子节点，实际高度约 3-4 层。

---

## 考点精讲

**"B+ 树为什么适合数据库索引？"**  
答：① 多路分支使树很矮（3-4 层），减少磁盘 I/O 次数；② 叶子节点连成链表，支持高效的范围查询（`BETWEEN`、`>`、`<`）；③ 节点大小对齐磁盘页，一次 I/O 读取整个节点，充分利用带宽。

**"B 树和 B+ 树的区别是什么？"**  
答：B 树的所有节点都存储数据，查询可能在任意层结束；B+ 树只有叶子节点存储数据，非叶子节点只存索引，且叶子节点连成链表。B+ 树更适合范围查询和顺序访问，B 树适合随机访问。

**"如何计算 B+ 树的高度？"**  
答：对于 m 阶 B+ 树存储 n 条数据，高度 h ≈ log_⌈m/2⌉(n)。例如 100 阶 B+ 树存储 100 万数据：h ≈ log₅₀(10^6) ≈ 3 层。实际中由于根节点至少 2 个子节点，高度可能略低。

---

## 术语速查

| 术语 | 含义 |
|------|------|
| B+ 树 | 只有叶子节点存数据的多路搜索树 |
| 阶（Order） | 节点最多的子节点数 |
| 扇出 | 节点的子节点数量 |
| 叶子链表 | 连接所有叶子节点的指针链 |
| 聚簇索引 | 数据按索引顺序物理存储 |
| 非聚簇索引 | 索引叶子节点存主键指针 |

---

## 参考资料与复核

- [MySQL Index Internals](https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html)
- [B+ Tree Visualization](https://www.cs.usfca.edu/~galles/cs245/lecture/bplus.html)
- 《数据库系统概念》第 11 章：索引与散列

**内容复核日期**: 2026-11-22, 2027-02-01, 2027-04-20
