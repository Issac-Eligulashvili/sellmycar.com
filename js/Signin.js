let coords = {longitude: null, latitude: null};

// getting the users location based on button press
$('#getLocationButton').on("click", ()=> {
     if (!navigator.geolocation) {
          alert("Geolocation is not supported by your browser!");
          return;
     }

     navigator.geolocation.getCurrentPosition(
          (position)=> {
               coords.latitude = position.coords.latitude;
               coords.longitude = position.coords.longitude;
          },
          (error) => {
               switch (error.code) {
                    case error.POSITION_UNAVAILABLE:
                      alert('Location information is unavailable.');
                      break;
                    case error.TIMEOUT:
                      alert('The request to get user location timed out.');
                      break;
               }
          }
     )
});

$('#submit').on("click", function(e) {
     e.preventDefault();

     let user = {};
     user.email = $("#email").val();
     user.password = $("#password").val();
     user.username = $("#username").val();
     if (coords.longitude && coords.latitude) {
          user.longitude = coords.longitude;
          user.latitude = coords.latitude;
     }
     if ($("#zip").val().length == 5 ) {
          user.zip_code = $("#zip").val();
     }
     $.ajax({
          type: "POST",
          url: "http://localhost:3000/register",
          data: JSON.stringify(user),
          headers: {
               'Content-Type': 'application/json',
               
          },
          xhrFields: {
               withCredentials: true,
          },
          success: function (response) {
               // window.location.href="/login.html"; 
          }
     });
})