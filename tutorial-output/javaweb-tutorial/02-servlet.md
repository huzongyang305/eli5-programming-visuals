# 第2章：Servlet技术

## 2.1 简介

如果说HTTP协议是Web世界的"交通规则"，那么Servlet就是运行在服务器端的"交通警察"。它负责接收浏览器的请求、处理业务逻辑、并返回响应结果。Servlet是JavaWeb开发的核心技术，所有高级框架（如Spring MVC）都建立在Servlet基础之上。

## 2.2 核心概念定义

**Servlet** 是一个运行在Web服务器上的Java程序，用于处理客户端请求并生成动态响应。它遵循特定的生命周期，由Servlet容器（如Tomcat）管理。

关键特点：
- **单例模式**：每个Servlet类只有一个实例，多线程处理请求
- **生命周期管理**：由容器负责创建、初始化和销毁
- **线程安全**：需要开发者自行保证并发访问的安全性
- **标准化接口**：实现`javax.servlet.Servlet`接口或继承`HttpServlet`类

## 2.3 生活类比

想象一家大型酒店的前台系统：

1. **酒店前台（Servlet容器/Tomcat）** 负责接待所有客人
2. **前台工作人员（Servlet实例）** 只有几位，但能同时服务多位客人
3. **客人办理入住（HTTP请求）** 时，工作人员查询数据库、分配房间
4. **发放房卡（HTTP响应）** 给客人
5. **下班时间（Servlet销毁）** 工作人员整理资料后离开

关键点：工作人员数量有限（节省资源），但能高效处理大量客人（多线程）。如果某个员工状态不好（线程安全问题），可能影响所有客人。

## 2.4 Servlet生命周期

Servlet的生命周期分为三个阶段：

### 1. 初始化阶段（init）
- 容器创建Servlet实例
- 调用`init()`方法进行初始化
- 只执行一次

### 2. 服务阶段（service）
- 每次请求都会调用`service()`方法
- 根据请求类型分发到`doGet()`、`doPost()`等方法
- 多线程并发执行

### 3. 销毁阶段（destroy）
- 容器关闭或卸载Servlet时调用
- 释放资源（关闭数据库连接等）
- 只执行一次

```java
public class LifeCycleServlet extends HttpServlet {
    
    @Override
    public void init() throws ServletException {
        System.out.println("Servlet初始化 - 只执行一次");
        // 加载配置文件、建立数据库连接等
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        System.out.println("处理GET请求 - 每次请求都执行");
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().println("<h1>欢迎使用Servlet</h1>");
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        System.out.println("处理POST请求 - 每次请求都执行");
        doGet(request, response);
    }
    
    @Override
    public void destroy() {
        System.out.println("Servlet销毁 - 只执行一次");
        // 关闭数据库连接、释放资源等
    }
}
```

## 2.5 代码示例

### 示例1：基础Servlet - 用户注册

```java
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;

public class RegisterServlet extends HttpServlet {
    
    private Connection conn;
    
    @Override
    public void init() throws ServletException {
        try {
            // 初始化数据库连接
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/mydb", 
                "root", 
                "password"
            );
        } catch (Exception e) {
            throw new ServletException("数据库初始化失败", e);
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. 设置编码
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        
        // 2. 获取表单数据
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String email = request.getParameter("email");
        
        // 3. 数据验证
        if (username == null || username.trim().isEmpty()) {
            response.getWriter().println("<script>alert('用户名不能为空');history.back();</script>");
            return;
        }
        
        if (password == null || password.length() < 6) {
            response.getWriter().println("<script>alert('密码至少6位');history.back();</script>");
            return;
        }
        
        // 4. 插入数据库
        try {
            String sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, username);
            pstmt.setString(2, password); // 实际项目中应该加密
            pstmt.setString(3, email);
            
            int rows = pstmt.executeUpdate();
            
            if (rows > 0) {
                response.getWriter().println("<h2>注册成功！</h2>");
                response.getWriter().println("<a href='login.html'>去登录</a>");
            } else {
                response.getWriter().println("<h2>注册失败</h2>");
            }
            
            pstmt.close();
            
        } catch (SQLException e) {
            e.printStackTrace();
            response.getWriter().println("<h2>系统错误，请稍后重试</h2>");
        }
    }
    
    @Override
    public void destroy() {
        try {
            if (conn != null && !conn.isClosed()) {
                conn.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

对应的HTML注册页面：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>用户注册</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .register-form {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h2 {
            color: #333;
            text-align: center;
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
        input[type="password"],
        input[type="email"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="register-form">
        <h2>用户注册</h2>
        <form action="/register" method="POST">
            <div class="form-group">
                <label for="username">用户名：</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">密码：</label>
                <input type="password" id="password" name="password" required minlength="6">
            </div>
            <div class="form-group">
                <label for="email">邮箱：</label>
                <input type="email" id="email" name="email" required>
            </div>
            <button type="submit">注册</button>
        </form>
    </div>
</body>
</html>
```

### 示例2：Servlet处理JSON数据

```java
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

public class ApiServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json;charset=UTF-8");
        
        // 模拟从数据库获取数据
        Map<String, Object> data = new HashMap<>();
        data.put("code", 200);
        data.put("message", "success");
        
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1);
        user.put("name", "张三");
        user.put("age", 25);
        data.put("data", user);
        
        // 转换为JSON
        Gson gson = new Gson();
        String json = gson.toJson(data);
        
        response.getWriter().print(json);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json;charset=UTF-8");
        
        // 读取请求体
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        
        // 解析JSON
        Gson gson = new Gson();
        Map<String, Object> requestData = gson.fromJson(sb.toString(), Map.class);
        
        String name = (String) requestData.get("name");
        Integer age = (Integer) requestData.get("age");
        
        // 处理业务逻辑
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "添加成功");
        result.put("data", requestData);
        
        response.getWriter().print(gson.toJson(result));
    }
}
```

