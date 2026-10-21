# 第十章：树结构

## 简介

如果说图是数学中的"网络"，那么**树**就是其中最有序、最优雅的结构。从家族族谱到文件目录，从决策流程到组织架构，树形结构无处不在。

在计算机科学中，树可能是最重要的数据结构之一。数据库索引、编译器语法分析、人工智能决策、甚至你每天使用的文件系统——都建立在树的基础上。

想象一棵真正的树：它有根（root）、有分支（branches）、有叶子（leaves）。数学中的树也是如此，只是它是"倒过来"的——根在上面，叶子在下面！

---

## 核心概念定义

### 什么是树？

**树（Tree）**是一种特殊的图，满足：
1. **连通**：任意两个节点之间都有路径
2. **无环**：没有回路
3. **n个节点有n-1条边**

等价定义：树是一个连通的无环图。

### 树的基本术语

| 术语 | 定义 | 示例 |
|------|------|------|
| 根（Root） | 树的顶层节点 | 家谱中的祖先 |
| 父节点（Parent） | 直接上层节点 | 你的父亲 |
| 子节点（Child） | 直接下层节点 | 你的孩子 |
| 兄弟节点（Sibling） | 同一父节点的子节点 | 你的兄弟姐妹 |
| 叶子（Leaf） | 没有子节点的节点 | 家谱中的最后一代 |
| 内部节点 | 至少有一个子节点的节点 | 非叶子的节点 |
| 深度（Depth） | 从根到节点的路径长度 | 第几代 |
| 高度（Height） | 从节点到最远叶子的距离 | 树的层数 |
| 度（Degree） | 节点的子节点数量 | 有几个孩子 |

### 特殊类型的树

1. **二叉树（Binary Tree）**：每个节点最多有2个子节点
   - 左子节点和右子节点
   
2. **满二叉树**：每个节点要么有0个子节点，要么有2个子节点

3. **完全二叉树**：除了最后一层，其他层都是满的，最后一层从左到右填充

4. **平衡二叉树**：左右子树的高度差不超过1

5. **二叉搜索树（BST）**：左子节点 < 父节点 < 右子节点

6. **B树**：多路搜索树，用于数据库索引

7. **堆（Heap）**：完全二叉树，满足堆性质

---

## 生活类比

### 类比1：家族族谱

一个家族的族谱是典型的树：

- **根**：最早的祖先
- **父节点**：父母
- **子节点**：子女
- **兄弟节点**：兄弟姐妹
- **叶子**：没有后代的族人
- **深度**：第几代人

### 类比2：公司组织架构

公司的组织结构图：

- **根**：CEO
- **内部节点**：各部门经理
- **叶子**：普通员工
- **高度**：管理层级数
- **度**：直接下属数量

### 类比3：文件目录

电脑的文件系统：

- **根**：根目录（C:\ 或 /）
- **内部节点**：文件夹
- **叶子**：文件
- **路径**：从根到文件的完整路径
- **深度**：嵌套的文件夹层数

### 类比4：锦标赛

淘汰赛的对阵表：

- **根**：决赛
- **叶子**：初赛选手
- **内部节点**：每场比赛
- **高度**：比赛轮数
- **完全二叉树**：标准的淘汰赛制

---

## 代码示例

