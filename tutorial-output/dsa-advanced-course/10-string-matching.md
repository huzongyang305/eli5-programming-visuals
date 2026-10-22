# 第十章：字符串匹配算法（String Matching Algorithms）

## 本节知识框架

### 学习目标
- 理解字符串匹配问题的定义及其在实际应用中的重要性
- 掌握暴力匹配算法的原理及时间复杂度分析
- 深入理解 KMP 算法的核心思想及失败函数（部分匹配表）的构建
- 能够手动计算部分匹配表并模拟 KMP 算法的执行过程
- 理解 KMP 算法相比暴力匹配的效率提升原理

### 前置知识
- 字符串的基本操作（索引、子串、长度）
- 数组和指针的基本概念
- 时间复杂度和空间复杂度的分析
- 前缀和后缀的定义
- 模式匹配的基本思想

### 复习清单
- [ ] 能否解释什么是"字符串匹配"问题？
- [ ] 是否理解暴力匹配算法为什么效率低？
- [ ] 能否手动计算一个模式串的部分匹配表？
- [ ] 是否理解 KMP 算法中"回溯"的含义？
- [ ] 能否解释为什么 KMP 的时间复杂度是 O(m+n)？
- [ ] 是否理解部分匹配表的物理意义？

---

## 核心概念定义

| 术语 | 英文 | 定义 |
|------|------|------|
| 字符串匹配 | String Matching | 在文本串中查找模式串出现位置的问题 |
| 暴力匹配 | Brute Force | 逐个位置尝试匹配的简单方法 |
| KMP 算法 | Knuth-Morris-Pratt Algorithm | 利用已匹配信息避免回溯的高效算法 |
| 部分匹配表 | Partial Match Table | 记录模式串前后缀信息的数组（也称失败函数） |
| 前缀 | Prefix | 字符串开头的子串（不包括整个字符串） |
| 后缀 | Suffix | 字符串结尾的子串（不包括整个字符串） |

---

## 原理与运行机制

### 类比理解：在书中查找单词

想象你正在一本厚厚的书中查找某个单词。你会怎么做？

**暴力匹配的做法：**
从书的第一个字符开始，逐字比对。如果匹配失败，就回到下一个位置重新开始。这就像你用手指指着书，每次不匹配就往后移一格，再从头比对。这种方法简单直观，但效率很低，因为你浪费了很多已经比对过的信息。

**KMP 算法的做法：**
聪明的读者会发现：如果我已经比对了前 5 个字符都匹配，第 6 个字符不匹配，那么我不需要完全回到起点。我可以利用前 5 个字符的信息，直接跳到一个更合理的位置继续比对。这就像你知道某些字母组合经常一起出现，所以可以跳过一些明显不可能的位置。

**关键洞察：** KMP 算法的核心是**利用已匹配的信息**，避免不必要的回溯。它通过预处理模式串，建立一个"部分匹配表"，告诉算法在匹配失败时应该跳到哪个位置。

### 暴力匹配算法原理

暴力匹配是最直观的字符串匹配方法。

**核心思想：**
1. 从文本串的每个位置开始，尝试与模式串进行匹配
2. 如果当前字符匹配，继续比对下一个字符
3. 如果当前字符不匹配，回到文本串的下一个位置，重新从模式串的开头开始比对
4. 重复上述过程，直到找到匹配或遍历完整个文本串

**时间复杂度：** O(m×n)，其中 m 为文本串长度，n 为模式串长度。在最坏情况下（如文本串="AAAAA"，模式串="AAAB"），每次都要比对几乎整个模式串才失败。

### KMP 算法原理

KMP 算法由 Donald Knuth、James Morris 和 Vaughan Pratt 于 1977 年联合发表，是一种高效的字符串匹配算法。

**核心思想：**
1. **预处理阶段**：对模式串进行分析，构建部分匹配表（Next 数组）
2. **匹配阶段**：利用部分匹配表，在匹配失败时快速跳转到合适位置，避免回溯

**部分匹配表的含义：**
对于模式串的每个位置 i，`next[i]` 表示：当模式串的第 i 个字符匹配失败时，应该跳转到模式串的哪个位置继续比对。

