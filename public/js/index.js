$.ajax({
     type: "GET",
     url: "/auth/status",
     headers: {
          'Content-Type': 'application/json',
          
     },
     xhrFields: {
          withCredentials: true,
     },
     success: function (response) {
          console.log(response);
     },
     error: function (xhr, status, error) {
          if(xhr.status === 401) {
               window.location.href='/login.html'
          }
     }
});