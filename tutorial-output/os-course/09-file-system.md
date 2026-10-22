# 第九章：文件系统——仓库库存管理系统

## 本节知识框架

### 学习目标
- 理解inode的结构和作用
- 掌握目录树的组织方式
- 了解三种文件分配方法的优缺点
- 能够计算文件的磁盘占用空间

### 前置知识
- 磁盘存储的基本概念
- 树形数据结构
- 链表和数组

### 复习清单
- [ ] 能解释什么是inode
- [ ] 能画出目录树结构
- [ ] 能说明连续、链接、索引分配的区别
- [ ] 能计算文件大小对应的块数

---

## 核心概念定义

| 术语 | 定义 | 类比 |
|------|------|------|
| **inode** | 文件的元数据记录 | 商品的库存卡片 |
| **目录** | 文件名到inode的映射 | 货架标签 |
| **文件分配** | 文件数据在磁盘上的存储方式 | 商品在仓库的摆放方式 |
| **连续分配** | 文件占用连续的磁盘块 | 商品放在相邻货架 |
| **链接分配** | 文件块通过指针链接 | 寻宝游戏的线索链 |
| **索引分配** | 使用索引块记录文件块位置 | 仓库的索引目录 |
| **硬链接** | 多个目录项指向同一inode | 同一商品有多个标签 |
| **软链接** | 特殊文件指向另一个文件路径 | 指示牌指向其他区域 |
| **超级块** | 文件系统的元信息 | 仓库的总体布局图 |
| **块大小** | 磁盘分配的最小单位 | 标准货箱尺寸 |
| **碎片** | 未充分利用的磁盘空间 | 货架上的空隙 |

---

## 原理与运行机制

### 生活中的类比：仓库管理系统

```
大型仓库结构：

┌─────────────────────────────────────┐
│         仓库总览                     │
│                                     │
│  入口大厅（超级块）                   │
│  - 仓库容量                          │
│  - 已用空间                          │
│  - 空闲空间                          │
│                                     │
│  索引室（inode表）                   │
│  - 每个商品一张卡片                  │
│  - 记录：大小、位置、权限            │
│                                     │
│  货架区（数据块）                    │
│  - 标准货箱（4KB/块）                │
│  - 商品存放在货箱中                  │
│                                     │
│  导视牌（目录）                      │
│  - 商品名 → 卡片编号                 │
└─────────────────────────────────────┘
```

### inode结构

```
inode包含文件的元数据（不包含文件名）：

┌─────────────────────────────┐
│        inode                │
├─────────────────────────────┤
│  文件类型                   │ ← 普通文件/目录/链接等
├─────────────────────────────┤
│  权限                       │ ← rwxrwxrwx
├─────────────────────────────┤
│  所有者/组                  │ ← uid/gid
├─────────────────────────────┤
│  文件大小                   │ ← 字节数
├─────────────────────────────┤
│  时间戳                     │ ← 创建/修改/访问时间
├─────────────────────────────┤
│  链接计数                   │ ← 硬链接数量
├─────────────────────────────┤
│  直接指针 (12个)            │ ← 直接指向数据块
├─────────────────────────────┤
│  一级间接指针 (1个)         │ ← 指向索引块
├─────────────────────────────┤
│  二级间接指针 (1个)         │ ← 指向索引块的索引
├─────────────────────────────┤
│  三级间接指针 (1个)         │ ← 三层索引
└─────────────────────────────┘

优势：
- 小文件：直接用直接指针，快速访问
- 中等文件：用一级间接，支持更大文件
- 大文件：用二级/三级间接，支持超大文件
```

### 目录结构

```
目录是特殊的文件，包含文件名到inode号的映射：

根目录 /
├── home/ (inode 100)
│   ├── user1/ (inode 200)
│   │   ├── document.txt (inode 301)
│   │   └── photo.jpg (inode 302)
│   └── user2/ (inode 201)
│       └── code.cpp (inode 401)
├── etc/ (inode 101)
│   └── passwd (inode 501)
└── var/ (inode 102)
    └── log/ (inode 600)
        └── syslog (inode 701)

目录文件内容示例（/home/user1）：
┌──────────────┬─────────┐
│   文件名      │ inode号  │
├──────────────┼─────────┤
│ .            │ 200     │ ← 当前目录
│ ..           │ 100     │ ← 父目录
│ document.txt │ 301     │
│ photo.jpg    │ 302     │
└──────────────┴─────────┘
```

