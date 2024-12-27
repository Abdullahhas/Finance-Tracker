// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.session.user) {  // Assuming you store the user object in the session
      return res.redirect("/login");  // Redirect to login if not authenticated
    }
    next();  // Proceed to the next middleware/route handler
  }
  
  module.exports = isAuthenticated;  // Export the middleware
  