```python
# Python实现树结构

from collections import deque
import json

# ============================================
# 1. 树节点的定义
# ============================================
print("=== 树节点的定义 ===")

class TreeNode:
    """通用树节点"""
    def __init__(self, value):
        self.value = value
        self.children = []
        self.parent = None
    
    def add_child(self, child_node):
        """添加子节点"""
        child_node.parent = self
        self.children.append(child_node)
    
    def get_level(self):
        """获取节点的层级（深度）"""
        level = 0
        current = self
        while current.parent:
            level += 1
            current = current.parent
        return level
    
    def is_leaf(self):
        """判断是否是叶子节点"""
        return len(self.children) == 0
    
    def display(self, indent=0):
        """可视化显示树"""
        prefix = "  " * indent
        marker = "└── " if indent > 0 else ""
        print(f"{prefix}{marker}{self.value}")
        for child in self.children:
            child.display(indent + 1)

# 创建一棵树
print("公司组织架构:")
ceo = TreeNode("CEO")
cto = TreeNode("CTO")
cfo = TreeNode("CFO")
cmo = TreeNode("CMO")

dev_manager = TreeNode("开发经理")
qa_manager = TreeNode("测试经理")
accountant = TreeNode("会计")
marketing = TreeNode("市场专员")

dev1 = TreeNode("开发者A")
dev2 = TreeNode("开发者B")
tester = TreeNode("测试员")

# 构建树
ceo.add_child(cto)
ceo.add_child(cfo)
ceo.add_child(cmo)

cto.add_child(dev_manager)
cto.add_child(qa_manager)

cfo.add_child(accountant)
cmo.add_child(marketing)

dev_manager.add_child(dev1)
dev_manager.add_child(dev2)
qa_manager.add_child(tester)

ceo.display()

# ============================================
# 2. 二叉树
# ============================================
print("\n=== 二叉树 ===")

class BinaryTreeNode:
    """二叉树节点"""
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinaryTree:
    """二叉树"""
    def __init__(self, root_value=None):
        self.root = BinaryTreeNode(root_value) if root_value else None
    
    def insert_left(self, node, value):
        """在节点左侧插入"""
        if node.left is None:
            node.left = BinaryTreeNode(value)
        else:
            new_node = BinaryTreeNode(value)
            new_node.left = node.left
            node.left = new_node
    
    def insert_right(self, node, value):
        """在节点右侧插入"""
        if node.right is None:
            node.right = BinaryTreeNode(value)
        else:
            new_node = BinaryTreeNode(value)
            new_node.right = node.right
            node.right = new_node

# 创建二叉树
bt = BinaryTree("A")
bt.insert_left(bt.root, "B")
bt.insert_right(bt.root, "C")
bt.insert_left(bt.root.left, "D")
bt.insert_right(bt.root.left, "E")
bt.insert_left(bt.root.right, "F")
bt.insert_right(bt.root.right, "G")

def display_binary_tree(node, indent=0, prefix=""):
    """可视化显示二叉树"""
    if node is None:
        return
    display_binary_tree(node.right, indent + 1, "R: ")
    print("  " * indent + prefix + str(node.value))
    display_binary_tree(node.left, indent + 1, "L: ")

print("二叉树结构:")
display_binary_tree(bt.root)

# ============================================
# 3. 树的遍历
# ============================================
print("\n=== 树的遍历 ===")

# 二叉树遍历
def preorder_traversal(node):
    """前序遍历：根-左-右"""
    if node is None:
        return []
    return [node.value] + preorder_traversal(node.left) + preorder_traversal(node.right)

def inorder_traversal(node):
    """中序遍历：左-根-右"""
    if node is None:
        return []
    return inorder_traversal(node.left) + [node.value] + inorder_traversal(node.right)

def postorder_traversal(node):
    """后序遍历：左-右-根"""
    if node is None:
        return []
    return postorder_traversal(node.left) + postorder_traversal(node.right) + [node.value]

def level_order_traversal(root):
    """层次遍历（BFS）"""
    if root is None:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        result.append(node.value)
        
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    
    return result

print(f"前序遍历: {' -> '.join(preorder_traversal(bt.root))}")
print(f"中序遍历: {' -> '.join(inorder_traversal(bt.root))}")
print(f"后序遍历: {' -> '.join(postorder_traversal(bt.root))}")
print(f"层次遍历: {' -> '.join(level_order_traversal(bt.root))}")

# 通用树的遍历
def dfs_tree(node):
    """深度优先遍历（通用树）"""
    if node is None:
        return []
    result = [node.value]
    for child in node.children:
        result.extend(dfs_tree(child))
    return result

def bfs_tree(root):
    """广度优先遍历（通用树）"""
    if root is None:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        result.append(node.value)
        queue.extend(node.children)
    
    return result

print(f"\n通用树DFS: {' -> '.join(dfs_tree(ceo))}")
print(f"通用树BFS: {' -> '.join(bfs_tree(ceo))}")

# ============================================
# 4. 二叉搜索树（BST）
# ============================================
print("\n=== 二叉搜索树 ===")

class BSTNode:
    """二叉搜索树节点"""
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None

class BinarySearchTree:
    """二叉搜索树"""
    def __init__(self):
        self.root = None
    
    def insert(self, key):
        """插入节点"""
        if self.root is None:
            self.root = BSTNode(key)
        else:
            self._insert_recursive(self.root, key)
    
    def _insert_recursive(self, node, key):
        if key < node.key:
            if node.left is None:
                node.left = BSTNode(key)
            else:
                self._insert_recursive(node.left, key)
        elif key > node.key:
            if node.right is None:
                node.right = BSTNode(key)
            else:
                self._insert_recursive(node.right, key)
    
    def search(self, key):
        """搜索节点"""
        return self._search_recursive(self.root, key)
    
    def _search_recursive(self, node, key):
        if node is None or node.key == key:
            return node
        if key < node.key:
            return self._search_recursive(node.left, key)
        return self._search_recursive(node.right, key)
    
    def find_min(self, node=None):
        """找到最小值"""
        if node is None:
            node = self.root
        current = node
        while current.left:
            current = current.left
        return current
    
    def find_max(self, node=None):
        """找到最大值"""
        if node is None:
            node = self.root
        current = node
        while current.right:
            current = current.right
        return current
    
    def delete(self, key):
        """删除节点"""
        self.root = self._delete_recursive(self.root, key)
    
    def _delete_recursive(self, node, key):
        if node is None:
            return None
        
        if key < node.key:
            node.left = self._delete_recursive(node.left, key)
        elif key > node.key:
            node.right = self._delete_recursive(node.right, key)
        else:
            # 找到要删除的节点
            if node.left is None:
                return node.right
            elif node.right is None:
                return node.left
            else:
                # 有两个子节点：用右子树的最小值替换
                min_node = self.find_min(node.right)
                node.key = min_node.key
                node.right = self._delete_recursive(node.right, min_node.key)
        
        return node
    
    def inorder(self, node=None):
        """中序遍历（得到排序结果）"""
        if node is None:
            node = self.root
        if node is None:
            return []
        return self.inorder(node.left) + [node.key] + self.inorder(node.right)

# 创建BST
bst = BinarySearchTree()
values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]
for v in values:
    bst.insert(v)

print(f"插入的值: {values}")
print(f"中序遍历（排序）: {bst.inorder()}")
print(f"最小值: {bst.find_min().key}")
print(f"最大值: {bst.find_max().key}")

# 搜索测试
search_values = [30, 55, 70]
for v in search_values:
    result = bst.search(v)
    print(f"搜索 {v}: {'找到' if result else '未找到'}")

# 删除测试
print(f"\n删除前的中序遍历: {bst.inorder()}")
bst.delete(20)
print(f"删除20后的中序遍历: {bst.inorder()}")
bst.delete(30)
print(f"删除30后的中序遍历: {bst.inorder()}")

# ============================================
# 5. 树的高度和节点数
# ============================================
print("\n=== 树的属性计算 ===")

def tree_height(node):
    """计算树的高度"""
    if node is None:
        return -1
    if isinstance(node, TreeNode):
        if not node.children:
            return 0
        return 1 + max(tree_height(child) for child in node.children)
    else:  # BinaryTreeNode
        return 1 + max(tree_height(node.left), tree_height(node.right))

def count_nodes(node):
    """计算节点数量"""
    if node is None:
        return 0
    if isinstance(node, TreeNode):
        return 1 + sum(count_nodes(child) for child in node.children)
    else:  # BinaryTreeNode
        return 1 + count_nodes(node.left) + count_nodes(node.right)

def count_leaves(node):
    """计算叶子节点数量"""
    if node is None:
        return 0
    if isinstance(node, TreeNode):
        if not node.children:
            return 1
        return sum(count_leaves(child) for child in node.children)
    else:  # BinaryTreeNode
        if node.left is None and node.right is None:
            return 1
        return count_leaves(node.left) + count_leaves(node.right)

print(f"公司组织树的高度: {tree_height(ceo)}")
print(f"公司组织树的节点数: {count_nodes(ceo)}")
print(f"公司组织树的叶子数: {count_leaves(ceo)}")

print(f"\n二叉树的高度: {tree_height(bt.root)}")
print(f"二叉树的节点数: {count_nodes(bt.root)}")
print(f"二叉树的叶子数: {count_leaves(bt.root)}")

# ============================================
# 6. 堆（优先队列）
# ============================================
print("\n=== 堆（优先队列）===")

class MinHeap:
    """最小堆"""
    def __init__(self):
        self.heap = []
    
    def parent(self, i):
        return (i - 1) // 2
    
    def left_child(self, i):
        return 2 * i + 1
    
    def right_child(self, i):
        return 2 * i + 2
    
    def insert(self, value):
        """插入元素"""
        self.heap.append(value)
        self._heapify_up(len(self.heap) - 1)
    
    def _heapify_up(self, i):
        """向上调整"""
        while i > 0 and self.heap[self.parent(i)] > self.heap[i]:
            self.heap[self.parent(i)], self.heap[i] = self.heap[i], self.heap[self.parent(i)]
            i = self.parent(i)
    
    def extract_min(self):
        """提取最小值"""
        if not self.heap:
            return None
        
        min_val = self.heap[0]
        self.heap[0] = self.heap[-1]
        self.heap.pop()
        self._heapify_down(0)
        
        return min_val
    
    def _heapify_down(self, i):
        """向下调整"""
        size = len(self.heap)
        smallest = i
        left = self.left_child(i)
        right = self.right_child(i)
        
        if left < size and self.heap[left] < self.heap[smallest]:
            smallest = left
        if right < size and self.heap[right] < self.heap[smallest]:
            smallest = right
        
        if smallest != i:
            self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
            self._heapify_down(smallest)
    
    def peek(self):
        """查看最小值"""
        return self.heap[0] if self.heap else None
    
    def display(self):
        """显示堆"""
        print(f"堆数组: {self.heap}")

# 测试堆
heap = MinHeap()
values = [5, 3, 8, 1, 4, 9, 2, 7]
for v in values:
    heap.insert(v)

print(f"插入的值: {values}")
heap.display()
print(f"最小值: {heap.peek()}")

print("\n依次提取最小值:")
while heap.heap:
    print(f"  提取: {heap.extract_min()}")

# ============================================
# 7. 实际应用：表达式树
# ============================================
print("\n=== 实际应用：表达式树 ===")

class ExpressionNode:
    """表达式树节点"""
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right
    
    def is_operator(self):
        return self.value in ['+', '-', '*', '/']
    
    def evaluate(self):
        """计算表达式的值"""
        if not self.is_operator():
            return float(self.value)
        
        left_val = self.left.evaluate()
        right_val = self.right.evaluate()
        
        if self.value == '+':
            return left_val + right_val
        elif self.value == '-':
            return left_val - right_val
        elif self.value == '*':
            return left_val * right_val
        elif self.value == '/':
            return left_val / right_val
    
    def to_infix(self):
        """转换为中缀表达式"""
        if not self.is_operator():
            return str(self.value)
        return f"({self.left.to_infix()} {self.value} {self.right.to_infix()})"
    
    def to_postfix(self):
        """转换为后缀表达式"""
        if not self.is_operator():
            return str(self.value)
        return f"{self.left.to_postfix()} {self.right.to_postfix()} {self.value}"

# 构建表达式树: (3 + 4) * 2
#       *
#      / \
#     +   2
#    / \
#   3   4

expr_tree = ExpressionNode('*',
    ExpressionNode('+',
        ExpressionNode('3'),
        ExpressionNode('4')
    ),
    ExpressionNode('2')
)

print(f"表达式树表示: (3 + 4) * 2")
print(f"中缀表达式: {expr_tree.to_infix()}")
print(f"后缀表达式: {expr_tree.to_postfix()}")
print(f"计算结果: {expr_tree.evaluate()}")

# 更复杂的表达式: ((10 - 5) * (3 + 2)) / 5
complex_expr = ExpressionNode('/',
    ExpressionNode('*',
        ExpressionNode('-',
            ExpressionNode('10'),
            ExpressionNode('5')
        ),
        ExpressionNode('+',
            ExpressionNode('3'),
            ExpressionNode('2')
        )
    ),
    ExpressionNode('5')
)

print(f"\n复杂表达式: ((10 - 5) * (3 + 2)) / 5")
print(f"中缀表达式: {complex_expr.to_infix()}")
print(f"计算结果: {complex_expr.evaluate()}")
```

