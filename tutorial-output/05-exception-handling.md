# 第5章：异常处理

> **学习目标**：掌握try-catch机制，学会自定义异常，理解C++和Java异常处理的差异。

## 5.1 为什么需要异常处理？

想象你在开车：
- **正常情况**：平稳行驶
- **异常情况**：爆胎、没油、迷路

如果没有应对方案 → 车辆损坏（程序崩溃）  
如果有应急预案 → 安全停车（优雅降级）

**异常处理的好处**：
- ✅ 分离正常逻辑和错误处理
- ✅ 避免程序突然崩溃
- ✅ 提供有意义的错误信息
- ✅ 支持恢复或清理资源

---

## 5.2 基础try-catch

### C++ 实现

```cpp
#include <iostream>
#include <stdexcept>

double divide(double a, double b) {
    if (b == 0) {
        throw std::runtime_error("除数不能为零！");
    }
    return a / b;
}

int main() {
    try {
        double result = divide(10, 0);
        std::cout << "结果: " << result << std::endl;
    } catch (const std::runtime_error& e) {
        std::cerr << "错误: " << e.what() << std::endl;
    } catch (...) {
        // 捕获所有其他异常
        std::cerr << "未知错误" << std::endl;
    }
    
    std::cout << "程序继续运行" << std::endl;
    return 0;
}
```

### Java 实现

```java
public class DivideDemo {
    
    public static double divide(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("除数不能为零！");
        }
        return a / b;
    }
    
    public static void main(String[] args) {
        try {
            double result = divide(10, 0);
            System.out.println("结果: " + result);
        } catch (ArithmeticException e) {
            System.err.println("错误: " + e.getMessage());
        } catch (Exception e) {
            // 捕获所有其他异常
            System.err.println("未知错误: " + e.getMessage());
        } finally {
            // 无论是否异常都会执行
            System.out.println("清理工作");
        }
        
        System.out.println("程序继续运行");
    }
}
```

**输出**：
```
错误: 除数不能为零！
清理工作
程序继续运行
```

---

## 5.3 异常层次结构

### C++ 异常类 hierarchy

```
std::exception（基类）
├── std::logic_error（逻辑错误，可预防）
│   ├── std::invalid_argument（无效参数）
│   ├── std::out_of_range（越界）
│   └── std::length_error（长度错误）
├── std::runtime_error（运行时错误，不可预防）
│   ├── std::overflow_error（溢出）
│   └── std::underflow_error（下溢）
└── ...
```

### Java 异常类 hierarchy

```
Throwable（基类）
├── Error（严重错误，不应捕获）
│   ├── OutOfMemoryError
│   └── StackOverflowError
└── Exception（可捕获的异常）
    ├── RuntimeException（非受检异常）
    │   ├── NullPointerException
    │   ├── ArithmeticException
    │   └── IndexOutOfBoundsException
    └── 受检异常（必须处理）
        ├── IOException
        ├── SQLException
        └── ClassNotFoundException
```

**关键区别**：
- C++：所有异常都不受检（可选处理）
- Java：受检异常必须声明或捕获

---

## 5.4 自定义异常

### C++ 实现

```cpp
#include <iostream>
#include <string>
#include <stdexcept>

// 自定义异常类
class InsufficientFundsException : public std::runtime_error {
private:
    double balance;
    double withdrawAmount;
    
public:
    InsufficientFundsException(double balance, double amount)
        : std::runtime_error("余额不足"), 
          balance(balance), 
          withdrawAmount(amount) {}
    
    double getBalance() const { return balance; }
    double getWithdrawAmount() const { return withdrawAmount; }
    double getDeficit() const { return withdrawAmount - balance; }
};

class BankAccount {
private:
    std::string owner;
    double balance;
    
public:
    BankAccount(std::string o, double initBalance)
        : owner(o), balance(initBalance) {}
    
    void withdraw(double amount) {
        if (amount < 0) {
            throw std::invalid_argument("取款金额不能为负");
        }
        if (amount > balance) {
            throw InsufficientFundsException(balance, amount);
        }
        balance -= amount;
        std::cout << "取款成功，剩余: " << balance << std::endl;
    }
    
    double getBalance() const { return balance; }
};

int main() {
    BankAccount account("张三", 1000.0);
    
    try {
        account.withdraw(1500.0);
    } catch (const InsufficientFundsException& e) {
        std::cerr << "错误: " << e.what() << std::endl;
        std::cerr << "当前余额: " << e.getBalance() << std::endl;
        std::cerr << "尝试取款: " << e.getWithdrawAmount() << std::endl;
        std::cerr << "差额: " << e.getDeficit() << std::endl;
    } catch (const std::invalid_argument& e) {
        std::cerr << "参数错误: " << e.what() << std::endl;
    }
    
    return 0;
}
```

