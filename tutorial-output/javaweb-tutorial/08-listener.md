# 第8章：监听器（Listener）

## 8.1 简介

在Web应用运行过程中，会发生各种事件：应用启动、Session创建、属性变更等。如果我们想在某些事件发生时自动执行特定操作，该怎么办？监听器（Listener）就是为了解决这个问题而生的。它像一个"观察者"，默默监视着Web应用的各种变化，当事件发生时自动触发相应的处理逻辑。

## 8.2 核心概念定义

**监听器（Listener）** 是JavaWeb中的一种特殊组件，用于监听Web应用中特定对象的状态变化或生命周期事件。当被监听的事件发生时，容器会自动调用监听器中相应的方法。

主要监听器类型：
- **ServletContextListener**：监听应用的启动和停止
- **HttpSessionListener**：监听Session的创建和销毁
- **ServletRequestListener**：监听请求的创建和销毁
- **ServletContextAttributeListener**：监听应用属性的变化
- **HttpSessionAttributeListener**：监听Session属性的变化
- **ServletRequestAttributeListener**：监听请求属性的变化

## 8.3 生活类比

想象你在小区里安装了智能监控系统：

**没有监听器**：
你需要每隔几分钟就去查看：大门是否有人进出、电梯是否有人使用、停车场是否有空位。效率低下且容易遗漏。

**使用监听器**：
安装智能传感器（监听器）：
1. **大门传感器（ServletContextListener）**：小区开门时自动开灯，关门时自动关灯
2. **电梯传感器（HttpSessionListener）**：有人进入电梯时记录人数，离开时更新统计
3. **包裹柜传感器（AttributeListener）**：有人存取包裹时发送通知

你不需要主动查看，系统会在事件发生时自动通知并执行相应操作。

## 8.4 ServletContextListener - 应用级监听

### 典型应用场景
- 应用启动时初始化资源（数据库连接池、缓存等）
- 应用停止时清理资源
- 加载配置文件

```java
import javax.servlet.*;
import javax.servlet.annotation.*;

@WebListener
public class AppInitListener implements ServletContextListener {
    
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext context = sce.getServletContext();
        
        System.out.println("========== 应用启动 ==========");
        System.out.println("应用名称: " + context.getServletContextName());
        System.out.println("应用路径: " + context.getRealPath("/"));
        
        // 1. 初始化数据库连接池
        try {
            // 模拟初始化数据库
            System.out.println("正在初始化数据库连接池...");
            Thread.sleep(1000);
            context.setAttribute("dbPool", "DatabasePool_Initialized");
            System.out.println("数据库连接池初始化完成");
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // 2. 加载配置信息
        context.setAttribute("appName", "我的Web应用");
        context.setAttribute("version", "1.0.0");
        context.setAttribute("startTime", new java.util.Date());
        
        // 3. 初始化在线用户计数器
        context.setAttribute("onlineUserCount", 0);
        
        System.out.println("应用初始化完成");
        System.out.println("==============================\n");
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("========== 应用停止 ==========");
        
        ServletContext context = sce.getServletContext();
        
        // 1. 关闭数据库连接池
        Object dbPool = context.getAttribute("dbPool");
        if (dbPool != null) {
            System.out.println("正在关闭数据库连接池...");
            context.removeAttribute("dbPool");
            System.out.println("数据库连接池已关闭");
        }
        
        // 2. 清理其他资源
        System.out.println("清理临时文件...");
        System.out.println("保存统计数据...");
        
        System.out.println("应用已安全停止");
        System.out.println("==============================\n");
    }
}
```

