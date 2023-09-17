interface Props {
  title: string;
  name: string;
  checked?: boolean;
}

function Checkbox({ title, name, checked }: Props) {
  return (
    // <div className="flex items-center p-1">
    //   <RedixCheckbox.Root
    //     className="shadow-blackA7 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px_black]"
    //     checked={checked}
    //     name={name}
    //     id={name + "-checkbox"}
    //   >
    //     <RedixCheckbox.Indicator className="text-violet11">
    //       <CheckIcon />
    //     </RedixCheckbox.Indicator>
    //   </RedixCheckbox.Root>
    //   <label
    //     className="pl-[15px] text-[15px] leading-none"
    //     htmlFor={name + "-checkbox"}
    //   >
    //     {title}
    //   </label>
    // </div>
    <div className="form-control">
  <label className="label cursor-pointer">
    <span className="label-text">{title}</span> 
    <input type="checkbox" value={name} checked={checked} className="checkbox checkbox-primary" />
  </label>
</div>
  );
}

export default Checkbox;
