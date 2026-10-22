# 第七章：虚拟内存——图书馆借书系统

## 本节知识框架

### 学习目标
- 理解虚拟内存的核心思想
- 掌握页表、TLB的工作原理
- 了解按需分页的机制
- 能够计算有效访问时间和缺页率

### 前置知识
- 分页机制（第六章）
- 缓存的基本概念
- 概率和期望值计算

### 复习清单
- [ ] 能解释什么是虚拟地址空间
- [ ] 能说明TLB的作用
- [ ] 能描述缺页中断的处理过程
- [ ] 能计算两级页表的节省空间

---

## 核心概念定义

| 术语 | 定义 | 类比 |
|------|------|------|
| **虚拟内存** | 让程序以为拥有连续大内存的技术 | 图书馆的藏书目录 |
| **页表 (Page Table)** | 虚拟页到物理页框的映射表 | 图书索引卡片 |
| **TLB** | 快表，缓存最近使用的页表项 | 常用书的便签 |
| **缺页中断 (Page Fault)** | 访问的页不在内存中 | 想借的书不在架上 |
| **按需分页** | 只在需要时才加载页面 | 有人借才从仓库取书 |
| **页面置换** | 用新页替换旧页 | 书架满了要下架旧书 |
| **工作集** | 进程近期访问的页面集合 | 读者常看的几本书 |
| **抖动 (Thrashing)** | 频繁缺页导致性能急剧下降 | 不断取书还书却看不进 |
| **脏位 (Dirty Bit)** | 标记页面是否被修改 | 书上是否有笔记 |
| **有效访问时间** | 考虑TLB命中率的平均访问时间 | 平均找书时间 |

---

## 原理与运行机制

### 生活中的类比：图书馆系统

```
大型图书馆运作：

┌─────────────────────────────────────┐
│        图书馆                        │
│                                     │
│  阅览室（物理内存）                   │
│  - 只能放1000本书                    │
│  - 快速取阅                          │
│                                     │
│  书库（磁盘/交换区）                  │
│  - 可以存10万本书                    │
│  - 取书较慢                          │
│                                     │
│  目录系统（页表）                     │
│  - 记录每本书的位置                  │
│  - 快速查找                          │
│                                     │
│  常用书单（TLB）                      │
│  - 记录最常借的50本书                │
│  - 秒级查找                          │
└─────────────────────────────────────┘

借书流程：
1. 查常用书单（TLB查找）→ 找到直接取
2. 没找到，查目录（页表查找）→ 定位位置
3. 书在阅览室 → 直接取
4. 书在书库 → 从书库取出（缺页中断）
5. 阅览室满了 → 下架一本不常用的书（页面置换）
```

### 虚拟内存架构

```
传统方式 vs 虚拟内存：

传统（连续分配）：
┌──────────────────────┐
│  进程A (完整加载)     │ ← 必须全部在内存
│  进程B (完整加载)     │
│  进程C (无法加载!)    │ ← 内存不够
└──────────────────────┘

虚拟内存：
┌──────────────────────┐
│  进程A的部分页面      │ ← 只加载需要的
│  进程B的部分页面      │
│  进程C的部分页面      │ ← 也能运行！
└──────────────────────┘
     ↓
┌──────────────────────┐
│  交换区（磁盘）        │ ← 其他页面在这里
└──────────────────────┘
```

### 页表结构

```
单级页表：

虚拟地址 (32位)
┌────────┬─────────┐
│ 页号20 │ 偏移12位 │
└───┬────┴─────────┘
    │
    ↓ 查页表
┌─────────────────┐
│ 页表[20] = 页框5 │
└─────────────────┘
    ↓
物理地址 = 页框5 × 4KB + 偏移

问题：32位地址空间需要2^20 = 1M个页表项
每个页表项4字节 → 页表大小 = 4MB（太大！）

解决方案：多级页表
```

### 两级页表

