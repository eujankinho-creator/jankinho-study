"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !nome.trim() ||
      !email.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || "Não foi possível criar sua conta."
        );
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível criar sua conta.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/[0.07] blur-[120px]" />

        <div className="absolute bottom-[-220px] right-[-120px] h-[420px] w-[420px] rounded-full bg-orange-500/[0.035] blur-[110px]" />

        <div className="absolute left-[-180px] top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-orange-500/[0.02] blur-[100px]" />
      </div>

      <section className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 shadow-[0_0_45px_rgba(249,115,22,0.12)]">
            <span className="text-2xl font-black text-orange-400">
              J
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-white">
            Jankinho Study
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Comece sua jornada de estudos.
          </p>
        </div>

        <div className="premium-card p-6 sm:p-8">
          <div className="mb-7">
            <span className="badge badge-orange">
              Primeiro acesso
            </span>

            <h2 className="mt-4 text-2xl font-bold text-white">
              Criar sua conta
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Crie seu perfil para acompanhar sua evolução
              acadêmica.
            </p>
          </div>

          {erro && (
            <div className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3">
              <p className="text-sm leading-5 text-rose-300">
                {erro}
              </p>
            </div>
          )}

          <form
            onSubmit={cadastrar}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                Nome
              </label>

              <input
                type="text"
                value={nome}
                onChange={function (event) {
                  setNome(event.target.value);
                }}
                placeholder="Como devemos chamar você?"
                autoComplete="name"
                className="input-premium"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={function (event) {
                  setEmail(event.target.value);
                }}
                placeholder="seu@email.com"
                autoComplete="email"
                className="input-premium"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                Senha
              </label>

              <input
                type="password"
                value={senha}
                onChange={function (event) {
                  setSenha(event.target.value);
                }}
                placeholder="Mínimo de 6 caracteres"
                autoComplete="new-password"
                className="input-premium"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                Confirmar senha
              </label>

              <input
                type="password"
                value={confirmarSenha}
                onChange={function (event) {
                  setConfirmarSenha(event.target.value);
                }}
                placeholder="Digite a senha novamente"
                autoComplete="new-password"
                className="input-premium"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando
                ? "Criando conta..."
                : "Criar minha conta"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.06]" />

            <span className="text-xs text-neutral-700">
              já possui uma conta?
            </span>

            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={function () {
                router.push("/login");
              }}
              className="text-sm font-semibold text-orange-400 transition hover:text-orange-300"
            >
              ← Voltar para o login
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-700">
          Jankinho Study • Estude. Pratique. Evolua.
        </p>
      </section>
    </main>
  );
}