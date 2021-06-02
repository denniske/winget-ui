// export { ipcRenderer } from "electron";

import {sleep} from "./util";

const taskFailed = {"id":"0","packageIdentifier":"Microsoft.VisualStudioCode","packageVersion":"1.56.2","buffer":["\u001b[2J\u001b[m\u001b[H\u001b]0;C:\\Program Files\\WindowsApps\\Microsoft.DesktopAppInstaller_1.11.11451.0_x64__8wekyb3d8bbwe\\AppInstallerCLI.exe\u0007\u001b[?25h","\u001b[?25l","\u001b[?25h","Gefunden","\u001b[25l\u001b[94m\u001b[m\u001b[HGefunden \u001b[96mVisual Studio Code\u001b[m [\u001b[96mMicrosoft.VisualStudioCode\u001b[m]\u001b[K\r\nDiese Anwendung wird von ihrem Besitzer an Sie lizenziert.\u001b[K\r\nMicrosoft ist nicht verantwortlich und erteilt keine Lizenzen für Pakete von Dri\r\nttanbietern.\u001b[K\r\nDownloading \u001b[94mhttps://az764295.vo.msecnd.net/stable/054a9295330880ed74ceaedda23625\r\n3b4f39a335/VSCodeUserSetup-x64-1.56.2.exe\u001b[m\u001b[K\u001b[39C","\u001b]9;4;3;0\u001b\\\u001b[94m\r\n   ","\u001b[38;2;76;74;72m\b-","\b\\","\b ","\u001b]9;4;0;0\u001b\\\u001b]9;4;1;0\u001b\\\u001b[m\u001b[38;2;76;74;72m\r  \u001b[38;2;25;24;24m██████████████████████████████\u001b[m  0.00 B / 76.3 MB","\r  ","\u001b]9;4;1;13\u001b\\\u001b[38;2;76;74;72m███\u001b[38;2;25;24;24m███████████████████████████\u001b[m  10.0 MB / 76.3 MB","\r  ","\u001b]9;4;1;29\u001b\\\u001b[38;2;76;74;72m████████\u001b[38;2;25;24;24m██████████████████████\u001b[m  22.3 MB / 76.3 MB","\r  ","\u001b]9;4;1;46\u001b\\\u001b[38;2;76;74;72m█████████████\u001b[38;2;25;24;24m█████████████████\u001b[m  35.3 MB / 76.3 MB","\r  ","\u001b]9;4;1;62\u001b\\\u001b[38;2;76;74;72m██████████████████\u001b[38;2;25;24;24m████████████\u001b[m  47.3 MB / 76.3 MB","\r  ","\u001b]9;4;1;79\u001b\\\u001b[38;2;76;74;72m███████████████████████\u001b[38;2;25;24;24m███████\u001b[m  60.3 MB / 76.3 MB","\r  ","\u001b]9;4;1;96\u001b\\\u001b[38;2;76;74;72m████████████████████████████\u001b[38;2;25;24;24m██\u001b[m  73.3 MB / 76.3 MB","\r  ","\u001b]9;4;1;100\u001b\\\u001b[38;2;76;74;72m██████████████████████████████\u001b[m  76.3 MB / 76.3 MB","\u001b]9;4;0;0\u001b\\\r\nDer Installer-Hash wurde erfolgreich überprüft","\u001b]9;4;3;0\u001b\\\r\n   ","\u001b[38;2;76;74;72m\b-","\b ","\u001b]9;4;0;0\u001b\\\r\u001b[?25h","\u001b[mPaketinstallation wird gestartet...\u001b[?25l","\u001b]9;4;3;0\u001b\\\r\n   ","\u001b[38;2;76;74;72m\b-","\b\\","\b|","\b/","\b-","\b\\","\b|","\b/","\b-","\b\\","\b|","\b/","\b-","\b\\","\b|","\b/","\b ","\u001b]9;4;0;0\u001b\\\u001b[m\u001b[91m\rInstaller failed with exit code: 1\u001b[m\u001b[K\r\nInstaller log is available at: C:\\Users\\Dennis\\AppData\\Local\\Packages\\Microsoft.\r\nDesktopAppInstaller_8wekyb3d8bbwe\\LocalState\\DiagOutputDir\\WinGet-Microsoft.Visu\r\nalStudioCode.1.56.2-2021-06-02-15-35-30.424.log\u001b[K\r\n\u001b[?25h"],"progressTask":"installing","progress":-1,"progressReal":1,"exitCode":2316632070};
const taskSuccess = {"id":"0","packageIdentifier":"VivaldiTechnologies.Vivaldi","packageVersion":"3.8.2259.42","buffer":["\u001b[2J\u001b[m\u001b[H\u001b]0;C:\\Program Files\\WindowsApps\\Microsoft.DesktopAppInstaller_1.11.11451.0_x64__8wekyb3d8bbwe\\AppInstallerCLI.exe\u0007\u001b[?25h","\u001b[?25l","\u001b[?25h","Gefunden","\u001b[25l\u001b[94m\u001b[m\u001b[HGefunden \u001b[96mVivaldi\u001b[m [\u001b[96mVivaldiTechnologies.Vivaldi\u001b[m]\u001b[K\r\nDiese Anwendung wird von ihrem Besitzer an Sie lizenziert.\u001b[K\r\nMicrosoft ist nicht verantwortlich und erteilt keine Lizenzen für Pakete von Dri\r\nttanbietern.\u001b[K\r\nDownloading \u001b[94mhttps://downloads.vivaldi.com/stable/Vivaldi.3.8.2259.42.x64.exe\u001b[m    ","\u001b]9;4;3;0\u001b\\\u001b[94m\r\n   ","\u001b[38;2;76;74;72m\b-","\b\\","\b|","\b ","\u001b]9;4;0;0\u001b\\\u001b]9;4;1;0\u001b\\\u001b[m\u001b[38;2;76;74;72m\r  \u001b[38;2;25;24;24m██████████████████████████████\u001b[m  0.00 B / 73.1 MB","\r  ","\u001b]9;4;1;15\u001b\\\u001b[38;2;76;74;72m████\u001b[38;2;25;24;24m██████████████████████████\u001b[m  11.1 MB / 73.1 MB","\r  ","\u001b]9;4;1;33\u001b\\\u001b[38;2;76;74;72m█████████\u001b[38;2;25;24;24m█████████████████████\u001b[m  24.1 MB / 73.1 MB","\r  ","\u001b]9;4;1;49\u001b\\\u001b[38;2;76;74;72m██████████████\u001b[38;2;25;24;24m████████████████\u001b[m  36.1 MB / 73.1 MB","\r  ","\u001b]9;4;1;68\u001b\\\u001b[38;2;76;74;72m████████████████████\u001b[38;2;25;24;24m██████████\u001b[m  50.1 MB / 73.1 MB","\r  ","\u001b]9;4;1;86\u001b\\\u001b[38;2;76;74;72m█████████████████████████\u001b[38;2;25;24;24m█████\u001b[m  63.1 MB / 73.1 MB","\r  ","\u001b]9;4;1;100\u001b\\\u001b[38;2;76;74;72m██████████████████████████████\u001b[m  73.1 MB / 73.1 MB","\u001b]9;4;0;0\u001b\\\r\nDer Installer-Hash wurde erfolgreich überprüft","\u001b]9;4;3;0\u001b\\\r\n   ","\u001b[38;2;76;74;72m\b-","\b ","\u001b]9;4;0;0\u001b\\\r\u001b[?25h","\u001b[mPaketinstallation wird gestartet...\u001b[?25l","\u001b]9;4;3;0\u001b\\\r\n   ","\u001b[38;2;76;74;72m\b-","\b\\","\b|","\b/","\b-","\b\\","\b|","\b/","\b-","\b\\","\b|","\b/","\b-","\b\\","\b|","\b/","\b-","\b\\","\b|","\b/","\b-","\b\\","\b|","\b/","\b-","\b\\","\b|","\b/","\b-","\b ","\u001b]9;4;0;0\u001b\\\u001b[m\rErfolgreich installiert","\u001b]9;4;3;0\u001b\\\r\n   ","\u001b[38;2;76;74;72m\b-","\b ","\u001b]9;4;0;0\u001b\\\r\u001b[?25h","\u001b[m"],"progressTask":"installing","progress":-1,"progressReal":1,"exitCode":0};

import {ipcRendererMock} from "./ipc-renderer-mock";
import {ITask} from "./types";

ipcRendererMock.fake('browser-can-go-back', async () => true);
ipcRendererMock.fake('browser-can-go-forward', async () => false);

ipcRendererMock.fake('winget-upgrade', async (sentTask: ITask) => {
    const task = {
        // ...taskFailed,
        ...taskSuccess,
        id: sentTask.id,
    };

    for (const data of task.buffer) {
        ipcRendererMock.send('terminal', task, data);
        await sleep(250);
    }

    return { exitCode: task.exitCode, signal: null };
});

export const ipcRenderer = ipcRendererMock;
