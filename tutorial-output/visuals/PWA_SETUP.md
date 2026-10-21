# PWA 设置指南

## 图标生成

为了使PWA完全可用，需要生成应用图标。请按以下步骤操作：

### 方式一：使用在线工具（推荐）

1. 访问 [https://app-manifest.firebaseapp.com/](https://app-manifest.firebaseapp.com/)
2. 上传一个512x512的PNG图标（可以使用紫色渐变背景 + "ELI5"文字）
3. 下载生成的图标包
4. 将所有图标文件复制到 `icons/` 目录

### 方式二：手动创建

使用图像编辑工具（如Photoshop、GIMP或在线工具Canva）创建以下尺寸的PNG图标：

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

**设计建议**：
- 背景：紫色渐变 (#667eea → #764ba2)
- 前景：白色"ELI5"文字或书本/灯泡图标
- 风格：简洁、现代、易识别

### 截图生成

同样需要创建两个截图文件放在 `screenshots/` 目录：

- `desktop.png` (1920x1080) - 桌面端视图
- `mobile.png` (750x1334) - 移动端视图

## 测试PWA功能

### 本地测试

```bash
cd tutorial-output/visuals
python -m http.server 8080
```

然后在Chrome浏览器中访问 `http://localhost:8080/index.html`

### Chrome DevTools测试

1. 打开Chrome DevTools (F12)
2. 切换到 **Application** 标签
3. 左侧菜单选择 **Service Workers**
4. 确认Service Worker已注册并激活
5. 选择 **Manifest** 查看manifest.json是否正确加载

### 安装测试

1. 在Chrome地址栏右侧应看到安装图标（⊕）
2. 点击安装按钮
3. 应用应作为独立窗口打开（无浏览器UI）

## 离线功能测试

1. 首次访问后，所有页面会被缓存
2. 在DevTools中切换到 **Network** 标签
3. 将节流设置为 **Offline**
4. 刷新页面，应仍能正常显示

## 已知限制

- 图标和截图文件需要手动生成（当前为占位符）
- Service Worker仅在HTTPS或localhost环境下工作
- iOS Safari对PWA支持有限（需要用户手动添加到主屏幕）

## 浏览器支持

| 浏览器 | Service Worker | Install Prompt | Offline |
|--------|---------------|----------------|---------|
| Chrome 60+ | ✅ | ✅ | ✅ |
| Firefox 55+ | ✅ | ✅ | ✅ |
| Safari 11.1+ | ✅ | ❌* | ✅ |
| Edge 16+ | ✅ | ✅ | ✅ |
| Samsung Internet | ✅ | ✅ | ✅ |

*Safari需要用户手动通过"分享"菜单添加到主屏幕

## 优化建议

1. **预缓存策略**：当前缓存所有HTML文件，可根据需要调整为按需缓存
2. **后台同步**：预留了sync事件处理，可用于同步学习进度到云端
3. **推送通知**：预留了push事件处理，可用于通知新内容发布

---

**最后更新**：2026-10-21
