const baseDate = new Date(2022, 10, 4);

exports.handler = (event, context, callback) => {
    const currentDate = new Date()
    currentDate.setHours(currentDate.getHours() + 9);
    
    if(baseDate.getTime() < currentDate.getTime()){
        const message = "가입할 수 있는 시간이 지났습니다";
        console.log(message);
        const error = new Error(message);
        // Return error to Amazon Cognito
        callback(error, event);
    }
    
    callback(null, event);
};
