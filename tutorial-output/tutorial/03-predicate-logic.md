# 第三章：谓词逻辑

## 简介

在上一章中，我们学习了命题逻辑，但它有一个局限性：只能处理完整的、不可分割的命题。比如"苏格拉底是人"和"所有人都会死"，命题逻辑无法表达它们之间的关系。

**谓词逻辑**（也叫一阶逻辑）解决了这个问题！它让我们可以讨论对象的属性、对象之间的关系，以及"所有"、"存在"这样的量化概念。想象一下，如果说命题逻辑是处理单个句子，那么谓词逻辑就是能够分析句子的内部结构，理解主语、谓语和量词的关系。

---

## 核心概念定义

### 谓词（Predicate）

**谓词**是描述对象属性或对象之间关系的表达式。它像一个"模板"，需要填入具体的对象才能成为命题。

例如：
- P(x)：x 是人
- Q(x)：x 会死
- R(x, y)：x 喜欢 y
- S(x, y, z)：x 把 y 送给 z

当填入具体值后，谓词就变成了命题：
- P(苏格拉底)：苏格拉底是人（真）
- R(张三, 李四)：张三喜欢李四（可能真也可能假）

### 量词（Quantifier）

量词用来表示"有多少个对象满足某个条件"：

| 符号 | 名称 | 含义 | 示例 |
|------|------|------|------|
| ∀ | 全称量词 | 对所有... | ∀x P(x)：对所有x，P(x)都成立 |
| ∃ | 存在量词 | 存在... | ∃x P(x)：存在某个x，使P(x)成立 |

### 个体域（Domain of Discourse）

**个体域**是我们讨论的所有对象的集合。量词的作用范围限定在这个域内。

例如：
- 如果个体域是"所有人"，那么 ∀x P(x) 表示"所有人都有属性P"
- 如果个体域是"所有自然数"，那么 ∃x (x > 10) 表示"存在大于10的自然数"

### 自由变量与约束变量

- **约束变量**：被量词绑定的变量
  - 在 ∀x P(x) 中，x 是约束变量
  
- **自由变量**：没有被量词绑定的变量
  - 在 P(x) ∧ Q(y) 中，x 和 y 都是自由变量

只有没有自由变量的公式才是命题（可以判断真假）。

---

## 生活类比

### 类比1：学校规章制度

学校的规则可以用谓词逻辑表达：

- "所有学生都必须穿校服"
  - ∀x (学生(x) → 穿校服(x))
  
- "有些老师不教数学"
  - ∃x (老师(x) ∧ ¬教(x, 数学))
  
- "每个学生至少有一本教科书"
  - ∀x (学生(x) → ∃y (教科书(y) ∧ 拥有(x, y)))

### 类比2：社交媒体关系

用谓词逻辑描述社交网络：

- "每个人都至少有一个朋友"
  - ∀x ∃y 朋友(x, y)
  
- "有些人有很多粉丝"
  - ∃x (粉丝数量(x) > 1000)
  
- "如果A关注B，B不一定关注A"
  - ∀x∀y (关注(x, y) → ¬必然(关注(y, x)))

### 类比3：购物网站推荐

电商平台的推荐系统：

- "买过A商品的顾客也买了B商品"
  - ∀x (购买(x, A) → 购买(x, B))
  
- "存在某些商品所有人都喜欢"
  - ∃y ∀x 喜欢(x, y)
  
- "每个用户都有购物车"
  - ∀x (用户(x) → ∃y (购物车(y) ∧ 属于(y, x)))

---

## 代码示例

