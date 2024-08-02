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

const UploadWorkflowDialog: React.FC<UploadWorkflowDialogProps> = ({ isOpen, onClose, onUploadSuccess, userId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<File | null>(null);
  const [yamlFile, setYamlFile] = useState<File | null>(null);
  const [testUrl, setTestUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [price, setPrice] = useState('');

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

  const resetForm = () => {
    setName('');
    setDescription('');
    setIcon(null);
    setYamlFile(null);
    setTestUrl('');
    setSelectedTags([]);
    setPrice('');
    setIsUploading(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleTagChange = (tagId: number) => {
    setSelectedTags(prevSelectedTags => 
      prevSelectedTags.includes(tagId)
        ? prevSelectedTags.filter(id => id !== tagId)
        : [...prevSelectedTags, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !yamlFile || selectedTags.length === 0 || !price) {
      alert('Please provide a name, YAML file, price, and select at least one tag');
      return;
    }

    setIsUploading(true);

    try {
      const yamlContent = await yamlFile.text();

      let iconUrl = null;
      if (icon) {
        const { data, error } = await supabase.storage
          .from('workflow-icons')
          .upload(`${userId}/${Date.now()}-${icon.name}`, icon);
        if (error) throw error;
        iconUrl = supabase.storage.from('workflow-icons').getPublicUrl(data.path).data.publicUrl;
      }

      const { data, error } = await supabase
        .from('workflows')
        .insert({
          user_id: userId,
          name,
          description,
          icon_url: iconUrl,
          content: yamlContent,
          test_url: testUrl,
          tags: selectedTags,
          price: parseFloat(price),
        })
        .select()
        .single();

      if (error) throw error;

      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading workflow:', error);
      alert('Failed to upload workflow');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[480px] max-w-full">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Create Workflow</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Name input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Workflow name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Give the workflow a unique name"
              required
              maxLength={40}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{name.length}/40</p>
          </div>

          {/* Description input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
              Workflow description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="It introduces the workflow functions and is displayed to the workflow users"
              maxLength={800}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{description.length}/800</p>
          </div>

          {/* Price input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
              Price (¥) <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">¥</span>
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
                <span className="text-gray-500 sm:text-sm">CNY</span>
              </div>
            </div>
          </div>

          {/* Test URL input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="testUrl">
              Test URL
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

          {/* Tags selection */}
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

          {/* Icon upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="icon">
              Icon (optional)
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
                Upload
              </label>
            </div>
          </div>

          {/* YAML file upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="yaml">
              YAML File <span className="text-red-500">*</span>
            </label>
            <input
              id="yaml"
              type="file"
              accept=".yml,.yaml"
              onChange={(e) => setYamlFile(e.target.files?.[0] || null)}
              className="hidden"
              required
            />
            <label htmlFor="yaml" className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
              {yamlFile ? yamlFile.name : 'Select YAML file'}
            </label>
          </div>

          {/* Submit and Cancel buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadWorkflowDialog;