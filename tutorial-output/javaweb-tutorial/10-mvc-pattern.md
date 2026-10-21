# 第10章：MVC设计模式

## 10.1 简介

在学习了Servlet、JSP、JDBC等技术后，你可能会发现代码变得混乱：Servlet中既有业务逻辑又有HTML输出，JSP中既有展示又有数据库查询。这种"大杂烩"式的代码难以维护和扩展。MVC（Model-View-Controller）设计模式就是为了解决这个问题而生的，它将应用分为三个层次，各司其职，让代码结构更清晰、更易维护。

## 10.2 核心概念定义

**MVC（Model-View-Controller）** 是一种软件架构模式，将应用分为三个核心组件：

- **Model（模型）**：负责数据和业务逻辑
- **View（视图）**：负责数据展示和用户界面
- **Controller（控制器）**：负责接收请求、协调Model和View

关键原则：
- **关注点分离**：每个组件只负责自己的职责
- **低耦合**：组件之间通过接口交互，减少依赖
- **高内聚**：相关功能集中在同一个组件中
- **可复用**：Model可以被多个View复用

## 10.3 生活类比

想象你去餐厅用餐的完整流程：

**没有MVC（混乱模式）**：
厨师既要炒菜又要端盘子还要收银，服务员既要记单又要做饭还要算账。每个人都在做所有事情，效率低下且容易出错。

**使用MVC（分工明确）**：

1. **顾客（用户）** 看菜单点菜
2. **服务员（Controller）** 接收订单，告诉厨房做什么菜
3. **厨师（Model）** 根据订单准备食材、烹饪菜品（业务逻辑）
4. **传菜员（Controller）** 把做好的菜端到餐桌
5. **餐桌摆盘（View）** 精美的餐具和摆盘展示菜品

关键点：
- 厨师不关心菜怎么摆盘（Model不关心展示）
- 服务员不关心菜怎么做（Controller不关心业务逻辑）
- 摆盘师傅不关心菜怎么炒（View不关心数据处理）

## 10.4 MVC各层职责

### Model（模型层）
- **实体类（Entity/Bean）**：表示数据结构
- **DAO（Data Access Object）**：数据库操作
- **Service**：业务逻辑处理

### View（视图层）
- **JSP页面**：HTML展示
- **EL表达式 + JSTL**：数据展示
- **CSS/JavaScript**：样式和交互

### Controller（控制层）
- **Servlet**：接收请求、调用Service、选择视图
- **过滤器**：预处理请求
- **拦截器**：权限验证等

## 10.5 代码示例：完整的用户管理系统

### 项目结构

```
com.example
├── model          # 模型层 - 实体类
│   └── User.java
├── dao            # 模型层 - 数据访问
│   └── UserDao.java
├── service        # 模型层 - 业务逻辑
│   └── UserService.java
├── controller     # 控制层
│   ├── UserListServlet.java
│   ├── UserAddServlet.java
│   ├── UserEditServlet.java
│   └── UserDeleteServlet.java
├── filter         # 控制层 - 过滤器
│   └── EncodingFilter.java
└── util           # 工具类
    └── JdbcUtil.java

webapp
├── WEB-INF
│   └── views      # 视图层 - JSP页面
│       ├── user-list.jsp
│       ├── user-add.jsp
│       └── user-edit.jsp
├── css
│   └── style.css
└── index.jsp
```

