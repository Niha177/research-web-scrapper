import {query} from "../createDb.js"

export async function cleanLinks(major) {
    const searchQry = 'SELECT sourceUrl FROM scapedMajorSites WHERE major = $1';
    const regex = /research|faculty/i

    const dbResults = await query(searchQry, [major])
    const urls = dbResults.rows[0].sourceurl

    const urlQuery = 'SELECT urls FROM collegeSite WHERE major = $1'
    const urlDbResults = await query(urlQuery, [major])
    const mainUrl = urlDbResults.rows[0].urls


    let cleanResults = []
    let extraResults = []



    for(const url of urls) {

        const hostname = new URL(url).hostname
        const subdomain = hostname.split('.')[0]
        const testmaj = major.toLowerCase()

        if(fuzzyMatch(testmaj,subdomain)) {
            cleanResults.unshift(hostname)
            continue;
        }

        if(regex.test(url)) {
            cleanResults.push(url)
            continue;
        } 
        const mainHost = new URL(mainUrl[0]).hostname

        if(hostname === mainHost) {
           extraResults.push(hostname)
        }

    }
    const finalResults = [...new Set(cleanResults), ...new Set(extraResults)]

    if(finalResults.length === 0) {
        finalResults.push(mainUrl[0])

        const percent = Math.ceil(urls.length * 0.20)
        const topPercent = urls.slice(0, percent)

        finalResults.push(...topPercent)
    }
    console.log(finalResults)
}

cleanLinks('Bioengineering')

function fuzzyMatch(fullName, acronym) {

    const letters = acronym.toLowerCase().split('');
    const pattern = letters.join('.*');

    const regex = new RegExp(pattern, 'i');
    return regex.test(fullName);
}