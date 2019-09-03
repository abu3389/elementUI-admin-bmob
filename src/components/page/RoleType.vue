<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-news"></i> 角色分类111</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- 成功提示 -->
            <el-alert
                :title="boxInfo.boxMsg"
                :type="boxInfo.msgType"
                v-show="boxInfo.showMsg && boxInfo.msgType=='success'"
                closable
                show-icon
                effect="dark">
            </el-alert>
            <div class="select-box" style="margin-bottom:20px">
                <el-select style="width:120px;margin:10px 20px;" v-model="searchInfo.type" filterable clearable placeholder="请选择">
                    <el-option
                        v-for="(item,index) in options"
                        :key="index"
                        :label="item.value"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-input style="width:200px;" placeholder="请输入内容" clearable v-model="searchInfo.word"></el-input>
                <el-button @click="reSetSearch" style="margin-left:15px;" round icon="el-icon-refresh-left" type="success" plain>刷新</el-button>
                <el-button @click="searchEvent" style="margin-right:20px;" round icon="el-icon-search" plain>搜索</el-button>
                <el-button @click="handleEdit" style="margin-right:20px;" icon="el-icon-plus" type="primary" plain>添加角色</el-button>
            </div>
            <el-table :data="tableData"  v-loading="loading" border style="width: 100%" ref="userTable" @row-click="rowClick">
                <el-table-column
                    type="selection"
                    width="55"
                    align="center">
                </el-table-column>
                <el-table-column label="序号" align="center" width="50px">
                    <template slot-scope="scope">
                        <span>{{scope.$index + (pageData.nowPage- 1) * pageData.pageSize + 1}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="objectId" label="ID" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column label="邮箱" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.email}} </span><br>
                        <span>是否已验证：<label :style="scope.row.emailVerified ? 'color:green' : 'color:red'">{{scope.row.emailVerified ? "已验证":"否"}}</label> </span>
                    </template>
                </el-table-column>
                <el-table-column prop="password" label="手机号" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.mobilePhoneNumber ? scope.row.mobilePhoneNumber : "暂无"}} </span><br>
                        <span>是否已验证：<label :style="scope.row.mobilePhoneNumberVerified ? 'color:green' : 'color:red'">{{scope.row.mobilePhoneNumberVerified ? "已验证":"否"}}</label> </span>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建日期" align="center" sortable></el-table-column>
                <el-table-column prop="updatedAt" label="修改日期" align="center" sortable></el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="230px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" plain @click="handleEdit($event, scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" plain @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="pageSizeChange"
                @current-change="nowPageChange"
                :current-page="pageData.nowPage"
                :page-sizes="pageData.pageSizes"
                :page-size="pageData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                background
                :total="pageData.pageTotal"
                style="margin:20px 0;text-align: center;"
                >
            </el-pagination>
        </div>
        <el-dialog :title="boxInfo.status? '修改角色' : '添加角色'" :visible="boxInfo.showBox" :label-width="boxInfo.labelWidth" :close-on-click-modal="false"  @close="cancelBox('boxInfo')" width="450px">
            <!-- 错误提示 -->
            <el-alert
                :title="boxInfo.boxMsg"
                :type="boxInfo.msgType"
                v-show="boxInfo.showMsg && boxInfo.msgType=='error'"
                closable
                show-icon
                effect="dark">
            </el-alert>
            <el-form v-if="boxInfo.showBox" :model="userForm" ref="userForm" :rules="rules" >
                <!-- 用来防止浏览器自动填充表单 -->
                <input type="password" style="width: 0;position: absolute;border:none"/>
                <input type="text" style="width: 0;position: absolute;border:none"/>
                <!-- 用来防止浏览器自动填充表单 -->
                <el-form-item label="上传头像">
                    <input type="file" ref='file' @change="head_change"  accept="image/*" style="display:none">
                    <el-avatar :src="userForm.userHead" :key="userForm.userHead"></el-avatar>
                    <el-input type="text" v-model="userForm.userHead" :disabled='true'>
                        <el-button type="primary" plain  slot="append" icon="el-icon-s-promotion" @click="uploadFile">选择文件</el-button>
                        <el-button type="danger" plain  slot="append" icon="el-icon-refresh-left" @click="reSetHead">恢复默认</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="用户名"  prop="username">
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <div v-if="!boxInfo.status">
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="userForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="rePassword">
                        <el-input type="password" v-model="userForm.rePassword"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email"></el-input>
                </el-form-item>
                <el-form-item label="是否已验证" prop="emailVerified">
                    <el-radio-group border v-model="userForm.emailVerified">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号" prop="mobilePhoneNumber">
                    <el-input v-model="userForm.mobilePhoneNumber"></el-input>
                </el-form-item>
                <el-form-item label="是否已验证" prop="mobilePhoneNumberVerified">
                    <el-radio-group border v-model="userForm.mobilePhoneNumberVerified">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="授权码" prop="masterKey" v-if="boxInfo.status">
                    <el-input v-model="userForm.masterKey"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelBox('boxInfo')">取消</el-button>
                <el-button type="primary" @click="submitForm('userForm')">{{boxInfo.status ? '修改' : '添加'}}</el-button>
            </div>
        </el-dialog>
        <el-dialog title="重置登录密码" :visible="forgetPassBox.showBox" :label-width="forgetPassBox.labelWidth" :close-on-click-modal="false"  @close="cancelBox('forgetPassBox')" width="450px">
            <el-form v-if="forgetPassBox.showBox" :model="forgetForm" ref="forgetForm" :rules="rules" >
                <el-form-item label="输入新密码" prop="newPassword">
                        <el-input type="password" v-model="forgetForm.newPassword"></el-input>
                    </el-form-item>
                <el-form-item label="授权码" prop="masterKey">
                    <el-input v-model="forgetForm.masterKey"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelBox('forgetPassBox')">取消</el-button>
                <el-button type="primary" @click="submitForgetForm('forgetForm')">重置密码</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {User} from '@/api/user'
    import MD5 from 'md5';
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.userForm.rePassword !== '') {
                        this.$refs.userForm.validateField('rePassword');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.userForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                tableData: [],//用户列表
                pageData:{//分页数据
                   nowPage:1,
                   pageSizes:[5,10,20,50,100],
                   pageSize:5,
                   pageTotal:0,
                },
                userForm:{},//用户信息表单数据
                boxInfo:{//用户信息盒子设置
                    showBox:false,//是否显示弹窗
                    labelWidth:"100px",//弹窗宽度
                    status:"",//当前编辑状态的id
                    showMsg:false,
                    boxMsg:"",//显示盒子消息
                    msgType:"",//消息类型 error/success
                },
                forgetForm:{},//重置密码表单数据
                forgetPassBox:{//重置密码盒子设置
                    showBox:false,//是否显示弹窗
                    labelWidth:"100px",//弹窗宽度
                    status:""//当前编辑状态的id
                },
                rules: {//表单规则
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 11, message: '长度在 2 到 11个字符', trigger: 'change' }
                    ],
                    password: [
                        { required: true, validator: validatePass, trigger: 'blur' },
                        { min: 6, max: 18, message: '长度在 6 到 18个字符', trigger: 'change' }
                    ],
                    rePassword: [
                        { required: true, validator: validatePass2, trigger: 'blur' },
                        { min: 6, max: 18, message: '长度在 6 到 18个字符', trigger: 'change' }
                    ],
                    newPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 18, message: '长度在 6 到 18个字符', trigger: 'change' }
                    ],
                    email: [
                        { required: true,message: '请输入邮箱', trigger: 'blur' },
                        { type: 'string',pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,message: '请正确填写邮箱!', trigger: 'change'}
                    ],
                    mobilePhoneNumber: [
                        { message: '请输入手机号', trigger: 'blur' },
                        { type: 'string',pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,message: '请正确填写手机号!', trigger: 'change'}
                    ],
                    emailVerified: [
                        { type: 'boolean', message: '请选择是否已验证', trigger: 'blur' },
                    ],
                    mobilePhoneNumberVerified: [
                        { type: 'boolean', message: '请选择是否已验证', trigger: 'blur' },
                    ],
                    masterKey:[
                        { required: true, message: '授权码不能为空！', trigger: 'blur' },
                    ],
                },
                options:[//筛选条件
                    {
                        "value":"ID",
                        "id":'objectId'
                    },
                    {
                        "value":"用户名",
                        "id":'username'
                    },
                    {
                        "value":"邮箱",
                        "id":'email'
                    },
                    {
                        "value":"手机号",
                        "id":'mobilePhoneNumber'
                    }
                ],
                searchInfo:{//搜索数据
                    type:'',
                    word:''
                },
                loading: true//表格加载状态
            }
        },
        components:{
        },
        created() {
            this.getData()//获取表格数据
        },
        methods: {
            getData() {//获取表格数据
                this.loading = true
                let data={
                    nowPage:this.pageData.nowPage,
                    pageSize:this.pageData.pageSize,
                    ...this.searchInfo
                }
                User.get(data).then((res)=>{//获取用户信息
                    console.log(res)
                    this.tableData = res.results
                    this.pageData.pageTotal=res.count //设置总条数
                    this.loading = false
                })
            },
            pageSizeChange(e){//表格每页显示数量改变
               this.pageData.pageSize=e
               this.getData()
            },
            nowPageChange(e){//表格当前页改变
               this.pageData.nowPage=e
               this.getData()
            },
            handleEdit(e,index,row) {//表格行编辑事件
                //阻止事件冒泡
                this.stopPropagation()
                //初始化用户信息窗体
                this.initBox();
                console.log(index,row)
                //判断当前状态
                if(typeof(index)=="undefined"){//添加
                    this.boxInfo.status=''
                }else{//编辑
                    this.boxInfo.status=row.objectId
                    this.userForm=Object.assign({},row);//深拷贝，防止弹窗数据改动未保存就影响到表格数据
                    // if(process.env.NODE_ENV === 'development'){//是授权码的情况，方便调试打包可删除
                    //     this.userForm.masterKey="YOU MASTER KEY"
                    // }
                }
            },
            initBox(){//初始化用户信息窗体
                this.boxInfo.showBox=true;
                this.boxInfo.showMsg=false;
                //初始化窗体数据
                this.userForm={
                   emailVerified:false,
                   mobilePhoneNumberVerified:false,
                   userHead:'static/img/img.jpg',
                };
            },
            rowClick(data,index){//表格行点击
               this.$refs["userTable"].toggleRowSelection(data)
            },
            //阻止事件冒泡
            stopPropagation(e) {
                e = e || window.event;
                if(e.stopPropagation) { //W3C阻止冒泡方法
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true; //IE阻止冒泡方法
                }
            },
            searchEvent(e){//搜索事件
                this.getData()
            },
            reSetSearch(){//重置搜索数据
                this.searchInfo={
                   type:'',
                   word:''
                }
                this.pageData={
                   nowPage:1,
                   pageSizes:this.pageData.pageSizes,
                   pageSize:5,
                   pageTotal:0,
                }
                this.getData()
            },
            handleDelete(index, row) {//表格行删除事件
                //阻止事件冒泡
                this.stopPropagation()
                let masterKey
                this.$prompt('请输入授权码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then((value) => {
                    masterKey=value.value;//获取masterKey
                    console.log("123123",row.objectId,masterKey)
                    User.delete(row.objectId,masterKey).then((res)=>{//修改用户
                        console.log("6666676",res)
                        if(res.msg=='ok'){
                            this.setMsg(true,'success',"删除用户成功！")
                            this.pageData.nowPage=1;
                            this.getData()//刷新列表
                        }else{
                            this.setMsg(true,'error',"删除用户失败！")
                        }
                    }).catch(err => {
                        this.$message({
                            type: 'error',
                            message: err
                        });
                    });
                }).catch((err) => {
                    this.$message({
                        type: 'info',
                        message: '输入取消'
                    });
                });
            },
            submitForm(formName) {//提交用户信息表单（增加、修改）
                this.setMsg(false,'error',"")
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data= JSON.parse(JSON.stringify(this.userForm));
                        if(!this.boxInfo.status){//增加
                            delete data.rePassword;//清除不要的项
                            data.password=MD5(data.password);//MD5密码加密
                            User.set(data).then((res)=>{//注册用户
                                console.log(res)
                                this.boxInfo.showBox=false;
                                this.setMsg(true,'success',"创建用户成功！")
                                this.pageData.nowPage=1;
                                this.getData()//刷新列表
                            }).catch(err => {
                                this.setMsg(true,'error',"错误码：" + err.code+"错误原因：" + err.error)
                            });
                        }else{//修改
                            let masterKey=data.masterKey;//获取masterKey
                            data.id=this.boxInfo.status;//获取用户id

                            delete data.createdAt;//清除不要的项
                            delete data.updatedAt;//清除不要的项
                            delete data.objectId;//清除不要的项
                            delete data.masterKey;//清除不要的项

                            this.updateUserInfo(data,masterKey,"用户信息修改成功！",this.boxInfo)
                        }
                    } else {
                        this.setMsg(true,'error',"检验不通过，请检查输入！带*为必填项")
                    }
                });
            },
            cancelBox(name){//关闭用户信息盒子
                this[name].showBox = false;//关闭弹窗
            },
            resetForm(formName) {//重置表单
                this.$refs[formName].resetFields();
            },
            setMsg(isshow,type,msg){//设置提示信息
                this.boxInfo.showMsg=isshow;
                this.boxInfo.msgType=type
                this.boxInfo.boxMsg=msg
                if(isshow && type=='success'){
                    setTimeout(() => {
                       this.boxInfo.showMsg=false;
                    }, 3000);
                }
            },
            head_change(fileObj){//用户头像改变事件
                User.upFile(fileObj).then((res)=>{//注册用户
                    console.log(res)
                    this.userForm.userHead=res[0].url;
                }).catch(err => {
                    this.setMsg(true,'error',"错误码：" + err.code+"错误原因：" + err.error)
                });
            },
            uploadFile(){//点击上传文件
                this.$refs.file.click();
            },
            reSetHead(){//重置头像
                this.userForm.userHead='static/img/img.jpg'
            },
            submitForgetForm(formName){//重置密码表单提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data= JSON.parse(JSON.stringify(this.forgetForm));
                        let masterKey=data.masterKey;//获取masterKey
                        data.id=this.forgetPassBox.status
                        data.password=MD5(data.newPassword)

                        delete data.masterKey;//清除不要的项
                        delete data.newPassword;//清除不要的项

                        this.updateUserInfo(data,masterKey,"用户密码重置成功！",this.forgetPassBox)
                    }
                });
            },
            updateUserInfo(data,masterKey,successMsg,box){
                User.update(data,masterKey).then((res)=>{//修改用户
                    console.log("555555",res)
                    if(res){
                        box.showBox=false;
                        this.setMsg(true,'success',successMsg)
                        this.pageData.nowPage=1;
                        this.getData()//刷新列表
                    }else{
                        this.setMsg(true,'error',res)
                    }
                }).catch(err => {
                    console.log("666666",err)
                    this.setMsg(true,'error',err)
                });
            },
            handleReSetPass(index,row){//表格行改密事件
                //阻止事件冒泡
                this.stopPropagation()
                //获取id
                this.forgetPassBox.status=row.objectId;
                this.initForgetBox()
            },
            initForgetBox(){//初始化重置密码窗体
                this.forgetPassBox.showBox=true;
                //初始化窗体数据
                this.forgetForm={
                   newPassword:'',
                   masterKey:'',
                };
            },
        }
    }

</script>

<style scoped>
</style>
