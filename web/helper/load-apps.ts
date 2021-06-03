import axios from "axios"
import * as fs from "fs"
import YAML from 'yaml'
import {customVersionSort} from "./version";
const extract = require('extract-zip')


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

function folderHasYaml(path: string) {
    return fs.readdirSync(path).find(f => f.includes('.yaml'));
}

const apps = [] as any[];

const charFolder = './winget-pkgs-master/manifests';

async function loadApp(config: ILoadAppsConfig, char: string, company: string, ...name: string[]) {
    let folder = `${charFolder}/${char}/${company}/${name.join('/')}`;
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

        // console.log(app);
        apps.push(app);
    }

    for (const r of releases) {
        await loadApp(config, char, company, ...name, r);
    }
}

interface ILoadAppsConfig {
    downloadPackages: boolean;
    fetchIconsAndImages: boolean;
    outputFile?: string;
}

export async function loadApps(config: ILoadAppsConfig) {
    if (config.downloadPackages) {
        console.log('Downloading packages...');
        await downloadPackages();
        console.log('Extracting packages...');
        await extract('packages.zip', {dir: process.cwd()});
        console.log('Done.');
    }

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
                // const char = 'v';
                // const company = 'VideoLAN';
                // const name = 'VLC';
                const char = 'o';
                const company = 'OpenJS';
                const name = 'Nodejs';

                await loadApp(config, char, company, name);

            // }
        // }
    // }

    if (config.outputFile) {
        fs.writeFileSync(config.outputFile, JSON.stringify(apps, null, 4));
    }

    return apps;
}
