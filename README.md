# 食光食堂 · 线上食堂前端

一个用原生 HTML、CSS 和 JavaScript 编写的线上食堂点餐页面。无框架、无构建步骤，打开即可使用。

![食光食堂页面预览](docs/preview.jpg)

## 功能

- 今日菜单展示，支持分类筛选和关键词搜索
- 加入餐盘、调整数量、堂食 / 打包切换
- 餐盘与小计会保存在浏览器 localStorage 中
- 结算弹窗：取餐时间、取餐人、备注
- 下单成功页生成取餐码，并记录最近订单
- 响应式布局，适配桌面和手机
- 键盘操作：`/` 聚焦搜索，`Esc` 关闭餐盘或弹窗

## 本地运行

直接用浏览器打开 `index.html`，或在项目目录启动一个静态服务器：

```bash
python -m http.server 8080
```

然后访问 <http://localhost:8080>。

## 目录结构

```text
.
├── index.html
├── docs
│   └── preview.jpg
└── assets
    ├── css
    │   └── style.css
    ├── js
    │   └── app.js
    └── favicon.svg
```

## 说明

- 菜品、价格、营业时间与食堂地址均为演示内容。
- 页面不包含支付与后端接口，订单数据仅保存在当前浏览器中。
- 如需替换菜单，编辑 `assets/js/app.js` 顶部的 `MENU` 数组即可。
