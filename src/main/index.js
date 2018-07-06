import {app, BrowserWindow, Menu, ipcMain, dialog} from "electron";
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
	global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\");
}

ipcMain.on("open-save-file-dialog", function (event) {
	dialog.showOpenDialog({
		properties: ["openDirectory"]
	}, function (files) {
		if (files) event.sender.send("selected-directory", files);
	});
});

ipcMain.on("open-file-dialog", function (event) {
	dialog.showOpenDialog({
		properties: ["openFile"]
	}, function (files) {
		if (files) event.sender.send("selected-file", files);
	});
});

ipcMain.on("export-test-file-dialog", function (event) {
	dialog.showOpenDialog({
		properties: ["openDirectory"]
	}, function (path) {
		if (path) event.sender.send("selected-export-directory", path);
	});
});

let mainWindow;
const winURL = process.env.NODE_ENV === "development"
	? "http://localhost:9080"
	: `file://${__dirname}/index.html`;

function createWindow () {
	/**
   * Initial window options
   */
	mainWindow = new BrowserWindow({
		height: 563,
		useContentSize: true,
		width: 1000
	});

	mainWindow.loadURL(winURL);

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
	if (process.platform === "darwin") {
		const template = [{
			label: "Application",
			submenu: [
				{label: "About Application", selector: "orderFrontStandardAboutPanel:"},
				{type: "separator"},
				{
					label: "Quit",
					accelerator: "Command+Q",
					click: function () {
						app.quit();
					}
				}
			]
		}, {
			label: "Edit",
			submenu: [
				{label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"},
				{label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
				{type: "separator"},
				{label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
				{label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
				{label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"},
				{label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:"}
			]
		}
		];

		Menu.setApplicationMenu(Menu.buildFromTemplate(template));
	}
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
