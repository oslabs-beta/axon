import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import * as url from "url";
import * as path from "path";


const createWindow = (): void => {
    let currentWindow = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true
      }
    });
    console.log(isDev);
    // win.loadURL(
    //   isDev
    //     ? 'http://localhost:9000'
    //     : `file://${app.getAppPath()}/index.html`,
    // );
    if (process.env.NODE_ENV === "development") {
      currentWindow.loadURL("http://localhost:9000");
      currentWindow.webContents.openDevTools();
    }
    // otherwise, serve the compile dist folder for render
    else {
      currentWindow.loadURL(
        // tried implementing WhatWG URL, it's current non-functional, see dicussion reference for more details.
        // https://github.com/nodejs/node/issues/25099
        url.format({
          // allow electron to render a file (html), in our dist folder
          pathname: path.resolve(__dirname, "../dist/index.html"),
          // set type
          protocol: "file:",
          // allow for propper formating of directory name.
          slashes: true,
        })
      );
    }
  }
  

  app.on('ready', createWindow);
