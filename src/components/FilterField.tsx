'use client'

import { useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from '@headlessui/react'
import { TbCheck, TbChevronDown } from 'react-icons/tb'

type Option = {
  label: string
  value: string
}

type FilterFieldProps = {
  label: string
  name: string
  options: Option[]
}

export default function FilterField({
  label,
  name,
  options,
}: FilterFieldProps) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const defaultValue = searchParams.getAll(name)

  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultValue)
  const [comboboxQuery, setComboboxQuery] = useState('')

  const filteredOptions =
    comboboxQuery === ''
      ? options
      : options.filter((option) => {
          return option.label
            .toLowerCase()
            .includes(comboboxQuery.toLowerCase())
        })

  const onClose = () => {
    setComboboxQuery('')

    const params = new URLSearchParams(searchParams)

    params.delete(name)

    if (selectedOptions.length > 0) {
      for (const option of selectedOptions) {
        params.append(name, option)
      }
    }

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Field>
      <Label>{label}</Label>
      <Combobox
        name={name}
        multiple
        immediate
        value={selectedOptions}
        onChange={setSelectedOptions}
        onClose={onClose}
      >
        <div className="relative">
          <ComboboxInput
            autoComplete="off"
            displayValue={(opts: string[]) => {
              const values: string[] = []

              opts.forEach((opt) => {
                const option = options.find((o) => o.value === opt)

                if (option) values.push(option.label)
              })

              return values.join(', ')
            }}
            onChange={(e) => setComboboxQuery(e.target.value)}
            className="pr-10"
          />
          <ComboboxButton className="absolute bottom-0 right-0 top-0 px-2">
            <TbChevronDown aria-hidden className="h-5 w-5" />
            <span className="sr-only">Open</span>
          </ComboboxButton>
        </div>
        <ComboboxOptions className="divide-y py-1">
          {filteredOptions.map((option) => (
            <ComboboxOption
              key={option.value}
              value={option.value}
              className="group flex cursor-pointer items-center space-x-2 py-1"
            >
              <TbCheck
                aria-hidden
                className="invisible h-4 w-4 group-data-[selected]:visible"
              />
              <span>{option.label}</span>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </Field>
  )
}
