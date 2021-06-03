import {IApp, IInstalledApps, ITask} from "./types";
import {exec, getStore} from "../state/store";
import {
    setAvailableApps,
    setInstalledApps,
    setPopularity,
    setQueue,
    setTasks,
    showTaskFailedModal
} from "../state/action";
// import {ipcRenderer} from "electron";
import {toCamelCase} from "./util";
import {dummyApps} from "../data/apps";
import {dummyInstalled} from "../data/installed";
import {dummyPopularity} from "../data/popularity";
import { ipcRenderer } from "./bridge";

let executing = false;

const tasks: ITask[] = [];
let queue: ITask[] = [];

let globalTaskId = 0;

export function getTaskId() {
    return (globalTaskId++).toString();
}

function updateStore() {
    getStore().dispatch(exec(setQueue(queue)));
    getStore().dispatch(exec(setTasks(tasks)));
}

export function addTaskToQueue(task: ITask) {
    queue.push(task);
    updateStore();
    execute();
}

async function execute() {
    if (executing) return;
    executing = true;

    console.log('queue', queue);
    const task = queue.shift();
    task.started = true;
    tasks.push(task);
    updateStore();

    console.log('execute', task);

    const resultStr = await ipcRenderer.invoke('winget-task', task);
    // console.log('resultStr', resultStr);
    task.exitCode = resultStr.exitCode;
    task.signal = resultStr.signal;
    updateStore();

    if (resultStr.exitCode != 0) {
        getStore().dispatch(exec(showTaskFailedModal(task)));
    }

    await loadInstalledApps();

    executing = false;

    if (task.exitCode != 0) {
        while (queue.length > 0) {
            const pendingTask = queue.shift();
            pendingTask.canceled = true;
            tasks.push(pendingTask);
        }
        updateStore();
    }

    if (task.exitCode == 0 && queue.length > 0) {
        execute();
    }
}

function init() {
    ipcRenderer.on('terminal', (event, taskInfo: ITask, data) => {
        // console.log('client terminal', taskInfo.id, data);
        // console.log('tasks', tasks.length, tasks[0].id, tasks);

        const task = tasks.find(t => t.id == taskInfo.id);
        // console.log('found task', task);
        task.buffer ??= [];
        task.buffer.push(data);

        task.progressTask ??= 'downloading';

        const progressRegex = /9;4;1;(\d+)/;
        if (progressRegex.test(data)) {
            const match = progressRegex.exec(data);
            const progress = parseInt(match[1]);
            // console.log('==> progress', progress);
            task.progress = progress / 100;
            task.progressReal = progress / 100;
            if (progress == 100) {
                task.progressTask = 'installing';
            }
        }
        const progressIndRegex = /9;4;3;0/;
        if (progressIndRegex.test(data)) {
            // console.log('==> progress indetermined');
            task.progress = 2;
        }
        const progressFinRegex = /9;4;0;0/;
        if (progressFinRegex.test(data)) {
            // console.log('==> progress finished');
            task.progress = -1;
        }
        updateStore();
    });
}

let loadedAvailableApps = false;

export async function loadAvailableApps() {
    const response = await fetch('https://winget-ui.vercel.app/apps.json');
    const availableApps = await response.json();
    getStore().dispatch(exec((setAvailableApps(availableApps))));
    loadedAvailableApps = true;
}

export async function loadInstalledApps() {
    console.log('loadInstalledApps');
    // console.log(new Date());
    const availableApps = getStore().getState().availableApps;

    const installedStr = await ipcRenderer.invoke('get-installed');
    const installed = JSON.parse(installedStr, toCamelCase) as IInstalledApps;

    const _installedApps = installed.sources
        .flatMap(s => s.packages)
        .filter(p => availableApps.find(a => a.packageIdentifier === p.packageIdentifier));
    getStore().dispatch(exec((setInstalledApps(_installedApps))));
    // console.log(new Date());
}

export async function loadApps() {
    init();
    await loadAvailableApps();
    await loadInstalledApps();
}
