# 第3章：面向对象编程

> **学习目标**：掌握类、对象、继承、多态四大核心概念，学会用面向对象思想设计程序。

## 3.1 什么是面向对象？

想象你在设计一个游戏：

**面向过程思维**：
```
玩家数据 → 全局变量
移动函数 → move_player()
攻击函数 → attack_player()
显示函数 → show_player()
```

**面向对象思维**：
```
玩家类 Player {
  属性：名字、血量、位置
  方法：移动()、攻击()、显示()
}
```

**核心优势**：
- ✅ **封装**：数据和操作绑定在一起
- ✅ **复用**：创建多个玩家实例
- ✅ **扩展**：轻松添加新类型的角色

---

## 3.2 类与对象

### 概念类比

- **类（Class）** = 蓝图/模具
- **对象（Object）** = 根据蓝图建造的房子/用模具制作的蛋糕

### C++ 实现

```cpp
#include <iostream>
#include <string>

class Student {
private:
    // 属性（成员变量）
    std::string name;
    int age;
    double gpa;
    
public:
    // 构造函数
    Student(std::string n, int a, double g) 
        : name(n), age(a), gpa(g) {}
    
    // 方法（成员函数）
    void introduce() const {
        std::cout << "我叫" << name << "，今年" 
                  << age << "岁，GPA: " << gpa << std::endl;
    }
    
    bool isExcellent() const {
        return gpa >= 3.5;
    }
    
    // Getter
    std::string getName() const { return name; }
    double getGpa() const { return gpa; }
    
    // Setter
    void setGpa(double g) {
        if (g >= 0 && g <= 4.0) {
            gpa = g;
        }
    }
};

int main() {
    // 创建对象
    Student stu1("张三", 20, 3.8);
    Student stu2("李四", 21, 3.2);
    
    // 调用方法
    stu1.introduce();  // 我叫张三，今年20岁，GPA: 3.8
    stu2.introduce();  // 我叫李四，今年21岁，GPA: 3.2
    
    std::cout << stu1.getName() << "是否优秀: " 
              << (stu1.isExcellent() ? "是" : "否") << std::endl;
    
    return 0;
}
```

### Java 实现

```java
public class Student {
    // 属性（成员变量）
    private String name;
    private int age;
    private double gpa;
    
    // 构造函数
    public Student(String name, int age, double gpa) {
        this.name = name;
        this.age = age;
        this.gpa = gpa;
    }
    
    // 方法（成员函数）
    public void introduce() {
        System.out.println("我叫" + name + "，今年" + age + "岁，GPA: " + gpa);
    }
    
    public boolean isExcellent() {
        return gpa >= 3.5;
    }
    
    // Getter
    public String getName() { return name; }
    public double getGpa() { return gpa; }
    
    // Setter
    public void setGpa(double gpa) {
        if (gpa >= 0 && gpa <= 4.0) {
            this.gpa = gpa;
        }
    }
    
    public static void main(String[] args) {
        // 创建对象
        Student stu1 = new Student("张三", 20, 3.8);
        Student stu2 = new Student("李四", 21, 3.2);
        
        // 调用方法
        stu1.introduce();  // 我叫张三，今年20岁，GPA: 3.8
        stu2.introduce();  // 我叫李四，今年21岁，GPA: 3.2
        
        System.out.println(stu1.getName() + "是否优秀: " + 
                          (stu1.isExcellent() ? "是" : "否"));
    }
}
```

**关键区别**：

| 特性 | C++ | Java |
|------|-----|------|
| 内存管理 | 手动/智能指针 | 自动垃圾回收 |
| 访问控制 | private/public/protected | 相同 + default |
| 构造函数初始化 | 初始化列表 `: name(n)` | 构造函数体内赋值 |

---

## 3.3 封装（Encapsulation）

### 概念

封装就像ATM机：
- **对外**：提供简单的操作界面（插卡、输入密码、取款）
- **对内**：隐藏复杂的验证、记账、出钞逻辑

**好处**：
- 保护数据不被随意修改
- 简化使用接口
- 便于内部实现变更

### C++ 实现

