import type { Component } from 'vue'

/**
 * 登录页面相关类型定义
 */
// 登录表单类型
export interface LoginForm {
  email: string
  password: string
}

// 用户信息类型
export interface User {
  uid: string
  email: string
  name: string
  avatar?: string
  avatar_url?: string
  telephone: string
  is_superuser: boolean
  last_login: string | null
  is_active?: boolean
}

// 登录响应类型
export interface LoginResponse {
  code: number
  message: string
  token: string
  user: User
}

/**
 * 注册页面相关类型定义
 */
// 发送验证码表单类型
export interface InitCodeForm {
  email: string
}

// 发送验证码响应类型
export interface InitCodeResponse {
  code: number
  message: string
}

// 注册表单类型
export interface RegisterForm {
  email: string
  code: string
  name: string
  telephone: string
}

// 注册响应类型
export interface RegisterResponse {
  code: number
  message: string
}

/**
 * 激活页面, 用户后台管理页面相关数据定义
 */

// 后台用户列表
export interface UserResponse {
  status: number
  data: User[]
}

// 激活用户参数
export interface ActiveUserParams {
  activekey: string
  password: string
  confirm_password: string
}

// 同意用户注册参数(发送激活邮件)
export interface AgreeUserParams {
  email: string
}

/**
 * 重置密码相关类型定义
 */

// 修改密码参数类型
export interface ResetPasswordParams {
  uid: string
  email: string
  old_password: string
  password: string
  confirm_password: string
}

// 修改密码响应类型
export interface ResetPasswordResponse {
  code: number
  message: string
}

/**
 * WelcomeView 页面数据类型
 */
export interface WelcomeResponse {
  code: number
  message: string
  data: WelcomeData
}

export interface Description {
  id: number
  content: string
}

export interface WelcomeData {
  title: string
  buttonText: string
  descriptions: Description[]
}

/**
 * AboutMeView 页面数据类型
 */
export type SectionContent = {
  work: WorkExperience[]
  education: Education[]
  projects: Project[]
  skills: SkillCategory[]
}

export interface WorkExperience {
  id: number
  title: string
  company: string
  period: string
  achievements: string[]
}

export interface Education {
  id: number
  major: string
  school: string
  period: string
  degree: string
  description: string
}

export interface Project {
  id: number
  name: string
  techStack: string
  details: string[]
}

export interface SkillCategory {
  id: number
  name: string
  skills: string[]
}

export interface Section {
  id: number
  type: keyof SectionContent
  title: string
  icon: Component
  content: SectionContent[keyof SectionContent]
}

/**
 * BoardView 页面相关类型定义
 */
// 子回复类型
export interface SubReply {
  id: number
  username: string
  avatar: string
  time: string
  content: string
  replyTo?: number // 引用的子回复ID
}

// 回复类型
export interface Reply {
  id: number
  username: string
  avatar: string
  time: string
  content: string
  replies?: SubReply[] // 子回复列表
  replyTo?: number // 引用的回复ID
}

// 主留言类型
export interface Message {
  id: number
  username: string
  avatar: string
  time: string
  content: string
  replies?: Reply[]
}

/**
 * 用户页面相关类型
 */
// 上传响应类型
export interface UploadResponse {
  url: string
  message?: string
}

// 上传错误类型
export interface UploadError {
  message: string
  status?: number
  response?: unknown
}

// 裁剪数据类型
export interface CropperData {
  x: number
  y: number
  width: number
  height: number
  rotate: number
  scaleX: number
  scaleY: number
}

// 用户表单类型
export interface UserForm {
  name: string
  avatar: string
}
