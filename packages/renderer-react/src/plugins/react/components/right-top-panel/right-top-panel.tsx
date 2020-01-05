import { TabId, Tabs } from '@blueprintjs/core';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import {
  BaseProps,
  CloseIcon,
  IconBg,
  ShowMenuIcon,
  Title,
  ZIndex
} from '../../../../components/common';
import { iconClassName, IconName } from '../../../../utils';

const PanelRoot = styled(ZIndex)`
  position: absolute;
  background: white;
  right: 30px;
  top: 20px;
  border-radius: 2px;
  user-select: none;
`;

const StyledTabs = styled(Tabs)`
  padding: 0px 10px;
`;

export type RightTopPanelProps = BaseProps & {
  selectedTabId: TabId;
  handleTabIdChange: (tabId: TabId) => void;
  zIndex: number;
};

export function RightTopPanel(props: RightTopPanelProps) {
  const { controller, zIndex, selectedTabId, handleTabIdChange } = props;
  const [expand, setExpand] = useState(false);

  if (!expand) {
    return (
      <PanelRoot zIndex={zIndex}>
        <IconBg onClick={() => setExpand(true)}>
          <ShowMenuIcon className={iconClassName(IconName.SHOW_MENU)} />
        </IconBg>
      </PanelRoot>
    );
  }

  return (
    <PanelRoot zIndex={zIndex}>
      <Title>
        <CloseIcon
          className={iconClassName(IconName.CLOSE)}
          onClick={() => setExpand(false)}
        />
      </Title>
      <StyledTabs id={selectedTabId} onChange={handleTabIdChange}>
        {controller.run('renderRightTopPanelTabs', props)}
      </StyledTabs>
    </PanelRoot>
  );
}
