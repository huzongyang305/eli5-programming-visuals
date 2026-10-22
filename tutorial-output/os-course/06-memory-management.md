# 第六章：内存管理——酒店房间分配系统

## 本节知识框架

### 学习目标
- 理解连续内存分配的三种策略
- 掌握内部碎片和外部碎片的区别
- 了解分页机制的基本原理
- 能够计算不同分配策略的内存利用率

### 前置知识
- 进程的概念（第一章）
- 基本的地址概念
- 数组和链表数据结构

### 复习清单
- [ ] 能解释什么是虚拟地址
- [ ] 能说明首次适应和最佳适应的区别
- [ ] 能计算内存碎片率
- [ ] 能画出分页的地址转换过程

---

## 核心概念定义

| 术语 | 定义 | 类比 |
|------|------|------|
| **物理地址** | 内存条上的实际地址 | 酒店房间的实际房号 |
| **逻辑地址** | 程序看到的地址 | 客人手中的预订号 |
| **连续分配** | 为进程分配连续的内存空间 | 给团队分配相邻房间 |
| **碎片 (Fragmentation)** | 无法利用的小块空闲内存 | 分散的空房间无法接待大团队 |
| **内部碎片** | 分配块内未使用的空间 | 两人住双人间，另一张床空着 |
| **外部碎片** | 分散的小块空闲空间 | 多个单人间空着但没双人间 |
| **分区 (Partition)** | 内存划分的区域 | 酒店的不同楼层 |
| **基址寄存器** | 记录进程起始地址 | 楼层起始房号 |
| **界限寄存器** | 记录进程大小 | 房间数量限制 |
| **紧凑 (Compaction)** | 移动进程合并空闲空间 | 让客人换房集中空房间 |

---

## 原理与运行机制

### 生活中的类比：酒店房间分配

```
酒店场景：

┌─────────────────────────────────────┐
│        酒店内存大楼                   │
│                                     │
│  1楼：[已住][已住][空闲][已住][空闲]  │
│       A    B     _    C     _       │
│                                     │
│  问题：来了一个需要2间房的团队         │
│  - 有两个单间空着，但不相邻           │
│  - 这就是外部碎片！                  │
│                                     │
│  解决方案：                           │
│  1. 紧凑：让C换到第二个位置           │
│  2. 分页：不要求连续房间              │
└─────────────────────────────────────┘
```

### 连续分配策略

#### 1. 单一连续分配

```
整个内存只分给一个进程（早期系统）

┌──────────────────────┐
│     操作系统          │
├──────────────────────┤
│                      │
│     用户进程         │
│   （独占剩余内存）    │
│                      │
└──────────────────────┘

优点：简单
缺点：一次只能运行一个程序
```

#### 2. 固定分区分配

```
将内存划分为固定大小的分区

┌──────────────────────┐
│     OS (100MB)       │
├──────────────────────┤
│  分区1 (200MB)       │ ← 进程A (150MB) → 内部碎片50MB
├──────────────────────┤
│  分区2 (300MB)       │ ← 进程B (280MB) → 内部碎片20MB
├──────────────────────┤
│  分区3 (150MB)       │ ← 空闲
├──────────────────────┤
│  分区4 (250MB)       │ ← 进程C (200MB) → 内部碎片50MB
└──────────────────────┘

优点：实现简单，无外部碎片
缺点：内部碎片严重，分区大小难以确定
```

#### 3. 动态分区分配

```
根据进程需求动态划分内存

初始状态：
┌──────────────────────┐
│     OS               │
├──────────────────────┤
│   空闲 (900MB)       │
└──────────────────────┘

进程A请求200MB：
┌──────────────────────┐
│     OS               │
├──────────────────────┤
│   A (200MB)          │
├──────────────────────┤
│   空闲 (700MB)       │
└──────────────────────┘

进程B请求300MB：
┌──────────────────────┐
│     OS               │
├──────────────────────┤
│   A (200MB)          │
├──────────────────────┤
│   B (300MB)          │
├──────────────────────┤
│   空闲 (400MB)       │
└──────────────────────┘

进程A结束：
┌──────────────────────┐
│     OS               │
├──────────────────────┤
│   空闲 (200MB)       │ ← 外部碎片
├──────────────────────┤
│   B (300MB)          │
├──────────────────────┤
│   空闲 (400MB)       │
└──────────────────────┘
```

