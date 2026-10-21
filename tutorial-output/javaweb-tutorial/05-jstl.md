# 第5章：JSTL标签库

## 5.1 简介

虽然EL表达式让我们告别了JSP中的Java代码，但它无法处理循环、条件判断等逻辑。JSTL（JSP Standard Tag Library，JSP标准标签库）应运而生，它提供了一套标准标签，配合EL表达式，让JSP页面完全摆脱Java代码，实现真正的"视图层纯净"。

## 5.2 核心概念定义

**JSTL** 是一组标准化的JSP标签，用于实现常见的Web开发任务，如循环遍历、条件判断、格式化数据、数据库操作等。它分为五个标签库：

- **core**：核心标签（最常用）
- **fmt**：格式化标签
- **sql**：SQL标签（不推荐使用）
- **xml**：XML标签
- **functions**：函数标签

## 5.3 生活类比

想象你在组装宜家家具：

**没有JSTL（使用Java代码）**：
你需要自己找螺丝刀、扳手、锤子，每次都要从工具箱翻找，效率低且容易出错。

**使用JSTL**：
宜家提供了一个"智能工具包"，每个工具都有明确标识和说明：
- 🔄 循环工具：自动重复某个动作
- ✅ 判断工具：根据条件选择不同方案
- 📅 格式化工具：把日期变成你想要的格式

你只需按照说明书使用这些工具，无需关心底层实现。

## 5.4 JSTL配置

### 1. 添加依赖

如果使用Maven，在`pom.xml`中添加：

```xml
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
    <version>1.2</version>
</dependency>
```

### 2. 在JSP中引入标签库

```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
```

## 5.5 Core标签库详解

### 1. c:out - 输出内容

```jsp
<c:out value="${username}" />
<c:out value="<script>alert('xss')</script>" escapeXml="true" />
```

### 2. c:set - 设置变量

```jsp
<c:set var="name" value="张三" scope="request" />
<c:set target="${user}" property="name" value="李四" />
```

### 3. c:remove - 删除变量

```jsp
<c:remove var="tempData" scope="session" />
```

### 4. c:if - 条件判断

```jsp
<c:if test="${user.age >= 18}">
    <p>成年人</p>
</c:if>
```

### 5. c:choose/c:when/c:otherwise - 多条件判断

```jsp
<c:choose>
    <c:when test="${score >= 90}">优秀</c:when>
    <c:when test="${score >= 80}">良好</c:when>
    <c:when test="${score >= 60}">及格</c:when>
    <c:otherwise>不及格</c:otherwise>
</c:choose>
```

### 6. c:forEach - 循环遍历

```jsp
<c:forEach var="item" items="${list}" varStatus="status">
    <p>${status.index}: ${item}</p>
</c:forEach>
```

### 7. c:url - 生成URL

```jsp
<c:url var="loginUrl" value="/login">
    <c:param name="redirect" value="/home" />
</c:url>
<a href="${loginUrl}">登录</a>
```

### 8. c:redirect - 重定向

```jsp
<c:redirect url="/login.jsp" />
```

## 5.6 代码示例

### 示例1：商品列表展示（完整项目）

Servlet代码：

```java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.*;
import com.example.model.Product;

@WebServlet("/product-list")
public class ProductListServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 模拟从数据库获取商品数据
        List<Product> products = new ArrayList<>();
        products.add(new Product(1, "iPhone 15", 7999, 50, "手机"));
        products.add(new Product(2, "MacBook Pro", 12999, 30, "电脑"));
        products.add(new Product(3, "AirPods Pro", 1999, 100, "配件"));
        products.add(new Product(4, "iPad Air", 4799, 0, "平板"));
        products.add(new Product(5, "Apple Watch", 3199, 75, "穿戴"));
        
        // 存入request
        request.setAttribute("products", products);
        request.setAttribute("pageTitle", "商品列表");
        
        // 转发到JSP
        request.getRequestDispatcher("/product-list.jsp").forward(request, response);
    }
}
```

