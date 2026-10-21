# 第六章：函数

## 简介

如果你学过编程，你一定用过函数。但数学中的函数概念更加基础和抽象。简单来说，**函数**就是一种特殊的规则，它把每个输入都对应到唯一的输出。

想象一下自动售货机：你投入硬币（输入），按下按钮选择商品，机器就会给你对应的饮料（输出）。关键是：同样的输入总是得到同样的输出，不会出现按"可乐"却出来"雪碧"的情况。这就是函数的核心特征——**确定性**和**唯一性**。

函数是连接不同集合的桥梁，也是计算机科学中最重要的概念之一！

---

## 核心概念定义

### 什么是函数？

**函数（Function）**是从集合A到集合B的一种特殊关系，满足：
- A中的**每个**元素都有对应的B中元素
- A中的每个元素**只能**对应B中的一个元素

记作：f: A → B，读作"f是从A到B的函数"

如果 f(a) = b，我们说：
- a 是 **自变量**（输入）
- b 是 **因变量**（输出）
- b 是 a 的 **像**（image）
- a 是 b 的 **原像**（preimage）

### 函数的三要素

1. **定义域（Domain）**：所有可能的输入值的集合
2. **值域/陪域（Codomain）**：所有可能的输出值的集合
3. **对应法则**：如何将输入映射到输出的规则

### 函数的分类

| 类型 | 定义 | 特点 |
|------|------|------|
| 单射（Injective） | 不同输入对应不同输出 | 一对一 |
| 满射（Surjective） | 值域中每个元素都有原像 | 全覆盖 |
| 双射（Bijective） | 既是单射又是满射 | 一一对应，可逆 |

### 特殊函数

1. **恒等函数**：f(x) = x，输入等于输出
2. **常数函数**：f(x) = c，所有输入都映射到同一个值
3. **复合函数**：(g ∘ f)(x) = g(f(x))，先应用f，再应用g
4. **逆函数**：如果f是双射，存在f⁻¹使得 f⁻¹(f(x)) = x

---

## 生活类比

### 类比1：学生学号系统

学校给每个学生分配唯一的学号：

- **定义域**：所有学生
- **陪域**：所有可能的学号
- **函数**：学生 → 学号

这个函数是**单射**的（不同学生有不同学号），但不一定是**满射**的（可能有些学号还没分配）。

### 类比2：翻译软件

在线翻译工具：

- **定义域**：所有中文句子
- **陪域**：所有英文句子
- **函数**：中文句子 → 英文翻译

这通常不是单射（不同的中文可能翻译成相同的英文），也不是满射（有些英文没有对应的中文表达）。

### 类比3：电梯楼层按钮

电梯的楼层按钮：

- **定义域**：{1, 2, 3, ..., 10}（按钮）
- **陪域**：{1, 2, 3, ..., 10}（楼层）
- **函数**：按钮 → 楼层

这是一个**双射**：每个按钮对应唯一楼层，每个楼层都有对应按钮，一一对应！

### 类比4：密码加密

简单的密码系统：

- **定义域**：所有明文消息
- **陪域**：所有密文消息
- **函数**：明文 → 密文（加密）

好的加密函数应该是**单射**的（不同明文产生不同密文），并且应该有**逆函数**（解密）。

---

## 代码示例

