import { Divider, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import * as React from 'react';
import styled from 'styled-components';
import { Flex } from '../../../../components/common';

export const SettingTitle = styled.div`
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: bold;
`;

export const SettingItem = styled.span`
  margin: 0px 10px 0px 0px;
`;

export const SettingRow = styled(Flex)`
  margin: 5px 0;
`;

export const SettingGroup = props => {
  return (
    <div>
      {props.children}
      <Divider style={{ margin: '10px 0' }} />
    </div>
  );
};

export const ColorBar = styled.div`
  height: 3px;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 2px;
  background: ${props => props.color};
`;

export const WithBorder = styled.div`
  border: 1px solid grey;
  cursor: pointer;
  font-weight: bold;
`;

export const renderItem = unit => (
  width,
  { handleClick, modifiers, query }
) => {
  return (
    <MenuItem text={`${width}${unit}`} key={width} onClick={handleClick} />
  );
};

export const PxSelect = Select.ofType();

export const borderWidthItems = [...Array(7).keys()];
