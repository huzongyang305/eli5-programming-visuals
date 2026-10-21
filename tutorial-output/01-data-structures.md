# 第1章：数据结构基础

> **学习目标**：掌握数组、链表、栈、队列四种基本数据结构，理解它们的适用场景和性能特点。

## 1.1 为什么需要不同的数据结构？

想象你要整理房间里的物品：
- **书籍** → 放在书架上（有序排列，方便查找）
- **脏衣服** → 扔进洗衣篮（无序堆放，先进先出）
- **盘子** → 叠在橱柜里（后进先出，拿最上面的）

不同的存储方式对应不同的使用场景，数据结构也是如此。

---

## 1.2 数组（Array）

### 概念
数组是最简单的数据结构，就像一排连续的储物柜，每个柜子有编号（索引）。

**特点**：
- ✅ 随机访问快：O(1) 时间直接访问任意位置
- ❌ 插入删除慢：O(n) 时间，需要移动元素
- ❌ 大小固定：创建后不能动态扩容

### C++ 实现

```cpp
#include <iostream>
#include <array>
#include <vector>

int main() {
    // 静态数组（大小固定）
    int staticArr[5] = {1, 2, 3, 4, 5};
    std::cout << "访问第3个元素: " << staticArr[2] << std::endl;  // O(1)
    
    // 动态数组（推荐）
    std::vector<int> dynamicArr = {1, 2, 3, 4, 5};
    dynamicArr.push_back(6);  // 自动扩容
    dynamicArr.insert(dynamicArr.begin() + 2, 99);  // 在位置2插入99
    
    // 遍历
    for (int num : dynamicArr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

### Java 实现

```java
import java.util.ArrayList;
import java.util.Arrays;

