# 第2章：算法思维

> **学习目标**：掌握排序、搜索、递归三种核心算法思想，学会分析时间复杂度。

## 2.1 什么是算法？

算法就像菜谱：
- **输入**：食材（数据）
- **步骤**：烹饪方法（算法逻辑）
- **输出**：成品菜（结果）

好的算法应该：
- ✅ **正确**：能解决问题
- ✅ **高效**：用时短、省内存
- ✅ **清晰**：易于理解和维护

---

## 2.2 时间复杂度分析

### 大O表示法

大O描述算法执行时间随数据规模增长的趋势：

| 复杂度 | 名称 | 示例 | n=1000时操作次数 |
|--------|------|------|-----------------|
| O(1) | 常数 | 数组访问 | 1 |
| O(log n) | 对数 | 二分查找 | 10 |
| O(n) | 线性 | 遍历数组 | 1,000 |
| O(n log n) | 线性对数 | 快速排序 | 10,000 |
| O(n²) | 平方 | 冒泡排序 | 1,000,000 |
| O(2ⁿ) | 指数 | 暴力破解密码 | 天文数字 |

**关键原则**：关注最高次项，忽略常数系数。

---

## 2.3 排序算法

### 冒泡排序（Bubble Sort）

**思路**：像气泡一样，大的元素慢慢"浮"到末尾。

**复杂度**：O(n²) 时间，O(1) 空间

#### C++ 实现

```cpp
#include <iostream>
#include <vector>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        // 优化：如果没有交换，说明已排序
        if (!swapped) break;
    }
}

int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(arr);
    
    std::cout << "排序结果: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

#### Java 实现

```java
public class BubbleSort {
    
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // 交换
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            // 优化：如果没有交换，说明已排序
            if (!swapped) break;
        }
    }
    
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        
        System.out.print("排序结果: ");
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}
```

---

### 快速排序（Quick Sort）

**思路**：选一个"基准"，小的放左边，大的放右边，递归处理。

**复杂度**：平均 O(n log n) 时间，O(log n) 空间

#### C++ 实现

```cpp
#include <iostream>
#include <vector>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];  // 选最后一个元素为基准
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);   // 排序左半部分
        quickSort(arr, pi + 1, high);  // 排序右半部分
    }
}

