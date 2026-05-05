# Installing oh-my-claudecode Plugin for Cursor

## ⚠️ Important: Where to Run These Commands

**These commands CANNOT be run in the terminal!**  
**They MUST be run in Cursor's chat/composer interface.**

## Quick Installation Guide

### Step 1: Open Cursor's Chat Interface

- **Mac**: Press `Cmd+L` (or `Cmd+K` then select "Chat")
- **Windows/Linux**: Press `Ctrl+L` (or `Ctrl+K` then select "Chat")

### Step 2: Run These Commands (One at a Time)

Copy and paste each command into Cursor's chat interface:

```bash
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
```

Wait for it to complete, then run:

```bash
/plugin install oh-my-claudecode
```

Wait for it to complete, then run:

```bash
/oh-my-claudecode:omc-setup
```

## Common Error

If you see this error in the terminal:
```
zsh: no such file or directory: /oh-my-claudecode:omc-setup
```

**This means you're trying to run it in the terminal instead of Cursor's chat!**

**Solution**: Open Cursor's chat interface (`Cmd+L` or `Ctrl+L`) and run the command there.

## What This Plugin Does

oh-my-claudecode provides:
- Multi-agent orchestration for AI-assisted development
- 32 specialized agents and 46+ skills
- Multiple execution modes (Autopilot, Ultrapilot, Swarm, etc.)
- Natural language interface

## After Installation

You can use keywords like:
- `autopilot:` - Full autonomous execution
- `ralph:` - Persistent until completion
- `ulw` - Ultrawork mode (3-5x parallel processing)
- `eco` - Token-efficient mode
- `swarm:` - Coordinated agents

## Documentation

- GitHub: https://github.com/Yeachan-Heo/oh-my-claudecode
- Website: https://yeachan-heo.github.io/oh-my-claudecode-website/