```
两级页表结构：

虚拟地址 (32位)
┌─────┬──────┬─────────┐
│目录10│页表10│ 偏移12位 │
└──┬──┴──┬───┴─────────┘
   │     │
   │     └→ 二级页表[页表号] = 页框号
   └→ 页目录[目录号] = 二级页表地址

优势：
- 稀疏使用时只需分配用到的二级页表
- 典型程序可能只占用10%的地址空间
- 节省大量内存
```

### TLB（快表）

```
TLB工作原理：

┌─────────────────────────────┐
│         CPU                 │
│                             │
│  ┌─────────────────────┐   │
│  │      TLB (16-64项)  │   │ ← 高速缓存
│  │  - 页号: 页框号     │   │
│  │  - 有效位           │   │
│  └─────────────────────┘   │
│          │                  │
│    未命中 │                  │
│          ↓                  │
│  ┌─────────────────────┐   │
│  │      页表 (内存中)   │   │ ← 慢速查找
│  └─────────────────────┘   │
└─────────────────────────────┘

TLB命中率通常 > 98%
有效访问时间 ≈ TLB命中时间 × 命中率 + 页表访问时间 × (1-命中率)
```

### 缺页中断处理

```
缺页中断流程：

CPU访问虚拟地址
    ↓
查TLB → 未命中
    ↓
查页表 → 有效位=0（页不在内存）
    ↓
触发缺页中断
    ↓
操作系统介入：
1. 检查访问合法性
2. 在磁盘上找到该页
3. 寻找空闲页框（可能需要置换）
4. 从磁盘读入页框
5. 更新页表（设置有效位和页框号）
6. 如果是写操作，设置脏位
7. 重新启动指令
    ↓
CPU重新访问 → 这次TLB/页表命中
    ↓
正常执行

耗时：缺页处理约10ms，正常访问约100ns（差10万倍！）
```

---

## 典型应用场景

| 特性 | 应用场景 | 好处 |
|------|---------|------|
| 虚拟内存 | 运行大程序 | 不受物理内存限制 |
| 按需分页 | 快速启动程序 | 只加载必要代码 |
| 内存共享 | 动态库 | 多个进程共享同一份代码 |
| 写时复制 | fork() | 子进程不立即复制内存 |
| 内存映射文件 | 大文件处理 | 像访问内存一样访问文件 |

---

## 代码示例

### C++完整实现：TLB和页表模拟

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <random>
#include <iomanip>

// TLB条目
struct TLBEntry {
    int page_number;
    int frame_number;
    bool valid;
    
    TLBEntry() : page_number(-1), frame_number(-1), valid(false) {}
};

// 页表条目
struct PageTableEntry {
    int frame_number;
    bool valid;
    bool dirty;
    bool referenced;
    
    PageTableEntry() : frame_number(-1), valid(false), 
                       dirty(false), referenced(false) {}
};

class VirtualMemorySystem {
private:
    const int PAGE_SIZE = 4096; // 4KB
    const int TLB_SIZE = 16;
    const int PHYSICAL_FRAMES = 256;
    
    std::vector<TLBEntry> tlb;
    std::vector<PageTableEntry> page_table;
    std::vector<bool> frame_usage; // 页框使用情况
    
    // 统计信息
    int tlb_hits;
    int tlb_misses;
    int page_faults;
    int total_accesses;
    
public:
    VirtualMemorySystem(int virtual_pages) 
        : tlb(TLB_SIZE), page_table(virtual_pages),
          frame_usage(PHYSICAL_FRAMES, false),
          tlb_hits(0), tlb_misses(0), 
          page_faults(0), total_accesses(0) {
        
        // 初始化：加载前64页到内存
        for (int i = 0; i < 64 && i < virtual_pages; i++) {
            page_table[i].valid = true;
            page_table[i].frame_number = i;
            frame_usage[i] = true;
        }
    }
    
