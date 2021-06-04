import {cloneDeep} from "lodash";
import {IApp, IInstalledApp, IPendingApp, IPopularity, ITask} from "../helper/types";

export function selectTaskForApp(app: IApp) {
    return (state: AppState) => {
        const foundTasks = state.tasks.filter(t => t.exitCode != 0 && t.packageIdentifier === app.packageIdentifier);
        return foundTasks.length > 0 ? foundTasks[foundTasks.length-1] : null;
    };
}

export function selectQueuedTaskForApp(app: IApp) {
    return (state: AppState) => {
        const foundQueuedTasks = state.queue.filter(a => a.packageIdentifier === app.packageIdentifier);
        return foundQueuedTasks.length > 0 ? foundQueuedTasks[foundQueuedTasks.length-1] : null;
    };
}

export function selectInstalledForApp(app: IApp) {
    return (state: AppState) => {
        const foundInstalledApps = state.installedApps.filter(a => a.packageIdentifier === app.packageIdentifier);
        return foundInstalledApps.length > 0 ? foundInstalledApps[foundInstalledApps.length-1] : null;
    };
}

export function selectLocalApps(state: AppState) {
    return state.availableApps
}

export function selectLocalInstalledApps(state: AppState) {
    return state.installedApps.map(installedApp => {
        // if (!apps.find(a => a.packageIdentifier === p.packageIdentifier)) {
        //     console.log('not found', p.packageIdentifier);
        // }

        const foundApp = state.availableApps.find(a => a.packageIdentifier === installedApp.packageIdentifier);
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

export function setPopularity(popularity: IPopularity[]) {
    return (state: AppState) => {
        state.popularity = popularity;
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

export function setInstalledFilter(installedFilter: string) {
    return (state: AppState) => {
        state.installedFilter = installedFilter;
    };
}

export function setUpdatesFilter(updatesFilter: string) {
    return (state: AppState) => {
        state.updatesFilter = updatesFilter;
    };
}

export function showTaskFailedModal(task: ITask) {
    return (state: AppState) => {
        state.modal = {
            type: 'task-failed',
            task,
        };
    };
}

export function showNoAdminModal() {
    return (state: AppState) => {
        state.modal = {
            type: 'no-admin',
        };
    };
}

export function hideModal() {
    return (state: AppState) => {
        state.modal = null;
    };
}

interface IModal {
    type: 'task-failed' | 'no-admin',
    task?: ITask;
}

export interface AppState {
    availableApps: IApp[];
    installedApps: IInstalledApp[];
    pendingApps: IPendingApp[];
    popularity: IPopularity[];
    queue: ITask[];
    tasks: ITask[];
    search: string;
    installedFilter: string;
    updatesFilter: string;
    modal: IModal;
}

export const initialState: AppState = {
    availableApps: [],
    installedApps: [],
    pendingApps: [],
    popularity: [],
    queue: [],
    tasks: [],
    search: '',
    installedFilter: '',
    updatesFilter: '',
    modal: null,
}
