# 第8章：设计原则

> **学习目标**：掌握SOLID、DRY、KISS等核心设计原则，学会编写可维护的代码。

## 8.1 为什么需要设计原则？

想象你在写文章：
- **没有原则** = 想到哪写到哪，逻辑混乱
- **有原则** = 结构清晰，读者易懂

代码也是同理。好的设计原则能：
- ✅ 降低耦合度，模块独立
- ✅ 提高可读性，易于理解
- ✅ 方便扩展，添加功能不改旧代码
- ✅ 减少bug，逻辑清晰不易出错

---

## 8.2 SOLID原则概览

SOLID是5个面向对象设计原则的首字母缩写：

| 原则 | 英文 | 核心思想 |
|------|------|---------|
| S | Single Responsibility | 一个类只做一件事 |
| O | Open/Closed | 对扩展开放，对修改关闭 |
| L | Liskov Substitution | 子类可替换父类 |
| I | Interface Segregation | 接口小而专一 |
| D | Dependency Inversion | 依赖抽象而非具体 |

---

## 8.3 单一职责原则（SRP）

### 概念

**一个类应该只有一个引起它变化的原因。**

类比：餐厅分工
- 厨师只负责做菜
- 服务员只负责接待
- 收银员只负责结账

### ❌ 违反SRP

```cpp
// C++ - 坏例子
class StudentManager {
public:
    void saveToDatabase(Student& s) { /* 数据库操作 */ }
    void generateReport(Student& s) { /* 报表生成 */ }
    void sendEmail(Student& s) { /* 邮件发送 */ }
    void validateData(Student& s) { /* 数据验证 */ }
};
// 四个职责，任何一处改动都可能影响整个类
```

```java
// Java - 坏例子
class StudentManager {
    public void saveToDatabase(Student s) { /* 数据库操作 */ }
    public void generateReport(Student s) { /* 报表生成 */ }
    public void sendEmail(Student s) { /* 邮件发送 */ }
    public void validateData(Student s) { /* 数据验证 */ }
}
```

### ✅ 遵循SRP

```cpp
// C++ - 好例子
class StudentRepository {
public:
    void save(Student& s) { /* 只负责持久化 */ }
    Student findById(int id) { /* 只负责查询 */ }
};

class StudentReportGenerator {
public:
    std::string generate(Student& s) { /* 只负责报表 */ }
};

class EmailService {
public:
    void send(std::string to, std::string content) { /* 只负责发邮件 */ }
};

class StudentValidator {
public:
    bool validate(Student& s) { /* 只负责验证 */ }
};
```

```java
// Java - 好例子
class StudentRepository {
    public void save(Student s) { /* 只负责持久化 */ }
    public Student findById(int id) { /* 只负责查询 */ }
}

class StudentReportGenerator {
    public String generate(Student s) { /* 只负责报表 */ }
}

class EmailService {
    public void send(String to, String content) { /* 只负责发邮件 */ }
}

class StudentValidator {
    public boolean validate(Student s) { /* 只负责验证 */ }
}
```

**好处**：
- 修改数据库不影响报表逻辑
- 测试时可以单独测试每个类
- 新人容易理解每个类的职责

---

## 8.4 开闭原则（OCP）

### 概念

**软件实体应对扩展开放，对修改关闭。**

类比：电源插座
- 可以插各种电器（扩展）
- 不需要改墙里的电线（不修改）

### ❌ 违反OCP

```cpp
// C++ - 坏例子：每新增形状都要修改代码
class ShapeCalculator {
public:
    double calculateArea(void* shape, std::string type) {
        if (type == "circle") {
            Circle* c = (Circle*)shape;
            return 3.14 * c->radius * c->radius;
        } else if (type == "rectangle") {
            Rectangle* r = (Rectangle*)shape;
            return r->width * r->height;
        }
        // 新增三角形又要加else if...
        return 0;
    }
};
```

