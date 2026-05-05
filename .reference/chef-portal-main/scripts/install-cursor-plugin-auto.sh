#!/bin/bash

# Enhanced script to automatically install oh-my-claudecode plugin for Cursor
# Attempts to use AppleScript to send commands to Cursor's chat interface

set -e

PLUGIN_REPO="https://github.com/Yeachan-Heo/oh-my-claudecode"
PLUGIN_NAME="oh-my-claudecode"
CURSOR_CLI="/usr/local/bin/cursor"

echo "🚀 Installing oh-my-claudecode plugin for Cursor (Automated)..."
echo ""

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  This automated script requires macOS for AppleScript automation."
    echo "   Falling back to manual instructions..."
    echo ""
    bash "$(dirname "$0")/install-cursor-plugin.sh"
    exit 0
fi

# Check if Cursor CLI exists
if [ ! -f "$CURSOR_CLI" ]; then
    echo "❌ Cursor CLI not found at $CURSOR_CLI"
    echo "Please install Cursor or update the CURSOR_CLI path in this script"
    exit 1
fi

echo "✅ Cursor CLI found"
echo ""

# Commands to execute
COMMANDS=(
    "/plugin marketplace add $PLUGIN_REPO"
    "/plugin install $PLUGIN_NAME"
    "/oh-my-claudecode:omc-setup"
)

# Function to send command to Cursor via AppleScript
send_command_to_cursor() {
    local command="$1"
    
    osascript <<EOF 2>/dev/null || return 1
tell application "Cursor"
    activate
    delay 0.5
end tell

tell application "System Events"
    tell process "Cursor"
        -- Open chat/composer (Cmd+L)
        keystroke "l" using command down
        delay 1
        
        -- Type the command
        keystroke "$command"
        delay 0.5
        
        -- Press Enter to execute
        key code 36
        delay 2
    end tell
end tell
EOF
}

echo "📝 Attempting to automate plugin installation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ensure Cursor is running
if ! pgrep -f "Cursor" > /dev/null; then
    echo "🔧 Opening Cursor..."
    open -a Cursor "$(pwd)" 2>/dev/null || cursor "$(pwd)" 2>/dev/null
    sleep 3
fi

echo "⚠️  Note: Automated execution may not work reliably."
echo "   Cursor's chat interface requires manual interaction in most cases."
echo ""
echo "📋 Commands that will be attempted:"
for i in "${!COMMANDS[@]}"; do
    echo "   $((i+1)). ${COMMANDS[$i]}"
done
echo ""

read -p "Do you want to attempt automated execution? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Manual installation mode:"
    echo ""
    echo "Please run these commands in Cursor's chat interface (Cmd+L):"
    echo ""
    for i in "${!COMMANDS[@]}"; do
        echo "   ${COMMANDS[$i]}"
    done
    echo ""
    exit 0
fi

# Attempt to execute commands
echo "🔄 Attempting to execute commands..."
echo ""

for i in "${!COMMANDS[@]}"; do
    echo "Executing command $((i+1))/${#COMMANDS[@]}: ${COMMANDS[$i]}"
    
    if send_command_to_cursor "${COMMANDS[$i]}"; then
        echo "✅ Command sent successfully"
    else
        echo "❌ Failed to send command automatically"
        echo "   Please run this command manually in Cursor's chat:"
        echo "   ${COMMANDS[$i]}"
    fi
    
    # Wait between commands
    if [ $i -lt $((${#COMMANDS[@]} - 1)) ]; then
        sleep 3
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ Installation process completed!"
echo ""
echo "💡 If automation didn't work, please run these commands manually:"
for i in "${!COMMANDS[@]}"; do
    echo "   ${COMMANDS[$i]}"
done
echo ""
echo "📚 Plugin documentation: $PLUGIN_REPO"
