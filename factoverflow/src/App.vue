<template>
  <div id="app">
    <Term-Explanation></Term-Explanation>
  </div>
</template>

<script>
  import TermExplanation from "./views/TermExplanationTool";

  export default {
    name: "app",
    components: {
      TermExplanation: TermExplanation
    }
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
