# ELI5 编程基础可视化图解系列 🎨

> **Explain Like I'm 5** - 用生活类比和互动动画，让复杂编程概念变得简单易懂

[![Release](https://img.shields.io/github/v/release/huzongyang305/eli5-programming-visuals?label=version)](https://github.com/huzongyang305/eli5-programming-visuals/releases/latest)
[![License](https://img.shields.io/github/license/huzongyang305/eli5-programming-visuals)](LICENSE)
[![Stars](https://img.shields.io/github/stars/huzongyang305/eli5-programming-visuals?style=social)](https://github.com/huzongyang305/eli5-programming-visuals/stargazers)

## 🌟 项目简介

这是一个**交互式编程教育可视化系列**，通过8个精心设计的HTML页面，将抽象的编程概念转化为生动的生活场景。每个页面都是完全自包含的单文件应用，无需安装任何依赖，双击即可在浏览器中打开。

### 为什么选择ELI5？

- 🎯 **零基础友好**：不需要编程背景，从生活经验出发理解概念
- 🎮 **互动学习**：点击、拖拽、调节滑块，亲眼看到算法如何运行
- 📱 **随时随地**：单文件设计，离线可用，手机平板都能看
- 🌍 **双语对照**：同时提供C++和Java代码示例，对比学习两种语言

## 📚 可视化清单

点击以下链接直接体验：

| # | 主题 | 生活类比 | 核心特性 |
|---|------|----------|----------|
| 1 | [链表](tutorial-output/visuals/01-linked-list.html) | 🔗 火车车厢 | 节点插入/删除、性能对比 |
| 2 | [递归](tutorial-output/visuals/02-recursion.html) | 🪆 俄罗斯套娃 | 调用栈可视化、记忆化优化 |
| 3 | [OOP](tutorial-output/visuals/03-oop.html) | 🚗 汽车工厂 | 四大支柱、继承树、多态行为 |
| 4 | [内存管理](tutorial-output/visuals/04-memory-management.html) | 📚 图书馆书架 | 栈vs堆、智能指针、GC动画 |
| 5 | [异常处理](tutorial-output/visuals/05-exception-handling.html) | 🚒 应急响应 | 异常传播、try-catch-finally |
| 6 | [泛型](tutorial-output/visuals/06-generics.html) | 📖 万能食谱 | 模板特化、类型擦除 |
| 7 | [哈希表](tutorial-output/visuals/07-hash-table.html) | 🗂️ 卡片目录 | 冲突处理、负载因子、重新哈希 |
| 8 | [SOLID原则](tutorial-output/visuals/08-solid-principles.html) | 👨‍🍳 餐厅厨房 | 五大原则、重构对比、测验模式 |

或者访问 **[总索引页](tutorial-output/visuals/index.html)** 浏览所有可视化。

## 🚀 快速开始

### 方式一：在线浏览（推荐）
直接访问 GitHub Pages（待配置）或下载后本地打开。

### 方式二：克隆仓库
```bash
git clone https://github.com/huzongyang305/eli5-programming-visuals.git
cd eli5-programming-visuals
```

然后双击 `tutorial-output/visuals/index.html` 在浏览器中打开。

### 方式三：本地服务器
```bash
cd tutorial-output/visuals
python -m http.server 8080
# 浏览器访问 http://localhost:8080/index.html
```

## 📊 项目统计

- **8个** 交互式可视化页面
- **16+** 双语言代码示例（C++ & Java）
- **50+** 互动元素（按钮、滑块、下拉框）
- **10+** CSS动画类型
- **~256KB** 总文件大小（纯文本，无图片）

## 🎓 适用人群

- ✅ **编程初学者**：零基础理解核心概念
- ✅ **在校学生**：配合数据结构与算法课程
- ✅ **转行开发者**：快速建立编程思维模型
- ✅ **面试准备者**：可视化复习经典面试题
- ✅ **教学者**：用作课堂演示材料

## 📁 项目结构

```
eli5-programming-visuals/
├── README.md                          # 本文件
├── RELEASE_NOTES_v1.0.0.md            # 发布说明
├── LICENSE                            # MIT许可证
└── tutorial-output/                   # 教程输出目录
    ├── README.md                      # 教程总索引
    ├── review-report.md               # 质量评估报告
    ├── 01-data-structures.md          # 第1章：数据结构
    ├── 02-algorithms.md               # 第2章：算法
    ├── 03-oop.md                      # 第3章：面向对象
    ├── 04-memory-management.md        # 第4章：内存管理
    ├── 05-exception-handling.md       # 第5章：异常处理
    ├── 06-generics.md                 # 第6章：泛型
    ├── 07-standard-library.md         # 第7章：标准库
    ├── 08-design-principles.md        # 第8章：设计原则
    └── visuals/                       # 可视化页面目录 ⭐
        ├── index.html                 # 总索引页
        ├── README.md                  # 使用文档
        ├── 01-linked-list.html
        ├── 02-recursion.html
        ├── 03-oop.html
        ├── 04-memory-management.html
        ├── 05-exception-handling.html
        ├── 06-generics.html
        ├── 07-hash-table.html
        └── 08-solid-principles.html
```

## 🎨 设计理念

### 生活化类比
将抽象概念映射到日常场景：
- 链表 → 火车车厢（每节车厢包含货物和下一节位置）
- 递归 → 俄罗斯套娃（打开一个发现里面还有更小的）
- 内存管理 → 图书馆书架（快速存取区 vs 主书库）

### 渐进式学习
每个可视化遵循：直观理解 → 代码示例 → 性能分析 → 最佳实践

### 零门槛访问
- 单文件HTML，无外部依赖
- 响应式设计，适配各种屏幕
- 无障碍支持，键盘可操作

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 添加新可视化
1. Fork 本仓库
2. 参考现有页面的模板结构
3. 确保单文件设计，无外部依赖
4. 提交 PR 并描述新增内容

### 改进现有内容
- 修复错别字或代码错误
- 优化动画流畅度
- 添加更多交互元素
- 改进无障碍支持

## 📝 许可证

本项目采用 [MIT License](LICENSE)，可自由用于教学、演示和个人学习目的。

## 🙏 致谢

感谢以下项目和资源的启发：

- [VisuAlgo](https://visualgo.net/) - 算法可视化的先驱
- [Python Tutor](http://pythontutor.com/) - 代码执行可视化
- [Explain Like I'm Five](https://www.reddit.com/r/explainlikeimfive/) - Reddit社区

## 📧 联系方式

- **作者**：编程基础教程项目组
- **GitHub**：[@huzongyang305](https://github.com/huzongyang305)
- **问题反馈**：[Issues](https://github.com/huzongyang305/eli5-programming-visuals/issues)

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**

**最后更新**：2026-10-21
