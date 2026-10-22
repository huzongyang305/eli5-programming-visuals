# 第四章：进程同步——咖啡馆的卫生间钥匙

## 本节知识框架

### 学习目标
- 理解临界区问题和竞态条件
- 掌握互斥锁、信号量、管程的工作原理
- 能够使用同步原语解决生产者-消费者问题
- 了解死锁的预防和避免策略

### 前置知识
- 进程和线程的概念（第一章）
- 进程间通信机制（第三章）
- 基本的并发概念

### 复习清单
- [ ] 能解释什么是临界区
- [ ] 能说明互斥锁和信号量的区别
- [ ] 能画出生产者-消费者的同步流程
- [ ] 能列举同步失败的常见原因

---

## 核心概念定义

| 术语 | 定义 | 类比 |
|------|------|------|
| **临界区 (Critical Section)** | 访问共享资源的代码段 | 咖啡馆的单人卫生间 |
| **竞态条件 (Race Condition)** | 多个线程执行顺序影响结果 | 两人同时抢卫生间 |
| **互斥锁 (Mutex)** | 保证同一时刻只有一个线程进入临界区 | 卫生间的门锁 |
| **信号量 (Semaphore)** | 计数器，控制同时访问资源的线程数 | 卫生间的可用坑位指示器 |
| **管程 (Monitor)** | 高级同步机制，封装了数据和操作 | 带预约系统的卫生间 |
| **自旋锁 (Spinlock)** | 忙等待的锁，不释放CPU | 在门口一直敲门等待 |
| **读写锁 (Read-Write Lock)** | 允许多个读者或一个写者 | 图书馆阅览规则 |
| **条件变量 (Condition Variable)** | 用于线程间等待特定条件 | 卫生间的"有人/无人"指示灯 |
| **原子操作 (Atomic Operation)** | 不可中断的操作 | 一次性完成的动作 |
| **内存屏障 (Memory Barrier)** | 保证内存访问顺序 | 确保步骤按顺序完成 |

---

## 原理与运行机制

### 生活中的类比：咖啡馆卫生间系统

```
咖啡馆场景：

┌─────────────────────────────────────┐
│         咖啡馆大厅                   │
│                                     │
│   顾客A  顾客B  顾客C  顾客D        │
│    ↓      ↓      ↓      ↓          │
│  ┌──────────────────────────┐      │
│  │   卫生间入口              │      │
│  │                          │      │
│  │  [🔒 门锁 = 互斥锁]       │      │
│  │                          │      │
│  │  内部：只能容纳1人         │      │
│  │  (临界区)                │      │
│  └──────────────────────────┘      │
│                                     │
│  队列：等待使用卫生间的顾客          │
│  (就绪队列)                         │
└─────────────────────────────────────┘

多坑位卫生间（信号量）：

┌─────────────────────────────────────┐
│     公共卫生间（5个坑位）             │
│                                     │
│  入口显示：[剩余坑位: 3]             │
│  (信号量值 = 3)                      │
│                                     │
│  ███░░  (3个占用，2个空闲)           │
└─────────────────────────────────────┘
```

### 1. 互斥锁（Mutex）

**工作原理：** 二元状态（锁定/解锁），保证互斥访问。

```
互斥锁操作流程：

线程A                    互斥锁                  线程B
  │                        │                       │
  ├── lock() ─────────────→│                       │
  │                        │←── 获得锁              │
  │                   [LOCKED]                     │
  │  执行临界区代码          │                       │
  │                        │              ┌─ lock() ─┤
  │                        │              │  阻塞等待 │
  │                        │              └──────────┘
  ├── unlock() ───────────→│                       │
  │                   [UNLOCKED]                   │
  │                        │←── 获得锁              │
  │                        │              执行临界区  │
```

**关键特性：**
- 只有持有锁的线程才能解锁
- 不可重入（除非是递归锁）
- 失败时可能阻塞或返回错误

### 2. 信号量（Semaphore）

**工作原理：** 整型计数器，P操作减1，V操作加1。

