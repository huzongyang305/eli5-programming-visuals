# 第二章：物理层——高速公路车道系统

## 本节知识框架

### 学习目标
- 理解信号的基本概念和分类
- 掌握调制解调的原理
- 了解多路复用技术
- 能够计算信道容量和数据传输速率

### 前置知识
- 基本的电学概念
- 频率和波长的关系
- 二进制表示

### 复习清单
- [ ] 能区分模拟信号和数字信号
- [ ] 能解释什么是调制
- [ ] 能说明TDM和FDM的区别
- [ ] 能使用香农公式计算信道容量

---

## 核心概念定义

| 术语 | 定义 | 类比 |
|------|------|------|
| **模拟信号** | 连续变化的信号 | 平滑的山坡 |
| **数字信号** | 离散的电平信号 | 台阶楼梯 |
| **调制** | 将数据加载到载波上 | 货物装上卡车 |
| **解调** | 从载波提取数据 | 从卡车卸货 |
| **带宽** | 信道能传输的频率范围 | 公路的车道数 |
| **波特率** | 每秒信号变化次数 | 卡车发车频率 |
| **比特率** | 每秒传输的比特数 | 每秒运送的货物量 |
| **多路复用** | 多个信号共享一个信道 | 多辆车共用一条路 |
| **TDM** | 时分多路复用 | 轮流使用车道 |
| **FDM** | 频分多路复用 | 不同车道跑不同车 |

---

## 原理与运行机制

### 生活中的类比：高速公路系统

```
数据传输如货物运输：

数据（货物）→ 编码（包装）→ 调制（装车）→ 传输（运输）→ 解调（卸车）→ 解码（拆包）→ 数据

高速公路特性：
┌─────────────────────────────────────┐
│         高速公路（信道）              │
│                                     │
│  车道数 = 带宽                      │
│  - 4车道：窄带                      │
│  - 8车道：宽带                      │
│  - 16车道：超宽带                   │
│                                     │
│  车速 = 信号质量                    │
│  - 晴天：高速（低噪声）              │
│  - 雨天：降速（高噪声）              │
│                                     │
│  收费站 = 中继器                    │
│  - 放大信号                         │
│  - 延长传输距离                     │
└─────────────────────────────────────┘
```

### 信号类型

```
模拟信号 vs 数字信号：

模拟信号（正弦波）：
    _     _     _
   / \   / \   / \
  /   \_/   \_/   \_
 连续变化，无限精度

数字信号（方波）：
  ___     ___     ___
 |   |___|   |___|   |
 
 离散电平，只有0和1

转换：
- ADC：模拟→数字（采样、量化、编码）
- DAC：数字→模拟
```

### 调制技术

```
为什么要调制？
- 基带信号（低频）不适合远距离传输
- 需要加载到高频载波上
- 不同信号用不同频率，避免干扰

常见调制方式：

1. ASK（幅移键控）
   振幅变化表示0和1
   高振幅 = 1, 低振幅 = 0
   
2. FSK（频移键控）
   频率变化表示0和1
   高频 = 1, 低频 = 0
   
3. PSK（相移键控）
   相位变化表示数据
   0° = 00, 90° = 01, 180° = 10, 270° = 11
   
4. QAM（正交幅度调制）
   同时改变振幅和相位
   16-QAM：16种状态，每次传4比特
   64-QAM：64种状态，每次传6比特
```

### 多路复用技术

```
FDM（频分多路复用）：
┌───┬───┬───┬───┐
│ f1│ f2│ f3│ f4│  ← 不同频率
└───┴───┴───┴───┘
类似：广播电台，不同频道

TDM（时分多路复用）：
时隙1 时隙2 时隙3 时隙4
[A   ][B   ][C   ][D   ]  ← 轮流发送
[A   ][B   ][C   ][D   ]
类似：轮流发言

WDM（波分多路复用）：
用于光纤通信
不同颜色（波长）的光携带不同信号
一根光纤可传上百个波长
```

### 奈奎斯特和香农公式

