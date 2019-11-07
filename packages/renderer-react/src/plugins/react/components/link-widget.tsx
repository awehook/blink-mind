import * as React from 'react';
import styled from 'styled-components';
import { Controller, Model, TopicDirection, KeyType } from '@blink-mind/core';
import { BaseProps } from '../../../components/base-props';
import debug from 'debug';

const log = debug('node:link-widget');

interface Props extends BaseProps {
  fromKey: KeyType;
  toKey: KeyType;
}

export class LinkWidget extends React.Component<Props> {}
