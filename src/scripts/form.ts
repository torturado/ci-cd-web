// form script
export function handleFormSubmit(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const name = (form.elements.namedItem('name') as HTMLInputElement).value;
  const surname = (form.elements.namedItem('surname') as HTMLInputElement).value;
  console.log(`Nom: ${name}\nCognoms: ${surname}`);
}