### Java 实现

```java
// 自定义异常类
class InsufficientFundsException extends Exception {
    private double balance;
    private double withdrawAmount;
    
    public InsufficientFundsException(double balance, double amount) {
        super("余额不足");
        this.balance = balance;
        this.withdrawAmount = amount;
    }
    
    public double getBalance() { return balance; }
    public double getWithdrawAmount() { return withdrawAmount; }
    public double getDeficit() { return withdrawAmount - balance; }
}

class BankAccount {
    private String owner;
    private double balance;
    
    public BankAccount(String owner, double initBalance) {
        this.owner = owner;
        this.balance = initBalance;
    }
    
    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount < 0) {
            throw new IllegalArgumentException("取款金额不能为负");
        }
        if (amount > balance) {
            throw new InsufficientFundsException(balance, amount);
        }
        balance -= amount;
        System.out.println("取款成功，剩余: " + balance);
    }
    
    public double getBalance() { return balance; }
}

public class CustomExceptionDemo {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("张三", 1000.0);
        
        try {
            account.withdraw(1500.0);
        } catch (InsufficientFundsException e) {
            System.err.println("错误: " + e.getMessage());
            System.err.println("当前余额: " + e.getBalance());
            System.err.println("尝试取款: " + e.getWithdrawAmount());
            System.err.println("差额: " + e.getDeficit());
        } catch (IllegalArgumentException e) {
            System.err.println("参数错误: " + e.getMessage());
        }
    }
}
```

---

## 5.5 多重catch与异常链

### C++ 实现

```cpp
#include <iostream>
#include <fstream>
#include <stdexcept>
#include <sstream>

void processFile(const std::string& filename) {
    std::ifstream file(filename);
    
    if (!file.is_open()) {
        throw std::runtime_error("无法打开文件: " + filename);
    }
    
    std::string line;
    int lineNumber = 0;
    
    while (std::getline(file, line)) {
        lineNumber++;
        
        try {
            // 尝试解析数字
            size_t pos;
            double value = std::stod(line, &pos);
            
            if (value < 0) {
                throw std::domain_error("第" + std::to_string(lineNumber) + 
                                       "行: 数值不能为负");
            }
            
            std::cout << "第" << lineNumber << "行: " << value << std::endl;
            
        } catch (const std::invalid_argument&) {
            std::cerr << "第" << lineNumber << "行: 无效数字格式" << std::endl;
        }
    }
}

int main() {
    try {
        processFile("data.txt");
    } catch (const std::runtime_error& e) {
        std::cerr << "文件错误: " << e.what() << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "其他错误: " << e.what() << std::endl;
    }
    
    return 0;
}
```

### Java 实现（异常链）

```java
import java.io.*;
import java.util.ArrayList;
import java.util.List;

class DataProcessingException extends Exception {
    private List<String> errors = new ArrayList<>();
    
    public DataProcessingException(String message) {
        super(message);
    }
    
    public void addError(String error) {
        errors.add(error);
    }
    
    public List<String> getErrors() {
        return errors;
    }
}

public class ExceptionChainDemo {
    
    public static void processFile(String filename) throws DataProcessingException {
        DataProcessingException dpe = new DataProcessingException("数据处理失败");
        
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            int lineNumber = 0;
            
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                
                try {
                    double value = Double.parseDouble(line.trim());
                    
                    if (value < 0) {
                        throw new IllegalArgumentException("数值不能为负");
                    }
                    
                    System.out.println("第" + lineNumber + "行: " + value);
                    
                } catch (NumberFormatException e) {
                    dpe.addError("第" + lineNumber + "行: 无效数字格式");
                } catch (IllegalArgumentException e) {
                    dpe.addError("第" + lineNumber + "行: " + e.getMessage());
                }
            }
            
        } catch (IOException e) {
            // 异常链：将原始异常作为cause
            throw new DataProcessingException("文件读取失败");
        }
        
        if (!dpe.getErrors().isEmpty()) {
            throw dpe;
        }
    }
    
    public static void main(String[] args) {
        try {
            processFile("data.txt");
        } catch (DataProcessingException e) {
            System.err.println(e.getMessage());
            for (String error : e.getErrors()) {
                System.err.println("  - " + error);
            }
        }
    }
}
```

---

## 5.6 finally与资源清理

### C++ RAII模式

