const get = (id) => {
    return document.getElementById(id)
}

let shastaDiv = get('lake-shasta')
let randosDiv = get('randos')

let times;
let randos;

fetch('./shasta').then(res => res.json()).then(async json => {
    times = await json.times
    console.log(times)
    times.forEach(time => {
        time = time.join()
        let div = document.createElement('div')
        div.innerHTML = time
        shastaDiv.append(div)
    })
})

fetch('./fishwebscrape').then(res => res.json()).then(async json => {
    randos = await json.fishD
    randos.forEach(fishObj => {
        let div = document.createElement('div')
        let h1 = document.createElement('h1')
        let h3 = document.createElement('h3')
        let p = document.createElement('p')
        h1.innerHTML = fishObj.county
        h3.innerHTML = fishObj.lake
        p.innerHTML = fishObj.fish
        div.append(h1, h3, p)
        randosDiv.append(div)
    })
})