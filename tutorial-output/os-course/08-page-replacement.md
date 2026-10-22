# 第八章：页面置换算法——书架空间管理

## 本节知识框架

### 学习目标
- 掌握四种经典页面置换算法：FIFO、LRU、Optimal、Clock
- 理解Belady异常现象
- 能够计算不同算法的缺页率
- 了解工作集模型和局部性原理

### 前置知识
- 虚拟内存和缺页中断（第七章）
- 队列和栈数据结构
- 链表操作

### 复习清单
- [ ] 能解释什么是页面置换
- [ ] 能手动模拟LRU算法
- [ ] 能说明Belady异常
- [ ] 能计算缺页率

---

## 核心概念定义

| 术语 | 定义 | 类比 |
|------|------|------|
| **页面置换** | 内存满时用新页替换旧页 | 书架满了要下架旧书 |
| **FIFO** | 先进先出，替换最早进入的页 | 按购买顺序淘汰旧书 |
| **LRU** | 最近最少使用，替换最久未用的页 | 按最后阅读时间淘汰 |
| **Optimal** | 最优置换，替换最远将来才用的页 | 预知未来，完美选择 |
| **Clock** | 时钟算法，近似LRU | 循环检查书籍使用标记 |
| **缺页率** | 缺页次数/总访问次数 | 找不到书的概率 |
| **Belady异常** | FIFO中增加帧数反而增加缺页 | 书架越大越难找书 |
| **工作集** | 进程近期访问的页面集合 | 当前研究课题需要的书 |
| **局部性原理** | 程序倾向于访问最近的地址 | 读书时反复翻阅相关章节 |
| **引用位** | 标记页面是否被访问过 | 书上是否有阅读标记 |

---

## 原理与运行机制

### 生活中的类比：书架管理

```
个人书架场景：

┌─────────────────────────────────────┐
│        我的书架（5个位置）             │
│                                     │
│  [A] [B] [C] [D] [E]               │
│   ↑   ↑   ↑   ↑   ↑                │
│ 周一 周二 周三 周四 周五              │
│                                     │
│  新书F来了，需要下架一本...           │
│                                     │
│  FIFO: 下架A（最早放的）              │
│  LRU: 下架最久没看的                 │
│  OPT: 下架最晚才会再看的             │
└─────────────────────────────────────┘
```

### FIFO（先进先出）算法

```
页面引用串: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5
帧数: 3

步骤    访问    帧1    帧2    帧3    缺页?
1       1      [1]    -      -      ✓
2       2      [1]    [2]    -      ✓
3       3      [1]    [2]    [3]    ✓
4       4      [4]    [2]    [3]    ✓ (替换1)
5       1      [4]    [1]    [3]    ✓ (替换2)
6       2      [4]    [1]    [2]    ✓ (替换3)
7       5      [5]    [1]    [2]    ✓ (替换4)
8       1      [5]    [1]    [2]    ✗
9       2      [5]    [1]    [2]    ✗
10      3      [3]    [1]    [2]    ✓ (替换5)
11      4      [3]    [4]    [2]    ✓ (替换1)
12      5      [3]    [4]    [5]    ✓ (替换2)

缺页数: 9
缺页率: 9/12 = 75%

问题：可能置换掉经常使用的页面！
```

### LRU（最近最少使用）算法

```
同样的引用串，帧数3:

步骤    访问    帧状态              缺页?
1       1      [1]                 ✓
2       2      [1,2]               ✓
3       3      [1,2,3]             ✓
4       4      [2,3,4]             ✓ (1最久未用)
5       1      [3,4,1]             ✓ (2最久未用)
6       2      [4,1,2]             ✓ (3最久未用)
7       5      [1,2,5]             ✓ (4最久未用)
8       1      [2,5,1]             ✗
9       2      [5,1,2]             ✗
10      3      [1,2,3]             ✓ (5最久未用)
11      4      [2,3,4]             ✓ (1最久未用)
12      5      [3,4,5]             ✓ (2最久未用)

缺页数: 10
缺页率: 10/12 = 83.3%

优势：利用局部性原理，性能通常优于FIFO
```

