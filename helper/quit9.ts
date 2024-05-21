export const quitNumber9 = (number: string): string => {
  
  const numberCel = number;
  const indiceAEliminar = 2;
  const newNumberCel = numberCel.slice(0, indiceAEliminar) + numberCel.slice(indiceAEliminar + 1);
  console.log("SIN", newNumberCel);

  return newNumberCel;
};
