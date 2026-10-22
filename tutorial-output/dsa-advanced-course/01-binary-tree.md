# 第 1 章：二叉树与遍历

## 本节知识框架

**学习目标**：
- 理解二叉树的基本结构和性质
- 掌握前序、中序、后序、层序四种遍历方式
- 能够递归和迭代实现遍历算法
- 了解二叉搜索树（BST）的特性

**前置知识**：
- 链表节点的概念
- 递归函数的执行过程
- 栈和队列的基本操作

**复习清单**：
- [ ] 能画出二叉树的节点结构
- [ ] 能手动模拟三种深度优先遍历的顺序
- [ ] 能解释 BST 的"左小右大"规则

---

## 核心概念定义

| 术语 | 一句话说明 |
|------|----------|
| **二叉树** | 每个节点最多有两个子节点（左子节点、右子节点）的树结构 |
| **根节点** | 树的顶层节点，没有父节点 |
| **叶子节点** | 没有子节点的节点 |
| **深度** | 从根节点到某节点的边数 |
| **高度** | 从某节点到最远叶子节点的边数 |
| **前序遍历** | 根 → 左 → 右（先访问根节点） |
| **中序遍历** | 左 → 根 → 右（BST 中序得到有序序列） |
| **后序遍历** | 左 → 右 → 根（最后访问根节点） |
| **层序遍历** | 从上到下、从左到右逐层访问（使用队列） |
| **二叉搜索树** | 左子树所有节点 < 根节点 < 右子树所有节点 |

---

## 原理与运行机制

### 二叉树的存储结构

想象一棵倒置的树：根在上面，枝叶在下面。每个节点像一个分叉路口，可以向左或向右延伸。

```
        5          ← 根节点
       / \
      3   8        ← 第二层
     / \   \
    1   4   9      ← 第三层（叶子节点）
```

**关键性质**：
- 对于高度为 h 的二叉树，最多有 2^h - 1 个节点
- 第 i 层最多有 2^(i-1) 个节点
- 叶子节点数 = 度为 2 的节点数 + 1

### 遍历的本质

遍历就是按照某种规则"走完"所有节点，确保不重复、不遗漏。

**类比**：超市货架整理
- **前序遍历**：先看分类牌（根），再整理左边货架（左子树），最后整理右边货架（右子树）
- **中序遍历**：从左到右依次整理（BST 中得到从小到大顺序）
- **后序遍历**：先整理完左右货架，最后贴分类标签

**递归三要素**：
1. **终止条件**：节点为空（null/nullptr）
2. **当前层操作**：访问当前节点
3. **递归调用**：处理左子树和右子树

---

## 典型应用场景

| 场景 | 使用的遍历方式 | 原因 |
|------|--------------|------|
| 表达式求值 | 后序遍历 | 先计算子表达式，再计算根运算符 |
| BST 排序输出 | 中序遍历 | 天然得到升序序列 |
| 复制二叉树 | 前序遍历 | 先创建根节点，再递归创建子树 |
| 层级统计 | 层序遍历 | 按层分组处理数据 |
| 文件系统扫描 | 前序遍历 | 先显示目录名，再递归进入子目录 |

---

## 代码示例

### C++ 实现

```cpp
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

// 二叉树节点定义
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BinaryTree {
public:
    // 前序遍历：根 → 左 → 右
    void preorder(TreeNode* root) {
        if (!root) return;
        cout << root->val << " ";      // 访问根
        preorder(root->left);           // 递归左子树
        preorder(root->right);          // 递归右子树
    }

    // 中序遍历：左 → 根 → 右
    void inorder(TreeNode* root) {
        if (!root) return;
        inorder(root->left);            // 递归左子树
        cout << root->val << " ";      // 访问根
        inorder(root->right);           // 递归右子树
    }

    // 后序遍历：左 → 右 → 根
    void postorder(TreeNode* root) {
        if (!root) return;
        postorder(root->left);          // 递归左子树
        postorder(root->right);         // 递归右子树
        cout << root->val << " ";      // 访问根
    }

    // 层序遍历：使用队列
    void levelOrder(TreeNode* root) {
        if (!root) return;
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            cout << node->val << " ";
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }

    // 构建示例 BST
    TreeNode* buildSample() {
        TreeNode* root = new TreeNode(5);
        root->left = new TreeNode(3);
        root->right = new TreeNode(8);
        root->left->left = new TreeNode(1);
        root->left->right = new TreeNode(4);
        root->right->right = new TreeNode(9);
        return root;
    }
};

int main() {
    BinaryTree tree;
    TreeNode* root = tree.buildSample();
    
    cout << "前序遍历: ";
    tree.preorder(root);    // 输出: 5 3 1 4 8 9
    
    cout << "\n中序遍历: ";
    tree.inorder(root);     // 输出: 1 3 4 5 8 9 (有序!)
    
    cout << "\n后序遍历: ";
    tree.postorder(root);   // 输出: 1 4 3 9 8 5
    
    cout << "\n层序遍历: ";
    tree.levelOrder(root);  // 输出: 5 3 8 1 4 9
    
    return 0;
}
```

### Java 实现

