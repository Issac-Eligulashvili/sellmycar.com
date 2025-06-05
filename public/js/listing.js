const app = Vue.createApp({
     data() {
          return {
               data: {},
               step: 1,
               formData:{
                    make: '',
                    model: '',
                    number: '',
                    owner_email: '',
                    trim: '',
                    year: null,
                    vin: '',
                    miles: null,
                    ext_color: '',
                    ext_condition: '',
                    int_color: '',
                    ovr_condition: '',
                    inAccident: null,
                    ownership: '',
                    payoff: '',
                    bank: '',
                    months: null,
                    additional_info: '',
                    owner_name:'',
               },
          }
     },
     methods: {
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
          incrementStep() {
               this.step++;
          },
            formatLabel(key) {
      return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    },
    getInputType(value) {
      if (typeof value === 'number') return 'number';
      if (typeof value === 'boolean') return 'checkbox';
      if (key === 'owner_email') return 'email';
      return 'text';
    },
    isTextArea(key) {
      return ['additional_info'].includes(key);
    },
    isSelect(key) {
      return ['ext_condition', 'ovr_condition', 'int_color', 'ownership', 'inAccident'].includes(key);
    },
    getOptionsForKey(key) {
      const options = {
        ext_condition: ['Excellent', 'Good', 'Fair', 'Poor'],
        ovr_condition: ['Excellent', 'Good', 'Fair', 'Poor'],
        int_color: ['Black', 'Gray', 'Beige', 'Red', 'Other'],
        ownership: ['Owned', 'Financed', 'Leased'],
        inAccident: ['Yes', 'No'],
      };
      return options[key] || [];
    },
     },
     mounted() {
          const encoded = sessionStorage.getItem("user_data")
          
          if (encoded) {
               try {
                    const userData = JSON.parse(atob(decodeURIComponent(encoded)))
                    this.data = userData
               } catch (err) {
                    console.error(err)
               }
          }
     },
}).mount("#app")