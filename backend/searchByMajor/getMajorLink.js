import {searchByCollege} from './collegeLink.js'
import { PlaywrightCrawler, Configuration} from 'crawlee'
import {query} from '../createDb.js'

//NORMALIZE MAJOR NAME
export async function getMajorLink(collegeLink, major) {


    const config = Configuration.getGlobalConfig();
    config.set('purgeOnStart', true);
    ///////////////////////////////////

    //const queryText = 'SELECT name FROM majors WHERE name = $1'

    /////////////////////////////////

    const keywords = [major]
    const recSites = /\\b(programs?|majors?|curriculums?|curricula)\\b/i
    const depWeb = /\b(visits?|departments?|websites?)\b/i

    let foundlinks = []

    const crawler = new PlaywrightCrawler({

        maxConcurrency: 5,
        maxRequestsPerCrawl: 100,
        requestHandlerTimeoutSecs: 15,


        launchContext: {
            launchOptions: {
                ignoreHTTPSErrors: true,
                args: [ '--disable-http2', '--no-sandbox', 
                    '--disable-setuid-sandbox','--disable-dev-shm-usage']
            }
        },
        async requestHandler({request, page, enqueueLinks, log }) {
            //await page.waitForSelector('.main-content, #content, body')

            const links = await page.locator('a').all()
            //const target =  page.getByRole('link', {name : major})
/*
            if(request.url === 'https://grainger.illinois.edu/') {
                for(const link of links) {
                    const cur = (await link.textContent() || '').toLowerCase()

                    if(recSites.test(cur)) {
                        const href = await link.getAttribute('href');

                        await enqueueLinks({
                            urls: [new URL(href, request.url).href],
                            forefront: true,
                            userData: {priority: 'High'}
                        })

                    }
                }
            }
                */

            

            for(const link of links) {
                //const targeTtext = (await target.textContent()).toLowerCase()
                const curText = (await link.textContent()|| '').toLowerCase()

                    if(request.url === collegeLink && recSites.test(curText)) {
                        const curhref = await link.getAttribute('href');

                        await enqueueLinks({
                            urls: [new URL(curhref, request.url).href],
                            forefront: true,
                            userData: {priority: 'High'}
                        })

                    }

                
                //
                if(keywords.some(ele => ele.toLowerCase() === curText)) {
                    const href = await link.getAttribute('href');
                    if(href) {
                    
                        foundlinks.push(new URL(href, request.url).href)
                        console.log(foundlinks)

                        //await page.getByRole('link', {name: depWeb}).waitFor({state:'attached'})

                        //const findDepSite =  page.getByRole('link', {name: depWeb}).first().getAttribute('href')
                        //if(findDepSite) {
                            //foundlinks.push(findDepSite)
                        //}
                    }
                }

                
            }

            await enqueueLinks({
                strategy: 'all',
                globs: ['https://*.illinois.edu/**'],
                exclude: [
                    /\/(news|stories|events|blog)\//i,
                    /go\.illinois\.edu/i,
                    /\/(tiktok|instagram|twitter|facebook|youtube)/i
                ]
            })

        }, 
    })

    await crawler.run([collegeLink])

    const results = [...new Set(foundlinks)]
    console.log(results)
}

getMajorLink('https://giesbusiness.illinois.edu/', 'Accounting')

//https://giesbusiness.illinois.edu/