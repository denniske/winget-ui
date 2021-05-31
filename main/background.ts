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

(async () => {
    await app.whenReady();

    const mainWindow = createWindow('main', {
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
var fs = require('fs');


ipcMain.handle('winget-upgrade', async (event, app: IApp) => {
    console.log('upgrading ', app.PackageIdentifier, app.PackageVersion);
    // return 'test';
    // const {stdout1, stderr1} = await exec(`winget upgrade ${arg}`);
    const {stdout1, stderr1} = await exec(`winget install ${app.PackageIdentifier} -v ${app.PackageVersion} -h`);
    console.log(stdout1);
    return stdout1;
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
