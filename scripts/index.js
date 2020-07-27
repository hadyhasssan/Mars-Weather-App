const API_KEY = 'KYgyAZBLAJ0h8U9K6bhM3ugrZOzQej4CryYgbs7a';
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`


const previousWeatherToggle = document.querySelector('.show-previous-weather');

const previousWeather = document.querySelector('.previous-weather')

previousWeatherToggle.addEventListener('click', () => {
    previousWeather.classList.toggle('show-weather')
} )

const currentSolNumber = document.querySelector('[data-current-sol]')
const currentDate = document.querySelector('[data-current-date]')
const currentTempHigh = document.querySelector('[data-current-temp-high]')
const currentTempLow = document.querySelector('[data-current-temp-low]')
const currentWindSpeed = document.querySelector('[data-wind-speed]')
const currentWindDirectionTxt = document.querySelector('[data-wind-direction-text]')
const currentWindDirection = document.querySelector('[data-wind-direction-arrow]')



let selectedFirstSol

getMarsWeather().then(sols => {
    selectedFirstSol = sols.length -1
    displaySelectedSol(sols)

})

function displaySelectedSol(sols) {
    console.log(sols)
    const selectedSol = sols[selectedFirstSol];
    currentSolNumber.innerText = selectedSol.sol
    currentDate.innerText = displayDate(selectedSol.date)
    currentTempHigh.innerText = displayTemp(selectedSol.maxTemp)
    currentTempLow.innerText = displayTemp(selectedSol.minTemp)
    currentWindSpeed.innerText = displaySpeed(selectedSol.windSpeed)
    currentWindDirectionTxt.innerText = selectedFirstSol.windDrectionCardinal
    currentWindDirection.style.setProperty('--direction', `${selectedSol.windDirectionDegrees}deg`)

}



function displayDate(date) {
    return date.toLocaleDateString(
        undefined,
        {weekday:'short', day: 'numeric', month: 'short', year: 'numeric'}
    )
}

function displayTemp(temp) {
    return Math.round(temp)
}
function displaySpeed(speed) {
    return Math.round(speed)

}



//GETING MODIFIED DATA
function getMarsWeather() {
    return fetch(API_URL)
        .then(res => res.json())
        .then(data =>{
            const {
                sol_keys,
                validity_checks,
                ...solData
            } = data
            return Object.entries(solData).map(([sol, data]) =>{
                return{
                    sol: sol,
                    maxTemp: data.AT.mx,
                    minTemp: data.AT.mn,
                    windSpeed: data.HWS.av,
                    windDirectionDegrees: data.WD.most_common.compass_degrees,
                    windDrectionCardinal: data.WD.most_common.compass_point,
                    date: new Date(data.First_UTC)

                }
            })
        })
}