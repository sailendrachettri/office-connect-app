import { useEffect, useRef, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { IoCopyOutline } from 'react-icons/io5'
import {  MdOutlineDeleteOutline } from 'react-icons/md'

const MessageActions = ({ handleCopy, handleMessageDelete }) => {
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

  return (
    <div className="relative" ref={menuRef}>
      {/* Dots */}
      <BiDotsVerticalRounded
        size={16}
        className="cursor-pointer text-slate-500 hover:text-slate-700"
        onClick={() => setOpen((prev) => !prev)}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-md bg-white shadow-lg border border-slate-200 z-50">
          <button
            onClick={() => {
              handleCopy()
              setOpen(false)
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <IoCopyOutline size={16} />
            Copy
          </button>

          <button
            onClick={() => {
              handleMessageDelete()
              setOpen(false)
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <MdOutlineDeleteOutline  size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default MessageActions
