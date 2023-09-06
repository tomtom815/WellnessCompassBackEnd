
const User = require('../models/User');


const userInfo = async(userNameId) => {
    const result = await User.find({
        username: userNameId
    });
    const userObject = {
        "firstName": result[0].firstName,
        "lastName": result[0].lastName,
        "userName": result[0].username,
        "height": result[0].height,
        "weight": result[0].weight,
        "steps": result[0].steps,
    }
    return userObject;
}


export const data = await userInfo("McMeow");
//test export  offunction but it doesn't work on browser side because of the require. 
//keep this for later potentially

