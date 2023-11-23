import { useState } from "react"

export default function useForm(getFreshModelObject: any) {
  const [values, setValues] = useState(getFreshModelObject())
  const [errors, setErrors] = useState<any>({})

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
  }
}
