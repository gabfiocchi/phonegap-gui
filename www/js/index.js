var gui = require('nw.gui');
var win = gui.Window.get();   

// load file system module
var fs = require("fs");
var gaze = require("gaze");
var opener = require("opener"); 
var jsxml= require("node-jsxml");

var Namespace = jsxml.Namespace,
    QName = jsxml.QName,
    XML = jsxml.XML,
    XMLList = jsxml.XMLList;

win.setResizable(false);


// valid return values: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
if (process.platform == 'darwin') {

    var menubar = new gui.Menu({'type':'menubar'});
    var file = new gui.Menu();
    var help = new gui.Menu();

    menubar.createMacBuiltin("PhoneGap", {hideEdit:true,hideWindow:true});

    win.menu = menubar;
    win.menu.append(new gui.MenuItem({ label: 'File', submenu: file }));

    // add menuItems for the File option
    menubar.items[menubar.items.length-1].submenu.append(new gui.MenuItem({
   	    label: "New Project",
   	    click: function () {
		    console.log("new project from menubar");
		    resetMinusButtonState();
		    // create a new project
            animateAddNewProjectOverlayEntry();
   	    }
    }));
    
    menubar.items[menubar.items.length-1].submenu.append(new gui.MenuItem({
   	    label: "Open Project",
   	    click: function () {
      	    console.log("open project from menubar");
      	    resetMinusButtonState();
		    // open an existing project
		    openProject();
   	    }
    }));

    win.menu.append(new gui.MenuItem({ label: 'Help', submenu: help }));

    // add menuItems for the Help option
    menubar.items[menubar.items.length-1].submenu.append(new gui.MenuItem({
   	    label: "Tutorials",
   	    click: function () {
   	        openTutorials();
   	    }
    }));

    menubar.items[menubar.items.length-1].submenu.append(new gui.MenuItem({
   	    label: "Report Issue",
   	    click: function () {
   	        openIssueTracker();
   	    }
    }));

    console.log("menubar items: " + win.menu.items.length);

}

win.show();    

win.on("close", function () {
	console.log("window close handler");
	
    if (global.isServerRunning) {
        // if server is currently running, stop it before opening a new server instance
        setServerOffline();
    } else {
        localStorage.projDir = "";
        win.close(true);
    }
	
	global.server.on("close", function(e) {
	    localStorage.projDir = "";
	    win.close(true);
	});
});