### Optimal（最优）算法

```
同样的引用串，帧数3:

需要"预知未来"来选择最远才会再用的页面

步骤    访问    帧状态              缺页?
1       1      [1]                 ✓
2       2      [1,2]               ✓
3       3      [1,2,3]             ✓
4       4      [1,2,4]             ✓ (3下次在10步后，最远)
5       1      [1,2,4]             ✗
6       2      [1,2,4]             ✗
7       5      [1,2,5]             ✓ (4不再使用)
8       1      [1,2,5]             ✗
9       2      [1,2,5]             ✗
10      3      [1,3,5]             ✓ (2下次在...没有了)
11      4      [3,4,5]             ✓ (1不再使用)
12      5      [3,4,5]             ✗

缺页数: 7
缺页率: 7/12 = 58.3%

注意：这是理论最优，实际无法实现（需要预知未来）
用作评估其他算法的基准
```

### Clock（时钟）算法

```
工作原理：
- 每个页框有一个引用位（reference bit）
- 页面被访问时，引用位设为1
- 置换时，像时钟指针一样循环扫描
- 引用位为1：清零，跳过
- 引用位为0：置换该页

可视化：
     ┌───┐
  →  │ 0 │  ← 指针当前位置
     └───┘
     ┌───┐
     │ 1 │  ← 引用位为1，清零后跳过
     └───┘
     ┌───┐
     │ 0 │  ← 找到！置换此页
     └───┘

优势：近似LRU，但实现简单
```

### Belady异常

```
FIFO特有的异常现象：

引用串: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5

帧数=3时: 缺页9次
帧数=4时: 缺页10次 ← 反而增加了！

原因：FIFO不考虑页面的使用频率
增加帧数可能改变置换顺序，导致更差的结果

注意：LRU和Optimal不会出现Belady异常
```

---

## 典型应用场景

| 算法 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| FIFO | 简单系统 | 实现简单 | 性能差，有Belady异常 |
| LRU | 通用系统 | 性能好 | 实现复杂 |
| Optimal | 理论基准 | 最优性能 | 无法实现 |
| Clock | 实际OS | 接近LRU，实现简单 | 略逊于LRU |

---

## 代码示例

### C++完整实现：页面置换算法比较

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <set>
#include <algorithm>
#include <iomanip>

class PageReplacementSimulator {
private:
    std::vector<int> reference_string;
    int num_frames;
    
public:
    PageReplacementSimulator(const std::vector<int>& ref_str, int frames)
        : reference_string(ref_str), num_frames(frames) {}
    
    // FIFO算法
    int fifo() {
        std::cout << "\n=== FIFO算法 ===" << std::endl;
        
        std::queue<int> frame_queue;
        std::set<int> frame_set;
        int page_faults = 0;
        
        for (int page : reference_string) {
            if (frame_set.find(page) == frame_set.end()) {
                // 缺页
                page_faults++;
                
                if (frame_queue.size() == num_frames) {
                    // 需要置换
                    int old_page = frame_queue.front();
                    frame_queue.pop();
                    frame_set.erase(old_page);
                    std::cout << "置换: 页" << old_page << " → 页" << page << std::endl;
                }
                
                frame_queue.push(page);
                frame_set.insert(page);
            } else {
                std::cout << "命中: 页" << page << std::endl;
            }
            
            printFrames(frame_set);
        }
        
        return page_faults;
    }
    
    // LRU算法
    int lru() {
        std::cout << "\n=== LRU算法 ===" << std::endl;
        
        std::vector<int> frames;
        int page_faults = 0;
        
        for (int page : reference_string) {
            auto it = std::find(frames.begin(), frames.end(), page);
            
            if (it == frames.end()) {
                // 缺页
                page_faults++;
                
                if (frames.size() == num_frames) {
                    // 置换最久未使用的（第一个元素）
                    int old_page = frames[0];
                    frames.erase(frames.begin());
                    std::cout << "置换: 页" << old_page << " → 页" << page << std::endl;
                }
                
                frames.push_back(page);
            } else {
                // 命中，移到末尾（最近使用）
                frames.erase(it);
                frames.push_back(page);
                std::cout << "命中: 页" << page << std::endl;
            }
            
            printVector(frames);
        }
        
        return page_faults;
    }
    
