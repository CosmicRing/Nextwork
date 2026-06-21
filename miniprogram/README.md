# 看看工资微信小程序

这是 `E:\Nextwork` 的原生微信小程序首发包，入口在 `miniprogram/`。

## 普通学校信息聚合流程

这个小程序优先服务没有现成数据库覆盖的二本、三本、民办和地方院校。使用时不要先相信宣传语，按下面顺序把公开资料聚合成可比较证据。

1. 输入学校和专业：在首页输入学校名，再输入目标专业。已收录学校会使用本地官方入口；未收录学校会生成公开入口包。
2. 走权威入口阶梯：先查教育部阳光高考/学校官网确认学校主体，再查招生网/学院页确认专业开设，之后查就业质量报告、就业信息网、国家大学生就业服务平台和企业官网岗位。
3. 用“填模板”采集证据：每个入口都能填入对应证据槽模板，复制公开页面里的年份、企业、岗位、就业率、薪资、官网域名等字段后再保存。
4. 用“剪贴板解析”提速：从官网、就业网或企业招聘页复制多段内容后，回到小程序点剪贴板解析；列表、编号和空行分隔的片段会自动拆成多条证据。
5. 看证据箱和当前候选判断：证据箱会去重、标记可信/待核验，并可展开完整正文。当前候选判断会提示“暂不建议比较 / 可先初筛 / 证据较完整”。
6. 保存候选做候选对比：保存 2-4 个学校和专业后，候选对比会按证据完整度排序，显示缺口和下一步。

所有证据只保存在本地小程序存储里，不上传、不远程存储。薪资只是企业岗位市场参考，不等于学校官方承诺。

## 本地预览

1. 安装并登录微信开发者工具。
2. 打开 `E:\Nextwork\miniprogram`。
3. 在 `project.config.json` 中把 `appid` 从 `touristappid` 替换为真实小程序 AppID。
4. 预览前先运行：

```powershell
npm run verify:miniprogram
```

## CLI 上传

微信官方 CLI 文档要求开发者工具已登录，且在「设置 -> 安全设置」中开启服务端口。Windows 的命令行工具通常在开发者工具安装目录下的 `cli.bat`。

```powershell
& "<微信开发者工具安装目录>\cli.bat" login
& "<微信开发者工具安装目录>\cli.bat" preview --project E:\Nextwork\miniprogram
& "<微信开发者工具安装目录>\cli.bat" upload --project E:\Nextwork\miniprogram -v 0.1.0 -d "看看工资首发小程序包"
```

当前包不调用登录、定位、用户资料、网络请求或 web-view；官网入口只作为可复制链接展示。

## npm CLI shortcuts

Use these from `E:\Nextwork` after WeChat DevTools is installed and logged in. Upload is blocked while `miniprogram/project.config.json` still uses `touristappid`.

```powershell
npm.cmd run miniapp:preview
npm.cmd run miniapp:upload
```

If `cli.bat` is not auto-detected, run the PowerShell runner with an explicit path:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/wechat-miniprogram-cli.ps1 -Mode preview -CliPath "C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat"
```
