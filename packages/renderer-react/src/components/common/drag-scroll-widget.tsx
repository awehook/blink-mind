import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';

import debug from 'debug';
const log = debug('node:drag-scroll-widget');

const DragScrollView = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
`;

const DragScrollContent = styled.div`
  position: relative;
  width: max-content;
`;

const useWindowListener = false;

interface DragScrollWidgetProps {
  mouseKey?: 'left' | 'right';
  needKeyPressed?: boolean;
  canDragFunc?: () => Boolean;
  enableMouseWheel: boolean;
  children: (
    setViewBoxScroll: (left: number, top: number) => void,
    setViewBoxScrollDelta: (left: number, top: number) => void
  ) => React.ReactNode;
}

export class DragScrollWidget extends React.Component<
  DragScrollWidgetProps,
  any
> {
  constructor(props: DragScrollWidgetProps) {
    super(props);
    this.state = {
      widgetStyle: {
        width: '10000px',
        height: '10000px'
      }
    };
  }

  static defaultProps = {
    mouseKey: 'left',
    needKeyPressed: false
  };

  contentResizeCallback = (
    entries: ResizeObserverEntry[],
    observer: ResizeObserver
  ) => {
    // log('contentResizeCallback', entries[0].contentRect, this.oldContentRect);
    // if (entries[0].contentRect.width === 0 ) return;
    log('contentResizeCallback');
    if (this.oldContentRect) {
      const widgetStyle = {
        width: this.content.clientWidth + this.viewBox.clientWidth * 2,
        height: this.content.clientHeight + this.viewBox.clientHeight * 2
      };
      this.bigView.style.width = widgetStyle.width + 'px';
      this.bigView.style.height = widgetStyle.height + 'px';
    }
    this.oldContentRect = entries[0].contentRect;
  };

  contentResizeObserver = new ResizeObserver(this.contentResizeCallback);
  // oldScroll: { left: number; top: number };
  oldContentRect: any;
  content: HTMLElement;
  contentRef = ref => {
    log('contentRef');
    if (ref) {
      this.content = ref;
      this.oldContentRect = this.content.getBoundingClientRect();
      this.contentResizeObserver.observe(this.content);
    }
  };

  viewBox: HTMLElement;
  viewBoxRef = ref => {
    if (ref) {
      this.viewBox = ref;
      if (!this.props.enableMouseWheel) {
        log('addEventListener onwheel');
        this.viewBox.addEventListener(
          'wheel',
          function(e) {
            log('onwheel');
            (e.ctrlKey || e.metaKey) && e.preventDefault();
          },
          {
            passive: false
          }
        );
      }
      this.setViewBoxScroll(
        this.viewBox.clientWidth,
        this.viewBox.clientHeight
      );
    }
  };

  bigView: HTMLElement;
  bigViewRef = ref => {
    if (ref) {
      this.bigView = ref;
    }
  };

  setWidgetStyle = () => {
    log('setWidgetStyle');
    if (this.content && this.viewBox && this.bigView) {
      this.bigView.style.width =
        (this.content.clientWidth + this.viewBox.clientWidth) * 2 + 'px';
      this.bigView.style.height =
        (this.content.clientHeight + this.viewBox.clientHeight) * 2 + 'px';

      this.content.style.left = this.viewBox.clientWidth + 'px';
      this.content.style.top = this.viewBox.clientHeight + 'px';
    }
  };

  setViewBoxScroll = (left: number, top: number) => {
    log(`setViewBoxScroll ${left} ${top}`);
    if (this.viewBox) {
      this.viewBox.scrollLeft = left;
      this.viewBox.scrollTop = top;
    }
  };

  setViewBoxScrollDelta = (deltaLeft: number, deltaTop: number) => {
    log(
      `setViewBoxScrollDelta ${deltaLeft} ${deltaTop} ${this.viewBox
        .scrollLeft + deltaLeft} ${this.viewBox.scrollTop + deltaTop}`
    );
    if (this.viewBox) {
      this.viewBox.scrollLeft += deltaLeft;
      this.viewBox.scrollTop += deltaTop;
    }
  };

  onMouseDown = e => {
    log('onMouseDown');
    // log(e.nativeEvent.target);

    // mouseKey 表示鼠标按下那个键才可以进行拖动，左键或者右键
    // needKeyPressed 为了支持是否需要按下ctrl键，才可以进行拖动
    // canDragFunc是一个函数，它是为了支持使用者以传入函数的方式，这个函数的返回值表示当前的内容是否可以被拖拽而移动
    const { mouseKey, needKeyPressed, canDragFunc } = this.props;
    if (canDragFunc && !canDragFunc()) return;
    if (
      (e.button === 0 && mouseKey === 'left') ||
      (e.button === 2 && mouseKey === 'right')
    ) {
      if (needKeyPressed) {
        if (!e.ctrlKey) return;
      }
      this._lastCoordX = this.viewBox.scrollLeft + e.nativeEvent.clientX;
      this._lastCoordY = this.viewBox.scrollTop + e.nativeEvent.clientY;

      const ele = useWindowListener ? window : this.viewBox;
      ele.addEventListener('mousemove', this.onMouseMove);
      ele.addEventListener('mouseup', this.onMouseUp);
    }
  };

  onMouseUp = e => {
    log('onMouseUp');
    const ele = useWindowListener ? window : this.viewBox;
    ele.removeEventListener('mousemove', this.onMouseMove);
    ele.removeEventListener('mouseup', this.onMouseUp);
  };

  // _lastCoordX和_lastCorrdY 是为了在拖动过程中 计算 viewBox的scrollLeft和scrollTop值用到
  // _lastCoordX和_lastCorrdY 记录下拖动开始时刻viewBox的scroll值和鼠标位置值
  _lastCoordX: number;
  _lastCoordY: number;

  onMouseMove = (e: MouseEvent) => {
    this.viewBox.scrollLeft = this._lastCoordX - e.clientX;
    this.viewBox.scrollTop = this._lastCoordY - e.clientY;
    // log(`onMouseMove ${this.viewBox.scrollLeft} ${this.viewBox.scrollTop}`);
  };

  handleContextMenu = e => {
    e.preventDefault();
  };

  componentDidMount(): void {
    this.setWidgetStyle();
    document.addEventListener('contextmenu', this.handleContextMenu);
  }

  componentWillUnmount(): void {
    document.removeEventListener('contextmenu', this.handleContextMenu);
  }

  setZoomFactor(zoomFactor) {
    this.bigView.style.transform = `scale(${zoomFactor})`;
    this.bigView.style.transformOrigin = '50% 50%';
  }

  render() {
    // log('render');
    const style = {
      ...this.state.widgetStyle
      // zoom:this.props.zoomFactor,
      // transform: `scale(${this.props.zoomFactor})`,
      // transformOrigin: '50% 50%'
    };
    return (
      <DragScrollView ref={this.viewBoxRef} onMouseDown={this.onMouseDown}>
        <div style={style} ref={this.bigViewRef}>
          <DragScrollContent
            ref={this.contentRef}
            style={this.state.contentStyle}
          >
            {this.props.children(
              this.setViewBoxScroll,
              this.setViewBoxScrollDelta
            )}
          </DragScrollContent>
        </div>
      </DragScrollView>
    );
  }
}
