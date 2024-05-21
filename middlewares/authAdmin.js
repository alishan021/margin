
exports.adminSessionNo = async (req, res, next) => {
    try{
        if (!req.session.admin ) {
            return res.status(302).redirect('/admin/login');
        }
        next();
    }
    catch(error){
        console.log('error : ' + error );
    }
}




exports.adminSessionYes = async(req,res,next)=>{
    try{
        if(req.session.admin){
            return res.redirect('/dashboard');
        }
        return next()
    }catch(error){
        console.error(error)
    }
}