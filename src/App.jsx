import Layout from "./components/Layout"
import Hero from "./components/Hero"
import CoffeeForm from "./components/CoffeeForm"
import Stats from "./components/Stats"
import History from "./components/History"
import { useAuth } from "./Context/authContext"

function App() {
  const {globalUser, globalData, isLoading} = useAuth()
  const isAuthenticated = globalUser
  const isData = globalData && !!Object.keys(globalData || {}).length

  const authenticatedContent = (
    <>
      <Stats />
      <History />
    </>
  )


  return (
    <Layout>
      <Hero />
      <CoffeeForm isAuthenticated={isAuthenticated} />
      {(isLoading && isAuthenticated) && (<p>Loading Data...</p>)}
      {(isAuthenticated && isData) && (authenticatedContent)}
    </Layout>
  )
}

export default App
