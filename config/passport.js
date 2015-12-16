var LocalStrategy = require('passport-local').Strategy;
var pg = require('pg');
var conString = "postgres://localhost:5432/testdb";
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {

		done(null, user.user_id);

	});

	passport.deserializeUser(function(id, done) {

		pg.connect(conString, function(err, client, done2) {

			client.query("SELECT * FROM test_user WHERE user_id=$1", [id], function(err, result) {

				done2();
				done(err, result.rows[0].email);

			});

		});

	});

	passport.use(
			'local-signup',
			new LocalStrategy({
				usernameField : "email",
				passwordField : "password",
				passReqToCallback : true
			},
			function(req, email, password, done) {
				pg.connect(conString, function(err, client, done2) {
					client.query("SELECT * FROM test_user WHERE email=$1", [email], function(err, result) {

						if (err) {
							return done(err);
						}

						if (result.rows.length > 0) {
							return done(null, false);
						} else {

							var hashedPassword = bcrypt.hashSync(req.body.password, null, null)

							client.query("INSERT INTO test_user (email, password) VALUES($1, $2)", [email, hashedPassword], function(err, result){
								if (err) {
									console.log("BIG ERROR", err);
								}

								client.query("SELECT * FROM test_user WHERE email=$1", [email], function(err, result) {
									
									done2();
									var data = {
										user_id: result.rows[0].user_id,
										email: result.rows[0].email,
										password: result.rows[0].password
									};

									return done(null, data);

								});
							});
						}
					});
				});
			}
			
			)
			)

	passport.use(
			'local-login',
			new LocalStrategy({

				usernameField : 'email',
				passwordField : 'password', 
				passReqToCallback : true

			},
			function(req, email, password, done) {
				console.log("email", email);
				pg.connect(conString, function(err, client, done2) {
					client.query("SELECT * FROM test_user WHERE email=$1", [email], function(err, result) {

						done2();

						if (err) {
							return done(err);
						}

						if (!result.rows.length) {
							return done(null, false, req.flash('loginMessage', 'No email found'));
						}

						console.log("passmatch: ", bcrypt.compareSync(password, result.rows[0].password));
						if (!bcrypt.compareSync(password, result.rows[0].password)) {
							return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
						}
						
						return done(null, result.rows[0]);
				});
			});
		})
	);
}
