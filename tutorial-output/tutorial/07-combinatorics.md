# 第七章：组合数学

## 简介

你是否想过：一副扑克牌有多少种洗牌方式？密码有多少种可能？彩票中奖概率是多少？这些问题都属于**组合数学**的研究范畴。

组合数学研究的是**计数**、**排列**和**组合**的问题。它告诉我们如何系统地数出各种可能性，而不需要一个一个去数。想象一下，如果你要安排10个人的座位，有多少种不同的坐法？如果用手指数，可能要数很久，但用组合数学，几秒钟就能算出来！

本章我们将学习基本的计数原理、排列组合公式，以及它们在实际问题中的应用。

---

## 核心概念定义

### 基本计数原理

#### 1. 加法原理（Rule of Sum）
如果完成一件事有m种方法A，或者有n种方法B，且A和B互斥，那么总共有 **m + n** 种方法。

**关键**：两种方法不能同时使用（互斥）

#### 2. 乘法原理（Rule of Product）
如果完成一件事需要两个步骤，第一步有m种方法，第二步有n种方法，那么总共有 **m × n** 种方法。

**关键**：两个步骤都要完成（连续）

### 排列（Permutation）

**排列**是从n个不同元素中取出r个元素，**考虑顺序**的排列方式数。

记作：P(n, r) 或 A(n, r)

公式：**P(n, r) = n! / (n-r)!**

特殊情况：P(n, n) = n!（全排列）

### 组合（Combination）

**组合**是从n个不同元素中取出r个元素，**不考虑顺序**的选择方式数。

记作：C(n, r) 或 (n choose r) 或 ₙCᵣ

公式：**C(n, r) = n! / [r!(n-r)!]**

重要性质：C(n, r) = C(n, n-r)

### 二项式定理

**(a + b)ⁿ = Σ C(n,k) · a^(n-k) · b^k** （k从0到n）

例如：(a + b)³ = C(3,0)a³ + C(3,1)a²b + C(3,2)ab² + C(3,3)b³
              = a³ + 3a²b + 3ab² + b³

---

## 生活类比

### 类比1：点餐组合（乘法原理）

你去餐厅点套餐：
- 主食有3种选择：米饭、面条、馒头
- 配菜有4种选择：青菜、土豆、豆腐、鸡蛋
- 饮料有2种选择：可乐、果汁

总共的套餐组合数 = 3 × 4 × 2 = **24种**

这就是乘法原理：每个选择都要做，所以相乘。

### 类比2：交通路线（加法原理）

从家到公司：
- 方案A：坐地铁，有3条线路可选
- 方案B：坐公交，有5条线路可选
- 方案C：打车，只有1种方式

总的出行方式 = 3 + 5 + 1 = **9种**

这就是加法原理：只能选一种方案，所以相加。

### 类比3：排队照相（排列）

5个朋友要排成一排照相：
- 第1个位置：5个人都可以站
- 第2个位置：剩下4个人可以站
- 第3个位置：剩下3个人可以站
- ...

总站法 = 5 × 4 × 3 × 2 × 1 = 5! = **120种**

如果只要选3个人站前排：**P(5,3) = 5×4×3 = 60种**

### 类比4：抽奖选号（组合）

从10个号码中选3个中奖号码：
- 不考虑顺序（1,2,3 和 3,2,1 是一样的）
- 选法数 = C(10,3) = 10!/(3!×7!) = **120种**

如果是排列（考虑顺序）：**P(10,3) = 10×9×8 = 720种**

---

## 代码示例

