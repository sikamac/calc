---
title: "Derechos aduaneros en Argentina: aranceles, impuestos y pago sin cuotas"
date: 2026-06-26
category: "Impuestos"
image: "../../assets/images/guides/derechos-aduaneros-aranceles-importacion-argentina.png"
description: "Guía práctica para calcular derechos aduaneros, aranceles, IVA, percepciones y gastos de importación en Argentina, y entender por qué no se pagan en cuotas."
author: "Equipo de GIST POINT"
tags: ["derechos aduaneros", "aranceles", "calculadora aduana", "costos importación", "ARCA"]
---

Los **derechos aduaneros** son solo una parte del costo de importar. Si querés saber cuánto cuesta realmente traer un producto a Argentina, no alcanza con mirar el arancel: también tenés que contemplar flete, seguro, tasa estadística, IVA, percepciones, gastos bancarios, despachante y costos de depósito o manejo.

Esta guía está pensada para responder tres preguntas frecuentes:

- Qué se paga cuando importás.
- Cómo calcular los gastos aduaneros completos.
- Si los derechos aduaneros se pueden pagar en cuotas.

Respuesta corta a la tercera: **no, los tributos aduaneros no se pagan en cuotas para liberar mercadería**.

## Derechos aduaneros no es lo mismo que costo total

En la práctica, mucha gente usa "derechos aduaneros", "aranceles", "impuestos de aduana" y "gastos aduaneros" como si fueran sinónimos. Para calcular bien, conviene separarlos.

| Concepto | Qué representa |
|---|---|
| Arancel o derecho de importación | Porcentaje aplicado según NCM, origen y régimen. |
| Derecho antidumping | Derecho adicional si el producto está alcanzado por una medida antidumping. |
| Tasa estadística | Tasa sobre la operación, con topes según monto. |
| IVA | Impuesto sobre una base que incluye valor CIF y tributos aduaneros. |
| IVA adicional | Percepción adicional de IVA cuando corresponde. |
| Percepción de Ganancias | Anticipo o percepción vinculada al impuesto a las ganancias. |
| Percepción de Ingresos Brutos | Percepción provincial, según jurisdicción y situación fiscal. |
| Gastos operativos | Transferencia bancaria, despachante, depósito fiscal, manejo y documentación. |

Por eso una "calculadora de aranceles" que solo multiplica el CIF por un porcentaje se queda corta.

## La fórmula base: de EXW a CIF

La calculadora parte de esta lógica:

```text
Valor CIF = Valor EXW + flete internacional + seguro
```

El **valor EXW** es el valor pactado con el proveedor según el Incoterm acordado. Si la cotización está en FOB, CIF, DDP u otro Incoterm, primero hay que entender qué costos ya están incluidos para no duplicar ni omitir gastos.

Si todavía no tenés claro ese punto, conviene leer la guía sobre [Incoterms y costo de importación](/blog/que-son-los-incoterms).

## Impuestos aduaneros que considera la calculadora

En la pestaña **Precio de compra**, la calculadora contempla estos bloques.

### Arancel según NCM

El arancel depende de la clasificación arancelaria del producto. La tasa correcta no se adivina por rubro general: se valida con el código NCM.

```text
Arancel = Valor CIF x tasa arancelaria
```

Si no estás seguro del código, revisá la guía de [clasificación arancelaria NCM](/blog/ncm-clasificacion-arancelaria).

### Derecho antidumping

Algunos productos pueden estar alcanzados por derechos antidumping. No aplica siempre, pero cuando aplica puede cambiar totalmente la rentabilidad de la operación.

```text
Derecho antidumping = Valor CIF x tasa antidumping
```

### Tasa estadística

La calculadora toma una tasa estadística del **0,5%** con topes máximos por tramo. Es un concepto que muchas simulaciones simples olvidan.

En la lógica actual de la herramienta, los topes son:

| Valor EXW | Tope de tasa estadística |
|---|---:|
| Hasta USD 10.000 | USD 180 |
| Hasta USD 100.000 | USD 3.000 |
| Hasta USD 1.000.000 | USD 30.000 |
| Más de USD 1.000.000 | USD 150.000 |

### Base para impuestos

Después de calcular arancel, antidumping y tasa estadística, la calculadora arma una base:

```text
Base para impuestos = CIF + arancel + antidumping + tasa estadística
```

Sobre esa base se calculan IVA y percepciones.

## IVA, IVA adicional, Ganancias e Ingresos Brutos

El costo real no termina en el arancel.

La calculadora contempla:

- **IVA**, normalmente cargado como 21%, aunque puede variar según tratamiento.
- **IVA adicional**, configurado como 0%, 10% o 20%.
- **Percepción de Ganancias**, cargada por defecto como 6%.
- **Percepción de Ingresos Brutos**, cargada por defecto como 2,5%.

Estas tasas deben validarse contra tu situación fiscal, producto, jurisdicción y régimen de importación. La calculadora permite moverlas porque no todos los importadores tienen el mismo caso.

## Gastos operativos que también suman

Además de tributos, la calculadora incorpora costos que pegan directo en caja:

- **Costo de transferencia bancaria internacional.**
- **Gastos de despachante.**
- **Depósito fiscal, manejo y documentación.**
- **Flete internacional.**
- **Seguro.**

Estos conceptos no siempre son "impuestos", pero sí forman parte del costo de adquisición. Si los dejás afuera, el precio de venta sale mal.