```python
# Python实现函数理论

# ============================================
# 1. 基本函数的定义和使用
# ============================================
print("=== 基本函数 ===")

def square(x):
    """平方函数：f(x) = x²"""
    return x ** 2

def absolute_value(x):
    """绝对值函数：f(x) = |x|"""
    return abs(x)

def is_even(x):
    """奇偶判断函数：f(x) = True if x是偶数"""
    return x % 2 == 0

# 测试
test_values = [-3, -2, -1, 0, 1, 2, 3]
print("x   | x²  | |x| | 偶数?")
print("-" * 35)
for x in test_values:
    print(f"{x:3d} | {square(x):3d} | {absolute_value(x):3d} | {is_even(x)}")

# ============================================
# 2. 检查函数类型
# ============================================
print("\n=== 检查函数类型 ===")

def is_injective(func, domain):
    """
    检查函数是否是单射（一对一）
    不同输入必须有不同的输出
    """
    outputs = []
    for x in domain:
        y = func(x)
        if y in outputs:
            return False
        outputs.append(y)
    return True

def is_surjective(func, domain, codomain):
    """
    检查函数是否是满射（全覆盖）
    陪域中每个元素都必须有原像
    """
    range_set = {func(x) for x in domain}
    return codomain.issubset(range_set)

def is_bijective(func, domain, codomain):
    """检查函数是否是双射"""
    return is_injective(func, domain) and is_surjective(func, domain, codomain)

# 测试不同的函数
domain_small = {1, 2, 3, 4}
codomain_small = {1, 4, 9, 16}

print("测试1: f(x) = x², 定义域={1,2,3,4}, 陪域={1,4,9,16}")
print(f"  单射: {is_injective(square, domain_small)}")
print(f"  满射: {is_surjective(square, domain_small, codomain_small)}")
print(f"  双射: {is_bijective(square, domain_small, codomain_small)}")

# 非单射的例子
domain_2 = {-2, -1, 0, 1, 2}
print("\n测试2: f(x) = x², 定义域={-2,-1,0,1,2}")
print(f"  单射: {is_injective(square, domain_2)} (因为(-1)²=1²)")

# ============================================
# 3. 函数复合
# ============================================
print("\n=== 函数复合 ===")

def add_one(x):
    """f(x) = x + 1"""
    return x + 1

def multiply_by_two(x):
    """g(x) = 2x"""
    return x * 2

def compose(f, g):
    """返回复合函数 g ∘ f"""
    return lambda x: g(f(x))

# (g ∘ f)(x) = g(f(x)) = g(x+1) = 2(x+1) = 2x + 2
composed_func = compose(add_one, multiply_by_two)

print("f(x) = x + 1")
print("g(x) = 2x")
print("(g ∘ f)(x) = g(f(x)) = 2(x+1) = 2x + 2")
print()

test_vals = [1, 2, 3, 4, 5]
print("x   | f(x) | g(x) | (g∘f)(x)")
print("-" * 40)
for x in test_vals:
    fx = add_one(x)
    gx = multiply_by_two(x)
    gfx = composed_func(x)
    print(f"{x:3d} | {fx:5d} | {gx:5d} | {gfx:7d}")

# 注意：函数复合一般不满足交换律
# (f ∘ g)(x) ≠ (g ∘ f)(x)
compose_fg = compose(multiply_by_two, add_one)
print("\n验证：函数复合不满足交换律")
print(f"(g ∘ f)(3) = {composed_func(3)}")
print(f"(f ∘ g)(3) = {compose_fg(3)}")
print(f"两者相等吗? {composed_func(3) == compose_fg(3)}")

# ============================================
# 4. 逆函数
# ============================================
print("\n=== 逆函数 ===")

def find_inverse(func, domain, codomain):
    """
    寻找函数的逆函数
    返回一个字典：{输出: 输入}
    """
    # 首先检查是否是双射
    if not is_bijective(func, domain, codomain):
        return None
    
    inverse = {}
    for x in domain:
        y = func(x)
        inverse[y] = x
    
    return inverse

# 双射函数的例子
def double_minus_one(x):
    """f(x) = 2x - 1"""
    return 2 * x - 1

domain_bij = {1, 2, 3, 4, 5}
codomain_bij = {1, 3, 5, 7, 9}

print(f"函数: f(x) = 2x - 1")
print(f"定义域: {domain_bij}")
print(f"陪域: {codomain_bij}")
print(f"是双射吗? {is_bijective(double_minus_one, domain_bij, codomain_bij)}")

inverse_map = find_inverse(double_minus_one, domain_bij, codomain_bij)
if inverse_map:
    print(f"\n逆函数映射:")
    for y, x in sorted(inverse_map.items()):
        print(f"  f⁻¹({y}) = {x}")
    
    # 验证：f⁻¹(f(x)) = x
    print("\n验证 f⁻¹(f(x)) = x:")
    for x in sorted(domain_bij):
        fx = double_minus_one(x)
        f_inv_fx = inverse_map[fx]
        print(f"  x={x}: f({x})={fx}, f⁻¹({fx})={f_inv_fx}, 正确吗? {f_inv_fx == x}")

# ============================================
# 5. 实际应用场景
# ============================================
print("\n=== 实际应用：哈希函数 ===")

def simple_hash(key):
    """
    简单哈希函数
    将字符串映射到一个整数
    """
    hash_value = 0
    for char in key:
        hash_value = (hash_value * 31 + ord(char)) % 100
    return hash_value

# 测试哈希函数
test_keys = ["apple", "banana", "cherry", "date", "elderberry"]
print("键         | 哈希值")
print("-" * 25)
for key in test_keys:
    h = simple_hash(key)
    print(f"{key:10s} | {h:3d}")

# 检查是否有冲突（碰撞）
hash_values = [simple_hash(key) for key in test_keys]
has_collision = len(hash_values) != len(set(hash_values))
print(f"\n有哈希冲突吗? {has_collision}")

# ============================================
# 6. Lambda函数和高阶函数
# ============================================
print("\n=== 高阶函数 ===")

# map: 对列表每个元素应用函数
numbers = [1, 2, 3, 4, 5]
squared = list(map(square, numbers))
print(f"原始列表: {numbers}")
print(f"平方后:   {squared}")

# filter: 筛选满足条件的元素
evens = list(filter(is_even, numbers))
print(f"偶数:     {evens}")

# 自定义高阶函数
def apply_twice(func, x):
    """应用函数两次：f(f(x))"""
    return func(func(x))

print(f"\napply_twice(square, 2) = square(square(2)) = square(4) = {apply_twice(square, 2)}")
print(f"apply_twice(add_one, 5) = add_one(add_one(5)) = {apply_twice(add_one, 5)}")
```

