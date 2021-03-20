console.log('client side js is loaded')

const lunchForm = document.querySelector('form')
const search = document.querySelector('input')
const result = document.querySelector('#myData')

lunchForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const menu = search.value

    fetch('/restaurant?menu=' + menu).then( (response) => {
        response.json().then( (data) => {
            if (data.error) {
                result.classList.add('error')
            } else {
                result.textContent = menu.data
                console.log(data)
            }
        })
    })
})

// lunchForm.addEventListener('submit', (e) => {
//     e.preventDefault()

//     const menu = search.value

//     fetch('/restaurant?menu=' + menu)
//         .then(function (response) {
//             return response.json()
//         })
//         .then(function (data) {
//             appendData(data)
//             console.log(data)
//         })
//         .catch(function (err) {
//             console.log('error: ' + err)
//         })

//     function appendData(data) {
//         const mainContainer = document.getElementById('myData')
//         for (var i = 0; i < data.length; i++) {
//             var div = document.createElement('div')
//             div.innerHTML = '' + data[i].name
//             mainContainer.appendChild(div)
//         }
//     }
// })