## Ejemplo completo de cálculo

Supongamos esta operación:

| Concepto | Valor |
|---|---:|
| Valor EXW | USD 1.000 |
| Flete | USD 150 |
| Seguro | USD 30 |
| Valor CIF | USD 1.180 |
| Arancel | 18% |
| Antidumping | 0% |
| IVA | 21% |
| IVA adicional | 20% |
| Ganancias | 6% |
| Ingresos Brutos | 2,5% |
| Transferencia bancaria | USD 30 |
| Despachante | USD 100 |
| Depósito/manejo/documentación | USD 50 |

Cálculo simplificado:

| Concepto | Cálculo | Importe |
|---|---:|---:|
| Arancel | 18% sobre USD 1.180 | USD 212,40 |
| Antidumping | 0% sobre USD 1.180 | USD 0,00 |
| Tasa estadística | 0,5% con tope aplicable | USD 5,00 |
| Base para impuestos | CIF + arancel + antidumping + tasa | USD 1.397,40 |
| IVA | 21% sobre base | USD 293,45 |
| IVA adicional | 20% sobre base | USD 279,48 |
| Ganancias | 6% sobre base | USD 83,84 |
| Ingresos Brutos | 2,5% sobre base | USD 34,94 |
| Gastos operativos | transferencia + despachante + depósito | USD 180,00 |
| Costo final estimado | suma total | USD 2.269,11 |

En este ejemplo, el producto de USD 1.000 termina costando aproximadamente **2,27 veces el valor EXW** antes de venderlo.

## Se pueden pagar derechos aduaneros en cuotas

No. **Los derechos aduaneros, tributos y gastos necesarios para liberar mercadería no se pagan en cuotas.**

En términos prácticos:

- En **courier**, el pago suele ser anticipado o previo a la entrega. Si no se paga, el envío no avanza.
- En **Puerta a Puerta**, ARCA informa que el Correo genera una liquidación que debe cancelarse en el plazo indicado.
- En **despacho formal**, puede haber dinámica de pago a vista según la operación y el circuito del despachante, pero la mercadería no se libera si la liquidación aduanera correspondiente no está cancelada.

Puede existir financiación por fuera, por ejemplo con una tarjeta, banco o tercero, pero eso no convierte el tributo aduanero en una deuda pagable en cuotas ante Aduana. Para Aduana, el pago relevante es el que permite liberar la mercadería.

## Cuándo se pagan

La regla operativa es simple: **antes de liberar o recibir la mercadería**.

El momento exacto depende del canal:

| Canal | Cómo suele funcionar |
|---|---|
| Courier | El courier informa tributos y gastos; se pagan antes de entrega o liberación. |
| Puerta a Puerta | El Correo genera liquidación; se paga dentro del plazo indicado. |
| Despacho formal | El despachante coordina declaración, liquidación y pago antes del libramiento. |

ARCA explica para Puerta a Puerta que, cuando corresponde pagar, la web del Correo genera una liquidación y que debe cancelarse en el plazo informado. También indica que el servicio aduanero puede ajustar el valor declarado y generar una liquidación complementaria. Podés verlo en la página oficial sobre [monto a abonar en Puerta a Puerta](https://www.afip.gob.ar/envios-internacionales/puerta-a-puerta/monto.asp).

## Qué pasa si Aduana ajusta el valor

El valor declarado no siempre queda firme. Si en una verificación Aduana entiende que el valor o la descripción no reflejan la mercadería, puede pedir documentación o ajustar la liquidación.

Para reducir problemas, guardá:

- Factura comercial o comprobante de compra.
- Comprobante de pago.
- Captura o detalle del producto publicado.
- Tracking y documentación del envío.
- Descripción técnica.
- Datos del proveedor.

## Cómo usar una calculadora de aduana sin engañarte

Usá la calculadora para escenarios, no como reemplazo de una clasificación profesional.

Te sirve para responder:

- Cuánto cambia el costo si el flete sube.
- Qué pasa si el arancel no es 14% sino 18%, 25% o 35%.
- Cuánto pesa el IVA adicional.
- Cuánto afecta la percepción de Ganancias.
- Cuánto suman IIBB, transferencia, despachante y depósito fiscal.
- Qué precio de venta necesitás para conservar margen.

El punto clave es mirar el costo completo. Si solo calculás "producto + arancel", probablemente estés subestimando la operación.

## Conclusión

Los derechos aduaneros importan, pero no explican todo el costo. Una importación real puede incluir EXW, flete, seguro, arancel, antidumping, tasa estadística, IVA, IVA adicional, Ganancias, Ingresos Brutos, transferencia bancaria, despachante, depósito fiscal, manejo y documentación.

Y sobre el pago: **no hay cuotas aduaneras para liberar mercadería**. Planificá la caja antes de comprar, porque la liquidación se paga antes de recibir o liberar el envío.

## Fuentes y validaciones útiles

- ARCA: [Envíos internacionales por courier](https://www.afip.gob.ar/envios-internacionales/courier/).
- ARCA: [Monto a abonar en Puerta a Puerta](https://www.afip.gob.ar/envios-internacionales/puerta-a-puerta/monto.asp).
- VUCE: [Ventanilla Única de Comercio Exterior](https://www.vuce.gob.ar/), útil para consultar información de comercio exterior, posiciones, requisitos y normativa.
