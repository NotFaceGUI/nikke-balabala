<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import ProjectCard from './components/ProjectCard.vue';

import { /* ChatMessageData, */ Project, ProjectType, buttonType, IProjectData, nikkeData, INikkeData, ChatMessageData, builtinImageDatas, NikkeDatabase, Database, addDataToDB, retrieveDataFromDB, Inikkes, enterprise } from './script/project';
import NikkeButton from './components/NikkeButton.vue';
import NikkeWindow from './components/NikkeWindow.vue';
import NikkeDialog from './components/NikkeDialog.vue';
import NikkeRadio from './components/NikkeRadio.vue';
import NikkeInfo from './components/NikkeInfo.vue';
import NikkeIcon from './components/NikkeIcon.vue';
// import NikkeSelect from './components/NikkeSelect.vue';

// import { useI18n } from 'vue-i18n'
import { openDB } from './data/useIndexedDB';
import { saveAs } from 'file-saver';
import NikkeCropper from './components/NikkeCropper.vue';
// const { locale } = useI18n();


const data = reactive([
  { id: ProjectType.Task, type: 'task' },
  { id: ProjectType.Nikke, type: 'nikke' },
  { id: ProjectType.Group, type: 'group' }
]);

const appVersion = "v1.3";



var filteredData = ref<Project[]>([]);
var selectNikke: Array<INikkeData> = reactive([]);
var isSelect: Array<boolean> = reactive([]);
var newProjecData: { proName: string, proType: ProjectType, proDesc: string, author: string } = reactive({
  proName: "默认对话",
  proType: ProjectType.Nikke,
  proDesc: "这是一个简单的小故事",
  author: ""
});

var currentProject = ref(-1);

let customNikkes = reactive<Inikkes>(nikkeData)

var isV = localStorage.getItem("customNikkes"); //'true' 字符串类型的
if (isV === null) {
  localStorage.setItem("customNikkes", JSON.stringify(customNikkes));
} else {

}

function addNikke() {
  isCustomNikke.value = true;
}

function openDialog(index: number) {
  currentProject.value = index;
}

function deleteDialog(index: number) {
  project.datas.splice(index, 1);
  updateData(); // 更新数据
  selectTab(1);
}

function dialogExport(index: number) {
  let currentData = project.datas[index];
  console.log("导出", currentData);
  downloadJson(currentData, currentData.name || '对话数据');
}

function downloadJson(data: any, filename: string) {
  const jsonData = JSON.stringify(data);
  const blob = new Blob([jsonData], { type: 'application/json' });
  saveAs(blob, filename || 'data.json');
}

function select(value: INikkeData, index: number) {
  // 如果数组中有这个元素则代表当前nikke是被选择的，所以要删除元素反之则添加元素
  if (!selectNikke.includes(value)) {
    selectNikke.push(value);
    isSelect[index] = true;
  } else {
    selectNikke = selectNikke.filter(item => item.img !== value.img);
    isSelect[index] = false;
  }
  console.log("已选nikke：", selectNikke);
}

// var msgData: ChatMessageData = reactive({
//   list: [
//     {
//       nikke: nikkeData.nikkes[60],
//       msg: "你好，指挥官！"
//     }
//   ]
// })

var project: IProjectData = reactive({
  datas: []
})

var currentTime = ref('');
var currentTabId = ref(1);
var listNumber = ref(0); // 清单数量
var isShow = ref(false);
var selectType = ref("1"); // 选择对话的模式
var isCustomNikke = ref(false);

let editNikke = ref(false);
let customNikke = ref(false);

const opneNikke = () => {
  editNikke.value = true;
  customNikke.value = false;
}

const opneCustomNikke = () => {
  editNikke.value = false;
  customNikke.value = true;
}

let customNikkeList = ref<Array<any>>([])

function createProject() {
  isShow.value = true;

  retrieveDataFromDB(dbPromise, NikkeDatabase.nikkeProject, 3).then((value) => {
    if (value) {
      customNikkeList.value = JSON.parse(value.customNikkeList);
      console.log("已经有数据了！", customNikkeList.value);

      customNikkeList.value.forEach(v => {
        const isExisting = nikkeData.nikkes.some(existingNikke => existingNikke.img === v.url);
        if (!isExisting) {
          nikkeData.nikkes.push({
            name: v.name,
            img: v.url,
            enterprise: enterprise.自定义
          })
        }

      })
    } else {
      console.log("没有数据");
    }
  });
}



function selectTab(index: number) {
  currentTabId.value = index;
  // 过滤数据
  filteredData.value = project.datas.filter(item => item.type === index);
  listNumber.value = filteredData.value.length;
}

function formatTime(time: number) {
  return time < 10 ? `0${time}` : time
}