    // 访问虚拟地址
    int accessVirtualAddress(int virtual_address) {
        total_accesses++;
        
        int page_number = virtual_address / PAGE_SIZE;
        int offset = virtual_address % PAGE_SIZE;
        
        if (page_number >= page_table.size()) {
            std::cout << "错误：虚拟地址越界" << std::endl;
            return -1;
        }
        
        // 1. 查TLB
        int frame = lookupTLB(page_number);
        
        if (frame != -1) {
            // TLB命中
            tlb_hits++;
            std::cout << "TLB命中: 页" << page_number 
                      << " → 页框" << frame << std::endl;
        } else {
            // TLB未命中
            tlb_misses++;
            
            // 2. 查页表
            if (page_table[page_number].valid) {
                // 页在内存中
                frame = page_table[page_number].frame_number;
                page_table[page_number].referenced = true;
                
                std::cout << "TLB未命中，页表命中: 页" << page_number 
                          << " → 页框" << frame << std::endl;
                
                // 更新TLB
                updateTLB(page_number, frame);
            } else {
                // 3. 缺页中断
                page_faults++;
                std::cout << "缺页中断: 页" << page_number << std::endl;
                
                // 处理缺页
                frame = handlePageFault(page_number);
                
                // 更新TLB
                updateTLB(page_number, frame);
            }
        }
        
        // 计算物理地址
        int physical_address = frame * PAGE_SIZE + offset;
        std::cout << "物理地址: " << physical_address << std::endl;
        
        return physical_address;
    }
    
    // 显示统计信息
    void displayStats() {
        std::cout << "\n=== 虚拟内存统计 ===" << std::endl;
        std::cout << "总访问次数: " << total_accesses << std::endl;
        std::cout << "TLB命中: " << tlb_hits << std::endl;
        std::cout << "TLB未命中: " << tlb_misses << std::endl;
        std::cout << "缺页中断: " << page_faults << std::endl;
        
        double tlb_hit_rate = total_accesses > 0 ? 
            (double)tlb_hits / total_accesses * 100 : 0;
        double page_fault_rate = total_accesses > 0 ?
            (double)page_faults / total_accesses * 100 : 0;
        
        std::cout << std::fixed << std::setprecision(2);
        std::cout << "TLB命中率: " << tlb_hit_rate << "%" << std::endl;
        std::cout << "缺页率: " << page_fault_rate << "%" << std::endl;
        
        // 计算有效访问时间
        double tlb_time = 10; // ns
        double memory_time = 100; // ns
        double disk_time = 10000000; // 10ms
        
        double effective_time = tlb_time * (tlb_hits / (double)total_accesses) +
                               (memory_time + disk_time * (page_faults / (double)total_accesses)) *
                               (tlb_misses / (double)total_accesses);
        
        std::cout << "有效访问时间: " << effective_time << " ns" << std::endl;
    }
    
private:
    int lookupTLB(int page_number) {
        for (const auto& entry : tlb) {
            if (entry.valid && entry.page_number == page_number) {
                return entry.frame_number;
            }
        }
        return -1;
    }
    
    void updateTLB(int page_number, int frame_number) {
        // 简单的FIFO替换策略
        static int tlb_index = 0;
        
        tlb[tlb_index].page_number = page_number;
        tlb[tlb_index].frame_number = frame_number;
        tlb[tlb_index].valid = true;
        
        tlb_index = (tlb_index + 1) % TLB_SIZE;
    }
    
    int handlePageFault(int page_number) {
        // 寻找空闲页框
        int frame = -1;
        
        for (int i = 0; i < PHYSICAL_FRAMES; i++) {
            if (!frame_usage[i]) {
                frame = i;
                break;
            }
        }
        
        if (frame == -1) {
            // 没有空闲页框，需要置换（简化：选择第一个页框）
            frame = 0;
            std::cout << "  置换页框" << frame << std::endl;
        }
        
        // 模拟从磁盘加载
        std::cout << "  从磁盘加载页" << page_number << "到页框" << frame << std::endl;
        
        // 更新页表
        page_table[page_number].valid = true;
        page_table[page_number].frame_number = frame;
        page_table[page_number].referenced = true;
        
        frame_usage[frame] = true;
        
        return frame;
    }
};

