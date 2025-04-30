const {createClient} = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

function authMiddleware(req, res, next) {
     const token = req.cookies["sb-access-token"];
     if (!token) {
          return res.status(401).json({error: "Unauthorized: No token found"});
     }

     const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
          global: {
               headers: {
                    Authorization: `Bearer ${token}`
               }
          }
     })

     req.supabase = supabase;
     next();
}

module.exports = authMiddleware;