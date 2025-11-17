---
title: Claude Code 扩展机制实战：自动化流程的实现
author: yrobot
keywords: Claude Code,Subagent,Skills,MCP,Hooks,自动化
createTime: 2025年11月17日
---

## 背景：一个自动化需求引发的思考

最近遇到一个典型的数据处理场景：每周需要处理销售数据 Excel 表格，提取关键指标，分析趋势，生成总结报告并发送到 Slack。整个流程涉及多个步骤，且需要保留中间产物（提取后的 Excel）供后续核对。

这让我想到用 Claude Code 实现自动化，但面对 Skills、Agents、MCP、Hooks 等多种扩展机制，我陷入了困惑：

- 该用哪种机制？
- 它们的本质区别是什么？
- 如何组合使用才能实现最优方案？

本文将从这个实际需求出发，系统梳理 Claude Code 的所有扩展机制，并展示如何设计一个合理的自动化解决方案。

## Claude Code 扩展机制全景

Claude Code 提供了 7 种扩展机制，它们在不同层面增强 AI 的能力：

### 1. Subagents（子代理）

**本质**：专门的 AI 助手，自动处理特定类型任务并确保专业质量

**核心能力**：

- 独立运行，有自己的工具集和系统提示
- 适合复杂、多步骤的专业任务
- 调用方式：显式调用（如 `用 code-reviewer 审查代码`）

**配置位置**：

- `.claude/agents/`（项目级）
- `~/.claude/agents/`（用户级）

**典型场景**：代码审查、数据分析、调试复杂问题

### 2. Skills（技能）

**本质**：基于提示词的模块化功能包，由 Claude 自动决定是否调用

**核心能力**：

- 包含 `SKILL.md` + 可选脚本/模板
- 触发方式：语义匹配（基于描述和关键词）

**配置位置**：

- `.claude/skills/`（项目级）
- `~/.claude/skills/`（用户级）

**典型场景**：生成规范的 commit message、PDF 表单填写、代码风格检查

### 3. MCP Servers（模型上下文协议）

**本质**：连接外部服务的标准协议

**核心能力**：

- 提供新的工具能力（查询数据库、调用 API）
- 连接第三方服务（GitHub、Notion、Sentry、Slack）
- 标准化的工具接口

**配置位置**：

- `.mcp.json`（项目级）
- `~/.claude/mcp.json`（用户级）

**典型场景**：访问 Figma 设计、查询生产错误日志、读取 Notion 文档

### 4. Custom Slash Commands（自定义斜杠命令）

**本质**：频繁使用的提示词快捷方式

**核心能力**：

- 单个 Markdown 文件定义命令
- 支持参数传递（`$ARGUMENTS`、`$1`、`$2`）
- 可执行 bash 命令（`!` 前缀）

**配置位置**：

- `.claude/commands/`（项目级）
- `~/.claude/commands/`（用户级）

**典型场景**：快速代码审查（`/review-pr 123`）、问题修复（`/fix-issue 456`）

### 5. Hooks（钩子）

**本质**：在特定事件触发时自动执行的脚本

**核心能力**：

- 触发时机：工具使用前后、用户提交、会话开始/结束
- 两种类型：Command Hooks（执行脚本）、Prompt Hooks（LLM 决策）
- 支持阻断操作（如阻止敏感文件访问）

**配置位置**：

- `.claude/settings.json`（项目级）
- `~/.claude/settings.json`（用户级）

**典型场景**：代码自动格式化、权限校验、安全审计、上下文注入

### 6. Output Styles（输出风格）

**本质**：通过修改系统提示词改变 Claude 的行为模式

**核心能力**：

- 完全关闭默认工程提示，切换不同角色
- 三种内置风格：Default（工程师）、Explanatory（讲解者）、Learning（教学者）
- 支持自定义风格

**配置位置**：

- `.claude/output-styles/`（项目级）
- `~/.claude/output-styles/`（用户级）

**典型场景**：学习模式、架构解释模式

### 7. Plugins（插件）

**本质**：打包 Skills、Commands、MCP 等的分发机制

**核心能力**：

- 统一打包多种扩展组件
- 通过 marketplace 分享和安装
- 包含版本管理和依赖声明

**配置位置**：

- `plugin.json`（插件定义）

**典型场景**：团队工具包、行业解决方案（如 document-skills 插件）

## 核心区别与选择决策

### 关键对比

