import Link from 'next/link'

export default function adminpage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-[#800000] text-2xl font-light uppercase tracking-[0.2em]">central command</h2>
        <p className="text-gray-400 text-xs uppercase tracking-widest">select a module to begin management</p>
      </div>
      <Link href="/admin/dashboard" className="px-10 py-4 bg-[#800000] text-white text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-[#600000] transition-all shadow-lg shadow-[#800000]/20">
        enter dashboard
      </Link>
    </div>
  )
}