MainViewTable组件功能描述

组件架构设计：

- [x] 1、获取表数据，根据获取到的表数组数据结构同步生成SyncControlTree组件所需要的结构树数据，对于每次表数组结构的更改需要同步映射到结构树上；

- [ ] 2、显示列数组需要动态生成，根据设置显示列挑选出来的显示列顺序渲染；

- [x] 3、新增标题，滚动该新增行并置顶，选择表行、选择树节点的时候联动置顶对应的树节点、表行 [使用 - this.refs[elem].scrollIntoView()](https://stackoverflow.com/questions/47799365/scrollintoview-using-react-refs)

- [x] 4、维护总数据集，视界数据集，SyncControlTree组件依赖总数据集的变更

- [ ] 5、列需要区分编辑列和不可编辑列

- [x] 6、确定Tree组件和Table组件切换成点选状态的机制，即动态设置selectedKeys

- [x] 7、尝试用arr-diff包来区分`[{a:1} , {b:2}]`与`[{a:1}]`的区别,预期`diff(前者，后者)`得到`[{b:2}]`，但实际不能处理差异的内嵌数组，只能用es6函数来处理
