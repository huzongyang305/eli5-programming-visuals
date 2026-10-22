# 第三章：数据链路层——本地配送卡车

## 本节知识框架

### 学习目标
- 理解MAC地址的作用和格式
- 掌握以太网帧结构
- 了解差错检测机制（CRC）
- 能够说明CSMA/CD的工作原理

### 前置知识
- 物理层的基本概念（第二章）
- 二进制运算
- 概率基础

### 复习清单
- [ ] 能解释MAC地址的格式
- [ ] 能画出以太网帧结构
- [ ] 能计算CRC校验码
- [ ] 能说明冲突检测的过程

---

## 核心概念定义

| 术语 | 定义 | 类比 |
|------|------|------|
| **MAC地址** | 网卡的物理地址，48位唯一标识 | 卡车的车牌号 |
| **帧 (Frame)** | 数据链路层的传输单位 | 配送的包裹 |
| **以太网** | 最常用的局域网技术 | 标准的配送系统 |
| **CRC** | 循环冗余校验，差错检测 | 包裹的封条验证 |
| **CSMA/CD** | 载波监听多路访问/冲突检测 | 路口交通规则 |
| **交换机** | 根据MAC地址转发帧的设备 | 智能分拣中心 |
| **广播域** | 广播帧能到达的范围 | 喇叭能听到的区域 |
| **VLAN** | 虚拟局域网，逻辑隔离 | 专用配送通道 |
| **MTU** | 最大传输单元 | 包裹最大尺寸 |
| **碰撞** | 多个设备同时发送导致冲突 | 两车在路口相撞 |

---

## 原理与运行机制

### 生活中的类比：本地配送系统

```
社区配送场景：

┌─────────────────────────────────────┐
│         社区街道（局域网）             │
│                                     │
│  住户A 🏠    住户B 🏠    住户C 🏠    │
│   MAC:A1      MAC:B2      MAC:C3    │
│     \           |           /       │
│      \          |          /        │
│       └───── 交换机 ──────┘         │
│          (智能分拣中心)              │
│                                     │
│  配送规则：                          │
│  1. 每个包裹有收件人地址(MAC)        │
│  2. 交换机查看地址，送到对应住户      │
│  3. 如果地址未知，广播询问            │
│  4. 收到包裹后检查封条(CRC)          │
└─────────────────────────────────────┘
```

### MAC地址

```
MAC地址格式（48位 = 6字节）：

示例：00:1A:2B:3C:4D:5E

┌────────┬──────────┐
│ 前24位  │ 后24位    │
│ OUI     │ NIC特定  │
│ (厂商标识)│ (网卡序列)│
└────────┴──────────┘

特点：
- 全球唯一（理论上）
- 固化在网卡中
- 十六进制表示
- 广播地址：FF:FF:FF:FF:FF:FF

特殊地址：
- 单播：第一位为0
- 组播：第一位为1
- 广播：全1
```

### 以太网帧结构

```
以太网II帧（最常用）：

┌────────┬────────┬──────┬────────────┬──────┐
│目标MAC │源MAC   │类型  │ 数据       │FCS   │
│(6字节) │(6字节) │(2字节)│(46-1500字节)│(4字节)│
└────────┴────────┴──────┴────────────┴──────┘

总长度：64-1518字节

各字段含义：
- 目标MAC：接收方地址
- 源MAC：发送方地址
- 类型：上层协议（0x0800=IP，0x0806=ARP）
- 数据：实际载荷（最少46字节，不足填充）
- FCS：帧检验序列（CRC校验）

最小帧长64字节的原因：
确保发送方能检测到冲突（CSMA/CD要求）
```

### CRC校验

```
CRC（循环冗余校验）原理：

发送方：
1. 数据看作多项式D(x)
2. 除以生成多项式G(x)
3. 余数作为FCS附加到数据后

接收方：
1. 收到的数据除以G(x)
2. 余数为0 → 无错误
3. 余数非0 → 有错误，丢弃帧

示例（简化）：
数据：110101
生成多项式：x³ + x + 1 = 1011

110101000 ÷ 1011 = 111 ... 余数 011
FCS = 011
发送：110101011

优势：
- 检测突发错误能力强
- 实现简单（硬件移位寄存器）
- 检错率高（>99.99%）
```