```cpp
#include <iostream>
#include <string>

class BankAccount {
private:
    std::string owner;
    double balance;
    std::string password;  // 私有，外部无法直接访问
    
public:
    BankAccount(std::string o, std::string pwd, double initBalance)
        : owner(o), password(pwd), balance(initBalance) {}
    
    // 通过方法访问私有数据
    bool withdraw(std::string pwd, double amount) {
        if (pwd != password) {
            std::cout << "密码错误！" << std::endl;
            return false;
        }
        if (amount > balance) {
            std::cout << "余额不足！" << std::endl;
            return false;
        }
        balance -= amount;
        std::cout << "取款成功，剩余: " << balance << std::endl;
        return true;
    }
    
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            std::cout << "存款成功，剩余: " << balance << std::endl;
        }
    }
    
    double getBalance(std::string pwd) const {
        return (pwd == password) ? balance : -1;
    }
};

int main() {
    BankAccount account("张三", "123456", 1000.0);
    
    account.deposit(500);       // 存款成功，剩余: 1500
    account.withdraw("123456", 200);  // 取款成功，剩余: 1300
    account.withdraw("wrong", 100);   // 密码错误！
    
    return 0;
}
```

### Java 实现

```java
public class BankAccount {
    private String owner;
    private double balance;
    private String password;  // 私有，外部无法直接访问
    
    public BankAccount(String owner, String password, double initBalance) {
        this.owner = owner;
        this.password = password;
        this.balance = initBalance;
    }
    
    // 通过方法访问私有数据
    public boolean withdraw(String password, double amount) {
        if (!password.equals(this.password)) {
            System.out.println("密码错误！");
            return false;
        }
        if (amount > balance) {
            System.out.println("余额不足！");
            return false;
        }
        balance -= amount;
        System.out.println("取款成功，剩余: " + balance);
        return true;
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("存款成功，剩余: " + balance);
        }
    }
    
    public double getBalance(String password) {
        return password.equals(this.password) ? balance : -1;
    }
    
    public static void main(String[] args) {
        BankAccount account = new BankAccount("张三", "123456", 1000.0);
        
        account.deposit(500);           // 存款成功，剩余: 1500
        account.withdraw("123456", 200); // 取款成功，剩余: 1300
        account.withdraw("wrong", 100);  // 密码错误！
    }
}
```

---

## 3.4 继承（Inheritance）

### 概念

继承就像家族遗传：
- **父类（基类）**：动物（有名字、会吃）
- **子类（派生类）**：狗（继承动物的特性，额外会叫）

**好处**：
- 代码复用：不用重复写共同属性
- 层次清晰：反映现实世界的分类关系

### C++ 实现

```cpp
#include <iostream>
#include <string>

// 父类
class Animal {
protected:  // 子类可访问
    std::string name;
    int age;
    
public:
    Animal(std::string n, int a) : name(n), age(a) {}
    
    void eat() const {
        std::cout << name << "正在吃东西" << std::endl;
    }
    
    virtual void speak() const {  // 虚函数，允许子类重写
        std::cout << "动物发出声音" << std::endl;
    }
    
    virtual ~Animal() {}  // 虚析构函数
};

// 子类：狗
class Dog : public Animal {
private:
    std::string breed;
    
public:
    Dog(std::string n, int a, std::string b) 
        : Animal(n, a), breed(b) {}
    
    // 重写父类方法
    void speak() const override {
        std::cout << name << "汪汪叫" << std::endl;
    }
    
    void fetch() const {
        std::cout << name << "去捡球" << std::endl;
    }
};

// 子类：猫
class Cat : public Animal {
public:
    Cat(std::string n, int a) : Animal(n, a) {}
    
    void speak() const override {
        std::cout << name << "喵喵叫" << std::endl;
    }
    
    void climb() const {
        std::cout << name << "爬树" << std::endl;
    }
};

int main() {
    Dog dog("旺财", 3, "金毛");
    Cat cat("咪咪", 2);
    
    dog.eat();     // 旺财正在吃东西
    dog.speak();   // 旺财汪汪叫
    dog.fetch();   // 旺财去捡球
    
    cat.eat();     // 咪咪正在吃东西
    cat.speak();   // 咪咪喵喵叫
    cat.climb();   // 咪咪爬树
    
    return 0;
}
```