public class ArrayDemo {
    public static void main(String[] args) {
        // 静态数组
        int[] staticArr = {1, 2, 3, 4, 5};
        System.out.println("访问第3个元素: " + staticArr[2]);  // O(1)
        
        // 动态数组（推荐）
        ArrayList<Integer> dynamicArr = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        dynamicArr.add(6);  // 自动扩容
        dynamicArr.add(2, 99);  // 在位置2插入99
        
        // 遍历
        for (int num : dynamicArr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}
```

**性能对比**：

| 操作 | 时间复杂度 |
|------|-----------|
| 访问 | O(1) |
| 搜索 | O(n) |
| 插入 | O(n) |
| 删除 | O(n) |

---

## 1.3 链表（Linked List）

### 概念
链表像火车车厢，每节车厢（节点）包含数据和下一节的地址。

**特点**：
- ✅ 插入删除快：O(1) 时间（已知位置时）
- ✅ 动态大小：无需预先分配空间
- ❌ 随机访问慢：O(n) 时间，必须从头遍历

### C++ 实现

```cpp
#include <iostream>
#include <memory>

struct Node {
    int data;
    std::shared_ptr<Node> next;
    
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    std::shared_ptr<Node> head;
    
public:
    // 头部插入 - O(1)
    void pushFront(int val) {
        auto newNode = std::make_shared<Node>(val);
        newNode->next = head;
        head = newNode;
    }
    
    // 查找 - O(n)
    bool search(int val) {
        auto current = head;
        while (current != nullptr) {
            if (current->data == val) return true;
            current = current->next;
        }
        return false;
    }
    
    // 打印链表
    void printList() {
        auto current = head;
        while (current != nullptr) {
            std::cout << current->data << " -> ";
            current = current->next;
        }
        std::cout << "nullptr" << std::endl;
    }
};

int main() {
    LinkedList list;
    list.pushFront(3);
    list.pushFront(2);
    list.pushFront(1);
    list.printList();  // 1 -> 2 -> 3 -> nullptr
    
    std::cout << "查找2: " << (list.search(2) ? "找到" : "未找到") << std::endl;
    return 0;
}
```

### Java 实现

```java
class Node {
    int data;
    Node next;
    
    Node(int val) {
        this.data = val;
        this.next = null;
    }
}

public class LinkedList {
    private Node head;
    
    // 头部插入 - O(1)
    public void pushFront(int val) {
        Node newNode = new Node(val);
        newNode.next = head;
        head = newNode;
    }
    
    // 查找 - O(n)
    public boolean search(int val) {
        Node current = head;
        while (current != null) {
            if (current.data == val) return true;
            current = current.next;
        }
        return false;
    }
    
    // 打印链表
    public void printList() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
    
    public static void main(String[] args) {
        LinkedList list = new LinkedList();
        list.pushFront(3);
        list.pushFront(2);
        list.pushFront(1);
        list.printList();  // 1 -> 2 -> 3 -> null
        
        System.out.println("查找2: " + (list.search(2) ? "找到" : "未找到"));
    }
}
```

---

## 1.4 栈（Stack）

### 概念
栈像一摞盘子，只能从顶部拿取（LIFO - Last In First Out）。

**应用场景**：
- 函数调用栈
- 撤销操作（Undo）
- 括号匹配检查

### C++ 实现

```cpp
#include <iostream>
#include <stack>
#include <string>

// 应用：括号匹配检查
bool isBalanced(const std::string& expr) {
    std::stack<char> s;
    for (char c : expr) {
        if (c == '(' || c == '[' || c == '{') {
            s.push(c);
        } else if (c == ')' || c == ']' || c == '}') {
            if (s.empty()) return false;
            char top = s.top();
            if ((c == ')' && top == '(') ||
                (c == ']' && top == '[') ||
                (c == '}' && top == '{')) {
                s.pop();
            } else {
                return false;
            }
        }
    }
    return s.empty();
}

int main() {
    std::stack<int> stack;
    stack.push(1);
    stack.push(2);
    stack.push(3);
    
    std::cout << "栈顶: " << stack.top() << std::endl;  // 3
    stack.pop();
    std::cout << "弹出后栈顶: " << stack.top() << std::endl;  // 2
    
    // 测试括号匹配
    std::cout << "{[()]}: " << (isBalanced("{[()]}") ? "平衡" : "不平衡") << std::endl;
    std::cout << "{[(]: " << (isBalanced("{[(]") ? "平衡" : "不平衡") << std::endl;
    
    return 0;
}
```

### Java 实现

```java
import java.util.Stack;

public class StackDemo {
    
    // 应用：括号匹配检查
    public static boolean isBalanced(String expr) {
        Stack<Character> stack = new Stack<>();
        for (char c : expr.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else if (c == ')' || c == ']' || c == '}') {
                if (stack.isEmpty()) return false;
                char top = stack.peek();
                if ((c == ')' && top == '(') ||
                    (c == ']' && top == '[') ||
                    (c == '}' && top == '{')) {
                    stack.pop();
                } else {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
    
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();
        stack.push(1);
        stack.push(2);
        stack.push(3);
        
        System.out.println("栈顶: " + stack.peek());  // 3
        stack.pop();
        System.out.println("弹出后栈顶: " + stack.peek());  // 2
        
        // 测试括号匹配
        System.out.println("{[()]}: " + (isBalanced("{[()]}") ? "平衡" : "不平衡"));
        System.out.println("{[(]: " + (isBalanced("{[(]") ? "平衡" : "不平衡"));
    }
}
```

---

## 1.5 队列（Queue）

### 概念
队列像排队买票，先来的人先服务（FIFO - First In First Out）。

**应用场景**：
- 任务调度
- 消息队列
- BFS广度优先搜索

### C++ 实现

```cpp
#include <iostream>
#include <queue>

int main() {
    std::queue<std::string> queue;
    
    // 入队
    queue.push("用户A");
    queue.push("用户B");
    queue.push("用户C");
    
    // 处理队列
    while (!queue.empty()) {
        std::cout << "正在服务: " << queue.front() << std::endl;
        queue.pop();
    }
    
    return 0;
}
```

### Java 实现

```java
import java.util.LinkedList;
import java.util.Queue;

public class QueueDemo {
    public static void main(String[] args) {
        Queue<String> queue = new LinkedList<>();
        
        // 入队
        queue.offer("用户A");
        queue.offer("用户B");
        queue.offer("用户C");
        
        // 处理队列
        while (!queue.isEmpty()) {
            System.out.println("正在服务: " + queue.poll());
        }
    }
}
```

---

## 1.6 如何选择数据结构？

使用这个决策树：

```
需要快速随机访问？
├─ 是 → 数组/ArrayList
└─ 否 ↓
    需要频繁插入删除？
    ├─ 是 → 链表
    └─ 否 ↓
        后进先出？
        ├─ 是 → 栈
        └─ 否 → 队列
```

**实际案例对比**：

| 场景 | 推荐结构 | 原因 |
|------|---------|------|
| 存储学生成绩列表 | 数组 | 需要按索引访问 |
| 实现浏览器前进后退 | 栈 | LIFO特性 |
| 打印机任务队列 | 队列 | FIFO特性 |
| 频繁增删的联系人列表 | 链表 | 插入删除高效 |

---

## 练习题

1. 用栈实现一个简易计算器，支持加减乘除
2. 用队列模拟银行叫号系统
3. 比较数组和链表在以下操作的性能差异：
   - 访问第1000个元素
   - 在开头插入元素
   - 在末尾删除元素

## 延伸阅读

- [ELI5: 链表可视化图解](../visuals/linked-list.html)
- [第2章：算法思维](./02-algorithms.md)