```python
# Python实现组合数学

import math
from itertools import permutations, combinations

# ============================================
# 1. 基本计数原理
# ============================================
print("=== 基本计数原理 ===")

# 加法原理示例
def addition_principle_example():
    """
    场景：从北京到上海
    - 飞机：5个航班
    - 高铁：8个车次
    - 汽车：3个班次
    """
    flights = 5
    trains = 8
    buses = 3
    
    total_ways = flights + trains + buses
    print(f"飞机: {flights}种")
    print(f"高铁: {trains}种")
    print(f"汽车: {buses}种")
    print(f"总出行方式: {total_ways}种 (加法原理)")

addition_principle_example()

# 乘法原理示例
def multiplication_principle_example():
    """
    场景：设置4位数字密码
    每位可以是0-9中的任意数字
    """
    digits_per_position = 10
    num_positions = 4
    
    total_passwords = digits_per_position ** num_positions
    print(f"\n4位数字密码:")
    print(f"每位有{digits_per_position}种选择")
    print(f"共{num_positions}位")
    print(f"总密码数: {total_passwords}种 (乘法原理)")

multiplication_principle_example()

# ============================================
# 2. 排列计算
# ============================================
print("\n=== 排列 Permutation ===")

def permutation(n, r):
    """计算P(n, r) = n! / (n-r)!"""
    if r > n:
        return 0
    return math.factorial(n) // math.factorial(n - r)

# 测试
test_cases = [
    (5, 3),   # 从5个中选3个排列
    (10, 2),  # 从10个中选2个排列
    (8, 8),   # 8个的全排列
]

print("n  | r  | P(n,r)")
print("-" * 25)
for n, r in test_cases:
    result = permutation(n, r)
    print(f"{n:2d} | {r:2d} | {result:6d}")

# 实际例子：比赛排名
print("\n实际例子：8人比赛，前3名有多少种可能？")
print(f"P(8,3) = {permutation(8, 3)}种")

# ============================================
# 3. 组合计算
# ============================================
print("\n=== 组合 Combination ===")

def combination(n, r):
    """计算C(n, r) = n! / [r!(n-r)!]"""
    if r > n:
        return 0
    return math.factorial(n) // (math.factorial(r) * math.factorial(n - r))

# 测试
print("n  | r  | C(n,r)")
print("-" * 25)
for n, r in test_cases:
    result = combination(n, r)
    print(f"{n:2d} | {r:2d} | {result:6d}")

# 验证性质：C(n,r) = C(n,n-r)
print("\n验证 C(n,r) = C(n,n-r):")
n, r = 10, 3
print(f"C({n},{r}) = {combination(n, r)}")
print(f"C({n},{n-r}) = {combination(n, n-r)}")
print(f"相等吗? {combination(n, r) == combination(n, n-r)}")

# 实际例子：彩票
print("\n实际例子：从35个号码中选7个")
print(f"C(35,7) = {combination(35, 7):,}种可能")
print(f"中奖概率 = 1/{combination(35, 7):,}")

# ============================================
# 4. 生成所有排列和组合
# ============================================
print("\n=== 生成排列和组合 ===")

items = ['A', 'B', 'C', 'D']

# 生成所有排列（取3个）
print("从[A,B,C,D]中选3个的排列:")
perms = list(permutations(items, 3))
print(f"共{len(perms)}种:")
for i, perm in enumerate(perms[:10], 1):  # 只显示前10个
    print(f"  {i}. {''.join(perm)}")
if len(perms) > 10:
    print(f"  ... 还有{len(perms)-10}种")

# 生成所有组合（取3个）
print("\n从[A,B,C,D]中选3个的组合:")
combs = list(combinations(items, 3))
print(f"共{len(combs)}种:")
for i, comb in enumerate(combs, 1):
    print(f"  {i}. {''.join(comb)}")

# ============================================
# 5. 二项式系数和杨辉三角
# ============================================
print("\n=== 二项式系数 ===")

def pascal_triangle(rows):
    """生成杨辉三角（帕斯卡三角形）"""
    triangle = []
    for n in range(rows):
        row = []
        for r in range(n + 1):
            row.append(combination(n, r))
        triangle.append(row)
    return triangle

# 打印杨辉三角
print("杨辉三角（前8行）:")
triangle = pascal_triangle(8)
for i, row in enumerate(triangle):
    # 居中对齐
    spaces = " " * (8 - i)
    print(spaces + " ".join(f"{num:3d}" for num in row))

# 验证二项式定理
print("\n验证二项式定理: (a+b)^n")
n = 4
print(f"(a+b)^{n} 的展开式系数:")
coefficients = [combination(n, k) for k in range(n + 1)]
print(f"系数: {coefficients}")
print(f"即: {' + '.join(f'{c}a^{n-k}b^{k}' for k, c in enumerate(coefficients))}")

# ============================================
# 6. 实际应用：概率计算
# ============================================
print("\n=== 实际应用：概率计算 ===")

def poker_hand_probability():
    """
    计算扑克牌中拿到同花顺的概率
    """
    # 一副牌52张
    total_cards = 52
    hand_size = 5
    
    # 总的手牌组合数
    total_hands = combination(total_cards, hand_size)
    
    # 同花顺的数量
    # 4种花色 × 10种可能的顺子(A-5, 2-6, ..., 10-A)
    straight_flushes = 4 * 10
    
    probability = straight_flushes / total_hands
    
    print(f"5张牌的总组合数: {total_hands:,}")
    print(f"同花顺数量: {straight_flushes}")
    print(f"概率: {probability:.10f}")
    print(f"约: 1/{int(1/probability):,}")

poker_hand_probability()

# 生日悖论
print("\n=== 生日悖论 ===")
def birthday_paradox(n_people):
    """
    计算n个人中至少有2人生日相同的概率
    """
    days_in_year = 365
    
    # 所有人生日都不同的概率
    prob_all_different = 1.0
    for i in range(n_people):
        prob_all_different *= (days_in_year - i) / days_in_year
    
    # 至少两人相同的概率
    prob_at_least_one_match = 1 - prob_all_different
    
    return prob_at_least_one_match

print("人数 | 至少两人生日相同的概率")
print("-" * 35)
for n in [10, 20, 23, 30, 40, 50]:
    prob = birthday_paradox(n)
    print(f"{n:4d} | {prob:.4f} ({prob*100:.2f}%)")

print("\n注意：只需23人，概率就超过50%！")

# ============================================
# 7. 进阶：多重集排列
# ============================================
print("\n=== 多重集排列 ===")

def multiset_permutation(counts):
    """
    计算多重集的排列数
    counts: 每种元素的个数列表
    公式: n! / (n1! × n2! × ... × nk!)
    """
    total = sum(counts)
    denominator = 1
    for count in counts:
        denominator *= math.factorial(count)
    
    return math.factorial(total) // denominator

# 例子：单词 "MISSISSIPPI" 的字母排列
word = "MISSISSIPPI"
from collections import Counter
letter_counts = Counter(word)
counts = list(letter_counts.values())

print(f"单词: {word}")
print(f"字母统计: {dict(letter_counts)}")
print(f"不同排列数: {multiset_permutation(counts):,}")
```

