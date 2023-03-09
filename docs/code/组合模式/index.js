// eslint-disable-next-line max-classes-per-file
class Folder {
  constructor(name) {
    this.files = [];
    this.name = name;
  }

  add(file) {
    file.parent = this;
    this.files.push(file);
  }

  scan() {
    console.log(`开始扫描文件夹：${this.name}`);
    for (let i = 0; i < this.files.length; i += 1) {
      this.files[i].scan();
    }
  }

  remove() {
    // 根节点或者是游离的结点
    if (!this.parent) return;
    for (let i = 0; i < this.parent.files.length; i += 1) {
      const file = this.parent.files[i];
      if (file === this) {
        this.parent.files.splice(i, 1);
      }
    }
  }
}

class File {
  constructor(name) {
    this.name = name;
  }

  scan() {
    console.log(`开始扫描文件:${this.name}`);
  }
}
const folder = new Folder('前端');
const subFolder = new Folder('JavaScript');
const file1 = new File('红宝书');
const file2 = new File('vuejs设计与实现');
const file3 = new File('JavaScript设计模式与实践');

folder.add(file2);
folder.add(subFolder);
subFolder.add(file1);
subFolder.add(file3);

console.log('---------删除之前---------');
folder.scan();

subFolder.remove();
console.log('---------删除之后---------');

folder.scan();