```
信号量操作：

初始值 = 3（允许3个线程同时访问）

线程A: P(S) → S=2 → 进入临界区
线程B: P(S) → S=1 → 进入临界区
线程C: P(S) → S=0 → 进入临界区
线程D: P(S) → S=-1 → 阻塞等待

线程A完成: V(S) → S=0 → 唤醒线程D
线程D: 获得许可 → S=-1 → 进入临界区
```

**两种类型：**
- **二进制信号量**：值为0或1，等同于互斥锁
- **计数信号量**：值≥0，控制并发数量

### 3. 管程（Monitor）

**工作原理：** 封装共享数据和操作，自动处理同步。

```
管程结构：

┌─────────────────────────────┐
│       Monitor               │
│                             │
│  ┌─────────────────────┐   │
│  │  共享数据            │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  操作1 (自动互斥)    │   │
│  │  操作2 (自动互斥)    │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  条件变量            │   │
│  │  - wait()           │   │
│  │  - signal()         │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

---

## 典型应用场景

| 同步机制 | 适用场景 | 优点 | 缺点 |
|---------|---------|------|------|
| 互斥锁 | 保护共享变量 | 简单直观 | 可能导致死锁 |
| 信号量 | 控制资源数量 | 灵活强大 | 编程复杂 |
| 管程 | 复杂同步逻辑 | 封装性好 | 实现复杂 |
| 读写锁 | 读多写少场景 | 提高并发度 | 写者可能饥饿 |
| 自旋锁 | 短临界区 | 无上下文切换 | 浪费CPU |

---

## 代码示例

### C++完整实现：生产者-消费者问题

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <vector>
#include <chrono>

const int BUFFER_SIZE = 5;
std::queue<int> buffer;
std::mutex mtx;
std::condition_variable cv_not_full;
std::condition_variable cv_not_empty;

// 生产者线程
void producer(int id, int item_count) {
    for (int i = 0; i < item_count; ++i) {
        std::unique_lock<std::mutex> lock(mtx);
        
        // 等待缓冲区有空位
        cv_not_full.wait(lock, [] {
            return buffer.size() < BUFFER_SIZE;
        });
        
        // 生产数据
        int data = id * 100 + i;
        buffer.push(data);
        std::cout << "生产者" << id << " 生产: " << data 
                  << " [缓冲区大小: " << buffer.size() << "]" << std::endl;
        
        lock.unlock();
        cv_not_empty.notify_one();
        
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
    }
}

// 消费者线程
void consumer(int id, int item_count) {
    for (int i = 0; i < item_count; ++i) {
        std::unique_lock<std::mutex> lock(mtx);
        
        // 等待缓冲区有数据
        cv_not_empty.wait(lock, [] {
            return !buffer.empty();
        });
        
        // 消费数据
        int data = buffer.front();
        buffer.pop();
        std::cout << "消费者" << id << " 消费: " << data 
                  << " [缓冲区大小: " << buffer.size() << "]" << std::endl;
        
        lock.unlock();
        cv_not_full.notify_one();
        
        std::this_thread::sleep_for(std::chrono::milliseconds(80));
    }
}

// 演示互斥锁
void demonstrate_mutex() {
    std::cout << "\n=== 互斥锁演示 ===" << std::endl;
    
    int counter = 0;
    std::mutex counter_mutex;
    const int NUM_THREADS = 4;
    const int ITERATIONS = 1000;
    
    auto task = [&]() {
        for (int i = 0; i < ITERATIONS; ++i) {
            std::lock_guard<std::mutex> lock(counter_mutex);
            counter++;
        }
    };
    
    std::vector<std::thread> threads;
    for (int i = 0; i < NUM_THREADS; ++i) {
        threads.emplace_back(task);
    }
    
    for (auto& t : threads) {
        t.join();
    }
    
    std::cout << "最终计数: " << counter << std::endl;
    std::cout << "预期计数: " << NUM_THREADS * ITERATIONS << std::endl;
}

// 演示信号量（使用mutex+condition_variable模拟）
class Semaphore {
private:
    std::mutex mtx;
    std::condition_variable cv;
    int count;
    
public:
    Semaphore(int initial_count) : count(initial_count) {}
    
    void wait() {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [this] { return count > 0; });
        count--;
    }
    
    void signal() {
        std::unique_lock<std::mutex> lock(mtx);
        count++;
        cv.notify_one();
    }
};

void demonstrate_semaphore() {
    std::cout << "\n=== 信号量演示 ===" << std::endl;
    
    Semaphore sem(3); // 允许3个线程同时访问
    const int NUM_THREADS = 6;
    
    auto task = [&](int id) {
        std::cout << "线程" << id << " 等待信号量..." << std::endl;
        sem.wait();
        
        std::cout << "线程" << id << " 获得许可，执行任务..." << std::endl;
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        
        std::cout << "线程" << id << " 释放信号量" << std::endl;
        sem.signal();
    };
    
    std::vector<std::thread> threads;
    for (int i = 0; i < NUM_THREADS; ++i) {
        threads.emplace_back(task, i + 1);
    }
    
    for (auto& t : threads) {
        t.join();
    }
}

int main() {
    std::cout << "进程同步机制演示" << std::endl;
    std::cout << "==================" << std::endl;
    
    demonstrate_mutex();
    demonstrate_semaphore();
    
    std::cout << "\n=== 生产者-消费者演示 ===" << std::endl;
    
    std::vector<std::thread> producers;
    std::vector<std::thread> consumers;
    
    // 启动2个生产者，每个生产10个物品
    for (int i = 0; i < 2; ++i) {
        producers.emplace_back(producer, i + 1, 10);
    }
    
    // 启动2个消费者，每个消费10个物品
    for (int i = 0; i < 2; ++i) {
        consumers.emplace_back(consumer, i + 1, 10);
    }
    
    for (auto& t : producers) t.join();
    for (auto& t : consumers) t.join();
    
    std::cout << "\n所有任务完成" << std::endl;
    return 0;
}
```

