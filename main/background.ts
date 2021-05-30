import {app, ipcMain} from 'electron';
import serve from 'electron-serve';
import {createWindow} from './helpers';

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


ipcMain.handle('get-apps', async (event, arg) => {
    // const {stdout, stderr} = await exec('ls');
    const {stdout1, stderr1} = await exec('winget export installed.json --include-versions');
    // const {stdout2, stderr2} = await exec('cat installed.json');

    const data = fs.readFileSync('installed.json', 'utf8');
    console.log(data.toString());

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