更精确地说，`next[i]` 等于模式串 `P[0..i-1]` 的**最长相等前后缀的长度**。

**举例说明：**
模式串 "ABABC"
- P[0..0] = "A"：前后缀都为空，next[0] = -1（或 0，取决于实现）
- P[0..1] = "AB"：前缀{"A"}，后缀{"B"}，无相等，next[1] = 0
- P[0..2] = "ABA"：前缀{"A","AB"}，后缀{"A","BA"}，相等前后缀{"A"}，长度 1，next[2] = 1
- P[0..3] = "ABAB"：前缀{"A","AB","ABA"}，后缀{"B","AB","BAB"}，相等前后缀{"AB"}，长度 2，next[3] = 2
- P[0..4] = "ABABC"：前缀{"A","AB","ABA","ABAB"}，后缀{"C","BC","ABC","BABC"}，无相等，next[4] = 0

**匹配过程：**
当文本串的第 j 个字符与模式串的第 i 个字符不匹配时：
- 如果 i > 0，将 i 跳转到 next[i-1]，继续比对
- 如果 i = 0，将 j 向前移动一位，i 保持为 0

这样，文本串的指针 j **永远不会回溯**，保证了 O(m+n) 的时间复杂度。

---

## 典型应用场景

| 应用场景 | 适用算法 | 说明 |
|----------|----------|------|
| 文本编辑器查找 | KMP / Boyer-Moore | Ctrl+F 查找功能的核心 |
| DNA 序列搜索 | KMP | 在基因序列中查找特定模式 |
| 入侵检测系统 | KMP / Aho-Corasick | 在网络流量中匹配恶意特征码 |
| 搜索引擎 | KMP / 正则表达式 | 关键词匹配和高亮显示 |
| 拼写检查 | 编辑距离 + KMP | 查找相似单词 |
| 数据压缩 | KMP | LZ77 等算法中的重复串检测 |

---

## 代码示例

### C++ 实现

#### 暴力匹配算法

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// 暴力匹配算法
int bruteForceSearch(string text, string pattern) {
    int m = text.length();
    int n = pattern.length();
    
    // 遍历文本串的每个起始位置
    for (int i = 0; i <= m - n; i++) {
        int j;
        // 尝试从位置 i 开始匹配
        for (j = 0; j < n; j++) {
            if (text[i + j] != pattern[j]) {
                break; // 匹配失败
            }
        }
        // 如果 j == n，说明全部匹配成功
        if (j == n) {
            return i; // 返回匹配的起始位置
        }
    }
    
    return -1; // 未找到匹配
}

// 查找所有匹配位置
vector<int> bruteForceSearchAll(string text, string pattern) {
    vector<int> positions;
    int m = text.length();
    int n = pattern.length();
    
    for (int i = 0; i <= m - n; i++) {
        int j;
        for (j = 0; j < n; j++) {
            if (text[i + j] != pattern[j]) {
                break;
            }
        }
        if (j == n) {
            positions.push_back(i);
        }
    }
    
    return positions;
}

