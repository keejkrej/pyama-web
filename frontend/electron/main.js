const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startPythonBackend() {
  const pythonCommands = ['python3', 'python', 'python3.13', 'python3.12', 'python3.11'];
  const backendPath = path.join(__dirname, '../../backend/main.py');
  
  for (const cmd of pythonCommands) {
    try {
      pythonProcess = spawn(cmd, [backendPath], {
        cwd: path.join(__dirname, '../../backend'),
        env: { ...process.env, PYTHONUNBUFFERED: '1' }
      });

      pythonProcess.stdout.on('data', (data) => {
        console.log(`Python backend: ${data}`);
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python backend error: ${data}`);
      });

      pythonProcess.on('error', (error) => {
        console.error('Failed to start Python backend:', error);
        pythonProcess = null;
      });

      pythonProcess.on('exit', (code) => {
        console.log(`Python backend exited with code ${code}`);
        pythonProcess = null;
      });

      // If we get here, the process started successfully
      console.log(`Started Python backend with ${cmd}`);
      break;
    } catch (error) {
      console.error(`Failed to start with ${cmd}:`, error);
      continue;
    }
  }

  if (!pythonProcess) {
    console.error('Failed to start Python backend with any Python command');
  }
}

function stopPythonBackend() {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
  }
}

app.whenReady().then(() => {
  startPythonBackend();
  
  // Wait a bit for the backend to start
  setTimeout(() => {
    createWindow();
  }, 2000);
});

app.on('window-all-closed', () => {
  stopPythonBackend();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopPythonBackend();
});