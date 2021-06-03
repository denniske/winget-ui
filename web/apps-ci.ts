import {loadApps} from "./helper/load-apps";
import fs from "fs";


async function build() {
    let apps = await loadApps({
        downloadPackages: true,
        fetchIconsAndImages: false,
    });

    // console.log(process.cwd());

    const images = JSON.parse(fs.readFileSync('data/images.json', 'utf8'));
    const popularities = JSON.parse(fs.readFileSync('data/popularities.json', 'utf8'));

    apps = apps.map(app => {
        const foundImage = images.find(a => a.PackageIdentifier === app.PackageIdentifier);
        const foundPopularity = popularities.find(a => a.Id === app.PackageIdentifier);
        return {
            ...app,
            PackageIcon: foundImage?.PackageIcon,
            PackageImage: foundImage?.PackageImage,
            Views: foundPopularity?.Views || 0,
        };
    });

    fs.writeFileSync('public/apps.json', JSON.stringify(apps, null, 4));
}

build();