int main() {
    std::vector<int> arr = {10, 7, 8, 9, 1, 5};
    quickSort(arr, 0, arr.size() - 1);
    
    std::cout << "排序结果: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

#### Java 实现

```java
public class QuickSort {
    
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];  // 选最后一个元素为基准
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                // 交换
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        // 交换
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }
    
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);   // 排序左半部分
            quickSort(arr, pi + 1, high);  // 排序右半部分
        }
    }
    
    public static void main(String[] args) {
        int[] arr = {10, 7, 8, 9, 1, 5};
        quickSort(arr, 0, arr.length - 1);
        
        System.out.print("排序结果: ");
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}
```

**性能对比**：

| 算法 | 最好 | 平均 | 最坏 | 稳定性 |
|------|------|------|------|--------|
| 冒泡排序 | O(n) | O(n²) | O(n²) | 稳定 |
| 快速排序 | O(n log n) | O(n log n) | O(n²) | 不稳定 |

---

## 2.4 搜索算法

### 线性搜索 vs 二分搜索

#### 线性搜索（Linear Search）

**思路**：从头到尾逐个检查。

**复杂度**：O(n)

```cpp
// C++
int linearSearch(const std::vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;  // 未找到
}
```

```java
// Java
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;  // 未找到
}
```

#### 二分搜索（Binary Search）

**思路**：每次排除一半数据（要求数据已排序）。

**复杂度**：O(log n)

#### C++ 实现

```cpp
#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;  // 防止溢出
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;  // 未找到
}

int main() {
    std::vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15};
    int target = 7;
    
    int result = binarySearch(arr, target);
    if (result != -1) {
        std::cout << "找到目标，索引为: " << result << std::endl;
    } else {
        std::cout << "未找到目标" << std::endl;
    }
    
    return 0;
}
```

#### Java 实现

```java
public class BinarySearch {
    
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;  // 防止溢出
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;  // 未找到
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11, 13, 15};
        int target = 7;
        
        int result = binarySearch(arr, target);
        if (result != -1) {
            System.out.println("找到目标，索引为: " + result);
        } else {
            System.out.println("未找到目标");
        }
    }
}
```

**性能对比**：

| 搜索方式 | n=1,000,000 时最多比较次数 |
|---------|--------------------------|
| 线性搜索 | 1,000,000 |
| 二分搜索 | 20 |

---

## 2.5 递归（Recursion）

### 概念
递归就是函数调用自己，像俄罗斯套娃。

**三要素**：
1. **基准条件**：什么时候停止（避免无限循环）
2. **递归关系**：如何缩小问题规模
3. **状态变化**：每次调用都更接近基准条件

### 经典案例：斐波那契数列

F(n) = F(n-1) + F(n-2)，其中 F(0)=0, F(1)=1

#### C++ 实现

```cpp
#include <iostream>
#include <unordered_map>

// 基础递归（效率低，有重复计算）
int fibonacciBasic(int n) {
    if (n <= 1) return n;
    return fibonacciBasic(n - 1) + fibonacciBasic(n - 2);
}

// 记忆化递归（优化版）
std::unordered_map<int, int> memo;

int fibonacciMemo(int n) {
    if (n <= 1) return n;
    if (memo.find(n) != memo.end()) return memo[n];
    
    memo[n] = fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
    return memo[n];
}

int main() {
    std::cout << "F(10) = " << fibonacciMemo(10) << std::endl;  // 55
    std::cout << "F(20) = " << fibonacciMemo(20) << std::endl;  // 6765
    
    return 0;
}
```

#### Java 实现

```java
import java.util.HashMap;
import java.util.Map;

public class Fibonacci {
    
    private static Map<Integer, Integer> memo = new HashMap<>();
    
    // 基础递归（效率低，有重复计算）
    public static int fibonacciBasic(int n) {
        if (n <= 1) return n;
        return fibonacciBasic(n - 1) + fibonacciBasic(n - 2);
    }
    
    // 记忆化递归（优化版）
    public static int fibonacciMemo(int n) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n);
        
        int result = fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
        memo.put(n, result);
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println("F(10) = " + fibonacciMemo(10));  // 55
        System.out.println("F(20) = " + fibonacciMemo(20));  // 6765
    }
}
```

**性能对比**：

| 版本 | F(40) 耗时 | 原因 |
|------|-----------|------|
| 基础递归 | 约1秒 | 大量重复计算 |
| 记忆化递归 | <1ms | 每个值只计算一次 |

---

## 2.6 实战：综合应用

### 问题：找出数组中出现次数最多的元素

**思路**：
1. 用哈希表统计频次 → O(n)
2. 遍历哈希表找最大值 → O(n)
3. 总复杂度：O(n)

#### C++ 实现

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>

int mostFrequent(const std::vector<int>& arr) {
    std::unordered_map<int, int> countMap;
    
    // 统计频次
    for (int num : arr) {
        countMap[num]++;
    }
    
    // 找最大值
    int maxCount = 0;
    int result = arr[0];
    for (const auto& pair : countMap) {
        if (pair.second > maxCount) {
            maxCount = pair.second;
            result = pair.first;
        }
    }
    
    return result;
}

int main() {
    std::vector<int> arr = {1, 3, 2, 1, 4, 1, 3, 2, 1};
    std::cout << "出现最多的元素: " << mostFrequent(arr) << std::endl;  // 1
    
    return 0;
}
```

#### Java 实现

```java
import java.util.HashMap;
import java.util.Map;

public class MostFrequent {
    
    public static int mostFrequent(int[] arr) {
        Map<Integer, Integer> countMap = new HashMap<>();
        
        // 统计频次
        for (int num : arr) {
            countMap.put(num, countMap.getOrDefault(num, 0) + 1);
        }
        
        // 找最大值
        int maxCount = 0;
        int result = arr[0];
        for (Map.Entry<Integer, Integer> entry : countMap.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                result = entry.getKey();
            }
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 3, 2, 1, 4, 1, 3, 2, 1};
        System.out.println("出现最多的元素: " + mostFrequent(arr));  // 1
    }
}
```

---

## 练习题

1. 实现归并排序算法，并分析其时间复杂度
2. 用递归实现二叉树的深度优先遍历
3. 比较线性搜索和二分搜索在实际数据中的性能差异
4. 优化斐波那契数列的迭代实现（不使用递归）

## 延伸阅读

- [ELI5: 递归可视化图解](../visuals/recursion.html)
- [第3章：面向对象编程](./03-oop.md)
