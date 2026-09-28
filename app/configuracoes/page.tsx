export default function Configuracoes() {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold">⚙️ Configurações</h1>
  
          <p className="mt-2 text-slate-400">
            Personalize o seu Jankinho Study.
          </p>
  
          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">
                👤 Perfil
              </h2>
  
              <p className="mt-2 text-slate-400">
                Configure suas informações pessoais.
              </p>
  
              <button className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">
                Editar perfil
              </button>
            </div>
  
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">
                🎨 Aparência
              </h2>
  
              <p className="mt-2 text-slate-400">
                Personalize a aparência do sistema.
              </p>
  
              <button className="mt-5 rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800">
                Tema escuro
              </button>
            </div>
  
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">
                🔒 Segurança
              </h2>
  
              <p className="mt-2 text-slate-400">
                Configurações de segurança e acesso.
              </p>
  
              <button className="mt-5 rounded-xl bg-red-600 px-6 py-3 font-semibold hover:bg-red-500">
                Configurações de segurança
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }