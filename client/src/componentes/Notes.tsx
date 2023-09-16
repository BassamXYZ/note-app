import { Button, ButtonGroup, Card, CardBody, CardFooter, Center, Stack, Text } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useAppContext } from "../context/context"

import NewNote from "./NewNote"
import Note from "./Note"
import { useEffect } from "react"

const Notes = () => {
  const { token, newNote, setNewNote, openNote, setOpenNote, setIsLoding, apiUrl } = useAppContext()
  const query = useQuery('notes', getNotes)
  const queryClient = useQueryClient()
  const mutation = useMutation(deleteNote, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes')
    }
  })

  useEffect(() => {
    setIsLoding(query.isLoading)
  }, [query.isLoading])

  function getNotes() {
    return fetch((apiUrl + '/notes'), {
      headers: {
        "x-access-token": token,
      },
      method: "GET"
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw res
      })
  }

  async function deleteNote(id: number) {
    await fetch((apiUrl + "/notes"), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": token,
      },
      body: `id=${id}`
    })
  }

  if (openNote) {
    return <Note noteId={openNote} />
  }

  if (newNote) {
    return <NewNote />
  }

  return (
    <Stack as="main" spacing={5} paddingTop={5}>
      {
        query.data?.map((note: { id: number, text: string }) => (
          <Card bgColor="blue.400" key={note.id.toString()}>
            <CardBody>
              <Text noOfLines={2} whiteSpace="break-spaces">
                {note.text}
              </Text>
            </CardBody>
            <CardFooter paddingTop={0}>
              <ButtonGroup>
                <Button bgColor="blue.300" onClick={() => setOpenNote(note.id)}>Open</Button>
                <Button bgColor="red.300" onClick={() => { mutation.mutate(note.id) }}>Delete</Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))
      }
      <Center>
        <Button bgColor="blue.300" onClick={() => setNewNote(true)}>New</Button>
      </Center>
    </Stack>
  )
}

export default Notes