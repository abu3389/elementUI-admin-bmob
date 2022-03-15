import {Bmob,initMasterBomb,initBmob} from "@/api/baseConfig/baseConfig";


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

