# 第二章：进程调度算法——银行排队管理系统

## 本节知识框架

### 学习目标
- 掌握四种经典调度算法：FCFS、SJF、RR、Priority
- 理解周转时间、等待时间、响应时间的计算
- 能够根据场景选择合适的调度算法
- 了解多级反馈队列调度机制

### 前置知识
- 进程与线程的基本概念（第一章）
- 队列数据结构
- 基本的数学计算能力

### 复习清单
- [ ] 能解释什么是时间片
- [ ] 能画出FCFS和SJF的执行顺序图
- [ ] 能计算平均周转时间
- [ ] 能说明RR算法的优缺点

---

## 核心概念定义

| 术语 | 定义 | 类比 |
|------|------|------|
| **调度 (Scheduling)** | 决定哪个进程获得CPU使用权 | 银行叫号系统 |
| **FCFS (First Come First Serve)** | 先来先服务，按到达顺序执行 | 普通排队取号 |
| **SJF (Shortest Job First)** | 最短作业优先，执行时间短的先执行 | VIP快速通道处理简单业务 |
| **RR (Round Robin)** | 时间片轮转，每个进程轮流执行固定时间 | 每人限时办理，超时重新排队 |
| **优先级调度** | 高优先级进程优先执行 | VIP客户优先办理 |
| **周转时间** | 从提交到完成的总时间 | 从取号到办完业务的总时长 |
| **等待时间** | 在就绪队列中等待的时间 | 排队等待的时间 |
| **响应时间** | 从提交到首次获得CPU的时间 | 从取号到开始办理的时间 |
| **抢占式调度** | 可以中断正在运行的进程 | 经理可以打断当前柜员服务 |
| **非抢占式调度** | 进程一旦获得CPU就一直运行到结束 | 柜员必须服务完当前客户才能换人 |

---

## 原理与运行机制

### 生活中的类比：银行排队系统

```
银行大厅布局：

┌─────────────────────────────────────┐
│          银行营业厅                   │
│                                     │
│  入口 → [取号机]                     │
│            ↓                        │
│  ┌──────────────────────────┐       │
│  │     等待区（就绪队列）     │       │
│  │                          │       │
│  │  A(5min) B(2min) C(8min) │       │
│  └──────────────────────────┘       │
│            ↓                        │
│  ┌──────────────────────────┐       │
│  │   柜台（CPU执行）         │       │
│  │                          │       │
│  │   [正在服务的客户]        │       │
│  └──────────────────────────┘       │
│            ↓                        │
│         出口（完成）                 │
└─────────────────────────────────────┘
```

### FCFS（先来先服务）算法

**工作原理：** 按照进程到达的顺序依次执行，类似普通排队。

```
示例：三个进程到达时间不同
进程A: 到达时间=0, 执行时间=5
进程B: 到达时间=1, 执行时间=2
进程C: 到达时间=2, 执行时间=8

执行顺序：A → B → C

时间轴：
0    5    7         15
|----A----|--B--|-----C-----|

周转时间：
A: 5-0 = 5
B: 7-1 = 6
C: 15-2 = 13
平均周转时间 = (5+6+13)/3 = 8
```

**优点：** 实现简单，公平  
**缺点：** 护航效应（Convoy Effect），短任务可能被长任务阻塞

### SJF（最短作业优先）算法

**工作原理：** 选择执行时间最短的进程优先执行。

```
同样的三个进程：
进程A: 到达时间=0, 执行时间=5
进程B: 到达时间=1, 执行时间=2
进程C: 到达时间=2, 执行时间=8

执行顺序：A → B → C（因为A先到，B和C到达时A已在执行）

如果所有进程同时到达：
执行顺序：B(2) → A(5) → C(8)

时间轴：
0    2    7              15
|--B--|--A--|------C------|

周转时间：
B: 2
A: 7
C: 15
平均周转时间 = (2+7+15)/3 = 8
```

**优点：** 平均等待时间最短  
**缺点：** 可能导致长任务饥饿，需要预知执行时间

### RR（时间片轮转）算法