### 显示应用信息页面

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>应用信息</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        .info-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .info-item {
            background: rgba(255,255,255,0.2);
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="info-card">
        <h2>📊 应用信息</h2>
        <div class="info-item">
            <strong>应用名称：</strong>
            <%= application.getAttribute("appName") %>
        </div>
        <div class="info-item">
            <strong>版本号：</strong>
            <%= application.getAttribute("version") %>
        </div>
        <div class="info-item">
            <strong>启动时间：</strong>
            <%= application.getAttribute("startTime") %>
        </div>
        <div class="info-item">
            <strong>在线用户：</strong>
            <%= application.getAttribute("onlineUserCount") %>
        </div>
    </div>
</body>
</html>
```

## 8.5 HttpSessionListener - Session级监听

### 典型应用场景
- 统计在线用户数
- 记录用户登录/退出时间
- Session超时提醒

```java
import javax.servlet.annotation.*;
import javax.servlet.http.*;

@WebListener
public class SessionMonitorListener implements HttpSessionListener {
    
    @Override
    public void sessionCreated(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        ServletContext context = session.getServletContext();
        
        System.out.println("新Session创建: " + session.getId());
        System.out.println("创建时间: " + new java.util.Date(session.getCreationTime()));
        
        // 增加在线用户计数
        synchronized (context) {
            Integer count = (Integer) context.getAttribute("onlineUserCount");
            if (count == null) {
                count = 0;
            }
            count++;
            context.setAttribute("onlineUserCount", count);
            System.out.println("当前在线用户数: " + count);
        }
    }
    
    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        ServletContext context = session.getServletContext();
        
        System.out.println("Session销毁: " + session.getId());
        System.out.println("最后访问时间: " + new java.util.Date(session.getLastAccessedTime()));
        
        // 减少在线用户计数
        synchronized (context) {
            Integer count = (Integer) context.getAttribute("onlineUserCount");
            if (count != null && count > 0) {
                count--;
                context.setAttribute("onlineUserCount", count);
                System.out.println("当前在线用户数: " + count);
            }
        }
    }
}
```

### 在线用户列表页面

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>在线用户监控</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 30px auto;
            padding: 20px;
        }
        .stats {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 20px;
        }
        .stats h2 {
            margin: 0;
            font-size: 48px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        th {
            background: #4CAF50;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #eee;
        }
    </style>
</head>
<body>
    <h1>👥 在线用户监控</h1>
    
    <div class="stats">
        <p>当前在线用户数</p>
        <h2><%= application.getAttribute("onlineUserCount") %></h2>
    </div>
    
    <%
        // 从Session中获取用户列表（需要在登录时保存）
        java.util.Map<String, java.util.Date> onlineUsers = 
            (java.util.Map<String, java.util.Date>) application.getAttribute("onlineUsers");
    %>
    
    <c:choose>
        <c:when test="${not empty onlineUsers}">
            <table>
                <thead>
                    <tr>
                        <th>用户名</th>
                        <th>登录时间</th>
                        <th>Session ID</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="entry" items="${onlineUsers}">
                        <tr>
                            <td>${entry.key}</td>
                            <td>${entry.value}</td>
                            <td>${entry.key.hashCode()}</td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
        </c:when>
        <c:otherwise>
            <p style="text-align: center; color: #999;">暂无在线用户</p>
        </c:otherwise>
    </c:choose>
</body>
</html>
```

增强的Session监听器（记录用户信息）：

```java
import javax.servlet.annotation.*;
import javax.servlet.http.*;
import java.util.concurrent.ConcurrentHashMap;

@WebListener
public class EnhancedSessionListener implements HttpSessionListener {
    
    @Override
    public void sessionCreated(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        ServletContext context = session.getServletContext();
        
        // 增加计数
        synchronized (context) {
            Integer count = (Integer) context.getAttribute("onlineUserCount");
            if (count == null) count = 0;
            count++;
            context.setAttribute("onlineUserCount", count);
        }
        
        // 初始化用户列表
        @SuppressWarnings("unchecked")
        ConcurrentHashMap<String, java.util.Date> onlineUsers = 
            (ConcurrentHashMap<String, java.util.Date>) context.getAttribute("onlineUsers");
        if (onlineUsers == null) {
            onlineUsers = new ConcurrentHashMap<>();
            context.setAttribute("onlineUsers", onlineUsers);
        }
    }
    
    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        ServletContext context = session.getServletContext();
        
        // 减少计数
        synchronized (context) {
            Integer count = (Integer) context.getAttribute("onlineUserCount");
            if (count != null && count > 0) {
                count--;
                context.setAttribute("onlineUserCount", count);
            }
        }
        
        // 从用户列表中移除
        String username = (String) session.getAttribute("currentUser");
        if (username != null) {
            @SuppressWarnings("unchecked")
            ConcurrentHashMap<String, java.util.Date> onlineUsers = 
                (ConcurrentHashMap<String, java.util.Date>) context.getAttribute("onlineUsers");
            if (onlineUsers != null) {
                onlineUsers.remove(username);
            }
        }
    }
}
```

