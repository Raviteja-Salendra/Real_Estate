// if the authentication/any other wrongs is wrong we will send error by creating errorhandler in this way

export const errorHandler =(statusCode,message)=>{
    const error =new Error();
    error.statusCode=statusCode;
    error.message=message;
    return error;
}


//creation of our own error
// next(errorHanddler(520,"creating own error"));