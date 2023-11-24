// 系统管理模块
import request from '@/request/request'




/* 审批流 */
// 审批流数据
export const adminAuthCascaderApi = (params) => request.post('/api/Webflow/admin_auth_trees', params);

// 创建审批流
export const createFlowApi = (params) => request.post('/api/Webflow/create_flow', params);

// 审批流详情
export const flowInfoApi = (params) => request.post('/api/Webflow/flow_info', params);
// 创建审批流
export const flowListApi = (params) => request.post('/api/Webflow/flow_list', params);