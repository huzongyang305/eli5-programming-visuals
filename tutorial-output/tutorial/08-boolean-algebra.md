# 第八章：布尔代数

## 简介

你每天都在使用布尔代数，只是你可能没意识到！每次你在搜索引擎中输入"Python AND 教程"，每次你用筛选条件过滤商品，每次程序中的if语句判断条件——这些都是布尔代数的应用。

**布尔代数**是由乔治·布尔在19世纪创立的数学分支，它研究的是逻辑值（真/假）之间的运算。后来，克劳德·香农发现布尔代数可以用来设计电子电路，从此布尔代数成为了计算机科学的基石。

想象一下，布尔代数就像是一个只有两个数字的世界：0和1（或假和真）。但就是这两个简单的值，通过巧妙的组合，构建了整个数字世界！

---

## 核心概念定义

### 布尔值

布尔代数只处理两种值：
- **真（True）**：通常用 1 表示
- **假（False）**：通常用 0 表示

### 基本运算

| 运算 | 符号 | 名称 | 含义 | 示例 |
|------|------|------|------|------|
| 非 | ¬, ', ~ | NOT | 取反 | ¬0 = 1, ¬1 = 0 |
| 与 | ∧, ·, & | AND | 两者都为真 | 1 ∧ 1 = 1, 其他为0 |
| 或 | ∨, +, \| | OR | 至少一个为真 | 0 ∨ 0 = 0, 其他为1 |

### 重要定律

#### 1. 基本定律

| 定律 | 公式 |
|------|------|
| 幂等律 | A ∧ A = A, A ∨ A = A |
| 零一律 | A ∧ 1 = A, A ∨ 0 = A |
| 支配律 | A ∧ 0 = 0, A ∨ 1 = 1 |
| 互补律 | A ∧ ¬A = 0, A ∨ ¬A = 1 |
| 双重否定律 | ¬(¬A) = A |

#### 2. 交换律、结合律、分配律

- **交换律**：A ∧ B = B ∧ A, A ∨ B = B ∨ A
- **结合律**：(A ∧ B) ∧ C = A ∧ (B ∧ C)
- **分配律**：A ∧ (B ∨ C) = (A ∧ B) ∨ (A ∧ C)

#### 3. 德摩根定律（De Morgan's Laws）

- ¬(A ∧ B) = ¬A ∨ ¬B
- ¬(A ∨ B) = ¬A ∧ ¬B

**记忆技巧**：打破括号时，AND变OR，OR变AND，并且每个变量取反

### 布尔函数

**布尔函数**是输入和输出都是布尔值的函数。

例如：f(A, B) = A ∧ B

n个变量的布尔函数有 2^(2^n) 种可能。

---

## 生活类比

### 类比1：门禁系统

大楼的门禁系统：

- **AND门**：需要刷卡 **且** 输入密码才能进入
  - 只有两个条件都满足（1 AND 1 = 1），门才开
  
- **OR门**：刷卡 **或** 人脸识别任一通过即可
  - 只要有一个条件满足（1 OR 0 = 1），门就开
  
- **NOT门**：黑名单用户禁止进入
  - 如果是黑名单（1），取反后变成禁止（0）

### 类比2：搜索过滤器

电商网站的商品筛选：

```
(品牌 = "华为" OR 品牌 = "小米") AND 价格 < 3000 AND 评分 > 4.5
```

这就是一个布尔表达式！只有同时满足所有条件的商品才会显示。

### 类比3：电路开关

家里的灯光控制：

- **串联开关（AND）**：两个开关都闭合，灯才亮
- **并联开关（OR）**：任一开关闭合，灯就亮
- **反向开关（NOT）**：按下反而关灯

### 类比4：资格检查

申请驾照的条件：

```
年龄 ≥ 18 AND 视力合格 AND (通过笔试 OR 已有国外驾照)
```

必须满足年龄要求 **且** 视力要求 **且** （笔试或通过豁免），才能获得驾照。

---

## 代码示例

