<template>
  <SceneTransition :lines="lines" :next-stage="4" :speed="1.5" />
</template>

<script setup lang="ts">
import SceneTransition from '@/components/SceneTransition.vue'

const lines = [
  '你从手机店里挤了出来，脑子里还嗡嗡作响。',
  '对面一整条街都是车行——泰伦斯、标越、柏慕……旗帜林立，人声鼎沸。',
  '还没站稳，就有人往你手里塞了一堆传单。',
  '\u201C买车吗？看看我们家！隔壁那家千万别去！\u201D',
]
</script>
