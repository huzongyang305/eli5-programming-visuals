# 第7章：过滤器（Filter）

## 7.1 简介

在Web应用中，很多请求都需要进行相同的预处理，比如检查用户是否登录、设置字符编码、记录访问日志等。如果每个Servlet都写一遍这些代码，会造成大量重复。过滤器（Filter）就是为了解决这个问题而生的，它像一个"安检门"，在请求到达Servlet之前或响应返回客户端之前进行统一处理。

## 7.2 核心概念定义

**过滤器（Filter）** 是JavaWeb中的一种组件，用于拦截客户端与目标资源（Servlet、JSP等）之间的请求和响应。它可以对请求进行预处理，对响应进行后处理，实现横切关注点的复用。

关键特点：
- **拦截链**：多个过滤器可以形成过滤链，按顺序执行
- **可配置**：通过注解或web.xml配置拦截的URL模式
- **生命周期**：由容器管理，经历init→doFilter→destroy
- **双向处理**：既可处理请求，也可处理响应

## 7.3 生活类比

想象你进入一栋办公大楼：

**没有过滤器**：
每个办公室都要单独检查你的身份、登记访客信息、测量体温，效率低下且重复劳动。

**使用过滤器**：
大楼入口设置统一的"安检门"（过滤器）：
1. **第一道安检**：检查身份证（登录验证过滤器）
2. **第二道安检**：消毒测温（编码设置过滤器）
3. **第三道安检**：登记访客信息（日志记录过滤器）

通过后，你可以自由访问各个办公室（Servlet）。离开时，安检门还会检查你是否携带了不该带出的物品（响应处理）。

## 7.4 Filter生命周期

### 1. 初始化（init）
容器创建Filter实例时调用，只执行一次。

### 2. 过滤（doFilter）
每次请求匹配时调用，可多次执行。

### 3. 销毁（destroy）
容器卸载Filter时调用，只执行一次。

```java
import javax.servlet.*;
import java.io.IOException;

public class ExampleFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("过滤器初始化");
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                         FilterChain chain) throws IOException, ServletException {
        System.out.println("请求前处理");
        
        // 继续执行下一个过滤器或目标资源
        chain.doFilter(request, response);
        
        System.out.println("响应后处理");
    }
    
    @Override
    public void destroy() {
        System.out.println("过滤器销毁");
    }
}
```

## 7.5 代码示例

### 示例1：字符编码过滤器（最常用）

```java
import javax.servlet.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebFilter(urlPatterns = "/*", filterName = "EncodingFilter")
public class EncodingFilter implements Filter {
    
    private String encoding = "UTF-8";
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 从web.xml读取配置的编码
        String enc = filterConfig.getInitParameter("encoding");
        if (enc != null && !enc.isEmpty()) {
            this.encoding = enc;
        }
        System.out.println("编码过滤器初始化，使用编码: " + encoding);
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                         FilterChain chain) throws IOException, ServletException {
        
        // 设置请求编码
        request.setCharacterEncoding(encoding);
        
        // 设置响应编码和内容类型
        response.setCharacterEncoding(encoding);
        response.setContentType("text/html;charset=" + encoding);
        
        System.out.println("已设置编码为: " + encoding);
        
        // 继续执行
        chain.doFilter(request, response);
    }
    
    @Override
    public void destroy() {
        System.out.println("编码过滤器销毁");
    }
}
```

如果使用web.xml配置：

```xml
<filter>
    <filter-name>EncodingFilter</filter-name>
    <filter-class>com.example.filter.EncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>EncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### 示例2：登录验证过滤器

```java
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;
import java.io.IOException;

