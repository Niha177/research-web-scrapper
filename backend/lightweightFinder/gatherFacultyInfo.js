import { PlaywrightCrawler} from 'crawlee'
import {mapMajorCode} from '../Find_area_study/mapCodeMajor.js'
import {query} from '../createDb.js'

export async function gatherFacInfo(major) {

    let recs = []
    let extLinks = []

    let keywordsArr = ['applied linguistics']
    let keywords = keywordsArr.map(word => word.toLowerCase())


    const getNormName = await mapMajorCode(major)
    const normName = getNormName.name

    const sqlText = 'SELECT sourceUrl FROM easyFacultyLinks WHERE major = $1'
    const dbResult = await query(sqlText, [normName])
    const url = dbResult.rows[0].sourceurl

    const regex = /\b(website|laboratory|lab page|lab|webpage|page|group)\b/i;

    console.log(url)

    const crawler = new PlaywrightCrawler({

        maxCrawlDepth: 1,
        maxRequestsPerCrawl: 100,
        async requestHandler({request, page, enqueueLinks, log }) {

           if(request.url === url[0]) {
                await enqueueLinks({
                    selector: 'main a, article a, #content a',
                    strategy: 'same-domain'
                })
            return
           }
           const rawText = await page.locator('body').innerText()
           const article = rawText.toLowerCase()
           if(keywords.some(key => article.includes(key))) {
           //if(keywords.every(key => article.includes(key))) {
                const webLinks = await page.locator('main a, article a, #content a').all()

                let linkSet = []

                for(const link of webLinks) {
                    const href = await link.getAttribute('href')

                    if (!href || href.startsWith('#') || href.startsWith('javascript:') 
                        || href.startsWith('mailto:') || href.startsWith('tel:') || !href.startsWith('http')) {
                        continue;
                    }
                    
                    if(regex.test(await link.innerText())) {
                        linkSet.push(href)
                    }
                    
                }
                extLinks.push(linkSet)

            recs.push(request.url)
           }
        }
        
    })
    await crawler.run(url)
    console.log(recs)
    console.log(extLinks)
}

gatherFacInfo('linguistcs')

function fuzzyMatch(link, name) {

    const letters = name.toLowerCase().split('');
    const pattern = letters.join('.*');

    const regex = new RegExp(pattern, 'i');
    return regex.test(link);
}