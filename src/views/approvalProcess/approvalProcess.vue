<template>
    <div class="approvalProcess">
        <el-button type="primary" @click="toCreateFlow">创建审批流</el-button>
        <div class="table">
            <el-table :data="dataList" border :header-cell-style="{ 
            background:'#409EFF', color: '#fff'}">
                <el-table-column label="审批信息" align="center" prop="title"></el-table-column>
                <el-table-column label="审批人员" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.flow_num }}名</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" align="center" prop="updatetime"></el-table-column>
                <el-table-column label="创建人" align="center" prop="creatter"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="toCheck(scope.row)" size="small">查看</el-button>
                        <el-button type="primary" @click="toEdit(scope.row)" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageParam.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageParam.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <el-dialog :visible.sync="dialogVisble" :title="dialogTitle" :width="operateType == 'check' ? '800px':'1250px'" @close="cancel" :close-on-click-modal="false" class="dialog">
            <div class="content">
                <div class="top">
                    <div class="left">
                        <div class="row">
                            <div class="col info">审批流名称:</div>
                            <div class="col">
                                <el-input placeholder="请输入" v-model="approvalName" style="width: 360px" :disabled="operateType == 'check'">
                                </el-input>
                            </div>
                        </div>
                        <div class="row" v-for="(item, index) in nodeList" :key="index" @click="clickNodeInput(index)">
                            <div class="col info">
                                <el-input v-model="item.event_name" style="width: 100px;margin-right: 5px" :disabled="operateType == 'check'"></el-input>审批人:
                            </div>
                            <div class="col">
                                <div class="select">
                                    <div class="input" :class="item.isCurrentNode ? 'selectBorder' : ''">
                                        <div class="valueBox" v-for="(jItem,jIndex) in item.user_list" :key="jIndex">
                                            <div class="value">{{ jItem.personName + '(' + jItem.deptName + ')' }}</div>
                                            <div class="icon" @click.stop="deleteSelectPerson(jItem,index,jIndex)" v-show="operateType !== 'check'">
                                                <i class="el-icon-error"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tip">
                                    <div class="tip_info">节点设置:</div>
                                    <div class="value">
                                        <el-radio-group v-model="item.node_set" :disabled="operateType == 'check'">
                                            <el-radio :label="1">任意人员同意即可</el-radio>
                                            <el-radio :label="2">必须人员全部同意</el-radio>
                                        </el-radio-group>
                                    </div>
                                </div>
                            </div>
                            <div class="icons col" v-show="operateType !== 'check'" >
                                <i class="el-icon-remove icon" @click="deleteNode(item,index)"></i>
                            </div>
                        </div>

                        <el-button type="primary" @click="addNode" v-if="operateType !== 'check'">增加节点</el-button>
                    </div>
                    <div class="right" v-if="ShowRightTable">
                        <div class="right_content">
                            <div class="search">
                                <el-input placeholder="模糊搜索" v-model="keyword" style="width: 430px;margin-right: 20px"></el-input>
                                <div @click="getAdminAuthCasList" class="searchBtn">搜索</div>
                            </div>
                            <div class="right_table">
                                <el-table
                                    :header-cell-style="{ 
                                    background:'#409EFF', color: '#fff'}"
                                    :data="relatePersonList"
                                    style="width: 100%;margin-bottom: 20px;"
                                    row-key="id"
                                    default-expand-all
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
                                                <el-checkbox v-model="scope.row.select" :disabled="scope.row.select" @change="toSelectTableNode(scope.row)"></el-checkbox>
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
                <div slot="footer" class="footer" v-if="operateType !== 'check'">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="createFlow" :disabled="operateType == 'check'">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { adminAuthCascaderApi, createFlowApi, flowListApi, flowInfoApi, editFlowApi } from "@/request/api"
