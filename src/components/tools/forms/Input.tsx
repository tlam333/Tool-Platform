import { UseFormRegister, FieldError } from "react-hook-form";

interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  error?: FieldError | undefined;
  divClassName?: string;
  readonly?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  register,
  required = false,
  error,
  divClassName = "flex flex-col gap-1",
  readonly = false,
}) => {
  return (
    <div className={divClassName}>
      {label && (
        <label htmlFor={name} className="text-left text-gray-600 text-lg">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {type != "textarea" && (
        <input
          className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-900 text-sm shadow focus:outline-gray-400"
          type={type}
          id={name}
          placeholder={placeholder}
          {...register(name, { required })}
          readOnly={readonly}
        />
      )}
      {type == "textarea" && (
        <textarea
          className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-800 text-sm shadow focus:outline-gray-400"
          id={name}
          style={{ whiteSpace: "pre-wrap" }}
          placeholder={placeholder}
          {...register(name, { required })}
          readOnly={readonly}
        ></textarea>
      )}
      {error && <p>{error.message}</p>}
    </div>
  );
};

export default Input;
