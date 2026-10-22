# 第 2 章：平衡二叉搜索树（AVL）

## 本节知识框架

**学习目标**：
- 理解 BST 退化为链表的问题
- 掌握 AVL 树的平衡因子概念
- 能够实现四种旋转操作（LL、RR、LR、RL）
- 分析 AVL 树的插入和删除复杂度

**前置知识**：
- 二叉搜索树的性质
- 递归插入和删除操作
- 树的高度计算

**复习清单**：
- [ ] 能解释为什么需要平衡树
- [ ] 能画出 LL 旋转的过程
- [ ] 能计算任意节点的平衡因子

---

## 核心概念定义

| 术语 | 一句话说明 |
|------|----------|
| **平衡因子** | 左子树高度 - 右子树高度，AVL 要求绝对值 ≤ 1 |
| **LL 旋转** | 左左情况，右旋一次恢复平衡 |
| **RR 旋转** | 右右情况，左旋一次恢复平衡 |
| **LR 旋转** | 左右情况，先左旋左子节点，再右旋根节点 |
| **RL 旋转** | 右左情况，先右旋右子节点，再左旋根节点 |
| **最小不平衡子树** | 从插入点向上找，第一个平衡因子为 ±2 的节点 |

---

## 原理与运行机制

### 为什么需要 AVL 树？

普通 BST 在有序输入时会退化为链表：

```
插入序列: 1, 2, 3, 4, 5

普通 BST:        AVL 树:
    1               2
     \             / \
      2           1   4
       \         /   / \
        3           3   5
         \
          4
           \
            5

高度: 5 (O(n))     高度: 3 (O(log n))
查找: O(n)         查找: O(log n)
```

**类比**：天平称重
- AVL 树像一个智能天平，每次加砝码后自动检查是否倾斜
- 如果倾斜超过 1 格（平衡因子 = ±2），就调整砝码位置（旋转）
- 调整后左右两边高度差不超过 1

### 四种旋转场景

**LL 旋转（右旋）**：
```
      y              x
     /              / \
    x      →      z    y
   /
  z
```

**RR 旋转（左旋）**：
```
  x                y
   \              / \
    y     →     x    z
     \
      z
```

**LR 旋转**：先对左子节点做 RR 旋转，再对根做 LL 旋转  
**RL 旋转**：先对右子节点做 LL 旋转，再对根做 RR 旋转

---

## 典型应用场景

| 场景 | 为什么用 AVL |
|------|------------|
| 数据库索引 | 查询频繁，需要稳定的 O(log n) 查找 |
| 内存中的映射表 | 比红黑树更平衡，查询更快 |
| 编译器符号表 | 变量名查找需要高效 |
| 文件系统目录 | 目录层级深时保持高效访问 |

---

## 代码示例

### C++ 实现

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

struct AVLNode {
    int val;
    int height;
    AVLNode* left;
    AVLNode* right;
    
    AVLNode(int x) : val(x), height(1), left(nullptr), right(nullptr) {}
};

class AVLTree {
public:
    // 获取节点高度
    int getHeight(AVLNode* node) {
        return node ? node->height : 0;
    }

    // 获取平衡因子
    int getBalance(AVLNode* node) {
        return node ? getHeight(node->left) - getHeight(node->right) : 0;
    }

    // 更新节点高度
    void updateHeight(AVLNode* node) {
        if (node) {
            node->height = 1 + max(getHeight(node->left), getHeight(node->right));
        }
    }

    // LL 旋转（右旋）
    AVLNode* rotateRight(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* T2 = x->right;
        
        // 执行旋转
        x->right = y;
        y->left = T2;
        
        // 更新高度
        updateHeight(y);
        updateHeight(x);
        
        return x;  // 新的根
    }

    // RR 旋转（左旋）
    AVLNode* rotateLeft(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* T2 = y->left;
        
        // 执行旋转
        y->left = x;
        x->right = T2;
        
        // 更新高度
        updateHeight(x);
        updateHeight(y);
        
        return y;  // 新的根
    }

