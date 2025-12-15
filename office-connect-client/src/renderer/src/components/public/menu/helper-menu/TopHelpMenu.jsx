import { useEffect, useRef, useState } from 'react'

const TopHelpMenu = () => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // close on Esc
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Trigger */}
      <div
        onClick={() => {setOpen(prev => !prev); console.log('sss')}}
        className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900"
      >
        Help
      </div>

      {/* Tooltip Menu */}
      {open && (
        <div className="absolute left-3 mt-2 w-40 rounded-lg bg-white shadow-lg border border-slate-200 z-50 animate-fade-in">
          <ul className="py-1 text-sm text-slate-700">
            <li onClick={()=> {window.location.reload()}} className="px-4 py-2 hover:bg-slate-100 cursor-pointer mx-1 rounded-md">
             Refresh
            </li>
           
          </ul>
        </div>
      )}
    </div>
  )
}

export default TopHelpMenu
