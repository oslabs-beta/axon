import { app, BrowserWindow } from 'electron';
import * as url from 'url';
import * as path from 'path';

// Define the function that will open a new window
const createWindow = (): void => {
  // Generate an instance of a BrowserWindow
  const currentWindow = new BrowserWindow({
    width: 1300,
    height: 950,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // When in a development environment, serve the local server to electron
  if (process.env.NODE_ENV === 'development') {
    currentWindow.loadURL('http://localhost:9000');
    currentWindow.webContents.openDevTools();
  }
  // When in a production environment, serve the compiled dist folder for rendering
  else {
    currentWindow.loadURL(
      url.format({
        // Make Electron to render a file (html), in our dist folder
        pathname: path.resolve(__dirname, '../dist/index.html'),
        // Set the type
        protocol: 'file:',
        // Format the directory name appropriately 
        slashes: true,
      }),
    );
  }
};

app.on('ready', createWindow);
