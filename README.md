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

### 下载


| 平台 | 架构 | 包类型 | 下载 |
| --- | --- | --- | --- |
| macOS | Apple Silicon (ARM64) | DMG | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-macos-arm64.dmg) |


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

### Download

#### Download Matrix (Latest Release)

| Platform | Architecture | Package | Download |
| --- | --- | --- | --- |
| macOS | Apple Silicon (ARM64) | DMG | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-macos-arm64.dmg) |

### Recommended GitHub Topics

`tauri` `rust` `react` `vite` `desktop-app` `cross-platform` `monitor` `monitor-control` `brightness` `ddc-ci` `macos` `windows`
