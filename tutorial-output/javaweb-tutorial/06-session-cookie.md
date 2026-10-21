# 第6章：Session与Cookie

## 6.1 简介

HTTP协议是无状态的，这意味着服务器不会记住之前的请求。但实际应用中，我们需要"记住"用户是谁、购物车里有什么、是否已登录等信息。Session和Cookie就是为了解决这个问题而生的两种技术，它们让Web应用具备了"记忆能力"。

## 6.2 核心概念定义

**Cookie** 是服务器发送到浏览器并保存在客户端的一小段数据。每次请求时，浏览器会自动携带Cookie发送给服务器。

**Session** 是服务器端保存的用户会话数据。服务器为每个用户创建一个唯一的Session ID，并通过Cookie或URL重写传递给客户端。

关键区别：
- **存储位置**：Cookie在客户端，Session在服务器
- **安全性**：Session更安全，Cookie容易被篡改
- **容量限制**：Cookie通常限制4KB，Session无明确限制
- **生命周期**：Cookie可设置过期时间，Session默认30分钟

## 6.3 生活类比

想象你去健身房锻炼：

**Cookie（会员卡）**：
- 你办理了一张实体会员卡（Cookie）
- 卡片上记录了你的会员编号、有效期等信息
- 每次去健身房都要出示卡片（浏览器自动发送Cookie）
- 如果卡片丢失或被别人捡到，可能被盗用（安全风险）
- 你可以选择永久有效或限时有效（设置过期时间）

**Session（储物柜）**：
- 前台给你一个储物柜钥匙（Session ID）
- 你的衣物、水杯等物品存放在储物柜里（Session数据）
- 只有你有钥匙能打开（服务器端安全存储）
- 离开时归还钥匙，储物柜清空（Session销毁）
- 如果长时间不取，管理员会清理（Session超时）

**最佳实践**：
会员卡（Cookie）只记录编号，实际物品（数据）存在储物柜（Session）里。这样既方便识别，又保证安全。

## 6.4 Cookie详解

### 创建Cookie

```java
// 创建Cookie
Cookie cookie = new Cookie("username", "张三");
cookie.setMaxAge(7 * 24 * 60 * 60); // 7天过期
cookie.setPath("/"); // 所有路径都可访问
response.addCookie(cookie);
```

### 读取Cookie

```java
Cookie[] cookies = request.getCookies();
if (cookies != null) {
    for (Cookie cookie : cookies) {
        if ("username".equals(cookie.getName())) {
            String value = cookie.getValue();
            System.out.println("用户名: " + value);
        }
    }
}
```

### 删除Cookie

```java
Cookie cookie = new Cookie("username", null);
cookie.setMaxAge(0); // 立即过期
cookie.setPath("/");
response.addCookie(cookie);
```

## 6.5 Session详解

### 获取Session

```java
// 获取现有Session，如果没有则创建新的
HttpSession session = request.getSession();

// 获取现有Session，如果没有则返回null
HttpSession session = request.getSession(false);
```

### 操作Session属性

```java
// 存储数据
session.setAttribute("user", userObject);
session.setAttribute("cart", cartList);

// 获取数据
User user = (User) session.getAttribute("user");
List<Item> cart = (List<Item>) session.getAttribute("cart");

// 删除数据
session.removeAttribute("tempData");

// 销毁Session
session.invalidate();
```

### 配置Session超时

```xml
<!-- web.xml中配置 -->
<session-config>
    <session-timeout>30</session-timeout> <!-- 30分钟 -->
</session-config>
```

```java
// 代码中配置
session.setMaxInactiveInterval(1800); // 30分钟（秒）
```

## 6.6 代码示例

### 示例1：用户登录系统（完整实现）

登录Servlet：

