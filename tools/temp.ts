import {dummyApps} from "./helper/apps";
import fs from "fs";


function extractImages() {

    const images = dummyApps.map(app => {
        return {
            PackageIdentifier: app.PackageIdentifier,
            PackageIcon: app.PackageIcon,
            PackageImage: app.PackageImage,
        };
    });

    fs.writeFileSync('images.json', JSON.stringify(images, null, 4));
}

extractImages();
