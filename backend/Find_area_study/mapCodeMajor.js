import {query} from "../createDb.js"
import {uiucColleges} from "./collegeName.js"

export async function checkMajor(major) {

    const Regex = /\s*\b(?:and)\b\s*|\s*[\+&]\s*/

    let results = []
    if(Regex.test(major)) {
        results = await mapPlusMajors(major)
    } else {
        results = await mapRegMajor(major)
    }

    
    const finalResult = await cleanData(results)
    const nameList = getFullName(finalResult)
    console.log(nameList)
    return nameList

}

function getFullName(arr) {
    
    return arr.map((item) => {
        for(let x = 0; x < uiucColleges.length; x++) {
            if(item === uiucColleges[x].code) {
                return uiucColleges[x].fullName
            }
        }
    })
}

export async function mapMajorCode(major) {

    const queryText =
     `SELECT code, similarity(name, $1) AS match_score
    FROM majors
    ORDER BY match_score DESC
    LIMIT 1;
     `;

     const dbResult = await query(queryText, [major])

     if (dbResult.rows && dbResult.rows.length > 0) {

        const matchedCode = dbResult.rows[0].code;

        console.log(matchedCode)

        return matchedCode

        //
    } else {
        return null
    }
}



export async function mapPlusMajors(major) {

    const Regex = /\s*\b(?:and)\b\s*|\s*[\+&]\s*/

    const parts = major.split(Regex)

    const part1 = parts[0]
    const part2 = parts[1]

    const codeMain = await mapMajorCode(part1)
    const codeSupp = await mapMajorCode(part2)

    return [codeMain, codeSupp]

}

export async function mapRegMajor(major) {

    const codeMain =[await mapMajorCode(major)]
    return codeMain
}



export async function cleanData(arr) {

    let cur = arr
    let key = false
    for(let x= 0; x < arr.length; x++) {
        if(arr[x].includes(',')) {
            key = true
            let seperate = arr[x].split(',').map(item => item.trim())
            cur.splice(x, 1)

            cur = [...cur, ...seperate]
        }
    }
   
        const cleanArr = [...new Set(cur)]
      
        return cleanArr
   
    
}

checkMajor("comp scie + adv")


