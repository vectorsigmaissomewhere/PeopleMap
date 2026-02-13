import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTags,
  createTag,
  deleteTag,
  updateTag,
  clearTagsState,
} from '@/store/people/tags-slice';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const COLORS = [
  '#6366F1',
  '#22C55E',
  '#EF4444',
  '#F59E0B',
  '#3B82F6',
  '#A855F7',
  '#EC4899',
  '#10B981',
];

export default function GroupsAndTags() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { tags, isLoading, success, error, message } = useSelector(
    (s) => s.tags
  );

  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState(COLORS[0]);

  // Fetch tags
  useEffect(() => {
    if (user?.id) dispatch(fetchTags(user.id));
  }, [user?.id, dispatch]);

  // Toast handling (IMPORTANT)
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearTagsState());
    }

    if (error) {
      toast.error(error);
      dispatch(clearTagsState());
    }
  }, [success, error, message, dispatch]);

  const submit = () => {
    if (!name.trim()) {
      toast.warning('Tag name is required');
      return;
    }
    dispatch(createTag({ name, colorname: color }));
    setName('');
    setColor(COLORS[0]);
  };

  const startEdit = (tag) => {
    setEditingId(tag.tags_id);
    setEditName(tag.name);
    setEditColor(tag.colorname);
  };

  const saveEdit = (tagId) => {
    if (!editName.trim()) {
      toast.warning('Tag name cannot be empty');
      return;
    }
    dispatch(
      updateTag({
        tagId,
        tagData: { name: editName, colorname: editColor },
      })
    );
    setEditingId(null);
  };

  const removeTag = (tagId) => {
  dispatch(deleteTag(tagId));
};


  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1 text-center">
          Groups & Tags
        </h1>
        <p className="text-gray-500 mb-10 text-center">
          Organize your contacts with color-coded labels
        </p>

        {/* Create Tag */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-medium mb-4 text-gray-900">
            Create Tag
          </h2>

          <div className="flex gap-3 mb-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VIP Client, Follow Up"
              className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={submit}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Plus size={18} /> Add
            </button>
          </div>

          <div className="flex gap-3">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 ${
                  color === c ? 'border-gray-900' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* All Tags */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4 text-gray-900">
            All Tags
          </h2>

          {isLoading && <p className="text-gray-500">Loading…</p>}

          {!isLoading && tags.length === 0 && (
            <p className="text-gray-400">No tags created yet</p>
          )}

          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => {
              const isEditing = editingId === tag.tags_id;

              return (
                <div
                  key={tag.tags_id}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border text-sm"
                  style={{
                    backgroundColor: tag.colorname + '22',
                    borderColor: tag.colorname + '55',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.colorname }}
                  />

                  {isEditing ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded px-2 py-0.5 text-sm"
                    />
                  ) : (
                    <span style={{ color: tag.colorname }}>
                      {tag.name}
                    </span>
                  )}

                  <div className="flex items-center gap-1 ml-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(tag.tags_id)}
                          className="text-green-600"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-400"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(tag)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => removeTag(tag.tags_id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
