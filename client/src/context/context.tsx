import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";

type AppContextType = {
  apiUrl: string,
  token: any,
  setToken: Dispatch<SetStateAction<string>>,
  isLoding: boolean,
  setIsLoding: Dispatch<SetStateAction<boolean>>,
  newNote: boolean,
  setNewNote: Dispatch<SetStateAction<boolean>>,
  openNote: number | null,
  setOpenNote: Dispatch<SetStateAction<number | null>>,
}

const DefaultAppContextValues: AppContextType = {
  apiUrl: import.meta.env.VITE_API_URL,
  token: "",
  setToken: useState<string>,
  isLoding: false,
  setIsLoding: useState<boolean>,
  newNote: false,
  setNewNote: useState<boolean>,
  openNote: null,
  setOpenNote: useState<number | null>,
}

const AppContext = createContext<AppContextType>(DefaultAppContextValues);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState<any>("");
  const [isLoding, setIsLoding] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<boolean>(false);
  const [openNote, setOpenNote] = useState<number | null>(null);

  useEffect(() => {
    if (localStorage.getItem("token")) setToken(localStorage.getItem("token"));
  }, [])

  return (
    <AppContext.Provider value={{
      apiUrl,
      token,
      setToken,
      isLoding,
      setIsLoding,
      newNote,
      setNewNote,
      openNote,
      setOpenNote,
    }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export { AppContext as default, AppContextProvider, useAppContext }