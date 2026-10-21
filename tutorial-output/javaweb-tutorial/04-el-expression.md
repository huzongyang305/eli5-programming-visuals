# 第4章：EL表达式

## 4.1 简介

在JSP中写Java代码虽然方便，但会让页面变得混乱且难以维护。EL（Expression Language，表达式语言）的出现彻底改变了这一局面。它提供了一种简洁的语法来访问数据，让JSP页面回归HTML的本质——专注于展示而非逻辑。

## 4.2 核心概念定义

**EL表达式** 是一种简化的数据访问语言，用于在JSP页面中读取和显示数据。它以`${}`为语法标记，可以访问JavaBean属性、集合元素、请求参数等，无需编写Java代码。

关键特点：
- **简洁语法**：`${user.name}` 代替 `<%= user.getName() %>`
- **自动类型转换**：自动处理字符串到数字等转换
- **空值安全**：访问null对象不会抛出异常
- **隐式对象**：提供pageScope、requestScope等快捷访问

## 4.3 生活类比

想象你在图书馆找书：

**传统方式（Java代码）**：
1. 走到前台说："请帮我查一下《Java编程思想》这本书"
2. 图书管理员去系统查询
3. 告诉你："在第3排第5层"
4. 你自己去取书

**EL表达式方式**：
直接说："我要《Java编程思想》"
书架自动把书送到你面前

EL就像智能书架，你只需说出书名（变量名），它自动帮你找到并展示，无需关心查找过程。

## 4.4 EL基本语法

### 1. 访问变量
```jsp
${username}
```

### 2. 访问JavaBean属性
```jsp
${user.name}      <!-- 等价于 user.getName() -->
${user.age}       <!-- 等价于 user.getAge() -->
```

### 3. 访问集合元素
```jsp
${list[0]}        <!-- List的第一个元素 -->
${map.key}        <!-- Map的指定key对应的值 -->
${array[2]}       <!-- 数组的第三个元素 -->
```

### 4. 运算符
```jsp
${num1 + num2}    <!-- 加法 -->
${str1 eq str2}   <!-- 相等比较 -->
${flag ? "是" : "否"}  <!-- 三元运算符 -->
```

## 4.5 EL隐式对象

EL提供了11个隐式对象，用于访问不同作用域的数据：

| 隐式对象 | 说明 | 对应Java对象 |
|----------|------|--------------|
| pageScope | 页面作用域 | PageContext |
| requestScope | 请求作用域 | HttpServletRequest |
| sessionScope | 会话作用域 | HttpSession |
| applicationScope | 应用作用域 | ServletContext |
| param | 请求参数（单个值） | request.getParameter() |
| paramValues | 请求参数（多个值） | request.getParameterValues() |
| header | 请求头（单个值） | request.getHeader() |
| headerValues | 请求头（多个值） | - |
| cookie | Cookie对象 | Cookie[] |
| initParam | 初始化参数 | ServletConfig |
| pageContext | 页面对象 | PageContext |

## 4.6 代码示例