@WebFilter(urlPatterns = {"/admin/*", "/user/*"}, filterName = "LoginFilter")
public class LoginFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("登录验证过滤器初始化");
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                         FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // 获取Session
        HttpSession session = httpRequest.getSession(false);
        
        // 检查是否登录
        Object user = (session != null) ? session.getAttribute("currentUser") : null;
        
        // 获取请求URI
        String uri = httpRequest.getRequestURI();
        String contextPath = httpRequest.getContextPath();
        String path = uri.substring(contextPath.length());
        
        // 放行登录页面和静态资源
        if (path.equals("/login.jsp") || 
            path.equals("/login") || 
            path.startsWith("/css/") || 
            path.startsWith("/js/") || 
            path.startsWith("/images/")) {
            chain.doFilter(request, response);
            return;
        }
        
        // 未登录则跳转到登录页
        if (user == null) {
            System.out.println("用户未登录，拦截请求: " + uri);
            httpResponse.sendRedirect(contextPath + "/login.jsp?error=2");
            return;
        }
        
        System.out.println("用户已登录，允许访问: " + uri);
        
        // 已登录，继续执行
        chain.doFilter(request, response);
    }
    
    @Override
    public void destroy() {
        System.out.println("登录验证过滤器销毁");
    }
}
```

### 示例3：访问日志过滤器

```java
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@WebFilter(urlPatterns = "/*", filterName = "LogFilter")
public class LogFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("日志过滤器初始化");
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                         FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        // 记录请求信息
        long startTime = System.currentTimeMillis();
        String method = httpRequest.getMethod();
        String uri = httpRequest.getRequestURI();
        String queryString = httpRequest.getQueryString();
        String ip = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        
        System.out.println("========== 请求开始 ==========");
        System.out.println("时间: " + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        System.out.println("IP: " + ip);
        System.out.println("方法: " + method);
        System.out.println("URI: " + uri);
        if (queryString != null) {
            System.out.println("参数: " + queryString);
        }
        System.out.println("浏览器: " + userAgent);
        
        // 继续执行
        chain.doFilter(request, response);
        
        // 记录响应信息
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        System.out.println("耗时: " + duration + " ms");
        System.out.println("========== 请求结束 ==========\n");
    }
    
    @Override
    public void destroy() {
        System.out.println("日志过滤器销毁");
    }
}
```

### 示例4：敏感词过滤过滤器

```java
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@WebFilter(urlPatterns = {"/*.jsp", "/comment"}, filterName = "SensitiveWordFilter")
public class SensitiveWordFilter implements Filter {
    
    private List<String> sensitiveWords;
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 初始化敏感词列表（实际应从配置文件或数据库读取）
        sensitiveWords = Arrays.asList(
            "广告", "推销", "垃圾信息", "违规内容"
        );
        System.out.println("敏感词过滤器初始化，共" + sensitiveWords.size() + "个敏感词");
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                         FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        // 只对POST请求进行过滤
        if ("POST".equalsIgnoreCase(httpRequest.getMethod())) {
            
            // 创建包装类，修改请求参数
            SensitiveWordRequestWrapper wrapper = 
                new SensitiveWordRequestWrapper(httpRequest, sensitiveWords);
            
            chain.doFilter(wrapper, response);
            
        } else {
            chain.doFilter(request, response);
        }
    }
    
    @Override
    public void destroy() {
        System.out.println("敏感词过滤器销毁");
    }
}

// 请求包装类
class SensitiveWordRequestWrapper extends HttpServletRequestWrapper {
    
    private List<String> sensitiveWords;
    
    public SensitiveWordRequestWrapper(HttpServletRequest request, List<String> sensitiveWords) {
        super(request);
        this.sensitiveWords = sensitiveWords;
    }
    
    @Override
    public String getParameter(String name) {
        String value = super.getParameter(name);
        if (value != null) {
            return filterSensitiveWords(value);
        }
        return value;
    }
    
    @Override
    public String[] getParameterValues(String name) {
        String[] values = super.getParameterValues(name);
        if (values != null) {
            for (int i = 0; i < values.length; i++) {
                values[i] = filterSensitiveWords(values[i]);
            }
        }
        return values;
    }
    
    private String filterSensitiveWords(String text) {
        String result = text;
        for (String word : sensitiveWords) {
            result = result.replace(word, "***");
        }
        return result;
    }
}
```

测试页面：

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>评论提交</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        textarea {
            width: 100%;
            height: 150px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
        }
        button {
            margin-top: 10px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h2>发表评论</h2>
    <form action="/comment" method="POST">
        <textarea name="content" placeholder="请输入评论内容..."></textarea>
        <br>
        <button type="submit">提交评论</button>
    </form>
    
    <%
        String content = request.getParameter("content");
        if (content != null) {
    %>
        <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 4px;">
            <strong>您提交的内容：</strong>
            <p><%= content %></p>
            <p style="color: #999; font-size: 12px;">注意：敏感词已被自动替换为 ***</p>
        </div>
    <%
        }
    %>
</body>
</html>
```

对应的CommentServlet：

```java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

@WebServlet("/comment")
public class CommentServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        
        String content = request.getParameter("content");
        
        // 直接转发回原页面显示
        request.setAttribute("content", content);
        request.getRequestDispatcher("/comment.jsp").forward(request, response);
    }
}
```

### 示例5：多个过滤器的执行顺序

