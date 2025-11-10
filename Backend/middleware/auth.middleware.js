var jwt = require('jsonwebtoken');


const authMiddleware = (role) => {
    return (req , res , next) =>{
             //check the token if token is valid  allow next
                     let token = req.headers?.authorization?.split(" ")[1];

                     if(token) {
                        var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

                        if(decoded){
                            if(role.includes(decoded.role)) {
                               req.user = decoded.userId;
//                               res.status(201).json({ msg: "successfully  through auth middleware" });
                               next();
                            }else{
                               res.status(401).json({ msg: "unauthorized ......" });
                            }
                        }else{
                            res.status(401).json({ msg: "try login again" });
                        }
                     } else{
                        res.status(401).json({ msg: "not through auth middleware" });
                     }
            }
  }






module.exports = authMiddleware;