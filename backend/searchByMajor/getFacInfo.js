import { PlaywrightCrawler, Configuration} from 'crawlee'
import {filterFacultyLinkResults} from './findInfo.js'
import {mainPageLocate} from "./getMajorLink.js"

export async function getFacultyInfo(links) {

    const config = Configuration.getGlobalConfig()
    config.set('purgeOnStart', true)

    const crawler = new PlaywrightCrawler({

        async requestHandler({request, page, enqueuelinks, log}) {

            //const profiles = 
        }
    })

}
