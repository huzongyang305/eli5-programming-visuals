# 第7章：标准库实战

> **学习目标**：掌握C++ STL和Java Collections常用容器与算法，学会选择合适的工具。

## 7.1 为什么需要标准库？

想象你要建房子：
- **不用标准库** = 自己烧砖、炼钢、造水泥
- **用标准库** = 直接购买建材，专注建筑设计

**好处**：
- ✅ 经过充分测试，bug少
- ✅ 性能优化好，效率高
- ✅ 跨平台兼容，可移植
- ✅ 社区支持强，文档丰富

---

## 7.2 序列容器对比

### C++ STL序列容器

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <deque>
#include <array>
#include <chrono>

void compareContainers() {
    // vector：动态数组，随机访问快
    std::vector<int> vec = {1, 2, 3, 4, 5};
    vec.push_back(6);           // O(1) 摊销
    std::cout << "vec[2]: " << vec[2] << std::endl;  // O(1)
    
    // list：双向链表，插入删除快
    std::list<int> lst = {1, 2, 3, 4, 5};
    lst.push_front(0);          // O(1)
    lst.insert(++lst.begin(), 99);  // O(1)（已知位置）
    
    // deque：双端队列，两端操作都快
    std::deque<int> deq = {1, 2, 3, 4, 5};
    deq.push_front(0);          // O(1)
    deq.push_back(6);           // O(1)
    std::cout << "deq[2]: " << deq[2] << std::endl;  // O(1)
    
    // array：固定大小数组，零开销
    std::array<int, 5> arr = {1, 2, 3, 4, 5};
    std::cout << "arr[2]: " << arr[2] << std::endl;  // O(1)
}

// 性能测试
void performanceTest() {
    const int SIZE = 1000000;
    
    // vector尾部插入
    auto start = std::chrono::high_resolution_clock::now();
    std::vector<int> vec;
    for (int i = 0; i < SIZE; i++) {
        vec.push_back(i);
    }
    auto end = std::chrono::high_resolution_clock::now();
    std::cout << "vector插入: " 
              << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() 
              << "ms" << std::endl;
    
    // list头部插入
    start = std::chrono::high_resolution_clock::now();
    std::list<int> lst;
    for (int i = 0; i < SIZE; i++) {
        lst.push_front(i);
    }
    end = std::chrono::high_resolution_clock::now();
    std::cout << "list插入: " 
              << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() 
              << "ms" << std::endl;
}

int main() {
    compareContainers();
    performanceTest();
    return 0;
}
```

### Java Collections序列容器

```java
import java.util.*;

public class SequenceContainers {
    
    public static void compareContainers() {
        // ArrayList：动态数组，随机访问快
        List<Integer> arrayList = new ArrayList<>();
        arrayList.add(1);
        arrayList.add(2);
        arrayList.add(3);
        System.out.println("get(2): " + arrayList.get(2));  // O(1)
        
        // LinkedList：双向链表，插入删除快
        List<Integer> linkedList = new LinkedList<>();
        linkedList.add(1);
        linkedList.add(2);
        ((LinkedList<Integer>) linkedList).addFirst(0);  // O(1)
        
        // ArrayDeque：双端队列
        Deque<Integer> deque = new ArrayDeque<>();
        deque.addFirst(1);
        deque.addLast(2);
        System.out.println("peek: " + deque.peekFirst());  // O(1)
    }
    
    public static void performanceTest() {
        final int SIZE = 1_000_000;
        
        // ArrayList尾部添加
        long start = System.currentTimeMillis();
        List<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < SIZE; i++) {
            arrayList.add(i);
        }
        System.out.println("ArrayList添加: " + (System.currentTimeMillis() - start) + "ms");
        
        // LinkedList头部添加
        start = System.currentTimeMillis();
        LinkedList<Integer> linkedList = new LinkedList<>();
        for (int i = 0; i < SIZE; i++) {
            linkedList.addFirst(i);
        }
        System.out.println("LinkedList添加: " + (System.currentTimeMillis() - start) + "ms");
    }
    
    public static void main(String[] args) {
        compareContainers();
        performanceTest();
    }
}
```

**选择指南**：

| 场景 | C++推荐 | Java推荐 |
|------|---------|---------|
| 随机访问多 | `vector` | `ArrayList` |
| 频繁头尾操作 | `deque` | `ArrayDeque` |
| 频繁中间插入删除 | `list` | `LinkedList` |
| 固定大小 | `array` | 原生数组`[]` |

---

## 7.3 关联容器

### C++ map/set

```cpp
#include <iostream>
#include <map>
#include <unordered_map>
#include <set>
#include <string>