int main() {
    string text = "ABABDABACDABABCABAB";
    string pattern = "ABABCABAB";
    
    int pos = bruteForceSearch(text, pattern);
    if (pos != -1) {
        cout << "暴力匹配：找到匹配，起始位置为 " << pos << endl;
    } else {
        cout << "暴力匹配：未找到匹配" << endl;
    }
    
    vector<int> allPos = bruteForceSearchAll(text, pattern);
    cout << "所有匹配位置：";
    for (int p : allPos) {
        cout << p << " ";
    }
    cout << endl;
    
    return 0;
}
```

#### KMP 算法

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// 构建部分匹配表（Next 数组）
vector<int> buildPartialMatchTable(string pattern) {
    int n = pattern.length();
    vector<int> next(n, 0);
    
    int len = 0; // 当前最长相等前后缀的长度
    int i = 1;
    
    while (i < n) {
        if (pattern[i] == pattern[len]) {
            len++;
            next[i] = len;
            i++;
        } else {
            if (len != 0) {
                // 回溯到上一个可能的前缀位置
                len = next[len - 1];
            } else {
                next[i] = 0;
                i++;
            }
        }
    }
    
    return next;
}

// KMP 搜索算法
int kmpSearch(string text, string pattern) {
    int m = text.length();
    int n = pattern.length();
    
    if (n == 0) return 0;
    if (m < n) return -1;
    
    // 构建部分匹配表
    vector<int> next = buildPartialMatchTable(pattern);
    
    int i = 0; // 文本串的指针
    int j = 0; // 模式串的指针
    
    while (i < m) {
        if (text[i] == pattern[j]) {
            i++;
            j++;
        }
        
        if (j == n) {
            // 找到匹配
            return i - j;
        } else if (i < m && text[i] != pattern[j]) {
            // 匹配失败
            if (j != 0) {
                j = next[j - 1]; // 跳转到部分匹配表指示的位置
            } else {
                i++; // j 为 0，文本串指针前进
            }
        }
    }
    
    return -1; // 未找到匹配
}

// 查找所有匹配位置
vector<int> kmpSearchAll(string text, string pattern) {
    vector<int> positions;
    int m = text.length();
    int n = pattern.length();
    
    if (n == 0 || m < n) return positions;
    
    vector<int> next = buildPartialMatchTable(pattern);
    
    int i = 0, j = 0;
    while (i < m) {
        if (text[i] == pattern[j]) {
            i++;
            j++;
        }
        
        if (j == n) {
            positions.push_back(i - j);
            j = next[j - 1]; // 继续查找下一个匹配
        } else if (i < m && text[i] != pattern[j]) {
            if (j != 0) {
                j = next[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return positions;
}

int main() {
    string text = "ABABDABACDABABCABAB";
    string pattern = "ABABCABAB";
    
    // 打印部分匹配表
    vector<int> next = buildPartialMatchTable(pattern);
    cout << "模式串: " << pattern << endl;
    cout << "部分匹配表: ";
    for (int val : next) {
        cout << val << " ";
    }
    cout << endl;
    
    int pos = kmpSearch(text, pattern);
    if (pos != -1) {
        cout << "KMP 匹配：找到匹配，起始位置为 " << pos << endl;
    } else {
        cout << "KMP 匹配：未找到匹配" << endl;
    }
    
    vector<int> allPos = kmpSearchAll(text, pattern);
    cout << "所有匹配位置：";
    for (int p : allPos) {
        cout << p << " ";
    }
    cout << endl;
    
    return 0;
}
```

### Java 实现

#### 暴力匹配算法

```java
import java.util.ArrayList;
import java.util.List;

public class BruteForceSearch {
    
    // 暴力匹配算法
    public static int search(String text, String pattern) {
        int m = text.length();
        int n = pattern.length();
        
        // 遍历文本串的每个起始位置
        for (int i = 0; i <= m - n; i++) {
            int j;
            // 尝试从位置 i 开始匹配
            for (j = 0; j < n; j++) {
                if (text.charAt(i + j) != pattern.charAt(j)) {
                    break; // 匹配失败
                }
            }
            // 如果 j == n，说明全部匹配成功
            if (j == n) {
                return i; // 返回匹配的起始位置
            }
        }
        
        return -1; // 未找到匹配
    }
    
    // 查找所有匹配位置
    public static List<Integer> searchAll(String text, String pattern) {
        List<Integer> positions = new ArrayList<>();
        int m = text.length();
        int n = pattern.length();
        
        for (int i = 0; i <= m - n; i++) {
            int j;
            for (j = 0; j < n; j++) {
                if (text.charAt(i + j) != pattern.charAt(j)) {
                    break;
                }
            }
            if (j == n) {
                positions.add(i);
            }
        }
        
        return positions;
    }
    
    public static void main(String[] args) {
        String text = "ABABDABACDABABCABAB";
        String pattern = "ABABCABAB";
        
        int pos = search(text, pattern);
        if (pos != -1) {
            System.out.println("暴力匹配：找到匹配，起始位置为 " + pos);
        } else {
            System.out.println("暴力匹配：未找到匹配");
        }
        
        List<Integer> allPos = searchAll(text, pattern);
        System.out.print("所有匹配位置：");
        for (int p : allPos) {
            System.out.print(p + " ");
        }
        System.out.println();
    }
}
```

