const bangumiData = require('bangumi-data')
const blacklist = require('./blacklist.json')

var bangumiAnimeItems = bangumiData.items

var seasonPattern = /[第| ]\s?(.)+?\s?[季|章|期|话]/
var strangeCharactersPattern = /[!|！|△|Δ|∬|Ⅲ|Ⅱ|☆|，|,|。|\.|、|・|：|:|？|\?|’|-|·|~|★|'|×|＋|♪|♥|Ψ|＊|♡|♭|○|-|＆|√|◎|+|◆|∀|°|Ω|‧|…|&|♯|%|"|#|@]/g
var nonHanziPattern = /[^\u4E00-\u9FA5a-zA-Z0-9 ]/gu
var hanziLatinPattern = /([\u4E00-\u9FA5]+)\s*[a-zA-Z0-9]+/
var extraSpaces = /  +/g

var animeNames = []

for (let anime of bangumiAnimeItems) {
    let zhHansName = anime["titleTranslate"]?.["zh-Hans"]?.[0]
    if (!zhHansName) {
        // filter out anime names that have no zh-cn translates
        continue
    }
    // filter out strange suffix characters
    zhHansName = zhHansName.replaceAll(strangeCharactersPattern, " ")
    // filter out seasons
    let seasonMatch = zhHansName.match(seasonPattern)
    if (seasonMatch) {
        let seasonNumber = seasonMatch[1]
        if (seasonNumber === '1' || seasonNumber === '一') {
            zhHansName = zhHansName.replace(seasonPattern, "")
        } else {
            continue
        }
    }
    if (/[2-9]$/.test(zhHansName)) {
        continue
    }
    // filter out broken data
    if (zhHansName.includes("&lt;")) {
        continue
    }
    // filter out film series, "another story", OVA etc.
    if (zhHansName.includes("剧场版")) {
        continue
    }
    if (zhHansName.includes("外传")) {
        continue
    }
    if (zhHansName.includes("OVA") || zhHansName.includes("OAD")) {
        continue
    }
    if (zhHansName.includes("Ä")) {
        continue
    }
    // handling symmetric characters
    for (let ch of ['～', '〜', '~', '-', '（', '－', '〈', '/', '【', '「', '[', '“', '；']) {
        zhHansName = zhHansName.split(ch)[0]
    }
    // takes only hanzi when the pattern is hanzi + latin chars
    let hanziMatch = zhHansName.match(hanziLatinPattern)
    if (hanziMatch) {
        zhHansName = hanziMatch[1]
    }
    // handling extra spaces by previous steps
    zhHansName = zhHansName.replaceAll(extraSpaces, " ")
    // filter out names with length <= 2 or length >= 14
    if (zhHansName.length <= 2) {
        continue
    }
    if (zhHansName.length >= 14) {
        continue
    }
    // blacklist rules
    for (rule of blacklist) {
        if (zhHansName.match(rule)) {
            continue
        }
    }
    // strip whitespaces
    zhHansName = zhHansName.trim()
    animeNames.push(zhHansName)
}

// filter out duplications
animeNamesSet = new Set(animeNames)
for (let name of animeNamesSet) {
    if (nonHanziPattern.test(name)) {
        console.warn(name, name.length)
    }
    // if (/[2-9]/.test(name)) {
    //     console.warn(name, name.length)
    // }
    console.log(name)
}