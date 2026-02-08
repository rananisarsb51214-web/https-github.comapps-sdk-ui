import React, { useState, useEffect, useRef } from 'react';
import { enhanceContent, generateCaption } from '../services/gemini';
import { PostTemplate } from '../types';
import html2canvas from 'html2canvas';

const PRESET_TEMPLATES: PostTemplate[] = [
  {
    id: 'preset-1',
    content: 'The best way to predict the future is to create it.',
    theme: 'modern',
    image: null,
    fontFamily: 'font-sans'
  },
  {
    id: 'preset-2',
    content: 'Stay positive, work hard, make it happen. ✨',
    theme: 'gradient',
    image: null,
    fontFamily: 'font-serif'
  },
  {
    id: 'preset-3',
    content: 'Simplicity is the ultimate sophistication.',
    theme: 'minimal',
    image: null,
    fontFamily: 'font-mono'
  },
  {
    id: 'preset-4',
    content: 'Innovation distinguishes between a leader and a follower.',
    theme: 'glass',
    image: null,
    fontFamily: 'font-sans'
  },
  {
    id: 'preset-5',
    content: 'Every sunset brings the promise of a new dawn.',
    theme: 'sunset',
    image: null,
    fontFamily: 'font-cursive'
  },
  {
    id: 'preset-6',
    content: 'Deep work requires deep focus.',
    theme: 'midnight',
    image: null,
    fontFamily: 'font-mono'
  }
];

const fontOptions = [
  { label: 'Sans', value: 'font-sans', class: 'font-sans' },
  { label: 'Serif', value: 'font-serif', class: 'font-serif' },
  { label: 'Mono', value: 'font-mono', class: 'font-mono' },
  { label: 'Script', value: 'font-cursive', class: 'font-cursive' },
];

