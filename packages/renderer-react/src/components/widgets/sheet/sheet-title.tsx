import { OpType } from '@blink-mind/core';
import { ContextMenuTarget, Divider, Menu, MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import { getI18nText, I18nKey } from '../../../utils';
import { BaseProps, RenameDialog } from '../../common';

const Title = styled.span`
  user-select: none;
`;

interface Props extends BaseProps {}

interface State {
  showRenameDialog: boolean;
  title?: string;
}

@ContextMenuTarget
export class SheetTitle extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      showRenameDialog: false
    };
  }

  onClickRename = () => {
    this.setState({ showRenameDialog: true });
  };

  handleCancelRename = () => {
    this.setState({ showRenameDialog: false });
  };

  handleConfirmRename = title => e => {
    this.setState({
      showRenameDialog: false
    });
    const props = this.props;
    const { controller } = props;
    controller.run('operation', {
      ...props,
      opType: OpType.SET_SHEET_TITLE,
      title
    });
  };
  onClickDelete = () => {
    const props = this.props;
    const { controller, docModel } = props;
    controller.run('operation', {
      ...props,
      opType: OpType.DELETE_SHEET,
      sheetModel: docModel.currentSheetModel
    });
  };

  onClickDuplicate = () => {
    const props = this.props;
    const { controller, docModel } = props;
    const title =
      controller.run('getSheetTitle', props) + getI18nText(props, I18nKey.COPY);
    controller.run('operation', {
      ...props,
      opType: OpType.DUPLICATE_SHEET,
      sheetModel: docModel.currentSheetModel,
      title
    });
  };

  public renderContextMenu() {
    const props = this.props;
    const { docModel, model, controller } = props;
    if (model == null) return;
    if (docModel.currentSheetModel !== model) {
      controller.run('operation', {
        ...props,
        opType: OpType.SET_CURRENT_SHEET,
        sheetModel: model
      });
    }
    return (
      <Menu>
        <MenuItem
          onClick={this.onClickRename}
          text={getI18nText(props, I18nKey.RENAME)}
        />
        <Divider />
        <MenuItem
          onClick={this.onClickDuplicate}
          text={getI18nText(props, I18nKey.DUPLICATE)}
        />
        {docModel.sheetModels.size > 1 && (
          <MenuItem
            onClick={this.onClickDelete}
            text={getI18nText(props, I18nKey.DELETE)}
          />
        )}
      </Menu>
    );
  }

  render() {
    const props = this.props;
    const { controller } = props;
    const title = controller.run('getSheetTitle', props);
    const renameDlgProps = {
      ...props,
      isOpen: this.state.showRenameDialog,
      title,
      handleConfirm: this.handleConfirmRename,
      handleClose: this.handleCancelRename
    };
    return (
      <div>
        <Title>{title}</Title>
        <RenameDialog {...renameDlgProps} />
      </div>
    );
  }
}