编译命令：`g++ -std=c++17 -pthread 04_synchronization.cpp -o sync_demo`

### Java完整实现：读写锁和管程

```java
import java.util.*;
import java.util.concurrent.locks.*;

// 使用管程实现的有界缓冲区
class BoundedBuffer {
    private final Queue<Integer> buffer = new LinkedList<>();
    private final int capacity;
    
    public BoundedBuffer(int capacity) {
        this.capacity = capacity;
    }
    
    // 管程方法：自动互斥
    public synchronized void put(int item) throws InterruptedException {
        // 等待直到有空间
        while (buffer.size() >= capacity) {
            System.out.println(Thread.currentThread().getName() + ": 缓冲区满，等待...");
            wait();
        }
        
        buffer.add(item);
        System.out.println(Thread.currentThread().getName() + " 放入: " + item 
                         + " [大小: " + buffer.size() + "]");
        
        notifyAll(); // 通知消费者
    }
    
    public synchronized int get() throws InterruptedException {
        // 等待直到有数据
        while (buffer.isEmpty()) {
            System.out.println(Thread.currentThread().getName() + ": 缓冲区空，等待...");
            wait();
        }
        
        int item = buffer.poll();
        System.out.println(Thread.currentThread().getName() + " 取出: " + item 
                         + " [大小: " + buffer.size() + "]");
        
        notifyAll(); // 通知生产者
        return item;
    }
}

// 演示读写锁
class SharedData {
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final Lock readLock = rwLock.readLock();
    private final Lock writeLock = rwLock.writeLock();
    private int data = 0;
    
    public int read() {
        readLock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + " 读取: " + data);
            Thread.sleep(100); // 模拟读取时间
            return data;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return -1;
        } finally {
            readLock.unlock();
        }
    }
    
    public void write(int value) {
        writeLock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + " 写入: " + value);
            data = value;
            Thread.sleep(200); // 模拟写入时间
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            writeLock.unlock();
        }
    }
}

public class SynchronizationDemo {
    
    // 演示管程（生产者-消费者）
    public static void demonstrateMonitor() throws InterruptedException {
        System.out.println("\n=== 管程演示（生产者-消费者）===");
        
        BoundedBuffer buffer = new BoundedBuffer(5);
        
        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    buffer.put(i);
                    Thread.sleep(50);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "生产者");
        
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    buffer.get();
                    Thread.sleep(80);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "消费者");
        
        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
    }
    
    // 演示读写锁
    public static void demonstrateReadWriteLock() throws InterruptedException {
        System.out.println("\n=== 读写锁演示 ===");
        
        SharedData sharedData = new SharedData();
        
        // 多个读者
        Runnable reader = () -> {
            for (int i = 0; i < 3; i++) {
                sharedData.read();
            }
        };
        
        // 单个写者
        Runnable writer = () -> {
            for (int i = 1; i <= 3; i++) {
                sharedData.write(i * 100);
            }
        };
        
        Thread[] readers = new Thread[3];
        for (int i = 0; i < 3; i++) {
            readers[i] = new Thread(reader, "读者" + (i + 1));
        }
        Thread writerThread = new Thread(writer, "写者");
        
        // 启动所有线程
        for (Thread r : readers) r.start();
        writerThread.start();
        
        for (Thread r : readers) r.join();
        writerThread.join();
    }
    
    // 演示信号量
    public static void demonstrateSemaphore() throws InterruptedException {
        System.out.println("\n=== 信号量演示 ===");
        
        Semaphore semaphore = new Semaphore(3); // 最多3个并发
        
        Runnable task = () -> {
            String name = Thread.currentThread().getName();
            try {
                System.out.println(name + " 请求许可...");
                semaphore.acquire();
                System.out.println(name + " 获得许可，执行任务");
                Thread.sleep(500);
                System.out.println(name + " 释放许可");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                semaphore.release();
            }
        };
        
        Thread[] threads = new Thread[6];
        for (int i = 0; i < 6; i++) {
            threads[i] = new Thread(task, "线程" + (i + 1));
        }
        
        for (Thread t : threads) t.start();
        for (Thread t : threads) t.join();
    }
    
    public static void main(String[] args) throws InterruptedException {
        System.out.println("进程同步机制演示");
        System.out.println("==================");
        
        demonstrateMonitor();
        demonstrateReadWriteLock();
        demonstrateSemaphore();
        
        System.out.println("\n所有演示完成");
    }
}
```

