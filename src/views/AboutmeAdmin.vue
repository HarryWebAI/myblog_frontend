<template>
  <div class="admin-container">
    <!-- 左侧预览区域 -->
    <div class="preview-section">
      <div class="preview-wrapper">
        <div class="preview-inner">
          <div class="preview-tabs">
            <div v-for="(section, index) in sections" :key="section.id" class="preview-tab"
              :class="{ 'active': activeIndex === index }" @click="activeIndex = index">
              <el-icon>
                <component :is="section.icon" />
              </el-icon>
              <span>{{ section.title }}</span>
            </div>
          </div>

          <div class="preview-content">
            <!-- 工作经历 -->
            <div v-if="sections[activeIndex]?.type === 'work'" class="timeline">
              <div v-for="job in sections[activeIndex].content as WorkExperience[]" :key="job.id" class="timeline-item">
                <div class="timeline-connector"></div>
                <div class="timeline-content">
                  <h3>{{ job.title }}</h3>
                  <p class="company">{{ job.company }}</p>
                  <p class="period">{{ job.period }}</p>
                  <ul class="achievements">
                    <p v-for="(achievement, index) in job.achievements" :key="index">{{ achievement }}</p>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 教育背景 -->
            <div v-if="sections[activeIndex]?.type === 'education'" class="education-content">
              <div v-for="edu in sections[activeIndex].content as Education[]" :key="edu.id" class="education-item">
                <div class="education-icon">
                  <el-icon>
                    <School />
                  </el-icon>
                </div>
                <div class="education-details">
                  <h3>{{ edu.major }}</h3>
                  <p class="school">{{ edu.school }}</p>
                  <p class="period">{{ edu.period }}</p>
                  <p class="degree">{{ edu.degree }}</p>
                  <p class="description">{{ edu.description }}</p>
                </div>
              </div>
            </div>

            <!-- 项目经验 -->
            <div v-if="sections[activeIndex]?.type === 'projects'" class="projects-grid">
              <div v-for="project in sections[activeIndex].content as Project[]" :key="project.id" class="project-item">
                <div class="project-header">
                  <h3>{{ project.name }}</h3>
                  <div class="tech-stack-badge">{{ project.techStack }}</div>
                </div>
                <ul class="project-details">
                  <p v-for="(detail, index) in project.details" :key="index">{{ detail }}</p>
                </ul>
              </div>
            </div>

            <!-- 技能树 -->
            <div v-if="sections[activeIndex]?.type === 'skills'" class="skills-container">
              <div v-for="category in sections[activeIndex].content as SkillCategory[]" :key="category.id"
                class="skill-category">
                <h3>{{ category.name }}</h3>
                <div class="skill-items">
                  <el-tag v-for="skill in category.skills" :key="skill" effect="dark">{{ skill }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧编辑区域 -->
    <div class="edit-section">
      <div class="edit-header">
        <div class="title-container">
          <div class="section-title">编辑内容</div>
        </div>
        <div class="button-container">
          <el-button type="warning" @click="resetAboutme" class="reset-btn">
            <el-icon>
              <RefreshRight />
            </el-icon> 重置
          </el-button>
        </div>
      </div>

      <div class="edit-content">
        <!-- 工作经历 -->
        <div v-if="sections[activeIndex]?.type === 'work'" class="edit-section">
          <div class="section-header">
            <h3>工作经历</h3>
            <el-button type="success" @click="addWork" class="add-btn">
              <el-icon>
                <Plus />
              </el-icon>添加工作经历
            </el-button>
          </div>
          <div v-for="(job, index) in aboutme.work" :key="job.id" class="edit-item">
            <div class="item-header">
              <h4>工作经历 #{{ index + 1 }}</h4>
              <el-button type="danger" circle @click="removeWork(index)" class="delete-btn">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
            <div class="form-grid">
              <el-input v-model="job.title" placeholder="职位名称" />
              <el-input v-model="job.company" placeholder="公司名称" />
              <el-input v-model="job.period" placeholder="工作时间" />
            </div>
            <div class="achievements-section">
              <div class="section-header">
                <h5>工作成就</h5>
                <el-button type="success" @click="addAchievement(job)" class="add-btn">
                  <el-icon>
                    <Plus />
                  </el-icon>添加成就
                </el-button>
              </div>
              <div v-for="(achievement, aIndex) in job.achievements" :key="aIndex" class="achievement-item">
                <el-input v-model="job.achievements[aIndex]" placeholder="工作成就" />
                <el-button type="danger" circle @click="removeAchievement(job, aIndex)" class="delete-btn">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 教育背景 -->
        <div v-if="sections[activeIndex]?.type === 'education'" class="edit-section">
          <div class="section-header">
            <h3>教育背景</h3>
            <el-button type="success" @click="addEducation" class="add-btn">
              <el-icon>
                <Plus />
              </el-icon>添加教育经历
            </el-button>
          </div>
          <div v-for="(edu, index) in aboutme.education" :key="edu.id" class="edit-item">
            <div class="item-header">
              <h4>教育经历 #{{ index + 1 }}</h4>
              <el-button type="danger" circle @click="removeEducation(index)" class="delete-btn">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
            <div class="form-grid">
              <el-input v-model="edu.major" placeholder="专业" />
              <el-input v-model="edu.school" placeholder="学校" />
              <el-input v-model="edu.period" placeholder="学习时间" />
              <el-input v-model="edu.degree" placeholder="学位" />
              <el-input v-model="edu.description" type="textarea" placeholder="描述" class="education-description" />
            </div>
          </div>
        </div>

        <!-- 项目经验 -->
        <div v-if="sections[activeIndex]?.type === 'projects'" class="edit-section">
          <div class="section-header">
            <h3>项目经验</h3>
            <el-button type="success" @click="addProject" class="add-btn">
              <el-icon>
                <Plus />
              </el-icon>添加项目
            </el-button>
          </div>
          <div v-for="(project, index) in aboutme.projects" :key="project.id" class="edit-item">
            <div class="item-header">
              <h4>项目 #{{ index + 1 }}</h4>
              <el-button type="danger" circle @click="removeProject(index)" class="delete-btn">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
            <div class="form-grid">
              <el-input v-model="project.name" placeholder="项目名称" />
              <el-input v-model="project.techStack" placeholder="技术栈" />
            </div>
            <div class="details-section">
              <div class="section-header">
                <h5>项目详情</h5>
                <el-button type="success" @click="addProjectDetail(project)" class="add-btn">
                  <el-icon>
                    <Plus />
                  </el-icon>添加详情
                </el-button>
              </div>
              <div v-for="(detail, dIndex) in project.details" :key="dIndex" class="detail-item">
                <el-input v-model="project.details[dIndex]" placeholder="项目详情" />
                <el-button type="danger" circle @click="removeProjectDetail(project, dIndex)" class="delete-btn">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 技能树 -->
        <div v-if="sections[activeIndex]?.type === 'skills'" class="edit-section">
          <div class="section-header">
            <h3>技能树</h3>
            <el-button type="success" @click="addSkillCategory" class="add-btn">
              <el-icon>
                <Plus />
              </el-icon>添加技能分类
            </el-button>
          </div>
          <div v-for="(category, index) in aboutme.skills" :key="category.id" class="edit-item">
            <div class="item-header">
              <h4>技能分类 #{{ index + 1 }}</h4>
              <el-button type="danger" circle @click="removeSkillCategory(index)" class="delete-btn">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
            <div class="form-grid">
              <el-input v-model="category.name" placeholder="分类名称" />
            </div>
            <div class="skills-section">
              <div class="section-header">
                <h5>技能列表</h5>
                <el-button type="success" @click="addSkill(category)" class="add-btn">
                  <el-icon>
                    <Plus />
                  </el-icon>添加技能
                </el-button>
              </div>
              <div v-for="(skill, sIndex) in category.skills" :key="sIndex" class="skill-item">
                <el-input v-model="category.skills[sIndex]" placeholder="技能名称" />
                <el-button type="danger" circle @click="removeSkill(category, sIndex)" class="delete-btn">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <el-button type="primary" @click="handleSave" class="save-btn">保存配置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Delete, Plus, RefreshRight, School } from '@element-plus/icons-vue'
