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

export interface InstalledApps {
    $schema: string;
    CreationDate: Date;
    Sources: Source[];
    WinGetVersion: string;
}
