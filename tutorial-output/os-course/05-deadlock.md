# 第五章：死锁——交通路口的僵局

## 本节知识框架

### 学习目标
- 理解死锁的四个必要条件
- 掌握死锁预防、避免、检测和解除策略
- 能够运用银行家算法判断安全状态
- 了解实际系统中的死锁处理方法

### 前置知识
- 进程同步机制（第四章）
- 资源分配的概念
- 图论基础（环的概念）

### 复习清单
- [ ] 能列举死锁的四个必要条件
- [ ] 能解释什么是安全状态
- [ ] 能手动执行银行家算法
- [ ] 能说明死锁预防和避免的区别

---

## 核心概念定义

| 术语 | 定义 | 类比 |
|------|------|------|
| **死锁 (Deadlock)** | 多个进程互相等待对方持有的资源 | 十字路口四辆车互不相让 |
| **活锁 (Livelock)** | 进程不断改变状态但无法前进 | 两人迎面不断避让却过不去 |
| **饥饿 (Starvation)** | 进程长期得不到所需资源 | 总是轮不到你使用公共设施 |
| **安全状态** | 存在至少一个安全序列使所有进程完成 | 交通有序，所有车都能通过 |
| **不安全状态** | 可能存在死锁的状态 | 交通混乱，可能堵车 |
| **资源分配图** | 描述进程和资源关系的有向图 | 交通流向图 |
| **银行家算法** | 避免死锁的资源分配算法 | 银行谨慎放贷 |
| **资源抢占** | 强制收回已分配的资源 | 交警强制疏导交通 |
| **进程终止** | 杀死一个或多个进程解除死锁 | 拖走堵路的车辆 |
| **回滚 (Rollback)** | 将进程恢复到之前的状态 | 倒车重新选择路线 |

---

## 原理与运行机制

### 生活中的类比：十字路口死锁

```
经典死锁场景：

        ↑ 北
        │
   西 ←─┼─→ 东
        │
        ↓ 南

四辆车在十字路口相遇：
- 车A（北向南）等待车B让行
- 车B（东向西）等待车C让行
- 车C（南向北）等待车D让行
- 车D（西向东）等待车A让行

结果：形成循环等待，谁也动不了！

这就是死锁的四个必要条件同时满足：
1. 互斥：路口一次只能过一个方向
2. 占有并等待：每辆车都占着位置等别人让
3. 不可抢占：不能强行把车拖走
4. 循环等待：A→B→C→D→A形成环
```

### 死锁的四个必要条件

```
必须同时满足以下四个条件才会发生死锁：

┌─────────────────────────────────────┐
│  1. 互斥条件 (Mutual Exclusion)     │
│     资源一次只能被一个进程使用       │
├─────────────────────────────────────┤
│  2. 占有并等待 (Hold and Wait)      │
│     进程持有资源的同时等待其他资源   │
├─────────────────────────────────────┤
│  3. 不可抢占 (No Preemption)        │
│     已分配的资源不能被强制收回       │
├─────────────────────────────────────┤
│  4. 循环等待 (Circular Wait)        │
│     存在进程-资源的循环等待链        │
└─────────────────────────────────────┘

破坏其中任何一个条件即可预防死锁！
```

### 资源分配图

```
进程用圆圈表示，资源用方框表示

    ┌── R1 ──┐         ┌── R2 ──┐
    │ □  □   │         │ □  □   │
    └─┬──┬──┘         └─┬──┬──┘
      │  │               │  │
      │  └──────┐  ┌─────┘  │
      │         │  │        │
     ┌○─┐     ┌○─┐│       ┌○─┐
     │P1│     │P2││       │P3│
     └┬─┘     └┬─┘│       └┬─┘
      │        │  │        │
      └────────┴──┴────────┘
      
箭头含义：
- 进程→资源：请求边（进程请求资源）
- 资源→进程：分配边（资源已分配给进程）

如果图中存在环，则可能发生死锁！
```

### 银行家算法