### 1. Model层 - 实体类

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
    
    public User() {}
    
    public User(String username, String password, String email, int age) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.age = age;
    }
    
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
    
    @Override
    public String toString() {
        return "User{id=" + id + ", username='" + username + "', email='" + email + "'}";
    }
}
```

### 2. Model层 - DAO

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
        String sql = "SELECT id, username, email, age, create_time FROM users ORDER BY id DESC";
        
        try (Connection conn = JdbcUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            
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
            throw new RuntimeException("查询用户列表失败", e);
        }
        
        return users;
    }
    
    /**
     * 根据ID查询用户
     */
    public User findById(int id) {
        String sql = "SELECT id, username, email, age, create_time FROM users WHERE id = ?";
        
        try (Connection conn = JdbcUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    User user = new User();
                    user.setId(rs.getInt("id"));
                    user.setUsername(rs.getString("username"));
                    user.setEmail(rs.getString("email"));
                    user.setAge(rs.getInt("age"));
                    user.setCreateTime(rs.getTimestamp("create_time"));
                    return user;
                }
            }
            
        } catch (SQLException e) {
            throw new RuntimeException("查询用户失败", e);
        }
        
        return null;
    }
    
    /**
     * 添加用户
     */
    public boolean add(User user) {
        String sql = "INSERT INTO users (username, password, email, age) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = JdbcUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getPassword());
            pstmt.setString(3, user.getEmail());
            pstmt.setInt(4, user.getAge());
            
            return pstmt.executeUpdate() > 0;
            
        } catch (SQLException e) {
            throw new RuntimeException("添加用户失败", e);
        }
    }
    
    /**
     * 更新用户
     */
    public boolean update(User user) {
        String sql = "UPDATE users SET username=?, email=?, age=? WHERE id=?";
        
        try (Connection conn = JdbcUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getEmail());
            pstmt.setInt(3, user.getAge());
            pstmt.setInt(4, user.getId());
            
            return pstmt.executeUpdate() > 0;
            
        } catch (SQLException e) {
            throw new RuntimeException("更新用户失败", e);
        }
    }
    
    /**
     * 删除用户
     */
    public boolean delete(int id) {
        String sql = "DELETE FROM users WHERE id = ?";
        
        try (Connection conn = JdbcUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
            
        } catch (SQLException e) {
            throw new RuntimeException("删除用户失败", e);
        }
    }
    
    /**
     * 检查用户名是否存在
     */
    public boolean existsByUsername(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        
        try (Connection conn = JdbcUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, username);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
            
        } catch (SQLException e) {
            throw new RuntimeException("检查用户名失败", e);
        }
        
        return false;
    }
}
```

### 3. Model层 - Service

```java
package com.example.service;

import com.example.dao.UserDao;
import com.example.model.User;
import java.util.List;

public class UserService {
    
    private UserDao userDao = new UserDao();
    
    /**
     * 获取所有用户列表
     */
    public List<User> getAllUsers() {
        return userDao.findAll();
    }
    
    /**
     * 根据ID获取用户
     */
    public User getUserById(int id) {
        return userDao.findById(id);
    }
    
    /**
     * 添加用户（包含业务验证）
     */
    public boolean addUser(User user) {
        // 1. 参数验证
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("用户名不能为空");
        }
        
        if (user.getPassword() == null || user.getPassword().length() < 6) {
            throw new IllegalArgumentException("密码至少6位");
        }
        
        if (user.getEmail() != null && !user.getEmail().contains("@")) {
            throw new IllegalArgumentException("邮箱格式不正确");
        }
        
        // 2. 业务规则验证
        if (userDao.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("用户名已存在");
        }
        
        // 3. 执行添加
        return userDao.add(user);
    }
    
    /**
     * 更新用户
     */
    public boolean updateUser(User user) {
        if (user.getId() <= 0) {
            throw new IllegalArgumentException("用户ID无效");
        }
        
        return userDao.update(user);
    }
    
    /**
     * 删除用户
     */
    public boolean deleteUser(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("用户ID无效");
        }
        
        return userDao.delete(id);
    }
    
    /**
     * 用户登录
     */
    public User login(String username, String password) {
        // 这里简化处理，实际应该加密密码后比对
        List<User> users = userDao.findAll();
        for (User user : users) {
            if (user.getUsername().equals(username) && user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }
}
```

### 4. Controller层 - Servlet

#### 用户列表Servlet

```java
package com.example.controller;

import com.example.service.UserService;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet("/user/list")
public class UserListServlet extends HttpServlet {
    
    private UserService userService = new UserService();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            // 1. 调用Service获取数据
            var users = userService.getAllUsers();
            
            // 2. 将数据存入request
            request.setAttribute("users", users);
            
            // 3. 转发到视图
            request.getRequestDispatcher("/WEB-INF/views/user-list.jsp").forward(request, response);
            
        } catch (Exception e) {
            request.setAttribute("error", "加载用户列表失败: " + e.getMessage());
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }
    }
}
```

#### 添加用户Servlet

