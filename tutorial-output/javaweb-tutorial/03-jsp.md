# 第3章：JSP页面技术

## 3.1 简介

在Servlet中生成HTML非常繁琐，需要大量的`out.println()`语句。JSP（JavaServer Pages）技术应运而生，它允许我们在HTML中嵌入Java代码，让页面开发更直观、更高效。JSP本质上是Servlet的简化形式，最终会被编译成Servlet执行。

## 3.2 核心概念定义

**JSP（JavaServer Pages）** 是一种动态网页技术，通过在HTML中嵌入Java代码来生成动态内容。JSP文件以`.jsp`为扩展名，首次访问时会被Web容器编译成Servlet类。

关键特点：
- **HTML为主，Java为辅**：适合展示层开发
- **自动编译**：JSP文件会被转换为Servlet
- **九大内置对象**：无需声明即可使用request、response等
- **标签库支持**：配合JSTL可避免在页面写Java代码

## 3.3 生活类比

想象制作一份个性化邀请函：

1. **邀请函模板（JSP文件）** 有固定的格式和布局
2. **空白处（Java代码）** 需要根据不同客人填写姓名、日期等信息
3. **打印店（Tomcat容器）** 收到订单后，将模板和个人信息结合
4. **生成成品（HTML页面）** 发送给每位客人

如果每次都要重新设计模板（用Servlet写HTML），效率很低。有了模板（JSP），只需修改个人信息部分即可。

## 3.4 JSP基本语法

### 1. JSP表达式
用于输出变量值，等价于`out.print()`

```jsp
<%= new java.util.Date() %>
```

### 2. JSP脚本片段
嵌入Java代码块

```jsp
<%
    String name = "张三";
    int age = 25;
%>
```

### 3. JSP声明
定义成员变量和方法

```jsp
<%!
    private int count = 0;
    
    public String formatDate(Date date) {
        return new SimpleDateFormat("yyyy-MM-dd").format(date);
    }
%>
```

### 4. JSP注释
```jsp
<%-- 这是JSP注释，不会发送到客户端 --%>
<!-- 这是HTML注释，会发送到客户端 -->
```

## 3.5 JSP九大内置对象

| 对象 | 类型 | 作用域 | 说明 |
|------|------|--------|------|
| request | HttpServletRequest | request | 请求对象 |
| response | HttpServletResponse | page | 响应对象 |
| session | HttpSession | session | 会话对象 |
| application | ServletContext | application | 应用上下文 |
| out | JspWriter | page | 输出流 |
| pageContext | PageContext | page | 页面上下文 |
| config | ServletConfig | page | 配置对象 |
| page | Object | page | 当前页面对象 |
| exception | Throwable | page | 异常对象（仅错误页面可用） |

## 3.6 代码示例

### 示例1：基础JSP页面 - 显示用户信息

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>用户信息</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        .user-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .user-card h2 {
            margin-top: 0;
        }
        .info-item {
            margin: 10px 0;
            padding: 10px;
            background: rgba(255,255,255,0.2);
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <%
        // 从request获取参数
        String username = request.getParameter("username");
        String age = request.getParameter("age");
        String email = request.getParameter("email");
        
        // 设置默认值
        if (username == null) username = "访客";
        if (age == null) age = "未知";
        if (email == null) email = "未提供";
    %>
    
    <div class="user-card">
        <h2>👤 用户信息卡</h2>
        <div class="info-item">
            <strong>姓名：</strong><%= username %>
        </div>
        <div class="info-item">
            <strong>年龄：</strong><%= age %>
        </div>
        <div class="info-item">
            <strong>邮箱：</strong><%= email %>
        </div>
        <div class="info-item">
            <strong>访问时间：</strong><%= new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date()) %>
        </div>
    </div>
</body>
</html>
```

访问URL：`http://localhost:8080/myapp/user.jsp?username=张三&age=25&email=zhangsan@example.com`

### 示例2：JSP循环显示商品列表

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*, com.example.model.Product" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>商品列表</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 30px auto;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #4CAF50;
            color: white;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .price {
            color: #e74c3c;
            font-weight: bold;
        }
        .stock-low {
            color: #e74c3c;
        }
        .stock-ok {
            color: #27ae60;
        }
    </style>
