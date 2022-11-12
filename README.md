# The fish api that scrapes multiple websites to find out the stocking schedule of fish in california


Currently there are **2** endpoints

## /shasta

method: get
returns: array holding arrays of string(stocking time)

`js
example: fetch('./shasta').then((res) => {
let times = []
  let data = res.json()
  data.times.forEach(time => {
    time = time.join()
    times.push(time)
  })
})`

## /fishwebscrape

method: get
returns: array of objects(contain county, lake, fish)

`js
example: fetch('./fishwebscrape').then((res) => {
  let data = res.json()
  data.fishD.forEach(fishObj => {
    handleC(fishObj.county)
    handleL(fishObj.lake)
    handleF(fishObj.fish)
  })
})`


### Note that this is absolute trash and it even mixes up lakes and fish sorry about trash code and docs but whatever
