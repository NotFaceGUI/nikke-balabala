import { createI18n } from 'vue-i18n'

import zh_CN from './lang/zh_CN'
import en from './lang/en_US'

// const localLang = localStorage.getItem('localLang')

// 获取浏览器语言
const browserLanguage = navigator.language;

console.log('浏览器语言:', browserLanguage);

const i18n = createI18n({
	legacy: false, 
	globalInjection: true, // 全局模式，可以直接使用 $t
	locale: navigator.language,
	messages: {
		'zh-CN': zh_CN, // 中文语言包
		'en': en // 英文语言包
	}
})

export default i18n

