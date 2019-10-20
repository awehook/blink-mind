export type Command = {
  type: string;
  args: any;
};

//closure
// 如何处理同名command
export function CommandsPlugin(commands: Object = {}) {
  function onCommand(command: Command, editor, next: Function) {
    const { type, args } = command;
    const fn = commands[type];
    if (!fn) return next();
    fn(args);
  }

  function onConstruct(editor, next) {
    for (const command in commands) {
      editor.registerCommand(command);
    }

    return next();
  }
  return {
    onCommand,
    onConstruct
  };
}
