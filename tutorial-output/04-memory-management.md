# 第4章：内存管理

> **学习目标**：理解堆栈区别，掌握指针与引用，学会C++智能指针和Java垃圾回收机制。

## 4.1 为什么需要内存管理？

想象你在餐厅用餐：
- **申请座位** = 分配内存
- **用餐过程** = 使用内存
- **离开餐厅** = 释放内存

如果只坐不走 → 餐厅爆满（内存泄漏）  
如果提前清桌 → 客人没吃完（悬空指针）

---

## 4.2 堆 vs 栈

### 概念对比

| 特性 | 栈（Stack） | 堆（Heap） |
|------|------------|-----------|
| 分配方式 | 自动 | 手动 |
| 速度 | 快 | 慢 |
| 大小 | 小（几MB） | 大（GB级） |
| 生命周期 | 函数结束自动释放 | 需手动释放/GC |
| 存储内容 | 局部变量、函数调用 | 动态对象、大数组 |

### 类比

- **栈** = 办公桌抽屉（快速存取，空间有限）
- **堆** = 仓库（空间大，但取东西慢）

### C++ 示例

```cpp
#include <iostream>
#include <vector>

void stackVsHeap() {
    // 栈分配（自动管理）
    int stackVar = 10;
    double arr[100];  // 栈上数组，大小固定
    
    std::cout << "栈变量: " << stackVar << std::endl;
    
    // 堆分配（手动管理）
    int* heapVar = new int(20);
    std::vector<int>* heapVec = new std::vector<int>(1000, 0);
    
    std::cout << "堆变量: " << *heapVar << std::endl;
    
    // ⚠️ 必须手动释放，否则内存泄漏！
    delete heapVar;
    delete heapVec;
}

int main() {
    stackVsHeap();
    return 0;
}
```

### Java 示例

```java
public class StackVsHeap {
    
    public static void stackVsHeap() {
        // 栈分配（基本类型）
        int stackVar = 10;
        double[] arr = new double[100];  // 数组对象在堆上，引用在栈上
        
        System.out.println("栈变量: " + stackVar);
        
        // 堆分配（所有对象都在堆上）
        Integer heapVar = new Integer(20);
        java.util.ArrayList<Integer> heapList = new java.util.ArrayList<>(1000);
        
        System.out.println("堆变量: " + heapVar);
        
        // ✅ Java自动垃圾回收，无需手动释放
    }
    
    public static void main(String[] args) {
        stackVsHeap();
    }
}
```

**关键区别**：
- C++：程序员负责`new/delete`配对
- Java：JVM自动垃圾回收（GC）

---

## 4.3 指针（Pointer）

### 概念

指针就像房间的钥匙：
- **指针变量** = 钥匙本身
- **指针指向的值** = 房间里的物品
- **地址** = 房间号

### C++ 指针基础

```cpp
#include <iostream>

int main() {
    int value = 42;
    int* ptr = &value;  // ptr存储value的地址
    
    std::cout << "值: " << value << std::endl;       // 42
    std::cout << "地址: " << &value << std::endl;     // 0x7fff...
    std::cout << "指针存储的地址: " << ptr << std::endl;  // 0x7fff...
    std::cout << "解引用: " << *ptr << std::endl;     // 42
    
    // 通过指针修改值
    *ptr = 100;
    std::cout << "修改后的值: " << value << std::endl;  // 100
    
    return 0;
}
```

### 常见错误

```cpp
// ❌ 错误1：野指针（未初始化）
int* badPtr;
std::cout << *badPtr;  // 未定义行为！

// ❌ 错误2：悬空指针（指向已释放的内存）
int* dangling = new int(10);
delete dangling;
std::cout << *dangling;  // 危险！内存已释放

// ❌ 错误3：内存泄漏
void leak() {
    int* ptr = new int(100);
    // 忘记delete，函数结束后内存无法访问
}

// ✅ 正确做法
void safe() {
    int* ptr = new int(100);
    // 使用...
    delete ptr;  // 及时释放
    ptr = nullptr;  // 置空，避免悬空
}
```

### Java 中没有指针

Java用**引用（Reference）**替代指针，更安全：

```java
public class ReferenceDemo {
    public static void main(String[] args) {
        // Java引用（类似指针，但不能算术运算）
        String str1 = new String("Hello");
        String str2 = str1;  // str2和str1指向同一对象
        
        System.out.println(str1 == str2);  // true（同一对象）
        
        str1 = new String("World");
        System.out.println(str1 == str2);  // false（不同对象）
        System.out.println(str2);  // Hello（str2不受影响）
    }
}
```

**关键区别**：

| 操作 | C++指针 | Java引用 |
|------|---------|---------|
| 算术运算 | `ptr++` ✅ | ❌ 不支持 |
| 直接访问内存地址 | `&var` ✅ | ❌ 不支持 |
| 空值检查 | `ptr != nullptr` | `ref != null` |
| 手动释放 | `delete ptr` | GC自动回收 |

