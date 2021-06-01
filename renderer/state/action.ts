import { cloneDeep } from "lodash";
import {IApp, IInstalledApp, IPendingApp, ITask} from "../helper/types";



export function selectLocalApps(state: AppState) {

    return state.availableApps.map(foundApp => {
        // if (!apps.find(a => a.packageIdentifier === p.packageIdentifier)) {
        //     console.log('not found', p.packageIdentifier);
        // }

        const foundTasks = state.tasks
            .filter(a => a.packageIdentifier === foundApp.packageIdentifier);
        const foundTask = foundTasks.length > 0 ? foundTasks[foundTasks.length-1] : null;

        return {
            ...foundApp,
            installedVersion: null,
            task: foundTask,
        };
    })
        .filter((x, i) => x.packageIdentifier.toLowerCase().includes('visual'))
        .filter((x, i) => i < 50)
        ;

    // return state.installedApps.map(installedApp => {
    //     // if (!apps.find(a => a.packageIdentifier === p.packageIdentifier)) {
    //     //     console.log('not found', p.packageIdentifier);
    //     // }
    //
    //     const foundApp = state.availableApps
    //         .find(a => a.packageIdentifier === installedApp.packageIdentifier);
    //
    //     const foundTasks = state.tasks
    //         .filter(a => a.packageIdentifier === installedApp.packageIdentifier);
    //     const foundTask = foundTasks.length > 0 ? foundTasks[foundTasks.length-1] : null;
    //
    //     return {
    //         ...foundApp,
    //         installedVersion: installedApp.version,
    //         task: foundTask,
    //     };
    // });
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

export function setQueue(queue: ITask[]) {
    return (state: AppState) => {
        state.queue = cloneDeep(queue);
    };
}

export function setTasks(tasks: ITask[]) {
    return (state: AppState) => {
        state.tasks = cloneDeep(tasks);
    };
}

export function setSearch(search: string) {
    return (state: AppState) => {
        state.search = search;
    };
}

// export function addToQueue(task: ITask) {
//     return (state: AppState) => {
//         state.queue.push(task);
//     };
// }

export interface AppState {
    availableApps: IApp[];
    installedApps: IInstalledApp[];
    pendingApps: IPendingApp[];
    queue: ITask[];
    tasks: ITask[];
    search: string;
}

export const initialState: AppState = {
    availableApps: [],
    installedApps: [],
    pendingApps: [],
    queue: [],
    tasks: [],
    search: '',
}
