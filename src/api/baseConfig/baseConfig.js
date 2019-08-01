import Bmob from "hydrogen-js-sdk";
import {SecretKey ,SafeKey, ApplicationID, RESTAPIKey} from "@/api/baseConfig/appkey";

Bmob.initialize(SecretKey,SafeKey);//2.0.0 ↑
//  Bmob.initialize(ApplicationID,RESTAPIKey);//2.0.0 ↓

var initMasterBomb=function (MasterKey) {
    Bmob.initialize(SecretKey,SafeKey,MasterKey);//2.0.0 ↑
    // Bmob.initialize(ApplicationID,RESTAPIKey,MasterKey);//2.0.0 ↓
}

var initBmob=function(){
    Bmob.initialize(SecretKey,SafeKey);//2.0.0 ↑
    // Bmob.initialize(ApplicationID,RESTAPIKey);//2.0.0 ↓
}
export {Bmob,initMasterBomb,initBmob}