```java
package com.example.controller;

import com.example.model.User;
import com.example.service.UserService;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet("/user/add")
public class UserAddServlet extends HttpServlet {
    
    private UserService userService = new UserService();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 显示添加表单
        request.getRequestDispatcher("/WEB-INF/views/user-add.jsp").forward(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        
        try {
            // 1. 获取表单数据
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            String email = request.getParameter("email");
            String ageStr = request.getParameter("age");
            
            // 2. 创建User对象
            User user = new User();
            user.setUsername(username);
            user.setPassword(password);
            user.setEmail(email);
            user.setAge(Integer.parseInt(ageStr));
            
            // 3. 调用Service添加
            userService.addUser(user);
            
            // 4. 重定向到列表页（防止重复提交）
            response.sendRedirect(request.getContextPath() + "/user/list");
            
        } catch (IllegalArgumentException e) {
            // 业务验证失败
            request.setAttribute("error", e.getMessage());
            request.setAttribute("user", createUserFromRequest(request));
            request.getRequestDispatcher("/WEB-INF/views/user-add.jsp").forward(request, response);
            
        } catch (Exception e) {
            request.setAttribute("error", "添加用户失败: " + e.getMessage());
            request.setAttribute("user", createUserFromRequest(request));
            request.getRequestDispatcher("/WEB-INF/views/user-add.jsp").forward(request, response);
        }
    }
    
    private User createUserFromRequest(HttpServletRequest request) {
        User user = new User();
        user.setUsername(request.getParameter("username"));
        user.setEmail(request.getParameter("email"));
        try {
            user.setAge(Integer.parseInt(request.getParameter("age")));
        } catch (NumberFormatException e) {
            // 忽略
        }
        return user;
    }
}
```

#### 编辑用户Servlet

```java
package com.example.controller;

import com.example.model.User;
import com.example.service.UserService;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet("/user/edit")
public class UserEditServlet extends HttpServlet {
    
    private UserService userService = new UserService();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 获取用户ID
        String idStr = request.getParameter("id");
        if (idStr == null) {
            response.sendError(400, "缺少用户ID参数");
            return;
        }
        
        try {
            int id = Integer.parseInt(idStr);
            User user = userService.getUserById(id);
            
            if (user == null) {
                response.sendError(404, "用户不存在");
                return;
            }
            
            request.setAttribute("user", user);
            request.getRequestDispatcher("/WEB-INF/views/user-edit.jsp").forward(request, response);
            
        } catch (NumberFormatException e) {
            response.sendError(400, "无效的用户ID");
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        
        try {
            // 1. 获取表单数据
            int id = Integer.parseInt(request.getParameter("id"));
            String username = request.getParameter("username");
            String email = request.getParameter("email");
            String ageStr = request.getParameter("age");
            
            // 2. 创建User对象
            User user = new User();
            user.setId(id);
            user.setUsername(username);
            user.setEmail(email);
            user.setAge(Integer.parseInt(ageStr));
            
            // 3. 调用Service更新
            userService.updateUser(user);
            
            // 4. 重定向到列表页
            response.sendRedirect(request.getContextPath() + "/user/list");
            
        } catch (Exception e) {
            request.setAttribute("error", "更新用户失败: " + e.getMessage());
            request.setAttribute("user", createUserFromRequest(request));
            request.getRequestDispatcher("/WEB-INF/views/user-edit.jsp").forward(request, response);
        }
    }
    
    private User createUserFromRequest(HttpServletRequest request) {
        User user = new User();
        try {
            user.setId(Integer.parseInt(request.getParameter("id")));
        } catch (NumberFormatException e) {}
        user.setUsername(request.getParameter("username"));
        user.setEmail(request.getParameter("email"));
        try {
            user.setAge(Integer.parseInt(request.getParameter("age")));
        } catch (NumberFormatException e) {}
        return user;
    }
}
```

#### 删除用户Servlet

```java
package com.example.controller;

import com.example.service.UserService;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet("/user/delete")
public class UserDeleteServlet extends HttpServlet {
    
    private UserService userService = new UserService();
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String idStr = request.getParameter("id");
        if (idStr == null) {
            response.sendError(400, "缺少用户ID参数");
            return;
        }
        
        try {
            int id = Integer.parseInt(idStr);
            userService.deleteUser(id);
            
        } catch (Exception e) {
            request.setAttribute("error", "删除用户失败: " + e.getMessage());
        }
        
        // 重定向到列表页
        response.sendRedirect(request.getContextPath() + "/user/list");
    }
}
```

### 5. View层 - JSP页面

#### 用户列表页面

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>用户列表</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
    <div class="container">
        <h1>👥 用户管理系统</h1>
        
        <c:if test="${not empty error}">
            <div class="alert alert-error">${error}</div>
        </c:if>
        
        <div class="toolbar">
            <a href="${pageContext.request.contextPath}/user/add" class="btn btn-primary">
                ➕ 添加用户
            </a>
        </div>
        
        <table class="table">
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
                            <a href="${pageContext.request.contextPath}/user/edit?id=${user.id}" 
                               class="btn btn-sm btn-info">编辑</a>
                            <form action="${pageContext.request.contextPath}/user/delete" 
                                  method="POST" style="display: inline;"
                                  onsubmit="return confirm('确定要删除吗？')">
                                <input type="hidden" name="id" value="${user.id}">
                                <button type="submit" class="btn btn-sm btn-danger">删除</button>
                            </form>
                        </td>
                    </tr>
                </c:forEach>
                
                <c:if test="${empty users}">
                    <tr>
                        <td colspan="6" class="text-center">暂无用户数据</td>
                    </tr>
                </c:if>
            </tbody>
        </table>
    </div>
