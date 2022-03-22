import CreateTextPanel from './CreateTextStylePanel.js';

/**
 *  文本输入框
 *
 *  
 *  唯一id，独立事件，层级关系
 *
 *  contentEditable 属性规定节点可编辑高度会根据内容撑开
 *
 */

export default class CreateTextBox {
     constructor({  onUpdateData,onGetData, initStyleOption }) {
        this.wrap =  document.getElementById('textBoxWrap');
        this.id = null // 使用时间戳，加随机数，加进制转换 生成不重复的 数字+英文组合 id
        this.dom = null
        this.zIndex = 0 // 视图层级关系

        this.dragRange = 10 // 可拖拽范围
        this.dragWidth=false// 是否可以拖拽宽度
        this.dragIng=false // 是否在拖拽行为中，禁止触发改变鼠标形状及关联事件 避免拖拽行为不一致
        this.dragTime=null  // 拖拽节流

        this.emit_getData=onGetData//获取属性
        this.emit_updateData = onUpdateData // 更新属性
        this.initStyleOption = initStyleOption // 可支持修改的文本属性

        this.textPanel=null //文本样式面板
    }

    init() {
        this.create()
        this.CreateTextPanel()
        return this
    }

    // 创建文本框
    create() {
        const times = parseInt((Date.now() / 1000).toString(), 0);
        const num = parseInt((Math.random() * 1e+10).toString(), 0)
        const getId = (times).toString(16) + (num).toString(16)

        const dom = document.createElement('div');
        dom.id = getId //id唯一
        dom.contentEditable = 'true'
        dom.className = 'textBox'

        dom.onmousemove = this.onmouseMove.bind(this)
        dom.onmousedown = this.onmousedown.bind(this)

        this.id = getId
        this.dom = dom

        this.wrap.appendChild(dom)
    }
    
    // 创建样式面板
    CreateTextPanel(){
     this.textPanel = new CreateTextPanel({
          textBoxId: this.id,
          initStyleOption: this.initStyleOption,
          updateTextStyle: this.updateTextStyle,
      }).init()

    //默认更新
     Object.keys(this.initStyleOption).forEach(name => {
      this.updateTextStyle(name,this.initStyleOption[name].value)
     })
    }

    updateAttr=(name, value)=> {
      this[name] = value
    }

    // 更新文本属性
    updateTextStyle=(name, value)=>{
      if (name && (value || value===0)) {
        const { dom } = this
        const newStyle = {
          ...this.initStyleOption,
          [name]: {
            ...this.initStyleOption[name],
            value,
          },
         }
        dom.style[name] = `${value}${newStyle[name].unit}`
        //更新配置
        this.initStyleOption = newStyle
        this.textPanel.initStyleOption=newStyle
      } else {
        throw new Error('name or value is empty', name, value)
      }
    }

    onmouseMove(event) { // 监听鼠标是否移动至宽度可拖拽处，在拖拽行为触发前处理鼠标形状
        if (this.dragIng) {
            return false
        }
        const { offsetX = 0 } = event || window.event;
        const { dom, dragRange } = this
        const currentWidth = dom.offsetWidth
        if (offsetX > (currentWidth - dragRange)) {
            dom.style.cursor = 'e-resize';
            this.dragWidth = true
        } else {
            this.dragWidth = false
            dom.style.cursor = 'initial';
        }
        return true
    }

    onmousedown(event) {
       //更新当前选中样式面板
       if(this.emit_getData('currentTextBoxId') !== this.id){
         this.textPanel.create()
         //更新当前选中示例
        this.emit_updateData({ attrName:'currentTextBoxId',value: this.id })
       }

      const eve = event || window.event;
      const { wrap, dom } = this

      dom.style.zIndex = this.zIndex// 更新当前层级

      const wrapWidth = wrap.clientWidth
      const wrapHeight = wrap.clientHeight

      const currentWidth = dom.offsetWidth
      const currentHeight = dom.offsetHeight

      const getStyle=this._getComputedStyle(dom)
      const getXY=getStyle.substring(7,getStyle.length-1).split(",").reverse()
      const offsetX = parseInt(getXY[1]) || 0;
      const offsetY = parseInt(getXY[0]) || 0;

      const { clientX } = eve;
      const { clientY } = eve;

      document.onmousemove = moveEv => {
        // 节流
        if (this.dragTime && (Date.now() - this.dragTime) < 16) return
        this.dragTime = Date.now()

        this.dragIng = true
        const moves = moveEv || window.event;
        if (this.dragWidth) {
          const addWidth = currentWidth + (moves.clientX - clientX)
          if (addWidth >= wrapWidth) return // 限制可拖拽宽度
          dom.style.width = `${addWidth}px`;
        } else {
         let left=offsetX + moves.clientX - clientX;
         let top=offsetY + moves.clientY - clientY;

         if(left<0){
           left=0
         }
         if(top<0){
          top=0
        }
         if(left+currentWidth>wrapWidth){
           left=wrapWidth-currentWidth
         }
         if(top+currentHeight>wrapHeight){
          top=wrapHeight-currentHeight
         }
      
          dom.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        }
      }

      document.onmouseup = () => {
        this.dragIng = false
        document.onmouseup = null
        document.onmousemove = null
        this.emit_updateData({ attrName: 'zIndex' })
      }
    }



    destroyBox() {
      document.getElementById(this.id).remove()
      this.textPanel.destroyBox()
    }

    _getComputedStyle(element) {
      const st = window.getComputedStyle(element, null);
      const tr = st.getPropertyValue('-webkit-transform') || 
                 st.getPropertyValue('-moz-transform') || 
                 st.getPropertyValue('-ms-transform') || 
                 st.getPropertyValue('-o-transform') || 
                 st.getPropertyValue('transform') || 'FAIL';
     if (tr === 'FAIL') {
          return '';
      }
      return tr;
  }
}
