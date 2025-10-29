# Projecte Demo CI/CD

Projecte web senzill per provar un flux de CI/CD amb GitHub Actions.

## Flux

1.  **CI (Integració Contínua)**: A cada *push* o *Pull Request* a `main`, s'executa un *workflow* que:
    * Instal·la dependències (`npm i`)
    * Comprova el codi (`npm run lint`)
    * Executa els tests (`npm test`)
    * Construeix el lloc (`npm run build`)

2.  **CD (Desplegament Contínu)**: Si la CI passa i el canvi és un *merge* a `main`, es desplega automàticament a GitHub Pages.

## Lloc web

Pots veure la web desplegada aquí: https://torturado.github.io/ci-cd-web

## Estat del Pipeline

![CI & CD](https://github.com/torturado/ci-cd-web/actions/workflows/ci-cd.yml/badge.svg)
