<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-news"></i> 用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- 成功提示 -->
            <el-alert
                :title="boxInfo.boxMsg"
                :type="boxInfo.msgType"
                v-show="boxInfo.showMsg && boxInfo.msgType=='success'"
                closable
                effect="dark">
            </el-alert>
            <div class="select-box">
                <el-select style="width:120px;margin:0 20px;" v-model="value" filterable placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-input style="width:200px;" placeholder="请输入内容"></el-input>
                <el-button @click="handleEdit('userForm')" style="margin:20px;" type="primary" icon="el-icon-plus">添加用户</el-button>
            </div>
            <el-table :data="tableData"  v-loading="loading" border style="width: 100%">
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="password" label="密码"></el-table-column>
                <el-table-column label="邮箱">
                    <template slot-scope="scope">
                        <span>{{scope.row.email}} </span><br>
                        <span>是否验证：{{scope.row.emailVerified}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="password" label="手机号">
                    <template slot-scope="scope">
                        <span>{{scope.row.mobilePhoneNumber}} </span><br>
                        <span>是否验证：{{scope.row.mobilePhoneNumberVerified}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建日期"></el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit('userForm',scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="boxInfo.status=='add'? '添加用户' : '修改用户'" :visible="boxInfo.showBox" :label-width="boxInfo.labelWidth" :close-on-click-modal="false"  @close="cancelBox('userForm')" width="450px">
            <!-- 错误提示 -->
            <el-alert
                :title="boxInfo.boxMsg"
                :type="boxInfo.msgType"
                v-show="boxInfo.showMsg && boxInfo.msgType=='error'"
                closable
                effect="dark">
            </el-alert>
            <el-form v-if="boxInfo.showBox" :model="userForm" ref="userForm" :rules="rules" >
                <!-- 用来防止浏览器自动填充表单 -->
                <input type="password" style="width: 0;position: absolute;border:none"/>
                <input type="text" style="width: 0;position: absolute;border:none"/>
                <!-- 用来防止浏览器自动填充表单 -->
                <el-form-item label="用户名"  prop="username">
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="userForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userForm.phone"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelBox('userForm')">取消</el-button>
                <el-button type="primary" @click="submitForm('userForm')">{{boxInfo.status=='add'? '添加' : '修改'}}</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                userForm:{},
                boxInfo:{
                    showBox:false,//是否显示弹窗
                    labelWidth:"100px",//弹窗宽度
                    status:"",//当前编辑状态 添加/修改
                    showMsg:false,
                    boxMsg:"",//显示盒子消息
                    msgType:"",//消息类型 error/success
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 11, message: '长度在 2 到 11个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 18, message: '长度在 6 到 18个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true,message: '请输入邮箱', trigger: 'blur' },
                        { type: 'string',pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,message: '请正确填写邮箱!', trigger: 'blur'}
                    ],
                    phone: [
                        { message: '请输入手机号', trigger: 'blur' },
                        { type: 'string',pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,message: '请正确填写手机号!', trigger: 'blur'}
                    ],
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ]
                },
                options:[
                    {
                        "value":"objectId",
                        "id":0
                    },
                    {
                        "value":"手机号",
                        "id":1
                    },
                    {
                        "value":"昵称",
                        "id":2
                    }
                ],
                value:'',   
                loading: true
            }
        },
        components:{
        },
        created() {
            this.loading = true
            setTimeout(this.getData, 1000)
        },
        methods: {
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                Bmob.Query("_User").find().then(res => {
                    console.info(res)
                    this.tableData = res
                    this.loading = false
                })
            },
            handleEdit(formName,index,row) {
                this.boxInfo.showBox=true;
                this.userForm={};
               if(!index){//添加
                    this.boxInfo.status="add"
               }else{//编辑
                    this.boxInfo.status="edit"
               }
            },
            handleDelete(index, row) {
                /*this.idx = index;
                this.delVisible = true;*/
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.boxInfo.showBox=false;
                        this.boxInfo.showMsg=true;
                        this.boxInfo.msgType='success'
                        this.boxInfo.boxMsg="添加成功！"
                        return true;
                    } else {
                        this.boxInfo.showMsg=true;
                        this.boxInfo.msgType='error'
                        this.boxInfo.boxMsg="添加失败！请重新输入！带*为必填项"
                        return false;
                    }
                });
            },
            cancelBox(formName){
                this.boxInfo.showBox = false;//关闭弹窗
            },
            resetForm(formName) {//重置表单
                this.$refs[formName].resetFields();
            },

        }
    }

</script>

<style scoped>
</style>