</body>
</html>
```

#### 添加用户页面

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>添加用户</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
    <div class="container">
        <h1>➕ 添加用户</h1>
        
        <c:if test="${not empty error}">
            <div class="alert alert-error">${error}</div>
        </c:if>
        
        <form action="${pageContext.request.contextPath}/user/add" method="POST" class="form">
            <div class="form-group">
                <label for="username">用户名：</label>
                <input type="text" id="username" name="username" 
                       value="${user != null ? user.username : ''}" required>
            </div>
            
            <div class="form-group">
                <label for="password">密码：</label>
                <input type="password" id="password" name="password" required minlength="6">
            </div>
            
            <div class="form-group">
                <label for="email">邮箱：</label>
                <input type="email" id="email" name="email" 
                       value="${user != null ? user.email : ''}">
            </div>
            
            <div class="form-group">
                <label for="age">年龄：</label>
                <input type="number" id="age" name="age" 
                       value="${user != null ? user.age : ''}" min="1" max="150">
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">保存</button>
                <a href="${pageContext.request.contextPath}/user/list" class="btn">取消</a>
            </div>
        </form>
    </div>
</body>
</html>
```

#### 编辑用户页面

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>编辑用户</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
    <div class="container">
        <h1>✏️ 编辑用户</h1>
        
        <c:if test="${not empty error}">
            <div class="alert alert-error">${error}</div>
        </c:if>
        
        <form action="${pageContext.request.contextPath}/user/edit" method="POST" class="form">
            <input type="hidden" name="id" value="${user.id}">
            
            <div class="form-group">
                <label for="username">用户名：</label>
                <input type="text" id="username" name="username" 
                       value="${user.username}" required>
            </div>
            
            <div class="form-group">
                <label for="email">邮箱：</label>
                <input type="email" id="email" name="email" 
                       value="${user.email}">
            </div>
            
            <div class="form-group">
                <label for="age">年龄：</label>
                <input type="number" id="age" name="age" 
                       value="${user.age}" min="1" max="150">
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">更新</button>
                <a href="${pageContext.request.contextPath}/user/list" class="btn">取消</a>
            </div>
        </form>
    </div>
</body>
</html>
```

### 6. CSS样式文件

```css
/* webapp/css/style.css */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background: #f5f5f5;
    padding: 20px;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    margin-bottom: 20px;
}

