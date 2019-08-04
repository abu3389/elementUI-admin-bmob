<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 欢迎登陆！</p>
            </el-form>
        </div>
        <vue-particles color="#fff" :linesWidth="2"></vue-particles>
    </div>
</template>

<script>
    import {User} from '@/api/user'
    import MD5 from 'js-md5';
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: 'admin',
                    password: '123456'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //发送登陆请求
                        let sendData=Object.assign({},this.ruleForm)
                        sendData.password=MD5(sendData.password);
                        User.loginIn(sendData).then((res)=>{//登录用户
                            console.log(res)
                            if(res.status=="100"){//成功
                                this.$message({
                                    type: 'success',
                                    message: res.message
                                });
                                //用户信息存入本地存储
                                localStorage.setItem('ms_username',JSON.stringify(res.data));
                                //跳转管理界面
                                this.$router.push('/');
                            }else{//失败
                                this.$message({
                                    type: 'error',
                                    message: res.message
                                });
                            }
                        }).catch(err => {
                            console.log(err)
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>