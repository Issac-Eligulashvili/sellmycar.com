$(document).ready(function () {
     $.ajax({
          type: "GET",
          url: "/user/data",
          headers: {
               'Content-Type': 'application/json',
               
          },
          xhrFields: {
               withCredentials: true,
          },
          success: function (response) {
               console.log(response);
               const data = response.data;
               console.log(data);
               if (data.isDealer) {
                    window.location.href = "/dealer.html"
               } else {
                    window.location.href = "/user.html";
               }
          },
          error: function (xhr, status, error) {
               if(xhr.status === 401) {
                    window.location.href='/login.html'
               }
               
          }
     });
});

