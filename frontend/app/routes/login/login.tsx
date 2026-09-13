import { useNavigate } from "react-router";
import { useLoginForm } from "~/hooks/useLoginForm";
import { LoginView } from "@components/LoginView/LoginView";

export default function Login() {
  const navigate = useNavigate();

  const form = useLoginForm({
    onSuccess: () => navigate("/"),
  });

  return (
    <LoginView
      email={form.email}
      onEmailChange={form.setEmail}
      password={form.password}
      onPasswordChange={form.setPassword}
      isLoading={form.isLoading}
      error={form.error}
      onSubmit={form.handleSubmit}
      onNavigateRegister={() => navigate("/register")}
      onBack={() => navigate("/")}
    />
  );
}