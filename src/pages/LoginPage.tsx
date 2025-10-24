import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "@/config/api";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de login temporal
    setAuthToken("FAKE_TOKEN");
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-accent/20 dark:from-background dark:to-primary/20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-card shadow-lg rounded-2xl p-8 w-96 border border-border backdrop-blur-md"
      >
        <h2 className="text-3xl font-semibold text-center text-primary mb-6">
          Bienvenido a Provisio
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © {new Date().getFullYear()} Provisio. Todos los derechos reservados.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
