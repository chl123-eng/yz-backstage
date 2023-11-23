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

        <el-dialog :visible.sync="dialogVisble" title="创建审批流" width="1250px" :close-on-click-modal="false" class="dialog">
            <div class="content">
                <div class="top">
                    <div class="left">
                        <div class="row">
                            <div class="col info">审批流名称:</div>
                            <div class="col">
                                <el-input placeholder="请输入" v-model="approvalName" style="width: 360px">
                                </el-input>
                            </div>
                        </div>
                        <div class="row" v-for="(item, index) in nodeList" :key="index" @click="clickNodeInput(index)">
                            <div class="col info">
                                <el-input v-model="item.nodeName" style="width: 100px;margin-right: 5px"></el-input>审批人:
                            </div>
                            <div class="col">
                                <div class="select">
                                    <div class="input" :class="item.isCurrentNode ? 'selectBorder' : ''">
                                        <div class="valueBox" v-for="(jItem,jIndex) in item.selectPerson" :key="jIndex">
                                            <div class="value">{{ jItem.personName + '(' + jItem.dept + ')' }}</div>
                                            <div class="icon" @click.stop="deleteSelectPerson(index,jIndex)">
                                                <i class="el-icon-error"></i>
                                            </div>
                                        </div>
                                    </div>
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
                    <div class="right" v-if="ShowRightTable">
                        <div class="right_content">
                            <div class="search">
                                <el-input placeholder="模糊搜索" v-model="keyword"></el-input>
                            </div>
                            <div class="right_table">
                                <el-table
                                    :header-cell-style="{ 
                                    background:'#409EFF', color: '#fff'}"
                                    :data="relatePersonList"
                                    style="width: 100%;margin-bottom: 20px;"
                                    row-key="id"
                                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                                    ref="relateTable"
                                    id="relateTable"
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
                        
                        </div>
                    </div>
                </div>
                <div slot="footer" class="footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="cancel">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
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
            nodeList: [
            ],
            dialogVisble: false,
            keyword: "",
            tableTableHeight: 400,
            relatePersonList: [],
            ShowRightTable: false,
            selectNodeIndex: 0,
            approvalName: ""
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
                id: this.nodeList.length,
                nodeName: "",
                selectPerson: [],
                type: 3,
                isCurrentNode: false
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
        //选择审批人
        toSelectTableNode(val){
            if(val.select){
                this.nodeList[this.selectNodeIndex].selectPerson.push(val);
            }
        },
        //删除已选审批人
        deleteSelectPerson(index,jIndex){
            this.nodeList[index].selectPerson.splice(jIndex, 1);

        },
        addValue(obj, value, type) {
            // 如果 obj 是数组，则遍历数组中的每个元素
            if (Array.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    // 如果元素是数组或对象，则递归调用 addValue 函数
                    if (typeof obj[i] === 'object') {
                        this.addValue(obj[i].children, value);
                    }
                    // 如果元素等于 value，则在数组中添加新值
                    if (obj[i].type === value) {
                        if(type == "clearAll"){
                            if(obj[i].select){
                                obj[i].select = false;
                            }
                        }
                    }
                }
            }
            // 如果 obj 是对象，则遍历对象中的每个属性
            else if (typeof obj === 'object') {
                for (var key in obj) {
                // 如果属性值是数组或对象，则递归调用 addValue 函数
                    if (typeof obj[key] === 'object') {
                        this.addValue(obj[i], value);
                    }
                    // 如果属性值等于 value，则在数组中添加新值
                    else if (obj[key] === value) {
                        this.addValue(obj[i], value);
                    }
                }
            }
            // 返回修改后的数组对象
            return obj;
        },
        //显示右边表格进行选择
        clickNodeInput(valIndex){
            //将已选择的清空
            this.relatePersonList = this.addValue(this.relatePersonList, "children", "clearAll");
            this.ShowRightTable = true;
            this.selectNodeIndex = valIndex;

            this.nodeList = this.nodeList.map((item,index) => {
                if(valIndex == index){
                    item.isCurrentNode = true;
                }else{
                    item.isCurrentNode = false;
                }
                return item;
            })
        },
        getAdminAuthCasList(){
            adminAuthCascaderApi({keyword: this.keyword}).then(res => {
                this.relatePersonList = res.data;
            })
        },

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
            .top{
                display: flex;
                .left{
                    text-align: center;
                    .row{
                        display: flex;
                        margin-bottom: 30px;

                        .info{
                            width: 210px;
                            text-align: right;
                            margin-right: 10px;
                            line-height: 40px;
                            font-size: 15px;
                            font-weight: 600;
                        }
                        .col{
                            .input{
                                width: 360px;
                                min-height: 40px;
                                box-sizing: border-box;
                                padding: 10px 15px 0;
                                border-radius: 4px;
                                display: flex;
                                align-items: center;
                                flex-wrap: wrap;
                                border: 1px solid #DCDFE6;
                                
                                .valueBox{
                                    width: fit-content;
                                    height: 25px;
                                    padding: 0 5px;
                                    display: flex;
                                    align-items: center;
                                    background: #eee;
                                    border-radius: 5px;
                                    color: #606266;
                                    display: flex;
                                    margin-right: 10px;
                                    margin-bottom: 10px;
                                    .value{
                                        margin-right: 3px;
                                    }
                                    .icon{
                                        :deep(.el-icon-error){
                                            color: #999;
                                        }
                                        :deep(.el-icon-error:hover){
                                            color: #409EFF;
                                        }
                                    }
                                }
                            }
                            .selectBorder{
                                border: 1px solid #409EFF;
                            }
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
                    margin-right: 20px;
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
                    .search{
                        margin-bottom: 10px;
                    }
                    &_table{
                        height: 500px;
                        overflow-y: scroll;
                    }
                }
            }
            .footer{
                display: flex;
                justify-content: center;
                margin-top: 10px;
            }
        }
    }
}

</style>