const PostCreator: React.FC = () => {
  const [text, setText] = useState('Create something amazing today...');
  const [theme, setTheme] = useState<PostTemplate['theme']>('modern');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // Custom Style State
  const [textColor, setTextColor] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('');
  const [fontFamily, setFontFamily] = useState<string>('font-sans');
  
  // Template State
  const [savedTemplates, setSavedTemplates] = useState<PostTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'presets' | 'saved'>('presets');
  
  // Hover Preview State
  const [hoveredTemplate, setHoveredTemplate] = useState<PostTemplate | null>(null);
  
  // Ref for the preview element to capture
  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved templates from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userPostTemplates');
    if (saved) {
      try {
        setSavedTemplates(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved templates', e);
      }
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPostTemplates', JSON.stringify(savedTemplates));
  }, [savedTemplates]);

  const handleEnhance = async () => {
    setIsEnhancing(true);
    const enhanced = await enhanceContent(text, 'creative');
    setText(enhanced);
    setIsEnhancing(false);
  };

  const handleGenerateCaption = async () => {
    setIsEnhancing(true);
    const caption = await generateCaption(text);
    setGeneratedCaption(caption);
    setIsEnhancing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setBackgroundImage(url);
    }
  };

  const handleSaveTemplate = () => {
    const newTemplate: PostTemplate = {
      id: Date.now().toString(),
      content: text,
      theme,
      image: backgroundImage,
      textColor: textColor || undefined,
      backgroundColor: bgColor || undefined,
      fontFamily
    };
    setSavedTemplates([...savedTemplates, newTemplate]);
    setActiveTab('saved');
  };

  const handleLoadTemplate = (template: PostTemplate) => {
    setText(template.content);
    setTheme(template.theme);
    setBackgroundImage(template.image || null);
    setTextColor(template.textColor || '');
    setBgColor(template.backgroundColor || '');
    setFontFamily(template.fontFamily || 'font-sans');
  };

  const handleDeleteTemplate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedTemplates(savedTemplates.filter(t => t.id !== id));
  };

  const handleThemeChange = (newTheme: PostTemplate['theme']) => {
    setTheme(newTheme);
    setTextColor('');
    setBgColor('');
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    try {
      // Use html2canvas to capture the preview area
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher resolution
        useCORS: true, // Allow cross-origin images
        backgroundColor: null, // Transparent background if not set
        logging: false
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `nisar-creative-post-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading image:", err);
      alert("Failed to download image. Please try again.");
    }
  };

  const themes = {
    modern: 'bg-white dark:bg-slate-800 text-gray-800 dark:text-white border-none shadow-xl',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl',
    minimal: 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-none',
    glass: 'bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 text-white shadow-lg',
    sunset: 'bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-2xl',
    ocean: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl',
    forest: 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-2xl',
    midnight: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl'
  };

  const themePreviewClasses = {
    modern: 'bg-white border border-gray-200',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
    minimal: 'bg-gray-100',
    glass: 'bg-slate-700',
    sunset: 'bg-gradient-to-br from-orange-400 to-rose-500',
    ocean: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    forest: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    midnight: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
  };

  const renderTemplateCard = (t: PostTemplate, isSaved: boolean) => (
    <div 
      key={t.id} 
      onClick={() => handleLoadTemplate(t)}
      onMouseEnter={() => setHoveredTemplate(t)}
      onMouseLeave={() => setHoveredTemplate(null)}
      className="group cursor-pointer relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all transform hover:-translate-y-1 bg-white dark:bg-gray-800 flex flex-col h-full"
    >
      <div 
        className={`h-24 w-full bg-cover bg-center flex items-center justify-center p-3 relative ${
          !t.image && !t.backgroundColor ? themePreviewClasses[t.theme] : ''
        }`}
        style={{ 
          backgroundImage: t.image ? `url(${t.image})` : undefined,
          backgroundColor: !t.image ? (t.backgroundColor || undefined) : undefined,
        }}
      >
        {(t.image || t.theme !== 'modern' && t.theme !== 'minimal') && <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px]"></div>}
        
        <p className={`text-[10px] leading-tight line-clamp-3 text-center relative z-10 font-medium ${t.fontFamily || 'font-sans'}`}
           style={{ color: t.textColor || undefined }}
        >
           <span className={`${
             t.textColor ? '' :
             (t.image || t.backgroundColor || t.theme === 'modern' || t.theme === 'minimal') ? 'text-gray-800 dark:text-gray-200' : 'text-white'
           }`}>
             {t.content}
           </span>
        </p>
      </div>

      <div className="p-2 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-card">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${
             t.theme === 'modern' ? 'bg-gray-400' :
             t.theme === 'gradient' ? 'bg-purple-500' :
             t.theme === 'minimal' ? 'bg-gray-200' : 
             t.theme === 'glass' ? 'bg-blue-300' :
             t.theme === 'sunset' ? 'bg-orange-500' :
             t.theme === 'ocean' ? 'bg-cyan-500' :
             t.theme === 'forest' ? 'bg-emerald-600' :
             'bg-indigo-900'
          }`}></div>
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{t.theme}</span>
        </div>
        
        {isSaved && (
          <button 
            onClick={(e) => handleDeleteTemplate(e, t.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Delete Template"
          >
            <i className="fas fa-trash-alt text-xs"></i>
          </button>
        )}
      </div>
    </div>
  );

  const renderHoverPreview = () => {
    if (!hoveredTemplate) return null;

    const t = hoveredTemplate;
    const isDarkTheme = ['gradient', 'glass', 'sunset', 'ocean', 'forest', 'midnight'].includes(t.theme);
    const forceWhiteText = t.image || t.backgroundColor || isDarkTheme;

    return (
      <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"></div>
        <div 
          className={`relative w-80 max-w-[85vw] aspect-[4/5] rounded-xl overflow-hidden p-8 flex flex-col justify-center items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-4 ring-white/50 dark:ring-gray-700/50 transform scale-100 transition-all duration-300 ${themes[t.theme]}`}
          style={{ 
            backgroundImage: t.image ? `url(${t.image})` : (t.backgroundColor ? 'none' : undefined),
            backgroundColor: t.backgroundColor || undefined,
            color: t.textColor || undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {t.image && <div className="absolute inset-0 bg-black/40"></div>}
          <div className="relative z-10 w-full break-words">
            <p className={`text-xl sm:text-2xl font-bold whitespace-pre-wrap ${t.image ? 'text-white drop-shadow-lg' : ''} ${t.fontFamily || 'font-sans'}`}>
              {t.content}
            </p>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-80">
            <span className={`text-xs sm:text-sm font-semibold ${forceWhiteText || t.textColor === '#ffffff' ? 'text-white' : ''}`}>@NisarCreative</span>
            <div className={`flex gap-2 ${forceWhiteText || t.textColor === '#ffffff' ? 'text-white' : ''}`}>
               <i className="fab fa-instagram"></i>
               <i className="fab fa-twitter"></i>
            </div>
          </div>
           <div className="absolute top-4 right-4 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md uppercase tracking-wider font-bold">
             Preview
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
      {/* Editor Controls */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg transition-all duration-300">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <i className="fas fa-magic text-secondary"></i> Enhanced Editing Tool
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:outline-none transition-all dark:text-white"
                placeholder="Type your content here..."
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleEnhance} 
                disabled={isEnhancing}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
              >
                {isEnhancing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                AI Enhance
              </button>
              <button 
                onClick={handleGenerateCaption}
                disabled={isEnhancing}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <i className="fas fa-hashtag"></i> Generate Caption
              </button>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 my-4" />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Base Theme</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(themes) as Array<keyof typeof themes>).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`px-3 py-1 rounded-md text-sm capitalize border transition-all duration-200 ${theme === t ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm' : 'border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background Image</label>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={handleImageUpload}
                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 transition-colors cursor-pointer"
               />
            </div>

            {/* Customization Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
               <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Customize Style</h4>
               
               <div className="grid grid-cols-2 gap-4 mb-4">
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={textColor || '#000000'}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-8 w-10 p-0 border-0 rounded cursor-pointer"
                      />
                      {textColor && (
                        <button onClick={() => setTextColor('')} className="text-xs text-red-500 hover:underline">Reset</button>
                      )}
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Bg Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={bgColor || '#ffffff'}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-8 w-10 p-0 border-0 rounded cursor-pointer"
                      />
                      {bgColor && (
                        <button onClick={() => setBgColor('')} className="text-xs text-red-500 hover:underline">Reset</button>
                      )}
                    </div>
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-medium text-gray-500 mb-2">Typography</label>
                 <div className="flex flex-wrap gap-2">
                   {fontOptions.map((f) => (
                     <button
                       key={f.value}
                       onClick={() => setFontFamily(f.value)}
                       className={`px-3 py-1 text-xs rounded border transition-all ${
                         fontFamily === f.value 
                           ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black' 
                           : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                       } ${f.class}`}
                     >
                       {f.label}
                     </button>
                   ))}
                 </div>
               </div>
            </div>

            {generatedCaption && (
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 animate-fade-in border-l-4 border-teal-500">
                <strong>Suggested Caption:</strong> <br/>
                {generatedCaption}
              </div>
            )}
          </div>
        </div>

        {/* Templates Section */}
        <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg transition-all duration-300">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i className="fas fa-layer-group text-pink-500"></i> Templates
             </h3>
             <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 self-start sm:self-auto">
               <button 
                onClick={() => setActiveTab('presets')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'presets' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
               >
                 Presets
               </button>
               <button 
                onClick={() => setActiveTab('saved')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'saved' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
               >
                 My Templates
               </button>
             </div>
           </div>

           {activeTab === 'saved' && (
             <button 
              onClick={handleSaveTemplate}
              className="w-full mb-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
             >
               <i className="fas fa-save"></i> Save Current Design as Template
             </button>
           )}

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === 'presets' ? (
                PRESET_TEMPLATES.map((t) => renderTemplateCard(t, false))
              ) : (
                savedTemplates.length === 0 ? (
                  <p className="col-span-1 sm:col-span-2 text-center text-gray-500 text-sm py-4">No saved templates yet.</p>
                ) : (
                  savedTemplates.map((t) => renderTemplateCard(t, true))
                )
              )}
           </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-200 dark:bg-gray-900 rounded-2xl border-4 border-dashed border-gray-300 dark:border-gray-700 min-h-[400px] sm:min-h-[500px] transition-colors duration-300">
        <h4 className="text-gray-500 mb-4 uppercase text-xs font-bold tracking-widest">Live Preview (Border Free)</h4>
        
        <div 
          ref={previewRef}
          className={`relative w-full max-w-sm aspect-[4/5] rounded-none overflow-hidden p-8 flex flex-col justify-center items-center text-center transition-all duration-500 shadow-2xl ${themes[theme]}`}
          style={{ 
            // If background color is manually set, we use 'none' for backgroundImage to override gradients defined in classes
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : (bgColor ? 'none' : undefined),
            backgroundColor: bgColor || undefined,
            color: textColor || undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {backgroundImage && <div className="absolute inset-0 bg-black/40"></div>}
          
          <div className="relative z-10 w-full break-words">
            <p className={`text-xl sm:text-2xl font-bold whitespace-pre-wrap ${backgroundImage ? 'text-white drop-shadow-lg' : ''} ${fontFamily}`}>
              {text}
            </p>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-80">
            <span className={`text-xs sm:text-sm font-semibold ${backgroundImage || textColor === '#ffffff' || ['gradient', 'glass', 'sunset', 'ocean', 'forest', 'midnight'].includes(theme) ? 'text-white' : ''}`}>@NisarCreative</span>
            <div className={`flex gap-2 ${backgroundImage || textColor === '#ffffff' || ['gradient', 'glass', 'sunset', 'ocean', 'forest', 'midnight'].includes(theme) ? 'text-white' : ''}`}>
               <i className="fab fa-instagram"></i>
               <i className="fab fa-twitter"></i>
            </div>
          </div>
        </div>

        <button 
          onClick={handleDownload}
          className="mt-8 px-6 sm:px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full hover:shadow-xl transition-all font-bold transform hover:scale-105 text-sm sm:text-base"
        >
          <i className="fas fa-download mr-2"></i> Download Template
        </button>
      </div>

      {renderHoverPreview()}
    </div>
  );
};

export default PostCreator;