import {Bmob,initMasterBomb,initBmob} from "@/api/baseConfig/baseConfig";

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
            initMasterBomb(MasterKey);
            const query = Bmob.Query('_User');
            for (var key in params) {
                query.set(key, params[key]);
            }
            query.save().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            });
        })
    },
    //删除用户
    delete:(objectId,MasterKey)=>{
        return new Promise((resolve, reject) => {
            console.log(objectId,MasterKey)
            //初始化时，多传入一个参数
            initMasterBomb(MasterKey);
            const query =Bmob.Query('_User');
            query.destroy(objectId).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    //上传文件
    upFile:(fileObj)=>{
        return new Promise((resolve, reject) => {
            const fileAry = fileObj.target.files
            console.log("file",fileAry)
            // var file= Bmob.File(fileAry[0].name, [fileAry[0]]);;
            var file
            for(let item of fileAry){
                console.log("传入SDK文件信息:",item.name,item)
                file = Bmob.File(item.name, item);
                // file = Bmob.File(item.name, [item]);
            }
            console.log("传入完成开始上传:")
            //初始换Bomb防止文件累加上传
            // initBmob()
            file.save().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
            //清除文本值方便下次触发change
            fileObj.target.value = null;
        })
    }
}
export {
    User
}

