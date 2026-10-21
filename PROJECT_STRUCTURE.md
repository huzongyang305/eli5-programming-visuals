# 项目结构完整指南

## 📁 项目概览

本项目包含两个主要部分：
1. **ELI5编程可视化网站**（Web项目）
2. **Flutter移动应用**（Android/iOS应用）

---

## 🌐 第一部分：ELI5可视化网站

### 项目位置
```
C:\Users\m1899\Documents\Qoder\2026-10-19\1cff233e\
```

### GitHub仓库
https://github.com/huzongyang305/eli5-programming-visuals

### 核心文件结构

```
1cff233e/
├── tutorial-output/                    # 教程输出目录
│   ├── visuals/                        # 可视化页面 ⭐核心
│   │   ├── index.html                  # 主页索引
│   │   ├── 01-linked-list.html         # 链表可视化
│   │   ├── 02-recursion.html           # 递归可视化
│   │   ├── 03-oop.html                 # OOP可视化
│   │   ├── 04-memory-management.html   # 内存管理可视化
│   │   ├── 05-exception-handling.html  # 异常处理可视化
│   │   ├── 06-generics.html            # 泛型可视化
│   │   ├── 07-hash-table.html          # 哈希表可视化
│   │   ├── 08-solid-principles.html    # SOLID原则可视化
│   │   ├── 09-sorting-algorithms.html  # 排序算法可视化
│   │   │
│   │   ├── css/                        # 样式文件
│   │   │   └── enhanced-styles.css     # 统一设计系统 (34KB)
│   │   │
│   │   ├── js/                         # JavaScript模块
│   │   │   ├── progress-tracker.js     # 学习进度追踪
│   │   │   ├── ui-components.js        # UI组件库 (20KB)
│   │   │   └── mobile-enhancements.js  # 移动端优化
│   │   │
│   │   ├── manifest.json               # PWA应用清单
│   │   ├── sw.js                       # Service Worker
│   │   ├── README.md                   # 使用文档
│   │   ├── PWA_SETUP.md                # PWA设置指南
│   │   └── UI_IMPROVEMENTS.md          # UI改进说明
│   │
│   ├── 01-data-structures.md           # 第1章教程
│   ├── 02-algorithms.md                # 第2章教程
│   ├── 03-oop.md                       # 第3章教程
│   ├── 04-memory-management.md         # 第4章教程
│   ├── 05-exception-handling.md        # 第5章教程
│   ├── 06-generics.md                  # 第6章教程
│   ├── 07-standard-library.md          # 第7章教程
│   ├── 08-design-principles.md         # 第8章教程
│   ├── README.md                       # 教程总索引
│   └── review-report.md                # 质量评估报告
│
├── RELEASE_NOTES_v1.0.0.md             # v1.0.0发布说明
├── RELEASE_NOTES_v2.0.0.md             # v2.0.0发布说明
├── RELEASE_NOTES_v3.0.0.md             # v3.0.0发布说明
├── APK_RELEASE_v3.0.0.md               # APK发布报告
├── BUILD_APK_GUIDE.md                  # APK构建指南
├── FLUTTER_PATH_SETUP.md               # Flutter配置指南
├── PROJECT_STRUCTURE.md                # 本文件
└── README.md                           # 项目总README
```

### 使用的技术栈

#### 前端技术
- **HTML5** - 页面结构
- **CSS3** - 样式和动画
  - CSS自定义属性（主题变量）
  - Flexbox/Grid布局
  - CSS动画（@keyframes）
  - 媒体查询（响应式设计）
- **JavaScript (ES6+)** - 交互逻辑
  - Classes（类）
  - Arrow Functions（箭头函数）
  - Template Literals（模板字符串）
  - localStorage API
  - Service Worker API

#### PWA技术
- **manifest.json** - 应用清单
- **Service Worker** - 离线缓存
- **localStorage** - 数据持久化

#### 无依赖
- ❌ 不使用React/Vue/Angular
- ❌ 不使用jQuery
- ❌ 不使用Bootstrap
- ✅ 纯原生实现，零外部依赖

### 开发工具

#### 必需工具
1. **文本编辑器**（任选其一）
   - VS Code（推荐）
   - Sublime Text
   - Notepad++

2. **浏览器**（用于测试）
   - Chrome（推荐，支持PWA）
   - Firefox
   - Edge

3. **本地服务器**（可选）
   ```bash
   python -m http.server 8080
   ```

#### 可选工具
- **Git** - 版本控制
- **GitHub CLI** (`gh`) - 发布管理
- **Lighthouse** - 性能审计（Chrome DevTools内置）

---