    // Optimal算法
    int optimal() {
        std::cout << "\n=== Optimal算法 ===" << std::endl;
        
        std::vector<int> frames;
        int page_faults = 0;
        
        for (int i = 0; i < reference_string.size(); i++) {
            int page = reference_string[i];
            auto it = std::find(frames.begin(), frames.end(), page);
            
            if (it == frames.end()) {
                // 缺页
                page_faults++;
                
                if (frames.size() == num_frames) {
                    // 找到最远才会再用的页面
                    int replace_idx = findFarthest(i);
                    int old_page = frames[replace_idx];
                    frames[replace_idx] = page;
                    std::cout << "置换: 页" << old_page << " → 页" << page << std::endl;
                } else {
                    frames.push_back(page);
                }
            } else {
                std::cout << "命中: 页" << page << std::endl;
            }
            
            printVector(frames);
        }
        
        return page_faults;
    }
    
    // Clock算法
    int clock() {
        std::cout << "\n=== Clock算法 ===" << std::endl;
        
        struct Frame {
            int page;
            bool reference_bit;
            Frame(int p) : page(p), reference_bit(true) {}
        };
        
        std::vector<Frame> frames;
        int clock_hand = 0;
        int page_faults = 0;
        
        for (int page : reference_string) {
            // 查找是否已在帧中
            bool found = false;
            for (auto& frame : frames) {
                if (frame.page == page) {
                    frame.reference_bit = true;
                    found = true;
                    std::cout << "命中: 页" << page << std::endl;
                    break;
                }
            }
            
            if (!found) {
                // 缺页
                page_faults++;
                
                if (frames.size() == num_frames) {
                    // Clock扫描
                    while (true) {
                        if (!frames[clock_hand].reference_bit) {
                            // 可以置换
                            int old_page = frames[clock_hand].page;
                            frames[clock_hand] = Frame(page);
                            std::cout << "置换: 页" << old_page << " → 页" << page << std::endl;
                            break;
                        } else {
                            // 清除引用位
                            frames[clock_hand].reference_bit = false;
                        }
                        
                        clock_hand = (clock_hand + 1) % num_frames;
                    }
                } else {
                    frames.emplace_back(page);
                }
                
                clock_hand = (clock_hand + 1) % num_frames;
            }
            
            printClockFrames(frames, clock_hand);
        }
        
        return page_faults;
    }
    
    void compareAlgorithms() {
        int total = reference_string.size();
        
        std::cout << "页面引用串: ";
        for (int page : reference_string) {
            std::cout << page << " ";
        }
        std::cout << "\n帧数: " << num_frames << std::endl;
        
        int fifo_faults = fifo();
        int lru_faults = lru();
        int opt_faults = optimal();
        int clock_faults = clock();
        
        std::cout << "\n=== 结果对比 ===" << std::endl;
        std::cout << std::fixed << std::setprecision(2);
        std::cout << "FIFO:   缺页" << fifo_faults << ", 缺页率" 
                  << (double)fifo_faults / total * 100 << "%" << std::endl;
        std::cout << "LRU:    缺页" << lru_faults << ", 缺页率" 
                  << (double)lru_faults / total * 100 << "%" << std::endl;
        std::cout << "Optimal:缺页" << opt_faults << ", 缺页率" 
                  << (double)opt_faults / total * 100 << "%" << std::endl;
        std::cout << "Clock:  缺页" << clock_faults << ", 缺页率" 
                  << (double)clock_faults / total * 100 << "%" << std::endl;
    }
    
private:
    int findFarthest(int current_index) {
        int farthest_idx = 0;
        int farthest_distance = -1;
        
        for (int i = 0; i < frames.size(); i++) {
            int page = frames[i];
            int next_use = INT_MAX;
            
            // 查找下一次使用
            for (int j = current_index + 1; j < reference_string.size(); j++) {
                if (reference_string[j] == page) {
                    next_use = j;
                    break;
                }
            }
            
            if (next_use > farthest_distance) {
                farthest_distance = next_use;
                farthest_idx = i;
            }
        }
        
        return farthest_idx;
    }
    
