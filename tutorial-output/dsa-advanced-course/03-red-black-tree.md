# 第 3 章：红黑树原理与实现

## 本节知识框架

**学习目标**：
- 理解红黑树的五条性质
- 掌握红黑树与 AVL 树的权衡取舍
- 了解红黑树在标准库中的应用
- 能够手动模拟简单的插入着色过程

**前置知识**：
- AVL 树的平衡思想
- 二叉搜索树的插入操作
- 节点着色的概念

**复习清单**：
- [ ] 能列举红黑树的五条性质
- [ ] 能解释为什么红黑树旋转次数更少
- [ ] 知道 C++ STL 和 Java TreeMap 使用红黑树

---

## 核心概念定义

| 术语 | 一句话说明 |
|------|----------|
| **红黑树** | 通过节点颜色（红/黑）约束的近似平衡二叉搜索树 |
| **性质 1** | 每个节点是红色或黑色 |
| **性质 2** | 根节点是黑色 |
| **性质 3** | 叶子节点（NIL）是黑色 |
| **性质 4** | 红色节点的子节点必须是黑色（不能有两个连续红色） |
| **性质 5** | 从任一节点到其叶子的所有路径包含相同数量的黑色节点 |
| **黑高度** | 从某节点到叶子的路径上的黑色节点数 |

---

## 原理与运行机制

### 红黑树的平衡哲学

红黑树不像 AVL 那样严格要求高度差 ≤ 1，而是通过颜色规则保证：

**最长路径 ≤ 2 × 最短路径**

**类比**：交通信号灯系统
- 红灯表示"危险区域"，不能连续出现两个红灯（性质 4）
- 每条路线的黑灯数量必须相同（性质 5）
- 这样保证任何两条路线长度差距不会太大

```
完美平衡 (AVL):          近似平衡 (红黑树):
       3                       3(B)
      / \                     /    \
    2(B) 4(B)             2(R)    4(B)
   /                       \
 1(R)                      3.5(R)

高度: 2                    最长路径: 3, 最短路径: 2
                         满足: 3 ≤ 2×2 ✓
```

### 为什么选择红黑树？

| 对比维度 | AVL 树 | 红黑树 |
|---------|--------|--------|
| 平衡程度 | 严格（高度差 ≤ 1） | 宽松（最长 ≤ 2×最短） |
| 查询效率 | 更高（树更矮） | 略低（树稍高） |
| 插入旋转 | 最多 O(log n) 次回溯 | 最多 2 次旋转 |
| 删除旋转 | 最多 O(log n) 次回溯 | 最多 3 次旋转 |
| 适用场景 | 读多写少 | 读写均衡 |

**关键洞察**：红黑树牺牲了一点查询效率，换取了插入删除时的稳定性。

---

## 典型应用场景

| 应用 | 说明 |
|------|------|
| C++ `std::map` / `std::set` | GNU libstdc++ 和 MSVC STL 均使用红黑树 |
| Java `TreeMap` / `TreeSet` | java.util 包中的有序映射和集合 |
| Linux 内核调度器 | CFS（完全公平调度器）用红黑树管理进程 |
| Nginx 定时器 | 管理超时事件 |
| MySQL 索引 | InnoDB 引擎内部使用 |

---

## 代码示例

### C++ 实现（简化版）