JSP页面：

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${pageTitle}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1000px;
            margin: 30px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .filter-bar {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .filter-bar select,
        .filter-bar input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }
        .product-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .product-image {
            height: 200px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 48px;
        }
        .product-info {
            padding: 20px;
        }
        .product-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .product-category {
            display: inline-block;
            background: #e3f2fd;
            color: #1976d2;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            margin-bottom: 10px;
        }
        .product-price {
            color: #e74c3c;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .product-stock {
            color: #666;
            font-size: 14px;
        }
        .stock-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
        }
        .in-stock {
            background: #e8f5e9;
            color: #2e7d32;
        }
        .out-of-stock {
            background: #ffebee;
            color: #c62828;
        }
        .stats {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>🛍️ ${pageTitle}</h1>
    
    <!-- 筛选栏 -->
    <div class="filter-bar">
        <label>分类：</label>
        <select>
            <option value="">全部分类</option>
            <option value="手机">手机</option>
            <option value="电脑">电脑</option>
            <option value="配件">配件</option>
        </select>
        
        <label>价格范围：</label>
        <input type="number" placeholder="最低价" style="width: 100px;">
        <span>-</span>
        <input type="number" placeholder="最高价" style="width: 100px;">
        
        <button>筛选</button>
    </div>
    
    <!-- 商品列表 -->
    <div class="product-grid">
        <c:forEach var="product" items="${products}" varStatus="status">
            <div class="product-card">
                <div class="product-image">
                    📱
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <span class="product-category">${product.category}</span>
                    <div class="product-price">
                        ¥<fmt:formatNumber value="${product.price}" pattern="#,##0.00"/>
                    </div>
                    <div class="product-stock">
                        库存：${product.stock}
                        <c:choose>
                            <c:when test="${product.stock > 0}">
                                <span class="stock-badge in-stock">有货</span>
                            </c:when>
                            <c:otherwise>
                                <span class="stock-badge out-of-stock">缺货</span>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>
            </div>
        </c:forEach>
    </div>
    
    <!-- 统计信息 -->
    <div class="stats">
        <p>共显示 <c:out value="${products.size()}" /> 件商品</p>
        <p>
            有货：<c:set var="inStockCount" value="0" />
            <c:forEach var="p" items="${products}">
                <c:if test="${p.stock > 0}">
                    <c:set var="inStockCount" value="${inStockCount + 1}" />
                </c:if>
            </c:forEach>
            <c:out value="${inStockCount}" /> 件
        </p>
    </div>
</body>
</html>
```

### 示例2：用户管理系统（CRUD操作）

Servlet代码：

```java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.*;
import com.example.model.User;

@WebServlet("/user-manage")
public class UserManageServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String action = request.getParameter("action");
        
        if ("delete".equals(action)) {
            // 删除用户
            int id = Integer.parseInt(request.getParameter("id"));
            deleteUser(id);
            response.sendRedirect("/user-manage");
            return;
        }
        
        // 获取所有用户
        List<User> users = getAllUsers();
        request.setAttribute("users", users);
        
        // 统计数据
        int totalCount = users.size();
        int vipCount = 0;
        for (User user : users) {
            if (user.isVip()) {
                vipCount++;
            }
        }
        request.setAttribute("totalCount", totalCount);
        request.setAttribute("vipCount", vipCount);
        
        request.getRequestDispatcher("/user-manage.jsp").forward(request, response);
    }
    
    private List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        users.add(new User(1, "张三", 25, "zhangsan@example.com", true));
        users.add(new User(2, "李四", 30, "lisi@example.com", false));
        users.add(new User(3, "王五", 28, "wangwu@example.com", true));
        users.add(new User(4, "赵六", 22, "zhaoliu@example.com", false));
        users.add(new User(5, "钱七", 35, "qianqi@example.com", true));
        return users;
    }
    
    private void deleteUser(int id) {
        // 实际项目中执行数据库删除操作
        System.out.println("删除用户ID: " + id);
    }
}
```

JSP页面：

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>用户管理系统</title>
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
        .stats-bar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-around;
        }
        .stat-item {
            text-align: center;
        }
        .stat-value {
            font-size: 32px;
            font-weight: bold;
        }
        .stat-label {
            font-size: 14px;
            opacity: 0.9;
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
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
        }
        .badge-vip {
            background: #fff3cd;
            color: #856404;
        }
        .badge-normal {
            background: #e3f2fd;
            color: #1976d2;
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
        .btn-edit {
            background: #2196F3;
            color: white;
        }
        .btn-delete {
            background: #f44336;
            color: white;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .search-box {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
        }
        .search-box input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .search-box button {
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
    <h1>👥 用户管理系统</h1>
    
    <!-- 统计栏 -->
    <div class="stats-bar">
        <div class="stat-item">
            <div class="stat-value"><c:out value="${totalCount}" /></div>
            <div class="stat-label">总用户数</div>
        </div>
        <div class="stat-item">
            <div class="stat-value"><c:out value="${vipCount}" /></div>
            <div class="stat-label">VIP用户</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">
                <c:choose>
                    <c:when test="${totalCount > 0}">
                        <fmt:formatNumber value="${vipCount * 100.0 / totalCount}" 
                                         pattern="#0.0" />%
                    </c:when>
                    <c:otherwise>0%</c:otherwise>
                </c:choose>
            </div>
            <div class="stat-label">VIP比例</div>
        </div>
    </div>
    
    <!-- 搜索框 -->
    <div class="search-box">
        <input type="text" placeholder="搜索用户名或邮箱...">
        <button>搜索</button>
    </div>
    
    <!-- 用户列表 -->
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>姓名</th>
                <th>年龄</th>
                <th>邮箱</th>
                <th>类型</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="user" items="${users}" varStatus="status">
                <tr>
                    <td><c:out value="${user.id}" /></td>
                    <td><c:out value="${user.name}" /></td>
                    <td><c:out value="${user.age}" /> 岁</td>
                    <td>
                        <c:choose>
                            <c:when test="${fn:contains(user.email, '@qq.com')}">
                                📧 QQ邮箱
                            </c:when>
                            <c:when test="${fn:contains(user.email, '@163.com')}">
                                📧 网易邮箱
                            </c:when>
                            <c:otherwise>
                                📧 <c:out value="${user.email}" />
                            </c:otherwise>
                        </c:choose>
                    </td>
                    <td>
                        <c:choose>
                            <c:when test="${user.vip}">
                                <span class="badge badge-vip">⭐ VIP</span>
                            </c:when>
                            <c:otherwise>
                                <span class="badge badge-normal">普通</span>
                            </c:otherwise>
                        </c:choose>
                    </td>
                    <td>
                        <a href="/user-edit?id=${user.id}" class="btn btn-edit">编辑</a>
                        <a href="/user-manage?action=delete&id=${user.id}" 
                           class="btn btn-delete"
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

### 示例3：格式化标签库（fmt）

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>数据格式化</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
        }
        .format-section {
            background: #f8f9fa;
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
        }
        .format-label {
            font-weight: bold;
            color: #666;
            margin-bottom: 10px;
        }
        .format-value {
            font-size: 18px;
            color: #333;
            padding: 10px;
            background: white;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <%
        request.setAttribute("price", 12345.6789);
        request.setAttribute("date", new java.util.Date());
        request.setAttribute("percent", 0.756);
    %>
    
    <h1>📊 数据格式化演示</h1>
    
    <!-- 数字格式化 -->
    <div class="format-section">
        <div class="format-label">数字格式化</div>
        <div class="format-value">
            <p>原始值：12345.6789</p>
            <p>货币格式：¥<fmt:formatNumber value="${price}" type="currency"/></p>
            <p>百分比：<fmt:formatNumber value="${percent}" type="percent"/></p>
            <p>整数：<fmt:formatNumber value="${price}" pattern="#,##0"/></p>
            <p>两位小数：<fmt:formatNumber value="${price}" pattern="#,##0.00"/></p>
        </div>
    </div>
    
    <!-- 日期格式化 -->
    <div class="format-section">
        <div class="format-label">日期格式化</div>
        <div class="format-value">
            <p>原始值：<c:out value="${date}" /></p>
            <p>完整格式：<fmt:formatDate value="${date}" type="both" dateStyle="full" timeStyle="full"/></p>
            <p>短格式：<fmt:formatDate value="${date}" type="date" dateStyle="short"/></p>
            <p>自定义：<fmt:formatDate value="${date}" pattern="yyyy年MM月dd日 HH:mm:ss"/></p>
        </div>
    </div>
    
    <!-- 国际化 -->
    <div class="format-section">
        <div class="format-label">国际化（设置区域）</div>
        <fmt:setLocale value="zh_CN"/>
        <div class="format-value">
            <p>中文环境货币：¥<fmt:formatNumber value="${price}" type="currency"/></p>
        </div>
        
        <fmt:setLocale value="en_US"/>
        <div class="format-value">
            <p>英文环境货币：<fmt:formatNumber value="${price}" type="currency"/></p>
        </div>
    </div>
</body>
</html>
```

