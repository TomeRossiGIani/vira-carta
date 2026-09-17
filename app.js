const cards=[
{n:1,text:"O Brasil tem um único dono: o povo brasileiro.",tag:"soberania",who:"Lula"},
{n:2,text:"Defender nossas riquezas é defender nossa soberania.",tag:"economia",who:"Lula"},
{n:3,text:"Adotar jornada de trabalho com duas folgas por semana, sem redução de salário.",tag:"direitos trabalhistas",who:"Lula"},
{n:4,text:"Fortalecer a autonomia da Polícia Federal.",tag:"segurança",who:"Lula"},
{n:5,text:"Combater o crime organizado, atacando as suas fontes financeiras.",tag:"segurança",who:"Lula"},
{n:6,text:"Aumentar vagas nas universidades.",tag:"educação",who:"Lula"},
{n:7,text:"Manter cotas para indígenas, quilombolas e negros nas universidades e concursos públicos.",tag:"educação",who:"Lula"},
{n:8,text:"Cobrar impostos dos super-ricos para melhorar saúde, educação e segurança.",tag:"reforma tributária",who:"Lula"},
{n:9,text:"Regular as redes sociais para preservar a democracia e combater as fake news e os crimes digitais.",tag:"democracia",who:"Lula"},
{n:10,text:"Reforçar programas sociais para reduzir a pobreza.",tag:"programas sociais",who:"Lula"},
{n:11,text:"Garantir o aumento anual do salário mínimo acima da inflação.",tag:"direitos trabalhistas",who:"Lula"},
{n:12,text:"Aumentar o número de creches.",tag:"programas sociais",who:"Lula"},
{n:13,text:"Fortalecer o SUS para garantir saúde para todos.",tag:"saúde",who:"Lula"},
{n:14,text:"Fortalecer a Casa da Mulher Brasileira para acolher vítimas de violência doméstica.",tag:"defesa da mulher",who:"Lula"},
{n:15,text:"Criação do Sistema Único de Segurança semelhante ao SUS.",tag:"segurança",who:"Lula"},
{n:16,text:"Ampliar o Programa das Carretas de Saúde com Especialistas.",tag:"saúde",who:"Lula"},
{n:17,text:"Apoiar o tarifaço imposto por Trump.",tag:"economia",who:"Flávio Bolsonaro"},
{n:18,text:"Oferecer o Brasil para exploração dos Estados Unidos.",tag:"economia",who:"Flávio Bolsonaro"},
{n:19,text:"Não reconhecer as mudanças climáticas e apostar que saneamento básico é suficiente para enfrentar os desafios que estão surgindo.",tag:"meio ambiente",who:"Flávio Bolsonaro"},
{n:20,text:"Fazer parte de grupos antivacinas.",tag:"saúde",who:"Flávio Bolsonaro"},
{n:21,text:"Defender o armamento da população.",tag:"segurança",who:"Flávio Bolsonaro"},
{n:22,text:"Defender anistia para os golpistas.",tag:"democracia",who:"Flávio Bolsonaro"},
{n:23,text:"Parcerias público-privadas na educação e universidades públicas fora do MEC.",tag:"privatização",who:"Flávio Bolsonaro"},
{n:24,text:'Adotar o "tesouraço" (cortes extremos) nos gastos públicos.',tag:"estado mínimo",who:"Flávio Bolsonaro"},
{n:25,text:"Mudar a Lei do Racismo retirando a punição do agressor.",tag:"diversidade",who:"Flávio Bolsonaro"},
{n:26,text:"Afirmar que mulheres solteiras votam mal.",tag:"democracia",who:"Flávio Bolsonaro"},
{n:27,text:"Afirmar que contratar mulheres dá prejuízo para o patrão.",tag:"direitos trabalhistas",who:"Flávio Bolsonaro"},
{n:28,text:"Cortar programas sociais.",tag:"estado mínimo",who:"Flávio Bolsonaro"},
{n:29,text:"Congelar o salário mínimo e aposentadorias.",tag:"direitos trabalhistas",who:"Flávio Bolsonaro"},
{n:30,text:"Acabar com o SUS e adotar saúde somente para quem puder pagar.",tag:"estado mínimo",who:"Flávio Bolsonaro"},
{n:31,text:"Acabar com as leis trabalhistas, deixando cada empregado negociar direto com o patrão.",tag:"direitos trabalhistas",who:"Flávio Bolsonaro"},
{n:32,text:"Manter inexplicada a relação próxima com Vorcaro, do Banco Master, e os pedidos e recebimentos de dinheiro que realizou.",tag:"corrupção",who:"Flávio Bolsonaro"}
];