// 演示按需分页
void demonstrateDemandPaging() {
    std::cout << "\n=== 按需分页演示 ===" << std::endl;
    
    // 创建一个有1024页的虚拟地址空间（4MB）
    VirtualMemorySystem vms(1024);
    
    std::cout << "\n访问模式1：局部性访问" << std::endl;
    // 访问相邻页面（良好的局部性）
    for (int i = 0; i < 10; i++) {
        vms.accessVirtualAddress(i * 4096); // 页0-9
    }
    
    std::cout << "\n访问模式2：随机访问" << std::endl;
    // 随机访问（较差的局部性）
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(100, 200);
    
    for (int i = 0; i < 10; i++) {
        int page = dis(gen);
        vms.accessVirtualAddress(page * 4096);
    }
    
    vms.displayStats();
}

// 计算有效访问时间
void calculateEffectiveAccessTime() {
    std::cout << "\n=== 有效访问时间计算 ===" << std::endl;
    
    double tlb_hit_time = 10; // ns
    double tlb_miss_time = 100; // ns (访问内存页表)
    double page_fault_time = 10000000; // 10ms
    
    double tlb_hit_rate = 0.98; // 98%
    double page_fault_rate = 0.001; // 0.1%
    
    // 有效访问时间 = TLB命中时间 × 命中率 + 
    //               (TLB未命中但页在内存的时间 + 缺页时间 × 缺页率) × 未命中率
    double eat = tlb_hit_time * tlb_hit_rate +
                 (tlb_miss_time + page_fault_time * page_fault_rate) * (1 - tlb_hit_rate);
    
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "TLB命中率: " << tlb_hit_rate * 100 << "%" << std::endl;
    std::cout << "缺页率: " << page_fault_rate * 100 << "%" << std::endl;
    std::cout << "有效访问时间: " << eat << " ns" << std::endl;
    std::cout << "相当于: " << eat / 10 << " 倍TLB访问时间" << std::endl;
}

int main() {
    std::cout << "虚拟内存机制演示" << std::endl;
    std::cout << "==================" << std::endl;
    
    demonstrateDemandPaging();
    calculateEffectiveAccessTime();
    
    return 0;
}
```

编译命令：`g++ -std=c++17 07_virtual_memory.cpp -o vm_demo`

### Java完整实现：多级页表和地址转换

```java
import java.util.*;

// 页表条目
class PageTableEntry {
    int frameNumber;
    boolean valid;
    boolean dirty;
    boolean referenced;
    
    public PageTableEntry() {
        this.frameNumber = -1;
        this.valid = false;
        this.dirty = false;
        this.referenced = false;
    }
}

// TLB条目
class TLBEntry {
    int pageNumber;
    int frameNumber;
    boolean valid;
    
    public TLBEntry() {
        this.pageNumber = -1;
        this.frameNumber = -1;
        this.valid = false;
    }
}

// 两级页表
class TwoLevelPageTable {
    private final int directoryBits;
    private final int tableBits;
    private final int offsetBits;
    private List<List<PageTableEntry>> pageDirectory;
    
    public TwoLevelPageTable(int dirBits, int tblBits, int offBits) {
        this.directoryBits = dirBits;
        this.tableBits = tblBits;
        this.offsetBits = offBits;
        
        int directorySize = 1 << dirBits;
        this.pageDirectory = new ArrayList<>(directorySize);
        
        // 延迟分配二级页表
        for (int i = 0; i < directorySize; i++) {
            pageDirectory.add(null);
        }
    }
    
    public PageTableEntry lookup(int virtualAddress) {
        int directoryIndex = (virtualAddress >> (tableBits + offsetBits)) & ((1 << directoryBits) - 1);
        int tableIndex = (virtualAddress >> offsetBits) & ((1 << tableBits) - 1);
        
        // 检查二级页表是否存在
        if (pageDirectory.get(directoryIndex) == null) {
            return null; // 页表不存在，必然缺页
        }
        
        return pageDirectory.get(directoryIndex).get(tableIndex);
    }
    
