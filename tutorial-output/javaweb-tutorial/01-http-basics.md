# 第1章：HTTP协议基础

## 1.1 简介

当你打开浏览器访问网站时，背后发生了什么？本章将带你了解Web世界的基础通信协议——HTTP（超文本传输协议）。它是浏览器和服务器之间的"对话规则"，是所有Web应用运行的基石。

## 1.2 核心概念定义

**HTTP（HyperText Transfer Protocol）** 是一种用于传输超文本（如HTML）的应用层协议。它采用**请求-响应**模式：客户端发送请求，服务器返回响应。

关键特性：
- **无状态**：每次请求都是独立的，服务器不记住之前的请求
- **基于TCP/IP**：底层使用可靠的传输层协议
- **明文传输**：数据以文本形式传输（HTTPS则加密）
- **支持多种方法**：GET、POST、PUT、DELETE等

## 1.3 生活类比

想象你去餐厅点餐：

1. **你（客户端）** 看菜单后告诉服务员："我要一份宫保鸡丁"（**HTTP请求**）
2. **服务员** 把你的订单传给厨房（**网络传输**）
3. **厨房（服务器）** 做好菜后交给服务员（**HTTP响应**）
4. **服务员** 把菜端给你（**浏览器渲染页面**）

每次点新菜都是一次独立的交互，服务员不会记得你上次点了什么（**无状态**）。如果你想让服务员记住你的偏好，需要办会员卡（**Cookie/Session**，后续章节讲解）。

## 1.4 HTTP请求结构

一个完整的HTTP请求包含三部分：

```
请求行：GET /index.html HTTP/1.1
请求头：Host: www.example.com
       User-Agent: Mozilla/5.0
       Accept: text/html
空行：
请求体：（POST请求才有内容）
```

### 常见HTTP方法

| 方法 | 用途 | 生活类比 |
|------|------|----------|
| GET | 获取资源 | 查看菜单 |
| POST | 提交数据 | 下单点餐 |
| PUT | 更新资源 | 修改订单 |
| DELETE | 删除资源 | 取消订单 |

## 1.5 HTTP响应结构

```
状态行：HTTP/1.1 200 OK
响应头：Content-Type: text/html; charset=UTF-8
       Content-Length: 1234
空行：
响应体：<html>...</html>
```

### 常见状态码

| 状态码 | 含义 | 示例 |
|--------|------|------|
| 200 | 成功 | 页面正常加载 |
| 301 | 永久重定向 | 旧网址跳转到新网址 |
| 404 | 未找到 | 访问不存在的页面 |
| 500 | 服务器错误 | 程序崩溃 |

## 1.6 代码示例

### 示例1：使用Java原生API发送HTTP请求

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpClientExample {
    public static void main(String[] args) {
        try {
            // 1. 创建URL对象
            URL url = new URL("http://www.example.com");
            
            // 2. 打开连接
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // 3. 设置请求方法
            connection.setRequestMethod("GET");
            
            // 4. 设置请求头
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            
            // 5. 获取响应码
            int responseCode = connection.getResponseCode();
            System.out.println("响应码: " + responseCode);
            
            // 6. 读取响应内容
            if (responseCode == 200) {
                BufferedReader reader = new BufferedReader(
                    new InputStreamReader(connection.getInputStream())
                );
                String line;
                StringBuilder response = new StringBuilder();
                while ((line = reader.readLine()) != null) {
                    response.append(line).append("\n");
                }
                reader.close();
                System.out.println("响应内容:\n" + response.toString());
            }
            
            // 7. 关闭连接
            connection.disconnect();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 示例2：简单的Servlet接收HTTP请求

```java
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

public class HelloServlet extends HttpServlet {
    
    // 处理GET请求
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 设置响应类型
        response.setContentType("text/html;charset=UTF-8");
        
        // 获取请求参数
        String name = request.getParameter("name");
        if (name == null) {
            name = "访客";
        }
        
        // 写入响应
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>Hello</title></head>");
        out.println("<body>");
        out.println("<h1>你好，" + name + "！</h1>");
        out.println("<p>这是你的第一个Web页面</p>");
        out.println("</body>");
        out.println("</html>");
    }
    
    // 处理POST请求
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // 设置编码
        request.setCharacterEncoding("UTF-8");
        
        // 获取表单数据
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        // 简单验证
        if ("admin".equals(username) && "123456".equals(password)) {
            response.sendRedirect("welcome.html");
        } else {
            response.sendRedirect("login.html?error=1");
        }
    }
}
```

对应的web.xml配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee 
         http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    
    <servlet>
        <servlet-name>HelloServlet</servlet-name>
        <servlet-class>HelloServlet</servlet-class>
    </servlet>
    
    <servlet-mapping>
        <servlet-name>HelloServlet</servlet-name>
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>
    
</web-app>
```

### 示例3：HTML表单发送POST请求

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>登录页面</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h2>用户登录</h2>
    <form action="/hello" method="POST">
        <div class="form-group">
            <label for="username">用户名：</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
            <label for="password">密码：</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">登录</button>
    </form>
</body>
</html>
```

## 1.7 练习题

1. **选择题**：以下哪个HTTP方法用于获取资源？
   - A) POST
   - B) GET
   - C) PUT
   - D) DELETE

2. **填空题**：HTTP协议是______状态的，这意味着服务器不会自动记住之前的请求。

3. **简答题**：解释HTTP状态码404和500的区别，并各举一个实际场景。

4. **编程题**：编写一个Servlet，接收GET请求中的`age`参数，如果年龄大于18岁返回"成年人"，否则返回"未成年人"。

5. **思考题**：为什么HTTP设计为无状态协议？这种设计有什么优缺点？

## 1.8 常见误区

### 误区1：混淆GET和POST
- **错误理解**：GET只能传少量数据，POST可以传大量数据
- **正确理解**：两者都能传输任意大小数据，区别在于语义：GET用于获取资源（幂等），POST用于提交数据（可能改变服务器状态）

### 误区2：认为HTTP是安全的
- **错误理解**：使用HTTP协议传输密码很安全
- **正确理解**：HTTP明文传输，任何中间节点都能截获数据。敏感信息必须使用HTTPS（HTTP + SSL/TLS加密）

### 误区3：忽略字符编码
- **错误理解**：不需要设置字符编码也能正常显示中文
- **正确理解**：必须在请求和响应中明确设置UTF-8编码，否则会出现乱码：
  ```java
  request.setCharacterEncoding("UTF-8");
  response.setContentType("text/html;charset=UTF-8");
  ```

### 误区4：不理解URL编码
- **错误理解**：URL中的特殊字符可以直接传递
- **正确理解**：空格、中文等特殊字符需要进行URL编码（如空格变为`%20`），浏览器会自动处理，但手动构造URL时需要注意

## 1.9 本章小结

HTTP协议是Web开发的基石，理解其请求-响应模型、常用方法和状态码是学习JavaWeb的前提。记住：
- HTTP是无状态的请求-响应协议
- GET用于获取，POST用于提交
- 状态码200表示成功，404表示未找到，500表示服务器错误
- 始终注意字符编码问题

下一章我们将学习Servlet技术，它是JavaWeb的核心组件，负责处理HTTP请求并生成响应。