### Java 实现

```java
// 父类
class Animal {
    protected String name;
    protected int age;
    
    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void eat() {
        System.out.println(name + "正在吃东西");
    }
    
    public void speak() {  // 非final，允许子类重写
        System.out.println("动物发出声音");
    }
}

// 子类：狗
class Dog extends Animal {
    private String breed;
    
    public Dog(String name, int age, String breed) {
        super(name, age);  // 调用父类构造函数
        this.breed = breed;
    }
    
    @Override
    public void speak() {
        System.out.println(name + "汪汪叫");
    }
    
    public void fetch() {
        System.out.println(name + "去捡球");
    }
}

// 子类：猫
class Cat extends Animal {
    public Cat(String name, int age) {
        super(name, age);
    }
    
    @Override
    public void speak() {
        System.out.println(name + "喵喵叫");
    }
    
    public void climb() {
        System.out.println(name + "爬树");
    }
}

public class InheritanceDemo {
    public static void main(String[] args) {
        Dog dog = new Dog("旺财", 3, "金毛");
        Cat cat = new Cat("咪咪", 2);
        
        dog.eat();     // 旺财正在吃东西
        dog.speak();   // 旺财汪汪叫
        dog.fetch();   // 旺财去捡球
        
        cat.eat();     // 咪咪正在吃东西
        cat.speak();   // 咪咪喵喵叫
        cat.climb();   // 咪咪爬树
    }
}
```

**关键区别**：

| 特性 | C++ | Java |
|------|-----|------|
| 继承关键字 | `class Dog : public Animal` | `class Dog extends Animal` |
| 调用父类构造 | `: Animal(n, a)` | `super(n, a)` |
| 方法重写标记 | `override`（可选） | `@Override`（推荐） |
| 多继承 | 支持 | 不支持（用接口） |

---

## 3.5 多态（Polymorphism）

### 概念

多态就像遥控器：
- 按同一个"播放"键
- DVD播放器播电影
- 音乐播放器放歌曲
- 游戏机启动游戏

**核心**：同一接口，不同实现

### C++ 实现

```cpp
#include <iostream>
#include <vector>
#include <memory>

// 形状基类
class Shape {
public:
    virtual double area() const = 0;  // 纯虚函数（抽象类）
    virtual std::string getType() const = 0;
    virtual ~Shape() {}
};

// 圆形
class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(double r) : radius(r) {}
    
    double area() const override {
        return 3.14159 * radius * radius;
    }
    
    std::string getType() const override {
        return "圆形";
    }
};

// 矩形
class Rectangle : public Shape {
private:
    double width, height;
    
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    double area() const override {
        return width * height;
    }
    
    std::string getType() const override {
        return "矩形";
    }
};

// 多态应用：计算总面积
double totalArea(const std::vector<std::unique_ptr<Shape>>& shapes) {
    double sum = 0;
    for (const auto& shape : shapes) {
        std::cout << shape->getType() << "面积: " << shape->area() << std::endl;
        sum += shape->area();
    }
    return sum;
}

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5.0));
    shapes.push_back(std::make_unique<Rectangle>(4.0, 6.0));
    shapes.push_back(std::make_unique<Circle>(3.0));
    
    double total = totalArea(shapes);
    std::cout << "总面积: " << total << std::endl;
    
    return 0;
}
```

### Java 实现

```java
import java.util.ArrayList;
import java.util.List;

// 形状基类（抽象类）
abstract class Shape {
    public abstract double area();
    public abstract String getType();
}

// 圆形
class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public String getType() {
        return "圆形";
    }
}

// 矩形
class Rectangle extends Shape {
    private double width, height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double area() {
        return width * height;
    }
    
    @Override
    public String getType() {
        return "矩形";
    }
}

public class PolymorphismDemo {
    
    // 多态应用：计算总面积
    public static double totalArea(List<Shape> shapes) {
        double sum = 0;
        for (Shape shape : shapes) {
            System.out.println(shape.getType() + "面积: " + shape.area());
            sum += shape.area();
        }
        return sum;
    }
    
    public static void main(String[] args) {
        List<Shape> shapes = new ArrayList<>();
        shapes.add(new Circle(5.0));
        shapes.add(new Rectangle(4.0, 6.0));
        shapes.add(new Circle(3.0));
        
        double total = totalArea(shapes);
        System.out.println("总面积: " + total);
    }
}
```

