function login(e) {
     e.preventDefault();

     let user = {};
     user.email = $("#email").val();
     user.password = $("#password").val();
     $.ajax({
          type: "POST",
          url: "/login",
          data: JSON.stringify(user),
          headers: {
               'Content-Type': 'application/json',
               
          },
          xhrFields: {
               withCredentials: true,
          },
          success: function (response) {
              sessionStorage.setItem("userID", response.user.id);
              window.location.href ="/index.html  "
          },
          error: function(xhr,status,error) {
               console.log(xhr);
          }
     })
}

$('#submit').on("click", (e) => login(e));

$(document).on("keydown", function(e) {
     if (e.key === "Enter") {
          login(e);
     }
});