**工作原理：** 每个进程分配固定的时间片，用完则切换到下一个。

```
时间片 = 3
进程A: 执行时间=5
进程B: 执行时间=2
进程C: 执行时间=8

执行顺序：A(3) → B(2) → C(3) → A(2) → C(3) → C(2)

时间轴：
0   3   5   8   10  13      15
|-A-|-B-|-C-|-A-|-C-|--C--|

周转时间：
A: 10
B: 5
C: 15
平均周转时间 = (10+5+15)/3 = 10
```

**优点：** 响应时间短，适合交互式系统  
**缺点：** 时间片过小导致频繁切换，过大退化为FCFS

### 优先级调度算法

**工作原理：** 为每个进程分配优先级，高优先级优先执行。

```
进程A: 优先级=3, 执行时间=5
进程B: 优先级=1, 执行时间=2  (1最高)
进程C: 优先级=2, 执行时间=8

执行顺序：B → C → A

时间轴：
0   2       10              15
|-B-|---C---|------A--------|
```

**优点：** 可以区分任务重要性  
**缺点：** 低优先级可能饥饿，需要老化机制

---

## 典型应用场景

| 场景 | 推荐算法 | 原因 |
|------|---------|------|
| 批处理系统 | SJF | 最小化平均周转时间 |
| 交互式系统（GUI） | RR | 保证快速响应 |
| 实时系统 | 优先级调度 | 关键任务优先 |
| 分时系统 | RR | 公平分配CPU时间 |
| 后台服务 | FCFS | 实现简单，开销小 |
| 混合负载 | 多级反馈队列 | 兼顾多种需求 |

---

## 代码示例

### C++完整实现：调度算法模拟器

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <iomanip>

struct Process {
    int id;
    int arrival_time;
    int burst_time;
    int priority;
    int remaining_time;
    int start_time;
    int completion_time;
    int waiting_time;
    int turnaround_time;
    
    Process(int id, int arrival, int burst, int prio = 0)
        : id(id), arrival_time(arrival), burst_time(burst),
          priority(prio), remaining_time(burst),
          start_time(-1), completion_time(0),
          waiting_time(0), turnaround_time(0) {}
};

class Scheduler {
private:
    std::vector<Process> processes;
    
public:
    void addProcess(int id, int arrival, int burst, int priority = 0) {
        processes.emplace_back(id, arrival, burst, priority);
    }
    
    // FCFS调度
    void fcfs() {
        std::cout << "\n=== FCFS调度算法 ===" << std::endl;
        
        // 按到达时间排序
        std::sort(processes.begin(), processes.end(),
            [](const Process& a, const Process& b) {
                return a.arrival_time < b.arrival_time;
            });
        
        int current_time = 0;
        for (auto& p : processes) {
            if (current_time < p.arrival_time) {
                current_time = p.arrival_time;
            }
            
            p.start_time = current_time;
            current_time += p.burst_time;
            p.completion_time = current_time;
            p.turnaround_time = p.completion_time - p.arrival_time;
            p.waiting_time = p.turnaround_time - p.burst_time;
            
            std::cout << "进程" << p.id << ": 开始=" << p.start_time
                      << ", 完成=" << p.completion_time
                      << ", 周转=" << p.turnaround_time
                      << ", 等待=" << p.waiting_time << std::endl;
        }
        
        printStatistics();
    }
    
