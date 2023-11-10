
export enum ProjectType {
    Task, // 任务
    Nikke, // 妮姬
    Group, // 组
}

export enum buttonType {
    Success,
    Cancel,
    Reward,
}

export enum msgType {
    nikke = "对话",
    commander = "指挥官",
    img = "图片",
    aside = "旁白",
    partition = "分割"
}

export enum exportImgType {
    png,
    jpeg
}


export enum enterprise {
    极乐净土,
    米西利斯,
    泰特拉,
    朝圣者,
    反常,
    配角,
    主角,
    动物,
    莱彻
}

// 角色信息
export enum nikke {
    Test,
}

export class ChatMessageData {
    list!: Array<ICharacterData>;
}

export class Project {
    name: string | undefined;
    author: string | undefined;
    description: string | undefined;
    type: ProjectType;
    messageData: ChatMessageData;
    projectNikkes: Array<INikkeData> = [];
    constructor(name: string, description: string, author: string, type: ProjectType, messageData: ChatMessageData) {
        this.name = name;
        this.description = description;
        this.type = type == undefined ? ProjectType.Nikke : type;
        this.author = author;
        this.messageData = messageData;
    }
}

export interface ICharacterData {
    msgType: msgType
    nikke: INikkeData,
    msg: Array<string>
}

export interface IProjectData {
    datas: Array<Project>;
}

export interface ImgConfig {
    width: number,
    maxWidth: number,
    bottomHeigth: number,
}


export interface Inikkes {
    nikkes: Array<INikkeData>
}

export interface INikkeData {
    name: string,
    img: string
    enterprise: enterprise
}

