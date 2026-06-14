<template>
  <div class="not-found">
    <van-empty image="error" description="页面不存在" />
    <van-button type="primary" round @click="$router.push('/home')">
      返回首页
    </van-button>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  padding-top: 120px;
  text-align: center;
}
</style>