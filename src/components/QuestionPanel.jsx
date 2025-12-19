const QuestionPanel = ({ question, onAnswerSelect, selectedAnswer }) => {

  const HtmlContent = ({ html }) => {
  return (
    <div
      className="prose max-w-none prose-img:max-w-md prose-img:max-h-96 prose-img:h-auto prose-img:w-auto prose-img:object-contain prose-img:rounded-md"
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
};

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Question {question.number}
        </h2>

        {/* Question HTML (with images) */}
        <div className="mb-4 text-gray-700">
          <HtmlContent html={question.text} />
        </div>

        {question.localLanguageText && (
          <div className="mb-4 italic text-gray-600">
            <HtmlContent html={question.localLanguageText} />
          </div>
        )}
      </div>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors
              ${
                selectedAnswer === index
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
          >
            <input
              type="radio"
              name={`question-${question.number}`}
              value={index}
              checked={selectedAnswer === index}
              onChange={() => onAnswerSelect(index)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />

            {/* Option HTML (with images) */}
            <div className="ml-3 text-gray-700">
              <HtmlContent html={option} />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionPanel;