```java
// Java - 坏例子
class ShapeCalculator {
    public double calculateArea(Object shape, String type) {
        if ("circle".equals(type)) {
            Circle c = (Circle) shape;
            return Math.PI * c.radius * c.radius;
        } else if ("rectangle".equals(type)) {
            Rectangle r = (Rectangle) shape;
            return r.width * r.height;
        }
        // 新增形状又要改代码
        return 0;
    }
}
```

### ✅ 遵循OCP

```cpp
// C++ - 好例子：使用多态
class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() {}
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override {
        return 3.14159 * radius * radius;
    }
};

class Rectangle : public Shape {
private:
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const override {
        return width * height;
    }
};

// 新增Triangle无需修改现有代码
class Triangle : public Shape {
private:
    double base, height;
public:
    Triangle(double b, double h) : base(b), height(h) {}
    double area() const override {
        return 0.5 * base * height;
    }
};

// 计算器无需改动
class ShapeCalculator {
public:
    double totalArea(const std::vector<std::unique_ptr<Shape>>& shapes) {
        double sum = 0;
        for (const auto& shape : shapes) {
            sum += shape->area();  // 多态调用
        }
        return sum;
    }
};
```

```java
// Java - 好例子
abstract class Shape {
    public abstract double area();
}

class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

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
}

// 新增Triangle无需修改现有代码
class Triangle extends Shape {
    private double base, height;
    
    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }
    
    @Override
    public double area() {
        return 0.5 * base * height;
    }
}

class ShapeCalculator {
    public double totalArea(List<Shape> shapes) {
        return shapes.stream()
                    .mapToDouble(Shape::area)
                    .sum();
    }
}
```

**测试扩展**：
```cpp
int main() {
    ShapeCalculator calc;
    std::vector<std::unique_ptr<Shape>> shapes;
    
    shapes.push_back(std::make_unique<Circle>(5.0));
    shapes.push_back(std::make_unique<Rectangle>(4.0, 6.0));
    shapes.push_back(std::make_unique<Triangle>(3.0, 4.0));  // 新增！
    
    std::cout << "总面积: " << calc.totalArea(shapes) << std::endl;
    // 无需修改ShapeCalculator代码
}
```

---

## 8.5 里氏替换原则（LSP）

### 概念

**子类对象应该能够替换父类对象，而不影响程序正确性。**

类比：电动车可以替代汽油车
- 都能开
- 都能刹车
- 但电动车不能突然要求你找充电桩（改变行为预期）

### ❌ 违反LSP

```java
// Java - 坏例子
class Bird {
    public void fly() {
        System.out.println("飞翔");
    }
}

class Penguin extends Bird {
    @Override
    public void fly() {
        // 企鹅不会飞！
        throw new UnsupportedOperationException("企鹅不会飞");
    }
}

// 使用时代码会崩溃
public void makeBirdFly(Bird bird) {
    bird.fly();  // 如果传入Penguin就崩了
}
```

### ✅ 遵循LSP

```java
// Java - 好例子
interface Flyable {
    void fly();
}

class Bird {
    protected String name;
    
    public Bird(String name) {
        this.name = name;
    }
    
    public void eat() {
        System.out.println(name + "在吃东西");
    }
}

class Sparrow extends Bird implements Flyable {
    public Sparrow() {
        super("麻雀");
    }
    
    @Override
    public void fly() {
        System.out.println("麻雀飞翔");
    }
}

class Penguin extends Bird {
    public Penguin() {
        super("企鹅");
    }
    
    public void swim() {
        System.out.println("企鹅游泳");
    }
}

// 使用时类型明确
public void makeFly(Flyable flyable) {
    flyable.fly();  // 只能传入会飞的鸟
}
```