```java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String rememberMe = request.getParameter("rememberMe");
        
        // 验证用户（实际应查询数据库）
        if ("admin".equals(username) && "123456".equals(password)) {
            
            // 1. 创建Session
            HttpSession session = request.getSession();
            session.setAttribute("currentUser", username);
            session.setAttribute("loginTime", new java.util.Date());
            
            // 2. 如果勾选"记住我"，创建Cookie
            if ("on".equals(rememberMe)) {
                Cookie userCookie = new Cookie("rememberUser", username);
                userCookie.setMaxAge(7 * 24 * 60 * 60); // 7天
                userCookie.setPath("/");
                response.addCookie(userCookie);
            }
            
            // 3. 重定向到首页
            response.sendRedirect("index.jsp");
            
        } else {
            // 登录失败
            response.sendRedirect("login.jsp?error=1");
        }
    }
}
```

登录页面：

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
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
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
        .remember-me {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 15px 0;
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
        // 检查是否有记住的用户名
        String rememberedUser = "";
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("rememberUser".equals(cookie.getName())) {
                    rememberedUser = cookie.getValue();
                    break;
                }
            }
        }
        
        String error = request.getParameter("error");
    %>
    
    <div class="login-container">
        <h2>🔐 用户登录</h2>
        <form action="/login" method="POST">
            <div class="form-group">
                <label for="username">用户名：</label>
                <input type="text" id="username" name="username" 
                       value="<%= rememberedUser %>" required>
            </div>
            <div class="form-group">
                <label for="password">密码：</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="remember-me">
                <input type="checkbox" id="rememberMe" name="rememberMe" 
                       <%= !rememberedUser.isEmpty() ? "checked" : "" %>>
                <label for="rememberMe">记住我（7天）</label>
            </div>
            <button type="submit">登录</button>
            
            <% if ("1".equals(error)) { %>
                <p class="error">用户名或密码错误！</p>
            <% } %>
        </form>
    </div>
</body>
</html>
```

首页（显示登录状态）：

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 30px auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .user-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .btn-logout {
            background: #e74c3c;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <%
        // 检查登录状态
        HttpSession sessionObj = request.getSession(false);
        String currentUser = null;
        java.util.Date loginTime = null;
        
        if (sessionObj != null) {
            currentUser = (String) sessionObj.getAttribute("currentUser");
            loginTime = (java.util.Date) sessionObj.getAttribute("loginTime");
        }
        
        // 如果未登录但有记住的Cookie，自动登录
        if (currentUser == null) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("rememberUser".equals(cookie.getName())) {
                        currentUser = cookie.getValue();
                        // 创建新Session
                        sessionObj = request.getSession();
                        sessionObj.setAttribute("currentUser", currentUser);
                        sessionObj.setAttribute("loginTime", new java.util.Date());
                        loginTime = (java.util.Date) sessionObj.getAttribute("loginTime");
                        break;
                    }
                }
            }
        }
    %>
    
    <div class="header">
        <h1>🏠 网站首页</h1>
        <% if (currentUser != null) { %>
            <a href="/logout" class="btn-logout">退出登录</a>
        <% } else { %>
            <a href="login.jsp" style="color: white;">登录</a>
        <% } %>
    </div>
    
    <% if (currentUser != null) { %>
        <div class="user-info">
            <h2>欢迎回来，<%= currentUser %>！</h2>
            <p>登录时间：<%= loginTime %></p>
            <p>Session ID：<%= sessionObj.getId() %></p>
            <p>Session创建时间：<%= new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date(sessionObj.getCreationTime())) %></p>
            <p>最后访问时间：<%= new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date(sessionObj.getLastAccessedTime())) %></p>
        </div>
        
        <h2>功能菜单</h2>
        <ul>
            <li><a href="#">个人资料</a></li>
            <li><a href="#">我的订单</a></li>
            <li><a href="#">购物车</a></li>
            <li><a href="#">设置</a></li>
        </ul>
    <% } else { %>
        <div class="user-info">
            <h2>您尚未登录</h2>
            <p>请先登录以访问更多功能</p>
            <a href="login.jsp" style="color: #667eea;">立即登录</a>
        </div>
    <% } %>
</body>
</html>
```

退出登录Servlet：

```java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. 获取Session
        HttpSession session = request.getSession(false);
        
        // 2. 销毁Session
        if (session != null) {
            session.invalidate();
        }
        
        // 3. 删除记住用户的Cookie
        Cookie cookie = new Cookie("rememberUser", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        
        // 4. 重定向到登录页
        response.sendRedirect("login.jsp");
    }
}
```

