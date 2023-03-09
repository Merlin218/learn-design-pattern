class Upload {
  // 只包含内部状态
  constructor(uploadType) {
    this.uploadType = uploadType;
  }

  // 设置外部状态
  setExternalState(uploadData) {
    Object.keys(uploadData).forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      this[key] = uploadData[key];
    });
  }

  // 删除
  delFile(uploadData) {
    this.setExternalState(uploadData);
    if (this.fileSize < 3000) {
      document.body.removeChild(this.dom);
      return;
    }
    if (window.confirm(`确定要删除吗？${this.fileName}`)) {
      document.body.removeChild(this.dom);
    }
  }
}

// 根据类型创建上传对象
const UploadFactory = (function () {
  const createFlyWeightObjs = {};
  return {
    create(uploadType) {
      // 如果不存在，则创建
      if (!createFlyWeightObjs[uploadType]) {
        createFlyWeightObjs[uploadType] = new Upload(uploadType);
      }
      return createFlyWeightObjs[uploadType];
    },
  };
}());

const UploadManager = (function () {
  // 存储所用上传对象的外部属性
  const uploadDatabase = {};
  return {
    // 添加对象
    add(id, uploadType, fileName, fileSize) {
      const flyWeightObj = UploadFactory.create(uploadType);
      const dom = document.createElement('div');
      dom.innerHTML = `
      <span>文件名称：${fileName}文件大小：${fileSize}</span>
      <button class="delFile">删除</button>
      `;
      dom.querySelector('.delFile').addEventListener('click', () => {
        flyWeightObj.delFile(uploadDatabase[id]);
      });
      document.body.appendChild(dom);
      uploadDatabase[id] = {
        fileName, fileSize, dom,
      };
      return flyWeightObj;
    },
  };
}());

let id = 0;
const startUpload = function (uploadType, files) {
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    UploadManager.add(id, uploadType, file.fileName, file.fileSize);
    id += 1;
  }
};

startUpload('plugin', [
  { fileName: '1.txt', fileSize: 1000 },
  { fileName: '2.html', fileSize: 3000 },
  { fileName: '3.txt', fileSize: 5000 },
]);

startUpload('flash', [
  { fileName: '4.txt', fileSize: 1000 },
  { fileName: '5.html', fileSize: 3000 },
  { fileName: '6.txt', fileSize: 5000 },
]);
