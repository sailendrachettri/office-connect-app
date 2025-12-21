import { useEffect, useState } from 'react'
import Home from './components/public/home/Home'
import { GET_FRIEND_LIST_URL, ME_URL } from './api/routes_urls'
import { axiosPrivate } from './api/api'
import { createChatConnection } from './signalr/chatConnection'
import { store } from './store'
import { setConnected, setDisconnected } from './store/connectionSlice'
import toast from 'react-hot-toast'
import LoginUser from './components/common/LoginUser'
import UserRegister from './components/common/UserRegister'
import { ChatProvider } from './context/ChatContext'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import TopHelpMenu from './components/public/menu/helper-menu/TopHelpMenu'

let shown = false

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [loading, setLoading] = useState(true)
  const [friendList, setFriendList] = useState([])
  const [connection, setConnection] = useState(null)
  const [pendingFriendReq, setPendingFriendReq] = useState(null)

  const isConnected = useSelector((state) => state.connection.isConnected)

  const getFriendList = async () => {
    const userId = await window.store.get('userId')

    if (userId) {
      try {
        const res = await axiosPrivate.get(GET_FRIEND_LIST_URL)

        if (res?.data?.success == true) {
          const data = res?.data?.data
          const filteredList = data.filter((item) => item.relation_status === 'FRIEND')

          const countPendingFriendReq = data?.filter(
            (item) => item.relation_status === 'PENDING_RECEIVED'
          ).length
          setPendingFriendReq(countPendingFriendReq || null)
          setFriendList(filteredList || [])
        }
      } catch (error) {
        console.error('not able to get the friend list', error)
      }
    }
  }

  const restoreSession = async () => {
    try {
      const res = await axiosPrivate.get(ME_URL)

      if (res?.data?.success == true) {
        const email = res?.data?.data?.email
        const full_name = res?.data?.data?.full_Name
        const pic = res?.data?.data?.profile_Image

        const user_Id = res?.data?.data?.user_Id

        await window.store.set('userId', user_Id)
        await window.store.set('user', {
          user_Id,
          full_name,
          email,
          pic
        })

        setIsLoggedIn(true)

        const connection = createChatConnection(user_Id)
        setConnection(connection)
        connection
          .start()
          .then(() => {
            store.dispatch(setConnected('signalr'))
          })
          .catch(() => {
            store.dispatch(setDisconnected())
          })
      } else {
        toast.error(res?.data?.message || 'Something went wrong!')
        setLoading(false);
        setShowLogin(false);
      }
    } catch (err) {
      if (!shown) {
        if (err?.code == 'ERR_BAD_REQUEST') {
          toast.error('Session expired, please login again')
        } else {
          toast.error('Not able to login')
        }
        console.error('not able to login', err)
        setIsLoggedIn(false)

        shown = true
      }
       setLoading(false);
        setShowLogin(false);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    restoreSession()
  }, [])

  useState(() => {
    getFriendList()
  }, [loading])

  return (
    <>
      <div className="w-full h-7 bg-slate-200 text-slate-700 flex items-center px-6 select-none drag-region">
        <div className="flex items-center justify-start gap-x-3 no-drag">
          {isLoggedIn && (
            <div
              className={`${isConnected ? 'text-green-500' : 'text-red-400'} flex items-center justify-center gap-x-1`}
            >
              <IoChatbubblesOutline />
              <small>{isConnected ? 'Connected' : 'Disconnected'}</small>
            </div>
          )}
          <TopHelpMenu />
        </div>

        <div className="ml-auto flex gap-3 no-drag">
          <button
            onClick={() => window.api.minimize()}
            className="px-3 cursor-pointer hover:bg-slate-50 rounded-sm"
          >
            —
          </button>
          <button
            onClick={() => window.api.maximize()}
            className="px-3 cursor-pointer hover:bg-slate-50 rounded-sm"
          >
            ▢
          </button>
          <button
            onClick={() => window.api.close()}
            className="px-3 hover:bg-red-600 hover:text-slate-300 cursor-pointer rounded-sm"
          >
            ✕
          </button>
        </div>
      </div>

      <ChatProvider
        connection={connection}
        getFriendList={getFriendList}
        restoreSession={restoreSession}
      >
        {loading ? (
          <section>
            <div className="min-h-screen w-full flex items-center justify-center">
              <div className="loader"></div>
            </div>
          </section>
        ) : (
          <Home
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setShowLogin={setShowLogin}
            friendList={friendList}
            getFriendList={getFriendList}
            pendingFriendReq={pendingFriendReq}
          />
        )}

        <>
          {!isLoggedIn && (
            <>
              {showLogin ? (
                <LoginUser setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />
              ) : (
                <UserRegister setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />
              )}
            </>
          )}
        </>
      </ChatProvider>
    </>
  )
}

export default App
