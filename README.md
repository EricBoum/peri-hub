# peri-hub

[中文](#中文) | [English](#english)

## 中文

peri-hub 是一个基于 Tauri + React + TypeScript 的跨平台桌面应用，用于管理外设与显示器控制。

### 关键词

`Tauri` `Rust` `React` `桌面应用` `外设管理` `显示器控制` `亮度控制` `DDC/CI` `macOS` `Windows` `cross-platform`

### 功能

- 显示器检测与亮度控制
- 分辨率相关控制面板
- 鼠标设备检测
- 中英文界面切换

### 技术栈

- 前端：React 19 + Vite 8 + TypeScript
- 桌面端：Tauri 2（Rust）

### 开发

```bash
pnpm install
pnpm tauri dev
```

### 打包

- macOS：
  `pnpm build:mac`
- Windows：
  `pnpm build:win`

### 发布命令（macOS）

```bash
pnpm release:mac
```

输出文件：
`release/peri-hub-macos-arm64.dmg`

### 发布说明

当前发布 `unsigned` 安装包（未做 Apple 签名与公证）。

### 下载


| 平台 | 架构 | 包类型 | 下载 |
| --- | --- | --- | --- |
| macOS | Apple Silicon (ARM64) | DMG (unsigned) | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-macos-arm64.dmg) |

### macOS 安装

1. 下载并打开 DMG，把 `peri-hub.app` 拖到 `Applications`。
2. 在 `Applications` 中对 `peri-hub.app` 右键，选择“打开”。
3. 若系统仍提示阻止：进入 `系统设置 -> 隐私与安全性`，点击“仍要打开”。
4. 若仍无法打开，可执行：

```bash
xattr -dr com.apple.quarantine /Applications/peri-hub.app
```


---

## English

peri-hub is a cross-platform desktop app built with Tauri + React + TypeScript for peripheral and monitor management.

### Keywords

`tauri` `rust` `react` `desktop app` `peripheral manager` `monitor control` `brightness control` `ddc/ci` `macos` `windows` `cross-platform`

### Features

- Monitor detection and brightness control
- Resolution-related control panel
- Mouse device detection
- Chinese/English language switching

### Tech Stack

- Frontend: React 19 + Vite 8 + TypeScript
- Desktop: Tauri 2 (Rust)

### Development

```bash
pnpm install
pnpm tauri dev
```

### Build

- macOS:
  `pnpm build:mac`
- Windows:
  `pnpm build:win`

### Release Command (macOS)

```bash
pnpm release:mac
```

Output file:
`release/peri-hub-macos-arm64.dmg`

### Release Notes

Current release uses `unsigned` macOS builds (without Apple signing/notarization).

### Download

#### Download Matrix (Latest Release)

| Platform | Architecture | Package | Download |
| --- | --- | --- | --- |
| macOS | Apple Silicon (ARM64) | DMG (unsigned) | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-macos-arm64.dmg) |

### macOS Install

1. Download and open the DMG, then drag `peri-hub.app` to `Applications`.
2. In `Applications`, right-click `peri-hub.app` and choose `Open`.
3. If blocked, go to `System Settings -> Privacy & Security` and click `Open Anyway`.
4. If it is still blocked, run:

```bash
xattr -dr com.apple.quarantine /Applications/peri-hub.app
```

### Recommended GitHub Topics

`tauri` `rust` `react` `vite` `desktop-app` `cross-platform` `monitor` `monitor-control` `brightness` `ddc-ci` `macos` `windows`