```
算法思想：银行在放贷前检查是否会导致资金不足

步骤：
1. 检查请求是否超过最大需求
2. 检查请求是否超过可用资源
3. 试探性分配，检查系统是否仍处于安全状态
4. 如果安全，正式分配；否则拒绝请求

安全状态判断：
- 寻找一个进程，其剩余需求 ≤ 可用资源
- 假设该进程完成，释放其占用的资源
- 重复上述过程，直到所有进程都能完成
- 如果能找到这样的序列，则系统安全
```

---

## 典型应用场景

| 场景 | 死锁风险 | 处理策略 | 原因 |
|------|---------|---------|------|
| 数据库事务 | 高 | 超时检测+回滚 | 多表锁定容易循环等待 |
| 操作系统资源 | 中 | 银行家算法（理论） | 实际中很少使用 |
| 多线程程序 | 高 | 统一加锁顺序 | 最容易发生 |
| 分布式系统 | 极高 | 超时+重试 | 网络延迟增加风险 |
| 文件系统 | 低 | 按顺序锁定inode | 设计时已考虑 |

---

## 代码示例

### C++完整实现：银行家算法

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

class BankersAlgorithm {
private:
    int processes;
    int resources;
    std::vector<std::vector<int>> allocation;    // 已分配
    std::vector<std::vector<int>> max_need;      // 最大需求
    std::vector<std::vector<int>> need;          // 还需
    std::vector<int> available;                  // 可用资源
    
public:
    BankersAlgorithm(int p, int r) 
        : processes(p), resources(r),
          allocation(p, std::vector<int>(r, 0)),
          max_need(p, std::vector<int>(r, 0)),
          need(p, std::vector<int>(r, 0)),
          available(r, 0) {}
    
    void setAvailable(const std::vector<int>& avail) {
        available = avail;
    }
    
    void setAllocation(int process, const std::vector<int>& alloc) {
        allocation[process] = alloc;
    }
    
    void setMaxNeed(int process, const std::vector<int>& max) {
        max_need[process] = max;
        // 计算need = max - allocation
        for (int j = 0; j < resources; j++) {
            need[process][j] = max[j] - allocation[process][j];
        }
    }
    
