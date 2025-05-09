$(document).ready(function () {
     
});

const app = Vue.createApp({
     data(){
          return {
               data: {},
               isLoading: true,
               listings: []
          }
     },
     methods: {
          getData() {
               $.ajax({
                    type: "GET",
                    url: "/user/data",
                    headers: {
                         'Content-Type': 'application/json',
                         
                    },
                    xhrFields: {
                         withCredentials: true,
                    },
                    success: (response) => {
                         this.data = response.data;
                         this.isLoading = false;
                    },
                    error: function (xhr, status, error) {
                         if(xhr.status === 401) {
                              window.location.href='/login.html'
                         }
                    }
               });
          },
          formatState(state) {
               const states = {
                    "Alabama": "AL",
                    "Alaska": "AK",
                    "Arizona": "AZ",
                    "Arkansas": "AR",
                    "California": "CA",
                    "Colorado": "CO",
                    "Connecticut": "CT",
                    "Delaware": "DE",
                    "Florida": "FL",
                    "Georgia": "GA",
                    "Hawaii": "HI",
                    "Idaho": "ID",
                    "Illinois": "IL",
                    "Indiana": "IN",
                    "Iowa": "IA",
                    "Kansas": "KS",
                    "Kentucky": "KY",
                    "Louisiana": "LA",
                    "Maine": "ME",
                    "Maryland": "MD",
                    "Massachusetts": "MA",
                    "Michigan": "MI",
                    "Minnesota": "MN",
                    "Mississippi": "MS",
                    "Missouri": "MO",
                    "Montana": "MT",
                    "Nebraska": "NE",
                    "Nevada": "NV",
                    "New Hampshire": "NH",
                    "New Jersey": "NJ",
                    "New Mexico": "NM",
                    "New York": "NY",
                    "North Carolina": "NC",
                    "North Dakota": "ND",
                    "Ohio": "OH",
                    "Oklahoma": "OK",
                    "Oregon": "OR",
                    "Pennsylvania": "PA",
                    "Rhode Island": "RI",
                    "South Carolina": "SC",
                    "South Dakota": "SD",
                    "Tennessee": "TN",
                    "Texas": "TX",
                    "Utah": "UT",
                    "Vermont": "VT",
                    "Virginia": "VA",
                    "Washington": "WA",
                    "West Virginia": "WV",
                    "Wisconsin": "WI",
                    "Wyoming": "WY"
               };
               return states[state];
          },
          getListings() {
               $.ajax({
                    type: "GET",
                    url: "/user/listings",
                    headers: {
                         'Content-Type': 'application/json',
                         
                    },
                    xhrFields: {
                         withCredentials: true,
                    },
                    success: (response) => {
                         this.listings = response.data;
                         this.isLoading = false;
                    },
                    error: function (xhr, status, error) {
                         if(xhr.status === 401) {
                              window.location.href='/login.html'
                         }
                    }
               });
          }
     },
     mounted() {
          this.getData();
          this.getListings();
     },
     watch: {
          data(newData) {
               console.log(newData);
          },
          listings(newListings) {
               console.log(newListings)
          }
     }     
}).mount("#app");