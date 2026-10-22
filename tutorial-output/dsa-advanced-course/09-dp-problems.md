# 第九章：经典动态规划问题（Classic DP Problems）

## 本节知识框架

### 学习目标
- 掌握 0/1 背包问题的状态定义和转移方程
- 理解最长公共子序列（LCS）问题的二维 DP 解法
- 掌握编辑距离（Levenshtein Distance）问题的求解方法
- 能够绘制 DP 表格并手动模拟计算过程
- 理解这些经典问题的实际应用价值

### 前置知识
- 动态规划的基本概念（第 8 章）
- 二维数组的操作
- 字符串的基本操作
- 组合优化的基本思想
- 递归与回溯的基本概念

### 复习清单
- [ ] 能否写出 0/1 背包的状态转移方程？
- [ ] 是否理解 LCS 问题中 dp[i][j] 的含义？
- [ ] 能否手动填写编辑距离的 DP 表格？
- [ ] 是否理解背包问题的空间优化技巧？
- [ ] 能否区分 0/1 背包和完全背包的区别？
- [ ] 是否理解 LCS 与最长公共子串的区别？

---

## 核心概念定义

| 术语 | 英文 | 定义 |
|------|------|------|
| 0/1 背包 | 0/1 Knapsack | 每个物品只能选或不选，求最大价值 |
| 最长公共子序列 | Longest Common Subsequence (LCS) | 两个序列中最长的公共子序列（不要求连续） |
| 编辑距离 | Edit Distance | 将一个字符串转换为另一个字符串所需的最少操作数 |
| 子序列 | Subsequence | 从原序列中删除若干元素后得到的序列（保持相对顺序） |
| 子串 | Substring | 原序列中连续的一段 |
| Levenshtein 距离 | Levenshtein Distance | 允许插入、删除、替换三种操作的编辑距离 |

---

## 原理与运行机制

### 类比理解 1：0/1 背包——购物决策

想象你去超市购物，购物车容量有限（背包容量 W），货架上有各种商品（物品），每件商品有价格（重量 w）和价值（效用 v）。你的目标是：**在不超过购物车容量的前提下，最大化所购商品的总价值**。

**关键约束：** 每件商品只能买或不买（0/1 选择），不能买半件。

**DP 思路：** 考虑前 i 件商品，在容量为 j 的情况下，最大价值是多少？对于第 i 件商品，你有两个选择：
- **不买**：价值等于前 i-1 件商品在容量 j 下的最大价值
- **买**：价值等于前 i-1 件商品在容量 j-w[i] 下的最大价值 + v[i]

取两者的最大值！

### 类比理解 2：LCS——找共同爱好

你和朋友各自列出了喜欢的电影清单（两个序列），你们想找出**共同喜欢的电影**，且保持原来的排序。这就是 LCS 问题。

**关键洞察：** 如果两部电影的最后一部相同，那么它一定在 LCS 中；如果不同，则 LCS 要么不包含 A 的最后一部，要么不包含 B 的最后一部。

**DP 思路：** dp[i][j] 表示 A 的前 i 个元素和 B 的前 j 个元素的 LCS 长度。
- 如果 A[i] == B[j]：dp[i][j] = dp[i-1][j-1] + 1
- 如果 A[i] != B[j]：dp[i][j] = max(dp[i-1][j], dp[i][j-1])

### 类比理解 3：编辑距离——拼写纠错

当你输入一个单词时，输入法会猜测你可能想输入的正确单词。它通过计算**最少需要多少次操作**（插入、删除、替换）才能将你的输入变成正确单词。这就是编辑距离。

**DP 思路：** dp[i][j] 表示将字符串 A 的前 i 个字符转换为字符串 B 的前 j 个字符所需的最少操作数。
- 如果 A[i] == B[j]：不需要操作，dp[i][j] = dp[i-1][j-1]
- 如果 A[i] != B[j]：可以选择插入、删除或替换，取最小值