```python
# Python模拟谓词逻辑

# 定义个体域
people = ["苏格拉底", "柏拉图", "亚里士多德", "孔子"]
numbers = list(range(1, 11))  # 1到10的自然数

# 定义谓词函数
def is_mortal(person):
    """所有人都会死"""
    return True  # 简化：假设所有人都会死

def is_philosopher(person):
    """判断是否是哲学家"""
    philosophers = ["苏格拉底", "柏拉图", "亚里士多德", "孔子"]
    return person in philosophers

def is_even(n):
    """判断是否是偶数"""
    return n % 2 == 0

def is_greater_than_5(n):
    """判断是否大于5"""
    return n > 5

def likes(person1, person2):
    """模拟喜欢关系"""
    # 简化的喜欢关系
    like_relations = {
        ("苏格拉底", "柏拉图"),
        ("柏拉图", "亚里士多德"),
        ("孔子", "苏格拉底"),
    }
    return (person1, person2) in like_relations

# 实现全称量词 ∀
def forall(domain, predicate):
    """∀x P(x)：对域中所有元素，predicate都返回True"""
    for item in domain:
        if not predicate(item):
            return False
    return True

# 实现存在量词 ∃
def exists(domain, predicate):
    """∃x P(x)：域中存在至少一个元素使predicate返回True"""
    for item in domain:
        if predicate(item):
            return True
    return False

# 测试全称量词
print("=== 测试全称量词 ===")
print("所有人都会死:", forall(people, is_mortal))
print("所有人都是哲学家:", forall(people, is_philosopher))
print("1-10中所有数都大于0:", forall(numbers, lambda x: x > 0))
print("1-10中所有数都是偶数:", forall(numbers, is_even))

# 测试存在量词
print("\n=== 测试存在量词 ===")
print("存在会死的人:", exists(people, is_mortal))
print("存在不是哲学家的人:", exists(people, lambda x: not is_philosopher(x)))
print("1-10中存在偶数:", exists(numbers, is_even))
print("1-10中存在大于100的数:", exists(numbers, lambda x: x > 100))

# 复杂查询：嵌套量词
print("\n=== 嵌套量词 ===")

# ∀x ∃y 喜欢(x, y)：每个人都喜欢某个人
everyone_likes_someone = all(
    exists(people, lambda y: likes(x, y))
    for x in people
)
print("每个人都喜欢某个人:", everyone_likes_someone)

# ∃y ∀x 喜欢(x, y)：存在一个人被所有人喜欢
someone_liked_by_all = any(
    all(likes(x, y) for x in people)
    for y in people
)
print("存在一个人被所有人喜欢:", someone_liked_by_all)

# 实际应用：数据库查询模拟
print("\n=== 实际应用：模拟数据库查询 ===")

students = [
    {"name": "张三", "age": 20, "grade": 85},
    {"name": "李四", "age": 22, "grade": 92},
    {"name": "王五", "age": 19, "grade": 78},
    {"name": "赵六", "age": 21, "grade": 95},
]

# 查询：所有成绩大于90的学生
high_achievers = [s for s in students if s["grade"] > 90]
print("成绩大于90的学生:", [s["name"] for s in high_achievers])

# 查询：是否存在年龄小于20的学生
has_young_student = any(s["age"] < 20 for s in students)
print("存在年龄小于20的学生:", has_young_student)

# 查询：是否所有学生都成年（>=18）
all_adults = all(s["age"] >= 18 for s in students)
print("所有学生都成年:", all_adults)

# 否定量词的等价转换
print("\n=== 量词的否定 ===")
print("¬(∀x P(x)) ≡ ∃x ¬P(x)")
print("¬(∃x P(x)) ≡ ∀x ¬P(x)")

# 验证：并非所有人都是哲学家 ≡ 存在不是哲学家的人
not_all_philosophers = not forall(people, is_philosopher)
exists_non_philosopher = exists(people, lambda x: not is_philosopher(x))
print(f"并非所有人都是哲学家: {not_all_philosophers}")
print(f"存在不是哲学家的人: {exists_non_philosopher}")
print(f"两者等价: {not_all_philosophers == exists_non_philosopher}")
```

输出结果：
```
=== 测试全称量词 ===
所有人都会死: True
所有人都是哲学家: True
1-10中所有数都大于0: True
1-10中所有数都是偶数: False

=== 测试存在量词 ===
存在会死的人: True
存在不是哲学家的人: False
1-10中存在偶数: True
1-10中存在大于100的数: False

=== 嵌套量词 ===
每个人都喜欢某个人: False
存在一个人被所有人喜欢: False

=== 实际应用：模拟数据库查询 ===
成绩大于90的学生: ['李四', '赵六']
存在年龄小于20的学生: True
所有学生都成年: True

=== 量词的否定 ===
¬(∀x P(x)) ≡ ∃x ¬P(x)
¬(∃x P(x)) ≡ ∀x ¬P(x)
并非所有人都是哲学家: False
存在不是哲学家的人: False
两者等价: True
```

