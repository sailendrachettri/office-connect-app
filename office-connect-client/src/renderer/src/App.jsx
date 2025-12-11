import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <h1 class="text-3xl font-bold underline">
    Hello world!ff
  </h1>

  <div className='text-pink-500 text-3xl font-bold list-disc'>one</div>
  <span className='text-red-300'>*</span>
    </>
  )
}

export default App
