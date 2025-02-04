import React from "react";
interface HeraderInterface {
  label: string;
  subheading: string;
}
const HeaderComponent = ({ label, subheading }: HeraderInterface) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{label}</h2>
      <h3 className="text-l text-gray-custom mb-2">{subheading}</h3>
      <hr className="text-gray-custom mb-3" />
    </div>
  );
};

export default HeaderComponent;