| 扩展机制          | 调用方式                                 | 适用场景                                    |
| ----------------- | ---------------------------------------- | ------------------------------------------- |
| **Subagent**      | 显式调用（`用 XX agent 做 YY`）          | 多步骤复杂流程、需要专业领域知识的任务      |
| **Skill**         | 自动触发（Claude 根据语义判断）          | 单一职责的固定任务、可复用的标准化流程      |
| **MCP**           | 作为工具被 Claude 调用                   | 需要访问外部服务（Slack、GitHub、数据库等） |
| **Slash Command** | 显式调用（`/command-name 参数`）         | 快速执行固定提示词、简单的 bash 命令包装    |
| **Hook**          | 事件自动触发（工具使用前后、会话开始等） | 自动化检查、代码格式化、权限校验            |
| **Output Style**  | 显式切换（`/output-style XX`）           | 改变 Claude 角色（工程师/教学者/讲解者）    |
| **Plugin**        | 安装后组件自动可用                       | 打包分发 Skills、Commands、MCP 等组件       |

### 决策树

```
需要扩展 Claude 能力？
│
├─ 需要连接外部服务？
│  └─ **使用 MCP**（如 Slack、GitHub、数据库）
│
├─ 需要改变 Claude 角色？
│  └─ **使用 Output Style**（如切换到学习模式）
│
├─ 需要自动化流程控制？
│  └─ **使用 Hook**（如代码提交前格式化）
│
├─ 需要快速执行固定提示？
│  └─ **使用 Slash Command**（如 `/review-pr 123`）
│
├─ 需要独立的专家流程？
│  └─ **使用 Subagent**（如代码审查、数据分析）
│
└─ 需要可复用的单一能力？
   └─ **使用 Skill**（如 commit 生成、PDF 处理）
```

## 实战需求分析

回到我们的场景：**Excel 数据处理自动化**

### 需求拆解

1. **输入**：销售数据 Excel 表格
2. **流程**：
   - 提取数据（筛选关键列、计算指标）
   - 整理分析（趋势分析、异常检测）
   - 生成总结（Markdown 报告）
   - 发送 Slack（推送到指定频道）
3. **约束**：
   - 需要保留提取后的 Excel 文件（中间产物）
   - 每个步骤需要明确的输入输出
   - 部分步骤可能单独使用（如只提取数据）

### 初步方案：为什么不用单一机制？

**方案 A：纯 Subagent**

- ✅ 因为涉及多步骤复杂流程，所以 Subagent 能保证顺序执行
- ✅ 因为需要专业数据分析能力，所以独立上下文有优势
- ❌ 但是步骤无法独立复用（想单独提取数据时需要重新写逻辑）

**方案 B：拆分为多个 Skills**

- ✅ 因为每个步骤职责单一，所以 Skill 模块化很合适
- ❌ 但是 Skills 是自动触发的，**无法保证按顺序执行**
- ❌ 因为无法显式调用，所以无法做到"先提取 → 再分析 → 最后发送"

**方案 C：纯 Slash Command**

- ✅ 因为是显式调用，所以可以控制执行
- ❌ 但是单个 Markdown 文件无法处理复杂的数据分析逻辑
- ❌ 因为没有独立上下文，所以难以维护状态

**核心问题**：

- 需要**流程控制**（Subagent 的能力）
- 需要**模块复用**（Skill 的优势）
- 需要**外部集成**（MCP 的功能）

## 最优方案：Subagent + Skills + MCP 组合

### 架构设计

```
.claude/
├── skills/                      # 可独立使用的功能模块
│   ├── excel-extractor.md       # 提取 Excel 数据 → 输出新 Excel
│   ├── data-analyzer.md         # 分析数据 → 输出 JSON
│   └── report-generator.md      # 生成报告 → 输出 Markdown
│
├── agents/
│   └── data-pipeline.md         # 编排器：按顺序调用 Skills
│
└── .mcp.json                    # MCP 配置（Slack 集成）
```

### 方案逻辑

**为什么选择 Subagent 做编排？**

- 因为需要保证"提取 → 分析 → 报告 → 发送"的严格顺序，所以用 Subagent 的流程控制能力

**为什么拆分为 Skills？**

- 因为"提取数据"这个能力可能单独使用（其他报表也需要），所以用 Skill 实现模块复用

**为什么集成 MCP？**

- 因为需要发送到 Slack（外部服务），所以用 MCP 提供标准化的 Slack 工具

## 完整实现

### Step 1：定义 Skill 1 - Excel 数据提取器

**文件**：`.claude/skills/excel-extractor.md`

````markdown
# Skill: Excel 数据提取器

## 描述

从销售数据 Excel 中提取关键列，计算指标，输出新的 Excel 文件。

**触发关键词**：提取 Excel、提取数据、extract data

## 执行流程

1. **读取原始 Excel**
   使用 Python + pandas 读取文件

2. **筛选关键列**

   - 日期、产品名、销售额、销售量
   - 剔除空值和异常数据

3. **计算指标**

   - 日销售额均值
   - 周环比增长率
   - Top 10 产品

4. **输出新 Excel**
   保存到：`output/extracted-data/{日期}-extracted.xlsx`

