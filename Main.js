import CreateTextBox from './CreateTextBox.js';
/** *
 * 
 */

 export default class Main {
   constructor(){
     this.allzIndex=0 // 所有文本框当前的层级
    
    this.currentTextBoxId=null //当前文本框对象
    this.textBoxIdList={}// 所有文本框对象

    this.initStyleOption={  // 初始化可支持修改的样式
      lineHeight: {
        label: '行高',
        value: 35,
        type: 'number',
        unit: 'px',
      },
      fontSize: {
        label: '字体大小',
        value: 16,
        type: 'number',
        unit: 'px',
      },
      letterSpacing: {
        label: '间距',
        value: 1,
        type: 'number',
        unit: 'px',
      },
      textAlign: {
        label: '居中',
        value: 'left',
        type: 'text',
        unit: '',
      },
      textIndent: {
        label: '首行缩进',
        value: 0,
        type: 'number',
        unit: 'px',
      },
      color: {
        label: '字体颜色',
        value: '#ffffff',
        type: 'color',
        unit: '',
      },
      background: {
        label: '背景颜色',
        value: 'transparent',
        type: 'color',
        unit: '',
      },
      borderRadius: {
        label: '圆角',
        value: '0',
        type: 'number',
        unit: 'px',
      },
      fontWeight: { 
        label: '加粗',
        value: '0',
        type: 'number',
        unit: '',
      },
    }
   }

  init(){
    this.addTextBox()
    return this
  }


  onGetData=(name)=>{
    return this[name]
  }

  onUpdateData=({  attrName,value}) => {
    const { textBoxIdList } = this
    
    if(attrName==='currentTextBoxId'){//更新当前选中实例
      this.currentTextBoxId=value
    }else if (attrName === 'zIndex') {//更新层级顺序
      this.allzIndex += 1
      Object.values(textBoxIdList).forEach(item => {
        item.updateAttr('zIndex', this.allzIndex)
      })
    }
    
  }

  addTextBox() {
     // 创建文本
     const textBox = new CreateTextBox({
      initStyleOption: this.initStyleOption,
      onUpdateData: this.onUpdateData,
      onGetData:this.onGetData
     }).init()
 
     // 存储
     this.textBoxIdList[textBox.id] = textBox
     this.currentTextBoxId=textBox.id
  }

  delTextBox(){
    if(this.currentTextBoxId){
      this.textBoxIdList[this.currentTextBoxId].destroyBox()
      delete this.textBoxIdList[this.currentTextBoxId]
      this.currentTextBoxId=null
    }else{
      alert('请选择文本后删除')
    }
    
  }
}
