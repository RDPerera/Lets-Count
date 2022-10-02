export default function calculatePizzasNeeded(
  numberOfPeople,
  slicesPerPerson,
  slicesPerPizzas = 9,
) {
  return Math.ceil(numberOfPeople * slicesPerPerson / slicesPerPizzas);
}