    // SJF调度（非抢占式）
    void sjf() {
        std::cout << "\n=== SJF调度算法 ===" << std::endl;
        
        std::vector<Process> temp = processes;
        std::vector<bool> completed(temp.size(), false);
        int n = temp.size();
        int current_time = 0;
        int completed_count = 0;
        
        while (completed_count < n) {
            int shortest_idx = -1;
            int shortest_burst = INT_MAX;
            
            for (int i = 0; i < n; i++) {
                if (!completed[i] && temp[i].arrival_time <= current_time) {
                    if (temp[i].burst_time < shortest_burst) {
                        shortest_burst = temp[i].burst_time;
                        shortest_idx = i;
                    }
                }
            }
            
            if (shortest_idx == -1) {
                current_time++;
                continue;
            }
            
            auto& p = temp[shortest_idx];
            p.start_time = current_time;
            current_time += p.burst_time;
            p.completion_time = current_time;
            p.turnaround_time = p.completion_time - p.arrival_time;
            p.waiting_time = p.turnaround_time - p.burst_time;
            
            std::cout << "进程" << p.id << ": 开始=" << p.start_time
                      << ", 完成=" << p.completion_time
                      << ", 周转=" << p.turnaround_time
                      << ", 等待=" << p.waiting_time << std::endl;
            
            completed[shortest_idx] = true;
            completed_count++;
        }
        
        // 更新原始数据
        for (int i = 0; i < n; i++) {
            processes[i] = temp[i];
        }
        
        printStatistics();
    }
    
    // RR调度
    void roundRobin(int time_quantum) {
        std::cout << "\n=== RR调度算法 (时间片=" << time_quantum << ") ===" << std::endl;
        
        std::vector<Process> temp = processes;
        std::queue<int> ready_queue;
        int n = temp.size();
        int current_time = 0;
        int completed_count = 0;
        
        // 按到达时间排序并初始化
        std::sort(temp.begin(), temp.end(),
            [](const Process& a, const Process& b) {
                return a.arrival_time < b.arrival_time;
            });
        
        // 添加初始到达的进程
        for (int i = 0; i < n && temp[i].arrival_time <= current_time; i++) {
            ready_queue.push(i);
        }
        
        std::vector<bool> in_queue(n, false);
        for (int i = 0; i < n && temp[i].arrival_time <= current_time; i++) {
            in_queue[i] = true;
        }
        
        while (completed_count < n) {
            if (ready_queue.empty()) {
                current_time++;
                for (int i = 0; i < n; i++) {
                    if (!in_queue[i] && temp[i].arrival_time <= current_time) {
                        ready_queue.push(i);
                        in_queue[i] = true;
                    }
                }
                continue;
            }
            
            int idx = ready_queue.front();
            ready_queue.pop();
            
            auto& p = temp[idx];
            
            if (p.start_time == -1) {
                p.start_time = current_time;
            }
            
            int execute_time = std::min(time_quantum, p.remaining_time);
            current_time += execute_time;
            p.remaining_time -= execute_time;
            
            // 检查在此期间是否有新进程到达
            for (int i = 0; i < n; i++) {
                if (!in_queue[i] && temp[i].arrival_time <= current_time && i != idx) {
                    ready_queue.push(i);
                    in_queue[i] = true;
                }
            }
            
            if (p.remaining_time > 0) {
                ready_queue.push(idx);
            } else {
                p.completion_time = current_time;
                p.turnaround_time = p.completion_time - p.arrival_time;
                p.waiting_time = p.turnaround_time - p.burst_time;
                
                std::cout << "进程" << p.id << ": 完成=" << p.completion_time
                          << ", 周转=" << p.turnaround_time
                          << ", 等待=" << p.waiting_time << std::endl;
                
                completed_count++;
            }
        }
        
        for (int i = 0; i < n; i++) {
            processes[i] = temp[i];
        }
        
        printStatistics();
    }
    
private:
    void printStatistics() {
        double avg_turnaround = 0, avg_waiting = 0;
        for (const auto& p : processes) {
            avg_turnaround += p.turnaround_time;
            avg_waiting += p.waiting_time;
        }
        avg_turnaround /= processes.size();
        avg_waiting /= processes.size();
        
        std::cout << std::fixed << std::setprecision(2);
        std::cout << "平均周转时间: " << avg_turnaround << std::endl;
        std::cout << "平均等待时间: " << avg_waiting << std::endl;
    }
};

