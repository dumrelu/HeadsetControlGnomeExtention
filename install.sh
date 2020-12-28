# Notify the user to install the HeadsetControl program.
echo "Make sure you install the HeadsetControl utility by fallowing the "
echo "instructions in the repo. Also make sure to follow the steps "
echo "under 'Access without root'"
echo ""

# Install the extention
DEST="$HOME/.local/share/gnome-shell/extensions/"
EXTENTION_NAME="HeadsetControlGnomeExtention@dum.relu"

rm -r "$DEST/$EXTENTION_NAME"
cp -r $EXTENTION_NAME $DEST

# Reload gnome shell
killall -SIGQUIT gnome-shell

# Notify user to enable the extention
echo "Extention installed. Please enable it via the Gnome Tweaks app."