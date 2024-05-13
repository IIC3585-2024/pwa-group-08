# Lebron Money - Aplicación Web Progresiva (PWA)

¡Bienvenido a Lebron Money! Esta es una aplicación web progresiva (PWA) inspirada en SplittyPie, diseñada para gestionar gastos compartidos entre amigos de manera eficiente. Lebron Money ha sido desarrollada como parte del desafío para experimentar con las tecnologías asociadas a las PWAs.

## Objetivos

1. **Capacidad de funcionar offline de forma limitada**: Utilizando la Cache API y la IndexedDB API para almacenar datos localmente y permitir el acceso a ciertas funcionalidades incluso sin conexión a Internet. Las funcionalidades que no funcionan offline son el servicio de notificaciones.
2. **Manejo de notificaciones push**: Se realizó integrando Firebase Cloud Messaging (FCM).
3. **Instalable en la página de inicio de un dispositivo y funcionamiento a pantalla completa**: Se permite instalar la aplicación en la pantalla de inicio de su dispositivo y disfrutar de una experiencia a pantalla completa (se debe instalar desde Google Chrome).

## Funcionalidades Principales

- Registro y gestión de gastos compartidos entre amigos.
- División equitativa de gastos entre participantes, según quienes están involucrados en cada transacción.
- Visualización de resúmenes y estadísticas de gastos.

## Tecnologías Utilizadas

- **Cache API**: Para almacenar en caché recursos estáticos y mejorar la experiencia offline.
- **IndexedDB API**: Para almacenar datos localmente y permitir el acceso offline a la información.
- **Firebase Cloud Messaging (FCM)**: Para enviar notificaciones push a los usuarios.
- **Service Worker**: Para proporcionar funcionalidades offline y mejorar el rendimiento.
- **Manifest JSON**: Para configurar la instalabilidad y la apariencia de la aplicación en dispositivos móviles.

## Demostración

Para visualizar y probar Lebron Money:

1. Accede al siguiente enlace: [Lebron Money - Demo](https://iic3585-2024.github.io/pwa-group-08/#)
2. Asegúrate de usar un navegador compatible con PWAs, como Google Chrome.
3. Explora las funcionalidades de la aplicación y observa cómo funciona offline. La aplicación envia notificaciones cuando se crean transacciones.
4. Si es posible, muestra la instalación de la aplicación en la pantalla de inicio de un dispositivo móvil y su funcionamiento a pantalla completa.


---
