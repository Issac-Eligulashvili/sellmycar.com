// app.js
require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const {createClient} = require('@supabase/supabase-js');
const app = express();
const cors = require('cors');

// Initialize supabase client
const supabase = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_KEY
)

app.post('/login', async(req,res) => {
     const {email, password} = req.body;

     try {
          const {user, session, error} = await supabase.auth.signInWithPassword({
               email, password
          });

          if (error) {
               return res.status(400).json({error: error.message});
          }

          res.status(200).json({
               message: 'Login successful',
               user,     // Contains user data (e.g., email, id, etc.)
               session,  // Contains session data (e.g., access_token)
          });
     } catch(error) {
          res.status(500).json({error: "Internal Server Error"});
     }
})

app.post('/register/dealership', async(req, res) => {
     let {
          email, 
          password, 
          username, 
          longitude, 
          latitude, 
          zip_code 
     } = req.body;

     try {
          if (zip_code) {
               const response = await fetch(` https://nominatim.openstreetmap.org/search?postalcode=${zip_code}&country=us&format=json`);
               const data = response.json();
               if (data && data.length > 0) {
                    const location = data[0];
                    longitude = parseFloat(location.lon);
                    latitude = parseFloat(location.lat);
               } else {
                    throw new Error("Location not found");
               }
          }
     
          async function getStateAndCountry() {
               const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitutde}&format=json`);
               const data = response.json();
     
               const city = data.address.city || data.address.town || data.address.village;
               const country = data.address.country;
               const state = data.address.state;
     
               return {
                    city: city,
                    state: state,
                    country: country
               }
          }
     
          const {city, state, country} = getStateAndCountry();
     
          const {data, error} = supabase.auth.signUp({
               email: email, 
               password: password,
               options: {
                    data: {
                         isDealer: true,
                    }
               }
          })

          if (error) {
               return res.status(500).json({error: error.message});
          }
     
          await supabase.from('profiles').insert({
               id: data.user.id,
               username: username,
               isDealer: true,
               latitude: latitude,
               longitude: longitude,
               city: city,
               country: country,
               state: state,
               zip_code: zip_code ? zip_code : null,
          })
     } catch(error) {
          res.status(500).json({error: "Internal Server Error"});
     }    
})

app.post('/register', async(req, res) => {
     
})

// Middleware to handle CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
     res.send('Hello from the backend!');
});

// Start server on PORT defined in .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
});
