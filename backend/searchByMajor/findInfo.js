import {CheerioCrawler, PlaywrightCrawler} from 'crawlee'
import {searchByCollege} from './collegeLink.js'

export async function findInfo(major) {
    const searchLinks = ['https://grainger.illinois.edu/']//await searchByCollege(major)
    let reaserch = []

    const crawler = new PlaywrightCrawler({
        async requestHandler({request, page, enqueueLinks, log}) {
           await page.waitForSelector('.main-content, #content, body')

          // const title = await page.title()
           //const main = await page.locator('h1').first().textContent()
            const keyword = ["faculty"]

           const links = await page.locator('a').all()

           for(const link of links) {
                const text = (await link.innerText()).toLowerCase()
                const href = await link.getAttribute('href')

                if(!href) {
                    continue
                }

                const target = keyword.some(key => text.includes(key))

                if(target) {
                    reaserch.push(new URL(href, request.url).href)
                }
           }

            log.info(`title of ${request.loadedUrl} is '${title}' headin is ${main}`);

            await enqueueLinks({
                globs: ['https://grainger.illinois.edu/**']
            })

        }, maxRequestsPerCrawl: 20,
    })
    
    await crawler.run(searchLinks)

    const result = [...new Set(reaserch)]
    console.log(result)
}

findInfo('computer science')

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

