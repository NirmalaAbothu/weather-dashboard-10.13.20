//DOM reference variables
console.log("connected to script file");
var submitEl = $("#button");
var inputEL = $("#txtSearch");
var messageEL = $("#msg");
var listEL = $(".list-group");
var fiveDayEL = $("#5day");
const nameEl = document.getElementById("city-name");
const currentPicEl = document.getElementById("current-pic");

var cityEl = $(".city");
var windEl = $(".wind");
var humidityEl = $(".humidity");
var tempEl = $(".temp");
var uvindexEL = $(".uvindex")
var $currentDay = $("#currentDay");
var currentDate = moment().format('l');;
var resultEL = $(".temperature");
var forecastELs = document.querySelectorAll(".forecast");
var humidityEl1 = $(".humidity1")
var testEL = $(".test");
var containerEL = $(".container");

//retrieve cities from local storage
var cityList = JSON.parse(localStorage.getItem("cities")) || [];

//function to display error message when user click on submit button without 
// entering city in input box
function displayMessage(type,message)
{
    messageEL.text(message);
    messageEL.attr("class",type);

}
// function to display cities
function renderCities(){
    console.log("render function called");    
listEL.empty();
if(JSON.parse(localStorage.getItem("cities")))
{
//looping thru the city array to display each city
for(var i=0;i<cityList.length;i++)
{
    var button = $("<button>");
    button.addClass("city")
    button.attr("data-name",cityList[i]);
button.text(cityList[i]);
listEL.append(button);
}
}

}

//function to get uvindex from weather api by passing latitude and longitude as 
// parameters
function getUVIndex(lat,lon)
{

uvindexEL.empty();
    
    var queryURL ="https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + 
    "&lon=" + lon + "&appid=00ca04ab09444ea47ef6c4428f3606b7&cnt=1";
    lat+"&lon="+lon;
   
    $.ajax({
        url: queryURL,
        method: 'GET'        
    }).then(function(response){
console.log(response[0].value);
var result=response;
console.log(result);
var uvindex = response[0].value;
            var bgcolor;
            if (uvindex <= 3) {
                bgcolor = "green";
            }
            
            else {
                bgcolor = "red";
            }
            var uvdisp = $("<p>").attr("class", "card-text").text("UV Index: ");
            uvdisp.append($("<span>").attr("class", "uvindex").attr("style", ("background-color:" + bgcolor)).text(uvindex));
            uvindexEL.append(uvdisp);            
    })
}

// function to retrieve five day forecast by passing city as parameter
function getFiveDayForecastWeather(city)
{
    fiveDayEL.addClass("show");
    $("#forecast").empty();
    console.log(city);
    var queryURL ="https://api.openweathermap.org/data/2.5/forecast?q="+city+
    "&appid=00ca04ab09444ea47ef6c4428f3606b7";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        console.log(response);
        let results = response.list;
    console.log(results)
        for (let i = 0; i < results.length; i++) {
            var dateObj = new Date();                  
            if(results[i].dt_txt.indexOf("12:00:00") !== -1){

              // get the temperature and convert to fahrenheit 
              let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
              let tempF = Math.floor(temp);
      
              const card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
              const cardBody = $("<div>").addClass("card-body p-3 forecastBody")            
           
              const cityDate = $("<h4>").addClass("card-title").text(moment(results[i].dt,"X").format('l'));            
              
              const temperature = $("<p>").addClass("card-text forecastTemp").text("Temp: " + tempF + " °F");
              const humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");
      
              const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")
      
              cardBody.append(cityDate,image, temperature, humidity);
              card.append(cardBody);
              $("#forecast").append(card);
      
            }
            }       
                
            });
        } 
 
//function to display current city weather
var displayWeather = function(data){
    console.log(data);   
    nameEl.innerHTML = data.name + " (" + currentDate + ") ";
            var weatherPic = data.weather[0].icon;
            currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
    
    windEl.text("Wind Speed: "+data.wind.speed + "MPH");   
    humidityEl.text("Humidity: "+data.main.humidity + "%");
    tempEl.html("Temperature: "+
         convertKtoF(parseFloat(data.main.temp)) + "&deg;F"
    );
    var long = data.coord.lon;
    console.log(long);   
    var lat = data.coord.lat;
    console.log(lat);
    getUVIndex(lat,long);
    var city = data.name;
    getFiveDayForecastWeather(city);
    console.log(data.sys.id);
}
    //function to convert temp to F
    function convertKtoF(tempInKelvin) {        
        return ((tempInKelvin - 273.15) * 9) / 5 + 32;
   }

//function to get current city weather passing city as a parameter
var getWeather = function(city){
    var queryURL ="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=00ca04ab09444ea47ef6c4428f3606b7";
    $.ajax({
url: queryURL,
method: "GET"
    }).then(function(response){
        console.log(response);
        var data = response;
        displayWeather(data);
});
}
// submit button click event
    submitEl.on("click",function(event){
        console.log("button clicked");
        event.preventDefault();
        var city = inputEL.val().trim();
        if(city === "")
        {
            displayMessage("error","please enter city name");     
        }
        
        if(city != "")
        {
        cityList.push(city);
        messageEL.addClass("hide");
        localStorage.setItem("cities",JSON.stringify(cityList));
        getWeather(city);
        inputEL.val("");
        renderCities();
        }
    });

    //displayCityForecast function
    function displayCityForecast()
    {
        var city = $(this).attr("data-name");
        getWeather(city);
    }

    //displayCityForecast function will b called when user click on one of the 
    //city in cityList
    $(document).on("click",".city",displayCityForecast)
    // calling renderCities function
    renderCities();
    // if cityList length is greater than 0 ,then last citie's  weather details
    // will be displayed as last search.
    if(cityList.length>0)
    {
        getWeather(cityList[cityList.length-1]);
    }


