const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("path");
const net = require("net");

const isDev = !app.isPackaged;
const APP_ROOT = isDev ? path.join(__dirname, "..") : path.join(process.resourcesPath, "app");

let mainWindow = null;
let nextApp = null;
let httpServer = null;

function findFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function startNextServer() {
  const port = await findFreePort();
  process.env.NODE_ENV = "production";
  process.env.PORT = String(port);

  process.chdir(APP_ROOT);

  const nextModule = require(path.join(APP_ROOT, "node_modules", "next"));
  const next = nextModule.default || nextModule;
  const { createServer } = require("http");

  nextApp = next({
    dev: false,
    dir: APP_ROOT,
    hostname: "127.0.0.1",
    port,
  });

  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();

  await new Promise((resolve, reject) => {
    httpServer = createServer((req, res) => handle(req, res));
    httpServer.on("error", reject);
    httpServer.listen(port, "127.0.0.1", resolve);
  });

  return `http://127.0.0.1:${port}`;
}

function createWindow(url) {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#000000",
    autoHideMenuBar: true,
    title: "Interactive Digital Thorana",
    icon: path.join(APP_ROOT, "build", "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
    },
    show: false,
  });

  Menu.setApplicationMenu(null);

  mainWindow.webContents.setWindowOpenHandler(({ url: openUrl }) => {
    if (openUrl.startsWith("http://") || openUrl.startsWith("https://")) {
      shell.openExternal(openUrl);
    }
    return { action: "deny" };
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => { mainWindow = null; });

  mainWindow.loadURL(url);
}

async function bootstrap() {
  try {
    const url = await startNextServer();
    createWindow(url);
  } catch (err) {
    dialog.showErrorBox(
      "Failed to start Vesak Thorana",
      String(err && err.stack ? err.stack : err)
    );
    app.quit();
  }
}

app.whenReady().then(bootstrap);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0 && mainWindow === null) {
    bootstrap();
  }
});

app.on("before-quit", () => {
  try { if (httpServer) httpServer.close(); } catch (_) {}
  try { if (nextApp && typeof nextApp.close === "function") nextApp.close(); } catch (_) {}
});