**C++版本**：
```cpp
#include <iostream>
#include <memory>

class Flyable {
public:
    virtual void fly() = 0;
    virtual ~Flyable() {}
};

class Bird {
protected:
    std::string name;
public:
    Bird(std::string n) : name(n) {}
    
    void eat() {
        std::cout << name << "在吃东西" << std::endl;
    }
    
    virtual ~Bird() {}
};

class Sparrow : public Bird, public Flyable {
public:
    Sparrow() : Bird("麻雀") {}
    
    void fly() override {
        std::cout << "麻雀飞翔" << std::endl;
    }
};

class Penguin : public Bird {
public:
    Penguin() : Bird("企鹅") {}
    
    void swim() {
        std::cout << "企鹅游泳" << std::endl;
    }
};

int main() {
    Sparrow sparrow;
    sparrow.eat();   // 麻雀在吃东西
    sparrow.fly();   // 麻雀飞翔
    
    Penguin penguin;
    penguin.eat();   // 企鹅在吃东西
    penguin.swim();  // 企鹅游泳
    
    return 0;
}
```

---

## 8.6 接口隔离原则（ISP）

### 概念

**客户端不应依赖它不需要的接口。**

类比：多功能瑞士军刀 vs 专用工具
- 修眼镜只需要螺丝刀，不需要带刀、剪刀、开瓶器

### ❌ 违反ISP

```java
// Java - 坏例子：大接口
interface Worker {
    void code();
    void test();
    void design();
    void manage();
    void sell();
}

// 程序员被迫实现不需要的方法
class Programmer implements Worker {
    public void code() { /* 实现 */ }
    public void test() { /* 实现 */ }
    public void design() { /* 实现 */ }
    public void manage() { 
        throw new UnsupportedOperationException();  // 不需要！
    }
    public void sell() { 
        throw new UnsupportedOperationException();  // 不需要！
    }
}
```

### ✅ 遵循ISP

```java
// Java - 好例子：小接口
interface Codable {
    void code();
}

interface Testable {
    void test();
}

interface Designable {
    void design();
}

interface Manageable {
    void manage();
}

// 按需组合
class Programmer implements Codable, Testable {
    public void code() { /* 实现 */ }
    public void test() { /* 实现 */ }
}

class Manager implements Manageable, Designable {
    public void manage() { /* 实现 */ }
    public void design() { /* 实现 */ }
}
```

**C++版本**：
```cpp
#include <iostream>

class Codable {
public:
    virtual void code() = 0;
    virtual ~Codable() {}
};

class Testable {
public:
    virtual void test() = 0;
    virtual ~Testable() {}
};

class Programmer : public Codable, public Testable {
public:
    void code() override {
        std::cout << "写代码" << std::endl;
    }
    
    void test() override {
        std::cout << "测试代码" << std::endl;
    }
};

int main() {
    Programmer prog;
    prog.code();   // 写代码
    prog.test();   // 测试代码
    
    return 0;
}
```

---

## 8.7 依赖倒置原则（DIP）

### 概念

**高层模块不应依赖低层模块，二者都应依赖抽象。**

类比：USB接口
- 电脑不直接连鼠标硬件
- 电脑和鼠标都依赖USB标准

### ❌ 违反DIP

```java
// Java - 坏例子：直接依赖具体实现
class MySQLDatabase {
    public void connect() {
        System.out.println("连接MySQL");
    }
    
    public void query(String sql) {
        System.out.println("执行SQL: " + sql);
    }
}

class UserService {
    private MySQLDatabase db = new MySQLDatabase();  // 硬编码依赖
    
    public void getUser(int id) {
        db.connect();
        db.query("SELECT * FROM users WHERE id=" + id);
    }
}
// 想换PostgreSQL？必须修改UserService代码！
```

### ✅ 遵循DIP

