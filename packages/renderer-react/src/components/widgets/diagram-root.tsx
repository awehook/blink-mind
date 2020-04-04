import { OpType } from '@blink-mind/core';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Tab, TabList, TabPanel, Tabs } from '@slim-ui/react-tabs';
import '@slim-ui/react-tabs/style/react-tabs.css';
import * as React from 'react';
import styled from 'styled-components';
import Theme from '../../plugins/react/theme';
import { SheetTitle } from './sheet';

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
  const onClickAddSheet = () => {
    controller.run('operation', {
      ...props,
      opType: OpType.ADD_SHEET,
      sheetModel: controller.run('createNewSheetModel', props)
    });
  };
  const onSelect = (index, lastIndex, e) => {
    if (index !== lastIndex && index !== docModel.sheetModels.size) {
      controller.run('operation', {
        ...props,
        opType: OpType.SET_CURRENT_SHEET,
        sheetModel: docModel.sheetModels.get(index),
        callback: docModel => () => {
          controller.run('moveTopicToCenter', props);
        }
      });
    }
  };
  const onCopy = ev => {
    controller.run('handleCopy', { ...props, ev });
  };
  const model = docModel.currentSheetModel;

  const sheetModels = docModel.sheetModels.toArray();
  let i = 0;
  const tabClassName = 'react-tabs__tab';
  const tabProps = {
    className: tabClassName,
    tabIndex: '-1'
  };
  const tabs = sheetModels.map(model => {
    const index = i++;
    const nProps = { ...props, model, index };
    return (
      <Tab key={index} {...tabProps}>
        <SheetTitle {...nProps} />
      </Tab>
    );
  });
  tabs.push(
    <Tab key={i++} {...tabProps}>
      <Icon onClick={onClickAddSheet} icon={IconNames.PLUS} />
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
  const tabPanels = sheetModels.map(model => {
    return (
      <TabPanel key={i++} {...tabPanelProps}>
        <Theme theme={model.config.theme}>
          {controller.run('renderSheet', {
            ...props,
            model
          })}
        </Theme>
      </TabPanel>
    );
  });
  tabPanels.push(<TabPanel key={i++} {...tabPanelProps} />);
  const tabsProps = {
    className: 'bm-sheet-tabs react-tabs react-tabs__tabs',
    selectedIndex: docModel.currentSheetIndex,
    forceRenderTabPanel: true,
    onSelect
  };
  const child = (
    <TabsContainer>
      <Tabs {...tabsProps}>
        {tabPanels}
        <TabList className="tab-list">{tabs}</TabList>
      </Tabs>
    </TabsContainer>
  );

  return (
    <Root onCopy={onCopy}>
      {/*<GlobalStyle />*/}
      {controller.run('renderToolbar', { ...props, model })}
      {controller.run('renderDiagramCustomize', props)}
      {child}
    </Root>
  );
}
