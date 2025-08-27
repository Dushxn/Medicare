import { useState } from "react";
import axios from "axios";
import {
  Activity,
  Heart,
  User,
  Zap,
  TrendingUp,
  Clock,
  Scale,
  Droplets,
  Brain,
  Stethoscope,
  AlertTriangle,
} from "lucide-react";
import ResultModal from "./ResultModal";

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const parsedData = {
        Pregnancies: Number.parseInt(formData.Pregnancies),
        Glucose: Number.parseFloat(formData.Glucose),
        BloodPressure: Number.parseFloat(formData.BloodPressure),
        SkinThickness: Number.parseFloat(formData.SkinThickness),
        Insulin: Number.parseFloat(formData.Insulin),
        BMI: Number.parseFloat(formData.BMI),
        DiabetesPedigreeFunction: Number.parseFloat(
          formData.DiabetesPedigreeFunction
        ),
        Age: Number.parseInt(formData.Age),
      };

      const bmiAge = parsedData.BMI * parsedData.Age;
      const glucoseInsulin =
        parsedData.Insulin > 0
          ? parsedData.Glucose / parsedData.Insulin + 1
          : 0;
      const payload = {
        ...parsedData,
        BMI_Age: bmiAge,
        Glucose_Insulin: glucoseInsulin,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        payload
      );
      setResult(response.data);
    } catch (err) {
      setError("Analysis failed. Please verify your inputs and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    {
      name: "Pregnancies",
      icon: User,
      type: "number",
      label: "Pregnancies",
      description: "Number of pregnancies",
    },
    {
      name: "Glucose",
      icon: Droplets,
      type: "number",
      step: "0.1",
      label: "Glucose Level",
      description: "Plasma glucose (mg/dL)",
    },
    {
      name: "BloodPressure",
      icon: Heart,
      type: "number",
      step: "0.1",
      label: "Blood Pressure",
      description: "Diastolic pressure (mm Hg)",
    },
    {
      name: "SkinThickness",
      icon: Activity,
      type: "number",
      step: "0.1",
      label: "Skin Thickness",
      description: "Triceps fold (mm)",
    },
    {
      name: "Insulin",
      icon: Zap,
      type: "number",
      step: "0.1",
      label: "Insulin Level",
      description: "2-Hour serum insulin (mu U/ml)",
    },
    {
      name: "BMI",
      icon: Scale,
      type: "number",
      step: "0.1",
      label: "Body Mass Index",
      description: "Weight in kg/(height in m)^2",
    },
    {
      name: "DiabetesPedigreeFunction",
      icon: TrendingUp,
      type: "number",
      step: "0.001",
      label: "Pedigree Function",
      description: "Diabetes pedigree function",
    },
    {
      name: "Age",
      icon: Clock,
      type: "number",
      label: "Age",
      description: "Age in years",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">
                AI Diabetes Prediction
              </h1>
              <p className="text-blue-100 flex items-center justify-center space-x-2">
                <Stethoscope className="w-4 h-4" />
                <span>Advanced Machine Learning Analysis</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mt-8">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Health Information Form
              </h2>
              <p className="text-gray-600">
                Please provide accurate health metrics for analysis
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputFields.map((field) => {
                  const IconComponent = field.icon;
                  return (
                    <div key={field.name} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        {field.label}
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        {field.description}
                      </p>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <input
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-gray-50 hover:bg-white"
                          type={field.type}
                          name={field.name}
                          step={field.step}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6">
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing Health Data...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Brain className="w-5 h-5" />
                      <span>Generate AI Prediction</span>
                    </div>
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-2">
            Important Medical Information
          </h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            This AI prediction tool uses machine learning algorithms trained on
            medical data. Results are for educational and informational purposes
            only. Always consult with qualified healthcare professionals for
            medical diagnosis, treatment, and health advice.
          </p>
        </div>
      </div>

      <ResultModal result={result} onClose={() => setResult(null)} />
    </div>
  );
};

export default PredictionForm;
