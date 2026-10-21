# 第9章：JDBC数据库访问

## 9.1 简介

Web应用的核心是数据，而数据通常存储在数据库中。JDBC（Java Database Connectivity）是Java语言中用于连接和操作数据库的标准API。通过JDBC，Java程序可以执行SQL语句、查询数据、更新记录，实现数据的持久化存储。本章将带你从零开始学习如何使用JDBC访问数据库。

## 9.2 核心概念定义

**JDBC（Java Database Connectivity）** 是Java提供的一套用于执行SQL语句的API，它由一组用Java语言编写的类和接口组成。JDBC为访问不同数据库提供了统一的接口，开发者只需编写一次代码，就可以通过更换驱动程序来访问不同的数据库。

关键组件：
- **DriverManager**：管理数据库驱动程序
- **Connection**：数据库连接对象
- **Statement**：执行SQL语句的对象
- **PreparedStatement**：预编译的SQL语句对象（推荐使用）
- **ResultSet**：查询结果集
- **SQLException**：数据库操作异常

## 9.3 生活类比

想象你去银行办理业务：

**没有JDBC（直接操作）**：
你需要直接走进金库，自己查找账本，手动修改记录。这不仅危险，而且容易出错。

**使用JDBC（标准流程）**：
1. **取号排队（DriverManager）**：获取服务资格
2. **柜台办理（Connection）**：与银行建立连接
3. **填写单据（Statement/PreparedStatement）**：提交你的请求
4. **柜员处理（数据库执行）**：银行内部处理
5. **拿到回执（ResultSet）**：获取处理结果
6. **离开柜台（close）**：结束服务

关键点：你不需要知道银行内部如何运作，只需按照标准流程操作即可。PreparedStatement就像预先填好的标准化表单，更安全、更高效。

## 9.4 JDBC开发步骤

### 标准六步法

1. **加载驱动**：注册数据库驱动程序
2. **建立连接**：获取数据库连接对象
3. **创建语句**：创建Statement或PreparedStatement
4. **执行SQL**：执行查询或更新操作
5. **处理结果**：处理ResultSet或更新计数
6. **释放资源**：关闭连接、语句和结果集

## 9.5 代码示例

### 示例1：基础JDBC操作 - 用户管理

首先创建数据库表：

```sql
CREATE DATABASE IF NOT EXISTS javaweb_db CHARACTER SET utf8mb4;
USE javaweb_db;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    age INT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, email, age) VALUES 
('张三', '123456', 'zhangsan@example.com', 25),
('李四', '123456', 'lisi@example.com', 30),
('王五', '123456', 'wangwu@example.com', 28);
```

添加MySQL驱动依赖（pom.xml）：

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>
```

基础JDBC工具类：

```java
package com.example.util;

import java.sql.*;

public class JdbcUtil {
    
    private static final String URL = "jdbc:mysql://localhost:3306/javaweb_db?useSSL=false&serverTimezone=UTC&characterEncoding=utf8";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "password";
    