---

## 练习题

### 练习1：翻译为谓词逻辑
将以下语句翻译成谓词逻辑表达式（先定义谓词）：

a) 所有鸟都会飞
b) 有些学生不喜欢数学
c) 每个人都有一个母亲
d) 没有完美的程序
e) 所有素数除了2都是奇数

提示：定义如 Bird(x)、CanFly(x)、Student(x)、Likes(x, y) 等谓词

### 练习2：判断真假
给定个体域为{1, 2, 3, 4, 5}，判断以下命题的真假：

a) ∀x (x > 0)
b) ∃x (x > 5)
c) ∀x ∃y (x < y)
d) ∃x ∀y (x ≤ y)

### 练习3：量词否定
写出以下命题的否定形式，并简化：

a) ∀x (P(x) → Q(x))
b) ∃x (P(x) ∧ Q(x))
c) ∀x ∃y (R(x, y))
d) ∃x ∀y (S(x, y) → T(y))

### 练习4：推理有效性
判断以下推理是否有效：

前提1：所有人都会死
前提2：苏格拉底是人
结论：苏格拉底会死

用谓词逻辑形式化这个推理，并说明为什么它是有效的。

### 练习5：编程实践
编写Python函数实现以下功能：

```python
def check_property(domain, property_func, quantifier="forall"):
    """
    检查域中元素是否满足某个属性
    
    参数:
    - domain: 个体域（列表）
    - property_func: 属性函数，接受一个元素返回布尔值
    - quantifier: "forall" 或 "exists"
    
    返回: 布尔值
    """
    # 你的代码
```

测试用例：
- 检查1-100中是否所有数都大于0
- 检查1-100中是否存在完全平方数
- 检查["猫", "狗", "鱼"]中是否所有动物都会游泳

---

## 常见误区

### 误区1：混淆 ∀ 和 ∃ 的顺序
- **错误**：认为 ∀x ∃y R(x, y) 和 ∃y ∀x R(x, y) 是一样的
- **正确**：顺序很重要！
  - ∀x ∃y R(x, y)：每个人都有自己喜欢的人（可以不同）
  - ∃y ∀x R(x, y)：存在一个人被所有人喜欢（同一个人）
- **类比**：前者像"每人有自己的梦想"，后者像"有一个全民偶像"

### 误区2：忽略个体域
- **错误**：直接写 ∀x P(x) 而不说明x的范围
- **正确**：必须明确个体域
  - "所有x都是P" 在不同域中意义不同
  - 在"人"的域中 vs 在"动物"的域中

### 误区3：量词范围的歧义
- **模糊**：∀x P(x) ∧ Q(x)
- **清晰**：(∀x P(x)) ∧ Q(x) 或 ∀x (P(x) ∧ Q(x))
- **建议**：总是使用括号明确量词的作用范围

### 误区4：误解"有些"的含义
- **日常语言**："有些"通常暗示"不是全部"
- **逻辑中的∃**：只表示"至少一个"，不排除"全部"
  - ∃x P(x) 在所有x都满足P时也为真
- **记忆**：逻辑中的"有些" = "至少有一个"

### 误区5：自由变量的混淆
- **错误**：认为 P(x) 是一个命题
- **正确**：P(x) 含有自由变量x，不是命题，不能判断真假
- **只有** ∀x P(x) 或 ∃x P(x) 或 P(具体值) 才是命题

---

## 小结

本章我们学习了：
1. ✅ 谓词的概念和作用
2. ✅ 两种量词：全称量词∀和存在量词∃
3. ✅ 个体域的重要性
4. ✅ 自由变量与约束变量的区别
5. ✅ 用Python模拟谓词逻辑运算

谓词逻辑比命题逻辑更强大，能够表达更复杂的知识。它是人工智能、数据库查询语言（SQL）、程序验证等领域的基础。下一章我们将学习**证明方法**，看看如何严谨地证明一个数学命题！

---

*提示：多做翻译练习，把自然语言转换成谓词逻辑表达式，这是掌握谓词逻辑的关键！*
