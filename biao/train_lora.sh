# LLaMA Factory 微调脚本 (适合 8GB 显存)

# 数据配置
dataset_dir: "data/bazi_sales"
dataset: "sales"
template: "qwen"
finetuning_type: "lora"

# 模型配置
model_name_or_path: "Qwen/Qwen2.5-7B-Instruct"

# 训练参数 (8GB显存优化)
per_device_train_batch_size: 2
gradient_accumulation_steps: 4
max_steps: 300
learning_rate: 3e-4
lr_scheduler_type: "cosine"
warmup_steps: 20
save_steps: 100
eval_steps: 100
logging_steps: 10

# LoRA 配置
lora_rank: 16
lora_alpha: 32
lora_dropout: 0.05
target_modules: "all"

# 输出
output_dir: "output/bazi_sales"
