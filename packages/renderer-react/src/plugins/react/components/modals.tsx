import * as React from 'react';
import styled from 'styled-components';
import { Classes, Dialog } from '@blueprintjs/core';
import { BaseProps } from '../../../components/BaseProps';
import { BaseWidget } from '../../../components/common';

interface Props extends BaseProps {
  saveRef?: Function;
}
const DescWrapper = styled.div`
  border: 1px solid #d9d9d9;
  height: calc(100% - 50px);
  padding: 0 1rem;
  overflow: auto;
  margin: 0.5rem 0.5rem 0 0.5rem;
`;

export class Modals extends BaseWidget<Props> {
  handleClose = () => {
    console.log('handleClose');
    const { controller } = this.props;
    const handleActiveModalClose = controller.run(
      'handleActiveModalClose',
      this.props
    );
    console.log(handleActiveModalClose);
    handleActiveModalClose && handleActiveModalClose();
  };

  render() {
    const { controller } = this.props;
    const onClose = controller.run('handleActiveModalClose', this.props);
    const activeModal = controller.run('renderModal', this.props);
    const activeModalProps = controller.run('getActiveModalProps', this.props);
    return (
      <Dialog
        onClose={this.handleClose}
        isOpen={activeModal !== null}
        autoFocus
        enforceFocus
        usePortal
        title={activeModalProps && activeModalProps.title}
        style={activeModalProps && activeModalProps.style}
      >
        <div className={Classes.DIALOG_BODY} style={{minHeight:0}}>{activeModal}</div>
      </Dialog>
    );
  }
}