### 示例1：基础EL表达式 - 显示用户信息

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>EL表达式示例</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        .label {
            color: #666;
            font-weight: bold;
        }
        .value {
            color: #333;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <%
        // Servlet或前面的代码设置数据
        pageContext.setAttribute("pageTitle", "用户信息中心");
        
        request.setAttribute("welcomeMsg", "欢迎回来");
        
        session.setAttribute("loginTime", new java.util.Date());
        
        application.setAttribute("siteName", "我的网站");
    %>
    
    <h1>${pageTitle}</h1>
    
    <div class="info-box">
        <p><span class="label">站点名称：</span>
           <span class="value">${applicationScope.siteName}</span></p>
        
        <p><span class="label">欢迎信息：</span>
           <span class="value">${requestScope.welcomeMsg}</span></p>
        
        <p><span class="label">登录时间：</span>
           <span class="value">${sessionScope.loginTime}</span></p>
    </div>
    
    <h2>访问请求参数</h2>
    <div class="info-box">
        <p>用户名：${param.username}</p>
        <p>年龄：${param.age}</p>
        <p>城市：${param.city}</p>
    </div>
    
    <h2>访问请求头</h2>
    <div class="info-box">
        <p>User-Agent：${header["User-Agent"]}</p>
        <p>Accept-Language：${header["Accept-Language"]}</p>
    </div>
</body>
</html>
```

访问URL：`http://localhost:8080/myapp/el-demo.jsp?username=张三&age=25&city=北京`

### 示例2：EL访问JavaBean

首先创建User类：

```java
package com.example.model;

public class User {
    private String name;
    private int age;
    private String email;
    private Address address;
    
    public User() {}
    
    public User(String name, int age, String email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }
    
    // Getter和Setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
}
```

Address类：

```java
package com.example.model;

public class Address {
    private String province;
    private String city;
    private String detail;
    
    public Address() {}
    
    public Address(String province, String city, String detail) {
        this.province = province;
        this.city = city;
        this.detail = detail;
    }
    
    // Getter和Setter
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
}
```

Servlet设置数据：

```java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import com.example.model.*;

@WebServlet("/user-info")
public class UserInfoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 创建用户对象
        User user = new User("张三", 25, "zhangsan@example.com");
        
        Address address = new Address("广东省", "深圳市", "南山区科技路1号");
        user.setAddress(address);
        
        // 存入request
        request.setAttribute("currentUser", user);
        
        // 转发到JSP
        request.getRequestDispatcher("/user-info.jsp").forward(request, response);
    }
}
```

JSP页面使用EL显示：

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>用户详情</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        .profile-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: white;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
        }
        .body {
            padding: 30px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }
        .info-label {
            color: #666;
            font-weight: bold;
        }
        .info-value {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="profile-card">
        <div class="header">
            <div class="avatar">👤</div>
            <h2>${currentUser.name}</h2>
        </div>
        
        <div class="body">
            <div class="info-row">
                <span class="info-label">姓名：</span>
                <span class="info-value">${currentUser.name}</span>
            </div>
            <div class="info-row">
                <span class="info-label">年龄：</span>
                <span class="info-value">${currentUser.age} 岁</span>
            </div>
            <div class="info-row">
                <span class="info-label">邮箱：</span>
                <span class="info-value">${currentUser.email}</span>
            </div>
            <div class="info-row">
                <span class="info-label">省份：</span>
                <span class="info-value">${currentUser.address.province}</span>
            </div>
            <div class="info-row">
                <span class="info-label">城市：</span>
                <span class="info-value">${currentUser.address.city}</span>
            </div>
            <div class="info-row">
                <span class="info-label">详细地址：</span>
                <span class="info-value">${currentUser.address.detail}</span>
            </div>
        </div>
    </div>
</body>
</html>
```

### 示例3：EL访问集合和数组

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*, com.example.model.Product" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>商品展示</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 30px auto;
            padding: 20px;
        }
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .product-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 20px;
            transition: transform 0.2s;
        }
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .product-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .product-price {
            color: #e74c3c;
            font-size: 24px;
            font-weight: bold;
        }
        .product-stock {
            color: #666;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <%
        // 模拟商品数据
        List<Product> products = new ArrayList<>();
        products.add(new Product(1, "iPhone 15", 7999, 50));
        products.add(new Product(2, "MacBook Pro", 12999, 30));
        products.add(new Product(3, "AirPods Pro", 1999, 100));
        
        request.setAttribute("products", products);
        
        // Map示例
        Map<String, String> config = new HashMap<>();
        config.put("siteName", "电子产品商城");
        config.put("version", "2.0");
        config.put("author", "开发团队");
        request.setAttribute("config", config);
        
        // 数组示例
        String[] categories = {"手机", "电脑", "配件", "智能家居"};
        request.setAttribute("categories", categories);
    %>
    
    <h1>${config.siteName} v${config.version}</h1>
    <p>作者：${config.author}</p>
    
    <h2>商品分类</h2>
    <ul>
        <li>${categories[0]}</li>
        <li>${categories[1]}</li>
        <li>${categories[2]}</li>
        <li>${categories[3]}</li>
    </ul>
    
    <h2>热门商品</h2>
    <div class="product-grid">
        <div class="product-card">
            <div class="product-name">${products[0].name}</div>
            <div class="product-price">¥${products[0].price}</div>
            <div class="product-stock">库存：${products[0].stock}</div>
        </div>
        <div class="product-card">
            <div class="product-name">${products[1].name}</div>
            <div class="product-price">¥${products[1].price}</div>
            <div class="product-stock">库存：${products[1].stock}</div>
        </div>
        <div class="product-card">
            <div class="product-name">${products[2].name}</div>
            <div class="product-price">¥${products[2].price}</div>
            <div class="product-stock">库存：${products[2].stock}</div>
        </div>
    </div>
</body>
</html>
```

### 示例4：EL运算符和条件判断

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>EL运算符</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
        }
        .result-box {
            background: #f8f9fa;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #4CAF50;
        }
    </style>