</head>
<body>
    <h1>🛍️ 商品列表</h1>
    
    <%
        // 模拟从数据库获取商品数据
        List<Product> products = new ArrayList<>();
        products.add(new Product(1, "iPhone 15", 7999, 50));
        products.add(new Product(2, "MacBook Pro", 12999, 30));
        products.add(new Product(3, "AirPods Pro", 1999, 100));
        products.add(new Product(4, "iPad Air", 4799, 0));
        products.add(new Product(5, "Apple Watch", 3199, 75));
        
        // 将数据存入request，供后续使用
        request.setAttribute("productList", products);
    %>
    
    <table>
        <thead>
            <tr>
                <th>编号</th>
                <th>商品名称</th>
                <th>价格</th>
                <th>库存</th>
                <th>状态</th>
            </tr>
        </thead>
        <tbody>
            <%
                List<Product> productList = (List<Product>) request.getAttribute("productList");
                for (Product product : productList) {
            %>
            <tr>
                <td><%= product.getId() %></td>
                <td><%= product.getName() %></td>
                <td class="price">¥<%= product.getPrice() %></td>
                <td>
                    <span class="<%= product.getStock() > 0 ? "stock-ok" : "stock-low" %>">
                        <%= product.getStock() %>
                    </span>
                </td>
                <td>
                    <% if (product.getStock() > 0) { %>
                        <span style="color: green;">✓ 有货</span>
                    <% } else { %>
                        <span style="color: red;">✗ 缺货</span>
                    <% } %>
                </td>
            </tr>
            <%
                }
            %>
        </tbody>
    </table>
    
    <p>共 <%= products.size() %> 件商品</p>
</body>
</html>
```

对应的Product模型类：

```java
package com.example.model;

public class Product {
    private int id;
    private String name;
    private double price;
    private int stock;
    
    public Product(int id, String name, double price, int stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
    
    // Getter和Setter
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}
```

### 示例3：JSP表单处理 - 用户登录

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>用户登录</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
        }
        .login-box {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            width: 350px;
        }
        h2 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #555;
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            opacity: 0.9;
        }
        .error {
            color: #e74c3c;
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <%
        // 检查是否有错误信息
        String error = request.getParameter("error");
        String errorMsg = "";
        
        if ("1".equals(error)) {
            errorMsg = "用户名或密码错误！";
        } else if ("2".equals(error)) {
            errorMsg = "请先登录！";
        }
    %>
    
    <div class="login-box">
        <h2>🔐 用户登录</h2>
        <form action="LoginServlet" method="POST">
            <div class="form-group">
                <label for="username">用户名：</label>
                <input type="text" id="username" name="username" required 
                       value="<%= request.getParameter("username") != null ? request.getParameter("username") : "" %>">
            </div>
            <div class="form-group">
                <label for="password">密码：</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">登录</button>
            
            <% if (!errorMsg.isEmpty()) { %>
                <p class="error"><%= errorMsg %></p>
            <% } %>
        </form>
        <p style="text-align: center; margin-top: 20px;">
            <a href="register.jsp">还没有账号？立即注册</a>
        </p>
    </div>
</body>
</html>
```

对应的LoginServlet：

```java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        // 简单验证（实际项目应查询数据库）
        if ("admin".equals(username) && "123456".equals(password)) {
            // 登录成功，创建session
            HttpSession session = request.getSession();
            session.setAttribute("user", username);
            session.setMaxInactiveInterval(30 * 60); // 30分钟
            
            // 重定向到首页
            response.sendRedirect("index.jsp");
        } else {
            // 登录失败，返回登录页并显示错误
            response.sendRedirect("login.jsp?error=1&username=" + username);
        }
    }
}
```

### 示例4：JSP包含其他页面

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>网站首页</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .header {
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .nav {
            background: #444;
            padding: 10px;
        }
        .nav a {
            color: white;
            text-decoration: none;
            margin: 0 15px;
        }
        .content {
            padding: 30px;
            min-height: 400px;
        }
        .footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 20px;
            position: fixed;
            bottom: 0;
            width: 100%;
        }
    </style>
</head>
<body>
    <!-- 包含头部 -->
    <%@ include file="header.jsp" %>
    
