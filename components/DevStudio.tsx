import React, { useState, useEffect, useRef } from 'react';

// Default code templates based on the user request
const DEFAULT_CODE = {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My AI-Powered Website</title>
    <style>
        /* CSS injected here for single-file preview simplicity */
        :root { --primary: #3b82f6; --text: #f8fafc; --bg: #0f172a; }
        body { margin: 0; font-family: 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
        .hero { min-height: 80vh; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 2rem; background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%); }
        h1 { font-size: 3.5rem; margin-bottom: 1rem; background: linear-gradient(to right, #60a5fa, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        /* 3D Grid & Card Effects */
        .card-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 2rem; 
            max-width: 1200px; 
            padding: 2rem; 
            perspective: 1000px; /* Essential for 3D effect */
        }
        
        .card { 
            position: relative;
            background: rgba(30, 41, 59, 0.5); 
            border: 1px solid rgba(148, 163, 184, 0.1); 
            padding: 2rem; 
            border-radius: 1rem; 
            backdrop-filter: blur(10px); 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            transform-style: preserve-3d; /* Allows children to pop out */
        }
        
        .card:hover { 
            transform: translateY(-15px) rotateX(5deg); 
            border-color: var(--primary); 
            box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25);
            background: rgba(30, 41, 59, 0.8);
        }
        
        /* Glass shine effect */
        .card::after {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
            border-radius: 1rem;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        .card:hover::after { opacity: 1; }

        .icon { 
            font-size: 2.5rem; 
            margin-bottom: 1rem; 
            color: var(--primary); 
            transform: translateZ(40px); /* Pop out effect */
            display: inline-block;
        }
        
        h3 { 
            margin: 0 0 0.5rem 0; 
            transform: translateZ(25px); 
            color: #fff;
        }
        
        p { 
            color: #94a3b8; 
            transform: translateZ(15px); 
        }

        .btn { background: var(--primary); color: white; border: none; padding: 1rem 2rem; border-radius: 2rem; font-weight: bold; cursor: pointer; transition: all 0.3s; margin-top: 2rem; }
        .btn:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .floating { animation: float 6s ease-in-out infinite; }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="hero">
        <div class="floating">
            <i class="fas fa-cube" style="font-size: 5rem; color: #60a5fa; margin-bottom: 2rem;"></i>
        </div>
        <h1>AI-Powered Experience</h1>
        <p style="font-size: 1.25rem; color: #94a3b8; max-width: 600px;">Build stunning, responsive 3D-enhanced websites with the power of artificial intelligence.</p>
        <button class="btn" onclick="alert('Welcome to the future!')">Get Started</button>
    </div>

    <div class="card-grid">
        <div class="card">
            <i class="fas fa-magic icon"></i>
            <h3>Auto Generation</h3>
            <p>AI generates clean code based on your requirements instantly.</p>
        </div>
        <div class="card">
            <i class="fas fa-layer-group icon"></i>
            <h3>3D Layouts</h3>
            <p>Immersive depth and interactions for modern web experiences.</p>
        </div>
        <div class="card">
            <i class="fas fa-rocket icon"></i>
            <h3>High Performance</h3>
            <p>Optimized for speed and responsiveness across all devices.</p>
        </div>
    </div>
</body>
</html>`,
    'style.css': `/* External CSS File */
body {
    background-color: #0f172a;
    color: #f8fafc;
}
/* More styles can be added here */`,
    'script.js': `console.log('AI Dev Studio initialized');`
};

const ADS = [
    { title: "AI Content Generator", content: "Generate high-quality content in seconds.", cta: "Try Free" },
    { title: "Social Media AI", content: "Automate your strategy with AI analytics.", cta: "Learn More" },
    { title: "Affiliate Suite", content: "Maximize earnings with AI optimization.", cta: "Get Started" }
];

const DevStudio: React.FC = () => {
    const [files, setFiles] = useState<{ [key: string]: string }>(DEFAULT_CODE);
    const [activeFile, setActiveFile] = useState('index.html');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [borderFree, setBorderFree] = useState(false);
    const [previewSrc, setPreviewSrc] = useState('');
    const [notification, setNotification] = useState<string | null>(null);
    const [adIndex, setAdIndex] = useState(0);

    // Stats
    const lineCount = files[activeFile]?.split('\n').length || 0;
    const fileSize = (new Blob([files[activeFile] || '']).size / 1024).toFixed(2);

    // Auto-save simulation
    useEffect(() => {
        const interval = setInterval(() => {
            // In a real app, save to localStorage here
            // console.log('Auto-saving...');
        }, 30000);
        return () => clearInterval(interval);
    }, [files]);

    // Rotate Ads
    useEffect(() => {
        const interval = setInterval(() => {
            setAdIndex(prev => (prev + 1) % ADS.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Update Preview
    useEffect(() => {
        const updatePreview = () => {
            const html = files['index.html'] || '';
            const css = files['style.css'] || '';
            const js = files['script.js'] || '';
            
            // Simple preview generation strategy: inject CSS/JS into HTML
            // Note: For a robust editor, you'd want to parse and inject properly.
            // Since the default index.html has inline styles for simplicity in this demo,
            // we will just serve the HTML content directly for now.
            
            // To make it fully functional with separate files, we would construct a blob:
            const combinedSource = `
                ${html}
                <script>${js}<\/script>
            `;
            
            setPreviewSrc(combinedSource);
        };
        
        // Debounce preview updates
        const timeout = setTimeout(updatePreview, 800);
        return () => clearTimeout(timeout);
    }, [files]);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFiles({ ...files, [activeFile]: e.target.value });
    };

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleRun = () => {
        showNotification('Code executed! Preview updated.');
        // Trigger immediate preview update logic if needed
    };

    const handleSave = () => {
        showNotification('Project saved successfully!');
    };

    const createNewFile = () => {
        const name = prompt("File name (e.g., about.html)");
        if (name && !files[name]) {
            setFiles({ ...files, [name]: '<!-- New File -->' });
            setActiveFile(name);
        }
    };

    return (
        <div className={`flex flex-col h-[calc(100vh-64px)] bg-[#1a1a2e] text-[#f8f9fa] overflow-hidden font-sans transition-all ${borderFree ? 'border-none' : ''}`}>
            
            {/* Header */}
            <header className="h-[60px] bg-[#1a1a2e]/95 flex items-center justify-between px-5 border-b border-[#4361ee]/30 backdrop-blur-md z-10">
                <div className="flex items-center gap-3 font-bold text-xl text-[#4cc9f0]">
                    <i className="fas fa-robot text-[#4361ee]"></i>
                    <span>AI Dev Studio</span>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="px-4 py-2 rounded bg-[#4361ee]/10 text-[#4361ee] border border-[#4361ee]/30 hover:translate-y-[-2px] transition-all flex items-center gap-2">
                        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i> <span className="hidden sm:inline">Files</span>
                    </button>
                    <button onClick={() => setBorderFree(!borderFree)} className="px-4 py-2 rounded bg-[#4361ee]/10 text-[#4361ee] border border-[#4361ee]/30 hover:translate-y-[-2px] transition-all flex items-center gap-2">
                        <i className={`fas ${borderFree ? 'fa-border-all' : 'fa-border-none'}`}></i> <span className="hidden sm:inline">Border-Free</span>
                    </button>
                    <button onClick={handleRun} className="px-4 py-2 rounded bg-[#4361ee] text-white hover:translate-y-[-2px] transition-all flex items-center gap-2 font-bold shadow-lg">
                        <i className="fas fa-play"></i> <span className="hidden sm:inline">Run</span>
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 rounded bg-[#4361ee] text-white hover:translate-y-[-2px] transition-all flex items-center gap-2 font-bold shadow-lg">
                        <i className="fas fa-save"></i> <span className="hidden sm:inline">Save</span>
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-[280px]' : 'w-0'} bg-[#1a1a2e]/90 border-r border-[#4361ee]/20 transition-all duration-300 flex flex-col overflow-y-auto shrink-0`}>
                    <div className="p-5">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs uppercase text-[#4cc9f0] tracking-wider font-bold">Project Files</h3>
                            <button onClick={createNewFile} className="text-[#4361ee] hover:text-white"><i className="fas fa-plus"></i></button>
                        </div>
                        <ul className="space-y-1">
                            {Object.keys(files).map(file => (
                                <li 
                                    key={file} 
                                    onClick={() => setActiveFile(file)}
                                    className={`px-3 py-2 rounded cursor-pointer flex items-center gap-3 text-sm transition-colors ${activeFile === file ? 'bg-[#4361ee]/20 border-l-2 border-[#4361ee]' : 'hover:bg-[#4361ee]/10'}`}
                                >
                                    <i className={`fab ${file.endsWith('html') ? 'fa-html5 text-orange-500' : file.endsWith('css') ? 'fa-css3-alt text-blue-500' : 'fa-js-square text-yellow-400'}`}></i>
                                    <span>{file}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-5 border-t border-[#4361ee]/10">
                        <h3 className="text-xs uppercase text-[#4cc9f0] tracking-wider font-bold mb-3">Templates</h3>
                        <ul className="space-y-1 text-sm text-gray-400">
                            <li className="px-3 py-2 hover:bg-[#4361ee]/10 rounded cursor-pointer flex items-center gap-3"><i className="fas fa-rocket"></i> Landing Page</li>
                            <li className="px-3 py-2 hover:bg-[#4361ee]/10 rounded cursor-pointer flex items-center gap-3"><i className="fas fa-briefcase"></i> Portfolio</li>
                            <li className="px-3 py-2 hover:bg-[#4361ee]/10 rounded cursor-pointer flex items-center gap-3"><i className="fas fa-chart-bar"></i> Dashboard</li>
                        </ul>
                    </div>

                    <div className="p-5 mt-auto border-t border-[#4361ee]/10">
                        <h3 className="text-xs uppercase text-[#4cc9f0] tracking-wider font-bold mb-3">AI Powerful World</h3>
                        <div className="bg-gradient-to-br from-[#4361ee]/10 to-[#3a0ca3]/10 p-3 rounded border-l-2 border-[#4361ee]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-[#4cc9f0] text-sm">{ADS[adIndex].title}</span>
                                <i className="fas fa-bolt text-yellow-400 text-xs"></i>
                            </div>
                            <p className="text-xs text-gray-300 mb-2">{ADS[adIndex].content}</p>
                            <span className="inline-block bg-[#4361ee] text-white text-[10px] px-2 py-1 rounded cursor-pointer">{ADS[adIndex].cta}</span>
                        </div>
                    </div>
                </aside>

                {/* Editor Area */}
                <main className="flex-1 flex flex-col overflow-hidden min-w-0">
                    {/* Tabs */}
                    <div className="flex bg-[#1a1a2e]/80 border-b border-[#4361ee]/20 overflow-x-auto">
                        {Object.keys(files).map(file => (
                            <div 
                                key={file}
                                onClick={() => setActiveFile(file)}
                                className={`px-5 py-3 cursor-pointer text-sm whitespace-nowrap flex items-center gap-2 border-r border-[#4361ee]/10 transition-colors ${activeFile === file ? 'bg-[#1a1a2e] border-b-2 border-[#4361ee]' : 'hover:bg-[#4361ee]/10'}`}
                            >
                                <i className={`fab ${file.endsWith('html') ? 'fa-html5' : file.endsWith('css') ? 'fa-css3-alt' : 'fa-js-square'}`}></i>
                                {file}
                                <span className="text-xs opacity-50 hover:opacity-100 ml-2">&times;</span>
                            </div>
                        ))}
                    </div>

                    {/* Split View */}
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        {/* Code Editor */}
                        <div className="flex-1 flex flex-col border-r border-[#4361ee]/10 min-h-[300px]">
                            <div className="px-4 py-2 bg-[#1a1a2e]/70 text-xs text-gray-400 flex justify-between items-center">
                                <span><i className="fas fa-code mr-1"></i> Editor</span>
                                <span className="text-[#4cc9f0]"><i className="fas fa-sync-alt"></i> Auto-save: ON</span>
                            </div>
                            <textarea 
                                value={files[activeFile]}
                                onChange={handleCodeChange}
                                spellCheck={false}
                                className="flex-1 bg-[#0a0a14]/90 text-gray-300 p-4 resize-none outline-none font-mono text-sm leading-relaxed border-none focus:bg-[#05050f] transition-colors"
                            />
                        </div>

                        {/* Preview */}
                        <div className="flex-1 flex flex-col min-h-[300px] bg-white">
                            <div className="px-4 py-2 bg-[#1a1a2e] text-xs text-gray-400 flex justify-between items-center border-b border-[#4361ee]/20">
                                <span><i className="fas fa-eye mr-1"></i> Live Preview</span>
                                <div className="flex gap-2">
                                    <button className="hover:text-white" onClick={() => setFiles({...files})}><i className="fas fa-redo"></i></button>
                                </div>
                            </div>
                            <div className="flex-1 relative bg-white">
                                <iframe 
                                    srcDoc={previewSrc}
                                    title="preview"
                                    className="w-full h-full border-none absolute inset-0"
                                    sandbox="allow-scripts"
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="h-[40px] bg-[#1a1a2e] border-t border-[#4361ee]/20 flex items-center justify-between px-5 text-xs text-gray-500 shrink-0">
                <div className="flex gap-4">
                    <span><i className="fas fa-code mr-1"></i> Lines: {lineCount}</span>
                    <span><i className="fas fa-memory mr-1"></i> Size: {fileSize} KB</span>
                    <span><i className="fas fa-clock mr-1"></i> Saved: Just now</span>
                </div>
                <div>
                    <span>AI Dev Studio v1.0</span>
                </div>
            </footer>

            {/* Notification */}
            {notification && (
                <div className="fixed bottom-16 right-5 bg-[#4361ee] text-white px-5 py-3 rounded shadow-lg animate-fade-in flex items-center gap-2 z-50">
                    <i className="fas fa-check-circle"></i>
                    <span>{notification}</span>
                </div>
            )}
        </div>
    );
};

export default DevStudio;