    public void mapPage(int virtualAddress, int frameNumber) {
        int directoryIndex = (virtualAddress >> (tableBits + offsetBits)) & ((1 << directoryBits) - 1);
        int tableIndex = (virtualAddress >> offsetBits) & ((1 << tableBits) - 1);
        
        // 如果二级页表不存在，创建它
        if (pageDirectory.get(directoryIndex) == null) {
            int tableSize = 1 << tableBits;
            List<PageTableEntry> newTable = new ArrayList<>(tableSize);
            for (int i = 0; i < tableSize; i++) {
                newTable.add(new PageTableEntry());
            }
            pageDirectory.set(directoryIndex, newTable);
        }
        
        PageTableEntry entry = pageDirectory.get(directoryIndex).get(tableIndex);
        entry.frameNumber = frameNumber;
        entry.valid = true;
    }
    
    public int countAllocatedTables() {
        int count = 0;
        for (List<PageTableEntry> table : pageDirectory) {
            if (table != null) count++;
        }
        return count;
    }
    
    public int getDirectorySize() {
        return pageDirectory.size();
    }
}

public class VirtualMemoryDemo {
    
    // 演示地址转换
    public static void demonstrateAddressTranslation() {
        System.out.println("\n=== 地址转换演示 ===");
        
        int pageSize = 4096; // 4KB
        int virtualBits = 32;
        int offsetBits = 12; // 2^12 = 4096
        int pageBits = virtualBits - offsetBits;
        
        System.out.println("虚拟地址位数: " + virtualBits);
        System.out.println("页大小: " + pageSize + "字节");
        System.out.println("偏移位数: " + offsetBits);
        System.out.println("页号位数: " + pageBits);
        
        // 示例地址
        int[] addresses = {0x00001234, 0x00405678, 0xFFFF0000};
        
        for (int addr : addresses) {
            int pageNumber = addr >>> offsetBits;
            int offset = addr & ((1 << offsetBits) - 1);
            
            System.out.printf("\n虚拟地址: 0x%08X%n", addr);
            System.out.printf("  二进制: %032s%n", Integer.toBinaryString(addr));
            System.out.printf("  页号: %d (0x%X)%n", pageNumber, pageNumber);
            System.out.printf("  偏移: %d (0x%X)%n", offset, offset);
        }
    }
    
    // 演示两级页表的空间节省
    public static void demonstrateTwoLevelPageTable() {
        System.out.println("\n=== 两级页表示例 ===");
        
        // 32位地址，10位目录，10位页表，12位偏移
        TwoLevelPageTable pt = new TwoLevelPageTable(10, 10, 12);
        
        System.out.println("页目录大小: " + pt.getDirectorySize() + "项");
        System.out.println("每项指向一个二级页表");
        System.out.println("每个二级页表: " + (1 << 10) + " = 1024项");
        
        // 单级页表需要的空间
        long singleLevelEntries = 1L << 20; // 2^20 = 1M
        long singleLevelSize = singleLevelEntries * 4; // 每项4字节
        
        System.out.println("\n单级页表:");
        System.out.println("  页表项数: " + singleLevelEntries);
        System.out.println("  所需空间: " + (singleLevelSize / 1024 / 1024) + "MB");
        
        // 映射一些页面
        pt.mapPage(0x00000000, 0);
        pt.mapPage(0x00400000, 1);
        pt.mapPage(0x00800000, 2);
        
        int allocatedTables = pt.countAllocatedTables();
        long twoLevelSize = pt.getDirectorySize() * 4 + allocatedTables * 1024 * 4;
        
        System.out.println("\n两级页表（仅映射3个页）:");
        System.out.println("  已分配二级页表: " + allocatedTables);
        System.out.println("  所需空间: " + (twoLevelSize / 1024) + "KB");
        System.out.println("  节省比例: " + (100.0 - (double)twoLevelSize / singleLevelSize * 100) + "%");
    }
    