### CSMA/CD协议

```
工作原理（以太网的"交通规则"）：

1. 载波监听（Carrier Sense）
   - 发送前先听信道是否空闲
   - 类似开车前看路口有无车辆

2. 多路访问（Multiple Access）
   - 多个设备共享同一信道
   - 类似多辆车共用一条路

3. 冲突检测（Collision Detection）
   - 发送时继续监听
   - 发现冲突立即停止
   - 发送阻塞信号通知其他设备

4. 退避算法
   - 等待随机时间后重试
   - 第n次冲突：从[0, 2^n-1]中选随机数
   - 最多重试16次

时序图：
时刻0: A开始发送
时刻1: B也开始发送 → 冲突！
时刻2: A和B都检测到冲突，停止发送
时刻3: A等待3个时隙，B等待7个时隙
时刻6: A重传成功
时刻10: B重传成功
```

### 交换机工作原理

```
交换机 vs 集线器：

集线器（Hub）：
- 物理层设备
- 收到信号就广播到所有端口
- 所有设备在同一冲突域
- 效率低，已淘汰

交换机（Switch）：
- 数据链路层设备
- 维护MAC地址表
- 只转发到目标端口
- 每个端口独立冲突域

MAC地址表学习过程：
1. 初始状态：表为空
2. A发给B：交换机记录"A在端口1"
3. B回复A：交换机记录"B在端口2"
4. 后续A→B：直接转发到端口2

优势：
- 减少不必要的流量
- 提高网络效率
- 支持全双工通信
```

---

## 典型应用场景

| 技术 | 应用场景 | 优势 |
|------|---------|------|
| 以太网 | 局域网 | 成熟、便宜、高速 |
| VLAN | 部门隔离 | 安全、管理方便 |
| 链路聚合 | 增加带宽 | 负载均衡、冗余 |
| STP | 防止环路 | 网络稳定 |
| PoE | IP电话、摄像头 | 一根线供电+数据 |

---

## 代码示例

### C++完整实现：CRC校验和帧处理

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <bitset>
#include <random>

// MAC地址类
class MACAddress {
private:
    uint8_t bytes[6];
    
public:
    MACAddress(const std::string& mac_str) {
        // 解析 "00:1A:2B:3C:4D:5E" 格式
        unsigned int vals[6];
        sscanf(mac_str.c_str(), "%02X:%02X:%02X:%02X:%02X:%02X",
               &vals[0], &vals[1], &vals[2], 
               &vals[3], &vals[4], &vals[5]);
        
        for (int i = 0; i < 6; i++) {
            bytes[i] = static_cast<uint8_t>(vals[i]);
        }
    }
    
    bool isBroadcast() const {
        for (int i = 0; i < 6; i++) {
            if (bytes[i] != 0xFF) return false;
        }
        return true;
    }
    
    std::string toString() const {
        char buf[18];
        snprintf(buf, sizeof(buf), "%02X:%02X:%02X:%02X:%02X:%02X",
                bytes[0], bytes[1], bytes[2],
                bytes[3], bytes[4], bytes[5]);
        return std::string(buf);
    }
    
    bool operator==(const MACAddress& other) const {
        return memcmp(bytes, other.bytes, 6) == 0;
    }
};

// 以太网帧
class EthernetFrame {
private:
    MACAddress dest_mac;
    MACAddress src_mac;
    uint16_t ether_type;
    std::vector<uint8_t> payload;
    uint32_t fcs;
    
public:
    EthernetFrame(const MACAddress& dest, const MACAddress& src,
                 uint16_t type, const std::vector<uint8_t>& data)
        : dest_mac(dest), src_mac(src), ether_type(type), payload(data) {
        
        // 确保最小帧长
        if (payload.size() < 46) {
            payload.resize(46, 0); // 填充
        }
        
        // 计算FCS
        fcs = calculateCRC();
    }
    
