# 八字命理AI训练数据

高质量的八字命理训练数据集,用于微调AI模型成为专业的算命大师。

## 📊 数据概览

- **总样本数**: 800条
- **文件数**: 8个主题
- **每文件样本**: 100条
- **数据格式**: JSONL (OpenAI标准格式)
- **质量保证**: ✅ 已验证无重复、无噪音、逻辑一致

## 📁 文件清单

| 主题 | 文件名 | 样本数 | 说明 |
|------|--------|--------|------|
| 财运 | `财_training_data.jsonl` | 100 | 财运分析与建议 |
| 夫妻性生活 | `夫妻性生活_training_data.jsonl` | 100 | 夫妻关系分析 |
| 官非 | `官非_training_data.jsonl` | 100 | 官非诉讼判断 |
| 婚姻 | `婚姻_training_data.jsonl` | 100 | 婚姻运势分析 |
| 身强身弱用神 | `身强身弱用神_training_data.jsonl` | 100 | 用神选取核心逻辑 |
| 事业 | `事业_training_data.jsonl` | 100 | 事业职业推荐 |
| 学业 | `学业_training_data.jsonl` | 100 | 学业运势分析 |
| 子女 | `子女_training_data.jsonl` | 100 | 子女缘分判断 |

## 🎯 数据特点

### ✅ 严格逻辑一致性
每条数据严格遵循原始树形结构逻辑,确保AI回答准确无矛盾。

### ✅ 彻底去重
自动检测并移除重复句子,避免"复读机"问题。

### ✅ 元数据清理  
清除所有"by XXX 幕布发布"等噪音,保证纯净内容。

### ✅ 自然化提问
使用多样化模板模拟真实用户提问,不再是死板的"原局→身强"格式。

## 💡 使用方法

### OpenAI微调

```bash
# 单个主题微调
openai api fine_tunes.create \
  -t "事业_training_data.jsonl" \
  -m "gpt-3.5-turbo"

# 全能模型微调(合并所有文件)
cat *_training_data.jsonl > all_bazi_training.jsonl
openai api fine_tunes.create \
  -t "all_bazi_training.jsonl" \
  -m "gpt-3.5-turbo"
```

### 本地模型微调

推荐使用 **LLaMA Factory**:

```bash
# 安装
git clone https://github.com/hiyouga/LLaMA-Factory.git
cd LLaMA-Factory
pip install -r requirements.txt

# 微调Qwen2-7B
python src/train_bash.py \
  --stage sft \
  --model_name_or_path Qwen/Qwen2-7B-Instruct \
  --dataset your_dataset_name \
  --template qwen \
  --finetuning_type lora \
  --output_dir ./output
```

## 📝 数据格式示例

```json
{
  "messages": [
    {
      "role": "system",
      "content": "你是一位精通三板斧命理体系的算命大师,风格专业准确且接地气。"
    },
    {
      "role": "user",
      "content": "大师,我身强、有财星,事业怎么样?"
    },
    {
      "role": "assistant",
      "content": "根据你的命局, 身强有财,富格之象。你身体棒、有干劲,财运旺盛,适合自主创业或管理岗位。"
    }
  ]
}
```

## 🛠️ 工具脚本

- `training_data_converter.py` - 数据生成器
- `validate_training_data.py` - 质量验证器
- `show_samples.py` - 样本展示工具
- `show_files_info.py` - 文件统计工具

## 📌 注意事项

1. **数据质量**: 所有数据已通过严格质量检查
2. **逻辑准确**: 基于三板斧命理体系标准逻辑
3. **适用模型**: 支持任何JSONL格式的聊天模型
4. **建议epochs**: 初次微调建议3-5轮

## 🎓 微调建议

### 初学者
- 使用OpenAI API,最简单直接
- 选择1-2个主题先试试效果
- 成本约$10-20

### 进阶用户
- 使用本地Qwen2-7B或LLaMA模型
- RTX 3090显卡可流畅微调
- 完全可控,无额外成本

## 📞 技术支持

如有问题可查看:
- 完成报告: `walkthrough.md`
- 实施计划: `implementation_plan.md`

---

**生成日期**: 2026-02-09  
**数据版本**: v1.0 (高质量版)  
**质量状态**: ✅ 已验证可用
