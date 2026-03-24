# peri-hub

[中文](#中文) | [English](#english)

## 中文

peri-hub 是一个基于 Tauri + React + TypeScript 的跨平台桌面应用，用于管理外设与显示器控制。

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
- Windows（建议在 Windows 机器或 CI 上执行）：
  `pnpm build:win`

---

## English

peri-hub is a cross-platform desktop app built with Tauri + React + TypeScript for peripheral and monitor management.

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
- Windows (recommended on a Windows machine or CI):
  `pnpm build:win`
