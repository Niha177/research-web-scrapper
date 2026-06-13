import {CheerioCrawler, PlaywrightCrawler, Configuration} from 'crawlee'
import {searchByCollege} from './collegeLink.js'

export async function findFacultyInfo(searchLinks) {
    
    let reaserch = []

    const config = Configuration.getGlobalConfig();
    config.set('purgeOnStart', true);

    const crawler = new PlaywrightCrawler({

        maxConcurrency: 3,
        async requestHandler({request, page, enqueueLinks, log}) {
           await page.waitForSelector('.main-content, #content, body')

          // const title = await page.title()
           //const main = await page.locator('h1').first().textContent()
            const keyword = ["faculty"]

           const links = await page.locator('a').all()
           //gathering all anchor tags to filter/find the correct one later

           for(const link of links) {
                const text = (await link.innerText()).toLowerCase()
                //normalize to find everything better

                const href = await link.getAttribute('href')
                //grabs the relative link

                if(!href) {
                    continue
                }

                const target = keyword.some(key => text.includes(key))
                //goes through each keyword to find something that works

                if(target) {
                    reaserch.push(new URL(href, request.url).href)
                    //builds correct full link
                }
           }

            //log.info(`title of ${request.loadedUrl} is '${title}' headin is ${main}`);

            await enqueueLinks({
                globs: [
                    `${searchLinks}/**`
                ]
            })

        }, maxRequestsPerCrawl: 20,
    })
    
    await crawler.run([searchLinks])

    const result = [...new Set(reaserch)]
    console.log(result)

    return result
}

export async function filterFaculty(major) {
    const searchLinks = await searchByCollege(major)

    let res =[]

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let first = await findFacultyInfo(searchLinks[0])
    res.push(...first)

    

    if(searchLinks.length > 1) {

        await delay(3000); 
         let second = await findFacultyInfo(searchLinks[1])
         res.push(...second)
    }
    

    console.log(res)
}

filterFaculty('computer science + learning science')





export async function findKeyWords(major) {

    const Regex = /\s*\b(?:and)\b\s*|\s*[\+&]\s*/
    let majorComponents = []

    let results = []
    if(Regex.test(major)) {
        majorComponents = major.split(Regex).map(item => item.trim())
    } else {
        majorComponents.push(major)
    }
}