## 8.6 ServletRequestListener - 请求级监听

### 典型应用场景
- 记录每个请求的处理时间
- 统计API调用次数
- 请求参数验证

```java
import javax.servlet.*;
import javax.servlet.annotation.*;

@WebListener
public class RequestMonitorListener implements ServletRequestListener {
    
    @Override
    public void requestInitialized(ServletRequestEvent sre) {
        ServletRequest request = sre.getServletRequest();
        
        // 记录请求开始时间
        request.setAttribute("requestStartTime", System.currentTimeMillis());
        
        if (request instanceof javax.servlet.http.HttpServletRequest) {
            javax.servlet.http.HttpServletRequest httpRequest = 
                (javax.servlet.http.HttpServletRequest) request;
            
            System.out.println("请求开始: " + httpRequest.getMethod() + " " + 
                             httpRequest.getRequestURI());
        }
    }
    
    @Override
    public void requestDestroyed(ServletRequestEvent sre) {
        ServletRequest request = sre.getServletRequest();
        
        // 计算请求处理时间
        Long startTime = (Long) request.getAttribute("requestStartTime");
        if (startTime != null) {
            long duration = System.currentTimeMillis() - startTime;
            
            if (request instanceof javax.servlet.http.HttpServletRequest) {
                javax.servlet.http.HttpServletRequest httpRequest = 
                    (javax.servlet.http.HttpServletRequest) request;
                
                System.out.println("请求结束: " + httpRequest.getRequestURI() + 
                                 " (耗时: " + duration + "ms)");
            }
        }
    }
}
```

## 8.7 AttributeListener - 属性变化监听

### HttpSessionAttributeListener示例

```java
import javax.servlet.annotation.*;
import javax.servlet.http.*;

@WebListener
public class SessionAttributeMonitor implements HttpSessionAttributeListener {
    
    @Override
    public void attributeAdded(HttpSessionBindingEvent event) {
        HttpSession session = event.getSession();
        String name = event.getName();
        Object value = event.getValue();
        
        System.out.println("Session属性添加: " + name + " = " + value);
        
        // 特殊处理：当添加currentUser时，记录到在线用户列表
        if ("currentUser".equals(name)) {
            ServletContext context = session.getServletContext();
            @SuppressWarnings("unchecked")
            java.util.Map<String, java.util.Date> onlineUsers = 
                (java.util.Map<String, java.util.Date>) context.getAttribute("onlineUsers");
            
            if (onlineUsers != null) {
                onlineUsers.put((String) value, new java.util.Date());
                System.out.println("用户上线: " + value);
            }
        }
    }
    
    @Override
    public void attributeRemoved(HttpSessionBindingEvent event) {
        HttpSession session = event.getSession();
        String name = event.getName();
        Object value = event.getValue();
        
        System.out.println("Session属性移除: " + name + " = " + value);
        
        // 特殊处理：当移除currentUser时，从在线用户列表删除
        if ("currentUser".equals(name)) {
            ServletContext context = session.getServletContext();
            @SuppressWarnings("unchecked")
            java.util.Map<String, java.util.Date> onlineUsers = 
                (java.util.Map<String, java.util.Date>) context.getAttribute("onlineUsers");
            
            if (onlineUsers != null) {
                onlineUsers.remove(value);
                System.out.println("用户下线: " + value);
            }
        }
    }
    
    @Override
    public void attributeReplaced(HttpSessionBindingEvent event) {
        HttpSession session = event.getSession();
        String name = event.getName();
        Object oldValue = event.getValue();
        Object newValue = session.getAttribute(name);
        
        System.out.println("Session属性替换: " + name + 
                         " (" + oldValue + " → " + newValue + ")");
    }
}
```