---

## 4.4 引用（Reference）

### C++ 引用

引用是变量的别名，一旦绑定不能改变：

```cpp
#include <iostream>

void swapByValue(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    // ❌ 不影响原变量
}

void swapByReference(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
    // ✅ 直接影响原变量
}

int main() {
    int x = 10, y = 20;
    
    swapByValue(x, y);
    std::cout << x << ", " << y << std::endl;  // 10, 20（未交换）
    
    swapByReference(x, y);
    std::cout << x << ", " << y << std::endl;  // 20, 10（已交换）
    
    return 0;
}
```

### Java 中的"引用传递"

Java只有值传递，但对象引用是按值传递的：

```java
public class PassByValue {
    
    // ❌ 不能交换基本类型
    public static void swapInt(int a, int b) {
        int temp = a;
        a = b;
        b = temp;
    }
    
    // ✅ 可以修改对象内容
    public static void modifyArray(int[] arr) {
        arr[0] = 999;  // 修改原数组
    }
    
    // ❌ 不能让引用指向新对象
    public static void reassignArray(int[] arr) {
        arr = new int[]{1, 2, 3};  // 只影响局部变量
    }
    
    public static void main(String[] args) {
        int x = 10, y = 20;
        swapInt(x, y);
        System.out.println(x + ", " + y);  // 10, 20
        
        int[] nums = {1, 2, 3};
        modifyArray(nums);
        System.out.println(nums[0]);  // 999
        
        reassignArray(nums);
        System.out.println(nums[0]);  // 999（未改变）
    }
}
```

---

## 4.5 C++ 智能指针

### 为什么需要智能指针？

手动`new/delete`容易出错：
- 忘记释放 → 内存泄漏
- 重复释放 → 程序崩溃
- 异常发生时 → 跳过delete

智能指针自动管理内存，像有自动归还功能的图书馆书籍。

### unique_ptr（独占所有权）

```cpp
#include <iostream>
#include <memory>
#include <string>

class Book {
private:
    std::string title;
    
public:
    Book(std::string t) : title(t) {
        std::cout << "创建《" << title << "》" << std::endl;
    }
    
    ~Book() {
        std::cout << "销毁《" << title << "》" << std::endl;
    }
    
    void read() const {
        std::cout << "正在阅读《" << title << "》" << std::endl;
    }
};

int main() {
    // unique_ptr独占资源，不能复制
    auto book1 = std::make_unique<Book>("C++ Primer");
    book1->read();
    
    // 转移所有权
    auto book2 = std::move(book1);
    // book1现在为空，book2拥有资源
    
    if (!book1) {
        std::cout << "book1已空" << std::endl;
    }
    
    book2->read();
    
    // 函数结束时，book2自动释放内存
    return 0;
}
```

### shared_ptr（共享所有权）

```cpp
#include <iostream>
#include <memory>

int main() {
    // shared_ptr可共享，引用计数
    auto ptr1 = std::make_shared<Book>("Java编程思想");
    std::cout << "引用计数: " << ptr1.use_count() << std::endl;  // 1
    
    {
        auto ptr2 = ptr1;  // 共享所有权
        std::cout << "引用计数: " << ptr1.use_count() << std::endl;  // 2
        
        ptr2->read();
    }
    // ptr2销毁，引用计数减1
    
    std::cout << "引用计数: " << ptr1.use_count() << std::endl;  // 1
    ptr1->read();
    
    // ptr1销毁，引用计数为0，自动释放内存
    return 0;
}
```

### 选择指南

| 场景 | 推荐类型 |
|------|---------|
| 单一所有者 | `unique_ptr` |
| 多个所有者 | `shared_ptr` |
| 观察但不拥有 | `weak_ptr` |
| 简单局部变量 | 不用指针，用栈变量 |

---

## 4.6 Java 垃圾回收（GC）

### GC工作原理

Java GC像清洁工，定期清理不再使用的对象：

1. **标记**：找出所有可达对象
2. **清除**：回收不可达对象的内存
3. **整理**：压缩内存碎片

### 触发GC的条件

- 堆内存不足
- 显式调用`System.gc()`（建议性，不保证立即执行）
- JVM空闲时

### 查看GC信息

```java
public class GCDemo {
    public static void main(String[] args) {
        // 获取运行时信息
        Runtime runtime = Runtime.getRuntime();
        
        System.out.println("最大内存: " + runtime.maxMemory() / 1024 / 1024 + " MB");
        System.out.println("当前内存: " + runtime.totalMemory() / 1024 / 1024 + " MB");
        System.out.println("空闲内存: " + runtime.freeMemory() / 1024 / 1024 + " MB");
        
        // 创建大量对象
        for (int i = 0; i < 100000; i++) {
            String str = new String("Object " + i);
            // 循环结束后，这些对象变为不可达
        }
        
        // 建议GC（不保证立即执行）
        System.gc();
        
        System.out.println("GC后空闲内存: " + runtime.freeMemory() / 1024 / 1024 + " MB");
    }
}
```