    // 检查系统是否处于安全状态
    bool isSafe() {
        std::vector<int> work = available;
        std::vector<bool> finished(processes, false);
        std::vector<int> safe_sequence;
        
        while (safe_sequence.size() < processes) {
            bool found = false;
            
            for (int i = 0; i < processes; i++) {
                if (!finished[i]) {
                    // 检查进程i的需求是否可以满足
                    bool can_allocate = true;
                    for (int j = 0; j < resources; j++) {
                        if (need[i][j] > work[j]) {
                            can_allocate = false;
                            break;
                        }
                    }
                    
                    if (can_allocate) {
                        // 假设进程i完成，释放资源
                        for (int j = 0; j < resources; j++) {
                            work[j] += allocation[i][j];
                        }
                        finished[i] = true;
                        safe_sequence.push_back(i);
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) {
                std::cout << "系统处于不安全状态！" << std::endl;
                return false;
            }
        }
        
        std::cout << "系统处于安全状态！" << std::endl;
        std::cout << "安全序列: ";
        for (int i = 0; i < safe_sequence.size(); i++) {
            std::cout << "P" << safe_sequence[i];
            if (i < safe_sequence.size() - 1) std::cout << " -> ";
        }
        std::cout << std::endl;
        
        return true;
    }
    
    // 请求资源
    bool requestResources(int process, const std::vector<int>& request) {
        std::cout << "\n进程P" << process << " 请求资源: [";
        for (int j = 0; j < resources; j++) {
            std::cout << request[j];
            if (j < resources - 1) std::cout << ", ";
        }
        std::cout << "]" << std::endl;
        
        // 检查请求是否超过最大需求
        for (int j = 0; j < resources; j++) {
            if (request[j] > need[process][j]) {
                std::cout << "错误：请求超过最大需求！" << std::endl;
                return false;
            }
        }
        
        // 检查请求是否超过可用资源
        for (int j = 0; j < resources; j++) {
            if (request[j] > available[j]) {
                std::cout << "错误：资源不足，进程需等待！" << std::endl;
                return false;
            }
        }
        
        // 试探性分配
        for (int j = 0; j < resources; j++) {
            available[j] -= request[j];
            allocation[process][j] += request[j];
            need[process][j] -= request[j];
        }
        
        // 检查安全性
        if (isSafe()) {
            std::cout << "请求被批准！" << std::endl;
            return true;
        } else {
            // 恢复原状
            std::cout << "请求被拒绝（会导致不安全状态）！" << std::endl;
            for (int j = 0; j < resources; j++) {
                available[j] += request[j];
                allocation[process][j] -= request[j];
                need[process][j] += request[j];
            }
            return false;
        }
    }
    
    void printState() {
        std::cout << "\n=== 当前系统状态 ===" << std::endl;
        std::cout << "可用资源: [";
        for (int j = 0; j < resources; j++) {
            std::cout << available[j];
            if (j < resources - 1) std::cout << ", ";
        }
        std::cout << "]" << std::endl;
        
        std::cout << "\n进程\t已分配\t\t最大需求\t\t还需" << std::endl;
        for (int i = 0; i < processes; i++) {
            std::cout << "P" << i << "\t[";
            for (int j = 0; j < resources; j++) {
                std::cout << allocation[i][j];
                if (j < resources - 1) std::cout << ",";
            }
            std::cout << "]\t\t[";
            for (int j = 0; j < resources; j++) {
                std::cout << max_need[i][j];
                if (j < resources - 1) std::cout << ",";
            }
            std::cout << "]\t\t[";
            for (int j = 0; j < resources; j++) {
                std::cout << need[i][j];
                if (j < resources - 1) std::cout << ",";
            }
            std::cout << "]" << std::endl;
        }
    }
};

int main() {
    std::cout << "银行家算法演示" << std::endl;
    std::cout << "================" << std::endl;
    
    // 5个进程，3种资源
    BankersAlgorithm ba(5, 3);
    
    // 设置可用资源
    ba.setAvailable({3, 3, 2});
    
    // 设置已分配资源
    ba.setAllocation(0, {0, 1, 0});
    ba.setAllocation(1, {2, 0, 0});
    ba.setAllocation(2, {3, 0, 2});
    ba.setAllocation(3, {2, 1, 1});
    ba.setAllocation(4, {0, 0, 2});
    
    // 设置最大需求
    ba.setMaxNeed(0, {7, 5, 3});
    ba.setMaxNeed(1, {3, 2, 2});
    ba.setMaxNeed(2, {9, 0, 2});
    ba.setMaxNeed(3, {2, 2, 2});
    ba.setMaxNeed(4, {4, 3, 3});
    
    ba.printState();
    ba.isSafe();
    
    // 进程1请求资源
    ba.requestResources(1, {1, 0, 2});
    
    ba.printState();
    
    return 0;
}
```

编译命令：`g++ -std=c++17 05_deadlock.cpp -o deadlock_demo`

### Java完整实现：死锁检测和预防

```java
import java.util.*;

// 资源类
class Resource {
    private final String name;
    private boolean locked;
    private Thread owner;
    
    public Resource(String name) {
        this.name = name;
        this.locked = false;
        this.owner = null;
    }
    
    public synchronized void acquire() throws InterruptedException {
        while (locked) {
            System.out.println(Thread.currentThread().getName() + 
                             " 等待资源 " + name);
            wait();
        }
        locked = true;
        owner = Thread.currentThread();
        System.out.println(Thread.currentThread().getName() + 
                         " 获得资源 " + name);
    }
    
    public synchronized void release() {
        if (!locked || owner != Thread.currentThread()) {
            throw new IllegalMonitorStateException();
        }
        locked = false;
        owner = null;
        System.out.println(Thread.currentThread().getName() + 
                         " 释放资源 " + name);
        notifyAll();
    }
    
    public String getName() { return name; }
    public boolean isLocked() { return locked; }
    public Thread getOwner() { return owner; }
}

// 死锁检测器
class DeadlockDetector {
    private final Map<Thread, List<Resource>> threadResources = new HashMap<>();
    
    public synchronized void registerResource(Thread thread, Resource resource) {
        threadResources.computeIfAbsent(thread, k -> new ArrayList<>())
                      .add(resource);
    }
    
    public synchronized void unregisterResource(Thread thread, Resource resource) {
        List<Resource> resources = threadResources.get(thread);
        if (resources != null) {
            resources.remove(resource);
            if (resources.isEmpty()) {
                threadResources.remove(thread);
            }
        }
    }
    
    // 检测是否存在循环等待
    public boolean hasDeadlock() {
        // 构建等待图
        Map<Thread, Thread> waitGraph = new HashMap<>();
        
        for (Map.Entry<Thread, List<Resource>> entry : threadResources.entrySet()) {
            Thread thread = entry.getKey();
            for (Resource resource : entry.getValue()) {
                if (resource.isLocked() && resource.getOwner() != thread) {
                    waitGraph.put(thread, resource.getOwner());
                    break;
                }
            }
        }
        
        // 检测环
        Set<Thread> visited = new HashSet<>();
        for (Thread thread : waitGraph.keySet()) {
            if (hasCycle(thread, waitGraph, visited, new HashSet<>())) {
                return true;
            }
        }
        
        return false;
    }
    
    private boolean hasCycle(Thread current, Map<Thread, Thread> graph,
                           Set<Thread> visited, Set<Thread> path) {
        if (path.contains(current)) {
            return true; // 发现环
        }
        
        if (visited.contains(current)) {
            return false;
        }
        
        visited.add(current);
        path.add(current);
        
        Thread next = graph.get(current);
        if (next != null && hasCycle(next, graph, visited, path)) {
            return true;
        }
        
        path.remove(current);
        return false;
    }
}

// 使用有序加锁预防死锁
class OrderedLocking {
    private final List<Resource> resources;
    
    public OrderedLocking(Resource... resources) {
        this.resources = Arrays.asList(resources);
        // 按名称排序，确保一致的加锁顺序
        this.resources.sort(Comparator.comparing(Resource::getName));
    }
    
    public void executeWithAllLocks(Runnable task) {
        // 按固定顺序获取所有锁
        for (Resource resource : resources) {
            try {
                resource.acquire();
            } catch (InterruptedException e) {
                // 释放已获取的锁
                releaseAllAcquired();
                Thread.currentThread().interrupt();
                return;
            }
        }
        
        try {
            task.run();
        } finally {
            // 按相反顺序释放锁
            for (int i = resources.size() - 1; i >= 0; i--) {
                resources.get(i).release();
            }
        }
    }
    
    private void releaseAllAcquired() {
        for (Resource resource : resources) {
            if (resource.isLocked()) {
                resource.release();
            }
        }
    }
}

public class DeadlockDemo {
    
    // 演示死锁场景
    public static void demonstrateDeadlock() {
        System.out.println("\n=== 死锁场景演示 ===");
        
        Resource resourceA = new Resource("资源A");
        Resource resourceB = new Resource("资源B");
        
        Thread thread1 = new Thread(() -> {
            try {
                resourceA.acquire();
                Thread.sleep(100); // 增加死锁概率
                resourceB.acquire();
                System.out.println("线程1 获得所有资源");
                resourceB.release();
                resourceA.release();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "线程1");
        
        Thread thread2 = new Thread(() -> {
            try {
                resourceB.acquire();
                Thread.sleep(100);
                resourceA.acquire();
                System.out.println("线程2 获得所有资源");
                resourceA.release();
                resourceB.release();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "线程2");
        
        thread1.start();
        thread2.start();
        
        // 注意：这个演示可能会真正死锁！
        // 实际使用时应设置超时或中断机制
    }
    
    // 演示有序加锁预防死锁
    public static void demonstrateOrderedLocking() {
        System.out.println("\n=== 有序加锁预防死锁 ===");
        
        Resource resourceA = new Resource("资源A");
        Resource resourceB = new Resource("资源B");
        
        OrderedLocking locking = new OrderedLocking(resourceA, resourceB);
        
        Thread thread1 = new Thread(() -> {
            locking.executeWithAllLocks(() -> {
                System.out.println("线程1 执行任务");
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }, "线程1");
        
        Thread thread2 = new Thread(() -> {
            locking.executeWithAllLocks(() -> {
                System.out.println("线程2 执行任务");
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }, "线程2");
        
        thread1.start();
        thread2.start();
        
        try {
            thread1.join();
            thread2.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("有序加锁成功避免死锁！");
    }
    
    // 演示带超时的锁获取
    public static void demonstrateTimeoutLocking() {
        System.out.println("\n=== 带超时的锁获取 ===");
        
        Resource resourceA = new Resource("资源A");
        Resource resourceB = new Resource("资源B");
        
        Thread thread1 = new Thread(() -> {
            try {
                resourceA.acquire();
                Thread.sleep(200);
                
                // 尝试获取resourceB，带超时
                System.out.println("线程1 尝试获取资源B...");
                // 简化：这里直接尝试，实际应实现超时机制
                resourceB.acquire();
                
                System.out.println("线程1 完成");
                resourceB.release();
                resourceA.release();
            } catch (InterruptedException e) {
                System.out.println("线程1 被中断（可能检测到死锁）");
                Thread.currentThread().interrupt();
            }
        }, "线程1");
        
        Thread thread2 = new Thread(() -> {
            try {
                resourceB.acquire();
                Thread.sleep(200);
                
                System.out.println("线程2 尝试获取资源A...");
                resourceA.acquire();
                
                System.out.println("线程2 完成");
                resourceA.release();
                resourceB.release();
            } catch (InterruptedException e) {
                System.out.println("线程2 被中断（可能检测到死锁）");
                Thread.currentThread().interrupt();
            }
        }, "线程2");
        
        thread1.start();
        thread2.start();
        
        // 监控线程：检测死锁并中断
        Thread monitor = new Thread(() -> {
            try {
                Thread.sleep(2000); // 等待2秒
                if (thread1.isAlive() && thread2.isAlive()) {
                    System.out.println("检测到可能的死锁，中断线程...");
                    thread1.interrupt();
                    thread2.interrupt();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "监控线程");
        
        monitor.start();
        
        try {
            thread1.join();
            thread2.join();
            monitor.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    public static void main(String[] args) {
        System.out.println("死锁处理机制演示");
        System.out.println("==================");
        
        // 注意：demonstrateDeadlock() 可能导致真正死锁，谨慎使用
        // demonstrateDeadlock();
        
        demonstrateOrderedLocking();
        demonstrateTimeoutLocking();
        
        System.out.println("\n所有演示完成");
    }
}
```

编译命令：`javac DeadlockDemo.java && java DeadlockDemo`

---

## 复杂度或性能分析

| 策略 | 时间复杂度 | 空间复杂度 | 实用性 | 开销 |
|------|-----------|-----------|--------|------|
| 死锁预防 | O(1) | O(1) | 高 | 低 |
| 死锁避免（银行家） | O(n²×m) | O(n×m) | 低 | 高 |
| 死锁检测 | O(n+m) | O(n+m) | 中 | 中 |
| 死锁解除 | O(n) | O(1) | 中 | 高 |

注：n=进程数，m=资源数

---

## 常见误区与易错点

| 错误/现象 | 原因 | 解决方案 |
|----------|------|---------|
| 认为银行家算法常用 | 实际系统中很少使用 | 理解其理论价值 |
| 忽略活锁问题 | 只关注死锁 | 引入随机退避 |
| 超时设置不当 | 过短误判，过长响应慢 | 根据业务调整 |
| 死锁检测频率过高 | 影响系统性能 | 定期检测或按需检测 |
| 回滚代价大 | 部分操作不可逆 | 设计可回滚的事务 |
| 优先级反转 | 低优先级持有高优先级需要的锁 | 优先级继承协议 |

---

## 与其他知识点的关系

- **与同步机制的关系**：不当使用锁会导致死锁
- **与事务的关系**：数据库事务需要处理死锁
- **与分布式系统的关系**：分布式死锁更复杂
- **与操作系统的关系**：OS提供死锁检测工具

---

## 自测题与参考答案

### 问题1：以下哪个不是死锁的必要条件？
A. 互斥  
B. 占有并等待  
C. 抢占  
D. 循环等待

**答案：C**

**解析：** 死锁的四个必要条件是：互斥、占有并等待、不可抢占、循环等待。"抢占"不是死锁的条件，相反，允许抢占可以预防死锁（破坏不可抢占条件）。

### 问题2：银行家算法属于哪种死锁处理策略？
A. 死锁预防  
B. 死锁避免  
C. 死锁检测  
D. 死锁解除

**答案：B**

**解析：** 银行家算法是死锁避免策略。它在每次资源分配前检查系统是否会进入不安全状态，如果会则拒绝分配。这与死锁预防（静态破坏必要条件）和死锁检测（事后发现）不同。

### 问题3：如何预防死锁中的"循环等待"条件？
A. 一次性申请所有资源  
B. 允许资源抢占  
C. 规定资源的申请顺序  
D. 使用信号量

**答案：C**

**解析：** 规定所有进程按固定顺序申请资源可以破坏循环等待条件。例如，规定必须先申请资源A再申请资源B，这样就不会出现A等待B、B等待A的循环。选项A破坏的是"占有并等待"条件。

---

## 考点精讲

### 考点1：死锁四个必要条件的理解和应用

**核心要点：**
1. **互斥**：某些资源天然就是互斥的（如打印机）
2. **占有并等待**：进程可以先占有一些资源再申请其他
3. **不可抢占**：已分配的资源不能被强制收回
4. **循环等待**：存在P1→R1→P2→R2→...→P1的环

**面试常见问题：**
> Q: 如何在实际编程中预防死锁？  
> A: 
> 1. 统一加锁顺序（破坏循环等待）
> 2. 使用tryLock带超时（破坏不可抢占）
> 3. 一次性获取所有锁（破坏占有并等待）
> 4. 使用高级并发工具（如Java的ConcurrentHashMap）

### 考点2：银行家算法的执行步骤

**核心要点：**
1. **初始化**：设置available、allocation、max、need矩阵
2. **安全检查**：寻找安全序列
3. **请求处理**：试探分配→安全检查→决定批准或拒绝

**面试常见问题：**
> Q: 为什么实际操作系统不使用银行家算法？  
> A: 
> 1. 需要预知进程的最大资源需求（不现实）
> 2. 进程数量动态变化
> 3. 资源类型多样
> 4. 算法开销大
> 实际系统多采用死锁检测+恢复策略。

### 考点3：死锁检测算法

**核心要点：**
1. **资源分配图**：用图表示进程和资源的关系
2. **环检测**：图中存在环则可能死锁
3. **简化算法**：不断移除能满足的进程，最后剩余的即为死锁进程

**面试常见问题：**
> Q: 如何检测多线程程序中的死锁？  
> A: 
> 1. 使用JVM内置的死锁检测（jstack命令）
> 2. 构建等待图，检测环
> 3. 使用专门的死锁检测工具
> 4. 代码审查，确保一致的加锁顺序

---

## 术语速查

| 术语 | 英文 | 简要说明 |
|------|------|---------|
| 死锁 | Deadlock | 互相等待的僵局 |
| 安全状态 | Safe State | 存在安全序列 |
| 银行家算法 | Banker's Algorithm | 避免死锁的算法 |
| 资源分配图 | Resource Allocation Graph | 描述资源关系 |
| 死锁预防 | Deadlock Prevention | 静态破坏条件 |
| 死锁避免 | Deadlock Avoidance | 动态检查安全性 |

---

## 参考资料与复核

1. [Deadlock Detection and Recovery](https://www.cs.uic.edu/~arthur/dsa362/lectures/deadlocks.html) - 详细教程
2. [Java Deadlock Detection](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr03.html) - Oracle文档
3. [Operating Systems: Deadlocks](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf) - OSTEP教材

**复核日期建议：**
- 首次学习后1天：手动执行银行家算法例题
- 首次学习后7天：编写死锁检测程序
- 首次学习后30天：分析实际项目的死锁案例

---

*本章完。下一章将探讨内存管理机制。*
