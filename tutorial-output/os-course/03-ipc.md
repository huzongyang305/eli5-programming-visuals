# 第三章：进程间通信(IPC)——办公室沟通方式

## 本节知识框架

### 学习目标
- 掌握四种主要IPC机制：管道、消息队列、共享内存、信号
- 理解每种IPC机制的适用场景和优缺点
- 能够选择合适的IPC方式解决实际问题
- 了解UNIX域套接字和信号量在IPC中的应用

### 前置知识
- 进程的基本概念（第一章）
- 文件描述符的概念
- 基本的同步概念

### 复习清单
- [ ] 能列举至少4种IPC机制
- [ ] 能说明管道和消息队列的区别
- [ ] 能解释为什么共享内存最快
- [ ] 能画出生产者-消费者的IPC架构图

---

## 核心概念定义

| 术语 | 定义 | 类比 |
|------|------|------|
| **IPC (Inter-Process Communication)** | 进程间交换数据的方法 | 办公室同事间的沟通方式 |
| **管道 (Pipe)** | 单向数据流，用于父子进程通信 | 内部电话专线 |
| **命名管道 (Named Pipe/FIFO)** | 有名称的管道，无关进程也可使用 | 公司总机转接 |
| **消息队列** | 内核维护的消息链表 | 公司内部邮件系统 |
| **共享内存** | 多个进程映射同一块物理内存 | 公共白板 |
| **信号 (Signal)** | 异步通知机制 | 紧急广播通知 |
| **信号量 (Semaphore)** | 用于同步的计数器 | 会议室预约系统 |
| **内存映射 (mmap)** | 将文件映射到内存 | 共享文档云端协作 |
| **套接字 (Socket)** | 网络或本地通信端点 | 电话会议系统 |
| **RPC (Remote Procedure Call)** | 远程过程调用 | 委托其他部门办事 |

---

## 原理与运行机制

### 生活中的类比：办公室沟通系统

```
办公室沟通方式对比：

┌─────────────────────────────────────────────┐
│              公司办公大楼                     │
│                                             │
│  ┌──────────┐         ┌──────────┐         │
│  │ 部门A     │         │ 部门B     │         │
│  │ (进程1)   │         │ (进程2)   │         │
│  │          │         │          │         │
│  │ 📞专线    │←──────→│ 📞专线    │  ← 管道  │
│  │          │         │          │         │
│  │ 📧邮箱    │←──────→│ 📧邮箱    │  ← 消息队列│
│  │          │         │          │         │
│  │ 📋白板    │←──────→│ 📋白板    │  ← 共享内存│
│  │          │         │          │         │
│  │ 📢广播    │←──────→│ 📢广播    │  ← 信号   │
│  └──────────┘         └──────────┘         │
└─────────────────────────────────────────────┘
```

### 1. 管道（Pipe）

**工作原理：** 创建一对文件描述符，一个用于读，一个用于写。

```
匿名管道结构：

进程A                    管道                  进程B
[写端] ──────────→ [内核缓冲区] ──────────→ [读端]

特点：
- 单向通信（半双工）
- 只能用于有亲缘关系的进程（如父子进程）
- 数据按顺序读取，类似FIFO
- 缓冲区大小有限（通常64KB）
```

**使用流程：**
1. 父进程调用`pipe()`创建管道
2. 父进程`fork()`创建子进程
3. 子进程关闭写端，父进程关闭读端（或反之）
4. 通过读写文件描述符通信

### 2. 消息队列（Message Queue）

**工作原理：** 内核维护一个消息链表，进程可以发送和接收消息。

```
消息队列结构：

发送进程              消息队列                接收进程
   │              ┌─────────────┐              │
   ├─────────────→│ 消息1 (类型A)│              │
   │              │ 消息2 (类型B)│              │
   │              │ 消息3 (类型A)│←─────────────┤
   │              └─────────────┘              │
   
特点：
- 支持双向通信
- 消息有类型，可以按需接收
- 内核保证消息不丢失
- 适合结构化数据传输
```

