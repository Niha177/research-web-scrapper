import { PlaywrightCrawler} from 'crawlee'
import {mapMajorCode} from '../Find_area_study/mapCodeMajor.js'
import {query} from '../createDb.js'


export async function findInfo(major) {
   // const searchLinks = ['https://grainger.illinois.edu/']//await searchByCollege(major)
    let reaserch = []




//////////////////////////////////////////////
    const getNormName = await mapMajorCode(major)
    const normName = getNormName.name

    if(normName.includes(' ')) {
        normName.replace(' ', '+')
    }

    const sqlText = 'SELECT EXISTS (SELECT 1 FROM easyFacultyLinks WHERE major = $1)'
    const dbResult = await query(sqlText, [normName])

    if (!dbResult.rows[0].exists) {
        //console.log('dne')
        const queryText = 
         `INSERT INTO easyFacultyLinks (major, sourceUrl, urlData, last_scraped_at)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
          ON CONFLICT (major) 
          DO UPDATE SET
            sourceUrl = (SELECT ARRAY(SELECT DISTINCT unnest(easyFacultyLinks.sourceUrl || EXCLUDED.sourceUrl))),
            urlData = EXCLUDED.urlData,
            last_scraped_at = CURRENT_TIMESTAMP
          `;
    
//////////////////////////////////////////////


        const crawler = new PlaywrightCrawler({

        
            async requestHandler({request, page, enqueueLinks, log}) {

            const curUrl = request.url

                const results = await page.locator('a').all()
                for(const result of results) {

                    const rawHref = await result.getAttribute('href')


                    if(rawHref && typeof rawHref === 'string' && rawHref.includes('uddg=')) {

                        const parserUrl = new URL(rawHref.startsWith('//') ? `https:${rawHref}` : rawHref)

                        const mainUrl = parserUrl.searchParams.get('uddg')

                        try { 
                            
                            reaserch.push(mainUrl)
                            
                            if(reaserch.length > 2) {
                                break;
                            }

                        } catch(err) {

                        }
                        
                    } else {
                        console.log('not found')
                        console.log(await result.getAttribute('href'))
                    
                    }
                }

            await enqueueLinks({
                strategy: 'same-domain'
            })

            }, maxRequestsPerCrawl: 10

        })

        await crawler.run([`https://html.duckduckgo.com/html/?q=+${normName}+faculty+university%20of%20illinois%20urbana%20champaign+site:illinois.edu`])

        console.log(reaserch)
        const result = [...new Set(reaserch)]

         const metadata = {
            site: 'illinois.edu',
            type: 'proLinks'
        }

        await query(queryText, [normName, result, JSON.stringify(metadata) ])

        return result

    } else {

         const qryText = `SELECT sourceUrl FROM easyFacultyLinks WHERE major = $1`

        const existRes = await query(qryText, [normName])

        const res = existRes.rows[0].sourceurl

        console.log(res)
        return res   
    }
}

findInfo("linguistcs")