int main() {
    Scheduler scheduler;
    
    // 添加测试进程
    scheduler.addProcess(1, 0, 5);
    scheduler.addProcess(2, 1, 2);
    scheduler.addProcess(3, 2, 8);
    scheduler.addProcess(4, 3, 3);
    
    std::cout << "输入进程信息：" << std::endl;
    std::cout << "进程1: 到达=0, 执行=5" << std::endl;
    std::cout << "进程2: 到达=1, 执行=2" << std::endl;
    std::cout << "进程3: 到达=2, 执行=8" << std::endl;
    std::cout << "进程4: 到达=3, 执行=3" << std::endl;
    
    scheduler.fcfs();
    scheduler.sjf();
    scheduler.roundRobin(3);
    
    return 0;
}
```

编译命令：`g++ -std=c++17 02_scheduling.cpp -o scheduling`

### Java完整实现：优先级调度器

```java
import java.util.*;

class Process {
    int id;
    int arrivalTime;
    int burstTime;
    int priority;
    int remainingTime;
    int startTime;
    int completionTime;
    int waitingTime;
    int turnaroundTime;
    
    public Process(int id, int arrivalTime, int burstTime, int priority) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.priority = priority;
        this.remainingTime = burstTime;
        this.startTime = -1;
        this.completionTime = 0;
        this.waitingTime = 0;
        this.turnaroundTime = 0;
    }
}

public class PriorityScheduler {
    
    private List<Process> processes;
    
    public PriorityScheduler() {
        this.processes = new ArrayList<>();
    }
    
    public void addProcess(int id, int arrivalTime, int burstTime, int priority) {
        processes.add(new Process(id, arrivalTime, burstTime, priority));
    }
    
    // 优先级调度（数字越小优先级越高）
    public void scheduleByPriority() {
        System.out.println("\n=== 优先级调度算法 ===");
        
        List<Process> temp = new ArrayList<>(processes);
        boolean[] completed = new boolean[temp.size()];
        int currentTime = 0;
        int completedCount = 0;
        
        while (completedCount < temp.size()) {
            int highestPriorityIdx = -1;
            int highestPriority = Integer.MAX_VALUE;
            
            for (int i = 0; i < temp.size(); i++) {
                if (!completed[i] && temp.get(i).arrivalTime <= currentTime) {
                    if (temp.get(i).priority < highestPriority) {
                        highestPriority = temp.get(i).priority;
                        highestPriorityIdx = i;
                    }
                }
            }
            
            if (highestPriorityIdx == -1) {
                currentTime++;
                continue;
            }
            
            Process p = temp.get(highestPriorityIdx);
            if (p.startTime == -1) {
                p.startTime = currentTime;
            }
            
            currentTime += p.burstTime;
            p.completionTime = currentTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnaroundTime - p.burstTime;
            
            System.out.printf("进程%d: 开始=%d, 完成=%d, 周转=%d, 等待=%d%n",
                p.id, p.startTime, p.completionTime, 
                p.turnaroundTime, p.waitingTime);
            
            completed[highestPriorityIdx] = true;
            completedCount++;
        }
        
        printStatistics(temp);
    }
    
    // 带老化的优先级调度（防止饥饿）
    public void scheduleWithAging(int agingInterval) {
        System.out.println("\n=== 带老化的优先级调度 ===");
        
        List<Process> temp = new ArrayList<>(processes);
        int[] waitTimes = new int[temp.size()];
        boolean[] completed = new boolean[temp.size()];
        int currentTime = 0;
        int completedCount = 0;
        
        while (completedCount < temp.size()) {
            // 老化：增加等待进程的优先级
            for (int i = 0; i < temp.size(); i++) {
                if (!completed[i] && temp.get(i).arrivalTime <= currentTime) {
                    waitTimes[i]++;
                    if (waitTimes[i] % agingInterval == 0) {
                        temp.get(i).priority = Math.max(0, temp.get(i).priority - 1);
                    }
                }
            }
            
            int highestPriorityIdx = -1;
            int highestPriority = Integer.MAX_VALUE;
            
            for (int i = 0; i < temp.size(); i++) {
                if (!completed[i] && temp.get(i).arrivalTime <= currentTime) {
                    if (temp.get(i).priority < highestPriority) {
                        highestPriority = temp.get(i).priority;
                        highestPriorityIdx = i;
                    }
                }
            }
            
            if (highestPriorityIdx == -1) {
                currentTime++;
                continue;
            }
            
            Process p = temp.get(highestPriorityIdx);
            if (p.startTime == -1) {
                p.startTime = currentTime;
            }
            
            currentTime += p.burstTime;
            p.completionTime = currentTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnaroundTime - p.burstTime;
            
            System.out.printf("进程%d (优先级=%d): 完成=%d, 周转=%d%n",
                p.id, p.priority, p.completionTime, p.turnaroundTime);
            
            completed[highestPriorityIdx] = true;
            completedCount++;
        }
        
        printStatistics(temp);
    }
    