### 文件分配方法

#### 1. 连续分配

```
文件占据连续的磁盘块：

磁盘布局：
[块0][块1][块2][块3][块4][块5][块6][块7]
 [A   ][A   ][A   ][B ][C ][C ][C ][C ]
 文件A  文件B  文件C（不连续！问题）

优点：
- 顺序访问快（磁头移动少）
- 实现简单

缺点：
- 外部碎片严重
- 文件难以扩展
- 需要预知文件大小
```

#### 2. 链接分配

```
文件块通过指针链接：

文件A的数据：
块5 → 块8 → 块12 → 块3 → NULL

磁盘布局：
[块0][块1][块2][块3][块4][块5][块6][块7][块8]...
 [D ][E ][F ][A尾][G ][A头][H ][I ][A   ]

优点：
- 无外部碎片
- 文件易于扩展

缺点：
- 随机访问慢（需遍历链表）
- 指针占用空间
- 可靠性差（指针损坏则文件丢失）
```

#### 3. 索引分配

```
使用索引块记录所有数据块的位置：

文件A的索引块：
┌────┬────┬────┬────┬────┐
│ 5  │ 8  │ 12 │ 3  │NULL│
└────┴────┴────┴────┴────┘

数据块：块5, 块8, 块12, 块3

优点：
- 支持随机访问
- 无外部碎片
- 文件易于扩展

缺点：
- 索引块占用空间
- 大文件需要多级索引
```

---

## 典型应用场景

| 分配方法 | 适用场景 | 优点 | 缺点 |
|---------|---------|------|------|
| 连续分配 | DVD/CD文件系统 | 顺序访问快 | 碎片严重 |
| 链接分配 | 早期文件系统 | 实现简单 | 随机访问慢 |
| 索引分配 | 现代文件系统(EXT4, NTFS) | 灵活高效 | 实现复杂 |
| 混合方式 | EXT4( extents) | 兼顾性能 | 复杂 |

---

## 代码示例

### C++完整实现：简单文件系统模拟

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <memory>
#include <ctime>

// 文件类型枚举
enum class FileType {
    REGULAR,    // 普通文件
    DIRECTORY,  // 目录
    LINK        // 链接
};

// inode结构
struct Inode {
    int inode_number;
    FileType type;
    std::string permissions;
    int owner_id;
    int group_id;
    long file_size;
    time_t create_time;
    time_t modify_time;
    int link_count;
    
    // 指针数组（简化：只存块号）
    std::vector<int> direct_blocks;
    std::vector<int> indirect_blocks;
    
    Inode(int num, FileType t)
        : inode_number(num), type(t), permissions("rw-r--r--"),
          owner_id(1000), group_id(1000), file_size(0),
          link_count(1) {
        time(&create_time);
        modify_time = create_time;
    }
};

// 目录项
struct DirEntry {
    std::string name;
    int inode_number;
    
    DirEntry(const std::string& n, int inum) : name(n), inode_number(inum) {}
};

// 文件系统类
class SimpleFileSystem {
private:
    const int BLOCK_SIZE = 4096; // 4KB
    const int TOTAL_BLOCKS = 1024;
    
    std::vector<Inode*> inodes;
    std::vector<bool> block_usage;
    std::unordered_map<int, std::vector<DirEntry>> directories;
    int next_inode_number;
    
public:
    SimpleFileSystem() : block_usage(TOTAL_BLOCKS, false), next_inode_number(1) {
        // 创建根目录
        Inode* root = new Inode(next_inode_number++, FileType::DIRECTORY);
        inodes.push_back(root);
        
        // 根目录包含.和..
        std::vector<DirEntry> root_entries;
        root_entries.emplace_back(".", root->inode_number);
        root_entries.emplace_back("..", root->inode_number);
        directories[root->inode_number] = root_entries;
    }
    
    ~SimpleFileSystem() {
        for (auto inode : inodes) {
            delete inode;
        }
    }
    
