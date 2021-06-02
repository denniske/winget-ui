import {ipcRenderer} from "electron";

export async function browserCanGoBack() {
    return true;
}

export async function browserCanGoForward() {
    return true;
}

// export async function browserCanGoBack() {
//     return await ipcRenderer.invoke('browser-can-go-back');
// }

// export async function browserCanGoForward() {
//     return await ipcRenderer.invoke('browser-can-go-forward');
// }