### 3. 共享内存（Shared Memory）

**工作原理：** 多个进程将同一块物理内存映射到自己的地址空间。

```
共享内存结构：

进程A地址空间              物理内存              进程B地址空间
┌──────────┐           ┌──────────┐           ┌──────────┐
│          │           │          │           │          │
│ 私有数据  │           │ 共享区域  │←─────────→│ 共享视图  │
│          │           │          │           │          │
└──────────┘           └──────────┘           └──────────┘

特点：
- 最快的IPC方式（无需数据拷贝）
- 需要额外的同步机制（如信号量）
- 适合大量数据传输
- 编程复杂度较高
```

### 4. 信号（Signal）

**工作原理：** 向进程发送异步通知，进程可以注册信号处理函数。

```
信号传递过程：

发送方                 内核                  接收方
   │                   │                      │
   ├────kill(pid, SIGUSR1)───────────────────→│
   │                   │                      │
   │                   │               ┌──────┴──────┐
   │                   │               │ 信号处理函数  │
   │                   │               └─────────────┘

常见信号：
- SIGINT (2): Ctrl+C中断
- SIGKILL (9): 强制终止（不可捕获）
- SIGTERM (15): 优雅终止
- SIGUSR1/USR2: 用户自定义信号
```

---

## 典型应用场景

| IPC机制 | 适用场景 | 数据量 | 速度 | 复杂度 |
|---------|---------|--------|------|--------|
| 管道 | 父子进程简单通信 | 小 | 中 | 低 |
| 命名管道 | 无关进程通信 | 小 | 中 | 低 |
| 消息队列 | 结构化消息传递 | 中小 | 中 | 中 |
| 共享内存 | 大数据量高速传输 | 大 | 快 | 高 |
| 信号 | 事件通知 | 无 | 快 | 低 |
| 套接字 | 网络或跨主机通信 | 任意 | 慢 | 高 |

---

## 代码示例

### C++完整实现：管道和共享内存

