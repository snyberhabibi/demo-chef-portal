#!/bin/bash

# Script to install oh-my-claudecode plugin for Cursor
# This plugin provides multi-agent orchestration for AI-assisted development

set -e

PLUGIN_REPO="https://github.com/Yeachan-Heo/oh-my-claudecode"
PLUGIN_NAME="oh-my-claudecode"
CURSOR_CLI="/usr/local/bin/cursor"

echo "🚀 Installing oh-my-claudecode plugin for Cursor..."
echo ""

# Check if Cursor CLI exists
if [ ! -f "$CURSOR_CLI" ]; then
    echo "❌ Cursor CLI not found at $CURSOR_CLI"
    echo "Please install Cursor or update the CURSOR_CLI path in this script"
    exit 1
fi

echo "✅ Cursor CLI found"
echo ""

# Note: Cursor plugin commands need to be run in Cursor's chat interface
# These commands cannot be executed via CLI, so we'll provide instructions
# and attempt to open Cursor with the commands ready

echo "⚠️  IMPORTANT: These commands CANNOT be run in the terminal!"
echo "   They MUST be run in Cursor's chat/composer interface."
echo ""
echo "📝 Plugin Installation Instructions:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "❌ DO NOT run these commands in the terminal (they will fail!)"
echo "✅ DO run these commands in Cursor's chat interface (Cmd+L or Ctrl+L)"
echo ""
echo "Steps:"
echo "1. Press Cmd+L (Mac) or Ctrl+L (Windows/Linux) to open Cursor's chat"
echo "2. Copy and paste each command below into the chat, one at a time:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Command 1 - Add plugin to marketplace:"
echo "   /plugin marketplace add $PLUGIN_REPO"
echo ""
echo "Command 2 - Install the plugin:"
echo "   /plugin install $PLUGIN_NAME"
echo ""
echo "Command 3 - Run setup:"
echo "   /oh-my-claudecode:omc-setup"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create a temporary file with the commands
COMMANDS_FILE=$(mktemp)
cat > "$COMMANDS_FILE" << EOF
/plugin marketplace add $PLUGIN_REPO
/plugin install $PLUGIN_NAME
/oh-my-claudecode:omc-setup
EOF

echo "📋 Commands saved to: $COMMANDS_FILE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚨 REMEMBER: Open Cursor's CHAT (Cmd+L), NOT the terminal!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Try to open Cursor if it's not already running
if pgrep -f "Cursor" > /dev/null; then
    echo "✅ Cursor is already running"
else
    echo "🔧 Opening Cursor..."
    open -a Cursor "$(pwd)" 2>/dev/null || cursor "$(pwd)" 2>/dev/null || {
        echo "⚠️  Could not open Cursor automatically. Please open it manually."
    }
fi

echo ""
echo "✨ Next steps:"
echo "   1. Open Cursor's chat interface (Cmd+L / Ctrl+L)"
echo "   2. Run the commands listed above"
echo "   3. Wait for the plugin to install and setup"
echo ""
echo "📚 Plugin documentation: $PLUGIN_REPO"
echo ""

# Clean up
rm -f "$COMMANDS_FILE"

echo "✅ Script completed!"
echo ""
echo "💡 Tip: You can also run these commands directly in Cursor's chat:"
echo "   /plugin marketplace add $PLUGIN_REPO"
echo "   /plugin install $PLUGIN_NAME"
echo "   /oh-my-claudecode:omc-setup"
