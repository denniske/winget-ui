import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import { LogoScrape } from 'logo-scrape';
const extract = require('extract-zip')
var semverSort = require('semver-sort');
import YAML from 'yaml'
import {compare} from "semver";
import semver from "semver/preload";
import {customVersionSort} from "./helper";
import {release} from "os";
import {log} from "util";

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function downloadPackages() {
    const url = 'https://github.com/microsoft/winget-pkgs/archive/refs/heads/master.zip';
    const path = 'packages.zip'
    const writer = fs.createWriteStream(path)

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    });
}

function parseVersion(v: string) {
    const num = v.split(".").length - 1;
    if (num < 2) v += '.0';
    return semver.parse(v);
}

// interface IVersion {
//     version: string;
//     path: string;
// }
//
// function getVersions(path: string): IVersion[] {
//     const versions = [] as IVersion[];
//
//     fs.readdirSync(path).forEach((version: string) => {
//
//         const files = fs.readdirSync(path + '/' + version);
//
//         if (files.find(f => f.includes('.yaml'))) {
//             versions.push({
//                 version: version,
//                 path: path + '/' + version,
//             });
//             return;
//         }
//
//         versions.push(...getVersions(path + '/' + version));
//     });
//
//     return versions;
// }
//
// const versions = getVersions(charFolder + '/' + char + '/' + company + '/' + name);
// const onlyVersions = versions.map(v => v.version);
// const latestVersionStr = sortedVersions[0];
// const latestVersion = versions.find(v => v.version === latestVersionStr);
// const folder = `${latestVersion.path}`;

function folderHasYaml(path: string) {
    return fs.readdirSync(path).find(f => f.includes('.yaml'));
}

const apps = [] as any[];

const charFolder = './winget-pkgs-master/manifests/';

async function loadApp(char: string, company: string, ...name: string[]) {
    let folder = `${charFolder}/${char}/${company}/${name.join('/')}`;

    // console.log();
    console.log(folder);

    const folders = fs.readdirSync(folder);

    const versions = folders.filter(f => folderHasYaml(`${folder}/${f}`));
    const releases = folders.filter(f => !folderHasYaml(`${folder}/${f}`));

    // console.log('versions', versions);
    // console.log('releases', releases);

    if (versions.length > 0) {
        const sortedVersions = customVersionSort(versions, 'desc');
        const latestVersion = sortedVersions[0];
        // console.log(latestVersion);

        folder += `/${latestVersion}`;

        let fileName = `${company}.${name.join('.')}`;

        const appPath = `${folder}/${fileName}.yaml`;
        const appEnUsPath = `${folder}/${fileName}.locale.en-US.yaml`;

        const appYaml = fs.readFileSync(appPath, 'utf8');
        let app = YAML.parse(appYaml);

        const appEnUsYaml = fs.existsSync(appEnUsPath) ? fs.readFileSync(appEnUsPath, 'utf8') : null;
        const appEnUs = appEnUsYaml ? YAML.parse(appEnUsYaml) : null;

        app = Object.assign(
            app,
            appEnUs,
            {
                Versions: versions,
            }
        );

        const targetUrl = app.PackageUrl;

        if (targetUrl && !targetUrl.includes('aegisub') && company !== 'HamsterRepublic') {
            try {
                const urls = [targetUrl];
                const logosResult = await LogoScrape.getLogos(urls) as any[];
                console.log(logosResult);

                if (logosResult.length > 0) {
                    const logosUrls = logosResult[0];

                    if (logosUrls.length > 0) {
                        app.PackageIcon = logosUrls[0].url;
                    }

                    const image = logosUrls.find(l => l.type == 'og:image');
                    if (image) {
                        app.PackageImage = image.url;
                    }
                }
            } catch(e) {
                console.log('error', e);
            }
        }

        // console.log(app);

        apps.push(app);
    }

    for (const r of releases) {
        await loadApp(char, company, ...name, r);
    }
}

async function loadApps() {
    // await downloadPackages();
    // await extract('packages.zip', { dir: process.cwd() });
    // console.log('Extraction complete');

    const fs = require('fs');

    // const char = 'h';

    // console.log(fs.readdirSync(charFolder));
    // return;

    // const chars = ['i',
    //     'j', 'k', 'l', 'm', 'n', 'o',
    //     'p', 'q', 'r', 's', 't', 'u',
    //     'v', 'w', 'x', 'y', 'z'];

    // for (const char of chars) {

    // for (const char of fs.readdirSync(charFolder)) {
    //     for (const company of fs.readdirSync(charFolder + '/' + char)) {
    //         for (const name of fs.readdirSync(charFolder + '/' + char + '/' + company)) {

                // const char = 'z';
                // const company = 'Zoom';
                // const name = 'Zoom';
                // const char = 'a';
                // const company = 'AdoptOpenJDK';
                // const name = 'OpenJDK';
                // const char = 'j';
                // const company = 'JetBrains';
                // const name = 'DataGrip';
                // const char = 'm';
                // const company = 'Microsoft';
                // const name = 'VisualStudio';
                // const char = 'v';
                // const company = 'VivaldiTechnologies';
                // const name = 'Vivaldi';
                const char = 'v';
                const company = 'VideoLAN';
                const name = 'VLC';

                await loadApp(char, company, name);

            // }
        // }
    // }

    fs.writeFileSync('apps.json', JSON.stringify(apps, null, 4));
}

loadApps();