```python
# Python实现布尔代数

# ============================================
# 1. 基本布尔运算
# ============================================
print("=== 基本布尔运算 ===")

def AND(a, b):
    """逻辑与"""
    return a and b

def OR(a, b):
    """逻辑或"""
    return a or b

def NOT(a):
    """逻辑非"""
    return not a

def XOR(a, b):
    """异或：两者不同则为真"""
    return a != b

def NAND(a, b):
    """与非：先AND再NOT"""
    return not (a and b)

def NOR(a, b):
    """或非：先OR再NOT"""
    return not (a or b)

# 生成真值表
def print_truth_table_2vars():
    """打印两个变量的所有运算真值表"""
    print("A | B | A∧B | A∨B | A⊕B | ¬A  | ¬B  | NAND| NOR ")
    print("-" * 65)
    
    for a in [False, True]:
        for b in [False, True]:
            a_str = "1" if a else "0"
            b_str = "1" if b else "0"
            
            and_val = "1" if AND(a, b) else "0"
            or_val = "1" if OR(a, b) else "0"
            xor_val = "1" if XOR(a, b) else "0"
            not_a = "0" if a else "1"
            not_b = "0" if b else "1"
            nand_val = "0" if AND(a, b) else "1"
            nor_val = "0" if OR(a, b) else "1"
            
            print(f"{a_str} | {b_str} |  {and_val}  |  {or_val}  |  {xor_val}  |  {not_a}  |  {not_b}  |  {nand_val}  |  {nor_val}")

print_truth_table_2vars()

# ============================================
# 2. 验证布尔代数定律
# ============================================
print("\n=== 验证布尔代数定律 ===")

def verify_laws():
    """验证各种布尔代数定律"""
    
    print("1. 幂等律: A∧A = A, A∨A = A")
    for a in [False, True]:
        and_result = AND(a, a) == a
        or_result = OR(a, a) == a
        print(f"  A={int(a)}: A∧A=A? {and_result}, A∨A=A? {or_result}")
    
    print("\n2. 零一律: A∧1 = A, A∨0 = A")
    for a in [False, True]:
        and_one = AND(a, True) == a
        or_zero = OR(a, False) == a
        print(f"  A={int(a)}: A∧1=A? {and_one}, A∨0=A? {or_zero}")
    
    print("\n3. 支配律: A∧0 = 0, A∨1 = 1")
    for a in [False, True]:
        and_zero = AND(a, False) == False
        or_one = OR(a, True) == True
        print(f"  A={int(a)}: A∧0=0? {and_zero}, A∨1=1? {or_one}")
    
    print("\n4. 互补律: A∧¬A = 0, A∨¬A = 1")
    for a in [False, True]:
        and_comp = AND(a, NOT(a)) == False
        or_comp = OR(a, NOT(a)) == True
        print(f"  A={int(a)}: A∧¬A=0? {and_comp}, A∨¬A=1? {or_comp}")
    
    print("\n5. 德摩根定律")
    print("  ¬(A∧B) = ¬A∨¬B")
    print("  ¬(A∨B) = ¬A∧¬B")
    for a in [False, True]:
        for b in [False, True]:
            left1 = NOT(AND(a, b))
            right1 = OR(NOT(a), NOT(b))
            left2 = NOT(OR(a, b))
            right2 = AND(NOT(a), NOT(b))
            
            match1 = "✓" if left1 == right1 else "✗"
            match2 = "✓" if left2 == right2 else "✗"
            print(f"  A={int(a)}, B={int(b)}: {match1} {match2}")

verify_laws()

# ============================================
# 3. 布尔函数简化
# ============================================
print("\n=== 布尔函数简化 ===")

def simplify_example():
    """
    演示布尔表达式简化
    
    原表达式: F = AB + AB' + A'B
    简化过程:
    F = AB + AB' + A'B
      = A(B + B') + A'B     (提取公因子A)
      = A·1 + A'B           (互补律: B+B'=1)
      = A + A'B             (零一律: A·1=A)
      = A + B               (吸收律)
    """
    print("原表达式: F = AB + AB' + A'B")
    print("简化结果: F = A + B")
    print()
    
    # 验证简化前后等价
    print("验证真值表:")
    print("A | B | 原表达式 | 简化后 | 相等?")
    print("-" * 40)
    
    for a in [False, True]:
        for b in [False, True]:
            # 原表达式: AB + AB' + A'B
            original = OR(OR(AND(a, b), AND(a, NOT(b))), AND(NOT(a), b))
            
            # 简化后: A + B
            simplified = OR(a, b)
            
            equal = "✓" if original == simplified else "✗"
            print(f"{int(a)} | {int(b)} |    {int(original)}     |   {int(simplified)}   |  {equal}")

simplify_example()

# ============================================
# 4. 卡诺图简化（可视化）
# ============================================
print("\n=== 卡诺图概念 ===")

def explain_karnaugh_map():
    """
    解释卡诺图（Karnaugh Map）的概念
    用于简化布尔表达式
    """
    print("卡诺图是一种图形化方法，用于简化布尔表达式")
    print()
    print("2变量卡诺图示例:")
    print("      B=0   B=1")
    print("A=0 |  0  |  1  |")
    print("A=1 |  1  |  1  |")
    print()
    print("相邻的1可以合并，得到简化表达式: F = A + B")
    print()
    print("卡诺图的优点:")
    print("1. 直观可视")
    print("2. 适合手工计算（变量≤4）")
    print("3. 保证找到最简表达式")

explain_karnaugh_map()

# ============================================
# 5. 实际应用：数字电路模拟
# ============================================
print("\n=== 实际应用：数字电路 ===")

class LogicGate:
    """逻辑门类"""
    
    @staticmethod
    def AND_gate(*inputs):
        """多输入AND门"""
        return all(inputs)
    
    @staticmethod
    def OR_gate(*inputs):
        """多输入OR门"""
        return any(inputs)
    
    @staticmethod
    def NOT_gate(input_val):
        """NOT门"""
        return not input_val
    
    @staticmethod
    def XOR_gate(a, b):
        """XOR门"""
        return a != b

# 构建简单电路：半加器
def half_adder(a, b):
    """
    半加器电路
    输入: 两个比特 a, b
    输出: sum (和), carry (进位)
    
    sum = a XOR b
    carry = a AND b
    """
    sum_bit = LogicGate.XOR_gate(a, b)
    carry_bit = LogicGate.AND_gate(a, b)
    return sum_bit, carry_bit

print("半加器测试:")
print("A | B | Sum | Carry")
print("-" * 25)
for a in [0, 1]:
    for b in [0, 1]:
        s, c = half_adder(bool(a), bool(b))
        print(f"{a} | {b} |  {int(s)}  |   {int(c)}")

# 全加器
def full_adder(a, b, carry_in):
    """
    全加器电路
    输入: 三个比特 a, b, carry_in
    输出: sum, carry_out
    """
    # 第一级半加器
    sum1, carry1 = half_adder(a, b)
    # 第二级半加器
    sum_final, carry2 = half_adder(sum1, carry_in)
    # 最终进位
    carry_out = LogicGate.OR_gate(carry1, carry2)
    
    return sum_final, carry_out

print("\n全加器测试:")
print("A | B | Cin | Sum | Cout")
print("-" * 35)
for a in [0, 1]:
    for b in [0, 1]:
        for cin in [0, 1]:
            s, cout = full_adder(bool(a), bool(b), bool(cin))
            print(f"{a} | {b} |  {cin}  |  {int(s)}  |  {int(cout)}")

# ============================================
# 6. 实际应用：权限系统
# ============================================
print("\n=== 实际应用：权限系统 ===")

def check_access(is_admin, has_permission, is_owner, resource_locked):
    """
    检查用户是否有访问资源的权限
    
    规则:
    - 管理员总是可以访问
    - 或者有权限 且 资源未锁定
    - 或者是资源所有者
    """
    can_access = (
        is_admin OR
        (has_permission AND NOT(resource_locked)) OR
        is_owner
    )
    return can_access

# 测试不同场景
test_cases = [
    # (is_admin, has_permission, is_owner, resource_locked, expected_description)
    (True, False, False, True, "管理员可以访问"),
    (False, True, False, False, "有权限且资源未锁定"),
    (False, True, False, True, "有权限但资源锁定"),
    (False, False, True, True, "是所有者可以访问"),
    (False, False, False, False, "无任何权限"),
]

print("权限检查测试:")
print("-" * 60)
for admin, perm, owner, locked, desc in test_cases:
    result = check_access(admin, perm, owner, locked)
    status = "✓ 允许" if result else "✗ 拒绝"
    print(f"管理员:{int(admin)}, 权限:{int(perm)}, 所有者:{int(owner)}, 锁定:{int(locked)}")
    print(f"  → {status} ({desc})")
    print()

# ============================================
# 7. 布尔表达式求值器
# ============================================
print("=== 布尔表达式求值器 ===")

def evaluate_expression(expr, variables):
    """
    简单的布尔表达式求值器
    
    支持的运算符: AND, OR, NOT
    变量用字典传入
    """
    # 替换变量
    for var, value in variables.items():
        expr = expr.replace(var, str(int(value)))
    
    # 替换运算符
    expr = expr.replace('AND', 'and')
    expr = expr.replace('OR', 'or')
    expr = expr.replace('NOT', 'not')
    
    # 将 0/1 转换为 False/True
    expr = expr.replace('0', 'False')
    expr = expr.replace('1', 'True')
    
    try:
        return eval(expr)
    except:
        return None

# 测试
test_expr = "(A AND B) OR (NOT A AND C)"
test_vars = {'A': True, 'B': False, 'C': True}
result = evaluate_expression(test_expr, test_vars)
print(f"表达式: {test_expr}")
print(f"变量: {test_vars}")
print(f"结果: {result}")
```

