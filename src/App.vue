<template>
  <div id="app">
    <div style="padding: 20px">
      <h1>Vue3 打印功能 Demo</h1>
      <div style="margin-bottom: 20px">
        <el-alert
          title="Vue3 打印功能演示"
          type="info"
          description="这是一个基于 vue-plugin-hiprint 的打印功能演示。"
        />
      </div>

      <!-- 功能切换tabs -->
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="传统打印演示" name="traditional">
          <PrintDemo />
        </el-tab-pane>
        <el-tab-pane label="拖拽设计器" name="drag">
          <DragDesignDemo />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import PrintDemo from "./components/PrintDemo.vue";
import DragDesignDemo from "./components/DragDesignDemo.vue";

export default {
  name: "App",
  components: {
    PrintDemo,
    DragDesignDemo,
  },
  data() {
    return {
      activeTab: "drag", // 默认显示拖拽设计器
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}
</style>
