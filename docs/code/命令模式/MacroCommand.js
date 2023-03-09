const closeCommand = {
  execute() {
    console.log('close');
  },
};
const openCommand = {
  execute() {
    console.log('open');
  },
};

class MacroCommand {
  constructor() {
    this.commands = [];
  }

  add(command) {
    this.commands.push(command);
  }

  execute() {
    this.commands.forEach((command) => {
      command.execute();
    });
  }
}

const macroCommand = new MacroCommand();
macroCommand.add(openCommand);
macroCommand.add(closeCommand);
macroCommand.execute();
