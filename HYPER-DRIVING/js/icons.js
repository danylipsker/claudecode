/* Hyper Driving · icons.js — interface icons (24 × 24, stroked with
 * currentColor). D.icon('book') → an <svg> string. Icons that point a way
 * (back, next) carry class "dir" and are mirrored in right-to-left layouts.
 */
(function (D) {
  'use strict';
  const P = {
    home: 'M3 11 12 4l9 7M5 10v10h5v-6h4v6h5V10',
    book: 'M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5C4.7 20 4 19.3 4 18.5zM20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5z',
    sign: 'M12 3 21.5 19.5h-19zM12 10v4M12 16.8v.2',
    car: 'M5 16v3M19 16v3M3.5 16h17v-4l-2-5.2c-.3-.8-1-1.3-1.8-1.3H7.3c-.8 0-1.5.5-1.8 1.3L3.5 12zM3.5 12h17M7 14h1M16 14h1',
    check: 'M4 12.5 9 17.5 20 6.5',
    quiz: 'M9.1 9a3 3 0 1 1 3.9 2.9c-.6.2-1 .8-1 1.4V14M12 17.5v.1M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    dict: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11M9 8h6',
    update: 'M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5',
    settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    search: 'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM21 21l-5.2-5.2',
    back: 'M15 5 8 12l7 7',
    next: 'M9 5l7 7-7 7',
    close: 'M6 6l12 12M18 6 6 18',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
    flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
    star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z',
    bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
    wrench: 'M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3.5-3.5 8-8M14.7 6.3 9 12M14.7 6.3a4 4 0 0 1 5-3.3l-3 3 .3 2.7 2.7.3 3-3',
    gauge: 'M4 17a8 8 0 1 1 16 0M12 17l4-6M7 13l-1-.6M17 13l1-.6M12 9V8',
    tree: 'M12 3v5M6 13V9h12v4M4 13h4v4H4zM16 13h4v4h-4zM10 8h4',
    calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
    tool: 'M4 20l7-7M14 4l6 6-3 3-6-6zM9 13l2 2',
    law: 'M12 3v18M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0zM8 21h8',
    bell: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0',
    edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
    download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
    upload: 'M12 20V9M7 14l5-5 5 5M5 4h14',
    trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
    info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5v.1',
    warn: 'M12 3 21.5 19.5h-19zM12 10v4M12 16.8v.2',
    moto: 'M5.5 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18.5 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5.5 15l4-6h5l4 6M9.5 9 8 6H5M14 6h3l1.5 3',
    truck: 'M3 6h11v10H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    bus: 'M5 4h14v13H5zM5 10h14M8 20v-3M16 20v-3M8 14h.1M16 14h.1',
    tractor: 'M7 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM10 11V5h5l1 6M16 11h4v6h-2M11 17h5',
    person: 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
    eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    drop: 'M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z',
    leaf: 'M5 19C5 10 11 5 20 4c0 9-5 15-14 15zM5 19l7-7',
    siren: 'M7 18v-6a5 5 0 0 1 10 0v6M5 18h14v3H5zM12 3v2M4.2 6.2l1.4 1.4M19.8 6.2l-1.4 1.4',
    plug: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4',
    road: 'M8 3 4 21M16 3l4 18M12 4v3M12 11v3M12 18v2',
    light: 'M9 3h6v18H9zM12 7.5v.1M12 12v.1M12 16.5v.1',
    junction: 'M12 3v18M3 12h18',
    cycle: 'M6 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM6 14.5 9.5 8h5L18 14.5M9.5 8l2.5 6.5L14.5 8',
    coin: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15 9.5c-.5-1-1.6-1.5-3-1.5-1.8 0-3 .9-3 2s1 1.8 3 2 3 .9 3 2-1.2 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2',
    speed: 'M4 17a8 8 0 1 1 16 0M12 17l5-5M12 17v.1',
    moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
    brake: 'M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM4.5 5.5a10 10 0 0 0 0 13M19.5 5.5a10 10 0 0 1 0 13M12 9v4M12 15.5v.1',
    steer: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM3.5 11 10 12M20.5 11 14 12M12 14v7',
    tyre: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    engine: 'M4 9h3V7h6v2h2l2 2h2v6h-2l-2 2H8l-2-2H4zM9 7V5h4v2',
    battery: 'M4 8h16v11H4zM7 5v3M17 5v3M8 13h3M15 11.5v3M13.5 13h3',
    shield: 'M12 3 5 6v6c0 4.4 3 7.5 7 9 4-1.5 7-4.6 7-9V6z',
    gear: 'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
  };
  const DIR = new Set(['back', 'next']);
  D.icon = (name, size) => {
    const d = P[name] || P.info;
    const s = size || 22;
    return `<svg class="ico${DIR.has(name) ? ' dir' : ''}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  };
  D.iconNames = Object.keys(P);
})(globalThis.Drive = globalThis.Drive || {});