```cpp
#include <iostream>
using namespace std;

enum Color { RED, BLACK };

struct RBNode {
    int val;
    Color color;
    RBNode* left;
    RBNode* right;
    RBNode* parent;
    
    RBNode(int x) : val(x), color(RED), 
                    left(nullptr), right(nullptr), parent(nullptr) {}
};

class RedBlackTree {
private:
    RBNode* root;
    RBNode* NIL;  // 哨兵节点
    
public:
    RedBlackTree() {
        NIL = new RBNode(0);
        NIL->color = BLACK;
        root = NIL;
    }

    // 左旋
    void leftRotate(RBNode* x) {
        RBNode* y = x->right;
        x->right = y->left;
        if (y->left != NIL)
            y->left->parent = x;
        y->parent = x->parent;
        
        if (x->parent == NIL)
            root = y;
        else if (x == x->parent->left)
            x->parent->left = y;
        else
            x->parent->right = y;
            
        y->left = x;
        x->parent = y;
    }

    // 右旋
    void rightRotate(RBNode* y) {
        RBNode* x = y->left;
        y->left = x->right;
        if (x->right != NIL)
            x->right->parent = y;
        x->parent = y->parent;
        
        if (y->parent == NIL)
            root = x;
        else if (y == y->parent->left)
            y->parent->left = x;
        else
            y->parent->right = x;
            
        x->right = y;
        y->parent = x;
    }

    // 插入修复
    void insertFixup(RBNode* z) {
        while (z->parent->color == RED) {
            if (z->parent == z->parent->parent->left) {
                RBNode* y = z->parent->parent->right;  // 叔节点
                if (y->color == RED) {
                    // Case 1: 叔节点为红，变色
                    z->parent->color = BLACK;
                    y->color = BLACK;
                    z->parent->parent->color = RED;
                    z = z->parent->parent;
                } else {
                    if (z == z->parent->right) {
                        // Case 2: LR 情况，先左旋
                        z = z->parent;
                        leftRotate(z);
                    }
                    // Case 3: LL 情况，右旋 + 变色
                    z->parent->color = BLACK;
                    z->parent->parent->color = RED;
                    rightRotate(z->parent->parent);
                }
            } else {
                // 对称情况（父节点是右子节点）
                RBNode* y = z->parent->parent->left;
                if (y->color == RED) {
                    z->parent->color = BLACK;
                    y->color = BLACK;
                    z->parent->parent->color = RED;
                    z = z->parent->parent;
                } else {
                    if (z == z->parent->left) {
                        z = z->parent;
                        rightRotate(z);
                    }
                    z->parent->color = BLACK;
                    z->parent->parent->color = RED;
                    leftRotate(z->parent->parent);
                }
            }
        }
        root->color = BLACK;
    }

    // 插入节点
    void insert(int val) {
        RBNode* z = new RBNode(val);
        z->left = NIL;
        z->right = NIL;
        
        RBNode* y = NIL;
        RBNode* x = root;
        
        // 标准 BST 插入
        while (x != NIL) {
            y = x;
            if (z->val < x->val)
                x = x->left;
            else
                x = x->right;
        }
        
        z->parent = y;
        if (y == NIL)
            root = z;
        else if (z->val < y->val)
            y->left = z;
        else
            y->right = z;
        
        insertFixup(z);
    }

    // 中序遍历
    void inorder(RBNode* node) {
        if (node == NIL) return;
        inorder(node->left);
        cout << node->val << (node->color == RED ? "(R)" : "(B)") << " ";
        inorder(node->right);
    }

    void printInorder() {
        inorder(root);
        cout << endl;
    }
};

int main() {
    RedBlackTree tree;
    int values[] = {10, 20, 30, 15, 25, 5};
    
    for (int val : values) {
        tree.insert(val);
    }
    
    cout << "中序遍历: ";
    tree.printInorder();  // 输出: 5(B) 10(B) 15(R) 20(B) 25(R) 30(B)
    
    return 0;
}
```

### Java 实现

```java
enum Color { RED, BLACK }

class RBNode {
    int val;
    Color color;
    RBNode left;
    RBNode right;
    RBNode parent;
    
    RBNode(int val) {
        this.val = val;
        this.color = Color.RED;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

public class RedBlackTree {
    private RBNode root;
    private RBNode NIL;
    
    public RedBlackTree() {
        NIL = new RBNode(0);
        NIL.color = Color.BLACK;
        root = NIL;
    }

    private void leftRotate(RBNode x) {
        RBNode y = x.right;
        x.right = y.left;
        if (y.left != NIL)
            y.left.parent = x;
        y.parent = x.parent;
        
        if (x.parent == NIL)
            root = y;
        else if (x == x.parent.left)
            x.parent.left = y;
        else
            x.parent.right = y;
            
        y.left = x;
        x.parent = y;
    }

    private void rightRotate(RBNode y) {
        RBNode x = y.left;
        y.left = x.right;
        if (x.right != NIL)
            x.right.parent = y;
        x.parent = y.parent;
        
        if (y.parent == NIL)
            root = x;
        else if (y == y.parent.left)
            y.parent.left = x;
        else
            y.parent.right = x;
            
        x.right = y;
        y.parent = x;
    }

    private void insertFixup(RBNode z) {
        while (z.parent.color == Color.RED) {
            if (z.parent == z.parent.parent.left) {
                RBNode y = z.parent.parent.right;
                if (y.color == Color.RED) {
                    z.parent.color = Color.BLACK;
                    y.color = Color.BLACK;
                    z.parent.parent.color = Color.RED;
                    z = z.parent.parent;
                } else {
                    if (z == z.parent.right) {
                        z = z.parent;
                        leftRotate(z);
                    }
                    z.parent.color = Color.BLACK;
                    z.parent.parent.color = Color.RED;
                    rightRotate(z.parent.parent);
                }
            } else {
                RBNode y = z.parent.parent.left;
                if (y.color == Color.RED) {
                    z.parent.color = Color.BLACK;
                    y.color = Color.BLACK;
                    z.parent.parent.color = Color.RED;
                    z = z.parent.parent;
                } else {
                    if (z == z.parent.left) {
                        z = z.parent;
                        rightRotate(z);
                    }
                    z.parent.color = Color.BLACK;
                    z.parent.parent.color = Color.RED;
                    leftRotate(z.parent.parent);
                }
            }
        }
        root.color = Color.BLACK;
    }

    public void insert(int val) {
        RBNode z = new RBNode(val);
        z.left = NIL;
        z.right = NIL;
        
        RBNode y = NIL;
        RBNode x = root;
        
        while (x != NIL) {
            y = x;
            if (z.val < x.val)
                x = x.left;
            else
                x = x.right;
        }
        
        z.parent = y;
        if (y == NIL)
            root = z;
        else if (z.val < y.val)
            y.left = z;
        else
            y.right = z;
        
        insertFixup(z);
    }

    private void inorder(RBNode node) {
        if (node == NIL) return;
        inorder(node.left);
        System.out.print(node.val + (node.color == Color.RED ? "(R)" : "(B)") + " ");
        inorder(node.right);
    }

    public void printInorder() {
        inorder(root);
        System.out.println();
    }

    public static void main(String[] args) {
        RedBlackTree tree = new RedBlackTree();
        int[] values = {10, 20, 30, 15, 25, 5};
        
        for (int val : values) {
            tree.insert(val);
        }
        
        System.out.print("中序遍历: ");
        tree.printInorder();  // 输出: 5(B) 10(B) 15(R) 20(B) 25(R) 30(B)
    }
}
```

