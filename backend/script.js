import {findFacultyInfo} from "./searchByMajor/findInfo.js"
import {mainPageLocate} from "./searchByMajor/getMajorLink.js"

async function run(major) {
    await mainPageLocate(major)
    

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(5000)

    await findFacultyInfo(major)




}
run('Industrial Engineering')