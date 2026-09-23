const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  register: async (username: string, password: string): Promise<void> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      if (res.status === 409) throw new Error("Ese usuario ya existe");
      if (res.status === 400) throw new Error("Revisa los datos: usuario y contraseña (mínimo 6 caracteres) son obligatorios");
      throw new Error("No se pudo crear la cuenta");
    }
  },
};