---

## 复杂度或性能分析

| 操作 | 时间复杂度 | 说明 |
|------|-----------|------|
| 查找 | O(log n) | 树高 ≤ 2log₂(n+1) |
| 插入 | O(log n) | 查找 O(log n) + 修复最多 2 次旋转 |
| 删除 | O(log n) | 查找 O(log n) + 修复最多 3 次旋转 |
| 空间 | O(n) | 每个节点额外存储颜色和父指针 |

**对比 AVL**：
- 查询略慢（树更高）
- 插入删除更快（旋转次数有上限）

---

## 常见误区与易错点

| 错误 | 现象 | 修法 |
|------|------|------|
| 忘记设置 NIL 哨兵 | 空指针异常 | 所有叶子指向同一个 BLACK NIL 节点 |
| 新节点颜色设为黑色 | 违反性质 5 | 新插入节点必须是 RED |
| 修复时未处理对称情况 | 只处理了左子树情况 | 必须同时处理父节点是左/右子节点的两种情况 |
| 根节点最后未变黑 | 违反性质 2 | insertFixup 结束时强制 `root->color = BLACK` |

---

## 与其他知识点的关系

- **前置**：AVL 树、二叉搜索树
- **对比**：AVL 更适合查询密集型应用，红黑树适合读写均衡
- **实际应用**：C++ STL、Java TreeMap、Linux 内核

---

## 自测题与参考答案

**Q1**: 红黑树中新插入的节点应该是什么颜色？  
A. 黑色  
B. 红色  
C. 随机  
D. 与父节点相同  

**答案**: B  
**解释**: 新节点设为红色可以避免违反性质 5（黑高度相同），最多只违反性质 4（连续红色），易于修复。

**Q2**: 红黑树的最长路径最多是最短路径的几倍？  
A. 1.5 倍  
B. 2 倍  
C. 2.5 倍  
D. 3 倍  

**答案**: B  
**解释**: 由性质 4 和 5 可推导：最长路径（交替红黑）≤ 2 × 最短路径（全黑）。

**Q3**: C++ STL 中的 map 使用什么数据结构实现？  
A. AVL 树  
B. 哈希表  
C. 红黑树  
D. B+ 树  

**答案**: C  
**解释**: GNU libstdc++ 和 MSVC STL 的 `std::map` 和 `std::set` 都基于红黑树实现。

---

## 考点精讲

**"红黑树的五条性质是什么？"**  
答：① 每个节点是红色或黑色；② 根节点是黑色；③ 叶子节点（NIL）是黑色；④ 红色节点的子节点必须是黑色（不能有连续红色节点）；⑤ 从任一节点到其所有叶子节点的路径包含相同数量的黑色节点。

**"红黑树插入修复的三种情况是什么？"**  
答：Case 1（叔节点为红）：父节点和叔节点变黑，祖父节点变红，继续向上检查；Case 2（LR/RL 形态）：先旋转转换为 LL/RR 形态；Case 3（LL/RR 形态）：父节点变黑，祖父节点变红，执行单次旋转。

**"为什么红黑树比 AVL 树更适合频繁插入删除的场景？"**  
答：AVL 树插入删除后可能需要 O(log n) 次旋转来恢复平衡，而红黑树最多只需 2-3 次旋转。虽然红黑树查询稍慢（树更高），但在读写均衡的场景下整体性能更优。

---

## 术语速查

| 术语 | 含义 |
|------|------|
| 红黑树 | 通过颜色约束的近似平衡 BST |
| 黑高度 | 从节点到叶子的黑色节点数量 |
| NIL 哨兵 | 统一的黑色叶子节点，避免空指针 |
| Case 1 | 叔节点为红，通过变色修复 |
| Case 2 | LR/RL 形态，需先旋转转换 |
| Case 3 | LL/RR 形态，单次旋转 + 变色 |

---

## 参考资料与复核

- [GeeksforGeeks - Red-Black Tree](https://www.geeksforgeeks.org/red-black-tree-set-1-introduction-2/)
- [CLRS Chapter 13 - Red-Black Trees](https://mitpress.mit.edu/books/introduction-algorithms)
- C++ STL 源码：`bits/stl_tree.h`

**内容复核日期**: 2026-11-20, 2027-01-28, 2027-04-18