    // CRC32计算（简化版）
    uint32_t calculateCRC() const {
        uint32_t crc = 0xFFFFFFFF;
        
        // 对头部和数据计算CRC
        std::vector<uint8_t> frame_data;
        
        // 添加MAC地址和类型
        // 简化：这里只用payload计算
        for (uint8_t byte : payload) {
            crc ^= byte;
            for (int j = 0; j < 8; j++) {
                if (crc & 1) {
                    crc = (crc >> 1) ^ 0xEDB88320;
                } else {
                    crc >>= 1;
                }
            }
        }
        
        return crc ^ 0xFFFFFFFF;
    }
    
    // 验证FCS
    bool verifyCRC() const {
        uint32_t calculated = calculateCRC();
        return calculated == fcs;
    }
    
    // 模拟比特错误
    void introduceError() {
        if (!payload.empty()) {
            int pos = rand() % payload.size();
            payload[pos] ^= 0x01; // 翻转最低位
        }
    }
    
    void displayInfo() const {
        std::cout << "\n=== 以太网帧信息 ===" << std::endl;
        std::cout << "目标MAC: " << dest_mac.toString() << std::endl;
        std::cout << "源MAC: " << src_mac.toString() << std::endl;
        std::cout << "类型: 0x" << std::hex << ether_type << std::dec << std::endl;
        std::cout << "载荷大小: " << payload.size() << "字节" << std::endl;
        std::cout << "FCS: 0x" << std::hex << fcs << std::dec << std::endl;
        std::cout << "CRC验证: " << (verifyCRC() ? "通过" : "失败") << std::endl;
    }
    
    size_t getTotalSize() const {
        return 6 + 6 + 2 + payload.size() + 4; // MACs + Type + Payload + FCS
    }
};

// CSMA/CD模拟器
class CSMA_CD_Simulator {
private:
    bool channel_busy;
    int collision_count;
    
public:
    CSMA_CD_Simulator() : channel_busy(false), collision_count(0) {}
    
    bool attemptTransmission(int station_id, int max_retries = 16) {
        std::cout << "\n站点" << station_id << " 尝试发送..." << std::endl;
        
        for (int retry = 0; retry < max_retries; retry++) {
            // 1. 载波监听
            if (channel_busy) {
                std::cout << "  信道忙，等待..." << std::endl;
                continue;
            }
            
            // 2. 开始发送
            std::cout << "  开始发送..." << std::endl;
            channel_busy = true;
            
            // 3. 模拟冲突检测（50%概率冲突）
            if (rand() % 2 == 0 && retry < 3) {
                std::cout << "  检测到冲突！" << std::endl;
                channel_busy = false;
                collision_count++;
                
                // 4. 指数退避
                int backoff_slots = rand() % (1 << std::min(retry, 10));
                std::cout << "  退避 " << backoff_slots << " 个时隙" << std::endl;
                
                continue;
            }
            
            // 发送成功
            std::cout << "  发送成功！" << std::endl;
            channel_busy = false;
            return true;
        }
        
        std::cout << "  超过最大重试次数，放弃发送" << std::endl;
        return false;
    }
    
    int getCollisionCount() const { return collision_count; }
};

// 交换机MAC地址表
class SwitchMACtable {
private:
    std::unordered_map<std::string, int> mac_to_port;
    
public:
    void learnMAC(const std::string& mac, int port) {
        mac_to_port[mac] = port;
        std::cout << "学习到: MAC " << mac << " 在端口 " << port << std::endl;
    }
    
    int lookupPort(const std::string& mac) const {
        auto it = mac_to_port.find(mac);
        if (it != mac_to_port.end()) {
            return it->second;
        }
        return -1; // 未知，需要广播
    }
    
    void displayTable() const {
        std::cout << "\n=== MAC地址表 ===" << std::endl;
        for (const auto& pair : mac_to_port) {
            std::cout << pair.first << " → 端口 " << pair.second << std::endl;
        }
    }
};