    // 插入节点并维护平衡
    AVLNode* insert(AVLNode* node, int val) {
        // 标准 BST 插入
        if (!node) return new AVLNode(val);
        
        if (val < node->val)
            node->left = insert(node->left, val);
        else if (val > node->val)
            node->right = insert(node->right, val);
        else
            return node;  // 不允许重复
        
        // 更新高度
        updateHeight(node);
        
        // 获取平衡因子
        int balance = getBalance(node);
        
        // LL 情况
        if (balance > 1 && val < node->left->val)
            return rotateRight(node);
        
        // RR 情况
        if (balance < -1 && val > node->right->val)
            return rotateLeft(node);
        
        // LR 情况
        if (balance > 1 && val > node->left->val) {
            node->left = rotateLeft(node->left);
            return rotateRight(node);
        }
        
        // RL 情况
        if (balance < -1 && val < node->right->val) {
            node->right = rotateRight(node->right);
            return rotateLeft(node);
        }
        
        return node;
    }

    // 中序遍历（验证有序性）
    void inorder(AVLNode* root) {
        if (!root) return;
        inorder(root->left);
        cout << root->val << "(" << root->height << ") ";
        inorder(root->right);
    }
};

int main() {
    AVLTree tree;
    AVLNode* root = nullptr;
    
    // 插入会导致失衡的序列
    int values[] = {10, 20, 30, 40, 50, 25};
    for (int val : values) {
        root = tree.insert(root, val);
    }
    
    cout << "中序遍历: ";
    tree.inorder(root);  // 输出: 10(1) 20(2) 25(1) 30(3) 40(2) 50(1)
    
    return 0;
}
```

### Java 实现

```java
class AVLNode {
    int val;
    int height;
    AVLNode left;
    AVLNode right;
    
    AVLNode(int val) {
        this.val = val;
        this.height = 1;
        this.left = null;
        this.right = null;
    }
}

public class AVLTree {
    
    private int getHeight(AVLNode node) {
        return node == null ? 0 : node.height;
    }

    private int getBalance(AVLNode node) {
        return node == null ? 0 : getHeight(node.left) - getHeight(node.right);
    }

    private void updateHeight(AVLNode node) {
        if (node != null) {
            node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
        }
    }

    // LL 旋转（右旋）
    private AVLNode rotateRight(AVLNode y) {
        AVLNode x = y.left;
        AVLNode T2 = x.right;
        
        x.right = y;
        y.left = T2;
        
        updateHeight(y);
        updateHeight(x);
        
        return x;
    }

    // RR 旋转（左旋）
    private AVLNode rotateLeft(AVLNode x) {
        AVLNode y = x.right;
        AVLNode T2 = y.left;
        
        y.left = x;
        x.right = T2;
        
        updateHeight(x);
        updateHeight(y);
        
        return y;
    }

    public AVLNode insert(AVLNode node, int val) {
        if (node == null) return new AVLNode(val);
        
        if (val < node.val)
            node.left = insert(node.left, val);
        else if (val > node.val)
            node.right = insert(node.right, val);
        else
            return node;
        
        updateHeight(node);
        
        int balance = getBalance(node);
        
        // LL 情况
        if (balance > 1 && val < node.left.val)
            return rotateRight(node);
        
        // RR 情况
        if (balance < -1 && val > node.right.val)
            return rotateLeft(node);
        
        // LR 情况
        if (balance > 1 && val > node.left.val) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }
        
