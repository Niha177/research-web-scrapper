import {searchByCollege} from './collegeLink.js'
import { PlaywrightCrawler, Configuration} from 'crawlee'
import {query} from '../createDb.js'


export async function getMajorLink(collegeLink, major) {


    const config = Configuration.getGlobalConfig();
    config.set('purgeOnStart', true);
    ///////////////////////////////////

    const getNormName = await mapMajorCode(major)
    const normName = getNormName.name

    const sqlText = 'SELECT EXISTS (SELECT 1 FROM scapedMajorSites WHERE major = $1)'
    //BOOKMARK
    
    const dbResult = await query(sqlText, [normName])

    if (!dbResult.rows[0].exists) {
        console.log('dne')
        const queryText = 
         `INSERT INTO collegeSite (major, urls)
          VALUES ($1, $2)`;
    }

    /////////////////////////////////

    const keywords = [major]
    const recSites = /\\b(programs?|majors?|curriculums?|curricula)\\b/i


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

            const links = await page.locator('a').all()


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

                if(keywords.some(ele => ele.toLowerCase() === curText)) {
                    const href = await link.getAttribute('href');
                    if(href) {
                    
                        foundlinks.push(new URL(href, request.url).href)
                        console.log(foundlinks)

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

    return results
}

export async function mainPageLocate(major) {

    ///////
    const collegeLink = await searchByCollege(major)
    ///////

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const links = await getMajorLink(collegeLink, major)

    delay(2000)

    const depWeb = /\b(department|website)s?\b/i



    let website = [...links]

    const crawler = new PlaywrightCrawler({

        
        async requestHandler({request, page, enqueueLinks, log}) {
            const ignoreDomains = 
            ['osfa', 'ilcollege2career', 
                'illinisuccess', 
                'catalog.illinois.edu/undergraduate',
                'bookstore', 'icard']
            //shift to more permenat solution....

            const links = await page.locator('a').all()

            for(const link of links) {
                const curText = (await link.textContent()|| '').toLowerCase()

                if(depWeb.test(curText) ) {
                    const href = await link.getAttribute('href')

                    if(href && (href.startsWith('http://') || href.startsWith('https://'))) {
                        if(!(ignoreDomains.some(dom => href.toLowerCase().includes(dom)))){

                            website.push(href)
                        }
                         
                    }
                }
            }


        }

    })
    await crawler.run(links)

    const results = [...new Set(website)]
    console.log(results)
}

mainPageLocate('Civil Engineering')

/*
function fuzzyMatch(fullName, unknownAcronym) {

    const letters = unknownAcronym.toLowerCase().split('');
    const pattern = letters.join('.*');

    const regex = new RegExp(pattern, 'i');
    return regex.test(fullName);
}
    */