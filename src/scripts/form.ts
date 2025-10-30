// form script
export function handleFormSubmit(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const name = (form.name as unknown as HTMLInputElement).value;
  const surname = (form.surname as unknown as HTMLInputElement).value;
  console.log(`Nom: ${name}\nCognoms: ${surname}`);
}