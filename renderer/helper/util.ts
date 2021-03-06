import {IApp} from "./types";

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function toCamelCase(key, value) {
    if (value && typeof value === 'object') {
        for (var k in value) {
            if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
                value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
                delete value[k];
            }
        }
    }
    return value;
}

export function isElectron() {
    return eval('typeof require !== "undefined" && typeof require("electron") === "object"');
}

export function getElectron() {
    return eval(`require('electron')`);
}

export function openLink(url: string) {
    if (isElectron()) {
        getElectron().shell.openExternal(url);
    } else {
        window.open(url, '_blank');
    }
}

export function filterApps(apps: IApp[], search: string) {
    const parts = search.toLowerCase().split(' ');
    return apps.filter(m => {
        return parts.every(part =>
            m.packageName.toLowerCase().indexOf(part) >= 0 ||
            m.publisher.toLowerCase().indexOf(part) >= 0);
    });
}

export function fixPackageIcon(app: IApp) {

    const fallbackIcons = {
        "Spotify.Spotify": "spotify.webp",
        "Discord.Discord": "discord.webp",
        "Microsoft.VisualStudioCode": "code.webp",
        "Microsoft.VisualStudioCode.Insiders": "code-insiders.webp",
        "Google.Chrome": "chrome.webp",
        "Mozilla.Firefox": "firefox.webp",
        "Notion.Notion": "notion.webp",
        "Python.Python": "python.webp",
        "WhatsApp.WhatsApp": "whatsapp.webp",
        "Zoom.Zoom": "zoom.webp",
        "Dropbox.Dropbox": "dropbox.webp",
        "Notepad++.Notepad++": "npp.webp",
        "OpenJS.NodeJS": "node.webp",
        "OBSProject.OBSStudio": "obs.webp",
        "Microsoft.Edge": "edge.webp",
        "Microsoft.Teams": "teams.webp",
        "Microsoft.WindowsTerminal": "terminal.webp",
        "File-New-Project.EarTrumpet": "trumpet.webp",
        "MehediHassan.Tweeten": "tweeten.webp",
        "ShareX.ShareX": "sharex.webp",
    };

    if (fallbackIcons[app.packageIdentifier]) {
        return '/apps/' + fallbackIcons[app.packageIdentifier];
    }

    if (app.packageIcon === 'favicon.ico') {
        const url = new URL(app.packageUrl);
        return url.protocol + '//' + url.host + '/favicon.ico';
    }

    // const httpIndex = url.indexOf('//');
    // let index = url.indexOf('///', httpIndex+2);
    // if (index >= 0) {
    //     // console.log('fixPackageIcon', url);
    //     return url.substr(0, httpIndex+2) + url.substr(index+3);
    // }

    return app.packageIcon;
}
