'use strict';
import { Universe } from "/universe.js";

const CELL_SIZE = 10;

function bigBang() {
  const canvas = document.getElementById('universe');
  const universe = new Universe(canvas, window.innerHeight, window.innerWidth, CELL_SIZE);
  universe.makeFirstGeneration();
  setInterval(() => universe.makeNextGeneration(), 300);
}

window.onload = bigBang;
