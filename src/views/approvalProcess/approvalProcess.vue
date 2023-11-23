<template>
    <div class="approvalProcess">
        <el-button type="primary" @click="openDialog">创建审批流</el-button>
        <div class="table">
            <el-table :data="dataList" border :header-cell-style="{ 
            background:'#409EFF', color: '#fff'}">
                <el-table-column label="审批时间" align="center" prop="name"></el-table-column>
                <el-table-column label="审批人员" align="center" prop="age"></el-table-column>
                <el-table-column label="更新时间" align="center"></el-table-column>
                <el-table-column label="创建人" align="center"></el-table-column>
                <el-table-column label="操作" align="center"></el-table-column>
            </el-table>
        </div>

        <el-dialog :visible.sync="dialogVisble" title="创建审批流" width="1200px" :close-on-click-modal="false" class="dialog">
            <div class="content">
                <div class="left">
                    <div class="row">
                        <div class="col info">审批流名称:</div>
                        <div class="col">
                            <el-input placeholder="请输入" style="width: 360px"></el-input>
                        </div>
                    </div>
                    <div class="row" v-for="(item, index) in nodeList" :key="index">
                        <div class="col info">{{ item.nodeName }}:</div>
                        <div class="col">
                            <div class="select">
                                <el-input style="width: 360px"></el-input>
                                <!-- <el-cascader
                                    v-model="item.selectNodes" 
                                    :options="options"
                                    :props="props"
                                    clearable
                                    filterable
                                    multiple
                                    style="width: 360px"
                                    @change="toSelectNode">
                                </el-cascader> -->
                            </div>
                            <div class="tip">
                                <div class="tip_info">节点设置:</div>
                                <div class="value">
                                    <el-radio-group v-model="item.type">
                                        <el-radio :label="3">任意人员同意即可</el-radio>
                                        <el-radio :label="4">必须人员全部同意</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                        </div>
                        <div class="icons col">
                            <i class="el-icon-remove icon" @click="deleteNode(item,index)"></i>
                        </div>
                    </div>

                    <el-button type="primary" @click="addNode">增加节点</el-button>
                </div>
                <div class="right">
                    <div class="right_content">
                        <div class="search">
                            <el-input placeholder="模糊搜索"></el-input>
                        </div>
                        <div class="table">
                            <el-table
                                :header-cell-style="{ 
                                background:'#409EFF', color: '#fff'}"
                                :data="relatePersonList"
                                style="width: 100%;margin-bottom: 20px;"
                                row-key="id"
                                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                                
                                >
                                <el-table-column
                                prop="deptName"
                                label="部门"
                                width="180"
                                align="center">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.type == 'parent'" class="temp_row">
                                        <div>{{ scope.row.deptName }}</div>
                                    </div>
                                </template>
                                </el-table-column>
                                <el-table-column
                                prop="personName"
                                label="人员"
                                width="180"
                                align="center">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.type == 'children'"  class="temp_row">
                                            <el-checkbox v-model="scope.row.select" @change="toSelectTableNode(scope.row)"></el-checkbox>
                                            <div>{{ scope.row.personName }}</div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="position"
                                label="职位"
                                align="center">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div slot="footer" class="footer">
                            <el-button @click="cancel">取 消</el-button>
                            <el-button type="primary" @click="cancel">确 定</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { numberToWords } from 'pixiu-number-toolkit';
