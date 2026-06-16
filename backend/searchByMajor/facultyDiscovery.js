import {CheerioCrawler, PlaywrightCrawler} from 'crawlee'


export async function findInfo(major) {
    const searchLinks = ['https://grainger.illinois.edu/']//await searchByCollege(major)
    let reaserch = []

    const crawler = new PlaywrightCrawler({

 preNavigationHooks: [
        async (crawlingContext, requestOptions) => {
            requestOptions.headers = {
                ...requestOptions.headers,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            };
        },
    ],       
        async requestHandler({request, page, enqueueLinks, log}) {

        const curUrl = request.url

        

            const results = await page.locator('a').all()
            for(const result of results) {

                const rawHref = result.getAttribute('href')
                if(rawHref && typeof rawHref ==='string' && rawHref.includes('udge')) {

                    try{

                    } catch(err) {

                    }
                    
                } else {
                    console.log('not found')
                    console.log(await result.getAttribute('href'))
                
                }
            }

            return;

        
        

        await enqueueLinks({
            strategy: 'same-domain'
        })

        }, maxRequestsPerCrawl: 100

    })

    await crawler.run(['https://html.duckduckgo.com/html/?q=+computer%20science+faculty+university%20of%20illinois%20urbana%20champaign+site:illinois.edu'])

    console.log(reaserch)
}

findInfo("computer science")