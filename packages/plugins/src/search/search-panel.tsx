import { FocusMode, OpType } from '@blink-mind/core';
import { BaseProps } from '@blink-mind/renderer-react';
import {
  IInputGroupProps,
  Popover,
  PopoverInteractionKind
} from '@blueprintjs/core';
import { ItemListPredicate, ItemRenderer, Omnibar } from '@blueprintjs/select';
import * as React from 'react';
import styled from 'styled-components';
import './search-panel.css';

const NavOmniBar = Omnibar.ofType<INavigationSection>();

const StyledNavOmniBar = styled(NavOmniBar)`
  top: 20%;
  left: 25% !important;
  width: 50% !important;
`;

const TopicTitle = styled.div`
  margin: 0 5px;
  padding: 10px 5px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: #e3e8ec;
  }
`;

const StyledPopover = styled(Popover)`
  display: block;
`;

const Tip = styled.div`
  white-space: pre-wrap;
  padding: 10px;
  font-size: 16px;
`;

export interface INavigationSection {
  // path: string[];
  key: KeyType;
  title: string;
}

const INPUT_PROPS: IInputGroupProps = {
  placeholder: 'Search'
};
export type SearchPanelProps = BaseProps & {
  setSearchWord: (s: string) => void;
};
export function SearchPanel(props: SearchPanelProps) {
  const { model, setSearchWord, controller } = props;
  const onClose = () => {
    controller.run('operation', {
      ...props,
      opType: OpType.FOCUS_TOPIC,
      focusMode: FocusMode.NORMAL,
      focusKey: model.focusKey
    });
  };

  const getAllSections = () => {
    const res = [];
    model.topics.forEach((topic, topicKey) => {
      res.push({
        key: topicKey,
        title: controller.run('getTopicTitle', {
          ...props,
          topicKey
        })
      });
    });
    return res;
  };

  const navigateToTopic = topicKey => e => {
    controller.run('focusTopicAndMoveToCenter', { ...props, topicKey });
  };

  const renderItem: ItemRenderer<INavigationSection> = (section, props) => {
    // const pathElements = section.path.reduce<React.ReactChild[]>(
    //   (elems, el) => {
    //     elems.push(el, <Icon key={el} icon="caret-right" />);
    //     return elems;
    //   },
    //   []
    // );
    const { key, title: sectionTitle } = section;
    const maxLength = 100;
    const needTip = sectionTitle.length > maxLength;
    const title = needTip
      ? sectionTitle.substr(0, maxLength) + '...'
      : sectionTitle;
    const titleProps = {
      key,
      onClick: navigateToTopic(key)
    };
    const titleEl = <TopicTitle {...titleProps}>{title}</TopicTitle>;
    const tip = <Tip>{sectionTitle}</Tip>;
    const popoverProps = {
      key,
      target: titleEl,
      content: tip,
      fill: true,
      interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY,
      hoverOpenDelay: 1000
    };
    return needTip ? <StyledPopover {...popoverProps} /> : titleEl;
  };

  const filterMatches: ItemListPredicate<INavigationSection> = (
    query,
    items
  ) => {
    return items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
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
