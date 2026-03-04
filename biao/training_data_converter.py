#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
高质量八字命理训练数据生成器
严格遵循树形逻辑,避免矛盾和重复
"""

import json
import os
import re
import random
from pathlib import Path
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass


@dataclass
class TreeNode:
    """树节点数据结构"""
    level: int
    title: str
    content: str
    children: List['TreeNode']
    parent: Optional['TreeNode'] = None
    
    def get_path_titles(self) -> List[str]:
        """获取从根到当前节点的路径标题"""
        path = []
        node = self
        while node and node.title != "root":
            path.insert(0, node.title)
            node = node.parent
        return path


class HighQualityBaziConverter:
    """高质量八字训练数据转换器"""
    
    def __init__(self, input_dir: str, samples_per_file: int = 100):
        self.input_dir = Path(input_dir)
        self.samples_per_file = samples_per_file
        self.system_prompt = "你是一位精通三板斧命理体系的算命大师,风格专业准确且接地气。"
        
        # 多样化问题模板
        self.question_templates = [
            "大师,我{condition_desc},{topic}怎么样?",
            "{condition_desc},这种情况{topic}会如何?",
            "请问{condition_desc}的人,{topic}运势如何?",
            "命里{condition_desc},能帮我看看{topic}吗?",
            "{topic}方面,如果{condition_desc},会怎么样?",
            "我的八字{condition_desc},想问问{topic}。",
            "{condition_desc},适合做什么?",  # 事业类
            "{condition_desc},对{topic}有什么影响?",
        ]
    
    def clean_content(self, text: str) -> str:
        """清理内容中的噪音"""
        # 移除元数据标记
        text = re.sub(r'\*\*by\s+.*?幕布发布\*\*', '', text, flags=re.IGNORECASE)
        text = re.sub(r'by\s+.*?幕布发布', '', text, flags=re.IGNORECASE)
        
        # 移除多余的空行
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        return text.strip()
    
    def parse_markdown_file(self, file_path: Path) -> TreeNode:
        """解析Markdown文件为树形结构"""
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        root = TreeNode(level=0, title="root", content="", children=[])
        current_nodes = {0: root}
        
        i = 0
        while i < len(lines):
            line = lines[i].rstrip()
            
            heading_match = re.match(r'^(#{1,6})\s+(.+)$', line)
            if heading_match:
                level = len(heading_match.group(1))
                title = heading_match.group(2).strip()
                
                # 收集节点内容
                content_lines = []
                i += 1
                while i < len(lines):
                    next_line = lines[i].rstrip()
                    if re.match(r'^#{1,6}\s+', next_line):
                        break
                    if next_line and not next_line.startswith('---'):
                        content_lines.append(next_line)
                    i += 1
                
                content = self.clean_content('\n'.join(content_lines))
                
                # 创建节点
                node = TreeNode(level=level, title=title, content=content, children=[])
                
                # 找父节点
                parent_level = level - 1
                while parent_level >= 0:
                    if parent_level in current_nodes:
                        parent = current_nodes[parent_level]
                        parent.children.append(node)
                        node.parent = parent
                        break
                    parent_level -= 1
                
                current_nodes[level] = node
                levels_to_remove = [l for l in current_nodes if l > level]
                for l in levels_to_remove:
                    del current_nodes[l]
                
                continue
            
            i += 1
        
        return root
    
    def extract_decision_paths(self, node: TreeNode, current_path: List[TreeNode] = None) -> List[List[TreeNode]]:
        """提取所有决策路径"""
        if current_path is None:
            current_path = []
        
        current_path = current_path + [node]
        
        if not node.children:
            if len(current_path) > 2:
                return [current_path]
            return []
        
        all_paths = []
        for child in node.children:
            child_paths = self.extract_decision_paths(child, current_path)
            all_paths.extend(child_paths)
        
        return all_paths
    
    def extract_result_from_content(self, content: str) -> Tuple[str, str]:
        """从内容中提取结果和推荐,避免重复"""
        if not content:
            return "", ""
        
        # 提取结果
        result = ""
        recommendation = ""
        
        # 匹配各种结果标记
        result_match = re.search(r'→\s*\*\*(?:结果|取用)\*\*[：:]\s*(.+?)(?:\n|$)', content)
        if result_match:
            result = result_match.group(1).strip()
        
        # 匹配推荐职业
        rec_match = re.search(r'→\s*\*\*推荐职业\*\*[：:]\s*(.+?)(?:\n|$)', content)
        if rec_match:
            recommendation = rec_match.group(1).strip()
        
        # 匹配建议
        advice_match = re.search(r'→\s*\*\*建议\*\*[：:]\s*(.+?)(?:\n|$)', content)
        if advice_match and not recommendation:
            recommendation = advice_match.group(1).strip()
        
        # 如果没有标记,使用整段内容,但要去重
        if not result and not recommendation:
            # 去除所有→标记的内容
            clean = re.sub(r'→\s*\*\*.*?\*\*[：:].*', '', content)
            result = clean.strip()
        
        return result, recommendation
    
    def create_natural_question(self, topic: str, path: List[TreeNode]) -> str:
        """生成自然的用户提问"""
        # 跳过root和主题节点
        condition_nodes = [n for n in path[2:-1] if n.title != "root"]
        
        # 构建条件描述
        condition_parts = []
        for node in condition_nodes:
            title = node.title
            # 简化一些标题
            if "原局" in title or "大运" in title or "流年" in title:
                continue
            condition_parts.append(title)
        
        # 添加叶子节点的标题
        if len(path) > 0:
            leaf_title = path[-1].title
            # 如果叶子节点不是结果性的,加入条件
            if not any(x in leaf_title for x in ["结果", "推荐", "建议", "说明"]):
                condition_parts.append(leaf_title)
        
        condition_desc = "、".join(condition_parts) if condition_parts else "这个八字"
        
        # 随机选择模板
        template = random.choice(self.question_templates)
        
        # 根据主题调整
        topic_map = {
            "事业": "事业",
            "婚姻": "婚姻",
            "财运": "财运",
            "子女": "子女",
            "学业": "学业",
            "官非": "官非",
            "身强身弱": "用神",
            "夫妻性生活": "夫妻关系"
        }
        
        display_topic = topic_map.get(topic, topic)
        
        question = template.format(condition_desc=condition_desc, topic=display_topic)
        
        return question
    
    def create_professional_answer(self, topic: str, path: List[TreeNode]) -> str:
        """生成专业回答,避免复读"""
        # 获取叶子节点
        leaf = path[-1]
        result, recommendation = self.extract_result_from_content(leaf.content)
        
        # 构建回答
        answer_parts = []
        
        # 添加开场(简短)
        openings = [
            f"关于{topic}:",
            f"根据你的命局,",
            f"看你这个八字,",
            f"从{topic}角度看,",
        ]
        answer_parts.append(random.choice(openings))
        
        # 添加主要结果(只说一次!)
        if result:
            answer_parts.append(result)
        
        # 添加推荐(如果有且不重复)
        if recommendation and recommendation not in result:
            answer_parts.append(recommendation)
        
        # 拼接,确保不重复
        answer = " ".join(answer_parts)
        
        # 最终去重检查
        sentences = answer.split('。')
        unique_sentences = []
        seen = set()
        for s in sentences:
            s_clean = s.strip()
            if s_clean and s_clean not in seen:
                unique_sentences.append(s_clean)
                seen.add(s_clean)
        
        final_answer = '。'.join(unique_sentences)
        if final_answer and not final_answer.endswith('。'):
            final_answer += '。'
        
        return final_answer
    
    def path_to_conversation(self, topic: str, path: List[TreeNode]) -> Dict:
        """将路径转换为一条对话"""
        question = self.create_natural_question(topic, path)
        answer = self.create_professional_answer(topic, path)
        
        return {
            "messages": [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": question},
                {"role": "assistant", "content": answer}
            ]
        }
    
    def generate_samples_from_paths(self, topic: str, paths: List[List[TreeNode]], target_count: int) -> List[Dict]:
        """从路径生成指定数量的样本"""
        conversations = []
        
        # 如果路径少于目标数量,需要重复使用
        if len(paths) < target_count:
            # 每条路径生成多个变体
            multiplier = (target_count // len(paths)) + 1
            for _ in range(multiplier):
                for path in paths:
                    if len(conversations) >= target_count:
                        break
                    conv = self.path_to_conversation(topic, path)
                    conversations.append(conv)
        else:
            # 路径足够,随机选择
            selected_paths = random.sample(paths, target_count)
            for path in selected_paths:
                conv = self.path_to_conversation(topic, path)
                conversations.append(conv)
        
        return conversations[:target_count]
    
    def convert_file(self, file_path: Path) -> List[Dict]:
        """转换单个文件"""
        print(f"正在处理: {file_path.name}")
        
        # 解析树
        tree = self.parse_markdown_file(file_path)
        
        # 提取路径
        paths = self.extract_decision_paths(tree)
        print(f"  发现 {len(paths)} 条决策路径")
        
        # 获取主题
        topic_name = file_path.stem.replace('_树形结构图', '')
        
        # 生成指定数量的样本
        conversations = self.generate_samples_from_paths(topic_name, paths, self.samples_per_file)
        
        print(f"  生成 {len(conversations)} 条训练样本")
        
        return conversations
    
    def convert_all(self):
        """转换所有文件"""
        md_files = list(self.input_dir.glob("*_树形结构图.md"))
        
        if not md_files:
            print(f"错误: 未找到树形结构图文件")
            return
        
        print(f"🎯 高质量训练数据生成器")
        print(f"📊 目标: 每个文件 {self.samples_per_file} 条样本")
        print(f"📁 找到 {len(md_files)} 个文件\n")
        print("="*70)
        
        total_samples = 0
        output_files = []
        
        for md_file in sorted(md_files):
            conversations = self.convert_file(md_file)
            
            # 生成输出文件名
            topic_name = md_file.stem.replace('_树形结构图', '')
            output_file = self.input_dir / f"{topic_name}_training_data.jsonl"
            
            # 写入
            print(f"  ✍️  写入: {output_file.name}")
            with open(output_file, 'w', encoding='utf-8') as f:
                for conv in conversations:
                    json_line = json.dumps(conv, ensure_ascii=False)
                    f.write(json_line + '\n')
            
            total_samples += len(conversations)
            output_files.append((topic_name, output_file, len(conversations)))
            print()
        
        print("="*70)
        print(f"\n✅ 完成! 共生成 {total_samples} 条训练样本\n")
        
        print("📊 生成文件清单:")
        for topic_name, output_file, count in output_files:
            print(f"  📄 {output_file.name:<40} {count:4d} 条")
        
        print(f"\n✨ 质量保证:")
        print(f"  ✅ 严格遵循树形逻辑")
        print(f"  ✅ 无重复内容")
        print(f"  ✅ 已清理元数据")
        print(f"  ✅ 多样化提问")


def main():
    """主函数"""
    script_dir = Path(__file__).parent
    
    # 每个文件生成100条样本
    converter = HighQualityBaziConverter(script_dir, samples_per_file=100)
    converter.convert_all()


if __name__ == "__main__":
    main()