输出结果：
```
=== 树节点的定义 ===
公司组织架构:
CEO
└── CTO
  └── 开发经理
    └── 开发者A
    └── 开发者B
  └── 测试经理
    └── 测试员
└── CFO
  └── 会计
└── CMO
  └── 市场专员

=== 二叉树 ===
二叉树结构:
        R: G
      R: C
    R: F
A
    L: E
      L: B
        L: D

=== 树的遍历 ===
前序遍历: A -> B -> D -> E -> C -> F -> G
中序遍历: D -> B -> E -> A -> F -> C -> G
后序遍历: D -> E -> B -> F -> G -> C -> A
层次遍历: A -> B -> C -> D -> E -> F -> G

通用树DFS: CEO -> CTO -> 开发经理 -> 开发者A -> 开发者B -> 测试经理 -> 测试员 -> CFO -> 会计 -> CMO -> 市场专员
通用树BFS: CEO -> CTO -> CFO -> CMO -> 开发经理 -> 测试经理 -> 会计 -> 市场专员 -> 开发者A -> 开发者B -> 测试员

=== 二叉搜索树 ===
插入的值: [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]
中序遍历（排序）: [10, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80]
最小值: 10
最大值: 80
搜索 30: 找到
搜索 55: 未找到
搜索 70: 找到

删除前的中序遍历: [10, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80]
删除20后的中序遍历: [10, 25, 30, 35, 40, 45, 50, 60, 70, 80]
删除30后的中序遍历: [10, 25, 35, 40, 45, 50, 60, 70, 80]

=== 树的属性计算 ===
公司组织树的高度: 3
公司组织树的节点数: 11
公司组织树的叶子数: 5

二叉树的高度: 2
二叉树的节点数: 7
二叉树的叶子数: 4

=== 堆（优先队列）===
插入的值: [5, 3, 8, 1, 4, 9, 2, 7]
堆数组: [1, 3, 2, 5, 4, 9, 8, 7]
最小值: 1

依次提取最小值:
  提取: 1
  提取: 2
  提取: 3
  提取: 4
  提取: 5
  提取: 7
  提取: 8
  提取: 9

=== 实际应用：表达式树 ===
表达式树表示: (3 + 4) * 2
中缀表达式: ((3 + 4) * 2)
后缀表达式: 3 4 + 2 *
计算结果: 14.0

复杂表达式: ((10 - 5) * (3 + 2)) / 5
中缀表达式: (((10 - 5) * (3 + 2)) / 5)
计算结果: 5.0
```