C++没有finally，用RAII（资源获取即初始化）替代：

```cpp
#include <iostream>
#include <fstream>
#include <memory>

// RAII包装器
class FileGuard {
private:
    std::ofstream* file;
    
public:
    FileGuard(std::ofstream& f) : file(&f) {}
    
    ~FileGuard() {
        if (file && file->is_open()) {
            file->close();
            std::cout << "文件已关闭" << std::endl;
        }
    }
};

void writeToFile(const std::string& filename) {
    std::ofstream file(filename);
    FileGuard guard(file);  // 析构时自动关闭
    
    if (!file.is_open()) {
        throw std::runtime_error("无法打开文件");
    }
    
    file << "Hello, World!" << std::endl;
    file << "第二行" << std::endl;
    
    // 即使这里抛出异常，FileGuard也会关闭文件
    // throw std::runtime_error("测试异常");
}

int main() {
    try {
        writeToFile("output.txt");
    } catch (const std::exception& e) {
        std::cerr << "错误: " << e.what() << std::endl;
    }
    
    return 0;
}
```

### Java finally块

```java
import java.io.*;

public class FinallyDemo {
    
    // 传统方式
    public static void writeFileOld(String filename) {
        FileWriter writer = null;
        try {
            writer = new FileWriter(filename);
            writer.write("Hello, World!");
            writer.write("\n第二行");
        } catch (IOException e) {
            System.err.println("写入错误: " + e.getMessage());
        } finally {
            // 无论如何都会执行
            if (writer != null) {
                try {
                    writer.close();
                    System.out.println("文件已关闭");
                } catch (IOException e) {
                    System.err.println("关闭失败: " + e.getMessage());
                }
            }
        }
    }
    
    // 推荐方式：try-with-resources
    public static void writeFileNew(String filename) {
        try (FileWriter writer = new FileWriter(filename)) {
            writer.write("Hello, World!");
            writer.write("\n第二行");
        } catch (IOException e) {
            System.err.println("写入错误: " + e.getMessage());
        }
        // 自动关闭，无需finally
    }
    
    public static void main(String[] args) {
        writeFileNew("output.txt");
    }
}
```

---

## 5.7 异常处理最佳实践

### ✅ 好的做法

```cpp
// C++
// 1. 捕获具体异常类型
try {
    // 代码
} catch (const std::invalid_argument& e) {
    // 处理参数错误
} catch (const std::runtime_error& e) {
    // 处理运行时错误
}

// 2. 使用const引用避免拷贝
catch (const std::exception& e)

// 3. 只在能处理的地方捕获
void processData() {
    // 不捕获，让调用者决定如何处理
    if (invalid) throw std::invalid_argument("...");
}

// 4. 记录异常信息
catch (const std::exception& e) {
    logger.error("处理失败: {}", e.what());
    throw;  // 重新抛出
}
```

```java
// Java
// 1. 捕获具体异常
try {
    // 代码
} catch (FileNotFoundException e) {
    // 处理文件不存在
} catch (IOException e) {
    // 处理其他IO错误
}

// 2. 不要吞掉异常
catch (Exception e) {
    log.error("错误", e);  // 记录日志
    throw new BusinessException("处理失败", e);  // 转换并抛出
}

// 3. 使用多catch（Java 7+）
try {
    // 代码
} catch (IOException | SQLException e) {
    // 统一处理
}

// 4. 不要捕获Throwable
// ❌ 错误
catch (Throwable t) { ... }
// ✅ 正确
catch (Exception e) { ... }
```

### ❌ 坏的做法

```cpp
// C++

// 1. 空catch块（吞掉异常）
try {
    riskyOperation();
} catch (...) {
    // 什么都不做 - 隐藏了错误！
}

// 2. 捕获后抛出新异常但不保留原因
try {
    // 代码
} catch (const std::exception& e) {
    throw std::runtime_error("出错了");  // 丢失原始信息
}

// 3. 用异常控制流程
for (int i = 0; ; i++) {
    try {
        cout << arr[i];  // 依赖越界异常来停止
    } catch (...) {
        break;
    }
}
// ✅ 应该用条件判断
for (int i = 0; i < arr.size(); i++) {
    cout << arr[i];
}
```

```java
// Java

// 1. 空catch块
try {
    doSomething();
} catch (Exception e) {
    // 静默失败 - 调试噩梦！
}

// 2. 捕获过于宽泛
try {
    // 代码
} catch (Exception e) {
    // 应该捕获具体类型
}

// 3. 在循环中捕获
for (String item : items) {
    try {
        process(item);
    } catch (Exception e) {
        // 每次迭代都try-catch，性能差
    }
}

// 4. 用异常代替条件判断
try {
    return map.get(key).toString();
} catch (NullPointerException e) {
    return "default";
}
// ✅ 应该
return map.containsKey(key) ? map.get(key).toString() : "default";
```

