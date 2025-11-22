import type React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MessageSquare,
  LayoutGrid,
  BarChart3,
  PenTool,
  ArrowRight,
  TrendingUp,
  Clock,
  Wallet,
  Check,
  Gift,
  Search,
  Filter,
  MessageCircleQuestionMark,
  PhoneMissed,
  Turtle,
  HandCoins,
  Play,
} from "lucide-react"
import { OctomiLogo } from "./components/OctomiLogo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "./components/Badge"
import Accordion from "@/app/components/Accordion"

export default function LandingPage() {
  const testimonials = [
    { quote: "Organizou minha vida. Antes eu perdia vendas por esquecer de responder, hoje o sistema faz por mim.", author: "Carlos Mendes", role: "Corretor Autônomo" },
    { quote: "As cópias geradas aumentaram muito minhas respostas. Fica fácil seguir a esteira sem pensar demais.", author: "Ana Paula Souza", role: "Lopes Imobiliária" },
    { quote: "Cancelei 3 ferramentas caras. OCTOMI entrega tudo que eu precisava e mais.", author: "Ricardo Oliveira", role: "Gestor de Vendas" },
    { quote: "Meu funil ficou claro. Sei quem ligar, quando, e o que falar.", author: "Mariana Lima", role: "Corretora" },
    { quote: "A organização de projetos acabou com o caos de materiais soltos e desatualizados.", author: "Felipe Rocha", role: "Equipe Comercial" },
  ]
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <div className="w-[80%]">
        {/* Header */}
        <header className="fixed px-12 inset-x-0 top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
          <div className="w-full h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <OctomiLogo />
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                <Link href="#funcionalidades" className="hover:text-primary transition-colors">
                  Funcionalidades
                </Link>
                <Link href="#economia" className="hover:text-primary transition-colors">
                  Preços
                </Link>
                <Link href="#depoimentos" className="hover:text-primary transition-colors">
                  Depoimentos
                </Link>
                <Link href="#faq" className="hover:text-primary transition-colors">
                  Perguntas Frequentes
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors">
                Entrar
              </Link>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 w-full sm:w-auto transition-all hover:-translate-y-1 cursor-pointer">
                Começar Grátis
              </Button>
            </div>
          </div>
        </header>

        <main className="pt-16 relative">
          {/* Hero Section */}
          <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
            <div className="w-full relative z-10 text-center">
              <Badge
                variant="outline"
                className="mb-6 px-4 py-1.5 text-sm border-primary/20 text-primary bg-primary/5 rounded-full"
              >
                💪🏻 Não seja um corretor braço curto!
              </Badge>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-8 max-w-5xl mx-auto">
                Chega de: <span className="text-red-400 bg-red-400/10 px-2 rounded-lg inline-block transform -rotate-1">
                  “Onde tem 2 dorms na Vila Olímpia?”
                </span>Organize seus imóveis, automatize o <span className="text-green-600 bg-green-400/10 px-2 rounded-lg inline-block transform -rotate-1">
                  Whatsapp
                </span> e economize 40%!
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-6 tracking-tight">
                O <strong className="text-foreground">OCTOMI</strong> organiza os seus projetos, automatiza o follow-up e
                cria copies persuasivas para os seus disparos. A única ferramenta feita de corretor para corretor.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 w-full sm:w-auto transition-all hover:-translate-y-1 cursor-pointer"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg w-full sm:w-auto border-2 hover:bg-muted/50 bg-transparent cursor-pointer"
                >
                  Porque usar?
                  <Play className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Experimente por 7 dias sem compromisso. Não precisa de cartão.
              </p>

              <Image
                src="/placeholder-landing.png"
                width={1200}
                height={600}
                alt="Hero"
                className="w-full h-auto max-w-4xl mx-auto mt-12 rounded-lg shadow-lg"
              />
            </div>
          </section>

          {/* Pain Points Section */}
          <section className="py-20 bg-muted/30 border-border/50 rounded-lg shadow-md mb-24">
            <div className="w-full px-6 md:px-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Corretor, isso tudo parece familiar?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A vida do corretor não precisa ser uma busca interminável em grupos de WhatsApp, planilhas mal feitas e
                  listas telefonicas de papel.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <PainPointCard
                  icon={<Clock className="w-10 h-10 text-red-500" />}
                  title="Perda de Tempo"
                  description="Horas perdidas procurando 'aquele PDF' ou respondendo a mesma pergunta básica 50 vezes."
                />
                <PainPointCard
                  icon={<TrendingUp className="w-10 h-10 text-red-500 rotate-180" />}
                  title="Vendas Perdidas"
                  description="Etiquetas atrás de etiquetas de pessoas que nunca te respondem."
                />
                <PainPointCard
                  icon={<MessageCircleQuestionMark className="w-10 h-10 text-red-500" />}
                  title="Perdido em tantos lançamentos"
                  description="Você pergunta direto: 'alguém tem o book do empreeendimento?'"
                />
                <PainPointCard
                  icon={<PhoneMissed className="w-10 h-10 text-red-500" />}
                  title="Fobia de Ligação"
                  description="Você trava porque não sabe como prospectar no telefone"
                />
                <PainPointCard
                  icon={<Turtle className="w-10 h-10 text-red-500" />}
                  title="Lentidão pra fazer esteiras"
                  description="O que eu vou mandar pro cliente durante a esteira? você não tem rotina.."
                />
                <PainPointCard
                  icon={<HandCoins className="w-10 h-10 text-red-500" />}
                  title="Gasto Excessivo"
                  description="Pagando caro em ferramentas complexas que você usa 10% das funcionalidades só porque todo mundo usa."
                />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="funcionalidades" className="p-12">
            <div className="">
              <div className="items-center mb-24">
                <div className="space-y-8">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-sm px-3 py-1">
                    Quem se antecipa, Governa!
                  </Badge>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Saiba exatamente o que fazer com cada um dos seus clientes e alcançe mais resultados!
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Chega de planilhas confusas e notas soltas. O OCTOMI centraliza sua operação para que você foque no
                    que importa: ligar do jeito certo! tratar bem seus clientes, te trazer economia e principalmente,
                    <b>VENDER MAIS</b>.
                  </p>

                  <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureItem
                      icon={<LayoutGrid className="w-6 h-6" />}
                      title="Organização de Projetos"
                      description="Gestão centralizada de todos os empreendimentos, tabelas e materiais de venda."
                    />
                    <FeatureItem
                      icon={<MessageSquare className="w-6 h-6" />}
                      title="WhatsApp Marketing"
                      description="Disparo de campanhas personalizadas com cadenciamento que não deixa seu Whatsapp cair."
                    />
                    <FeatureItem
                      icon={<BarChart3 className="w-6 h-6" />}
                      title="Funil de Vendas Inteligente"
                      description="Visualize etapas, marque visitas, faça follow-ups e nunca mais perca o momento de um lead por esquecimento ou preguiça."
                    />
                    <FeatureItem
                      icon={<PenTool className="w-6 h-6" />}
                      title="Copywriting Otimizado"
                      description="Pare de inventar copy do nada, use uma IA que gera textos persuasivos para abordagem, scripts de ligação sem medo, negociação e fechamento."
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Lead Finder Section */}
          <section className="py-24 bg-muted/20 border-border/50 relative overflow-hidden rounded-lg shadow-md mb-24">
            <div className="w-full relative z-10">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5">
                  Nova Funcionalidade 🎯
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Tá sem lead? <br className="hidden md:block" />
                  <span className="text-muted-foreground">Não tem problema,</span>{" "}
                  <span className="text-primary bg-primary/10 px-2 rounded-lg inline-block transform rotate-1">
                    eu te dou!
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Com o OCTOMI você busca listas de leads potenciais direto no app, basta montar sua persona ideal e
                  começar a prospectar com um clique!
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-background rounded-xl shadow-2xl border border-border overflow-hidden relative group">
                  {/* Mock Interface Header */}
                  <div className="border-b border-border p-4 flex items-center gap-4 bg-muted/5">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    <div className="flex-1 bg-muted/30 h-10 rounded-md flex items-center px-4 text-sm text-muted-foreground gap-2 border border-border/50">
                      <Search className="w-4 h-4" />
                      <span className="hidden sm:inline">Buscar persona:</span>
                      <span className="text-foreground font-medium">Médicos em Pinheiros, Renda +25k...</span>
                    </div>
                    <Button size="sm" className="h-9 bg-primary text-primary-foreground cursor-pointer">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrar
                    </Button>
                  </div>

                  {/* Mock Interface Body */}
                  <div className="p-6 bg-gradient-to-b from-background to-muted/10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm font-medium text-muted-foreground">Encontramos 342 leads potenciais</div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                          Alta Probabilidade
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          name: "Dr. Ricardo Mendes",
                          role: "Cardiologista",
                          location: "Pinheiros, SP",
                          status: "Quente",
                        },
                        { name: "Amanda Torres", role: "Empresária", location: "Jardins, SP", status: "Morno" },
                        { name: "Roberto Silva", role: "Diretor Comercial", location: "Itaim Bibi, SP", status: "Novo" },
                      ].map((lead, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group/item cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {lead.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold flex items-center gap-2">
                                {lead.name}
                                {i === 0 && (
                                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                    Verificado
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <span>{lead.role}</span>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                <span>{lead.location}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="opacity-0 group-hover/item:opacity-100 transition-opacity bg-primary text-primary-foreground shadow-sm cursor-pointer"
                          >
                            Adicionar ao CRM
                          </Button>
                        </div>
                      ))}
                      <div className="p-4 text-center">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary cursor-pointer">
                          Ver mais 339 leads...
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Floating Decorative Elements */}
                  <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Comparison Section */}
          <section id="economia" className="py-24 rounded-lg relative overflow-hidden md:px-12">

            <div className="w-full px-0 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Pare de rasgar dinheiro no <strong className="text-green-500 italic">WhaSca***</strong>!
                </h2>
                <p className="text-xl max-w-2xl mx-auto">
                  De corretor pra corretor, faça mais que o combinado com seus clientes, mais rápido e mais barato.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                {/* Mensal */}
                <Card className="rounded-lg border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all">
                  <CardContent className="p-8">
                    <div className="text-lg font-medium mb-4 ">Mensal</div>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold">R$ 39,90</span>
                      <span className="text-sm text-white/60">/mês</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3  text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        Acesso total ao sistema
                      </li>
                      <li className="flex items-center gap-3  text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        Disparos de WhatsApp
                      </li>
                      <li className="flex items-center gap-3  text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        Gestão de Carteira
                      </li>
                      <li className="flex items-center gap-3  text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        Gestão de Projetos e Materiais
                      </li>
                      <li className="flex items-center gap-3  text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        Follow Ups Inteligentes
                      </li>
                      <li className="flex items-center gap-3  text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        IA para Copys e Scripts de Ligação
                      </li>
                      <li className="flex items-center gap-3  text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        Suporte Proritário
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Trimestral */}
                <Card className="rounded-lg border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all relative overflow-hidden">
                  <CardContent className="p-8">
                    <div className="text-lg font-medium mb-4">Trimestral</div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold">R$ 119,90</span>
                      <span className="text-sm text-white/60">/tri</span>
                    </div>
                    <div className="text-xs font-medium text-primary/80 mb-6">Pagamento a cada 3 meses</div>

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        Tudo do plano mensal
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <Check className="w-5 h-5 text-primary" />
                        Multiplos Números
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <Check className="w-5 h-5 text-primary" />
                        Suporte Exclusivo
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <Check className="w-5 h-5 text-primary" />
                        Setup acompanhado
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Anual */}
                <Card className="rounded-lg bg-background text-foreground border-none shadow-2xl relative overflow-hidden transform md:-translate-y-4">
                  <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                  <div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                    MAIS VANTAJOSO
                  </div>

                  <CardContent className="p-8">
                    <div className="text-lg font-bold mb-4 text-primary">Anual</div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold">R$ 189,90</span>
                      <span className="text-lg text-muted-foreground">/ano</span>
                    </div>
                    <div className="text-sm font-medium text-green-600 bg-green-100 inline-block px-2 py-0.5 rounded mb-6">
                      Não deixe o WhaSca*** saber desse preço!
                    </div>

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 font-medium">
                        <Check className="w-5 h-5 text-primary" />
                        Tudo do plano mensal
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <Check className="w-5 h-5 text-primary" />
                        Multiplos Números
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <Check className="w-5 h-5 text-primary" />
                        Suporte Exclusivo
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <Check className="w-5 h-5 text-primary" />
                        Setup acompanhado
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <Check className="w-5 h-5 text-primary" />
                        Treinamentos Gravados
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <Check className="w-5 h-5 text-primary" />
                        Grupo exclusivo
                      </li>
                    </ul>
                  </CardContent>
                </Card>

              </div>

              {/* Referral Program Banner */}
              <div className="mt-16 max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 rounded-2xl p-1 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] z-0" />
                  <div className="bg-background/40 backdrop-blur-xl rounded-xl p-8 text-center relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 ring-4 ring-primary/20">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      Programa de Indicação <span className="text-primary">OCTOMI</span>
                    </h3>
                    <p className="text-white/80 mb-8 text-lg max-w-2xl mx-auto">
                      A matemática é simples: traga amigos e pague menos. O seu plano fica{" "}
                      <span className="text-green-400 font-bold">5% mais barato</span> para cada amigo que assinar.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4 transition-transform hover:-translate-y-1">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg shrink-0">
                          1
                        </div>
                        <div>
                          <div className="text-sm text-white/60">Indique 1 amigo</div>
                          <div className="text-xl font-bold text-green-400">5% OFF</div>
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4 transition-transform hover:-translate-y-1">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg shrink-0">
                          2
                        </div>
                        <div>
                          <div className="text-sm text-white/60">Indique 2 amigos</div>
                          <div className="text-xl font-bold text-green-400">10% OFF</div>
                        </div>
                      </div>
                      <div className="bg-primary/20 p-4 rounded-xl border border-primary/50 flex items-center gap-4 relative overflow-hidden shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] transition-transform hover:-translate-y-1">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg">
                          3
                        </div>
                        <div>
                          <div className="text-sm text-white/80">Indique 3 amigos</div>
                          <div className="text-xl font-bold text-white">15% OFF</div>
                        </div>
                      </div>
                    </div>

                    <p className="mt-6 text-xs text-white/40">
                      * O desconto é cumulativo até 100% do valor da mensalidade e válido enquanto a assinatura dos
                      indicados estiver ativa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof */}
          <section id="depoimentos" className="py-20">
            <div className="w-full">
              <div className="w-[70%] mx-auto">
                <div className="mb-10 text-center flex flex-col justify-center items-center">
                  <h2 className="text-3xl font-bold py-2">Histórias reais, vendas reais e corretores comissionados!</h2>
                  <p className="w-[70%]">Veja Corretores e vendedores que foram impulsionados pela OCTOmi que foram comissionados fazendo mais que o combinado</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
                  {testimonials.map((t, i) => (
                    <TestimonialCard key={i} quote={t.quote} author={t.author} role={t.role} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="py-20 border-t border-border">
            <div className="w-full px-6 md:px-12 grid grid-cols-2">
              <div className="text-left">
                <MessageCircleQuestionMark className="w-10 h-10 text-purple-500" />
                <h2 className="text-3xl font-bold my-2">Ainda com dúvidas se é pra você?</h2>
                <p className="w-[70%]">Selecionamos algumas dúvidas que recebemos com frequência sobre nossos serviços, elas podem ser úteis para você!</p>
              </div>
              <div className="grid grid-cols-1 px-4">
                <Accordion title="O que é a OCTOMI e pra quem ela serve?">
                  <p className="font-semibold text-slate-600">Somos uma plataforma de operação comercial para corretores de imóveis: organiza projetos, materiais, gera leads, carteira e campanhas de disparo de WhatsApp com cadenciamento inteligente, feito para você não perder tempo com detalhes somente em vender.</p>
                </Accordion>
                <Accordion title="Meu Whatsapp pode cair?">
                  <p className="font-semibold text-slate-600">Sinta-se seguro, usamos a API oficial da META, para nossos disparos usamos cadência, intervalos e conteúdo adequado para reduzir risco de bloqueio por spam, mantendo conversas de qualidade.</p>
                </Accordion>
                <Accordion title="Posso anexar materiais dos projetos?">
                  <p className="font-semibold text-slate-600">Sim. Centralize livros, tabelas, vídeos e documentos por projeto e use-os nas campanhas ou no CRM.</p>
                </Accordion>
                <Accordion title="É um CRM?">
                  <p className="font-semibold text-slate-600">A OCTOmi é mais que um CRM genérico, usamos inteligência de dados + um ecosistema pronto pra te fazer economizar tempo e energia com coisas banais do dia-a-dia do corretor, foque em vender, nao em caçar book e mateirias que você já deveria ter na palma da mão.</p>
                </Accordion>
                <Accordion title="Qual a diferença pro WhaScale?">
                  <p className="font-semibold text-slate-600">No WhaScale além de um preço absurdo, ele não é focado em você corretor, aqui além de disparos de Whatsapp você conta com uma plataforma feita de corretor para corretor, suporte, treinamentos e um ecosistema vivo de quem sabe exatamente o que você faz e como melhorar suas vendas!.</p>
                </Accordion>
              </div>
            </div>
          </section>
          {/* Final CTA */}
          <section className="py-24 px-12 bg-muted/50 border-border rounded-lg shadow-md">
            <div className="w-full px- text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Pronto para organizar a casa?</h2>
              <p className="text-xl text-muted-foreground mb-10">
                Se você chegou até aqui, deve estar interessado! Ta esperando o que pra começar a vender melhor e mais rápido?.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="h-14 px-12 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 w-full sm:w-auto cursor-pointer"
                >
                  Testar Grátis por 7 Dias
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">Cancele a qualquer momento.</p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-background border-t border-border p-12 ">
          <div className="w-full px-0 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <OctomiLogo />
              <span className="text-sm text-muted-foreground ml-4">© 2025 OCTOMI Inc.</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                Termos
              </Link>
              <Link href="#" className="hover:text-foreground">
                Privacidade
              </Link>
              <Link href="#" className="hover:text-foreground">
                Suporte
              </Link>
            </div>
            <div className="flex gap-4">{/* Social icons would go here */}</div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function PainPointCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-none shadow bg-white/80 backdrop-blur-lg">
      <CardContent className="pt-6 text-center flex flex-col items-center">
        <div className="mb-4 p-3 bg-muted rounded-2xl">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 items-start border p-4 rounded-lg shadow-md h-[180px] overflow-hidden">
      <div className="mt-1 w-10 h-10 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
      </div>
    </div>
  )
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <Card className="bg-background border border-border hover:border-primary/50 transition-colors max-w-[600px]">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1 mb-6">
          <div className="text-primary text-4xl font-serif leading-none mb-2">"</div>
          <p className="text-lg text-muted-foreground italic relative z-10">{quote}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
            {author.charAt(0)}
          </div>
          <div>
            <div className="font-semibold">{author}</div>
            <div className="text-xs text-muted-foreground">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