    private void printStatistics(List<Process> procs) {
        double avgTurnaround = 0, avgWaiting = 0;
        for (Process p : procs) {
            avgTurnaround += p.turnaroundTime;
            avgWaiting += p.waitingTime;
        }
        avgTurnaround /= procs.size();
        avgWaiting /= procs.size();
        
        System.out.printf("平均周转时间: %.2f%n", avgTurnaround);
        System.out.printf("平均等待时间: %.2f%n", avgWaiting);
    }
    
    public static void main(String[] args) {
        PriorityScheduler scheduler = new PriorityScheduler();
        
        scheduler.addProcess(1, 0, 5, 3);
        scheduler.addProcess(2, 1, 2, 1);
        scheduler.addProcess(3, 2, 8, 4);
        scheduler.addProcess(4, 3, 3, 2);
        
        System.out.println("输入进程信息：");
        System.out.println("进程1: 到达=0, 执行=5, 优先级=3");
        System.out.println("进程2: 到达=1, 执行=2, 优先级=1 (最高)");
        System.out.println("进程3: 到达=2, 执行=8, 优先级=4");
        System.out.println("进程4: 到达=3, 执行=3, 优先级=2");
        
        scheduler.scheduleByPriority();
        scheduler.scheduleWithAging(5);
    }
}
```

编译命令：`javac PriorityScheduler.java && java PriorityScheduler`

---

## 复杂度或性能分析

| 算法 | 平均等待时间 | 实现复杂度 | 是否抢占 | 适用场景 |
|------|------------|-----------|---------|---------|
| FCFS | 较高 | O(n log n) | 否 | 批处理系统 |
| SJF | 最低 | O(n²) | 可选 | 已知执行时间的任务 |
| RR | 中等 | O(n) | 是 | 交互式系统 |
| 优先级 | 取决于分布 | O(n²) | 可选 | 实时系统 |

**时间复杂度说明：**
- FCFS: 主要开销在排序
- SJF: 每次选择最短作业需遍历所有就绪进程
- RR: 只需维护队列，操作简单
- 优先级: 类似SJF，需查找最高优先级

---

## 常见误区与易错点

| 错误/现象 | 原因 | 解决方案 |
|----------|------|---------|
| SJF无法实现 | 无法预知执行时间 | 使用历史数据估算 |
| RR时间片设置不当 | 过小导致切换频繁，过大失去意义 | 设为略大于典型交互时间 |
| 优先级饥饿 | 低优先级永远得不到执行 | 实现老化机制 |
| 护航效应 | FCFS中长任务阻塞短任务 | 改用SJF或RR |
| 周转时间计算错误 | 混淆了到达时间和开始时间 | 周转时间=完成时间-到达时间 |
|  starvation | 某些算法导致进程长期等待 | 采用公平调度或老化 |

---

## 与其他知识点的关系

- **与进程状态的关系**：调度涉及就绪→运行状态的转换
- **与上下文切换的关系**：抢占式调度会增加上下文切换次数
- **与实时系统的关系**：实时系统需要确定性调度保证截止时间
- **与多线程的关系**：线程调度通常由用户态库或内核共同管理

---

## 自测题与参考答案

### 问题1：以下哪种调度算法能保证最短的平均等待时间？
A. FCFS  
B. SJF  
C. RR  
D. 优先级调度

**答案：B**

**解析：** SJF（最短作业优先）在理论上能保证最短的平均等待时间，因为它总是优先执行短任务，减少了后续任务的等待时间。但这需要预知执行时间，实际中难以完美实现。

### 问题2：RR算法中，时间片大小对性能有什么影响？
A. 时间片越大越好  
B. 时间片越小越好  
C. 时间片应适中，平衡响应时间和切换开销  
D. 时间片大小不影响性能

**答案：C**

**解析：** 时间片过大会使RR退化为FCFS，响应时间变差；时间片过小会导致频繁的上下文切换，增加系统开销。理想的时间片应略大于典型的交互操作时间（如键盘输入间隔）。

### 问题3：什么是优先级调度中的"饥饿"问题？如何解决？
A. 高优先级任务太多，通过限制优先级数量解决  
B. 低优先级任务长期得不到执行，通过老化机制解决  
C. 所有任务优先级相同，通过随机选择解决  
D. 优先级动态变化，通过固定优先级解决

**答案：B**

**解析：** 饥饿是指低优先级任务因为不断有高优先级任务到达而长期得不到CPU。解决方法是实现"老化"机制：随着等待时间增加，逐渐提高进程的优先级，确保最终能获得执行机会。

---

## 考点精讲

### 考点1：调度算法的性能指标对比

**核心要点：**
1. **周转时间**：衡量整体效率，SJF最优
2. **响应时间**：衡量交互体验，RR最优
3. **吞吐量**：单位时间完成任务数，取决于算法和负载

**面试常见问题：**
> Q: 为什么现代操作系统不单纯使用SJF？  
> A: 因为SJF需要预知进程的执行时间，这在实际中很难准确预测。此外，SJF可能导致长任务饥饿。现代系统通常采用多级反馈队列等混合策略。

### 考点2：RR时间片的选择原则

**核心要点：**
1. **典型值**：10-100毫秒
2. **考虑因素**：上下文切换开销、典型交互时间、系统负载
3. **经验法则**：80%的CPU突发应在一个时间片内完成

**面试常见问题：**
> Q: 如何确定RR的最佳时间片大小？  
> A: 没有绝对的最优值，需要根据具体系统调整。一般原则是：时间片应足够大以减少切换开销（切换开销占比<10%），又足够小以保证良好的响应时间。可以通过实验测量不同时间片下的系统性能来选择。

### 考点3：多级反馈队列调度

**核心要点：**
1. **多个队列**：不同优先级对应不同队列
2. **时间片递增**：高优先级队列时间片短，低优先级时间长
3. **降级机制**：用完时间片未完成则降到下一级队列
4. **综合优势**：短任务快速响应，长任务也能完成

**面试常见问题：**
> Q: 多级反馈队列如何解决不同长度任务的需求？  
> A: 短任务在高优先级队列中快速完成（短时间片），不会长时间占用CPU；长任务会逐渐降到低优先级队列，获得更长的时间片，减少切换次数。这样既保证了交互性，又提高了吞吐量。

---

## 术语速查

| 术语 | 英文 | 简要说明 |
|------|------|---------|
| 调度 | Scheduling | 决定CPU分配 |
| 时间片 | Time Quantum | RR中分配的时间段 |
| 周转时间 | Turnaround Time | 提交到完成的总时间 |
| 等待时间 | Waiting Time | 在就绪队列等待的时间 |
| 饥饿 | Starvation | 长期得不到资源 |
| 老化 | Aging | 提高等待进程的优先级 |

---

## 参考资料与复核

1. [CPU Scheduling - GeeksforGeeks](https://www.geeksforgeeks.org/cpu-scheduling-in-operating-system/) - 详细教程
2. [Linux Scheduler Documentation](https://www.kernel.org/doc/html/latest/scheduler/index.html) - Linux内核文档
3. [Operating Systems: Three Easy Pieces - Scheduling](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf) - 免费在线教材

**复核日期建议：**
- 首次学习后1天：手动计算三种算法的调度结果
- 首次学习后7天：实现自己的调度模拟器
- 首次学习后30天：研究Linux CFS调度器源码

---

*本章完。下一章将探讨进程间通信机制。*