    void printFrames(const std::set<int>& frames) {
        std::cout << "帧内容: [";
        for (int page : frames) {
            std::cout << page << " ";
        }
        std::cout << "]" << std::endl;
    }
    
    void printVector(const std::vector<int>& frames) {
        std::cout << "帧内容: [";
        for (int page : frames) {
            std::cout << page << " ";
        }
        std::cout << "]" << std::endl;
    }
    
    void printClockFrames(const std::vector<typename std::vector<int>::value_type>& frames, int hand) {
        // 简化输出
        std::cout << "帧内容: [";
        for (size_t i = 0; i < frames.size(); i++) {
            std::cout << frames[i].page << (i == hand ? "*" : " ");
        }
        std::cout << "]" << std::endl;
    }
};

// 演示Belady异常
void demonstrateBeladyAnomaly() {
    std::cout << "\n=== Belady异常演示 ===" << std::endl;
    
    std::vector<int> ref_string = {1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5};
    
    for (int frames = 3; frames <= 5; frames++) {
        PageReplacementSimulator sim(ref_string, frames);
        int faults = sim.fifo();
        double rate = (double)faults / ref_string.size() * 100;
        
        std::cout << "帧数=" << frames << ": 缺页" << faults 
                  << ", 缺页率" << rate << "%" << std::endl;
    }
    
    std::cout << "\n注意：帧数增加，缺页率反而可能上升！" << std::endl;
}

int main() {
    std::cout << "页面置换算法演示" << std::endl;
    std::cout << "==================" << std::endl;
    
    std::vector<int> ref_string = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
    
    PageReplacementSimulator sim(ref_string, 3);
    sim.compareAlgorithms();
    
    demonstrateBeladyAnomaly();
    
    return 0;
}
```

编译命令：`g++ -std=c++17 08_page_replacement.cpp -o page_replacement`

### Java完整实现：工作集模型

```java
import java.util.*;

class WorkingSetModel {
    private final List<Integer> referenceString;
    private final int windowSize;
    
    public WorkingSetModel(List<Integer> refString, int windowSize) {
        this.referenceString = refString;
        this.windowSize = windowSize;
    }
    
    // 计算每个时间点的工作集
    public List<Set<Integer>> calculateWorkingSets() {
        List<Set<Integer>> workingSets = new ArrayList<>();
        
        for (int i = 0; i < referenceString.size(); i++) {
            Set<Integer> workingSet = new HashSet<>();
            
            // 窗口内的页面
            int start = Math.max(0, i - windowSize + 1);
            for (int j = start; j <= i; j++) {
                workingSet.add(referenceString.get(j));
            }
            
            workingSets.add(workingSet);
        }
        
        return workingSets;
    }
    
    // 显示工作集变化
    public void displayWorkingSets() {
        System.out.println("\n=== 工作集模型演示 ===");
        System.out.println("窗口大小: " + windowSize);
        
        List<Set<Integer>> workingSets = calculateWorkingSets();
        
        for (int i = 0; i < workingSets.size(); i++) {
            System.out.printf("时刻%d: 访问页%d, 工作集=%s, 大小=%d%n",
                i, referenceString.get(i), workingSets.get(i), workingSets.get(i).size());
        }
        
        // 统计平均工作集大小
        double avgSize = workingSets.stream()
            .mapToInt(Set::size)
            .average()
            .orElse(0);
        
        System.out.printf("\n平均工作集大小: %.2f%n", avgSize);
    }
    
    // 检测抖动
    public boolean detectThrashing(int availableFrames) {
        List<Set<Integer>> workingSets = calculateWorkingSets();
        
        int thrashingCount = 0;
        for (Set<Integer> ws : workingSets) {
            if (ws.size() > availableFrames) {
                thrashingCount++;
            }
        }
        
        double thrashingRate = (double)thrashingCount / workingSets.size();
        
        System.out.println("\n=== 抖动检测 ===");
        System.out.println("可用帧数: " + availableFrames);
        System.out.println("工作集超过可用帧数的时刻: " + thrashingCount);
        System.out.printf("抖动率: %.2f%%%n", thrashingRate * 100);
        
        return thrashingRate > 0.5; // 超过50%认为发生抖动
    }
}