    <!-- 包含导航 -->
    <%@ include file="nav.jsp" %>
    
    <!-- 主要内容 -->
    <div class="content">
        <h1>欢迎来到我们的网站</h1>
        <p>这是一个使用JSP技术构建的动态网站。</p>
        
        <%
            // 动态内容
            String[] features = {"用户管理", "商品展示", "订单处理", "数据统计"};
        %>
        
        <h2>主要功能</h2>
        <ul>
            <% for (String feature : features) { %>
                <li><%= feature %></li>
            <% } %>
        </ul>
    </div>
    
    <!-- 包含底部 -->
    <%@ include file="footer.jsp" %>
</body>
</html>
```

## 3.7 JSP动作标签

### 1. jsp:include - 动态包含
```jsp
<jsp:include page="header.jsp">
    <jsp:param name="title" value="首页" />
</jsp:include>
```

### 2. jsp:forward - 转发
```jsp
<jsp:forward page="success.jsp">
    <jsp:param name="message" value="操作成功" />
</jsp:forward>
```

### 3. jsp:useBean - 使用JavaBean
```jsp
<jsp:useBean id="user" class="com.example.User" scope="session" />
<jsp:setProperty name="user" property="name" value="张三" />
<jsp:getProperty name="user" property="name" />
```

## 3.8 练习题

1. **选择题**：JSP页面首次被访问时会发生什么？
   - A) 直接返回HTML
   - B) 编译成Servlet类
   - C) 报错
   - D) 跳转到其他页面

2. **填空题**：JSP中的`<%= %>`语法等价于______方法，用于输出表达式的值。

3. **简答题**：解释`<%@ include %>`指令和`<jsp:include>`动作的区别。

4. **编程题**：编写一个JSP页面，接收三个数字参数，计算并显示它们的平均值。要求处理除零异常。

5. **思考题**：为什么说JSP适合做展示层而不适合做业务逻辑层？在实际项目中应该如何分工？

## 3.9 常见误区

### 误区1：在JSP中写大量Java代码
- **错误做法**：
  ```jsp
  <%
      // 几十行业务逻辑代码
      Connection conn = DriverManager.getConnection(...);
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery("SELECT * FROM ...");
      while (rs.next()) {
          // 处理数据
      }
  %>
  ```
- **正确做法**：业务逻辑放在Servlet或Service层，JSP只负责展示
  ```jsp
  <%
      List<User> users = (List<User>) request.getAttribute("users");
      for (User user : users) {
  %>
      <p><%= user.getName() %></p>
  <%
      }
  %>
  ```

### 误区2：忽略字符编码设置
- **错误做法**：不设置pageEncoding
- **正确做法**：
  ```jsp
  <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
  ```

### 误区3：混淆include指令和动作
- **include指令**（`<%@ include %>`）：编译时包含，合并为一个Servlet
- **include动作**（`<jsp:include>`）：运行时包含，分别执行后合并结果

### 误区4：过度使用scriptlet
- **错误理解**：JSP就是用来写Java代码的
- **正确理解**：现代JSP开发推荐使用EL表达式和JSTL标签库，避免在页面写Java代码

### 误区5：忘记处理异常
- **错误做法**：不处理可能的空指针异常
- **正确做法**：
  ```jsp
  <%
      String name = request.getParameter("name");
      if (name != null && !name.isEmpty()) {
  %>
      <h1>你好，<%= name %></h1>
  <%
      } else {
  %>
      <h1>你好，访客</h1>
  <%
      }
  %>
  ```

## 3.10 本章小结

JSP让动态网页开发更简单，但要注意职责分离。记住：
- JSP本质是Servlet，首次访问时编译
- 九大内置对象可直接使用，无需声明
- 业务逻辑放Servlet，展示逻辑放JSP
- 优先使用EL表达式和JSTL，减少Java代码

下一章我们将学习EL表达式，它能让我们彻底告别JSP中的Java代码。