int main() {
    std::cout << "数据链路层演示" << std::endl;
    std::cout << "==================" << std::endl;
    
    // 创建MAC地址
    MACAddress mac_a("00:1A:2B:3C:4D:5E");
    MACAddress mac_b("00:5E:4D:3C:2B:1A");
    MACAddress broadcast("FF:FF:FF:FF:FF:FF");
    
    std::cout << "\nMAC地址:" << std::endl;
    std::cout << "A: " << mac_a.toString() << std::endl;
    std::cout << "B: " << mac_b.toString() << std::endl;
    std::cout << "广播: " << broadcast.toString() << std::endl;
    std::cout << "是广播地址: " << (broadcast.isBroadcast() ? "是" : "否") << std::endl;
    
    // 创建以太网帧
    std::vector<uint8_t> data = {'H', 'e', 'l', 'l', 'o'};
    EthernetFrame frame(mac_b, mac_a, 0x0800, data);
    frame.displayInfo();
    std::cout << "帧总大小: " << frame.getTotalSize() << "字节" << std::endl;
    
    // 测试CRC
    std::cout << "\n=== CRC校验测试 ===" << std::endl;
    std::cout << "原始帧CRC: " << (frame.verifyCRC() ? "通过" : "失败") << std::endl;
    
    frame.introduceError();
    std::cout << "引入错误后CRC: " << (frame.verifyCRC() ? "通过" : "失败") << std::endl;
    
    // CSMA/CD模拟
    std::cout << "\n=== CSMA/CD模拟 ===" << std::endl;
    CSMA_CD_Simulator csma_cd;
    
    for (int i = 1; i <= 5; i++) {
        csma_cd.attemptTransmission(i);
    }
    
    std::cout << "\n总冲突次数: " << csma_cd.getCollisionCount() << std::endl;
    
    // 交换机MAC表
    std::cout << "\n=== 交换机MAC地址表 ===" << std::endl;
    SwitchMACtable table;
    table.learnMAC("00:1A:2B:3C:4D:5E", 1);
    table.learnMAC("00:5E:4D:3C:2B:1A", 2);
    table.learnMAC("00:AA:BB:CC:DD:EE", 3);
    table.displayTable();
    
    std::cout << "\n查找端口: " << table.lookupPort("00:1A:2B:3C:4D:5E") << std::endl;
    std::cout << "查找未知MAC: " << table.lookupPort("FF:FF:FF:FF:FF:FF") << std::endl;
    
    return 0;
}
```

编译命令：`g++ -std=c++17 03_data_link.cpp -o data_link`

### Java完整实现：以太网帧分析

```java
import java.util.*;

// MAC地址
class MACAddress {
    private final String address;
    
    public MACAddress(String address) {
        this.address = address.toUpperCase();
    }
    
    public boolean isBroadcast() {
        return address.equals("FF:FF:FF:FF:FF:FF");
    }
    
    public boolean isMulticast() {
        String firstByte = address.split(":")[0];
        int value = Integer.parseInt(firstByte, 16);
        return (value & 0x01) == 1;
    }
    
    @Override
    public String toString() {
        return address;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof MACAddress)) return false;
        return address.equals(((MACAddress) obj).address);
    }
    
    @Override
    public int hashCode() {
        return address.hashCode();
    }
}

// 以太网帧
class EthernetFrame {
    private MACAddress destMAC;
    private MACAddress srcMAC;
    private int etherType;
    private byte[] payload;
    private long fcs;
    
    public EthernetFrame(MACAddress dest, MACAddress src, int type, byte[] data) {
        this.destMAC = dest;
        this.srcMAC = src;
        this.etherType = type;
        
        // 最小载荷46字节
        if (data.length < 46) {
            this.payload = Arrays.copyOf(data, 46);
        } else {
            this.payload = data.clone();
        }
        
        this.fcs = calculateCRC();
    }
    
