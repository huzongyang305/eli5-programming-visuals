# Flutter APK 构建指南

## 📱 项目位置

Flutter应用源码位于：`F:\app`

---

## 🔧 前置要求

### 1. 安装Flutter SDK

如果尚未安装Flutter，请按以下步骤操作：

```powershell
# 下载Flutter SDK
# 访问 https://flutter.dev/docs/get-started/install/windows

# 解压到指定目录（例如 C:\src\flutter）
# 添加到系统PATH环境变量
```

### 2. 验证安装

```bash
flutter doctor
```

预期输出应显示：
- ✅ Flutter版本
- ✅ Android toolchain
- ✅ Chrome浏览器
- ✅ Android Studio（可选）

### 3. 配置Android环境

确保已安装：
- Android SDK
- Android SDK Platform-Tools
- Java JDK 11+

---

## 🚀 构建Release APK

### 方法一：使用Flutter CLI（推荐）

```bash
# 进入项目目录
cd F:\app

# 清理之前的构建
flutter clean

# 获取依赖
flutter pub get

# 构建release APK
flutter build apk --release

# 或构建split per ABI（更小体积）
flutter build apk --split-per-abi --release
```

**输出位置**:
- 完整APK: `F:\app\build\app\outputs\flutter-apk\app-release.apk`
- Split APKs: `F:\app\build\app\outputs\flutter-apk\app-armeabi-v7a-release.apk` 等

### 方法二：使用Android Studio

1. 打开Android Studio
2. 选择 `File` → `Open`
3. 选择 `F:\app` 目录
4. 等待Gradle同步完成
5. 选择 `Build` → `Generate Signed Bundle / APK`
6. 选择 `APK`
7. 创建或使用现有密钥库
8. 选择 `release` 构建类型
9. 点击 `Finish`

---

## 🔑 签名配置

### 创建密钥库（首次构建）

```bash
keytool -genkey -v -keystore F:\app\upload-keystore.jks -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

按提示输入：
- 密钥库密码
- 姓名、组织单位、组织名称
- 城市、省份、国家代码

### 配置签名

在 `F:\app\android\key.properties` 中创建：

```properties
storePassword=<密钥库密码>
keyPassword=<密钥密码>
keyAlias=upload
storeFile=F:/app/upload-keystore.jks
```

在 `F:\app\android\app\build.gradle` 中添加：

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

---

## 📦 APK优化

### 1. 代码混淆

在 `F:\app\android\app\proguard-rules.pro` 中添加规则，然后在 `build.gradle` 中启用：

```gradle
buildTypes {
    release {
        minifyEnabled true
        useProguard true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### 2. 资源压缩

```gradle
buildTypes {
    release {
        shrinkResources true
        minifyEnabled true
    }
}
```

### 3. 拆分ABI

```bash
flutter build apk --split-per-abi --release
```

生成三个APK：
- `app-armeabi-v7a-release.apk` (ARM 32位)
- `app-arm64-v8a-release.apk` (ARM 64位)
- `app-x86_64-release.apk` (x86 64位)

体积减少约40-60%。

---

## 📊 检查APK信息

### 查看APK大小

```bash
ls -lh F:\app\build\app\outputs\flutter-apk\*.apk
```

### 分析APK内容

```bash
# 使用Android SDK工具
apkanalyzer -h summary F:\app\build\app\outputs\flutter-apk\app-release.apk
```

### 验证签名

```bash
apksigner verify --verbose F:\app\build\app\outputs\flutter-apk\app-release.apk
```

---

## 🎯 当前版本功能

ELI5编程学习应用 v3.0.0 包含：

### 核心功能
- ✅ 9个交互式可视化页面
- ✅ 学习进度追踪
- ✅ 测验系统（6个成就徽章）
- ✅ PWA支持（可离线使用）
- ✅ 深色模式/高对比度模式
- ✅ 排序算法可视化

### 技术特性
- Provider状态管理
- localStorage持久化
- Service Worker离线缓存
- 响应式设计
- WCAG 2.1 AA无障碍

---

## 🐛 常见问题

### 问题1: Flutter命令未找到

**解决方案**:
```powershell
# 添加Flutter到PATH
$env:Path += ";C:\src\flutter\bin"

# 永久添加（ PowerShell ）
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\src\flutter\bin", "User")
```

### 问题2: Gradle同步失败

**解决方案**:
```bash
# 清理Gradle缓存
cd F:\app
flutter clean
rm -rf .gradle
flutter pub get
```

### 问题3: 构建失败 - 缺少依赖

**解决方案**:
```bash
flutter pub get
flutter doctor --android-licenses
```

### 问题4: APK体积过大

**解决方案**:
```bash
# 使用split-per-abi
flutter build apk --split-per-abi --release

# 启用代码混淆和资源压缩
# 见上方"APK优化"章节
```

---

## 📤 发布APK

### 上传到GitHub Release

```bash
# 使用GitHub CLI
gh release upload v3.0.0 F:\app\build\app\outputs\flutter-apk\app-release.apk

# 或手动上传
# 访问 https://github.com/huzongyang305/eli5-programming-visuals/releases/tag/v3.0.0
# 点击 "Attach binaries by dropping them here or selecting them."
```

### 生成SHA256校验和

```bash
certutil -hashfile F:\app\build\app\outputs\flutter-apk\app-release.apk SHA256
```

将校验和添加到Release说明中，供用户验证文件完整性。

---

## 📝 版本命名规范

遵循语义化版本控制：

- **v1.0.0** - 初始发布（8个可视化页面）
- **v2.0.0** - 排序算法 + 学习进度 + PWA
- **v3.0.0** - UI/UX全面改进

APK文件名格式：
```
eli5-learning-v{major}.{minor}.{patch}.apk
```

示例：
```
eli5-learning-v3.0.0.apk
```

---

## 🎉 快速构建脚本

创建 `build_apk.ps1`：

```powershell
# ELI5 Learning App - APK构建脚本

Write-Host "🔨 开始构建ELI5学习应用..." -ForegroundColor Cyan

# 进入项目目录
Set-Location "F:\app"

# 清理
Write-Host "🧹 清理之前的构建..." -ForegroundColor Yellow
flutter clean

# 获取依赖
Write-Host "📦 获取依赖..." -ForegroundColor Yellow
flutter pub get

# 构建Release APK
Write-Host "🚀 构建Release APK..." -ForegroundColor Green
flutter build apk --release --split-per-abi

# 显示结果
Write-Host "`n✅ 构建完成！" -ForegroundColor Green
Write-Host "APK文件位置:" -ForegroundColor Cyan
Get-ChildItem "build\app\outputs\flutter-apk\*-release.apk" | ForEach-Object {
    Write-Host "  - $($_.FullName)" -ForegroundColor White
}

# 计算文件大小
Write-Host "`n📊 文件大小:" -ForegroundColor Cyan
Get-ChildItem "build\app\outputs\flutter-apk\*-release.apk" | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    Write-Host "  - $($_.Name): ${sizeMB} MB" -ForegroundColor White
}
```

使用方法：
```powershell
.\build_apk.ps1
```

---

**最后更新**: 2026-10-21  
**Flutter版本**: 需要 3.0+  
**Android SDK**: 需要 API 21+ (Android 5.0)
