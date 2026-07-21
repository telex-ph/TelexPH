
import { useRouter } from "next/navigation";
function AIBuilderFunnel() {
  const router = useRouter();
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {
    /* Funnel Header */
  }
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
    onClick={() => router.back()}
    className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm"
  >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {
    /* Funnel Content */
  }
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Builder Free Audit
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your business with cutting-edge AI solutions
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800">
              <strong>What you'll get:</strong> Complete AI implementation strategy, ROI analysis, and personalized roadmap
            </p>
          </div>
        </div>

        {
    /* Audit Form */
  }
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Get Your Free AI Audit</h2>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
    type="text"
    required
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="John"
  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
    type="text"
    required
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Doe"
  />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Email *
              </label>
              <input
    type="email"
    required
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="john@company.com"
  />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
    type="text"
    required
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Acme Corporation"
  />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What AI solutions are you interested in?
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select an option</option>
                <option value="automation">Process Automation</option>
                <option value="chatbots">Customer Service Chatbots</option>
                <option value="analytics">Predictive Analytics</option>
                <option value="content">AI Content Generation</option>
                <option value="custom">Custom AI Solutions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Challenges (Optional)
              </label>
              <textarea
    rows={4}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Tell us about your current business challenges..."
  />
            </div>

            <button
    type="submit"
    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
  >
              Get My Free AI Audit
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>No credit card required. Free audit with no obligations.</p>
          </div>
        </div>

        {
    /* Benefits Section */
  }
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Expert Analysis</h3>
            <p className="text-gray-600">Get insights from AI specialists with years of experience</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Quick Results</h3>
            <p className="text-gray-600">Receive your comprehensive audit within 48 hours</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">ROI Focused</h3>
            <p className="text-gray-600">Actionable insights with clear return on investment projections</p>
          </div>
        </div>
      </div>
    </div>;
}
export {
  AIBuilderFunnel as default
};
