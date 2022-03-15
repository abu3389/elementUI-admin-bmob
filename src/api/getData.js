/*
 * @Author: zhanghan
 * @Date: 2019-07-26 02:04:09
 * @LastEditors: zhanghan
 * @LastEditTime: 2022-03-15 09:11:59
 * @Descripttion:
 */
import {Bmob} from "@/api/baseConfig/baseConfig";


var Product = {
    get:function () {
        Bmob.Query("products").find().then(res => {
            console.log(res)
            return res;
        })
    },
    set:function () {

    },
    delete:function(){

    }
}
export {
    Product
}

