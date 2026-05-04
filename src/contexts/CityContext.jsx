/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  useState,
  createContext,
  useEffect,
  useContext,
  useReducer,
} from "react";

const CitiesContex = createContext();
const BASE_URL = "http://localhost:8000";
const initialState = {
  cities: [],
  isLoadong: false,
  error: "",
  curentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return { ...state, isLoading: false, curentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        curentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        curentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("something went wrong ");
  }
}
function CitiesProvider({ children }) {
  const [{ cities, isLoading, curentCity }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  useEffect(
    function () {
      async function fetchCities() {
        dispatch({ type: "loading" });
        try {
          const res = await fetch(`${BASE_URL}/cities`);
          const data = await res.json();
          dispatch({ type: "cities/loaded", payload: data });
        } catch {
          dispatch({ type: "error", payload: "error while loding cities" });
        }
      }
      fetchCities();
    },
    [dispatch],
  );
  async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({ type: "error", payload: "error while loding cities" });
    }
  }
  async function creatCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({ type: "error", payload: "error while loding cities" });
    }
  }
  async function deletCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({ type: "error", payload: "error while loding cities" });
    }
  }
  return (
    <CitiesContex.Provider
      value={{
        cities,
        curentCity,
        isLoading,
        getCity,
        creatCity,
        deletCity,
      }}
    >
      {children}
    </CitiesContex.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContex);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
