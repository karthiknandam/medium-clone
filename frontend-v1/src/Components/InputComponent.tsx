import { ChangeEvent } from "react";
interface InputComponent {
  label: string;
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const InputComponent = ({ label, onchange }: InputComponent) => {
  return (
    <div>
      <div className="text-md mb-2 text-gray-label-input">{label}</div>
      <input
        onChange={onchange}
        className="px-2 py-3 text-md text-gray-custom rounded-md border-gray-custom border-1 focus:ouline  focus:outline-gray-400 focus:border-gray-400 w-full"
        type="text"
      />
    </div>
  );
};

export default InputComponent;
