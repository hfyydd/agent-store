import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";

interface UploadWorkflowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  userId: string;
}

interface Tag {
  id: number;
  name: string;
}

type UploadType = 'workflow' | 'prompt';

const UploadWorkflowDialog: React.FC<UploadWorkflowDialogProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  userId
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [testUrl, setTestUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [price, setPrice] = useState('0.00');
  const [uploadType, setUploadType] = useState<UploadType>('workflow');

  const supabase = createClient();

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching tags:', error);
      } else {
        setTags(data || []);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setIcon(null);
    setFile(null);
    setTestUrl('');
    setSelectedTags([]);
    setPrice('0.00');
    setIsUploading(false);
    setUploadType('workflow');
  };

  const handleTagChange = (tagId: number) => {
    setSelectedTags(prevSelectedTags =>
      prevSelectedTags.includes(tagId)
        ? prevSelectedTags.filter(id => id !== tagId)
        : [...prevSelectedTags, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !file || selectedTags.length === 0 || !price) {
      alert('请提供 名称, 图标, 价格, 和选择至少一个 Tag');
      return;
    }
  
    setIsUploading(true);
  
    try {
      // 检查用户认证
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('未找到用户');
      }
  
      // 读取文件内容
      const fileContent = await file.text();
  
      let iconUrl = null;
      if (icon) {
        // 检查文件类型
        if (!icon.type.startsWith('image/')) {
          throw new Error('只允许上传图片文件');
        }
  
        // 检查文件大小 (例如 5MB 限制)
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (icon.size > MAX_FILE_SIZE) {
          throw new Error('尺寸不能超过 5mb');
        }
  
        // 创建文件名 (使用允许的文件夹名)
        const iconFileName = `${user.id}-${Date.now()}-icon`;
        // 上传图标
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('workflow-icons')
          .upload(iconFileName, icon, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (uploadError) throw uploadError;
  
        // 获取公共 URL
        const { data: publicUrlData } = supabase.storage
          .from('workflow-icons')
          .getPublicUrl(iconFileName);
  
        iconUrl = publicUrlData.publicUrl;
      }

      
  
      // 插入数据到 workflows 表
      const { data, error } = await supabase
        .from('workflows')
        .insert({
          user_id: user.id,
          name,
          description,
          icon_url: iconUrl,
          content: fileContent,
          test_url: testUrl,
          tags: selectedTags,
          price: parseFloat(price),
          type: uploadType,
        })
        .select()
        .single();
  
      if (error) throw error;
  
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading workflow:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload workflow');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-[480px] max-w-full my-8 mx-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            上传 {uploadType === 'workflow' ? 'Workflow(支持 dify格式和JSON 格式)' : 'Prompt'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                上传类型 <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="uploadType"
                    value="workflow"
                    checked={uploadType === 'workflow'}
                    onChange={() => setUploadType('workflow')}
                  />
                  <span className="ml-2">Workflow</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="uploadType"
                    value="prompt"
                    checked={uploadType === 'prompt'}
                    onChange={() => setUploadType('prompt')}
                  />
                  <span className="ml-2">Prompt</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                {uploadType === 'workflow' ? 'Workflow' : 'Prompt'} 名称 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`给 ${uploadType === 'workflow' ? 'workflow' : 'prompt'} 起一个独一无二的名字`}
                required
                maxLength={40}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{name.length}/40</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                {uploadType === 'workflow' ? 'Workflow ' : 'Prompt'} 简介
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder={`介绍 ${uploadType === 'workflow' ? 'workflow' : 'prompt'} 的功能， 将会展示给用户`}
                maxLength={800}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{description.length}/800</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
                价格 (🐨) <span className="text-red-500">*</span>     🐨10 = ￥1
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">🐨</span>
                </div>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">考拉币</span>
                </div>
              </div>
            </div>

            {uploadType === 'workflow' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="testUrl">
                  测试 URL
                </label>
                <input
                  id="testUrl"
                  type="url"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://ip/chat/workflow_id"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <label key={tag.id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagChange(tag.id)}
                    />
                    <span className="ml-2 text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="icon">
                图标 (可选)
              </label>
              <input
                id="icon"
                type="file"
                accept="image/*"
                onChange={(e) => setIcon(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div className="flex items-center space-x-2">
                {icon ? (
                  <img src={URL.createObjectURL(icon)} alt="Selected icon" className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <label htmlFor="icon" className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                  上传
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="file">
                文件 <span className="text-red-500">*</span>
              </label>
              <input
                id="file"
                type="file"
                accept={uploadType === 'workflow' ? ".yml,.yaml,.json" : ".txt"}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                required
              />
              <label htmlFor="file" className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                {file ? file.name : `选择 ${uploadType === 'workflow' ? 'YAML/JSON' : 'TXT'} 文件`}
              </label>
            </div>
          </form>

        </div>
        <div className="sticky bottom-0 bg-white py-4 px-6 border-t border-gray-200">
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isUploading ? '上传中...' : '确认'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadWorkflowDialog;