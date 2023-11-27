const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sCliente = document.querySelector("#m-cliente");
const sAparelho = document.querySelector("#m-aparelho");
const sDescricao = document.querySelector("#m-descricao");
const sValor = document.querySelector("#m-valor");
const btnSalvar = document.querySelector("#btnSalvar");
const btnImprimir = document.querySelector("#btnImprimir");

let itens;
let id;

function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sCliente.value = itens[index].cliente;
    sAparelho.value = itens[index].aparelho;
    sDescricao.value = itens[index].descricao;
    sValor.value = itens[index].valor;
    id = index;
  } else {
    sCliente.value = "";
    sAparelho.value = "";
    sDescricao.value = "";
    sValor.value = "";
  }
}

function editItem(index) {
  openModal(true, index);
}

function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.cliente}</td>
    <td>${item.aparelho}</td>
    <td>${item.descricao}</td>
    <td>R$ ${item.valor}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
    <td class="acao">
      <button onclick="printItem(${index})"><i class='bx bx-printer'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

btnSalvar.onclick = (e) => {
  if (
    sCliente.value == "" ||
    sAparelho.value == "" ||
    sDescricao.value == "" ||
    sValor.value == ""
  ) {
    return;
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].cliente = sCliente.value;
    itens[id].aparelho = sAparelho.value;
    itens[id].descricao = sDescricao.value;
    itens[id].valor = sValor.value;
  } else {
    itens.push({
      cliente: sCliente.value,
      aparelho: sAparelho.value,
      descricao: sDescricao.value,
      valor: sValor.value,
    });
  }

  setItensBD();

  modal.classList.remove("active");
  loadItens();
  id = undefined;
};

function loadItens() {
  itens = getItensBD();
  tbody.innerHTML = "";
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

const getItensBD = () => JSON.parse(localStorage.getItem("dbfunc")) ?? [];
const setItensBD = () => localStorage.setItem("dbfunc", JSON.stringify(itens));

loadItens();

// FUNÇÃO IMPRIMIR
function printItem(index) {
  const item = itens[index];
  const printContent = `
      <div class="print-container">
      <div class="print-header">
        <h1>Ordem de Serviço</h1>
      </div>
      <div class="print-body">
        <div class="print-item">
          <span>Cliente:</span> ${item.cliente}
        </div>
        <div class="print-item">
          <span>Aparelho:</span> ${item.aparelho}
        </div>
        <div class="print-item">
          <span>Descrição:</span> ${item.descricao}
        </div>
        <div class="print-item">
          <span>Valor:</span> R$ ${item.valor}
        </div>
      </div>
    </div>
  `;

  const printWindow = window.open("", "", "height=600,width=800");
  printWindow.document.write(
    "<html><head><title>Impressão</title></head><body>"
  );
  printWindow.document.write(printContent);
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
}
