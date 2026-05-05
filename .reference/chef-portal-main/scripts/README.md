# Scripts

This directory contains utility scripts for the project.

## Cursor Plugin Installation

### Install oh-my-claudecode Plugin

The `install-cursor-plugin.sh` script helps install the oh-my-claudecode plugin for Cursor.

**Run via npm/pnpm:**
```bash
pnpm install:cursor-plugin
# or
npm run install:cursor-plugin
```

**Run directly:**
```bash
bash scripts/install-cursor-plugin.sh
```

**What it does:**
- Checks if Cursor CLI is available
- Provides installation instructions
- Attempts to open Cursor (if not already running)
- Displays the commands you need to run in Cursor's chat interface

**Note:** The `/plugin` commands must be run in Cursor's chat/composer interface (Cmd+L or Ctrl+L), not via terminal. The script provides clear instructions on what to do.

**Commands to run in Cursor:**
1. `/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode`
2. `/plugin install oh-my-claudecode`
3. `/oh-my-claudecode:omc-setup`
