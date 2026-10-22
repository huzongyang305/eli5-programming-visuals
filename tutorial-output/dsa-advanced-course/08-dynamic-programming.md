# 第八章：动态规划基础（Dynamic Programming Basics）

## 本节知识框架

### 学习目标
- 理解动态规划的核心思想及其与递归、贪心的区别
- 掌握记忆化搜索（自顶向下）和表格法（自底向上）两种实现方式
- 理解最优子结构和重叠子问题两个关键特征
- 能够通过经典例题（斐波那契数列、爬楼梯）理解 DP 的基本流程
- 能够识别哪些问题适合用动态规划解决

### 前置知识
- 递归函数的基本概念及执行过程
- 时间复杂度和空间复杂度的分析
- 数组和哈希表的基本操作
- 数学归纳法的基本思想
- 函数调用栈的工作原理

### 复习清单
- [ ] 能否解释什么是"重叠子问题"？
- [ ] 能否解释什么是"最优子结构"？
- [ ] 是否理解记忆化搜索和表格法的区别？
- [ ] 能否手动推导斐波那契数列的 DP 解法？
- [ ] 能否将递归解法转换为 DP 解法？
- [ ] 是否理解 DP 的空间优化技巧？

---

## 核心概念定义

| 术语 | 英文 | 定义 |
|------|------|------|
| 动态规划 | Dynamic Programming | 通过存储子问题的解来避免重复计算的方法 |
| 记忆化搜索 | Memoization | 自顶向下的 DP，用缓存存储已计算的子问题结果 |
| 表格法 | Tabulation | 自底向上的 DP，按顺序填充表格 |
| 最优子结构 | Optimal Substructure | 问题的最优解包含子问题的最优解 |
| 重叠子问题 | Overlapping Subproblems | 不同路径会重复求解相同的子问题 |
| 状态转移方程 | State Transition Equation | 描述状态之间关系的数学表达式 |

---

## 原理与运行机制

### 类比理解：建造楼梯

想象你要建造一座有 N 级台阶的楼梯。每次你可以选择建 1 级或 2 级台阶。问题是：**有多少种不同的建造方案？**

**暴力递归的问题：**
如果你直接用递归来计算，会发现很多子问题被重复计算。例如，计算 f(5) 需要 f(4) 和 f(3)，而计算 f(4) 又需要 f(3) 和 f(2)。f(3) 被计算了两次！当 N 很大时，重复计算呈指数级增长。

**动态规划的解决方案：**
就像聪明的建筑工人，你会准备一个笔记本，每算出一个台阶的方案数就记录下来。下次需要时，直接查笔记本，不用重新计算。这就是**记忆化**。

或者，你可以从第 1 级台阶开始，逐步计算到第 N 级，每一步都依赖前面已经算好的结果。这就是**表格法**。

### 动态规划的两大特征

#### 1. 最优子结构（Optimal Substructure）

**定义：** 如果一个问题的最优解可以由其子问题的最优解组合而成，则该问题具有最优子结构。

**举例：** 
- 最短路径问题：从 A 到 C 的最短路径如果经过 B，那么 A→B 和 B→C 也必须是最短路径
- 斐波那契数列：f(n) = f(n-1) + f(n-2)，当前值由前两个值决定

**非最优子结构的例子：**
- 最长简单路径问题（图中不重复顶点的路径）：子路径不一定是最优的

#### 2. 重叠子问题（Overlapping Subproblems）

**定义：** 在递归求解过程中，相同的子问题会被多次计算。

**举例：**
- 斐波那契数列：计算 f(5) 时，f(3) 会被计算多次
- 组合问题：计算 C(n,k) 时，许多子问题会重复出现

**非重叠子问题的例子：**
- 二分查找：每次只处理一个子问题，没有重叠
- 归并排序：子问题互不相交

**关键洞察：** 只有同时具备这两个特征的问题，才适合用动态规划解决。

### 两种实现方式对比

#### 记忆化搜索（自顶向下，Top-Down）

