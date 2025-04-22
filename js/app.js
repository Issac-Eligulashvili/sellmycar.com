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