    // 创建文件
    int createFile(const std::string& path, const std::string& filename, long size) {
        // 找到父目录
        int parent_inode = findDirectory(path);
        if (parent_inode == -1) {
            std::cout << "错误：目录不存在" << std::endl;
            return -1;
        }
        
        // 检查文件是否已存在
        auto& entries = directories[parent_inode];
        for (const auto& entry : entries) {
            if (entry.name == filename) {
                std::cout << "错误：文件已存在" << std::endl;
                return -1;
            }
        }
        
        // 创建新inode
        Inode* new_file = new Inode(next_inode_number++, FileType::REGULAR);
        new_file->file_size = size;
        inodes.push_back(new_file);
        
        // 分配数据块（索引分配）
        int blocks_needed = (size + BLOCK_SIZE - 1) / BLOCK_SIZE;
        allocateBlocks(new_file, blocks_needed);
        
        // 添加到父目录
        entries.emplace_back(filename, new_file->inode_number);
        
        std::cout << "创建文件: " << path << "/" << filename 
                  << " (大小: " << size << "字节, 块数: " << blocks_needed << ")" << std::endl;
        
        return new_file->inode_number;
    }
    
    // 创建目录
    int createDirectory(const std::string& path, const std::string& dirname) {
        int parent_inode = findDirectory(path);
        if (parent_inode == -1) {
            std::cout << "错误：目录不存在" << std::endl;
            return -1;
        }
        
        // 创建新目录inode
        Inode* new_dir = new Inode(next_inode_number++, FileType::DIRECTORY);
        inodes.push_back(new_dir);
        
        // 初始化目录内容
        std::vector<DirEntry> dir_entries;
        dir_entries.emplace_back(".", new_dir->inode_number);
        dir_entries.emplace_back("..", parent_inode);
        directories[new_dir->inode_number] = dir_entries;
        
        // 添加到父目录
        auto& parent_entries = directories[parent_inode];
        parent_entries.emplace_back(dirname, new_dir->inode_number);
        
        std::cout << "创建目录: " << path << "/" << dirname << std::endl;
        
        return new_dir->inode_number;
    }
    
    // 创建硬链接
    bool createHardLink(const std::string& src_path, const std::string& src_file,
                       const std::string& dst_path, const std::string& dst_file) {
        int src_dir = findDirectory(src_path);
        int dst_dir = findDirectory(dst_path);
        
        if (src_dir == -1 || dst_dir == -1) {
            std::cout << "错误：目录不存在" << std::endl;
            return false;
        }
        
        // 查找源文件inode
        int src_inode = -1;
        for (const auto& entry : directories[src_dir]) {
            if (entry.name == src_file) {
                src_inode = entry.inode_number;
                break;
            }
        }
        
        if (src_inode == -1) {
            std::cout << "错误：源文件不存在" << std::endl;
            return false;
        }
        
        // 添加硬链接
        directories[dst_dir].emplace_back(dst_file, src_inode);
        
        // 增加链接计数
        Inode* inode = findInode(src_inode);
        if (inode) {
            inode->link_count++;
        }
        
        std::cout << "创建硬链接: " << dst_path << "/" << dst_file 
                  << " → inode " << src_inode << std::endl;
        
        return true;
    }
    
    // 显示文件信息
    void displayFileInfo(const std::string& path, const std::string& filename) {
        int dir_inode = findDirectory(path);
        if (dir_inode == -1) {
            std::cout << "错误：目录不存在" << std::endl;
            return;
        }
        
        int file_inode = -1;
        for (const auto& entry : directories[dir_inode]) {
            if (entry.name == filename) {
                file_inode = entry.inode_number;
                break;
            }
        }
        
        if (file_inode == -1) {
            std::cout << "错误：文件不存在" << std::endl;
            return;
        }
        
        Inode* inode = findInode(file_inode);
        if (!inode) return;
        
        std::cout << "\n=== 文件信息 ===" << std::endl;
        std::cout << "文件名: " << filename << std::endl;
        std::cout << "Inode号: " << inode->inode_number << std::endl;
        std::cout << "类型: " << (inode->type == FileType::REGULAR ? "普通文件" : 
                                 inode->type == FileType::DIRECTORY ? "目录" : "链接") << std::endl;
        std::cout << "大小: " << inode->file_size << "字节" << std::endl;
        std::cout << "权限: " << inode->permissions << std::endl;
        std::cout << "链接数: " << inode->link_count << std::endl;
        std::cout << "数据块数: " << inode->direct_blocks.size() << std::endl;
    }
    
