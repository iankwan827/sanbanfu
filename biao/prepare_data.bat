# 数据准备脚本
# 1. 创建数据集配置

mkdir -p data/bazi_sales

# 复制训练数据
cp biao/sales_training_data.jsonl data/bazi_sales/sales.jsonl

# 创建数据集配置文件
cat > data/bazi_sales/dataset_info.json << 'EOF'
{
  "sales": {
    "file_name": "sales.jsonl",
    "formatting": "sharegpt",
    "columns": {
      "messages": "messages"
    },
    "tags": {
      "role_tag": "role",
      "content_tag": "content",
      "user_tag": "user",
      "assistant_tag": "assistant"
    }
  }
}
EOF

echo "数据准备完成！"
echo ""
echo "运行微调："
echo "cd LLaMA-Factory"
echo "bash ../sanbanfu/biao/train_lora.sh"
