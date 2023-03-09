// - 手写题：命令模式
// - 只输入包含a-z的内容，
// 其中输入i会退格，移除最后一个字母；
// 输入o会撤回，移除上一次操作；
// 输入u会将当前内容复制两次；
// - 例子
// - 输入：‘abi’结果：‘a’
// - 输入：‘abio’结果：‘ab’
// - 输入：‘abiocvc’结果：‘ababvababv’

class KeyBoard {
  constructor() {
    this.commandList = [];
    this.commands = {};
    this.context = '';
  }

  setCommand(key, command) {
    this.commands[key] = command.bind(this);
  }

  execute(key) {
    if (key in this.commands) {
      const commandObj = this.commands[key]();
      commandObj.execute();
      this.commandList.push(commandObj);
    } else {
      this.context += key;
    }
  }

  resetList() {
    this.commandList = [];
    this.context = '';
  }
}

const keyboard = new KeyBoard();

const backCommand = function () {
  let c = null;
  const self = this;
  return {
    execute() {
      c = self.context[self.context.length - 1];
      self.context = self.context.slice(0, self.context.length - 1);
    },
    undo() {
      self.context += c;
    },
  };
};

const copyCommand = function () {
  const self = this;
  return {
    execute() {
      self.context = `${self.context}${self.context}`;
    },
    undo() {
      self.context = self.context.substring(0, self.context.length / 2);
    },
  };
};

const undoCommand = function () {
  const self = this;
  return {
    execute() {
      if (self.commandList.length === 0) return;
      self.commandList.pop().undo();
    },
  };
};

keyboard.setCommand('i', backCommand);
keyboard.setCommand('u', undoCommand);
keyboard.setCommand('o', copyCommand);

function exec(str) {
  let i = 0;
  while (i < str.length) {
    keyboard.execute(str[i]);
    i += 1;
  }
  const res = keyboard.context;
  keyboard.resetList();
  return res;
}

console.log(exec('abi')); // a
console.log(exec('abiu')); // ab
console.log(exec('abiuovo')); // ababvababv