---

## 5.8 实战：健壮的文件处理器

### C++ 实现

```cpp
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <stdexcept>
#include <filesystem>

namespace fs = std::filesystem;

class FileProcessor {
private:
    std::vector<std::string> errors;
    
public:
    struct ProcessResult {
        int successCount;
        int failCount;
        std::vector<std::string> errors;
    };
    
    ProcessResult processDirectory(const std::string& dirPath) {
        ProcessResult result = {0, 0, {}};
        
        if (!fs::exists(dirPath)) {
            throw std::runtime_error("目录不存在: " + dirPath);
        }
        
        for (const auto& entry : fs::directory_iterator(dirPath)) {
            if (entry.is_regular_file() && entry.path().extension() == ".txt") {
                try {
                    processFile(entry.path().string());
                    result.successCount++;
                } catch (const std::exception& e) {
                    result.failCount++;
                    result.errors.push_back(entry.path().filename().string() + ": " + e.what());
                }
            }
        }
        
        return result;
    }
    
private:
    void processFile(const std::string& filePath) {
        std::ifstream file(filePath);
        if (!file.is_open()) {
            throw std::runtime_error("无法打开文件");
        }
        
        std::string line;
        int lineNumber = 0;
        
        while (std::getline(file, line)) {
            lineNumber++;
            if (line.empty()) {
                throw std::runtime_error("第" + std::to_string(lineNumber) + "行为空");
            }
            // 处理逻辑...
        }
    }
};

int main() {
    FileProcessor processor;
    
    try {
        auto result = processor.processDirectory("./data");
        
        std::cout << "成功: " << result.successCount << std::endl;
        std::cout << "失败: " << result.failCount << std::endl;
        
        for (const auto& error : result.errors) {
            std::cerr << "  - " << error << std::endl;
        }
        
    } catch (const std::exception& e) {
        std::cerr << "严重错误: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}
```

### Java 实现

```java
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

public class RobustFileProcessor {
    
    static class ProcessResult {
        int successCount;
        int failCount;
        List<String> errors = new ArrayList<>();
        
        @Override
        public String toString() {
            return String.format("成功: %d, 失败: %d\n错误:\n%s", 
                               successCount, failCount,
                               String.join("\n", errors));
        }
    }
    
    public ProcessResult processDirectory(String dirPath) throws IOException {
        ProcessResult result = new ProcessResult();
        Path dir = Paths.get(dirPath);
        
        if (!Files.exists(dir)) {
            throw new FileNotFoundException("目录不存在: " + dirPath);
        }
        
        try (Stream<Path> paths = Files.list(dir)) {
            paths.filter(Files::isRegularFile)
                 .filter(p -> p.toString().endsWith(".txt"))
                 .forEach(path -> {
                     try {
                         processFile(path);
                         result.successCount++;
                     } catch (Exception e) {
                         result.failCount++;
                         result.errors.add(path.getFileName() + ": " + e.getMessage());
                     }
                 });
        }
        
        return result;
    }
    
    private void processFile(Path filePath) throws IOException {
        List<String> lines = Files.readAllLines(filePath);
        
        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i);
            if (line.trim().isEmpty()) {
                throw new IllegalArgumentException(
                    "第" + (i + 1) + "行为空");
            }
            // 处理逻辑...
        }
    }
    
    public static void main(String[] args) {
        RobustFileProcessor processor = new RobustFileProcessor();
        
        try {
            ProcessResult result = processor.processDirectory("./data");
            System.out.println(result);
        } catch (IOException e) {
            System.err.println("严重错误: " + e.getMessage());
            System.exit(1);
        }
    }
}
```

---

## 练习题

1. 创建一个栈数据结构，当pop空栈时抛出`EmptyStackException`，push超过容量时抛出`StackOverflowException`
2. 编写一个除法计算器，处理除零、溢出、非数字输入等多种异常情况
3. 实现一个事务系统，如果任何步骤失败则回滚所有操作（类似数据库事务）
4. 分析以下代码的问题并改进：
   ```java
   try {
       // 很多行代码
   } catch (Exception e) {
       System.out.println("出错了");
   }
   ```

## 延伸阅读

- [ELI5: 异常传播可视化图解](../visuals/exception.html)
- [第6章：泛型编程](./06-generics.md)