#### KMP 算法

```java
import java.util.ArrayList;
import java.util.List;

public class KMPSearch {
    
    // 构建部分匹配表（Next 数组）
    public static int[] buildPartialMatchTable(String pattern) {
        int n = pattern.length();
        int[] next = new int[n];
        
        int len = 0; // 当前最长相等前后缀的长度
        int i = 1;
        
        while (i < n) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                next[i] = len;
                i++;
            } else {
                if (len != 0) {
                    // 回溯到上一个可能的前缀位置
                    len = next[len - 1];
                } else {
                    next[i] = 0;
                    i++;
                }
            }
        }
        
        return next;
    }
    
    // KMP 搜索算法
    public static int search(String text, String pattern) {
        int m = text.length();
        int n = pattern.length();
        
        if (n == 0) return 0;
        if (m < n) return -1;
        
        // 构建部分匹配表
        int[] next = buildPartialMatchTable(pattern);
        
        int i = 0; // 文本串的指针
        int j = 0; // 模式串的指针
        
        while (i < m) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++;
                j++;
            }
            
            if (j == n) {
                // 找到匹配
                return i - j;
            } else if (i < m && text.charAt(i) != pattern.charAt(j)) {
                // 匹配失败
                if (j != 0) {
                    j = next[j - 1]; // 跳转到部分匹配表指示的位置
                } else {
                    i++; // j 为 0，文本串指针前进
                }
            }
        }
        
        return -1; // 未找到匹配
    }
    
    // 查找所有匹配位置
    public static List<Integer> searchAll(String text, String pattern) {
        List<Integer> positions = new ArrayList<>();
        int m = text.length();
        int n = pattern.length();
        
        if (n == 0 || m < n) return positions;
        
        int[] next = buildPartialMatchTable(pattern);
        
        int i = 0, j = 0;
        while (i < m) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++;
                j++;
            }
            
            if (j == n) {
                positions.add(i - j);
                j = next[j - 1]; // 继续查找下一个匹配
            } else if (i < m && text.charAt(i) != pattern.charAt(j)) {
                if (j != 0) {
                    j = next[j - 1];
                } else {
                    i++;
                }
            }
        }
        
        return positions;
    }
    
    public static void main(String[] args) {
        String text = "ABABDABACDABABCABAB";
        String pattern = "ABABCABAB";
        
        // 打印部分匹配表
        int[] next = buildPartialMatchTable(pattern);
        System.out.print("模式串: " + pattern + "\n");
        System.out.print("部分匹配表: ");
        for (int val : next) {
            System.out.print(val + " ");
        }
        System.out.println();
        
        int pos = search(text, pattern);
        if (pos != -1) {
            System.out.println("KMP 匹配：找到匹配，起始位置为 " + pos);
        } else {
            System.out.println("KMP 匹配：未找到匹配");
        }
        
        List<Integer> allPos = searchAll(text, pattern);
        System.out.print("所有匹配位置：");
        for (int p : allPos) {
            System.out.print(p + " ");
        }
        System.out.println();
    }
}
```

**部分匹配表可视化：**

```
模式串: A B A B C A B A B
索引:   0 1 2 3 4 5 6 7 8

next[]: 0 0 1 2 0 1 2 3 4

解释：
- next[0] = 0: "A" 无真前后缀
- next[1] = 0: "AB" 无相等前后缀
- next[2] = 1: "ABA" 最长相等前后缀为 "A"，长度 1
- next[3] = 2: "ABAB" 最长相等前后缀为 "AB"，长度 2
- next[4] = 0: "ABABC" 无相等前后缀
- next[5] = 1: "ABABCA" 最长相等前后缀为 "A"，长度 1
- next[6] = 2: "ABABCAB" 最长相等前后缀为 "AB"，长度 2
- next[7] = 3: "ABABCABA" 最长相等前后缀为 "ABA"，长度 3
- next[8] = 4: "ABABCABAB" 最长相等前后缀为 "ABAB"，长度 4
```

