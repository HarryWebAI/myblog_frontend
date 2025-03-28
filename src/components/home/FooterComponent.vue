<template>
  <footer class="footer">
    <div class="footer-content">
      <transition name="fade-up" appear>
        <div class="copyright">
          <span class="copyright-text">© {{ currentYear }} HarryWebAI. All Rights Reserved.</span>
        </div>
      </transition>

      <div class="social-links">
        <transition-group name="fade-up" appear>
          <a v-for="(link, index) in socialLinks" :key="link.type" :href="link.url" target="_blank" class="social-link"
            :title="link.type" :style="{ animationDelay: `${index * 0.1 + 0.2}s` }">
            <img :src="link.icon" :alt="link.type" class="social-icon" />
          </a>
        </transition-group>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import githubIcon from '@/assets/icons/github.svg'
import bilibiliIcon from '@/assets/icons/bilibili.svg'

const currentYear = new Date().getFullYear()

const socialLinks = [
  {
    type: 'GitHub',
    url: 'https://github.com/HarryWebAI',
    icon: githubIcon
  },
  {
    type: 'Bilibili',
    url: 'https://space.bilibili.com/',
    icon: bilibiliIcon
  }
]
</script>

<style scoped>
.footer {
  padding: 24px 48px;
  text-align: center;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.7);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright-text {
  font-size: 0.9rem;
}

.social-links {
  display: flex;
  gap: 20px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.social-link:hover {
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  transform: translateY(-3px);
}

.social-icon {
  width: 20px;
  height: 20px;
  filter: invert(1);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.social-link:hover .social-icon {
  opacity: 1;
}

/* 动画效果 */
.fade-up-enter-active {
  transition: all 0.6s ease;
  animation: fadeInUp 0.6s ease forwards;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 20px;
  }

  .footer-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>