    // 显示文件系统状态
    void displayFileSystemStatus() {
        std::cout << "\n=== 文件系统状态 ===" << std::endl;
        
        int used_blocks = 0;
        for (bool used : block_usage) {
            if (used) used_blocks++;
        }
        
        std::cout << "总块数: " << TOTAL_BLOCKS << std::endl;
        std::cout << "已用块数: " << used_blocks << std::endl;
        std::cout << "空闲块数: " << (TOTAL_BLOCKS - used_blocks) << std::endl;
        std::cout << "利用率: " << (double)used_blocks / TOTAL_BLOCKS * 100 << "%" << std::endl;
        std::cout << "Inode总数: " << inodes.size() << std::endl;
    }
    
private:
    int findDirectory(const std::string& path) {
        if (path == "/") {
            return 1; // 根目录inode号
        }
        
        // 简化：假设路径格式为"/home/user1"
        // 实际实现需要解析路径
        for (const auto& pair : directories) {
            for (const auto& entry : pair.second) {
                if (entry.name == path.substr(1)) {
                    Inode* inode = findInode(entry.inode_number);
                    if (inode && inode->type == FileType::DIRECTORY) {
                        return entry.inode_number;
                    }
                }
            }
        }
        
        return -1;
    }
    
    Inode* findInode(int inode_number) {
        for (auto inode : inodes) {
            if (inode->inode_number == inode_number) {
                return inode;
            }
        }
        return nullptr;
    }
    
    void allocateBlocks(Inode* inode, int num_blocks) {
        for (int i = 0; i < TOTAL_BLOCKS && inode->direct_blocks.size() < num_blocks; i++) {
            if (!block_usage[i]) {
                block_usage[i] = true;
                inode->direct_blocks.push_back(i);
            }
        }
    }
};

// 演示不同分配方法的空间浪费
void demonstrateAllocationWaste() {
    std::cout << "\n=== 分配方法空间浪费比较 ===" << std::endl;
    
    int block_size = 4096; // 4KB
    
    std::vector<long> file_sizes = {100, 4096, 4097, 8192, 10000};
    
    std::cout << "文件大小\t连续分配\t链接分配\t索引分配" << std::endl;
    std::cout << "------------------------------------------------" << std::endl;
    
    for (long size : file_sizes) {
        int blocks_needed = (size + block_size - 1) / block_size;
        int allocated = blocks_needed * block_size;
        int waste = allocated - size;
        
        // 链接分配需要额外存储指针（假设4字节/指针）
        int link_overhead = blocks_needed * 4;
        
        // 索引分配需要一个索引块
        int index_overhead = (blocks_needed <= 12) ? 0 : block_size;
        
        std::cout << size << "\t\t" 
                  << waste << "(" << (double)waste/size*100 << "%)\t"
                  << link_overhead << "\t\t"
                  << index_overhead << std::endl;
    }
}

int main() {
    std::cout << "文件系统演示" << std::endl;
    std::cout << "==============" << std::endl;
    
    SimpleFileSystem fs;
    
    // 创建目录结构
    fs.createDirectory("/", "home");
    fs.createDirectory("/home", "user1");
    fs.createDirectory("/home", "user2");
    
    // 创建文件
    fs.createFile("/home/user1", "document.txt", 5000);
    fs.createFile("/home/user1", "photo.jpg", 100000);
    fs.createFile("/home/user2", "code.cpp", 2000);
    
    // 创建硬链接
    fs.createHardLink("/home/user1", "document.txt", "/home/user2", "doc_link.txt");
    
    // 显示文件信息
    fs.displayFileInfo("/home/user1", "document.txt");
    fs.displayFileInfo("/home/user2", "doc_link.txt");
    
    // 显示文件系统状态
    fs.displayFileSystemStatus();
    
    demonstrateAllocationWaste();
    
    return 0;
}
```

编译命令：`g++ -std=c++17 09_filesystem.cpp -o filesystem_demo`

### Java完整实现：目录树遍历

```java
import java.util.*;

