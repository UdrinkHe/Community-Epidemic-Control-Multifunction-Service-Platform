//时间戳-》本地时间的转换
function getLocalTimeString(timeNumber){
    if(typeof timeNumber!='number')
          {
            return timeNumber
          }
            let time=new Date(timeNumber);
            let hourNumber=time.getHours();
            let secondNumber=time.getSeconds();
            let minuteNumber=time.getMinutes();
            if(hourNumber<10)
            {
              hourNumber="0"+hourNumber;
            }
            if(secondNumber<10)
            {
              secondNumber="0"+secondNumber;
            }
            if(minuteNumber<10)
            {
              minuteNumber="0"+minuteNumber;
            }
            return (time.getFullYear()+"年"+(time.getMonth()+1)+"月"+time.getDate()+"日"+" "+hourNumber+":"+minuteNumber+":"+secondNumber)
}
module.exports={
    getLocalTimeString:getLocalTimeString
}