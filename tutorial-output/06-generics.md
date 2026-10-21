# 第6章：泛型编程

> **学习目标**：掌握C++模板和Java泛型，学会编写类型安全的通用代码。

## 6.1 为什么需要泛型？

想象你要设计一个盒子：

**没有泛型**：
- 需要一个装书的盒子
- 需要一个装衣服的盒子
- 需要一个装食物的盒子
- ...每个类型都要写一遍！

**有泛型**：
- 一个`Box<T>`盒子，T可以是任何类型

**好处**：
- ✅ 代码复用：一套逻辑支持多种类型
- ✅ 类型安全：编译时检查，避免运行时错误
- ✅ 性能优化：无需类型转换

---

## 6.2 C++ 模板基础

### 函数模板

```cpp
#include <iostream>
#include <string>

// 模板函数：交换两个值
template<typename T>
void swap(T& a, T& b) {
    T temp = a;
    a = b;
    b = temp;
}

// 模板函数：找最大值
template<typename T>
T max(const T& a, const T& b) {
    return (a > b) ? a : b;
}

int main() {
    // 自动推导类型
    int x = 10, y = 20;
    swap(x, y);
    std::cout << "x=" << x << ", y=" << y << std::endl;  // x=20, y=10
    
    double a = 3.14, b = 2.71;
    std::cout << "最大值: " << max(a, b) << std::endl;  // 3.14
    
    std::string s1 = "Hello", s2 = "World";
    std::cout << "最大值: " << max(s1, s2) << std::endl;  // World
    
    return 0;
}
```

### 类模板

```cpp
#include <iostream>
#include <vector>
#include <string>

// 通用栈容器
template<typename T>
class Stack {
private:
    std::vector<T> elements;
    
public:
    void push(const T& item) {
        elements.push_back(item);
    }
    
    T pop() {
        if (elements.empty()) {
            throw std::runtime_error("栈为空");
        }
        T top = elements.back();
        elements.pop_back();
        return top;
    }
    
    bool empty() const {
        return elements.empty();
    }
    
    size_t size() const {
        return elements.size();
    }
};

int main() {
    // 整数栈
    Stack<int> intStack;
    intStack.push(1);
    intStack.push(2);
    intStack.push(3);
    
    while (!intStack.empty()) {
        std::cout << intStack.pop() << " ";  // 3 2 1
    }
    std::cout << std::endl;
    
    // 字符串栈
    Stack<std::string> strStack;
    strStack.push("Hello");
    strStack.push("World");
    
    while (!strStack.empty()) {
        std::cout << strStack.pop() << " ";  // World Hello
    }
    std::cout << std::endl;
    
    return 0;
}
```

---

## 6.3 Java 泛型基础

### 泛型方法

```java
public class GenericMethods {
    
    // 泛型方法：交换数组中的两个元素
    public static <T> void swap(T[] arr, int i, int j) {
        T temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    // 泛型方法：找最大值（需要Comparable）
    public static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }
    
    public static void main(String[] args) {
        Integer[] nums = {1, 2, 3, 4, 5};
        swap(nums, 0, 4);
        System.out.println(java.util.Arrays.toString(nums));  // [5, 2, 3, 4, 1]
        
        String[] strs = {"Hello", "World"};
        swap(strs, 0, 1);
        System.out.println(java.util.Arrays.toString(strs));  // [World, Hello]
        
        System.out.println("最大值: " + max(10, 20));  // 20
        System.out.println("最大值: " + max("Apple", "Banana"));  // Banana
    }
}
```

### 泛型类