// nikke 数据
export var nikkeData: Inikkes = {
    nikkes: [
        { name: "艾玛", img: "am", enterprise: enterprise.极乐净土 },
        { name: "艾玛", img: "am1", enterprise: enterprise.极乐净土 },
        { name: "艾玛", img: "am2", enterprise: enterprise.极乐净土 },
        { name: "普丽瓦蒂", img: "plwd", enterprise: enterprise.极乐净土 },
        { name: "普丽瓦蒂", img: "plwd1", enterprise: enterprise.极乐净土 },
        { name: "普丽瓦蒂", img: "plwd2", enterprise: enterprise.极乐净土 },
        { name: "西格娜", img: "xgn", enterprise: enterprise.极乐净土 },
        { name: "西格娜", img: "xgn1", enterprise: enterprise.极乐净土 },
        { name: "迪赛尔", img: "dse", enterprise: enterprise.极乐净土 },
        { name: "迪赛尔", img: "dse1", enterprise: enterprise.极乐净土 },
        { name: "迪赛尔", img: "dse2", enterprise: enterprise.极乐净土 },
        { name: "吉萝婷", img: "jlt", enterprise: enterprise.极乐净土 },
        { name: "米兰达", img: "mld", enterprise: enterprise.极乐净土 },
        { name: "波莉", img: "bl", enterprise: enterprise.极乐净土 },
        { name: "波莉", img: "bl1", enterprise: enterprise.极乐净土 },
        { name: "布丽德", img: "bld", enterprise: enterprise.极乐净土 },
        { name: "布丽德", img: "bld1", enterprise: enterprise.极乐净土 },
        { name: "布丽德", img: "bld2", enterprise: enterprise.极乐净土 },
        { name: "索林", img: "sl", enterprise: enterprise.极乐净土 },
        { name: "梅登", img: "md", enterprise: enterprise.极乐净土 },
        { name: "贝斯蒂", img: "bsd", enterprise: enterprise.极乐净土 },
        { name: "海伦", img: "hl", enterprise: enterprise.极乐净土 },
        { name: "海伦", img: "hl1", enterprise: enterprise.极乐净土 },
        { name: "马斯特", img: "mst", enterprise: enterprise.极乐净土 },
        { name: "马斯特", img: "mst1", enterprise: enterprise.极乐净土 },
        { name: "马斯特", img: "mst2", enterprise: enterprise.极乐净土 },
        { name: "马斯特", img: "mst3", enterprise: enterprise.极乐净土 },
        { name: "D", img: "d", enterprise: enterprise.极乐净土 },
        { name: "尼恩：蓝色海洋", img: "sne", enterprise: enterprise.极乐净土 },
        { name: "海伦：海蓝宝石", img: "shl", enterprise: enterprise.极乐净土 },
        { name: "玛律恰那", img: "mlqn", enterprise: enterprise.极乐净土 },
        { name: "基里", img: "jl", enterprise: enterprise.极乐净土 },
        { name: "拉毗", img: "lp", enterprise: enterprise.极乐净土 },
        { name: "拉毗", img: "lp1", enterprise: enterprise.极乐净土 },
        { name: "拉毗", img: "lp2", enterprise: enterprise.极乐净土 },
        { name: "德尔塔", img: "det", enterprise: enterprise.极乐净土 },
        { name: "尼恩", img: "ne", enterprise: enterprise.极乐净土 },
        { name: "尼恩", img: "ne1", enterprise: enterprise.极乐净土 },
        { name: "安克", img: "ak", enterprise: enterprise.极乐净土 },
        { name: "士兵E.G", img: "eg", enterprise: enterprise.极乐净土 },
        { name: "士兵F.A", img: "fa", enterprise: enterprise.极乐净土 },
        { name: "士兵O.W", img: "ow", enterprise: enterprise.极乐净土 },
        { name: "谢芙蒂", img: "xfd", enterprise: enterprise.极乐净土 },
        { name: "谢芙蒂", img: "xfd1", enterprise: enterprise.极乐净土 },
        { name: "麦斯威尔", img: "mswe", enterprise: enterprise.米西利斯 },
        { name: "麦斯威尔", img: "smwe1", enterprise: enterprise.米西利斯 },
        { name: "尤妮", img: "yn", enterprise: enterprise.米西利斯 },
        { name: "尤妮", img: "yn1", enterprise: enterprise.米西利斯 },
        { name: "尤莉亚", img: "yly", enterprise: enterprise.米西利斯 },
        { name: "尤莉亚", img: "yly1", enterprise: enterprise.米西利斯 },
        { name: "德雷克", img: "dlk", enterprise: enterprise.米西利斯 },
        { name: "德雷克", img: "dlk1", enterprise: enterprise.米西利斯 },
        { name: "艾德米", img: "adm", enterprise: enterprise.米西利斯 },
        { name: "艾菲涅尔", img: "afne", enterprise: enterprise.米西利斯 },
        { name: "桑迪", img: "sd", enterprise: enterprise.米西利斯 },
        { name: "桑迪", img: "sd1", enterprise: enterprise.米西利斯 },
        { name: "丽塔", img: "lt", enterprise: enterprise.米西利斯 },
        { name: "丽塔", img: "lt1", enterprise: enterprise.米西利斯 },
        { name: "佩珀", img: "pb", enterprise: enterprise.米西利斯 },
        { name: "佩珀", img: "pb1", enterprise: enterprise.米西利斯 },
        { name: "拉普拉斯", img: "lpls", enterprise: enterprise.米西利斯 },
        { name: "安妮：奇迹仙女", img: "sdan", enterprise: enterprise.米西利斯 },
        { name: "豺狼", img: "cl", enterprise: enterprise.米西利斯 },
        { name: "吉尔提", img: "jet", enterprise: enterprise.米西利斯 },
        { name: "森", img: "s", enterprise: enterprise.米西利斯 },
        { name: "坎西", img: "kx", enterprise: enterprise.米西利斯 },
        { name: "娜嘉", img: "nj", enterprise: enterprise.米西利斯 },
        { name: "蒂亚", img: "dy", enterprise: enterprise.米西利斯 },
        { name: "朵拉", img: "dl", enterprise: enterprise.米西利斯 },
        { name: "朵拉", img: "dl1", enterprise: enterprise.米西利斯 },
        { name: "N102", img: "n102", enterprise: enterprise.米西利斯 },
        { name: "艾瑟儿", img: "ase", enterprise: enterprise.米西利斯 },
        { name: "米哈拉", img: "mhl", enterprise: enterprise.米西利斯 },
        { name: "产品08", img: "08", enterprise: enterprise.米西利斯 },
        { name: "产品12", img: "12", enterprise: enterprise.米西利斯 },
        { name: "产品23", img: "23", enterprise: enterprise.米西利斯 },
        { name: "艾可希雅", img: "akxy", enterprise: enterprise.泰特拉 },
        { name: "艾可希雅", img: "akxy1", enterprise: enterprise.泰特拉 },
        { name: "爱丽丝", img: "als", enterprise: enterprise.泰特拉 },
        { name: "爱丽丝", img: "als1", enterprise: enterprise.泰特拉 },
        { name: "舒格", img: "sg", enterprise: enterprise.泰特拉 },
        { name: "舒格", img: "sg1", enterprise: enterprise.泰特拉 },
        { name: "普琳玛", img: "plm", enterprise: enterprise.泰特拉 },
        { name: "普琳玛", img: "plm1", enterprise: enterprise.泰特拉 },
        { name: "梅里", img: "ml", enterprise: enterprise.泰特拉 },
        { name: "鲁德米拉", img: "ldml", enterprise: enterprise.泰特拉 },
        { name: "阿莉亚", img: "aly", enterprise: enterprise.泰特拉 },
        { name: "诺伊斯", img: "nys", enterprise: enterprise.泰特拉 },
        { name: "杨", img: "y", enterprise: enterprise.泰特拉 },
        { name: "杨", img: "y1", enterprise: enterprise.泰特拉 },
        { name: "尤尔夏", img: "yex", enterprise: enterprise.泰特拉 },
        { name: "诺薇尔", img: "nwe", enterprise: enterprise.泰特拉 },
        { name: "诺薇尔", img: "nwe1", enterprise: enterprise.泰特拉 },
        { name: "诺薇尔", img: "nwe2", enterprise: enterprise.泰特拉 },
        { name: "富克旺", img: "fkw", enterprise: enterprise.泰特拉 },
        { name: "米尔克", img: "mek", enterprise: enterprise.泰特拉 },
        { name: "米尔克", img: "mek1", enterprise: enterprise.泰特拉 },
        { name: "露菲", img: "lf", enterprise: enterprise.泰特拉 },
        { name: "露菲", img: "lf1", enterprise: enterprise.泰特拉 },
        { name: "露菲：冬日购物狂", img: "sdlf", enterprise: enterprise.泰特拉 },
        { name: "毒蛇", img: "ds", enterprise: enterprise.泰特拉 },
        { name: "毒蛇", img: "ds1", enterprise: enterprise.泰特拉 },
        { name: "可可", img: "kk", enterprise: enterprise.泰特拉 },
        { name: "索达", img: "nsd", enterprise: enterprise.泰特拉 },
        { name: "牡丹", img: "hdmd", enterprise: enterprise.泰特拉 },
        { name: "罗珊娜", img: "lsn", enterprise: enterprise.泰特拉 },
        { name: "樱花", img: "hdyh", enterprise: enterprise.泰特拉 },
        { name: "樱花", img: "hdyh1", enterprise: enterprise.泰特拉 },
        { name: "饼干", img: "bg", enterprise: enterprise.泰特拉 },
        { name: "饼干", img: "bg1", enterprise: enterprise.泰特拉 },
        { name: "尼罗", img: "nl", enterprise: enterprise.泰特拉 },
        { name: "尼罗", img: "nl1", enterprise: enterprise.泰特拉 },
        { name: "gg", img: "gg", enterprise: enterprise.配角 },
        { name: "莱伊", img: "ly", enterprise: enterprise.泰特拉 },
        { name: "诺亚尔", img: "nye", enterprise: enterprise.泰特拉 },
        { name: "布兰儿", img: "ble", enterprise: enterprise.泰特拉 },
        { name: "梅里：海湾女神", img: "sml", enterprise: enterprise.泰特拉 },
        { name: "阿妮斯：闪耀夏日", img: "sans", enterprise: enterprise.泰特拉 },
        { name: "贝洛塔", img: "blt", enterprise: enterprise.泰特拉 },
        { name: "米卡", img: "mk", enterprise: enterprise.泰特拉 },
        { name: "阿妮斯", img: "ans", enterprise: enterprise.泰特拉 },
        { name: "尼夫", img: "nf", enterprise: enterprise.泰特拉 },
        { name: "IDoll花", img: "idh", enterprise: enterprise.泰特拉 },
        { name: "iDoll海", img: "idhai", enterprise: enterprise.泰特拉 },
        { name: "iDoll太阳", img: "idty", enterprise: enterprise.泰特拉 },
        { name: "白雪公主", img: "cbxgz", enterprise: enterprise.朝圣者 },
        { name: "红莲", img: "chli", enterprise: enterprise.朝圣者 },
        { name: "诺雅", img: "cny", enterprise: enterprise.朝圣者 },
        { name: "哈兰", img: "chl", enterprise: enterprise.朝圣者 },
        { name: "长发公主", img: "ccfgz", enterprise: enterprise.朝圣者 },
        { name: "伊莎贝尔", img: "cysbe", enterprise: enterprise.朝圣者 },
        { name: "玛丽安", img: "csf", enterprise: enterprise.朝圣者 },
        { name: "玛丽安", img: "sf1", enterprise: enterprise.朝圣者 },
        { name: "桃乐丝", img: "ctls", enterprise: enterprise.朝圣者 },
        { name: "小红帽", img: "xhm", enterprise: enterprise.朝圣者 },
        { name: "白雪公主：纯真年代", img: "cxbx", enterprise: enterprise.朝圣者 },
        { name: "Npc 1", img: "npc1", enterprise: enterprise.配角 },
        { name: "Npc 2", img: "npc2", enterprise: enterprise.配角 },
        { name: "Npc 3", img: "npc3", enterprise: enterprise.配角 },
        { name: "Npc 4", img: "npc4", enterprise: enterprise.配角 },
        { name: "Npc 5", img: "npc5", enterprise: enterprise.配角 },
        { name: "Npc 6", img: "npc6", enterprise: enterprise.配角 },
        { name: "Npc 7", img: "npc7", enterprise: enterprise.配角 },
        { name: "Npc 8", img: "npc8", enterprise: enterprise.配角 },
        { name: "Npc 9", img: "npc9", enterprise: enterprise.配角 },
        { name: "Npc 10", img: "npc10", enterprise: enterprise.配角 },
        { name: "Npc 11", img: "npc11", enterprise: enterprise.配角 },
        { name: "量产妮姬 1", img: "lc1", enterprise: enterprise.配角 },
        { name: "量产妮姬 2", img: "lc2", enterprise: enterprise.配角 },
        { name: "量产妮姬 3", img: "lc3", enterprise: enterprise.配角 },
        { name: "量产妮姬 4", img: "lc4", enterprise: enterprise.配角 },
        { name: "量产妮姬 5", img: "lc5", enterprise: enterprise.配角 },
        { name: "量产妮姬 6", img: "lc6", enterprise: enterprise.配角 },
        { name: "皮娜", img: "pn", enterprise: enterprise.配角 },
        { name: "英克", img: "yk", enterprise: enterprise.配角 },
        // { name: "xfd", img: "xfd1", enterprise: enterprise.配角 },
        { name: "火龙", img: "yhl", enterprise: enterprise.朝圣者 },
        { name: "水母", img: "ysm", enterprise: enterprise.朝圣者 },
        { name: "ydws", img: "yydws", enterprise: enterprise.朝圣者 },
        { name: "zhg", img: "zhg", enterprise: enterprise.配角 },
        { name: "芭比茏", img: "bbl", enterprise: enterprise.配角 },
        { name: "安德森", img: "ads", enterprise: enterprise.配角 },
        { name: "安德森", img: "sads", enterprise: enterprise.配角 },
        { name: "爱德", img: "ad", enterprise: enterprise.配角 },
        { name: "阿尼克", img: "ank", enterprise: enterprise.配角 },
        { name: "舒恩", img: "ceo0", enterprise: enterprise.配角 },
        { name: "ceo", img: "ceo1", enterprise: enterprise.配角 },
        { name: "ceo", img: "ceo2", enterprise: enterprise.配角 },
        { name: "fsl", img: "fs1", enterprise: enterprise.配角 },
        { name: "fsl", img: "fsl", enterprise: enterprise.配角 },
        { name: "狗狗", img: "dog1", enterprise: enterprise.动物 },
        { name: "狗狗", img: "dog2", enterprise: enterprise.动物 },
        { name: "狗狗", img: "dog3", enterprise: enterprise.动物 },
        { name: "狗狗", img: "dog4", enterprise: enterprise.动物 },
        { name: "伏特", img: "ft", enterprise: enterprise.动物 },
        { name: "猫猫", img: "cat1", enterprise: enterprise.动物 },
        { name: "嚣嘈", img: "xc", enterprise: enterprise.莱彻 },
        { name: "火龙", img: "lchl", enterprise: enterprise.莱彻 },

        // ===end===
        { name: "未知", img: "wz", enterprise: enterprise.配角 },
    ]
}