import { useAboutme } from '@/hooks/useAboutme'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { WorkExperience, Education, Project, SkillCategory } from '@/types'

const { sections, aboutme, fetchAboutme, saveAboutmeConfig } = useAboutme()
const activeIndex = ref(0)

// 工作经历相关方法
const addWork = () => {
  if (aboutme.value.work.length >= 2) {
    ElMessage.error('工作经历最多2条, 请填写重要的工作经历')
    return
  }
  aboutme.value.work.push({
    id: Date.now(),
    title: '',
    company: '',
    period: '',
    achievements: []
  })
}

const removeWork = (index: number) => {
  aboutme.value.work.splice(index, 1)
}

const addAchievement = (job: WorkExperience) => {
  if (job.achievements.length >= 3) {
    ElMessage.error('单项工作的成就最多3条, 请填写重要的成就')
    return
  }
  job.achievements.push('')
}

const removeAchievement = (job: WorkExperience, index: number) => {
  job.achievements.splice(index, 1)
}

// 教育背景相关方法
const addEducation = () => {
  if (aboutme.value.education.length >= 2) {
    ElMessage.error('教育背景最多2条, 请填写重要的教育背景')
    return
  }
  aboutme.value.education.push({
    id: Date.now(),
    major: '',
    school: '',
    period: '',
    degree: '',
    description: ''
  })
}