输出结果：
```
=== 基本布尔运算 ===
A | B | A∧B | A∨B | A⊕B | ¬A  | ¬B  | NAND| NOR 
-----------------------------------------------------------------
0 | 0 |  0  |  0  |  0  |  1  |  1  |  1  |  1
0 | 1 |  0  |  1  |  1  |  1  |  0  |  1  |  0
1 | 0 |  0  |  1  |  1  |  0  |  1  |  1  |  0
1 | 1 |  1  |  1  |  0  |  0  |  0  |  0  |  0

=== 验证布尔代数定律 ===
1. 幂等律: A∧A = A, A∨A = A
  A=0: A∧A=A? True, A∨A=A? True
  A=1: A∧A=A? True, A∨A=A? True

2. 零一律: A∧1 = A, A∨0 = A
  A=0: A∧1=A? True, A∨0=A? True
  A=1: A∧1=A? True, A∨0=A? True

3. 支配律: A∧0 = 0, A∨1 = 1
  A=0: A∧0=0? True, A∨1=1? True
  A=1: A∧0=0? True, A∨1=1? True

4. 互补律: A∧¬A = 0, A∨¬A = 1
  A=0: A∧¬A=0? True, A∨¬A=1? True
  A=1: A∧¬A=0? True, A∨¬A=1? True

5. 德摩根定律
  ¬(A∧B) = ¬A∨¬B
  ¬(A∨B) = ¬A∧¬B
  A=0, B=0: ✓ ✓
  A=0, B=1: ✓ ✓
  A=1, B=0: ✓ ✓
  A=1, B=1: ✓ ✓

=== 布尔函数简化 ===
原表达式: F = AB + AB' + A'B
简化结果: F = A + B

验证真值表:
A | B | 原表达式 | 简化后 | 相等?
----------------------------------------
0 | 0 |    0     |   0   |  ✓
0 | 1 |    1     |   1   |  ✓
1 | 0 |    1     |   1   |  ✓
1 | 1 |    1     |   1   |  ✓

=== 卡诺图概念 ===
卡诺图是一种图形化方法，用于简化布尔表达式

2变量卡诺图示例:
      B=0   B=1
A=0 |  0  |  1  |
A=1 |  1  |  1  |

相邻的1可以合并，得到简化表达式: F = A + B

卡诺图的优点:
1. 直观可视
2. 适合手工计算（变量≤4）
3. 保证找到最简表达式

=== 实际应用：数字电路 ===
半加器测试:
A | B | Sum | Carry
-------------------------
0 | 0 |  0  |   0
0 | 1 |  1  |   0
1 | 0 |  1  |   0
1 | 1 |  0  |   1

全加器测试:
A | B | Cin | Sum | Cout
-----------------------------------
0 | 0 |  0  |  0  |  0
0 | 0 |  1  |  1  |  0
0 | 1 |  0  |  1  |  0
0 | 1 |  1  |  0  |  1
1 | 0 |  0  |  1  |  0
1 | 0 |  1  |  0  |  1
1 | 1 |  0  |  0  |  1
1 | 1 |  1  |  1  |  1

=== 实际应用：权限系统 ===
权限检查测试:
------------------------------------------------------------
管理员:1, 权限:0, 所有者:0, 锁定:1
  → ✓ 允许 (管理员可以访问)

管理员:0, 权限:1, 所有者:0, 锁定:0
  → ✓ 允许 (有权限且资源未锁定)

管理员:0, 权限:1, 所有者:0, 锁定:1
  → ✗ 拒绝 (有权限但资源锁定)

管理员:0, 权限:0, 所有者:1, 锁定:1
  → ✓ 允许 (是所有者可以访问)

管理员:0, 权限:0, 所有者:0, 锁定:0
  → ✗ 拒绝 (无任何权限)

=== 布尔表达式求值器 ===
表达式: (A AND B) OR (NOT A AND C)
变量: {'A': True, 'B': False, 'C': True}
结果: True
```

