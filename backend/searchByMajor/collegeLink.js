
import {CheerioCrawler, Dataset} from 'crawlee'
import {checkMajor, mapMajorCode} from "../Find_area_study/mapCodeMajor.js"
import {query} from "../createDb.js"

export async function searchByCollege(major) {

let linkSet = []

 const names = await checkMajor(major)

 /////////////////////////////////////////////////////////////////
    const getNormName = await mapMajorCode(major)
    const normName = getNormName.name

    const sqlText = 'SELECT EXISTS (SELECT 1 FROM collegeSite WHERE major = $1)'
    const dbResult = await query(sqlText, [normName])

    if (!dbResult.rows[0].exists) {
        console.log('dne')
        const queryText = 
         `INSERT INTO collegeSite (major, urls)
          VALUES ($1, $2)`;
    


 /////////////////////////////////////////////////////////////////

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
        console.log(normName)

        await query(queryText, [normName, cleanArr])

        return cleanArr

    } else {
        const qryText = 'SELECT urls FROM collegeSite WHERE major = $1'

        const existRes = await query(qryText, [normName])

        const res = existRes.rows[0].urls
        console.log(res)
        return res
        
    }

}

export async function checkExistsDbCollege(major) {

    const getNormName = await mapMajorCode(major)
    const normName = getNormName.name

    const sqlText = 'SELECT EXISTS (SELECT 1 FROM collegeSite WHERE major = $1)'
    const dbResult = await query(sqlText, [normName])

    if (!dbResult.rows[0].exists) {
       
    }
}

searchByCollege("comp sci")
//searchByCollege("College of Liberal Arts & Sciences")



//Search by focus


