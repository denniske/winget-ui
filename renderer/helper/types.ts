export interface InstallerSwitches {
    Custom: string;
    Silent: string;
    SilentWithProgress: string;
    Log: string;
    InstallLocation: string;
    Interactive: string;
}

export interface Installer {
    Architecture: string;
    InstallerUrl: string;
    InstallerSha256: string;
    InstallerType: string;
    InstallerSwitches: InstallerSwitches;
    ProductCode: string;
    Scope: string;
    InstallerLocale: string;
    InstallerSuccessCodes: number[];
    UpgradeBehavior: string;
    SignatureSha256: string;
    Silent: string;
    PackageFamilyName: string;
}

export interface IApp {
    InstalledVersion: string;
    PackageIdentifier: string;
    PackageVersion: any;
    PackageName: string;
    Publisher: string;
    License: string;
    LicenseUrl: string;
    Moniker: string;
    ShortDescription: string;
    PackageUrl: string;
    Tags: any[];
    Installers: Installer[];
    PackageLocale: string;
    ManifestType: string;
    ManifestVersion: string;
    Versions: string[];
    InstallerSwitches: InstallerSwitches;
    DefaultLocale: string;
    PublisherUrl: string;
    PublisherSupportUrl: string;
    Author: string;
    Copyright: string;
    CopyrightUrl: string;
    Description: string;
    Commands: string[];
    InstallerType: string;
    PrivacyUrl: string;
    MinimumOSVersion: any;
    InstallModes: string[];
    FileExtensions: any[];
    Protocols: string[];
    Tag: string;
    Scope: string;
    Platform: string[];
    AppMoniker: string;
    Homepage: string;
    Command: string;
    InstallerSuccessCodes: number[];
    ProductCode: string;
    InstallerLocale: string;
}





export interface Package {
    PackageIdentifier: string;
    Version: string;
}

export interface SourceDetails {
    Argument: string;
    Identifier: string;
    Name: string;
    Type: string;
}

export interface Source {
    Packages: Package[];
    SourceDetails: SourceDetails;
}

export interface IInstalledApps {
    $schema: string;
    CreationDate: Date;
    Sources: Source[];
    WinGetVersion: string;
}
