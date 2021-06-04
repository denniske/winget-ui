import {app, ipcMain} from 'electron';
import serve from 'electron-serve';
import {createWindow} from './helpers';
import {ITask} from "../renderer/helper/types";
import * as pty from "node-pty";
import * as path from 'path';
import * as fs from 'fs';
import isAdmin from "is-admin";
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
    serve({directory: 'app'});
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let mainWindow: Electron.BrowserWindow = null;

(async () => {
    await app.whenReady();

    mainWindow = createWindow('main', {
        width: 1000,
        height: 600,
    });
    mainWindow.setMenuBarVisibility(false);

    if (isProd) {
        await mainWindow.loadURL('app://./home.html');
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
        mainWindow.webContents.openDevTools();
    }
})();

app.on('window-all-closed', () => {
    app.quit();
});

ipcMain.handle('winget-task', async (event, task: ITask) => {
    console.log('upgrading ', task.packageIdentifier, task.packageVersion);

    return new Promise((resolve => {
        // let cmd = '';
        // if (task.action === 'uninstall') {
        //     cmd = `winget.exe uninstall ${task.packageIdentifier} -h`;
        // } else {
        //     cmd = `winget.exe install ${task.packageIdentifier} -v ${task.packageVersion} -h`;
        // }

        // const program = process.cwd() + '/resources/elevate/bin.x86-64/elevate.exe';
        // console.log(program);
        //
        // let args = [];
        // if (task.action === 'uninstall') {
        //     args = [`winget.exe`, `uninstall`, `${task.packageIdentifier}`, `-h`];
        // } else {
        //     args = [`winget.exe`, `install`, `${task.packageIdentifier}`, `-v`, `${task.packageVersion}`, `-h`];
        // }
        //
        // args = ['-c', '-w', ...args];


        const program = 'winget.exe';

        let args = [];
        if (task.action === 'uninstall') {
            args = [`uninstall`, `${task.packageIdentifier}`, `-h`];
        } else {
            args = [`install`, `${task.packageIdentifier}`, `-v`, `${task.packageVersion}`, `-h`];
        }

        const ptyProcess = pty.spawn(program, args, {
            name: 'xterm-color',
            cols: 80,
            rows: 24,
            cwd: process.env.HOME,
            env: process.env
        });

        ptyProcess.on('data', (chunk: string) => {
            console.log('sent to browser window');
            event.sender.send('terminal', task, chunk);
        });

        ptyProcess.on('exit', (exitCode: number, signal?: number) => {
            console.log('sent to browser window exit');
            // event.sender.send('terminal-exit', exitCode, signal);
            resolve({ exitCode, signal });
        });
    }));
});

ipcMain.handle('get-installed', async (event, arg) => {
    const {stdout1, stderr1} = await exec('winget export installed.json --include-versions');
    const data = fs.readFileSync('installed.json', 'utf8');
    return data.toString();
});

ipcMain.handle('browser-can-go-back', (event, arg) => {
    return mainWindow.webContents.canGoBack();
});

ipcMain.handle('browser-can-go-forward', (event, arg) => {
    return mainWindow.webContents.canGoForward();
});

ipcMain.handle('app-path', (event, arg) => {
    return JSON.stringify({
        appPath: app.getAppPath(),
        appPathParent: path.dirname(app.getAppPath()),
        appPathParent2: path.dirname(path.dirname(app.getAppPath())),
        cwd: process.cwd(),
        // files: fs.readdirSync(app.getAppPath()),
        // files2: fs.readdirSync('../' + app.getAppPath()),
        // files3: fs.readdirSync('../../' + app.getAppPath()),
        // files4: fs.readdirSync('../../../' + app.getAppPath()),
    });
});

ipcMain.handle('restart-as-admin', (event, arg) => {
    const appPath = app.getAppPath();
    const [all, appHash] = /__([A-Za-z\d]+)/gm.exec(appPath);

    const program = path.dirname(path.dirname(appPath)) + '/resources/elevate/bin.x86-64/elevate.exe';
    let args = [`-c`, `-w`, `explorer`, `shell:AppsFolder\\38000DennisKeil.WingetUI_${appHash}!winget.ui`];

    const ptyProcess = pty.spawn(program, args, {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env
    });

    return true;
});

ipcMain.handle('is-admin', async (event, arg) => {
    return await isAdmin();
});
