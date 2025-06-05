const app = Vue.createApp({
     data() {
          return {
               data: {},
               currentStep: 1,
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
                    inAccident: '',
                    ownership: '',
                    payoff: '',
                    bank: '',
                    months: null,
                    additional_info: '',
                    owner_name:'',
               },
               invalidFields: {},
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
          getInputType(value,key) {
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
          shouldShowField(key) {
               const conditionalFields = ["payoff", "bank", "months"];
               const showIfOwnedOrFinanced = ["Leased", "Financed"];
               if (conditionalFields.includes(key)) {
                    console.log("here");
               return showIfOwnedOrFinanced.includes(this.formData.ownership);
               }
               return true;
          },
          validateForm() {
               this.invalidFields = {}
               let valid = true;
               for (const key in this.formData) {
               if (!this.shouldShowField(key)) continue;

               const val = this.formData[key];
               if (
                    val === null ||
                    val === undefined ||
                    (typeof val === 'string' && val.trim() === '')
               ) {
                    this.invalidFields[key] = true;
                    valid = false;
               }
               }

               if (!valid) {
                    alert('Please fill in all required fields.');
               }
               return valid;
          },
          goToNextStep() {
               if (this.currentStep == 1) {
                    if (this.validateForm()) {
                    this.currentStep++;
                    // optionally clear invalid fields for next step
                    this.invalidFields = {};
                    } else {
                         alert('Please fill in all required fields.');
                    }
               }
          },
          clearInvalid(key) {
               if (this.invalidFields[key]) {
                    this.$delete(this.invalidFields, key);
               }
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
     watch: {
          formData: function (newForm) {
               console.log("changed");
          }
     },
}).mount("#app")