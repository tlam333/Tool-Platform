import { UseFormRegister, FieldError } from "react-hook-form";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  error?: FieldError | undefined;
  divClassName?: string;
  list: string[];
  readonly?: boolean;
}

export default function DropDown({
  name,
  label,
  placeholder,
  register,
  required = false,
  error,
  divClassName = "flex flex-col gap-1",
  list,
  readonly = false,
}: Props) {
  return (
    <div className={divClassName}>
      {label && (
        <label htmlFor={name} className="text-left text-gray-600 text-lg">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className="select focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-900 text-sm shadow focus:outline-gray-400"
        id={name}
        {...register(name, { required })}
        disabled={readonly}
        defaultValue={""}
      >
        <option value="" disabled>
          {placeholder} -
        </option>
        {list.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-500">
          {error.message?.replace(/^"(.*)"$/, "$1")}
        </p>
      )}
    </div>
  );
}