## 📱 第二部分：Flutter移动应用

### 项目位置
```
F:\app\
```

### 核心文件结构

```
F:\app\
├── lib/                                  # Dart源代码
│   ├── main.dart                         # 应用入口
│   │
│   ├── screens/                          # 页面/屏幕
│   │   ├── root_shell.dart               # 主导航容器
│   │   ├── home_screen.dart              # 首页
│   │   ├── learn_screen.dart             # 学习页
│   │   ├── tools_screen.dart             # 工具页
│   │   ├── profile_screen.dart           # 个人中心
│   │   ├── analytics_screen.dart         # 数据分析页
│   │   ├── social_hub_screen.dart        # 社交中心
│   │   ├── friends_screen.dart           # 好友列表
│   │   ├── leaderboard_screen.dart       # 排行榜
│   │   ├── code_share_screen.dart        # 代码分享
│   │   ├── study_groups_screen.dart      # 学习小组
│   │   ├── gamification_hub_screen.dart  # 游戏化中心
│   │   ├── daily_question_screen.dart    # 每日一题
│   │   └── review_plan_screen.dart       # 复习计划
│   │
│   ├── services/                         # 服务层
│   │   ├── settings_provider.dart        # 设置管理（Provider）
│   │   ├── progress_provider.dart        # 进度管理（Provider）
│   │   ├── notification_service.dart     # 通知服务
│   │   ├── auto_backup_service.dart      # 自动备份
│   │   └── social_service.dart           # 社交功能服务
│   │
│   ├── models/                           # 数据模型
│   │   ├── friend.dart                   # 好友模型
│   │   ├── study_group.dart              # 学习小组模型
│   │   └── code_share.dart               # 代码分享模型
│   │
│   ├── widgets/                          # 可复用组件
│   │   ├── mastery_matrix.dart           # 掌握度矩阵
│   │   ├── learning_curve.dart           # 学习曲线图
│   │   ├── smart_recommendations.dart    # 智能推荐
│   │   ├── activity_chart.dart           # 活动量图表
│   │   ├── study_heatmap.dart            # 学习热力图
│   │   └── responsive_content.dart       # 响应式内容
│   │
│   └── l10n/                             # 国际化
│       └── l10n_extension.dart           # 多语言扩展
│
├── android/                              # Android平台配置
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml   # Android清单
│   │   │       ├── kotlin/               # Kotlin代码
│   │   │       └── res/                  # 资源文件
│   │   └── build.gradle                  # Gradle构建配置
│   ├── build.gradle                      # 项目级Gradle配置
│   └── gradle.properties                 # Gradle属性
│
├── ios/                                  # iOS平台配置
│   └── Runner/
│       ├── AppDelegate.swift             # iOS应用代理
│       └── Info.plist                    # iOS配置
│
├── assets/                               # 静态资源
│   ├── images/                           # 图片资源
│   └── content/                          # 学习内容
│       └── manifest.json                 # 内容清单
│
├── test/                                 # 测试文件
│   └── widget_test.dart                  # Widget测试
│
├── pubspec.yaml                          # Flutter依赖配置 ⭐重要
├── pubspec.lock                          # 锁定依赖版本
└── README.md                             # Flutter项目说明
```

### 使用的技术栈

#### 核心框架
- **Flutter 3.47.6** - UI框架
- **Dart 3.13.5** - 编程语言

#### 状态管理
- **Provider** - 轻量级状态管理
  - `SettingsProvider` - 设置状态
  - `ProgressProvider` - 进度状态

#### 关键依赖包

从 `pubspec.yaml` 中提取：

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # UI组件
  cupertino_icons: ^1.0.9              # iOS风格图标
  flutter_markdown: ^0.7.7+1           # Markdown渲染
  
  # 状态管理
  provider: ^6.1.2                     # Provider状态管理
  
  # 数据存储
  shared_preferences: ^2.3.3           # 本地存储
  
  # 通知
  flutter_local_notifications: ^19.5.0 # 本地通知
  timezone: ^0.10.1                    # 时区支持
  
  # 其他
  intl: ^0.20.2                        # 国际化
  url_launcher: ^6.3.1                 # URL启动