// 文件节点
class FileNode {
    String name;
    boolean isDirectory;
    long size;
    List<FileNode> children;
    
    public FileNode(String name, boolean isDirectory, long size) {
        this.name = name;
        this.isDirectory = isDirectory;
        this.size = size;
        this.children = new ArrayList<>();
    }
    
    public void addChild(FileNode child) {
        children.add(child);
    }
}

// 文件系统模拟器
class FileSystemSimulator {
    private FileNode root;
    
    public FileSystemSimulator() {
        root = new FileNode("/", true, 0);
    }
    
    // 构建示例目录树
    public void buildSampleTree() {
        // /home
        FileNode home = new FileNode("home", true, 0);
        root.addChild(home);
        
        // /home/user1
        FileNode user1 = new FileNode("user1", true, 0);
        home.addChild(user1);
        
        user1.addChild(new FileNode("document.txt", false, 5000));
        user1.addChild(new FileNode("photo.jpg", false, 100000));
        
        // /home/user2
        FileNode user2 = new FileNode("user2", true, 0);
        home.addChild(user2);
        
        user2.addChild(new FileNode("code.cpp", false, 2000));
        user2.addChild(new FileNode("notes.md", false, 1500));
        
        // /etc
        FileNode etc = new FileNode("etc", true, 0);
        root.addChild(etc);
        
        etc.addChild(new FileNode("passwd", false, 1024));
        etc.addChild(new FileNode("hosts", false, 512));
        
        // /var/log
        FileNode var = new FileNode("var", true, 0);
        root.addChild(var);
        
        FileNode log = new FileNode("log", true, 0);
        var.addChild(log);
        
        log.addChild(new FileNode("syslog", false, 50000));
        log.addChild(new FileNode("auth.log", false, 30000));
    }
    
    // 递归遍历目录树
    public void traverseTree(FileNode node, int depth) {
        String indent = "  ".repeat(depth);
        String type = node.isDirectory ? "[目录]" : "[文件]";
        String sizeInfo = node.isDirectory ? "" : " (" + formatSize(node.size) + ")";
        
        System.out.println(indent + type + " " + node.name + sizeInfo);
        
        if (node.isDirectory) {
            for (FileNode child : node.children) {
                traverseTree(child, depth + 1);
            }
        }
    }
    
    // 计算目录总大小
    public long calculateDirectorySize(FileNode node) {
        if (!node.isDirectory) {
            return node.size;
        }
        
        long totalSize = 0;
        for (FileNode child : node.children) {
            totalSize += calculateDirectorySize(child);
        }
        
        return totalSize;
    }
    
    // 查找文件
    public FileNode findFile(FileNode node, String filename) {
        if (node.name.equals(filename) && !node.isDirectory) {
            return node;
        }
        
        if (node.isDirectory) {
            for (FileNode child : node.children) {
                FileNode result = findFile(child, filename);
                if (result != null) {
                    return result;
                }
            }
        }
        
        return null;
    }
    
    // 统计文件数量
    public Map<String, Integer> countFilesByType(FileNode node) {
        Map<String, Integer> counts = new HashMap<>();
        countFilesHelper(node, counts);
        return counts;
    }
    
    private void countFilesHelper(FileNode node, Map<String, Integer> counts) {
        if (!node.isDirectory) {
            String extension = getFileExtension(node.name);
            counts.merge(extension, 1, Integer::sum);
        }
        
        if (node.isDirectory) {
            for (FileNode child : node.children) {
                countFilesHelper(child, counts);
            }
        }
    }
    
    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0) {
            return filename.substring(dotIndex + 1);
        }
        return "无扩展名";
    }
    
    private String formatSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.2f KB", bytes / 1024.0);
        if (bytes < 1024 * 1024 * 1024) return String.format("%.2f MB", bytes / (1024.0 * 1024));
        return String.format("%.2f GB", bytes / (1024.0 * 1024 * 1024));
    }
    
    public FileNode getRoot() {
        return root;
    }
}

