// 系统管理模块
import request from '@/request/request'




/* 审批流 */
export const adminAuthCascaderApi = (params) => request.post('/api/Webflow/admin_auth_trees', params);