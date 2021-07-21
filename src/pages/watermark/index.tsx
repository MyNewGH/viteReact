import * as React from 'react';
import { useEffect, useRef } from 'react';
type CanvasTextBaseline = 'alphabetic' | 'bottom' | 'hanging' | 'ideographic' | 'middle' | 'top';
interface WaterParams {
  container?: HTMLDivElement;
  width?: string;
  height?: string;
  textAlign?: 'left' | 'right' | 'center';
  textBaseline?: CanvasTextBaseline;
  font?: string;
  fillStyle?: string;
  content?: string;
  globalAlpha?: number;
  rotate?: number;
  zIndex?: number;
}

function waterMark(params: WaterParams) {
  const {
    container = document.body, // 容器
    width = '300', // canvas元素宽
    height = '200', // canvas元素高
    textAlign = 'left', // 文字对齐
    textBaseline = 'bottom', // 基准线
    font = '16px Microsoft Yahei', // 字体大小及样式
    fillStyle = '#000', // 自定义水印的颜色
    content = '内部文档，请勿外传', // 水印内容
    globalAlpha = 0.1, // 设置图形和图像透明度的值
    rotate = 16, // 文字旋转角度
    zIndex = 1000 // 元素堆叠顺序
  } = params;
  let canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  let ctx = canvas.getContext('2d');
  ctx!.globalAlpha = globalAlpha;
  ctx!.textAlign = textAlign;
  ctx!.textBaseline = textBaseline;
  ctx!.font = font;
  ctx!.fillStyle = fillStyle;
  ctx?.rotate((Math.PI * rotate) / 180);
  ctx?.fillText(content, 50, 50);
  const baseUrl = canvas.toDataURL();
  const _wm = document.querySelector('._wm');
  // console.log(444, document.getElementsByClassName('_wm')[0], _wm);
  const waterMarkDiv = _wm || document.createElement('div');
  const styleStr = `
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    z-index:${zIndex};
    pointer-events:none;
    background-repeat:repeat;
    background-image:url('${baseUrl}')`;
  waterMarkDiv.setAttribute('style', styleStr);
  waterMarkDiv.classList.add('_wm');
  container.style.position = 'relative';
  if (!_wm) {
    container.appendChild(waterMarkDiv);
  }
  const MutationObserver = window.MutationObserver;
  if (MutationObserver) {
    // const args = arguments[0];
    let mo = new MutationObserver(() => {
      const _wm = document.querySelector('._wm');
      if (
        (_wm && _wm.getAttribute('style') !== styleStr) ||
        !_wm ||
        container.style.position !== 'relative'
      ) {
        mo.disconnect();
        console.log(_wm);
        // mo = null;
        // waterMark(args);
      }
    });
    mo.observe(container, {
      attributes: true,
      subtree: true,
      childList: true
    });
  }
}
const WaterDemo: React.FC<{ option?: WaterParams }> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { children, option } = props;
  useEffect(() => {
    waterMark({
      container: ref.current!,
      ...option
    });
  }, []);
  return (
    <div ref={ref} id="watermark" style={{ position: 'relative', width: '100%', height: 300 }}>
      {children}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <WaterDemo
        option={{
          content: '111',
          font: '36px Arial',
          fillStyle: '#58bc58'
        }}
      >
        <div>2626265</div>
      </WaterDemo>
    </div>
  );
};

export default App;
