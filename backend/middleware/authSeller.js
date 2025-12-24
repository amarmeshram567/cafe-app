const jwt = require('jsonwebtoken')


const authSeller = (req, res, next) => {

    const { sellerToken } = req.cookies;

    if (!sellerToken) {
        return res.json({
            success: false,
            message: "Not Authorized"
        });
    }

    try {

        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next()
        }
        else {
            return res.json({
                success: false,
                message: "Not Authorized"
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: "Admin access only"
        })
    }
}


module.exports = authSeller