## 8.8 综合示例：完整的用户活动追踪系统

这个示例结合了多种监听器，实现一个完整的用户活动追踪系统。

### 1. 应用启动监听器

```java
import javax.servlet.*;
import javax.servlet.annotation.*;
import java.util.concurrent.ConcurrentHashMap;

@WebListener
public class AppStartupListener implements ServletContextListener {
    
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext context = sce.getServletContext();
        
        System.out.println("=====================================");
        System.out.println("   应用启动 - 初始化追踪系统");
        System.out.println("=====================================");
        
        // 初始化各种统计数据
        context.setAttribute("totalVisitCount", 0);
        context.setAttribute("onlineUserCount", 0);
        context.setAttribute("onlineUsers", new ConcurrentHashMap<String, java.util.Date>());
        context.setAttribute("startTime", new java.util.Date());
        
        System.out.println("追踪系统初始化完成");
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("=====================================");
        System.out.println("   应用停止 - 保存统计数据");
        System.out.println("=====================================");
        
        ServletContext context = sce.getServletContext();
        
        // 实际项目中应该保存到数据库或文件
        Integer totalVisits = (Integer) context.getAttribute("totalVisitCount");
        System.out.println("总访问次数: " + totalVisits);
        System.out.println("最终在线用户: " + context.getAttribute("onlineUserCount"));
    }
}
```

### 2. 请求追踪监听器

```java
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;

@WebListener
public class VisitTrackerListener implements ServletRequestListener {
    
    @Override
    public void requestInitialized(ServletRequestEvent sre) {
        ServletRequest request = sre.getServletRequest();
        request.setAttribute("requestStartTime", System.currentTimeMillis());
    }
    
    @Override
    public void requestDestroyed(ServletRequestEvent sre) {
        ServletRequest request = sre.getServletRequest();
        
        if (request instanceof HttpServletRequest) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            ServletContext context = httpRequest.getServletContext();
            
            // 增加总访问计数
            synchronized (context) {
                Integer count = (Integer) context.getAttribute("totalVisitCount");
                if (count == null) count = 0;
                count++;
                context.setAttribute("totalVisitCount", count);
            }
            
            // 记录访问日志
            Long startTime = (Long) request.getAttribute("requestStartTime");
            if (startTime != null) {
                long duration = System.currentTimeMillis() - startTime;
                System.out.println(String.format("[%s] %s %s (%dms)", 
                    new java.text.SimpleDateFormat("HH:mm:ss").format(new java.util.Date()),
                    httpRequest.getMethod(),
                    httpRequest.getRequestURI(),
                    duration));
            }
        }
    }
}
```