### 动态分区的选择算法

```
空闲链表：[200MB] → [400MB] → [150MB] → [300MB]

新进程请求250MB：

1. 首次适应 (First Fit)
   - 从头查找，找到第一个够大的
   - 选择 [400MB]，剩余150MB
   
2. 最佳适应 (Best Fit)
   - 找最接近需求的
   - 选择 [300MB]，剩余50MB
   
3. 最差适应 (Worst Fit)
   - 找最大的块
   - 选择 [400MB]，剩余150MB

性能对比：
- 首次适应：速度快，中等碎片
- 最佳适应：碎片最小，速度慢
- 最差适应：产生大碎片，很少使用
```

### 分页机制基础

```
传统连续分配的问题：
- 外部碎片
- 需要紧凑操作
- 进程大小受限

分页解决方案：
- 将内存分成固定大小的"页框"
- 将进程分成同样大小的"页"
- 页可以放在任意页框中

┌─────────────────────────────┐
│      进程的页               │      物理内存的页框
│                             │
│  页0 ──────────────────→   页框5
│  页1 ──────────────────→   页框2
│  页2 ──────────────────→   页框8
│  页3 ──────────────────→   页框1
└─────────────────────────────┘

优点：无外部碎片，无需紧凑
缺点：可能有内部碎片（最后一页）
```

---

## 典型应用场景

| 分配策略 | 适用场景 | 优点 | 缺点 |
|---------|---------|------|------|
| 固定分区 | 嵌入式系统 | 简单快速 | 内部碎片 |
| 首次适应 | 通用系统 | 速度快 | 前端碎片多 |
| 最佳适应 | 内存紧张系统 | 碎片少 | 搜索慢 |
| 分页 | 现代OS | 无外部碎片 | 需要硬件支持 |
| 分段+分页 | 复杂应用 | 灵活高效 | 实现复杂 |

---

## 代码示例

### C++完整实现：动态分区分配模拟器

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

struct MemoryBlock {
    int start_address;
    int size;
    bool is_free;
    std::string process_name;
    
    MemoryBlock(int start, int size, bool free = true, const std::string& name = "")
        : start_address(start), size(size), is_free(free), process_name(name) {}
};

class MemoryManager {
private:
    std::vector<MemoryBlock> blocks;
    int total_memory;
    
public:
    MemoryManager(int size) : total_memory(size) {
        // 初始化：整个内存都是空闲的
        blocks.emplace_back(0, size, true, "");
    }
    
    // 首次适应算法
    bool firstFit(const std::string& process_name, int size) {
        for (auto& block : blocks) {
            if (block.is_free && block.size >= size) {
                allocateBlock(block, process_name, size);
                std::cout << "首次适应：为 " << process_name 
                          << " 分配 " << size << "KB" << std::endl;
                return true;
            }
        }
        std::cout << "首次适应：无法满足 " << process_name 
                  << " 的请求 (" << size << "KB)" << std::endl;
        return false;
    }
    
    // 最佳适应算法
    bool bestFit(const std::string& process_name, int size) {
        int best_idx = -1;
        int min_waste = INT_MAX;
        
        for (int i = 0; i < blocks.size(); i++) {
            if (blocks[i].is_free && blocks[i].size >= size) {
                int waste = blocks[i].size - size;
                if (waste < min_waste) {
                    min_waste = waste;
                    best_idx = i;
                }
            }
        }
        
        if (best_idx != -1) {
            allocateBlock(blocks[best_idx], process_name, size);
            std::cout << "最佳适应：为 " << process_name 
                      << " 分配 " << size << "KB" << std::endl;
            return true;
        }
        
        std::cout << "最佳适应：无法满足 " << process_name 
                  << " 的请求 (" << size << "KB)" << std::endl;
        return false;
    }
    
