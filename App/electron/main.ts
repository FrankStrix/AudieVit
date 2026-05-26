import { app, BrowserWindow } from 'electron'
import * as path from 'node:path'

function createWindow () {
  const win = new BrowserWindow({
    width: 950,
    height: 600,

    titleBarStyle: 'hidden',        // Nasconde la barra del titolo
    titleBarOverlay: false,         // Disabilita i bottoni di chiusura, minimizzazione e massimizzazione

    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.js')
    }
  })


  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(import.meta.dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})