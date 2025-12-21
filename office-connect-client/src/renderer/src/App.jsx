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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [loading, setLoading] = useState(true)
  const [friendList, setFriendList] = useState([])
  const [connection, setConnection] = useState(null)

  const getFriendList = async () => {
    const userId = await window.store.get('userId')

    if (userId) {
      try {
        const res = await axiosPrivate.get(GET_FRIEND_LIST_URL)

        if (res?.data?.success == true) {
          const data = res?.data?.data
          const filteredList = data.filter((item) => item.relation_status === 'FRIEND')

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
      // console.log('Logged In user details')
      // console.table(res?.data?.data)
      if (res?.data?.success == true) {
        const email = res?.data?.data?.email
        const full_name = res?.data?.data?.full_Name
        const pic = res?.data?.data?.profile_Image
        // const username = res?.data?.data?.username
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
      }
    } catch (err) {
      if (err?.code == 'ERR_BAD_REQUEST') {
        toast.error('Session expired, please login again')
      } else {
        toast.error('Not able to login')
      }
      console.error('not able to login', err)
      setIsLoggedIn(false)
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
      <ChatProvider
        connection={connection}
        getFriendList={getFriendList}
        restoreSession={restoreSession}
      >
        {loading ? (
          <section>
            <div className="min-h-screen w-full flex items-center justify-center">
              <div class="loader"></div>
            </div>
          </section>
        ) : (
          <Home
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setShowLogin={setShowLogin}
            friendList={friendList}
            getFriendList={getFriendList}
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