### 避免内存泄漏

即使是Java，也可能内存泄漏：

```java
import java.util.ArrayList;
import java.util.List;

public class MemoryLeakDemo {
    private static List<Object> cache = new ArrayList<>();
    
    public static void addObject(Object obj) {
        cache.add(obj);
        // ❌ 永远不移除，导致内存泄漏
    }
    
    public static void main(String[] args) {
        // 模拟持续添加对象
        for (int i = 0; i < 1000000; i++) {
            addObject(new byte[1024]);  // 每个1KB
        }
        
        System.out.println("缓存大小: " + cache.size());
        // cache持有所有对象引用，GC无法回收
    }
}
```

**修复方法**：
```java
// ✅ 使用弱引用
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

public class WeakRefDemo {
    private static List<WeakReference<Object>> cache = new ArrayList<>();
    
    public static void addObject(Object obj) {
        cache.add(new WeakReference<>(obj));
        // GC时可以回收弱引用对象
    }
}
```

---

## 4.7 内存管理最佳实践

### C++ 最佳实践

```cpp
// ✅ 优先使用栈变量
void good() {
    std::vector<int> vec(1000);  // 自动管理
}

// ✅ 必须用堆时，用智能指针
void better() {
    auto ptr = std::make_unique<int>(42);
    // 自动释放
}

// ❌ 避免裸指针
void bad() {
    int* ptr = new int(42);
    // 可能忘记delete
}

// ✅ RAII原则：资源获取即初始化
class FileHandler {
private:
    FILE* file;
public:
    FileHandler(const char* filename) {
        file = fopen(filename, "r");
    }
    ~FileHandler() {
        if (file) fclose(file);  // 析构时自动关闭
    }
};
```

### Java 最佳实践

```java
// ✅ 及时将不再需要的引用置null
public void processLargeData() {
    byte[] data = new byte[10_000_000];  // 10MB
    // 处理数据...
    data = null;  // 帮助GC识别
}

// ✅ 使用try-with-resources自动关闭资源
public void readFile() throws IOException {
    try (BufferedReader reader = new BufferedReader(new FileReader("test.txt"))) {
        String line = reader.readLine();
        // 自动关闭
    }
}

// ❌ 避免创建过多短生命周期对象
public String badConcat() {
    String result = "";
    for (int i = 0; i < 10000; i++) {
        result += i;  // 每次创建新String对象
    }
    return result;
}

// ✅ 使用StringBuilder
public String goodConcat() {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < 10000; i++) {
        sb.append(i);
    }
    return sb.toString();
}
```

---

## 4.8 实战：内存泄漏检测

### C++ 简单检测工具

```cpp
#include <iostream>
#include <map>
#include <cstdlib>

class MemoryTracker {
private:
    static std::map<void*, size_t> allocations;
    
public:
    static void* allocate(size_t size) {
        void* ptr = malloc(size);
        allocations[ptr] = size;
        return ptr;
    }
    
    static void deallocate(void* ptr) {
        allocations.erase(ptr);
        free(ptr);
    }
    
    static void reportLeaks() {
        if (allocations.empty()) {
            std::cout << "无内存泄漏" << std::endl;
        } else {
            std::cout << "发现 " << allocations.size() << " 处泄漏:" << std::endl;
            for (const auto& pair : allocations) {
                std::cout << "  地址: " << pair.first 
                          << ", 大小: " << pair.second << " 字节" << std::endl;
            }
        }
    }
};

std::map<void*, size_t> MemoryTracker::allocations;

// 重载new/delete
void* operator new(size_t size) {
    return MemoryTracker::allocate(size);
}

void operator delete(void* ptr) noexcept {
    MemoryTracker::deallocate(ptr);
}

int main() {
    int* ptr1 = new int(10);
    int* ptr2 = new int(20);
    
    delete ptr1;
    // 故意不删除ptr2，模拟泄漏
    
    MemoryTracker::reportLeaks();
    // 输出: 发现 1 处泄漏
    
    delete ptr2;  // 清理
    return 0;
}
```

---

## 练习题

1. 编写一个程序，演示栈溢出（递归过深）和堆溢出的情况
2. 实现一个简单的对象池，复用已分配的对象以减少内存分配开销
3. 分析以下代码的内存问题并修复：
   ```cpp
   int* createArray(int size) {
       int arr[size];  // 栈上数组
       return arr;     // ❌ 返回局部变量地址
   }
   ```
4. 比较C++智能指针和Java GC的优缺点，各举一个适用场景

## 延伸阅读

- [ELI5: 堆栈内存可视化图解](../visuals/memory.html)
- [第5章：异常处理](./05-exception-handling.md)