## 5.7 Functions标签库

JSTL还提供了字符串处理函数：

```jsp
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!-- 字符串长度 -->
<p>长度：${fn:length(username)}</p>

<!-- 包含判断 -->
<c:if test="${fn:contains(email, '@')}">
    <p>有效的邮箱格式</p>
</c:if>

<!-- 大小写转换 -->
<p>大写：${fn:toUpperCase(name)}</p>
<p>小写：${fn:toLowerCase(name)}</p>

<!-- 替换 -->
<p>替换后：${fn:replace(text, "旧值", "新值")}</p>

<!-- 分割 -->
<c:forEach var="item" items="${fn:split(tags, ',')}">
    <span>${item}</span>
</c:forEach>
```

## 5.8 练习题

1. **选择题**：以下哪个标签用于循环遍历集合？
   - A) `<c:loop>`
   - B) `<c:forEach>`
   - C) `<c:repeat>`
   - D) `<c:iterate>`

2. **填空题**：JSTL的core标签库URI是______，使用前需要通过______指令引入。

3. **简答题**：解释`<c:out>`标签的`escapeXml`属性的作用，为什么默认值是true？

4. **编程题**：编写一个JSP页面，使用JSTL显示学生成绩列表，并根据分数显示等级（≥90优秀，≥80良好，≥60及格，<60不及格）。

