import { OpType } from '@blink-mind/core';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import styled from 'styled-components';
import { CanvasTitle } from './canvas';
import './diagram-root.css';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const DiagramContainer = styled.div`
  width: 100%;
  //height: 100%;
  overflow: auto;
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
    const tabs = canvasModels.map(model => {
      const index = i++;
      const nProps = { ...props, model, index };
      return (
        <Tab key={index}>
          <CanvasTitle {...nProps} />
        </Tab>
      );
    });
    tabs.push(
      <Tab key={i++}>
        <Icon onClick={onClickAddCanvas} icon={IconNames.PLUS} />
      </Tab>
    );
    i = 0;
    const tabPanels = canvasModels.map(model => {
      return (
        <TabPanel key={i++} className="tab-panel">
          {controller.run('renderCanvas', {
            ...props,
            model
          })}
        </TabPanel>
      );
    });
    tabPanels.push(<TabPanel key={i++} className="tab-panel" />);
    const tabsProps = {
      className: 'tabs',
      selectedIndex: docModel.currentCanvasIndex,
      forceRenderTabPanel: true,
      onSelect
    };
    child = (
      <Tabs {...tabsProps}>
        {tabPanels}
        <TabList>{tabs}</TabList>
      </Tabs>
    );
  }
  return (
    <Root>
      {controller.run('renderToolbar', { ...props, model })}
      <DiagramContainer>{child}</DiagramContainer>
    </Root>
  );
}