```java
// 过滤器1：编码设置
@WebFilter(urlPatterns = "/*", filterName = "EncodingFilter")
public class EncodingFilter implements Filter {
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) 
            throws IOException, ServletException {
        System.out.println("[1] 编码过滤器 - 请求前");
        req.setCharacterEncoding("UTF-8");
        chain.doFilter(req, resp);
        System.out.println("[1] 编码过滤器 - 响应后");
    }
}

// 过滤器2：登录验证
@WebFilter(urlPatterns = "/admin/*", filterName = "LoginFilter")
public class LoginFilter implements Filter {
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) 
            throws IOException, ServletException {
        System.out.println("[2] 登录过滤器 - 请求前");
        // 验证逻辑...
        chain.doFilter(req, resp);
        System.out.println("[2] 登录过滤器 - 响应后");
    }
}

// 过滤器3：日志记录
@WebFilter(urlPatterns = "/*", filterName = "LogFilter")
public class LogFilter implements Filter {
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) 
            throws IOException, ServletException {
        System.out.println("[3] 日志过滤器 - 请求前");
        long start = System.currentTimeMillis();
        chain.doFilter(req, resp);
        long duration = System.currentTimeMillis() - start;
        System.out.println("[3] 日志过滤器 - 响应后 (耗时: " + duration + "ms)");
    }
}
```

执行顺序（假设访问/admin/index.jsp）：
```
[1] 编码过滤器 - 请求前
[3] 日志过滤器 - 请求前
[2] 登录过滤器 - 请求前
--- Servlet/JSP执行 ---
[2] 登录过滤器 - 响应后
[3] 日志过滤器 - 响应后 (耗时: 50ms)
[1] 编码过滤器 - 响应后
```

## 7.6 Filter配置方式

### 1. 注解方式（推荐）

```java
@WebFilter(
    urlPatterns = {"/*.jsp", "/api/*"},
    filterName = "MyFilter",
    initParams = {
        @WebInitParam(name = "param1", value = "value1"),
        @WebInitParam(name = "param2", value = "value2")
    }
)
public class MyFilter implements Filter {
    // ...
}
```

### 2. web.xml方式

```xml
<filter>
    <filter-name>MyFilter</filter-name>
    <filter-class>com.example.MyFilter</filter-class>
    <init-param>
        <param-name>param1</param-name>
        <param-value>value1</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>MyFilter</filter-name>
    <url-pattern>/*.jsp</url-pattern>
    <url-pattern>/api/*</url-pattern>
</filter-mapping>
```

## 7.7 练习题

1. **选择题**：以下关于Filter的说法，哪个是错误的？
   - A) Filter可以拦截请求和响应
   - B) 多个Filter形成过滤链，按配置顺序执行
   - C) Filter的doFilter方法只执行一次
   - D) Filter可以实现权限验证、编码设置等功能

2. **填空题**：在Filter的doFilter方法中，必须调用______方法才能让请求继续传递，否则请求会被拦截。

3. **简答题**：解释Filter和Servlet的区别，并说明什么场景下应该使用Filter而不是Servlet。

4. **编程题**：编写一个过滤器，统计每个API接口的调用次数，并将结果存储在ServletContext中。要求能够按URL分组统计。

5. **思考题**：如果有三个过滤器A、B、C都匹配同一个请求，它们的执行顺序是怎样的？如果在过滤器B中不调用chain.doFilter()会发生什么？

## 7.8 常见误区

### 误区1：忘记调用chain.doFilter()
- **错误做法**：
  ```java
  public void doFilter(...) {
      // 处理逻辑
      // 忘记调用 chain.doFilter(request, response);
  }
  ```
- **后果**：请求被拦截，目标资源无法执行，客户端收不到响应
- **正确做法**：确保在所有分支中都调用`chain.doFilter()`

### 误区2：在Filter中修改响应后继续执行
- **错误做法**：
  ```java
  response.getWriter().write("错误信息");
  chain.doFilter(request, response); // 会导致异常
  ```
- **正确做法**：
  ```java
  if (!isValid) {
      response.getWriter().write("错误信息");
      return; // 不再调用chain.doFilter()
  }
  chain.doFilter(request, response);
  ```

### 误区3：Filter配置范围过大
- **错误做法**：所有过滤器都配置为`/*`
- **正确做法**：根据功能精确配置拦截路径
  ```java
  @WebFilter(urlPatterns = "/admin/*") // 只拦截后台管理
  @WebFilter(urlPatterns = {"*.jsp", "*.html"}) // 只拦截动态页面
  ```

### 误区4：在Filter中创建大量对象
- **错误做法**：每次请求都创建数据库连接
- **正确做法**：在init()中初始化共享资源，在destroy()中释放

### 误区5：忽略过滤器执行顺序
- **错误理解**：过滤器执行顺序无关紧要
- **正确理解**：顺序很重要，特别是编码过滤器应该在最前面
  - web.xml中按`<filter-mapping>`的顺序执行
  - 注解方式按类名的字母顺序执行（不同容器可能不同）

## 7.9 本章小结

过滤器是Web应用的"安检门"，实现横切关注点的复用。记住：
- Filter在请求到达Servlet之前和响应返回之后执行
- 必须调用`chain.doFilter()`让请求继续传递
- 多个Filter形成链，按配置顺序执行
- 常用于编码设置、权限验证、日志记录等场景

下一章我们将学习监听器（Listener），它能监听Web应用的各种事件。