---

## 典型应用场景

| 应用场景 | 适用算法 | 说明 |
|----------|----------|------|
| 资源分配优化 | 0/1 背包 | 预算有限的情况下最大化收益 |
| 投资组合选择 | 0/1 背包 | 选择股票组合以最大化回报 |
| DNA 序列比对 | LCS | 生物信息学中比较基因序列 |
| 版本控制差异 | LCS | Git diff 算法的核心 |
| 拼写检查 | 编辑距离 | 自动纠正拼写错误 |
|  plagiarism 检测 | LCS / 编辑距离 | 检测文本相似度 |

---

## 代码示例

### 问题 1：0/1 背包问题

**问题描述：** 给定 n 个物品，每个物品有重量 w[i] 和价值 v[i]，背包容量为 W。求在不超过背包容量的前提下，能获得的最大价值。

#### C++ 实现

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 方法 1：二维 DP 表格
int knapsack_2d(int n, int W, vector<int>& w, vector<int>& v) {
    // dp[i][j] 表示前 i 个物品，容量为 j 时的最大价值
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= W; j++) {
            // 不选第 i 个物品
            dp[i][j] = dp[i - 1][j];
            
            // 选第 i 个物品（如果容量允许）
            if (j >= w[i - 1]) {
                dp[i][j] = max(dp[i][j], dp[i - 1][j - w[i - 1]] + v[i - 1]);
            }
        }
    }
    
    return dp[n][W];
}

// 方法 2：一维 DP（空间优化）
int knapsack_1d(int n, int W, vector<int>& w, vector<int>& v) {
    vector<int> dp(W + 1, 0);
    
    for (int i = 0; i < n; i++) {
        // 注意：必须从大到小遍历，避免重复选择同一物品
        for (int j = W; j >= w[i]; j--) {
            dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
        }
    }
    
    return dp[W];
}

int main() {
    int n = 4, W = 7;
    vector<int> w = {1, 3, 4, 5};
    vector<int> v = {1, 4, 5, 7};
    
    cout << "最大价值（二维DP）：" << knapsack_2d(n, W, w, v) << endl;
    cout << "最大价值（一维DP）：" << knapsack_1d(n, W, w, v) << endl;
    
    return 0;
}
```

#### Java 实现

```java
public class KnapsackProblem {
    
    // 方法 1：二维 DP 表格
    public static int knapsack2D(int n, int W, int[] w, int[] v) {
        int[][] dp = new int[n + 1][W + 1];
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j <= W; j++) {
                // 不选第 i 个物品
                dp[i][j] = dp[i - 1][j];
                
                // 选第 i 个物品（如果容量允许）
                if (j >= w[i - 1]) {
                    dp[i][j] = Math.max(dp[i][j], dp[i - 1][j - w[i - 1]] + v[i - 1]);
                }
            }
        }
        
        return dp[n][W];
    }
    
    // 方法 2：一维 DP（空间优化）
    public static int knapsack1D(int n, int W, int[] w, int[] v) {
        int[] dp = new int[W + 1];
        
        for (int i = 0; i < n; i++) {
            // 注意：必须从大到小遍历
            for (int j = W; j >= w[i]; j--) {
                dp[j] = Math.max(dp[j], dp[j - w[i]] + v[i]);
            }
        }
        
        return dp[W];
    }
    
    public static void main(String[] args) {
        int n = 4, W = 7;
        int[] w = {1, 3, 4, 5};
        int[] v = {1, 4, 5, 7};
        
        System.out.println("最大价值（二维DP）：" + knapsack2D(n, W, w, v));
        System.out.println("最大价值（一维DP）：" + knapsack1D(n, W, w, v));
    }
}
```

**DP 表格可视化（二维方法）：**

```
物品: (w=1,v=1), (w=3,v=4), (w=4,v=5), (w=5,v=7)
容量 W = 7

     j=0  1  2  3  4  5  6  7