```
奈奎斯特定理（无噪声信道）：
最大数据率 = 2 × 带宽 × log₂(L)
L = 信号电平数

示例：
带宽3000Hz，4个电平
最大数据率 = 2 × 3000 × log₂(4) = 12000 bps

香农公式（有噪声信道）：
最大数据率 = 带宽 × log₂(1 + S/N)
S/N = 信噪比

示例：
带宽3000Hz，信噪比30dB (1000倍)
最大数据率 = 3000 × log₂(1001) ≈ 30000 bps

关键：噪声限制了最大传输速率！
```

---

## 典型应用场景

| 技术 | 应用场景 | 特点 |
|------|---------|------|
| ASK | 光纤通信 | 简单，抗噪差 |
| FSK | 无线对讲机 | 抗噪好，效率低 |
| PSK | WiFi、卫星 | 效率高，常用 |
| QAM | 电缆调制解调器 | 最高效率 |
| TDM | 电话系统 | 经典技术 |
| FDM | 广播电台 | 传统方式 |
| WDM | 光纤骨干网 | 超大容量 |

---

## 代码示例

### C++完整实现：信号调制模拟

```cpp
#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

const double PI = 3.14159265358979;

// 模拟信号样本
struct SignalSample {
    double time;
    double amplitude;
    
    SignalSample(double t, double a) : time(t), amplitude(a) {}
};

// 数字数据
class DigitalData {
private:
    std::vector<bool> bits;
    
public:
    DigitalData(const std::string& binary) {
        for (char c : binary) {
            bits.push_back(c == '1');
        }
    }
    
    const std::vector<bool>& getBits() const { return bits; }
    size_t size() const { return bits.size(); }
};

// 调制器
class Modulator {
public:
    // ASK调制
    static std::vector<SignalSample> askModulate(const DigitalData& data, 
                                                 double carrier_freq,
                                                 double sample_rate) {
        std::vector<SignalSample> signal;
        double high_amp = 1.0;
        double low_amp = 0.2;
        
        for (size_t i = 0; i < data.size(); i++) {
            double bit_duration = 1.0 / 1000; // 每比特1ms
            int samples_per_bit = static_cast<int>(sample_rate * bit_duration);
            
            double amplitude = data.getBits()[i] ? high_amp : low_amp;
            
            for (int j = 0; j < samples_per_bit; j++) {
                double t = i * bit_duration + j / sample_rate;
                double value = amplitude * sin(2 * PI * carrier_freq * t);
                signal.emplace_back(t, value);
            }
        }
        
        return signal;
    }
    
    // FSK调制
    static std::vector<SignalSample> fskModulate(const DigitalData& data,
                                                 double freq_0, double freq_1,
                                                 double sample_rate) {
        std::vector<SignalSample> signal;
        
        for (size_t i = 0; i < data.size(); i++) {
            double bit_duration = 1.0 / 1000;
            int samples_per_bit = static_cast<int>(sample_rate * bit_duration);
            
            double freq = data.getBits()[i] ? freq_1 : freq_0;
            
            for (int j = 0; j < samples_per_bit; j++) {
                double t = i * bit_duration + j / sample_rate;
                double value = sin(2 * PI * freq * t);
                signal.emplace_back(t, value);
            }
        }
        
        return signal;
    }
    
    // BPSK调制
    static std::vector<SignalSample> bpskModulate(const DigitalData& data,
                                                  double carrier_freq,
                                                  double sample_rate) {
        std::vector<SignalSample> signal;
        
        for (size_t i = 0; i < data.size(); i++) {
            double bit_duration = 1.0 / 1000;
            int samples_per_bit = static_cast<int>(sample_rate * bit_duration);
            
            double phase = data.getBits()[i] ? 0 : PI; // 0或180度
            
            for (int j = 0; j < samples_per_bit; j++) {
                double t = i * bit_duration + j / sample_rate;
                double value = sin(2 * PI * carrier_freq * t + phase);
                signal.emplace_back(t, value);
            }
        }
        
        return signal;
    }
    
    // 显示信号统计信息
    static void displaySignalStats(const std::vector<SignalSample>& signal,
                                  const std::string& modulation_type) {
        if (signal.empty()) return;
        
        double max_amp = -1e30, min_amp = 1e30;
        double sum = 0;
        
        for (const auto& s : signal) {
            max_amp = std::max(max_amp, s.amplitude);
            min_amp = std::min(min_amp, s.amplitude);
            sum += s.amplitude;
        }
        
        double avg = sum / signal.size();
        
        std::cout << "\n" << modulation_type << "信号统计:" << std::endl;
        std::cout << "样本数: " << signal.size() << std::endl;
        std::cout << "最大振幅: " << std::fixed << std::setprecision(4) << max_amp << std::endl;
        std::cout << "最小振幅: " << min_amp << std::endl;
        std::cout << "平均振幅: " << avg << std::endl;
    }
};

// 计算信道容量
class ChannelCapacity {
public:
    // 奈奎斯特公式
    static double nyquistRate(double bandwidth, int levels) {
        return 2 * bandwidth * log2(levels);
    }
    
    // 香农公式
    static double shannonCapacity(double bandwidth, double snr_db) {
        double snr = pow(10, snr_db / 10); // dB转线性
        return bandwidth * log2(1 + snr);
    }
    
    static void demonstrateCalculations() {
        std::cout << "\n=== 信道容量计算 ===" << std::endl;
        
        double bandwidth = 3000; // Hz
        
        std::cout << "\n奈奎斯特定理（无噪声）:" << std::endl;
        std::cout << "带宽: " << bandwidth << " Hz" << std::endl;
        
        for (int levels : {2, 4, 8, 16}) {
            double rate = nyquistRate(bandwidth, levels);
            std::cout << "  " << levels << "电平: " << rate << " bps" << std::endl;
        }
        
        std::cout << "\n香农公式（有噪声）:" << std::endl;
        std::cout << "带宽: " << bandwidth << " Hz" << std::endl;
        
        for (double snr_db : {10, 20, 30, 40}) {
            double capacity = shannonCapacity(bandwidth, snr_db);
            std::cout << "  信噪比" << snr_db << "dB: " << capacity << " bps" << std::endl;
        }
    }
};

// 演示多路复用
void demonstrateMultiplexing() {
    std::cout << "\n=== 多路复用演示 ===" << std::endl;
    
    std::cout << "\nFDM（频分多路复用）:" << std::endl;
    std::cout << "用户A: 频率 100-200 kHz" << std::endl;
    std::cout << "用户B: 频率 200-300 kHz" << std::endl;
    std::cout << "用户C: 频率 300-400 kHz" << std::endl;
    std::cout << "总带宽: 300 kHz，同时传输" << std::endl;
    
    std::cout << "\nTDM（时分多路复用）:" << std::endl;
    std::cout << "帧结构: [A时隙][B时隙][C时隙]" << std::endl;
    std::cout << "帧率: 8000帧/秒" << std::endl;
    std::cout << "每用户: 8000时隙/秒" << std::endl;
    
    std::cout << "\nWDM（波分多路复用）:" << std::endl;
    std::cout << "λ1 = 1550 nm (红色)" << std::endl;
    std::cout << "λ2 = 1551 nm (橙色)" << std::endl;
    std::cout << "λ3 = 1552 nm (黄色)" << std::endl;
    std::cout << "单根光纤可同时传输数十个波长" << std::endl;
}

int main() {
    std::cout << "物理层信号演示" << std::endl;
    std::cout << "==================" << std::endl;
    
    // 创建测试数据
    DigitalData data("10110010");
    
    std::cout << "\n原始数据: 10110010" << std::endl;
    
    double carrier_freq = 10000; // 10 kHz
    double sample_rate = 100000; // 100 kHz
    
    // ASK调制
    auto ask_signal = Modulator::askModulate(data, carrier_freq, sample_rate);
    Modulator::displaySignalStats(ask_signal, "ASK");
    
    // FSK调制
    auto fsk_signal = Modulator::fskModulate(data, 5000, 15000, sample_rate);
    Modulator::displaySignalStats(fsk_signal, "FSK");
    
    // BPSK调制
    auto bpsk_signal = Modulator::bpskModulate(data, carrier_freq, sample_rate);
    Modulator::displaySignalStats(bpsk_signal, "BPSK");
    
    // 信道容量计算
    ChannelCapacity::demonstrateCalculations();
    
    // 多路复用
    demonstrateMultiplexing();
    
    std::cout << "\n所有演示完成" << std::endl;
    return 0;
}
```

