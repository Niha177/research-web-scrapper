
import {CheerioCrawler, Dataset} from 'crawlee'
import {checkMajor} from "../Find_area_study/mapCodeMajor.js"

async function searchByCollege(major) {
let linkSet = []

 const names = await checkMajor(major)

    const crawler = new CheerioCrawler({
        async requestHandler({request, $, enqueueLinks, log}) {
            let link
            if(names.length === 1) {
                 link = $(`a:contains("${names[0]}")`)
            } else {
                 link = $(`a:contains("${names[0]}"), a:contains("${names[1]}")`)
            }
                

            link.each((i, el)=> {
               let ret =  el.attribs.href

               if(el.attribs.href) {
                linkSet.push(ret)
               }
               
            })
            await enqueueLinks({
                //strategy: 'same-domain'
                //wander the internet --> 'all'
            });
        },
        maxRequestsPerCrawl: 50,
    })

    await crawler.run(['https://illinois.edu/academics/colleges-and-schools/'])

    const cleanArr = [...new Set(linkSet)]
    console.log(cleanArr)

    return cleanArr

}


searchByCollege("computer science + learning sciences")
//searchByCollege("College of Liberal Arts & Sciences")



//Search by focus


