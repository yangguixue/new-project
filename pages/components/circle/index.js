var common = require('../../common/common.js');

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    item: Object
  },
  data: {
    // 这里是一些组件内部数据

  },
  methods: {
    // 这里是一个自定义方法
    handleJoinCircle: function(event) {
      var item = event.target.dataset.item;
      var newItem = {
        status: !item.status,
        cg_id: item.cg_id,
        cg_name: item.name
      };
      common.handleJoin(newItem)
    }
  }
})