```cpp
#include <iostream>
#include <cstring>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <signal.h>
#include <cstdlib>

// 演示匿名管道
void demonstrate_pipe() {
    std::cout << "\n=== 匿名管道演示 ===" << std::endl;
    
    int pipefd[2];
    pid_t pid;
    char buffer[256];
    
    // 创建管道
    if (pipe(pipefd) == -1) {
        std::cerr << "管道创建失败" << std::endl;
        exit(EXIT_FAILURE);
    }
    
    pid = fork();
    
    if (pid < 0) {
        std::cerr << "fork失败" << std::endl;
        exit(EXIT_FAILURE);
    }
    
    if (pid > 0) {
        // 父进程：写入数据
        close(pipefd[0]); // 关闭读端
        
        const char* message = "Hello from parent process!";
        write(pipefd[1], message, strlen(message) + 1);
        
        std::cout << "父进程发送: " << message << std::endl;
        
        close(pipefd[1]);
        wait(NULL); // 等待子进程
    } else {
        // 子进程：读取数据
        close(pipefd[1]); // 关闭写端
        
        ssize_t bytes = read(pipefd[0], buffer, sizeof(buffer));
        if (bytes > 0) {
            std::cout << "子进程接收: " << buffer << std::endl;
        }
        
        close(pipefd[0]);
        exit(EXIT_SUCCESS);
    }
}

// 演示共享内存
void demonstrate_shared_memory() {
    std::cout << "\n=== 共享内存演示 ===" << std::endl;
    
    key_t key = 1234;
    int shmid;
    char* shared_data;
    
    // 创建共享内存段
    shmid = shmget(key, 1024, IPC_CREAT | 0666);
    if (shmid == -1) {
        std::cerr << "共享内存创建失败" << std::endl;
        return;
    }
    
    pid_t pid = fork();
    
    if (pid > 0) {
        // 父进程：附加并写入
        shared_data = (char*)shmat(shmid, NULL, 0);
        if (shared_data == (char*)-1) {
            std::cerr << "shmat失败" << std::endl;
            return;
        }
        
        strcpy(shared_data, "Data from parent via shared memory");
        std::cout << "父进程写入共享内存: " << shared_data << std::endl;
        
        // 分离共享内存
        shmdt(shared_data);
        wait(NULL);
        
        // 删除共享内存
        shmctl(shmid, IPC_RMID, NULL);
    } else if (pid == 0) {
        // 子进程：附加并读取
        sleep(1); // 等待父进程写入
        
        shared_data = (char*)shmat(shmid, NULL, 0);
        if (shared_data == (char*)-1) {
            std::cerr << "shmat失败" << std::endl;
            exit(EXIT_FAILURE);
        }
        
        std::cout << "子进程读取共享内存: " << shared_data << std::endl;
        
        shmdt(shared_data);
        exit(EXIT_SUCCESS);
    }
}

// 演示信号
volatile sig_atomic_t signal_received = 0;

void signal_handler(int signum) {
    signal_received = 1;
    std::cout << "收到信号: " << signum << std::endl;
}

void demonstrate_signal() {
    std::cout << "\n=== 信号演示 ===" << std::endl;
    
    // 注册信号处理函数
    signal(SIGUSR1, signal_handler);
    
    pid_t pid = fork();
    
    if (pid > 0) {
        // 父进程：发送信号
        sleep(1);
        std::cout << "父进程发送SIGUSR1信号" << std::endl;
        kill(pid, SIGUSR1);
        wait(NULL);
    } else {
        // 子进程：等待信号
        std::cout << "子进程等待信号..." << std::endl;
        while (!signal_received) {
            pause(); // 暂停直到收到信号
        }
        std::cout << "子进程处理完信号" << std::endl;
        exit(EXIT_SUCCESS);
    }
}

int main() {
    std::cout << "进程间通信(IPC)演示程序" << std::endl;
    std::cout << "========================" << std::endl;
    
    demonstrate_pipe();
    demonstrate_shared_memory();
    demonstrate_signal();
    
    std::cout << "\n所有IPC演示完成" << std::endl;
    return 0;
}
```

编译命令：`g++ -std=c++17 03_ipc.cpp -o ipc_demo`

### Java完整实现：消息队列模拟

