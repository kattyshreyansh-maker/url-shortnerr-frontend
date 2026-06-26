import { useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const toastStyle = {
  background: 'rgba(17, 24, 39, 0.92)',
  color: '#fff',
  border: '1px solid rgba(239, 68, 68, 0.35)',
  borderRadius: '14px',
  backdropFilter: 'blur(16px)',
  boxShadow: '0 18px 45px rgba(0, 0, 0, 0.35)',
  fontWeight: 600,
}

function App() {
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setShortUrl('')
    setIsCopied(false)

    try {
      const response = await axios.post(`${API_URL}/shorten`, {
        originalUrl: longUrl,
      })

      setShortUrl(response.data.shortUrl)
      toast.success('Short URL created')
    } catch (error) {
      console.error('Error connecting to backend:', error)

      const message =
        error.response?.data?.message ||
        'Could not shorten the URL. Please try again.'

      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setIsCopied(true)
      toast.success('Short link copied')
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('Could not copy the link')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')",
      }}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: toastStyle,
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="backdrop-blur-xl bg-gray-900/40 px-10 py-10 rounded-3xl shadow-2xl max-w-lg w-full border border-white/10 -mt-24">
        <h1 className="text-4xl font-extrabold text-white text-center mb-2 tracking-wide">
          URL{' '}
          <span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]">
            Shortnerr
          </span>
        </h1>

        <p className="text-gray-300 text-center text-sm mb-8 font-medium">
          Paste your long URL below to make it clean and short.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="url"
            placeholder="Enter your long link here..."
            required
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="w-full px-5 py-4 bg-gray-900/50 text-white rounded-xl border border-white/10 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-400 text-lg"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] flex justify-center items-center gap-2 text-lg
              ${
                isLoading
                  ? 'bg-red-800 text-gray-300 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500 text-white cursor-pointer hover:shadow-[0_0_25px_rgba(239,68,68,0.7)] transform hover:-translate-y-0.5'
              }`}
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 p-5 bg-gray-900/60 rounded-xl border border-red-500/30 backdrop-blur-md animate-fade-in-up">
            <p className="text-gray-300 text-xs mb-3 uppercase tracking-wider font-semibold text-center">
              Your Short Link:
            </p>

            <div className="flex items-center justify-between gap-4 bg-gray-800/50 p-3 rounded-lg border border-white/5">
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:text-red-300 hover:underline text-lg font-bold truncate drop-shadow-md pl-2"
              >
                {shortUrl}
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center justify-center px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 min-w-[110px]
                  ${
                    isCopied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-transparent hover:border-white/20'
                  }`}
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-center items-center gap-6 text-gray-400 text-xs font-medium uppercase tracking-wider">
          <div className="flex items-center gap-1.5">Secure</div>
          <div className="flex items-center gap-1.5">Fast</div>
          <div className="flex items-center gap-1.5">Reliable</div>
        </div>
      </div>
    </div>
  )
}

export default App