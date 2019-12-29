import {Icon} from "@blink-mind/renderer-react";
import {MenuDivider, MenuItem} from "@blueprintjs/core";
import * as React from "react";
import {OP_TYPE_START_EDITING_TOPOLOGY} from "../../plugin-topology-diagram/src/utils";

export default function TopicReferencePlugin() {
  return {
    customizeTopicContextMenu(props, next) {
      const { model, topicKey, controller } = props;
      function editTopology(e) {
        controller.run('operation', {
          ...props,
          opType: OP_TYPE_START_EDITING_TOPOLOGY
        });
      }
      return (
        <>
          {next()}
          <MenuDivider />
          <MenuItem
            icon={Icon('topology')}
            text="Edit Topology Diagram"
            onClick={editTopology}
          />
        </>
      );
    },
  }
}