const removeEducation = (index: number) => {
  aboutme.value.education.splice(index, 1)
}

// 项目经验相关方法
const addProject = () => {
  aboutme.value.projects.push({
    id: Date.now(),
    name: '',
    techStack: '',
    details: []
  })
}

const removeProject = (index: number) => {
  aboutme.value.projects.splice(index, 1)
}

const addProjectDetail = (project: Project) => {
  project.details.push('')
}

const removeProjectDetail = (project: Project, index: number) => {
  project.details.splice(index, 1)
}

// 技能树相关方法
const addSkillCategory = () => {
  aboutme.value.skills.push({
    id: Date.now(),
    name: '',
    skills: []
  })
}

const removeSkillCategory = (index: number) => {
  aboutme.value.skills.splice(index, 1)
}

const addSkill = (category: SkillCategory) => {
  category.skills.push('')
}

const removeSkill = (category: SkillCategory, index: number) => {
  category.skills.splice(index, 1)
}

// 保存和重置方法
const handleSave = () => {
  saveAboutmeConfig()
}

const resetAboutme = () => {
  ElMessageBox.confirm('确定要重置所有更改吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fetchAboutme()
    ElMessage.success('已重置')
  }).catch(() => {
    ElMessage.info('取消重置')
  })
}

onMounted(() => {
  fetchAboutme()
})
</script>

<style scoped>
.admin-container {
  height: 100%;
  width: 100%;
  display: flex;
  gap: 20px;
  padding: 20px;
  color: #f0f0f0;
  overflow: hidden;
  box-sizing: border-box;
}

/* 左侧预览区域 */
.preview-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  max-height: calc((100vw - 40px) * 9 / 32);
}

.preview-wrapper {
  flex: 1;
  background: rgba(26, 26, 26, 0.7);
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 300px;
  box-sizing: border-box;
  overflow: hidden;
}

.preview-inner {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.preview-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
  flex-shrink: 0;
}

.preview-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-tab:hover {
  background: rgba(255, 255, 255, 0.2);
}

.preview-tab.active {
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  border-color: rgba(255, 255, 255, 0.2);
}

.preview-content {
  flex: 1;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.preview-content::-webkit-scrollbar {
  width: 6px;
}

.preview-content::-webkit-scrollbar-track {
  background: transparent;
}

.preview-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}

/* 工作经历时间线 */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 3px solid #3494e6;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.timeline-item:hover {
  background: rgba(255, 255, 255, 0.07);
}

.timeline-connector {
  position: absolute;
  left: -35px;
  top: 20px;
  width: 15px;
  height: 15px;
  background: #3494e6;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(52, 148, 230, 0.5);
}

.timeline-connector::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 15px;
  height: calc(100% + 15px);
  width: 1px;
  background: rgba(52, 148, 230, 0.5);
}

.timeline-content h3 {
  color: #3494e6;
  margin-top: 0;
  margin-bottom: 10px;
}

/* 教育背景样式 */
.education-content {
  width: 100%;
}