    // 演示TLB性能影响
    public static void demonstrateTLBImpact() {
        System.out.println("\n=== TLB性能影响 ===");
        
        double tlbHitTime = 10; // ns
        double memoryAccessTime = 100; // ns
        double diskAccessTime = 10_000_000; // 10ms
        
        double[] tlbHitRates = {0.90, 0.95, 0.98, 0.99, 0.995};
        double pageFaultRate = 0.001;
        
        System.out.println("TLB命中率\t有效访问时间\t加速比");
        System.out.println("----------------------------------------");
        
        for (double hitRate : tlbHitRates) {
            double eat = tlbHitTime * hitRate + 
                        (memoryAccessTime + diskAccessTime * pageFaultRate) * (1 - hitRate);
            double speedup = memoryAccessTime / eat;
            
            System.out.printf("%.3f\t\t%.2f ns\t\t%.2fx%n", hitRate, eat, speedup);
        }
    }
    
    // 演示写时复制
    public static void demonstrateCopyOnWrite() {
        System.out.println("\n=== 写时复制(COW)演示 ===");
        
        System.out.println("场景：父进程fork()创建子进程");
        System.out.println("传统方式：立即复制所有页面（昂贵）");
        System.out.println("COW方式：共享页面，只在写入时复制");
        
        System.out.println("\n步骤:");
        System.out.println("1. 父进程有页面A、B、C");
        System.out.println("2. fork()后，子进程共享A、B、C（标记为只读）");
        System.out.println("3. 子进程读取A → 直接访问共享页");
        System.out.println("4. 子进程写入B → 触发保护异常");
        System.out.println("5. OS复制B为B'，子进程获得私有副本");
        System.out.println("6. 父进程仍使用原B");
        
        System.out.println("\n优势：");
        System.out.println("- fork()后立即exec()时避免无谓复制");
        System.out.println("- 只复制实际修改的页面");
        System.out.println("- 显著减少内存使用和fork开销");
    }
    
