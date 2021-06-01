
export interface ITask {
    signal?: any;
    exitCode?: number;
    id: string;
    packageIdentifier: string;
    packageVersion: string;
    progress?: number;
    progressReal?: number;
    progressTask?: 'downloading' | 'installing';
    buffer?: any[];
    action?: 'install' | 'uninstall';
}

export interface InstallerSwitches {
    custom: string;
    silent: string;
    silentWithProgress: string;
    log: string;
    installLocation: string;
    interactive: string;
}

export interface Installer {
    architecture: string;
    installerUrl: string;
    installerSha256: string;
    installerType: string;
    installerSwitches: InstallerSwitches;
    productCode: string;
    scope: string;
    installerLocale: string;
    installerSuccessCodes: number[];
    upgradeBehavior: string;
    signatureSha256: string;
    silent: string;
    packageFamilyName: string;
}

export interface IApp {
    Description: string;
    packageImage: string;
    packageIcon: string;
    installedVersion: string;
    task: ITask;

    packageIdentifier: string;
    packageVersion: any;
    packageName: string;
    publisher: string;
    license: string;
    licenseUrl: string;
    moniker: string;
    shortDescription: string;
    packageUrl: string;
    tags: any[];
    installers: Installer[];
    packageLocale: string;
    manifestType: string;
    manifestVersion: string;
    versions: string[];
    installerSwitches: InstallerSwitches;
    defaultLocale: string;
    publisherUrl: string;
    publisherSupportUrl: string;
    author: string;
    copyright: string;
    copyrightUrl: string;
    description: string;
    commands: string[];
    installerType: string;
    privacyUrl: string;
    minimumOSVersion: any;
    installModes: string[];
    fileExtensions: any[];
    protocols: string[];
    tag: string;
    scope: string;
    platform: string[];
    appMoniker: string;
    homepage: string;
    command: string;
    installerSuccessCodes: number[];
    productCode: string;
    installerLocale: string;
}

export interface IPendingApp {
    progress: number;
    action: 'install' | 'uninstall';
}

export interface IInstalledApp {
    packageIdentifier: string;
    version: string;
    sourceDetails?: SourceDetails;
}


export interface Package {
    packageIdentifier: string;
    version: string;
}

export interface SourceDetails {
    argument: string;
    identifier: string;
    name: string;
    type: string;
}

export interface Source {
    packages: Package[];
    sourceDetails: SourceDetails;
}

export interface IInstalledApps {
    $schema: string;
    creationDate: Date;
    sources: Source[];
    winGetVersion: string;
}
