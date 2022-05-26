<template>
  <div id="app">
    <fake-news-detection></fake-news-detection>
  </div>
</template>

<script>
  import FakeNewsDetection from "./views/FakeNewsDetection";

  export default {
    name: "app",
    components: {
      FakeNewsDetection: FakeNewsDetection
    },
  }
</script>
<style lang="stylus">
  #app
    font-family Avenir, Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    color #2c3e50
    .el-main
      height auto
      background-color #9fb4dd
    .el-footer
      border-top-color grey
      border-top-style double
      width auto
</style>
