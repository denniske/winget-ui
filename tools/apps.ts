import {loadApps} from "./helper/load-apps";

loadApps({
    downloadPackages: false,
    fetchIconsAndImages: true,
    outputFile: 'apps.json',
});
