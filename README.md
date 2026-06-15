# 翻译写作专项练习器

## 项目结构

```text
.
├── index.html        # 欢迎页与主页入口
├── pages/            # 其他 HTML 页面
└── assets/
    ├── css/          # 公共样式与各页面样式
    └── js/           # 页面交互脚本
```

## 新增文件约定

- 新页面放在 `pages/`
- 页面专属样式放在 `assets/css/`
- 页面交互脚本放在 `assets/js/`
- `index.html` 保留在根目录，作为项目统一入口
- `pages/` 内引用样式或脚本时使用 `../assets/`