public class FileSystemDemo {
    
    public static void demonstrateTreeTraversal() {
        System.out.println("\n=== 目录树遍历 ===");
        
        FileSystemSimulator fs = new FileSystemSimulator();
        fs.buildSampleTree();
        
        System.out.println("完整目录树:");
        fs.traverseTree(fs.getRoot(), 0);
    }
    
    public static void demonstrateDirectoryStatistics() {
        System.out.println("\n=== 目录统计 ===");
        
        FileSystemSimulator fs = new FileSystemSimulator();
        fs.buildSampleTree();
        
        FileNode root = fs.getRoot();
        
        // 计算各目录大小
        System.out.println("\n目录大小统计:");
        for (FileNode child : root.children) {
            if (child.isDirectory) {
                long size = fs.calculateDirectorySize(child);
                System.out.printf("  /%s: %s%n", child.name, fs.formatSize(size));
            }
        }
        
        // 文件类型统计
        System.out.println("\n文件类型统计:");
        Map<String, Integer> typeCounts = fs.countFilesByType(root);
        for (Map.Entry<String, Integer> entry : typeCounts.entrySet()) {
            System.out.printf("  .%s: %d个文件%n", entry.getKey(), entry.getValue());
        }
        
        // 查找特定文件
        System.out.println("\n查找文件:");
        String[] searchFiles = {"document.txt", "code.cpp", "syslog"};
        for (String filename : searchFiles) {
            FileNode found = fs.findFile(root, filename);
            if (found != null) {
                System.out.printf("  找到: %s (%s)%n", filename, fs.formatSize(found.size));
            } else {
                System.out.printf("  未找到: %s%n", filename);
            }
        }
    }
    
    public static void demonstrateBlockCalculation() {
        System.out.println("\n=== 磁盘块计算 ===");
        
        int blockSize = 4096; // 4KB
        
        long[] fileSizes = {100, 4096, 4097, 8192, 10000, 100000};
        
        System.out.println("文件大小\t所需块数\t分配空间\t内部碎片");
        System.out.println("----------------------------------------------------");
        
        for (long size : fileSizes) {
            int blocks = (int) Math.ceil((double) size / blockSize);
            int allocated = blocks * blockSize;
            int waste = allocated - (int) size;
            
            System.out.printf("%d\t\t%d\t\t%d\t\t%d (%.1f%%)%n",
                size, blocks, allocated, waste, (double) waste / size * 100);
        }
    }
    