i=0   0   0  0  0  0  0  0  0
i=1   0   1  1  1  1  1  1  1
i=2   0   1  1  4  5  5  5  5
i=3   0   1  1  4  5  6  6  9
i=4   0   1  1  4  5  7  8  9

最大价值 = dp[4][7] = 9
```

### 问题 2：最长公共子序列（LCS）

**问题描述：** 给定两个字符串 text1 和 text2，返回它们的最长公共子序列的长度。

#### C++ 实现

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int longestCommonSubsequence(string text1, string text2) {
    int m = text1.length();
    int n = text2.length();
    
    // dp[i][j] 表示 text1[0..i-1] 和 text2[0..j-1] 的 LCS 长度
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                // 字符相同，LCS 长度加 1
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                // 字符不同，取较大值
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}

// 可选：回溯获取具体的 LCS 字符串
string getLCS(string text1, string text2) {
    int m = text1.length();
    int n = text2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    // 先填充 DP 表格
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // 回溯获取 LCS
    string lcs = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (text1[i - 1] == text2[j - 1]) {
            lcs = text1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return lcs;
}

int main() {
    string text1 = "ABCBDAB";
    string text2 = "BDCABA";
    
    int lcsLen = longestCommonSubsequence(text1, text2);
    string lcs = getLCS(text1, text2);
    
    cout << "LCS 长度：" << lcsLen << endl;
    cout << "LCS 字符串：" << lcs << endl;
    
    return 0;
}
```

#### Java 实现

```java
public class LongestCommonSubsequence {
    
    public static int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[m][n];
    }
    
    // 可选：回溯获取具体的 LCS 字符串
    public static String getLCS(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        
        // 先填充 DP 表格
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        // 回溯获取 LCS
        StringBuilder lcs = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                lcs.insert(0, text1.charAt(i - 1));
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs.toString();
    }
    
    public static void main(String[] args) {
        String text1 = "ABCBDAB";
        String text2 = "BDCABA";
        
        int lcsLen = longestCommonSubsequence(text1, text2);
        String lcs = getLCS(text1, text2);
        
        System.out.println("LCS 长度：" + lcsLen);
        System.out.println("LCS 字符串：" + lcs);
    }
}
```

**DP 表格可视化：**

```
text1 = "ABCBDAB", text2 = "BDCABA"

       ""  B  D  C  A  B  A
""      0  0  0  0  0  0  0
A       0  0  0  0  1  1  1
B       0  1  1  1  1  2  2
C       0  1  1  2  2  2  2
B       0  1  1  2  2  3  3
D       0  1  2  2  2  3  3
A       0  1  2  2  3  3  4
B       0  1  2  2  3  4  4

LCS 长度 = dp[7][6] = 4
LCS 字符串 = "BCBA" 或 "BDAB"
```

### 问题 3：编辑距离（Levenshtein Distance）

**问题描述：** 给定两个字符串 word1 和 word2，计算将 word1 转换为 word2 所需的最少操作数。允许的操作：插入一个字符、删除一个字符、替换一个字符。

#### C++ 实现

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int minDistance(string word1, string word2) {
    int m = word1.length();
    int n = word2.length();
    
    // dp[i][j] 表示将 word1[0..i-1] 转换为 word2[0..j-1] 的最少操作数
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    // 初始化边界条件
    for (int i = 0; i <= m; i++) {
        dp[i][0] = i; // 删除 i 个字符
    }
    for (int j = 0; j <= n; j++) {
        dp[0][j] = j; // 插入 j 个字符
    }
    
    // 填充 DP 表格
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                // 字符相同，不需要操作
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // 取三种操作的最小值
                dp[i][j] = 1 + min({
                    dp[i - 1][j],     // 删除
                    dp[i][j - 1],     // 插入
                    dp[i - 1][j - 1]  // 替换
                });
            }
        }
    }
    
    return dp[m][n];
}

