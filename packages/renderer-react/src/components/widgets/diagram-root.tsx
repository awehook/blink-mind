import { OpType } from '@blink-mind/core';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Tab, TabList, TabPanel, Tabs } from '@slim-ui/react-tabs';
import '@slim-ui/react-tabs/style/react-tabs.css';
import * as React from 'react';
import styled from 'styled-components';
import { SheetTitle } from './sheet';
import './diagram-root.css';
import Theme from '../../plugins/react/theme';

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
      model: controller.run('createNewSheetModel', props)
    });
  };
  const onSelect = (index, lastIndex, e) => {
    if (index !== lastIndex && index !== docModel.sheetModels.size) {
      controller.run('operation', {
        ...props,
        opType: OpType.SET_CURRENT_SHEET,
        model: docModel.sheetModels.get(index)
      });
    }
  };
  const model = docModel.currentSheetModel;
  let child;
  if (docModel.sheetModels.size === 1) {
    child = (
      <Theme theme={model.config.theme}>
        {controller.run('renderSheet', {
          ...props,
          model: docModel.sheetModels.get(0)
        })}
      </Theme>
    );
  } else {
    const sheetModels = docModel.sheetModels.toArray();
    let i = 0;
    const tabClassName = 'react-tabs__tab tab';
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
      className: 'tabs react-tabs react-tabs__tabs',
      selectedIndex: docModel.currentSheetIndex,
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
      {/*<GlobalStyle />*/}
      {controller.run('renderToolbar', { ...props, model })}
      {child}
    </Root>
  );
}
