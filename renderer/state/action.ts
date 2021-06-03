import { cloneDeep } from "lodash";
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
    // console.log('selectLocalApps');
    // const start = new Date();
    const result = state.availableApps
            // .map(foundApp => {

        // const foundTasks = state.tasks.filter(t => t.exitCode != 0 && t.packageIdentifier === foundApp.packageIdentifier);
        // const foundTask = foundTasks.length > 0 ? foundTasks[foundTasks.length-1] : null;
        // const foundQueuedTasks = state.queue.filter(a => a.packageIdentifier === foundApp.packageIdentifier);
        // const foundQueuedTask = foundQueuedTasks.length > 0 ? foundQueuedTasks[foundQueuedTasks.length-1] : null;


        // return {
        //     ...foundApp,
            // installedVersion: foundInstalledApp?.version,
            // task: foundTask,
            // queuedtask: foundQueuedTask,
        // };
    // })
        // .filter((x, i) => x.packageIdentifier.toLowerCase().includes('visual'))
        // .filter((x, i) => i < 50)
        ;
    // console.log((new Date().getTime() - start.getTime()), ' ms');
    return result;
}

export function selectLocalInstalledApps(state: AppState) {
    return state.installedApps.map(installedApp => {
        // if (!apps.find(a => a.packageIdentifier === p.packageIdentifier)) {
        //     console.log('not found', p.packageIdentifier);
        // }

        const foundApp = state.availableApps.find(a => a.packageIdentifier === installedApp.packageIdentifier);

        // const foundTasks = state.tasks.filter(t => t.exitCode != 0 && t.packageIdentifier === installedApp.packageIdentifier);
        // const foundTask = foundTasks.length > 0 ? foundTasks[foundTasks.length-1] : null;

        return {
            ...foundApp,
            installedVersion: installedApp.version,
            // task: foundTask,
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

export function hideModal() {
    return (state: AppState) => {
        state.modal = null;
    };
}

// export function addToQueue(task: ITask) {
//     return (state: AppState) => {
//         state.queue.push(task);
//     };
// }

interface IModal {
    type: 'task-failed',
    task: ITask;
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
