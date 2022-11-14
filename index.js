const express = require('express')
const cors = require('cors')
const cheerio = require('cheerio')
const bodyParser = require('body-parser')
const axios = require('axios')
const path = require('path')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/', express.static(path.join(__dirname + '/public')))

const shastaScrape = async () => {
    return await axios('https://www.dfg.ca.gov/m/FishPlantings/Details?county=Shasta&water=Shasta%20Lake').then((res) => {
        let html = res.data
        const $ = cheerio.load(html)
        const data = $('.map_desc', html)
        let stocking = []
        let times = []
        data.each(function() {
            let stock = $(this).text().split('\n')
            stock.forEach(str => {
                stocking.push(str)
            })
        })
        stocking.splice(0, 1)
        stocking.splice(1, 1)
        stocking.forEach((string) => {
            let data = string.split(' ')
            if(data[4] == 'trout'){
                times.push(data)
            }
        })

        return {
            times: times
        }
    })
}
const scrape = async () => {
    return await axios('https://www.norcalfishreports.com/fish_plants.php').then((res) => {
        let html = res.data
        const $ = cheerio.load(html)
        const data = $('.panel', html)
        let fishD = []
        let raw = []
       data.each(function() {
        raw.push($(this).text())
       })
       raw.forEach(() => {
        let table = []
        let county = []
        let currentIndex = 0
        $('td', html).each(function() {
            table.push($(this).text())
        })

        $('h3', html).each(function() {
            county.push($(this).text())
        })

        table.forEach(el => {
            if (el == 'CDFW' || el == '&nbsp;' || el == ' ' || el == '1000' || !el || el.length < 5 || el == '') table.splice(table.indexOf(el), 1)
        })

        county.forEach((c) => {
                let lake = table[currentIndex]
                let fish = table[currentIndex+1]
                if(lake == 'Rainbow Trout'){
                    fish = table[currentIndex]
                    lake = table[currentIndex+1]
                }else if(fish.split(' ')[0] == 'Lake' || fish.split(' ')[1] == 'Reservoir' || fish.split(' ')[2] == 'Reservoir' || fish.split(' ')[3] == 'Reservoir'){
                    lake = table[currentIndex+1]
                    fish = table[currentIndex]
                }
                table.splice(0, 4)
                fishD.push({
                    county: c,
                    lake: lake,
                    fish: fish,
                })
                currentIndex++
        
        })
       })
       fishD.forEach((e) => {
        if(e.county == 'Yuba County'){
            fishD.splice(fishD.indexOf(e), fishD.length)
        }
       })
        return {
            fishD: fishD
        }
    })
}

app.get('/shasta', async (req, res) => {
    let data = await shastaScrape()
    res.send(data)
})

app.get('/fishwebscrape', async (req, res) => {
    let data = await scrape()
    res.send(data)
})

app.listen(6900, console.log('started'))