编译命令：`g++ -std=c++17 -lm 02_physical_layer.cpp -o physical_layer`

### Java完整实现：传输介质比较

```java
import java.util.*;

// 传输介质特性
class TransmissionMedium {
    private String name;
    private double maxBandwidth; // Mbps
    private double maxDistance; // km
    private double cost; // 相对成本
    private String interference; // 抗干扰性
    
    public TransmissionMedium(String name, double bandwidth, double distance, 
                             double cost, String interference) {
        this.name = name;
        this.maxBandwidth = bandwidth;
        this.maxDistance = distance;
        this.cost = cost;
        this.interference = interference;
    }
    
    public void displayInfo() {
        System.out.printf("%-12s | 带宽:%8.1f Mbps | 距离:%6.1f km | 成本:%.1f | 抗干扰:%s%n",
            name, maxBandwidth, maxDistance, cost, interference);
    }
}

// 调制方案
class ModulationScheme {
    private String name;
    private int bitsPerSymbol;
    private double efficiency; // bps/Hz
    private String complexity;
    
    public ModulationScheme(String name, int bitsPerSymbol, double efficiency, String complexity) {
        this.name = name;
        this.bitsPerSymbol = bitsPerSymbol;
        this.efficiency = efficiency;
        this.complexity = complexity;
    }
    
    public void displayInfo() {
        System.out.printf("%-8s | %d比特/符号 | 效率:%.1f bps/Hz | 复杂度:%s%n",
            name, bitsPerSymbol, efficiency, complexity);
    }
}

// 计算器
class PhysicalLayerCalculator {
    
    // 计算比特率
    public static double calculateBitRate(double baudRate, int bitsPerSymbol) {
        return baudRate * bitsPerSymbol;
    }
    
    // 计算传输时间
    public static double calculateTransmissionTime(int dataSize, double bitRate) {
        return (dataSize * 8.0) / bitRate; // 数据大小以字节为单位
    }
    
    // 计算传播延迟
    public static double calculatePropagationDelay(double distance, double velocity) {
        return distance / velocity; // 距离以米为单位，速度以米/秒为单位
    }
    
    // 计算总延迟
    public static double calculateTotalDelay(int dataSize, double bitRate, 
                                           double distance, double velocity) {
        double transmissionTime = calculateTransmissionTime(dataSize, bitRate);
        double propagationDelay = calculatePropagationDelay(distance, velocity);
        return transmissionTime + propagationDelay;
    }
}

public class PhysicalLayerDemo {
    
    public static void compareTransmissionMedia() {
        System.out.println("\n=== 传输介质比较 ===\n");
        
        List<TransmissionMedium> media = Arrays.asList(
            new TransmissionMedium("双绞线", 1000, 0.1, 1.0, "差"),
            new TransmissionMedium("同轴电缆", 500, 0.5, 2.0, "中"),
            new TransmissionMedium("多模光纤", 10000, 2.0, 5.0, "优"),
            new TransmissionMedium("单模光纤", 100000, 100.0, 8.0, "优"),
            new TransmissionMedium("无线电", 300, 10.0, 3.0, "差")
        );
        
        System.out.println("介质类型     | 带宽         | 最大距离   | 成本 | 抗干扰");
        System.out.println("----------------------------------------------------------------");
        
        for (TransmissionMedium medium : media) {
            medium.displayInfo();
        }
    }
    
    public static void compareModulationSchemes() {
        System.out.println("\n=== 调制方案比较 ===\n");
        
        List<ModulationScheme> schemes = Arrays.asList(
            new ModulationScheme("BPSK", 1, 1.0, "低"),
            new ModulationScheme("QPSK", 2, 2.0, "中"),
            new ModulationScheme("16-QAM", 4, 4.0, "高"),
            new ModulationScheme("64-QAM", 6, 6.0, "很高"),
            new ModulationScheme("256-QAM", 8, 8.0, "极高")
        );
        
        System.out.println("调制方式 | 每符号比特 | 频谱效率    | 实现复杂度");
        System.out.println("--------------------------------------------------------");
        
        for (ModulationScheme scheme : schemes) {
            scheme.displayInfo();
        }
        
        System.out.println("\n趋势：更高阶调制 → 更高效率，但抗噪能力下降");
    }
    
    public static void demonstrateDelayCalculation() {
        System.out.println("\n=== 延迟计算演示 ===\n");
        
        int dataSize = 1500; // 字节（典型以太网帧）
        double bitRate = 100_000_000; // 100 Mbps
        double distance = 1000; // 米
        double velocity = 200_000_000; // 光速的2/3（铜线中）
        
        double transmissionTime = PhysicalLayerCalculator.calculateTransmissionTime(dataSize, bitRate);
        double propagationDelay = PhysicalLayerCalculator.calculatePropagationDelay(distance, velocity);
        double totalDelay = PhysicalLayerCalculator.calculateTotalDelay(dataSize, bitRate, distance, velocity);
        
        System.out.printf("数据大小: %d 字节 (%d 比特)%n", dataSize, dataSize * 8);
        System.out.printf("传输速率: %.0f Mbps%n", bitRate / 1_000_000);
        System.out.printf("传输距离: %.0f 米%n", distance);
        System.out.println();
        System.out.printf("传输延迟: %.6f 秒 (%.3f 微秒)%n", transmissionTime, transmissionTime * 1e6);
        System.out.printf("传播延迟: %.6f 秒 (%.3f 微秒)%n", propagationDelay, propagationDelay * 1e6);
        System.out.printf("总延迟:   %.6f 秒 (%.3f 微秒)%n", totalDelay, totalDelay * 1e6);
        
        System.out.println("\n注意：短距离时传输延迟主导，长距离时传播延迟主导");
    }
    
    public static void demonstrateShannonLimit() {
        System.out.println("\n=== 香农极限演示 ===\n");
        
        double bandwidth = 1_000_000; // 1 MHz
        
        System.out.println("带宽: 1 MHz");
        System.out.println("\n信噪比 vs 最大容量:");
        System.out.println("----------------------------------------");
        
        for (int snrDb = 0; snrDb <= 40; snrDb += 5) {
            double snr = Math.pow(10, snrDb / 10.0);
            double capacity = bandwidth * Math.log(1 + snr) / Math.log(2);
            
            System.out.printf("SNR = %2d dB (%6.0f倍) → 容量 = %7.0f bps (%.2f Mbps)%n",
                snrDb, snr, capacity, capacity / 1_000_000);
        }
        
        System.out.println("\n结论：提高信噪比可以增加信道容量，但有上限");
    }
    
    public static void main(String[] args) {
        System.out.println("物理层演示");
        System.out.println("==============");
        
        compareTransmissionMedia();
        compareModulationSchemes();
        demonstrateDelayCalculation();
        demonstrateShannonLimit();
        
        System.out.println("\n所有演示完成");
    }
}
```