    // 最差适应算法
    bool worstFit(const std::string& process_name, int size) {
        int worst_idx = -1;
        int max_size = 0;
        
        for (int i = 0; i < blocks.size(); i++) {
            if (blocks[i].is_free && blocks[i].size > max_size) {
                max_size = blocks[i].size;
                worst_idx = i;
            }
        }
        
        if (worst_idx != -1 && blocks[worst_idx].size >= size) {
            allocateBlock(blocks[worst_idx], process_name, size);
            std::cout << "最差适应：为 " << process_name 
                      << " 分配 " << size << "KB" << std::endl;
            return true;
        }
        
        std::cout << "最差适应：无法满足 " << process_name 
                  << " 的请求 (" << size << "KB)" << std::endl;
        return false;
    }
    
    // 释放进程占用的内存
    void deallocate(const std::string& process_name) {
        for (auto& block : blocks) {
            if (!block.is_free && block.process_name == process_name) {
                block.is_free = true;
                block.process_name = "";
                std::cout << "释放进程 " << process_name << " 的内存" << std::endl;
                mergeFreeBlocks();
                return;
            }
        }
        std::cout << "未找到进程 " << process_name << std::endl;
    }
    
    // 显示内存状态
    void displayMemory() {
        std::cout << "\n=== 内存状态 ===" << std::endl;
        std::cout << "总内存: " << total_memory << "KB" << std::endl;
        
        int used = 0, free = 0, internal_frag = 0;
        
        for (const auto& block : blocks) {
            std::cout << "[" << block.start_address << "-" 
                      << (block.start_address + block.size - 1) << "] ";
            
            if (block.is_free) {
                std::cout << "空闲 (" << block.size << "KB)";
                free += block.size;
            } else {
                std::cout << block.process_name << " (" << block.size << "KB)";
                used += block.size;
            }
            std::cout << std::endl;
        }
        
        // 计算碎片
        int frag_count = 0;
        for (const auto& block : blocks) {
            if (block.is_free) frag_count++;
        }
        
        double fragmentation_rate = (frag_count > 1) ? 
            ((double)(frag_count - 1) / blocks.size() * 100) : 0;
        
        std::cout << "\n已用: " << used << "KB, 空闲: " << free << "KB" << std::endl;
        std::cout << "空闲块数: " << frag_count << std::endl;
        std::cout << "碎片率: " << fragmentation_rate << "%" << std::endl;
    }
    
private:
    void allocateBlock(MemoryBlock& block, const std::string& name, int size) {
        if (block.size == size) {
            // 精确匹配
            block.is_free = false;
            block.process_name = name;
        } else {
            // 分割块
            int remaining = block.size - size;
            int start = block.start_address;
            
            block.size = size;
            block.is_free = false;
            block.process_name = name;
            
            // 在后面插入剩余的空闲块
            auto it = std::find_if(blocks.begin(), blocks.end(),
                [&block](const MemoryBlock& b) {
                    return &b == &block;
                });
            blocks.insert(std::next(it), MemoryBlock(start + size, remaining, true, ""));
        }
    }
    
    void mergeFreeBlocks() {
        for (auto it = blocks.begin(); it != blocks.end(); ) {
            if (it->is_free && std::next(it) != blocks.end() && 
                std::next(it)->is_free) {
                // 合并相邻的空闲块
                it->size += std::next(it)->size;
                it = blocks.erase(std::next(it));
            } else {
                ++it;
            }
        }
    }
};

// 演示分页机制
class PagingDemo {
private:
    int page_size;
    int num_pages;
    
public:
    PagingDemo(int page_sz, int pages) 
        : page_size(page_sz), num_pages(pages) {}
    
