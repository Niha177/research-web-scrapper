import * as cheerio from 'cheerio';
import {CheerioCrawler, Dataset} from 'crawlee'

async function getProfData() {
    const crawler = new CheerioCrawler({
        async requestHandler({request, $, enqueueLinks, log}) {
            const title = $("title").text();

            console.log(`Title of ${request.loadedUrl} is ${title}`)

            await Dataset.pushData({title, url: request.loadedUrl})

            await enqueueLinks({
                strategy: 'same-domain'
                //wander the internet --> 'all'
            });
        },
        maxRequestsPerCrawl: 50,
    })

    await crawler.run(['https://siebelschool.illinois.edu/about/people/all-faculty'])
}

/*async function getProfData() {
    try {
        const response = await fetch("https://siebelschool.illinois.edu/about/people/all-faculty")
        const data = await response.text()
        const $ = cheerio.load(data)

  
        const items = [];
   
    $('.directory-list.directory-list-4 .item').each((i, el) => {

            const name = $(el).find('.title').text().trim();
            if (name) {
                console.log(name)
                items.push(name);
            }
        })

    } catch(err) {
        console.log("error in getting prof data")
        console.log(err)
    }

}
    */

//getProfData();
console.log(Dataset)