```java
import java.util.*;
import java.util.concurrent.*;

// 消息类
class Message {
    private int type;
    private String content;
    private long timestamp;
    
    public Message(int type, String content) {
        this.type = type;
        this.content = content;
        this.timestamp = System.currentTimeMillis();
    }
    
    public int getType() { return type; }
    public String getContent() { return content; }
    public long getTimestamp() { return timestamp; }
    
    @Override
    public String toString() {
        return String.format("消息[类型=%d, 内容='%s', 时间=%d]", 
                           type, content, timestamp);
    }
}

// 消息队列实现
class MessageQueue {
    private final BlockingQueue<Message> queue;
    private final int capacity;
    
    public MessageQueue(int capacity) {
        this.capacity = capacity;
        this.queue = new LinkedBlockingQueue<>(capacity);
    }
    
    // 发送消息
    public boolean send(Message msg) {
        try {
            return queue.offer(msg, 1, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }
    
    // 接收消息（阻塞）
    public Message receive() {
        try {
            return queue.take();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return null;
        }
    }
    
    // 按类型接收消息
    public Message receiveByType(int type) {
        while (true) {
            Message msg = receive();
            if (msg != null && msg.getType() == type) {
                return msg;
            }
            // 类型不匹配的消息暂时存储（简化处理）
        }
    }
    
    public int size() {
        return queue.size();
    }
}

// 生产者进程
class Producer implements Runnable {
    private final MessageQueue mq;
    private final String name;
    private final int messageCount;
    
    public Producer(MessageQueue mq, String name, int count) {
        this.mq = mq;
        this.name = name;
        this.messageCount = count;
    }
    
    @Override
    public void run() {
        System.out.println(name + " 开始生产消息");
        
        for (int i = 1; i <= messageCount; i++) {
            int type = (i % 3) + 1; // 循环使用3种类型
            Message msg = new Message(type, name + "-消息" + i);
            
            if (mq.send(msg)) {
                System.out.println(name + " 发送: " + msg);
            } else {
                System.out.println(name + " 发送失败（队列满）");
            }
            
            try {
                Thread.sleep(100); // 模拟生产间隔
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        
        System.out.println(name + " 生产完成");
    }
}

// 消费者进程
class Consumer implements Runnable {
    private final MessageQueue mq;
    private final String name;
    private final int messageType;
    
    public Consumer(MessageQueue mq, String name, int messageType) {
        this.mq = mq;
        this.name = name;
        this.messageType = messageType;
    }
    
    @Override
    public void run() {
        System.out.println(name + " 开始消费类型" + messageType + "的消息");
        
        int count = 0;
        while (count < 5) { // 最多消费5条消息
            Message msg = mq.receive();
            if (msg != null) {
                if (msg.getType() == messageType) {
                    System.out.println(name + " 接收: " + msg);
                    count++;
                } else {
                    System.out.println(name + " 跳过类型" + msg.getType() + "的消息");
                }
            }
        }
        
        System.out.println(name + " 消费完成");
    }
}

public class IPCDemo {
    public static void main(String[] args) {
        System.out.println("=== 消息队列IPC演示 ===\n");
        
        // 创建容量为10的消息队列
        MessageQueue mq = new MessageQueue(10);
        
        // 创建生产者和消费者
        Thread producer1 = new Thread(new Producer(mq, "生产者A", 8));
        Thread producer2 = new Thread(new Producer(mq, "生产者B", 8));
        Thread consumer1 = new Thread(new Consumer(mq, "消费者X", 1));
        Thread consumer2 = new Thread(new Consumer(mq, "消费者Y", 2));
        
        // 启动所有线程
        producer1.start();
        producer2.start();
        consumer1.start();
        consumer2.start();
        
        // 等待完成
        try {
            producer1.join();
            producer2.join();
            consumer1.join();
            consumer2.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("\n队列剩余消息数: " + mq.size());
        System.out.println("=== 演示结束 ===");
    }
}
```

编译命令：`javac IPCDemo.java && java IPCDemo`

---

## 复杂度或性能分析

| IPC机制 | 数据传输速度 | 设置开销 | 同步需求 | 最大数据量 |
|---------|------------|---------|---------|-----------|
| 管道 | 中等 | 低 | 自动（阻塞读写） | 受缓冲区限制 |
| 消息队列 | 中等 | 中 | 自动 | 受系统限制 |
| 共享内存 | 最快 | 高 | 需手动同步 | 仅受内存限制 |
| 信号 | 最快（仅通知） | 低 | 不需要 | 无数据 |
| 套接字 | 慢 | 高 | 需手动 | 无限制 |

**性能排序：** 共享内存 > 管道 ≈ 消息队列 > 套接字

---

## 常见误区与易错点

| 错误/现象 | 原因 | 解决方案 |
|----------|------|---------|
| 管道死锁 | 父子进程都未关闭不用的端 | 及时关闭不需要的文件描述符 |
| 共享内存数据竞争 | 未加锁导致并发写 | 配合信号量或互斥锁使用 |
| 消息丢失 | 队列满时发送失败 | 检查返回值，实现重试机制 |
| 僵尸进程 | 子进程退出父进程未wait | 正确处理子进程生命周期 |
| 信号丢失 | 信号在处理期间再次到达 | 使用sigaction设置可靠信号 |
| 缓冲区溢出 | 写入超过管道容量 | 分块写入或增大缓冲区 |

---

## 与其他知识点的关系

- **与同步机制的关系**：共享内存需要信号量等同步原语
- **与进程调度的关系**：阻塞式IPC会导致进程状态切换
- **与文件系统的关系**：命名管道在文件系统中可见
- **与网络编程的关系**：套接字既可用于IPC也可用于网络通信

---

## 自测题与参考答案