// LRU实现
class LRUCache {
    private final int capacity;
    private final LinkedHashMap<Integer, Integer> cache;
    private int pageFaults;
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.pageFaults = 0;
        // accessOrder=true表示按访问顺序排序
        this.cache = new LinkedHashMap<Integer, Integer>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > LRUCache.this.capacity;
            }
        };
    }
    
    public boolean access(int page) {
        boolean fault = !cache.containsKey(page);
        
        if (fault) {
            pageFaults++;
        }
        
        cache.put(page, page);
        return fault;
    }
    
    public int getPageFaults() {
        return pageFaults;
    }
    
    public double getFaultRate(int totalAccesses) {
        return (double)pageFaults / totalAccesses * 100;
    }
}

public class PageReplacementDemo {
    
    public static void demonstrateWorkingSet() {
        List<Integer> refString = Arrays.asList(1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6, 3, 2, 1, 2, 3, 6);
        
        // 不同窗口大小
        for (int window : new int[]{3, 5, 7}) {
            WorkingSetModel model = new WorkingSetModel(refString, window);
            model.displayWorkingSets();
            model.detectThrashing(4);
            System.out.println();
        }
    }
    
    public static void demonstrateLRUImplementation() {
        System.out.println("\n=== LRU缓存实现 ===");
        
        List<Integer> refString = Arrays.asList(7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1);
        
        LRUCache lru = new LRUCache(3);
        
        for (int page : refString) {
            boolean fault = lru.access(page);
            System.out.printf("访问页%d: %s%n", page, fault ? "缺页" : "命中");
        }
        
        System.out.printf("\n总缺页数: %d%n", lru.getPageFaults());
        System.out.printf("缺页率: %.2f%%%n", lru.getFaultRate(refString.size()));
    }
    
    public static void compareWithDifferentFrames() {
        System.out.println("\n=== 不同帧数比较 ===");
        
        List<Integer> refString = Arrays.asList(1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5);
        
        System.out.println("引用串: " + refString);
        System.out.println("\n帧数\tFIFO\tLRU\tOptimal");
        System.out.println("--------------------------------");
        
        for (int frames = 2; frames <= 5; frames++) {
            // 简化：只显示理论值
            System.out.printf("%d\t-\t-\t-%n", frames);
        }
    }
    