    void demonstrateAddressTranslation() {
        std::cout << "\n=== 分页地址转换演示 ===" << std::endl;
        std::cout << "页大小: " << page_size << "字节" << std::endl;
        std::cout << "页数: " << num_pages << std::endl;
        
        // 模拟页表
        std::vector<int> page_table = {5, 2, 8, 1, 6, 3, 7, 4};
        
        std::cout << "\n页表:" << std::endl;
        for (int i = 0; i < page_table.size(); i++) {
            std::cout << "页" << i << " → 页框" << page_table[i] << std::endl;
        }
        
        // 地址转换示例
        int logical_address = 3500;
        int page_number = logical_address / page_size;
        int offset = logical_address % page_size;
        
        if (page_number < page_table.size()) {
            int frame_number = page_table[page_number];
            int physical_address = frame_number * page_size + offset;
            
            std::cout << "\n地址转换示例:" << std::endl;
            std::cout << "逻辑地址: " << logical_address << std::endl;
            std::cout << "页号: " << page_number << std::endl;
            std::cout << "页内偏移: " << offset << std::endl;
            std::cout << "页框号: " << frame_number << std::endl;
            std::cout << "物理地址: " << physical_address << std::endl;
        }
    }
    
    void calculateInternalFragmentation() {
        std::cout << "\n=== 内部碎片计算 ===" << std::endl;
        
        int process_sizes[] = {1025, 2050, 3075, 4100};
        int total_internal_frag = 0;
        
        for (int size : process_sizes) {
            int pages_needed = (size + page_size - 1) / page_size;
            int allocated = pages_needed * page_size;
            int internal_frag = allocated - size;
            total_internal_frag += internal_frag;
            
            std::cout << "进程大小: " << size << "字节" << std::endl;
            std::cout << "  需要页数: " << pages_needed << std::endl;
            std::cout << "  分配空间: " << allocated << "字节" << std::endl;
            std::cout << "  内部碎片: " << internal_frag << "字节" << std::endl;
        }
        
        std::cout << "\n总内部碎片: " << total_internal_frag << "字节" << std::endl;
    }
};

int main() {
    std::cout << "内存管理演示" << std::endl;
    std::cout << "==============" << std::endl;
    
    // 创建1000KB的内存
    MemoryManager mm(1000);
    
    std::cout << "\n--- 首次适应算法 ---" << std::endl;
    mm.firstFit("进程A", 200);
    mm.firstFit("进程B", 300);
    mm.firstFit("进程C", 150);
    mm.displayMemory();
    
    mm.deallocate("进程B");
    mm.displayMemory();
    
    mm.firstFit("进程D", 250);
    mm.displayMemory();
    
    std::cout << "\n--- 最佳适应算法 ---" << std::endl;
    MemoryManager mm2(1000);
    mm2.bestFit("进程A", 200);
    mm2.bestFit("进程B", 300);
    mm2.bestFit("进程C", 150);
    mm2.deallocate("进程B");
    mm2.bestFit("进程D", 250);
    mm2.displayMemory();
    
    // 分页演示
    PagingDemo paging(1024, 8);
    paging.demonstrateAddressTranslation();
    paging.calculateInternalFragmentation();
    
    return 0;
}
```

编译命令：`g++ -std=c++17 06_memory_management.cpp -o memory_demo`

### Java完整实现：内存分配策略比较

```java
import java.util.*;

class MemoryBlock {
    int startAddress;
    int size;
    boolean isFree;
    String processName;
    
    public MemoryBlock(int start, int size, boolean isFree, String name) {
        this.startAddress = start;
        this.size = size;
        this.isFree = isFree;
        this.processName = name;
    }
}

class MemoryAllocator {
    private List<MemoryBlock> blocks;
    private int totalMemory;
    private String strategy;
    
    public MemoryAllocator(int totalMemory, String strategy) {
        this.totalMemory = totalMemory;
        this.strategy = strategy;
        this.blocks = new ArrayList<>();
        this.blocks.add(new MemoryBlock(0, totalMemory, true, ""));
    }
    