import { adminAuthCascaderApi } from "@/request/api"
export default{
    data(){
        return {
            dataList: [{
                name: "张三",
                age: 18
            },
            {
                name: "张三",
                age: 18
            }],
            nodeList: [{
                nodeName: "一级节点审批人",
                type: 3,

            },
            {
                nodeName: "二级节点审批人",
                type: 3
            }],
            dialogVisble: false,
            relatePersonList: [
                {
                    id: "1",
                    deptName: "运营部",
                    personName: "",
                    type: "parent",
                    children: [{
                        id: "4",
                        deptName: "",
                        personName: "张三",
                        position: "运营总监",
                        type: "children"
                    },{
                        id: "5",
                        deptName: "",
                        personName: "张四",
                        position: "运营副总监",
                        type: "children"
                    }]
                },
                {
                    id: "2",
                    deptName: "产品部",
                    personName: "",
                    type: "parent",
                    children: [{
                        id: "8",
                        deptName: "",
                        personName: "张六",
                        position: "产品总监",
                        type: "children"
                    },{
                        id: "9",
                        deptName: "",
                        personName: "张七",
                        position: "产品副总监",
                        type: "children"
                    }]
                },
            ],
            props: { multiple: true },
            options: [{
                value: 'yunyingbu',
                label: '运营部',
                children: [
                    {
                        value: 'yunyingzongjian',
                        label: '运营总监',
                        children: [{
                            value: 'zhangsan',
                            label: '张三'
                        }]
                    },
                    {
                        value: 'yunyingfuzongjian',
                        label: '运营副总监',
                        children: [{
                            value: 'lisi',
                            label: '李四'
                        }]
                    },
                    {
                        value: 'yunyingzhuanyuan',
                        label: '运营专员',
                        children: [{
                            value: 'wangwu',
                            label: '王五'
                        },
                        {
                            value: 'wangliu',
                            label: '王六'
                        }]
                    },
                ]
            }],
        }
    },
    mounted(){
        this.getAdminAuthCasList();
    },
    methods:{
        openDialog(){
            this.dialogVisble = true;
        },
        //增加节点
        addNode(){
            let nodeObj = {
                nodeName: `${numberToWords(this.nodeList.length + 1,"zh")}级节点审批人`,
                type: 3
            }
            this.nodeList.push(nodeObj)
        },
        //删除节点
        deleteNode(item, index){
            this.$confirm(`确定删除${item.nodeName}及以下节点审批人信息吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.nodeList = this.nodeList.slice(0, index);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //关闭dialog
        cancel(){
            this.dialogVisble = false
        },
        toSelectNode(val){
            console.log(val);
        },
        toSelectTableNode(val){
            console.log(val);
        },
        
        getAdminAuthCasList(){
            adminAuthCascaderApi().then(res => {
                console.log(res);
            })
        }
    }
}
</script>

<style lang="less" scoped>
.approvalProcess{
    padding: 20px;
    .table{
        margin-top: 20px;
    }
    :deep(.el-dialog__header){
        border: 1px solid #eee;
    }
    .dialog{
        .content{
            display: flex;
            .left{
                text-align: center;
                .row{
                    display: flex;
                    margin-bottom: 30px;
                    .info{
                        width: 120px;
                        text-align: right;
                        margin-right: 10px;
                        line-height: 40px;
                        font-size: 15px;
                        font-weight: 600;
                    }
                    .col{
                        .tip{
                            display: flex;
                            margin-top: 5px;
                            &_info{
                                margin-right: 10px;
                            }
                            &_info::before{
                                content: "*";
                                color: red;
                            }
                            .value{
                                :deep(.el-radio){
                                    margin-right: 10px !important;
                                }
                            }
                        }
                    }
                    .icons{
                        margin-top: 9px;
                        :deep(.el-icon-circle-plus:before){
                            font-size: 24px !important;
                            color: #409EFF;
                            cursor: pointer;
                        }
                        :deep(.el-icon-remove:before){
                            font-size: 24px !important;
                            color: red;
                            cursor: pointer;
                        }
                    }
                }
            }
            .right{
                width: 500px;
                margin-left: 10px;
                border: 1px solid #eee;
                padding: 10px;
                :deep(.el-input__inner){
                    border-radius: 25px;
                }
                :deep(.cell){
                    display: flex !important;
                }
                .temp_row{
                    display: flex;
                    align-items: center;
                    :deep(.el-radio){
                        margin-right: 0px !important;
                    }
                }
                :deep(.el-checkbox){
                    margin-right: 10px !important;
                }
                .footer{
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }
}

</style>