.education-item {
  display: flex;
  margin-bottom: 25px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.education-item:hover {
  background: rgba(255, 255, 255, 0.07);
}

.education-icon {
  flex: 0 0 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #ec6ead;
  margin-right: 20px;
}

.education-details {
  flex: 1;
}

.education-details h3 {
  color: #3494e6;
  margin-top: 0;
  margin-bottom: 10px;
}

/* 项目经验样式 */
.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-right: 12px;
}

.project-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.project-item:hover {
  background: rgba(255, 255, 255, 0.07);
  transform: translateX(10px);
  border-color: rgba(52, 148, 230, 0.3);
}

.project-header {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.project-header h3 {
  color: #3494e6;
  margin: 0;
  font-size: 1.2rem;
}

.tech-stack-badge {
  display: inline-block;
  background: linear-gradient(45deg, rgba(52, 148, 230, 0.2), rgba(236, 106, 173, 0.2));
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #ec6ead;
}

/* 技能树样式 */
.skills-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.skill-category {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.skill-category:hover {
  background: rgba(255, 255, 255, 0.07);
}

.skill-category h3 {
  color: #3494e6;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.skill-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

:deep(.el-tag) {
  padding: 0 12px;
  height: 30px;
  line-height: 30px;
  border: none;
}

:deep(.el-tag):hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 列表样式 */
.achievements p,
.project-details p {
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  line-height: 1.5;
}

.achievements p::before,
.project-details p::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #ec6ead;
  font-size: 1.2rem;
}

/* 右侧编辑区域 */
.edit-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  height: 100%;
  overflow: hidden;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 500;
  color: #fff;
}

.edit-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  height: 100%;
}

.edit-content::-webkit-scrollbar {
  width: 6px;
}

.edit-content::-webkit-scrollbar-track {
  background: transparent;
}

.edit-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.edit-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}

.actions {
  display: flex;
  justify-content: center;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.edit-section {
  margin-bottom: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: #fff;
}

.edit-item {
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.item-header h4 {
  margin: 0;
  color: #fff;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

/* 教育背景表单布局 */
.education-description {
  grid-column: 1 / -1;
  /* 让文本域占满整行 */
}

/* 教育背景描述文本域样式 */
:deep(.education-description .el-textarea__inner) {
  height: 120px !important;
  background-color: #1a1a1a;
  color: #f0f0f0;
  resize: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

:deep(.education-description .el-textarea__inner:hover) {
  border-color: rgba(255, 255, 255, 0.2);
}

:deep(.education-description .el-textarea__inner:focus) {
  border-color: #3494e6;
  box-shadow: 0 0 0 1px #3494e6;
}

.achievements-section,
.details-section,
.skills-section {
  margin-top: 20px;
}

.achievement-item,
.detail-item,
.skill-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.add-btn {
  background-color: #25c96f;
  border-color: #25c96f;
  color: white;
  padding: 8px 16px;
}

.add-btn:hover,
.add-btn:focus {
  background-color: #27d575;
  border-color: #27d575;
}

.delete-btn {
  flex-shrink: 0;
}

.save-btn {
  font-size: 1rem;
  padding: 10px 30px;
  min-width: 150px;
}

/* Element Plus 组件覆盖样式 */
:deep(.el-input__wrapper) {
  background-color: #2d2d2d;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  border-radius: 4px;
}

:deep(.el-input__inner) {
  color: #f0f0f0;
}

:deep(.el-button) {
  border-radius: 4px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3494e6 inset;
}

:deep(.el-input) {
  width: 100%;
  max-width: 100%;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .admin-container {
    flex-direction: column;
  }

  .preview-section {
    max-height: calc((100vw - 20px) * 9 / 16);
  }

  .preview-inner {
    padding: 16px;
  }

  .preview-content {
    padding: 0 16px;
  }

  .preview-content::-webkit-scrollbar {
    width: 4px;
  }
}

@media (max-width: 768px) {
  .admin-container {
    padding: 10px;
  }

  .preview-wrapper {
    padding: 10px;
  }

  .preview-inner {
    padding: 10px;
  }

  .preview-tabs {
    gap: 10px;
    margin-bottom: 15px;
  }

  .preview-content {
    padding: 0 10px;
  }

  .projects-grid,
  .skills-container {
    grid-template-columns: 1fr;
  }
}
</style>