---

## 练习题

### 练习1：树的基本概念
给定以下树：
```
        A
       /|\
      B C D
     /|   |\
    E F   G H
```

a) 根节点是什么？
b) 叶子节点有哪些？
c) B的子节点有哪些？
d) E的父节点是谁？
e) 这棵树的高度是多少？
f) C的兄弟节点有哪些？

### 练习2：二叉树遍历
对以下二叉树进行各种遍历：
```
        1
       / \
      2   3
     / \   \
    4   5   6
```

写出：
a) 前序遍历结果
b) 中序遍历结果
c) 后序遍历结果
d) 层次遍历结果

### 练习3：二叉搜索树
将以下数字依次插入空的BST：15, 10, 20, 8, 12, 17, 25

a) 画出最终的BST
b) 写出中序遍历结果
c) 删除节点10后，树的结构如何变化？

### 练习4：编程实践
编写Python函数实现：

```python
def is_balanced(root):
    """判断二叉树是否平衡"""
    # 你的代码

def lowest_common_ancestor(root, p, q):
    """找到二叉树中两个节点的最近公共祖先"""
    # 你的代码

def serialize_tree(root):
    """将二叉树序列化为字符串"""
    # 你的代码

def deserialize_tree(data):
    """从字符串反序列化二叉树"""
    # 你的代码
```

