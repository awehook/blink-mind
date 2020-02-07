import { OpType } from '@blink-mind/core';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Tab, TabList, TabPanel, Tabs } from '@slim-ui/react-tabs';
import '@slim-ui/react-tabs/style/react-tabs.css';
import * as React from 'react';
import styled from 'styled-components';
import { GlobalStyle } from '../common';
import { CanvasTitle } from './canvas';
import './diagram-root.css';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const TabsContainer = styled.div`
  width: 100%;
  //height: 100%;
  //overflow: auto;
  flex-grow: 1;
  background: ${props => props.theme.background};
  position: relative;
`;

export function DiagramRoot(props) {
  const { controller, docModel } = props;
  const onClickAddCanvas = () => {
    controller.run('operation', {
      ...props,
      opType: OpType.ADD_CANVAS,
      model: controller.run('createNewCanvasModel', props)
    });
  };
  const onSelect = (index, lastIndex, e) => {
    if (index !== lastIndex && index !== docModel.canvasModels.size) {
      controller.run('operation', {
        ...props,
        opType: OpType.SET_CURRENT_CANVAS,
        model: docModel.canvasModels.get(index)
      });
    }
  };
  const model = docModel.currentCanvasModel;
  let child;
  if (docModel.canvasModels.size === 1) {
    child = controller.run('renderCanvas', {
      ...props,
      model: docModel.canvasModels.get(0)
    });
  } else {
    const canvasModels = docModel.canvasModels.toArray();
    let i = 0;
    const tabClassName = 'react-tabs__tab tab';
    const tabProps = {
      className: tabClassName,
      tabIndex: '-1'
    };
    const tabs = canvasModels.map(model => {
      const index = i++;
      const nProps = { ...props, model, index };
      return (
        <Tab key={index} {...tabProps}>
          <CanvasTitle {...nProps} />
        </Tab>
      );
    });
    tabs.push(
      <Tab key={i++} {...tabProps}>
        <Icon onClick={onClickAddCanvas} icon={IconNames.PLUS} />
      </Tab>
    );
    i = 0;

    // const tabPanelProps = {
    //   className: 'tab-panel react-tabs__tab-panel'
    // };
    const tabPanelProps = {
      className: 'tab-panel',
      selectedClassName: 'tab-panel__selected'
    };
    const tabPanels = canvasModels.map(model => {
      return (
        <TabPanel key={i++} {...tabPanelProps}>
          {controller.run('renderCanvas', {
            ...props,
            model
          })}
        </TabPanel>
      );
    });
    tabPanels.push(<TabPanel key={i++} {...tabPanelProps} />);
    const tabsProps = {
      className: 'tabs react-tabs react-tabs__tabs',
      selectedIndex: docModel.currentCanvasIndex,
      forceRenderTabPanel: true,
      onSelect
    };
    child = (
      <TabsContainer>
        <Tabs {...tabsProps}>
          {tabPanels}
          <TabList className="tab-list">{tabs}</TabList>
        </Tabs>
      </TabsContainer>
    );
  }
  return (
    <Root>
      <GlobalStyle />
      {controller.run('renderToolbar', { ...props, model })}
      {child}
    </Root>
  );
}