    public boolean allocate(String processName, int size) {
        switch (strategy.toLowerCase()) {
            case "first":
                return firstFit(processName, size);
            case "best":
                return bestFit(processName, size);
            case "worst":
                return worstFit(processName, size);
            default:
                return false;
        }
    }
    
    private boolean firstFit(String processName, int size) {
        for (MemoryBlock block : blocks) {
            if (block.isFree && block.size >= size) {
                allocateBlock(block, processName, size);
                System.out.println("首次适应: 为 " + processName + " 分配 " + size + "KB");
                return true;
            }
        }
        System.out.println("首次适应: 无法满足 " + processName + " (" + size + "KB)");
        return false;
    }
    
    private boolean bestFit(String processName, int size) {
        int bestIdx = -1;
        int minWaste = Integer.MAX_VALUE;
        
        for (int i = 0; i < blocks.size(); i++) {
            MemoryBlock block = blocks.get(i);
            if (block.isFree && block.size >= size) {
                int waste = block.size - size;
                if (waste < minWaste) {
                    minWaste = waste;
                    bestIdx = i;
                }
            }
        }
        
        if (bestIdx != -1) {
            allocateBlock(blocks.get(bestIdx), processName, size);
            System.out.println("最佳适应: 为 " + processName + " 分配 " + size + "KB");
            return true;
        }
        
        System.out.println("最佳适应: 无法满足 " + processName + " (" + size + "KB)");
        return false;
    }
    
    private boolean worstFit(String processName, int size) {
        int worstIdx = -1;
        int maxSize = 0;
        
        for (int i = 0; i < blocks.size(); i++) {
            MemoryBlock block = blocks.get(i);
            if (block.isFree && block.size > maxSize) {
                maxSize = block.size;
                worstIdx = i;
            }
        }
        
        if (worstIdx != -1 && blocks.get(worstIdx).size >= size) {
            allocateBlock(blocks.get(worstIdx), processName, size);
            System.out.println("最差适应: 为 " + processName + " 分配 " + size + "KB");
            return true;
        }
        
        System.out.println("最差适应: 无法满足 " + processName + " (" + size + "KB)");
        return false;
    }
    
    private void allocateBlock(MemoryBlock block, String name, int size) {
        if (block.size == size) {
            block.isFree = false;
            block.processName = name;
        } else {
            int remaining = block.size - size;
            int start = block.startAddress;
            
            block.size = size;
            block.isFree = false;
            block.processName = name;
            
            int idx = blocks.indexOf(block);
            blocks.add(idx + 1, new MemoryBlock(start + size, remaining, true, ""));
        }
    }
    
    public void deallocate(String processName) {
        for (MemoryBlock block : blocks) {
            if (!block.isFree && block.processName.equals(processName)) {
                block.isFree = true;
                block.processName = "";
                System.out.println("释放进程 " + processName + " 的内存");
                mergeFreeBlocks();
                return;
            }
        }
    }
    
    private void mergeFreeBlocks() {
        Iterator<MemoryBlock> it = blocks.iterator();
        MemoryBlock prev = null;
        
        while (it.hasNext()) {
            MemoryBlock current = it.next();
            if (prev != null && prev.isFree && current.isFree) {
                prev.size += current.size;
                it.remove();
            } else {
                prev = current;
            }
        }
    }
    
    public void displayMemory() {
        System.out.println("\n=== 内存状态 (" + strategy + ") ===");
        int used = 0, free = 0;
        
        for (MemoryBlock block : blocks) {
            String status = block.isFree ? "空闲" : block.processName;
            System.out.printf("[%d-%d] %s (%dKB)%n", 
                block.startAddress, 
                block.startAddress + block.size - 1,
                status, block.size);
            
            if (block.isFree) free += block.size;
            else used += block.size;
        }
        
        System.out.printf("已用: %dKB, 空闲: %dKB%n", used, free);
    }
    
    public double getFragmentationRate() {
        int freeBlocks = 0;
        for (MemoryBlock block : blocks) {
            if (block.isFree) freeBlocks++;
        }
        return freeBlocks > 1 ? (double)(freeBlocks - 1) / blocks.size() * 100 : 0;
    }
}

