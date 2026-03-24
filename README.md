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

- 直接下载（推荐）：[GitHub Releases](https://github.com/EricBoum/peri-hub/releases/latest)
- 本地导出 DMG 到项目根目录：
  `pnpm release:mac`
- 导出后文件：
  `release/peri-hub-macos-arm64.dmg` 或 `release/peri-hub-macos-x64.dmg`

#### 下载表格（最新版本）

| 平台 | 架构 | 包类型 | 下载 |
| --- | --- | --- | --- |
| macOS | Apple Silicon (ARM64) | DMG | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-macos-arm64.dmg) |
| macOS | Intel (x64) | DMG | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-macos-x64.dmg) |
| Windows | x64 | NSIS Installer (.exe) | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-windows-x64-setup.exe) |
| Windows | x64 | MSI (.msi) | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-windows-x64.msi) |
| Windows | ARM64 | NSIS Installer (.exe) | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-windows-arm64-setup.exe) |
| Windows | ARM64 | MSI (.msi) | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-windows-arm64.msi) |

> 发布时请使用表格里的文件名上传资产，链接会自动指向最新版本。


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

- Direct download (recommended): [GitHub Releases](https://github.com/EricBoum/peri-hub/releases/latest)
- Export DMG to project root for sharing:
  `pnpm release:mac`
- Exported file path:
  `release/peri-hub-macos-arm64.dmg` or `release/peri-hub-macos-x64.dmg`

#### Download Matrix (Latest Release)

| Platform | Architecture | Package | Download |
| --- | --- | --- | --- |
| macOS | Apple Silicon (ARM64) | DMG | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-macos-arm64.dmg) |
| macOS | Intel (x64) | DMG | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-macos-x64.dmg) |
| Windows | x64 | NSIS Installer (.exe) | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-windows-x64-setup.exe) |
| Windows | x64 | MSI (.msi) | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-windows-x64.msi) |
| Windows | ARM64 | NSIS Installer (.exe) | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-windows-arm64-setup.exe) |
| Windows | ARM64 | MSI (.msi) | [Download](https://github.com/EricBoum/peri-hub/releases/latest/download/peri-hub-windows-arm64.msi) |

> Upload release assets with the exact filenames above so these links always resolve.

### Recommended GitHub Topics

`tauri` `rust` `react` `vite` `desktop-app` `cross-platform` `monitor` `monitor-control` `brightness` `ddc-ci` `macos` `windows`
