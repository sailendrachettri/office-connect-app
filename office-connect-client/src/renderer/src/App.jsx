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
import ConnectionLostImg from './assets/svgs/conn_lost.svg'
import { CgSoftwareDownload } from 'react-icons/cg'

let shown = false

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [loading, setLoading] = useState(true)
  const [friendList, setFriendList] = useState([])
  const [connection, setConnection] = useState(null)
  const [pendingFriendReq, setPendingFriendReq] = useState(null)
  const [friendSearchText, setFriendSearchText] = useState('')
  const [serverAlive, setServerAlive] = useState(true)
  const isConnected = useSelector((state) => state.connection.isConnected)
  const [updateReady, setUpdateReady] = useState(false)

  const getFriendList = async () => {
    const userId = await window.store.get('userId')

    if (userId) {
      try {
        const res = await axiosPrivate.get(GET_FRIEND_LIST_URL, {
          params: {
            searchText: friendSearchText
          }
        })

        if (res?.data?.success == true) {
          const data = res?.data?.data
          const filteredList = data.filter((item) => item.relation_status === 'FRIEND')

          const countPendingFriendReq = data?.filter(
            (item) => item.relation_status === 'PENDING_RECEIVED'
          ).length
          setPendingFriendReq(countPendingFriendReq || null)
          console.log(friendSearchText)
          setFriendList(filteredList || [])

          console.log({ filteredList })
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
        const roleName = res?.data?.data?.roleName
        const roleId = res?.data?.data?.roleId
        const user_Id = res?.data?.data?.user_Id

        await window.store.set('userId', user_Id)
        await window.store.set('user', {
          user_Id,
          full_name,
          email,
          pic,
          roleId,
          roleName
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
        setLoading(false)
        setShowLogin(true)
      }
      setServerAlive(true)
    } catch (err) {
      if (!shown) {
        if (err?.code == 'ERR_BAD_REQUEST') {
          toast.error('Session expired, please login again - here')
        } else if (err?.code == 'ERR_NETWORK') {
          setServerAlive(false)
          // toast.error(
          //   'Unable to connect. Please ensure you are on the same local network as the server.  '
          // )
          return // If the server is not found return from here and do not trigger server alive true
        } else {
          toast.error('Not able to login')
        }
        console.error('not able to login', err)
        setIsLoggedIn(false)
        shown = true
      }
      setServerAlive(true)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      getFriendList(friendSearchText)
    }, 400)

    return () => clearTimeout(timer)
  }, [friendSearchText])

  useEffect(() => {
    restoreSession()
    getFriendList()
  }, [loading])

  useEffect(() => {
    window.electron.onUpdateAvailable(() => {
      toast('Update available. Downloading…')
    })

    window.electron.onUpdateDownloaded(() => {
      toast('Update ready. Restart to apply.')
      setUpdateReady(true)
    })

    window.electron.onUpdateProgress((progress) => {
      console.log(`Update ${Math.round(progress.percent)}%`)
    })
  }, [])

  const restartAndUpdate = () => {
    window.electron.installUpdate()
  }

  return (
    <>
      <div className="w-full h-7 bg-slate-200 text-slate-700 flex items-center px-6 select-none drag-region">
        <div className="flex items-center justify-start gap-x-3 no-drag">
          {isLoggedIn && (
            <div
              className={`${isConnected ? 'text-green-500' : 'text-red-400'} flex items-center justify-center gap-x-1`}
            >
              <IoChatbubblesOutline />
              <small>{isConnected ? 'Connected v1.3.4' : 'Disconnected'}</small>
            </div>
          )}
          {updateReady &&
            <button
              onClick={restartAndUpdate}
              className="ml-3 rounded bg-amber-500 px-2 py-0.5 text-xs text-white hover:bg-amber-600 cursor-pointer"
            >
              <div className='flex items-center justify-start gap-x-1 flex-nowrap'>
                <CgSoftwareDownload size={20} />
                <span> New update available – install now</span>
              </div>
            </button>
          }

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
            <div className="min-h-screen w-full flex items-center justify-center flex-col">
              <div className="loader"></div>
              {serverAlive ? (
                <div className="text-slate-600 italic text-sm pt-3">
                  Setting things up… connecting to the server.
                </div>
              ) : (
                <div className="text-slate-600 italic text-sm pt-3">
                  Reconnecting to the server... Hold tight!
                </div>
              )}
            </div>
          </section>
        ) : (
          <section>
            {serverAlive ? (
              <section>
                <Home
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  setShowLogin={setShowLogin}
                  friendList={friendList}
                  getFriendList={getFriendList}
                  pendingFriendReq={pendingFriendReq}
                  setFriendSearchText={setFriendSearchText}
                  friendSearchText={friendSearchText}
                />

                <>
                  {!isLoggedIn && (
                    <>
                      {showLogin ? (
                        <LoginUser
                          setServerAlive={setServerAlive}
                          setShowLogin={setShowLogin}
                          setIsLoggedIn={setIsLoggedIn}
                        />
                      ) : (
                        <UserRegister setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />
                      )}
                    </>
                  )}
                </>
              </section>
            ) : (
              <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4">
                {/* Illustration */}
                <img
                  src={ConnectionLostImg}
                  alt="Server not found"
                  className="mb-6 h-56 w-auto select-none"
                />

                {/* Heading */}
                <h1 className="text-xl font-semibold text-gray-800">
                  We’re having trouble connecting
                </h1>

                {/* Description */}
                <p className="mt-2 max-w-md text-center text-sm text-gray-500">
                  Looks like the server is unavailable or your network connection was interrupted.
                  Please check your connection and try again.
                </p>

                {/* Action */}
                <button
                  onClick={() => setLoading(true)}
                  className="mt-6 rounded-lg bg-primary/90 px-8 py-2.5 text-sm font-medium text-white
               hover:bg-primary active:scale-95 transition cursor-pointer"
                >
                  Reconnect
                </button>
                {/* Footer hint */}
                <span className="mt-4 text-xs text-gray-400">
                  Office Connect works on LAN / Wi-Fi networks
                </span>
              </div>
            )}
          </section>
        )}
      </ChatProvider>
    </>
  )
}

export default App