**思路：** 从原问题出发，递归地求解子问题，用哈希表或数组缓存结果。

**优点：**
- 直观，容易从递归解法转换而来
- 只计算需要的子问题，不会浪费计算

**缺点：**
- 递归调用有函数调用开销
- 可能因递归深度过大导致栈溢出

#### 表格法（自底向上，Bottom-Up）

**思路：** 从最小的子问题开始，按顺序填充表格，直到求出原问题的解。

**优点：**
- 无递归开销，效率更高
- 可以进行空间优化

**缺点：**
- 需要确定正确的计算顺序
- 可能计算了一些不需要的子问题

---

## 典型应用场景

| 应用场景 | 问题类型 | 说明 |
|----------|----------|------|
| 斐波那契数列 | 线性 DP | 最基础的 DP 入门题 |
| 爬楼梯问题 | 线性 DP | 与斐波那契本质相同 |
| 最长公共子序列 | 二维 DP | 字符串匹配的经典问题 |
| 背包问题 | 二维 DP | 资源分配的经典模型 |
| 编辑距离 | 二维 DP | 字符串相似度计算 |
| 矩阵链乘法 | 区间 DP | 优化计算顺序 |

---

## 代码示例

### 经典例题 1：斐波那契数列

**问题描述：** 计算斐波那契数列的第 n 项，其中 f(0)=0, f(1)=1, f(n)=f(n-1)+f(n-2)。

#### C++ 实现

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

// 方法 1：暴力递归（效率极低，仅用于对比）
int fib_brute_force(int n) {
    if (n <= 1) return n;
    return fib_brute_force(n - 1) + fib_brute_force(n - 2);
}

// 方法 2：记忆化搜索（自顶向下）
unordered_map<int, int> memo;

int fib_memo(int n) {
    if (n <= 1) return n;
    
    // 检查缓存
    if (memo.find(n) != memo.end()) {
        return memo[n];
    }
    
    // 计算并缓存
    memo[n] = fib_memo(n - 1) + fib_memo(n - 2);
    return memo[n];
}

