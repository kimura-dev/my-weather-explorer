'use strict';

let mapReady = false;

function onStartButtonClick(){
	$('header').show();
	$('#map').show();
	$('#instruction').show();
	$('#intro').hide();
	$('#floating-panel').show()
}

/*----------------------------------------------*/
	/*// CALLS SEARCHIPSTACK() OUTPUTS DATA */
/*-----------------------------------------------*/


$(function onPageReady(){
	console.log('page ready, preparing to open app');
	$('#instruction').hide();
	$('#map').hide();
	$('#info').hide();
	$('#weather-results').hide();
	$('#floating-panel').hide()
	$('#startAppBtn').click(onStartButtonClick);

	let interval = setInterval(function(){
		console.log('testing map ready:', mapReady);
		if( mapReady ){
			searchIpStack();
			clearInterval(interval);
		}
	}, 100);

})
function initMap(){
	console.log('initMap called');
	mapReady = true;
}


/*-------------------------------------------*/
	/* GEOLOCATES & CALLS GETGOOGLEMAP() 
/*-------------------------------------------*/
function searchIpStack(){

	$.getJSON("https://api.ipstack.com/check?access_key=c6ee8187642a24e73533d2395851c34c", function(data){
		let country = data.country_name;
		let ip = data.ip;
		let lat = data.latitude;
		let long = data.longitude;
		let state = data.region_name;//state
	    let city = data.city;
		let countryCode = "flag-icon flag-icon-"+data.country_code.toLowerCase();
		
		getGoogleMaps(lat,long);

	}).fail(function(){
		alert('Weather Coordinates Application will be back shortly!')
	})
}
/*---------------------------------------------*/
	/* Gets Google Map & ADDS EVENT LISTENER
/*---------------------------------------------*/
function getGoogleMaps(lat,long){
	let yourPosition = new google.maps.LatLng(lat, long);
	let mapOptions = {
		zoom: 10,
		center: yourPosition,
		minZoom: 3,
		maxZoom: 18,
		mapTypeControl:true,
		mapTypeControlOptions: {
			style:google.maps.MapTypeControlStyle.DROPDOWN_MENU,
			mapTypeIds:['roadmap','terrain','satellite','hybrid'],
			position: google.maps.ControlPosition.TOP_RIGHT
		},

	}

	let map = new google.maps.Map(document.getElementById('map'), mapOptions);
	let markers = [];
	 let geocoder = new google.maps.Geocoder();

	 document.getElementById('submit').addEventListener('click',function handleSearchEvent(){
	 	geocodeAddress(geocoder,map);
	 });

	function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
	    	if (status === 'OK') {
	    		$('#address').val('').focus();
	    		placeMarkerAndPanTo(results[0].geometry.location, map);
			} else {
	        	alert('Geocode was not successful for the following reason: ' + status);
	      	}

        });
    }
/*------------------------------------------------*/
	/* Displays weather info on the maps click
/*------------------------------------------------*/

	/*let infoWindow = new google.maps.InfoWindow({
		content : showResults();
	})*/
	map.addListener('click', function(e) {
      	placeMarkerAndPanTo(e.latLng, map);
      	//InfoWindow.open(map,marker);
    });
  
	function placeMarkerAndPanTo(latLng, map) {
		/*Clear all markers first*/ 
		markers.forEach(function(marker){
			marker.setMap(null)
		})
		var marker = new google.maps.Marker({
		  	position: latLng,
		  	map: map
		});

		markers.push(marker)

	    map.panTo(latLng);
	    lat = latLng.lat();
	    long = latLng.lng();
		getWeatherResults(lat,long);
		//marker.setMap(null);			
	}
}
/*------------------------------------------------*/
	/* Retrieves and outputs openweather map api  */
/*------------------------------------------------*/

function getWeatherResults(lat,long){
	$.ajax({
		url: 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&units=imperial&APPID=a30e90ff71187c10af9d6d60fdda44bd',
		type:'GET',
		dataType: 'jsonp',
		success: showResults

	}).fail(function(){
		alert('Weather API will be back shortly!');
	})
}
	
function showResults(data){
	let newCity =  data.name;
	let newCountryCode = "flag-icon flag-icon-"+data.sys.country.toLowerCase();
	$('#mySidenav').html(`
  		<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a> 
		<h3 class="current">Weather for <span id="newFlag" class="${newCountryCode}"></span>${newCity}, ${data.sys.country} </h3>
		<hr>
		<ul>
			<li class="top-space"><p>Weather:<span>${data.weather[0].main}</span></p></li>
			<li><p>Description:<span><img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">${data.weather[0].description}</span><p></li>
			<li><p>Temperature:<span>${data.main.temp}&#8457</span></p></li>
			
			<li><p>Pressure:<span>${data.main.pressure}<span>hpa</span></span></p></li>
			<li><p>Humidity:<span>${data.main.humidity}%</span></p></li>
			<li><p>Min-Temp:<span>${data.main.temp_min}&#8457</span></p></li>
			<li><p>Max-Temp:<span>${data.main.temp_max}&#8457</span></p></li>
			<li><p>Wind Speed:<span>${data.wind.speed} m/s</span></p></li>
			<li><p>Wind Direction:<span>${data.wind.deg}&deg</span></p></li>
			<li><p>Visibliity:<span>${data.visibility}</span></p></li>
			<li><p>Clouds:<span>${data.clouds.all} okta</span></p></li>
		</ul>`);
	$('#forecast').html(`Weather Forecast for <span id="newFlag" class="${newCountryCode}"></span> ${newCity}`);

	openNav();
};


/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    $("#mySidenav").css('left','0');
    $("#main-box").css('margin-left','250px');
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.left = "-250px";
    document.getElementById("main-box").style.marginLeft = "0";
}