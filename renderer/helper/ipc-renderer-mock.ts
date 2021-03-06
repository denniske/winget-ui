
const fakes: Record<string, any> = {};
const listeners: Record<string, any[]> = {};

export const ipcRendererMock = {
    fake: (channel: string, callback: any) => {
        fakes[channel] = callback;
    },
    invoke: async (channel: string, ...args: any[]): Promise<any> => {
        return await fakes[channel](...args);
    },

    on(channel: string, callback: any) {
        listeners[channel] ??= [];
        listeners[channel].push(callback);
    },
    send: (channel: string, ...args: any[]) => {
        listeners[channel].forEach(l => l({ event: true }, ...args));
    },
};