function updateTime() {
  const now = new Date()

  const hours = now.getHours()  //小时数
  const minutes = now.getMinutes()  //分钟数
  const seconds = now.getSeconds()  //秒数
  const week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][now.getDay()]  //星期
  //想展示什么  对应的展示即可 
  currentTime.value = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)} ${week}`
}

function jump(url: string) {
  location.href = url;
}

var timer: any;

function showTimes() {
  timer = setInterval(() => {
    updateTime();
  }, 500);
}

function clearTimer() {
  clearInterval(timer);
}

const dbPromise: Promise<IDBDatabase> = openDB("nikkeDatabase");

retrieveDataFromDB(dbPromise, NikkeDatabase.nikkeProject, 3).then((value) => {
  if (value) {
    customNikkeList.value = JSON.parse(value.customNikkeList);
    console.log("已经有数据了！", customNikkeList.value);

    customNikkeList.value.forEach(v => {
      const isExisting = nikkeData.nikkes.some(existingNikke => existingNikke.img === v.url);
      if (!isExisting) {
        nikkeData.nikkes.push({
          name: v.name,
          img: v.url,
          enterprise: enterprise.自定义
        })
      }

    })
  } else {
    console.log("没有数据");
  }
});

function initProject() {
  project = {
    datas: [
      // new Project("测试用Nikke", "描述Nikke", "鬼Nikke", ProjectType.Nikke, msgData),
      // new Project("测试用Nikke1", "描述Nikke1", "鬼Nikke1", ProjectType.Nikke, msgData),
      // new Project("测试用Task", "描述Task", "鬼Task", ProjectType.Task, msgData),
      // new Project("测试用Group", "描述Group", "鬼Group", ProjectType.Group, msgData),
    ]
  }
  // project.datas.forEach(v => {
  //   v.projectNikkes = [{ name: "艾玛", img: "am", enterprise: enterprise.极乐净土 },]
  // })

  var isV = localStorage.getItem('projects'); //'true' 字符串类型的
  if (isV === null) {
    // localStorage.setItem("projects", JSON.stringify(project))
    isV = localStorage.getItem('cData');
    if (isV === null) {
    } else {
      project = JSON.parse(isV);
      let data: Database = { sequenceId: 1, projects: JSON.stringify(project) };
      addDataToDB(dbPromise, NikkeDatabase.nikkeProject, data);
      localStorage.setItem("ccData", JSON.stringify(isV));
      localStorage.removeItem("cData");
    }
  } else {
    project = JSON.parse(isV);
    addDataToDB(dbPromise, NikkeDatabase.nikkeProject, { sequenceId: 1, projects: project })
    localStorage.setItem("cData", isV);
    localStorage.removeItem("projects");
  }

  retrieveDataFromDB(dbPromise, NikkeDatabase.nikkeProject, NikkeDatabase.nikkeData).then((value) => {
    if (value) {
      project = JSON.parse(value.projects);
      console.log("已经有数据了！", project);
      selectTab(1);
    } else {
      console.log("没有数据，数据写入中……");
      addDataToDB(dbPromise, NikkeDatabase.nikkeProject, { sequenceId: 1, projects: project })
    }
  });
}

function customCancel() {
  isCustomNikke.value = false;
  localStorage.setItem("customNikkes", JSON.stringify(nikkeData));
}

function cancel() {
  isSelect.length = 0;
  selectNikke.length = 0;
  isShow.value = false;
  console.log("cancel");
  initData();
}

function checkData() {
  if (newProjecData.proName === "" || newProjecData.author === "" || selectNikke.length == 0) {
    return false;
  }
  return true;
}

function updateData() {
  let str = JSON.stringify(project);
  console.log("更新对象项目到indexDB中");
  let data: Database = { sequenceId: 1, projects: str };
  addDataToDB(dbPromise, NikkeDatabase.nikkeProject, data)
}

function success() {
  if (checkData()) {  // 检查数据
    var msgData: ChatMessageData = {
      list: []
    }
    console.log(project);
    var pro: Project = new Project(newProjecData.proName, newProjecData.proDesc, newProjecData.author, parseInt(selectType.value), msgData);
    selectNikke.forEach(item => pro.projectNikkes.push(item));
    isSelect.length = 0;
    selectNikke.length = 0;
    isShow.value = false;
    project.datas.push(pro);

    updateData();
    selectTab(pro.type.valueOf());
    console.log("success");
    initData();
  } else {
    console.error("创建对话失败，对话名称和作者以及对话妮姬不能小于1不能为空！")
  }
}

function initData() {
  newProjecData = {
    proName: "默认对话",
    proType: ProjectType.Nikke,
    proDesc: "这是一个简单的小故事",
    author: "默认"
  }
}

function back(pro: Project) {
  project.datas[currentProject.value] = pro; // 更新数据
  // localStorage.setItem("projects", JSON.stringify(project)); //写入数据
  let data: Database = { sequenceId: 1, projects: JSON.stringify(project) };
  addDataToDB(dbPromise, NikkeDatabase.nikkeProject, data)
  currentProject.value = -1;
}

function getFontName() {
  var hiddenElement = document.getElementById("fontCheckElement");

  // 如果元素不存在，创建一个
  if (!hiddenElement) {
    hiddenElement = document.createElement("div");
    hiddenElement.id = "fontCheckElement";
    hiddenElement.style.visibility = "hidden";
    hiddenElement.style.position = "absolute";
    hiddenElement.style.fontSize = "12px"; // 设置一个已知的字体大小
    document.body.appendChild(hiddenElement);
  }

  // 获取计算后的样式
  var computedStyle = window.getComputedStyle(hiddenElement);

  // 获取字体名称
  var fontFamily = computedStyle.fontFamily;

  // 返回字体名称
  return fontFamily;
}

let currcurentFont = ref('');

onMounted(() => {
  initProject();
  updateTime();
  showTimes();
  selectTab(1);
  initData();
  currcurentFont.value = getFontName();
  nikkeData.nikkes.forEach(() => {
    isSelect.push(false);
  })
})

// // 2. 添加数据
// const addDataToDB = async (dbPromise: Promise<IDBDatabase>, storeName: string, data: any) => {
//   const db: IDBDatabase = await dbPromise;
//   addData(db, storeName, data);
// };

// // 获取数据
// const retrieveDataFromDB = async (dbPromise: Promise<IDBDatabase>, storeName: string, key: number) => {
//   const db = await dbPromise;
//   const result: any = await getDataByKey(db, storeName, key);
//   return result;
// };

// 删除数据
// const deleteDataFromDB = async (dbPromise: Promise<IDBDatabase>, storeName: string, id: number) => {
//   const db = await dbPromise;
//   deleteDB(db, storeName, id);
// };

onBeforeUnmount(() => {
  clearTimer();
})

function updateCancel() {
  isUpdate.value = false;
}

/* const changeLang = (lang: string) => {
  locale['value'] = lang
  localStorage.setItem('localLang', lang)
  console.log(lang);
} */

let isUpdate = ref(true);

</script>

<template>
  <!-- <div @click="changeLang('en')">{{ $t('menu.task') }}</div> -->
  <!-- :class="{ noList: filteredData.length == 0 }" -->
  <!-- <div style="position: absolute;width: 500px;height: 100%;left: 0;" ref="dialogImg" >
    <NikkeDialog  :current-time="currentTime" :back="back" 
      :dialog-data="filteredData[currentProject]"></NikkeDialog>
  </div> -->
  <div style="height: 100%;" v-if="currentProject !== -1">
    <NikkeDialog :current-time="currentTime" :back="back" :dialog-data="filteredData[currentProject]"></NikkeDialog>
  </div>
  <div style="height: 100%;" v-if="isUpdate">
    <NikkeWindow title="巴拉巴拉生成器 v1.3 更新日志" :cancel="updateCancel" :confirm="false">

      <div class="updateContent">
        <h3
          style="text-align: center;color: #32b1f4;border-bottom: 1px solid #858383;padding-bottom: 5px;box-sizing: content-box;">
          巴拉巴拉 1.3 发布，感谢各位的支持</h3>
        <span style="text-align: center;font-size: 18px;">3/1：更新</span>
        <ul class="updateText" style="list-style: decimal;text-indent: 0em;padding-left: 4em;">
          <li>
            添加新的对话妮姬：
            <div style="display: inline;margin: 2px;">
              <img src="/avatars/ylg.png" style="width: 32px;">
            </div>
          </li>
          <li>
            <span>为window平台提供一个本地的巴拉巴拉生成器，网络环境不佳的可以尝试使用（下载地址：<a href="https://github.com/NotFaceGUI/nikke-balabala/releases/tag/1.3.1">点此跳转 v1.3.1</a>） </span>
          </li>
        </ul>
        <br>


        <span style="text-align: center;font-size: 18px;">2/19：1.3.1更新</span>

        <ul class="updateText" style="list-style: decimal;text-indent: 0em;padding-left: 4em;">
          <li>
            添加新的对话妮姬：
            <div style="display: inline;margin: 2px;">
              <img src="/avatars/chl1.png" style="width: 32px;">
              <img src="/avatars/ctls1.png" style="width: 32px;">
              <img src="/avatars/plwd3.png" style="width: 32px;">
            </div>
          </li>
          <li>
            <span style="color: rgb(255, 78, 78);">修改名称必须修改完创建新对话才生效！</span>
          </li>
          <li>
            <span style="color: rgb(255, 78, 78);">新建新角色时，选择角色时如果没有出现请选择其他角色刷新即可</span>
          </li>
          <br>
        </ul>

        <span style="text-align: center;font-size: 18px;">1/23：1.3更新</span>
        <ul class="updateText" style="list-style: decimal;text-indent: 0em;padding-left: 4em;">
          <li>
            新增自定义妮姬。支持新增、修改、自定义头像等功能。
          </li>
          <li>修复部分妮姬名称显示</li>
          <li>若干bug修复</li>
        </ul>
        <h3
          style="text-align: center;color: #32b1f4;border-bottom: 1px solid #858383;padding-bottom: 5px;box-sizing: content-box;">
          巴拉巴拉 1.2 发布，感谢各位的支持</h3>
        <span style="text-align: center;font-size: 18px;">12/24：更新</span>
        <ul class="updateText" style="list-style: decimal;text-indent: 0em;padding-left: 4em;">
          <li>
            添加新的对话妮姬：
            <div style="display: inline;margin: 2px;">
              <img src="/avatars/sdldml.png" style="width: 32px;">
              <img src="/avatars/sdmk.png" style="width: 32px;">
            </div>
          </li>
          <br>
        </ul>
        <span style="text-align: center;font-size: 18px;">12/03：重大更新</span>
        <ul class="updateText" style="list-style: decimal;text-indent: 0em;padding-left: 4em;">
          <li>
            废弃原先的存储方式，采用IndexedDB，使得本地图片的大小没有限制。
            <ul style="padding-left: 1em;">
              <li>fix 1: 修复图片过大导致的无法保存的问题。</li>
              <li>fix 2: 紧急修复数据消失的问题。</li>
            </ul>
          </li>
          <li>添加导出对话的功能，可将对话导出至本地（日后将会开放在线巴拉巴拉的功能各位可以上传自己的对话数据，以供他人观看 具体内容请加群：<div class="qq"
              @click="jump('http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=q58gDR3R88UQTboHAvFoUb0bImyL_IQc&authKey=iA8KsKpWt0QnhjhhCknz71hgR7NcDJ6tQcMvNgcwYvUWhGD1Pcb8%2B%2BoysZr6G1gk&noverify=0&group_code=629686535')">
            </div>
            ）</li>
          <li>添加删除指定对话的功能。</li>
          <li>添加对话的添加删除动画，使得更加顺滑。</li>
          <li>修复对象：<div style="display: inline;margin: 2px;">
              <img src="/avatars/npc1.png" style="width: 32px;">
            </div> 由 <span style="color: red;">"NPC 1"</span> 修改为：<span style="color: green;">"露姬"</span>
          </li>
          <li>
            添加新的对话妮姬：
            <ul>
              <li>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/klw.png" style="width: 32px;">
                </div>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/cxsxhm.png" style="width: 32px;">
                </div>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/cxsdhm.png" style="width: 32px;">
                </div>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/cxsbx.png" style="width: 32px;">
                </div>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/cxstls.png" style="width: 32px;">
                </div>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/cxshl.png" style="width: 32px;">
                </div>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/cxscfgz.png" style="width: 32px;">
                </div>
              </li>
            </ul>
          </li>
          <li>添加猫猫红莲：<div style="display: inline;margin: 2px;">
              <img src="/avatars/cmmhl.png" style="width: 32px;">
            </div>
          </li>
          <li>添加doro：<div style="display: inline;margin: 2px;">
              <img src="/avatars/doro.png" style="width: 32px;">
            </div>
          </li>
          <li>修复对话无法滚动的问题。</li>
          <li>修复部分对话消失的问题。</li>
          <li>修复图片类型的对话无法进行添加和删除，当一个消息类型为图片时会触发这个问题。</li>
        </ul>
        <h3 class="hline"></h3>
        <ul class="updateText" style="list-style: decimal;text-indent: 0em;padding-left: 4em;">
          <li>添加了在对话中添加妮姬的功能</li>
          <li>
            重写图片逻辑添加本地图片、内置图片、立绘差分的类别
            <ul>
              <li>添加内置图片内容如下:</li>
              <li>
                <div style="display: inline;margin: 2px;" v-for="value in builtinImageDatas">
                  <img :src="value" style="width: 32px;">
                </div>
              </li>
            </ul>
          </li>
          <li>
            添加新的对话妮姬、具体如下：
            <ul>
              <li>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/clls.png" style="width: 32px;">
                </div>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/chgn.png" style="width: 32px;">
                </div>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/nye1.png" style="width: 32px;">
                </div>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/cdzhg.png" style="width: 32px;">
                </div>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/npc12.png" style="width: 32px;">
                </div>
                <div style="display: inline;margin: 2px;">
                  <img src="/avatars/npc13.png" style="width: 32px;">
                </div>
              </li>
            </ul>
          </li>

          <li>修复若干问题。</li>
        </ul>

        <h3
          style="text-align: center;color: #940606;border-bottom: 1px solid #940606;padding-bottom: 5px;box-sizing: content-box;">
          巴拉巴拉 1.2 发布预告 12.1/12:30</h3>
        <p class="updateText" style="color: #940606;text-align: center;">
          ！！！！更新了对话数据结构！！！！
        </p>
        <p class="updateText" style="color: #940606;text-align: center;">
          ！！！！更新了对话数据结构！！！！
        </p>
        <p class="updateText" style="color: #940606;text-align: center;">
          ！！！！更新了对话数据结构！！！！
        </p>
        <p class="updateText" style="color: #940606;text-align: center;">
          请在晚上七点前将未完成的对话导出，不然将无法正常过渡到新版本
        </p>

        <h3
          style="text-align: center;color: #32b1f4;border-bottom: 1px solid #858383;padding-bottom: 5px;box-sizing: content-box;">
          巴拉巴拉 1.1 发布，感谢各位的支持</h3>
        <span>11.24 日更新：</span>
        <p class="updateText">
          1. 添加当前使用的字体显示
        </p>
        <p class="updateText">
          2. 添加警告消息
        </p>
        <h3 class="hline"></h3>
        <span>11.23 日更新：</span>
        <p class="updateText">
          1. 添加红莲、长发公主（一周年形态）头像
        </p>
        <p class="updateText">
          2. 添加反馈入口
        </p>
        <h3 class="hline"></h3>
        <span>11.22 日更新：</span>
        <p class="updateText">
          1. 添加了“分支消息模块”。
        </p>
        <p class="updateText">
          2. 添加旁白、分支、分割消息模块的编辑操作。
        </p>
        <p class="updateText">
          3. 添加i18n框架。
        </p>
        <p class="updateText">
          4. 添加导出图片是否显示水印功能。
        </p>
        <h3 class="hline"></h3>
        <span>1. 退化字体大小 1M → 8M。</span>
        <NikkeInfo>
          <span style="font-size: 14px;">（如有系统字体请等待站内字体加载完毕后进行生成操作）</span>
        </NikkeInfo>
        <span>2. 添加消息编辑：</span>
        <p class="updateText">
          新增上添加、编辑、删除，下添加的编辑功能。具体使用教程请关注<a href="https://space.bilibili.com/215262853/">B站凤雏庙</a>的教程视频。
        </p>
        <span>3. 优化文本编辑逻辑：</span>
        <p class="updateText">
          1. 在输入框内按 <a href="#">enter</a> 可让文本直接新增
        </p>
        <p class="updateText">
          2. 在输入框内按 <a href="#">tab</a> 可让文本直接追加
        </p>
        <span>4. 详细项：</span>
        <p class="updateText">
        <div>1.添加了导出图片的具体设置</div>
        <div>2.新增png和jepg两种图片格式</div>
        <div>3.新增图片缩放大小选项解决图片中文字模糊的问题</div>
        <div>4.修复对话过少导致对话图片导出不正确的问题</div>
        <div>5.添加新的对话nikke：白雪公主：纯真年代、朵拉、布兰尔、波利、坎西以及大部分nikke皮肤头像 </div>
        <div>6.添加了图片消息 支持本地导入图片 也可导入动图</div>
        <div>7.优化UI显示效果 和游戏的效果大差不差了</div>
        <div>8.添加旁白消息类型和分割消息类型并优化其布局</div>
        </p>
      </div>
    </NikkeWindow>
  </div>
  <div>
    <div style="height: 100%;" class="btnbox">
      <NikkeButton :type="buttonType.Cancel" content="导出对话" style="width: 150px;height: 45px;margin: 5px;">
      </NikkeButton>
      <NikkeButton :type="buttonType.Success" @click="createProject()" content="创建对话"
        style="width: 150px;height: 45px;margin: 5px;"></NikkeButton>
      <NikkeButton :type="buttonType.Success" content="添加自定义对话对象" @click="addNikke"
        style="width: 170px; height: 45px; margin: 5px">
      </NikkeButton>
    </div>
  </div>
  <div style="height: 100%;width: 100%;">
    <div class="box">
      <NikkeWindow id="createProject" title="创建对话" :confirm="true" :show="isShow" v-if="isShow" button-cancel="取消"
        :cancel="cancel" :success="success" button-success="创建">
        <div class="project">
          <div class="label">
            <div class="pcontent">
              <span>对话名称 *</span>
              <input class="nikkeInput" v-model="newProjecData.proName" type="text">
            </div>
            <div class="pcontent">
              <span>对话类型</span>
              <NikkeRadio :checked="true" label="任务" style="flex: 1;">
                <div style="margin: 0; display: flex; justify-content: space-between;">
                  <div>
                    <input id="task" type="radio" value="0" name="projectType" v-model="selectType">
                    <label for="task">{{ $t('menu.task') }}</label>
                  </div>
                  <div>
                    <input id="nikke" type="radio" value="1" name="projectType" v-model="selectType" checked>
                    <label for="nikke">{{ $t('menu.nikke') }}</label>
                  </div>
                  <div>
                    <input id="group" type="radio" value="2" name="projectType" v-model="selectType">
                    <label for="group">{{ $t('menu.group') }}</label>
                  </div>
                </div>
                <NikkeInfo>
                  (只实现了妮姬项目类型)
                </NikkeInfo>
              </NikkeRadio>
            </div>
            <div class="pcontent">
              <span>描述</span>
              <input class="nikkeInput" v-model="newProjecData.proDesc" type="text">
            </div>
            <div class="pcontent">
              <span>作者 *</span>
              <input style="flex: 0;width: 120px;" class="nikkeInput" type="text" maxlength="20"
                v-model="newProjecData.author" placeholder="your name">
            </div>
            <div style="height: 1px;background-color: #e6e7e6;"></div>
            <div>
              <span>选择对话妮姬（可多选|至少选一个）</span>

            </div>
            <div class="nikkeSelect" v-if="selectType == '1'">
              <div class="enterprise">
                <div class="enterpriseBox" style="background-color: #32b1f4;">ALL</div>
                <div class="enterpriseBox">极乐净土</div>
                <div class="enterpriseBox">米西利斯</div>
                <div class="enterpriseBox">泰特拉</div>
                <div class="enterpriseBox">朝圣者</div>
                <div class="enterpriseBox">NPC</div>
              </div>
              <div class="nikkeGrid">
                <div class="nikke" :class="{ nikkeCheck: isSelect[index] }" @click="select(value, index)"
                  v-for="(value, index) in nikkeData.nikkes" :key="index"
                  :style="{ backgroundImage: value.enterprise != enterprise.自定义 ? 'url(avatars/' + value.img + '.png)' : 'url(' + value.img + ')' }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </NikkeWindow>
      <div v-if="isCustomNikke" style="width: 100%;height: 100%;position: absolute;">
        <NikkeWindow id="customNikke" title="添加自定义妮姬" :show="isCustomNikke" :confirm="false" :cancel="customCancel">
          <div style="display: flex;justify-content: center;">
            <NikkeButton :type="buttonType.Success" content="修改现有妮姬" @click="opneNikke"
              style="width: 150px;height: 45px;margin: 5px;">
            </NikkeButton>
            <NikkeButton :type="buttonType.Success" content="添加自定义对象" @click="opneCustomNikke"
              style="width: 150px;height: 45px;margin: 5px;">
            </NikkeButton>
          </div>

          <NikkeInfo>

            <div class="error">
              <span style="color: rgb(93, 182, 93); font-size: 12px;">
                请在需要修改的妮姬对象下填入新的名字，并保存。
              </span>
            </div>
          </NikkeInfo>
          <div class="nikkeInfo addNikke" style="margin: 10px 0;" v-if="editNikke">
            <div v-for="(value, index) in nikkeData.nikkes" :key="index"
              style="display: flex;align-items: center;margin: 0 5px;">
              <div class="nikke" style="min-width: 64px;"
                :style="{ backgroundImage: 'url(avatars/' + value.img + '.png)' }">
              </div>
              <div style="flex: 1;display: flex;justify-content: center;flex-direction: column;">
                <input class="nikkeInput" style="margin-bottom: 5px;" type="text" disabled name="" id=""
                  :value="value.name">
                <input class="nikkeInput" type="text" name="" id="" v-model="value.name">
              </div>
            </div>
          </div>
          <div class="nikkeInfo addNikke" style="margin: 10px 0;" v-if="customNikke">
            <div class="addCustomNikke">
              <NikkeCropper></NikkeCropper>
            </div>

          </div>

        </NikkeWindow>

      </div>


      <div class="box back"><img src="/background.png" style="width: 100%;height: 100%;object-fit: cover;"></div>


      <div class="header">
        <div class="tilte">
          <span style="vertical-align: middle;">
            <img src="/wifi.png" style="width: 18px;">
          </span>
          {{ currentTime }}
          <span style="font-size: 12px;margin-left: auto;">当前字体：{{ currcurentFont }}</span>
          <span class="logoText">生成器 {{ appVersion }}</span>
        </div>
        <div class="logo">
          <NikkeIcon></NikkeIcon>
          <span>balabala</span>

        </div>
        <div class="tab">
          <span class="tabName" :class="{ show: value.id == currentTabId }" v-for="value in data"
            @click="selectTab(value.id)">
            {{ $t(`menu.${value.type}`) }}
          </span>
        </div>
      </div>
      <div class="text">
        <span>对话清单: ({{ listNumber }})</span>
        <span style="margin-left: auto;">最新对话 </span>
        <span style="color: grey; margin: 0 5px;"> | </span>
        <span>图标 </span>
      </div>
      <div class="content">

        <div class="cardList container">
          <TransitionGroup tag="ul" name="fade">
            <div v-for="(value, index) in filteredData" :key="index">
              <ProjectCard :select-nikkes="value" @click="openDialog(index)">
                <div class="dialogDelete" @click.stop="deleteDialog(index)"></div>
                <div class="dialogExport" @click.stop="dialogExport(index)"></div>
              </ProjectCard>
            </div>
          </TransitionGroup>
        </div>
      </div>
      <div class="floor"></div>
    </div>
  </div>
</template>

<style scoped>
.addCustomNikke {
  color: black;
}

.addNikke {
  max-height: 75%;
  overflow-y: scroll;
}

.nikkeInfo {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 5px;
}

.customNikke {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 5px;
}

.qq {
  display: inline-block;
  margin-right: 5px;
  width: 32px;
  height: 32px;
  background: url("/icon/qq.svg") no-repeat;
  background-size: 32px;
}

.container {
  position: relative;
  padding: 0;
}

.dialogDelete {
  position: absolute;
  background: url("/icon/delete.svg") center no-repeat;
  right: 10px;
  top: 35px;
  width: 25px;
  height: 25px;

}

.dialogExport {
  position: absolute;
  background: url("/icon/export.svg") center no-repeat;
  background-size: 25px;
  right: 40px;
  top: 35px;
  width: 25px;
  height: 25px;
}

/* 1. 声明过渡效果 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. 声明进入和离开的状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.hline {
  text-align: center;
  color: #32b1f4;
  border-bottom: 1px solid #c7c7c7;
  padding-bottom: 5px;
  box-sizing: content-box;
}

.updateText {
  font-size: 15px;
  text-indent: 2em;
  margin: 0;
}

.updateContent {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  color: #1a1515;
}

@media (min-width: 578px) {
  .box {
    width: 520px;
    height: 100vh;
    min-height: 550px;
    min-width: 250px;
    margin: 0 auto;
    background-color: #f1f1f1;
  }
}


.enterprise {
  display: flex;
  justify-content: center;
}

.project {
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;

}

.enterpriseBox {
  margin: 5px !important;
  font-size: 12px;
  box-sizing: border-box;
  background-color: #323232;
  border-radius: 10px;
  color: white;
  width: 45px;
  height: 45px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0px 0px 5px black;
  transition: all .1s ease-in-out;
}

.nikkeSelect {
  max-height: 50%;
}

.enterpriseBox:active {
  transform: scale(0.9);
}

.nikkeGrid {
  display: grid;
  grid-template-columns: 65px 65px 65px 65px;
  justify-content: center;
  align-items: center;
  justify-items: center;
  gap: 5px;
  row-gap: 0;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 5px 0;
}

.nikke {
  width: 60px;
  height: 60px;
  margin: 5px;
  background-color: #c6c6c6;
  border-radius: 5px;
  border: 2px #c6c6c6 solid;
  /* background-image: url("/nikke/bx.png"); */
  background-repeat: no-repeat;
  background-size: 60px 60px;
  transition: border 0.1s ease-in-out;
}

.nikkeCheck {
  border: 2px #32b1f4 solid;
}

.nikkeCheck::before {
  content: "";
  display: block;
  width: 60px;
  height: 60px;
  background-color: #1a151559;
  background-image: url("/select.png");
  background-repeat: no-repeat;
  background-size: 48px;
  background-position: center center;
  opacity: 0.8;
}

.label div {
  margin: 5px 0;
}

.label {
  color: rgb(59, 50, 50);
  display: flex;
  font-weight: bold;
  letter-spacing: 2px;
  font-size: 14px;
  flex-direction: column;
}

.pcontent span {
  width: 30%;
  line-height: 25px;
}

.pcontent {
  display: flex;
  flex: 1;
}

.cardList:last-child {
  position: relative;
  margin-bottom: 150px;
}

.text {
  display: flex;
  color: rgb(59, 50, 50);
  font-weight: bold;
  font-size: 14px;
  margin: 5px 10px 0 10px;
}

.box {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 20px 20px 60px #000000,
    -20px -20px 60px #1a1515;
  transition: all 0.3s ease-in-out;


}

.noList {
  background-image: url(/bg.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
}

.btnbox {
  width: 100%;
  height: 50px !important;
  display: flex;
  justify-content: center;
  align-items: end;
  position: absolute;
  bottom: 20px;
  z-index: 999;
}

.tilte {
  position: relative;
  z-index: 10;
  font-size: 14px;
  padding: 2px 10px;
}

.back {
  position: absolute;
  z-index: 999999;
  box-shadow: none;
  transform: translateY(-100vh);
  animation: slideIn .8s ease-in-out 1;
}

@keyframes slideIn {
  0% {
    transform: translateY(0);
  }

  40% {

    transform: translateY(0) scaleY(1);

  }

  99% {
    transform: translateY(-100vh) scaleY(0.4);
  }

  100% {
    transform: translateY(-99999px) scaleY(0.4);
  }
}

.header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 18.8%;
  box-shadow:
    0px 0px 4.1px rgba(0, 0, 0, 0.019),
    0.1px 0.1px 8.3px rgba(0, 0, 0, 0.028),
    0.1px 0.1px 12.7px rgba(0, 0, 0, 0.034),
    0.2px 0.2px 17.4px rgba(0, 0, 0, 0.04),
    0.3px 0.3px 23.1px rgba(0, 0, 0, 0.046),
    0.4px 0.4px 31.1px rgba(0, 0, 0, 0.052),
    0.7px 0.7px 46.3px rgba(0, 0, 0, 0.061),
    1px 1px 94px rgba(0, 0, 0, 0.08);
  background: linear-gradient(transparent 50%, #fda912 50%),
    linear-gradient(90deg, transparent 50%, #f8be5379 50%);
  background-size: 5px 5px;
  background-position: center;
  background-color: #fda912;
}

/* .header::after {
  content: "";
  z-index: 1;
  position: absolute;
  background-image: url('data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAABiAgMAAAAXTKQxAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACVBMVEX3t0X3t0X///+98LFLAAAAAXRSTlMAQObYZgAAAAFiS0dEAmYLfGQAAAAHdElNRQfnCxYRBSCeyqUCAAABAUlEQVRIx+2WyxHDIAxExYES1A8l6GD6byWO7RAw0q5nOCa6vtHu+oOEyLdyPaqIW1qvMkhdnmtXk36qQ93xSOsGpGf5Ox3bp+axfaZ9e3JwF149bEi7U88ubuHUx4a0m3oKcIXWH3ONsCHryzy0Ps1zjAvHGmNDyc5sGIPg7+gEZ4QLw4qwLWJE9wf/49/CivDqv5YRpsdg7QiuHX82W0D0B4OLTEUyU9lEDs3Lk21AdgnbRIF5W7JQm+5QsoHJ/mbbn9wd2M2D3FvYrYfcmQZsgrBDO1wkxi5rn2UTiKNmwc2CmxNuzu6rHLDFWJH0kQzQBFIf1kh6t0ZUoLSk6JleKJaqutiaJukAAAAASUVORK5CYII=');
  background-repeat: no-repeat;
  background-size: 256px;
  width: 256px;
  height: 256px;
  top: -100px;
  right: -40px;
  opacity: 0.6;
} */

.content {
  max-height: 82.2%;

  overflow-y: scroll;
  overflow-x: hidden;
}

div::-webkit-scrollbar {
  width: 0;
  /* 隐藏滚动条 */
}

.content::-webkit-scrollbar-thumb {
  background: #ccc;
  /* 滚动条thumb颜色 */
  border-radius: 5px;
  /* 滚动条thumb圆角 */
}

.content::-webkit-scrollbar-track {
  background: transparent;
  /* 滚动条轨道颜色 */
  border-radius: 5px;
  /* 滚动条轨道圆角 */
}

.logoText {
  position: absolute;
  right: 10px;
  top: 2px;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: bold;
}

.logo {
  position: relative;
  font-family: cursive;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  z-index: 10;
  line-height: 35px;
}

.tab {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.tabName {
  margin: 0 20px;
  box-sizing: border-box;
  height: 100%;
  flex: 1;
  line-height: 35px;
  text-align: center;
  border: 7px transparent solid;
  transition: all 0.1s ease-in-out;
  font-weight: 600;
  font-size: 18px;
}

.show {
  border: 7px transparent solid;
  border-bottom: 7px white solid;
}



@media (max-width: 578px) {
  .box {

    border-radius: 0;
    width: 100%;
    max-width: 100%;
    /* max-width: 80vw;
    min-width: 350px;
    min-height: 550px; */
    height: 100%;
    max-width: 100%;
    margin: 0 auto;
    background-color: #f1f1f1;
  }
}
</style>
