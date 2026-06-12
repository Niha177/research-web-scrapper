
import {CheerioCrawler, Dataset} from 'crawlee'
import {checkMajor} from "./Find_area_study/mapCodeMajor.js"

async function searchByMajor(major) {

    const names = await checkMajor(major)

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

    await crawler.run(['https://illinois.edu/academics/colleges-and-schools/'])
}

async function LinksToSearch(major) {
    
}


//getProfData();

//Search by focus


