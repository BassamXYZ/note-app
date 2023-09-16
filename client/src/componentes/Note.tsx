import { Box, Button, ButtonGroup, FormErrorMessage, Textarea } from "@chakra-ui/react"
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { useAppContext } from "../context/context"
import { Resolver, useForm } from "react-hook-form";
import { useEffect } from "react";

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

const Note = ({ noteId }: { noteId: number }) => {
  const { token, setOpenNote, apiUrl } = useAppContext()
  const queryClient = useQueryClient()
  const mutation = useMutation(patchNote, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes')
    }
  })

  const note = useQuery('notes').data.find(note => note.id == noteId).text

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver });

  useEffect(() => {
    reset({ note: note });
  }, [note]);

  const onSave = handleSubmit((data) => {
    mutation.mutate({
      id: noteId,
      note: data.note,
    })
    setOpenNote(null)
  });

  async function patchNote({ id, note }: { id: number | null, note: string }) {
    return await fetch((apiUrl + '/notes'), {
      method: "PATCH",
      headers: {
        "x-access-token": token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${id}&note=${note}`,
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
        <Button marginTop={2} bgColor="red.300" onClick={() => setOpenNote(null)}>Exit</Button>
      </ButtonGroup>
    </Box>
  )
}

export default Note