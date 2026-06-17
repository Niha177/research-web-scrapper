import {findFacultyInfo} from "./searchByMajor/findInfo.js"
import {mainPageLocate} from "./searchByMajor/getMajorLink.js"
import {findInfo} from './lightweightFinder/facultyDiscovery.js'


async function run(major) {
    await findInfo(major)
}

run('Industrial Engineering')
















//////////////////////////////////////////////////////////

async function runDeepSearchArchive(major) {
    await mainPageLocate(major)
    

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(5000)

    await findFacultyInfo(major)




}