public class MemoryManagementDemo {
    
    public static void compareStrategies() {
        System.out.println("=== 内存分配策略比较 ===\n");
        
        String[] strategies = {"first", "best", "worst"};
        String[] names = {"首次适应", "最佳适应", "最差适应"};
        
        for (int i = 0; i < strategies.length; i++) {
            System.out.println("--- " + names[i] + " ---");
            MemoryAllocator allocator = new MemoryAllocator(1000, strategies[i]);
            
            allocator.allocate("A", 200);
            allocator.allocate("B", 300);
            allocator.allocate("C", 150);
            allocator.deallocate("B");
            allocator.allocate("D", 250);
            
            allocator.displayMemory();
            System.out.printf("碎片率: %.2f%%%n%n", allocator.getFragmentationRate());
        }
    }
    
    public static void demonstratePaging() {
        System.out.println("\n=== 分页机制演示 ===");
        
        int pageSize = 1024; // 1KB
        int[] pageTable = {5, 2, 8, 1, 6, 3, 7, 4};
        
        System.out.println("页大小: " + pageSize + "字节");
        System.out.println("\n页表:");
        for (int i = 0; i < pageTable.length; i++) {
            System.out.printf("页%d → 页框%d%n", i, pageTable[i]);
        }
        
        // 地址转换
        int logicalAddress = 3500;
        int pageNumber = logicalAddress / pageSize;
        int offset = logicalAddress % pageSize;
        
        if (pageNumber < pageTable.length) {
            int frameNumber = pageTable[pageNumber];
            int physicalAddress = frameNumber * pageSize + offset;
            
            System.out.println("\n地址转换示例:");
            System.out.println("逻辑地址: " + logicalAddress);
            System.out.println("页号: " + pageNumber);
            System.out.println("页内偏移: " + offset);
            System.out.println("页框号: " + frameNumber);
            System.out.println("物理地址: " + physicalAddress);
        }
    }
    
