import { Center, Spinner } from "@chakra-ui/react"

const Loading = () => {
  return (
    <Center paddingTop={10}>
      <Spinner speed="0.90s" w="20" h="20" color="blue.500" borderWidth={8} />
    </Center>
  )
}

export default Loading