**输出示例**：
```
圆形面积: 78.53975
矩形面积: 24.0
圆形面积: 28.27431
总面积: 130.81406
```

---

## 3.6 综合实战：简易图形编辑器

### 需求
创建一个支持多种图形的编辑器，可以添加图形、计算总面积、显示所有图形信息。

### C++ 实现

```cpp
#include <iostream>
#include <vector>
#include <memory>
#include <string>

// 使用前面定义的 Shape、Circle、Rectangle

class GraphicsEditor {
private:
    std::vector<std::unique_ptr<Shape>> shapes;
    
public:
    void addShape(std::unique_ptr<Shape> shape) {
        shapes.push_back(std::move(shape));
    }
    
    void displayAll() const {
        std::cout << "=== 图形列表 ===" << std::endl;
        for (size_t i = 0; i < shapes.size(); i++) {
            std::cout << i + 1 << ". " << shapes[i]->getType() 
                      << " 面积: " << shapes[i]->area() << std::endl;
        }
    }
    
    double getTotalArea() const {
        double sum = 0;
        for (const auto& shape : shapes) {
            sum += shape->area();
        }
        return sum;
    }
    
    size_t getCount() const {
        return shapes.size();
    }
};

int main() {
    GraphicsEditor editor;
    
    editor.addShape(std::make_unique<Circle>(5.0));
    editor.addShape(std::make_unique<Rectangle>(4.0, 6.0));
    editor.addShape(std::make_unique<Circle>(3.0));
    
    editor.displayAll();
    std::cout << "\n图形数量: " << editor.getCount() << std::endl;
    std::cout << "总面积: " << editor.getTotalArea() << std::endl;
    
    return 0;
}
```

### Java 实现

```java
import java.util.ArrayList;
import java.util.List;

class GraphicsEditor {
    private List<Shape> shapes = new ArrayList<>();
    
    public void addShape(Shape shape) {
        shapes.add(shape);
    }
    
    public void displayAll() {
        System.out.println("=== 图形列表 ===");
        for (int i = 0; i < shapes.size(); i++) {
            Shape shape = shapes.get(i);
            System.out.println((i + 1) + ". " + shape.getType() + 
                             " 面积: " + shape.area());
        }
    }
    
    public double getTotalArea() {
        double sum = 0;
        for (Shape shape : shapes) {
            sum += shape.area();
        }
        return sum;
    }
    
    public int getCount() {
        return shapes.size();
    }
}

public class EditorDemo {
    public static void main(String[] args) {
        GraphicsEditor editor = new GraphicsEditor();
        
        editor.addShape(new Circle(5.0));
        editor.addShape(new Rectangle(4.0, 6.0));
        editor.addShape(new Circle(3.0));
        
        editor.displayAll();
        System.out.println("\n图形数量: " + editor.getCount());
        System.out.println("总面积: " + editor.getTotalArea());
    }
}
```

---

## 3.7 OOP设计原则速查

| 原则 | 说明 | 示例 |
|------|------|------|
| 单一职责 | 一个类只做一件事 | Student只管学生信息，不管数据库 |
| 开闭原则 | 对扩展开放，对修改关闭 | 新增图形类型不需改现有代码 |
| 里氏替换 | 子类可替换父类 | Circle对象可当Shape使用 |
| 接口隔离 | 依赖最小化接口 | 只用area()就不必知道半径 |
| 依赖倒置 | 依赖抽象而非具体 | 编辑器依赖Shape而非Circle |

---

## 练习题

1. 创建一个Employee基类，派生出Manager和Developer子类，各自有不同的薪资计算方法
2. 设计一个简单的支付系统，支持支付宝、微信、银行卡多种支付方式（多态）
3. 实现一个图书馆管理系统，包含Book、Magazine、DVD等不同媒体类型
4. 分析以下代码违反了哪些OOP原则，并重构改进

## 延伸阅读

- [ELI5: 继承与多态可视化图解](../visuals/oop.html)
- [第4章：内存管理](./04-memory-management.md)