    private long calculateCRC() {
        // 简化的CRC计算
        long crc = 0xFFFFFFFFL;
        for (byte b : payload) {
            crc ^= (b & 0xFF);
            for (int j = 0; j < 8; j++) {
                if ((crc & 1) != 0) {
                    crc = (crc >>> 1) ^ 0xEDB88320L;
                } else {
                    crc >>>= 1;
                }
            }
        }
        return crc ^ 0xFFFFFFFFL;
    }
    
    public boolean verifyCRC() {
        return calculateCRC() == fcs;
    }
    
    public void introduceError() {
        if (payload.length > 0) {
            int pos = new Random().nextInt(payload.length);
            payload[pos] ^= 0x01;
        }
    }
    
    public int getTotalSize() {
        return 6 + 6 + 2 + payload.length + 4;
    }
    
    public void displayInfo() {
        System.out.println("\n=== 以太网帧信息 ===");
        System.out.println("目标MAC: " + destMAC);
        System.out.println("源MAC: " + srcMAC);
        System.out.printf("类型: 0x%04X%n", etherType);
        System.out.println("载荷大小: " + payload.length + "字节");
        System.out.printf("FCS: 0x%08X%n", fcs);
        System.out.println("CRC验证: " + (verifyCRC() ? "通过" : "失败"));
    }
}

// 交换机
class EthernetSwitch {
    private Map<MACAddress, Integer> macTable;
    private int portCount;
    
    public EthernetSwitch(int ports) {
        this.portCount = ports;
        this.macTable = new HashMap<>();
    }
    
    public void learnMAC(MACAddress mac, int port) {
        macTable.put(mac, port);
        System.out.println("学习MAC: " + mac + " → 端口" + port);
    }
    
    public int forwardFrame(EthernetFrame frame) {
        MACAddress dest = frame.getDestMAC();
        
        if (dest.isBroadcast()) {
            System.out.println("广播帧：泛洪到所有端口");
            return -1; // 广播
        }
        
        Integer port = macTable.get(dest);
        if (port != null) {
            System.out.println("单播帧：转发到端口" + port);
            return port;
        } else {
            System.out.println("未知目标：泛洪查询");
            return -1; // 未知，泛洪
        }
    }
    
    public void displayTable() {
        System.out.println("\n=== MAC地址表 ===");
        for (Map.Entry<MACAddress, Integer> entry : macTable.entrySet()) {
            System.out.println(entry.getKey() + " → 端口" + entry.getValue());
        }
    }
}

public class DataLinkLayerDemo {
    
    public static void demonstrateFrameAnalysis() {
        System.out.println("\n=== 以太网帧分析 ===");
        
        MACAddress mac1 = new MACAddress("00:1A:2B:3C:4D:5E");
        MACAddress mac2 = new MACAddress("00:5E:4D:3C:2B:1A");
        MACAddress broadcast = new MACAddress("FF:FF:FF:FF:FF:FF");
        
        System.out.println("MAC地址特性:");
        System.out.println("MAC1: " + mac1);
        System.out.println("  是广播: " + mac1.isBroadcast());
        System.out.println("  是组播: " + mac1.isMulticast());
        
        System.out.println("\n广播地址: " + broadcast);
        System.out.println("  是广播: " + broadcast.isBroadcast());
        
        // 创建帧
        byte[] data = "Hello".getBytes();
        EthernetFrame frame = new EthernetFrame(mac2, mac1, 0x0800, data);
        frame.displayInfo();
        System.out.println("帧总大小: " + frame.getTotalSize() + "字节");
        
        // 测试错误检测
        System.out.println("\n引入错误前: " + (frame.verifyCRC() ? "通过" : "失败"));
        frame.introduceError();
        System.out.println("引入错误后: " + (frame.verifyCRC() ? "通过" : "失败"));
    }
    