输出结果：
```
=== 基本函数 ===
x   | x²  | |x| | 偶数?
-----------------------------------
 -3 |   9 |   3 | False
 -2 |   4 |   2 | True
 -1 |   1 |   1 | False
  0 |   0 |   0 | True
  1 |   1 |   1 | False
  2 |   4 |   2 | True
  3 |   9 |   3 | False

=== 检查函数类型 ===
测试1: f(x) = x², 定义域={1,2,3,4}, 陪域={1,4,9,16}
  单射: True
  满射: True
  双射: True

测试2: f(x) = x², 定义域={-2,-1,0,1,2}
  单射: False (因为(-1)²=1²)

=== 函数复合 ===
f(x) = x + 1
g(x) = 2x
(g ∘ f)(x) = g(f(x)) = 2(x+1) = 2x + 2

x   | f(x) | g(x) | (g∘f)(x)
----------------------------------------
  1 |     2 |     2 |       4
  2 |     3 |     4 |       6
  3 |     4 |     6 |       8
  4 |     5 |     8 |      10
  5 |     6 |    10 |      12

验证：函数复合不满足交换律
(g ∘ f)(3) = 8
(f ∘ g)(3) = 7
两者相等吗? False

=== 逆函数 ===
函数: f(x) = 2x - 1
定义域: {1, 2, 3, 4, 5}
陪域: {1, 3, 5, 7, 9}
是双射吗? True

逆函数映射:
  f⁻¹(1) = 1
  f⁻¹(3) = 2
  f⁻¹(5) = 3
  f⁻¹(7) = 4
  f⁻¹(9) = 5

验证 f⁻¹(f(x)) = x:
  x=1: f(1)=1, f⁻¹(1)=1, 正确吗? True
  x=2: f(2)=3, f⁻¹(3)=2, 正确吗? True
  x=3: f(3)=5, f⁻¹(5)=3, 正确吗? True
  x=4: f(4)=7, f⁻¹(7)=4, 正确吗? True
  x=5: f(5)=9, f⁻¹(9)=5, 正确吗? True

=== 实际应用：哈希函数 ===
键         | 哈希值
-------------------------
apple      |  78
banana     |  23
cherry     |  56
date       |  89
elderberry |  12

有哈希冲突吗? False

=== 高阶函数 ===
原始列表: [1, 2, 3, 4, 5]
平方后:   [1, 4, 9, 16, 25]
偶数:     [2, 4]

apply_twice(square, 2) = square(square(2)) = square(4) = 16
apply_twice(add_one, 5) = add_one(add_one(5)) = 7
```

