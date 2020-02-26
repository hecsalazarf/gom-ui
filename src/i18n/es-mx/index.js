export default {
  order: {
    label: 'Pedido | Pedidos',
    new: 'Nuevo pedido',
    review: 'Resumen',
    description: 'Nombre del pedido',
    details: 'Detalles',
    createdAt: 'Pedido el',
    updatedAt: 'Actualizado el',
    dates: 'Fechas',
    confirm_exit_title: 'Tienes un pedido en proceso',
    confirm_exit_message: 'Al continuar perderás los cambios ¿Continuar?',
    status: {
      label: 'Estado',
      options: {
        OPEN: { label: 'Nuevo' },
        IN_PROCESS: { label: 'En proceso' },
        CLOSED: { label: 'Cancelado' },
        WON: { label: 'Entregado' }
      }
    },
    step1_desc: 'Agrega los artículos a tu pedido',
    step2_desc: 'Agrega una descripción',
    step3_desc: 'Confirma y envía tu pedido',
    submit: 'Enviar pedido',
    rules: {
      too_much: 'Ups, demasiado',
      minimum: 'Debe haber al menos {count}'
    }
  },
  customer: {
    label: 'Cliente | Clientes',
    name: 'Nombre',
    new: 'Nuevo cliente',
    make_call: 'Llamar por teléfono',
    send_email: 'Enviar correo electrónico',
    email: 'Correo electrónico',
    phone: 'Teléfono | Teléfonos',
    extuid_code: 'Código de cliente',
    share_link_help: 'Comparte este código para que tu cliente pueda realizarte pedidos.',
    rules: {
      phone_length: 'Teléfono debe tener {count} dígitos',
      pick_customer: 'Selecciona cliente',
      with_active_orders: 'No puedes eliminar a un cliente con pedidos activos'
    }
  },
  promo: {
    label: 'Promoción | Promos',
    active: 'Activa | Activas',
    iddle: 'Inactiva | Inactivas',
    details: 'Detalles',
    publishing: 'Publicaciones',
    review: 'General',
    content: 'Contenido',
    log: 'Historial',
    code: 'Código',
    name: 'Nombre',
    start: 'Inicio',
    end: 'Fin',
    category: 'Categoría',
    createdAt: 'Creado el',
    updatedAt: 'Actualizado el',
    publish: 'Publicar',
    notification: 'Notificación | Notificaciones'
  },
  publication: {
    publishedAt: 'Publicado el {date}',
    errorAt: 'No publicado - {date}',
    startIn: 'Comienza en {time}'
  },
  time: {
    now: 'Ahora',
    one_day_later: 'Mañana',
    one_hour_later: 'Una hora después',
    second: 'segundo | 1 segundo | {n} segundos',
    minute: 'minuto | 1 minuto | {n} minutos',
    hour: 'hora | 1 hora | {n} horas'

  },
  pricing: {
    label: 'Precio | Precios',
    total: 'Total',
    to_be_confirmed: 'Espera la confirmación del precio total de tu pedido'
  },
  item: {
    label: 'Artículo | Artículos',
    description: 'Descripción',
    code: 'Código',
    quantity: 'Cantidad',
    provider: 'Marca',
    add_item: 'Agregar articulo',
    new: 'Nuevo artículo'
  },
  app: {
    label: 'Gom',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    abort: 'Cancelar',
    search: 'Buscar',
    update: 'Actualizar',
    confirm: 'Confirmación',
    yes: 'Sí',
    no: 'No',
    update_found: 'Una versión más reciente de la aplicación está disponible.',
    options_menu: 'Menú de opciones',
    sign_out: 'Cerrar sesión',
    continue_question: '¿Continuar?',
    delete_confirm: 'Quieres eliminar a {object}',
    go_back: 'Volver',
    see_more: 'Ver más',
    filter_by_status: 'Filtrar por estado',
    no_results: 'Sin resultados',
    to: 'para',
    user_name: 'Usuario',
    password: 'Contraseña',
    sign_in: 'Iniciar sesión',
    invalid_reference: 'Referencia inválida',
    customer_welcome: 'Estás intentando acceder al centro de pedidos de',
    complete_phone: 'Completa tu número telefónico con el que fuiste registrado',
    enter_shareid: 'Introduce tu ID único de cliente',
    missing_shareid: 'Si no cuentas con él, solícitalo a tu vendedor',
    share: 'Compartir con',
    copy_link: 'Copiar enlace',
    copied_to_clipboard: 'Copiado al portapapeles',
    not_a_customer: '¿No eres cliente?',
    not_a_seller: '¿No eres vendedor?',
    to_be_confirmed: 'Por confirmar',
    minute: ' | {n} minuto | {n} minutos',
    for_better_ux: 'Para una mejor experiencia utiliza',
    next_step: 'Paso siguiente',
    prev_step: 'Paso anterior',
    rules: {
      required: 'Campo requerido',
      max_length: 'Máximo {count} caracteres',
      fixed_length: 'Se requieren {count} caracteres'
    }
  },
  notifications: {
    positive: {
      changes_saved: 'Cambios guardados'
    },
    error: {
      generic: 'Ups algo salió mal, inténtalo más tarde :(',
      wrong_credentials: 'Usuario o contraseña incorrectos',
      signin_failed: 'No pudimos iniciar sesión. Inténtalo más tarde',
      too_many_requests: 'Demasiados intentos. Vuelve en',
      page_not_found: 'No pudimos encontrar la página',
      incompatible_browser: 'Tu navegador no es compatible'
    }
  }
}