const $=s=>document.querySelector(s);
const screens={start:$("#startScreen"),game:$("#gameScreen"),end:$("#endScreen")};
let deck=[],index=0,score=0,judgment="",good=0,bad=0,sound=true,deferredPrompt=null;

function show(name){Object.values(screens).forEach(x=>x.classList.remove("active"));screens[name].classList.add("active")}
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function tone(freq=520,duration=.08){if(!sound)return;try{const c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type="sine";g.gain.setValueAtTime(.06,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+duration)}catch(e){}}
function toast(text){const el=$("#toast");el.textContent=text;el.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("show"),1800)}
function resetPanels(){$("#flashcard").classList.remove("flipped");$("#judgePanel").classList.remove("hidden");$("#guessPanel").classList.add("hidden");$("#revealPanel").classList.add("hidden")}
function render(){const c=deck[index];resetPanels();$("#counter").textContent=`Carta ${index+1} de ${deck.length}`;$("#score").textContent=`${score} ${score===1?"acerto":"acertos"}`;$("#progressBar").style.width=`${((index+1)/deck.length)*100}%`;$("#cardTag").textContent="#"+c.tag.replaceAll(" ","");$("#statement").textContent='“'+c.text+'”';$("#cardNumber").textContent=String(c.n).padStart(2,"0");$("#backNumber").textContent=String(c.n).padStart(2,"0")}
function start(){deck=shuffle(cards);index=0;score=0;good=0;bad=0;judgment="";show("game");render();tone(620,.1)}
function chooseJudgment(value){judgment=value;if(value==="Bom")good++;else bad++;$("#judgePanel").classList.add("hidden");$("#guessPanel").classList.remove("hidden");tone(value==="Bom"?660:350)}
function guess(value){const c=deck[index],correct=value===c.who;if(correct){score++;tone(800,.14)}else tone(220,.2);$("#politician").textContent=c.who;$("#yourChoice").textContent=`Você considerou esta proposta: ${judgment.toLowerCase()}.`;$("#flashcard").classList.add("flipped");$("#guessPanel").classList.add("hidden");const badge=$("#resultBadge");badge.textContent=correct?"✓ Você acertou!":`Era ${c.who}`;badge.className="result-badge "+(correct?"correct":"wrong");$("#revealPanel").classList.remove("hidden");$("#score").textContent=`${score} ${score===1?"acerto":"acertos"}`}
function next(){if(index<deck.length-1){index++;render()}else finish()}
function finish(){show("end");$("#finalScore").textContent=score;$("#goodCount").textContent=good;$("#badCount").textContent=bad;const pct=score/cards.length;$("#finalTitle").textContent=pct>=.8?"Você conhece o baralho!":pct>=.5?"Boa rodada!":"As cartas surpreendem, né?";$("#finalMessage").textContent=pct>=.8?"Você identificou quase todas as frases.":pct>=.5?"Você acertou mais da metade. Tente outra rodada para melhorar.":"Jogue novamente: a ordem muda a cada partida.";tone(880,.2)}
async function share(){const data={title:"ViraCarta",text:`Eu fiz ${score}/32 no ViraCarta. Você sabe quem defende cada ideia?`,url:location.href};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(location.href);toast("Link copiado!")}}catch(e){}}

$("#startButton").addEventListener("click",start);
$("#restartButton").addEventListener("click",start);
$("#nextButton").addEventListener("click",next);
$("#shareButton").addEventListener("click",share);
document.querySelectorAll("[data-judgment]").forEach(b=>b.addEventListener("click",()=>chooseJudgment(b.dataset.judgment)));
document.querySelectorAll("[data-guess]").forEach(b=>b.addEventListener("click",()=>guess(b.dataset.guess)));
$("#soundButton").addEventListener("click",e=>{sound=!sound;e.currentTarget.classList.toggle("muted",!sound);e.currentTarget.textContent=sound?"♪":"×";toast(sound?"Som ativado":"Som desativado")});

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installButton").classList.remove("hidden")});
$("#installButton").addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("#installButton").classList.add("hidden")});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));