5. **思考题**：为什么说JSTL比在JSP中写Java代码更好？从可维护性、安全性、可读性三个角度分析。

## 5.9 常见误区

### 误区1：忘记引入标签库
- **错误做法**：直接使用`<c:forEach>`而不引入标签库
- **正确做法**：
  ```jsp
  <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
  ```

### 误区2：混淆var和items属性
- **错误理解**：`var`是要遍历的集合
- **正确理解**：`items`是集合，`var`是每次迭代的变量名
  ```jsp
  <c:forEach var="item" items="${list}">
      <!-- item代表当前元素 -->
  </c:forEach>
  ```

### 误区3：在JSTL中写复杂业务逻辑
- **错误做法**：
  ```jsp
  <c:forEach var="i" begin="1" end="1000">
      <!-- 大量计算 -->
  </c:forEach>
  ```
- **正确做法**：复杂逻辑应在Servlet中完成，JSTL只负责展示

### 误区4：忽略varStatus的使用
- **错误做法**：手动维护计数器
- **正确做法**：
  ```jsp
  <c:forEach var="item" items="${list}" varStatus="status">
      <p>序号：${status.count}，索引：${status.index}</p>
      <c:if test="${status.first}">第一条</c:if>
      <c:if test="${status.last}">最后一条</c:if>
  </c:forEach>
  ```

### 误区5：SQL标签库的滥用
- **错误做法**：在JSP中使用`<sql:query>`直接查询数据库
- **正确做法**：数据库操作应在DAO层完成，JSP只负责展示数据

## 5.10 本章小结

JSTL让JSP页面彻底摆脱Java代码，实现关注点分离。记住：
- core标签库最常用，包括循环、判断、URL处理等
- fmt标签库用于格式化数字、日期、国际化
- functions标签库提供字符串处理函数
- 避免在JSP中写业务逻辑，保持视图层纯净

下一章我们将学习Session与Cookie，它们解决了HTTP无状态的问题，让Web应用能够"记住"用户。
