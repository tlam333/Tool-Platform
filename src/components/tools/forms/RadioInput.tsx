import { UseFormRegister, FieldError } from "react-hook-form";
import { Colors } from "@/lib/constants";

type RadioInput = {
  key: string;
  value: string;
};

interface RadioInputProps {
  name: string;
  label?: string;
  radioInput: string[];
  register: UseFormRegister<any>;
  required?: boolean;
  divClassName?: string;
}

const RadioInput: React.FC<RadioInputProps> = ({
  name,
  label,
  register,
  radioInput,
  required = false,
  divClassName = "flex flex-col gap-1",
}) => {
  return (
    <div className={divClassName}>
      {label && (
        <label className="text-left text-gray-600 text-lg">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {radioInput.map((item, index) => (
        <div className="form-control" key={name + "-" + item}>
          <label
            htmlFor={name + "-" + item}
            className="flex gap-5 p-2  cursor-pointer"
          >
            <input
              type="radio"
              key={name + "-" + item}
              id={name + "-" + item}
              {...register(name)}
              value={item}
              className="radio checked:bg-primary"
            />
            <span
              className={
                "label-text badge-outline badge badge-" + Colors[index]
              }
            >
              {item}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioInput;