编译命令：`javac PhysicalLayerDemo.java && java PhysicalLayerDemo`

---

## 复杂度或性能分析

| 调制方式 | 频谱效率 | 抗噪能力 | 实现复杂度 | 典型应用 |
|---------|---------|---------|-----------|---------|
| ASK | 低 | 差 | 简单 | 光纤 |
| FSK | 低 | 好 | 简单 | 无线 |
| PSK | 中 | 好 | 中等 | WiFi |
| QAM | 高 | 差 | 复杂 | 电缆 |

---

## 常见误区与易错点

| 错误/现象 | 原因 | 解决方案 |
|----------|------|---------|
| 混淆波特率和比特率 | 一个符号可传多比特 | 比特率=波特率×每符号比特数 |
| 忽视噪声影响 | 理想情况不存在 | 使用香农公式考虑噪声 |
| 认为带宽无限 | 物理限制存在 | 理解频谱资源有限 |
| 低估传播延迟 | 光速虽快但距离远 | 长距离通信需考虑 |
| 过度追求高阶调制 | 抗噪能力下降 | 根据信道质量选择 |
| 忽视介质特性 | 不同介质差异大 | 根据场景选择介质 |

---

## 与其他知识点的关系

- **与链路层的关系**：物理层为链路层提供比特传输
- **与网络规划的关系**：带宽和距离影响网络设计
- **与无线通信的关系**：无线更受噪声和干扰影响
- **与5G的关系**：高阶调制和MIMO技术

