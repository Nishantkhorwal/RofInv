import { useState, useEffect } from "react"
import WelcomeLetterForm from "../components/WelcomeForm"
import WelcomeLetterPreview from "../components/WelcomeLetter"
import SentLettersHistory from "../components/WelcomeLetterHistory"

export default function Home() {
  const [formData, setFormData] = useState({
    title : "",
    name: "",
    email: "",
    number: "",
    unitNumber: "",
  })

  const [sentLetters, setSentLetters] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("preview")
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFormChange = (updatedData) => {
    setFormData(updatedData)
  }

  const fetchLetters = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/welcome/get`)
      if (!response.ok) {
        throw new Error('Failed to fetch letters')
      }
      const data = await response.json()
      setSentLetters(data.letters)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendLetter = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/welcome/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title : formData.title,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.number,
          unitNumber: formData.unitNumber
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send letter')
      }

      // Refresh the letters list
      await fetchLetters()
      
      // Reset form
      setFormData({
        title : "",
        name: "",
        email: "",
        number: "",
        unitNumber: "",
      })

      alert(`Welcome letter sent to ${formData.email}`)
    } catch (err) {
      setError(err.message)
      alert('Failed to send welcome letter')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch letters on component mount
  useEffect(() => {
    fetchLetters()
  }, [])

  return (
    <div className="min-h-screen bg-green-400 py-5 px-4">
      <div className="">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Welcome Letter Creation Portal</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Form */}
          <div className="w-full md:w-1/2 p-6">
            <WelcomeLetterForm
              formData={formData}
              onFormChange={handleFormChange}
              onSendLetter={handleSendLetter}
              isLoading={isLoading}
            />
          </div>

          {/* Right: Tabs & Content */}
          <div className="w-full md:w-1/2 p-6">
            {/* Tabs */}
            <div className="mb-4 flex">
              <button
                className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                  activeTab === "preview"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("preview")}
              >
                Letter Preview
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                  activeTab === "history"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("history")}
              >
                Sent Letters History
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[500px]">
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : activeTab === "preview" ? (
                <WelcomeLetterPreview formData={formData} />
              ) : (
                <SentLettersHistory sentLetters={sentLetters} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}