    public static void main(String[] args) {
        System.out.println("文件系统演示");
        System.out.println("==============");
        
        demonstrateTreeTraversal();
        demonstrateDirectoryStatistics();
        demonstrateBlockCalculation();
        
        System.out.println("\n所有演示完成");
    }
}
```

编译命令：`javac FileSystemDemo.java && java FileSystemDemo`

---

## 复杂度或性能分析

| 分配方法 | 顺序读写 | 随机读写 | 空间效率 | 扩展性 |
|---------|---------|---------|---------|--------|
| 连续分配 | 快 | 快 | 低（外部碎片） | 差 |
| 链接分配 | 慢 | 很慢 | 高 | 好 |
| 索引分配 | 快 | 快 | 中（索引开销） | 好 |

---

## 常见误区与易错点

| 错误/现象 | 原因 | 解决方案 |
|----------|------|---------|
| 混淆硬链接和软链接 | 概念不清 | 硬链接同inode，软链接是新文件 |
| 忽视块大小影响 | 小文件浪费空间 | 选择合适的块大小 |
| 目录遍历栈溢出 | 深层嵌套目录 | 使用迭代而非递归 |
| 符号链接循环 | A→B→A形成环 | 检测并限制链接深度 |
| inode耗尽 | 大量小文件 | 监控inode使用率 |
| 碎片积累 | 频繁删除创建文件 | 定期整理或使用extents |

---

## 与其他知识点的关系

- **与磁盘调度的关系**：文件布局影响磁头移动
- **与缓存的关系**：文件系统有独立的页缓存
- **与数据库的关系**：数据库文件也使用类似机制
- **与备份的关系**：硬链接可用于增量备份

---

## 自测题与参考答案

### 问题1：硬链接和软链接的主要区别是什么？
A. 硬链接更快  
B. 硬链接指向inode，软链接指向路径  
C. 软链接不能跨文件系统  
D. 没有区别

**答案：B**

**解析：** 硬链接是同一个inode的多个目录项，删除原文件不影响硬链接。软链接是一个特殊文件，内容是目标文件的路径，原文件删除后软链接失效（悬空链接）。硬链接不能跨文件系统，软链接可以。

### 问题2：为什么现代文件系统多用索引分配而不是链接分配？
A. 索引分配更简单  
B. 索引分配支持快速随机访问  
C. 链接分配占用更多空间  
D. 索引分配不需要额外空间

**答案：B**

**解析：** 链接分配需要遍历链表才能访问文件的第n个块，随机访问性能差。索引分配通过索引块可以直接定位任意数据块，支持高效的随机访问。虽然索引块占用额外空间，但带来的性能提升是值得的。

### 问题3：一个4KB块大小的文件系统中，3000字节的文件占用多少空间？
A. 3000字节  
B. 4096字节  
C. 8192字节  
D. 3500字节

**答案：B**

**解析：** 文件系统以块为单位分配空间，即使文件只有3000字节，也需要占用完整的1个块（4096字节）。这产生了1096字节的内部碎片。这就是为什么大量小文件会浪费很多磁盘空间。

---

## 考点精讲

### 考点1：inode的设计思想

**核心要点：**
1. **分离元数据和数据**：inode存元数据，数据块存内容
2. **多级指针**：适应不同大小的文件
3. **链接计数**：支持硬链接

**面试常见问题：**
> Q: 为什么inode不包含文件名？  
> A: 因为一个文件可以有多个名称（硬链接）。文件名存储在目录文件中，作为目录项的一部分。这样设计使得重命名文件只需修改目录项，不需要改动inode，提高了灵活性。

### 考点2：文件分配方法的权衡

**核心要点：**
1. **连续分配**：性能好但碎片严重
2. **链接分配**：无碎片但随机访问慢
3. **索引分配**：平衡性能和空间，现代系统首选

**面试常见问题：**
> Q: EXT4文件系统如何改进了传统的索引分配？  
> A: EXT4使用extents（范围）代替单独的块指针。extent记录连续的块范围（起始块+长度），减少了元数据开销，特别适合大文件的连续存储。对于碎片化的文件，仍然使用传统的间接块指针。

### 考点3：目录结构的实现

**核心要点：**
1. **目录是特殊文件**：内容是文件名到inode的映射
2. **.和..**：每个目录都有指向自己和父目录的项
3. **哈希优化**：大型目录使用哈希表加速查找

**面试常见问题：**
> Q: 为什么删除文件后磁盘空间没有立即释放？  
> A: 如果文件还有硬链接（链接计数>0），或者有进程打开着该文件，inode不会被释放。只有当链接计数为0且没有进程打开时，文件占用的块才会被标记为空闲。这也是为什么有时删除大文件后需要用lsof检查是否有进程仍在使用。

---

## 术语速查

| 术语 | 英文 | 简要说明 |
|------|------|---------|
| inode | Index Node | 文件元数据 |
| 目录 | Directory | 文件名映射 |
| 硬链接 | Hard Link | 同一inode的多名称 |
| 软链接 | Symbolic Link | 路径引用 |
| 超级块 | Superblock | 文件系统元信息 |
| extents | Extents | 连续块范围 |

---

## 参考资料与复核

1. [Linux Filesystem Hierarchy](https://www.tldp.org/LDP/LDP/FHS/fhs.html) - 文件系统层次标准
2. [EXT4 Documentation](https://www.kernel.org/doc/html/latest/filesystems/ext4/index.html) - EXT4官方文档
3. [File System Design](https://pages.cs.wisc.edu/~remzi/OSTEP/file-implementation.pdf) - OSTEP教材

**复核日期建议：**
- 首次学习后1天：手动绘制目录树
- 首次学习后7天：研究ext4源码
- 首次学习后30天：分析实际文件系统性能

---

*本章完。下一章将探讨I/O管理机制。*
