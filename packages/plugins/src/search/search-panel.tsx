import { FocusMode, OpType } from '@blink-mind/core';
import {
  BaseProps,
  getI18nText,
  I18nKey,
  PropKey
} from '@blink-mind/renderer-react';
import {IInputGroupProps, Keys} from '@blueprintjs/core';
import { ItemListPredicate, ItemRenderer, Omnibar } from '@blueprintjs/select';
import * as React from 'react';
import styled from 'styled-components';
import {
  TopicTitleThumbnail,
  TopicTitleThumbnailProps
} from '../common/components/topic-title-thumbnail';
import './search-panel.css';
import { SEARCH_QUERY_TEMP_VALUE_KEY } from './utils';

const NavOmniBar = Omnibar.ofType<INavigationSection>();

const StyledNavOmniBar = styled(NavOmniBar)`
  top: 20%;
  left: 25% !important;
  width: 50% !important;
`;

export interface INavigationSection {
  topicKey: KeyType;
}

export function SearchPanel(props: BaseProps) {
  const { model, controller } = props;
  const query = controller.run('getTempValue', {
    key: SEARCH_QUERY_TEMP_VALUE_KEY
  });
  const inputProps: IInputGroupProps = {
    placeholder: getI18nText(props, I18nKey.SEARCH)
  };
  const onClose = () => {
    controller.run('operation', {
      ...props,
      opType: OpType.SET_FOCUS_MODE,
      focusMode: FocusMode.NORMAL
    });
  };

  const getAllSections = () => {
    const res = [];
    model.topics.forEach((topic, topicKey) => {
      res.push({
        topicKey
      });
    });
    return res;
  };

  const renderItem: ItemRenderer<INavigationSection> = section => {
    const { topicKey } = section;
    const thumbnailProps: TopicTitleThumbnailProps = {
      ...props,
      topicKey,
      query: controller.run('getTempValue', {
        key: SEARCH_QUERY_TEMP_VALUE_KEY
      })
    };
    return <TopicTitleThumbnail key={topicKey} {...thumbnailProps} />;
  };

  const itemListPredicate: ItemListPredicate<INavigationSection> = (
    query,
    items
  ) => {
    controller.run('setTempValue', {
      key: SEARCH_QUERY_TEMP_VALUE_KEY,
      value: query
    });
    return items.filter(item => {
      const topicTitle = controller.getValue(PropKey.TOPIC_TITLE, {
        ...props,
        topicKey: item.topicKey
      });
      return topicTitle.toLowerCase().includes(query.toLowerCase());
    });
  };

  const items = getAllSections();
  const onKeyDown = (e)=>{
    if(e.keyCode === Keys.ENTER) {
      console.log('enter');
    }
  };
  const omniBarProps = {
    query,
    inputProps,
    itemListPredicate,
    isOpen: true,
    items: items,
    itemRenderer: renderItem,
    // onItemSelect={handleItemSelect}
    onClose,
    resetOnSelect: true,
    onKeyDown
  };
  return <StyledNavOmniBar {...omniBarProps} />;
}