    public static void demonstrateSwitchOperation() {
        System.out.println("\n=== 交换机操作演示 ===");
        
        EthernetSwitch switch1 = new EthernetSwitch(8);
        
        MACAddress mac1 = new MACAddress("00:11:22:33:44:55");
        MACAddress mac2 = new MACAddress("00:AA:BB:CC:DD:EE");
        MACAddress mac3 = new MACAddress("00:FF:EE:DD:CC:BB");
        
        // 学习MAC地址
        switch1.learnMAC(mac1, 1);
        switch1.learnMAC(mac2, 2);
        switch1.learnMAC(mac3, 3);
        
        switch1.displayTable();
        
        // 转发帧
        System.out.println("\n转发测试:");
        EthernetFrame frame1 = new EthernetFrame(mac2, mac1, 0x0800, "Test".getBytes());
        switch1.forwardFrame(frame1);
        
        EthernetFrame frame2 = new EthernetFrame(
            new MACAddress("FF:FF:FF:FF:FF:FF"), mac1, 0x0806, new byte[46]);
        switch1.forwardFrame(frame2);
    }
    
    public static void compareHubAndSwitch() {
        System.out.println("\n=== 集线器 vs 交换机 ===\n");
        
        System.out.println("集线器 (Hub):");
        System.out.println("- 工作层次: 物理层");
        System.out.println("- 转发方式: 广播到所有端口");
        System.out.println("- 冲突域: 所有端口在同一冲突域");
        System.out.println("- 带宽: 共享带宽");
        System.out.println("- 安全性: 低（可嗅探所有流量）");
        
        System.out.println("\n交换机 (Switch):");
        System.out.println("- 工作层次: 数据链路层");
        System.out.println("- 转发方式: 根据MAC表定向转发");
        System.out.println("- 冲突域: 每个端口独立冲突域");
        System.out.println("- 带宽: 独占带宽");
        System.out.println("- 安全性: 较高（只能看到相关流量）");
        
        System.out.println("\n性能对比:");
        System.out.println("10台设备，100Mbps:");
        System.out.println("  集线器: 总带宽100Mbps，平均每台10Mbps");
        System.out.println("  交换机: 每台100Mbps，总带宽1000Mbps");
    }
    