```java
import java.util.ArrayList;
import java.util.List;

// 通用栈容器
public class Stack<T> {
    private List<T> elements = new ArrayList<>();
    
    public void push(T item) {
        elements.add(item);
    }
    
    public T pop() {
        if (elements.isEmpty()) {
            throw new RuntimeException("栈为空");
        }
        return elements.remove(elements.size() - 1);
    }
    
    public boolean isEmpty() {
        return elements.isEmpty();
    }
    
    public int size() {
        return elements.size();
    }
    
    public static void main(String[] args) {
        // 整数栈
        Stack<Integer> intStack = new Stack<>();
        intStack.push(1);
        intStack.push(2);
        intStack.push(3);
        
        while (!intStack.isEmpty()) {
            System.out.print(intStack.pop() + " ");  // 3 2 1
        }
        System.out.println();
        
        // 字符串栈
        Stack<String> strStack = new Stack<>();
        strStack.push("Hello");
        strStack.push("World");
        
        while (!strStack.isEmpty()) {
            System.out.print(strStack.pop() + " ");  // World Hello
        }
        System.out.println();
    }
}
```

---

## 6.4 类型约束

### C++ 概念（C++20）或SFINAE

```cpp
#include <iostream>
#include <type_traits>
#include <string>

// 只接受数值类型的模板
template<typename T>
typename std::enable_if<std::is_arithmetic<T>::value, T>::type
safeDivide(T a, T b) {
    if (b == 0) {
        throw std::runtime_error("除数为零");
    }
    return a / b;
}

// C++20 concept（更清晰）
/*
template<typename T>
concept Numeric = std::is_arithmetic_v<T>;

template<Numeric T>
T safeDivide(T a, T b) {
    if (b == 0) throw std::runtime_error("除数为零");
    return a / b;
}
*/

// 只接受可比较的类型
template<typename T>
auto findMax(const std::vector<T>& vec) -> decltype(vec[0]) {
    if (vec.empty()) {
        throw std::runtime_error("空容器");
    }
    
    T maxVal = vec[0];
    for (size_t i = 1; i < vec.size(); i++) {
        if (vec[i] > maxVal) {
            maxVal = vec[i];
        }
    }
    return maxVal;
}

int main() {
    std::cout << safeDivide(10, 3) << std::endl;       // 3
    std::cout << safeDivide(10.0, 3.0) << std::endl;   // 3.33333
    
    // safeDivide("a", "b");  // ❌ 编译错误：不是数值类型
    
    std::vector<int> nums = {3, 1, 4, 1, 5, 9};
    std::cout << "最大值: " << findMax(nums) << std::endl;  // 9
    
    return 0;
}
```

### Java 通配符与边界

```java
import java.util.*;

public class GenericBounds {
    
    // 上界：只接受Number及其子类
    public static double sum(List<? extends Number> numbers) {
        double sum = 0;
        for (Number num : numbers) {
            sum += num.doubleValue();
        }
        return sum;
    }
    
    // 下界：只接受Integer的父类
    public static void addNumbers(List<? super Integer> list) {
        list.add(1);
        list.add(2);
        list.add(3);
    }
    
    // 多边界
    public static <T extends Comparable<T> & Serializable> void process(T item) {
        System.out.println("处理: " + item);
    }
    
    public static void main(String[] args) {
        List<Integer> ints = Arrays.asList(1, 2, 3);
        List<Double> doubles = Arrays.asList(1.1, 2.2, 3.3);
        
        System.out.println("整数和: " + sum(ints));      // 6.0
        System.out.println("浮点和: " + sum(doubles));    // 6.6
        
        List<Number> numbers = new ArrayList<>();
        addNumbers(numbers);
        System.out.println(numbers);  // [1, 2, 3]
        
        process("Hello");  // String实现Comparable和Serializable
    }
}
```

**PECS原则**（Producer Extends, Consumer Super）：
- `? extends T`：只读，从集合获取数据
- `? super T`：只写，向集合添加数据

---

## 6.5 模板特化（C++）

### 为特定类型提供优化实现