编译命令：`javac SynchronizationDemo.java && java SynchronizationDemo`

---

## 复杂度或性能分析

| 同步机制 | 获取锁开销 | 内存开销 | 适用临界区长度 | 公平性 |
|---------|-----------|---------|--------------|--------|
| 互斥锁 | 中（可能阻塞） | 小 | 任意 | 取决于实现 |
| 自旋锁 | 低（忙等待） | 极小 | 很短 | 不公平 |
| 信号量 | 中 | 小 | 任意 | 可选 |
| 读写锁 | 较高 | 中 | 任意 | 可选 |
| 管程 | 高 | 中 | 任意 | 较好 |

---

## 常见误区与易错点

| 错误/现象 | 原因 | 解决方案 |
|----------|------|---------|
| 死锁 | 循环等待资源 | 统一加锁顺序，超时机制 |
| 活锁 | 线程不断重试但无法前进 | 引入随机退避 |
| 饥饿 | 某些线程长期得不到资源 | 使用公平锁 |
| 优先级反转 | 低优先级持有高优先级需要的锁 | 优先级继承协议 |
| 忘记解锁 | 异常导致跳过unlock | 使用RAII或try-finally |
| 双重检查锁定失效 | 指令重排序 | 使用volatile或原子操作 |

---

## 与其他知识点的关系

- **与死锁的关系**：不当使用同步机制会导致死锁（第五章重点）
- **与进程调度的关系**：阻塞的线程会让出CPU
- **与内存模型的关系**：需要同步保证内存可见性
- **与设计模式的关系**：管程体现了封装思想

---

## 自测题与参考答案

### 问题1：互斥锁和信号量的主要区别是什么？
A. 互斥锁更快  
B. 信号量可以控制并发数量，互斥锁只能二选一  
C. 互斥锁更灵活  
D. 没有区别

