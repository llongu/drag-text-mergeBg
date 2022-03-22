
/** *
 *  文本样式面板
 *
 *  用于修改文本样式
 *
 */

 export default class createTextPanel {
      constructor({   updateTextStyle, initStyleOption }) {
         this.wrap = document.getElementById('textPanelWrap');

         this.emit_updateTextStyle = updateTextStyle // 更新内部属性函数
         this.initStyleOption = initStyleOption // 可支持修改的文本样式
      }

      init() {
          this.create()
          return this
      }

      onBlur(e, name) {
        const { value } = e.target
        this.emit_updateTextStyle(name, value)
      }

      create() {
          this.destroyBox()
           const { initStyleOption } = this
           const styleName = Object.keys(initStyleOption)
           const wrap = document.createElement('ul')
           wrap.id = 'textPanel_b';
           const fragment = document.createDocumentFragment()

           styleName.forEach(name => {
                const li = document.createElement('li')
                li.name = name;
                const label = document.createElement('label')
                label.innerText = initStyleOption[name].label
                li.appendChild(label)
                const input = document.createElement('input')
                input.type = initStyleOption[name].type
                input.value = initStyleOption[name].value
                input.addEventListener('blur', e => {
                     this.onBlur(e, name)
                })
                li.appendChild(input)
                fragment.appendChild(li)
            })
            wrap.appendChild(fragment)
            this.wrap.appendChild(wrap)
      }

      destroyBox() {
          document.getElementById('textPanel_b') && document.getElementById('textPanel_b').remove()
      }
 }
