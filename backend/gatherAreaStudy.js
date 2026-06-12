import {CheerioCrawler} from 'crawlee'
import {query} from "./createDb.js"

export async function mapMajors() {
    const crawler = new CheerioCrawler({
        async requestHandler({$, request}) {
            const majors = $(".tbl_degreeprograms tbody tr")

            majors.each(async (i, elem) => {
                const data = $(elem).find('td')

                const name = $(data[0]).text().trim()
                const id = $(data[1]).text().trim()
               
                console.log(id)

                try {
                    const queryText = `
                    INSERT INTO majors (name, code)
                    VALUES($1, $2)`;

                    const vals = [name, id]

                    await query(queryText, vals)
                    console.log("success")

                } catch(err) {
                    console.log("error with logging data")
                    
                }
            })

             
        }, maxRequestsPerCrawl: 50

    })

    await crawler.run(['https://catalog.illinois.edu/degree-programs/undergraduate_index/'])

    
}

mapMajors();