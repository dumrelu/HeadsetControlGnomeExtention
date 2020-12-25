const {St, Clutter} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;


// Variables
let drawingArea;
let width = 25;
let height = 25;

// Icon painting function
function onRepaint()
{
    let cr = drawingArea.get_context();

    cr.scale (width, height);

    cr.rectangle(0.0, 0.0, 1.0, 1.0);
    cr.setSourceRGB(0, 255, 0);
    cr.fill();

    // cr.setOperator (Cairo.Operator.OVER);
    // cr.setLineCap (Cairo.LineCap.ROUND);
    // cr.setLineWidth (0.1);

    // cr.translate (0.5, 0.5);
    // cr.setSourceRGB(0,255,0);
    // cr.arc (0, 0, 0.4, 0, Math.PI * 2);
    // cr.stroke ();

    cr.$dispose();
}

function init()
{
    log("Initialized");

    drawingArea = new St.DrawingArea({
        width: width, 
        height: height
    });

    drawingArea.connect("repaint", onRepaint);
}

function enable()
{
    log("Enabled");

    Main.panel._rightBox.insert_child_at_index(drawingArea, 0);
}

function disable()
{
    log("Disable");

    Main.panel._rightBox.remove_child(drawingArea);
}


// let panelButton;
// let panelButtonText;
// let timeout;

// function setButtonText()
// {
//   var [ok, out, err, exit] = GLib.spawn_command_line_sync(
//     "date"
//   );
//   panelButtonText.set_text(out.toString().replace("\n", ""));
  
//   // Return true to continue the loop
//   return true;
// }

// function init () 
// {
//     // Create a Button with "Hello World" text
//     panelButton = new St.Bin({
//         style_class : "panel-button",
//     });
//     panelButtonText = new St.Label({
//         text : "Hello World",
//         y_align: Clutter.ActorAlign.CENTER,
//     });
//     panelButton.set_child(panelButtonText);
// }

// function enable () 
// {
//     // Add the button to the panel
//     Main.panel._rightBox.insert_child_at_index(panelButton, 0);
//     timeout = Mainloop.timeout_add_seconds(1.0, setButtonText);
// }

// function disable () 
// {
//     Mainloop.source_remove(timeout);
//     Main.panel._rightBox.remove_child(panelButton);
// }