---

## 自测题与参考答案

### 问题1：波特率和比特率的关系是什么？
A. 总是相等  
B. 比特率 = 波特率 × 每符号比特数  
C. 波特率总是更大  
D. 没有关系

**答案：B**

**解析：** 波特率是每秒信号变化的次数，比特率是每秒传输的比特数。如果一个符号可以表示多个比特（如16-QAM每个符号4比特），则比特率 = 波特率 × 每符号比特数。只有在二进制调制（如BPSK）时两者才相等。

### 问题2：香农公式告诉我们什么？
A. 如何调制信号  
B. 信道的最大理论容量  
C. 如何减少噪声  
D. 如何选择传输介质

**答案：B**

**解析：** 香农公式 C = B × log₂(1 + S/N) 给出了有噪声信道的最大理论数据传输速率。它表明信道容量取决于带宽和信噪比，是通信系统的理论极限，实际系统只能接近但无法超过这个极限。

### 问题3：哪种多路复用技术用于光纤通信？
A. TDM  
B. FDM  
C. WDM  
D. CDM

**答案：C**

**解析：** WDM（波分多路复用）是光纤通信中的主要多路复用技术。它利用不同波长（颜色）的光在同一根光纤中传输不同的信号。密集WDM（DWDM）可以在单根光纤中传输上百个波长，实现超大容量传输。