输出结果：
```
=== 基本计数原理 ===
飞机: 5种
高铁: 8种
汽车: 3种
总出行方式: 16种 (加法原理)

4位数字密码:
每位有10种选择
共4位
总密码数: 10000种 (乘法原理)

=== 排列 Permutation ===
n  | r  | P(n,r)
-------------------------
 5 |  3 |     60
10 |  2 |     90
 8 |  8 |  40320

实际例子：8人比赛，前3名有多少种可能？
P(8,3) = 336种

=== 组合 Combination ===
n  | r  | C(n,r)
-------------------------
 5 |  3 |     10
10 |  2 |     45
 8 |  8 |      1

验证 C(n,r) = C(n,n-r):
C(10,3) = 120
C(10,7) = 120
相等吗? True

实际例子：从35个号码中选7个
C(35,7) = 6,724,520种可能
中奖概率 = 1/6,724,520

=== 生成排列和组合 ===
从[A,B,C,D]中选3个的排列:
共24种:
  1. ABC
  2. ABD
  3. ACB
  4. ACD
  5. ADB
  6. ADC
  7. BAC
  8. BAD
  9. BCA
  10. BCD
  ... 还有14种

从[A,B,C,D]中选3个的组合:
共4种:
  1. ABC
  2. ABD
  3. ACD
  4. BCD

=== 二项式系数 ===
杨辉三角（前8行）:
                  1
                1   1
              1   2   1
            1   3   3   1
          1   4   6   4   1
        1   5  10  10   5   1
      1   6  15  20  15   6   1
    1   7  21  35  35  21   7   1

验证二项式定理: (a+b)^n
(a+b)^4 的展开式系数:
系数: [1, 4, 6, 4, 1]
即: 1a^4b^0 + 4a^3b^1 + 6a^2b^2 + 4a^1b^3 + 1a^0b^4

=== 实际应用：概率计算 ===
5张牌的总组合数: 2,598,960
同花顺数量: 40
概率: 0.0000153908
约: 1/64,974

=== 生日悖论 ===
人数 | 至少两人生日相同的概率
-----------------------------------
  10 | 0.1169 (11.69%)
  20 | 0.4114 (41.14%)
  23 | 0.5073 (50.73%)
  30 | 0.7063 (70.63%)
  40 | 0.8912 (89.12%)
  50 | 0.9704 (97.04%)

注意：只需23人，概率就超过50%！

=== 多重集排列 ===
单词: MISSISSIPPI
字母统计: {'M': 1, 'I': 4, 'S': 4, 'P': 2}
不同排列数: 34,650
```

