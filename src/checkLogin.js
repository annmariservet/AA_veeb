exports.isLogin = function(req, res, next){
    if(req.session != null){
        if(req.session.userId){
            //console.log("Sees on kasutaja id: " + req.session.userId);
            next();
        } else {
            //console.log("Sessioonimuutujat pole, keegi ei ole sisse loginud.");
            return res.redirect("/signin");
        }
    } else {
        //console.log("Sessiooni ei ole!");
        return res.redirect("/signin");
    }
}