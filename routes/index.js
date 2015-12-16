module.exports = function(app, passport) {

	app.get('/', function(req, res, next) {

		res.render('index');

	});

	app.post('/user_login', passport.authenticate('local-login', {
		successRedirect : '/placeholder',
		failureRedirect: '/',
		failureFlash: true
	}), function(req, res) {
			console.log("heelo");
			if (req.body.remember) {
				 req.session.cookie.maxAge = 1000 * 60 * 3;
			} else {
				req.session.cookie.expires = false;
			}
			res.redirect('/placeholder');
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/placeholder',
		failureRedirect : '/',
		failureFlash : true
	}));

	app.get('/register', function(req, res) {
		res.render('register');
	});

	app.get('/placeholder', isLoggedIn, function(req, res){ 
		res.render('placeholder');
	});

};

function isLoggedIn(req, res, next) {

	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}

