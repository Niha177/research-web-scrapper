import { PlaywrightCrawler, Configuration} from 'crawlee'
import {findFacultyInfo} from './findInfo.js'
import {mainPageLocate} from "./getMajorLink.js"
import {query} from "../createDb.js"

export async function getFacultyInfo(links) {

    const config = Configuration.getGlobalConfig()
    config.set('purgeOnStart', true)

    const crawler = new PlaywrightCrawler({

        async requestHandler({request, page, enqueuelinks, log}) {

            //const profiles = 
        }
    })

}
