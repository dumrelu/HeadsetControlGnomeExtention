const {St, Clutter} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;

/*
    TODO: 
        v Will most likely also need a label for the current battery percentage.
        v Notification when battery level is low
        v Battery color
        v Only show notification once
        v hedset not connected icon
        - Real battery level computeation
*/

// Constants
const iconWidth = Main.panel.height;
const iconHeight = Main.panel.height;

const lowBatteryNotificationEnabled = false;

const lowBatteryThreshold = 0.15;
const mediumBatteryThreshold = 0.35;

const batteryDisconnectedColor = [128, 128, 128];
const highBatteryLevelColor = [0, 255, 0];
const mediumBatteryLevelColor = [255, 165, 0];
const lowBatteryLevelColor = [255, 0, 0];

// Variables
let container;
let drawingArea;
let label;
let timeout;
let batteryLevel = -1.0;        // Negative battery level indicates the headset is disconnected
let lowBatteryNotificationSent;

// Icon painting function
function onRepaint()
{
    // Obtain a context and scale so that we draw everything 
    //in the [0.0, 1.0] coordinate system
    let cr = drawingArea.get_context();
    cr.scale(iconWidth, iconHeight);

    // Constants used to draw the battery
    let bWidth = 0.4;       // Battery width
    let bWidthHalf = bWidth / 2.0;
    let bHeight = 0.6;      // Battery height
    let bHeightHalf = bHeight / 2.0;
    let gSize = 0.2;        // Size of the top "peak" of the battery
    let gSizeHalf = gSize / 2.0;

    let bX = 0.5 - (bWidth / 2.0);  //Left battery x
    let bY = 0.5 + (bHeight / 2.0); //Lower battery y

    // Set the battery color
    let color = [];
    if(batteryLevel < 0.0)
    {
        color = batteryDisconnectedColor;
    }
    else if(batteryLevel <= lowBatteryThreshold)
    {
        color = lowBatteryLevelColor;
    }
    else if(batteryLevel <= mediumBatteryThreshold)
    {
        color = mediumBatteryLevelColor;
    }
    else
    {
        color = highBatteryLevelColor;
    }
    let [r,g,b] = color;
    cr.setSourceRGB(r, g, b);

    // Draw the battery outline
    cr.moveTo(bX, bY);
    cr.lineTo(bX + bWidth, bY);
    cr.lineTo(bX + bWidth, bY - bHeight);
    cr.lineTo(bX + bWidth - (bWidthHalf - gSizeHalf), bY - bHeight);
    cr.lineTo(bX + bWidth - (bWidthHalf - gSizeHalf), bY - bHeight - gSizeHalf);
    cr.lineTo(bX + (bWidthHalf - gSizeHalf), bY - bHeight - gSizeHalf);
    cr.lineTo(bX + (bWidthHalf - gSizeHalf), bY - bHeight);
    cr.lineTo(bX, bY - bHeight);
    cr.lineTo(bX, bY);

    cr.setLineWidth(0.05);
    cr.stroke();

    // Draw the fill percentage
    if(batteryLevel >= 0.0)
    {
        cr.rectangle(bX, bY, bWidth, -bHeight * batteryLevel);
        cr.setLineWidth(0.4);
        cr.fill();
    }


    cr.$dispose();
}

// Called at a given interval to update the battery percentage
function updateBatteryPercentage()
{
    //TODO: call the hetsetcontrol utility

    // Dummy code - extract in another function
    batteryLevel -= 0.1;
    if(batteryLevel <= -0.3)
    {
        batteryLevel = 1.0;
    }

    // Update the label
    if( batteryLevel >= 0.0) 
    {
        label.text = Math.round(batteryLevel * 100) + "%";
    }
    else
    {
        label.text = "N/A";
    }

    // Clear notification flag if battery is not low
    if(batteryLevel > lowBatteryThreshold)
    {
        lowBatteryNotificationSent = false;
    }

    // Notify the user that the battery level is low and
    //to probably plug it in.
    if(lowBatteryNotificationEnabled && !lowBatteryNotificationSent 
        && batteryLevel >= 0.0 && batteryLevel <= lowBatteryThreshold)
    {
        Main.notify("Low battery", "Lowe battery(" + label.text + "). Please plug headphones.");
        lowBatteryNotificationSent = true;
    }

    // Schedule a repain of the icon
    drawingArea.queue_repaint();

    // Continue the loop
    return true;
}

function init()
{
    container = new St.BoxLayout({});

    drawingArea = new St.DrawingArea({
        width: iconWidth, 
        height: iconHeight
    });
    drawingArea.connect("repaint", onRepaint);
    container.add_child(drawingArea);

    label = new St.Label({
        text : "0%",
        y_align: Clutter.ActorAlign.CENTER,
    });
    container.add_child(label);

    // Compute the initial value of the battery percentage
    updateBatteryPercentage();
}

function enable()
{
    lowBatteryNotificationSent = false;
    Main.panel._rightBox.insert_child_at_index(container, 0);
    timeout = Mainloop.timeout_add_seconds(1.0, updateBatteryPercentage);
}

function disable()
{
    Mainloop.source_remove(timeout);
    Main.panel._rightBox.remove_child(container);
}