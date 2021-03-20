const request = require('request')
const cheerio = require('cheerio')
const encoding = require('encoding')
const fs = require('fs')

// function parsed(err, response, buffer, id) {

//     var body = encoding.convert(buffer, 'UTF-8')
//     const $ = cheerio.load(body)
//     const data = []

//     const today_menu = $('.dnesne_menu .jedlo_polozka')
//     const otherday_menu = $('.ostatne_menu .jedlo_polozka')

//     // ponuka denneho menu na aktualny den
//     if (today_menu.length > 0) {
//         data.push({
//             name: 'ponuka denného menu na ' + n,
//             price: '4,30 EUR'
//         });

//         today_menu.each(function (idx, el) {
//         const element = $(el)
//         data.push({
//             name: element.find('div').text().trim(),
//             price: element.find('span').text().trim()
//             })
//         })
//     } else {
//         data.push({
//             name: '* ponuka denného menu nebola zverejnena ',
//             price: ''
//         })
//     }

//     // ponuka denneho menu na ostatne dni
//     if (otherday_menu.length > 0) {
//         data.push({
//             name: 'ponuka denného menu na ' + readDate,
//             price: '4,30 EUR'
//         });

//         otherday_menu.each(function (idx, el) {
//         const element = $(el)
//         data.push({
//             name: element.find('div').text().trim(),
//             price: element.find('span').text().trim()
//             })
//         })
//     } else {
//         data.push({
//             name: '* ponuka denného menu nebola zverejnena ',
//             price: ''
//         })
//     }
// }


const restaurant = (restaurant, callback, buffer) => {
    const url = 'https://restauracie.sme.sk/restauracia/' + encodeURIComponent(restaurant) + '/denne-menu'
    // const url = 'https://restauracie.sme.sk/restauracia/gurman-servis-racianska_1010-nove-mesto_2653/denne-menu'

    var body = encoding.convert(buffer, 'UTF-8')
    const $ = cheerio.load(body)
    const data = []

    const today_menu = $('.dnesne_menu .jedlo_polozka')
    const otherday_menu = $('.ostatne_menu .jedlo_polozka')

    // date vars
    var date = new Date()

    // days in week array
    var weekday = new Array(7)

    weekday[0] = 'Nedela',
    weekday[1] = 'Pondelok',
    weekday[2] = 'Utorok',
    weekday[3] = 'Streda',
    weekday[4] = 'Štvrtok',
    weekday[5] = 'Piatok',
    weekday[6] = 'Sobota'

    var n = weekday[date.getDay()]

    date.setDate(new Date().getDate()+1)
    let readDate = (new Intl.DateTimeFormat('sk-SK', { dateStyle: 'full' }).format(date).toUpperCase())

    // ponuka denneho menu na aktualny den
    if (today_menu.length > 0) {
        data.push({
            name: 'ponuka denného menu na ' + n,
            price: '4,30 EUR'
        });

        today_menu.each(function (idx, el) {
        const element = $(el)
        data.push({
            name: element.find('div').text().trim(),
            price: element.find('span').text().trim()
            })
        })
    } else {
        data.push({
            name: '* ponuka denného menu nebola zverejnena ',
        })
    }
    console.log(today_menu)
    console.log(data)
    console.log(url)

    // ponuka denneho menu na ostatne dni
    if (otherday_menu.length > 0) {
        data.push({
            name: 'ponuka denného menu na ' + readDate,
        });

        otherday_menu.each(function (idx, el) {
            const element = $(el)
            data.push({
                name: element.find('div').text().trim(),
            })
        })
    } else {
        data.push({
            name: '* ponuka denného menu nebola zverejnena ',
        })
    }

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to restaurant services!', undefined)
        } else if (body === 0) {
            callback('Unable to find restaurant ID. Try another search.', undefined)
        } else {
            callback(undefined, {
                menu: data
            })
            // fs.writeFileSync('restauracie.html', data)
        }
    })
}


module.exports = restaurant