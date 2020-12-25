const {St, Clutter} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;

let panelButton;
let panelButtonText;
let timeout;

function setButtonText()
{
  var [ok, out, err, exit] = GLib.spawn_command_line_sync(
    "date"
  );
  panelButtonText.set_text(out.toString().replace("\n", ""));
  
  // Return true to continue the loop
  return true;
}

function init () 
{
    // Create a Button with "Hello World" text
    panelButton = new St.Bin({
        style_class : "panel-button",
    });
    panelButtonText = new St.Label({
        text : "Hello World",
        y_align: Clutter.ActorAlign.CENTER,
    });
    panelButton.set_child(panelButtonText);
}

function enable () 
{
    // Add the button to the panel
    Main.panel._rightBox.insert_child_at_index(panelButton, 0);
    timeout = Mainloop.timeout_add_seconds(0.1, setButtonText);
}

function disable () 
{
    Mainloop.source_remove(timeout);
    Main.panel._rightBox.remove_child(panelButton);
}