### 问题1：以下哪种IPC方式速度最快？
A. 管道  
B. 消息队列  
C. 共享内存  
D. 套接字

**答案：C**

**解析：** 共享内存是最快的IPC方式，因为数据不需要在内核和用户空间之间拷贝，多个进程直接访问同一块物理内存。但需要程序员手动处理同步问题。

### 问题2：管道的主要限制是什么？
A. 只能传输文本数据  
B. 只能用于有亲缘关系的进程  
C. 数据传输不可靠  
D. 不能双向通信

**答案：B**

**解析：** 匿名管道只能用于有亲缘关系的进程（如父子进程），因为文件描述符需要通过fork继承。如果需要无关进程通信，应使用命名管道（FIFO）。

### 问题3：为什么共享内存需要额外的同步机制？
A. 因为共享内存速度慢  
B. 因为多个进程可能同时读写造成数据竞争  
C. 因为共享内存容量有限  
D. 因为共享内存不安全

**答案：B**

**解析：** 共享内存允许多个进程直接访问同一块内存，如果没有同步机制，当多个进程同时写入时会导致数据竞争和不一致。通常配合信号量或互斥锁使用。

---

## 考点精讲

### 考点1：管道 vs 消息队列的选择

**核心要点：**
1. **管道**：简单、轻量，适合简单的父子进程通信
2. **消息队列**：支持消息类型、优先级，适合复杂的多进程通信
3. **选择原则**：简单通信用管道，结构化通信用消息队列

**面试常见问题：**
> Q: 什么情况下应该选择消息队列而不是管道？  
> A: 当需要以下特性时选择消息队列：
> - 消息有不同类型，需要选择性接收
> - 多个生产者/消费者场景
> - 需要消息持久化或优先级
> - 无关进程间通信

### 考点2：共享内存的同步问题

**核心要点：**
1. **问题本质**：共享内存本身不提供同步，需额外机制
2. **常用方案**：信号量、互斥锁、读写锁
3. **最佳实践**：定义清晰的访问协议，避免死锁

**面试常见问题：**
> Q: 如何安全地使用共享内存？  
> A: 
> 1. 使用信号量保护临界区
> 2. 采用生产者-消费者模式
> 3. 使用原子操作处理简单计数
> 4. 定义明确的数据结构和访问协议
> 5. 考虑使用内存屏障确保可见性

### 考点3：信号的可靠性问题

**核心要点：**
1. **不可靠信号**：早期UNIX信号可能丢失
2. **可靠信号**：POSIX sigaction提供可靠信号
3. **信号掩码**：可以临时阻塞某些信号

**面试常见问题：**
> Q: 为什么不应该在信号处理函数中调用printf？  
> A: printf不是异步信号安全的函数。如果信号在printf执行期间到达，可能导致死锁或未定义行为。应该使用write等异步信号安全的函数，或者只设置标志变量在主程序中处理。

---

## 术语速查

| 术语 | 英文 | 简要说明 |
|------|------|---------|
| 管道 | Pipe | 单向数据流 |
| 消息队列 | Message Queue | 内核维护的消息链表 |
| 共享内存 | Shared Memory | 多进程共享的物理内存 |
| 信号 | Signal | 异步通知机制 |
| 信号量 | Semaphore | 同步计数器 |
| 套接字 | Socket | 通信端点 |

---

## 参考资料与复核

1. [Linux IPC Tutorial](https://www.tutorialspoint.com/inter_process_communication/index.htm) - 详细教程
2. [POSIX IPC Documentation](https://pubs.opengroup.org/onlinepubs/7908799/xsh/ixc.html) - POSIX标准文档
3. [Beej's Guide to Unix IPC](https://beej.us/guide/bgipc/) - 实用指南

**复核日期建议：**
- 首次学习后1天：编写简单的管道通信程序
- 首次学习后7天：实现共享内存+信号量的完整示例
- 首次学习后30天：研究实际项目中的IPC应用

---

*本章完。下一章将深入探讨进程同步机制。*
