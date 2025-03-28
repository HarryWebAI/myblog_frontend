<template>
  <div v-for="i in 6" :key="i" class="blog-card">
    <div class="blog-card-content">
      <div class="blog-card-header">
        <h2 class="blog-title">示例博客标题 {{ i }}</h2>
        <span class="blog-date">2024-03-{{ i }}</span>
      </div>
      <p class="blog-excerpt">
        这是一段示例博客摘要，描述了文章的主要内容。这里可以放置文章的前几行内容，让读者对文章有初步的了解。
      </p>
      <div class="blog-tags">
        <span class="tag">技术</span>
        <span class="tag">Vue</span>
        <span class="tag">前端</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.blog-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.blog-card:hover {
  transform: translateY(-5px);
}

.blog-card-content {
  padding: 1.5rem;
}

.blog-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.blog-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #e0e0e0;
}

.blog-date {
  font-size: 0.9rem;
  color: #b0b0b0;
}

.blog-excerpt {
  font-size: 1rem;
  line-height: 1.6;
  color: #d0d0d0;
  margin-bottom: 1rem;
}

.blog-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.3rem 0.8rem;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  border-radius: 15px;
  font-size: 0.9rem;
  color: #ffffff;
}
</style>