### 示例2：购物车系统

购物车Servlet：

```java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.*;

@WebServlet("/cart")
public class CartServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String action = request.getParameter("action");
        HttpSession session = request.getSession();
        
        // 从Session获取购物车
        @SuppressWarnings("unchecked")
        Map<String, Integer> cart = (Map<String, Integer>) session.getAttribute("cart");
        if (cart == null) {
            cart = new HashMap<>();
            session.setAttribute("cart", cart);
        }
        
        if ("add".equals(action)) {
            // 添加商品
            String productId = request.getParameter("productId");
            String productName = request.getParameter("productName");
            
            if (cart.containsKey(productId)) {
                cart.put(productId, cart.get(productId) + 1);
            } else {
                cart.put(productId, 1);
            }
            
            // 保存商品名称映射
            @SuppressWarnings("unchecked")
            Map<String, String> productNames = (Map<String, String>) session.getAttribute("productNames");
            if (productNames == null) {
                productNames = new HashMap<>();
                session.setAttribute("productNames", productNames);
            }
            productNames.put(productId, productName);
            
        } else if ("remove".equals(action)) {
            // 移除商品
            String productId = request.getParameter("productId");
            cart.remove(productId);
            
        } else if ("clear".equals(action)) {
            // 清空购物车
            cart.clear();
        }
        
        // 转发到购物车页面
        request.getRequestDispatcher("/cart.jsp").forward(request, response);
    }
}
```