// 方法 3：表格法（自底向上）
int fib_tabulation(int n) {
    if (n <= 1) return n;
    
    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// 方法 4：空间优化（只保留前两个值）
int fib_optimized(int n) {
    if (n <= 1) return n;
    
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}

int main() {
    int n = 10;
    
    cout << "暴力递归: f(" << n << ") = " << fib_brute_force(n) << endl;
    cout << "记忆化搜索: f(" << n << ") = " << fib_memo(n) << endl;
    cout << "表格法: f(" << n << ") = " << fib_tabulation(n) << endl;
    cout << "空间优化: f(" << n << ") = " << fib_optimized(n) << endl;
    
    return 0;
}
```

#### Java 实现

```java
import java.util.HashMap;
import java.util.Map;

public class FibonacciDP {
    
    // 方法 1：暴力递归
    public static int fibBruteForce(int n) {
        if (n <= 1) return n;
        return fibBruteForce(n - 1) + fibBruteForce(n - 2);
    }
    
    // 方法 2：记忆化搜索
    private static Map<Integer, Integer> memo = new HashMap<>();
    
    public static int fibMemo(int n) {
        if (n <= 1) return n;
        
        if (memo.containsKey(n)) {
            return memo.get(n);
        }
        
        int result = fibMemo(n - 1) + fibMemo(n - 2);
        memo.put(n, result);
        return result;
    }
    
    // 方法 3：表格法
    public static int fibTabulation(int n) {
        if (n <= 1) return n;
        
        int[] dp = new int[n + 1];
        dp[0] = 0;
        dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
    }
    
    // 方法 4：空间优化
    public static int fibOptimized(int n) {
        if (n <= 1) return n;
        
        int prev2 = 0, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        
        return prev1;
    }
    
    public static void main(String[] args) {
        int n = 10;
        
        System.out.println("暴力递归: f(" + n + ") = " + fibBruteForce(n));
        System.out.println("记忆化搜索: f(" + n + ") = " + fibMemo(n));
        System.out.println("表格法: f(" + n + ") = " + fibTabulation(n));
        System.out.println("空间优化: f(" + n + ") = " + fibOptimized(n));
    }
}
```

### 经典例题 2：爬楼梯问题

**问题描述：** 你正在爬楼梯，每次可以爬 1 级或 2 级台阶。如果有 n 级台阶，有多少种不同的爬法？

**分析：** 这与斐波那契数列本质相同。到达第 n 级台阶的方法数 = 到达第 n-1 级的方法数 + 到达第 n-2 级的方法数。

#### C++ 实现

```cpp
#include <iostream>
#include <vector>
using namespace std;

// 表格法实现
int climbStairs(int n) {
    if (n <= 2) return n;
    
    vector<int> dp(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// 空间优化版本
int climbStairsOptimized(int n) {
    if (n <= 2) return n;
    
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}

int main() {
    int n = 5;
    cout << "爬 " << n << " 级台阶的方法数：" << climbStairs(n) << endl;
    cout << "空间优化版本：" << climbStairsOptimized(n) << endl;
    
    return 0;
}
```

#### Java 实现

```java
public class ClimbingStairs {
    
    // 表格法实现
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
    }
    
    // 空间优化版本
    public static int climbStairsOptimized(int n) {
        if (n <= 2) return n;
        
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        
        return prev1;
    }
    
    public static void main(String[] args) {
        int n = 5;
        System.out.println("爬 " + n + " 级台阶的方法数：" + climbStairs(n));
        System.out.println("空间优化版本：" + climbStairsOptimized(n));
    }
}
```

---

## 复杂度或性能分析

| 方法 | 时间复杂度 | 空间复杂度 | 说明 |
|------|------------|------------|------|
| 暴力递归 | O(2ⁿ) | O(n) | 指数级，不可接受 |
| 记忆化搜索 | O(n) | O(n) | 每个子问题只计算一次 |
| 表格法 | O(n) | O(n) | 顺序填充表格 |
| 空间优化 | O(n) | O(1) | 只保留必要的前驱状态 |

**斐波那契数列的性能对比（n=40）：**
- 暴力递归：约 10 亿次运算，耗时数秒
- 记忆化/表格法：40 次运算，耗时微秒级
- **性能提升超过 10⁷ 倍！**

---

## 常见误区与易错点

| 误区 | 正确理解 | 示例说明 |
|------|----------|----------|
| 所有递归问题都可以用 DP 优化 | 只有具备重叠子问题的递归才能用 DP | 二分查找没有重叠子问题 |
| 记忆化和表格法完全等价 | 两者计算顺序不同，可能影响效率 | 表格法可能计算不必要的子问题 |
| DP 数组必须开多大就开多大 | 可以通过滚动数组优化空间 | 斐波那契只需保留前两个值 |
| 状态转移方程可以随意写 | 必须基于问题的实际含义推导 | 错误的转移方程会导致错误结果 |
| DP 只能解决最优化问题 | DP 也可以解决计数问题、存在性问题 | 斐波那契是计数问题 |

---

## 与其他知识点的关系

- **与递归的关系**：DP 可以看作是优化的递归，通过缓存避免重复计算。
- **与贪心算法的关系**：贪心每一步做局部最优选择，DP 考虑所有可能的选择；贪心更高效但适用范围更窄。
- **与分治法的关系**：分治法的子问题互不相交，DP 的子问题重叠；两者都利用子问题的解构建原问题的解。
- **与图算法的关系**：最短路径算法（如 Floyd-Warshall）本质上是 DP 的应用。
- **与数学归纳法的关系**：DP 的状态转移类似于数学归纳法的递推步骤。

---

## 自测题与参考答案

### 题目 1
**问：** 为什么暴力递归求解斐波那契数列的时间复杂度是 O(2ⁿ)？请画出 n=5 时的递归树。

**答：** 
递归树如下：
```
                    f(5)
                   /    \
                f(4)      f(3)
               /    \     /    \
            f(3)   f(2)  f(2)  f(1)
           /    \
        f(2)   f(1)
```
可以看到 f(3) 被计算了 2 次，f(2) 被计算了 3 次。每一层的节点数约为上一层的 2 倍，总节点数约为 2ⁿ，因此时间复杂度为 O(2ⁿ)。

### 题目 2
**问：** 记忆化搜索和表格法各有什么优缺点？在什么情况下应该选择其中一种？

**答：** 
- **记忆化搜索优点**：直观，只计算需要的子问题；**缺点**：递归开销，可能栈溢出
- **表格法优点**：无递归开销，可空间优化；**缺点**：可能计算不必要的子问题
- **选择建议**：
  - 子问题依赖关系复杂 → 记忆化搜索
  - 需要空间优化 → 表格法
  - 递归深度可能很大 → 表格法
  - 初学者理解 → 记忆化搜索

### 题目 3
**问：** 爬楼梯问题中，如果每次可以爬 1、2 或 3 级台阶，状态转移方程是什么？请写出表格法实现。

**答：** 
状态转移方程：`dp[i] = dp[i-1] + dp[i-2] + dp[i-3]`

```cpp
int climbStairs3(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    if (n == 2) return 2;
    if (n == 3) return 4;
    
    vector<int> dp(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    dp[3] = 4;
    
    for (int i = 4; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2] + dp[i - 3];
    }
    
    return dp[n];
}
```

---

## 考点精讲

### 考点 1：识别 DP 问题的特征
考试中常给出一个问题，要求判断是否适合用动态规划解决。

**判断标准：**
1. 是否可以分解为子问题？
2. 子问题是否重叠？
3. 是否具有最优子结构？

**解题技巧：** 尝试写出递归解法，观察是否有重复计算的子问题。

### 考点 2：状态转移方程的推导
这是 DP 问题的核心，需要根据问题含义推导正确的转移方程。

**推导步骤：**
1. 定义状态：dp[i] 表示什么？
2. 找出状态之间的关系：dp[i] 如何由之前的状态得到？
3. 确定边界条件：dp[0], dp[1] 等初始值是多少？

**解题技巧：** 从小规模例子入手，手动计算几个值，寻找规律。

### 考点 3：空间优化技巧
许多 DP 问题可以通过滚动数组或只保留必要状态来优化空间。

**常见优化：**
- 斐波那契：O(n) → O(1)，只保留前两个值
- 一维 DP：如果 dp[i] 只依赖 dp[i-1]，可以用单个变量
- 二维 DP：如果 dp[i][j] 只依赖上一行，可以用两个一维数组

**解题技巧：** 分析状态依赖关系，确定最少需要保留多少历史状态。

---

## 术语速查

| 中文术语 | 英文术语 | 简要说明 |
|----------|----------|----------|
| 动态规划 | Dynamic Programming | 存储子问题解避免重复计算 |
| 记忆化 | Memoization | 自顶向下的缓存策略 |
| 表格法 | Tabulation | 自底向上的填表策略 |
| 状态转移 | State Transition | 状态之间的递推关系 |
| 最优子结构 | Optimal Substructure | 最优解包含子问题最优解 |
| 重叠子问题 | Overlapping Subproblems | 子问题被重复计算 |

---

## 参考资料与复核

1. 《算法导论》（Introduction to Algorithms）第 15 章 - Thomas H. Cormen 等
2. 《算法竞赛入门经典》- 刘汝佳
3. GeeksforGeeks: Dynamic Programming - https://www.geeksforgeeks.org/dynamic-programming/
4. LeetCode DP 专题：https://leetcode.com/tag/dynamic-programming/
5. MIT OpenCourseWare: Introduction to Algorithms - Lecture on Dynamic Programming

**复核日期：** 2026-10-19  
**作者：** DSA Advanced Course Team  
**版本：** 1.0
