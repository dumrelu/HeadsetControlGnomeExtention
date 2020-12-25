# TODO: install hedset control(and possibly make it so no sudo required)

# Install the extention
DEST="$HOME/.local/share/gnome-shell/extensions/"
EXTENTION_NAME="HeadsetControlGnomeExtention@dum.relu"

rm -r "$DEST/$EXTENTION_NAME"
cp -r $EXTENTION_NAME $DEST

# Reload gnome shell
killall -SIGQUIT gnome-shell

# Notify user to enable the extention