export default{
    data(){
        return {
            dataList: [],
            nodeList: [
            ],
            dialogVisble: false,
            keyword: "",
            tableTableHeight: 400,
            relatePersonList: [],
            ShowRightTable: false,
            selectNodeIndex: 0,
            approvalName: "",
            total: 0,
            pageParam: {
                page: 1,
                pagesize: 20
            },
            operateType: "",
            dialogTitle: "",
            flowInfoObj: {},
            currentId: ""
        }
    },
    // watch: {
    //     nodeList: {
    //         handler(newVal){
    //             //讲内容回显到右上搜索框
    //             this.keyword = newVal[this.selectNodeIndex].user_list.map((item) => {
    //                 return `${item.personName}(${item.dept})`
    //             }).join("、")
    //         },
    //         deep: true
    //     }
    // },
    created(){
    },

    mounted(){
        this.getDataList();
        this.getAdminAuthCasList();
    },
    methods:{
        toCreateFlow(){
            this.dialogVisble = true;
            this.operateType = "create";
            this.dialogTitle = "创建审批流";
            this.nodeList.forEach(item => {
                item.user_list.forEach(i => {
                    this.relatePersonList = this.addValue(this.relatePersonList, "children", "clearAll", i);
                })
            })
            this.approvalName = "";
            this.nodeList = [];
            this.addNode();
        },
        toCheck(row){
            this.dialogVisble = true;
            this.operateType = "check";
            this.dialogTitle = "查看审批流";
            this.nodeList.forEach(item => {
                item.user_list.forEach(i => {
                    this.relatePersonList = this.addValue(this.relatePersonList, "children", "clearAll", i);
                })
            })
            this.$nextTick(() => {
                this.getFlowInfo(row.flow_id);
            })
            
        },
        toEdit(row){
            this.currentId = row.flow_id;
            this.dialogVisble = true;
            this.operateType = "edit";
            this.dialogTitle = "编辑审批流";
            this.nodeList.forEach(item => {
                item.user_list.forEach(i => {
                    this.relatePersonList = this.addValue(this.relatePersonList, "children", "clearAll", i);
                })
            })
            this.$nextTick(() => {
                this.getFlowInfo(row.flow_id);
            })
        },

        //获取列表
        getDataList(){
            flowListApi(this.pageParam).then(res => {
                if(res.code == 200){
                    this.dataList = res.data.flow_data;
                    this.total = res.data.total;
                }
            })
        },
        handleSizeChange(val){
            this.pageParam.page = 1;
            this.pageParam.pagesize = val;
            this.getDataList();
        },
        handleCurrentChange(val){
            this.pageParam.page = val;
            this.getDataList();
        },
        //获取详情
        getFlowInfo(id){
            flowInfoApi({flow_id: id}).then(res => {
                if(res.code == 200){
                    this.flowInfoObj = res.data;
                    this.approvalName = this.flowInfoObj.flow_name;
                    this.nodeList = this.flowInfoObj.data;
                    this.nodeList = this.nodeList.map(item => {
                        item.user_list.map(i => {
                            i.personName = i.nickname;
                            i.deptName = i.name;

                            this.$nextTick(() => {
                                this.relatePersonList = this.addValue(this.relatePersonList, "children", "showInfoSelect", i);
                            })
                            
                            return i
                        })
                        return item;
                    })
                    this.$forceUpdate();
                }
            })
        },
        //增加节点
        addNode(){
            let nodeObj = {
                id: this.nodeList.length,
                event_name: "",
                user_list: [],
                node_set: 1,
                isCurrentNode: false
            }
            this.nodeList.push(nodeObj);
        },
        //删除节点
        deleteNode(item, index){
            this.$confirm(`确定删除${item.event_name}及以下节点审批人信息吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let deleteArr = this.nodeList.splice(index, this.nodeList.length - index);
                deleteArr.forEach(Ditem => {
                    Ditem.user_list.forEach(Sitem => {
                        this.addValue(this.relatePersonList, "children", "single", Sitem);
                    })
                })
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
            this.dialogVisble = false;
            this.ShowRightTable = false;
        },
        //选择审批人
        toSelectTableNode(val){
            if(val.select){
                this.nodeList[this.selectNodeIndex].user_list.push(val);
            }
        },
        //删除已选审批人
        deleteSelectPerson(jItem,index,jIndex){
            this.nodeList[index].user_list.splice(jIndex, 1);
            this.addValue(this.relatePersonList, "children", "single", jItem);
        },
        //操作数据树
        addValue(obj, value, type, itemVal) {
            // 如果 obj 是数组，则遍历数组中的每个元素
            if (Array.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    // 如果元素是数组或对象，则递归调用 addValue 函数
                    if (typeof obj[i] === 'object') {
                        this.addValue(obj[i].children, value,type,itemVal);
                    }
                    // 如果元素等于 value，则在数组中添加新值
                    if (obj[i].type === value) {
                        if(type == "showInfoSelect"){
                            if(itemVal.id == obj[i].id){
                                obj[i].select = true;
                            }
                        }
                        if(type == "clearAll"){
                            obj[i].select = false;
                        }
                        if(type == "single"){
                            if(obj[i].select && itemVal.id == obj[i].id){
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
            if(this.operateType == "check") return;
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
        //获取右边表格信息
        getAdminAuthCasList(){
            adminAuthCascaderApi({keyword: this.keyword}).then(res => {
                this.relatePersonList = res.data;
            })
        },
        //创建审批流
        createFlow(){
            let dataParam = [];
            this.nodeList.forEach(item => {
                let obj = {
                    event_name: item.event_name,
                    node_set: item.node_set,
                    ids: ""
                }
                obj.ids = item.user_list.map(i => {
                    return i.id
                }).join(",");
                dataParam.push(obj);
            })
            let params = {
                flow_name: this.approvalName,
                data: JSON.stringify(dataParam)
            }
            if(this.operateType == "edit"){
                params.flow_id = this.currentId;
                editFlowApi(params).then(res => {
                    if(res.code == 200 ){
                        this.$message.success("修改成功");
                        this.dialogVisble = false;
                        this.ShowRightTable = false;
                        this.getDataList();
                    }
                })
            }else{
                createFlowApi(params).then(res => {
                    if(res.code == 200 ){
                        this.$message.success("创建成功");
                        this.dialogVisble = false;
                        this.ShowRightTable = false;
                        this.getDataList();
                    }
                })
            }
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
    :deep(.el-pagination){
        text-align: right;
        margin-top: 10px;
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
                            .disabled{
                                background-color: #F5F7FA;
                                border-color: #E4E7ED;
                                color: #C0C4CC;
                                cursor: not-allowed;
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
                        display: flex;
                        align-items: center;
                        .searchBtn{
                            height: 30px;
                            width: 50px;
                            text-align: center;
                            line-height: 30px;
                            font-size: 12px;
                            background: #409EFF;
                            color: #fff;
                            border-radius: 30px;
                        }
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