```cpp
#include <iostream>
#include <string>
#include <vector>

// 通用哈希函数模板
template<typename T>
size_t hash(const T& value) {
    // 简单实现：返回值的字节表示的哈希
    const unsigned char* bytes = reinterpret_cast<const unsigned char*>(&value);
    size_t h = 0;
    for (size_t i = 0; i < sizeof(T); i++) {
        h = h * 31 + bytes[i];
    }
    return h;
}

// 特化：string类型
template<>
size_t hash<std::string>(const std::string& str) {
    size_t h = 5381;
    for (char c : str) {
        h = h * 33 + c;
    }
    return h;
}

// 特化：vector类型
template<typename T>
size_t hash<std::vector<T>>(const std::vector<T>& vec) {
    size_t h = 0;
    for (const auto& item : vec) {
        h ^= hash(item) + 0x9e3779b9 + (h << 6) + (h >> 2);
    }
    return h;
}

int main() {
    std::cout << "int哈希: " << hash(42) << std::endl;
    std::cout << "string哈希: " << hash(std::string("Hello")) << std::endl;
    
    std::vector<int> vec = {1, 2, 3};
    std::cout << "vector哈希: " << hash(vec) << std::endl;
    
    return 0;
}
```

### Java 无特化，用方法重载替代

```java
import java.util.*;

public class HashUtils {
    
    // 通用哈希
    public static int hash(Object value) {
        return value.hashCode();
    }
    
    // 重载：String专用
    public static int hash(String str) {
        int h = 5381;
        for (char c : str.toCharArray()) {
            h = h * 33 + c;
        }
        return h;
    }
    
    // 重载：List专用
    public static <T> int hash(List<T> list) {
        int h = 0;
        for (T item : list) {
            h ^= hash(item) + 0x9e3779b9 + (h << 6) + (h >> 2);
        }
        return h;
    }
    
    public static void main(String[] args) {
        System.out.println("int哈希: " + hash(42));
        System.out.println("string哈希: " + hash("Hello"));
        System.out.println("list哈希: " + hash(Arrays.asList(1, 2, 3)));
    }
}
```

---

## 6.6 可变参数模板（C++11+）

### 打印任意数量的参数

```cpp
#include <iostream>
#include <string>

// 基准情况：单个参数
template<typename T>
void print(const T& value) {
    std::cout << value << std::endl;
}

// 递归情况：多个参数
template<typename T, typename... Args>
void print(const T& first, const Args&... rest) {
    std::cout << first << ", ";
    print(rest...);  // 递归展开
}

// C++17 fold expression（更简洁）
template<typename... Args>
void printAll(const Args&... args) {
    ((std::cout << args << " "), ...);
    std::cout << std::endl;
}

int main() {
    print(1, 2.5, "Hello", 'A');
    // 输出: 1, 2.5, Hello, A
    
    printAll(10, 20, 30);
    // 输出: 10 20 30
    
    return 0;
}
```

### Java 可变参数

```java
public class VarArgsDemo {
    
    // 可变参数
    public static void print(Object... args) {
        for (int i = 0; i < args.length; i++) {
            if (i > 0) System.out.print(", ");
            System.out.print(args[i]);
        }
        System.out.println();
    }
    
    // 求和
    public static double sum(double... numbers) {
        double total = 0;
        for (double num : numbers) {
            total += num;
        }
        return total;
    }
    
    public static void main(String[] args) {
        print(1, 2.5, "Hello", 'A');
        // 输出: 1, 2.5, Hello, A
        
        System.out.println("和: " + sum(1, 2, 3, 4, 5));  // 15.0
    }
}
```

---

## 6.7 泛型实战：通用缓存系统

### C++ 实现

```cpp
#include <iostream>
#include <unordered_map>
#include <chrono>
#include <optional>
#include <string>

template<typename K, typename V>
class Cache {
private:
    struct CacheEntry {
        V value;
        std::chrono::steady_clock::time_point expiry;
        
        bool isExpired() const {
            return std::chrono::steady_clock::now() > expiry;
        }
    };
    
    std::unordered_map<K, CacheEntry> store;
    std::chrono::seconds defaultTTL;
    
public:
    Cache(std::chrono::seconds ttl = std::chrono::minutes(5))
        : defaultTTL(ttl) {}
    
    void put(const K& key, const V& value, 
             std::chrono::seconds ttl = std::chrono::seconds::zero()) {
        auto expiry = std::chrono::steady_clock::now() + 
                     (ttl.count() > 0 ? ttl : defaultTTL);
        store[key] = {value, expiry};
    }
    
    std::optional<V> get(const K& key) {
        auto it = store.find(key);
        if (it == store.end()) {
            return std::nullopt;
        }
        
        if (it->second.isExpired()) {
            store.erase(it);
            return std::nullopt;
        }
        
        return it->second.value;
    }
    
    bool remove(const K& key) {
        return store.erase(key) > 0;
    }
    
    void clear() {
        store.clear();
    }
    
    size_t size() const {
        return store.size();
    }
};

int main() {
    Cache<std::string, int> intCache(std::chrono::seconds(10));
    intCache.put("age", 25);
    intCache.put("score", 100);
    
    if (auto value = intCache.get("age")) {
        std::cout << "age: " << *value << std::endl;  // age: 25
    }
    
    Cache<int, std::string> strCache;
    strCache.put(1, "One");
    strCache.put(2, "Two");
    
    if (auto value = strCache.get(1)) {
        std::cout << "1: " << *value << std::endl;  // 1: One
    }
    
    return 0;
}
```

