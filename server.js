// app.js
require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");
const cookieParser = require('cookie-parser');
const authMiddleware = require("./authMiddleware");
const { createClient } = require('@supabase/supabase-js');

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(cookieParser());

// Initialize supabase client
const supabaseService = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

app.post('/login', async(req,res) => {
     const {email, password} = req.body;
     try {
          const {data , error} = await supabaseService.auth.signInWithPassword({
               email: email,
               password: password,
          });
          if (error) {
               return res.status(400).json({error: error.message});
          }

          res.cookie("sb-access-token", data.session.access_token, {
               httpOnly: true,
               sameSite: "Lax",
               maxAge:1000 * 60 * 60
          })

          res.cookie("sb-refresh-token", data.session.refresh_token, {
               httpOnly: true,
               sameSite: "Lax",
               maxAge:1000 * 60 * 60 * 24 * 7
          })

          res.status(200).json({
               message: 'Login successful',
               user: data.user,     // Contains user data (e.g., email, id, etc.)
               session: data.session,  // Contains session data (e.g., access_token)
          });
     } catch(error) {
          res.status(500).json({error: "Internal Server Error"});
     }
})

app.get('/user/data',authMiddleware, async (req, res) => {
     const id = req.user.id;
     console.log(id);
     try {
          const {data, error} = await supabaseService.
          from("profiles").
          select("*").
          eq("id", id);
          console.log(data);
          if (error) {
               return res.status(500).json({message: "error fetching data"}, error);
          }

          return res.status(200).json({ data: data[0] });
     } catch (err) {
          return res.status(500).json({ message: 'Server error', err });
     }
})

app.get('/user/listings', authMiddleware, async(req, res) => {
     const id = req.user.id;
     try {
          const {data, error} = await supabaseService.from("listings").select("*").eq("owners_id", id);
          if (error) {
               return res.status.json({message: "error fetching data"}, error);
          }
          return res.status(200).json({data: data});
     } catch (err) {
          return res.status(500).json({message: "Server error"}, err);
     }
})

app.post('/register/dealership', async(req, res) => {
     await register(res, req, true);
})

app.post('/register', async(req, res) => {
     await register(res, req, false);
})

app.post('/', async(req, res) => {
     res.status(200).json({message: "Hello!"})
})

async function register(res, req, isDealer) {
     let {
          email, 
          password, 
          username, 
          longitude, 
          latitude, 
          zip_code 
     } = req.body;


     try {
          // If there is a ZIP get the coordinates
          if (zip_code && !latitude) {
               const response = await fetch(` https://nominatim.openstreetmap.org/search?postalcode=${zip_code}&country=us&format=json`);
               const data = await response.json();
               if (data && data.length > 0) {
                    const location = data[0];
                    longitude = parseFloat(location.lon);
                    latitude = parseFloat(location.lat);
               } else {
                    throw new Error("Location not found");
               }
          }
          // get country+state from the lon and lat
          async function getStateAndCountry() {
               const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
               const data = await response.json();
     
               const city = data.address.city || data.address.town || data.address.village;
               const country = data.address.country;
               const state = data.address.state;
     
               return {
                    city: city,
                    state: state,
                    country: country
               }
          }
     
          const {city, state, country} = await getStateAndCountry();
     

          const {data, error} = await supabaseService.auth.signUp({
               email: email, 
               password: password,
               options: {
                    data: {
                         isDealer: isDealer,
                    }
               }
          })

          

          if (data.session) {

               res.cookie("sb-access-token", data.session.access_token, {
                    httpOnly: true,
                    sameSite: "Lax",
                    maxAge:1000 * 60 * 60
               })
     
               res.cookie("sb-refresh-token", data.session.refresh_token, {
                    httpOnly: true,
                    sameSite: "Lax",
                    maxAge:1000 * 60 * 60 * 24 * 7
               })
          }
     
          const {error: ProfileError} = await supabaseService.from('profiles').insert({
               id: data.user.id,
               username: username,
               isDealer: isDealer,
               latitude: latitude,
               longitude: longitude,
               city: city,
               country: country,
               state: state,
               zip_code: zip_code ? zip_code : null,
          })

          res.status(200).json({ message: 'Registration successful', userId: data.user.id });
     } catch(error) {
          console.error("Register error:", error);  // Add this line
          res.status(500).json({error: "SUSSY"});
     }    
}

// Middleware to handle CORS and JSON parsing


// Start server on PORT defined in .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
});