void mapDemo() {
    // map：有序（红黑树），O(log n)
    std::map<std::string, int> scoreMap;
    scoreMap["Alice"] = 95;
    scoreMap["Bob"] = 87;
    scoreMap["Charlie"] = 92;
    
    // 自动按key排序
    for (const auto& pair : scoreMap) {
        std::cout << pair.first << ": " << pair.second << std::endl;
    }
    
    // 查找
    auto it = scoreMap.find("Alice");
    if (it != scoreMap.end()) {
        std::cout << "找到Alice: " << it->second << std::endl;
    }
}

void unorderedMapDemo() {
    // unordered_map：无序（哈希表），O(1)平均
    std::unordered_map<std::string, int> scoreMap;
    scoreMap["Alice"] = 95;
    scoreMap["Bob"] = 87;
    
    // 更快查找
    if (scoreMap.count("Alice")) {
        std::cout << "Alice分数: " << scoreMap["Alice"] << std::endl;
    }
}

void setDemo() {
    // set：有序集合，去重
    std::set<int> nums = {3, 1, 4, 1, 5, 9, 2, 6};
    // 自动排序并去重：{1, 2, 3, 4, 5, 6, 9}
    
    for (int num : nums) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
}

int main() {
    mapDemo();
    unorderedMapDemo();
    setDemo();
    return 0;
}
```

### Java Map/Set

```java
import java.util.*;

public class AssociativeContainers {
    
    public static void mapDemo() {
        // HashMap：无序，O(1)平均
        Map<String, Integer> hashMap = new HashMap<>();
        hashMap.put("Alice", 95);
        hashMap.put("Bob", 87);
        
        System.out.println("Alice分数: " + hashMap.get("Alice"));
        
        // TreeMap：有序（红黑树），O(log n)
        Map<String, Integer> treeMap = new TreeMap<>();
        treeMap.put("Charlie", 92);
        treeMap.put("Alice", 95);
        treeMap.put("Bob", 87);
        
        // 自动按key排序
        for (Map.Entry<String, Integer> entry : treeMap.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
    
    public static void setDemo() {
        // HashSet：无序集合，去重
        Set<Integer> hashSet = new HashSet<>(Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6));
        System.out.println("HashSet: " + hashSet);
        
        // TreeSet：有序集合
        Set<Integer> treeSet = new TreeSet<>(Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6));
        System.out.println("TreeSet: " + treeSet);  // [1, 2, 3, 4, 5, 6, 9]
    }
    
    public static void main(String[] args) {
        mapDemo();
        setDemo();
    }
}
```

---

## 7.4 算法库

### C++ STL算法

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <string>

void algorithmDemo() {
    std::vector<int> nums = {5, 3, 8, 1, 9, 2, 7, 4, 6};
    
    // 排序
    std::sort(nums.begin(), nums.end());
    std::cout << "排序: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << std::endl;
    
    // 查找
    auto it = std::find(nums.begin(), nums.end(), 5);
    if (it != nums.end()) {
        std::cout << "找到5，位置: " << (it - nums.begin()) << std::endl;
    }
    
    // 二分查找（要求已排序）
    bool found = std::binary_search(nums.begin(), nums.end(), 5);
    std::cout << "二分查找5: " << (found ? "找到" : "未找到") << std::endl;
    
    // 求和
    int sum = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "总和: " << sum << std::endl;
    
    // 最大值/最小值
    auto maxIt = std::max_element(nums.begin(), nums.end());
    auto minIt = std::min_element(nums.begin(), nums.end());
    std::cout << "最大值: " << *maxIt << ", 最小值: " << *minIt << std::endl;
    
    // 计数
    int count = std::count(nums.begin(), nums.end(), 5);
    std::cout << "5出现次数: " << count << std::endl;
    
    // 反转
    std::reverse(nums.begin(), nums.end());
    std::cout << "反转: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << std::endl;
}

void lambdaAlgorithms() {
    std::vector<std::string> words = {"banana", "apple", "cherry", "date"};
    
    // 自定义排序
    std::sort(words.begin(), words.end(), 
              [](const std::string& a, const std::string& b) {
                  return a.length() < b.length();
              });
    
    std::cout << "按长度排序: ";
    for (const auto& w : words) std::cout << w << " ";
    std::cout << std::endl;
    
    // 查找第一个满足条件的元素
    auto it = std::find_if(words.begin(), words.end(),
                           [](const std::string& w) {
                               return w.length() > 5;
                           });
    if (it != words.end()) {
        std::cout << "第一个长度>5的词: " << *it << std::endl;
    }
}

int main() {
    algorithmDemo();
    lambdaAlgorithms();
    return 0;
}
```

