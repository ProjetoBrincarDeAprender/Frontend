import useAuth from "@/hooks/Auth/useAuth";
import { useState } from "react";

import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { ChangePasswordModal } from "@/components/features/users/password/ChangePasswordModal";
import NuvemSVG from "../../assets/nuvem.svg";
import StarSVG from "../../assets/star.svg";
import {
  User,
  Mail,
  Shield,
  School,
  Hash,
  Sparkles,
  Settings,
  KeyRound,
  X,
} from "lucide-react";

export function Profile() {
  const { profile } = useAuth();
  const { data: user, isLoading } = profile;
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-purplish-blue-dark flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
          <p className="animate-pulse text-xl text-white">
            Carregando Perfil...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-purplish-blue-dark flex min-h-screen items-center justify-center">
        <div className="rounded-xl bg-red-500/20 px-8 py-6 backdrop-blur-sm">
          <p className="text-xl text-red-300">Usuário não encontrado.</p>
        </div>
      </div>
    );
  }

  // Dados do perfil para exibição em cards
  const profileInfo = [
    {
      icon: Hash,
      label: "Matrícula",
      value: user.codigo_usuario,
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: User,
      label: "Nome",
      value: user.nome_completo,
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: Mail,
      label: "Email",
      value: user.email,
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: Shield,
      label: "Perfil",
      value: user.perfil,
      color: "from-emerald-400 to-teal-500",
    },
    {
      icon: School,
      label: "Escola",
      value: user.escola || "Não vinculado",
      color: "from-pink-400 to-rose-500",
    },
  ];

  return (
    <div className="bg-purplish-blue-dark relative min-h-screen overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 z-0">
        <img
          src={StarSVG}
          alt=""
          className="absolute top-40 left-[5%] h-8 w-8 animate-pulse opacity-60"
        />
        <img
          src={StarSVG}
          alt=""
          className="absolute top-60 right-[15%] h-6 w-6 animate-pulse opacity-40"
          style={{ animationDelay: "0.5s" }}
        />
        <img
          src={StarSVG}
          alt=""
          className="absolute top-[45%] left-[20%] h-5 w-5 animate-pulse opacity-50"
          style={{ animationDelay: "1s" }}
        />
        <img
          src={NuvemSVG}
          alt=""
          className="absolute bottom-0 left-0 h-auto w-full object-cover object-bottom opacity-60"
        />
      </div>

      <Header />

      <div className="ml-0 md:ml-0">
        <BackButton />
      </div>

      <main className="relative z-10 mx-auto mt-24 max-w-4xl px-6 pb-32">
        {/* Card principal do perfil */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 shadow-2xl backdrop-blur-md">
          {/* Banner superior com gradiente */}
          <div className="from-am0 relative h-32 bg-gradient-to-r via-amber-500 to-orange-400 sm:h-40">
            {/* Padrão decorativo no banner */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-8 h-20 w-20 rounded-full bg-white/30 blur-2xl" />
              <div className="absolute right-12 bottom-4 h-16 w-16 rounded-full bg-white/20 blur-xl" />
            </div>

            {/* Ícone decorativo */}
            <div className="absolute top-4 right-6 text-white/30">
              <Sparkles className="h-12 w-12" />
            </div>
          </div>

          {/* Seção do avatar e nome */}
          <div className="relative px-6 pb-6 sm:px-10">
            {/* Avatar */}
            <div className="absolute -top-16 left-6 sm:-top-20 sm:left-10">
              <div className="relative">
                <div className="from-am0 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br to-orange-400 p-1 shadow-xl sm:h-36 sm:w-36">
                  <div className="bg-purplish-blue flex h-full w-full items-center justify-center rounded-full text-4xl font-bold text-white sm:text-5xl">
                    {user.nome_completo.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do usuário */}
            <div className="ml-0 pt-16 sm:ml-44 sm:pt-4">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {user.nome_completo}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-amber-300">
                <Shield className="h-4 w-4" />
                {user.perfil}
              </div>
            </div>
          </div>

          {/* Divisor decorativo */}
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent sm:mx-10" />

          {/* Grid de informações */}
          <div className="p-6 sm:p-10">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="from-am0 h-6 w-1 rounded-full bg-gradient-to-b to-orange-400" />
              Informações do Perfil
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profileInfo.map((item, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:shadow-lg"
                >
                  {/* Ícone com gradiente */}
                  <div
                    className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${item.color} p-3 shadow-lg`}
                  >
                    <item.icon className="h-5 w-5 text-white" />
                  </div>

                  {/* Label */}
                  <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                    {item.label}
                  </p>

                  {/* Valor */}
                  <p className="mt-1 truncate text-base font-semibold text-white">
                    {item.value}
                  </p>

                  {/* Efeito hover decorativo */}
                  <div
                    className={`absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-gradient-to-br ${item.color} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
                  />
                </div>
              ))}

              {/* Card de Ações */}
              <button
                onClick={() => setActionsModalOpen(true)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white/5 p-4 text-left transition-all duration-300 hover:bg-white/10 hover:shadow-lg"
              >
                {/* Ícone com gradiente */}
                <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 p-3 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Settings className="h-5 w-5 text-white" />
                </div>

                {/* Label */}
                <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Configurações
                </p>

                {/* Valor */}
                <p className="mt-1 truncate text-base font-semibold text-white">
                  Ações do Perfil
                </p>

                {/* Efeito hover decorativo */}
                <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Ações */}
      {actionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setActionsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-[#302579] to-[#1a1550] shadow-2xl">
            {/* Header do Modal */}
            <div className="from-am0 relative bg-gradient-to-r via-amber-500 to-orange-400 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/20 p-2">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Ações do Perfil
                  </h3>
                </div>
                <button
                  onClick={() => setActionsModalOpen(false)}
                  className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Lista de Ações */}
            <div className="p-6">
              <p className="mb-4 text-sm text-gray-400">
                Selecione uma ação para gerenciar seu perfil:
              </p>

              <div className="space-y-3">
                {/* Ação: Alterar Senha */}
                <button
                  onClick={() => {
                    setActionsModalOpen(false);
                    setPasswordModalOpen(true);
                  }}
                  className="group flex w-full items-center gap-4 rounded-2xl bg-white/5 p-4 text-left transition-all duration-300 hover:bg-white/10"
                >
                  <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <KeyRound className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Alterar Senha</p>
                    <p className="text-sm text-gray-400">
                      Atualize sua senha de acesso
                    </p>
                  </div>
                </button>

                {/* Placeholder para futuras ações */}
                {/* 
                <button className="group flex w-full items-center gap-4 rounded-2xl bg-white/5 p-4 text-left transition-all duration-300 hover:bg-white/10">
                  <div className="rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 p-3 shadow-lg">
                    <Edit className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Editar Perfil</p>
                    <p className="text-sm text-gray-400">Atualize suas informações</p>
                  </div>
                </button>
                */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alterar Senha */}
      <ChangePasswordModal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
      />
    </div>
  );
}
