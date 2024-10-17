//使用jwt进行请求头的校验
function checkToken(){
    return async function(ctx,next){
        //获取token
        let token=ctx.request.header.username;
        //校验token
        let decode =ctx.app.jwt.verify(token,ctx.app.config.jwt.secret);
        console.log(decode)
        if(decode.username=='1148370650')//这里需要后台验证
        {
            //可以操作
            await next();
        }
        else
        {
            ctx.body={
                code:40000,
                msg:'用户校验失败!'
            }
        }
    }
}
module.exports=checkToken;