## 输出格式

**Excel 结构**：

- Sheet1: 原始数据（清洗后）
- Sheet2: 计算指标
- Sheet3: Top 产品列表

## 代码示例

```python
import pandas as pd
from datetime import datetime

def extract_sales_data(input_file):
    # 读取数据
    df = pd.read_excel(input_file)

    # 清洗数据
    df = df.dropna(subset=['日期', '销售额'])
    df['日期'] = pd.to_datetime(df['日期'])

    # 计算指标
    metrics = {
        '日均销售额': df['销售额'].mean(),
        '总销售量': df['销售量'].sum()
    }

    # 保存
    output_file = f"output/extracted-data/{datetime.now().strftime('%Y%m%d')}-extracted.xlsx"
    with pd.ExcelWriter(output_file) as writer:
        df.to_excel(writer, sheet_name='清洗数据', index=False)
        pd.DataFrame([metrics]).to_excel(writer, sheet_name='指标', index=False)

    return output_file
```

## 独立使用示例

**用户**："提取这个 Excel 的数据：data/sales-2025-01.xlsx"

**输出**：

```
✓ 已提取 sales-2025-01.xlsx 数据
✓ 保存到：output/extracted-data/20250117-extracted.xlsx
```
````

### Step 2：定义 Skill 2 - 数据分析器

**文件**：`.claude/skills/data-analyzer.md`

````markdown
# Skill: 数据分析器

## 描述

读取提取后的 Excel，进行趋势分析和异常检测。

**触发关键词**：分析数据、数据分析、analyze data

## 执行流程

1. **读取提取数据**
2. **趋势分析**
   - 周环比变化
   - 月度趋势
   - 季节性检测
3. **异常检测**
   - 销售额突增/突降
   - 异常产品识别
4. **保存分析结果**：`output/analysis/{日期}-analysis.json`

## 输出格式

```json
{
  "metadata": {
    "analyzed_at": "2025-01-17T10:30:00Z",
    "source_file": "20250117-extracted.xlsx"
  },
  "trends": {
    "week_over_week": "+12.5%",
    "top_growth_product": "产品A",
    "declining_products": ["产品B", "产品C"]
  },
  "anomalies": [
    {
      "date": "2025-01-15",
      "type": "spike",
      "value": 150000,
      "expected": 80000
    }
  ]
}
```
````

### Step 3：定义 Skill 3 - 报告生成器

**文件**：`.claude/skills/report-generator.md`

````markdown
# Skill: 报告生成器

## 描述

基于分析结果，生成 Markdown 格式的总结报告。

**触发关键词**：生成报告、创建总结、generate report

## 报告模板

```markdown
# 销售数据周报 - {日期}

## 核心指标

- 日均销售额：¥{value}
- 周环比：{percentage}

## 关键发现

1. {趋势 1}
2. {异常 1}

## 建议行动

- {建议 1}
- {建议 2}
```

## 输出位置

`output/reports/{日期}-report.md`
````

### Step 4：配置 MCP - Slack 集成

**文件**：`.mcp.json`

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    }
  }
}
```

**环境变量配置**：

```bash
# .env
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_TEAM_ID=T01234567
```

### Step 5：创建编排 Subagent

**文件**：`.claude/agents/data-pipeline.md`

````markdown
---
name: data-pipeline
description: 完整的数据处理流水线，依次执行提取→分析→报告→发送
tools: [Skill, Read, Write, Bash, mcp__slack__*]
model: sonnet
---

# 数据处理流水线编排器

## 角色

你是一个流程编排专家，负责协调 3 个独立 Skills 完成完整的数据处理和发送。

## 工作流程

当用户提供 Excel 文件路径时，严格按照以下顺序执行：

### 步骤 1：提取数据

调用 `excel-extractor` skill：

请使用 excel-extractor skill 提取数据
输入文件：{用户提供的路径}

**等待 skill 执行完成**，获取输出文件路径（如 `output/extracted-data/20250117-extracted.xlsx`）。

---

### 步骤 2：分析数据

调用 `data-analyzer` skill：

请使用 data-analyzer skill 分析刚才提取的数据
输入文件：{步骤 1 输出的 Excel 路径}

**等待 skill 执行完成**，获取分析结果路径（如 `output/analysis/20250117-analysis.json`）。

---

### 步骤 3：生成报告

调用 `report-generator` skill：

请使用 report-generator skill 生成报告
分析结果：{步骤 2 输出的 JSON 路径}

**等待 skill 执行完成**，获取报告路径（如 `output/reports/20250117-report.md`）。

---

### 步骤 4：发送 Slack

使用 Slack MCP 工具：

调用 mcp**slack**post_message 工具
频道：#sales-reports
内容：读取 {步骤 3 生成的报告}，并附上关键发现摘要
附件：提供步骤 1 生成的 Excel 文件下载链接

---

## 最终输出

完成所有步骤后，向用户返回：

```markdown
## 数据处理完成

