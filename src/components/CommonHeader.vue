<template>
  <transition name="fade-down" appear>
    <div class="page-title">
      <h1>{{ title }}<span class="title-accent"></span></h1>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.page-title {
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  flex-shrink: 0;
}

.page-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  padding: 0;
  display: inline-block;
  position: relative;
}

.title-accent {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, #3494e6, #ec6ead);
  border-radius: 3px;
}

.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 0.5s ease;
}

.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 768px) {
  .page-title h1 {
    font-size: 2rem;
  }
}
</style>