### Java Stream API

```java
import java.util.*;
import java.util.stream.*;

public class AlgorithmDemo {
    
    public static void streamDemo() {
        List<Integer> nums = Arrays.asList(5, 3, 8, 1, 9, 2, 7, 4, 6);
        
        // 排序
        List<Integer> sorted = nums.stream()
                                   .sorted()
                                   .collect(Collectors.toList());
        System.out.println("排序: " + sorted);
        
        // 过滤
        List<Integer> evens = nums.stream()
                                  .filter(n -> n % 2 == 0)
                                  .collect(Collectors.toList());
        System.out.println("偶数: " + evens);
        
        // 映射
        List<Integer> squared = nums.stream()
                                    .map(n -> n * n)
                                    .collect(Collectors.toList());
        System.out.println("平方: " + squared);
        
        // 求和
        int sum = nums.stream().mapToInt(Integer::intValue).sum();
        System.out.println("总和: " + sum);
        
        // 最大值/最小值
        Optional<Integer> max = nums.stream().max(Integer::compareTo);
        Optional<Integer> min = nums.stream().min(Integer::compareTo);
        System.out.println("最大值: " + max.orElse(0) + ", 最小值: " + min.orElse(0));
        
        // 计数
        long count = nums.stream().filter(n -> n == 5).count();
        System.out.println("5出现次数: " + count);
        
        // 收集为Map
        List<String> words = Arrays.asList("apple", "banana", "cherry");
        Map<String, Integer> lengthMap = words.stream()
                                              .collect(Collectors.toMap(
                                                  w -> w,
                                                  String::length
                                              ));
        System.out.println("单词长度: " + lengthMap);
    }
    
    public static void customSort() {
        List<String> words = Arrays.asList("banana", "apple", "cherry", "date");
        
        // 按长度排序
        words.sort(Comparator.comparingInt(String::length));
        System.out.println("按长度排序: " + words);
        
        // 查找
        Optional<String> first = words.stream()
                                      .filter(w -> w.length() > 5)
                                      .findFirst();
        first.ifPresent(w -> System.out.println("第一个长度>5的词: " + w));
    }
    
    public static void main(String[] args) {
        streamDemo();
        customSort();
    }
}
```

---

## 7.5 迭代器

### C++ 迭代器

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <map>

void iteratorDemo() {
    std::vector<int> vec = {1, 2, 3, 4, 5};
    
    // 传统for循环
    std::cout << "传统for: ";
    for (size_t i = 0; i < vec.size(); i++) {
        std::cout << vec[i] << " ";
    }
    std::cout << std::endl;
    
    // 迭代器
    std::cout << "迭代器: ";
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << std::endl;
    
    // 范围for（C++11）
    std::cout << "范围for: ";
    for (int num : vec) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // map迭代
    std::map<std::string, int> scores = {{"Alice", 95}, {"Bob", 87}};
    for (const auto& pair : scores) {
        std::cout << pair.first << ": " << pair.second << std::endl;
    }
}

int main() {
    iteratorDemo();
    return 0;
}
```

### Java 迭代器

```java
import java.util.*;

public class IteratorDemo {
    
