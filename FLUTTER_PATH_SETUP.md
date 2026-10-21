# Flutter PATH 配置指南

## ✅ 已完成配置

Flutter已成功添加到系统PATH环境变量中！

**Flutter安装位置**: `C:\src\flutter`  
**Flutter版本**: 3.47.6 (stable)  
**Dart版本**: 3.13.5

---

## 📋 配置详情

### 永久添加方式

已通过PowerShell命令将Flutter添加到**用户级PATH**：

```powershell
[Environment]::SetEnvironmentVariable('Path', 
    [Environment]::GetEnvironmentVariable('Path', 'User') + ';C:\src\flutter\bin', 
    'User')
```

### 验证配置

打开新的命令行窗口，运行：

```bash
flutter --version
```

预期输出：
```
Flutter 3.47.6 • channel stable
Framework • revision 5fc346839b
Tools • Dart 3.13.5 • DevTools 2.60.0
```

---

## 🔧 Flutter Doctor 检查结果

```
[√] Flutter (Channel stable, 3.47.6, on Windows 11)
[√] Windows Version (Windows 11 or higher, 25H2)
[!] Android toolchain - develop for Android devices
    ! Some Android licenses not accepted
[X] Chrome - develop for the web
[√] Visual Studio - develop Windows apps
[√] Connected device (2 available)
[!] Network resources
```

### 需要修复的问题

#### 1. Android许可证未接受

**解决方案**:
```bash
flutter doctor --android-licenses
```

按提示输入 `y` 接受所有许可证。

#### 2. Chrome未找到（可选）

如果需要进行Web开发，可以设置Chrome路径：

```bash
setx CHROME_EXECUTABLE "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

或者忽略此警告（如果不进行Web开发）。

#### 3. 网络资源检查失败

这是临时网络问题，不影响本地开发。如需访问Maven仓库，可以使用国内镜像：

```bash
flutter config --no-analytics
```

---

## 🚀 快速开始

### 构建APK

现在可以直接使用Flutter命令构建APK了：

```bash
# 进入项目目录
cd F:\app

# 清理之前的构建
flutter clean

# 获取依赖
flutter pub get

# 构建Release APK
flutter build apk --release --split-per-abi
```

**输出位置**:
- `F:\app\build\app\outputs\flutter-apk\app-armeabi-v7a-release.apk`
- `F:\app\build\app\outputs\flutter-apk\app-arm64-v8a-release.apk`
- `F:\app\build\app\outputs\flutter-apk\app-x86_64-release.apk`

### 运行应用

```bash
# 在模拟器上运行
flutter run

# 在特定设备上运行
flutter devices  # 查看可用设备
flutter run -d <device_id>
```

---

## 💡 常用Flutter命令

```bash
# 查看Flutter版本
flutter --version

# 检查开发环境
flutter doctor

# 查看所有可用设备
flutter devices

# 创建新项目
flutter create my_app

# 运行应用（调试模式）
flutter run

# 构建Release APK
flutter build apk --release

# 构建Release Bundle（用于Google Play）
flutter build appbundle --release

# 清理构建缓存
flutter clean

# 更新Flutter SDK
flutter upgrade

# 切换频道（stable/beta/dev/master）
flutter channel stable
flutter upgrade
```

---

## 🔍 故障排除

### 问题1: 新打开的终端仍然找不到flutter

**原因**: PATH环境变量需要重新加载

**解决方案**:
1. 关闭所有命令行窗口
2. 重新打开新的命令行窗口
3. 或者在当前窗口运行：
   ```bash
   set PATH=%PATH%;C:\src\flutter\bin
   ```

### 问题2: flutter doctor显示Android工具链错误

**解决方案**:
```bash
flutter doctor --android-licenses
```

### 问题3: 构建失败 - Gradle错误

**解决方案**:
```bash
cd F:\app
flutter clean
rm -rf .gradle
flutter pub get
flutter build apk --release
```

### 问题4: 网络超时

**解决方案**: 配置国内镜像源

```bash
# 清华大学镜像
export PUB_HOSTED_URL=https://mirrors.tuna.tsinghua.edu.cn/dart-pub
export FLUTTER_STORAGE_BASE_URL=https://mirrors.tuna.tsinghua.edu.cn/flutter

# 或在PowerShell中
$env:PUB_HOSTED_URL="https://mirrors.tuna.tsinghua.edu.cn/dart-pub"
$env:FLUTTER_STORAGE_BASE_URL="https://mirrors.tuna.tsinghua.edu.cn/flutter"
```

---

## 📚 相关文档

- [BUILD_APK_GUIDE.md](./BUILD_APK_GUIDE.md) - 详细的APK构建指南
- [RELEASE_NOTES_v3.0.0.md](./RELEASE_NOTES_v3.0.0.md) - v3.0.0发布说明
- [Flutter官方文档](https://flutter.dev/docs)

---

**配置日期**: 2026-10-21  
**Flutter版本**: 3.47.6  
**操作系统**: Windows 11 (25H2)
