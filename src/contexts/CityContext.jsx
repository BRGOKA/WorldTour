/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useContext, useReducer } from "react";
import citiesData from "../../data/cities.json";

const CitiesContext = createContext();
const STORAGE_KEY = "world_wize_cities";
const initialState = {
  cities: [],
  isLoading: false,
  error: "",
  curentCity: {},
};

function loadCitiesFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveCitiesToStorage(cities) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

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
  useEffect(function () {
    dispatch({ type: "loading" });
    const storedCities = loadCitiesFromStorage();
    const initialCities = storedCities ?? citiesData.cities ?? [];
    saveCitiesToStorage(initialCities);
    dispatch({ type: "cities/loaded", payload: initialCities });
  }, []);
  async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const storedCities = loadCitiesFromStorage() ?? cities;
      const data = storedCities.find((city) => city.id === id);
      if (!data) throw new Error("City not found");
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "error while loading city" });
    }
  }
  async function creatCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const newCities = [...cities, newCity];
      saveCitiesToStorage(newCities);
      dispatch({ type: "city/created", payload: newCity });
    } catch {
      dispatch({ type: "rejected", payload: "error while loading cities" });
    }
  }
  async function deletCity(id) {
    dispatch({ type: "loading" });
    try {
      const newCities = cities.filter((city) => city.id !== id);
      saveCitiesToStorage(newCities);
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: "error while loading cities" });
    }
  }
  return (
    <CitiesContext.Provider
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
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