---

## 练习题

### 练习1：基础计算
计算以下值：

a) P(10, 4)
b) C(12, 5)
c) C(20, 0)
d) C(20, 20)
e) P(7, 7)

### 练习2：应用题
回答以下问题：

a) 从10本书中选3本借走，有多少种选法？
b) 8个人排成一排照相，有多少种排法？
c) 用0-9组成4位密码（可重复），有多少种可能？
d) 从5男4女中选3人组成委员会，要求至少1名女性，有多少种选法？

### 练习3：二项式展开
展开以下表达式：

a) (x + y)⁵
b) (2a - b)⁴
c) 找出 (x + y)¹⁰ 中 x⁷y³ 的系数

### 练习4：编程挑战
编写Python程序解决：

```python
def count_subsets(n):
    """计算n元集合的所有子集数量"""
    # 提示：答案是2^n
    pass

def count_paths(grid_size):
    """
    在grid_size×grid_size的网格中
    从左上角到右下角，只能向右或向下走
    有多少条路径？
    """
    # 提示：需要向右走n步，向下走n步，共2n步
    # 从中选n步向右即可
    pass
```

### 练习5：概率问题
计算以下概率：

a) 掷3枚硬币，至少2枚正面的概率
b) 从52张扑克牌中随机抽5张，全是黑桃的概率
c) 班级有30人，至少2人生日相同的概率

---

## 常见误区

### 误区1：混淆排列和组合
- **错误**：认为选人和排队是一样的
- **正确**：
  - **排列**：考虑顺序（排队、排名）
  - **组合**：不考虑顺序（选人、分组）
- **记忆**：排列 = 排着列队（有序），组合 = 组合在一起（无序）
- **关系**：P(n,r) = C(n,r) × r!

### 误区2：加法原理和乘法原理的误用
- **错误**：该用乘法时用了加法，或反之
- **判断方法**：
  - **加法**："或"的关系，选其中一种
  - **乘法**："且"的关系，都要完成
- **例子**：
  - 从3件上衣**或**2条裤子中选一件 → 3+2=5（加法）
  - 从3件上衣**和**2条裤子中各选一件 → 3×2=6（乘法）

### 误区3：忽略"可重复"和"不可重复"
- **错误**：默认都是不可重复的
- **正确**：要看清题目条件
  - **可重复**：密码、骰子（每次独立）
  - **不可重复**：选人、抽签（选了就不能再选）
- **公式不同**：
  - 不可重复排列：P(n,r)
  - 可重复排列：n^r

### 误区4：阶乘计算的溢出
- **错误**：直接计算大数的阶乘导致溢出
- **正确**：
  - 利用 C(n,r) = C(n,n-r) 选择较小的r
  - 逐步计算避免大数
  - 使用Python的任意精度整数（自动处理）

### 误区5：二项式系数的对称性忽视
- **错误**：分别计算 C(n,r) 和 C(n,n-r)
- **正确**：利用 C(n,r) = C(n,n-r) 简化计算
- **技巧**：当 r > n/2 时，计算 C(n,n-r) 更快

---

## 小结

本章我们学习了：
1. ✅ 基本计数原理：加法原理和乘法原理
2. ✅ 排列和组合的定义及计算公式
3. ✅ 二项式定理和杨辉三角
4. ✅ 用Python实现组合计算
5. ✅ 实际应用：概率、密码、游戏等

组合数学是算法分析、概率论、密码学等领域的基础。掌握计数技巧能帮助你解决很多实际问题。下一章我们将学习**布尔代数**，这是数字电路和计算机逻辑的核心！

---

*提示：多做应用题，特别是区分何时用排列、何时用组合，这是最容易混淆的地方！*
