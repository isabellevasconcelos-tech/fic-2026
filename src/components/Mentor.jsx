import { useNavigate } from 'react-router-dom'

export default function Mentor() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/chat')}
      className="fixed bottom-24 right-4 z-[60] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 active:scale-95"
      style={{
        background: 'radial-gradient(circle at 35% 35%, #A02035, #7B1D2A 45%, #5A1420 80%, #3A0E15)',
        boxShadow: '0 0 20px rgba(212,175,55,0.2), 0 0 40px rgba(212,175,55,0.08), 0 4px 12px rgba(0,0,0,0.5)',
      }}
    >
      <span className="text-2xl">🧙</span>
    </button>
  )
}