```java
// Java - 好例子：依赖抽象
interface Database {
    void connect();
    void query(String sql);
}

class MySQLDatabase implements Database {
    public void connect() {
        System.out.println("连接MySQL");
    }
    
    public void query(String sql) {
        System.out.println("MySQL执行: " + sql);
    }
}

class PostgreSQLDatabase implements Database {
    public void connect() {
        System.out.println("连接PostgreSQL");
    }
    
    public void query(String sql) {
        System.out.println("PostgreSQL执行: " + sql);
    }
}

class UserService {
    private Database db;
    
    // 通过构造函数注入依赖
    public UserService(Database db) {
        this.db = db;
    }
    
    public void getUser(int id) {
        db.connect();
        db.query("SELECT * FROM users WHERE id=" + id);
    }
}

// 使用时可灵活切换
public class Main {
    public static void main(String[] args) {
        // 用MySQL
        UserService service1 = new UserService(new MySQLDatabase());
        service1.getUser(1);
        
        // 切换到PostgreSQL，无需修改UserService
        UserService service2 = new UserService(new PostgreSQLDatabase());
        service2.getUser(1);
    }
}
```

**C++版本**：
```cpp
#include <iostream>
#include <memory>
#include <string>

class Database {
public:
    virtual void connect() = 0;
    virtual void query(const std::string& sql) = 0;
    virtual ~Database() {}
};

class MySQLDatabase : public Database {
public:
    void connect() override {
        std::cout << "连接MySQL" << std::endl;
    }
    
    void query(const std::string& sql) override {
        std::cout << "MySQL执行: " << sql << std::endl;
    }
};

class PostgreSQLDatabase : public Database {
public:
    void connect() override {
        std::cout << "连接PostgreSQL" << std::endl;
    }
    
    void query(const std::string& sql) override {
        std::cout << "PostgreSQL执行: " << sql << std::endl;
    }
};

class UserService {
private:
    std::unique_ptr<Database> db;
    
public:
    UserService(std::unique_ptr<Database> database)
        : db(std::move(database)) {}
    
    void getUser(int id) {
        db->connect();
        db->query("SELECT * FROM users WHERE id=" + std::to_string(id));
    }
};

int main() {
    // 用MySQL
    UserService service1(std::make_unique<MySQLDatabase>());
    service1.getUser(1);
    
    // 切换到PostgreSQL
    UserService service2(std::make_unique<PostgreSQLDatabase>());
    service2.getUser(1);
    
    return 0;
}
```

---

## 8.8 其他重要原则

### DRY（Don't Repeat Yourself）

**不要重复自己。**

```java
// ❌ 坏例子：重复代码
double calcCircleArea(double r) {
    return 3.14159 * r * r;
}

double calcCylinderVolume(double r, double h) {
    return 3.14159 * r * r * h;  // 重复计算圆面积
}

// ✅ 好例子：提取公共逻辑
double calcCircleArea(double r) {
    return Math.PI * r * r;
}

double calcCylinderVolume(double r, double h) {
    return calcCircleArea(r) * h;  // 复用
}
```

### KISS（Keep It Simple, Stupid）

**保持简单。**

```java
// ❌ 坏例子：过度复杂
public String getGrade(int score) {
    String result;
    if (score >= 90) {
        result = "A";
    } else {
        if (score >= 80) {
            result = "B";
        } else {
            if (score >= 70) {
                result = "C";
            } else {
                if (score >= 60) {
                    result = "D";
                } else {
                    result = "F";
                }
            }
        }
    }
    return result;
}

// ✅ 好例子：简洁明了
public String getGrade(int score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
}
```

### YAGNI（You Ain't Gonna Need It）

**你不会需要它——不要过度设计。**

```java
// ❌ 坏例子：为未来可能的需求提前设计
class User {
    private String name;
    private String email;
    private String phone;
    private String fax;       // 现在没人用传真
    private String pager;     // 寻呼机也过时了
    private String telegram;  // 电报？
}

// ✅ 好例子：只实现当前需要的
class User {
    private String name;
    private String email;
    private String phone;
}
```

---

## 8.9 实战：重构不良代码

### 重构前

