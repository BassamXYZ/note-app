import { Box, Button, ButtonGroup, FormErrorMessage, Textarea } from "@chakra-ui/react"
import { useQueryClient, useMutation } from 'react-query'
import { useAppContext } from "../context/context"
import { Resolver, useForm } from "react-hook-form";

type FormValues = {
  note: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.note ? values : {},
    errors: !values.note ? {
      note: {
        type: "required",
        message: "should be 1 letter at least"
      }
    } : {},
  };
};

const NewNote = () => {
  const { token, setNewNote, apiUrl } = useAppContext()
  const queryClient = useQueryClient()
  const mutation = useMutation(postNote, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes')
    }
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const onSave = handleSubmit((data) => {
    mutation.mutate({
      note: data.note,
    })
    setNewNote(false)
  });

  async function postNote({ note }: { note: string | undefined }) {
    return await fetch((apiUrl + '/notes'), {
      method: "POST",
      headers: {
        'x-access-token': token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `note=${note}`,
    })
      .then(res => res.json())
  }

  return (
    <Box h="88vh" marginY={2}>
      <FormErrorMessage>
        {errors?.note && errors.note.message}
      </FormErrorMessage>
      <Textarea h="95%" bgColor="blue.300" id="note" {...register('note')} />
      <ButtonGroup>
        <Button marginTop={2} bgColor="blue.300" onClick={onSave}>Save</Button>
        <Button marginTop={2} bgColor="red.300" onClick={() => setNewNote(false)}>Exit</Button>
      </ButtonGroup>
    </Box>
  )
}

export default NewNote