</head>
<body>
    <%
        request.setAttribute("num1", 10);
        request.setAttribute("num2", 20);
        request.setAttribute("str1", "Hello");
        request.setAttribute("str2", "World");
        request.setAttribute("flag", true);
        request.setAttribute("emptyList", new java.util.ArrayList<>());
        request.setAttribute("nullValue", null);
    %>
    
    <h1>EL运算符演示</h1>
    
    <h2>算术运算符</h2>
    <div class="result-box">
        <p>10 + 20 = ${num1 + num2}</p>
        <p>20 - 10 = ${num2 - num1}</p>
        <p>10 * 20 = ${num1 * num2}</p>
        <p>20 / 10 = ${num2 / num1}</p>
        <p>20 % 10 = ${num2 % num1}</p>
    </div>
    
    <h2>关系运算符</h2>
    <div class="result-box">
        <p>10 == 20：${num1 eq num2}</p>
        <p>10 != 20：${num1 ne num2}</p>
        <p>10 < 20：${num1 lt num2}</p>
        <p>10 > 20：${num1 gt num2}</p>
        <p>10 <= 20：${num1 le num2}</p>
        <p>10 >= 20：${num1 ge num2}</p>
    </div>
    
    <h2>逻辑运算符</h2>
    <div class="result-box">
        <p>true && false：${flag and false}</p>
        <p>true || false：${flag or false}</p>
        <p>!true：${not flag}</p>
    </div>
    
    <h2>三元运算符</h2>
    <div class="result-box">
        <p>状态：${flag ? "启用" : "禁用"}</p>
        <p>等级：${num1 > 15 ? "高级" : "初级"}</p>
    </div>
    
    <h2>empty运算符</h2>
    <div class="result-box">
        <p>空列表是否为空：${empty emptyList}</p>
        <p>null值是否为空：${empty nullValue}</p>
        <p>空字符串是否为空：${empty ""}</p>
    </div>
</body>
</html>
```

## 4.7 EL与JSTL配合使用

虽然EL可以访问数据，但无法进行循环和条件判断。这时需要配合JSTL标签库（下一章详细讲解）：

```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!-- 循环遍历 -->
<c:forEach var="product" items="${products}">
    <p>${product.name} - ¥${product.price}</p>
</c:forEach>

<!-- 条件判断 -->
<c:if test="${user.age >= 18}">
    <p>成年人</p>
</c:if>
```

## 4.8 练习题

1. **选择题**：以下哪个EL表达式可以获取请求参数`username`的值？
   - A) `${username}`
   - B) `${param.username}`
   - C) `${request.username}`
   - D) `${parameter.username}`

2. **填空题**：EL表达式`${user.address.city}`会依次调用______、______、______方法。

3. **简答题**：解释为什么EL表达式访问null对象不会抛出NullPointerException，而Java代码会。

4. **编程题**：编写一个JSP页面，接收两个数字参数，使用EL表达式计算并显示它们的和、差、积、商。

5. **思考题**：EL表达式只能读取数据，不能修改数据。这种设计有什么好处？

## 4.9 常见误区

### 误区1：混淆作用域
- **错误理解**：`${username}`会自动从所有作用域查找
- **正确理解**：EL按page→request→session→application顺序查找，建议明确指定作用域：`${requestScope.username}`

### 误区2：认为EL可以执行任意Java代码
- **错误理解**：可以在EL中调用任意方法
- **正确理解**：EL只能调用getter方法和部分标准函数，不能执行复杂逻辑

### 误区3：忽略EL版本差异
- **错误做法**：在旧版本容器中使用EL 3.0特性
- **正确做法**：确认Tomcat版本支持对应的EL规范（Tomcat 8+支持EL 3.0）

### 误区4：过度依赖EL做逻辑判断
- **错误做法**：
  ```jsp
  ${user.age > 18 ? (user.vip ? "VIP成人" : "普通成人") : "未成年"}
  ```
- **正确做法**：复杂逻辑应在Servlet中处理，JSP只负责展示

### 误区5：忘记启用EL
- **错误做法**：在web.xml中配置`<el-ignored>true</el-ignored>`
- **正确做法**：确保EL未被禁用，或使用`<%@ page isELIgnored="false" %>`

## 4.10 本章小结

EL表达式让JSP页面更简洁、更易维护。记住：
- 使用`${}`语法访问数据，替代Java脚本
- 11个隐式对象提供便捷的数据访问
- EL自动处理null值，不会抛出异常
- 配合JSTL实现完整的页面逻辑

下一章我们将学习JSTL标签库，它与EL完美配合，让你彻底告别JSP中的Java代码。
