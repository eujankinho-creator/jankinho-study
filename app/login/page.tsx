"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !senha) {
      setErro("Preencha seu e-mail e sua senha.");
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || "Não foi possível entrar."
        );
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível entrar.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-220px] left-[-120px] h-[400px] w-[400px] rounded-full bg-orange-500/[0.035] blur-[110px]" />
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
            Seu espaço para estudar melhor.
          </p>
        </div>

        <div className="premium-card p-6 sm:p-8">
          <div className="mb-7">
            <span className="badge badge-orange">
              Bem-vindo de volta
            </span>

            <h2 className="mt-4 text-2xl font-bold text-white">
              Entrar na sua conta
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Acesse suas questões, flashcards, desempenho e
              muito mais.
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
            onSubmit={entrar}
            className="space-y-5"
          >
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
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                  Senha
                </label>
              </div>

              <input
                type="password"
                value={senha}
                onChange={function (event) {
                  setSenha(event.target.value);
                }}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                className="input-premium"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando
                ? "Entrando..."
                : "Entrar na conta"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.06]" />

            <span className="text-xs text-neutral-700">
              ou
            </span>

            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="text-center">
            <p className="text-sm text-neutral-500">
              Ainda não possui uma conta?
            </p>

            <button
              type="button"
              onClick={function () {
                router.push("/cadastro");
              }}
              className="mt-2 text-sm font-semibold text-orange-400 transition hover:text-orange-300"
            >
              Criar minha conta →
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