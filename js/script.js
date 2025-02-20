const talonario = document.getElementById("talonario"),
  fechaSorteoElement = document.getElementById("fecha-sorteo"),
  tablaCompras = document
    .getElementById("tablaCompras")
    .getElementsByTagName("tbody")[0],
  responsableActualElement = document.getElementById("responsableActual"),
  casillas = {};
let compras = [];
const fechaSorteo = new Date("2024-11-16");
fechaSorteoElement.textContent = fechaSorteo.toLocaleDateString("es-ES", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
for (let i = 1; i <= 100; i++) {
  let e = document.createElement("button");
  e.classList.add("casilla"),
    (e.textContent = i),
    talonario.appendChild(e),
    (casillas[i] = e);
}
async function obtenerCompras() {
  try {
    let e = await fetch("http://localhost:3000/compras");
    if (!e.ok) throw Error("Error al obtener las compras");
    (compras = await e.json()), cargarCompras();
  } catch (a) {
    return a;
  }
}
async function agregarCompra() {
  let e = document.getElementById("nombreComprador").value,
    a = parseInt(document.getElementById("numeroPuesto").value),
    t = document.getElementById("nombreResponsable").value;
  if (a < 1 || a > 100) {
    alert("El n\xfamero de puesto debe estar entre 1 y 100.");
    return;
  }
  if (e && a && t) {
    if (casillas[a].classList.contains("ocupado")) {
      alert("Este n\xfamero de puesto ya est\xe1 ocupado.");
      return;
    }
    try {
      let o = await fetch("http://localhost:3000/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreComprador: e,
          numeroPuesto: a,
          nombreResponsable: t,
        }),
      });
      if (!o.ok) throw Error("Error al agregar la compra");
      let r = await o.json();
      compras.push(r),
        casillas[a].classList.add("ocupado"),
        actualizarTabla(),
        actualizarResponsable(t),
        (document.getElementById("nombreComprador").value = ""),
        (document.getElementById("numeroPuesto").value = ""),
        (document.getElementById("nombreResponsable").value = "");
    } catch (l) {
      return l;
    }
  } else alert("Por favor, completa todos los campos.");
}
async function eliminarCompra(e) {
  let a = compras[e].numeroPuesto;
  try {
    let t = await fetch(`http://localhost:3000/compras/${a}`, {
      method: "DELETE",
    });
    if (!t.ok) throw Error("Error al eliminar la compra");
    compras.splice(e, 1),
      casillas[a].classList.remove("ocupado"),
      actualizarTabla();
  } catch (o) {
    return o;
  }
}

function cargarCompras() {
  compras.forEach((e) => {
    casillas[e.numeroPuesto].classList.add("ocupado");
  }),
    actualizarTabla();
}

function actualizarTabla() {
  (tablaCompras.innerHTML = ""),
    compras.forEach((e, a) => {
      let t = tablaCompras.insertRow();
      (t.insertCell(0).textContent = e.nombreComprador),
        (t.insertCell(1).textContent = e.numeroPuesto),
        (t.insertCell(2).textContent = e.nombreResponsable);
      let o = t.insertCell(3),
        r = document.createElement("button");
      r.classList.add("btn-eliminar"),
        r.classList.add("fa"),
        r.classList.add("fa-trash"),
        (r.textContent = " Delet"),
        (r.onclick = () => eliminarCompra(a)),
        o.appendChild(r);
    });
}

function actualizarResponsable(e) {
  responsableActualElement.textContent = e;
}
obtenerCompras();
