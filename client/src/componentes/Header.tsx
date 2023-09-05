import { Button, Flex, Heading } from "@chakra-ui/react"
import { useAppContext } from "../context/context"

const Header = () => {
  const { token, setToken } = useAppContext()
  return (
    <Flex
      as="header"
      h="8vh"
      p={3}
      bgColor="blue.500"
      justify="space-between"
      alignItems="center"
      borderRadius="md"
    >
      <Heading as="h1" size="lg">Note</Heading>
      {token &&
        <Button bgColor="red.300" onClick={() => { localStorage.removeItem("token"); setToken("") }}>Logout</Button>
      }
    </Flex>
  )
}

export default Header