        // RL 情况
        if (balance < -1 && val < node.right.val) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }
        
        return node;
    }

    public void inorder(AVLNode root) {
        if (root == null) return;
        inorder(root.left);
        System.out.print(root.val + "(" + root.height + ") ");
        inorder(root.right);
    }

    public static void main(String[] args) {
        AVLTree tree = new AVLTree();
        AVLNode root = null;
        
        int[] values = {10, 20, 30, 40, 50, 25};
        for (int val : values) {
            root = tree.insert(root, val);
        }
        
        System.out.print("中序遍历: ");
        tree.inorder(root);  // 输出: 10(1) 20(2) 25(1) 30(3) 40(2) 50(1)
    }
}
```

---

## 复杂度或性能分析

| 操作 | 时间复杂度 | 说明 |
|------|-----------|------|
| 查找 | O(log n) | 树高始终保持在 log₂n |
| 插入 | O(log n) | 查找 O(log n) + 最多两次旋转 O(1) |
| 删除 | O(log n) | 查找 O(log n) + 向上回溯调整 O(log n) |
| 空间 | O(n) | 每个节点额外存储 height 字段 |

**对比普通 BST**：
- 最坏情况从 O(n) 优化到 O(log n)
- 代价是每次插入/删除后可能需要旋转

---

## 常见误区与易错点

| 错误 | 现象 | 修法 |
|------|------|------|
| 忘记更新高度 | 平衡因子计算错误 | 每次旋转和插入后调用 `updateHeight` |
| 旋转方向搞反 | LL 用了左旋，RR 用了右旋 | 记住：LL 向右倒，所以右旋；RR 向左倒，所以左旋 |
| LR/RL 只旋转一次 | 树仍然不平衡 | LR = 先左旋左子节点 + 再右旋根节点 |
| 未处理重复值 | 可能死循环或逻辑错误 | 插入时检测相等值，直接返回或计数 |

---

## 与其他知识点的关系

- **前置**：二叉搜索树、树的高度计算
- **后续**：红黑树是另一种平衡树，放宽平衡条件以减少旋转次数
- **对比**：B+ 树用于磁盘存储，AVL 用于内存

---

## 自测题与参考答案

**Q1**: AVL 树中任意节点的平衡因子范围是？  
A. [-2, 2]  
B. [-1, 1]  
C. [0, 1]  
D. [-1, 0]  

**答案**: B  
**解释**: AVL 树要求左右子树高度差不超过 1，所以平衡因子 ∈ {-1, 0, 1}。

**Q2**: 对节点 y 进行右旋（LL 旋转）时，谁成为新的根？  
A. y  
B. y 的左子节点 x  
C. y 的右子节点  
D. x 的左子节点  

**答案**: B  
**解释**: LL 旋转中，x 上升为根，y 下降为 x 的右子节点。

**Q3**: AVL 树插入 1,2,3,4,5 后会进行几次旋转？  
A. 0 次  
B. 1 次  
C. 2 次  
D. 3 次  

**答案**: C  
**解释**: 插入 3 时触发 RR 旋转（1 次），插入 5 时触发另一次旋转（1 次），共 2 次。

---

## 考点精讲

**"AVL 树的平衡因子是什么？如何计算？"**  
答：平衡因子 = 左子树高度 - 右子树高度。例如某节点左子树高度为 3，右子树高度为 2，则平衡因子 = 3 - 2 = 1。AVL 树要求所有节点的平衡因子绝对值 ≤ 1。

**"LR 旋转的具体步骤是什么？"**  
答：LR 旋转分两步：① 对失衡节点的左子节点执行 **RR 旋转（左旋）**，将 LR 形态转换为 LL 形态；② 对失衡节点本身执行 **LL 旋转（右旋）**，恢复平衡。本质上是先局部调整再全局调整。

**"AVL 树和红黑树的区别是什么？"**  
答：AVL 树更严格平衡（高度差 ≤ 1），查询更快但旋转更多；红黑树放宽平衡条件（最长路径 ≤ 2×最短路径），插入删除时旋转更少。读多写少选 AVL，写多选红黑树。

---

## 术语速查

| 术语 | 含义 |
|------|------|
| 平衡因子 | 左子树高度 - 右子树高度 |
| LL 旋转 | 左左失衡，执行右旋 |
| RR 旋转 | 右右失衡，执行左旋 |
| LR 旋转 | 左右失衡，先左旋再右旋 |
| RL 旋转 | 右左失衡，先右旋再左旋 |
| 最小不平衡子树 | 离插入点最近的失衡节点 |

---

## 参考资料与复核

- [GeeksforGeeks - AVL Tree Insertion](https://www.geeksforgeeks.org/avl-tree-set-1-insertion/)
- [Visualgo - AVL Tree Visualization](https://visualgo.net/en/avl)
- 《算法导论》第 13 章：红黑树（对比学习）

**内容复核日期**: 2026-11-18, 2027-01-25, 2027-04-15
