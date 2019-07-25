import Bmob from "@/api/baseConfig/baseConfig";
import {SecretKey ,SafeKey} from "@/api/baseConfig/appkey";

var User = {
    //获取用户信息
    get: (params)=> {
        return new Promise((resolve, reject) => {
            let query=Bmob.Query("_User");
            query.limit(params.pageSize);
            query.skip((params.nowPage-1)*params.pageSize);
            query.order("-createdAt");
            //模糊查询
            if(params.type && params.word){
                // query.equalTo(params.type,"==", { "$regex": "/" + params.word + "/i" });//模糊查询目前只提供给付费套餐会员使用
                query.equalTo(params.type, "==", params.word);
            }
            //分页查找
            query.find().then(res => {
                //模糊查询
                if(params.type && params.word){
                    // query.equalTo(params.type,"==", { "$regex": "/" + params.word + "/i" });//模糊查询目前只提供给付费套餐会员使用
                    query.equalTo(params.type, "==", params.word);
                }
                //统计总数
                query.count().then(count => {
                    let newData={
                       results:res,
                       count
                    }
                    resolve(newData)
                })
            })
        })
    },
    //注册用户
    set: (params)=>{
        return new Promise((resolve, reject) => {
            Bmob.User.register(params).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            });
        })
    },
    //更改用户信息
    update:(params,MasterKey)=>{
        return new Promise((resolve, reject) => {
            console.log(params,MasterKey)
            //初始化时，多传入一个参数
            Bmob.initialize(SecretKey , SafeKey, MasterKey);
            const query = Bmob.Query('_User');
            for (var key in params) {
                query.set(key, params[key]);
            }
            //bmob会报错 因为找不到本地存储
            // if(!window.localStorage.getItem("bmob")){
            //     window.localStorage.setItem("bmob",'')
            // }
            query.save().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            });
        })
    },
    //删除用户
    delete:()=>{

    }
}
export {
    User
}

