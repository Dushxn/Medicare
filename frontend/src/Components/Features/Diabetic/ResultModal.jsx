import { X, CheckCircle, AlertTriangle, Activity } from "lucide-react";

const ResultModal = ({ result, onClose }) => {
  if (!result) {
    return null;
  }

  const isDiabetic = result.prediction === "Diabetic";
  const confidenceScore = Number.parseFloat(result.confidence_score);
  const confidencePercentage = Math.round(confidenceScore);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Prediction Result</h2>
                <p className="text-blue-100 text-sm">AI-Powered Analysis</p>
              </div>
            </div>
            <button
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <div className="mb-6">
              {isDiabetic ? (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              )}
            </div>

            <div
              className={`inline-block px-6 py-3 rounded-full font-bold text-xl shadow-lg ${
                isDiabetic
                  ? "bg-red-50 text-red-700 border-2 border-red-200"
                  : "bg-green-50 text-green-700 border-2 border-green-200"
              }`}
            >
              {result.prediction.toUpperCase()}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-800">
                  Confidence Score
                </span>
                <span className="font-bold text-2xl text-gray-900">
                  {confidencePercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    isDiabetic
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                  style={{ width: `${confidencePercentage}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Risk Level</span>
                <span
                  className={`font-bold text-lg px-3 py-1 rounded-full ${
                    confidenceScore >= 0.8 && isDiabetic
                      ? "bg-red-100 text-red-700"
                      : confidenceScore >= 0.6 && isDiabetic
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {confidenceScore >= 0.8 && isDiabetic
                    ? "HIGH"
                    : confidenceScore >= 0.6 && isDiabetic
                    ? "MODERATE"
                    : "LOW"}
                </span>
              </div>
            </div>
          </div>

          {/* <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-blue-700">Medical Disclaimer:</strong>{" "}
              This AI prediction is for informational purposes only. Please
              consult with a qualified healthcare professional for proper
              medical diagnosis and treatment.
            </p>
          </div> */}

          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Close Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