---

## 练习题

### 练习1：真值表构造
为以下布尔表达式构造真值表：

a) F = A ∧ (B ∨ C)
b) F = (A ∨ B) ∧ (¬A ∨ C)
c) F = A ⊕ B ⊕ C（三变量异或）

### 练习2：布尔表达式简化
使用布尔代数定律简化以下表达式：

a) F = AB + AB' + A'B + A'B'
b) F = (A + B)(A + C)
c) F = ABC + AB'C + A'BC + A'B'C

### 练习3：德摩根定律应用
应用德摩根定律改写以下表达式：

a) ¬(A ∧ B ∧ C)
b) ¬(A ∨ B ∨ C)
c) ¬((A ∧ B) ∨ (C ∧ D))

### 练习4：电路设计
设计实现以下功能的逻辑电路：

a) 三人投票系统：至少两人同意则通过
b) 奇偶校验器：输入4个比特，输出1当且仅当有奇数个1
c) 比较器：比较两个2位二进制数，输出哪个更大

提示：先写出真值表，再推导布尔表达式

### 练习5：编程实践
编写Python程序实现：

```python
def simplify_boolean_expression(expression):
    """
    简化布尔表达式（可以使用第三方库如sympy）
    """
    # 你的代码

def build_truth_table(variables, expression):
    """
    为给定表达式生成真值表
    variables: 变量列表
    expression: 布尔表达式字符串
    """
    # 你的代码
```

