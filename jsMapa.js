           var map, infoWindow;
           var latitude, longitude;
           var geocoder;
           var espol = { lat: -2.1467415, lng: -79.9666772 };
           var tmp_data;
           
           var itemRoute='';
           var itemLocality='';
           var itemCountry='';
           // var itemPc='';
           var itemSnumber='';
           
           function initMap() {
             lati = document.getElementById('lat').innerHTML;
             long= document.getElementById('lng').innerHTML;
             centro= { lat: parseFloat(lati), lng: parseFloat(long) };
              console.log(centro);
               map = new google.maps.Map(document.getElementById('map'), {
                   center: centro,
                   zoom: 15
               });
             
             
               infoWindow = new google.maps.InfoWindow;
               geocoder = new google.maps.Geocoder;
                      
           
               // GET coordinates and adress
               map.addListener('center_changed', function() {
                 latitude = map.getCenter().lat();
                 longitude = map.getCenter().lng();
           
                 document.getElementById('coordinates-lat-lng').value = latitude + ", " + longitude;
           
               });
           
               map.addListener('dragend', function() {
                 latitude = map.getCenter().lat();
                 longitude = map.getCenter().lng();
           
                 geocodeLatLng(latitude, longitude, geocoder, map);
               });
             
               
           
           }
           
           // GEOLOCATION
           function geolocation() {
               if (navigator.geolocation) {
                   navigator.geolocation.getCurrentPosition(function(position) {
                       var pos = {
                           lat: position.coords.latitude,
                           lng: position.coords.longitude
                       };
           
                       map.setCenter(pos);
                       geocodeLatLng(latitude, longitude, geocoder, map);
           
                   }, function() {
                       handleLocationError(true, infoWindow, map.getCenter());
                   });
               } else {
                   // Browser doesn't support Geolocation
                   handleLocationError(false, infoWindow, map.getCenter());
               }
             
               revealMapAndCoordinates();
           }
           
           // GEOLOCATION Error
           function handleLocationError(browserHasGeolocation, infoWindow, pos) {
               infoWindow.setPosition(pos);
               infoWindow.setContent(browserHasGeolocation ?
                                   'Error: The Geolocation service failed.' :
                                   'Error: Your browser doesn\'t support geolocation.');
               infoWindow.open(map);
           }
           
           // FIND a place
           function findPlace() {
           
               var input = document.getElementById('address-input').value;
               console.log(input);
           
               var request = {
                   query: input,
                   fields: ['name', 'geometry'],
               };
           
               service = new google.maps.places.PlacesService(map);
           
               service.findPlaceFromQuery(request, function(results, status) {
                   if (status === google.maps.places.PlacesServiceStatus.OK) {
                       map.setCenter(results[0].geometry.location);
                       console.log(results[0]);
           
                       lat = map.getCenter().lat();
                       lng = map.getCenter().lng();
           
                       geocodeLatLng(lat, lng, geocoder, map);
                   }
               });
             
               revealMapAndCoordinates();
           };
           
           // GET address
           function geocodeLatLng(latitude, longitude, geocoder, map) {
               var latlng = {lat: latitude, lng: longitude};
               var address = document.getElementById('address-input');
           
               geocoder.geocode({'location': latlng}, function(results, status) {
                   if (status === 'OK') {
                       if (results[0]) {
                           address.value = results[0].formatted_address;
                           recodeAddress(results[0].address_components);
                           passAddressToCheckout();
           
                       } else {
                           // address.innerText = 'No results found';
                       }
                   } else {
                       window.alert('Geocoder failed due to: ' + status);
                   }
               });
           }
           
           function recodeAddress(address_components) {
             console.log("recodeAdress function")
           
             let keys = Object.keys(address_components);
             tmp_data = address_components;
           
             itemRoute = '';
             itemSnumber = '';
             itemCountry = '';
             itemLocality = '';
           
             // iterate through address_component array
             for (const key of keys) {
               console.log('address_component:' + key);
           
               if (address_components[key].types == "route"){
                   console.log(": route:"+address_components[key].long_name);
                   itemRoute = address_components[key].long_name;
               }
           
               if (address_components[key].types == "locality" || address_components[key].types[0] == "locality" ){
                   console.log("town:"+address_components[key].long_name);
                   itemLocality = address_components[key].long_name;
               }
           
               if (address_components[key].types == "country" || address_components[key].types[0] == "country" ){ 
                   console.log("country:"+address_components[key].long_name); 
                   itemCountry = address_components[key].long_name;
               }
           
               // if (address_components[key].types == "postal_code_prefix"){ 
               //     console.log("pc:"+address_components[key].long_name);  
               //     itemPc = address_components[key].long_name;
               // }
           
               if (address_components[key].types == "street_number"){ 
                   console.log("street_number:"+address_components[key].long_name);  
                   itemSnumber = address_components[key].long_name;
               }
               //return false; // break the loop
             }
           }
           
           // PASS adress to Checkout
           function passAddressToCheckout() {
             var address = document.getElementById('address-input');
             // ?checkout[shipping_address][city]=Dubai
           
             let form = document.getElementById('cart-form');
             let prefillData = 'step=contact_information';
           
             if (itemRoute) {
               prefillData += "&checkout[shipping_address][address1]=" +  address.value;
               console.log(prefillData);
           
               
             }
           
             if (itemLocality) {
               prefillData += "&checkout[shipping_address][city]=" + itemLocality;
               console.log(prefillData);
             }
           
             // if there are any data to prefill add question mark
             if (prefillData) {
               form.action = "?" + prefillData;
               console.log(form.action);
             }
           
             // There is no option to prefill country. And Google does not share Zip code
           
           }
           
           function revealMapAndCoordinates() {
             
             let mapDiv = document.getElementById('map-column');
             let coordinatesDiv = document.getElementById('coordinates');
             
             mapDiv.style.display="block";
             
             coordinatesDiv.classList.remove("hidden");
             
           }
           
        
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBGhvLIKDkKTKmSUyE6EmdQwWu4uz3Fbqc&libraries=places&callback=initMap"
           async defer></script> 