    public static void main(String[] args) {
        System.out.println("数据链路层演示");
        System.out.println("==============");
        
        demonstrateFrameAnalysis();
        demonstrateSwitchOperation();
        compareHubAndSwitch();
        
        System.out.println("\n所有演示完成");
    }
}
```

编译命令：`javac DataLinkLayerDemo.java && java DataLinkLayerDemo`

---

## 复杂度或性能分析

| 特性 | 集线器 | 交换机 |
|------|--------|--------|
| 转发延迟 | 低（~1微秒） | 中（~10微秒） |
| 带宽利用 | 共享 | 独占 |
| 冲突处理 | CSMA/CD | 无冲突（全双工） |
| 成本 | 低 | 中 |
| 适用场景 | 小型网络 | 中大型网络 |

---

## 常见误区与易错点

| 错误/现象 | 原因 | 解决方案 |
|----------|------|---------|
| 混淆MAC和IP地址 | 层次不同 | MAC是物理地址，IP是逻辑地址 |
| 认为交换机无冲突 | 半双工仍有冲突 | 全双工才无冲突 |
| CRC能纠正错误 | CRC只能检测 | 需要重传机制纠错 |
| 帧越小越好 | 过小效率低 | 遵循MTU规范 |
| 忽视广播风暴 | 环路导致 | 使用STP防止环路 |
| MAC地址可随意改 | 实际可修改但不应 | 保持唯一性 |

---

## 与其他知识点的关系

- **与网络层的关系**：MAC地址用于局域网，IP地址用于互联网
- **与ARP的关系**：ARP映射IP到MAC
- **与VLAN的关系**：VLAN基于MAC或端口划分
- **与无线的关系**：WiFi也用MAC地址，但用CSMA/CA

---

## 自测题与参考答案

### 问题1：以太网帧的最小长度是多少？
A. 46字节  
B. 64字节  
C. 1500字节  
D. 1518字节

**答案：B**

**解析：** 以太网帧最小64字节（包括14字节头部+46字节最小载荷+4字节FCS）。这是为了确保CSMA/CD能正确检测冲突。如果帧太短，发送方可能在检测到冲突前就完成了发送。

### 问题2：交换机的MAC地址表是如何建立的？
A. 手动配置  
B. 自动学习源MAC地址  
C. 从路由器获取  
D. 广播查询

**答案：B**

**解析：** 交换机通过观察进入帧的源MAC地址和进入端口来自动建立MAC地址表。当收到一个帧时，交换机会记录"这个MAC地址在这个端口上"。这个过程称为自学习，无需手动配置。

### 问题3：CRC校验的主要作用是什么？
A. 加密数据  
B. 检测传输错误  
C. 压缩数据  
D. 路由选择

**答案：B**

**解析：** CRC（循环冗余校验）用于检测数据传输过程中的错误。发送方计算数据的CRC值并附加到帧尾，接收方重新计算并比较。如果不匹配，说明数据在传输中被破坏，接收方会丢弃该帧。CRC不能纠正错误，也不能加密或压缩数据。

---

## 考点精讲

### 考点1：CSMA/CD的工作流程

**核心要点：**
1. **先听后发**：发送前监听信道
2. **边发边听**：发送时继续检测冲突
3. **冲突停发**：发现冲突立即停止
4. **随机退避**：等待随机时间后重试

**面试常见问题：**
> Q: 为什么以太网有最小帧长限制？  
> A: 最小帧长（64字节）确保发送方在发送完整个帧之前能检测到可能发生的冲突。如果帧太短，可能在冲突信号返回前就发送完了，导致无法检测冲突。计算公式：最小帧长 = 2 × 传播延迟 × 数据传输速率。

### 考点2：交换机vs集线器

**核心要点：**
1. **工作层次**：交换机在链路层，集线器在物理层
2. **转发方式**：交换机智能转发，集线器广播
3. **冲突域**：交换机分割冲突域，集线器不分割

**面试常见问题：**
> Q: 为什么现代网络都用交换机而不用集线器？  
> A: 交换机提供更高的性能和安全性：1) 每个端口独立带宽；2) 减少不必要的流量；3) 支持全双工通信；4) 更好的安全性。集线器所有设备共享带宽且能互相嗅探，已被淘汰。

### 考点3：VLAN的作用

**核心要点：**
1. **逻辑隔离**：不同VLAN不能直接通信
2. **广播控制**：限制广播域范围
3. **安全管理**：按部门或功能划分

**面试常见问题：**
> Q: VLAN和普通子网有什么区别？  
> A: VLAN是在数据链路层实现的逻辑隔离，即使设备在同一交换机上，不同VLAN也无法直接通信。子网是网络层的概念。VLAN更灵活，可以跨越多个交换机，且不依赖IP地址配置。要实现VLAN间通信，需要三层设备（路由器或三层交换机）。

---

## 术语速查

| 术语 | 英文 | 简要说明 |
|------|------|---------|
| MAC地址 | MAC Address | 物理地址 |
| 帧 | Frame | 链路层数据单元 |
| CRC | Cyclic Redundancy Check | 循环冗余校验 |
| CSMA/CD | Carrier Sense Multiple Access with Collision Detection | 载波监听冲突检测 |
| 交换机 | Switch | 智能转发设备 |
| VLAN | Virtual LAN | 虚拟局域网 |

---

## 参考资料与复核

1. [Ethernet Frame Structure](https://www.geeksforgeeks.org/ethernet-frame-format/) - 详细教程
2. [CSMA/CD Protocol](https://en.wikipedia.org/wiki/Carrier-sense_multiple_access_with_collision_detection) - Wikipedia
3. [Switch vs Hub](https://www.cisco.com/c/en/us/products/switches/lan-access-switches/index.html) - Cisco文档

**复核日期建议：**
- 首次学习后1天：计算CRC校验码
- 首次学习后7天：用Wireshark分析以太网帧
- 首次学习后30天：研究交换机配置

---

*本章完。下一章将探讨网络层。*
