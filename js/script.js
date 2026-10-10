/* =========================================================
   Muebles - Decoración · Comportamiento del sitio
   ---------------------------------------------------------
   1. Datos de contacto  <-- CAMBIA AQUÍ instagram, teléfono y correo
   2. Portada: cambio automático de fotos
   3. Nuestros trabajos: filtros por categoría
   4. Nuestros trabajos: visor para ampliar fotos
   ========================================================= */

/* ---------- 1. Datos de contacto ---------- */
// Escribe aquí los datos reales. Se actualizan solos en las tres páginas.
const CONTACTO = {
  instagram: "",                    // usuario SIN arroba, por ejemplo: "mueblesdecoracion"
  telefono: "55 0000 0000",         // dato de relleno
  correo: "contacto@ejemplo.com",   // dato de relleno
};

function aplicarContacto() {
  const soloDigitos = CONTACTO.telefono.replace(/\D/g, "");

  document.querySelectorAll('[data-contacto="telefono"]').forEach((el) => {
    el.textContent = CONTACTO.telefono;
  });
  document.querySelectorAll('[data-enlace="telefono"]').forEach((el) => {
    el.href = "tel:" + soloDigitos;
  });

  document.querySelectorAll('[data-contacto="correo"]').forEach((el) => {
    el.textContent = CONTACTO.correo;
  });
  document.querySelectorAll('[data-enlace="correo"]').forEach((el) => {
    el.href = "mailto:" + CONTACTO.correo;
  });

  // Instagram: mientras no haya usuario, se queda el texto "Próximamente" y sin enlace.
  if (CONTACTO.instagram) {
    const usuario = CONTACTO.instagram.replace(/^@/, "");
    document.querySelectorAll('[data-contacto="instagram"]').forEach((el) => {
      el.textContent = "@" + usuario;
    });
    // Perfil de la cuenta
    document.querySelectorAll('[data-enlace="instagram"]').forEach((el) => {
      el.href = "https://www.instagram.com/" + usuario + "/";
      el.target = "_blank";
      el.rel = "noopener";
    });
    // Chat directo para pedir presupuesto
    document.querySelectorAll('[data-enlace="instagram-mensaje"]').forEach((el) => {
      el.href = "https://ig.me/m/" + usuario;
      el.target = "_blank";
      el.rel = "noopener";
    });
    document.querySelectorAll("[data-instagram-boton]").forEach((el) => {
      el.textContent = "Enviar mensaje";
    });
  }
}

/* ---------- 2. Portada ---------- */
function iniciarPortada() {
  const portada = document.querySelector(".portada");
  if (!portada) return;

  const fotos = portada.querySelectorAll(".portada__foto");
  const puntos = portada.querySelectorAll(".portada__punto");
  const SEGUNDOS = 6;
  let actual = 0;
  let reloj = null;

  function mostrar(indice) {
    actual = (indice + fotos.length) % fotos.length;
    fotos.forEach((foto, i) => foto.classList.toggle("activa", i === actual));
    puntos.forEach((punto, i) => punto.setAttribute("aria-current", i === actual ? "true" : "false"));
  }

  function arrancar() {
    // Si la persona pidió menos movimiento en su dispositivo, no cambia sola.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    detener();
    reloj = setInterval(() => mostrar(actual + 1), SEGUNDOS * 1000);
  }

  function detener() {
    clearInterval(reloj);
  }

  portada.querySelector(".portada__flecha--ant").addEventListener("click", () => {
    mostrar(actual - 1);
    arrancar();
  });
  portada.querySelector(".portada__flecha--sig").addEventListener("click", () => {
    mostrar(actual + 1);
    arrancar();
  });
  puntos.forEach((punto, i) =>
    punto.addEventListener("click", () => {
      mostrar(i);
      arrancar();
    })
  );

  mostrar(0);
  arrancar();
}

/* ---------- 3. Filtros ---------- */
function iniciarFiltros() {
  const filtros = document.querySelectorAll(".filtro");
  if (!filtros.length) return;

  const trabajos = document.querySelectorAll(".trabajo");

  function filtrar(categoria) {
    filtros.forEach((boton) => {
      boton.setAttribute("aria-pressed", boton.dataset.categoria === categoria ? "true" : "false");
    });
    trabajos.forEach((trabajo) => {
      trabajo.hidden = categoria !== "todos" && trabajo.dataset.categoria !== categoria;
    });
  }

  filtros.forEach((boton) =>
    boton.addEventListener("click", () => {
      filtrar(boton.dataset.categoria);
      history.replaceState(null, "", boton.dataset.categoria === "todos" ? "#" : "#" + boton.dataset.categoria);
    })
  );

  // Permite llegar desde inicio con trabajos.html#cocinas, por ejemplo.
  const desdeEnlace = location.hash.replace("#", "");
  const existe = Array.from(filtros).some((boton) => boton.dataset.categoria === desdeEnlace);
  filtrar(existe ? desdeEnlace : "todos");
}

/* ---------- 4. Visor ---------- */
function iniciarVisor() {
  const visor = document.querySelector(".visor");
  if (!visor || typeof visor.showModal !== "function") return;

  const foto = visor.querySelector(".visor__foto");
  const pie = visor.querySelector(".visor__pie");
  let visibles = [];
  let actual = 0;

  function mostrar(indice) {
    actual = (indice + visibles.length) % visibles.length;
    const trabajo = visibles[actual];
    const miniatura = trabajo.querySelector("img");
    foto.src = trabajo.href;
    foto.alt = miniatura.alt;
    pie.textContent = miniatura.alt + " · " + (actual + 1) + " de " + visibles.length;
  }

  document.querySelectorAll(".trabajo").forEach((trabajo) =>
    trabajo.addEventListener("click", (evento) => {
      evento.preventDefault();
      visibles = Array.from(document.querySelectorAll(".trabajo:not([hidden])"));
      mostrar(visibles.indexOf(trabajo));
      visor.showModal();
    })
  );

  visor.querySelector(".visor__cerrar").addEventListener("click", () => visor.close());
  visor.querySelector(".visor__ant").addEventListener("click", () => mostrar(actual - 1));
  visor.querySelector(".visor__sig").addEventListener("click", () => mostrar(actual + 1));

  // Cerrar al tocar el fondo oscuro
  visor.addEventListener("click", (evento) => {
    if (evento.target === visor || evento.target.classList.contains("visor__marco")) visor.close();
  });

  // Flechas del teclado
  visor.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") mostrar(actual - 1);
    if (evento.key === "ArrowRight") mostrar(actual + 1);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  aplicarContacto();
  iniciarPortada();
  iniciarFiltros();
  iniciarVisor();
});