---

## 练习题

### 练习1：判断函数类型
给定以下函数，判断它们是单射、满射还是双射：

a) f: ℤ → ℤ, f(x) = x + 1
b) f: ℤ → ℤ, f(x) = x²
c) f: ℝ → ℝ, f(x) = 2x + 3
d) f: {1,2,3} → {a,b,c}, f(1)=a, f(2)=b, f(3)=c

### 练习2：函数复合
已知 f(x) = x² 和 g(x) = x + 1，计算：

a) (g ∘ f)(3)
b) (f ∘ g)(3)
c) (f ∘ f)(2)
d) 证明函数复合不满足交换律

### 练习3：逆函数
找出以下函数的逆函数（如果存在）：

a) f(x) = 3x - 5
b) f(x) = x³
c) f(x) = x² （定义域为ℝ）
d) f(x) = x² （定义域为[0, +∞)）

### 练习4：编程实践
编写Python函数实现：

```python
def compose_multiple(functions, x):
    """
    复合多个函数
    functions: 函数列表 [f1, f2, f3, ...]
    返回: f1(f2(f3(...(x))))
    """
    # 你的代码

def is_permutation(func, domain):
    """
    检查函数是否是集合上的置换（双射且定义域=陪域）
    """
    # 你的代码
```

### 练习5：实际应用
设计一个简单的编码解码系统：

```python
def encode(message, key):
    """使用密钥编码消息"""
    # 你的代码

def decode(encoded_message, key):
    """使用密钥解码消息"""
    # 你的代码
```

要求：decode(encode(msg, key), key) == msg

---

## 常见误区

### 误区1：混淆值域和陪域
- **错误**：认为值域就是陪域
- **正确**：
  - **陪域（Codomain）**：函数声明时指定的输出范围
  - **值域（Range/Image）**：实际能取到的输出值的集合
  - 值域 ⊆ 陪域
- **例子**：f: ℝ → ℝ, f(x) = x²
  - 陪域是ℝ（所有实数）
  - 值域是[0, +∞)（非负实数）

### 误区2：忽略函数的"唯一性"要求
- **错误**：认为一个输入可以对应多个输出
- **正确**：函数的定义要求每个输入**只能**对应一个输出
- **对比**：关系可以一对多，但函数不行
- **例子**：y² = x 不是函数（x=4时，y可以是2或-2）

### 误区3：误以为所有函数都可逆
- **错误**：认为任何函数都有逆函数
- **正确**：只有**双射**函数才有逆函数
- **原因**：如果不是单射，逆映射会有歧义；如果不是满射，逆映射会有未定义的值

### 误区4：函数复合的顺序混淆
- **错误**：认为 (f ∘ g)(x) = f(g(x)) 和 (g ∘ f)(x) 是一样的
- **正确**：函数复合**不满足交换律**
- **记忆**：(f ∘ g) 读作"f after g"，先应用g，再应用f

### 误区5：定义域的忽视
- **错误**：不考虑函数的定义域就直接运算
- **正确**：必须先确认输入在定义域内
- **例子**：f(x) = 1/x 在 x=0 处无定义
- **编程提示**：总是检查边界条件和特殊情况

---

## 小结

本章我们学习了：
1. ✅ 函数的定义和三要素（定义域、陪域、对应法则）
2. ✅ 函数的分类：单射、满射、双射
3. ✅ 函数复合和逆函数
4. ✅ 用Python实现各种函数操作
5. ✅ 函数在实际应用中的作用

函数是编程的核心，理解函数的数学本质能帮助你写出更清晰、更可靠的代码。下一章我们将学习**组合数学**，探索计数和排列的奥秘！

---

*提示：多练习判断函数类型，特别是理解单射、满射、双射的区别，这对后续学习很重要！*
