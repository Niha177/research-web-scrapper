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
        async requestHandler({request, $, enqueueLinks, log}) {

        const curUrl = request.url

        if(curUrl.includes('duckduckgo.com/html')) {

            const result = $('#links ClearText, #links a.result__a, .result__url').first().attr('href');
            console.log(result)

            if(result) {
                //await crawler.addRequests([result])
            } else {
                console.log('not found')
            }

            return;

        }



        let link = $(`a:contains("Tarek Abdelzaher")`)
            link.each((i, el)=> {
               let ret =  el.attribs.href

               if(el.attribs.href) {
                linkSet.push(ret)
               }
               
            })
        


        await enqueueLinks({
            strategy: 'all'
        })

        }, maxRequestsPerCrawl: 20

    })

    await crawler.run(['https://html.duckduckgo.com/html/?q=+computer%20science+faculty+university%20of%20illinois%20urbana%20champaign+site:illinois.edu'])

    console.log(reaserch)
}

findInfo("computer science")