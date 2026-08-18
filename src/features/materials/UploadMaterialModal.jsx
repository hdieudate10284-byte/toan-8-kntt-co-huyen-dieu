import React, { useState } from 'react';
import { Upload, FileText, Video, Gamepad2, Link as LinkIcon, Plus } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { uploadToStorage, supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const UploadMaterialModal = ({
  isOpen,
  onClose,
  onMaterialCreated
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chapter, setChapter] = useState('1');
  const [lessonNumber, setLessonNumber] = useState('1');
  const [lessonName, setLessonName] = useState('Bài 1: Đơn thức');
  const [type, setType] = useState('document'); // document, video, game_iframe, game_html5
  const [file, setFile] = useState(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('Toán 8, KNTT');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const LESSON_OPTIONS = {
    '1': [
      { num: 1, name: 'Bài 1: Đơn thức' },
      { num: 2, name: 'Bài 2: Đa thức' },
      { num: 3, name: 'Bài 3: Phép cộng và phép trừ đa thức' },
      { num: 4, name: 'Bài 4: Phép nhân đa thức' },
      { num: 5, name: 'Bài 5: Phép chia đa thức cho đơn thức' },
      { num: 0, name: 'Ôn tập cuối chương 1' }
    ],
    '2': [
      { num: 6, name: 'Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu' },
      { num: 7, name: 'Bài 7: Lập phương của một tổng. Lập phương của một hiệu' },
      { num: 8, name: 'Bài 8: Tổng và hiệu hai lập phương' },
      { num: 9, name: 'Bài 9: Phân tích đa thức thành nhân tử' },
      { num: 0, name: 'Ôn tập cuối chương 2' }
    ]
  };

  const handleChapterChange = (newCh) => {
    setChapter(newCh);
    const firstLesson = LESSON_OPTIONS[newCh][0];
    setLessonNumber(String(firstLesson.num));
    setLessonName(firstLesson.name);
  };

  const handleLessonChange = (newNum) => {
    setLessonNumber(newNum);
    const found = LESSON_OPTIONS[chapter].find((l) => String(l.num) === newNum);
    if (found) setLessonName(found.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Vui lòng nhập Tiêu đề học liệu!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let fileUrl = '';

      // Tải file lên Supabase Storage nếu có
      if (file && isSupabaseConfigured) {
        const bucket = type.startsWith('game') ? 'game-packages' : 'materials';
        const fileExt = file.name.split('.').pop();
        const filePath = `${user?.id || 'public'}/${Date.now()}_${file.name}`;
        fileUrl = await uploadToStorage(bucket, filePath, file);
      }

      const tagsArray = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

      const newMaterialData = {
        title: title.trim(),
        description: description.trim(),
        chapter: parseInt(chapter, 10),
        lesson_number: parseInt(lessonNumber, 10),
        lesson_name: lessonName,
        type: type,
        file_url: fileUrl || (type === 'document' ? 'https://drive.google.com/viewerng/viewer?embedded=true' : ''),
        embed_url: embedUrl.trim(),
        author_id: user?.id,
        is_public: isPublic,
        tags: tagsArray
      };

      let createdMaterial = null;

      if (isSupabaseConfigured && user?.id && !user.id.startsWith('demo-')) {
        try {
          const { data, error: dbError } = await supabase
            .from('materials')
            .insert([newMaterialData])
            .select()
            .single();

          if (!dbError && data) {
            createdMaterial = data;
          }
        } catch (e) {
          console.warn('Lỗi Supabase materials insert, dùng fallback:', e);
        }
      }

      if (!createdMaterial) {
        createdMaterial = {
          ...newMaterialData,
          id: `mat-${Date.now()}`,
          created_at: new Date().toISOString()
        };
      }

      onMaterialCreated(createdMaterial);
      onClose();
      setTitle('');
      setDescription('');
      setEmbedUrl('');
      setFile(null);
    } catch (err) {
      console.error('Lỗi thêm học liệu:', err);
      setError(err.message || 'Không thể tạo học liệu mới.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tải Lên Học Liệu / Trò Chơi Toán 8"
      subtitle="Thêm tài liệu PDF, bài giảng video, nhúng trò chơi Wordwall/Quizizz hoặc game HTML5"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Tiêu đề học liệu / Trò chơi <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ví dụ: Phiếu bài tập tự luyện Bài 1: Đơn thức"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm"
            required
          />
        </div>

        {/* Chapter & Lesson selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Chương học (KNTT)
            </label>
            <select
              value={chapter}
              onChange={(e) => handleChapterChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-sky-500 text-sm"
            >
              <option value="1">Chương 1: Đa thức nhiều biến</option>
              <option value="2">Chương 2: Hằng đẳng thức đáng nhớ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Bài học cụ thể
            </label>
            <select
              value={lessonNumber}
              onChange={(e) => handleLessonChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-sky-500 text-sm"
            >
              {LESSON_OPTIONS[chapter].map((l) => (
                <option key={l.num} value={l.num}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Material Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Định dạng học liệu:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'document', label: 'Tài liệu PDF/Doc', icon: FileText },
              { id: 'video', label: 'Video bài giảng', icon: Video },
              { id: 'game_iframe', label: 'Game Nhúng (Wordwall)', icon: Gamepad2 },
              { id: 'game_html5', label: 'Game HTML5 (.zip)', icon: Upload }
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = type === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input by type */}
        {type === 'game_iframe' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Đường dẫn nhúng iFrame (Wordwall / Quizizz / Kahoot / Geogebra) <span className="text-rose-400">*</span>
            </label>
            <input
              type="url"
              placeholder="https://wordwall.net/embed/..."
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-500"
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tải file lên (PDF, DOCX, PPTX, MP4, .ZIP HTML5):
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-300 hover:file:bg-sky-500/30 cursor-pointer"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Mô tả tóm tắt học liệu
          </label>
          <textarea
            rows="2"
            placeholder="Nêu nội dung trọng tâm hoặc hướng dẫn học sinh..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded text-sky-500 bg-slate-800 border-slate-700 focus:ring-sky-500"
            />
            <span className="text-xs text-slate-300">Công khai cho toàn trường THCS Nguyễn Huệ</span>
          </label>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={loading} icon={Plus}>
              Lưu Học Liệu
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UploadMaterialModal;
