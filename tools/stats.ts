import axios from "axios"
import * as fs from "fs"
import * as path from "path"

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function loadStats(packageId: string): Promise<number> {
    const response = await axios({
        method: 'GET',
        url: `https://api.winget.run/v2/stats?packageId=${packageId}&resolution=month&after=2021-05-10&before=2021-05-31`,
    });
    // console.log(response.data);
    // console.log(response.data.Stats.Data[0].Value);
    return response.data.Stats.Data.length > 0 ? response.data.Stats.Data[0].Value : 0;
}

async function loadPage(page: number) {
    const response = await axios({
        method: 'GET',
        url: `https://api.winget.run/v2/packages?ensureContains=true&partialMatch=true&take=12&order=1&page=${page}`,
    });
    const packages = response.data.Packages;
    // await loadStats(packages[0].Id);
    for (const p of packages) {
        p.Views = await loadStats(p.Id);
        await sleep(30);
    }
    return packages;
}

let allPackages = [];

async function loadPages() {
    let page = 0;
    while (true) {
        console.log("Loading page " + page);
        const packages = await loadPage(page++);
        allPackages.push(...packages);
        if (packages.length < 12) break;
        // if (packages.length < 12 || page > -1) break;
        // await sleep(30);
    }
    fs.writeFileSync('popularity-raw.json', JSON.stringify(allPackages, null, 4));

    allPackages = allPackages.map(p => ({
        Id: p.Id,
        Views: p.Views,
    }));

    fs.writeFileSync('popularity.json', JSON.stringify(allPackages, null, 4));
}

loadPages();