.toolbar {
    margin-bottom: 20px;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.table th {
    background: #4CAF50;
    color: white;
    padding: 12px;
    text-align: left;
}

.table td {
    padding: 10px 12px;
    border-bottom: 1px solid #eee;
}

.table tr:hover {
    background: #f8f9fa;
}

.btn {
    display: inline-block;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    font-size: 14px;
    transition: opacity 0.2s;
}

.btn:hover {
    opacity: 0.9;
}

.btn-primary {
    background: #4CAF50;
    color: white;
}

.btn-info {
    background: #2196F3;
    color: white;
}

.btn-danger {
    background: #f44336;
    color: white;
}

.btn-sm {
    padding: 4px 10px;
    font-size: 12px;
}

.form {
    max-width: 500px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    color: #555;
    font-weight: bold;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.form-actions {
    margin-top: 30px;
    display: flex;
    gap: 10px;
}

.alert {
    padding: 12px 15px;
    border-radius: 4px;
    margin-bottom: 20px;
}

.alert-error {
    background: #ffebee;
    color: #c62828;
    border-left: 4px solid #f44336;
}

.text-center {
    text-align: center;
    color: #999;
    padding: 40px;
}
```

## 10.6 MVC工作流程

```
用户请求
    ↓
Controller (Servlet)
    ↓ 接收请求参数
    ↓ 调用Service
    ↓
Service (业务逻辑)
    ↓ 验证数据
    ↓ 调用DAO
    ↓
DAO (数据访问)
    ↓ 执行SQL
    ↓
数据库
    ↓ 返回数据
    ↓
DAO
    ↓
Service
    ↓
Controller
    ↓ 将数据存入request
    ↓ 转发到JSP
    ↓
View (JSP)
    ↓ 使用EL+JSTL展示
    ↓
HTML响应
    ↓
用户浏览器
```

## 10.7 MVC的优势

1. **职责清晰**：每层只做自己的事
2. **易于维护**：修改某一层不影响其他层
3. **便于测试**：可以单独测试Service层
4. **代码复用**：同一个Service可以被多个Controller使用
5. **团队协作**：前端开发View，后端开发Model和Controller

## 10.8 练习题

1. **选择题**：在MVC模式中，哪个组件负责处理业务逻辑？
   - A) Model
   - B) View
   - C) Controller
   - D) Database

2. **填空题**：MVC中的V代表______，通常由______技术实现。

3. **简答题**：解释为什么Controller在处理完请求后应该使用重定向而不是转发到列表页（Post/Redirect/Get模式）。

4. **编程题**：为上面的用户管理系统添加一个搜索功能。要求：
   - 在列表页添加搜索框
   - 创建SearchServlet接收搜索关键词
   - 在UserService中添加搜索方法
   - 在UserDao中添加模糊查询

5. **思考题**：MVC模式有什么缺点？在什么场景下可能不适合使用MVC？

## 10.9 常见误区

### 误区1：在JSP中写业务逻辑
- **错误做法**：
  ```jsp
  <%
      Connection conn = DriverManager.getConnection(...);
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery("SELECT * FROM users");
      while (rs.next()) {
          // 处理数据
      }
  %>
  ```
- **正确做法**：业务逻辑在Service层，JSP只负责展示

### 误区2：Servlet直接操作数据库
- **错误做法**：
  ```java
  protected void doGet(...) {
      Connection conn = JdbcUtil.getConnection();
      // 直接执行SQL
  }
  ```
- **正确做法**：Servlet调用Service，Service调用DAO

### 误区3：View层放在Web根目录
- **错误做法**：JSP文件放在`webapp/`下，用户可直接访问
- **正确做法**：JSP放在`WEB-INF/views/`下，只能通过转发访问

### 误区4：Controller包含过多逻辑
- **错误做法**：
  ```java
  protected void doPost(...) {
      // 几十行业务验证
      // 数据库操作
      // 数据处理
      // 日志记录
  }
  ```
- **正确做法**：Controller只负责接收请求、调用Service、选择视图

### 误区5：忽略异常处理
- **错误做法**：不捕获异常或吞掉异常
- **正确做法**：
  ```java
  try {
      userService.addUser(user);
      response.sendRedirect("/user/list");
  } catch (IllegalArgumentException e) {
      // 业务异常，显示错误信息
      request.setAttribute("error", e.getMessage());
      request.getRequestDispatcher("/user-add.jsp").forward(request, response);
  } catch (Exception e) {
      // 系统异常，记录日志
      log.error("添加用户失败", e);
      request.setAttribute("error", "系统错误，请稍后重试");
      request.getRequestDispatcher("/user-add.jsp").forward(request, response);
  }
  ```

## 10.10 本章小结

MVC是JavaWeb开发的核心架构模式，掌握它能让你的代码更规范、更易维护。记住：
- Model负责数据和业务逻辑（Entity + DAO + Service）
- View负责数据展示（JSP + EL + JSTL）
- Controller负责请求处理（Servlet）
- JSP放在WEB-INF下，防止直接访问
- 使用Post/Redirect/Get模式防止重复提交

## 10.11 教程总结

恭喜你完成了JavaWeb基础教程的全部学习！让我们回顾一下这10章的内容：

1. **HTTP协议基础**：理解Web通信的基本规则
2. **Servlet技术**：掌握服务器端Java程序的开发
3. **JSP页面技术**：学习动态网页的生成
4. **EL表达式**：简化JSP中的数据访问
5. **JSTL标签库**：用标签替代Java代码
6. **Session与Cookie**：解决HTTP无状态问题
7. **过滤器**：实现请求的统一预处理
8. **监听器**：监听Web应用的各种事件
9. **JDBC数据库访问**：连接和操作数据库
10. **MVC设计模式**：组织代码结构，实现关注点分离

### 下一步学习建议

1. **框架学习**：Spring MVC、MyBatis、Spring Boot
2. **前端技术**：HTML5、CSS3、JavaScript、Vue.js
3. **进阶主题**：RESTful API、微服务、分布式系统
4. **实践项目**：动手做一个完整的Web应用

祝你在JavaWeb开发的道路上越走越远！
