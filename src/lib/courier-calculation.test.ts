import assert from 'node:assert/strict';
import { calculateCourierCost } from './courier-calculation.ts';

// ===== COURIER PRIVADO (DHL, FedEx) =====

// Franquicia: base ≤ 400
const r300 = calculateCourierCost({ valorDeclarado: 300, costoEnvio: 0, channel: 'privado' });
assert.equal(r300.regime, 'franquicia');
assert.equal(r300.base, 300);
assert.equal(r300.iva, 63);               // 300 × 0.21
assert.equal(r300.arancelExcedente, 0);
assert.equal(r300.costoFinal, 363);
assert.ok(Math.abs(r300.multiplicador - 1.21) < 0.001);

const r400 = calculateCourierCost({ valorDeclarado: 400, costoEnvio: 0, channel: 'privado' });
assert.equal(r400.regime, 'franquicia');
assert.equal(r400.iva, 84);
assert.equal(r400.arancelExcedente, 0);
assert.equal(r400.costoFinal, 484);

// Excedente: 400 < base ≤ 3000
const r800 = calculateCourierCost({ valorDeclarado: 800, costoEnvio: 0, channel: 'privado' });
assert.equal(r800.regime, 'excedente');
assert.equal(r800.iva, 168);              // 800 × 0.21
assert.equal(r800.arancelExcedente, 200); // (800-400) × 0.50
assert.equal(r800.totalImpuestos, 368);
assert.equal(r800.costoFinal, 1168);

// Con costo de envío incluido en la base
const rConEnvio = calculateCourierCost({ valorDeclarado: 450, costoEnvio: 60, channel: 'privado' });
assert.equal(rConEnvio.base, 510);
assert.equal(rConEnvio.regime, 'excedente');
assert.equal(rConEnvio.iva, 107.1);       // 510 × 0.21
assert.equal(rConEnvio.arancelExcedente, 55); // (510-400) × 0.50

// Supera límite
const r3500p = calculateCourierCost({ valorDeclarado: 3500, costoEnvio: 0, channel: 'privado' });
assert.equal(r3500p.regime, 'supera_limite');
assert.equal(r3500p.costoFinal, 0);

// ===== CORREO ARGENTINO / PUERTA A PUERTA =====

// Franquicia: base ≤ 50 → exento total, ni IVA
const rCA30 = calculateCourierCost({ valorDeclarado: 30, costoEnvio: 0, channel: 'correo_argentino' });
assert.equal(rCA30.regime, 'franquicia');
assert.equal(rCA30.iva, 0);
assert.equal(rCA30.arancelExcedente, 0);
assert.equal(rCA30.costoFinal, 30);
assert.ok(Math.abs(rCA30.multiplicador - 1.0) < 0.001);

const rCA50 = calculateCourierCost({ valorDeclarado: 50, costoEnvio: 0, channel: 'correo_argentino' });
assert.equal(rCA50.regime, 'franquicia');
assert.equal(rCA50.iva, 0);
assert.equal(rCA50.costoFinal, 50);

// Excedente sobre $50: 50% all-inclusive (sin IVA)
const rCA300 = calculateCourierCost({ valorDeclarado: 300, costoEnvio: 0, channel: 'correo_argentino' });
assert.equal(rCA300.regime, 'excedente');
assert.equal(rCA300.iva, 0);
assert.equal(rCA300.arancelExcedente, 125); // (300-50) × 0.50
assert.equal(rCA300.costoFinal, 425);

const rCA800 = calculateCourierCost({ valorDeclarado: 800, costoEnvio: 0, channel: 'correo_argentino' });
assert.equal(rCA800.arancelExcedente, 375); // (800-50) × 0.50
assert.equal(rCA800.costoFinal, 1175);

// Supera límite
const rCA3500 = calculateCourierCost({ valorDeclarado: 3500, costoEnvio: 0, channel: 'correo_argentino' });
assert.equal(rCA3500.regime, 'supera_limite');
assert.equal(rCA3500.costoFinal, 0);

// ===== EDGE CASES =====
const r0 = calculateCourierCost({ valorDeclarado: 0, costoEnvio: 0, channel: 'privado' });
assert.equal(r0.regime, 'franquicia');
assert.equal(r0.costoFinal, 0);
assert.equal(r0.multiplicador, 0);

console.log('✓ Todos los tests de courier-calculation pasaron');