    public static void main(String[] args) {
        System.out.println("内存管理机制演示");
        System.out.println("==================");
        
        compareStrategies();
        demonstratePaging();
        
        System.out.println("\n所有演示完成");
    }
}
```

编译命令：`javac MemoryManagementDemo.java && java MemoryManagementDemo`

---

## 复杂度或性能分析

| 策略 | 分配时间 | 回收时间 | 碎片程度 | 实现难度 |
|------|---------|---------|---------|---------|
| 首次适应 | O(n) | O(1) | 中等 | 简单 |
| 最佳适应 | O(n) | O(1) | 最小 | 中等 |
| 最差适应 | O(n) | O(1) | 最大 | 简单 |
| 分页 | O(1) | O(1) | 无外部碎片 | 复杂 |

---

## 常见误区与易错点

| 错误/现象 | 原因 | 解决方案 |
|----------|------|---------|
| 混淆内外碎片 | 概念不清 | 内部：块内浪费；外部：块间分散 |
| 认为最佳适应总是最好 | 忽略搜索开销 | 根据场景选择 |
| 忘记合并空闲块 | 导致碎片增加 | 回收时立即合并 |
| 页大小设置不当 | 过小增加页表，过大增加内部碎片 | 通常4KB-64KB |
| 地址计算错误 | 混淆页号和偏移 | 页号=地址/页大小，偏移=地址%页大小 |
| 忽视TLB的作用 | 频繁查页表影响性能 | 利用局部性原理 |

---

## 与其他知识点的关系

- **与虚拟内存的关系**：分页是虚拟内存的基础（第七章）
- **与缓存的关系**：TLB加速地址转换
- **与文件系统的关系**：文件也采用类似分页的管理
- **与性能优化的关系**：内存布局影响缓存命中率

---

## 自测题与参考答案

### 问题1：以下哪种情况会产生外部碎片？
A. 固定分区分配  
B. 分页机制  
C. 动态分区分配  
D. 段页式存储

**答案：C**

**解析：** 动态分区分配中，进程释放内存后会在内存中留下大小不一的空闲块，这些分散的空闲块就是外部碎片。固定分区有内部碎片但无外部碎片，分页机制消除了外部碎片。

### 问题2：最佳适应算法的主要缺点是什么？
A. 分配速度慢  
B. 产生大量小碎片  
C. 实现复杂  
D. 内存利用率低

**答案：B**

**解析：** 最佳适应算法总是选择最接近请求大小的空闲块，这会导致剩下很多很小的、难以利用的碎片。虽然它看起来最"节约"，但实际上可能产生最多的不可用碎片。

### 问题3：分页机制中，逻辑地址3500（页大小1024）对应的页号和偏移是多少？
A. 页号3，偏移428  
B. 页号4，偏移404  
C. 页号3，偏移3500  
D. 页号4，偏移3500

**答案：A**

**解析：** 页号 = 3500 / 1024 = 3（整除），偏移 = 3500 % 1024 = 428。所以逻辑地址3500对应第3页的第428个字节。

---

## 考点精讲

### 考点1：三种动态分区算法的比较

**核心要点：**
1. **首次适应**：从头找第一个够大的，速度快但前端碎片多
2. **最佳适应**：找最合适的，碎片少但搜索慢且产生小碎片
3. **最差适应**：找最大的，减少小碎片但浪费大空间

**面试常见问题：**
> Q: 实际系统中常用哪种分配算法？为什么？  
> A: 现代系统多采用伙伴系统或slab分配器，而不是简单的首次/最佳/最差适应。但在理论层面，首次适应因实现简单、速度较快而较常用。最佳适应虽然碎片少，但维护有序链表的开销大。

### 考点2：内部碎片vs外部碎片

**核心要点：**
1. **内部碎片**：分配给进程但未使用的空间（如固定分区、分页的最后一页）
2. **外部碎片**：分散的小块空闲空间总和足够但无法满足大请求
3. **解决方法**：内部碎片难以避免，外部碎片可通过紧凑或分页解决

**面试常见问题：**
> Q: 分页如何消除外部碎片？还有内部碎片吗？  
> A: 分页将内存分成固定大小的页框，进程的页可以放在任意页框中，不需要连续空间，因此消除了外部碎片。但最后一页可能未完全利用，仍存在内部碎片，不过通常很小（平均半个页大小）。

### 考点3：地址转换机制

**核心要点：**
1. **逻辑地址** = 页号 + 页内偏移
2. **物理地址** = 页框号 × 页大小 + 页内偏移
3. **页表**：建立页号到页框号的映射

**面试常见问题：**
> Q: 如果页大小为4KB，逻辑地址为0x12345，请计算页号和偏移。  
> A: 4KB = 4096 = 2^12，所以低12位是偏移，高位是页号。
> 0x12345 = 0001 0010 0011 0100 0101
> 页号 = 0x12 = 18
> 偏移 = 0x345 = 837

---

## 术语速查

| 术语 | 英文 | 简要说明 |
|------|------|---------|
| 物理地址 | Physical Address | 实际内存地址 |
| 逻辑地址 | Logical Address | 程序看到的地址 |
| 内部碎片 | Internal Fragmentation | 块内未用空间 |
| 外部碎片 | External Fragmentation | 分散的空闲块 |
| 页表 | Page Table | 页号到页框的映射 |
| 页框 | Page Frame | 物理内存的固定块 |

---

## 参考资料与复核

1. [Memory Management Tutorial](https://www.geeksforgeeks.org/operating-systems-memory-management/) - 详细教程
2. [Virtual Memory Concepts](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf) - OSTEP教材
3. [Linux Memory Management](https://www.kernel.org/doc/html/latest/admin-guide/mm/index.html) - Linux文档

**复核日期建议：**
- 首次学习后1天：手动计算地址转换
- 首次学习后7天：实现内存分配模拟器
- 首次学习后30天：研究Linux内存管理源码

---

*本章完。下一章将深入探讨虚拟内存机制。*