购物车页面：

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>购物车</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
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
        .btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .btn-remove {
            background: #f44336;
            color: white;
        }
        .btn-clear {
            background: #ff9800;
            color: white;
            margin-top: 15px;
        }
        .empty-cart {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }
        .product-list {
            margin-top: 30px;
        }
        .product-item {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .btn-add {
            background: #4CAF50;
            color: white;
        }
    </style>
</head>
<body>
    <h1>🛒 购物车</h1>
    
    <%
        @SuppressWarnings("unchecked")
        Map<String, Integer> cart = (Map<String, Integer>) session.getAttribute("cart");
        @SuppressWarnings("unchecked")
        Map<String, String> productNames = (Map<String, String>) session.getAttribute("productNames");
    %>
    
    <c:choose>
        <c:when test="${not empty cart and not empty cart}">
            <table>
                <thead>
                    <tr>
                        <th>商品名称</th>
                        <th>数量</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="entry" items="${cart}">
                        <tr>
                            <td>${productNames[entry.key]}</td>
                            <td>${entry.value}</td>
                            <td>
                                <a href="/cart?action=remove&productId=${entry.key}" 
                                   class="btn btn-remove">删除</a>
                            </td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
            
            <a href="/cart?action=clear" class="btn btn-clear">清空购物车</a>
        </c:when>
        <c:otherwise>
            <div class="empty-cart">
                <h2>购物车是空的</h2>
                <p>快去选购心仪的商品吧！</p>
            </div>
        </c:otherwise>
    </c:choose>
    
    <div class="product-list">
        <h2>推荐商品</h2>
        <div class="product-item">
            <span>iPhone 15</span>
            <a href="/cart?action=add&productId=p1&productName=iPhone 15" 
               class="btn btn-add">加入购物车</a>
        </div>
        <div class="product-item">
            <span>MacBook Pro</span>
            <a href="/cart?action=add&productId=p2&productName=MacBook Pro" 
               class="btn btn-add">加入购物车</a>
        </div>
        <div class="product-item">
            <span>AirPods Pro</span>
            <a href="/cart?action=add&productId=p3&productName=AirPods Pro" 
               class="btn btn-add">加入购物车</a>
        </div>
    </div>
</body>
</html>
```

### 示例3：访问计数器（使用Cookie）

```java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

@WebServlet("/visit-counter")
public class VisitCounterServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("text/html;charset=UTF-8");
        
        int visitCount = 0;
        
        // 从Cookie读取访问次数
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("visitCount".equals(cookie.getName())) {
                    try {
                        visitCount = Integer.parseInt(cookie.getValue());
                    } catch (NumberFormatException e) {
                        visitCount = 0;
                    }
                    break;
                }
            }
        }
        
        // 增加访问次数
        visitCount++;
        
        // 保存回Cookie
        Cookie countCookie = new Cookie("visitCount", String.valueOf(visitCount));
        countCookie.setMaxAge(365 * 24 * 60 * 60); // 1年
        countCookie.setPath("/");
        response.addCookie(countCookie);
        
        // 显示结果
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>访问计数器</title></head>");
        out.println("<body style='font-family: Arial; max-width: 600px; margin: 50px auto; text-align: center;'>");
        out.println("<h1>📊 访问计数器</h1>");
        out.println("<div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);");
        out.println("     color: white; padding: 40px; border-radius: 10px; margin: 20px 0;'>");
        out.println("<h2>您是第 " + visitCount + " 位访客</h2>");
        out.println("</div>");
        out.println("<p>这个计数器使用Cookie存储在您的浏览器中</p>");
        out.println("</body>");
        out.println("</html>");
    }
}
```

## 6.7 Session与Cookie对比

| 特性 | Cookie | Session |
|------|--------|---------|
| 存储位置 | 客户端（浏览器） | 服务器端 |
| 安全性 | 较低（可被查看和篡改） | 较高（数据在服务器） |
| 容量 | 约4KB | 无明确限制 |
| 性能 | 每次请求都传输 | 只在首次传输Session ID |
| 生命周期 | 可设置长期有效 | 默认30分钟超时 |
| 适用场景 | 记住用户名、偏好设置 | 登录状态、购物车、临时数据 |

## 6.8 练习题

1. **选择题**：以下关于Session和Cookie的说法，哪个是正确的？
   - A) Session数据存储在客户端
   - B) Cookie比Session更安全
   - C) Session默认超时时间是30分钟
   - D) Cookie可以存储任意大小的数据

2. **填空题**：要删除一个Cookie，需要将其MaxAge设置为______，并将______设置为相同的路径。

3. **简答题**：解释为什么Session比Cookie更安全，以及在什么场景下应该使用Cookie而不是Session。

4. **编程题**：编写一个Servlet，实现"最近浏览商品"功能。使用Cookie记录用户最近浏览的5个商品ID，并在页面上显示。

5. **思考题**：如果用户禁用了浏览器的Cookie功能，Session还能正常工作吗？有哪些替代方案？

## 6.9 常见误区

### 误区1：认为Session绝对安全
- **错误理解**：Session数据在服务器，所以完全安全
- **正确理解**：虽然数据在服务器，但Session ID通过Cookie传输，可能被劫持（Session Fixation攻击）。应使用HTTPS和HttpOnly标志

### 误区2：在Cookie中存储敏感信息
- **错误做法**：
  ```java
  Cookie cookie = new Cookie("password", userPassword);
  ```
- **正确做法**：Cookie只存储非敏感信息，如用户名、偏好设置。敏感数据放Session

### 误区3：忘记设置Cookie路径
- **错误做法**：不设置path，导致子路径无法访问Cookie
- **正确做法**：
  ```java
  cookie.setPath("/"); // 整个应用都可访问
  ```

### 误区4：Session内存泄漏
- **错误做法**：向Session中存放大量数据且从不清理
- **正确做法**：
  - 及时调用`session.removeAttribute()`清理不需要的数据
  - 用户退出时调用`session.invalidate()`
  - 避免在Session中存储大对象

### 误区5：混淆getSession()和getSession(false)
- **错误理解**：两者功能相同
- **正确理解**：
  - `getSession()`：没有Session时创建新的
  - `getSession(false)`：没有Session时返回null，用于检查登录状态

## 6.10 本章小结

Session和Cookie解决了HTTP无状态的问题，是Web应用的基础设施。记住：
- Cookie存储在客户端，适合保存非敏感的持久化数据
- Session存储在服务器，适合保存临时的敏感数据
- 两者配合使用：Cookie存Session ID，Session存实际数据
- 注意安全性，敏感数据不要放在Cookie中

下一章我们将学习过滤器（Filter），它可以在请求到达Servlet之前进行预处理。
