const form = document.getElementById('cadastroForm');
const listaTarefas = document.getElementById('listaTarefas');
const errorDisplay = document.createElement('p');
errorDisplay.className = 'error';

const tarefas = [];

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const nomeDocente = document.getElementById('nomeDocente').value;
  const cargaHoraria = parseInt(document.getElementById('cargaHoraria').value);
  const atividade = document.getElementById('atividade').value;
  const diaSemana = document.getElementById('diaSemana').value;
  const horaInicial = document.getElementById('horaInicial').value;
  const horaFinal = document.getElementById('horaFinal').value;

  if (verificarCargaHoraria(cargaHoraria) && verificarDisponibilidadeHorario(horaInicial, horaFinal)) {
    const tarefa = {
      nomeDocente: nomeDocente,
      cargaHoraria: cargaHoraria,
      atividade: atividade,
      diaSemana: diaSemana,
      horaInicial: horaInicial,
      horaFinal: horaFinal
    };

    tarefas.push(tarefa);
    exibirTarefas();
    resetForm();
    hideError();
  } else {
    showError('Verifique a carga horária ou disponibilidade de horário.');
  }
});

function verificarCargaHoraria(cargaHoraria) {
  const cargaTotal = tarefas.reduce((total, tarefa) => total + tarefa.cargaHoraria, 0);
  return cargaTotal + cargaHoraria <= 40;
}

function verificarDisponibilidadeHorario(horaInicial, horaFinal) {
  return !tarefas.some(tarefa => (
    tarefa.diaSemana === document.getElementById('diaSemana').value &&
    (
      (tarefa.horaInicial <= horaInicial && horaInicial < tarefa.horaFinal) ||
      (tarefa.horaInicial < horaFinal && horaFinal <= tarefa.horaFinal) ||
      (horaInicial <= tarefa.horaInicial && tarefa.horaFinal <= horaFinal)
    )
  ));
}

function exibirTarefas() {
  listaTarefas.innerHTML = '';
  tarefas.forEach(tarefa => {
    const item = document.createElement('li');
    const intervalo = calcularIntervalo(tarefa.horaInicial, tarefa.horaFinal);
    item.textContent = `${tarefa.nomeDocente} - ${tarefa.atividade} (${tarefa.diaSemana}, ${tarefa.horaInicial} - ${tarefa.horaFinal}, Intervalo: ${intervalo})`;
    listaTarefas.appendChild(item);
  });
}

function calcularIntervalo(horaInicial, horaFinal) {
  const inicio = new Date(`2023-01-01T${horaInicial}`);
  const fim = new Date(`2023-01-01T${horaFinal}`);
  const diff = Math.abs(fim - inicio);
  const minutos = Math.floor(diff / 1000 / 60);
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return `${horas}h ${minutosRestantes}min`;
}

function resetForm() {
  form.reset();
}

function showError(message) {
  errorDisplay.textContent = message;
  form.appendChild(errorDisplay);
}

function hideError() {
  errorDisplay.textContent = '';
}