```java
import java.util.*;

// 二叉树节点定义
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

public class BinaryTreeTraversal {
    
    // 前序遍历：根 → 左 → 右
    public static void preorder(TreeNode root) {
        if (root == null) return;
        System.out.print(root.val + " ");    // 访问根
        preorder(root.left);                  // 递归左子树
        preorder(root.right);                 // 递归右子树
    }

    // 中序遍历：左 → 根 → 右
    public static void inorder(TreeNode root) {
        if (root == null) return;
        inorder(root.left);                   // 递归左子树
        System.out.print(root.val + " ");    // 访问根
        inorder(root.right);                  // 递归右子树
    }

    // 后序遍历：左 → 右 → 根
    public static void postorder(TreeNode root) {
        if (root == null) return;
        postorder(root.left);                 // 递归左子树
        postorder(root.right);                // 递归右子树
        System.out.print(root.val + " ");    // 访问根
    }

    // 层序遍历：使用队列
    public static void levelOrder(TreeNode root) {
        if (root == null) return;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            System.out.print(node.val + " ");
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }

    // 构建示例 BST
    public static TreeNode buildSample() {
        TreeNode root = new TreeNode(5);
        root.left = new TreeNode(3);
        root.right = new TreeNode(8);
        root.left.left = new TreeNode(1);
        root.left.right = new TreeNode(4);
        root.right.right = new TreeNode(9);
        return root;
    }

    public static void main(String[] args) {
        TreeNode root = buildSample();
        
        System.out.print("前序遍历: ");
        preorder(root);    // 输出: 5 3 1 4 8 9
        
        System.out.print("\n中序遍历: ");
        inorder(root);     // 输出: 1 3 4 5 8 9 (有序!)
        
        System.out.print("\n后序遍历: ");
        postorder(root);   // 输出: 1 4 3 9 8 5
        
        System.out.print("\n层序遍历: ");
        levelOrder(root);  // 输出: 5 3 8 1 4 9
    }
}
```

---

## 复杂度或性能分析

| 遍历方式 | 时间复杂度 | 空间复杂度 | 说明 |
|---------|-----------|-----------|------|
| 前序遍历 | O(n) | O(h) | h 为树高，递归栈深度 |
| 中序遍历 | O(n) | O(h) | 同上 |
| 后序遍历 | O(n) | O(h) | 同上 |
| 层序遍历 | O(n) | O(w) | w 为最大宽度，队列大小 |

**最优情况**：平衡树，h = log₂n  
**最坏情况**：退化为链表，h = n

---

## 常见误区与易错点

| 错误 | 现象 | 修法 |
|------|------|------|
| 忘记递归终止条件 | 栈溢出（StackOverflowError） | 函数开头检查 `if (!root) return` |
| 混淆三种遍历顺序 | 输出结果不符合预期 | 记住口诀：前序"根左右"，中序"左根右"，后序"左右根" |
| 层序遍历用栈代替队列 | 变成 DFS 而非 BFS | 层序必须用队列（FIFO） |
| BST 插入时未维护性质 | 树不再是 BST | 插入时比较大小，决定走左还是右 |

---

## 与其他知识点的关系

- **后续章节**：AVL 树、红黑树都是基于二叉搜索树的平衡优化
- **关联知识**：堆是完全二叉树，可用数组存储
- **实际应用**：文件系统、HTML DOM 树都用树结构表示

---

## 自测题与参考答案

**Q1**: 对 BST 进行中序遍历会得到什么序列？  
A. 随机序列  
B. 降序序列  
C. 升序序列  
D. 层序序列  

**答案**: C  
**解释**: BST 的性质是左子树 < 根 < 右子树，中序遍历"左根右"恰好得到升序。

**Q2**: 层序遍历需要使用哪种数据结构？  
A. 栈  
B. 队列  
C. 哈希表  
D. 优先队列  

**答案**: B  
**解释**: 层序遍历需要先进先出（FIFO），队列保证先加入的节点先被处理。

**Q3**: 前序遍历的第一个访问的节点一定是？  
A. 最左叶子节点  
B. 根节点  
C. 最右叶子节点  
D. 深度最大的节点  

**答案**: B  
**解释**: 前序遍历顺序是"根左右"，所以第一个访问的就是根节点。

---

## 考点精讲

**"二叉树的前序遍历顺序是什么？"**  
答：前序遍历的顺序是 **根 → 左 → 右**。即先访问当前节点，再递归遍历左子树，最后递归遍历右子树。例如对树 `{5,3,8,1,4,9}`，前序遍历结果为 `5 3 1 4 8 9`。

**"为什么 BST 的中序遍历能得到有序序列？"**  
答：BST 的定义是左子树所有节点值 < 根节点值 < 右子树所有节点值。中序遍历顺序是 **左 → 根 → 右**，这正好符合从小到大的顺序，因此遍历结果是升序序列。

**"层序遍历和前序遍历的区别是什么？"**  
答：层序遍历是 **广度优先（BFS）**，使用队列，从上到下逐层访问；前序遍历是 **深度优先（DFS）**，使用递归栈，沿着一条路径走到最深再回溯。层序适合找最短路径，前序适合复制树结构。

---

## 术语速查

| 术语 | 含义 |
|------|------|
| 二叉树 | 每个节点最多两个子节点的树 |
| 前序遍历 | 根 → 左 → 右的遍历顺序 |
| 中序遍历 | 左 → 根 → 右的遍历顺序 |
| 后序遍历 | 左 → 右 → 根的遍历顺序 |
| 层序遍历 | 从上到下、从左到右逐层访问 |
| 二叉搜索树 | 左子树 < 根 < 右子树的有序二叉树 |

---

## 参考资料与复核

- [GeeksforGeeks - Binary Tree Traversals](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)
- [LeetCode - Binary Tree Problems](https://leetcode.com/tag/binary-tree/)
- 《算法导论》第 12 章：二叉搜索树

**内容复核日期**: 2026-11-15, 2027-01-20, 2027-04-10