**答案：B**

**解析：** 互斥锁是二元状态（锁定/解锁），保证同一时刻只有一个线程访问资源。信号量是计数器，可以控制允许同时访问资源的线程数量。二进制信号量（值为1）功能上等同于互斥锁。

### 问题2：为什么需要条件变量？
A. 为了提高性能  
B. 为了在线程间传递信号，避免忙等待  
C. 为了替代互斥锁  
D. 为了增加代码复杂度

**答案：B**

**解析：** 条件变量允许线程在某些条件不满足时进入等待状态，而不是不断检查（忙等待）。当条件满足时，其他线程可以通知等待的线程，这样既节省了CPU资源，又实现了高效的线程协作。

### 问题3：读写锁适用于什么场景？
A. 写操作频繁的场景  
B. 读操作远多于写操作的场景  
C. 只有读操作的场景  
D. 只有写操作的场景

**答案：B**

**解析：** 读写锁允许多个读者同时访问，但写者独占访问。在读多写少的场景下，可以显著提高并发性能。如果写操作频繁，读写锁的优势就不明显，因为写者需要独占访问。

---

## 考点精讲

### 考点1：生产者-消费者问题的完整解法

**核心要点：**
1. **互斥**：使用互斥锁保护共享缓冲区
2. **同步**：使用条件变量协调生产者和消费者
3. **边界条件**：缓冲区满时生产者等待，空时消费者等待

**面试常见问题：**
> Q: 如何实现一个线程安全的有界缓冲区？  
> A: 使用互斥锁保护缓冲区的访问，配合两个条件变量：not_full（缓冲区不满）和not_empty（缓冲区不空）。生产者在缓冲区满时等待not_full，消费者在缓冲区空时等待not_empty。每次操作后通知对方。

### 考点2：死锁的四个必要条件

**核心要点：**
1. **互斥**：资源一次只能被一个线程持有
2. **占有并等待**：线程持有资源的同时等待其他资源
3. **不可抢占**：资源不能被强制剥夺
4. **循环等待**：存在循环的资源等待链

**面试常见问题：**
> Q: 如何预防死锁？  
> A: 破坏四个必要条件之一：
> - 破坏循环等待：规定加锁顺序
> - 破坏占有并等待：一次性申请所有资源
> - 破坏不可抢占：允许超时释放
> - 破坏互斥：使用无锁数据结构（困难）

### 考点3：管程 vs 信号量

**核心要点：**
1. **管程**：高级抽象，自动互斥，适合复杂逻辑
2. **信号量**：底层原语，更灵活但易出错
3. **等价性**：两者可以相互实现

**面试常见问题：**
> Q: 为什么Java的synchronized关键字基于管程？  
> A: 因为管程提供了更好的封装性和易用性。synchronized自动处理互斥，配合wait/notify实现条件等待，程序员不需要手动管理锁的获取和释放，减少了出错的可能。

---

## 术语速查

| 术语 | 英文 | 简要说明 |
|------|------|---------|
| 临界区 | Critical Section | 访问共享资源的代码 |
| 互斥锁 | Mutex | 二元锁，保证互斥 |
| 信号量 | Semaphore | 计数器，控制并发 |
| 管程 | Monitor | 高级同步机制 |
| 条件变量 | Condition Variable | 线程等待机制 |
| 读写锁 | Read-Write Lock | 区分读写访问 |

---

## 参考资料与复核

1. [The Little Book of Semaphores](https://greenteapress.com/semaphores/) - 免费电子书
2. [Java Concurrency Tutorial](https://docs.oracle.com/javase/tutorial/essential/concurrency/index.html) - Oracle官方教程
3. [C++ Concurrency in Action](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition) - 经典书籍

**复核日期建议：**
- 首次学习后1天：实现生产者-消费者程序
- 首次学习后7天：研究Java concurrent包源码
- 首次学习后30天：分析实际项目中的同步问题

---

*本章完。下一章将深入探讨死锁问题。*