### 3. 统计面板页面

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>系统统计面板</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1000px;
            margin: 30px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-value {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }
        .stat-label {
            color: #666;
            font-size: 14px;
        }
        .user-list {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th {
            background: #667eea;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #eee;
        }
        tr:hover {
            background: #f8f9fa;
        }
    </style>
</head>
<body>
    <h1>📊 系统统计面板</h1>
    
    <div class="dashboard">
        <div class="stat-card">
            <div class="stat-label">总访问次数</div>
            <div class="stat-value"><%= application.getAttribute("totalVisitCount") %></div>
        </div>
        
        <div class="stat-card">
            <div class="stat-label">当前在线用户</div>
            <div class="stat-value"><%= application.getAttribute("onlineUserCount") %></div>
        </div>
        
        <div class="stat-card">
            <div class="stat-label">应用启动时间</div>
            <div class="stat-value" style="font-size: 18px;">
                <%= application.getAttribute("startTime") %>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-label">运行时长</div>
            <div class="stat-value" style="font-size: 18px;">
                <%
                    java.util.Date startTime = (java.util.Date) application.getAttribute("startTime");
                    if (startTime != null) {
                        long runningTime = System.currentTimeMillis() - startTime.getTime();
                        long hours = runningTime / (1000 * 60 * 60);
                        long minutes = (runningTime % (1000 * 60 * 60)) / (1000 * 60);
                        long seconds = (runningTime % (1000 * 60)) / 1000;
                        out.print(hours + "小时 " + minutes + "分钟 " + seconds + "秒");
                    }
                %>
            </div>
        </div>
    </div>
    
    <div class="user-list">
        <h2>在线用户列表</h2>
        <%
            @SuppressWarnings("unchecked")
            java.util.Map<String, java.util.Date> onlineUsers = 
                (java.util.Map<String, java.util.Date>) application.getAttribute("onlineUsers");
        %>
        
        <c:choose>
            <c:when test="${not empty onlineUsers}">
                <table>
                    <thead>
                        <tr>
                            <th>用户名</th>
                            <th>登录时间</th>
                            <th>在线时长</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="entry" items="${onlineUsers}">
                            <tr>
                                <td>${entry.key}</td>
                                <td>${entry.value}</td>
                                <td>
                                    <%
                                        java.util.Date loginTime = (java.util.Date) pageContext.findAttribute("entry.value");
                                        if (loginTime != null) {
                                            long minutes = (System.currentTimeMillis() - loginTime.getTime()) / (1000 * 60);
                                            out.print(minutes + " 分钟");
                                        }
                                    %>
                                </td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </c:when>
            <c:otherwise>
                <p style="text-align: center; color: #999; padding: 40px;">
                    当前没有在线用户
                </p>
            </c:otherwise>
        </c:choose>
    </div>
</body>
</html>
```

## 8.9 Listener配置方式

### 1. 注解方式（推荐）

```java
@WebListener
public class MyListener implements ServletContextListener {
    // ...
}
```

### 2. web.xml方式

```xml
<listener>
    <listener-class>com.example.listener.MyListener</listener-class>
</listener>
```

## 8.10 练习题

1. **选择题**：以下哪个监听器可以监听应用的启动和停止？
   - A) HttpSessionListener
   - B) ServletContextListener
   - C) ServletRequestListener
   - D) ServletContextAttributeListener

2. **填空题**：要在Session创建时执行特定操作，需要实现______接口，并重写______方法。

3. **简答题**：解释Listener和Filter的区别，并说明什么场景下应该使用Listener而不是Filter。

4. **编程题**：编写一个监听器，统计网站的高峰时段（按小时统计访问次数），并将结果存储在ServletContext中。

5. **思考题**：为什么在修改ServletContext的属性时需要使用synchronized关键字？如果不加会有什么后果？

## 8.11 常见误区

### 误区1：在监听器中执行耗时操作
- **错误做法**：在`contextInitialized`中执行复杂的数据库查询
- **正确做法**：只做必要的初始化，耗时操作异步执行或使用线程池

### 误区2：忽略线程安全
- **错误做法**：
  ```java
  Integer count = (Integer) context.getAttribute("count");
  count++; // 不是原子操作
  context.setAttribute("count", count);
  ```
- **正确做法**：
  ```java
  synchronized (context) {
      Integer count = (Integer) context.getAttribute("count");
      if (count == null) count = 0;
      count++;
      context.setAttribute("count", count);
  }
  ```

### 误区3：忘记移除监听器注册的回调
- **错误理解**：监听器会自动清理
- **正确理解**：确保在`contextDestroyed`或`sessionDestroyed`中清理资源

### 误区4：过度使用监听器
- **错误做法**：每个小功能都创建监听器
- **正确做法**：只在真正需要监听事件时使用，简单逻辑直接在Servlet中处理

### 误区5：混淆Listener和Filter的执行时机
- **错误理解**：两者都在请求处理前执行
- **正确理解**：
  - Filter：拦截请求和响应，可修改数据
  - Listener：被动监听事件，不能拦截或修改请求

## 8.12 本章小结

监听器是Web应用的"观察者"，自动响应各种事件。记住：
- ServletContextListener监听应用生命周期
- HttpSessionListener监听Session创建和销毁
- ServletRequestListener监听请求生命周期
- AttributeListener监听属性变化
- 注意线程安全，使用synchronized保护共享数据

下一章我们将学习JDBC数据库访问，它是Java应用与数据库交互的桥梁。