### 练习5：实际应用
设计一个简单的文件系统模拟器：

- 用树表示文件和文件夹的层次结构
- 支持创建文件/文件夹
- 支持删除文件/文件夹
- 支持列出目录内容
- 支持查找文件

---

## 常见误区

### 误区1：混淆树和图
- **错误**：认为所有图都是树
- **正确**：树是特殊的图（连通且无环）
- **关键区别**：
  - 树：n个节点恰好有n-1条边，无环
  - 图：可以有环，边数不限

### 误区2：二叉树的左右子树混淆
- **错误**：认为左子树和右子树可以随意交换
- **正确**：在二叉树中，左右是有区别的
  - 特别是在BST中，左 < 根 < 右
- **注意**：普通树中子节点通常是无序的

### 误区3：树的高度计算
- **错误**：认为高度是从根开始数的层数
- **正确**：高度的定义有多种
  - 有些定义：单个节点高度为0
  - 有些定义：单个节点高度为1
- **建议**：明确题目使用哪种定义

### 误区4：BST的不平衡问题
- **错误**：认为BST总是高效的
- **正确**：如果插入顺序不好，BST可能退化成链表
  - 例如：按升序插入1,2,3,4,5
- **解决**：使用平衡BST（AVL树、红黑树）

### 误区5：递归终止条件的遗漏
- **错误**：在树的递归操作中忘记处理空节点
- **正确**：总是先检查 `if node is None`
- **后果**：可能导致无限递归或运行时错误