### 示例3：使用注解配置Servlet（Servlet 3.0+）

```java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

@WebServlet(
    name = "ProductServlet",
    urlPatterns = {"/products", "/products/*"},
    loadOnStartup = 1,
    initParams = {
        @WebInitParam(name = "pageSize", value = "10"),
        @WebInitParam(name = "cacheTime", value = "300")
    }
)
public class ProductServlet extends HttpServlet {
    
    private int pageSize;
    private int cacheTime;
    
    @Override
    public void init() throws ServletException {
        // 读取初始化参数
        pageSize = Integer.parseInt(getInitParameter("pageSize"));
        cacheTime = Integer.parseInt(getInitParameter("cacheTime"));
        System.out.println("每页显示: " + pageSize + " 条");
        System.out.println("缓存时间: " + cacheTime + " 秒");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        // 获取路径信息
        String pathInfo = request.getPathInfo();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>商品列表</title></head>");
        out.println("<body>");
        out.println("<h1>商品管理系统</h1>");
        
        if (pathInfo == null || pathInfo.equals("/")) {
            // 显示商品列表
            out.println("<h2>商品列表（每页" + pageSize + "条）</h2>");
            out.println("<ul>");
            for (int i = 1; i <= 5; i++) {
                out.println("<li>商品" + i + " - <a href='/products/" + i + "'>查看详情</a></li>");
            }
            out.println("</ul>");
        } else {
            // 显示商品详情
            String productId = pathInfo.substring(1);
            out.println("<h2>商品" + productId + "详情</h2>");
            out.println("<p>价格: ¥" + (100 + Integer.parseInt(productId) * 10) + "</p>");
            out.println("<p>库存: " + (50 - Integer.parseInt(productId) * 5) + "</p>");
        }
        
        out.println("</body>");
        out.println("</html>");
    }
}
```

## 2.6 ServletConfig与ServletContext

### ServletConfig
每个Servlet的配置对象，只能访问自己的初始化参数。

```java
@WebServlet("/config-demo")
public class ConfigDemoServlet extends HttpServlet {
    
    @Override
    public void init() throws ServletException {
        ServletConfig config = getServletConfig();
        String encoding = config.getInitParameter("encoding");
        System.out.println("编码: " + encoding);
    }
}
```

### ServletContext
整个Web应用的上下文对象，所有Servlet共享。

```java
@WebServlet("/context-demo")
public class ContextDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        ServletContext context = getServletContext();
        
        // 获取应用根路径
        String realPath = context.getRealPath("/");
        
        // 设置全局属性
        context.setAttribute("visitCount", 100);
        
        // 获取全局属性
        Integer count = (Integer) context.getAttribute("visitCount");
        
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().println("<h1>访问次数: " + count + "</h1>");
        response.getWriter().println("<p>应用路径: " + realPath + "</p>");
    }
}
```

## 2.7 练习题

1. **选择题**：Servlet的生命周期中，哪个方法只执行一次？
   - A) service()
   - B) doGet()
   - C) init()
   - D) doPost()

2. **填空题**：Servlet默认是______模式的，多个请求共享同一个实例，因此需要注意______安全问题。

3. **简答题**：解释ServletConfig和ServletContext的区别，并说明各自的使用场景。

4. **编程题**：编写一个Servlet，统计网站被访问的次数，并将次数显示在页面上。要求使用ServletContext存储计数。

5. **思考题**：为什么Servlet采用单例多线程模式而不是为每个请求创建新实例？这种设计有什么优缺点？

## 2.8 常见误区

### 误区1：在Servlet中使用成员变量存储请求数据
- **错误做法**：
  ```java
  public class BadServlet extends HttpServlet {
      private String username; // 危险！多线程共享
      
      protected void doPost(...) {
          username = request.getParameter("username"); // 线程不安全
      }
  }
  ```
- **正确做法**：使用局部变量
  ```java
  protected void doPost(...) {
      String username = request.getParameter("username"); // 安全
  }
  ```

### 误区2：忽略线程安全
- **错误理解**：Servlet容器会自动处理线程安全
- **正确理解**：Servlet是多线程的，开发者必须保证代码线程安全。避免使用可变的成员变量，或使用同步机制

### 误区3：在init()中做耗时操作
- **错误做法**：在init()中执行复杂的数据库查询
- **正确做法**：init()只做必要的初始化，耗时操作应该在请求处理方法中异步执行

### 误区4：忘记关闭资源
- **错误做法**：打开数据库连接后不关闭
- **正确做法**：在finally块或try-with-resources中关闭资源
  ```java
  try (Connection conn = dataSource.getConnection();
       PreparedStatement pstmt = conn.prepareStatement(sql)) {
      // 使用资源
  } // 自动关闭
  ```

### 误区5：混淆forward和redirect
- **forward（转发）**：服务器内部跳转，URL不变，一次请求
  ```java
  request.getRequestDispatcher("/success.jsp").forward(request, response);
  ```
- **redirect（重定向）**：客户端重新请求，URL改变，两次请求
  ```java
  response.sendRedirect("/success.jsp");
  ```

## 2.9 本章小结

Servlet是JavaWeb的核心组件，掌握其生命周期、配置方式和线程安全原则至关重要。记住：
- Servlet由容器管理，经历init→service→destroy三个阶段
- 使用@WebServlet注解或web.xml进行配置
- 避免使用可变的成员变量，保证线程安全
- forward是服务器内部跳转，redirect是客户端重新请求

下一章我们将学习JSP技术，它让HTML和Java代码更好地结合，简化页面开发。