### Java 实现

```java
import java.util.*;
import java.util.concurrent.*;

public class Cache<K, V> {
    
    private static class CacheEntry<V> {
        V value;
        long expiryTime;
        
        CacheEntry(V value, long ttlMillis) {
            this.value = value;
            this.expiryTime = System.currentTimeMillis() + ttlMillis;
        }
        
        boolean isExpired() {
            return System.currentTimeMillis() > expiryTime;
        }
    }
    
    private final ConcurrentHashMap<K, CacheEntry<V>> store = new ConcurrentHashMap<>();
    private final long defaultTTL;
    
    public Cache(long defaultTTLMillis) {
        this.defaultTTL = defaultTTLMillis;
    }
    
    public void put(K key, V value) {
        put(key, value, defaultTTL);
    }
    
    public void put(K key, V value, long ttlMillis) {
        store.put(key, new CacheEntry<>(value, ttlMillis));
    }
    
    public Optional<V> get(K key) {
        CacheEntry<V> entry = store.get(key);
        if (entry == null) {
            return Optional.empty();
        }
        
        if (entry.isExpired()) {
            store.remove(key);
            return Optional.empty();
        }
        
        return Optional.of(entry.value);
    }
    
    public boolean remove(K key) {
        return store.remove(key) != null;
    }
    
    public void clear() {
        store.clear();
    }
    
    public int size() {
        // 清理过期项后返回大小
        store.entrySet().removeIf(entry -> entry.getValue().isExpired());
        return store.size();
    }
    
    public static void main(String[] args) {
        Cache<String, Integer> intCache = new Cache<>(10000);  // 10秒TTL
        intCache.put("age", 25);
        intCache.put("score", 100);
        
        intCache.get("age").ifPresent(value -> 
            System.out.println("age: " + value));  // age: 25
        
        Cache<Integer, String> strCache = new Cache<>(60000);
        strCache.put(1, "One");
        strCache.put(2, "Two");
        
        strCache.get(1).ifPresent(value -> 
            System.out.println("1: " + value));  // 1: One
    }
}
```

---

## 6.8 C++模板 vs Java泛型对比

| 特性 | C++模板 | Java泛型 |
|------|---------|---------|
| 实现方式 | 编译时实例化 | 类型擦除 |
| 性能 | 无运行时开销 | 轻微开销（类型检查） |
| 基本类型 | 支持`int`、`double`等 | 需用包装类`Integer`、`Double` |
| 特化 | 支持 | 不支持 |
| 可变参数 | 支持模板包 | 支持可变参数 |
| 约束机制 | concept/SFINAE | extends边界 |
| 代码膨胀 | 可能（每个类型生成一份代码） | 不会（共享同一份字节码） |

---

## 练习题

1. 实现一个通用的Pair类模板，支持不同类型的键值对
2. 创建一个泛型二叉树，支持插入、查找、遍历操作
3. 用C++模板元编程计算斐波那契数列（编译时计算）
4. 实现一个类型安全的枚举转换器，将字符串转换为对应的枚举值

## 延伸阅读

- [ELI5: 泛型类型擦除可视化图解](../visuals/generics.html)
- [第7章：标准库实战](./07-standard-library.md)