---

## 考点精讲

### 考点1：奈奎斯特vs香农

**核心要点：**
1. **奈奎斯特**：无噪声理想情况，取决于电平数
2. **香农**：有噪声实际情况，取决于信噪比
3. **实际应用**：取两者的较小值

**面试常见问题：**
> Q: 带宽3kHz的电话线路，理论上最大数据率是多少？  
> A: 奈奎斯特：假设4电平，2×3000×log₂(4)=12kbps。香农：假设信噪比30dB，3000×log₂(1001)≈30kbps。实际电话调制解调器约56kbps，接近理论极限。

### 考点2：调制方式的选择

**核心要点：**
1. **低阶调制**：抗噪好，效率低
2. **高阶调制**：效率高，抗噪差
3. **自适应调制**：根据信道质量动态调整

**面试常见问题：**
> Q: WiFi为什么在不同距离下速度不同？  
> A: WiFi使用自适应调制。近距离信号强，使用高阶调制（如256-QAM）获得高速率；远距离信号弱，切换到低阶调制（如QPSK）保证可靠性。这是速率和可靠性的权衡。

### 考点3：多路复用的本质

**核心要点：**
1. **FDM**：频率维度分割
2. **TDM**：时间维度分割
3. **WDM**：光的频率分割
4. **本质**：资源共享，提高利用率

**面试常见问题：**
> Q: 5G如何实现高速率？  
> A: 5G结合了多种技术：1) 更大带宽（毫米波）；2) 高阶调制（256-QAM）；3) Massive MIMO（空间复用）；4) 更高效的编码。这些技术共同提升了频谱效率和系统容量。

---

## 术语速查

| 术语 | 英文 | 简要说明 |
|------|------|---------|
| 调制 | Modulation | 数据加载到载波 |
| 带宽 | Bandwidth | 频率范围 |
| 波特率 | Baud Rate | 符号变化率 |
| 比特率 | Bit Rate | 数据传输率 |
| 多路复用 | Multiplexing | 共享信道 |
| 信噪比 | SNR | 信号与噪声比 |

---

## 参考资料与复核

1. [Physical Layer Concepts](https://www.geeksforgeeks.org/physical-layer-in-osi-model/) - 详细教程
2. [Modulation Techniques](https://en.wikipedia.org/wiki/Modulation) - Wikipedia
3. [Shannon-Hartley Theorem](https://en.wikipedia.org/wiki/Shannon%E2%80%93Hartley_theorem) - 香农定理

**复核日期建议：**
- 首次学习后1天：计算不同场景的信道容量
- 首次学习后7天：研究WiFi调制方式
- 首次学习后30天：分析5G物理层技术

---

*本章完。下一章将探讨数据链路层。*
