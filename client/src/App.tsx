import { useAppContext } from "./context/context"
import { Container } from "@chakra-ui/react"
import "@fontsource/roboto"

import Header from "./componentes/Header"
import Loading from "./componentes/Loading"
import Auth from "./componentes/Auth"
import Notes from "./componentes/Notes"


const App = () => {
  const { isLoding, token } = useAppContext()

  return (
    <Container fontFamily="roboto" padding={0} >
      <Header />
      {isLoding && <Loading />}
      {
        !token ? <Auth /> : <Notes />
      }
    </Container>
  )
}

export default App