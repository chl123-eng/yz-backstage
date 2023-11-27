<template>
  <!-- 首页 -->
  <div class="home_box">
    <div class="home_content">
      <div class="content_left">
        <div class="list_box">
            <div class="list_router">
              <div class="router_block" v-for="(item, index) in menuArr" :key="index">
                <el-badge>
                  <el-link :underline="false" @click="menuClick(item, index)">{{ item.name }}</el-link>
                </el-badge>
              </div>
            </div>
        </div>   
      </div>
      <div class="content_right">
        <div class="right_top">
          <!-- 面包屑 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) of $route.matched" :key="index">
              <span @click="breadcrumbClick(item, index)" style="cursor: pointer;"> {{ item.meta.title }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>

        </div>
        <div class="right_main">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      flag: '',
      menuArr: [
          {
            modular: "approvalProcess",
            name: "审批流",
            url: "/menu/approvalProcess",
            is_show: 1,
          },
          {
            modular: "purchasePlan",
            name: "采购计划表",
            url: "/menu/purchasePlan",
            is_show: 1,
          },
      ],
    }
  },
  methods: {
    menuClick(item) {
      this.$router.push(
        item.url).catch(err =>{console.log(err)});
    },
    breadcrumbClick(item, index) {
      if (index != 0) {
        this.$router.push(item.path).catch(err =>{console.log(err)});
      }
    },
  }
}
</script>
<style lang="less" scoped>
.home_box {
  padding: 10px;
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home_content {
  width: 1200px;
  height: 100%;
  display: flex;
  justify-content: space-between;

  .content_left {
    width: 180px;
    height: 100%;
    overflow-y: scroll;
    background-color: #fff;

    .list_box {

        .list_router {
          padding: 20px 0;

          &:hover {
          background-color: #f8fcff;
        }

          .router_block {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            cursor: pointer;
          }
        }
    }

  }

  .content_right {
    width: 1000px;
    height: 100%;

    .right_top {
      height: 50px;
      background: #fff;
      padding: 0px 15px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      position: relative;

      .center_box {
        position: absolute;
        top: 15px;
        right: 40px;
        cursor: pointer;
      }
    }

    .right_main {
      height: calc(100vh - 90px);
      background-color: #fff;
      position: relative;
    }
  }
}
</style>