```java
// 违反多个原则的大类
class OrderProcessor {
    public void processOrder(Order order) {
        // 验证订单
        if (order.getItems().isEmpty()) {
            throw new IllegalArgumentException("空订单");
        }
        
        // 计算总价
        double total = 0;
        for (Item item : order.getItems()) {
            total += item.getPrice() * item.getQuantity();
        }
        
        // 应用折扣
        if (total > 1000) {
            total *= 0.9;
        }
        
        // 保存到数据库
        Connection conn = DriverManager.getConnection("jdbc:mysql://...", "user", "pass");
        PreparedStatement stmt = conn.prepareStatement("INSERT INTO orders ...");
        stmt.executeUpdate();
        conn.close();
        
        // 发送邮件
        Properties props = new Properties();
        Session session = Session.getInstance(props);
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress("noreply@example.com"));
        message.setRecipients(Message.RecipientType.TO, order.getEmail());
        message.setSubject("订单确认");
        message.setText("您的订单已处理");
        Transport.send(message);
        
        // 更新库存
        for (Item item : order.getItems()) {
            // 直接操作数据库更新库存
        }
    }
}
```

### 重构后

```java
// 遵循SOLID原则
class OrderValidator {
    public void validate(Order order) {
        if (order.getItems().isEmpty()) {
            throw new IllegalArgumentException("空订单");
        }
    }
}

class PriceCalculator {
    private DiscountStrategy discount;
    
    public PriceCalculator(DiscountStrategy discount) {
        this.discount = discount;
    }
    
    public double calculateTotal(List<Item> items) {
        double total = items.stream()
                           .mapToDouble(i -> i.getPrice() * i.getQuantity())
                           .sum();
        return discount.apply(total);
    }
}

interface DiscountStrategy {
    double apply(double amount);
}

class VolumeDiscount implements DiscountStrategy {
    public double apply(double amount) {
        return amount > 1000 ? amount * 0.9 : amount;
    }
}

interface OrderRepository {
    void save(Order order);
}

interface EmailService {
    void sendConfirmation(String email, Order order);
}

interface InventoryService {
    void updateStock(List<Item> items);
}

class OrderProcessor {
    private final OrderValidator validator;
    private final PriceCalculator calculator;
    private final OrderRepository repository;
    private final EmailService emailService;
    private final InventoryService inventoryService;
    
    public OrderProcessor(OrderValidator validator,
                         PriceCalculator calculator,
                         OrderRepository repository,
                         EmailService emailService,
                         InventoryService inventoryService) {
        this.validator = validator;
        this.calculator = calculator;
        this.repository = repository;
        this.emailService = emailService;
        this.inventoryService = inventoryService;
    }
    
    public void processOrder(Order order) {
        validator.validate(order);
        double total = calculator.calculateTotal(order.getItems());
        order.setTotal(total);
        
        repository.save(order);
        emailService.sendConfirmation(order.getEmail(), order);
        inventoryService.updateStock(order.getItems());
    }
}
```

**改进点**：
- ✅ SRP：每个类只负责一件事
- ✅ DIP：依赖接口而非具体实现
- ✅ OCP：新增折扣策略无需修改现有代码
- ✅ 可测试：每个组件可单独测试
- ✅ 可维护：逻辑清晰，易于理解

---

## 练习题

1. 分析以下代码违反了哪些SOLID原则，并重构成符合原则的版本
2. 设计一个简单的支付系统，应用所有SOLID原则
3. 找出你项目中的重复代码，用DRY原则重构
4. 评估一个现有类是否过于复杂，用SRP拆分

## 延伸阅读

- [ELI5: SOLID原则可视化图解](../visuals/solid.html)
- [回到教程首页](./README.md)

---

## 🎓 恭喜完成教程！

你已经完成了《编程基础扩展》全部8章内容：

1. ✅ 数据结构基础
2. ✅ 算法思维
3. ✅ 面向对象编程
4. ✅ 内存管理
5. ✅ 异常处理
6. ✅ 泛型编程
7. ✅ 标准库实战
8. ✅ 设计原则

**下一步建议**：
- 动手实践所有章节的练习题
- 阅读推荐的开源项目源码
- 参与实际项目开发，应用所学知识
- 持续学习进阶主题：并发编程、网络编程、设计模式等

祝你编程之路越走越远！🚀
