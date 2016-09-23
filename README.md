# ccms-cli

Command line tool for Shuyun CCMS projects.

## Usage

```bash
# 全局安装 ccms-cli 工具
npm install -g ShuyunFF2E/ccms-cli

# 初始化一个 CCMS 项目
ccms init <YOUR-PROJECT-NAME>
```

## Contributing

```bash
# fork 并 clone 代码
# 进入项目目录
cd ccms-cli

# 安装依赖
npm install

# 使用 ccms 命令进行开发测试
./bin/ccms --help

# 如果之前没有全局安装 ccms-cli，也可以将 ccms-cli 链接到 global 位置
# 这样可以直接使用 ccms 命令
npm link
ccms --help
```

