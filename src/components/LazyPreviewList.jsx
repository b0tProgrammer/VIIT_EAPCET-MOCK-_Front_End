import { List, useDynamicRowHeight } from "react-window";
import JoditEditorWrapper from "./JoditEditorWrapper";
import { Trash2, X, Save } from "lucide-react";
import Loader from "../components/Loader";

export default function LazyPreviewList({
  questions,
  onUpdate,
  onDelete,
  onClose,
  onSave,
}) {
  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
        <Loader />
      </div>
    );
  }

  const Row = ({ index, style }) => {
    const q = questions[index];

    return (
      <div
        style={{ ...style, zIndex: 9999 }}
        className="border rounded-md p-4 bg-white shadow-sm"
      >
        <p className="font-semibold mb-2 text-lg">Question {index + 1}</p>

        {/* Full width question editor */}
        <div className="w-full mb-4">
          <JoditEditorWrapper
            value={q.question}
            onChange={(val) => onUpdate(index, "question", val)}
            height={200}
          />
        </div>

        {/* 2 × 2 grid options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["optionA", "optionB", "optionC", "optionD"].map((opt) => {
            const correctOpt = q.answer.replace("Option ", "").trim();
            const thisOpt = opt.charAt(opt.length - 1);

            const isCorrect = correctOpt === thisOpt;

            return (
              <div
                key={opt}
                className={`p-3 border rounded-md bg-gray-50 ${
                  isCorrect ? "border-green-500" : "border-gray-200"
                }`}
              >
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {`Option ${thisOpt}`}
                </label>

                <JoditEditorWrapper
                  value={q[opt]}
                  onChange={(val) => onUpdate(index, opt, val)}
                  height={120}
                />
              </div>
            );
          })}
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(index)}
          className="mt-4 p-2 px-3 bg-red-600 text-white rounded flex items-center gap-2"
        >
          <Trash2 size={16} />
          Delete Question
        </button>
      </div>
    );
  };

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 1000,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] p-4">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Preview & Edit Questions</h2>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-200 transition"
          >
            <X size={22} className="text-red-600" />
          </button>
        </div>

        {/* Scrollable area for list */}
        <div className="flex-1 overflow-y-auto p-4">
          <List
            rowComponent={Row}
            rowCount={questions.length}
            rowHeight={rowHeight}
            rowProps={{ Row }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t flex justify-end items-center space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Close
          </button>

          <button
            onClick={onSave}
            className="px-5 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
