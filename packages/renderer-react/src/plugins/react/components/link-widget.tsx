import { Controller, KeyType, Model, TopicDirection } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { BaseProps } from '../../../components/base-props';

const log = debug('node:link-widget');

interface Props extends BaseProps {
  fromKey: KeyType;
  toKey: KeyType;
}

export class LinkWidget extends React.Component<Props> {}