### 执行摘要

- ✅ 提取数据：{记录数} 条
- ✅ 分析完成：发现 {异常数} 个异常
- ✅ 报告生成：{报告路径}
- ✅ Slack 通知：已发送到 #sales-reports

### 输出文件

- 📊 提取数据：`{路径1}`
- 📈 分析结果：`{路径2}`
- 📝 报告文档：`{路径3}`
```

## 错误处理

如果任何步骤失败：

1. 停止后续步骤
2. 向用户报告失败原因
3. 提供已完成步骤的输出文件

## 注意事项

- 确保每个 skill 执行完成后再继续
- 文件路径必须准确传递
- Slack 发送前验证报告内容完整性

## 使用演示

### 完整流程

```bash
# 用户输入
你："用 data-pipeline 处理 data/sales-2025-01.xlsx"

# Claude 执行过程
[启动 data-pipeline subagent]

→ 步骤1：调用 excel-extractor skill
  ✓ 提取完成：850 条记录

→ 步骤2：调用 data-analyzer skill
  ✓ 分析完成：发现 2 个异常

→ 步骤3：调用 report-generator skill
  ✓ 报告生成：3,200 字

→ 步骤4：发送到 Slack
  ✓ 已发送到 #sales-reports

## 数据处理完成

### 执行摘要
- ✅ 提取数据：850 条
- ✅ 分析完成：发现 2 个异常
- ✅ 报告生成：output/reports/20250117-report.md
- ✅ Slack 通知：已发送到 #sales-reports

### 输出文件
- 📊 提取数据：`output/extracted-data/20250117-extracted.xlsx`
- 📈 分析结果：`output/analysis/20250117-analysis.json`
- 📝 报告文档：`output/reports/20250117-report.md`
```
````

## 方案优势总结

### 相比纯 Subagent

| 维度         | 纯 Subagent     | Subagent + Skills        |
| ------------ | --------------- | ------------------------ |
| **模块复用** | ❌ 整体复用     | ✅ 单个 Skill 可独立使用 |
| **流程控制** | ✅ 内部控制     | ✅ Subagent 编排         |
| **维护性**   | ⚠️ 修改影响整体 | ✅ 修改独立 Skill        |

### 相比拆分 Skills

| 维度         | 拆分 Skills     | Subagent + Skills |
| ------------ | --------------- | ----------------- |
| **顺序保证** | ❌ 无法保证     | ✅ Subagent 控制  |
| **用户体验** | ❌ 需要多次交互 | ✅ 一次调用完成   |
| **数据传递** | ⚠️ 只能靠文件   | ✅ 文件 + 内存    |

### 核心价值

**因为需要流程控制，所以用 Subagent 编排**
**因为需要模块复用，所以用 Skills 实现**
**因为需要外部集成，所以用 MCP 连接 Slack**

这种组合方案：

- 保证了执行顺序（Subagent 的能力）
- 实现了模块复用（Skill 的优势）
- 集成了外部服务（MCP 的功能）
- 简化了用户操作（一次调用完成全流程）

## 扩展场景

### 场景 1：添加自动格式化 Hook

如果希望生成的报告自动格式化，可以添加 Hook：

**文件**：`.claude/settings.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write $FILE_PATH"
          }
        ]
      }
    ]
  }
}
```

**效果**：每次 Write 工具写入文件后，自动执行 prettier 格式化

**为什么用 Hook**：因为格式化是"自动触发"的需求，符合 Hook 的事件驱动特性

### 场景 2：添加快速查看命令

如果希望快速查看最新报告，可以添加 Slash Command：

**文件**：`.claude/commands/view-latest-report.md`

```markdown
---
description: 查看最新生成的数据报告
---

!ls -t output/reports/\*.md | head -1 | xargs cat
```

**使用**：`/view-latest-report`

**为什么用 Slash Command**：因为是简单的 bash 命令包装，适合快速执行

## 总结

### 选择扩展的逻辑判断

- **需要外部数据？** → MCP
- **需要自动触发？** → Hook
- **需要角色切换？** → Output Style
- **需要快速指令？** → Slash Command
- **需要复杂流程？** → Subagent
- **需要单一能力？** → Skill
- **需要打包分发？** → Plugin

### 组合结合具体场景

这个 Subagent + Skills + MCP 组合方案适合：

- 需要模块化 + 流程控制的场景
- 步骤可能独立使用的场景
- 需要外部服务集成的场景
- 复用 Skills

---

通过合理组合 Claude Code 的扩展机制，我们可以构建出既灵活又可维护的自动化解决方案。