---

## 小结

本章我们学习了：
1. ✅ 树的基本概念和术语
2. ✅ 二叉树及其遍历方法
3. ✅ 二叉搜索树（BST）的操作
4. ✅ 堆和优先队列
5. ✅ 树在实际应用中的作用

树是计算机科学中最基础也最重要的数据结构之一。掌握树的概念和操作，将为学习更高级的数据结构和算法打下坚实基础。

恭喜你完成了离散数学十章节的学习！从集合论到树结构，你已经掌握了离散数学的核心知识。这些知识将在计算机科学、数学、逻辑推理等领域发挥重要作用！

---

*提示：多动手实现树的各种操作，特别是递归方法，这是理解树的关键！*

## 结语

这本教程涵盖了离散数学的十个核心主题：

1. **集合论基础** - 数学的语言
2. **命题逻辑** - 推理的基础
3. **谓词逻辑** - 量化的力量
4. **证明方法** - 严谨的艺术
5. **关系理论** - 连接的数学
6. **函数** - 映射的世界
7. **组合数学** - 计数的智慧
8. **布尔代数** - 逻辑的电路
9. **图论基础** - 网络的科学
10. **树结构** - 层次的秩序

希望这本教程能帮助你建立扎实的离散数学基础，为后续学习算法、数据结构、人工智能等课程做好准备。记住，数学不是死记硬背，而是理解思想、掌握方法、灵活应用。祝你学习愉快！
