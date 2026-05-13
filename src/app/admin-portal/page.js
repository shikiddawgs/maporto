"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Lock, Upload, LogOut, CheckCircle, Trash2, Edit3, MessageSquare, LayoutGrid, Mail, Clock, Film, Loader2, X, Link2 } from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";
import Link from "next/link";
import { uploadFile } from "@/app/actions/upload";

export default function AdminPortal() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("upload");

  // Upload form
  const [projectType, setProjectType] = useState("video"); // 'video' or 'image'
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("GFX Design");
  const [description, setDescription] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  
  // Thumbnail
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState("");
  const thumbInputRef = useRef(null);

  // Projects list
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Messages
  const [messages, setMessages] = useState([]);

  // Socials
  const [socials, setSocials] = useState([]);
  const [savingSocial, setSavingSocial] = useState(null);

  useEffect(() => {
    fetch("/api/auth-check")
      .then(r => {
        if (!r.ok) throw new Error("Auth check failed");
        return r.json();
      })
      .then(d => { 
        setAuthenticated(d.authenticated); 
        setChecking(false); 
      })
      .catch(err => {
        console.error(err);
        setAuthenticated(false);
        setChecking(false);
      });
  }, []);

  useEffect(() => {
    if (authenticated) { fetchProjects(); fetchMessages(); fetchSocials(); }
  }, [authenticated]);

  const fetchProjects = () => fetch("/api/videos").then(r => r.json()).then(setProjects);
  const fetchMessages = () => fetch("/api/messages").then(r => r.json()).then(setMessages);
  const fetchSocials = () => fetch("/api/socials").then(r => r.json()).then(setSocials);

  const handleSaveSocial = async (id, href) => {
    setSavingSocial(id);
    await fetch("/api/socials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, href }) });
    await fetchSocials();
    setSavingSocial(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await res.json();
    if (data.success) { setAuthenticated(true); setError(""); } else { setError("Invalid credentials"); }
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;

    if (projectType === "video") {
      const validTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid video file (MP4, WebM, MOV, AVI, MKV)");
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, WebP, GIF)");
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const clearFile = () => {
    if (projectType === "video") {
      setVideoFile(null);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview("");
    } else {
      setImageFile(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleThumbSelect = (file) => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, WebP)");
      return;
    }
    setThumbFile(file);
    const url = URL.createObjectURL(file);
    setThumbPreview(url);
  };

  const clearThumb = () => {
    setThumbFile(null);
    if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    setThumbPreview("");
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  const extractThumbnail = () => {
    const video = document.getElementById("video-preview-player");
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], "extracted-thumbnail.png", { type: "image/png" });
      handleThumbSelect(file);
    }, "image/png");
  };

  // Handle upload — uses Server Action to bypass route handler 1MB body limit
  const handleUpload = async (e) => {
    e.preventDefault();
    const activeFile = projectType === "video" ? videoFile : imageFile;
    if (!activeFile) { alert(`Please select a ${projectType} file`); return; }

    // Client-side size check (100MB max for GitHub push)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (activeFile.size > MAX_SIZE) {
      alert(`File too large! Maximum size is 100MB for auto-deploy.\nYour file is ${(activeFile.size / (1024 * 1024)).toFixed(1)}MB.\n\nTip: Compress the video or use a shorter clip.`);
      return;
    }

    setUploading(true);
    setUploadProgress(`Uploading ${projectType}...`);

    try {
      // Step 1: Upload the main file via Server Action
      const formData = new FormData();
      formData.append("file", activeFile);

      const uploadData = await uploadFile(formData);
      if (uploadData.error) throw new Error(uploadData.error);

      let thumbnailUrl = "";
      // Step 2: Upload thumbnail if provided (only for videos)
      if (projectType === "video" && thumbFile) {
        setUploadProgress("Uploading thumbnail...");
        const thumbData = new FormData();
        thumbData.append("file", thumbFile);
        const tResData = await uploadFile(thumbData);
        if (tResData.success) {
          thumbnailUrl = tResData.url;
        }
      }

      setUploadProgress("Saving project...");

      // Step 3: Create the project entry
      const projectRes = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          description,
          type: projectType,
          url: uploadData.url,
          thumbnailUrl
        })
      });

      if (projectRes.ok) {
        setSuccessMsg(`${projectType === "video" ? "Video" : "Image"} uploaded & published!`);
        setTitle(""); setDescription(""); clearFile(); clearThumb();
        fetchProjects();
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
    setDeleteConfirm(null); fetchProjects();
  };

  const handleEdit = async (id) => {
    await fetch("/api/videos", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...editData }) });
    setEditingId(null); fetchProjects();
  };

  const handleDeleteMsg = async (id) => {
    await fetch(`/api/messages?id=${id}`, { method: "DELETE" }); fetchMessages();
  };

  const handleMarkRead = async (id) => {
    await fetch("/api/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); fetchMessages();
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (checking) return <div className="min-h-screen bg-mograph-theme flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-primary rounded-full animate-spin border-t-transparent" /></div>;

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-mograph-theme text-slate-800 p-6 relative overflow-hidden">
        <FloatingOrbs />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-auto glass rounded-3xl p-10 shadow-2xl relative z-10">
          <div className="flex justify-center mb-6"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200"><Lock className="w-8 h-8 text-accent-primary" /></div></div>
          <h1 className="text-3xl font-black gradient-text text-center mb-2" style={{ fontFamily: "var(--font-outfit)" }}>Admin Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm text-center mb-8">Manage your cinematic portfolio</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Access Code" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-300 focus:outline-none focus:border-accent-primary text-center tracking-widest shadow-sm" />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" className="btn-mograph w-full">Authenticate</button>
            <div className="text-center mt-4"><Link href="/" className="text-sm text-slate-400 hover:text-accent-primary transition-colors">Return to public site</Link></div>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mograph-theme relative text-slate-800 pb-20">
      <FloatingOrbs />
      <nav className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-slate-800">Admin<span className="text-accent-primary">Dashboard</span></span>
            <span className="px-2 py-1 bg-green-500/10 text-green-600 text-[10px] rounded-full border border-green-500/20 font-bold uppercase tracking-wider">Online</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-slate-500 hover:text-accent-primary font-medium transition-colors">View Site</Link>
            <button 
              onClick={async () => { 
                await fetch("/api/auth", { method: "DELETE" });
                window.location.reload(); 
              }} 
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" /> Disconnect
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="container mx-auto px-6 pt-8 relative z-10">
        <div className="flex gap-2 mb-8 max-w-4xl mx-auto">
          {[
            { id: "upload", icon: Upload, label: "Upload Work" },
            { id: "projects", icon: LayoutGrid, label: `My Projects (${projects.length})` }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all relative ${tab === t.id ? "bg-accent-primary text-white shadow-lg" : "bg-white/60 text-slate-500 hover:text-slate-800 hover:bg-white border border-black/5"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
              {t.badge > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-primary rounded-full text-white text-[10px] flex items-center justify-center shadow-lg border-2 border-white">{t.badge}</span>}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* UPLOAD TAB */}
          {tab === "upload" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl glass bg-white shadow-sm">
              <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200"><Film className="w-6 h-6 text-accent-primary" /></div>
                  <div><h2 className="text-2xl font-bold text-slate-800">Upload New Project</h2><p className="text-slate-500 text-sm">Upload a video or image — stored on CDN</p></div>
                </div>
                
                {/* Type Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-black/5">
                  <button onClick={() => { setProjectType("video"); clearFile(); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${projectType === "video" ? "bg-accent-primary text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>VIDEO</button>
                  <button onClick={() => { setProjectType("image"); clearFile(); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${projectType === "image" ? "bg-accent-primary text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>IMAGE</button>
                </div>
              </div>

              {successMsg && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 font-medium"><CheckCircle className="w-5 h-5" />{successMsg}</div>}

              <form onSubmit={handleUpload} className="space-y-6">
                {/* Drag & Drop Zone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">{projectType === "video" ? "Video File" : "Image / Banner File"}</label>
                  {!(projectType === "video" ? videoFile : imageFile) ? (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragOver ? "border-accent-primary bg-slate-50" : "border-slate-200 hover:border-accent-primary bg-slate-50/50"}`}
                    >
                      <Upload className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                      <p className="text-slate-800 font-semibold">Drag & drop your {projectType} here</p>
                      <p className="text-slate-400 text-sm mt-1">or click to browse files</p>
                      <p className="text-slate-300 text-xs mt-3 font-medium">{projectType === "video" ? "MP4, WebM, MOV supported" : "JPEG, PNG, WebP, GIF supported"}</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={projectType === "video" ? "video/*" : "image/*"}
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-sm">
                      <div className="relative aspect-video bg-black/20 flex items-center justify-center overflow-hidden">
                        {projectType === "video" ? (
                          <video id="video-preview-player" src={videoPreview} className="w-full h-full object-contain" controls muted />
                        ) : (
                          <img src={imagePreview} className="w-full h-full object-contain" alt="Preview" />
                        )}
                        <button
                          type="button"
                          onClick={clearFile}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 shadow-md border border-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between border-t border-black/5 bg-slate-50">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Film className="w-4 h-4 text-accent-primary shrink-0" />
                          <span className="text-sm text-slate-700 font-medium truncate">{(projectType === "video" ? videoFile : imageFile).name}</span>
                          <span className="text-xs text-slate-400 shrink-0 font-medium">{( (projectType === "video" ? videoFile : imageFile).size / (1024 * 1024)).toFixed(1)} MB</span>
                        </div>
                        {projectType === "video" && (
                          <button type="button" onClick={extractThumbnail} className="shrink-0 text-[10px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-black/5">
                            Extract Cover
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail Zone (Video Only) */}
                {projectType === "video" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Video Thumbnail (Optional)</label>
                    {!thumbFile ? (
                      <div
                        onClick={() => thumbInputRef.current?.click()}
                        className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all border-slate-200 hover:border-accent-primary bg-slate-50/50"
                      >
                        <Upload className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                        <p className="text-slate-800 text-sm font-semibold">Add Thumbnail Image</p>
                        <p className="text-slate-400 text-xs mt-1 font-medium">JPEG, PNG, WebP supported</p>
                        <input
                          ref={thumbInputRef}
                          type="file"
                          accept="image/jpeg, image/png, image/webp"
                          onChange={(e) => handleThumbSelect(e.target.files[0])}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-sm">
                        <div className="relative aspect-video bg-black/20">
                          <img src={thumbPreview} className="w-full h-full object-cover" alt="Thumbnail" />
                          <button
                            type="button"
                            onClick={clearThumb}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 shadow-md border border-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="px-4 py-3 flex items-center gap-3 border-t border-black/5 bg-slate-50">
                          <Film className="w-4 h-4 text-accent-primary shrink-0" />
                          <span className="text-sm text-slate-700 font-medium truncate">{thumbFile.name}</span>
                          <span className="text-xs text-slate-400 shrink-0 font-medium">{(thumbFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Project Title</label>
                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-accent-primary shadow-sm" placeholder="e.g. Cyberpunk Edit 2024" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-accent-primary shadow-sm font-medium">
                      <option value="GFX Design">GFX Design</option>
                      <option value="AMV">AMV</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <p className="text-xs text-slate-500 pb-3 font-medium">Video will be uploaded and hosted locally on your server.</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Description</label>
                    <textarea required rows="3" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-accent-primary resize-none shadow-sm" placeholder="Tools used, project scope..." />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading || (projectType === "video" ? !videoFile : !imageFile)}
                  className="btn-mograph w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />{uploadProgress}</>
                  ) : (
                    <><Upload className="w-5 h-5" />Upload & Publish</>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* PROJECTS TAB */}
          {tab === "projects" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {projects.length === 0 ? (
                <div className="p-12 rounded-3xl text-center text-slate-500" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(106,76,255,0.15)", backdropFilter: "blur(20px)" }}>No projects yet.</div>
              ) : projects.map(p => (
                <div key={p.id} className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm transition-all hover:shadow-md" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(106,76,255,0.15)", backdropFilter: "blur(20px)" }}>
                  <div className="w-full sm:w-32 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-black/5">
                    {p.type === "video" ? <video src={p.url} className="w-full h-full object-cover" muted preload="metadata" /> : p.type === "image" ? <img src={p.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-50 flex items-center justify-center text-xs text-slate-400 font-medium">Embed</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingId === p.id ? (
                      <div className="space-y-2">
                        <input value={editData.title} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-primary shadow-sm text-slate-800" />
                        <input value={editData.description} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-primary shadow-sm text-slate-800" />
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(p.id)} className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold shadow-sm">Save</button>
                          <button onClick={() => setEditingId(null)} className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-800 truncate">{p.title}</h3>
                          <span className="px-2.5 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wide bg-slate-100 text-slate-700 border border-slate-200">{p.category}</span>
                        </div>
                        <p className="text-sm text-slate-500 truncate font-medium">{p.description}</p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">{p.type} • {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</p>
                      </>
                    )}
                  </div>
                  {editingId !== p.id && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => { setEditingId(p.id); setEditData({ title: p.title, description: p.description }); }} className="p-2 bg-white border border-black/5 shadow-sm hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-colors" title="Edit"><Edit3 className="w-4 h-4 text-slate-600" /></button>
                      {deleteConfirm === p.id ? (
                        <div className="flex gap-1 bg-red-50 p-1 rounded-lg border border-red-100">
                          <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-bold">Delete</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 rounded-md text-xs font-medium border border-slate-200">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(p.id)} className="p-2 bg-white border border-[rgba(106,76,255,0.1)] shadow-sm hover:border-red-200 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* MESSAGES TAB */}
          {tab === "messages" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {messages.length === 0 ? (
                <div className="p-12 rounded-3xl text-center text-slate-500 font-medium" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.05)", backdropFilter: "blur(20px)" }}>No messages yet.</div>
              ) : messages.map(m => (
                <div key={m.id} className={`rounded-2xl p-5 relative shadow-sm transition-all hover:shadow-md ${!m.read ? "border-l-4 border-l-accent-primary" : "border-l-4 border-l-transparent"}`} style={{ background: "rgba(255,255,255,0.8)", borderTop: "1px solid rgba(0,0,0,0.05)", borderRight: "1px solid rgba(0,0,0,0.05)", borderBottom: "1px solid rgba(0,0,0,0.05)", backdropFilter: "blur(20px)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold text-slate-800 ${!m.read ? "text-base" : "text-sm"}`}>{m.name}</h3>
                        {!m.read && <span className="w-2 h-2 bg-accent-primary rounded-full" />}
                      </div>
                      <a href={`mailto:${m.email}`} className="text-xs text-slate-500 hover:underline flex items-center gap-1 font-medium"><Mail className="w-3 h-3" />{m.email}</a>
                      <p className={`mt-3 leading-relaxed ${!m.read ? "text-slate-700 font-medium text-sm" : "text-slate-500 text-sm"}`}>{m.message}</p>
                      <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1 font-semibold uppercase tracking-wider"><Clock className="w-3 h-3" />{new Date(m.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 shrink-0 flex-col sm:flex-row">
                      {!m.read && <button onClick={() => handleMarkRead(m.id)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-sm transition-colors">Mark Read</button>}
                      <button onClick={() => handleDeleteMsg(m.id)} className="p-2 bg-white border border-red-100 shadow-sm hover:border-red-300 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          {/* SOCIALS TAB */}
          {tab === "socials" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl glass bg-white shadow-sm">
              <div className="flex items-center gap-4 mb-8 border-b border-black/5 pb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200"><Link2 className="w-6 h-6 text-accent-primary" /></div>
                <div><h2 className="text-2xl font-bold text-slate-800">Social Links</h2><p className="text-slate-500 text-sm">Update your social media URLs</p></div>
              </div>
              <div className="space-y-4">
                {socials.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 p-4 rounded-2xl border border-black/5 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-black/5 shadow-sm flex-shrink-0">
                      <span className="text-sm font-black text-slate-700 uppercase">{s.label.slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">{s.label}</p>
                      <input
                        type="url"
                        defaultValue={s.href}
                        onBlur={(e) => {
                          if (e.target.value !== s.href) handleSaveSocial(s.id, e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { e.target.blur(); }
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-accent-primary shadow-sm font-medium"
                        placeholder={`https://...`}
                      />
                    </div>
                    {savingSocial === s.id && <Loader2 className="w-4 h-4 text-accent-primary animate-spin flex-shrink-0" />}
                    {savingSocial !== s.id && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 opacity-50" />}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-6 text-center font-medium">Changes auto-save when you click away or press Enter</p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
