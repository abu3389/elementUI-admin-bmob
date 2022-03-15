/*
 * @Author: zhanghan
 * @Date: 2019-07-26 02:04:09
 * @LastEditors: zhanghan
 * @LastEditTime: 2022-03-15 09:13:10
 * @Descripttion:
 */
import Bmob from "hydrogen-js-sdk";
import {
    SecretKey,
    SafeKey,
    ApplicationID,
    RESTAPIKey
} from "@/api/baseConfig/appkey";

Bmob.initialize(SecretKey, SafeKey); //2.0.0 ↑
//  Bmob.initialize(ApplicationID,RESTAPIKey);//2.0.0 ↓

var initMasterBomb = function(MasterKey) {
    Bmob.initialize(SecretKey, SafeKey, MasterKey); //2.0.0 ↑
    // Bmob.initialize(ApplicationID,RESTAPIKey,MasterKey);//2.0.0 ↓
};

var initBmob = function() {
    Bmob.initialize(SecretKey, SafeKey); //2.0.0 ↑
    // Bmob.initialize(ApplicationID,RESTAPIKey);//2.0.0 ↓
};
export { Bmob, initMasterBomb, initBmob };
