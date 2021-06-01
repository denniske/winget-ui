import {app, ipcMain} from 'electron';
import serve from 'electron-serve';
import {createWindow} from './helpers';
import {IApp} from "../renderer/helper/types";

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


const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
import * as pty from "node-pty";
const {spawn} = require('child_process');

const shellArgs = ['--login', '/k', 'C:\\Portable\\Cmder\\vendor\\init.bat'];

const env = {
    ...(process.env as any),
    ConEmuDir: 'C:\\Portable\\Cmder\\vendor\\conemu-maximus5',
};

// const shell = ''; // cmd.exe
// const ptyProcess = pty.spawn(shell, shellArgs, {
//     name: 'xterm-color',
//     // cols: 10000,
//     // rows: 200,
//     cols: 80,
//     rows: 24,
//     cwd: process.env.HOME,
//     // env: process.env
//     // cwd: PROJECT_DIR, // process.env.HOME,
//     env: env,
// });
//
// ptyProcess.on('data', (chunk: string) => {
//     // console.log('data', chunk);
//     console.log('sent to browser window');
//     mainWindow.webContents.send('terminal', chunk);
// });
//
// ipcMain.handle('pty', async (event, data: any) => {
//     console.log('sent to terminal');
//     ptyProcess.write(data);
// })

ipcMain.handle('winget-upgrade', async (event, app: IApp) => {
    console.log('upgrading ', app.packageIdentifier, app.packageVersion);
    // ptyProcess.write(`winget install ${app.PackageIdentifier} -v ${app.PackageVersion} -h` + '\n');


    return new Promise((resolve => {
        const program = 'winget.exe';
        const args = [`install`, `${app.packageIdentifier}`, `-v`, `${app.packageVersion}`, `-h`];

        const ptyProcess = pty.spawn(program, args, {
            name: 'xterm-color',
            cols: 80,
            rows: 24,
            cwd: process.env.HOME,
            env: process.env
        });

        ptyProcess.on('data', (chunk: string) => {
            console.log('sent to browser window');
            event.sender.send('terminal', chunk);
        });

        ptyProcess.on('exit', (exitCode: number, signal?: number) => {
            console.log('sent to browser window exit');
            // event.sender.send('terminal-exit', exitCode, signal);
            resolve({ exitCode, signal });
        });

    }));


    // const child = spawn(program, args);
    //
    // child.stdout.setEncoding('utf8');
    // child.stdout.on('data', (chunk) => {
    //     console.log('data', chunk);
    //
    //     event.sender.send('terminal', chunk);
    //     // data from standard output is here as buffers
    // });
    //
    // // since these are streams, you can pipe them elsewhere
    // // child.stderr.pipe(dest);
    //
    // child.on('close', (code) => {
    //     console.log(`child process exited with code ${code}`);
    // });

    // return 'test';

    // const {stdout1, stderr1} = await exec(`winget install ${app.PackageIdentifier} -v ${app.PackageVersion} -h`);
    // console.log(stdout1);
    // return stdout1;
});

ipcMain.handle('get-installed', async (event, arg) => {
    const {stdout1, stderr1} = await exec('winget export installed.json --include-versions');
    const data = fs.readFileSync('installed.json', 'utf8');
    // console.log(data.toString());
    return data.toString();
});

ipcMain.handle('get-apps', async (event, arg) => {
    const data = fs.readFileSync('main/data/apps.json', 'utf8');
    return data.toString();
});

// ipcMain.handle('get-apps', async (event, arg) => {
//
//   return new Promise(async (resolve) => {
//     const { stdout, stderr } = await exec('ls');
//     resolve(stdout);
//   });
// });

//
// ipcMain.handle('get-apps', async (event, arg) => {
//
//   const { spawn } = require('child_process');
//   const child = spawn('ls', ['-lh', '.']);
//
//   child.stdout.setEncoding('utf8');
//   child.stdout.on('data', (chunk) => {
//     console.log('data', chunk);
//     // data from standard output is here as buffers
//   });
//
//   // since these are streams, you can pipe them elsewhere
//   // child.stderr.pipe(dest);
//
//   child.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
//   });
//
//   return 'test123';
// });
//
