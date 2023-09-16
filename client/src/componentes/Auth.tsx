import { FormControl, FormLabel, FormErrorMessage, Input, Stack, Center, Button, ButtonGroup } from "@chakra-ui/react"
import { useForm, Resolver } from "react-hook-form"
import { useAppContext } from "../context/context";

type FormValues = {
  email: string;
  password: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.email ? values : {},
    errors: !values.email ? {
      email: {
        type: "required",
        message: "This is required"
      }
    } : {},
  };
};

const Auth = () => {
  const { setToken, setIsLoding, apiUrl } = useAppContext()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const onLogin = handleSubmit(async (data) => {
    setIsLoding(true);
    await fetch((apiUrl + "/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `email=${data.email}&password=${data.password}`
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw res
      })
      .then(data => {
        localStorage.setItem("token", data.token)
        setToken(data.token);
      })
      .catch(err => console.error(err))
    setIsLoding(false)
  });

  const onSignup = handleSubmit(async (data) => {
    setIsLoding(true)
    await fetch((apiUrl + "/signup"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `email=${data.email}&password=${data.password}`
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw res
      })
      .then(data => {
        localStorage.setItem("token", data.token)
        setToken(data.token);
      })
      .catch(err => console.error(err))
    setIsLoding(false)
  });


  return (
    <Stack
      as="form"
      p={8}
      spacing={8}
      onSubmit={e => e.preventDefault()}
    >
      <FormControl>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          bgColor="blue.300"
          id="email"
          placeholder="email"
          {...register('email')}
        />
        <FormErrorMessage>
          {errors?.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          bgColor="blue.300"
          type="password"
          id="password"
          placeholder="password"
          {...register('password')} />
      </FormControl>
      <Center>
        <ButtonGroup>
          <Button bgColor="blue.300" onClick={onLogin}>
            Login
          </Button>
          <Button bgColor="blue.300" onClick={onSignup}>
            Signup
          </Button>
        </ButtonGroup>
      </Center>
    </Stack>
  )
}

export default Auth