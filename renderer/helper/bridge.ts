// import {ipcRenderer} from "electron";
import {ipcRendererMock} from "./ipc-renderer-mock";

ipcRendererMock.fake('browser-can-go-back', async () => true);
ipcRendererMock.fake('browser-can-go-forward', async () => false);

ipcRendererMock.fake('winget-upgrade', async () => {



    return { exitCode: 0, signal: null };
});

export const ipcRenderer = ipcRendererMock;

// export async function browserCanGoBack() {
//     return true;
// }
//
// export async function browserCanGoForward() {
//     return true;
// }

// export async function browserCanGoBack() {
//     return await ipcRenderer.invoke('browser-can-go-back');
// }

// export async function browserCanGoForward() {
//     return await ipcRenderer.invoke('browser-can-go-forward');
// }

