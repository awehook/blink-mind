import { FocusMode, OpType } from '@blink-mind/core';
import { BaseProps } from '@blink-mind/renderer-react';
import { Classes, Icon, IInputGroupProps } from '@blueprintjs/core';
import { ItemRenderer, Omnibar } from '@blueprintjs/select';
import * as React from 'react';
import styled from 'styled-components';

const PanelRoot = styled.div``;

export interface INavigationSection {
  // path: string[];
  title: string;
}

const NavOmniBar = Omnibar.ofType<INavigationSection>();
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
        title: controller.run('getTopicTitle', {
          ...props,
          topicKey,
          maxLength: 40
        })
      });
    });
    return res;
  };

  const renderItem: ItemRenderer<INavigationSection> = (section, props) => {
    // const pathElements = section.path.reduce<React.ReactChild[]>(
    //   (elems, el) => {
    //     elems.push(el, <Icon key={el} icon="caret-right" />);
    //     return elems;
    //   },
    //   []
    // );

    return (
      <>
        <div>{section.title}</div>
        {/*<small className={Classes.TEXT_MUTED}>{pathElements}</small>*/}
      </>
    );
  };

  const handleItemSelect = (item: INavigationSection) => {};

  const sections = getAllSections();

  return (
    <PanelRoot>
      <NavOmniBar
        className="docs-navigator-menu"
        inputProps={INPUT_PROPS}
        itemListPredicate={this.filterMatches}
        isOpen={true}
        items={sections}
        itemRenderer={renderItem}
        onItemSelect={handleItemSelect}
        onClose={onClose}
        resetOnSelect={true}
      />
    </PanelRoot>
  );
}
