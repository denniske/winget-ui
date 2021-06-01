import {IApp, IInstalledApp, IPendingApp} from "../helper/types";


export function selectLocalApps(state: AppState) {

    return state.installedApps.map(installedApp => {
        // if (!apps.find(a => a.packageIdentifier === p.packageIdentifier)) {
        //     console.log('not found', p.packageIdentifier);
        // }

        const foundApp = state.availableApps
            .find(a => a.packageIdentifier === installedApp.packageIdentifier);

        return {
            ...foundApp,
            installedVersion: installedApp.version,
        };
    });
}


export function setAvailableApps(availableApps: IApp[]) {
    return (state: AppState) => {
        state.availableApps = availableApps;
    };
}

export function setInstalledApps(installedApps: IInstalledApp[]) {
    return (state: AppState) => {
        state.installedApps = installedApps;
    };
}

export interface AppState {
    availableApps: IApp[];
    installedApps: IInstalledApp[];
    pendingApps: IPendingApp[];
}

export const initialState: AppState = {
    availableApps: [],
    installedApps: [],
    pendingApps: [],
}
