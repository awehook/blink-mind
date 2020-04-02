import { Tabs } from '@blueprintjs/core';
import cx from 'classnames';
import * as React from 'react';
import styled from 'styled-components';
import { iconClassName, IconName } from '../../../utils';
import {
  BaseProps,
  CloseIcon,
  IconBg,
  ShowMenuIcon,
  Title,
  ZIndex
} from '../../common';

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

export function RightTopPanelWidget(props: BaseProps) {
  const { controller, zIndex, diagramState, setDiagramState } = props;

  const { rightTopPanel } = diagramState;

  const { isOpen, selectedTabId } = rightTopPanel;

  const setRightTopPanelState = obj => {
    setDiagramState({
      rightTopPanel: { ...rightTopPanel, ...obj }
    });
  };

  if (!isOpen) {
    return (
      <PanelRoot zIndex={zIndex}>
        <IconBg
          onClick={() => {
            setRightTopPanelState({ isOpen: true });
          }}
        >
          <ShowMenuIcon className={iconClassName(IconName.SHOW_MENU)} />
        </IconBg>
      </PanelRoot>
    );
  }
  const handleTabIdChange = tabId => {
    setRightTopPanelState({
      selectedTabId: tabId
    });
  };

  return (
    <PanelRoot zIndex={zIndex}>
      <Title>
        <CloseIcon
          className={cx('bp3-button', iconClassName(IconName.CLOSE))}
          onClick={() => {
            setRightTopPanelState({ isOpen: false });
          }}
        />
      </Title>
      <StyledTabs
        id="tabs"
        selectedTabId={selectedTabId}
        onChange={handleTabIdChange}
      >
        {controller.run('renderRightTopPanelTabs', props)}
      </StyledTabs>
    </PanelRoot>
  );
}
