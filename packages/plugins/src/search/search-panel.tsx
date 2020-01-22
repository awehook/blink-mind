import { FocusMode, OpType } from '@blink-mind/core';
import {
  BaseProps,
  getI18nText,
  I18nKey,
  PropKey
} from '@blink-mind/renderer-react';
import { IInputGroupProps } from '@blueprintjs/core';
import { ItemListPredicate, ItemRenderer, Omnibar } from '@blueprintjs/select';
import * as React from 'react';
import styled from 'styled-components';
import {
  TopicTitleThumbnail,
  TopicTitleThumbnailProps
} from '../common/components/topic-title-thumbnail';
import './search-panel.css';

const NavOmniBar = Omnibar.ofType<INavigationSection>();

const StyledNavOmniBar = styled(NavOmniBar)`
  top: 20%;
  left: 25% !important;
  width: 50% !important;
`;

export interface INavigationSection {
  topicKey: KeyType;
}

export type SearchPanelProps = BaseProps & {
  setSearchWord: (s: string) => void;
};
export function SearchPanel(props: SearchPanelProps) {
  const { model, setSearchWord, controller } = props;
  const INPUT_PROPS: IInputGroupProps = {
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
      topicKey
    };
    return <TopicTitleThumbnail key={topicKey} {...thumbnailProps} />;
  };

  const filterMatches: ItemListPredicate<INavigationSection> = (
    query,
    items
  ) => {
    return items.filter(item => {
      const topicTitle = controller.getValue(PropKey.TOPIC_TITLE, {
        ...props,
        topicKey: item.topicKey
      });
      return topicTitle.toLowerCase().includes(query.toLowerCase());
    });
  };

  const sections = getAllSections();

  return (
    <StyledNavOmniBar
      inputProps={INPUT_PROPS}
      itemListPredicate={filterMatches}
      isOpen={true}
      items={sections}
      itemRenderer={renderItem}
      // onItemSelect={handleItemSelect}
      onClose={onClose}
      resetOnSelect={true}
    />
  );
}
