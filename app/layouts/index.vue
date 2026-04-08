<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <NuxtPage :page-key="route.fullPath" />
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import Header from './Header.vue'
  import Footer from './Footer.vue'

  const route = useRoute()
</script>