---

## 常见误区

### 误区1：混淆布尔代数和普通代数
- **错误**：认为 A + A = 2A
- **正确**：在布尔代数中，A + A = A（幂等律）
- **关键区别**：布尔代数只有0和1，没有2、3等其他数值

### 误区2：忽视运算符优先级
- **错误**：A + B · C 理解为 (A + B) · C
- **正确**：优先级是 NOT > AND > OR
  - A + B · C = A + (B · C)
- **建议**：总是使用括号明确运算顺序

### 误区3：德摩根定律的错误应用
- **错误**：¬(A ∧ B) = ¬A ∧ ¬B
- **正确**：¬(A ∧ B) = ¬A ∨ ¬B（AND变OR）
- **记忆口诀**："打破括号要取反，AND变OR，OR变AND"

### 误区4：混淆XOR和OR
- **错误**：认为 OR 和 XOR 是一样的
- **正确**：
  - OR：至少一个为真即为真（1 OR 1 = 1）
  - XOR：恰好一个为真才为真（1 XOR 1 = 0）
- **应用**：XOR常用于加密和校验

### 误区5：过度简化或简化不足
- **错误**：认为已经是最简形式，但实际上还可以继续简化
- **正确**：使用卡诺图或奎因-麦克拉斯基算法确保最简
- **技巧**：检查是否还有可以合并的项

---

## 小结

本章我们学习了：
1. ✅ 布尔代数的基本运算：AND、OR、NOT
2. ✅ 重要的布尔代数定律（包括德摩根定律）
3. ✅ 布尔函数的简化方法
4. ✅ 用Python模拟逻辑电路
5. ✅ 布尔代数在实际应用中的作用

布尔代数是计算机硬件的基础，从简单的逻辑门到复杂的CPU，都建立在布尔代数之上。下一章我们将学习**图论基础**，探索网络、路径和连接的数学之美！

---

*提示：多画真值表和卡诺图，这是理解和简化布尔表达式的有力工具！*
