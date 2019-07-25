import Bmob from "hydrogen-js-sdk";
import {SecretKey,SafeKey} from "./appkey";

Bmob.initialize(SecretKey,SafeKey);

export default Bmob