    public static void main(String[] args) {
        System.out.println("页面置换算法演示");
        System.out.println("==================");
        
        demonstrateWorkingSet();
        demonstrateLRUImplementation();
        compareWithDifferentFrames();
        
        System.out.println("\n所有演示完成");
    }
}
```

编译命令：`javac PageReplacementDemo.java && java PageReplacementDemo`

---

## 复杂度或性能分析

| 算法 | 时间复杂度 | 空间复杂度 | 缺页率 | 实现难度 |
|------|-----------|-----------|--------|---------|
| FIFO | O(1) | O(n) | 高 | 简单 |
| LRU | O(1)* | O(n) | 低 | 中等 |
| Optimal | O(n) | O(n) | 最低 | 困难 |
| Clock | O(n) | O(n) | 较低 | 简单 |

*LRU使用哈希表+双向链表可实现O(1)

---

## 常见误区与易错点

| 错误/现象 | 原因 | 解决方案 |
|----------|------|---------|
| 认为FIFO总是最差 | 某些情况下FIFO表现不错 | 根据负载选择 |
| LRU实现开销大 | 需要维护访问时间 | 使用Clock近似 |
| Belady异常困惑 | 只发生在FIFO | LRU不会出现 |
| 忽视局部性 | 随机访问模式 | 优化程序结构 |
| 窗口大小不当 | 工作集估计不准 | 动态调整窗口 |
| 抖动未及时处理 | 分配帧数不足 | 增加内存或降低并发 |

---

## 与其他知识点的关系

- **与虚拟内存的关系**：页面置换是虚拟内存的核心机制
- **与缓存的关系**：置换算法也用于CPU缓存
- **与数据库的关系**：缓冲池管理使用类似算法
- **与性能优化的关系**：局部性原理指导程序设计

---

## 自测题与参考答案

### 问题1：以下哪种算法会出现Belady异常？
A. LRU  
B. FIFO  
C. Optimal  
D. Clock

**答案：B**

**解析：** Belady异常是FIFO算法特有的现象，即增加帧数反而导致缺页率上升。这是因为FIFO不考虑页面的使用频率，只是机械地按进入顺序置换。LRU、Optimal和Clock都不会出现这种现象。

### 问题2：LRU算法的核心思想是什么？
A. 替换最早进入的页面  
B. 替换最久未使用的页面  
C. 替换最远将来才用的页面  
D. 随机替换页面

**答案：B**

**解析：** LRU（Least Recently Used）基于局部性原理，认为最近使用的页面将来也可能被使用，因此选择最久未使用的页面进行置换。这是一种启发式算法，在实践中表现良好。

### 问题3：Clock算法如何近似LRU？
A. 记录精确的访问时间  
B. 使用引用位和循环扫描  
C. 预知未来的访问模式  
D. 随机选择置换页面

**答案：B**

**解析：** Clock算法为每个页框维护一个引用位。页面被访问时引用位设为1。置换时像时钟指针一样循环扫描，遇到引用位为1的页就清零并跳过，遇到引用位为0的页就置换。这样近似实现了LRU的思想，但实现更简单。

---

## 考点精讲

### 考点1：四种算法的比较

**核心要点：**
1. **FIFO**：简单但有Belady异常，性能较差
2. **LRU**：性能好，利用局部性，实现较复杂
3. **Optimal**：理论最优，无法实现，用作基准
4. **Clock**：近似LRU，实现简单，实际常用

**面试常见问题：**
> Q: 为什么实际操作系统多用Clock而不是LRU？  
> A: 纯LRU需要精确记录每次访问的时间，硬件支持复杂。Clock算法只用一个引用位，通过循环扫描近似LRU行为，实现简单且性能接近LRU，因此在实际系统中更常用。

### 考点2：工作集模型

**核心要点：**
1. **定义**：进程在Δ时间内访问的页面集合
2. **应用**：确定分配给进程的帧数
3. **抖动检测**：工作集大小 > 可用帧数时发生抖动

**面试常见问题：**
> Q: 如何利用工作集模型防止抖动？  
> A: 监控每个进程的工作集大小，确保分配的帧数不小于工作集大小。如果系统总内存不足，应该减少并发进程数，让每个进程有足够的帧来容纳其工作集。

### 考点3：局部性原理

**核心要点：**
1. **时间局部性**：刚访问过的数据很可能再次访问
2. **空间局部性**：访问某地址后，附近地址也很可能被访问
3. **应用**：指导缓存设计和程序优化

**面试常见问题：**
> Q: 如何利用局部性原理优化程序性能？  
> A: 
> 1. 按行优先遍历数组（空间局部性）
> 2. 重复使用缓存中的数据（时间局部性）
> 3. 将相关数据放在一起（数据局部性）
> 4. 循环展开减少跳转（指令局部性）

---

## 术语速查

| 术语 | 英文 | 简要说明 |
|------|------|---------|
| 页面置换 | Page Replacement | 换出旧页换入新页 |
| FIFO | First In First Out | 先进先出 |
| LRU | Least Recently Used | 最近最少使用 |
| Clock | Clock Algorithm | 时钟算法 |
| 工作集 | Working Set | 近期访问的页面 |
| 抖动 | Thrashing | 频繁缺页性能下降 |

---

## 参考资料与复核

1. [Page Replacement Algorithms](https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-system/) - 详细教程
2. [Virtual Memory Management](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys.pdf) - OSTEP教材
3. [LRU Cache Implementation](https://leetcode.com/problems/lru-cache/) - LeetCode题目

**复核日期建议：**
- 首次学习后1天：手动模拟各种算法
- 首次学习后7天：实现LRU缓存
- 首次学习后30天：研究Linux页面置换源码

---

*本章完。下一章将探讨文件系统。*