    public static void main(String[] args) {
        System.out.println("虚拟内存机制演示");
        System.out.println("==================");
        
        demonstrateAddressTranslation();
        demonstrateTwoLevelPageTable();
        demonstrateTLBImpact();
        demonstrateCopyOnWrite();
        
        System.out.println("\n所有演示完成");
    }
}
```

编译命令：`javac VirtualMemoryDemo.java && java VirtualMemoryDemo`

---

## 复杂度或性能分析

| 组件 | 访问时间 | 命中率 | 对性能影响 |
|------|---------|--------|-----------|
| TLB | ~10ns | 95-99% | 关键 |
| 页表（L1缓存） | ~1ns | 高 | 小 |
| 页表（内存） | ~100ns | 100% | 中等 |
| 磁盘（缺页） | ~10ms | <1% | 巨大 |

**有效访问时间公式：**
EAT = TLB命中时间 × TLB命中率 + (内存访问时间 + 缺页代价 × 缺页率) × TLB未命中率

---

## 常见误区与易错点

| 错误/现象 | 原因 | 解决方案 |
|----------|------|---------|
| 认为虚拟内存无限大 | 忽略磁盘空间和换页开销 | 理解实际限制 |
| TLB未刷新 | 进程切换后TLB仍含旧映射 | 切换时刷新或使用ASID |
| 页表过大 | 单级页表占用太多内存 | 使用多级页表或哈希页表 |
| 抖动现象 | 分配给进程的页框太少 | 增加物理内存或减少并发 |
| 忘记设置脏位 | 不必要地写回未修改页 | 正确维护脏位 |
| 忽视局部性 | 随机访问导致高缺页率 | 优化数据结构和算法 |

---

## 与其他知识点的关系

- **与页面置换的关系**：缺页时需要选择置换哪一页（第八章）
- **与缓存的关系**：TLB是特殊的缓存
- **与文件系统的关系**：内存映射文件利用虚拟内存
- **与性能优化的关系**：局部性原理指导程序设计

---

## 自测题与参考答案

### 问题1：TLB的主要作用是什么？
A. 存储页面数据  
B. 加速地址转换  
C. 管理磁盘空间  
D. 压缩内存

**答案：B**

**解析：** TLB（Translation Lookaside Buffer）是页表的缓存，存储最近使用的页表项。由于页表在内存中，每次地址转换都需要访问内存会很慢。TLB通过缓存常用映射，将地址转换时间从~100ns降低到~10ns。

### 问题2：什么情况下会发生缺页中断？
A. 访问的页在TLB中未找到  
B. 访问的页在页表中有效位为0  
C. 访问的页被标记为只读  
D. TLB已满

**答案：B**

**解析：** 缺页中断发生在页表项的有效位为0时，表示该页当前不在物理内存中。TLB未命中不一定是缺页，可能页在内存中只是不在TLB中。只读页访问不会导致缺页，只会导致保护异常（如果尝试写入）。

### 问题3：为什么使用两级页表而不是单级页表？
A. 加快地址转换速度  
B. 减少页表占用的内存空间  
C. 简化硬件设计  
D. 提高TLB命中率

**答案：B**

**解析：** 32位地址空间的单级页表需要2^20 = 1M个页表项，占用4MB连续内存。而大多数程序只使用一小部分地址空间，两级页表可以只为使用的部分分配二级页表，大幅节省内存。但它会略微降低访问速度（需要两次内存访问）。

---

## 考点精讲

### 考点1：有效访问时间的计算

**核心要点：**
1. **分层存储**：TLB → 页表 → 磁盘
2. **加权平均**：根据命中率计算期望值
3. **数量级差异**：磁盘访问比内存慢10万倍

**面试常见问题：**
> Q: TLB命中率为98%，内存访问100ns，缺页率0.1%，缺页代价10ms，求EAT。  
> A: EAT = 10×0.98 + (100 + 10,000,000×0.001)×0.02 = 9.8 + (100+10,000)×0.02 = 9.8 + 202 = 211.8ns

### 考点2：多级页表的优势和劣势

**核心要点：**
1. **优势**：节省内存，支持稀疏地址空间
2. **劣势**：增加访问次数，需要更多次内存访问
3. **权衡**：三级页表用于64位系统

**面试常见问题：**
> Q: 64位系统为什么需要多级页表？  
> A: 64位地址空间太大，即使页大小为4KB，单级页表也需要2^52个页表项，完全不现实。四级或五级页表可以将页表分散存储，只分配使用的部分。

### 考点3：写时复制（COW）机制

**核心要点：**
1. **触发场景**：fork()创建子进程
2. **实现方式**：共享页面标记为只读，写入时复制
3. **优势**：避免不必要的复制，特别是fork后立即exec的情况

**面试常见问题：**
> Q: Linux的fork()如何实现高效？  
> A: 使用写时复制技术。fork()时不复制任何页面，只是复制页表并将共享页面标记为只读。只有当某个进程尝试写入时，才会触发页故障，OS此时复制该页面。这样如果子进程立即调用exec()，就完全不需要复制。

---

## 术语速查

| 术语 | 英文 | 简要说明 |
|------|------|---------|
| 虚拟内存 | Virtual Memory | 扩展内存的技术 |
| 页表 | Page Table | 虚拟到物理的映射 |
| TLB | Translation Lookaside Buffer | 快表缓存 |
| 缺页中断 | Page Fault | 页不在内存 |
| 按需分页 | Demand Paging | 需要时才加载 |
| 写时复制 | Copy-on-Write | 写入时才复制 |

---

## 参考资料与复核

1. [Virtual Memory Concepts](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf) - OSTEP教材
2. [TLB and Page Tables](https://www.geeksforgeeks.org/translation-lookaside-buffer-tlb/) - 详细教程
3. [Linux Virtual Memory](https://www.kernel.org/doc/html/latest/admin-guide/mm/index.html) - Linux文档

**复核日期建议：**
- 首次学习后1天：手动计算地址转换
- 首次学习后7天：研究x86页表格式
- 首次学习后30天：分析实际程序的内存行为

---

*本章完。下一章将探讨页面置换算法。*
