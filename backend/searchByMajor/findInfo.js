import { PlaywrightCrawler, Configuration} from 'crawlee'
import {searchByCollege} from './collegeLink.js'
import {mainPageLocate} from "./getMajorLink.js"
import {cleanLinks} from '../utilities/cleanLinkDomain.js'
import {mapMajorCode} from "../Find_area_study/mapCodeMajor.js"
import {query} from '../createDb.js'

export async function findFacultyInfo(major) {

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    //////////////////////////////////////////////////////////////////
    const getNormName = await mapMajorCode(major)
    const normName = getNormName.name

    //await mainPageLocate(major)
    //let 
   

    const searchFor = await cleanLinks(normName)
    await delay(1000)

    //////////////////////////////////////////////////////////////////
    const sqlText = 
    `SELECT EXISTS 
        (SELECT 1 FROM facultyLinks 
        WHERE major = $1
        AND last_scraped_at AT TIME ZONE $2 > (NOW() AT TIME ZONE $2 - INTERVAL '30 days')
        )`

    const dbResult = await query(sqlText, [normName, 'America/New_York'])

    if (!dbResult.rows[0].exists) {
        //console.log('dne')
        const queryText = 
         `INSERT INTO facultyLinks (major, sourceUrl, urlData, last_scraped_at)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
          ON CONFLICT (major) 
          DO UPDATE SET
            sourceUrl = (SELECT ARRAY(SELECT DISTINCT unnest(facultyLinks.sourceUrl || EXCLUDED.sourceUrl))),
            urlData = EXCLUDED.urlData,
            last_scraped_at = CURRENT_TIMESTAMP
          `;
    
    ////////////////////////////////////////////////////////////////

        let reaserch = []

        const config = Configuration.getGlobalConfig();
        config.set('purgeOnStart', true);
        //clears storege directory

 
        const crawler = new PlaywrightCrawler({
            

            maxConcurrency: 3,
            async requestHandler({request, page, enqueueLinks, log}) {
            //await page.waitForSelector('.main-content, #content, body')

                const keyword = ["faculty"]

            const links = await page.locator('a').all()
            //gathering all anchor tags to filter/find the correct one later

            for(const link of links) {
                    const text = (await link.innerText()).toLowerCase()
                    //normalize to find everything better

                    const href = await link.getAttribute('href')
                    //grabs the relative link
                    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
                        continue;
                    }


                    const target = keyword.some(key => text.includes(key))
                    //goes through each keyword to find something that works

                    if(target) {
                        reaserch.push(new URL(href, request.url).href)
                        //builds correct full link
                    }
            }

                await enqueueLinks({
                    globs: [
                        'https://*.illinois.edu/**'
                    ]
                })

            }, maxRequestsPerCrawl: 150, //set best one!!!!
        })
        
        const safeSearchFor = (searchFor || []).filter(url => typeof url === 'string' && url.trim() !== '');

        await crawler.run(safeSearchFor)

        const result = [...new Set(reaserch)]
        console.log(result)

         const metadata = {
            site: 'illinois.edu',
            type: 'proLinks'
        }

        await query(queryText, [normName, result, JSON.stringify(metadata) ])

        return result

    } else {

         const qryText = `SELECT sourceUrl FROM facultyLinks WHERE major = $1`

        const existRes = await query(qryText, [normName])

        const res = existRes.rows[0].sourceurl

        console.log(res)
        return res   
    }
}


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

