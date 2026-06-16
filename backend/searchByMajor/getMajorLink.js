import {searchByCollege} from './collegeLink.js'
import { PlaywrightCrawler, Configuration} from 'crawlee'
import {query} from '../createDb.js'
import { mapMajorCode} from "../Find_area_study/mapCodeMajor.js"


export async function getMajorLink(collegeLink, major, queryText) {


    const config = Configuration.getGlobalConfig();
    config.set('purgeOnStart', true);
    //////////////////////////////////////////////////////////

    

    //////////////////////////////////////////////////////////

        const keywords = [major]
        const recSites = /\b(programs?|majors?|curriculums?|curricula|degrees?|undergraduates?)\b/i


        let foundlinks = []

        const crawler = new PlaywrightCrawler({

            maxConcurrency: 5,
            maxRequestsPerCrawl: 350,
            requestHandlerTimeoutSecs: 45,


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

                        if((request.url === collegeLink[0] ||
                             request.url === (collegeLink.length === 2 ? collegeLink[1] : collegeLink[0])) 
                             && recSites.test(curText)) {
                            const curhref = await link.getAttribute('href');

                            await enqueueLinks({
                                urls: [new URL(curhref, request.url).href],
                                forefront: true,
                                userData: {priority: 'High'}
                            })

                        }

                    const href = await link.getAttribute('href');
                    if(keywords.some(ele => ele.toLowerCase() === curText)) {
                        

                        const cleanHref = href.toLowerCase().replace(/[-_\s]/g, '')
                        const cleanMajor = major.toLowerCase().replace(/[-_\s]/g, '')
                        if(href) {
                        
                            foundlinks.push(new URL(href, request.url).href)
                            console.log(foundlinks)

                        }
                    /////////////////////////////////////
                    } else {
                        const href = link.getAttribute('href');

                        const cleanHref = request.url.toLowerCase().replace(/[-_\s]/g, '')
                        const cleanMajor = major.toLowerCase().replace(/[-_\s]/g, '')

                        if(cleanHref.includes(cleanMajor)) {
                            foundlinks.push(new URL(href, request.url).href)
                            console.log(foundlinks)
                        }
                    }
                    /////////////////////////////////////
                    
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

        await crawler.run(collegeLink)

        const results = [...new Set(foundlinks)]
        console.log(results)



        return results
        
    
}

export async function mainPageLocate(major) {

    ///////
    const collegeLink = await searchByCollege(major)
    ///////
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    ////////////////////////////////////////////////
    const getNormName = await mapMajorCode(major)
    const normName = getNormName.name

    const sqlText = 
    `SELECT EXISTS 
        (SELECT 1 FROM scapedMajorSites 
        WHERE major = $1
        AND last_scraped_at AT TIME ZONE $2 > (NOW() AT TIME ZONE $2 - INTERVAL '30 days')
        )`
    //CHANGE INTERVAL TO 7 DAYS AT DEPLOYMENT

    const dbResult = await query(sqlText, [normName, 'America/New_York'])

    if (!dbResult.rows[0].exists) {
        //console.log('dne')
        const queryText = 
         `INSERT INTO scapedMajorSites (major, sourceUrl, urlData, last_scraped_at)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
          ON CONFLICT (major) 
          DO UPDATE SET
            sourceUrl = (SELECT ARRAY(SELECT DISTINCT unnest(scapedMajorSites.sourceUrl || EXCLUDED.sourceUrl))),
            urlData = EXCLUDED.urlData,
            last_scraped_at = CURRENT_TIMESTAMP
          `;
        
      ////////////////////////////////////////////////

        const links = await getMajorLink(collegeLink, major, queryText)

        delay(2000)

        const depWeb = /\b(department|website)s?\b/i

        let website = [...links]

        const crawler = new PlaywrightCrawler({

            
            async requestHandler({request, page, enqueueLinks, log}) {
                const ignoreDomains = 
                ['osfa', 'ilcollege2career', 
                    'illinisuccess', 
                    //'catalog.illinois.edu/undergraduate',
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

         const metadata = {
            site: 'illinois.edu'
            //add more importance in future
        }

        await query(queryText, [normName, results, JSON.stringify(metadata) ])

        return results

    } else {

         const qryText = `SELECT sourceUrl FROM scapedMajorSites WHERE major = $1`

        const existRes = await query(qryText, [normName])

        const res = existRes.rows[0].sourceurl

        console.log(res)
        return res       
    }



}

mainPageLocate('bioengineering')

/*
function fuzzyMatch(fullName, unknownAcronym) {

    const letters = unknownAcronym.toLowerCase().split('');
    const pattern = letters.join('.*');

    const regex = new RegExp(pattern, 'i');
    return regex.test(fullName);
}
    */