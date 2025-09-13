<script setup lang="ts">
</script>

<template>
  <main class="container">
    <div class="header-row">
      <el-text size="large" tag="h1">Учетные записи</el-text>
      <div style="margin:16px 0">
        <el-button type="primary" size="small" @click="$emit('add')">+</el-button>
      </div>
    </div>
  </main>
</template>

<style scoped>
  .container {max-width: 840px; margin: 24px auto; padding: 0 12px;}
</style>  