```

#### 构建工具
- **Gradle** - Android构建系统
- **CocoaPods** - iOS依赖管理（如需要）

### 开发工具

#### 必需工具
1. **Flutter SDK**
   - 位置: `C:\src\flutter`
   - 版本: 3.47.6 (stable)
   - PATH已配置: `C:\src\flutter\bin`

2. **Android Studio**（或VS Code + Flutter插件）
   - Android SDK
   - Android Emulator
   - Java JDK 11+

3. **Visual Studio Community 2026**
   - 用于Windows桌面应用开发

#### 可选工具
- **Android Device Monitor** - 设备调试
- **Flutter DevTools** - 性能分析
- **Postman** - API测试

---

## 🔧 工具和插件清单

### 通用工具

| 工具名称 | 用途 | 安装位置 |
|---------|------|---------|
| **Git** | 版本控制 | 系统PATH |
| **GitHub CLI (gh)** | GitHub操作 | 系统PATH |
| **Python 3** | 本地服务器、脚本 | 系统PATH |
| **Node.js** | 某些脚本依赖 | 系统PATH |

### Flutter专用工具

| 工具名称 | 用途 | 位置 |
|---------|------|------|
| **Flutter SDK** | Flutter框架 | `C:\src\flutter` |
| **Dart SDK** | Dart编译器 | `C:\src\flutter\bin\cache\dart-sdk` |
| **Android SDK** | Android构建 | Android Studio内 |
| **Gradle** | Android构建 | `F:\app\android\gradle` |

### VS Code扩展（如使用）

推荐安装：
- **Flutter** - Flutter开发支持
- **Dart** - Dart语言支持
- **Flutter Widget Snippets** - Widget代码片段
- **Pubspec Assist** - pubspec.yaml辅助
- **Error Lens** - 错误高亮

### Android Studio插件（如使用）

推荐安装：
- **Flutter** - Flutter开发支持
- **Dart** - Dart语言支持

---

## 📦 依赖包详细清单

### Web项目（无外部依赖）
✅ 纯原生HTML/CSS/JS，零依赖

### Flutter项目

#### 核心依赖
```
flutter (SDK)
cupertino_icons 1.0.9
provider 6.1.2
shared_preferences 2.3.3
flutter_markdown 0.7.7+1
flutter_local_notifications 19.5.0
timezone 0.10.1
intl 0.20.2
url_launcher 6.3.1
```

#### 传递依赖（部分）
```
meta 1.18.3
vector_math 2.4.0
material_color_utilities 0.13.0
test_api 0.7.12
vm_service 15.3.0
xml 6.6.1
petitparser 7.0.2
```

完整列表见 `F:\app\pubspec.lock`

---

## 🎯 快速定位指南

### 如果要修改...

#### Web可视化页面
- **位置**: `C:\Users\m1899\Documents\Qoder\2026-10-19\1cff233e\tutorial-output\visuals\`
- **主页**: `index.html`
- **样式**: `css/enhanced-styles.css`
- **脚本**: `js/*.js`

#### Flutter应用界面
- **位置**: `F:\app\lib\screens\`
- **主导航**: `root_shell.dart`
- **首页**: `home_screen.dart`

#### Flutter业务逻辑
- **位置**: `F:\app\lib\services\`
- **设置**: `settings_provider.dart`
- **进度**: `progress_provider.dart`

#### Flutter数据模型
- **位置**: `F:\app\lib\models\`
- **好友**: `friend.dart`
- **学习小组**: `study_group.dart`

#### Flutter依赖配置
- **位置**: `F:\app\pubspec.yaml`

#### Flutter Android配置
- **位置**: `F:\app\android\app\build.gradle`
- **签名**: `F:\app\android\key.properties`（需创建）

---

## 📊 项目统计

### Web项目
- **HTML文件**: 10个
- **CSS文件**: 1个 (34KB)
- **JS文件**: 4个 (~60KB)
- **Markdown教程**: 8章
- **总代码行数**: ~15,000行

### Flutter项目
- **Dart文件**: ~30个
- **总代码行数**: ~8,000行
- **APK大小**: ~90MB (split per ABI)
- **最小Android版本**: 5.0 (API 21)
- **目标Android版本**: 14 (API 34)

---

## 🔗 相关链接

### 文档
- [Web项目README](./README.md)
- [UI/UX改进说明](./tutorial-output/visuals/UI_IMPROVEMENTS.md)
- [APK构建指南](./BUILD_APK_GUIDE.md)
- [Flutter配置指南](./FLUTTER_PATH_SETUP.md)
- [APK发布报告](./APK_RELEASE_v3.0.0.md)

### GitHub
- **仓库**: https://github.com/huzongyang305/eli5-programming-visuals
- **Releases**: https://github.com/huzongyang305/eli5-programming-visuals/releases
- **Issues**: https://github.com/huzongyang305/eli5-programming-visuals/issues

### 官方文档
- [Flutter官网](https://flutter.dev)
- [Dart官网](https://dart.dev)
- [Material Design](https://material.io)

---

**最后更新**: 2026-10-21  
**维护者**: ELI5项目组
