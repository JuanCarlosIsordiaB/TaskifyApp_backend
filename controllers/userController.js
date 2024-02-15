import { emailForgetPassword, emailRegister } from '../helpers/emails.js';
import generateId from '../helpers/generateId.js';
import generateJWT from '../helpers/generateJWT.js';
import User from '../models/User.js';


const register = async(req, res) => {
    //No duplicated user
    const {email} = req.body;
    const existsUser = await User.findOne({email});

    if(existsUser){
        const error = new Error('User already registered');
        return res.status(400).json({msg: error.message});
    }

    try {
        const user = new User(req.body);
        user.token = generateId();
        await user.save();
        emailRegister({
            email: user.email,
            name: user.name,
            token: user.token
        }); //Sending Email
        res.json({msg: 'User Created, Check your email to confirm your account'});
    } catch (error) {
        console.log(error);
    }

}

const authenticate = async(req, res) => {

    const {email, password} = req.body;

    //check if the user is register
    const user = await User.findOne({email});
    if(!user){
        const error = new Error('User not found');
        return res.status(404).json({msg: error.message})
    }

    //check if the user is confirmed
    if(!user.confirmed){
        const error = new Error('User not confirmed');
        return res.status(403).json({msg: error.message})
    }

    //check if the password
    if(await user.checkPassword(password)){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user._id) //Creating JWT with the user's id
        })
    }else{
        const error = new Error('Email or Password Incorrect');
        return res.status(403).json({msg: error.message})
    }
}

const confirm = async(req, res) => {
    const {token} = req.params;
    const user = await User.findOne({token});
    if(user){
        
        try {
            user.confirmed = true;
            user.token = '';
            await user.save(); //Saving the user in MongoDB with the changes
            res.json({msg:'User Confirmed'})
        } catch (error) {
            console.log(error);
        }
    }else{
        const error = new Error('Invalid Token !!');
        return res.status(403).json({msg: error.message})
    }
}

const forgetPassword = async(req,res) => {
    const { email} = req.body;

    const user = await User.findOne({email});
    if(!user){
        const error = new Error('User not found');
        return res.status(404).json({msg: error.message})
    }

    try {
        user.token = generateId();
        await user.save();

        emailForgetPassword({
            email: user.email,
            name: user.name,
            token: user.token
        });

        res.json({msg: 'We send you an email with the instructions.'})
    } catch (error) {
        console.log(error);
    }

}

const checkToken = async(req,res) => {
    const { token} = req.params;

    const validToken = await User.findOne({token});

    if(validToken){
        res.json({msg: 'valid token'});
    }else{
        const error = new Error('Invalid Token')
        return res.status(404).json({msg: error.message});
    }

}

const changePassword = async(req,res) => {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({token});

    if(user){
       user.password = password; 
       user.token = '';
       try {
        await user.save();
        res.json({msg: 'Password Modified Correctly'});
       } catch (error) {
         console.log(error);
       }
       
    }else{
        const error = new Error('Invalid Token !!');
        return res.status(404).json({msg: error.message})
    }
}

const profile = async(req,res) => {
    const { user } = req;

    res.json(user);
}

export{
    register,
    authenticate,
    confirm,
    forgetPassword,
    checkToken,
    changePassword,
    profile
}