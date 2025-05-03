const {createClient} = require('@supabase/supabase-js');

const supabaseService = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function authMiddleware(req, res, next) {
     const token = req.cookies["sb-access-token"];
     const refreshToken = req.cookies['sb-refresh-token'];
     if (!token) {
          if (!refreshToken) {
          return res.status(401).json({error: "Unauthorized: No token found"});
          }

          const { data, error: refreshError } = await supabaseService.auth.refreshSession(
               { refresh_token: refreshToken }
          )

          if (refreshError || !data) {
               return res.status(401).json({ message: 'Invalid refresh token. Please log in again.' });
          }

     const {session, user} = data;

     res.cookie("sb-access-token", session.access_token, {
          httpOnly: true,
          sameSite: "Lax",
          maxAge:1000 * 60 * 60
     })

     res.cookie("sb-refresh-token", session.refresh_token, {
          httpOnly: true,
          sameSite: "Lax",
          maxAge:1000 * 60 * 60 * 24 * 7
     })

          req.user = user;
          return next();
     }

     const { data: userData, error } = await supabaseService.auth.getUser(token);

     // If the access token is invalid, try to refresh it
     if (error || !userData?.user) {
          // Try to refresh the access token if it's expired or invalid
          if (!refreshToken) {
               return res.status(401).json({ message: 'Invalid access token and no refresh token. Please log in.' });
          }

          // Refresh the access token
          const { data, error } = await supabaseService.auth.refreshSession({
               refresh_token: refreshToken
          });

          if (error || !data) {
               return res.status(401).json({ message: 'Invalid refresh token. Please log in again.' });
          }

          const { session, user } = data;

          // Set the new access token in the cookie
          res.cookie('sb-access-token', session.access_token, {
               httpOnly: true,
               sameSite: 'Lax',
               maxAge: 1000 * 60 * 60 // 1 hour
          });

          req.user = user;
          return next();
     }
     req.user = userData.user;
     return next();
}
module.exports = authMiddleware;