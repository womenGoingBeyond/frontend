import { createContext, useContext, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingContext = createContext({
  loading: false,
  setLoading: null,
});

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const value = { loading, setLoading };
  return (
    <LoadingContext.Provider value={value}>
      {children}
    {loading ? <LoadingSpinner /> : null}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}