int main() {
    string word1 = "horse";
    string word2 = "ros";
    
    int distance = minDistance(word1, word2);
    cout << "编辑距离：" << distance << endl;
    
    return 0;
}
```

#### Java 实现

```java
public class EditDistance {
    
    public static int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        
        int[][] dp = new int[m + 1][n + 1];
        
        // 初始化边界条件
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        // 填充 DP 表格
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j],     // 删除
                        Math.min(
                            dp[i][j - 1],     // 插入
                            dp[i - 1][j - 1]  // 替换
                        )
                    );
                }
            }
        }
        
        return dp[m][n];
    }
    
    public static void main(String[] args) {
        String word1 = "horse";
        String word2 = "ros";
        
        int distance = minDistance(word1, word2);
        System.out.println("编辑距离：" + distance);
    }
}
```

**DP 表格可视化：**

```
word1 = "horse", word2 = "ros"

       ""  r  o  s
""      0  1  2  3
h       1  1  2  3
o       2  2  1  2
r       3  2  2  2
s       4  3  3  2
e       5  4  4  3

编辑距离 = dp[5][3] = 3

操作步骤：
1. horse → rorse (将 'h' 替换为 'r')
2. rorse → rose (删除 'r')
3. rose → ros (删除 'e')
```

---

## 复杂度或性能分析

| 问题 | 时间复杂度 | 空间复杂度 | 说明 |
|------|------------|------------|------|
| 0/1 背包（二维） | O(nW) | O(nW) | n 为物品数，W 为容量 |
| 0/1 背包（一维） | O(nW) | O(W) | 空间优化版本 |
| LCS | O(mn) | O(mn) | m, n 为两字符串长度 |
| 编辑距离 | O(mn) | O(mn) | m, n 为两字符串长度 |
| 编辑距离（空间优化） | O(mn) | O(min(m,n)) | 只保留两行 |

**注意事项：**
- 0/1 背包的时间复杂度依赖于容量 W，当 W 很大时效率较低
- LCS 和编辑距离都是典型的二维 DP，无法进一步优化时间复杂度
- 空间优化可以通过滚动数组实现，但可能牺牲代码可读性

---

## 常见误区与易错点

| 误区 | 正确理解 | 示例说明 |
|------|----------|----------|
| 0/1 背包一维优化可以正序遍历 | 必须逆序遍历，否则会变成完全背包 | 正序遍历会导致同一物品被多次选择 |
| LCS 要求子串连续 | LCS 是子序列，不要求连续 | "ACE" 是 "ABCDE" 的子序列 |
| 编辑距离只能替换 | 编辑距离包括插入、删除、替换三种操作 | 仅允许替换的是 Hamming 距离 |
| DP 表格行列对应关系搞反 | 需明确 dp[i][j] 的定义 | 通常 i 对应第一个字符串/物品 |
| 边界条件初始化错误 | 需根据问题含义正确初始化 | 编辑距离中 dp[i][0]=i, dp[0][j]=j |

---

## 与其他知识点的关系

- **与贪心算法的关系**：背包问题的贪心解法（按单位价值排序）不能保证最优解，必须用 DP。
- **与字符串算法的关系**：LCS 和编辑距离是字符串匹配和处理的核心算法。
- **与生物信息学的关系**：LCS 用于 DNA/蛋白质序列比对，编辑距离用于进化树构建。
- **与自然语言处理的关系**：编辑距离用于拼写检查、机器翻译评估等。
- **与版本控制的关系**：Git 的 diff 算法基于 LCS 思想。

---

## 自测题与参考答案

### 题目 1
**问：** 0/1 背包问题中，为什么一维 DP 优化时必须逆序遍历容量？如果正序遍历会发生什么？

**答：** 
逆序遍历是为了保证每个物品只被选择一次。在一维 DP 中，`dp[j]` 依赖 `dp[j-w[i]]`，如果正序遍历，`dp[j-w[i]]` 可能已经被当前物品更新过，导致同一物品被多次选择，这就变成了**完全背包**问题。

例如：物品重量 w=2，价值 v=3，容量 W=4。
- 逆序：dp[4] 依赖 dp[2]（未更新），物品只选一次
- 正序：dp[2] 先被更新，dp[4] 依赖已更新的 dp[2]，物品被选了两次

### 题目 2
**问：** LCS 问题和最长公共子串问题有什么区别？请举例说明。

**答：** 
- **LCS（子序列）**：不要求连续，只需保持相对顺序
- **最长公共子串**：要求连续

例如：text1="ABCDEF", text2="ACEF"
- LCS = "ACEF"（长度 4），不是连续的
- 最长公共子串 = "EF"（长度 2），必须连续

LCS 用二维 DP，子串可以用一维 DP 或滑动窗口解决。

### 题目 3
**问：** 编辑距离问题中，如果只允许插入和删除操作（不允许替换），状态转移方程如何修改？

**答：** 
如果不允许替换，当字符不同时，只能选择插入或删除：

```cpp
if (word1[i - 1] == word2[j - 1]) {
    dp[i][j] = dp[i - 1][j - 1];
} else {
    dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1]);
    // 去掉了 dp[i-1][j-1]（替换操作）
}
```

这实际上等价于：编辑距离 = len(word1) + len(word2) - 2 * LCS(word1, word2)

---

## 考点精讲

### 考点 1：0/1 背包的状态转移方程
考试中常要求写出 0/1 背包的状态转移方程，并解释其含义。

**标准形式：**
```
dp[i][j] = max(dp[i-1][j], dp[i-1][j-w[i]] + v[i])  (如果 j >= w[i])
dp[i][j] = dp[i-1][j]                                  (如果 j < w[i])
```

**解题技巧：** 明确 dp[i][j] 的定义，分"选"和"不选"两种情况讨论。

### 考点 2：LCS 的回溯方法
不仅要求 LCS 长度，还要求输出具体的 LCS 字符串。

**回溯步骤：**
1. 从 dp[m][n] 开始
2. 如果 text1[i-1] == text2[j-1]，该字符在 LCS 中，向左上移动
3. 否则，向 dp 值较大的方向移动（上或左）
4. 直到 i=0 或 j=0

**解题技巧：** 注意回溯方向，最终结果需要反转。

### 考点 3：编辑距离的边界条件
编辑距离的初始化是易错点。

**边界条件：**
- dp[i][0] = i：将 word1 的前 i 个字符全部删除
- dp[0][j] = j：向空字符串插入 word2 的前 j 个字符

**解题技巧：** 画出小规模例子（如 "" 到 "a"），验证边界条件是否正确。

---

## 术语速查

| 中文术语 | 英文术语 | 简要说明 |
|----------|----------|----------|
| 0/1 背包 | 0/1 Knapsack | 每个物品选或不选 |
| 完全背包 | Unbounded Knapsack | 每个物品可选无限次 |
| 子序列 | Subsequence | 不要求连续的子集 |
| 子串 | Substring | 连续的子集 |
| 编辑距离 | Edit Distance | 字符串转换的最少操作数 |
| 滚动数组 | Rolling Array | 空间优化技巧 |

---

## 参考资料与复核

1. 《算法导论》（Introduction to Algorithms）第 15-16 章 - Thomas H. Cormen 等
2. 《算法竞赛入门经典》- 刘汝佳
3. GeeksforGeeks: 0/1 Knapsack Problem - https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/
4. GeeksforGeeks: Longest Common Subsequence - https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/
5. GeeksforGeeks: Edit Distance - https://www.geeksforgeeks.org/edit-distance-dp-5/
6. LeetCode DP 专题：https://leetcode.com/tag/dynamic-programming/

**复核日期：** 2026-10-19  
**作者：** DSA Advanced Course Team  
**版本：** 1.0
