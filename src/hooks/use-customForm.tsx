import { useState } from "react"

export function useCustomForm<T extends Record<string, any>>(initialForm: T) {
  const [formState, setFormState] = useState(initialForm)

  function onResetForm() {
    setFormState(initialForm)
  }

  const handleExteranlInput = (name: string, value: string) => {
    console.log(`Custom form ${name}: ${value}`)
    setFormState({
      ...formState,
      [name]: value
    })
  }

  const onInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value
    })
  }
  return {
    ...formState,
    formState,
    onInputChange,
    setFormState,
    onResetForm,
    handleExteranlInput
  }
}

