<template>
  <SceneTransition :lines="[
    '你拎着购物袋走出了超市。',
    '远处传来激烈的争吵声——',
    '循声走去，发现是一家手机店。',
    '手机店里，战火正酣。',
  ]" :next-stage="3" :speed="1.5" />
</template>

<script setup lang="ts">
import SceneTransition from '@/components/SceneTransition.vue'
</script>
