export const infoIguazu = {
  general: {
    nombre: "Puerto Iguazú / Cataratas del Iguazú",
    ubicacion: "Provincia de Misiones, Argentina / Foz do Iguaçu, Brasil / Ciudad del Este, Paraguay",
    clima: "Subtropical húmedo. Temperatura media anual 21°C. Veranos cálidos y húmedos (30-38°C), inviernos templados (10-22°C). Noviembre a marzo es temporada de lluvias.",
    mejorEpoca: "Marzo a mayo (otoño) y septiembre a noviembre (primavera) — menos calor, menos multitudes.",
    moneda: "Peso argentino (ARS). En zonas turísticas aceptan USD y BRL. Llevá efectivo, los cajeros tienen límite bajo.",
    idioma: "Español. Portugués en Brasil. Inglés básico en hoteles y aeropuerto.",
    comoLlegar: {
      avion: "Aeropuerto Internacional Cataratas del Iguazú (IGR). Vuelos directos desde Buenos Aires (AEP/EGE) ~2h, Córdoba, Rosario. Desde IGR al centro ~20 min en remís ($8000-10000 ARS).",
      bus: "Terminal de Ómnibus de Puerto Iguazú. Buses desde Buenos Aires (Retiro) ~18h ($25000-40000 ARS). Desde Foz do Iguaçu ~10 min en taxi (cruzar frontera).",
      auto: "Ruta Nacional 12 desde Posadas (~5h). Ruta 101 desde el sur. Cerca del cruce con Brasil y Paraguay."
    }
  },
  cataratas: {
    descripcion: "Parque Nacional Iguazú — Patrimonio de la Humanidad UNESCO. Una de las 7 Maravillas Naturales del Mundo. Más de 275 saltos distribuidos en 2.7 km de extensión.",
    horarios: "Todos los días de 8:00 a 18:00 (último ingreso 16:30)",
    entradas: {
      argentinos: "$12,000 ARS (aprox)",
      mercosur: "$22,000 ARS (aprox)",
      extranjeros: "$40,000 ARS (aprox)",
      info: "Precios 2025/2026 aproximados. Comprá online en cataratasdeliguazu.com.ar para evitar colas. Menores de 6 años gratis. Jubilados 50% descuento con acreditación."
    },
    comoLlegarAlParque: {
      remis: "Desde Puerto Iguazú centro ~$12000-15000 ARS, 20 min",
      bus: "Colectivo Línea 6 (verde) desde la terminal, $500 ARS aprox, sale cada 30 min",
      excursiones: "La mayoría de hoteles ofrecen transfer incluido o por $10000 ARS",
      estacionamiento: "$3000 ARS por día (cupo limitado, llegar temprano)"
    },
    circuitos: [
      {
        nombre: "Circuito Superior",
        duracion: "1.5 km ~ 1 hora",
        dificultad: "Fácil",
        descripcion: "Pasarelas sobre el río Iguazú, vista panorámica de los saltos desde arriba. Accesible, apto para todas las edades. Ideal para primeras fotos panorámicas."
      },
      {
        nombre: "Circuito Inferior",
        duracion: "2.2 km ~ 1.5 horas",
        dificultad: "Media (escaleras)",
        descripcion: "Sendero que baja hasta la base de los saltos. Vistas espectaculares, te mojás. Escaleras húmedas, cuidado con el calzado. Pasás por el Salto Bosetti, Salto Lanusse."
      },
      {
        nombre: "Garganta del Diablo",
        duracion: "3.6 km ida y vuelta ~ 2-2.5 horas",
        dificultad: "Fácil (plano, pasarela sobre el río)",
        descripcion: "El paseo imperdible. Pasarela sobre el río que lleva al balcón frente a la caída principal de 80m. Sensación única, se siente la vibración del agua. Ideal a la mañana."
      },
      {
        nombre: "Sendero Verde",
        duracion: "2 km ~ 40 min",
        dificultad: "Fácil",
        descripcion: "Caminata por la selva entre los circuitos Superior e Inferior. Se ve flora, fauna y carteles interpretativos."
      }
    ],
    paseosEspeciales: [
      {
        nombre: "Gran Aventura",
        duracion: "~2 horas",
        precio: "$60,000 ARS (aprox)",
        descripcion: "Paseo en camión 4x4 por la selva + navegación debajo de los saltos. ¡Salís empapado! Impermeable incluido. Recomendado: llevar ropa de cambio."
      },
      {
        nombre: "Paseo Ecológico",
        duracion: "~1 hora",
        precio: "$30,000 ARS (aprox)",
        descripcion: "Navegación tranquila en gomón por el río Iguazú. Ideal para fotos y ver fauna sin mojarse tanto."
      },
      {
        nombre: "Paseo en Helicóptero",
        duracion: "10-30 min",
        precio: "Desde $150,000 ARS",
        descripcion: "Vista aérea de las cataratas. Experiencia única, cara pero inolvidable. Salida desde el lado brasileño."
      },
      {
        nombre: "Paseo en Lancha Rápida (Iguazú Jungle)",
        duracion: "~1.5 horas",
        precio: "$50,000 ARS (aprox)",
        descripcion: "Lancha rápida por el río Iguazú. Más velocidad que la Gran Aventura, menos mojada. Ideal para los que quieren adrenalina moderada."
      }
    ],
    recomendaciones: [
      "Llegar temprano (8:00) para evitar multitudes y ver la Garganta del Diablo con luz óptima.",
      "Llevar repelente de insectos (OBLIGATORIO — hay dengue), protector solar, agua y ganas de mojarse.",
      "Usar calzado cómodo antideslizante (las pasarelas se mojan y son resbaladizas).",
      "Si podés, dedicá DOS días: un día completo para los circuitos, otro para paseos especiales.",
      "Impermeable o piloto: en la Garganta y la Gran Aventura te vas a mojar. Llevar ropa de cambio.",
      "Comprar la entrada ONLINE antes, la fila en boletería puede ser de 30-60 min.",
      "Llevar algo de comer (el parque tiene restaurante pero es caro: ~$25000 ARS el plato principal).",
      "Hay guardería de mochilas en la entrada del parque ($5000 ARS).",
      "Cargá el celular antes — vas a sacar muchas fotos y no hay muchos enchufes."
    ]
  },
  restaurantes: [
    { nombre: "La Rueda", tipo: "Parrilla regional", precio: "$$$", direccion: "Av. Córdoba 189, centro", destacado: "El surubí a la parrilla es espectacular. Muy buena relación precio-calidad. Recomiendo la milanesa de surubí." },
    { nombre: "Aqua", tipo: "Cocina de autor", precio: "$$$$", direccion: "Av. Tres Fronteras 720", destacado: "Cocina fusión de primer nivel. Vistas al río, ideal para cena romántica. Reservá con anticipación." },
    { nombre: "Charo", tipo: "Comida regional", precio: "$$", direccion: "Av. Córdoba 156", destacado: "Comida casera misionera. Chipá, mbeyú, sopa paraguaya. Barato y abundante." },
    { nombre: "El Caudillo", tipo: "Parrilla", precio: "$$$", direccion: "Av. Córdoba 259", destacado: "Parrilla tradicional argentina. Buena carne, porciones generosas. El vacío es recomendado." },
    { nombre: "La Mamma", tipo: "Italiana/Pizzas", precio: "$$", direccion: "Félix de Azara 244", destacado: "Pizzas al horno de barro y pastas caseras. Buena opción económica para cenar." },
    { nombre: "Pizzeria Robinson", tipo: "Pizzas", precio: "$", direccion: "Av. Córdoba 215", destacado: "La clásica de la ciudad. Buena para comer rápido y barato." },
    { nombre: "El Paseo", tipo: "Heladería", precio: "$", direccion: "Av. Córdoba 166", destacado: "Helado artesanal. Probá el sabor 'Misionero' (dulce de leche con nuez). Perfecto para el calor." },
    { nombre: "Bambú", tipo: "Cocina fusión/asiática", precio: "$$$", direccion: "Av. Victoria Aguirre 115", destacado: "Opción diferente. Platos con influencia asiática, buenos cocktails. Ambiente moderno." },
    { nombre: "La Rueda del Tiempo", tipo: "Bar/Cervecería", precio: "$$", direccion: "Av. Córdoba 190", destacado: "Cerveza artesanal local. Buen lugar para AFTER del parque. Tienen tablas de picada." }
  ],
  alojamiento: {
    lujo: [
      { nombre: "Meliá Iguazú", detalle: "Único hotel dentro del parque nacional. Acceso exclusivo a las cataratas antes de la apertura. Caro pero experiencia única. Desde $300 USD/noche." },
      { nombre: "Sheraton Iguazú Resort", detalle: "5 estrellas, frente al parque. Buena piscina y vistas. Desde $250 USD/noche." },
      { nombre: "Loi Suites", detalle: "Resort con spa y cancha de golf. A 5 min del parque. Desde $200 USD/noche." },
      { nombre: "Panorama Grand Hotel", detalle: "Vista panorámica de la confluencia de fronteras. Piscina infinita. Desde $180 USD/noche." }
    ],
    medio: [
      { nombre: "Hotel Saint George", detalle: "Buena relación calidad-precio. A 10 min del centro, pileta. $80-120 USD/noche." },
      { nombre: "Hotel Amerian", detalle: "Céntrico, cómodo, buen desayuno. $70-100 USD/noche." },
      { nombre: "Posada 21 de Septiembre", detalle: "Hotel boutique, atención personalizada, pocas habitaciones. $90-130 USD/noche." },
      { nombre: "Ovo Iguazú", detalle: "Moderno, piscina, a pocas cuadras del centro. $60-90 USD/noche." }
    ],
    economico: [
      { nombre: "Hostal El Guembe", detalle: "El hostel clásico de Iguazú. Buen ambiente mochilero. $20-40 USD/noche." },
      { nombre: "Hostel Inn Iguazú", detalle: "Hostel grande con pileta. Buena onda. $15-30 USD/noche." },
      { nombre: "La Aldea de la Selva", detalle: "Cabañas en la selva, buena relación precio-calidad. $40-60 USD/noche." },
      { nombre: "Camping Municipal", detalle: "Opción más barata. $10 USD/noche con carpa propia." }
    ],
    recomendacion: "Si podés, quedate cerca del centro de Puerto Iguazú o sobre ruta 12. El alojamiento dentro del parque (Meliá) es caro pero vale la experiencia."
  },
  otrasAtracciones: [
    {
      nombre: "Hito Tres Fronteras",
      descripcion: "Mirador donde confluyen Argentina, Brasil y Paraguay. Lindo atardecer. Hay feria artesanal y espectáculos de danza los fines de semana.",
      horario: "14:00 a 21:00",
      entrada: "Gratuita",
      tip: "Andá al atardecer, la vista es preciosa. Llevá repelente."
    },
    {
      nombre: "Cataratas lado Brasil (Parque Nacional Iguaçu)",
      descripcion: "Vista panorámica de las cataratas desde el lado brasileño. Tenés una visión completa diferente al lado argentino. Podés hacer safari y paseo de barco.",
      horario: "9:00 a 17:00",
      entrada: "~R$ 100 (extranjeros)",
      tip: "Vale la pena hacer ambos lados. El lado brasileño te da la foto panorámica perfecta."
    },
    {
      nombre: "Parque das Aves (Brasil)",
      descripcion: "Parque de aves enorme al lado del parque brasileño. Tucanes, guacamayos, contacto directo con los animales. Recomendadísimo, especialmente con niños.",
      horario: "8:30 a 17:00",
      entrada: "~R$ 80",
      tip: "Las guacamayas posan para fotos en el hombro. Llevá la cámara lista."
    },
    {
      nombre: "Ciudad del Este (Paraguay)",
      descripcion: "Compras duty-free. Electrónica, perfumes, ropa importada. Mucho más barato que Argentina. Movimiento constante.",
      horario: "Lunes a sábado 8:00 a 18:00",
      entrada: "No necesita visa, solo DNI/pasaporte",
      tip: "Cuidado con cambios de moneda callejeros. Comprá en locales con garantía. Negociá precios."
    },
    {
      nombre: "Misiones Jesuíticas — San Ignacio Miní",
      descripcion: "Ruinas jesuíticas a 4h de Iguazú. Patrimonio UNESCO muestra nocturna con sonido y luz. Vale la pena si tenés un día extra.",
      horario: "8:00 a 18:00",
      entrada: "$5000 ARS (aprox)"
    },
    {
      nombre: "Minas de Wanda",
      descripcion: "Minas de piedras semipreciosas a 40 km de Iguazú. Recorrido guiado de 30 min. Podés comprar piedras. Interesante si vas de paso a San Ignacio.",
      horario: "8:00 a 18:00",
      entrada: "$3000 ARS (aprox)"
    },
    {
      nombre: "La Aripuca",
      descripcion: "Estructura gigante de madera (trampa de animales) en la ruta 12. Restaurante y tienda de artesanías. Parada turística clásica.",
      horario: "9:00 a 18:00",
      entrada: "$5000 ARS (aprox)"
    },
    {
      nombre: "Güirá Oga",
      descripcion: "Centro de rescate de fauna silvestre. Recorrido guiado. Lindo para ver aves rescatadas en serio.",
      horario: "9:00 a 17:00",
      entrada: "$4000 ARS (aprox)"
    }
  ],
  itinerarios: {
    unDia: [
      "1. Llegar al Parque Nacional Iguazú a las 8:00 (apenas abre)",
      "2. Tomar el trencito ecológico directo a Garganta del Diablo (primera hora, menos gente)",
      "3. Volver al centro de visitantes y hacer el Circuito Inferior (mojarse!)",
      "4. Almorzar en el parque (o llevar vianda)",
      "5. Circuito Superior + Sendero Verde",
      "6. Salida ~16:30 y a descansar"
    ],
    dosDias: {
      dia1: [
        "Mañana: Circuito Inferior + Garganta del Diablo (la parte más mojada, mejor temprano)",
        "Tarde: Gran Aventura (lancha bajo los saltos) y recorrer el parque tranqui",
        "Atardecer: Hito Tres Fronteras + cena en La Rueda o Aqua"
      ],
      dia2: [
        "Mañana: Cruce a Foz do Iguaçu para ver el lado brasileño de las cataratas",
        "Tarde: Parque das Aves + compras en Ciudad del Este (opcional)",
        "Noche: cena en el centro de Puerto Iguazú"
      ]
    },
    tresDias: {
      dia1: [
        "Mañana: Circuito Superior + Garganta del Diablo",
        "Tarde: Circuito Inferior + Sendero Verde",
        "Noche: Cena de cocina regional en Charo"
      ],
      dia2: [
        "Lado brasileño: Parque Nacional Iguaçu + Parque das Aves",
        "Compras en Ciudad del Este (tarde)",
        "Cena en Bambú o alguna cervecería artesanal"
      ],
      dia3: [
        "Gran Aventura o Paseo Ecológico por la mañana",
        "Tarde: Misiones Jesuíticas San Ignacio Miní o Minas de Wanda",
        "Cena de despedida en Aqua o La Rueda"
      ]
    }
  },
  emergencias: {
    policia: "101",
    ambulancia: "107",
    bomberos: "100",
    defensaCivil: "103",
    hospital: { nombre: "Hospital SAMIC", direccion: "Av. República Argentina 340", telefono: "+54 3757 421379" },
    policiaTuristica: "0800-555-5065",
    consuladoBrasil: { direccion: "Av. Córdoba 260, Puerto Iguazú", telefono: "+54 3757 423393" },
    consuladoParaguay: { direccion: "Calle Fray L. Beltrán 136, Puerto Iguazú", telefono: "+54 3757 422222" }
  },
  transporteLocal: {
    remis: "Los remises son la forma más cómoda. De centro al parque ~$12000-15000 ARS. Hay paradas en Av. Córdoba y en la terminal.",
    taxi: "Similar a remís pero con taxímetro. Un poco más caro. Fijar precio antes de subir.",
    colectivo: "Línea 6 (verde) une el centro con el Parque Nacional Iguazú. $500 ARS. Sale cada 30 min desde la terminal.",
    alquilerAuto: "Desde $30000 ARS/día. Varias agencias en Av. Córdoba y en el aeropuerto. Necesitás registro y tarjeta de crédito.",
    transfer: "La mayoría de los hoteles ofrecen transfer aeropuerto-hotel. Consultar al reservar."
  },
  gastronomia: [
    "Comida típica: locro, empanadas misioneras (con mandioca), chipá, mbeyú, sopa paraguaya.",
    "Pescados de río: surubí, pacú, dorado (los mejores en restaurantes del puerto).",
    "El surubí es el plato estrella de la región. Probá la milanesa de surubí o el surubí a la parrilla.",
    "Chipá: el pancito de almidón de mandioca y queso. Perfecto para el desayuno o merienda. Lo venden en la calle recién hecho.",
    "Cocina internacional en hoteles grandes (Meliá, Sheraton).",
    "Veganos/vegetarianos: hay opciones limitadas pero crecientes. Aqua y Charo tienen opciones."
  ],
  vidaNocturna: [
    "Mango Latin Bar — Av. Córdoba 216. Música latina, buen ambiente, tragos. Abierto jueves a sábado.",
    "Teatro Bar Iguazú — Av. Córdoba 185. Shows en vivo, bandas locales. Viernes y sábados.",
    "Casino Iguazú — Hotel Amerian. Máquinas y mesas. Abierto hasta las 4 AM.",
    "Cervecería 2000 Misiones — Av. Victoria Aguirre 1450. Cerveza artesanal local. Buena onda relajada.",
    "Biergarten Iguazú — Ruta 12. Cerveza artesanal al aire libre. Ideal para tardes de calor."
  ],
  compras: [
    "Feria Artesanal del Hito Tres Fronteras — Artesanías locales, recuerdos, mates tallados.",
    "Centro comercial de Puerto Iguazú — Av. Córdoba y calles aledañas. Ropa, souvenires, regionales.",
    "Ciudad del Este — Electrónica, perfumes, importados. Cruzar a Paraguay. Cambiar moneda en casas de cambio oficiales.",
    "Brasil — Compras en Foz. Ropa, calzado, electrónica. Aceptan reales y dólares.",
    "Productos regionales: dulce de mamón, yerba mate, alfajores artesanales, vinos misioneros."
  ],
  consejosUtiles: [
    "Cambiá plata en el centro de Iguazú antes de ir al parque (mejor tipo de cambio que en el aeropuerto).",
    "Los cajeros automáticos suelen tener límites bajos ($15000-20000 ARS por transacción). Llevá efectivo.",
    "Si venís desde Brasil, la frontera es ágil pero puede haber fila en hora pico (9-11 AM).",
    "El clima cambia rápido: llevá piloto aunque el día esté soleado.",
    "Comprá la entrada a las Cataratas online (www.cataratasdeliguazu.com.ar) para evitar colas.",
    "Para cruzar a Brasil/Paraguay: necesitás DNI o pasaporte vigente. No se necesita visa para turismo.",
    "Vacunación contra fiebre amarilla recomendada (no obligatoria).",
    "Temporada alta: enero, febrero, julio, Semana Santa, feriados largos. Reservá con antelación.",
    "Temporada baja: marzo a junio y agosto a noviembre. Mejor para evitar multitudes.",
    "Llevar pastillas para el estómago: el agua de la zona puede caer pesada.",
    "Hay WiFi gratis en la terminal de ómnibus y en la mayoría de los restaurantes/cafés.",
    "Tips: en restaurantes 10% es opcional pero bien visto."
  ],
  climaDetallado: {
    verano: "Enero a marzo: 30-40°C, humedad alta, lluvias frecuentes. Ideal para mojarse en los saltos. Llevar ropa liviana y mucha agua.",
    otonio: "Abril a junio: 20-30°C, menos lluvia, temperatura ideal. Mejor época para visitar.",
    invierno: "Julio a agosto: 10-22°C, días lindos, noches frescas. Menos turistas. Llevar buzo.",
    primavera: "Septiembre a diciembre: 22-35°C, aumentando la temperatura y las lluvias hacia diciembre."
  },
  infoUtil: {
    electricidad: "220V — enchufes tipo I (australiano) y C (europeo). Traé adaptador universal.",
    internet: "Buena cobertura 4G en la ciudad. Personal, Movistar, Claro. En el parque señal variable.",
    simCards: "Las tres compañías tienen locales en Av. Córdoba. $5000-10000 ARS con datos.",
    horarioComercial: "Lunes a sábado 9:00-13:00 y 16:00-20:00. Domingos cerrado (excepto supermercados y farmacias).",
    propina: "10% en restaurantes es opcional. Propina a guías: $2000-5000 ARS por persona (a criterio)."
  }
};