    public static void iteratorDemo() {
        List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
        
        // 传统for循环
        System.out.print("传统for: ");
        for (int i = 0; i < list.size(); i++) {
            System.out.print(list.get(i) + " ");
        }
        System.out.println();
        
        // 迭代器
        System.out.print("迭代器: ");
        Iterator<Integer> it = list.iterator();
        while (it.hasNext()) {
            System.out.print(it.next() + " ");
        }
        System.out.println();
        
        // 增强for（Java 5+）
        System.out.print("增强for: ");
        for (int num : list) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        // forEach + Lambda（Java 8+）
        System.out.print("forEach: ");
        list.forEach(num -> System.out.print(num + " "));
        System.out.println();
        
        // Map迭代
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 95);
        scores.put("Bob", 87);
        
        scores.forEach((name, score) -> 
            System.out.println(name + ": " + score));
    }
    
    public static void main(String[] args) {
        iteratorDemo();
    }
}
```

---

## 7.6 实战：词频统计

### C++ 实现

```cpp
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <map>
#include <vector>
#include <algorithm>

std::map<std::string, int> countWords(const std::string& text) {
    std::map<std::string, int> wordCount;
    std::istringstream stream(text);
    std::string word;
    
    while (stream >> word) {
        // 转为小写并去除标点
        std::string clean;
        for (char c : word) {
            if (isalpha(c)) {
                clean += tolower(c);
            }
        }
        if (!clean.empty()) {
            wordCount[clean]++;
        }
    }
    
    return wordCount;
}

void printTopN(const std::map<std::string, int>& wordCount, int n) {
    // 转换为vector以便排序
    std::vector<std::pair<std::string, int>> pairs(
        wordCount.begin(), wordCount.end());
    
    // 按频次降序排序
    std::sort(pairs.begin(), pairs.end(),
              [](const auto& a, const auto& b) {
                  return a.second > b.second;
              });
    
    // 输出前N个
    for (size_t i = 0; i < std::min((size_t)n, pairs.size()); i++) {
        std::cout << pairs[i].first << ": " << pairs[i].second << std::endl;
    }
}

int main() {
    std::string text = "the quick brown fox jumps over the lazy dog "
                       "the fox is quick and the dog is lazy";
    
    auto wordCount = countWords(text);
    
    std::cout << "总词数: " << wordCount.size() << std::endl;
    std::cout << "\n高频词TOP 5:" << std::endl;
    printTopN(wordCount, 5);
    
    return 0;
}
```

### Java 实现

```java
import java.util.*;
import java.util.stream.*;

public class WordFrequency {
    
    public static Map<String, Integer> countWords(String text) {
        Map<String, Integer> wordCount = new HashMap<>();
        
        String[] words = text.split("\\s+");
        for (String word : words) {
            // 清理：转小写并去除标点
            String clean = word.toLowerCase().replaceAll("[^a-z]", "");
            if (!clean.isEmpty()) {
                wordCount.merge(clean, 1, Integer::sum);
            }
        }
        
        return wordCount;
    }
    
    public static void printTopN(Map<String, Integer> wordCount, int n) {
        wordCount.entrySet().stream()
                 .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                 .limit(n)
                 .forEach(entry -> 
                     System.out.println(entry.getKey() + ": " + entry.getValue()));
    }
    
    public static void main(String[] args) {
        String text = "the quick brown fox jumps over the lazy dog " +
                      "the fox is quick and the dog is lazy";
        
        Map<String, Integer> wordCount = countWords(text);
        
        System.out.println("总词数: " + wordCount.size());
        System.out.println("\n高频词TOP 5:");
        printTopN(wordCount, 5);
    }
}
```

**输出**：
```
总词数: 9

高频词TOP 5:
the: 3
fox: 2
quick: 2
dog: 2
lazy: 2
```

---

## 练习题

1. 用STL/Collections实现一个LRU缓存（最近最少使用）
2. 比较`vector`/`ArrayList`和`list`/`LinkedList`在100万元素下的性能差异
3. 实现一个通用的二分查找函数，支持自定义比较器
4. 用Stream API处理学生成绩数据：筛选及格、按分数排序、计算平均分

## 延伸阅读

- [ELI5: 哈希表工作原理图解](../visuals/hashtable.html)
- [第8章：设计原则](./08-design-principles.md)