    // 加载驱动
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("MySQL驱动加载成功");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL驱动加载失败", e);
        }
    }
    
    // 获取连接
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }
    
    // 关闭资源
    public static void close(Connection conn, Statement stmt, ResultSet rs) {
        try {
            if (rs != null) rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        try {
            if (stmt != null) stmt.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        try {
            if (conn != null) conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

用户DAO类：

```java
package com.example.dao;

import com.example.model.User;
import com.example.util.JdbcUtil;
import java.sql.*;
import java.util.*;

public class UserDao {
    
    /**
     * 查询所有用户
     */
    public List<User> findAll() {
        List<User> users = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        
        try {
            // 1. 获取连接
            conn = JdbcUtil.getConnection();
            
            // 2. 创建预编译语句
            String sql = "SELECT id, username, email, age, create_time FROM users ORDER BY id";
            pstmt = conn.prepareStatement(sql);
            
            // 3. 执行查询
            rs = pstmt.executeQuery();
            
            // 4. 处理结果集
            while (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setAge(rs.getInt("age"));
                user.setCreateTime(rs.getTimestamp("create_time"));
                users.add(user);
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            // 5. 关闭资源
            JdbcUtil.close(conn, pstmt, rs);
        }
        
        return users;
    }
    
    /**
     * 根据ID查询用户
     */
    public User findById(int id) {
        User user = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        
        try {
            conn = JdbcUtil.getConnection();
            String sql = "SELECT id, username, email, age, create_time FROM users WHERE id = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, id);
            
            rs = pstmt.executeQuery();
            
            if (rs.next()) {
                user = new User();
                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setAge(rs.getInt("age"));
                user.setCreateTime(rs.getTimestamp("create_time"));
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            JdbcUtil.close(conn, pstmt, rs);
        }
        
        return user;
    }
    
    /**
     * 添加用户
     */
    public boolean add(User user) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        
        try {
            conn = JdbcUtil.getConnection();
            String sql = "INSERT INTO users (username, password, email, age) VALUES (?, ?, ?, ?)";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getPassword());
            pstmt.setString(3, user.getEmail());
            pstmt.setInt(4, user.getAge());
            
            int rows = pstmt.executeUpdate();
            return rows > 0;
            
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            JdbcUtil.close(conn, pstmt, null);
        }
    }
    
    /**
     * 更新用户
     */
    public boolean update(User user) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        
        try {
            conn = JdbcUtil.getConnection();
            String sql = "UPDATE users SET username=?, email=?, age=? WHERE id=?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getEmail());
            pstmt.setInt(3, user.getAge());
            pstmt.setInt(4, user.getId());
            
            int rows = pstmt.executeUpdate();
            return rows > 0;
            
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            JdbcUtil.close(conn, pstmt, null);
        }
    }
    
    /**
     * 删除用户
     */
    public boolean delete(int id) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        
        try {
            conn = JdbcUtil.getConnection();
            String sql = "DELETE FROM users WHERE id = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, id);
            
            int rows = pstmt.executeUpdate();
            return rows > 0;
            
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            JdbcUtil.close(conn, pstmt, null);
        }
    }
    
    /**
     * 验证用户登录
     */
    public User login(String username, String password) {
        User user = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        
        try {
            conn = JdbcUtil.getConnection();
            String sql = "SELECT id, username, email, age, create_time FROM users WHERE username=? AND password=?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, username);
            pstmt.setString(2, password);
            
            rs = pstmt.executeQuery();
            
            if (rs.next()) {
                user = new User();
                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setAge(rs.getInt("age"));
                user.setCreateTime(rs.getTimestamp("create_time"));
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            JdbcUtil.close(conn, pstmt, rs);
        }
        
        return user;
    }
}
```

用户模型类：

```java
package com.example.model;

import java.sql.Timestamp;

public class User {
    private int id;
    private String username;
    private String password;
    private String email;
    private int age;
    private Timestamp createTime;
    
    // Getter和Setter
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    
    public Timestamp getCreateTime() { return createTime; }
    public void setCreateTime(Timestamp createTime) { this.createTime = createTime; }
}
```

用户列表Servlet：

```java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.*;
import com.example.dao.UserDao;
import com.example.model.User;

@WebServlet("/user-list")
public class UserListServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        UserDao userDao = new UserDao();
        List<User> users = userDao.findAll();
        
        request.setAttribute("users", users);
        request.getRequestDispatcher("/user-list.jsp").forward(request, response);
    }
}
```

用户列表JSP页面：

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>用户列表</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1000px;
            margin: 30px auto;
            padding: 20px;
        }
        h1 {
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        th {
            background: #4CAF50;
            color: white;
            padding: 15px;
            text-align: left;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }
        tr:hover {
            background: #f5f5f5;
        }
        .btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 0 2px;
        }
        .btn-add {
            background: #4CAF50;
            color: white;
            margin-bottom: 15px;
        }
        .btn-edit {
            background: #2196F3;
            color: white;
        }
        .btn-delete {
            background: #f44336;
            color: white;
        }
    </style>
</head>
<body>
    <h1>👥 用户列表</h1>
    
    <a href="/user-add.jsp" class="btn btn-add">添加用户</a>
    
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>用户名</th>
                <th>邮箱</th>
                <th>年龄</th>
                <th>注册时间</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="user" items="${users}">
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.age}</td>
                    <td>${user.createTime}</td>
                    <td>
                        <a href="/user-edit?id=${user.id}" class="btn btn-edit">编辑</a>
                        <a href="/user-delete?id=${user.id}" class="btn btn-delete" 
                           onclick="return confirm('确定要删除吗？')">删除</a>
                    </td>
                </tr>
            </c:forEach>
            
            <c:if test="${empty users}">
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        暂无用户数据
                    </td>
                </tr>
            </c:if>
        </tbody>
    </table>
</body>
</html>
```

### 示例2：使用try-with-resources简化资源管理

```java
package com.example.dao;

import com.example.model.Product;
import com.example.util.JdbcUtil;
import java.sql.*;
import java.util.*;

public class ProductDao {
    
    public List<Product> findByCategory(String category) {
        List<Product> products = new ArrayList<>();
        
        // 使用try-with-resources自动关闭资源
        String sql = "SELECT id, name, price, stock, category FROM products WHERE category = ?";
        
        try (Connection conn = JdbcUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, category);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Product product = new Product();
                    product.setId(rs.getInt("id"));
                    product.setName(rs.getString("name"));
                    product.setPrice(rs.getDouble("price"));
                    product.setStock(rs.getInt("stock"));
                    product.setCategory(rs.getString("category"));
                    products.add(product);
                }
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return products;
    }
    
    public int countByPriceRange(double minPrice, double maxPrice) {
        String sql = "SELECT COUNT(*) FROM products WHERE price BETWEEN ? AND ?";
        
        try (Connection conn = JdbcUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setDouble(1, minPrice);
            pstmt.setDouble(2, maxPrice);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return 0;
    }
}
```

### 示例3：事务处理 - 转账功能

```java
package com.example.service;

import com.example.util.JdbcUtil;
import java.sql.*;

public class TransferService {
    
    /**
     * 转账操作（需要事务保证原子性）
     * @param fromAccount 转出账户
     * @param toAccount 转入账户
     * @param amount 转账金额
     * @return 是否成功
     */
    public boolean transfer(String fromAccount, String toAccount, double amount) {
        Connection conn = null;
        
        try {
            // 1. 获取连接
            conn = JdbcUtil.getConnection();
            
            // 2. 关闭自动提交，开启事务
            conn.setAutoCommit(false);
            
            // 3. 检查转出账户余额
            String checkSql = "SELECT balance FROM accounts WHERE account_no = ?";
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                checkStmt.setString(1, fromAccount);
                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (!rs.next() || rs.getDouble("balance") < amount) {
                        throw new RuntimeException("余额不足");
                    }
                }
            }
            
            // 4. 扣减转出账户余额
            String deductSql = "UPDATE accounts SET balance = balance - ? WHERE account_no = ?";
            try (PreparedStatement deductStmt = conn.prepareStatement(deductSql)) {
                deductStmt.setDouble(1, amount);
                deductStmt.setString(2, fromAccount);
                int rows = deductStmt.executeUpdate();
                if (rows == 0) {
                    throw new RuntimeException("转出账户不存在");
                }
            }
            
            // 5. 增加转入账户余额
            String addSql = "UPDATE accounts SET balance = balance + ? WHERE account_no = ?";
            try (PreparedStatement addStmt = conn.prepareStatement(addSql)) {
                addStmt.setDouble(1, amount);
                addStmt.setString(2, toAccount);
                int rows = addStmt.executeUpdate();
                if (rows == 0) {
                    throw new RuntimeException("转入账户不存在");
                }
            }
            
            // 6. 记录转账日志
            String logSql = "INSERT INTO transfer_log (from_account, to_account, amount, transfer_time) VALUES (?, ?, ?, NOW())";
            try (PreparedStatement logStmt = conn.prepareStatement(logSql)) {
                logStmt.setString(1, fromAccount);
                logStmt.setString(2, toAccount);
                logStmt.setDouble(3, amount);
                logStmt.executeUpdate();
            }
            
            // 7. 提交事务
            conn.commit();
            System.out.println("转账成功");
            return true;
            
        } catch (Exception e) {
            // 8. 回滚事务
            if (conn != null) {
                try {
                    conn.rollback();
                    System.out.println("转账失败，已回滚: " + e.getMessage());
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            e.printStackTrace();
            return false;
        } finally {
            // 9. 恢复自动提交并关闭连接
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

### 示例4：数据库连接池（进阶）

使用HikariCP连接池：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
    <version>5.0.1</version>
</dependency>
```

```java
package com.example.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.*;

public class DataSourceUtil {
    
    private static HikariDataSource dataSource;
    
    static {
        // 配置连接池
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/javaweb_db?useSSL=false&serverTimezone=UTC");
        config.setUsername("root");
        config.setPassword("password");
        config.setMaximumPoolSize(10); // 最大连接数
        config.setMinimumIdle(2); // 最小空闲连接
        config.setConnectionTimeout(30000); // 连接超时时间（毫秒）
        config.setIdleTimeout(600000); // 空闲超时时间（毫秒）
        config.setMaxLifetime(1800000); // 连接最大生命周期（毫秒）
        
        dataSource = new HikariDataSource(config);
        System.out.println("连接池初始化成功");
    }
    
    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
    
    public static void close() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
            System.out.println("连接池已关闭");
        }
    }
}
```

## 9.6 PreparedStatement vs Statement

| 特性 | Statement | PreparedStatement |
|------|-----------|-------------------|
| SQL注入防护 | ❌ 不安全 | ✅ 安全 |
| 性能 | 每次编译 | 预编译，可复用 |
| 参数设置 | 字符串拼接 | 占位符(?) |
| 可读性 | 差 | 好 |

**错误示例（SQL注入风险）**：
```java
String sql = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(sql);
```

**正确示例（使用PreparedStatement）**：
```java
String sql = "SELECT * FROM users WHERE username=? AND password=?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, username);
pstmt.setString(2, password);
ResultSet rs = pstmt.executeQuery();
```

## 9.7 练习题

1. **选择题**：以下哪个接口用于执行预编译的SQL语句？
   - A) Statement
   - B) PreparedStatement
   - C) CallableStatement
   - D) ResultSet

2. **填空题**：JDBC操作的六个步骤是：加载驱动、______、创建语句、______、处理结果、释放资源。

3. **简答题**：解释为什么PreparedStatement比Statement更安全，并举例说明SQL注入攻击的原理。

4. **编程题**：编写一个DAO方法，实现分页查询用户列表。要求支持指定页码和每页条数，返回总记录数和当前页数据。

5. **思考题**：在高并发场景下，直接使用DriverManager.getConnection()会有什么问题？为什么需要使用连接池？

## 9.8 常见误区

### 误区1：忘记关闭资源
- **错误做法**：
  ```java
  Connection conn = DriverManager.getConnection(...);
  Statement stmt = conn.createStatement();
  ResultSet rs = stmt.executeQuery(sql);
  // 忘记关闭
  ```
- **正确做法**：使用try-with-resources或在finally块中关闭

### 误区2：使用Statement拼接SQL
- **错误做法**：
  ```java
  String sql = "SELECT * FROM users WHERE id=" + userId;
  ```
- **正确做法**：
  ```java
  String sql = "SELECT * FROM users WHERE id=?";
  pstmt.setInt(1, userId);
  ```

### 误区3：在循环中创建连接
- **错误做法**：
  ```java
  for (User user : users) {
      Connection conn = JdbcUtil.getConnection();
      // 执行操作
      conn.close();
  }
  ```
- **正确做法**：在循环外获取连接，或使用批量操作

### 误区4：忽略事务隔离级别
- **错误理解**：所有操作都使用默认隔离级别
- **正确理解**：根据业务需求选择合适的隔离级别
  ```java
  conn.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
  ```

### 误区5：捕获异常后吞掉
- **错误做法**：
  ```java
  catch (SQLException e) {
      // 什么都不做
  }
  ```
- **正确做法**：记录日志并向上抛出或返回错误信息

## 9.9 本章小结

JDBC是Java访问数据库的标准方式，掌握其核心用法至关重要。记住：
- 始终使用PreparedStatement防止SQL注入
- 使用try-with-resources自动管理资源
- 涉及多步操作时使用事务保证原子性
- 生产环境使用连接池提高性能

下一章我们将学习MVC设计模式，它将帮助我们组织代码结构，实现关注点分离。