---

## 复杂度或性能分析

| 算法 | 预处理时间 | 匹配时间 | 总时间复杂度 | 空间复杂度 | 说明 |
|------|------------|----------|--------------|------------|------|
| 暴力匹配 | 无 | O(m×n) | O(m×n) | O(1) | 最坏情况效率低 |
| KMP | O(n) | O(m) | O(m+n) | O(n) | 线性时间，高效 |

**说明：** 
- m 为文本串长度，n 为模式串长度
- KMP 的优势在于文本串指针永不回溯，保证线性时间
- 暴力匹配在平均情况下可能表现不错，但最坏情况很差

**性能对比示例：**
- 文本串："AAAAAAAAAA...A"（1000 个 A）
- 模式串："AAAB"
- 暴力匹配：约 1000×4 = 4000 次比较
- KMP：约 1000+4 = 1004 次比较
- **KMP 快约 4 倍**，在更极端的情况下差距更大

---

## 常见误区与易错点

| 误区 | 正确理解 | 示例说明 |
|------|----------|----------|
| 部分匹配表就是简单的字符计数 | 部分匹配表基于前后缀匹配，不是字符频率 | "AAA" 的 next 为 [0,1,2]，不是 [3,3,3] |
| KMP 中 j 可以回溯到任意位置 | j 只能回溯到 next[j-1] 指示的位置 | 必须严格按照部分匹配表跳转 |
| 部分匹配表的第一个值一定是 0 | 取决于实现，有些实现用 -1 作为哨兵 | 需统一实现风格 |
| KMP 总是比暴力匹配快 | 对于随机文本，两者差异不大；KMP 优势在于最坏情况 | 实际应用中需权衡 |
| 部分匹配表可以预先计算一次用于多个文本串 | 是的，部分匹配表只依赖模式串 | 这是 KMP 的重要优势 |

---

## 与其他知识点的关系

- **与动态规划的关系**：部分匹配表的构建过程类似于 DP，利用已计算的结果推导后续值。
- **与自动机的关系**：KMP 算法可以看作是一个确定有限自动机（DFA）的简化版本。
- **与前缀函数的关系**：部分匹配表本质上就是字符串的前缀函数（Prefix Function）。
- **与正则表达式的关系**：KMP 是正则表达式引擎中固定字符串匹配的基础。
- **与多模式匹配的关系**：Aho-Corasick 算法是 KMP 的多模式扩展，用于同时匹配多个模式串。

---

## 自测题与参考答案

### 题目 1
**问：** 请手动计算模式串 "ABCDABD" 的部分匹配表。

**答：** 
```
模式串: A B C D A B D
索引:   0 1 2 3 4 5 6

逐步分析：
- P[0..0] = "A": 无真前后缀，next[0] = 0
- P[0..1] = "AB": 前缀{A}, 后缀{B}, 无相等，next[1] = 0
- P[0..2] = "ABC": 前缀{A,AB}, 后缀{C,BC}, 无相等，next[2] = 0
- P[0..3] = "ABCD": 前缀{A,AB,ABC}, 后缀{D,CD,BCD}, 无相等，next[3] = 0
- P[0..4] = "ABCDA": 前缀{A,AB,ABC,ABCD}, 后缀{A,DA,CDA,BCDA}, 相等{A}, 长度 1, next[4] = 1
- P[0..5] = "ABCDAB": 前缀{...,ABCDA}, 后缀{B,AB,DAB,CDAB,BCDAB}, 相等{AB}, 长度 2, next[5] = 2
- P[0..6] = "ABCDABD": 前缀{...,ABCDAB}, 后缀{D,BD,ABD,DABD,CDABD,BCDABD}, 无相等, next[6] = 0

部分匹配表: [0, 0, 0, 0, 1, 2, 0]
```

### 题目 2
**问：** 为什么 KMP 算法的时间复杂度是 O(m+n)？请给出简要证明。

