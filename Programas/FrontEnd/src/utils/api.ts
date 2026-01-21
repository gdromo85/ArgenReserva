

const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || "https://padron.325160.xyz";
};

const fetchData = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const data = await response.json();
    // Intentar parsear la respuesta si es un string JSON
    try {
      return JSON.parse(data);
    } catch {
      // Si no es un string JSON, devolver los datos tal cual
      return data;
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

export { getApiUrl, fetchData };