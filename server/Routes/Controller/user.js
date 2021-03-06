var authorize_user = function(req, res){
    console.log('# API called: Authorize user');
    console.log('Headers: ', req.headers);

    //Validation
    //Token check
    //Authority check

    var _submittedUserData = req.body;
    var database = req.app.get('database');
    if( database.db){
        database.userModel.find_by_email()
    }

    if( database.db){
        database.UserModel.findByEmail(_submittedUserData.email, function(err, results){
            if(err)
                return res.status(500).end();

            if( results.length > 0){
                console.log('Find user matched with %s', _submittedUserData.email);
                var _user = new database.userModel({email: _submittedUserData.email});
                var AUTHENTICATED = _user.authenticate( _submittedUserData.password,
                                                        results[0]._doc.salt, results[0]._doc.hashedPassword);
                var _userData = {userName: results[0]._doc.userName,
                                authority: results[0]._doc.authority};
                // Token?

                if( AUTHENTICATED){
                    console.log('Password match!');
                    return res.status(200).json({data: _userData}).end();
                }
                else{
                    console.log('Password unmatch!');
                    return res.status(400).end();
                }
            }
            else
                return res.status(500).end();
        });
    }
    else
        return res.status(500).end();
}

var register_user = function(req, res){
    console.log('# API called: Register user');

    var _submittedUserData = req.body;

    var database = req.app.get('database');
    if( database.db){
        var _userData = new database.userModel({
            email: _submittedUserData.email
            , userName: _submittedUserData.userName
            , hashedPassword: _submittedUserData.password
        });

        // Save user object
        _userData.save( function(err){
            if(err)
                return res.status(500).json({error: 'Error occurred in creating model'}).end();
            console.log('# Successfully register user data');
            console.log( _submittedUserData);
            return res.status(201).end();
        });
    }
    else
        return res.status(500).end();
}

module.exports.authorize_user = authorize_user;
module.exports.register_user = register_user;