**答：** 
KMP 算法包含两个阶段：
1. **预处理阶段**：构建部分匹配表，遍历模式串一次，时间复杂度 O(n)
2. **匹配阶段**：文本串指针 i 从 0 增加到 m-1，每次要么 i 增加，要么 j 减小（但 j 不会小于 0）。由于 j 最多增加 m 次（每次 i 增加时 j 可能增加），j 减小的总次数也不会超过 m 次。因此匹配阶段的时间复杂度为 O(m)

总时间复杂度 = O(n) + O(m) = O(m+n)

**关键点：** 文本串指针 i **永不回溯**，这是 KMP 高效的核心原因。

### 题目 3
**问：** 如果模式串的所有字符都相同（如 "AAAA"），部分匹配表是什么样的？KMP 算法在这种情况下如何工作？

**答：** 
模式串 "AAAA" 的部分匹配表为 [0, 1, 2, 3]。

解释：
- next[0] = 0: "A" 无真前后缀
- next[1] = 1: "AA" 最长相等前后缀为 "A"，长度 1
- next[2] = 2: "AAA" 最长相等前后缀为 "AA"，长度 2
- next[3] = 3: "AAAA" 最长相等前后缀为 "AAA"，长度 3

在这种情况下，KMP 算法仍然高效工作。当匹配失败时，j 会跳转到 next[j-1]，但由于所有字符相同，实际上很少发生匹配失败。即使失败，跳转也是合理的，避免了暴力匹配中的大量重复比较。

---

## 考点精讲

### 考点 1：部分匹配表的手动计算
考试中常要求手动计算给定模式串的部分匹配表。

**计算步骤：**
1. 初始化 next[0] = 0
2. 使用双指针 len 和 i，len 表示当前最长相等前后缀长度
3. 如果 pattern[i] == pattern[len]，则 len++，next[i] = len，i++
4. 如果不等且 len != 0，则 len = next[len-1]（回溯）
5. 如果不等且 len == 0，则 next[i] = 0，i++

**解题技巧：** 从小规模例子入手，逐步验证每一步的计算。

### 考点 2：KMP 算法的模拟执行
要求手动模拟 KMP 算法在给定文本串和模式串上的执行过程。

**模拟步骤：**
1. 先计算部分匹配表
2. 初始化 i=0, j=0
3. 逐字符比对，记录每次比较的结果
4. 匹配失败时，根据部分匹配表调整 j
5. 记录最终的匹配位置

**解题技巧：** 用表格记录 i、j 的变化过程，清晰展示算法执行流程。

### 考点 3：KMP 与暴力匹配的复杂度对比
要求分析两种算法在不同场景下的性能差异。

**分析要点：**
- 暴力匹配最坏情况：O(m×n)，如文本串="AAAA...A"，模式串="AAAB"
- KMP 最坏情况：O(m+n)，始终线性
- 平均情况下，两者差异可能不大
- KMP 的优势在于**保证**线性时间，适合对性能有严格要求的场景

**解题技巧：** 构造极端测试用例来说明两者的差异。

---

## 术语速查

| 中文术语 | 英文术语 | 简要说明 |
|----------|----------|----------|
| 字符串匹配 | String Matching | 在文本中查找模式 |
| 部分匹配表 | Partial Match Table | KMP 的核心数据结构 |
| 前缀函数 | Prefix Function | 与部分匹配表等价的概念 |
| 失败函数 | Failure Function | 部分匹配表的另一种称呼 |
| 回溯 | Backtracking | 匹配失败时的指针调整 |
| 确定有限自动机 | DFA | KMP 的理论基础之一 |

---

## 参考资料与复核

1. 《算法导论》（Introduction to Algorithms）第 32 章 - Thomas H. Cormen 等
2. 《算法》（Algorithms）第 4 版 - Robert Sedgewick & Kevin Wayne
3. GeeksforGeeks: KMP Algorithm - https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/
4. GeeksforGeeks: Naive Pattern Search - https://www.geeksforgeeks.org/naive-algorithm-for-pattern-searching/
5. Visualgo 可视化演示：https://visualgo.net/en/kmp

**复核日期：** 2026-10-19  
**作者：** DSA Advanced Course Team  
**版本：** 1.0
