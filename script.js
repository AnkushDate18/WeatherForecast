
class city{
    constructor(){}
    async getLatLong(cityName){
        let key = apiKey.key
        const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${key}`;
        fetch(API_URL).then(response => response.json()).then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon, name } = data[0];
            console.log(data)
            const a = new wheather()
            a.getTodaysWheather(name, lat, lon)
        }).catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
    }
}
class wheather{
    constructor(){
        this.key = apiKey.key
    }
    async getTodaysWheather(name, lat, lon){
        console.log(name,lat,lon)
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.key}`)
        .then((res)=> res.json())
        .then((data)=>{
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });
            this.renderData(fiveDaysForecast,name)
        })
    }
    async renderData(fiveDays,name){
        let main = document.getElementById('todysForecast')
        let sub = document.getElementById('todysForecast1')
        document.getElementById('todysForecast').innerHTML = ''
        document.getElementById('todysForecast1').innerHTML = ''
        console.log(fiveDays)
        fiveDays.forEach((obj,idx)=>{
            if(idx === 0){
                const elem = `<div id="todysForecast">
                <div id="todysForecast" class="row p-2 m-2">
                    <h3>${name}</h3>
                    <div class="col-md-4 p-1">
                        <h3 class="text-warning">${obj.dt_txt.split(" ")[0]}</h3>
                        <div class="row text-success">
                            <div class="col-md-6">Temperature</div>
                            <div class="col-md-6">${(obj.main.temp - 273.15).toFixed(2)}°C</div>
                        </div>
                        <div class="row text-primary">
                            <div class="col-md-6">Wind</div>
                            <div class="col-md-6">${obj.wind.speed} m/s</div>
                        </div>
                        <div class="row text-warning">
                            <div class="col-md-6">Humidity</div>
                            <div class="col-md-6">${obj.main.humidity}%</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <img src="https://openweathermap.org/img/wn/${obj.weather[0].icon}@4x.png" alt="weather-icon"" alt="img" class="img-fluid">
                    </div>
                </div>
                 </div>`
                main.insertAdjacentHTML("beforeend",elem)
            }else{
                const elem = `<div class="col-md-4 shadow p-4">
                <h3>${obj.dt_txt.split(" ")[0]}</h3>
                <img src="https://openweathermap.org/img/wn/${obj.weather[0].icon}@4x.png" alt="weather-icon"" alt="img" class=" w-40 h-40" alt="img" class="img-fluid">
                <div class="row text-success">
                    <div class="col-md-6">Temperature</div>
                    <div class="col-md-6">${(obj.main.temp - 273.15).toFixed(2)}°C</div>
                </div>
                <div class="row text-primary">
                    <div class="col-md-6">Wind</div>
                    <div class="col-md-6">${obj.wind.speed} m/s</div>
                </div>
                <div class="row text-warning">
                    <div class="col-md-6">Humidity</div>
                    <div class="col-md-6">${obj.main.humidity} m/s</div>
                </div>
            </div>`
                sub.insertAdjacentHTML("beforeend",elem)
            }
        })
    
    }
    async getUserCoordinates () {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const { latitude, longitude } = pos.coords; 
                const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${this.key}`;
                fetch(API_URL).then(response => response.json()).then(data => {
                    const { name } = data[0];
                    const cityService = new city()
                    cityService.getLatLong(name)
                    getWeatherDetails(name, latitude, longitude);
                })
            },
            error => {
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Geolocation denied. Please reset location permission to grant access again.");
                } else {
                    alert("Geolocation request error. Please reset location permission.");
                }
            });
    }
}
const searchCity = async () =>{
    let cityName = document.getElementById('city').value;   
    if(!cityName){
        alert('plz enter correct city name .') 
        return;
    }
    const cityService = new city();
    await cityService.getLatLong(cityName)
    document.getElementById('city').value = '';
}
const getUserloc = async() =>{
    const locationService = new wheather()
    await locationService.getUserCoordinates()
}
//ad