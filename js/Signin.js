

// getting the users location based on button press
$('#getLocationButton').on("click", ()=> {
     let coords = {longitude: null, latitide: null};
     if (!navigator.geolocation) {
          alert("Geolocation is not supported by your browser!");
          return;
     }

     navigator.geolocation.getCurrentPosition(
          (position)=> {
               coords = position.coords;
               console.log(coords);
          },
          (error) => {
               switch (error.code) {
                    case error.POSITION_UNAVAILABLE:
                      alert('Location information is unavailable.');
                      break;
                    case error.TIMEOUT:
                      alert('The request to get user location timed out.');
                      break;
                    default:
                      alert('An unknown error occurred.');
                      break;
               }
          }
     )
     
})