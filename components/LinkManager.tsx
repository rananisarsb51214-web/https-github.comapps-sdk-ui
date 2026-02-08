import React, { useState } from 'react';
import { SocialLink } from '../types';

interface LinkManagerProps {
  links: SocialLink[];
  addLink: (link: SocialLink) => void;
  removeLink: (id: string) => void;
}

const LinkManager: React.FC<LinkManagerProps> = ({ links, addLink, removeLink }) => {
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [platform, setPlatform] = useState<SocialLink['platform']>('other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newLabel) return;

    const newLink: SocialLink = {
      id: Date.now().toString(),
      url: newUrl,
      label: newLabel,
      platform,
      icon: 'fas fa-link',
      color: 'bg-gray-600'
    };

    addLink(newLink);
    setNewUrl('');
    setNewLabel('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-card rounded-2xl shadow-xl mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-4 border-gray-200 dark:border-gray-700">
        <i className="fas fa-cogs mr-2 text-primary"></i> Admin Link Manager
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Label</label>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white"
            placeholder="My Portfolio"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white"
            placeholder="https://..."
          />
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="w-full py-3 bg-secondary hover:bg-purple-600 text-white rounded-lg font-bold transition-all">
            <i className="fas fa-plus-circle mr-2"></i> Add Active Link
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Links</h3>
        {links.length === 0 ? (
          <p className="text-gray-500 italic">No custom links added yet.</p>
        ) : (
          links.map(link => (
            <div key={link.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200">{link.label}</p>
                <p className="text-sm text-gray-500 truncate">{link.url}</p>
              </div>
              <button 
                onClick={() => removeLink(link.id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LinkManager;